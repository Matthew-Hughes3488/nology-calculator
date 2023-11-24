import './main.scss'

let mathExpression: string = '';
let result: number = 0;
const digitRegex = new RegExp(/^[0-9]$/);
const operatorRegex = new RegExp(/[+\-x÷=%C]/);

const buttons = document.querySelectorAll(".buttons__button");
if(buttons.length === 0) throw new Error("Error with query all");

const handleButtonPress = (event:Event) =>{
    const input = event.target as HTMLButtonElement;
    const buttonInput = input.innerHTML;

    // REPLACE WITH PROPER CODE LATER
    if(digitRegex.test(buttonInput)) alert("Is a number");
    else if(operatorRegex.test(buttonInput)) alert("Is a operator");
}

buttons.forEach(button =>{
    button.addEventListener("click", handleButtonPress);
})