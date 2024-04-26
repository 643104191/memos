export enum TokenType {
  // Special character tokens.
  Underscore         = "_",
  Asterisk           = "*",
  PoundSign          = "#",
  Backtick           = "`",
  LeftSquareBracket  = "[",
  RightSquareBracket = "]",
  LeftParenthesis    = "(",
  RightParenthesis   = ")",
  ExclamationMark    = "!",
  QuestionMark       = "?",
  Tilde              = "~",
  Hyphen             = "-",
  PlusSign           = "+",
  Dot                = ".",
  LessThan           = "<",
  GreaterThan        = ">",
  DollarSign         = "$",
  EqualSign          = "=",
  Pipe               = "|",
  Colon              = ":",
  Caret              = "^",
  Backslash          = "\\",
  NewLine            = "\n",
  Space              = " ",
  // Text based tokens.
  Number             = "number",
  Text               = "",
}

export class Token {
  Type: TokenType;
  Value: string;
  constructor(tp: TokenType, text: string) {
    this.Type = tp;
    this.Value = text;
  }
  string() {
    return this.Value
  }
}

export function Tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  for (const c of text) {
    switch (c) {
      case '_':
        tokens.push(new Token(TokenType.Underscore, "_"));
        break;
      case '*':
        tokens.push(new Token(TokenType.Asterisk, "*"));
        break;
      case '#':
        tokens.push(new Token(TokenType.PoundSign, "#"));
        break;
      case '`':
        tokens.push(new Token(TokenType.Backtick, "`"));
        break;
      case '[':
        tokens.push(new Token(TokenType.LeftSquareBracket, "["));
        break;
      case ']':
        tokens.push(new Token(TokenType.RightSquareBracket, "]"));
        break;
      case '(':
        tokens.push(new Token(TokenType.LeftParenthesis, "("));
        break;
      case ')':
        tokens.push(new Token(TokenType.RightParenthesis, ")"));
        break;
      case '!':
        tokens.push(new Token(TokenType.ExclamationMark, "!"));
        break;
      case '?':
        tokens.push(new Token(TokenType.QuestionMark, "?"));
        break;
      case '~':
        tokens.push(new Token(TokenType.Tilde, "~"));
        break;
      case '-':
        tokens.push(new Token(TokenType.Hyphen, "-"));
        break;
      case '<':
        tokens.push(new Token(TokenType.LessThan, "<"));
        break;
      case '>':
        tokens.push(new Token(TokenType.GreaterThan, ">"));
        break;
      case '+':
        tokens.push(new Token(TokenType.PlusSign, "+"));
        break;
      case '.':
        tokens.push(new Token(TokenType.Dot, "."));
        break;
      case '$':
        tokens.push(new Token(TokenType.DollarSign, "$"));
        break;
      case '=':
        tokens.push(new Token(TokenType.EqualSign, "="));
        break;
      case '|':
        tokens.push(new Token(TokenType.Pipe, "|"));
        break;
      case ':':
        tokens.push(new Token(TokenType.Colon, ":"));
        break;
      case '^':
        tokens.push(new Token(TokenType.Caret, "^"));
        break;
      case '\\':
        tokens.push(new Token(TokenType.Backslash, ""));
        break;
      case '\n':
        tokens.push(new Token(TokenType.NewLine, "\n"));
        break;
      case ' ':
        tokens.push(new Token(TokenType.Space, " "));
        break;
      default:
        const prevToken: Token | undefined = tokens.length > 0 ? tokens[tokens.length - 1] : void 0;
        const numberVal = Number(c);
        const isNumber = !Number.isNaN(numberVal) && numberVal >= 0 && numberVal <= 9;
        if (prevToken !== void 0) {
          if ((prevToken.Type === TokenType.Text && !isNumber) || (prevToken.Type === TokenType.Number && isNumber)) {
            prevToken.Value += c;
            continue;
          }
        }
        if (isNumber) {
          tokens.push(new Token(TokenType.Number, c));
        } else {
          tokens.push(new Token(TokenType.Text, c));
        }
    }
  }
  return tokens;
}

export function Stringify(tokens: Token[]): string {
  let text = "";
  for (const token of tokens) {
    text += token.string();
  }
  return text;
}

export function Split(tokens: Token[], delimiter: TokenType): Token[][] {
  if (tokens.length === 0) {
    return [];
  }

  const result: Token[][] = [];
  let current: Token[] = [];
  for (const token of tokens) {
    if (token.Type === delimiter) {
      result.push(current);
      current = [];
    } else {
      current.push(token);
    }
  }
  result.push(current);
  return result;
}

export function Find(tokens: Token[], target: TokenType): number {
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].Type === target) {
      return i;
    }
  }
  return -1;
}

export function FindUnescaped(tokens: Token[], target: TokenType): number {
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].Type === target && (i === 0 || (i > 0 && tokens[i - 1].Type !== TokenType.Backslash))) {
      return i;
    }
  }
  return -1;
}

export function GetFirstLine(tokens: Token[]): Token[] {
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].Type === TokenType.NewLine) {
      return tokens.slice(0, i);
    }
  }
  return tokens;
}
