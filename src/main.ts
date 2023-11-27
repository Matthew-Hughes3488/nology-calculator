import "./main.scss";

let equation: string = "";

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

const addToEquation = (stringToAdd: string) => {
  equation += stringToAdd;
};

const resetEquation = (resetString: string = "") => {
  equation = resetString;
};

const resetCalculator = () => {
  resetEquation();
  resetOutput();
};

//CHECKS IF THE CURRENT EXPRESSION INVOLVES DIVIDING BY ZERO, PLAYS EASTER EGG IF TRUE
const divideByZeroCheck = () => {
  if (equation.includes("÷0")) {
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
    else {
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

const infixToRPN = (tokens :string[]): string[] => {
  if (!tokens || tokens.length === 0) {
    throw new Error("Error with tokens");
  }

  // USING SHUNTING YARD ALGO
  let queue: string[] = [];
  let stack: string[] = [];

  tokens.forEach((token) => {
    if (digitRegex.test(token)) {
      queue.push(token);
    } else if (opperatorRegex.test(token)) {
      //EMPTY STACK OF OPPERATORS WITH LOWER PRECEDENCE THAN THE CURRENT TOKEN, THEN ADD TOKEN
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
  });

  while (stack.length > 0) {
    queue.push(stack.pop()!);
  }
  return queue;
};

const evaluateRPN = () => {
  divideByZeroCheck();
  const equationArr = equation.split(
    /(?=[+x÷()-])|(?<=[+x÷()-])|(?<=sin|cos|tan)|(?=sin|cos|tan)/g
  );

  const replacedNegatives = replaceDoubleNegatives(equationArr)
  
  const tokens = infixToRPN(replacedNegatives);
  console.log(tokens);

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

const handleButtonPress = (event: Event) => {
  const input = event.target as HTMLButtonElement;
  const buttonInput = input.innerHTML;

  if (
    digitRegex.test(buttonInput) ||
    opperatorRegex.test(buttonInput) ||
    brackets.includes(buttonInput)
  ) {
    addToOutput(buttonInput);
    addToEquation(buttonInput);
  } else if (trigRegex.test(buttonInput)) {
    addToOutput(`${buttonInput}(`);
    addToEquation(`${buttonInput}(`);
  } else if (buttonInput === "C") {
    resetCalculator();
  } else if (buttonInput === "%") {
    const result = (evaluateRPN() / 100).toString();
    resetOutput(result);
    resetEquation(result);
  } else {
    const result = evaluateRPN().toString();
    resetOutput(result);
    resetEquation(result);
  }
  console.log(equation);
};

buttons.forEach((button) => {
  button.addEventListener("click", handleButtonPress);
});

