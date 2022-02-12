import React from "react";
import Asset from './Asset';

const AssetList = ({account, assets}) => { 

    const processItem = (ast) => {
        let assetName = ''
        if (ast.asset === undefined){
            assetName = 'XLM'
        }else{
            assetName = ast.asset
        }
        return (<Asset ast={assetName} balance={ast.balance}/>)
    }
      
    return(
        <div>
            <div className="assets-title">
                <h1>Assets</h1>
            </div>
            <div className="assets-container">
                <ul className="assets-list">
                    {assets.map(processItem)}                
                </ul>
            </div>
        </div>
    );
}

export default AssetList;