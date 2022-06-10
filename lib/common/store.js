"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const redux_thunk_1 = require("redux-thunk");
const redux_persist_1 = require("redux-persist");
const storage_1 = require("redux-persist/lib/storage");
const reducer_1 = require("./reducer");
const rootReducer = redux_1.combineReducers({
    data: reducer_1.data,
});
const persistConfig = {
    key: "digital-twin",
    storage: storage_1.default,
    whitelist: ["user"],
};
function configureStore() {
    const store = redux_1.createStore(redux_persist_1.persistReducer(persistConfig, rootReducer), redux_1.applyMiddleware(redux_thunk_1.default));
    return store;
}
exports.store = configureStore();
//# sourceMappingURL=store.js.map