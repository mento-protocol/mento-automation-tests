import {
  Address,
  createPublicClient,
  createWalletClient,
  http,
  parseAbi,
} from "viem";

import { envHelper } from "@helpers/env/env.helper";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { web3Helper } from "@helpers/web3/web3.helper";
import {
  relayerAddresses,
  sortedOraclesAbi,
  sortedOraclesAddresses,
  timeouts,
  Token,
  TokenSymbol,
} from "@constants/index";
import { contractHelper } from "@helpers/contract/contract.helper";

/**
 * Helper class for interacting with Anvil fork
 * Provides utilities for manipulating blockchain state during tests
 */
export class ForkHelper {
  private readonly rpcUrl: string;
  private readonly log = loggerHelper.get("ForkHelper");

  constructor() {
    this.rpcUrl = envHelper.getRpcUrl();
  }

  /**
   * Transfer ERC20 tokens from an address to another address
   * @param tokenAddress - ERC20 token contract address
   * @param fromAddress - Address to transfer from
   * @param toAddress - Address to transfer to
   * @param rawAmount - Amount to transfer in wei
   */
  async transfer(
    tokenAddress: Address,
    fromAddress: Address,
    toAddress: Address,
    rawAmount: string | number,
  ): Promise<void> {
    const publicClient = createPublicClient({
      transport: http(this.rpcUrl),
    });
    const walletClient = createWalletClient({
      account: fromAddress,
      chain: null,
      transport: http(this.rpcUrl),
    });
    const amountInWei = web3Helper.toWei(rawAmount);

    await this.setCeloBalance(fromAddress, 100);
    await this.impersonateAccount(fromAddress);

    const hash = await walletClient.writeContract({
      address: tokenAddress,
      abi: parseAbi([
        "function transfer(address to, uint256 amount) returns (bool)",
      ]),
      functionName: "transfer",
      args: [toAddress, amountInWei],
      account: fromAddress,
      chain: null,
    });

    await publicClient.waitForTransactionReceipt({ hash });
    await this.stopImpersonatingAccount(fromAddress);
  }

  /**
   * Set CELO balance for an address
   * @param address - Address to fund
   * @param rawBalance - Balance in CELO
   */
  async setCeloBalance(
    address: Address,
    rawBalance: string | number,
  ): Promise<void> {
    const weiAmount = web3Helper.toWei(rawBalance);
    const hexAmount = web3Helper.toHex(weiAmount);

    await this.rpcCall("anvil_setBalance", [address, hexAmount]);
    await this.mine();
  }

  /**
   * Impersonate an account (allows sending transactions from any address)
   * @param address - Address to impersonate
   */
  async impersonateAccount(address: Address): Promise<void> {
    await this.rpcCall("anvil_impersonateAccount", [address]);
  }

  /**
   * Stop impersonating an account
   * @param address - Address to stop impersonating
   */
  async stopImpersonatingAccount(address: Address): Promise<void> {
    await this.rpcCall("anvil_stopImpersonatingAccount", [address]);
  }

  /**
   * Mine a single block
   */
  async mine(): Promise<void> {
    await this.rpcCall("evm_mine", []);
  }

  /**
   * Call a view function on a contract
   * @param contractAddress - Address of the contract
   * @param abi - Contract ABI
   * @param functionName - Name of the function to call
   * @param args - Arguments to pass to the function
   * @returns Result of the function call
   */
  async callViewFunction(
    contractAddress: Address,
    abi: unknown[],
    functionName: string,
    args: unknown[] = [],
  ): Promise<unknown> {
    const publicClient = createPublicClient({
      transport: http(this.rpcUrl),
    });

    const result = await publicClient.readContract({
      address: contractAddress,
      abi: parseAbi(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        abi.map((item: any) => {
          if (item.type === "function") {
            const inputs = item.inputs
              .map(
                (input: { type: string; name: string }) =>
                  `${input.type} ${input.name}`,
              )
              .join(", ");
            const outputs = item.outputs
              .map((output: { type: string }) => output.type)
              .join(", ");
            return `function ${item.name}(${inputs}) ${item.stateMutability} returns (${outputs})`;
          }
          return "";
        }),
      ),
      functionName,
      args,
    });

    return result;
  }

