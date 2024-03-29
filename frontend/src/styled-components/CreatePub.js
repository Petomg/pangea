import styled from 'styled-components';

let Entry = styled.div`
    padding: 1.5em;
    display: inline-block;
    width: 80%;
    content-align: center;
`;

let Input = styled.input`
    padding: 0.5em;
    width: 30%;
    display: block;
    margin: auto;
    border-radius: 0.5em;
    min-width: 300px;
    margin-top: 1em;
`;

let TopicLabel = styled.label`
    display: inline-block;
    text-decoration:none;
    padding: 0.5em;
    color: black;
    background-color:#F7ECDF;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    border-radius: 4em;
    font-weight: bold;
    width: 5em;


`;


let TextArea = styled.textarea`
    padding-bottom: 8em;
    display: block;
    width: 30%;
    margin: auto;
    border-radius: 0.5em;
    min-width: 300px;
    margin-top: 1em;
`;

let Label = styled.label`
    font-size: 1.2em;
    font-weight: bold;
`;

const ButtonS = styled.button`
    text-decoration:none;
    padding: 0.7em;
    background-color: #4F89B0;
    color: white;
    border-radius: 0.3em;
    margin: 1em;
    cursor: pointer;
    display: block;
    margin auto;
    width: 8em;
`;

const Error = styled.h2`
    display: inline-block;
    padding: 0.5em; 
    color: white;
    background-color: red;
    border: none;
`;

export {
    Entry,
    Input,
    Label,
    ButtonS,
    TextArea,
    TopicLabel,
    Error
}