# Testing the TokenSwap Contract with Remix

To test the `TokenSwap` contract with Remix, you can follow these steps:

1. **Compile Contracts**: Compile all the contracts including `TokenSwap.sol`, `CohortXToken.sol`, and `Web3Bridge.sol` in Remix.

2. **Deploy Contracts**: Deploy `CohortXToken` and `Web3Bridge` contracts first by providing the required parameters such as initial supply and token price.

3. **Note Deployed Addresses**: After deploying `CohortXToken` and `Web3Bridge`, take note of their deployed addresses.

4. **Deploy TokenSwap Contract**: Deploy the `TokenSwap` contract by providing the addresses of `CohortXToken` and `Web3Bridge` contracts as constructor arguments.

5. **Interact with TokenSwap**: Once the `TokenSwap` contract is deployed, you can interact with it using the available functions.

## Performing a Token Swap

To perform a token swap:

1. **Set Exchange Ratio**: Call the `setRatio` function on the `TokenSwap` contract to set the exchange ratio between the two tokens.

2. **Optional: Set Fees**: Optionally, call the `setFees` function on the `TokenSwap` contract to set the fees for the token swap.

3. **Swap Tokens**: Use the `swapFromCTX` function to swap tokens from `CohortXToken` to `Web3Bridge` (or vice versa) by providing the amount of tokens to swap.

4. **Swap Tokens (Alternative)**: Use the `swapFromWCX` function to swap tokens from `Web3Bridge` to `CohortXToken` (or vice versa) by providing the amount of tokens to swap.

5. **Optional: Buy Tokens Directly**: Optionally, use the `buyTokensCTX` and `buyTokensWCX` functions to buy tokens directly from `CohortXToken` and `Web3Bridge` contracts respectively, providing the amount of tokens and sending ether along with the transaction if required.

Ensure that you have enough tokens and ether in your accounts to perform the swaps and purchases, and always double-check the input parameters before executing any transactions.