  async setInitialBalances(): Promise<void> {
    const holdersByChain = {
      // TODO: Add testnet holders
      mainnet: {
        "0x9380fA34Fd9e4Fd14c06305fd7B6199089eD4eb9": [
          // TODO: Fix USD₮ TokenSymbol usage
          // TokenSymbol.USDT,
          TokenSymbol.USDC,
          Token.axlUSDC,
          Token.axlEUROC,
        ],
        "0xB5BBea2325a8f5a0130a1Aaa372bA768F1C62c43": [TokenSymbol.cUSD],
        "0x59aBE068150BE95582479a405f2734cB533f9354": [TokenSymbol.cAUD],
        "0x0D95d04c72fe3B0F17963779138C504Fdd365C03": [TokenSymbol.cCAD],
        "0x1aa2f83357150F811B1010c00020AbE1462feB01": [TokenSymbol.cCHF],
        "0x6619871118D144c1c28eC3b23036FC1f0829ed3a": [TokenSymbol.cCOP],
        "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73": [TokenSymbol.cEUR],
        "0xb1ea2E17C8aBCFA5Ba111c92A9a1ad8C5728153f": [TokenSymbol.cGBP],
        "0x6bab3afa6d0c42d539bcbc33ffb68c0406913413": [TokenSymbol.cGHS],
        "0x04fEAE0d4a3D0051397Ee09314dAD768a37Fb539": [TokenSymbol.cJPY],
        "0x61Ef8708fc240DC7f9F2c0d81c3124Df2fd8829F": [TokenSymbol.cKES],
        "0x1e2F87e1f8056Fcd39695aAeb63cb475E1DD2318": [TokenSymbol.cNGN],
        "0x1625fe58cdb3726e5841fb2bb367dde9aaa009b3": [TokenSymbol.cREAL],
        "0xb793ff8031FCe64b3f553DBf40a70370FDEAC1C7": [TokenSymbol.cZAR],
        "0x625cb959213d18a9853973c2220df7287f1e5b7d": [TokenSymbol.eXOF],
        "0x87deC9a2589d9e6511Df84C193561b3A16cF6238": [TokenSymbol.PUSO],
      },
    };
    const amount = 1000;
    const holders = holdersByChain[envHelper.getChainType()];

    for (const holder of Object.keys(holders)) {
      for (const token of holders[holder]) {
        const tokenAddress = await contractHelper.governance.getTokenAddress(
          token,
        );
        await this.transfer(
          tokenAddress,
          holder as Address,
          web3Helper.extractAddress(envHelper.getSeedPhrase()),
          amount,
        );
        console.info(`✅ Successfully set initial balance of ${token}\n`);
      }
    }
  }

  /**
   * Report prices for all oracle pairs
   */
  async reportPrices(): Promise<void> {
    console.info("📊 Starting price reporting...\n");

    const network = envHelper.getChainType();
    const sortedOraclesAddress = envHelper.isMainnet()
      ? sortedOraclesAddresses.mainnet
      : sortedOraclesAddresses.testnet;

    console.info(`🌐 Network: ${network}`);
    console.info(`📍 Sorted Oracles: ${sortedOraclesAddress}\n`);

    const relayers = relayerAddresses[network];
    const pairNames = Object.keys(relayers);

    console.info(`Found ${pairNames.length} pairs to report\n`);

    await Promise.all(
      pairNames.map(async pairName =>
        this.reportPrice(pairName, relayers, sortedOraclesAddress),
      ),
    );

    console.info(`\n📈 Price reporting completed`);
  }

