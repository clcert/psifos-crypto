"""
SharedPoint classes for Psifos.

14-04-2022
"""


class Signature:
    def __init__(self, challenge, response) -> None:
        self.challenge: int = int(challenge)
        self.response: int = int(response)


class Certificate:
    def __init__(self, signature_key, encryption_key, signature) -> None:
        self.signature_key: int = int(signature_key)
        self.encryption_key: int = int(encryption_key)
        self.signature: Signature = Signature(**signature)


class Coefficient:
    def __init__(self, coefficient, signature) -> None:
        self.coefficient: int = int(coefficient)
        self.signature: Signature = Signature(**signature)


class Point:
    def __init__(self, alpha, beta, signature) -> None:
        self.alpha: int = int(alpha)
        self.beta: int = beta
        self.signature: Signature = Signature(**signature)


class ListOfCoefficients:
    def __init__(self, *args) -> None:
        super(ListOfCoefficients, self).__init__()
        for coeff_dict in args:
            self.instances.append(Coefficient(**coeff_dict))


class ListOfSignatures:
    def __init__(self, *args) -> None:
        super(ListOfSignatures, self).__init__()
        for sign_dict in args:
            self.instances.append(Signature(**sign_dict))
