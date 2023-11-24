import "./main.scss";

let equation: string = "";
let firstNumber: number;
let secondNumber: number;
let opperator: string;

const digitOrOpperatorRegex = new RegExp(/^[0-9.+\-x÷]$/);

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
    console.log(equation);
    
}

const resetEquation = () =>{
    equation = "";
}

const handleButtonPress = (event: Event) => {
  const input = event.target as HTMLButtonElement;
  const buttonInput = input.innerHTML;

  if(digitOrOpperatorRegex.test(buttonInput)){
    addToOutput(buttonInput);
    addToEquation(buttonInput);
  }
  else if(buttonInput === "C"){
    console.log("Add reset Calculator function here")
  }
  else{
    console.log("Add evaluate calculation expression here");
  }
};

buttons.forEach((button) => {
  button.addEventListener("click", handleButtonPress);
});
