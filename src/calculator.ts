class Calculator {
  private expression: string[] = [];
  private static digitRegex = new RegExp(/[0-9.]/);
  private static opperatorRegex = new RegExp(/[+\-x÷]/);
  private static trigRegex = new RegExp(/\b(sin|cos|tan)\b/);
  private static brackets = ["(", ")"];

  private replaceDoubleNegatives = (infixExpression: string[]): string[] => {
    const modifiedExpression = [];

    for (let i = 0; i < infixExpression.length; i++) {
      const token = infixExpression[i];

      if (token !== "-") {
        modifiedExpression.push(token);
      } else {
        //IF A '-' IS ECOUNTERED, CHECK THE NEXT TOKEN FOR ANOTHER '-'
        if (infixExpression[i + 1] === "-") {
          modifiedExpression.push("+");
          //SKIP THE NEXT TOKEN
          i++;
        } else {
          modifiedExpression.push(token);
        }
      }
    }

    return modifiedExpression;
  };

  private getPrecedence = (operator: string) => {
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
  };
  private handleOperator = (
    token: string,
    stack: string[],
    queue: string[]
  ) => {
    //EMPTY STACK OF OPERATORS WITH LOWER PRECEDENCE THAN THE CURRENT TOKEN,
    //THEN ADD TOKEN TO THE STACK
    while (
      stack.length > 0 &&
      this.getPrecedence(stack[stack.length - 1]) >= this.getPrecedence(token)
    ) {
      queue.push(stack.pop()!);
    }
    stack.push(token);
  };

  private handleClosingParenthesis = (
    token: string,
    stack: string[],
    queue: string[]
  ) => {
    //EMPTY STACK OF ALL OPPERATORS UNTIL A LEFT BRACKET IS ENCOUNTERED
    while (stack.length > 0 && stack[stack.length - 1] !== "(") {
      queue.push(stack.pop()!);
    }
    //REMOVE LEFT BRACKET
    stack.pop();
  };

  private isNegativeNumber = (index: number, tokens: string[]): boolean => {
    // Check if the current token is a minus sign and if it is either the first character,
    // or it follows an operator or an opening parenthesis
    return (
      tokens[index] === "-" &&
      (index === 0 ||
        Calculator.opperatorRegex.test(tokens[index - 1]) ||
        tokens[index - 1] === "(")
    );
  };

  //CONVERTS A INFIX EQUATION TO THE REVERSE POLISH NOTATION FORMAT
  // I.E. 5 + 3 --> 5 3 +
  private infixToRPN = (tokens: string[]): string[] => {
    if (!tokens || tokens.length === 0) {
      throw new Error("Error with tokens");
    }

    // USING SHUNTING YARD ALGO
    let queue: string[] = [];
    let stack: string[] = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (this.isNegativeNumber(i, tokens)) {
        const negativeNumber = `-${tokens[++i]}`;
        queue.push(negativeNumber);
      } else if (Calculator.digitRegex.test(token)) {
        queue.push(token);
      } else if (Calculator.opperatorRegex.test(token)) {
        this.handleOperator(token, stack, queue);
      } else if (token === "(") {
        stack.push(token);
      } else if (token === ")") {
        this.handleClosingParenthesis(token, stack, queue);
      } else if (Calculator.trigRegex.test(token)) {
        stack.push(token);
      }
    }

    while (stack.length > 0) {
      queue.push(stack.pop()!);
    }

    return queue;
  };

  //TAKES AN EQUATION IN REVERSE POLISH NOTATION AND RETURNS ITS RESULT
  private evaluateRPN = (tokens: string[]): number => {
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
        //PUSH TOKEN TO STACK IF IT'S AN OPERAND
      } else stack.push(Number(token));
    });

    return stack[0];
  };
}