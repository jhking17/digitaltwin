import React from "react";
import * as S from "./styled";
import { SpinnerSize } from "@bentley/ui-core";

export const LoadingComp = (props : {text : string}) => {
    return (
        <S.Block>
            <S.SpinnerBlock size={SpinnerSize.Large}></S.SpinnerBlock>
            <br />
            <S.Content>{props.text}</S.Content>
        </S.Block>
    );
};
