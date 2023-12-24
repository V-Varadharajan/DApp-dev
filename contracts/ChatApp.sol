//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 < 0.9.0;

contract ChatApp {

    //defining the user struct 
    struct user {
        string name;
        friend[] friendList;
    }
    struct friend {
        address pubkey;
        string name;
    }
    struct message {
        address sender ;
        uint256 timestamp;
        string msg;
    }
    struct AllUserStruct {
        string name;
        address accountAddress; 
    }

    AllUserStruct[] getAllUsers;

    mapping(address => user) userList;
    mapping(bytes32 => message[]) allMessage;

    //Check user is exist or not !
    function checkuserExists(address pubkey) public view returns(bool) {
        return bytes(userList[pubkey].name).length > 0;
    }
    //Create Account 
    function createAccount(string calldata name) external {
        require(checkuserExists(msg.sender) == false, "User already Exist");
        require(bytes(name).length >0,"User name can'nt be empty");
        userList[msg.sender].name = name;

        getAllUsers.push(AllUserStruct(name, msg.sender));
    }
    //Get username
    function getUsername(address pubkey) external view returns (string memory) {
    require(checkuserExists(pubkey),"User not Registered");
    return userList[pubkey].name;
    }

    //Add Friend 
    function addFriend(address friend_key, string calldata name) external {
        require(checkuserExists(msg.sender), "Create an account first");
        require(checkuserExists(friend_key), "User is not Registered");
        require(msg.sender == friend_key, "User can't add themselves as a friend");
        require(checkAlreadyFriends(msg.sender, friend_key)== false,"These users are alreadyexist");

        _addFriend(msg.sender, friend_key, name );
        _addFriend(friend_key, msg.sender, userList[msg.sender].name);
    }

    //check Already Friend
    function checkAlreadyFriends(address pubkey1,address pubkey2) internal view returns(bool){
        if (userList[pubkey1].friendList.length > userList[pubkey2].friendList.length) {
            address tmp = pubkey1;
            pubkey1 = pubkey2;
            pubkey2 = tmp;
        }
        for(uint256 i = 0;i < userList[pubkey1].friendList.length; i++) {
            if (userList[pubkey1].friendList[i].pubkey == pubkey2)return true;
    }
    return false;
    }
    //add friend
    function _addFriend(address me,address friend_key,string memory name) internal {
        friend memory newfriend = friend(friend_key, name);
        userList[me].friendList.push(newfriend);
    }
    //Getmy friend
    function getMyFriendList() external view returns(friend[] memory) {
        return userList[msg.sender].friendList;
    }
    //Get chat code 
    function _getChatCode(address pubkey1, address pubkey2) internal pure returns(bytes32) {
        if(pubkey1 < pubkey2) {
            return keccak256(abi.encodePacked(pubkey1, pubkey2));
        } else return keccak256(abi.encodePacked(pubkey2, pubkey1));
    }

    //send messgae
    function sendMessage(address friend_key, string calldata _msg) external {
        require(checkuserExists(msg.sender),"create an account first");
        require(checkuserExists(friend_key),"user is not registered");
        require(checkAlreadyFriends(msg.sender, friend_key), "You are not friend with the given user");

        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        message memory newMsg = message(msg.sender, block.timestamp, _msg);
        allMessage[chatCode].push(newMsg);
    }

    //read Meassage
    function readMessage(address friend_key) external view returns(message[] memory) {
        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        return allMessage[chatCode];
    }
    function getAllAppUser() public view returns(AllUserStruct[] memory) {
        return getAllUsers;
    }
}