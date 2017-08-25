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

const checkNewLedgers = cb => {

   // If the cash ledger address is empty, then generate a new one with the cash indicated
   if(data.buyerCashLedgerHashAddress.length <= 0 && data.buyerAssetsLedgerHashAddress.length <= 0){
      ipfs.files.add(
         new ipfs.types.Buffer(newCashLedgerAmount)
      ).then(results => {
         data.buyerCashLedgerHashAddress = results[0].hash

         this.setState({ buyerCashLedgerHashAddress: results[0].hash })

         ipfs.files.add(
            new ipfs.types.Buffer(newAssetsLedgerAmount)
         ).then(results => {
            data.buyerAssetsLedgerHashAddress = results[0].hash

            this.setState({ buyerAssetsLedgerHashAddress: results[0].hash })

            cb()
         })
      })
   }else if(data.buyerCashLedgerHashAddress.length <= 0){
      ipfs.files.add(
         new ipfs.types.Buffer(newCashLedgerAmount)
      ).then(results => {
         data.buyerCashLedgerHashAddress = results[0].hash

         this.setState({ buyerCashLedgerHashAddress: results[0].hash })

         cb()
      })
   }else if(data.buyerAssetsLedgerHashAddress.length <= 0){
      ipfs.files.add(
         new ipfs.types.Buffer(newAssetsLedgerAmount)
      ).then(results => {
         data.buyerAssetsLedgerHashAddress = results[0].hash

         this.setState({ buyerAssetsLedgerHashAddress: results[0].hash })

         cb()
      })
   }
}

submitBuyerForm(data){

   // First generate an invoice document Then create the smart contract instance with the invoice hash
   const generateIpfsInvoice = () => {
      let invoice = JSON.stringify(data)

      ipfs.files.add(
         new ipfs.types.Buffer(invoice)
      ).then(invoiceHashAddress => {

         // This is how solidity will receive the data
         let buyerNameEmailGpsLocation = [
            data.buyerName, data.buyerEmail, data.buyerGPSLocation
         ]
         let buyerSellerAddresses = [
            data.buyerAddress, data.sellerAddress
         ]
         let sellerNameEmail = [
            data.sellerName, data.sellerEmail
         ]
         let buyerVatQuantityPriceItem = [
            parseInt(data.buyerVatNumber), parseInt(data.quantityBought), web3.toWei(data.pricePerItem, 'ether')
         ]
         invoiceHashAddress = invoiceHashAddress[0].hash

         this.setState({ invoiceHashAddress: invoiceHashAddress })

         // Generate the smart contract instance and save the hash address of the invoice
         this.state.ContractInstance.generateInstance(
            buyerSellerAddresses,
            invoiceHashAddress,
            sellerNameEmail,
            buyerVatQuantityPriceItem,
            buyerNameEmailGpsLocation,
            data.buyerCashLedgerHashAddress,
            data.buyerAssetsLedgerHashAddress, {
               gas: 3000000,
               from: data.buyerAddress,
               value: web3.toWei(data.amountPayEther, 'ether')
            }, (err, result) => {

            l('Invoice hash addres')
            l(invoiceHashAddress)
         })
      })
   }

   checkNewLedgers(done => {
      generateIpfsInvoice()
   })
}

