import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import readline from "readline";
import Wallet from "../lib/wallet";

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
    console.log("5 - Logout");
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

function checkBalance() {
  console.clear();

  if (!myWalletPub) {
    console.log(`You do not have a wallet yet.`);
    return preMenu();
  }

  //TODO: check balance via API
  preMenu();
}

function sendTx() {
  console.clear();

  if (!myWalletPub) {
    console.log(`You do not have a wallet yet.`);
    return preMenu();
  }

  //TODO: send tx via API
  preMenu();
}

function logout() {
  myWalletPriv = "";
  myWalletPub = "";
  preMenu();
}

menu();
