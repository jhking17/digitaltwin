import { Point3d } from "@bentley/geometry-core";
import { IModelApp, ScreenViewport } from "@bentley/imodeljs-frontend";
import React, { useEffect, useState } from "react";
import { SetterContext, StateContext } from "../../context";
import { readFile } from "../Utils";
import * as S from "./styled";

export type addMarkerProps = {
    visible: boolean;
    onClose: () => void;
    // addMarkerW: (point: Point3d) => void;
};
export interface FinalAddMarkerProps extends addMarkerProps {}

export const AddMarkerModal: React.FunctionComponent<FinalAddMarkerProps> = props => {
    const {
        pointContainer,

        nameContainer,
        infoContainer,
        dataContainer,
        name,
        info,
        storage,
        iModelFileName,
    } = React.useContext(StateContext);
    const { setName, setInfo, setStorage, setDataContainer, setNameContainer, setInfoContainer } =
        React.useContext(SetterContext);
    const [excelData, setExcelData] = useState<any>(null);

    const addStorage = (graphData: any) => {
        if (graphData) {
            setDataContainer([...dataContainer, graphData]);
            setStorage([...dataContainer, graphData]);
        }
    };

    const filePathset = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.target.files) {
            var file = e.target.files[0];
            let res = await readFile(file);
            setExcelData(res);
            addStorage(res);
            // excel file in excelData!!
        }
    };
    //여기의 onSubmit => App에 있는 addMarkerW => MarkerPinApp에 있는 addMarkerPoint => MarkerPinDecorator에 있는 addPoint => 그리고 markers property의 add를 사용해 포인트 저장
    const onSubmit = (e: React.SyntheticEvent) => {
        const selectedVp = IModelApp.viewManager.selectedView;
        e.preventDefault();
        if (name === "" || info === "") {
            alert("마커이름이나 상세내용을 입력해주세요.");
            return;
        }
        const index = pointContainer.length - 1;
        // props.addMarkerW(pointContainer[index]);

        setNameContainer([...nameContainer, name]);
        setInfoContainer([...infoContainer, info]);
        localStorage.setItem(`names-${iModelFileName}`, JSON.stringify([...nameContainer, name]));
        localStorage.setItem(`infoes-${iModelFileName}`, JSON.stringify([...infoContainer, info]));
        setName("");
        setInfo("");
        props.onClose();
    };
    const onCancelSensor = () => {
        setName("");
        setInfo("");

        props.onClose();
    };
    const onChangeSensorName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };
    const onChangeSensorInfo = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInfo(e.target.value);
    };
    return (
        <S.Block open={props.visible} onClose={onCancelSensor}>
            <S.Inner>
                <S.Form>
                    <S.MarkerNameInput>
                        <S.Title>{"마커"}</S.Title>

                        <S.Input placeholder="마커 이름" onChange={onChangeSensorName}></S.Input>
                    </S.MarkerNameInput>
                    <S.MarkerNameInput onChange={onChangeSensorInfo}>
                        <S.Title>[ 상세 내용 ]</S.Title>

                        <S.Textarea placeholder="상세내용"></S.Textarea>
                    </S.MarkerNameInput>
                    <S.MarkerNameInput>
                        <S.Title>[ .xlsx 데이터 업로드 ]</S.Title>
                        <S.Uploader type="file" id="file" onChange={filePathset}></S.Uploader>
                    </S.MarkerNameInput>
                    <S.ButtonsWrapper>
                        <S.Button onClick={onSubmit}>등록</S.Button>
                        <S.Button onClick={onCancelSensor}>취소</S.Button>
                    </S.ButtonsWrapper>
                </S.Form>
            </S.Inner>
        </S.Block>
    );
};
