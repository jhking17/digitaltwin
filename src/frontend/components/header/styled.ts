import styled from "styled-components";
import { FormGroup, FormControlLabel } from "@material-ui/core";
type StyledProps = {
    $pressed?: boolean;
};
export const Header = styled.div`
    padding : 10px;
    display: flex;
    flex-direction : column;
    justify-content: center;
    align-items: center;
    background-color: #0e3434;
    color: #ccc;
    height: 64px;
    font-weight: inherit;
    font-size: 20px;
    overflow: hidden;
    img {
        width: 30px;
        height: 30px;
        padding-right: 10px;
    }
`;

export const HeaderDiv = styled.div`
    flex : 1;
    width : 100%;
    display : flex;
    flex-direction : row;
    align-items : center;
    justify-content : flex-start;
    gap : 10px;
`;

export const HeaderInfoText = styled.p`
    font-size : 16px;
    font-weight : 300;
    color : #DAEDF9;
    margin : 0;
`;

export const HeaderInfoValue = styled.p`
    font-size : 16px;
    font-weight : 500;
    color : white;
    margin : 0 10px 0 0;
`;

export const TabBar = styled.div`
    color: #ccc;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    height: 100%;
    padding: inherit;
    :hover {
        background-color: #0a8c8c;
    }
    background-color: ${(props: StyledProps) => (props.$pressed ? "#0a8c8c" : "none")};
`;

export const TabBarTitle = styled.div``;
export const SelectModelWrapper = styled(FormGroup)`
    display: flex;
    justify-content: center;
    align-items: center;
`;
export const SelectModelList = styled(FormControlLabel)`
    padding: 5px 10px;
`;
