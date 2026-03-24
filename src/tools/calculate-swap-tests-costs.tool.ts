#!/usr/bin/env ts-node

/* eslint-disable no-console */
/**
 * Calculate costs needed for token swap tests
 *
 * Usage:
 * - Default (Celo mainnet): yarn calculateTestEUR
 * - Specific chain: yarn calculateTestEUR --chain=alfajores
 * - Specific chainId: yarn calculateTestEUR --chainId=44787
 */

import { utils, providers, Contract, BigNumber } from "ethers";
import { readFileSync } from "fs";
import { join } from "path";
import yargsParser from "yargs-parser";
import { Mento } from "@mento-protocol/mento-sdk";
import { magicStrings } from "@constants/magic-strings.constants";

// Type definitions
interface TokenPair {
  address: string;
  symbol: string;
  decimals?: number;
}

type TradingPair = [TokenPair, TokenPair];

interface DisableReason {
  reason: string;
}

const DAILY_CONFIG = {
  swapByTokenPairs: 1,
  swapByAmountTypes: 1,
  swapWithCustomSlippage: 1,
  highFrequencyTests: 5,
};
const CHAIN_NAMES: Record<number, string> = {
  [magicStrings.chain.mainnet.chainId]: magicStrings.chain.mainnet.name,
  [magicStrings.chain.testnet.chainId]: magicStrings.chain.testnet.name,
};
const CHAIN_NAME_TO_ID: Record<string, number> = {
  celo: magicStrings.chain.mainnet.chainId,
  sepolia: magicStrings.chain.testnet.chainId,
};
const DEFAULT_CHAIN_ID = magicStrings.chain.mainnet.chainId;
const DEFAULT_TEST_AMOUNT = "0.01";
const DEFAULT_USD_TO_EUR_RATE = 0.85;
const TOKEN_MAP: Record<string, string> = {
  "Token.CELO": "CELO",
  "Token.USDm": "USDm",
  "Token.EURm": "EURm",
  "Token.BRLm": "BRLm",
  "Token.XOFm": "XOFm",
  "Token.USD₮": "USD₮",
  "Token.KESm": "KESm",
  "Token.PHPm": "PHPm",
  "Token.COPm": "COPm",
  "Token.USDC": "USDC",
  "Token.axlUSDC": "axlUSDC",
  "Token.axlEUROC": "axlEUROC",
  "Token.GHSm": "GHSm",
  "Token.GBPm": "GBPm",
  "Token.ZARm": "ZARm",
  "Token.CADm": "CADm",
  "Token.AUDm": "AUDm",
  "Token.CHFm": "CHFm",
  "Token.NGNm": "NGNm",
  "Token.JPYm": "JPYm",
};

/**
 * Format amounts with dynamic precision based on magnitude
 * Shows more decimal places for very small amounts
 */
function formatAmount(amount: number): string {
  if (amount === 0) return "0.00";

  const absAmount = Math.abs(amount);

  // For amounts >= 0.01, use 2 decimal places
  if (absAmount >= 0.01) {
    return amount.toFixed(2);
  }

  // For very small amounts, find the first significant digit and show 4 decimal places from there
  if (absAmount >= 0.001) {
    return amount.toFixed(3);
  }

  if (absAmount >= 0.0001) {
    return amount.toFixed(4);
  }

  if (absAmount >= 0.00001) {
    return amount.toFixed(5);
  }

  if (absAmount >= 0.000001) {
    return amount.toFixed(6);
  }

  // For extremely small amounts, use scientific notation
  return amount.toExponential(3);
}

main().catch(error => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});

async function main() {
  const { chainId, chainName } = parseArgs();
  console.log(`🧮 Calculating automated swap tests costs on ${chainName}...\n`);

  const [swapByTokenPairsTestCases, usdToEurRate, mento, allPairs] =
    await Promise.all([
      getSwapByTokenPairsTestCases(),
      fetchEURRate(),
      setupMento(chainId),
      setupMento(chainId).then(m => m.getTradablePairs()),
    ]);

  console.log(
    `✅ Loaded ${swapByTokenPairsTestCases.length} swap-by-token-pairs = ${swapByTokenPairsTestCases.length} total test cases\n`,
  );

  const results = await processAllTests(
    swapByTokenPairsTestCases,
    allPairs,
    mento,
    createProvider(chainId),
    usdToEurRate,
  );
  displayResults(results, chainName, usdToEurRate);
  // cleanupProvider(createProvider(chainId));
}

