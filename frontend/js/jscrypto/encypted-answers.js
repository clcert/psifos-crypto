import { ElGamal } from "./elgamal.js";
import { BigInt } from "./bigint.js";
import { Random } from "./random.js";
import { UTILS } from "./helios.js";

class EncryptedAnswerFactory {
  /**
   *  Factory for EncryptedAnswer
   *
   */

  create(type, question, answer, pk, progress) {
    if (type === "open_question") {
      return new EncryptedOpenAnswer(question, answer, pk, progress);
    } else if (type === "closed_question") {
      return new EncryptedCloseAnswer(question, answer, pk, progress);
    } else if (type === "mixnet_question") {
      return new EncryptedMixnetAnswer(question, answer, pk, progress);
    }
  }
}

EncryptedAnswerFactory.fromJSONObject = function (data, election) {
  let encrypted_answer = data.encrypted_answer;
  var ea = new EncryptedAnswerFactory().create(data.q_type);
  ea.choices = _(encrypted_answer.choices).map(function (choice) {
    return ElGamal.Ciphertext.fromJSONObject(choice, election.public_key);
  });

  ea.individual_proofs = _(encrypted_answer.individual_proofs).map(function (
    p
  ) {
    return ElGamal.DisjunctiveProof.fromJSONObject(p);
  });

  ea.overall_proof = ElGamal.DisjunctiveProof.fromJSONObject(
    encrypted_answer.overall_proof
  );

  // possibly load randomness and plaintext
  if (encrypted_answer.randomness) {
    ea.randomness = _(encrypted_answer.randomness).map(function (r) {
      return BigInt.fromJSONObject(r);
    });
    ea.answer = encrypted_answer.answer;
  }
  return ea;
};

class EncryptedAnswer {
  constructor(question, answer, pk, progress, type) {
    // if nothing in the constructor
    if (question === undefined || answer === null) return;

    // store answer
    // CHANGE 2008-08-06: answer is now an *array* of answers, not just a single integer
    this.answer = answer;

    // do the encryption
    var enc_result = this.doEncryption(question, answer, pk, null, progress);

    this.choices = enc_result.choices;
    this.randomness = enc_result.randomness;
    this.individual_proofs = enc_result.individual_proofs;
    this.overall_proof = enc_result.overall_proof;
    this.enc_ans_type = type;
  }

  doEncryption(question, answer, pk, randomness, progress) {
    var choices = [];
    var individual_proofs = [];
    var overall_proof = null;

    // possible plaintexts [question.min .. , question.max]
    var plaintexts = null;
    if (question.max_answers != null) {
      plaintexts = UTILS.generate_plaintexts(
        pk,
        question.min_answers,
        question.max_answers
      );
    }

    var zero_one_plaintexts = UTILS.generate_plaintexts(pk, 0, 1);

    // keep track of whether we need to generate new randomness
    var generate_new_randomness = false;
    if (!randomness) {
      randomness = [];
      generate_new_randomness = true;
    }

    // keep track of number of options selected.
    var num_selected_answers = 0;
    // go through each possible answer and encrypt either a g^0 or a g^1.
    for (var i = 0; i < question.total_closed_options; i++) {
      var index, plaintext_index;
      // if this is the answer, swap them so m is encryption 1 (g)
      if (_.includes(answer, i)) {
        plaintext_index = 1;
        num_selected_answers += 1;
      } else {
        plaintext_index = 0;
      }

      // generate randomness?
      if (generate_new_randomness) {
        randomness[i] = Random.getRandomInteger(pk.q);
      }

      choices[i] = ElGamal.encrypt(
        pk,
        zero_one_plaintexts[plaintext_index],
        randomness[i]
      );

      // generate proof
      if (generate_new_randomness) {
        // generate proof that this ciphertext is a 0 or a 1

        individual_proofs[i] = choices[i].generateDisjunctiveProof(
          zero_one_plaintexts,
          plaintext_index,
          randomness[i],
          ElGamal.disjunctive_challenge_generator
        );
      }

      if (progress) progress.tick();
    }

    if (generate_new_randomness && question.max_answers != null) {
      // we also need proof that the whole thing sums up to the right number
      // only if max is non-null, otherwise it's full approval voting

      // compute the homomorphic sum of all the options
      var hom_sum = choices[0];
      var rand_sum = randomness[0];
      for (var i = 1; i < question.closed_options.length; i++) {
        hom_sum = hom_sum.multiply(choices[i]);
        rand_sum = rand_sum.add(randomness[i]).mod(pk.q);
      }

      // prove that the sum is 0 or 1 (can be "blank vote" for this answer)
      // num_selected_answers is 0 or 1, which is the index into the plaintext that is actually encoded
      //
      // now that "plaintexts" only contains the array of plaintexts that are possible starting with min
      // and going to max, the num_selected_answers needs to be reduced by min to be the proper index
      var overall_plaintext_index = num_selected_answers;
      if (question.min_answers) overall_plaintext_index -= question.min_answers;

      overall_proof = hom_sum.generateDisjunctiveProof(
        plaintexts,
        overall_plaintext_index,
        rand_sum,
        ElGamal.disjunctive_challenge_generator
      );

      if (progress) {
        for (var i = 0; i < question.max_answers; i++) progress.tick();
      }
    }
    return {
      choices: choices,
      randomness: randomness,
      individual_proofs: individual_proofs,
      overall_proof: overall_proof,
    };
  }

