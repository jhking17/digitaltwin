import styled from "styled-components";
import { Spinner } from "@bentley/ui-core";
export const Block = styled.div`
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1301;
`;

export const SpinnerBlock = styled(Spinner)`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
`;
export const Content = styled.div`
    font-size: 15px;
    color: white;
    margin-left: 20px;
`;
