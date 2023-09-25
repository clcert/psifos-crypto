from crypto.tally.tally import TallyManager
from data import encrypted_votes, questions, election, weights, decryptions

import json
import sys


def compute_tally():
    # First we instantiate the TallyManager class.
    tally_params = [
        {
            "tally_type": q_dict["tally_type"],
            "computed": False,
            "num_tallied": 0,
            "q_num": q_num,
            "num_options": q_dict["total_closed_options"],
        }
        for q_num, q_dict in enumerate(questions)
    ]
    enc_tally = TallyManager(*tally_params)

    # Then we compute the encrypted_tally
    enc_tally.compute(
        encrypted_votes=encrypted_votes, weights=weights, election=election
    )
    return enc_tally


def get_decryption_factors(decryption):
    if decryption.get("tally_type") == "mixnet":
        return [
            dec_factors.instances
            for dec_factors in decryption.get("decryption_factors")
        ]

    return decryption.get("decryption_factors")


def combine_decryptions():
    """
    combine all of the decryption results
    """

    total_questions = 1
    encrypted_tally = compute_tally()
    partial_decryptions = [
        [
            (index + 1, get_decryption_factors(t[q_num]))
            for index, t in enumerate(decryptions)
        ]
        for q_num in range(total_questions)
    ]
    return {
        "result": encrypted_tally.decrypt(
            partial_decryptions=partial_decryptions, election=election
        ),
    }


def write_file(name_file: str, data: dict):
    with open(f"{name_file}.json", "w") as archivo:
        json.dump(data, archivo)


if __name__ == "__main__":
    args = sys.argv

    if args[1] == "tally":
        tally = compute_tally()
        result = TallyManager.serialize(tally)
        write_file("tally", json.loads(result))
        print(result)

    elif args[1] == "decrypt":
        result = combine_decryptions()
        write_file("results", result)
        print(result)
