export enum Token {
  "USDC" = "USDC",
  "CELO" = "CELO",
  "cEUR" = "cEUR",
  "cUSD" = "cUSD",
  "cREAL" = "cREAL",
}

export const cTokens = [Token.cEUR, Token.cUSD];

export const otherTokens = [Token.USDC];

export const allTokens = [...cTokens, ...otherTokens, Token.CELO];
