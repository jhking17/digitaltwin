/// <reference types="redux-persist/types/persistreducer" />
declare const rootReducer: import("redux").Reducer<import("redux").CombinedState<{
    data: {
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
}>, import("redux").AnyAction>;
export declare type reducerState = ReturnType<typeof rootReducer>;
export declare const store: import("redux").Store<import("redux").EmptyObject & {
    data: {
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
} & import("redux-persist/es/persistReducer").PersistPartial, import("redux").AnyAction> & {
    dispatch: unknown;
};
export {};
//# sourceMappingURL=store.d.ts.map