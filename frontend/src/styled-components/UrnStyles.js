import styled from 'styled-components';

const ButtonV = styled.a`
    text-decoration:none;
    padding: 0.7em;
    background-color: ${props => props.positive ? "#28BF36" : "#C9401A"};
    color: white;
    ${props => props.closed ? "pointer-events: none;" : ""}
    cursor: ${props => props.closed ? "default" : "pointer"};
    border-radius: 0.3em;
    cursor: pointer;
`;

const Result = styled.div`
    width:10em;
    height:3.5em;
    color: white;
    display:inline-block;
    background-color:#DF9489;
    position:relative;
    font-size: 1em;
    font-weight: bold;
    border-radius: 0.5em;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.6);
    margin-top: 3em;
    

    &:after {
        text-align: center;
        vertical-align: middle;
        content: "${props => props.percentage}%";
        position:absolute;
        background:#28BFB3;
        top:0; bottom:0;
        left:0; 
        
        height:3.5em;
        width: ${props => props.percentage}%; 
    }
`;

export {
    ButtonV,
    Result
}