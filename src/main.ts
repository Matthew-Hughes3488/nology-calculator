import "./main.scss";

const digitRegex = new RegExp(/[0-9.]/);
const opperatorRegex = new RegExp(/[+\-x÷]/);
const trigRegex = new RegExp(/\b(sin|cos|tan)\b/);
const brackets = ["(", ")"];

//FETCHING AND VALIDATING ALL NEEDED ELEMENTS
const buttons = document.querySelectorAll(".buttons__button");
if (buttons.length === 0) throw new Error("Error with query all");
const userOutput = document.querySelector<HTMLHeadElement>(
  ".calculator__output"
);
if (!userOutput) throw new Error("Error with query selector");
const guardImage = document.querySelector<HTMLImageElement>("#Guard");
if (!guardImage) throw new Error("Error with query selector");
const guardAudio = document.querySelector<HTMLAudioElement>("#Stop");
if (!guardAudio) throw new Error("Error with query selector");
const main = document.querySelector<HTMLElement>(".calculator");
if (!main) throw new Error("Error with query selector");

const resetOutput = (resetString: string = "") => {
  userOutput.textContent = resetString;
};

const addToOutput = (stringToAdd: string) => {
  userOutput.textContent += stringToAdd;
};

const resetCalculator = () => {
  resetOutput();
};

//CHECKS IF THE CURRENT EXPRESSION INVOLVES DIVIDING BY ZERO, PLAYS EASTER EGG IF TRUE
const divideByZeroCheck = () => {
  if (userOutput.innerText.includes("÷0")) {
    guardAudio.play();
    guardImage.style.display = "unset";
    guardImage.style.zIndex = "10";
    main.style.display = "none";
  }
};

//TAKES AN ARRAY AND REPLACES DOUBLE NEGATIVES WITH A PLUS SIGN, THEN RETURNS A NEW ARRAY.
const replaceDoubleNegatives = (infixExpression: string[]): string[] => {
  const modifiedExpression = [];

  for (let i = 0; i < infixExpression.length; i++) {
    const token = infixExpression[i];

    if (token !== "-") {
      modifiedExpression.push(token);
    }
    else { //IF A '-' IS ECOUNTERED, CHECK THE NEXT TOKEN FOR ANOTHER '-'
      if (infixExpression[i + 1] === "-") {
        modifiedExpression.push("+");
        //SKIP THE NEXT TOKEN
        i++;
      }
      else{
        modifiedExpression.push(token)
      }
    }
  }

  return modifiedExpression;
};

//DEFINES THE PRECEDENCE FOR EACH MATHEMATICAL OPPERATOR
//THE HIGHER THE NUMBER THE HIGHER THE PRESEDENCE
function getPrecedence(operator: string) {
  switch (operator) {
    case "+":
    case "-":
      return 1;
    case "x":
    case "÷":
      return 2;
    case "sin":
    case "cos":
    case "tan":
      return 3;
    default:
      return 0;
  }
}

//CONVERTS A INFIX EQUATION TO THE REVERSE POLISH NOTATION FORMAT
// I.E. 5 + 3 --> 5 3 +
const infixToRPN = (tokens :string[]): string[] => {
  if (!tokens || tokens.length === 0) {
    throw new Error("Error with tokens");
  }

  // USING SHUNTING YARD ALGO
  let queue: string[] = [];
  let stack: string[] = [];

  for(let i = 0; i < tokens.length; i++){
    const token = tokens[i];
    
    if (digitRegex.test(token)) {
      queue.push(token);
    } else if (opperatorRegex.test(token)) {
      //EMPTY STACK OF OPPERATORS WITH LOWER PRECEDENCE THAN THE CURRENT TOKEN, 
      //THEN ADD TOKEN TO THE STACK
      while (
        stack.length > 0 &&
        getPrecedence(stack[stack.length - 1]) >= getPrecedence(token)
      ) {
        queue.push(stack.pop()!);
      }
      stack.push(token);
    } else if (token === "(") {
      stack.push(token);
    } else if (token === ")") {
      //EMPTY STACK OF ALL OPPERATORS UNTIL A LEFT BRACKET IS ENCOUNTERED
      while (stack.length > 0 && stack[stack.length - 1] !== "(") {
        queue.push(stack.pop()!);
      }
      //REMOVE LEFT BRACKET
      stack.pop();
    } else if (trigRegex.test(token)) {
      stack.push(token);
    }
  }
 

  while (stack.length > 0) {
    queue.push(stack.pop()!);
  }
  return queue;
};

//TAKES AN EQUATION IN REVERSE POLISH NOTATION AND RETURNS ITS RESULT
const evaluateRPN = (tokens : string[]) : number =>  {
  let stack: number[] = [];

  tokens.forEach((token) => {
    
    if (token === "+") {
      const number1 = stack.pop();
      const number2 = stack.pop();
      if (!number1 || !number2) throw new Error("Error with stack");

      stack.push(number1 + number2);
    } else if (token === "-") {
      const number1 = stack.pop();
      const number2 = stack.pop();
      if (!number1 || !number2) throw new Error("Error with stack");

      stack.push(number2 - number1);
    } else if (token === "x") {
      const number1 = stack.pop();
      const number2 = stack.pop();
      if (!number1 || !number2) throw new Error("Error with stack");

      stack.push(number1 * number2);
    } else if (token === "÷") {
      const number1 = stack.pop();
      const number2 = stack.pop();
      if (!number1 || !number2) throw new Error("Error with stack");

      stack.push(number2 / number1);
    } else if (token === "sin") {
      const number1 = stack.pop();
      if (!number1) throw new Error("Error with stack");

      stack.push(Math.sin(number1));
    } else if (token === "cos") {
      const number1 = stack.pop();
      if (!number1) throw new Error("Error with stack");

      stack.push(Math.cos(number1));
    } else if (token === "tan") {
      const number1 = stack.pop();
      if (!number1) throw new Error("Error with stack");

      stack.push(Math.tan(number1));
      //PUSH TOKEN TO STACK IF IT'S AN OPPERAND
    } else stack.push(Number(token));
  });

  return stack[0];
};

const processCalculation = () : number => {
  divideByZeroCheck();
  //SPLITS THE USERS INPUT INTO AN ARRAY, THEN REPLACES DOUBLE NEGATIVES, 
  //THEN COVERTS IT INTO REVERSE POLISH NOTATION
  const equationArr = userOutput.innerText.split(
    /(?=[+x÷()-])|(?<=[+x÷()-])|(?<=sin|cos|tan)|(?=sin|cos|tan)/g
  );
  const replacedNegatives = replaceDoubleNegatives(equationArr)
  const reversePolishNotationArr = infixToRPN(replacedNegatives);

  return(evaluateRPN(reversePolishNotationArr));
}

const handleButtonPress = (event: Event) => {
  const button = event.target as HTMLButtonElement;
  const input = button.innerHTML;

  if (
    digitRegex.test(input) ||
    opperatorRegex.test(input) ||
    brackets.includes(input)
  ) {
    addToOutput(input);
  } else if (trigRegex.test(input)) {
    addToOutput(`${input}(`);
  } else if (input === "C") {
    resetCalculator();
  } else if (input === "%") {
    const result = (processCalculation() / 100).toString();
    resetOutput(result);
  } else { // FINAL CASE THE INPUT IS "="
    const result = processCalculation().toString();
    resetOutput(result);
    
  }
};

buttons.forEach((button) => {
  button.addEventListener("click", handleButtonPress);
});