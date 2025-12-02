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
  holdersByChain,
  relayerAddresses,
  sortedOraclesAbi,
  sortedOraclesAddresses,
  timeouts,
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
    const holders = holdersByChain[envHelper.getChainType()];
    const testWallet = web3Helper.extractAddress(envHelper.getSeedPhrase());
    const amount = 1000;

    console.info(`👤 Test wallet address: ${testWallet}`);
    await this.setCeloBalance(testWallet, amount);
    console.info(`✅ Successfully set initial balance of CELO\n`);
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

    for (const pairName of pairNames) {
      await this.reportPrice(pairName, relayers, sortedOraclesAddress);
    }

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
