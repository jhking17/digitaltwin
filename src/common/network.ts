import axios from "axios";
const domain = process.env.REACT_APP_APISRV;
// process.env.NODE_ENV === "development"
//     ? // ? 'http://mms.soonsoft.co.kr'
//       "http://127.0.0.1:3002"
//     : "http://tep.moornmo.com";

export const isEmpty = (value: any) => {
    if (value != undefined && value != null) {
        return false;
    } else {
        return true;
    }
};
export const FetchApiGet = async (url: any, params?: any) => {
    try {
        const response = await axios({
            method: "GET",
            url: domain + url,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            params: {
                ...params,
                access_token: window.localStorage.getItem("access_token"),
                refresh_token: window.localStorage.getItem("refresh_token"),
            },
            withCredentials: true,
        });
        // console.log("RESPONSE", response.data);

        // console.log(response.resultCode);

        if (response.data.resultCode != 200) {
            throw response.data.errorMsg;
        }

        return response.data;
    } catch (error) {
        console.error(error);
        // alert("오류가 발생했습니다.");
        return { resultCode: 9999, errorMessage: error };
    }
};
export const FetchApiPost = async (url: any, params?: any) => {
    try {
        // Json Data를 URLSearchParams Data로 변환

        const urlSearchParams = new URLSearchParams();
        if (!isEmpty(params)) {
            Object.keys(params).forEach(key => {
                if (!isEmpty(params[key])) {
                    urlSearchParams.append(key, params[key]);
                }
            });
        }

        const access_token = window.localStorage.getItem("access_token");
        const refresh_token = window.localStorage.getItem("refresh_token");
        if (params == undefined) params = {};
        Object.assign(params, { access_token });
        Object.assign(params, { refresh_token });

        const response = await axios({
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
    } catch (error) {
        // console.log(error);
        console.error(error);
        // alert("오류가 발생했습니다.");
        return { resultCode: 9999, errorMessage: error };
    }
};
