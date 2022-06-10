import * as React from "react";
import { Button, ButtonType } from "@bentley/ui-core";
import { IModelApp } from "@bentley/imodeljs-frontend";
import {
    FitViewTool,
    PanViewTool,
    RotateViewTool,
    SelectionTool,
    ZoomViewTool,
    MeasureAreaByPointsTool,
    MeasureLocationTool,
    MeasureDistanceTool,
    WalkViewTool,
} from "@bentley/imodeljs-frontend";
import * as S from "./styled";

const toolId: number[] = [2, 0, 3, 1, 4, 5, 6, 7, 8];
const buttonNames: string[] = [
    "회전",
    "화면조정",
    "선택",
    "Pan",
    "확대",
    "넓이측정",
    "지정위치값",
    "길이",
    "거리뷰",
];
export type toolCompProps = {
    shutModal: () => void;
};
export interface FinalToolCompProps extends toolCompProps {}
export const ToolComponent: React.FunctionComponent<FinalToolCompProps> = props => {
    const tools = [
        FitViewTool.toolId,
        PanViewTool.toolId,
        RotateViewTool.toolId,
        SelectionTool.toolId,
        ZoomViewTool.toolId,
        MeasureAreaByPointsTool.toolId,
        MeasureLocationTool.toolId,
        MeasureDistanceTool.toolId,
        WalkViewTool.toolId,
    ];

    function showTools(id: number) {
        IModelApp.tools.run(tools[id], IModelApp.viewManager.selectedView);
    }
    return (
        <S.Wrapper>
            <S.ShutButtonWrapper>
                <Button
                    onClick={() => {
                        props.shutModal();
                    }}
                >
                    Shut
                </Button>
            </S.ShutButtonWrapper>
            <S.ToolsWrapper>
                <S.ButtonWrapper>
                    {buttonNames.map((name, idx) => (
                        <S.ToolButton
                            buttonType={ButtonType.Blue}
                            onClick={() => showTools(toolId[idx])}
                            key={`${name}-tool-btn`}
                        >
                            {name}
                        </S.ToolButton>
                    ))}
                </S.ButtonWrapper>
            </S.ToolsWrapper>
            {/* <S.ShutButtonWrapper>
                <Button
                    onClick={() => {
                        props.shutModal("right");
                    }}
                >
                    Shut
                </Button>
            </S.ShutButtonWrapper> */}
        </S.Wrapper>
    );
};
