/* 
  CALCULATOR CLASS THAT PERFORMS MATHEMATICAL OPPERATIONS

  THIS CLASS PROVIDES METHODS FOR HANDLING MATHEMATICAL EXPRESSIONS, SUCH AS CONVERTING 
  INFIX EXPRESSIONS TO REVERSE POLISH NOTATOIN (RPN) AND EVALUATING RPN EXPRESSIONS
*/

class Calculator {
  private static readonly digitRegex = new RegExp(/[0-9.]/);
  private static readonly opperatorRegex = new RegExp(/[+\-x÷]/);
  private static readonly trigRegex = new RegExp(/\b(sin|cos|tan)\b/);

  /* 
  FUNCTION THAT TAKES AN ARRAY REPRESENTING AN INFIX EXPRESSION 
  AND REPLACES CONSECUTIVE DOUBLE MINUS SIGNS ('--') WITH A SINGLE PLUS SIGN ('+').
  
  @param infixExpression: AN ARRAY OF STRINGS REPRESENTING AN INFIX MATHEMATICAL EXPRESSION.
  @returns AN ARRAY OF STRINGS WITH CONSECUTIVE DOUBLE MINUS SIGNS REPLACED BY A SINGLE PLUS SIGN.

  
  Example:
  Input: ['5', '-', '-', '3', '+', '8', '*', '2']
  Output: ['5', '+', '3', '+', '8', '*', '2']
*/
  private replaceDoubleNegatives(infixExpression: string[]): string[] {
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
  }

  private getPrecedence(operator: string) {
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

  private handleOperator(token: string, stack: string[], queue: string[]) {
    //EMPTY STACK OF OPERATORS WITH LOWER PRECEDENCE THAN THE CURRENT TOKEN,
    //THEN ADD TOKEN TO THE STACK
    while (
      stack.length > 0 &&
      this.getPrecedence(stack[stack.length - 1]) >= this.getPrecedence(token)
    ) {
      queue.push(stack.pop()!);
    }
    stack.push(token);
  }

  private handleClosingParenthesis(stack: string[], queue: string[]) {
    //EMPTY STACK OF ALL OPPERATORS UNTIL A LEFT BRACKET IS ENCOUNTERED
    while (stack.length > 0 && stack[stack.length - 1] !== "(") {
      queue.push(stack.pop()!);
    }
    //REMOVE LEFT BRACKET
    stack.pop();
  }

  private isNegativeNumber(index: number, tokens: string[]): boolean {
    // CHECK IF THE CURRENT TOKEN IS A MINUS SIGN AND IF IT IS EITHER THE FIRST CHARACTER,
    // OR IT FOLLOWS AN OPERATOR OR AN OPENING PARENTHESIS
    return (
      tokens[index] === "-" &&
      (index === 0 ||
        Calculator.opperatorRegex.test(tokens[index - 1]) ||
        tokens[index - 1] === "(")
    );
  }

  /* 
  FUNCTION THAT CONVERTS AN EXPERSSION WRITTEN IN INFIX FORM TO REVERSE POLISH NOTATION (RPN)
  USING A MODIFIED SHUNTING YARD ALGORITHM
  
  @param infixExpression: AN ARRAY OF STRINGS REPRESENTING AN INFIX MATHEMATICAL EXPRESSION.
  @returns AN ARRAY OF STRINGS REPRESENTING THE INPUT EXPRESSION IN RPM
  
  EXAMPLE:
  INPUT: ['3', '+', '4', '*', '2', '/', '(', '1', '-', '5', ')']
  OUTPUT: ['3', '4', '2', '*', '+', '1', '5', '-', '/']
*/
  private infixToRPN(tokens: string[]): string[] {
    if (!tokens || tokens.length === 0) {
      throw new Error("Error with tokens");
    }

    // USING SHUNTING YARD ALGO
    let queue: string[] = [];
    let stack: string[] = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (this.isNegativeNumber(i, tokens)) {
        const negativeNumber = `-${tokens[++i]}`; // ++i TO SKIP THE NEXT TOKEN
        queue.push(negativeNumber);
      } else if (Calculator.digitRegex.test(token)) {
        queue.push(token);
      } else if (Calculator.opperatorRegex.test(token)) {
        this.handleOperator(token, stack, queue);
      } else if (token === "(") {
        stack.push(token);
      } else if (token === ")") {
        this.handleClosingParenthesis(stack, queue);
      } else if (Calculator.trigRegex.test(token)) {
        stack.push(token);
      }
    }

    while (stack.length > 0) {
      queue.push(stack.pop()!);
    }

    return queue;
  }

  /* 
  FUNCTION THAT EVALUATES AN EXPRESSION WRITTEN IN REVERSE POLISH NOTATION (RPN)

  IT SUPPORTS BASIC ARITHMETIC OPERATIONS (+, -, x, ÷) AND TRIGONOMETRIC
  FUNCTIONS (SIN, COS, TAN).
  
  @param infixExpression: AN ARRAY OF STRINGS REPRESENTING AN RPN MATHEMATICAL EXPRESSION.
  @returns: THE RESULT OF THE RPN MATHEMATICAL EXPRESSION
  
  EXAMPLE:
  INPUT: ['2', '3', '+', '4', '*']
  OUTPUT: 14
  (EVALUATION: (2 + 3) * 4 = 14)
*/
  private evaluateRPN(tokens: string[]): number {
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
  }

  /* 
  FUNCTION THAT CALCULATES THE RESULT OF A MATHEMATICAL EXPRESSION
  
  THIS FUNCTION TAKES A MATHEMATICAL EXPRESSION IN STRING FORMAT, SPLITS IT INTO AN ARRAY,
  REPLACES DOUBLE NEGATIVES, AND THEN CONVERTS IT INTO REVERSE POLISH NOTATION (RPN).
  FINALLY, IT EVALUATES THE RPN EXPRESSION AND RETUNRS THE RESULT

  @param expression: A STRING REPRESENTING A MATHEMATICAL EXPRESSION.
  @returns THE RESULT OF THE MATHEMATICAL EXPRESSION.
  
  EXAMPLE:
  INPUT: '2 + 3 * (5 - 2)'
  OUTPUT: 11
*/
  public calculate(expression: string): number {
    const equationArr = expression.split(
      /(?=[+x÷()-])|(?<=[+x÷()-])|(?<=sin|cos|tan)|(?=sin|cos|tan)/g
    );
    const replacedNegatives = this.replaceDoubleNegatives(equationArr);
    const reversePolishNotationArr = this.infixToRPN(replacedNegatives);

    return this.evaluateRPN(reversePolishNotationArr);
  }
}

export default Calculator;
