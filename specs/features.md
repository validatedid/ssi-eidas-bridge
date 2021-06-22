# SEB desired features

## Authentication

- Provide DID authentication at API level:
  - sessions endpoint that creates auth tokens
  - all endpoints accept and validate auth tokens

## Signature API

- Accepts VC payloads in JSON-LD
- Checks JSON-LD structure before signature
- Signs VC with EC secp256k1 keys
- Signs VC with QEC and RSA
- Returns VC with array of proofs
- Signs in CAdES-BES
- Signs in CAdES-EPES
- Signs in CAdES-T
- Signs in CAdES-XL
- Allows to select which certificate to use to sign
- Signs in JAdES

## Validation API

- Accepts full VC with array of proofs
- Accepts EC signatures
- Accepts RSA signatures
- Returns Issuer's CN
- Validates CAdES-BES
- Validates CAdES-EPES
- Validates CAdES-T
- Validates CAdES-XL
- Validated JAdES

## Config

- Loads and stores EC keypair linked to client DID
- Loads and stores PKCS#12 certificates linked to client DID
- Accepts multiple keys/pkcs12 per DID
- Store PKCS12 in Azure Vault HSM
- Connect with .... QTSP
