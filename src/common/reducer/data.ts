import { AnyAction } from "redux";
import {
    GET_IMODEL_DATA,
    GET_ELEMENT_DATA,
    MERGE_IMODELS,
    POST_ELEMENT_DATA,
    CREATE_IMODEL_DATA,
    ADD_MARKER,
    MODIFY_MARKER,
} from "../action";

export type iModelDataState = {
    iModelData: {
        dataContainer?: any;
        infoContainer?: any;
        markerContainer?: any;
        pointContainer?: any;
        nameContainer?: any;
    };
    iModelEntity ?: any;
    imodelClassDatas : any[];
    element_container: object[];
    create_element_data: any;
    merged_imodel: object;
    markerId: number;
    markerContainer: any[];
};
const initalState: iModelDataState = {
    iModelData: {},
    iModelEntity : undefined,
    imodelClassDatas : [],
    element_container: [],
    create_element_data: [],
    merged_imodel: {},
    markerId: 0,
    markerContainer: [],
};

export const data = (state: iModelDataState = initalState, { type, payload }: AnyAction) => {
    switch (type) {
        case GET_IMODEL_DATA:
            return {
                ...state,
                iModelData: {
                    dataContainer: payload.data.dataContainer,
                    infoContainer: payload.data.infoContainer,
                    markerContainer: payload.data.markerContainer,
                    pointContainer: payload.data.pointContainer,
                    nameContainer: payload.data.nameContainer,
                },
                markerContainer: payload.data.markerContainer,
                imodelClassDatas : payload.data.imodel_datas
            };
        case GET_ELEMENT_DATA:
            return {
                ...state,
                element_container: payload.data,
            };
        case POST_ELEMENT_DATA:
            if (payload.data)
                return {
                    ...state,
                    create_element_data: payload.data.els,
                    iModelEntity: payload.data.imodel,
                };
            else return { ...state };
        case MERGE_IMODELS:
            return {
                ...state,
                merged_imodel: payload.data,
            };
        case ADD_MARKER + "_LOADING":
            return {
                ...state,
                markerId: 0,
            };
        case ADD_MARKER:
            return {
                ...state,
                markerId: payload.data.marker_id,
            };
        case MODIFY_MARKER:
            return {
                ...state,
                markerContainer: payload.data,
            };
        case CREATE_IMODEL_DATA:
            return {
                ...state,
            };
        default:
            return { ...state };
    }
};
