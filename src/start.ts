import { startEbsiService } from "./api/app";
import { BRIDGE_SERVICE, ENVIRONMENT } from "./config";

const startAll = async (): Promise<void> => {
  await startEbsiService(
    BRIDGE_SERVICE.NAME.EIDAS,
    BRIDGE_SERVICE.PORT.EIDAS,
    ENVIRONMENT === "local" || ENVIRONMENT === "test"
      ? BRIDGE_SERVICE.SWAGGER_INTERNAL_URL.EIDAS
      : BRIDGE_SERVICE.SWAGGER_EXTERNAL_URL.EIDAS
  );
};

startAll();

export default startAll;