function parseArgs() {
  const argv = yargsParser(process.argv.slice(2), {
    string: ["chain", "chainId"],
    alias: { c: "chainId", n: "chain" },
    default: { chain: "", chainId: "" },
  });

  let chainId = DEFAULT_CHAIN_ID,
    chainName = "Celo";
  if (argv.chainId) {
    chainId = parseInt(argv.chainId, 10);
    chainName = CHAIN_NAMES[chainId] || `Chain ${chainId}`;
  } else if (argv.chain) {
    chainId = CHAIN_NAME_TO_ID[argv.chain.toLowerCase()] || DEFAULT_CHAIN_ID;
    chainName = CHAIN_NAMES[chainId] || "Celo";
  }
  return { chainId, chainName };
}

async function setupMento(chainId: number) {
  const provider = createProvider(chainId);
  return await Mento.create(provider);
}

function createProvider(chainId: number) {
  const rpcUrls: Record<number, string> = {
    42220: "https://forno.celo.org", // Celo Mainnet
    44787: "https://alfajores-forno.celo-testnet.org", // Alfajores Testnet
  };

  const rpcUrl = rpcUrls[chainId] || rpcUrls[42220];
  return new providers.JsonRpcProvider(rpcUrl);
}

function validateTokens(
  allPairs: TradingPair[],
  fromToken: string,
  toToken: string,
) {
  const tokenMap: Record<string, string> = {};

  allPairs.forEach((pair: TradingPair) => {
    // Each pair is an array of two tokens
    if (Array.isArray(pair) && pair.length === 2) {
      const [token0, token1] = pair;
      if (token0?.symbol && token0?.address) {
        tokenMap[token0.symbol] = token0.address;
      }
      if (token1?.symbol && token1?.address) {
        tokenMap[token1.symbol] = token1.address;
      }
    }
  });

  // Map tokens to their Mento SDK symbols
  const mappedFromToken = mapTokenToMentoSymbol(fromToken);
  const mappedToToken = mapTokenToMentoSymbol(toToken);

  const fromAddress = tokenMap[mappedFromToken];
  const toAddress = tokenMap[mappedToToken];

  if (!fromAddress) {
    throw new Error(`Token ${fromToken} (${mappedFromToken}) not found`);
  }
  if (!toAddress) {
    throw new Error(`Token ${toToken} (${mappedToToken}) not found`);
  }

  return { fromAddress, toAddress };
}

async function getTokenDecimals(
  tokenAddress: string,
  provider: providers.JsonRpcProvider,
): Promise<number> {
  try {
    // Try to get decimals from the token contract
    const contract = new Contract(
      tokenAddress,
      ["function decimals() view returns (uint8)"],
      provider,
    );
    return await contract.decimals();
  } catch {
    // Default to 18 decimals
    return 18;
  }
}

