//connect to Metamask
let account;
const connectMetamask = async () => {
    if (window.ethereum !== "undefined") {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        account = accounts[0];
        document.getElementById("userArea").innerHTML = `User Account: ${account}`;
    }
}

//connect to contract via ABI
const connectContract = async () => {
    const ABI = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "donor",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "charityOrg",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transferLog",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address payable",
                    "name": "newCharityOrg",
                    "type": "address"
                }
            ],
            "name": "addCharityOrganization",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "charity_org",
            "outputs": [
                {
                    "internalType": "address payable",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "deposit",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "donors",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getAddress",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getOwnerBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "selectedOrgIndex",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address payable",
                    "name": "recipientWallet",
                    "type": "address"
                }
            ],
            "name": "transferEth",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "orgIndex",
                    "type": "uint256"
                }
            ],
            "name": "transferToCharity",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address payable",
                    "name": "_to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    const Address = "0x06ca1993c8c81c284479d93fc3158c47c70a6f6a"; // Taking Address from Remix 
    window.web3 = await new Web3(window.ethereum);
    window.contract = await new window.web3.eth.Contract(ABI, Address);
    document.getElementById("contractArea").innerHTML = "Connected to Contract"; // calling the elementID above
}
//Obtain contract info 
const getContractAccount = async () => {
    const data = await window.contract.methods.getAddress().call();
    document.getElementById("contractAccount").innerHTML = `Contract Account: ${data}`;
}

//Obtain contract balance
const getBalanceApple = async () => { // const getBalanceApple is the HTML function & .contract.getBalance is the smart contract function
    const data = await window.contract.methods.getBalance().call();
    document.getElementById("balanceArea").innerHTML = `Contract Balance: ${data}`;
}

//Obtain owner's wallet balance
const getWalletBalance = async () => { // 
    const accountSelected = document.getElementById("accountInput").value;
    const message = await window.contract.methods.getOwnerBalance().call({ from: accountSelected });
    const balanceEth = window.web3.utils.fromWei(message, "ether");
    document.getElementById("ownerBalance").innerHTML = `Your Balance in ETH: ${balanceEth}`;
}

//Withdraw funds from smart contract
const withdraw = async () => {
    const amountEth = document.getElementById("amountInput").value;

    if (isNaN(amountEth) || amountEth <= 0) {
        alert("Please enter a valid positive number for amount in ETH currency.");
        return;
    }
    const amountWei = amountEth * 1000000000000000000;
    const address = document.getElementById("addressInput").value;
    await window.contract.methods.withdraw(address, amountWei).send({ from: account });
}


//Donate to selected charity organization 
const donateToOrganization = async (organizationIndex) => {
    const ethAmount = parseFloat(document.getElementById(`input${organizationIndex}`).value); // Get the ETH amount entered by the user

    const weiAmount = ethAmount * 1000000000000000000;

    // Send a donation to the smart contract
    await window.contract.methods.deposit().send({ from: account, value: weiAmount });

    // After the donation is sent to smart contract, immediately call the transferToCharity function
    await window.contract.methods.transferToCharity(organizationIndex).send({ from: account });

    // Provide feedback to the user that the donation was successful
    alert(`Thank you for donating ${ethAmount} ETH to your preferred charity.`);

    //get log upon donation completion
    getLogs();

}

//To retrieve event logs
const getLogs = async () => {
    try {
        const latestBlock = await window.ethereum.request({ method: 'eth_blockNumber' });

        // Get past events for the 'transferLog' event
        const events = await window.contract.getPastEvents('transferLog', {
            fromBlock: latestBlock - 1,
            toBlock: 'latest',
        });

        events.forEach((event) => {
            console.log(event);
            const donationAmount = (event.returnValues.amount) / 1000000000000000000;
            const logText = `Donor's Address: ${event.returnValues.donor} donated ${donationAmount} ETH to Charity Organization's Address ${event.returnValues.charityOrg}`;

            // Append the new log to the existing content
            document.getElementById("logs").innerHTML += logText + "\n";
        });
    } catch (error) {
        console.error(error);
    }
};

// Call getLogs after the DOM loaded
document.addEventListener("DOMContentLoaded", function () {
    getLogs();
});

//Transfer funds to another address
const transfer = async () => {
    const amountEth = document.getElementById("amountInput").value;

    if (isNaN(amountEth) || amountEth <= 0) {
        alert("Please enter a valid positive number for amount in ETH currency.");
        return;
    }
    const amountWei = amountEth * 1000000000000000000;
    const address = document.getElementById("addressInput").value;
    await window.contract.methods.transferEth(address).send({ from: account, value: amountWei });

    const currentDate = new Date();
    const timestamp = currentDate.toLocaleString();
    const logTransfer = `Your transfer of ${amountEth} ETH to ${address} is successful on ${timestamp}.`;

    // Append the new log to the existing content
    document.getElementById("transferLogs").innerHTML += logTransfer + "\n";
}