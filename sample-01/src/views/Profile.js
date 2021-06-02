import React , {useState, useEffect }from "react";
import { Container, Row, Col } from "reactstrap";

import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { render } from "react-dom";


const USER_URL = "https://opentdb.com/api.php?amount=3&category=27&difficulty=easy&type=multiple";
const user_URL = "https://us-central1-cov-games.cloudfunctions.net/getUserByName?user=${user.email}";
export const ProfileComponent = () => {
  const { user } = useAuth0();
  const [ userApi , setUserApi] = useState([]);

  useEffect(() => {
    //
    fetch(`https://us-central1-cov-games.cloudfunctions.net/getUserByName?user=${user.email}` )
    .then (res => res.json())
    .then(data =>{
      setUserApi(data);
    });
}, [])

console.log(userApi);

  return userApi ? (

    <Container >
    <Container className = "mb-5">
      <Row>
      <h1  className = "text-3xl font-bold"> SCORE {userApi.points}</h1>
      </Row>
    </Container>
    
    <Container className="mb-5">
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={2}>
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </Col>
        <Col md>
          <h2>{user.name}</h2>
          <p className="lead text-muted">{user.email}</p>
        </Col>
      </Row>
      <Row>
        <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
      </Row>
    </Container>
    </Container>
  ) : (
    <h1>Loading ...</h1>
  )
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
