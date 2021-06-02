import React, { useState, useEffect } from "react";
//import {Container, Row, Col, Form , Button} from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import Questionaire from '../components/Questionaire';
import { Button } from 'react-bootstrap';


function Contest1() {

const [questions , setQuestions] = useState([]);
const [userApi, setUserApi] = useState([]);
const [currentIndex, setCurrentIndex] = useState(0);
const {user} = useAuth0();
const [score, setScore] = useState(0);
const [showAnswers, setShowAnswers]  =useState(false);
const idGame = 'O1At3SoSyGo88xDBfmpq';

const USER_TEST = "https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=multiple";

useEffect(() => {
    //`https://us-central1-cov-games.cloudfunctions.net/getQuestions?contest=${idGame}`
    //console.log(user1);
    //` ?contest=${idGame}`
    fetch(`https://us-central1-cov-games.cloudfunctions.net/getQuestions?contest=${idGame}`)
    .then (res => res.json())
    .then (data => {
        //console.log(data)
        //data.map()
        const questions = data.results.map((question) =>
        ({
            ...question, 
            answers : [
                question.correct_answer,
                ...question.incorrect_answers
            ].sort(() => Math.random() - 0.5)
        }))
        setQuestions(questions);
    });
    //
    fetch(`https://us-central1-cov-games.cloudfunctions.net/getUserByName?user=${user.email}` )
    .then (res => res.json())
    .then(data =>{
        setUserApi(data);
    })
}, [])

//console.log(questions)
//console.log(userApi);


const handleAnswer =  (answer) => {

    if (!showAnswers){ //prevent double answers 
        // check answer
        if (answer === questions[currentIndex].correct_answer) {
        //change score if correct 
            setScore(score + 1);
        }
    } 

    setShowAnswers(true);
};

function handleUser() {
    //const data = { user : user.email, points : score}

    fetch(`https://us-central1-cov-games.cloudfunctions.net/addUserPoints?user=${user.email}&points=${score}`)
    .then (res => res.json())
    .then(response =>{
        console.log(response)
        console.log("function handle USer")
    })    
}


const handleNextQuestion = () => {
    setShowAnswers(false);
    setCurrentIndex(currentIndex + 1);
}
return questions.length > 0 ? (
    //{}
    <div className = "container">
    {currentIndex >= questions.length ? (
        <div>
            <h3 className = "text-3xl font-bold">Your score in this quiz was  {score}</h3>
            {
                handleUser()
            }
            <h3 className = "text-3xl font-bold"> your total was score {userApi.points}</h3>            
             <Button variant="outline-secondary" type = "button" href = "/external-api" > Return to Contests </Button>{' '}
        </div>

        ) : (
        <Questionaire data = {questions[currentIndex]} handleAnswer = {handleAnswer}  showAnswers = {showAnswers} handleNextQuestion = {handleNextQuestion}> </Questionaire>
    )}
    </div>
    ) : (
        <h1> Loading ...</h1>
        );
}


  export default Contest1;