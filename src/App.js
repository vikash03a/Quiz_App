import React, { Fragment, useState, useContext } from "react";
import {
  renderHTML,
  scrollToElem,
  handleChosenAnswer,
  calculateResult
} from "./utilities";
import { Store, useAppContext } from "./AppContext";
import "./styles.css";
import data from "./data.json";

const correctAnswers = [2, 0, 0, 0, 0, 1, 0, 2, 1, 1];
const totalQuestions = data.results.length;

export default function App() {
  const [chosenAnswers, setChosenAnswers] = useState([]);

  function renderQuestions() {
    return data.results.map((result, index) => (
      <Question key={index} result={result} index={index} />
    ));
  }

  return (
    <Store.Provider value={{ chosenAnswers, setChosenAnswers }}>
      <Start />
      {renderQuestions()}
      <Finish />
    </Store.Provider>
  );
}

export function Question({ result, index }) {
  return (
    <section id={`question-${index}`} className="fullpage-center">
      <h3>
        {index + 1}. {renderHTML(result.question)}
      </h3>
      <div className="answers">
        <Answers result={result} parentIndex={index} />
      </div>
      <section className="btn-group" style={{ display: "flex" }}>
        {index !== 0 && (
          <Button
            text="prev"
            func={() => scrollToElem(`question-${index - 1}`)}
          />
        )}
        {index !== totalQuestions - 1 && (
          <Button
            text="next"
            func={() => scrollToElem(`question-${index + 1}`)}
          />
        )}
        {index === totalQuestions - 1 && (
          <Button text="finish" func={() => scrollToElem("finish")} />
        )}
      </section>
    </section>
  );
}

export function Answers({ result, parentIndex }) {
  const combinedAnswers = [...result.incorrect_answers, result.correct_answer];
  combinedAnswers.sort();
  return combinedAnswers.map((answer, index) => (
    <Answer
      key={index}
      answer={answer}
      index={index}
      parentIndex={parentIndex}
    />
  ));
}

function Answer({ answer, index, parentIndex }) {
  const { chosenAnswers, setChosenAnswers } = useAppContext();
  return (
    <Fragment>
      <input
        type="radio"
        name={`question-${parentIndex}`}
        onChange={(element) =>
          setChosenAnswers(
            handleChosenAnswer(element, parentIndex, chosenAnswers)
          )
        }
        value={index}
      />
      {renderHTML(answer)}
      <br />
    </Fragment>
  );
}

function Button({ text, func }) {
  return (
    <button type="button" onClick={func}>
      {text}
    </button>
  );
}

function Start() {
  return (
    <section className="fullpage-center" id="start">
      <h1>Video games</h1>
      <h2>How much you know about them?</h2>
      <Button text="Let's go!" func={() => scrollToElem("question-0")} />
    </section>
  );
}

function Finish() {
  const { chosenAnswers } = useContext(Store);
  const textCompleted = (
    <Fragment>
      <h3>Well done!</h3>
      <h4>
        You scored {calculateResult(correctAnswers, chosenAnswers)} out of{" "}
        {totalQuestions}
      </h4>
      <Button text="start over" func={() => window.location.reload()} />
    </Fragment>
  );

  const textIncomplete = (
    <Fragment>
      <h4>Opps, looks like you haven't answered all the questions</h4>
      <p>Scroll up to see which questions you've missed out </p>
    </Fragment>
  );
  const answeredQuestions = chosenAnswers.filter((ar) => ar !== undefined)
    .length;

  return (
    <section className="fullpage-center" id="finish">
      {answeredQuestions === totalQuestions ? textCompleted : textIncomplete}
    </section>
  );
}
