import React from "react";

const Account = ({account, funcBalance, xdrToken}) => {
      
    return(
        // <div className="account">
        <div className="assets-container">
            <ul className="assets-list">
                <li className="assets-item">Account: {account}</li>   
                <li className="assets-item">Balance: {funcBalance}</li>           
            </ul>
        </div>
    );
}

export default Account;