import logo from './logo.svg';
import './App.css';
import freighterApi from "@stellar/freighter-api";
import StellarSdk from "stellar-sdk";

function App() {

  const checkFreighter = async () => {
    if (freighterApi.isConnected()) {
      alert("User has Freighter!");
    }else{
      alert("You must install the Freighter Chrome extension!");
    }
  };
  
  const retrievePublicKey = async () => {
    let publicKey = "";
    let error = "";
  
    try {
      publicKey = await freighterApi.getPublicKey();
    } catch (e) {
      error = e;
    }
  
    if (error) {
      return error;
    }
  
    alert('Your Public Key:' + publicKey);
  };

  const retrieveNetwork = async () => {
    let network = "";
    let error = "";
  
    try {
      network = await freighterApi.getNetwork();
    } catch (e) {
      error = e;
    }
  
    if (error) {
      return error;
    }
  
    alert('Network:' + network);
  };

  const userSignTransaction = async (xdr: string, network: string) => {
    let signedTransaction = "";
    let error = "";
  
    try {
      signedTransaction = await freighterApi.signTransaction(xdr, network);
    } catch (e) {
      error = e;
    }
  
    if (error) {
      return error;
    }
  
    return signedTransaction;
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={checkFreighter}>
          Check Wallet
        </button>
        <button onClick={retrievePublicKey}>
          Get Public Key
        </button>
        <button onClick={retrieveNetwork}>
          Get Network
        </button>
      </header>
      
    </div>
  );
}

export default App;
