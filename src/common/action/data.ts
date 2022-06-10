import { FetchApiGet, FetchApiPost } from "../network";
import actions from "../creator";
import { Point3d } from "@bentley/geometry-core";

export const GET_IMODEL_DATA = "GET_DATA";
export const GetIModelData = actions(
    GET_IMODEL_DATA,
    async (imodel_name: string, file_no: number) => {
        // return FetchApiGet("/api/v1/digital_twin/get_data/")
        return await FetchApiGet("/api/v1/digitaltwin/get_model_data", { imodel_name, file_no });
    }
);

export const GET_ELEMENT_DATA = "GET_ELEMENT_DATA";
export const GetIModelElementData = actions(GET_ELEMENT_DATA, async (imodel_name: string) => {
    return await FetchApiGet("/api/v1/digitaltwin/get_element_data", { imodel_name });
});

export const POST_ELEMENT_DATA = "POST_ELEMENT_DATA";
export const PostIModelElementData = actions(
    POST_ELEMENT_DATA,
    async (imodel_name: string, elements: any[], user_id: number, file_no: number) => {
        return await FetchApiPost("/api/v1/digitaltwin/create_element_data", {
            imodel_name,
            elements,
            user_id,
            file_no,
        });
    }
);

export const CREATE_IMODEL_DATA = "CREATE_IMODEL_DATA";
export const CreateImodelData = actions(
    CREATE_IMODEL_DATA,
    async (user_id: number, imodel_datas: any, imodel_id: number, className : string) => {
        return await FetchApiPost("/api/v1/digitaltwin/create_imodel_data", {
            imodel_datas,
            user_id,
            imodel_id,
            className
        });
    }
);

export const MERGE_IMODELS = "MERGE_IMODELS";
export const MergeImodels = actions(MERGE_IMODELS, async (dirPath: string, sources: string[]) => {
    return await FetchApiPost("/api/v1/digitaltwin/merge_imodels", { dirPath, sources });
});
//임시 함수: 벡인드 연결 후 필요 없는 함수

export const ADD_MARKER = "ADD_MARKER";
export const AddMarker = actions(
    ADD_MARKER,
    async (imodel_id: number, point: Point3d, user_id: number) => {
        console.log(imodel_id, point);
        return await FetchApiPost("/api/v1/digitaltwin/add_marker", {
            imodel_id,
            point: { x: point.x, y: point.y, z: point.z },
            user_id,
        });
    }
);

export const DEL_MARKER = "DEL_MARKER";
export const DelMarker = actions(DEL_MARKER, async (marker_id: number) => {
    return await FetchApiPost("/api/v1/digitaltwin/del_marker", { marker_id });
});

export const MODIFY_MARKER = "MODIFY_MARKER";
export const ModifyMarker = actions(
    MODIFY_MARKER,
    async (marker_id: number, title: string, text: string) => {
        return await FetchApiPost("/api/v1/digitaltwin/modify_marker", { marker_id, title, text });
    }
);
