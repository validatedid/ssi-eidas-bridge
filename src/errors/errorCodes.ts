export enum ApiErrorMessages {
  COMPONENT_WALLET_KEY_NOT_PROVIDED = "Component wallet needs a hex encoded private key to initialize",
  ENCLAVE_DID_NULL = "Enclave DID is null",
  ERROR_ON_COMPONENT_WALLET_INIT = "Component Wallet Init must have a EncryptedKeyStore",
  ERROR_VERIFYING_SIGNATURE = "Error on verifying signature",
  NO_BRIDGE_SERVICE_AVAILABLE = "The current EBSI SERVICE specified is not available",
  WALLET_NOT_FOUND = "Wallet not found",
  ERROR_SIGNATURE_CREATION = "Error on creating the JWS Signature",
  WALLET_OPTIONS_NOT_PROVIDED = "Wallet options parameters are not provided",
  BAD_CREDENTIAL_PARAMETERS = "Credential parameters are not valid.",
  SIGNATURE_BAD_PARAMS = "Signature body requires issuer, payload and type.",
  SIGNATURE_BAD_TYPE = "Signature type  not supported.",
  NO_AUDIENCE = "No audience provided",
  INVALID_AUDIENCE = "Invalid audience. Should be a string",
  BAD_INPUT_EIDAS_KEYS_PARAMS = "Eidas keys call requires an EidasKeysOptions filled with the correct attributes",
  INVALID_HASH_ALG = "Hash algorithm not supported. Only supported algorithms are SHA1, SHA256 and SHA512.",
  NO_PEM_CADES = "PEM CADES Signature not provided.",
  ERROR_RETRIEVING_REDIS_DATA = "Error retrieving data from Redis",
  ERROR_ENTERPRISE_WALLET_CONSTRUCTOR = "Error on EnterpriseWallet constructor",
  KEY_TYPE_NOT_SUPPORTED = "Provided key type is not supported. Only RSA is supported",
}

export default { ApiErrorMessages };
