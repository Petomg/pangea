import React, { useState, useEffect } from "react";
import axios from 'axios';
import { ButtonV, Result } from "../styled-components/UrnStyles";

function Urn(props){
    const [posVotes, setPosVotes] = useState(0);
    const [negVotes, setNegVotes] = useState(0);
    const [isClosed, setIsClosed] = useState(false);
    const [urnID, setUrnID] = useState("");

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);


    useEffect(() => {
        if (props.urnid != undefined){
            console.log(`http://localhost:5000/voting/${props.urnid}`);
            axios.get(`http://localhost:5000/voting/${props.urnid}`)
            .then(
                (result) => {
                setIsLoaded(true);
                setPosVotes(result.data.posVotes);
                setNegVotes(result.data.negVotes);
                setIsClosed(result.data.isClosed);
                setUrnID(result.data._id);
                },
                (error) => {
                setIsLoaded(true);
                setError(error);
                }
            )
        }
    }, [props.urnid]);
        
    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {

        return(
            <div id='urn'>
                <Result percentage={String(get_percentage())}></Result>
                <p>Positive: {posVotes} | Negative: {negVotes}</p>
                <ButtonV positive closed={isClosed} onClick={(e) => sendVote(e, urnID, 'positive')}>On Favor</ButtonV>
                <ButtonV closed={isClosed} onClick={(e) => sendVote(e, urnID, 'negative')}>Against</ButtonV>
            </div>
        );
    }

    function get_percentage(){
        if ((posVotes + negVotes) > 0){
            return Math.trunc((posVotes / (posVotes + negVotes)) * 100);
        } else {
            return 0;
        }
    }

    function sendVote(event, id, type){
        axios({
          method: 'post',
          url: `http://localhost:5000/voting/${type}/${id}`,
    
        });
        if(type.localeCompare('positive') === 0){
            setPosVotes(posVotes + 1); 
        } else {
            setNegVotes(negVotes + 1);
        }
      }
    
}

export default Urn;