async function getSwapByTokenPairsTestCases(): Promise<TestCase[]> {
  try {
    const specFilePath = join(
      process.cwd(),
      "specs/app-mento/web/swap/swap-by-token-pairs.spec.ts",
    );

    const content = readFileSync(specFilePath, "utf-8");

    // Locate `const tests = [` and extract the full array via bracket matching
    const testsStart = content.indexOf("const tests = [");
    if (testsStart === -1) throw new Error("No tests array found in spec file");

    const arrayOpenIdx = content.indexOf("[", testsStart);
    const testsContent = extractBracketContent(content, arrayOpenIdx, "[", "]");
    if (!testsContent) throw new Error("Failed to extract tests array content");

    const testCases: TestCase[] = [];

    for (const group of extractTopLevelObjects(testsContent, "{", "}")) {
      // First `token:` in the group is the sell token
      const sellTokenMatch = group.match(/token:\s*(Token\.\w+)/);
      if (!sellTokenMatch) continue;
      const sellToken = resolveToken(sellTokenMatch[1]);

      // Group-level amount (if any) appears before `testCases:`
      const testCasesKeyIdx = group.indexOf("testCases:");
      const beforeTestCases =
        testCasesKeyIdx !== -1 ? group.slice(0, testCasesKeyIdx) : group;
      const groupAmount = beforeTestCases.match(
        /amount:\s*["']([^"']+)["']/,
      )?.[1];

      if (testCasesKeyIdx === -1) continue;
      const innerArrayOpenIdx = group.indexOf("[", testCasesKeyIdx);
      if (innerArrayOpenIdx === -1) continue;
      const innerContent = extractBracketContent(
        group,
        innerArrayOpenIdx,
        "[",
        "]",
      );
      if (!innerContent) continue;

      for (const innerCase of extractTopLevelObjects(innerContent, "{", "}")) {
        const buyTokenMatch = innerCase.match(/token:\s*(Token\.\w+)/);
        if (!buyTokenMatch) continue;

        testCases.push({
          fromToken: sellToken,
          toToken: resolveToken(buyTokenMatch[1]),
          fromAmount:
            innerCase.match(/amount:\s*["']([^"']+)["']/)?.[1] || groupAmount,
        });
      }
    }

    if (testCases.length === 0) throw new Error("No test cases parsed");
    return testCases;
  } catch (error) {
    console.log("⚠️  Failed to read local spec file, using fallback");
    return getFallbackTests();
  }
}

function extractBracketContent(
  content: string,
  startIdx: number,
  open: string,
  close: string,
): string | null {
  if (content[startIdx] !== open) return null;
  let depth = 0;
  for (let i = startIdx; i < content.length; i++) {
    if (content[i] === open) depth++;
    else if (content[i] === close) {
      depth--;
      if (depth === 0) return content.slice(startIdx + 1, i);
    }
  }
  return null;
}

function extractTopLevelObjects(
  content: string,
  open: string,
  close: string,
): string[] {
  const objects: string[] = [];
  let depth = 0;
  let start = -1;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === open) {
      if (depth === 0) start = i;
      depth++;
    } else if (char === close) {
      depth--;
      if (depth === 0 && start !== -1) {
        objects.push(content.slice(start, i + 1));
        start = -1;
      }
    }
  }

  return objects;
}

function mapTokenToMentoSymbol(token: string): string {
  // Map tokens to their actual symbols in Mento SDK
  const symbolMap: Record<string, string> = {
    USDT: "USD₮", // Mento uses USD₮ instead of USDT
  };

  return symbolMap[token] || token;
}

function resolveToken(token: string): string {
  return TOKEN_MAP[token] || token.replace("Token.", "");
}

function getFallbackTests(): TestCase[] {
  return [
    { fromToken: "CELO", toToken: "USDm", disable: { reason: "Default pair" } },
    { fromToken: "CELO", toToken: "EURm" },
    { fromToken: "USDT", toToken: "USDm" },
    { fromToken: "USDC", toToken: "EURm" },
    { fromToken: "GBPm", toToken: "CELO" },
  ];
}

async function fetchEURRate(): Promise<number> {
  try {
    const response = await fetch(
      "https://api.fxratesapi.com/latest?base=USD&currencies=EUR",
    );
    const data = await response.json();
    return data.rates?.EUR || DEFAULT_USD_TO_EUR_RATE;
  } catch {
    try {
      const response = await fetch(
        "https://api.exchangerate-api.io/v4/latest/USD",
      );
      const data = await response.json();
      return data.rates?.EUR || DEFAULT_USD_TO_EUR_RATE;
    } catch {
      console.log("⚠️  Using fallback EUR rate: 0.85");
      return DEFAULT_USD_TO_EUR_RATE;
    }
  }
}

