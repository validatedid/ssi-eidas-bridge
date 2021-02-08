import { startService } from "./api/app";
import { BRIDGE_SERVICE, ENVIRONMENT } from "./config";

const startAll = async (): Promise<void> => {
  await startService(
    BRIDGE_SERVICE.NAME.EIDAS,
    BRIDGE_SERVICE.PORT.EIDAS,
    ENVIRONMENT === "local"
      ? BRIDGE_SERVICE.SWAGGER_INTERNAL_URL.EIDAS
      : BRIDGE_SERVICE.SWAGGER_EXTERNAL_URL.EIDAS
  );
};

startAll().then(
  () => {},
  () => {}
);

export default startAll;
