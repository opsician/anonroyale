import React from "react";

const Asset = ({ast, balance}) => {
      
    return(
        <div className="asset">
            <li className="asset-item">{ast + '\t' + balance}</li>
        </div>
    );
}

export default Asset;