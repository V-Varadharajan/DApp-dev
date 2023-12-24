import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { ChatAppAddress, ChatAppABI } from '../Context/constants';

export const CheckIfWalletConnected = async () => {
    try {
        if (!window.ethereum) return console.log('Install MetaMask');

        const accounts = await window.ethereum.request({
            method: 'eth_accounts',
        });
        const firstAccount = accounts[0];
        return firstAccount;
    } catch (error) {
        console.log(error);
    }
};

export const connectWallet = async () => {
    try {
        if (!window.ethereum) return console.log('Install MetaMask');

        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
        });
        const firstAccount = accounts[0];
        return firstAccount;
    } catch (error) {
        console.log(error);
    }
};

// Use function or let to declare a function expression
export const fetchContract = function (signerOrProvider) {
    return new ethers.Contract(ChatAppAddress, ChatAppABI, signerOrProvider);
};

export const connectingWithContract = async () => {
    try {
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect().catch((error) => {
            console.log(error);
            throw error;
        });
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = await provider.getSigner().catch((error) => {
            console.log(error);
            throw error;
        });
        const contract = fetchContract(signer);
        return contract;
    } catch (error) {
        console.log(error);
    }
};

export const converTime = (time) => {
    const newTime = new Date(time.toNumber());
    const realTime =
        newTime.getHours() +
        '/' +
        newTime.getMinutes() +
        '/' +
        newTime.getSeconds() +
        ' Date:' +
        newTime.getDate() +
        '/' +
        (newTime.getMonth() + 1) +
        '/' +
        newTime.getFullYear();
    return realTime;
};
