import {Modal, Input} from "@material-ui/core";
import styled from "styled-components";

export const Block = styled(Modal)`
    border-radius: 10px;
    display: block;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`;
export const Inner = styled.div`
    color: black;
    display: inline-block;
    background-color: white;
    border: 5px solid #0a8c8c;
    border-radius: 1em;
    width: 80%;
    height: 80%;
`;

export const Content = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
    display : flex;
    justify-content : center;
    align-items : center;
    flex-direction : column;
    img {
        width: 40px;
        height: 40px;
        margin-left: 10px;
    }
`;
export const Title = styled.div`
    font-size: 30px;
    font-family: inherit;
    font-weight: bold;
    position: center;
    margin: auto;
    width: 94%;
    padding: 20px;
    text-align: center;
    display: flex;
    justify-content : center;
    align-items : center;
    flex-direction: row;
    gap : 20px;
`;

export const TitleSubText = styled.div`
    font-size : 18px;
    font-weight: 400;
    color : #333;
`;

export const TitleInput = styled(Input)`
    font-size: 24px !important;
    font-family: inherit;
    font-weight: bold;
    justify-content: center;
    position: center;
    padding : 15px 10px 5px 10px;
    text-align: center;
    width : 30%;
`;

export const InputContainer = styled.div`
    width : 96%;
    flex : 10;
    display : flex;
    justify-content : center;
    align-items : flex-start;
    flex-direction : row;
    padding : 10px;
    gap : 20px;
    margin-left : 20px;
    margin-top : 20px;
`;

export const InputSubText = styled.div`
    font-size : 18px;
    font-weight: 400;
    color : #333;
`;

export const ReviewTextBox = styled.div`
    font-size : 20px;
    font-weight : 400;
    width : 60%;
    height : 100%;
`;

export const ButtonsWrapper = styled.div`
    flex : 1;
    width: 100%;
    padding: 5px;
    margin-bottom : 10px;
    justify-content: center;
    display: flex;
    justify-content: space-evenly;
`;
export const Button = styled.button`
    display: inline;
    padding: 0px 40px;
    justify-content: center;
    font-size: 20px;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    outline: none;
    color: #fff;
    background-color: #0e3434;
    border: none;
    border-radius: 15px;
    box-shadow: 0 5px #999;
`;
