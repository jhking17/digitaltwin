import * as React from "react";
import * as ReactDOM from "react-dom";

import { MainApp } from "./app/MainApp";
import { AppUi } from "./app-ui/AppUi";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "../common/store";
import { PersistGate } from "redux-persist/integration/react";

(async () => {
    await MainApp.startup();

    await AppUi.initialize();

    ReactDOM.render(
        <Provider store={store}>
            {/* <PersistGate loading={null} persistor={persistor}> */}

            <App />

            {/* </PersistGate> */}
        </Provider>,
        document.getElementById("root") 
    );
})();
