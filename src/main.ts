import "./main.scss";

let equation: string = "";

const digitRegex = new RegExp(/[0-9.]/);
const opperatorRegex = new RegExp(/[+\-x÷]/);

// FETCHING AND VALIDATING ALL NEEDED ELEMENTS
const buttons = document.querySelectorAll(".buttons__button");
if (buttons.length === 0) throw new Error("Error with query all");
const userOutput = document.querySelector(".calculator__output");
if (!userOutput) throw new Error("Error with query selector");

const resetOutput = (resetString: string = "") => {
  userOutput.textContent = resetString;
};

const addToOutput = (stringToAdd: string) => {
  userOutput.textContent += stringToAdd;
};

const addToEquation = (stringToAdd: string) => {
  equation += stringToAdd;
};

const resetEquation = () => {
  equation = "";
};

const resetCalculator = () => {
  resetEquation();
  resetOutput();
};

function getPrecedence(operator: string) {
  switch (operator) {
    case "+":
    case "-":
      return 1;
    case "x":
    case "÷":
      return 2;
    default:
      return 0;
  }
}

const infixToRPN = (): string[] => {
  const tokens = equation.split(/(?=[+x÷-])|(?<=[+x÷-])/g);

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
      while (
        stack.length > 0 &&
        getPrecedence(stack[stack.length - 1]) >= getPrecedence(token)
      ) {
        queue.push(stack.pop()!);
      }
      stack.push(token);
    }
  });
  while (stack.length > 0) {
    queue.push(stack.pop()!);
  }
  return queue;
};

const evaluateRPN = () => {
  const tokens = infixToRPN();

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
    } else stack.push(Number(token));
  });

  equation = stack[0].toString();
  return stack[0];
};

const handleButtonPress = (event: Event) => {
  const input = event.target as HTMLButtonElement;
  const buttonInput = input.innerHTML;

  if (digitRegex.test(buttonInput) || opperatorRegex.test(buttonInput)) {
    addToOutput(buttonInput);
    addToEquation(buttonInput);
  } else if (buttonInput === "C") {
    resetCalculator();
  } else if (buttonInput === "%") {
    resetOutput((evaluateRPN() / 100).toString());
  } else {
    resetOutput(evaluateRPN().toString());
    resetEquation();
  }
};

buttons.forEach((button) => {
  button.addEventListener("click", handleButtonPress);
});
