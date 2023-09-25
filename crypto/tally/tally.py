"""
Tally module for Psifos.
"""

from .homomorphic.tally import HomomorphicTally
from .mixnet.tally import MixnetTally

from database.serialization import SerializableList
from crypto.elgamal import PublicKey


class TallyFactory:
    @staticmethod
    def create(**kwargs):
        tally_type = kwargs.get("tally_type")
        if tally_type == "homomorphic":
            return HomomorphicTally(**kwargs)
        elif tally_type == "mixnet":
            return MixnetTally(**kwargs)


class TallyManager(SerializableList):
    """
    A election's tally manager that allows each question to have
    it's specific tally.
    """

    def __init__(self, *args) -> None:
        """
        Constructor of the class, instantly computes the tally.
        """
        super(TallyManager, self).__init__()
        for tally_dict in args:
            self.instances.append(TallyFactory.create(**tally_dict))

    def compute(self, encrypted_votes, weights, election):
        public_key = election["public_key"]
        public_key = (
            PublicKey(y=public_key["y"], p=public_key["p"], g=public_key["g"], q=public_key["q"])
        )  # TODO: replace this when multiple pk gets added

        for q_num, tally in enumerate(self.instances):
            encrypted_answers = [
                enc_vote.answers.instances[q_num] for enc_vote in encrypted_votes
            ]
            tally.compute(
                public_key=public_key,
                encrypted_answers=encrypted_answers,
                weights=weights,
                election=election,
            )

    def decrypt(self, partial_decryptions, election):
        public_key = (
            election.get("public_key")
        )  # TODO: replace this when multiple pk gets added
        public_key = (
            PublicKey(y=public_key["y"], p=public_key["p"], g=public_key["g"], q=public_key["q"])
        )

        decrypted_tally = []
        for q_num, tally in enumerate(self.instances):
            decrypted_tally.append(
                tally.decrypt(
                    public_key=public_key,
                    decryption_factors=partial_decryptions[q_num],
                    t=election.get("total_trustees") // 2,
                    max_weight=election.get("max_weight"),
                )
            )

        # return ElectionResult(*decrypted_tally)

    def get_tallies(self):
        return self.instances
