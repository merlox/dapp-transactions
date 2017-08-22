getWaitingTransactionAddress(cb){
   const userAddresses = web3.eth.accounts

   this.state.ContractInstance.getWaitingCounterSignInstancesBuyerAddress((err, waitingTransactionsAddresses) => {
      for(let i = 0; i < userAddresses.length; i++){
         for(let j = 0; j < waitingTransactionsAddresses.length; j++){
            let waitingTransactionAddress = waitingTransactionsAddresses[j]

            if(userAddresses[i] === waitingTransactionAddress){

               // Get the instance address given the seller address
               this.state.ContractInstance.getBuyerInstanceAddress(waitingTransactionAddress, (err, instanceAddress) => {
                  return cb(instanceAddress)
               })
            }
         }
      }

      return cb(null)
   })
}

this.getWaitingTransactionAddress(instanceAddress => {

   // Generate the Transaction contract instance and get his data
   this.setState({
      TransactionInstance: web3.eth.contract(temporaryContract.abiTransaction).at(instanceAddress)
   }, () => {

      this.state.TransactionInstance.getInitialData((err, initialData) => {
         this.state.TransactionInstance.getHashAddresses((err, hashAddresses) => {
            this.state.TransactionInstance.getMissingSellerData((err, sellerData) => {
               this.createNotificationSeller(initialData, hashAddresses, sellerData)
            })
         })
      })
   })
})

if(sellerData != undefined){
   newData = {
      ...newData,
      displayBuyerNotification: true,
      sellerGpsLocation: web3.toUtf8(sellerData[0]),
      sellerCashLedgerAddress: web3.toUtf8(sellerData[1]),
      sellerAssetsLedgerAddress: web3.toUtf8(sellerData[2]),
      sellerVatNumber: parseInt(sellerData[3]),
      invoiceHashAddress: web3.toUtf8(hashAddresses[4]),
      envelopeId: web3.toUtf8(sellerData[5]),
      vat: parseInt(sellerData[9]),
   }
}
