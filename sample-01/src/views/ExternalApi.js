import React, { useState } from "react";
import Preguntas from "../components/Preguntas";
import { useAuth0, withAuthenticationRequired, user } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";

export const ExternalApiComponent = () => {
  const { apiOrigin = "http://localhost:3001", audience } = getConfig();

  const [state, setState] = useState({
    showResult: false,
    apiMessage: "",
    error: null,
  });
  const {user} = useAuth0();
  const {
    getAccessTokenSilently,
    loginWithPopup,
    getAccessTokenWithPopup,
  } = useAuth0();

  

  
  

const checkUser  = () => {
  console.log(user.email)
  fetch(`https://us-central1-cov-games.cloudfunctions.net/addUser?user=${user.email}` )
    .then (res => res.json())
    .then(data =>{
        console.log(data);
    })
} 
  return ( 
    <div>
    {checkUser()}
      <Preguntas></Preguntas>
    </div>
  );
};

export default withAuthenticationRequired(ExternalApiComponent, {
  onRedirecting: () => <Loading />,
});
