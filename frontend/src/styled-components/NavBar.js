import styled from 'styled-components';

const NavBar = styled.ul`
    display: flex; 
    justify-content: space-between;
    margin-top: 0;
    margin-bottom: 0;
    background-color: #4F89B0;
    text-decoration:none;
    padding: 0.5em;
`;

const NavBarItem = styled.li`
    display: inline-block;
    text-decoration:none;
    font-size: 1.2em;
    font-weight: bold;
    padding: 1em;
    margin-left: 1em;
    color: white;

    &:hover {
        background-color: #329DDB;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.1);
        border-radius: 2em;
    }
`;

const MainTitle = styled.h1`
    display: inline-block;
    font-family: 'Lexend Mega', sans-serif;
    margin: 0em;
    font-size: 1.6em;
    padding:0.5em;
    background-color: white;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.6);
`;

export {
    NavBar,
    NavBarItem,
    MainTitle
}

