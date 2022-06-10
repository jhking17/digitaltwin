"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_1 = require("../action");
const initalState = {
    iModelData: {},
    iModelEntity: undefined,
    imodelClassDatas: [],
    element_container: [],
    create_element_data: [],
    merged_imodel: {},
    markerId: 0,
    markerContainer: [],
};
exports.data = (state = initalState, { type, payload }) => {
    switch (type) {
        case action_1.GET_IMODEL_DATA:
            return Object.assign(Object.assign({}, state), { iModelData: {
                    dataContainer: payload.data.dataContainer,
                    infoContainer: payload.data.infoContainer,
                    markerContainer: payload.data.markerContainer,
                    pointContainer: payload.data.pointContainer,
                    nameContainer: payload.data.nameContainer,
                }, markerContainer: payload.data.markerContainer, imodelClassDatas: payload.data.imodel_datas });
        case action_1.GET_ELEMENT_DATA:
            return Object.assign(Object.assign({}, state), { element_container: payload.data });
        case action_1.POST_ELEMENT_DATA:
            if (payload.data)
                return Object.assign(Object.assign({}, state), { create_element_data: payload.data.els, iModelEntity: payload.data.imodel });
            else
                return Object.assign({}, state);
        case action_1.MERGE_IMODELS:
            return Object.assign(Object.assign({}, state), { merged_imodel: payload.data });
        case action_1.ADD_MARKER + "_LOADING":
            return Object.assign(Object.assign({}, state), { markerId: 0 });
        case action_1.ADD_MARKER:
            return Object.assign(Object.assign({}, state), { markerId: payload.data.marker_id });
        case action_1.MODIFY_MARKER:
            return Object.assign(Object.assign({}, state), { markerContainer: payload.data });
        case action_1.CREATE_IMODEL_DATA:
            return Object.assign({}, state);
        default:
            return Object.assign({}, state);
    }
};
//# sourceMappingURL=data.js.map