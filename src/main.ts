import "./main.scss";
import Calculator from "./calculator";

const digitRegex = new RegExp(/[0-9.]/);
const opperatorRegex = new RegExp(/[+\-x÷]/);
const trigRegex = new RegExp(/\b(sin|cos|tan)\b/);
const brackets = ["(", ")"];
const defaultOutput = "It's Mathin Time";

const calculator = new Calculator();

//FETCHING AND VALIDATING ALL NEEDED ELEMENTS
const buttons = document.querySelectorAll(".buttons__button");
const userOutput = document.querySelector<HTMLHeadElement>(".display__text");
const guardImage = document.querySelector<HTMLImageElement>("#Guard");
const guardAudio = document.querySelector<HTMLAudioElement>("#Stop");
const main = document.querySelector<HTMLElement>(".calculator");
if (
  buttons.length === 0 ||
  !userOutput ||
  !guardImage ||
  !guardAudio ||
  !main
) {
  throw new Error("Error with one or more query selectors");
}

const resetOutput = (resetString: string = defaultOutput) => {
  userOutput.textContent = resetString;
};

const addToOutput = (stringToAdd: string) => {
  if (userOutput.innerText === defaultOutput)
    userOutput.innerText = stringToAdd;
  else userOutput.innerText += stringToAdd;
};

//CHECKS IF THE CURRENT EXPRESSION INVOLVES DIVIDING BY ZERO, PLAYS EASTER EGG IF TRUE
const divideByZeroCheck = () => {
  if (
    userOutput.innerText.includes("÷0") &&
    !userOutput.innerText.includes("÷0.")
  ) {
    guardAudio.play();
    guardImage.style.display = "unset";
    guardImage.style.zIndex = "10";
    main.style.display = "none";
  }
};

const handleButtonPress = (event: Event) => {
  const button = event.target as HTMLButtonElement;
  const input = button.innerHTML;

  //CHECKS WHICH TYPE OF BUTTON HAS BEEN PRESSED AND PERFORMS CORRESPONDING ACTIONS
  if (
    digitRegex.test(input) ||
    opperatorRegex.test(input) ||
    brackets.includes(input)
  ) {
    addToOutput(input);
  } else if (trigRegex.test(input)) {
    addToOutput(`${input}(`);
  } else if (input === "C") {
    resetOutput();
  } else if (input === "%") {
    divideByZeroCheck();
    const result = (
      calculator.calculate(userOutput.innerText) / 100
    ).toString();
    resetOutput(result);
  } else {
    // FINAL CASE THE INPUT IS "="
    divideByZeroCheck();
    const result = calculator.calculate(userOutput.innerText).toString();
    resetOutput(result);
  }
};

buttons.forEach((button) => {
  button.addEventListener("click", handleButtonPress);
});
