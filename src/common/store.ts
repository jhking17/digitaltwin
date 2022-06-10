import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { data } from "./reducer";

const rootReducer = combineReducers({
    data,
});

export type reducerState = ReturnType<typeof rootReducer>;
const persistConfig = {
    key: "digital-twin",
    storage,
    whitelist: ["user"],
};
function configureStore() {
    const store = createStore(
        persistReducer(persistConfig, rootReducer),
        applyMiddleware(thunkMiddleware)
    );
    return store;
}
export const store = configureStore();
