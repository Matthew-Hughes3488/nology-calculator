class Calculator {
  private expression: string[] = [];
  private static digitRegex = new RegExp(/[0-9.]/);
  private static opperatorRegex = new RegExp(/[+\-x÷]/);
  private static trigRegex = new RegExp(/\b(sin|cos|tan)\b/);
  private static brackets = ["(", ")"];
}
