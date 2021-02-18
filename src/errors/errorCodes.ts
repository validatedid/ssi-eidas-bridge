export enum ApiErrorMessages {
  COMPONENT_WALLET_KEY_NOT_PROVIDED = "Component wallet needs a hex encoded private key to initialize",
  ENCLAVE_DID_NULL = "Enclave DID is null",
  ERROR_ON_COMPONENT_WALLET_INIT = "Component Wallet Init must have a EncryptedKeyStore",
  ERROR_VERIFYING_SIGNATURE = "Error on verifying signature",
  NO_BRIDGE_SERVICE_AVAILABLE = "The current EBSI SERVICE specified is not available",
  WALLET_NOT_FOUND = "Wallet not found",
  ERROR_SIGNATURE_CREATION = "Error on creating the JWS Signature",
  WALLET_OPTIONS_NOT_PROVIDED = "Wallet options parameters are not provided",
  BAD_REQUEST_MISSING_BODY = "Bad request missing body",
  BAD_CREDENTIAL_PARAMETERS = "Credential parameters are not valid.",
  BAD_VERIFIABLE_CREDENTIAL = "Object is not a valid Verification Credential.",
  SIGNATURE_BAD_PARAMS = "Signature body requires issuer, payload and password.",
  SIGNATURE_BAD_TYPE = "Signature type  not supported.",
  NO_AUDIENCE = "No audience provided",
  INVALID_AUDIENCE = "Invalid audience. Should be a string",
  BAD_INPUT_EIDAS_KEYS_PARAMS = "Eidas keys call requires an EidasKeysData filled with the correct attributes",
  MISSING_PUT_ID_PARAMS = "Missing store key id parameter",
  INVALID_HASH_ALG = "Hash algorithm not supported. Only supported algorithms are SHA1, SHA256 and SHA512.",
  NO_PEM_CADES = "PEM CADES Signature not provided.",
  ERROR_RETRIEVING_REDIS_DATA = "Error retrieving data from Redis",
  KEY_TYPE_NOT_SUPPORTED = "Provided key type is not supported. Only RSA is supported",
  DATA_NOT_LOADED = "Certificate, private and key types are not loaded",
  KEY_CURVE_NOT_SET = "Key Curve is not set",
  WALLET_BUILDER_BAD_PARAMS = "Wallet creation requires a DID and a password.",
  ERROR_PARSING_P12_DATA = "Error parsing P12 data",
  CANONIZE_BAD_PARAMS = "Data to canonize is not a Credential",
  SIGN_EIDAS_BAD_PARAMETERS = "Sign Eidas requires a SignPayload with issuer, payload, type and password",
  NO_EIDAS_PROOF = "Verification Credential does not contain an Eidas Proof",
  CREDENTIAL_PAYLOAD_MISMATCH_SIGNED_DATA = "Verification Credential payload does not match signed data",
  INDETERMINATE = "The certificate chain for signature is not trusted, it does not contain a trust anchor.",
}

export default { ApiErrorMessages };
