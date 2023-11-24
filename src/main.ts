import './main.scss'

let equation: string = '';
let result: number = 0;
const digitRegex = new RegExp(/^[0-9]$/);
const operatorRegex = new RegExp(/[+\-x÷=%C]/);

const buttons = document.querySelectorAll(".buttons__button");
if(buttons.length === 0) throw new Error("Error with query all");

const userOutput = document.querySelector('.calculator__output');
if(!userOutput) throw new Error("Error with query selector");


const addToUserOutput = (update: string) =>{
    userOutput.textContent += update;
}

const handleButtonPress = (event:Event) =>{
    const input = event.target as HTMLButtonElement;
    const buttonInput = input.innerHTML;

    // REPLACE WITH PROPER CODE LATER
    if(digitRegex.test(buttonInput)) addToUserOutput(buttonInput);
    else if(operatorRegex.test(buttonInput)) alert("Is a operator");
}

buttons.forEach(button =>{
    button.addEventListener("click", handleButtonPress);
})