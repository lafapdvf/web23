import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import readline from "readline";
import Wallet from "../lib/wallet";
import Transaction from "../lib/transaction";
import TransactionType from "../lib/transactionType";
import TransactionInput from "../lib/transactionInput";
import TransactionOutput from "../lib/transactionOutput";

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER;

let myWalletPub = "";
let myWalletPriv = "";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function menu() {
  setTimeout(() => {
    console.clear();

    if (myWalletPub) console.log(`You are logged as ${myWalletPub} .`);
    else console.log(`You are not logged.`);

    console.log("1 - Create Wallet");
    console.log("2 - Retrieve Wallet");
    console.log("3 - Check Balance");
    console.log("4 - Send tx");
    console.log("5 - Search tx");
    console.log("6 - Logout");
    rl.question("Choose your option: ", (answer) => {
      switch (answer) {
        case "1":
          createWallet();
          break;
        case "2":
          retrieveWallet();
          break;
        case "3":
          checkBalance();
          break;
        case "4":
          sendTx();
          break;
        case "5":
          searchTx();
          break;
        case "6":
          logout();
          break;
        default: {
          console.log("Wrong option.");
          menu();
        }
      }
    });
  }, 1000);
}

function preMenu() {
  rl.question(`Press any key to continue...`, () => {
    menu();
  });
}

function createWallet() {
  console.clear();
  const wallet = new Wallet();
  console.log(`Your new wallet:`);
  console.log(wallet);

  myWalletPriv = wallet.privateKey;
  myWalletPub = wallet.publicKey;
  preMenu();
}

function retrieveWallet() {
  console.clear();
  rl.question("Please type your private key or WIF: ", (wifOrPrivateKey) => {
    const wallet = new Wallet(wifOrPrivateKey);
    console.log(`Your retrieved wallet:`);
    console.log(wallet);

    myWalletPriv = wallet.privateKey;
    myWalletPub = wallet.publicKey;
    preMenu();
  });
}

async function checkBalance() {
  console.clear();

  if (!myWalletPub) {
    console.log(`You do not have a wallet yet.`);
    return preMenu();
  }

  const { data } = await axios.get(
    `${BLOCKCHAIN_SERVER}wallets/${myWalletPub}`
  );
  console.log("Balance: " + data.balance);
  preMenu();
}

function sendTx() {
  console.clear();

  if (!myWalletPub) {
    console.log(`You do not have a wallet yet.`);
    return preMenu();
  }

  console.log(`Your wallet is ${myWalletPub} .`);
  rl.question(`To wallet: `, (destinationWallet) => {
    if (destinationWallet.length < 66) {
      console.log(`Invalid wallet`);
      return preMenu();
    }

    rl.question(`Amount: `, async (amountStr) => {
      const amount = parseInt(amountStr);
      if (!amount) {
        console.log(`Invalid amount.`);
        return preMenu();
      }

      const walletResponse = await axios.get(
        `${BLOCKCHAIN_SERVER}wallets/${myWalletPub}`
      );
      const balance = walletResponse.data.balance as number;
      const fee = walletResponse.data.fee as number;
      const utxo = walletResponse.data.utxo as TransactionOutput[];

      if (balance < amount + fee) {
        console.log(`Insufficient balance (tx + fee).`);
        return preMenu();
      }

      const txInputs = utxo.map((txo) => TransactionInput.fromTxo(txo));
      txInputs.forEach((txi, index, arr) => arr[index].sign(myWalletPriv));

      // transação de transferência
      const txOutputs = [] as TransactionOutput[];
      txOutputs.push(
        new TransactionOutput({
          toAddress: destinationWallet,
          amount,
        } as TransactionOutput)
      );

      // transação de troco
      const remainingBalance = balance - amount - fee;
      txOutputs.push(
        new TransactionOutput({
          toAddress: myWalletPub,
          amount: remainingBalance,
        } as TransactionOutput)
      );

      const tx = new Transaction({
        txInputs,
        txOutputs,
      } as Transaction);

      tx.hash = tx.getHash();
      tx.txOutputs.forEach((txo, index, arr) => (arr[index].tx = tx.hash));

      console.log(tx);
      console.log(`Remaining balance: ${remainingBalance}`);

      try {
        const txResponse = await axios.post(
          `${BLOCKCHAIN_SERVER}transactions/`,
          tx
        );
        console.log(`Transaction accepted. Waiting for the miners!`);
        console.log(txResponse.data.hash);
      } catch (err: any) {
        console.error(err.response ? err.response.data : err.message);
      }
      return preMenu();
    });
  });
  preMenu();
}
function searchTx() {
  console.clear();
  rl.question(`Your tx hash: `, async (hash) => {
    const response = await axios.get(
      `${BLOCKCHAIN_SERVER}transactions/${hash}`
    );
    console.log(response.data);
    return preMenu();
  });
}

function logout() {
  myWalletPriv = "";
  myWalletPub = "";
  preMenu();
}

menu();
