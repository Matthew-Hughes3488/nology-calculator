import "./main.scss";

let equation: string = "";

const digitRegex = new RegExp(/[0-9.]/);
const opperatorRegex = new RegExp(/[+\-x÷]/);
const trigRegex = new RegExp(/\b(sin|cos|tan)\b/);
const brackets = ["(", ")"];

// FETCHING AND VALIDATING ALL NEEDED ELEMENTS
const buttons = document.querySelectorAll(".buttons__button");
if (buttons.length === 0) throw new Error("Error with query all");
const userOutput = document.querySelector<HTMLHeadElement>(".calculator__output");
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

const divideByZeroCheck = () =>{
  if(equation.includes("÷0")){
    guardAudio.play();
    guardImage.style.display = "unset"
    guardImage.style.zIndex = "10"
    main.style.display = "none"
  }
}
//CHECKS IF THE '-' SIGN AT INDEX IS REFERING TO A NEGTIVE NUMBER OR A '-' OPPERAND
const isNegativeSign = (index: number): boolean => {
  return (
    equation[index] === '-' &&
    (index === 0 || opperatorRegex.test(equation[index - 1]) || equation[index - 1] === '(')
  );
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

const infixToRPN = (): string[] => {
  const tokens = equation.split(
    /(?=[+x÷()-])|(?<=[+x÷()-])|(?<=sin|cos|tan)|(?=sin|cos|tan)/g
  );
  console.log(tokens);

  if (!tokens || tokens.length === 0) {
    throw new Error("Error with tokens");
  }

  // USING SHUNTING YARD ALGO
  let queue: string[] = [];
  let stack: string[] = [];

  tokens.forEach((token, index) => {
    if (digitRegex.test(token) || isNegativeSign(index)) {
      queue.push(token);
    } else if (opperatorRegex.test(token)) {
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
      while (stack.length > 0 && stack[stack.length - 1] !== "(") {
        queue.push(stack.pop()!);
      }
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
  const tokens = infixToRPN();
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
