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
    setMarkerContainer: (markerContainer: any[]) => void;
    setPointContainer: (pointerContainer: Point3d[]) => void;
    setNameContainer: (nameContainer: string[]) => void;
    setInfoContainer: (infoContainer: string[]) => void;
    setDataContainer: (dataContainer: object[]) => void;
    setElementContainer: (elementContainer: IModelElementObject[]) => void;
    setIModelFileName: (iModelFileName: string) => void;
    setIModel: (iModel: IModelConnection | undefined) => void;
    setPinNum: (pinNumber: number) => void;
    setIsPopupOpen: (markerId: number) => void;
    setName: (name: string) => void;
    setInfo: (info: string) => void;
    setStorage: (storage: object[]) => void;
    setSourceFileNames: (sourceFileNames: string[]) => void;
    setIsImodelLoading: (isImodelLoading: boolean) => void;
    setIsDemo : (flag : boolean)=> void;
};
export const SetterContext = React.createContext<ContextProps>({
    setMarkerContainer: () => {},
    setPointContainer: () => {},
    setNameContainer: () => {},
    setInfoContainer: () => {},
    setDataContainer: () => {},
    setElementContainer: () => {},
    setIModelFileName: () => {},
    setIModel: () => {},
    setPinNum: () => {},
    setIsPopupOpen: () => {},
    setName: () => {},
    setInfo: () => {},
    setStorage: () => {},
    setSourceFileNames: () => {},
    setIsImodelLoading: () => {},
    setIsDemo: ()=>{},
});
