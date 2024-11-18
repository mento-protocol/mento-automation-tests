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
}
const tokenAddresses = {
  [Token.CELO]: "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9",
  [Token.cUSD]: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
  [Token.cEUR]: "0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F",
  [Token.cREAL]: "0xE4D517785D091D3c54818832dB6094bcc2744545",
  [Token.USDC]: "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B",
  [Token.USDT]: "0xBba91F588d031469ABCCA566FE80fB1Ad8Ee3287",
  [Token.axlUSDC]: "0x87D61dA3d668797786D73BC674F053f87111570d",
  [Token.axlEUROC]: "0x6e673502c5b55F3169657C004e5797fFE5be6653",
  [Token.eXOF]: "0xB0FA15e002516d0301884059c0aaC0F0C72b019D",
  [Token.cKES]: "0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92",
  [Token.PUSO]: "0x5E0E3c9419C42a1B04e2525991FB1A2C467AB8bF",
  [Token.cCOP]: "0xe6A57340f0df6E020c1c0a80bC6E13048601f0d4",
};

export const cTokens = [
  Token.cEUR,
  Token.cUSD,
  Token.cREAL,
  Token.cCOP,
  Token.cKES,
];

export const otherTokens = [Token.USDC];

export const allTokens = [...cTokens, ...otherTokens, Token.CELO];