submitSellerForm(data, newCashLedgerAmount, newAssetsLedgerAmount){

   let combinedData

   // 1
   const updateIPFSInvoice = cb => {
      const checkNewLedgers = cb => {

         // If the cash ledger address is empty, then generate a new one with the cash indicated
         if(data.sellerCashLedgerHashAddress.length <= 0 && data.sellerAssetsLedgerHashAddress.length <= 0){
            ipfs.files.add(
               new ipfs.types.Buffer(newCashLedgerAmount)
            ).then(results => {
               data.sellerCashLedgerHashAddress = results[0].hash

               ipfs.files.add(
                  new ipfs.types.Buffer(newAssetsLedgerAmount)
               ).then(results => {
                  data.sellerAssetsLedgerHashAddress = results[0].hash

                  cb()
               })
            })
         }else if(data.sellerCashLedgerHashAddress.length <= 0){
            ipfs.files.add(
               new ipfs.types.Buffer(newCashLedgerAmount)
            ).then(results => {
               data.sellerCashLedgerHashAddress = results[0].hash

               cb()
            })
         }else if(data.sellerAssetsLedgerHashAddress.length <= 0){
            ipfs.files.add(
               new ipfs.types.Buffer(newAssetsLedgerAmount)
            ).then(results => {
               data.sellerAssetsLedgerHashAddress = results[0].hash

               cb()
            })
         }
      }

      const modifyUploadInvoice = cb => {

         // Get invoice hash address
         this.state.ContractInstance.getInvoiceHash(web3.eth.accounts[0], (err, invoiceHash) => {
            invoiceHash = web3.toUtf8(invoiceHash)

            // Read current invoice data
            ipfs.files.cat(invoiceHash, (err, stream) => {
               stream.on('data', file => {
                  let fileContent = new TextDecoder('utf-8').decode(file)
                  let invoiceData = JSON.parse(fileContent)
                  combinedData = {
                     ...invoiceData,
                     ...data,
                     invoiceInstanceAddress: this.state.TransactionInstance.address
                  }

                  ipfs.files.add(
                     new ipfs.types.Buffer(JSON.stringify(combinedData))
                  ).then(invoiceHashAddress => {

                     cb(invoiceHashAddress[0].hash)
                  })
                })
            })
         })
      }

      checkNewLedgers(done => {
         modifyUploadInvoice(newInvoiceHash => {
            cb(newInvoiceHash)
         })
      })
   }

   // 2
   const signIPFSInvoice = invoiceHash => {

      let documentInvoice = `
         Amount paid in ether: ${combinedData.amountPayEther}
         Price per item: ${combinedData.pricePerItem}
         Quantity bought: ${combinedData.quantityBought}
         Transaction VAT: ${combinedData.transactionVat}
         ---
         Buyer name: ${combinedData.buyerName}
         Buyer email: ${combinedData.buyerEmail}
         Buyer address: ${combinedData.buyerAddress}
         Buyer cash ledger hash address: ${combinedData.buyerCashLedgerHashAddress}
         Buyer assets ledger hash address: ${combinedData.buyerAssetsLedgerHashAddress}
         Buyer GPS location: ${combinedData.buyerGPSLocation}
         Buyer VAT number: ${combinedData.buyerVatNumber}
         ---
         Seller Name: ${combinedData.sellerName}
         Seller email: ${combinedData.sellerEmail}
         Seller addres: ${combinedData.sellerAddress}
         Seller cash ledger hash address: ${combinedData.sellerCashLedgerHashAddress}
         Seller assets ledger hash address: ${combinedData.sellerAssetsLedgerHashAddress}
         Seller GPS location: ${combinedData.sellerGpsLocation}
         Seller VAT number: ${combinedData.sellerVatNumber}
         ---
         IPFS invoice instance address: ${this.state.TransactionInstance.address}
      `

      const postBody = {
         fileContent: btoa(documentInvoice), // Convert data to base64
         firstEmail: combinedData.sellerEmail,
         firstName: combinedData.sellerName,
         secondEmail: combinedData.buyerEmail,
         secondName: combinedData.buyerName,
      }

      // Initiate the sign request
      httpPost('http://esign.comprarymirar.com/first-step', postBody, response => {
         response = JSON.parse(response)

         // Update the 4 ledgers
         updateLedgerAmount(combinedData.sellerCashLedgerHashAddress, +combinedData.amountPayEther, hash => {
            combinedData.sellerCashLedgerHashAddress = hash
         })
         updateLedgerAmount(combinedData.sellerAssetsLedgerHashAddress, -combinedData.quantityBought, hash => {
            combinedData.sellerAssetsLedgerHashAddress = hash
         })
         updateLedgerAmount(combinedData.buyerCashLedgerHashAddress, -combinedData.amountPayEther, hash => {
            combinedData.buyerCashLedgerHashAddress = hash
         })
         updateLedgerAmount(combinedData.buyerAssetsLedgerHashAddress, +combinedData.quantityBought, hash => {
            combinedData.buyerAssetsLedgerHashAddress = hash
         })

         // Update the invoice instance data
         this.state.ContractInstance.completeSellerInvoiceData(
            this.state.TransactionInstance.address,
            combinedData.sellerAddress,
            combinedData.buyerAddress,
            web3.toWei(combinedData.amountPayEther, 'ether'),
            combinedData.sellerAssetsLedgerHashAddress,
            combinedData.sellerCashLedgerHashAddress,
            combinedData.sellerGpsLocation,
            combinedDatacombinedData.sellerVatNumber,
            combinedData.transactionVat,
            invoiceHash,
            response.envelopeId, {
               gas: 2000000,
               from: web3.eth.accounts[0],
            }, (err, result) => {

            let secondStepBody = {
               clientUserId: 1001,
               email: combinedData.sellerEmail,
               recipientId: 1,
               returnUrl: SIGN_RETURN_URL,
               userName: combinedData.sellerName,
               envelopeId: response.envelopeId,
            }

            // Get the seller sign url & redirect him
            httpPost('http://esign.comprarymirar.com/second-step', secondStepBody, response => {
               let signUrl = JSON.parse(response).url;

               window.location = signUrl
            })
         })
      })
   }

   const updateLedgerAmount = (ledgerHash, amount, cb) => {
      ipfs.files.cat(ledgerHash, (err, stream) => {
         stream.on('data', file => {
            let fileContent = parseFloat(new TextDecoder('utf-8').decode(file))

            fileContent += amount

            ipfs.files.add(
               new ipfs.types.Buffer(JSON.stringify(fileContent))
            ).then(invoiceHashAddress => {

               cb(invoiceHashAddress[0].hash)
            })
          })
      })
   }

   updateIPFSInvoice(invoiceHash => {
      signIPFSInvoice(invoiceHash)
   })
}

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