async function convertToUSD(
  testCase: TestCase,
  amount: string,
  amountWei: BigNumber,
  allPairs: TradingPair[],
  mento: Mento,
  _provider: providers.JsonRpcProvider,
): Promise<number> {
  if (testCase.fromToken === "USDm") return parseFloat(amount);

  try {
    const { fromAddress, toAddress } = validateTokens(
      allPairs,
      testCase.fromToken,
      "USDm",
    );

    // Use Mento SDK to get quote
    const quote = await mento.getAmountOut(fromAddress, toAddress, amountWei);

    if (quote) {
      // Find the token with matching address to get decimals
      let decimals = 18; // default
      for (const pair of allPairs) {
        if (Array.isArray(pair) && pair.length === 2) {
          const [token0, token1] = pair;
          if (token0?.address === toAddress && token0?.decimals) {
            ({ decimals } = token0);
            break;
          }
          if (token1?.address === toAddress && token1?.decimals) {
            ({ decimals } = token1);
            break;
          }
        }
      }
      return parseFloat(utils.formatUnits(quote, decimals));
    }
  } catch (error) {
    console.log(
      `  ⚠️  USD conversion failed: ${
        error instanceof Error ? error.message : "Unknown"
      }`,
    );
  }
  return parseFloat(amount);
}

