import { IModelJsExpressServer } from "@bentley/express-server";
import { BentleyCloudRpcManager } from "@bentley/imodeljs-common";
import { Logger } from "@bentley/bentleyjs-core";
import { IModelHost, SnapshotDb } from "@bentley/imodeljs-backend";
import { Presentation } from "@bentley/presentation-backend";

import { getSupportedRpcs } from "../common/rpcs";

const webMain = async () => {
    try {
        await IModelHost.startup();

        Presentation.initialize();
        const rpcs = getSupportedRpcs();

        const rpcConfig = BentleyCloudRpcManager.initializeImpl(
            { info: { title: "DigitalTwin-beta", version: "v0.1" } },
            rpcs
        );
        const port = Number(process.env.PORT || 3001);
        const server = new IModelJsExpressServer(rpcConfig.protocol);

        let _server = await server.initialize(port);

        Logger.logInfo("DigitalTwin BE", `RPC backend for DigitalTwin-beta listening on port ${port}`);
        console.log(`RPC backend for ninezone-sample-app listening on port ${port}`);
    } catch (error) {
        console.log("DigitalTwin BE", error);
        // Logger.logError("DigitalTwin BE", error);
        process.exitCode = 1;
    }
};

webMain();
