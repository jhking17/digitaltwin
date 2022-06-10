"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_server_1 = require("@bentley/express-server");
const imodeljs_common_1 = require("@bentley/imodeljs-common");
const bentleyjs_core_1 = require("@bentley/bentleyjs-core");
const imodeljs_backend_1 = require("@bentley/imodeljs-backend");
const presentation_backend_1 = require("@bentley/presentation-backend");
const rpcs_1 = require("../common/rpcs");
const webMain = async () => {
    try {
        await imodeljs_backend_1.IModelHost.startup();
        presentation_backend_1.Presentation.initialize();
        const rpcs = rpcs_1.getSupportedRpcs();
        const rpcConfig = imodeljs_common_1.BentleyCloudRpcManager.initializeImpl({ info: { title: "Moornmo-beta", version: "v0.1" } }, rpcs);
        const port = Number(process.env.PORT || 3001);
        const server = new express_server_1.IModelJsExpressServer(rpcConfig.protocol);
        let _server = await server.initialize(port);
        bentleyjs_core_1.Logger.logInfo("moornmo BE", `RPC backend for Moornmo-beta listening on port ${port}`);
        console.log(`RPC backend for ninezone-sample-app listening on port ${port}`);
    }
    catch (error) {
        console.log("moornmo BE", error);
        // Logger.logError("moornmo BE", error);
        process.exitCode = 1;
    }
};
webMain();
//# sourceMappingURL=webmain.js.map