import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import data from "./data.json";
import App, { Question, Answers } from "./App";
import * as Store from "./AppContext";

Enzyme.configure({ adapter: new Adapter() });

describe("App", () => {
  const wrapper = mount(<App />);

  test("Renders all the Questions and Answers provided in the data", () => {
    const questionComp = wrapper.find("Question");
    const answersComp = wrapper.find("Answers");
    const totalQuestions = data.results.length;

    expect(questionComp).toHaveLength(totalQuestions);
    expect(answersComp).toHaveLength(totalQuestions);
  });

  test("Contains a Start and a Finish page", () => {
    const startComp = wrapper.find("Start");
    const finishComp = wrapper.find("Finish");

    expect(startComp.exists()).toBeTruthy();
    expect(finishComp.exists()).toBeTruthy();
  });
});

describe("Question", () => {
  jest.spyOn(Store, "useAppContext");

  const getButton = (question) => question.find("Button");
  const wrapperProps = (index) => ({ index, result: data.results[0] });
  const wrapper = (props) => mount(<Question {...props} />);

  test("Should have only one Next button for the first question", () => {
    const firstQuestion = wrapper(wrapperProps(0));

    expect(getButton(firstQuestion).text()).toEqual("next");
    expect(getButton(firstQuestion).length).toEqual(1);
  });

  test("Should have a Prev and Finish button for the last question", () => {
    const lastQuestionIdx = data.results.length - 1;
    const lastQuestion = wrapper(wrapperProps(lastQuestionIdx));

    expect(getButton(lastQuestion).get(0).props.text).toEqual("prev");
    expect(getButton(lastQuestion).get(1).props.text).toEqual("finish");
    expect(getButton(lastQuestion).length).toEqual(2);
  });

  test("Should have a Prev and Next button for middle questions", () => {
    const midQuestionIdx = data.results.length / 2 - 1;
    const midQuestion = wrapper(wrapperProps(midQuestionIdx));

    expect(getButton(midQuestion).get(0).props.text).toEqual("prev");
    expect(getButton(midQuestion).get(1).props.text).toEqual("next");
    expect(getButton(midQuestion).length).toEqual(2);
  });
});

describe("Answers", () => {
  const randomNum = () => Math.floor(Math.random() * 10);
  const questionIdx = randomNum();
  const wrapperProps = {
    result: data.results[questionIdx],
    parentIndex: questionIdx
  };
  const wrapper = mount(<Answers {...wrapperProps} />);

  test("Should have at least two Answer components", () => {
    const answerComps = wrapper.find("Answer");

    expect(answerComps.length).toBeGreaterThanOrEqual(2);
  });
});
