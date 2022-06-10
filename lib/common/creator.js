"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function async_dispatch(dispatch, type, func, ...args) {
    dispatch({ type: type + "_LOADING", args: args });
    let result = await func(...args);
    try {
        if (result.success) {
            return dispatch({ type, payload: result });
        }
        else if (result.payload) {
            return dispatch({ type, payload: result.payload });
        }
        else {
            return dispatch({ type: type + "_ERROR", payload: { msg: result.errorMessage } });
        }
    }
    catch (err) {
        return dispatch({ type, payload: { msg: "Error " + type } });
    }
}
function actions(msg, func) {
    return function (...args) {
        return async function (dispatch) {
            await async_dispatch(dispatch, msg, func, ...args);
        };
    };
}
exports.default = actions;
//# sourceMappingURL=creator.js.map