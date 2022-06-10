"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const network_1 = require("../network");
const creator_1 = require("../creator");
exports.GET_IMODEL_DATA = "GET_DATA";
exports.GetIModelData = creator_1.default(exports.GET_IMODEL_DATA, async (imodel_name, file_no) => {
    // return FetchApiGet("/api/v1/digital_twin/get_data/")
    return await network_1.FetchApiGet("/api/v1/digitaltwin/get_model_data", { imodel_name, file_no });
});
exports.GET_ELEMENT_DATA = "GET_ELEMENT_DATA";
exports.GetIModelElementData = creator_1.default(exports.GET_ELEMENT_DATA, async (imodel_name) => {
    return await network_1.FetchApiGet("/api/v1/digitaltwin/get_element_data", { imodel_name });
});
exports.POST_ELEMENT_DATA = "POST_ELEMENT_DATA";
exports.PostIModelElementData = creator_1.default(exports.POST_ELEMENT_DATA, async (imodel_name, elements, user_id, file_no) => {
    return await network_1.FetchApiPost("/api/v1/digitaltwin/create_element_data", {
        imodel_name,
        elements,
        user_id,
        file_no,
    });
});
exports.CREATE_IMODEL_DATA = "CREATE_IMODEL_DATA";
exports.CreateImodelData = creator_1.default(exports.CREATE_IMODEL_DATA, async (user_id, imodel_datas, imodel_id, className) => {
    return await network_1.FetchApiPost("/api/v1/digitaltwin/create_imodel_data", {
        imodel_datas,
        user_id,
        imodel_id,
        className
    });
});
exports.MERGE_IMODELS = "MERGE_IMODELS";
exports.MergeImodels = creator_1.default(exports.MERGE_IMODELS, async (dirPath, sources) => {
    return await network_1.FetchApiPost("/api/v1/digitaltwin/merge_imodels", { dirPath, sources });
});
//임시 함수: 벡인드 연결 후 필요 없는 함수
exports.ADD_MARKER = "ADD_MARKER";
exports.AddMarker = creator_1.default(exports.ADD_MARKER, async (imodel_id, point, user_id) => {
    console.log(imodel_id, point);
    return await network_1.FetchApiPost("/api/v1/digitaltwin/add_marker", {
        imodel_id,
        point: { x: point.x, y: point.y, z: point.z },
        user_id,
    });
});
exports.DEL_MARKER = "DEL_MARKER";
exports.DelMarker = creator_1.default(exports.DEL_MARKER, async (marker_id) => {
    return await network_1.FetchApiPost("/api/v1/digitaltwin/del_marker", { marker_id });
});
exports.MODIFY_MARKER = "MODIFY_MARKER";
exports.ModifyMarker = creator_1.default(exports.MODIFY_MARKER, async (marker_id, title, text) => {
    return await network_1.FetchApiPost("/api/v1/digitaltwin/modify_marker", { marker_id, title, text });
});
//# sourceMappingURL=data.js.map