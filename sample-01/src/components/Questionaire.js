import React from 'react';
import { Button } from 'react-bootstrap';


const Questionaire =  ( {showAnswers, handleNextQuestion, handleAnswer, data : {question, correct_answer , answers }}) => 
{
    return (
<div className = 'flex flex-col'>
<div className = "bg-gray-100 p-10 rounded-lg shadow-md">
        <h2 className = "text-2xl " dangerouslySetInnerHTML ={{__html :  question }} >
        </h2>
        </div>
        <div className = "grid grid-cols-2 gap-6 mt-6 ">
            {answers.map((answer, idx) => {
                const colorText  = showAnswers 
                ? answer === correct_answer
                    ? 'text-green-500'
                    : 'text-red-500'
                : 'text-black'    ;
                return (
                <button key = {idx} className = {` bg-gray-100 ${colorText} p-4 font-semibold rounded shadow mb-4 ` } 
                onClick = {() =>  handleAnswer (answer)}  dangerouslySetInnerHTML = {{__html:  answer}}>
                </button>)

            }
         )}
         </div>
            {showAnswers && (
         
         <button onClick = {handleNextQuestion} className = " ml-auto bg-gray-300 p-4 font-semibold rounded shadow  mb-4 mt-6 "> Next Question</button>
         )}
        
    </div>
    );
// `
};


export default Questionaire;