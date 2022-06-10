//froala
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
//
import "@bentley/icons-generic-webfont/dist/bentley-icons-generic-webfont.css";
import {
    IModelConnection,
    ViewState,
    SnapshotConnection,
    ViewCreator3d,
    StandardViewId,
    IModelApp,
} from "@bentley/imodeljs-frontend";
import { SnapshotDb } from "@bentley/imodeljs-backend";
import { Point3d } from "@bentley/geometry-core";
import IModelComponents from "./IModelComponents";
import React, { useState, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { AppUi } from "./app-ui/AppUi";
import { MainApp } from "./app/MainApp";
import MarkerPinApp from "./app-ui/marker/MarkerPinApp";
import { StateContext, SetterContext } from "./context";
import { MarkerModal, HeaderComp, LoadingComp } from "./components";
import markerPinImg from "../images/pin_sensor.png";
import { ViewQueryParams } from "@bentley/imodeljs-common";
import path from "path";
import { reducerState } from "../common/store";
import {
    GetIModelData,
    GetIModelElementData,
    MergeImodels,
    PostIModelElementData,
    CreateImodelData,
    AddMarker,
    DelMarker,
} from "../common/action";
import { writeFileSync } from "fs";
import styled from "styled-components";

const CommonStyle = styled.div`
    font-family: sans-serif;
`;

const ENTITY_CLASSES = [
    "AnnotationElement2d",
    "AnnotationFrameStyle",
    "AnnotationLeaderStyle",
    "AnnotationTextStyle",
    "AuxCoordSystem",
    "AuxCoordSystem2d",
    "AuxCoordSystem3d",
    "AuxCoordSystemSpatial",
    "Category",
    "CategorySelector",
    "ChannelRootAspect",
    "CodeSpec",
    "ColorBook",
    "DefinitionContainer",
    "DefinitionElement",
    "DefinitionGroup",
    "DefinitionModel",
    "DefinitionPartition",
    "DefinitionSet",
    "DictionaryModel",
    "DisplayStyle",
    "DisplayStyle2d",
    "DisplayStyle3d",
    "Document",
    "DocumentCarrier",
    "DocumentListModel",
    "DocumentPartition",
    "Drawing",
    "DrawingCategory",
    "DrawingGraphic",
    "DrawingModel",
    "DrawingViewDefinition",
    "DriverBundleElement",
    "Element",
    "ElementAspect",
    "ElementMultiAspect",
    "ElementUniqueAspect",
    "EmbeddedFileLink",
    "ExternalSource",
    "ExternalSourceAspect",
    "ExternalSourceAttachment",
    "ExternalSourceGroup",
    "FolderLink",
    "GeometricElement",
    "GeometricElement2d",
    "GeometricElement3d",
    "GeometricModel",
    "GeometricModel2d",
    "GeometricModel3d",
    "GeometryPart",
    "GraphicalElement2d",
    "GraphicalElement3d",
    "GraphicalModel2d",
    "GraphicalModel3d",
    "GraphicalPartition3d",
    "GraphicalType2d",
    "GroupInformationElement",
    "GroupInformationModel",
    "GroupInformationPartition",
    "InformationCarrierElement",
    "InformationContentElement",
    "InformationModel",
    "InformationPartitionElement",
    "InformationRecordElement",
    "InformationRecordModel",
    "InformationRecordPartition",
    "InformationReferenceElement",
    "LightLocation",
    "LineStyle",
    "LinkElement",
    "LinkModel",
    "LinkPartition",
    "Model",
    "ModelSelector",
    "OrthographicViewDefinition",
    "PhysicalElement",
    "PhysicalMaterial",
    "PhysicalModel",
    "PhysicalPartition",
    "PhysicalPortion",
    "PhysicalSystem",
    "PhysicalSystemModel",
    "PhysicalSystemPartition",
    "PhysicalType",
    "RecipeDefinitionElement",
    "RenderMaterial",
    "RenderTimeline",
    "RepositoryLink",
    "RepositoryModel",
    "RoleElement",
    "RoleModel",
    "SectionDrawing",
    "SectionDrawingLocation",
    "SectionDrawingModel",
    "SectionLocation",
    "Sheet",
    "SheetBorder",
    "SheetBorderTemplate",
    "SheetModel",
    "SheetTemplate",
    "SheetViewDefinition",
    "SpatialCategory",
    "SpatialElement",
    "SpatialIndex",
    "SpatialLocationElement",
    "SpatialLocationModel",
    "SpatialLocationPartition",
    "SpatialLocationPortion",
    "SpatialLocationType",
    "SpatialModel",
    "SpatialViewDefinition",
    "SubCategory",
    "Subject",
    "SynchronizationConfigLink",
    "TemplateRecipe2d",
    "TemplateRecipe3d",
    "TemplateViewDefinition2d",
    "TemplateViewDefinition3d",
    "TextAnnotation2d",
    "TextAnnotation3d",
    "TextAnnotationData",
    "TextAnnotationSeed",
    "Texture",
    "TypeDefinitionElement",
    "UrlLink",
    "ViewAttachment",
    "ViewDefinition",
    "ViewDefinition2d",
    "ViewDefinition3d",
    "VolumeElement",
    "WebMercatorModel",
];

interface IModelElementObjectProps {
    id: string;
    relClassName: string;
}
interface IModelElementObject {
    [key: string]: string | undefined | IModelElementObjectProps;
}

const App: React.FunctionComponent = () => {
    //Only Used in App
    const dispatch = useDispatch();
    const dataSelector = useSelector((state: reducerState) => state.data);

    const [isImodelLoading, setIsImodelLoading] = useState<boolean>(true);
    const [isMergedFile, setIsMergedFile] = useState<boolean>(false);

    //Used in different Components

    const [markerContainer, setMarkerContainer] = useState<any[]>([]);
    const [pointContainer, setPointContainer] = useState<Point3d[]>([]);
    const [nameContainer, setNameContainer] = useState<string[]>([]);
    const [infoContainer, setInfoContainer] = useState<string[]>([]);
    const [dataContainer, setDataContainer] = useState<object[]>([]);
    const [elementContainer, setElementContainer] = useState<IModelElementObject[]>([]);

    const [sourceFileNames, setSourceFileNames] = useState<string[]>([]);
    const [iModelFileName, setIModelFileName] = useState<string>("");
    const [iModel, setIModel] = useState<IModelConnection | undefined>(undefined);
    const [iModelEntity, setIModelEntity] = useState<any>();
    const [fileNo, setFileNo] = useState<number>(-1);
    const [userId, setUserId] = useState<number>(-1);
    const [isDemo, setIsDemo] = useState<boolean>(false);

    const [pinNum, setPinNum] = useState<number>(0);
    const [isPopupOpen, setIsPopupOpen] = useState<number>(0);

    const [name, setName] = useState<string>("");
    const [info, setInfo] = useState<string>("");

    const [storage, setStorage] = useState<object[]>([]);

    const setterContext = {
        setMarkerContainer,
        setPointContainer,
        setNameContainer,
        setInfoContainer,
        setDataContainer,
        setElementContainer,
        setIModelFileName,
        setIModel,
        setPinNum,
        setIsPopupOpen,
        setName,
        setInfo,
        setStorage,
        setSourceFileNames,
        setIsImodelLoading,
        setIsDemo,
    };
    const stateContext = {
        isPopupOpen,
        markerContainer,
        pointContainer,
        nameContainer,
        infoContainer,
        dataContainer,
        elementContainer,
        iModelFileName,
        iModel,
        pinNum,
        name,
        info,
        storage,
        sourceFileNames,
        isImodelLoading,
        userId,
        isDemo,
    };

    //1. 처음 두개의 모델을 merge하는지 아니면 single file인지 확인
    useEffect(() => {
        initialize();
    }, []);

    //2. Model이 initialize된후에 imodel화 하기
    useEffect(() => {
        if (iModelFileName.length > 0) {
            initializeIModel();
        }
    }, [iModelFileName]);

    //Get Model Data
    useEffect(() => {
        if (dataSelector.iModelData && Object.keys(dataSelector.iModelData).length > 0) {
            const { pointContainer, nameContainer, infoContainer, dataContainer, markerContainer } =
                dataSelector.iModelData;

            setMarkerContainer(markerContainer);
            setPointContainer(pointContainer);
            setNameContainer(nameContainer);
            setInfoContainer(infoContainer);
            setDataContainer(dataContainer);
        }
    }, [dataSelector.iModelData]);

    useEffect(() => {
        if (dataSelector.markerContainer) {
            setMarkerContainer(dataSelector.markerContainer);
        }
    }, [dataSelector.markerContainer]);

    useEffect(() => {
        if (markerContainer) {
            MarkerPinApp.teardown();
            if (pointContainer && pointContainer.length > 0 && markerContainer.length > 0) {
                for (var i = 0; i < pointContainer.length; i++) {
                    const point: any = pointContainer[i];
                    const marker = markerContainer[i];
                    const image = new Image();
                    image.src = markerPinImg;
                    MarkerPinApp.addMarkerPoint(
                        new Point3d(
                            parseFloat(point[0]),
                            parseFloat(point[1]),
                            parseFloat(point[2])
                        ),
                        marker.title,
                        image,
                        marker.id,
                        () => showPopup(marker.id),
                        () => {
                            console.log("hover");
                        }
                    );
                }
            }
        }
    }, [markerContainer]);

    //Merge multiple imodels
    useEffect(() => {
        if (dataSelector.merged_imodel && Object.keys(dataSelector.merged_imodel).length > 0) {
            setIModelFileName(dataSelector.merged_imodel);
        }
    }, [dataSelector.merged_imodel]);

    //create imodel's element data
    useEffect(() => {
        if (dataSelector.element_container && dataSelector.element_container.length > 0) {
            setElementContainer(dataSelector.element_container);
            setIsImodelLoading(false);
        } else {
            const queryElements = async () => {
                if (iModel && iModelFileName) {
                    setIsImodelLoading(true);
                    const schemas = await iModel.query(`SELECT * FROM ECDbMeta.ECSchemaDef`);
                    // #region 스키마 데이터 텍스트코드
                    for await (const schema of schemas){
                        // console.log("schema : ", schema);
                        // const classes = await iModel.query(`SELECT Name FROM ECDbMeta.ECClassDef WHERE ECClassDef.Schema.Id=${schema.id}`);
                        // for await (const _class of classes){
                        //     console.log("class : ", _class);
                        //     // const elements = await iModel.query(`SELECT * FROM ${schema.alias}:${_class.name}`);
                        //     // try{
                        //     //     for await (const el of elements){
                        //     //         console.log("DATA : ", el);
                        //     //     }
                        //     // }catch(err){}
                        // }
                        // console.log("===================================");
                    }
                    // if(isDemo){
                    //     await dispatch(
                    //         PostIModelElementData(iModelFileName, [], userId, fileNo)
                    //     );
                    // } else {
                        // const elements = await iModel.query(`SELECT * FROM bis.Element`);
                        // let _elements = [];
                        // let count = 0;
                        // for await (const ele of elements) {
                        //     if(count < 1000) count ++ ;
                        //     else break;
                        //     let obj: IModelElementObject = {};
                        //     try {
                        //         obj.id = ele.id;
                        //         obj.className = ele.className;
                        //         obj.parent = ele.parent ? ele.parent : undefined;
                        //         obj.codeSpec = ele.codeSpec ? ele.codeSpec : undefined;
                        //         obj.userLabel = ele.userLabel ? ele.userLabel : undefined;

                        //         _elements.push(obj);
                        //         console.log("data : ", ele);
                        //     } catch (err) {
                        //         console.error(err);
                        //     }
                        // }
                        // await dispatch(
                        //     PostIModelElementData(iModelFileName, _elements, userId, fileNo)
                        // );
                        // setElementContainer(_elements);
                    // }
                }
                setIsImodelLoading(false);
            };
            queryElements();
        }
    }, [dataSelector.element_container, iModel]);

    useEffect(() => {
        if (dataSelector.iModelEntity && "id" in dataSelector.iModelEntity) {
            let id = dataSelector.iModelEntity.id;
            if ((id && iModelEntity == undefined) || iModelEntity.id != id) {
                createElementData(id);
                setIModelEntity(dataSelector.iModelEntity);
            }
        }
    }, [dataSelector.iModelEntity]);

    const createElementData = async( id : number)=>{
        if (iModel == undefined) return;
        let totalData = {};
        for (var _class of ENTITY_CLASSES) {
            const data = await iModel.queryRows(`SELECT * FROM BisCore:${_class}`);
            const rows = data.rows;
            if (rows.length > 0) {
                Object.assign(totalData, { [_class]: rows });
                await dispatch(CreateImodelData(userId, rows, id, _class));
            }
        }
        if (Object.keys(totalData).length > 0) {
        }
    }

    const initialize = async () => {
        //Get File Name
        try {
            if (process.env.REACT_APP_FRONT_END) {
                //get file names from query string
                let search = window.location.search;
                let params = new URLSearchParams(search);
                let modelNames: string[] = params.getAll("imodel");
                let _fileNo: string | null = params.get("file_no");
                let user_id = params.get("user_id");
                setFileNo(parseInt(_fileNo ? _fileNo : "0"));
                setUserId(parseInt(user_id ? user_id : "0"));

                //만약 하나의 모델만 파람으로 들어오는 경우 
                modelNames = modelNames.map(raw=> raw.replace(".dgn", ".i.bim")); // dgn to .i.bim
                if (modelNames.length == 0) {
                    setIsDemo(true);
                    // modelNames.push("uploads_edms/370T082-RTR.i.bim");
                    modelNames.push("uploads_edms/370T082-RTR.i.bim");
                }
                if (modelNames.length === 1) {
                    setIModelFileName(modelNames[0].replace(".dgin", ".i.bim"));
                }
                //여러개가 들어오는 경우는 merge process해줘야함
                else if (modelNames.length > 1) {
                    dispatch(MergeImodels(process.env.REACT_APP_FRONT_END, modelNames));
                    setIsMergedFile(true);
                    setSourceFileNames(modelNames);
                }
            }
        } catch (err) {
            //모달로 에러 from initialize
            console.error(err);
        }
    };

    const getViewDefinitions = async (imodel: IModelConnection): Promise<ViewState[]> => {
        const viewQueryParams: ViewQueryParams = { wantPrivate: false };
        const viewSpecs = await imodel.views.queryProps(viewQueryParams);
        //trying mapping
        const acceptedViewClasses = ["BisCore:SpatialViewDefinition"];
        const acceptedViewSpecs = viewSpecs.filter(
            spec => acceptedViewClasses.indexOf(spec.classFullName) !== -1
        );
        const viewStates: ViewState[] = [];

        for (const viewDef of acceptedViewSpecs) {
            const viewState = await imodel.views.load(viewDef.id!);
            viewStates.push(viewState);
        }
        return viewStates;
    };

    const initializeIModel = async () => {
        try {
            if (process.env.REACT_APP_FRONT_END) {
                const bimDirPath = path.join(process.env.REACT_APP_FRONT_END, `/${iModelFileName}`);
                const _iModel = await SnapshotConnection.openFile(bimDirPath);
                setIModel(_iModel);

                if (_iModel) {
                    let views = await IModelApp.viewManager.selectedView;
                    // views?.attachRealityModel()
                    if (isMergedFile) {
                        const creator = new ViewCreator3d(_iModel);
                        const viewOptions = {
                            cameraOn: true,
                            skyboxOn: true,
                            standardViewId: StandardViewId.Iso,
                            // useSeedView: true,
                            // vpAspect:
                        };
                        const viewStates = await creator.createDefaultView(viewOptions);
                        AppUi.handleIModelViewsSelected(_iModel, [viewStates]);
                    } else {
                        const viewStates = await getViewDefinitions(_iModel);
                        if (viewStates) {
                            AppUi.handleIModelViewsSelected(_iModel, viewStates);
                        }
                    }

                    MarkerPinApp.setup(_iModel);
                    dispatch(GetIModelData(iModelFileName, fileNo));
                    dispatch(GetIModelElementData(iModelFileName));
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const showPopup = (marker_id: number) => {
        setIsPopupOpen(marker_id);
    };

    return (
        <Provider store={MainApp.store}>
            <SetterContext.Provider value={setterContext}>
                <StateContext.Provider value={stateContext}>
                    <CommonStyle>
                        {isImodelLoading && <LoadingComp text={"Loading & Merging"}></LoadingComp>}
                        <HeaderComp state={dataSelector} dispatch={dispatch} />
                        <MarkerModal
                            markerId={isPopupOpen}
                            visible={isPopupOpen != 0}
                            onClose={() => setIsPopupOpen(0)}
                            state={dataSelector}
                            dispatch={dispatch}
                        />
                    </CommonStyle>
                    <IModelComponents />
                </StateContext.Provider>
            </SetterContext.Provider>
        </Provider>
    );
};

export default App;
