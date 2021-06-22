# Test Suite

This Test Suite uses the examples from this repo and some configuration settings to prove interoperability between HTTP APIs for signature and verification of credentials using QEC.

## Getting Started

To run the tests, clone this repo and then:

```
$ npm i
$ npm run test
```

## Cases for eIDAS test suite

### Import Certificate

#### Import succeeds

- should return `201` on first successful certificate import and return and id with the did passed
- should return `200` on successful update certificate and return and id with the did passed

#### Import fails

- should return `400` when no id is passed (as path)
- should return `400` when did is not passed (in the body)
- should return `400` when a not valid did is passed (in the body)
- should return `400` when eidasQec is not passed

### eSeal creation

#### Signature succeeds

- should return `201` when eSealing a Credential payload with proof.type CAdESRSASignature2020, proof.created with a valid date (from current time, not in the future), proof.proofPurpose `assertionMethod`, proof.verificationMethod exists and proof.cades exists
- should return `201` when eSealing a Verifiable Credential (with a proof) returning an array of proofs, with the eSeal proof.type `CAdESRSASignature2020`, proof.created with a valid date (from current time, not in the future), proof.proofPurpose `assertionMethod`, proof.verificationMethod exists and proof.cades exists

#### Signature fails

- should return `400` when passed an invalid issuer did.
- should return `400` when passed password that does not match the stored certificate.
- should return `400` when no issuer is passed.
- should return `400` when no payload is passed.
- should return `400` when no password is passed.
- should return `400` when payload is not a valid credential: a JSON-ld structure with at least `@context` and `type`, and it is canonizable.

### eSeal verification

#### Verification succeeds

Should return `200`:

```json
{
  "indication": "TOTAL-PASSED",
  "checks": ["credential", "proof"],
  "warnings": [],
  "errors": []
}
```

- when verifying a valid Verifiable Credential eSealed (with just one proof)
- when verifying a valid Verifiable Credential eSealed (with more than one proof)

#### Verification fails

Should return `200`:

```json
{
  "indication": "TOTAL_FAILED",
  "checks": ["credential", "proof"],
  "warnings": [],
  "errors": ["error detail description"]
}
```

- The Verifier's Verify Credential HTTP API MUST fail to verify a Verifiable Credential with a mutated signature value (ex. a mutated jws) in the proof.
- The Verifier's Verify Credential HTTP API MUST fail to verify a Verifiable Credential with the "created" property removed from the proof.
- The Verifier's Verify Credential HTTP API MUST fail to verify a Verifiable Credential with a mutated "proofPurpose" in the proof.
- The Verifier's Verify Credential HTTP API MUST fail to verify a Verifiable Credential with an added property to the credential.
- The Verifier's Verify Credential HTTP API MUST fail to verify a Verifiable Credential with a removed property from the credential.
- The Verifier's Verify Credential HTTP API MUST fail to verify a Verifiable Credential with a mutated property to the credential.
- The Verifier's Verify Credential HTTP API MUST fail to verify a Verifiable Credential with an added property to the proof.
- The Verifier's Verify Credential HTTP API MUST fail to verify a Verifiable Credential a removed property to the proof.
- The Verifier's Verify Credential HTTP API MUST fail to verify a Verifiable Credential with a mutated property to the proof.
- The Verifier's Verify Credential HTTP API MUST verify a Verifiable Credential with at least 2 different DID methods set as the issuer property for a credential.
- The Verifier's Verify Credential HTTP API MUST adhere to the proof verification format.
- The Verifier's Verify Credential HTTP API MUST support the verification of, JSON-LD Proof, Ed25519Signature2018.
- when passed a Verifiable Credential with no eSeal Proof type CAdESRSASignature2020
- when passed a eSeal Proof contains a date different from CADES SigningTime (there should be a margin time between both dates).

Should return `400`:

- The Verifier's Verify Credential HTTP API MUST return a 400 HTTP response status code when the request is rejected.

#### Verification indeterminate

Should return `200`:

```json
{
  "indication": "INDETERMINATE",
  "checks": ["credential", "proof"],
  "warnings": [],
  "errors": ["error detail description"]
}
```

- with an error message of `"The certificate chain for signature is not trusted, it does not contain a trust anchor."` when using a non-QEC for creating the eSeal.

## Cross-signature and verification

### DSS Verification

