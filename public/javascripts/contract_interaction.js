
let account;
const connectMetamask = async () => {
    if(window.ethereum !== "undefined"){
        const accounts = await ethereum.request({method: "eth_requestAccounts"});
        account = accounts[0];
        document.getElementById("userArea").innerHTML = `User Account: ${account}`;
    }
}


const connectContract = async () => {
        const ABI = [
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
},
{
"inputs": [],
"stateMutability": "nonpayable",
"type": "constructor"
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
}
]   ;

        const Address = "0xf9ee7f4badf2c707fdfa2a89465256829b608484"; // Taking Address from Remix 
        window.web3 = await new Web3(window.ethereum);
        window.contract = await new window.web3.eth.Contract(ABI, Address);
        document.getElementById("contractArea").innerHTML = "Connected to Contract"; // calling the elementID above
    }

    const getContractAccount = async () => {
        const data = await window.contract.methods.getAddress().call();
        document.getElementById("contractAccount").innerHTML = `Contract Account: ${data}`;
    }

    const getBalanceApple = async () => { // const getBalanceApple is the HTML function & .contract.getBalance is the smart contract function
        const data = await window.contract.methods.getBalance().call();
        document.getElementById("balanceArea").innerHTML = `Contract Balance: ${data}`;
    }

    const withdraw = async () => {
        const amount = document.getElementById("amountInput").value;
        const address = document.getElementById("addressInput").value;
        await window.contract.methods.withdraw(address, amount).send({from: account});
    }

    const getLogs = async () => {
      window.contract.events.transferLog({}, (error, event) => {
      if (error) {
          console.error(error);
      } else {
          console.log(event);
          document.getElementById("logs").innerHTML = `logs: ${event.returnValues.donor} donated ${event.returnValues.amount} ETH to ${event.returnValues.charityOrg}`;
      }
      });
      };
    
    const donateToOrganization = async (organizationIndex) => {
          const ethAmount= parseFloat(document.getElementById(`input${organizationIndex}`).value); // Get the ETH amount entered by the user
          
          const weiAmount = ethAmount*1000000000000000000;
    
          // Send a donation to the smart contract
          await window.contract.methods.deposit().send({from: account, value: weiAmount});
    
          // After the donation is sent to smart contract, immediately call the transferToCharity function
          await window.contract.methods.transferToCharity(organizationIndex).send({from: account});
    
          // Provide feedback to the user that the donation was successful
          alert(`Thank you for donating ${ethAmount} ETH to your preferred charity.`);

          //get log upon donation complete
          getLogs();
        }
  

      
