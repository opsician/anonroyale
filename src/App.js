import React, {useState, useEffect} from "react"
import './App.css';
import AssetList from "./components/AssetList";
import ControlPanel from "./components/ControlPanel";
import Account from "./components/Account";
import * as fsc from "./freighter-sc";

function App() {
  const [assets, setAssets]             = useState([]);
  const [account, setAccount]           = useState("");
  const [funcBalance, setFuncBalance]   = useState("");
  const [xdrToken, setXDRToken]         = useState(""); 

  const turretPublicKey     = "GB4OYM7TQTJSROWXHOJLKAX2IJ2QN4I6S6GCJH4MGWVTAO5Q5DPNADXX"
  const funcBaseUrl         = "https://stellar-turrets-testnet.sdf-ecosystem.workers.dev/"
  const funcAddresses       = ['9d64bd82134a1c141501dc16dca992446ecdc1812c1d75e8aab53443f879bf87']

  useEffect(() => {
    const getData = async () => {
      const req           = await fsc.checkBasicReq();
      const pk            = await fsc.retrievePublicKey();
      const assets        = await fsc.getAssets(pk);
      const xdrToken      = await fsc.generateXDRToken(funcAddresses, pk);
      const funcBalance   = await fsc.getFuncBalance(xdrToken, funcBaseUrl);
      return {req, pk, assets, xdrToken, funcBalance}
    }

    getData().then((res) => {
        if (res.req) {
          if (res.pk) {
            setAccount(res.pk)
            setAssets(res.assets)
            setXDRToken(res.xdrToken)
            setFuncBalance(res.funcBalance)
          }else{
            setAccount('Please Login')
          }
        }
      }
    )
    .catch(console.error)

  }, []);

  return (
    <div className="App">
      <header>
        Token Royale
      </header>
        <Account 
          account={account} 
          funcBalance={funcBalance}
        />
        <ControlPanel 
          account={account} 
          setAssets={setAssets}
          turretPublicKey={turretPublicKey}
          funcBaseUrl={funcBaseUrl}
          funcAddresses={funcAddresses}
          xdrToken={xdrToken}
          setFuncBalance={setFuncBalance}
        />
        <AssetList 
          account={account} 
          setAccount={setAccount} 
          assets={assets}
        />
    </div>
  );
}

export default App;