async function processAllTests(
  testCases: TestCase[],
  allPairs: TradingPair[],
  mento: Mento,
  provider: providers.JsonRpcProvider,
  usdToEurRate: number,
): Promise<TestResult[]> {
  const results: TestResult[] = [];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const testId = `T${(i + 1).toString().padStart(3, "0")}`;

    let dailyExecutions = DAILY_CONFIG.swapByTokenPairs;
    let label = "(swap-by-token-pairs)";

    if (testCase.executionType === "swap-with-custom-slippage") {
      dailyExecutions = DAILY_CONFIG.swapWithCustomSlippage;
      label = "(swap-with-custom-slippage)";
    } else if (testCase.executionType === "swap-by-amount-types") {
      dailyExecutions = DAILY_CONFIG.highFrequencyTests;
      label = `(swap-by-amount-types, ${dailyExecutions}x daily)`;
    }

    console.log(
      `Processing ${testId}: ${testCase.fromToken} → ${testCase.toToken} ${label}`,
    );

    if (testCase.disable) {
      console.log(`  ⏸️  Skipped (disabled): ${testCase.disable.reason}`);
      results.push({
        id: testId,
        fromToken: testCase.fromToken,
        toToken: testCase.toToken,
        fromAmount: testCase.fromAmount || DEFAULT_TEST_AMOUNT,
        fromAmountUSD: 0,
        fromAmountEUR: 0,
        dailyExecutions: 0,
        dailyUSD: 0,
        dailyEUR: 0,
        disabled: true,
      });
      continue;
    }

    try {
      const { fromAddress } = validateTokens(
        allPairs,
        testCase.fromToken,
        testCase.toToken,
      );
      const fromDecimals = await getTokenDecimals(fromAddress, provider);
      const fromAmount = testCase.fromAmount || DEFAULT_TEST_AMOUNT;
      const fromAmountWei = utils.parseUnits(fromAmount, fromDecimals);

      const fromAmountUSD = await convertToUSD(
        testCase,
        fromAmount,
        fromAmountWei,
        allPairs,
        mento,
        provider,
      );
      const fromAmountEUR = fromAmountUSD * usdToEurRate;
      const dailyUSD = fromAmountUSD * dailyExecutions;
      const dailyEUR = fromAmountEUR * dailyExecutions;

      console.log(
        `  ✅ Amount: ${fromAmount} ${testCase.fromToken} ≈ $${formatAmount(
          fromAmountUSD,
        )} ≈ €${formatAmount(fromAmountEUR)}`,
      );

      if (dailyExecutions > 1) {
        console.log(
          `  📅 Daily total (${dailyExecutions}x): $${formatAmount(
            dailyUSD,
          )} ≈ €${formatAmount(dailyEUR)}`,
        );
      }

      results.push({
        id: testId,
        fromToken: testCase.fromToken,
        toToken: testCase.toToken,
        fromAmount,
        fromAmountUSD,
        fromAmountEUR,
        dailyExecutions,
        dailyUSD,
        dailyEUR,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.log(`  ❌ Error: ${errorMessage}`);
      results.push({
        id: testId,
        fromToken: testCase.fromToken,
        toToken: testCase.toToken,
        fromAmount: testCase.fromAmount || DEFAULT_TEST_AMOUNT,
        fromAmountUSD: 0,
        fromAmountEUR: 0,
        dailyExecutions: 0,
        dailyUSD: 0,
        dailyEUR: 0,
        error: errorMessage,
      });
    }
  }
  return results;
}

function displayResults(
  results: TestResult[],
  chainName: string,
  usdToEurRate: number,
) {
  console.log("\n📊 SUMMARY");
  console.log("=".repeat(80));
  console.log(`\nChain: ${chainName}`);
  console.log(`USD to EUR rate: ${usdToEurRate.toFixed(4)}`);

  console.log("\nTest Case Details:");
  results.forEach(r => {
    let status: string;
    let info: string;

    if (r.disabled) {
      status = "⏸️ ";
      info = "DISABLED";
    } else if (r.error) {
      status = "❌";
      info = `ERROR: ${r.error}`;
    } else {
      status = "✅";
      info = `€${formatAmount(r.fromAmountEUR)}`;
    }

    console.log(
      `${status} ${r.id}: ${r.fromAmount} ${r.fromToken} → ${r.toToken} = ${info}`,
    );
  });

  const enabled = results.filter(r => !r.disabled && !r.error);
  const singleUSD = enabled.reduce((sum, r) => sum + r.fromAmountUSD, 0);
  const singleEUR = enabled.reduce((sum, r) => sum + r.fromAmountEUR, 0);
  const dailyUSD = enabled.reduce((sum, r) => sum + r.dailyUSD, 0);
  const dailyEUR = enabled.reduce((sum, r) => sum + r.dailyEUR, 0);
  const monthlyUSD = dailyUSD * 30;
  const monthlyEUR = dailyEUR * 30;
  const yearlyUSD = dailyUSD * 365;
  const yearlyEUR = dailyEUR * 365;

  console.log("\n💰 COST ESTIMATES");
  console.log("=".repeat(50));
  console.log(
    `Single run: $${formatAmount(singleUSD)} ≈ €${formatAmount(singleEUR)}`,
  );
  console.log(`Daily: $${formatAmount(dailyUSD)} ≈ €${formatAmount(dailyEUR)}`);
  console.log(
    `Monthly: $${formatAmount(monthlyUSD)} ≈ €${formatAmount(monthlyEUR)}`,
  );
  console.log(
    `Yearly: $${formatAmount(yearlyUSD)} ≈ €${formatAmount(yearlyEUR)}`,
  );

  const swapByTokenPairs = enabled.filter(
    r => r.dailyExecutions === 1 && r.id < "T020",
  ).length;
  const swapWithCustomSlippage = enabled.filter(
    r => r.dailyExecutions === 1 && r.id >= "T020",
  ).length;
  const swapByAmountTypes = enabled.filter(r => r.dailyExecutions === 5).length;

  console.log("\n📊 BREAKDOWN");
  console.log(
    `Swap-by-token-pairs (1x daily): ${swapByTokenPairs} | Swap-with-custom-slippage (1x daily): ${swapWithCustomSlippage} | Swap-by-amount-types (~5x daily): ${swapByAmountTypes}`,
  );
  console.log(
    `Budget: Monthly ~$${Math.ceil(monthlyUSD)} | Yearly ~$${Math.ceil(
      yearlyUSD,
    )}`,
  );
  let budgetMessage: string;
  if (yearlyUSD < 100) {
    budgetMessage = "💡 Very affordable!";
  } else if (yearlyUSD < 500) {
    budgetMessage = "💡 Reasonable costs";
  } else {
    budgetMessage = "💡 Consider optimization";
  }

  console.log(budgetMessage);

  console.log(
    `\n✅ Success: ${enabled.length} | ⏸️  Disabled: ${
      results.filter(r => r.disabled).length
    } | ❌ Failed: ${results.filter(r => r.error).length}`,
  );
}

interface TestCase {
  fromToken: string;
  toToken: string;
  fromAmount?: string;
  disable?: DisableReason;
  executionType?: string;
}
interface TestResult {
  id: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  fromAmountUSD: number;
  fromAmountEUR: number;
  dailyExecutions: number;
  dailyUSD: number;
  dailyEUR: number;
  disabled?: boolean;
  error?: string;
}
