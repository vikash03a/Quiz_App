import React from "react";
export function renderHTML(rawHTML) {
  return React.createElement("span", {
    dangerouslySetInnerHTML: { __html: rawHTML }
  });
}

export function handleChosenAnswer(element, parentIndex, chosenAnswers) {
  const selectedAnswerInt = +element.currentTarget.value;
  let updatedAnswers = [...chosenAnswers];

  updatedAnswers[parentIndex] = selectedAnswerInt;
  return updatedAnswers;
}

export function calculateResult(correctAnswers, chosenAnswers) {
  let result = 0;
  correctAnswers.forEach((correctAnswer, index) => {
    if (chosenAnswers[index] === correctAnswer) result++;
  });
  return result;
}

export function scrollToElem(elemId) {
  const elem = document.getElementById(elemId);
  elem.scrollIntoView({ behavior: "smooth" });
}
