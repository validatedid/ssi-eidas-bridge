# Status of Validated ID SEB implementation API features

## Authentication

- [ ] sessions endpoint that creates auth tokens
- [ ] all endpoints accept and validate auth tokens

## Signature API

- [x] Accepts VC payloads in JSON-LD
- [ ] Checks JSON-LD structure before signature
- [x] Signs VC with EC secp256k1 keys
- [ ] Signs VC with QEC and RSA
- [x] Returns VC with array of proofs
- [ ] Signs in CAdES-BES
- [ ] Signs in CAdES-EPES
- [ ] Signs in CAdES-T
- [ ] Signs in CAdES-XL
- [ ] Allows to select which certificate to use to sign

## Validation API

- [x] Accepts full VC with array of proofs
- [x] Accepts EC signatures
- [ ] Accepts RSA signatures
- [ ] Returns Issuer's CN
- [ ] Validates CAdES-BES
- [ ] Validates CAdES-EPES
- [ ] Validates CAdES-T
- [ ] Validates CAdES-XL

## Config

- [x] Loads and stores EC keypair linked to client DID
- [ ] Loads and stores PKCS#12 certificates linked to client DID
- [ ] Accepts multiple keys/pkcs12 per DID
- [ ] Store PKCS12 in Azure Vault HSM
- [ ] Connect with .... QTSP
