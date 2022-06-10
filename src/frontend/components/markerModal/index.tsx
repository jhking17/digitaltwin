import React, { useEffect, useState } from "react";
import * as S from "./styled";

import img from "../../../images/pin_issue.png";
import MarkerPinApp from "../../app-ui/marker/MarkerPinApp";
import { SetterContext, StateContext } from "../../context";
import { DelMarker, ModifyMarker } from "../../../common/action";
import { EditorComp, LoadingComp } from "../";

export type markerModalProps = {
    visible: boolean;
    onClose: () => void;
    markerId: number;
    state: any;
    dispatch: any;
};
export interface FinalMarkerModalProps extends markerModalProps {}
export const MarkerModal: React.FunctionComponent<FinalMarkerModalProps> = props => {
    const { markerContainer, userId } = React.useContext(StateContext);
    const { setIsPopupOpen } = React.useContext(SetterContext);

    const dispatch = props.dispatch;
    const dataSelector = props.state;
    const [nowMarker, setNowMarker] = useState<any>();
    const [title, setTitle] = useState<string>("");
    const [text, setText] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (props.markerId != 0) {
            // get marker data
            let _nowMarker = markerContainer.find(raw => raw.id == props.markerId);
            setNowMarker(_nowMarker);
            if(_nowMarker){
                setTitle(_nowMarker.title);
                setText(_nowMarker.text);
            }
        }
    }, [props.markerId]);

    //여기 deleteMarker => MarkerPinApp의 delete => MarkerPinApp의 deleteDecorations 순으로 delete method들이 전달됨.
    const deleteMarker = async () => {
        await MarkerPinApp.delete(props.markerId);
        await dispatch(DelMarker(props.markerId));
        setIsPopupOpen(0);
    };
    //마커 정보 수정
    const onClickModify = async () => {
        setIsLoading(true);
        await dispatch(ModifyMarker(nowMarker.id, title, text));
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    };

    return (
        <>
            {isLoading && <LoadingComp text="잠시만 기다려주세요"/>}
            <S.Block open={props.visible} onClose={props.onClose}>
                <S.Inner>
                    {nowMarker && (
                        <S.Content>
                            {nowMarker.user_id == userId ? (
                                <S.Title>
                                    <S.TitleSubText>제목</S.TitleSubText>
                                    <S.TitleInput
                                        value={title}
                                        onChange={(e: any) => setTitle(e.target.value)}
                                    />
                                </S.Title>
                            ) : (
                                <S.Title>
                                    {nowMarker.title}
                                    <img src={img} />
                                </S.Title>
                            )}
                            <S.InputContainer>
                                <S.InputSubText>코멘트</S.InputSubText>
                                <S.ReviewTextBox>
                                    <EditorComp
                                        edit={nowMarker.user_id == userId}
                                        content={text}
                                        onChangeContent={content => setText(content)}
                                    />
                                </S.ReviewTextBox>
                            </S.InputContainer>
                            <S.ButtonsWrapper>
                                <S.Button onClick={onClickModify}>정보 수정</S.Button>
                                <S.Button onClick={deleteMarker}>이 마커 삭제</S.Button>
                                <S.Button onClick={props.onClose}>닫기</S.Button>
                            </S.ButtonsWrapper>
                        </S.Content>
                    )}
                </S.Inner>
            </S.Block>
        </>
    );
};
