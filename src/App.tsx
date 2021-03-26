import React, { useState } from 'react';
// Components
import QuestionCard from './components/QuestionCard';
// Import fetch API component
import { fetchQuizQuestions } from './API';
// Import the parameter types of the function
import {QuestionState, Difficulty} from './API';
// Styles
import {GlobalStyle,Wrapper} from './App.styles';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 50;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  console.log(questions);

  // create function to start quiz
  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);
    const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.HARD);
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  }

  // create function to check answer
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver){
      //Users answer
      const answer = e.currentTarget.value;
      // check the answer against the correct answer
      const correct = questions[number].correct_answer === answer;
      // Add the score if it is the correct answer
      if(correct){
        setScore(prev => prev + 1);
      }
      // save the answer in the array for the user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      // set user answers
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  }

  // create function for next question
  const nextQuestion = () => {
    // Move on to the next question if not the last question
    const nextQuestion = number + 1;
    if(nextQuestion === TOTAL_QUESTIONS){
      setGameOver(true);
    }else {
      setNumber(nextQuestion); 
    }
  }

  return (
    <>
    <GlobalStyle />
    <Wrapper>
      <h2>GENERAL KNOWLEDGE</h2>
      {/* if gameover or user answers equals total questions */}
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? 
      (
      <button className="start" onClick={() => startTrivia()}>
        Start Quiz
      </button>
      ) : null}
      
      {/* if game is not over then give me the score */}
      {!gameOver ? (<p className="score">Score: {score}</p>) : null}
      
      {loading && <p>Loading Questions ...</p>}
      
      {/* if not loading and if not game over */}
      {!loading && !gameOver && (
        <QuestionCard 
          questionNr={number + 1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        />
      )}
      
      {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (
          <button className="next" onClick={() => nextQuestion()}>
            Next Question
          </button>
      ) : null}
      
    </Wrapper>
    </>
  );
}

export default App;
