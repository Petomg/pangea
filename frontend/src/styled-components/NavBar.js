import styled from 'styled-components';

const NavBar = styled.ul`
    margin-top: 0;
    display: block;
    background-color: #4F89B0;
    text-decoration:none;
    padding: 1.3em;
    text-align: left;
`;

const NavBarItem = styled.li`
    display: inline-block;
    text-decoration:none;
    font-size: 1.2em;
    font-weight: bold;
    padding: 0.5em;
    margin-left: 1em;
    color: white;

    &:hover {
        background-color: #329DDB;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.1);
    }
`;


export {
    NavBar,
    NavBarItem
}

