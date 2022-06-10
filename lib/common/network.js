"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const domain = process.env.REACT_APP_APISRV;
// process.env.NODE_ENV === "development"
//       "http://127.0.0.1:3002"
exports.isEmpty = (value) => {
    if (value != undefined && value != null) {
        return false;
    }
    else {
        return true;
    }
};
exports.FetchApiGet = async (url, params) => {
    try {
        const response = await axios_1.default({
            method: "GET",
            url: domain + url,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            params: Object.assign(Object.assign({}, params), { access_token: window.localStorage.getItem("access_token"), refresh_token: window.localStorage.getItem("refresh_token") }),
            withCredentials: true,
        });
        // console.log("RESPONSE", response.data);
        // console.log(response.resultCode);
        if (response.data.resultCode != 200) {
            throw response.data.errorMsg;
        }
        return response.data;
    }
    catch (error) {
        console.error(error);
        // alert("오류가 발생했습니다.");
        return { resultCode: 9999, errorMessage: error };
    }
};
exports.FetchApiPost = async (url, params) => {
    try {
        // Json Data를 URLSearchParams Data로 변환
        const urlSearchParams = new URLSearchParams();
        if (!exports.isEmpty(params)) {
            Object.keys(params).forEach(key => {
                if (!exports.isEmpty(params[key])) {
                    urlSearchParams.append(key, params[key]);
                }
            });
        }
        const access_token = window.localStorage.getItem("access_token");
        const refresh_token = window.localStorage.getItem("refresh_token");
        if (params == undefined)
            params = {};
        Object.assign(params, { access_token });
        Object.assign(params, { refresh_token });
        const response = await axios_1.default({
            method: "POST",
            url: domain + url,
            data: params,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true,
        });
        if (response.data.resultCode != 200) {
            throw response.data.errorMsg;
        }
        return response.data;
    }
    catch (error) {
        // console.log(error);
        console.error(error);
        // alert("오류가 발생했습니다.");
        return { resultCode: 9999, errorMessage: error };
    }
};
//# sourceMappingURL=network.js.map