  /**
   * Report price for a given pair
   * @param pairName - Name of the pair
   * @param relayers - Relayer addresses
   * @param sortedOraclesAddress - Address of the Sorted Oracles contract
   */
  private async reportPrice(
    pairName: string,
    relayers: Record<string, Address>,
    sortedOraclesAddress: Address,
  ): Promise<void> {
    try {
      const relayerAddress = relayers[pairName as keyof typeof relayers];
      const isRelayerAddressSet =
        relayerAddress &&
        relayerAddress.toLowerCase() !==
          "0x0000000000000000000000000000000000000000";

      if (!isRelayerAddressSet) {
        console.info(`⏭️  Skipping ${pairName} (no relayer address set)\n`);
        return;
      }

      console.info(`🔄 Processing ${pairName}...`);
      console.info(`   Relayer: ${relayerAddress}`);

      const rateFeedId = await this.getRateFeedId(relayerAddress);
      const [currentRate] = await this.getMedianRate(
        sortedOraclesAddress,
        rateFeedId,
      );
      const isNoExistingRate = currentRate === BigInt(0);

      if (isNoExistingRate) {
        console.info(
          `   ⏭️  Skipping ${pairName} (no existing rate to report)\n`,
        );
        return;
      }

      await this.handleReportPrice(
        relayerAddress,
        sortedOraclesAddress,
        rateFeedId,
        currentRate,
      );

      console.info(`   ✅ Successfully reported price for ${pairName}\n`);
    } catch (error) {
      console.error(`   ❌ Failed to report price for ${pairName}: ${error}\n`);
    }
  }

  /**
   * Get the median rate from the Sorted Oracles contract
   * @param sortedOraclesAddress - Address of the Sorted Oracles contract
   * @param rateFeedId - Rate feed ID
   * @returns [currentRate, numReports]
   */
  private async getMedianRate(
    sortedOraclesAddress: Address,
    rateFeedId: Address,
  ): Promise<[bigint, bigint]> {
    return (await forkHelper.callViewFunction(
      sortedOraclesAddress,
      sortedOraclesAbi as unknown as unknown[],
      "medianRate",
      [rateFeedId],
    )) as [bigint, bigint];
  }

  /**
   * Get the rate feed ID from the relayer contract by calling the view function
   * @param relayerAddress - Address of the relayer contract
   * @returns Rate feed ID
   */
  private async getRateFeedId(relayerAddress: Address): Promise<Address> {
    return (await this.callViewFunction(
      relayerAddress,
      [
        {
          type: "function",
          name: "rateFeedId",
          inputs: [],
          outputs: [{ type: "address", name: "" }],
          stateMutability: "view",
        },
      ],
      "rateFeedId",
      [],
    )) as Address;
  }

  /**
   * Handle reporting price to Sorted Oracles by impersonating a relayer
   * @param relayerAddress - Address of the relayer to impersonate
   * @param sortedOraclesAddress - Address of the Sorted Oracles contract
   * @param rateFeedId - Rate feed ID to report for
   * @param price - Price to report
   */
  private async handleReportPrice(
    relayerAddress: Address,
    sortedOraclesAddress: Address,
    rateFeedId: Address,
    price: bigint,
  ): Promise<void> {
    const publicClient = createPublicClient({
      transport: http(this.rpcUrl),
    });
    const walletClient = createWalletClient({
      account: relayerAddress,
      chain: null,
      transport: http(this.rpcUrl),
    });

    await this.setCeloBalance(relayerAddress, 100);
    await this.impersonateAccount(relayerAddress);

    // Use address(0) for lesserKey and greaterKey to let the contract find the correct position
    const zeroAddress = "0x0000000000000000000000000000000000000000" as Address;

    const hash = await walletClient.writeContract({
      address: sortedOraclesAddress,
      abi: parseAbi([
        "function report(address rateFeedId, uint256 value, address lesserKey, address greaterKey)",
      ]),
      functionName: "report",
      args: [rateFeedId, price, zeroAddress, zeroAddress],
      account: relayerAddress,
      chain: null,
    });

    await publicClient.waitForTransactionReceipt({
      hash,
      timeout: timeouts.xl,
    });
    await this.stopImpersonatingAccount(relayerAddress);
  }

  /**
   * Makes a JSON-RPC call to the Anvil fork
   */
  private async rpcCall(
    method: string,
    params: unknown[] = [],
  ): Promise<unknown> {
    if (!envHelper.isFork()) {
      return null;
    }

    const response = await fetch(this.rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method,
        params,
        id: Date.now(),
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`RPC Error: ${data.error.message}`);
    }

    return data.result;
  }
}

export const forkHelper = new ForkHelper();
