# Definitions and abbreviations

These definitions and abbreviations are based on ETSI TR 119 001 and ETSI EN
319 102-1.

## General definitions

| Name       | Definition                                                                                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| sigCert    | signing certificate. The certificate corresponding to the private key that was used to produce a digital signature.1                                                    |
| QC         | qualified certificate.                                                                                                                                                  |
| WSA        | web site authentication (type of certificate).                                                                                                                          |
| Type of QC | type of a qualified certificate. Three types are currently defined by the eIDAS Regulation: for electronic signature, for electronic seal, for web site authentication. |
| TL         | trusted list.                                                                                                                                                           |
| TSP        | trust service provider.                                                                                                                                                 |
| LOTL       | list of the trusted lists                                                                                                                                               | .   |

## Definitions and abbreviations regarding signature levels

| Signature level | Definition                                                                                                                                                                                                                                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AdES            | digital signature that is either a CAdES signature, or a PAdES signature or a XAdES signature. A digital signature is defined as data appended to, or a cryptographic transformation of a data unit that allows a recipient of the data unit to prove the source and integrity of the data unit and protect against forgery e.g. by the recipient |
| AdESig          | AdES supported by a non-qualified certificate for electronic signatures.                                                                                                                                                                                                                                                                          |
| AdESeal         | AdES supported by a non-qualified certificate for electronic seals.                                                                                                                                                                                                                                                                               |
| AdESig-QC       | AdES supported by a qualified certificate for electronic signatures.                                                                                                                                                                                                                                                                              |
| AdESeal-QC      | AdES supported by a qualified certificate for electronic seals.                                                                                                                                                                                                                                                                                   |
| AdES(?)         | AdES supported by a non-qualified certificate for which the type could not be determined. That is, the algorithm could not determine whether it is a certificate for electronic signatures, for electronic seals, or even for web site authentication.                                                                                            |
| QES             | AdES supported by a qualified certificate, with the corresponding private key protected by a QSCD.                                                                                                                                                                                                                                                |
| QESig           | QES where the certificate is for electronic signatures.                                                                                                                                                                                                                                                                                           |
| QESeal          | QES where the certificate is for electronic seals.                                                                                                                                                                                                                                                                                                |
