import React, { useState, useEffect } from "react";
import axios from 'axios';
import { ButtonV, Result, ResLabel } from "../styled-components/UrnStyles";

import env from "react-dotenv";
import * as general from "../operational/general_functionality";

import Cookies from 'universal-cookie';
const cookies = new Cookies();

function Urn(props){
    const [posVotes, setPosVotes] = useState(0);
    const [negVotes, setNegVotes] = useState(0);
    const [isClosed, setIsClosed] = useState(false);
    const [urnID, setUrnID] = useState("");

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);


    useEffect(() => {
        if (props.urnid != undefined){
         
            axios.get(`${env.API_URL}/voting/${props.urnid}`)
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
                <div>
                    <ResLabel positive>{posVotes}</ResLabel>
                    <ResLabel>{negVotes}</ResLabel>
                </div>
                {general.isLoggedIn() &&
                    <div>
                        <ButtonV positive closed={isClosed} onClick={(e) => sendVote(e, urnID, 'positive')}>On Favor</ButtonV>
                        <ButtonV closed={isClosed} onClick={(e) => sendVote(e, urnID, 'negative')}>Against</ButtonV>
                    </div>
                }
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
          url: `${env.API_URL}/voting/${type}/${id}`,
          data: {
            user_token: cookies.get("nToken")
          }
    
        }).then((urn) => {
            console.log(urn);
            setPosVotes(urn.data.posVotes);
            setNegVotes(urn.data.negVotes);
        });
      }
    
}

export default Urn;