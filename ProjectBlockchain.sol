// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

contract DonationTracking{

    //smart contract for donation tracking system

    
    //owner, charity_org, donors are the 3 variables

    //specify the owner of the contract
    address public owner;
    //specify the donors address
    address [] public donors;

    //Variable to store the selected organization index
    uint public selectedOrgIndex;

    // Address of the receiving chairty organization
    address payable[] public charity_org; 
    
    constructor() {

        owner = msg.sender;

        charity_org.push(payable(0x829c7599f5ccF77c050e0046356fA9F71053d4fD));//BCF Wallet 1
        charity_org.push(payable(0x2A6e3989f198deBcdfb938b720817a1f2D987958));//BCF Wallet 2
        charity_org.push(payable(0x03C75cD4B2Aa25B848814D6ABD44AA60B3FdAB46));//BCF Wallet 3
        charity_org.push(payable(0x7Ab19cc3DC876D75E9cc0427EA0355B8600Ae8B7));//BCF Wallet 4
    }

    // Add a new charity organization to the list
    function addCharityOrganization(address payable newCharityOrg) public {
        require(msg.sender == owner, "Only the owner can add charity organizations");
        charity_org.push(newCharityOrg);
    }


    // Receive and forward donations to a selected charity organization
    function deposit() external payable {
        require(msg.value >= 0.0001 ether, "Donation amount must be at least 0.0001");
        donors.push(payable(msg.sender));

    }

    //function to log each event when a transfer is successful
    event transferLog(address donor, address charityOrg, uint amount);


    function transferToCharity(uint orgIndex) public {
        require(orgIndex < charity_org.length, "Invalid organization index");
        address payable selectedCharityOrg = charity_org[orgIndex];

        //Store the donation amount in a variable
        uint donationAmount = address(this).balance;

        // Perform the transfer
            selectedCharityOrg.transfer(donationAmount);

        //Emit the event log
        emit transferLog(msg.sender, selectedCharityOrg, donationAmount);
        }
        

        function getAddress() external view returns(address) {
        return address(this);
    }

        function getBalance() external view returns(uint) {
        return address(this).balance;
    }

        function withdraw(address payable _to, uint _amount) external {
        _to.transfer(_amount);
    }

}