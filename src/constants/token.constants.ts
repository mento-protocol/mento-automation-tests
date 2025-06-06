export enum Token {
  "USDC" = "USDC",
  "USDT" = "USDT",
  "CELO" = "CELO",
  "cEUR" = "cEUR",
  "cUSD" = "cUSD",
  "cREAL" = "cREAL",
  "cCOP" = "cCOP",
  "axlEUROC" = "axlEUROC",
  "axlUSDC" = "axlUSDC",
  "cKES" = "cKES",
  "eXOF" = "eXOF",
  "PUSO" = "PUSO",
  "cGHS" = "cGHS",
  "cGBP" = "cGBP",
  "cZAR" = "cZAR",
  "cCAD" = "cCAD",
  "cAUD" = "cAUD",
  "cCHF" = "cCHF",
  "cNGN" = "cNGN",
  "cJPY" = "cJPY",
}

export const cTokens = [
  Token.cEUR,
  Token.cUSD,
  Token.cREAL,
  Token.cCOP,
  Token.cKES,
];

export const otherTokens = [Token.USDC];

export const allTokens = [...cTokens, ...otherTokens, Token.CELO];

export const defaultSwapAmount = "0.01";
