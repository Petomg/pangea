import styled from 'styled-components';

const Title = styled.h1`
  font-size: 2em;
  text-align: center;
  color: #4F89B0;
`;

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.div`
  padding: 4em;
`;

const ButtonS = styled.a`
    text-decoration:none;
    padding: 0.7em;
    background-color: ${props => props.primary ? "#4F89B0" : "#C9401A"};
    color: white;
    border-radius: 0.3em;
    margin: 1em;
    cursor: pointer;
`;

const TopicList = styled.ul`
    text-decoration:none;
    padding: 1.5em;
`;

const Topic = styled.li`
    display: inline-block;
    text-decoration:none;
    padding: 0.5em;
    color: white;
    background-color: #B3594E;
    border-radius: 4em;

`;

const Card = styled.div`
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.6);
    transition: 0.3s;
    padding: 2em;
    margin: 3em;

`;

const Banner = styled.div`

    padding: 3em;
    background-color: #D7F1FE;
`;

const BannerBtn = styled.a`
    padding:1em;
    margin: auto;
    background-color: #4F89B0;
    color: white;
    font-weight: bold;
    font-size: 2em;
    text-decoration: none;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.5);
    transition: 0.3s;
    border-radius:0.1em;

    &:hover {
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.8);
    }


`;

const CommentSection = styled.form`
    margin-top: 3em;
`;

const CommentBox = styled.textarea`
    border-radius: 0.5em;
    width: 50%;
    min-width: 200px;
`;

export {
    Title,
    Wrapper,
    ButtonS,
    TopicList,
    Topic,
    Card,
    Banner,
    BannerBtn,
    CommentSection,
    CommentBox
}