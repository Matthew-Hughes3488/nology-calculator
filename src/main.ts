import './main.scss'

let mathExpression: string = '';
let result: number = 0;
const digitRegex = new RegExp(/[0-9]/);
const symbolRegeex = new RegExp(/^[+\-x÷]$/);

const buttons = document.querySelectorAll(".buttons__button");
if(buttons.length === 0) throw new Error("Error with query all");

const handleButtonPress = (event:Event) =>{
    const input = event.target as HTMLButtonElement;
    const buttonInput = input.innerHTML;

    // REPLACE WITH PROPER CODE LATER
    if(digitRegex.test(buttonInput)) alert("Is a number");
    else if(symbolRegeex.test(buttonInput)) alert("Is a symbol");
}

buttons.forEach(button =>{
    button.addEventListener("click", handleButtonPress);
})