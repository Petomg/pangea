import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import env from "react-dotenv";


const Profile = () => {
    let [userFields, setUserFields] = useState({});
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    let {id} = useParams();
    console.log(id);

    useEffect(() => {
            axios.get(`${env.API_URL}/user/${id}`)
              .then(
                (result) => {
                  setIsLoaded(true);
                  setUserFields(result.data);
                },
                (error) => {
                  setIsLoaded(true);
                  setError(error);
                }
              )
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
          return (
            <div>
                <h1>{userFields.name}</h1>
                <h3>{userFields.email}</h3>
            </div>
          );
      }

};

export default Profile;