  clearPlaintexts() {
    this.answer = null;
    this.randomness = null;
  }

  // FIXME: should verifyEncryption really generate proofs? Overkill.
  verifyEncryption(question, pk) {
    var result = this.doEncryption(question, this.answer, pk, this.randomness);

    // check that we have the same number of ciphertexts
    if (result.choices.length != this.choices.length) {
      return false;
    }

    // check the ciphertexts
    for (var i = 0; i < result.choices.length; i++) {
      if (!result.choices[i].equals(this.choices[i])) {
        // alert ("oy: " + result.choices[i] + "/" + this.choices[i]);
        return false;
      }
    }

    // we made it, we're good
    return true;
  }

  toString() {
    // get each ciphertext as a JSON string
    var choices_strings = _(this.choices).map(function (c) {
      return c.toString();
    });
    return choices_strings.join("|");
  }

  toJSONObject(include_plaintext) {
    var return_obj = {
      enc_ans_type: this.enc_ans_type,
      choices: _(this.choices).map(function (choice) {
        return choice.toJSONObject();
      }),
      individual_proofs: _(this.individual_proofs).map(function (disj_proof) {
        return disj_proof.toJSONObject();
      }),
    };

    if (this.overall_proof != null) {
      return_obj.overall_proof = this.overall_proof.toJSONObject();
    } else {
      return_obj.overall_proof = null;
    }

    if (include_plaintext) {
      return_obj.answer = this.answer;
      return_obj.randomness = _(this.randomness).map(function (r) {
        return r.toJSONObject();
      });
    }

    return return_obj;
  }
}

class EncryptedOpenAnswer extends EncryptedAnswer {
  /**
   * class to encrypt an open question
   */
  constructor(question, answer, pk, progress, type) {
    super(question, answer, pk, progress, type);
    this.enc_ans_type = "encrypted_open_answer";
  }
}

class EncryptedCloseAnswer extends EncryptedAnswer {
  /**
   * class to encrypt an closed question
   */

  constructor(question, answer, pk, progress, type) {
    super(question, answer, pk, progress, type);
    this.enc_ans_type = "encrypted_closed_answer";
  }
}

class EncryptedMixnetAnswer extends EncryptedAnswer {
  /**
   * class to encrypt a mixnet question
   */

  constructor(question, answer, pk, progress, type) {
    super(question, answer, pk, progress, type);
    this.enc_ans_type = "encrypted_mixnet_answer";
  }

  doEncryption(question, answer, pk, randomness, progress) {
    var choices = [];

    // keep track of whether we need to generate new randomness
    var generate_new_randomness = false;
    if (!randomness) {
      randomness = [];
      generate_new_randomness = true;
    }

    // keep track of number of options selected.
    var num_selected_answers = 0;
    // go through each possible answer and encrypt either a g^0 or a g^1.
    for (var i = 0; i < answer.length; i++) {
      // generate randomness?
      if (generate_new_randomness) {
        randomness[i] = Random.getRandomInteger(pk.q);
      }

      choices[i] = ElGamal.encryptMixnet(pk, answer[i], randomness[i]);

      if (progress) progress.tick();
    }


    return {
      choices: choices,
      randomness: randomness,
    };
  }

  toJSONObject(include_plaintext) {
    var return_obj = {
      enc_ans_type: this.enc_ans_type,
      choices: _(this.choices).map(function (choice) {
        return choice.toJSONObject();
      }),
    };
    if (include_plaintext) {
      return_obj.answer = this.answer;
      return_obj.randomness = _(this.randomness).map(function (r) {
        return r.toJSONObject();
      });
    }

    return return_obj;
  }

  
}

export default EncryptedAnswerFactory;
