import freighterApi from "@stellar/freighter-api";
import StellarSdk from "stellar-sdk";
import StellarBase from "stellar-base";
import axios from "axios";

const checkFreighter = async () => {
    if (freighterApi.isConnected()) {
        return true
    }
    return false
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
        console.error(error);
        return false
    }
    return publicKey;
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
        console.error(error)
        return false;
    }
    if (network !== 'TESTNET'){
        return false
    }
    return true
};

const checkBasicReq = async () => {
    const userPublicKey     = await retrievePublicKey()
    const network           = await retrieveNetwork()
    const wallet            = await checkFreighter()

    return userPublicKey && network && wallet
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

const payment = async (paymentAmt: string, destination: string, publicKey: string) => {
    const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
    const paymentToDest = {
        destination: destination,
        asset: StellarSdk.Asset.native(),
        amount: paymentAmt,
    }
    const txOptions = {
        fee: await server.fetchBaseFee(),
        networkPassphrase: 'Test SDF Network ; September 2015',
    }
    const accountA = await server.loadAccount(publicKey)
    const transaction = new StellarSdk.TransactionBuilder(accountA, txOptions)
        .addOperation(StellarSdk.Operation.payment(paymentToDest))
        .setTimeout(StellarBase.TimeoutInfinite)
        .build()
    const transactionString = transaction.toEnvelope().toXDR('base64')
    const xdrPay = await userSignTransaction(transactionString, "TESTNET")
    return xdrPay
}

const topUp = async (xdrPay: string, turretBaseUrl: string, publicKey: string) => {
    const body = {
        txFunctionFee: xdrPay
    }
    const res = await axios.post(turretBaseUrl + 'tx-fees/' + publicKey, body)
    return res.data
};

const generateXDRToken = async (txFunctionHashes: string, publicKey: string) => {
    console.log('Generating XDR Token...');
    try {
        // setup a fake account with a -1 seq number.
        // This ensures a zero seq number when the transaction is built (TransactionBuilder increments once).
        const tempAcct = new StellarSdk.Account(publicKey, '-1');
        const testnet = new StellarSdk.Server('https://horizon-testnet.stellar.org')
        const fee = await testnet.fetchBaseFee();
        const txBuilder = new StellarSdk.TransactionBuilder(tempAcct, {fee, networkPassphrase: StellarSdk.Networks.TESTNET});
        // add the manage data operations to specify the allowed txHashes to be run for this user
        for (const hash of txFunctionHashes) {
            txBuilder.addOperation(StellarSdk.Operation.manageData({
                name: "txFunctionHash",
                value: hash
            }));
        }
        // set TTL on the token for 1 hour
        const tx = txBuilder.setTimeout(24*60*60).build();
        // sign transaction
        const txHashed = tx.toEnvelope().toXDR('base64')
        const txSigned = await userSignTransaction(txHashed, "TESTNET")
        return txSigned;
    } catch (e) {
        alert(e);
    }
};

const runFunc = async(
    publicKey: string, 
    xdrToken: string, 
    turretURL: string,
    funcHash: string
    ) => {
        console.log('Running function...')
        const body = {
            source: publicKey
        }
        const headers = {
            "Authorization": "Bearer " + xdrToken
        }
        const response = await axios.post(turretURL + 'tx-functions/' + funcHash, body, {headers: headers})
        return response.data
};

const turretSign = async(xdr: string, signer: string, signature: string) => {
    console.log('Adding turret signature to transaction...')
    const transaction = new StellarSdk.Transaction(xdr, StellarSdk.Networks.TESTNET)
    transaction.addSignature(signer, signature)
    return transaction.toXDR()
};

const sendTransaction = async(signedTxn: string) => {
    console.log('Sending transaction...')
    const serverUrl = "https://horizon-testnet.stellar.org"
    const server = new StellarSdk.Server(serverUrl)
    var txn = new StellarSdk.Transaction(signedTxn, StellarSdk.Networks.TESTNET)
    const txnString = txn.toEnvelope().toXDR('base64')
    const txnSignedComplete = await userSignTransaction(txnString, "TESTNET")
    const txnToSubmit = StellarSdk.TransactionBuilder.fromXDR(
        txnSignedComplete,
        serverUrl
    );
    const response = await server.submitTransaction(txnToSubmit);
    return response
};

const getAssets = async (userPublicKey) => {
    const server = new StellarSdk.Server('https://horizon-testnet.stellar.org')
    const account = await server.loadAccount(userPublicKey);
    const balances = account.balances.map( balance => ({
        asset: balance.asset_code,
        type: balance.asset_type,
        balance: balance.balance
    }))

    return balances
}

const getFuncBalance = async (
    xdrToken: string, 
    turretURL: string
    ) => {
        const headers = {
            "Authorization": "Bearer " + xdrToken
        }
        const response = await axios.get(turretURL + 'tx-fees/', {headers: headers})
        return response.data.balance
}

export {
    checkFreighter,
    retrievePublicKey,
    retrieveNetwork,
    checkBasicReq,
    userSignTransaction,
    payment,
    topUp,
    generateXDRToken,
    runFunc,
    turretSign,
    sendTransaction,
    getAssets,
    getFuncBalance,
}