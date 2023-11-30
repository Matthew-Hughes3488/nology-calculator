# nology-calculator

## Overview
Matt's Mathtastic Calculator is a web-based calculator that goes beyond basic arithmetic operations, offering advanced features to handle complex mathematical expressions. The calculator adheres to the BODMAS/BIDMAS rule, ensuring accurate and reliable results for intricate calculations.


## Table of Contents
- [Media Queries](#calculator-class)
- [Dynamic Output Updates with DOM](#dynamic-output-updates-with-dom)
- [Calculator Class](#calculator-class)
- [Shunting Yard Algorithm](#shunting-yard-algorithm)
- [Evaluating RPN Expressions](#evaluating-rpn-expressions)
- [Easter Egg](#easter-egg)

## Media Query
This calculator utilises media queries to enhance functionality on wider screens, akin to the iPhone calculator. When displayed on a wider screen, additional buttons become visible, enabling users to input more complex mathematical expressions. Presently, the extended functionality encompasses trigonometric functions and parentheses.

Here is a snippet of the code that facilitates this:
```scss
@media screen and (min-width: 567px){
    .buttons{
        display: unset;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(5, 1fr);

        &__button{
            &--zero{
                grid-column: 2/4;
            }
            &--extention{
                display: unset;
            }
        }
    }
}
```
## Dynamic Output Updates with DOM
The calculator leverages the Document Object Model (DOM) to enable dynamic updates of the output as the user interacts with the interface. Each button press triggers an event, updating the displayed expression in real-time. Upon pressing the "=" button, the DOM is utilized to replace the displayed expression with the calculated result, offering a better user experience.

All updates to the calculators out put are handled but two simple functions `addToOutput (stringToAdd: string)` and `resetOutput (resetString: string = defaultOutput)`

```typescript
const resetOutput = (resetString: string = defaultOutput) => {
  userOutput.textContent = resetString;
};

const addToOutput = (stringToAdd: string) => {
  if (userOutput.innerText === defaultOutput)
    userOutput.innerText = stringToAdd;
  else userOutput.innerText += stringToAdd;
};
```

## Calculator Class
The Calculator class encapsulates all the logic for mathematical operations. It provides methods for converting infix expressions to Reverse Polish Notation (RPN) and evaluating RPN expressions. This class is designed to handle various mathematical scenarios and is crafted in a way to make it easily extendable. Adding additional functionality, such as support for square roots or exponentials, can be easily integrated.

Most of the methods in this class are private for the purpose of hiding implementation details within the class. A public method `calculate(expression: string)` is used to calculate expressions with this class.

### Shunting Yard Algorithm
An algorithm that utilizes a stack and queue to convert an infix mathematical equation to Reverse Polish Notation. It processes the infix expression character by character: if it is a number, it is added to the queue; if it is an operator, it is added to the stack if it is empty. If the stack is not empty, all operators with higher precedence than the current operator are added to the queue, and then the current operator is added to the stack.

Parentheses are a special case. A left parenthesis is added directly to the stack. When a right parenthesis is encountered, operators from the stack are removed until the left parenthesis is encountered, and then the left parenthesis is also removed from the stack.

In the code snippet below, the cases for operators and right parenthesis have been refactored into their own methods for better readability.


```typescript
/* 
FUNCTION THAT CONVERTS AN EXPRESSION WRITTEN IN INFIX FORM TO REVERSE POLISH NOTATION (RPN)
USING A MODIFIED SHUNTING YARD ALGORITHM

@param infixExpression: AN ARRAY OF STRINGS REPRESENTING AN INFIX MATHEMATICAL EXPRESSION.
@returns AN ARRAY OF STRINGS REPRESENTING THE INPUT EXPRESSION IN RPN

EXAMPLE:
INPUT: ['3', '+', '4', '*', '2', '/', '(', '1', '-', '5', ')']
OUTPUT: ['3', '4', '2', '*', '+', '1', '5', '-', '/']
*/
private infixToRPN(tokens: string[]): string[] {
    if (!tokens || tokens.length === 0) {
        throw new Error("Error with tokens");
    }

    // Using Shunting Yard Algorithm
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
```
### Evaluating RPN Expressions
This method is employed to evaluate the Reverse Polish Notation (RPN) expression generated by the infixToRPN method. It processes the RPN expression character by character. Numbers are added to a stack. Upon encountering an operator, one or two numbers are popped from the stack, evaluated using the operator, and the result is subsequently pushed back onto the stack. Upon completion of the loop, the stack is expected to contain a single value, which represents the final result of the expression.

```typescript
/* 
  FUNCTION THAT EVALUATES AN EXPRESSION WRITTEN IN REVERSE POLISH NOTATION (RPN)

  IT SUPPORTS BASIC ARITHMETIC OPERATIONS (+, -, x, ÷) AND TRIGONOMETRIC
  FUNCTIONS (SIN, COS, TAN).
  
  @param infixExpression: AN ARRAY OF STRINGS REPRESENTING AN RPN MATHEMATICAL EXPRESSION.
  @returns: THE RESULT OF THE RPN MATHEMATICAL EXPRESSION
  
  EXAMPLE:
  INPUT: ['2', '3', '+', '4', '*']
  OUTPUT: 14
  (EVALUATION: (2 + 3) * 4 = 20)
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
```
## Easter Egg

Try dividing by zero! But be warned, breaking the laws of mathematics comes with consequences in Matt's Mathtastic Calculator. If you attempt to perform the forbidden operation, you might just encounter a surprise.

And, brace yourself for a special audio message playing in the background as the calculator reveals the consequences of your mathematical rebellion.

**Note:** The Easter egg adds a touch of fun and interactivity to the calculator, providing a unique user experience.
