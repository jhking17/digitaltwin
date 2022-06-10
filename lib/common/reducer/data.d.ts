import { AnyAction } from "redux";
export declare type iModelDataState = {
    iModelData: {
        dataContainer?: any;
        infoContainer?: any;
        markerContainer?: any;
        pointContainer?: any;
        nameContainer?: any;
    };
    iModelEntity?: any;
    imodelClassDatas: any[];
    element_container: object[];
    create_element_data: any;
    merged_imodel: object;
    markerId: number;
    markerContainer: any[];
};
export declare const data: (state: iModelDataState | undefined, { type, payload }: AnyAction) => {
    iModelData: {
        dataContainer: any;
        infoContainer: any;
        markerContainer: any;
        pointContainer: any;
        nameContainer: any;
    };
    markerContainer: any;
    imodelClassDatas: any;
    iModelEntity?: any;
    element_container: object[];
    create_element_data: any;
    merged_imodel: object;
    markerId: number;
} | {
    element_container: any;
    iModelData: {
        dataContainer?: any;
        infoContainer?: any;
        markerContainer?: any;
        pointContainer?: any;
        nameContainer?: any;
    };
    iModelEntity?: any;
    imodelClassDatas: any[];
    create_element_data: any;
    merged_imodel: object;
    markerId: number;
    markerContainer: any[];
} | {
    merged_imodel: any;
    iModelData: {
        dataContainer?: any;
        infoContainer?: any;
        markerContainer?: any;
        pointContainer?: any;
        nameContainer?: any;
    };
    iModelEntity?: any;
    imodelClassDatas: any[];
    element_container: object[];
    create_element_data: any;
    markerId: number;
    markerContainer: any[];
} | {
    markerId: any;
    iModelData: {
        dataContainer?: any;
        infoContainer?: any;
        markerContainer?: any;
        pointContainer?: any;
        nameContainer?: any;
    };
    iModelEntity?: any;
    imodelClassDatas: any[];
    element_container: object[];
    create_element_data: any;
    merged_imodel: object;
    markerContainer: any[];
} | {
    markerContainer: any;
    iModelData: {
        dataContainer?: any;
        infoContainer?: any;
        markerContainer?: any;
        pointContainer?: any;
        nameContainer?: any;
    };
    iModelEntity?: any;
    imodelClassDatas: any[];
    element_container: object[];
    create_element_data: any;
    merged_imodel: object;
    markerId: number;
};
//# sourceMappingURL=data.d.ts.map