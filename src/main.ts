import "./main.scss";

let equation: string = "";
let firstNumber: number;
let secondNumber: number;
let opperator: string;

const digitRegex = new RegExp(/^[0-9 .]$/);
const operatorRegex = new RegExp(/[+\-x÷=%C]/);

// FETCHING AND VALIDATING ALL NEEDED ELEMENTS
const buttons = document.querySelectorAll(".buttons__button");
if (buttons.length === 0) throw new Error("Error with query all");
const userOutput = document.querySelector(".calculator__output");
if (!userOutput) throw new Error("Error with query selector");

const resetOutput = (resetString: string = "") =>{
    userOutput.textContent = resetString;
}

const addToOutput = (stringToAdd: string) =>{
    userOutput.textContent += stringToAdd;
}

const addToEquation = (stringToAdd: string) =>{
    equation += stringToAdd;
}

const resetEquation = () =>{
    equation = "";
}

const handleButtonPress = (event: Event) => {
  const input = event.target as HTMLButtonElement;
  const buttonInput = input.innerHTML;

  if(digitRegex.test(buttonInput)){
    addToOutput(buttonInput);
    addToEquation(buttonInput);
  }
};

buttons.forEach((button) => {
  button.addEventListener("click", handleButtonPress);
});
