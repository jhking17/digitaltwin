import { ClientRequestContext, Config, isElectronRenderer } from "@bentley/bentleyjs-core";
import {
    BrowserAuthorizationCallbackHandler,
    BrowserAuthorizationClient,
    BrowserAuthorizationClientConfiguration,
    FrontendAuthorizationClient,
} from "@bentley/frontend-authorization-client";
import {
    BentleyCloudRpcParams,
    DesktopAuthorizationClientConfiguration,
} from "@bentley/imodeljs-common";
import {
    DesktopAuthorizationClient,
    FrontendRequestContext,
    IModelApp,
    IModelAppOptions,
} from "@bentley/imodeljs-frontend";
import { UrlDiscoveryClient } from "@bentley/itwin-client";
import {
    AppNotificationManager,
    FrameworkReducer,
    FrameworkRootState,
    StateManager,
} from "@bentley/ui-framework";
import { initRpc } from "../api/rpc";
import { Store } from "redux";
import React, { useState } from "react";

export type RootState = FrameworkRootState;

export enum UseBackend {
    /** Use local ninezone-sample-app backend */
    Local = 0,

    /** Use deployed general-purpose backend */
    GeneralPurpose = 1,
}

// subclass of IModelApp needed to use imodeljs-frontend
export class MainApp {
    private static _appStateManager: StateManager | undefined;

    public static get store(): Store<RootState> {
        return StateManager.store as Store<RootState>;
    }

    public static get oidcClient(): FrontendAuthorizationClient {
        return IModelApp.authorizationClient as FrontendAuthorizationClient;
    }

    public static async startup(): Promise<void> {
        // use new state manager that allows dynamic additions from extensions and snippets
        if (!this._appStateManager) {
            this._appStateManager = new StateManager({
                frameworkState: FrameworkReducer,
            });
        }

        // Use the AppNotificationManager subclass from ui-framework to get prompts and messages
        const opts: IModelAppOptions = {};
        opts.notifications = new AppNotificationManager();
        opts.applicationVersion = "1.0.0";

        await IModelApp.startup(opts);

        // initialize OIDC
        // await MainApp.initializeOidc();

        // initialize RPC communication
        await MainApp.initializeRpc();

        // initialize localization for the app
        await IModelApp.i18n.registerNamespace("NineZoneSample").readFinished;
    }

    private static async initializeRpc(): Promise<void> {
        const rpcParams = await this.getConnectionInfo();
        initRpc(rpcParams, process.env.REACT_APP_DOMAIN);
    }

    private static async initializeOidc() {
        const scope =
            "openid email profile organization imodelhub context-registry-service:read-only product-settings-service general-purpose-imodeljs-backend imodeljs-router urlps-third-party" ||
            Config.App.getString("imjs_browser_test_scope");

        if (isElectronRenderer) {
            //"imodeljs-spa-samples-2686";
            const clientId = "spa-yAgdYSgjEtenQ8h3hlZCfsGOt";
            // Config.App.getString("imjs_electron_test_client_id");
            const redirectUri = Config.App.getString("imjs_electron_test_redirect_uri");
            const oidcConfiguration: DesktopAuthorizationClientConfiguration = {
                clientId,
                redirectUri,
                scope: `${scope} offline_access`,
            };
            const desktopClient = new DesktopAuthorizationClient(oidcConfiguration);
            await desktopClient.initialize(new ClientRequestContext());
            IModelApp.authorizationClient = desktopClient;
        } else {
            const clientId = "spa-yAgdYSgjEtenQ8h3hlZCfsGOt"; //"imodeljs-spa-samples-2686";
            // Config.App.getString("imjs_browser_test_client_id");
            const redirectUri = "http://localhost:3000/signin-callback.html";
            // Config.App.getString("imjs_browser_test_redirect_uri");
            const postSignoutRedirectUri = "http://localhost:3000/";
            // Config.App.get("imjs_browser_test_post_signout_redirect_uri");
            const oidcConfiguration: BrowserAuthorizationClientConfiguration = {
                clientId,
                redirectUri,
                postSignoutRedirectUri,
                scope: `${scope} imodeljs-router`,
                responseType: "code",
            };
            await BrowserAuthorizationCallbackHandler.handleSigninCallback(
                oidcConfiguration.redirectUri
            );
            IModelApp.authorizationClient = new BrowserAuthorizationClient(oidcConfiguration);
            try {
                await (MainApp.oidcClient as BrowserAuthorizationClient).signInSilent(
                    new ClientRequestContext()
                );
            } catch (err) {}
        }
    }

    private static async getConnectionInfo(): Promise<BentleyCloudRpcParams | undefined> {
        const usedBackend = Config.App.getNumber("imjs_backend", UseBackend.Local);

        // local BE !
        // if (usedBackend === UseBackend.GeneralPurpose) {
        //   const urlClient = new UrlDiscoveryClient();
        //   const requestContext = new FrontendRequestContext();
        //   const orchestratorUrl = await urlClient.discoverUrl(requestContext, "iModelJsOrchestrator.K8S", undefined);
        //   return { info: { title: "general-purpose-imodeljs-backend", version: "v2.0" }, uriPrefix: orchestratorUrl };
        // }

        // if (usedBackend === UseBackend.Local)
        return undefined;

        throw new Error(`Invalid backend "${usedBackend}" specified in configuration`);
    }
}
