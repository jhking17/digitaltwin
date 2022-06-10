import { Modal } from "@material-ui/core";
import styled from "styled-components";

export const Block = styled(Modal)`
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`;
export const Inner = styled.div`
    color: black;
    display: flex;
    background-color: white;
    border: 5px solid #0a8c8c;
    border-radius: 1em;
    min-width: 300px;
    max-width: 500px;
    height: 75%;
`;
export const Form = styled.form`
    font-size: 15px;
    font-family: inherit;
    font-weight: bold;
    width: 100%;
    height: 100%;
`;
export const MarkerNameInput = styled.div`
    font-family: inherit;
    font-weight: bold;
    color: black;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
`;
export const Title = styled.h1`
    display: flex;
    justify-content: center;
    width: 100%;
`;
export const Input = styled.input`
    width: 100%;
    border: 5px solid #0a8c8c;
    height: 30px;
    margin: 15px;
    border-radius: 1em;
`;
export const Textarea = styled.textarea`
    border: 5px solid #0a8c8c;
    font-family: inherit;
    margin: 15px;
    border-radius: 15px;
    min-height: 200px;
    justify-content: center;
    text-align: center;
    width: 100%;
    color: black;
`;
export const Uploader = styled.input`
    background-color: white;
    display: flex;
    height: 25px;
    width: 100%;
    padding: 0 10px;
    margin: 15px;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    border: 5px solid #0a8c8c;
    border-radius: 5px;
    overflow: hidden;
`;
export const ButtonsWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
`;
export const Button = styled.button`
    width: 20%;
    cursor: pointer;
    background-color: #0e3434;
    border: none;
    border-radius: 15px;
    box-shadow: 0 3px #999;
    color: white;
    height: 30px;
`;
