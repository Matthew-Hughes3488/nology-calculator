import "./main.scss";

let equation: string = "";
let firstNumber: number;
let secondNumber: number;
let opperator: string;

const digitRegex = new RegExp(/^[0-9 .]$/);
const operatorRegex = new RegExp(/[+\-x÷=%C]/);

// FETCHING AND VALIDATING ALL NEEDED ELEMENTS
const buttons = document.querySelectorAll(".buttons__button");
if (buttons.length === 0) throw new Error("Error with query all");
const userOutput = document.querySelector(".calculator__output");
if (!userOutput) throw new Error("Error with query selector");
