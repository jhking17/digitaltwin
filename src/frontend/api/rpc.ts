import { BentleyCloudRpcManager, BentleyCloudRpcParams, ElectronRpcConfiguration, ElectronRpcManager, RpcConfiguration } from "@bentley/imodeljs-common";
import { getSupportedRpcs } from "../../common/rpcs";

/**
 * Initializes RPC communication based on the platform
 */
export function initRpc(rpcParams?: BentleyCloudRpcParams, uriPrefix ?: string): RpcConfiguration {
  let config: RpcConfiguration;
  const rpcInterfaces = getSupportedRpcs();
  if (ElectronRpcConfiguration.isElectron) {
    // initializes RPC for Electron
    config = ElectronRpcManager.initializeClient({}, rpcInterfaces);
  } else {
    // initialize RPC for web apps
    if (!rpcParams)
      rpcParams = { info: { title: "ninezone-sample-app", version: "v1.0" }, uriPrefix: uriPrefix ? uriPrefix : "http://localhost:3001" };
    config = BentleyCloudRpcManager.initializeClient(rpcParams, rpcInterfaces);
  }
  return config;
}