![Verification flow](https://dss-demo.nowina.lu/doc/images/sig_validation_process.jpg)

From DSS documentation available [here](https://dss-demo.nowina.lu/doc/dss-documentation.html#_validation_process)

Generally and following ETSI standard, the validation process of an electronic signature must provide one of these three following statuses: TOTAL-FAILED, TOTAL-PASSED or INDETERMINATE.

- A \*_TOTAL-PASSED_- response indicates that the signature has passed verification and it complies with the signature validation policy.
- A \*_TOTAL_FAILED_- response indicates that either the signature format is incorrect or that the digital signature value fails the verification.
- An \*_INDETERMINATE_- validation response indicates that the format and digital signature verifications have not failed but there is an insufficient information to determine if the electronic signature is valid.

For each of the validation checks, the validation process must provide information justifying the reasons for the resulting status indication as a result of the check against the applicable constraints. In addition, the ETSI standard defines a consistent and accurate way for justifying statuses under a set of sub-indications.

For example the Basic Building Blocks are divided into seven elements:

- FC - Format Checking
- ISC - Identification of the Signing Certificate
- VCI - Validation Context Initialization
- RFC - Revocation Freshness Checker
- XCV - X.509 certificate validation
- CV - Cryptographic Verification
- SAV - Signature Acceptance Validation

The following additional elements also can be executed in case of validation in the past :

- PCV - Past Certificate Validation
- VTS - Validation Time Sliding process
- POE extraction - Proof Of Existence extraction
- PSV - Past Signature Validation

Past certificate/signature validation is used when basic validation of a certificate/signature fails at the current time with an INDETERMINATE status such that the provided proofs of existence may help to go to a determined status. The process shall initialize the best-signature-time either to a time indication for a related POE provided, or the current time when this parameter has not been used by the algorithm.

Best-signature-time is an internal variable for the algorithm denoting the earliest time when it can be trusted by the SVA (either because proven by some POE present in the signature or passed by the DA and for this reason assumed to be trusted) that a signature has existed. [R09]

Each block contains a number of rules that are executed sequentially. The rules are driven by the constraints defined in the validation policy. The result of each rule is OK or NOT OK. The process is stopped when the first rule fails. Each block also contains a conclusion. If all rules are met then the conclusion node indicates PASSED. Otherwise FAILED or INDETERMINATE indication is returned depending on the ETSI standard definition.

### Validation Results from DSS

The result of the validation process consists of these elements:

- the Simple Report,
- the Detailed Report,
- the Diagnostic Data and
- the ETSI Validation Report.

> _Note: We are going to focus only on the information provided in the `Simple Report`._

#### Simple Report Output

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<SimpleReport ValidationTime="2020-12-14T11:03:21" xmlns="http://dss.esig.europa.eu/validation/simple-report">
    <ValidationPolicy>
        <PolicyName>QES AdESQC TL based</PolicyName>
        <PolicyDescription>Validate electronic signatures and indicates whether they are Advanced electronic Signatures (AdES), AdES supported by a Qualified Certificate (AdES/QC) or a
                Qualified electronic Signature (QES). All certificates and their related chains supporting the signatures are validated against the EU Member State Trusted Lists (this includes
                signer's certificate and certificates used to validate certificate validity status services - CRLs, OCSP, and time-stamps).
        </PolicyDescription>
    </ValidationPolicy>
    <DocumentName>EmptyPage-signed-pades-baseline-b.pdf</DocumentName>
    <ValidSignaturesCount>1</ValidSignaturesCount>
    <SignaturesCount>1</SignaturesCount>
    <Signature SignatureFormat="PAdES-BASELINE-B" ExtensionPeriodMin="2020-12-14T11:04:21" ExtensionPeriodMax="2027-01-21T23:59:59" Id="S-08113A9BAB65F6271F837FF4992635CC725B49D27B1AED0D714EAD428BE98C6E">
        <CertificateChain>
            <Certificate>
                <id>C-4FAB29027727E58E4518ED0B6AE554D055F05B3D9197E0D16B20028D227D1A9F</id>
                <qualifiedName>Pierrick Vandenbroucke (Signature)</qualifiedName>
            </Certificate>
            <Certificate>
                <id>C-293D0BA3A31E5D82A8E3FAE12709932FFDDA44423E0F733FB01EF123E73EB4DA</id>
                <qualifiedName>Citizen CA</qualifiedName>
            </Certificate>
            <Certificate>
                <id>C-702DD5C1A093CF0A9D71FADD9BF9A7C5857D89FB73B716E867228B3C2BEB968F</id>
                <qualifiedName>Belgium Root CA4</qualifiedName>
            </Certificate>
        </CertificateChain>
        <Indication>TOTAL_PASSED</Indication>
        <Warnings>The organization name is missing in the trusted certificate!</Warnings>
        <SigningTime>2019-08-27T14:06:11</SigningTime>
        <BestSignatureTime>2020-12-14T11:03:21</BestSignatureTime>
        <SignedBy>Pierrick Vandenbroucke (Signature)</SignedBy>
        <SignatureLevel description="Qualified Electronic Signature">QESig</SignatureLevel>
        <SignatureScope name="Full PDF" scope="FULL">Full document</SignatureScope>
    </Signature>
</SimpleReport>
```
