import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Internal import
import { CheckIfWalletConnected, connectWallet, connectingWithContract } from "../Utils/apiFeature";

export const ChatAppContect = React.createContext();

export const ChatAppProvider = ({ children }) => {
  // User data
  const [account, setAccount] = useState('');
  const [userName, setUserName] = useState('');
  const [friendLists, setFriendLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [UserLists, setUserLists] = useState([]);
  const [error, setError] = useState("");

  // Chat user data
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentUserAddress, setCurrentUserAddress] = useState("");

  const router = useRouter();

  // fetch data at the time of page load
  const fetchData = async () => {
    try {
      // get contract
      const contract = await connectingWithContract();
      // get account
      const connectAccount = await connectWallet();
      setAccount(connectAccount);
      // Get user name
      //const userName = await contract.getUsername(connectAccount);
      //setUserName(userName);
      // get my friend list
      const friendLists = await contract.getMyFriendList();
      setFriendLists(friendLists);
      // get all app user list
      const userList = await contract.getAllAppUser();
      setUserList(userList);
    } catch (error) {
      setError("Please Install and Connect your Wallet");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // read Message
  const readMessage = async (friendAddress) => {
    try {
      const contract = await connectingWithContract();
      const read = await contract.readMessage(friendAddress);
      setFriendMsg(read); // Where is setFriendMsg defined? It seems to be missing in the state.
    } catch (error) {
      setError("Currently, you have no message");
    }
  };

  // create account
  const createAccount = async ({ name, accountAddress }) => {
    try {
      //if (name || accountAddress) return setError("Name and AccountAddress, CANNOT be empty!"); // Corrected logical condition
      const contract = await connectingWithContract();
      const getCreatedUser = await contract.createAccount(name);
      setLoading(true);
      await getCreatedUser.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Error While getting your account, please reload the browser!");
    }
  };

  // Add your Friends
  const addFriends = async ({ name, accountAddress }) => {
    try {
      if (name || accountAddress) return setError("Please provide "); // Corrected logical condition
      const contract = await connectingWithContract();
      const addMyFriend = await contract.addFriend(accountAddress, name);
      setLoading(true);
      await addMyFriend.wait();
      setLoading(false);
      router.push('/');
      window.location.reload();
    } catch (error) {
      setError("Something went WRONG while adding friends, try again");
    }
  };

  // send message to your friends
  const sendMessage = async ({ msg, address }) => {
    try {
      if (msg || address) return setError("Please Type your message"); // Corrected logical condition
      const contract = await connectingWithContract();
      const addMessage = await contract.sendMessage(address, msg);
      setLoading(true);
      await addMessage.wait();
      
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Please reload and try again ");
    }
  };

  // Read the user info
  const readUser = async (userAddress) => {
    const contract = await connectingWithContract();
    const userName = await contract.getUserName(userAddress);
    setCurrentUserName(userName);
    setCurrentUserAddress(userAddress);
  };

  return (
    <ChatAppContect.Provider
      value={{
        readMessage,
        createAccount,
        addFriends,
        sendMessage,
        readUser,
        connectWallet,
        CheckIfWalletConnected,
        account,
        userName,
        friendLists,
        UserLists,
        loading,
        error,
        currentUserName,
        currentUserAddress
      }}
    >
      {children}
    </ChatAppContect.Provider>
  );
};
