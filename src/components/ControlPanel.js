import React from "react";
import * as fsc from "../freighter-sc";

const ControlPanel = ({account, setAssets, turretPublicKey, funcBaseUrl, funcAddresses, xdrToken, setFuncBalance}) => {
  
    const buttonTopUp = async () => {
        const requirements = await fsc.checkBasicReq();
  
        if (requirements){
            const payXDR            = await fsc.payment('10', turretPublicKey, account)
            await fsc.topUp(payXDR, funcBaseUrl, account);
            const assets            = await fsc.getAssets(account);
            const funcBalance       = await fsc.getFuncBalance(xdrToken, funcBaseUrl);
            setAssets(assets)
            setFuncBalance(funcBalance)
        }else{
            alert('Something went wrong: User must have Freighter extension and must be on TESTNET')
        }
    };
  
    const buttonRunFunc = async () => {
        const requirements = await fsc.checkBasicReq();
    
        if (requirements){
            // const xdrToken          = await fsc.generateXDRToken(funcAddresses, account)
            const runResult         = await fsc.runFunc(account, xdrToken, funcBaseUrl, funcAddresses[0])
            console.log(runResult)
            const resultSigned      = await fsc.turretSign(runResult.xdr, runResult.signer, runResult.signature)
            const res               = await fsc.sendTransaction(resultSigned)
            console.log(res)
            if (res.successful === true) {
                const assets            = await fsc.getAssets(account);
                const funcBalance       = await fsc.getFuncBalance(xdrToken, funcBaseUrl);
                setAssets(assets)
                setFuncBalance(funcBalance)
            }
        }else{
            alert('Something went wrong: User must have Freighter extension and must be on TESTNET')
        }
    };
    return(
        <div className="cpanel">
            <button onClick={buttonTopUp}>
            Top Up
            </button>
            <button onClick={buttonRunFunc}>
            Run
            </button>
        </div>
    );
}

export default ControlPanel;