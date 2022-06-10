import { Point3d } from "@bentley/geometry-core";
import { IModelConnection, ScreenViewport } from "@bentley/imodeljs-frontend";
import React from "react";
interface IModelElementObjectProps {
    id: string;
    relClassName: string;
}
interface IModelElementObject {
    [key: string]: string | undefined | IModelElementObjectProps;
}
type ContextProps = {
    isPopupOpen: number;
    markerContainer : any[];
    pointContainer: Point3d[];
    nameContainer: string[];
    infoContainer: any;
    dataContainer: any;
    elementContainer: IModelElementObject[];
    iModelFileName: string;
    iModel: IModelConnection | undefined;
    pinNum: number;
    name: string;
    info: string;
    storage: object[];
    sourceFileNames: string[];
    isImodelLoading: boolean;
    userId : number;
    isDemo : boolean;
};
export const StateContext = React.createContext<ContextProps>({
    isPopupOpen: 0,
    markerContainer : [],
    pointContainer: [],
    nameContainer: [],
    infoContainer: [],
    dataContainer: [],
    elementContainer: [],
    iModelFileName: "",
    iModel: undefined,
    pinNum: -1,
    name: "",
    info: "",
    storage: [],
    sourceFileNames: [],
    isImodelLoading: true,
    userId : 0,
    isDemo : false,
});
