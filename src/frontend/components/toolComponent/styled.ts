import { Button } from "@bentley/ui-core";
import styled from "styled-components";
export const Wrapper = styled.div`
    bottom: 5px;
    left: 4px;
    position: absolute;
    width: 99.55%;
    height: 4%;
    margin: 0;
    display: flex;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 30;
`;
export const ToolsWrapper = styled.div`
    position: relative;
    flex-direction: column;
    overflow-x: scroll;
    overflow-y: scroll;
    height: 100%;
    width: 100%;
`;
export const ToolButton = styled(Button)`
    width: 100%;
    margin: 0px 5px;
`;
export const ButtonWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
`;
export const ShutButtonWrapper = styled.div`
    position: relative;
    justify-content: space-evenly;
    flex-direction: column;
    left: 4px;
    width: 30%;
    display: flex;
`;
