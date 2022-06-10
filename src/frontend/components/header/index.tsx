import React, { useState, useEffect, useCallback } from "react";
import * as S from "./styled";

import markerPinImg from "../../../images/pin_sensor.png";

import {
    IModelApp,
    IModelConnection,
    SnapshotConnection,
    StandardViewId,
    ViewCreator3d,
    ViewState,
} from "@bentley/imodeljs-frontend";
import { Point3d } from "@bentley/geometry-core";
import MarkerPinApp from "../../app-ui/marker/MarkerPinApp";
import { SetterContext, StateContext } from "../../context";
import { CoreTools } from "@bentley/ui-framework";
import { Popover, Checkbox } from "@material-ui/core";
import { Button, ButtonType } from "@bentley/ui-core";
import path from "path";
import { ViewQueryParams } from "@bentley/imodeljs-common";
import { AppUi } from "../../app-ui/AppUi";
import { useSelector, useDispatch } from "react-redux";
import { reducerState } from "../../../common/store";
import { AddMarker } from "../../../common/action";

export type headerProps = {
    state: any;
    dispatch: any;
};

interface FinalHeaderProps extends headerProps {}
export const HeaderComp: React.FunctionComponent<FinalHeaderProps> = props => {
    const {
        iModel,
        pointContainer,
        name,
        isPopupOpen,
        nameContainer,
        infoContainer,
        dataContainer,
        iModelFileName,
        sourceFileNames,
        userId,
        isDemo
    } = React.useContext(StateContext);
    const {
        setIsImodelLoading,
        setName,
        setInfo,
        setPointContainer,
        setIsPopupOpen,
        setNameContainer,
        setInfoContainer,
        setDataContainer,
    } = React.useContext(SetterContext);

    const dispatch = props.dispatch;
    const dataSelector = props.state;
    const [pressedMarker, setPressedMarker] = useState<boolean>(false);
    const [pressedModelIsolate, setPressedModelIsolate] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const [checkBoxes, setCheckBoxes] = useState<any[] | null>(null);
    const [point, setPoint] = useState<any>();
    const [image, setImage] = useState<any>();

    const onKeyPressed = useCallback(e => {
        const { key, keyCode } = e;
        if ((keyCode === 27 && key === "Escape") || e.type === "contextmenu") {
            setPressedMarker(false);
            setPressedModelIsolate(false);
            IModelApp.tools.run(
                CoreTools.selectElementCommand.toolId,
                IModelApp.viewManager.selectedView
            );
        }
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", onKeyPressed);
        window.addEventListener("contextmenu", onKeyPressed);
        return () => {
            window.addEventListener("keydown", onKeyPressed);
            window.addEventListener("contextmenu", onKeyPressed);
        };
    }, [onKeyPressed]);

    useEffect(() => {
        if (sourceFileNames.length != 0) {
            let _checkBoxes = [];
            for (const fileName of sourceFileNames) {
                let object = {
                    fileName: fileName,
                    checked: false,
                };
                _checkBoxes.push(object);
            }

            setCheckBoxes(_checkBoxes);
        }
    }, [sourceFileNames]);

    useEffect(() => {
        if (dataSelector.markerId && dataSelector.markerId != -1) {
            MarkerPinApp.addMarkerPoint(
                point,
                name,
                image,
                dataSelector.markerId,
                () => setIsPopupOpen(dataSelector.markerId),
                () => {}
            );
        }
    }, [dataSelector.markerId]);

    const handleIsolateClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setPressedModelIsolate(true);
        setAnchorEl(event.currentTarget);
    };
    const handleIsolateClose = () => {
        setAnchorEl(null);
        setPressedModelIsolate(false);
    };
    const setMarker = async () => {
        setPressedMarker(true);

        IModelApp.tools.run("Test.DefineLocation", (point: Point3d) => {
            addMarker(point);
        });
    };

    const addMarker = async (point: Point3d) => {
        setPointContainer([...pointContainer, point]);
        localStorage.setItem(
            `points-${iModelFileName}`,
            JSON.stringify([...pointContainer, point])
        );
        const image = new Image();
        image.src = markerPinImg;
        setPoint(point);
        setImage(image);

        await dispatch(AddMarker(dataContainer.id, point, userId));
        setPressedMarker(false);
    };

    const disableMarker = () => {
        MarkerPinApp.teardown();
        setPressedMarker(false);
        setPointContainer([]);
        setNameContainer([]);
        setInfoContainer([]);
        setDataContainer([]);
        localStorage.removeItem(`datas-${iModelFileName}`);
        localStorage.removeItem(`points-${iModelFileName}`);
        localStorage.removeItem(`images-${iModelFileName}`);
        localStorage.removeItem(`names-${iModelFileName}`);
        localStorage.removeItem(`infoes-${iModelFileName}`);
        localStorage.removeItem(`position-${iModelFileName}`);
    };
    const handleChange = (idx: number) => {
        if (checkBoxes) {
            setCheckBoxes(
                checkBoxes.map((cb, i) => (i === idx ? { ...cb, checked: !cb.checked } : cb))
            );
        }
    };

    const handleSubmit = async () => {
        setAnchorEl(null);
        setPressedModelIsolate(false);
        setIsImodelLoading(true);

        let sourceFileNames: string[] = [];
        if (checkBoxes && process.env.REACT_APP_FRONT_END) {
            for (const cb of checkBoxes) {
                if (cb.checked) {
                    sourceFileNames.push(cb.fileName);
                }
            }
            if (sourceFileNames.length === 0) {
                return;
            } else if (sourceFileNames.length === 1) {
                const bimDirPath = path.join(
                    process.env.REACT_APP_FRONT_END,
                    `/${sourceFileNames[0]}`
                );
                const _iModel = await SnapshotConnection.openFile(bimDirPath);

                if (_iModel) {
                    const viewQueryParams: ViewQueryParams = { wantPrivate: false };
                    const viewSpecs = await _iModel.views.queryProps(viewQueryParams);
                    //trying mapping
                    const acceptedViewClasses = ["BisCore:SpatialViewDefinition"];
                    const acceptedViewSpecs = viewSpecs.filter(
                        spec => acceptedViewClasses.indexOf(spec.classFullName) !== -1
                    );
                    const viewStates: ViewState[] = [];

                    for (const viewDef of acceptedViewSpecs) {
                        const viewState = await _iModel.views.load(viewDef.id!);
                        viewStates.push(viewState);
                    }
                    if (viewStates) {
                        AppUi.handleIModelViewsSelected(_iModel, viewStates);
                    }
                    MarkerPinApp.setup(_iModel);
                }
                //사실 else 파트에 merge file이 두개만 있는것이 아니기 때문에 하나이상의 모델을 골랐을때 백엔드에 새로 merge를 해야함
            } else {
                if (iModel) {
                    const creator = new ViewCreator3d(iModel);
                    const viewOptions = {
                        cameraOn: true,
                        skyboxOn: true,
                        standardViewId: StandardViewId.Iso,
                        // useSeedView: true,
                        // vpAspect:
                    };
                    const viewStates = await creator.createDefaultView(viewOptions);
                    AppUi.handleIModelViewsSelected(iModel, [viewStates]);
                    MarkerPinApp.setup(iModel);
                }
            }
        }

        setIsImodelLoading(false);

        setCheckBoxes(checkBoxes!.map(cb => ({ ...cb, checked: false })));
    };
    if(isDemo || infoContainer == undefined) return (<S.Header></S.Header>);
    return (
        <S.Header>
            <S.HeaderDiv>
                <S.HeaderInfoText>파일 이름</S.HeaderInfoText>
                <S.HeaderInfoValue>{infoContainer.filename}</S.HeaderInfoValue>
                <S.HeaderInfoText>문서 제목</S.HeaderInfoText>
                <S.HeaderInfoValue>{infoContainer.doc_title}</S.HeaderInfoValue>
                <S.HeaderInfoText>문서코드</S.HeaderInfoText>
                <S.HeaderInfoValue>{infoContainer.doc_code}</S.HeaderInfoValue>
                <S.HeaderInfoText>담당자</S.HeaderInfoText>
                <S.HeaderInfoValue>{infoContainer.create_by}</S.HeaderInfoValue>
                <S.HeaderInfoText>스테이지</S.HeaderInfoText>
                <S.HeaderInfoValue>{infoContainer.stage_code}</S.HeaderInfoValue>
            </S.HeaderDiv>
            {iModel && (
                <S.HeaderDiv style={{ justifyContent: "flex-end" }}>
                    <S.TabBar onClick={() => setMarker()} $pressed={pressedMarker}>
                        <S.TabBarTitle>마커</S.TabBarTitle>
                    </S.TabBar>
                    {sourceFileNames.length != 0 && (
                        <>
                            <S.TabBar onClick={handleIsolateClick} $pressed={pressedModelIsolate}>
                                <S.TabBarTitle>모델별 분리</S.TabBarTitle>
                            </S.TabBar>
                            <Popover
                                id={"simple-popover"}
                                open={pressedModelIsolate}
                                onClose={handleIsolateClose}
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center",
                                }}
                                transformOrigin={{ vertical: "top", horizontal: "center" }}
                            >
                                <S.SelectModelWrapper>
                                    {checkBoxes &&
                                        checkBoxes.map((item, idx) => (
                                            <S.SelectModelList
                                                key={`${item.fileName}-${idx}`}
                                                label={item.fileName}
                                                control={
                                                    <Checkbox
                                                        color="primary"
                                                        value={item.checked}
                                                        id={String(idx)}
                                                        onChange={() => handleChange(idx)}
                                                    />
                                                }
                                            />
                                        ))}
                                    <Button buttonType={ButtonType.Blue} onClick={handleSubmit}>
                                        확인
                                    </Button>
                                </S.SelectModelWrapper>
                            </Popover>
                        </>
                    )}
                    <S.TabBar onClick={disableMarker}>
                        <S.TabBarTitle>마커 리셋</S.TabBarTitle>
                    </S.TabBar>
                </S.HeaderDiv>
            )}
        </S.Header>
    );
};
