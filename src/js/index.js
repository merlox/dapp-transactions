import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import './../css/index.css'
import IPFS from 'ipfs'
import BuyerForm from './BuyerForm.js'
import SellerForm from './SellerForm.js'
import temporaryContract from './../temporaryContract.json'
import bs58 from 'bs58'

class App extends React.Component {
   constructor(props){
      super(props)

      this.state = {
         ipfs: null,
         ContractInstance: null,
         displayBuyerForm: true,
         displayAreYouSure: false,
         displaySellerForm: false,
      }
   }

   componentDidMount(){
      this.initState.bind(this)(done => {
         this.generateBuyerAddressSelect.bind(this)()
         setTimeout(() => {
            this.generateBuyerAddressSelect.bind(this)()
            this.checkPendingTransactions.bind(this)()
         }, 1e3)
      })
   }

   initState(cb){
      if(typeof web3 != 'undefined'){
         l("Using web3 detected from external source like Metamask")
         window.web3 = new Web3(web3.currentProvider)
         this.setState({
            ipfs: new IPFS(),
            ContractInstance: web3.eth.contract(temporaryContract.abiManager).at(temporaryContract.address)
         }, () => {
            this.state.ipfs.on('ready', () => {
               l("IPFS node is ready")
            })

            cb()
         })
      }else{
         alert('This is a descentralized application, you must connect to the blockchain either by using Metamask or Mist. Right now you aren\'t connected. You\'ll be able to use this Dapp when connected')
         return
      }
   }

   submitBuyerForm(data, newCashLedgerAmount, newAssetsLedgerAmount){
      const checkNewLedgers = cb => {

         // If the cash ledger address is empty, then generate a new one with the cash indicated
         if(data.buyerCashLedgerHashAddress.length <= 0 && data.buyerAssetsLedgerHashAddress.length <= 0){
            this.state.ipfs.files.add(
               new this.state.ipfs.types.Buffer(newCashLedgerAmount)
            ).then(results => {
               data.buyerCashLedgerHashAddress = results[0].hash

               this.state.ipfs.files.add(
                  new this.state.ipfs.types.Buffer(newAssetsLedgerAmount)
               ).then(results => {
                  data.buyerAssetsLedgerHashAddress = results[0].hash

                  cb()
               })
            })
         }else if(data.buyerCashLedgerHashAddress.length <= 0){
            this.state.ipfs.files.add(
               new this.state.ipfs.types.Buffer(newCashLedgerAmount)
            ).then(results => {
               data.buyerCashLedgerHashAddress = results[0].hash

               cb()
            })
         }else if(data.buyerAssetsLedgerHashAddress.length <= 0){
            this.state.ipfs.files.add(
               new this.state.ipfs.types.Buffer(newAssetsLedgerAmount)
            ).then(results => {
               data.buyerAssetsLedgerHashAddress = results[0].hash

               cb()
            })
         }
      }

      // First generate an invoice document Then create the smart contract instance with the invoice hash
      const generateIpfsInvoice = () => {
         let invoice = JSON.stringify(data)

         l('Adding invoice to IPFS')
         l(invoice)

         this.state.ipfs.files.add(
            new this.state.ipfs.types.Buffer(invoice)
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

   // Puts the wallet addresses in a <select>
   generateBuyerAddressSelect(){
      let nodes = web3.eth.accounts.map(addr => {
         return <option key={addr}>{addr}</option>
      })

      this.setState({
         addressNodes: nodes
      })
   }

   getFirstPendingTransactionAddress(cb){
      const userAddresses = web3.eth.accounts

      this.state.ContractInstance.getPendingTransactionsSellerAddresses((err, pendingTransactionsSellerAddresses) => {
         for(let i = 0; i < userAddresses.length; i++){
            for(let j = 0; j < pendingTransactionsSellerAddresses.length; j++){
               let currentPendingTransactionSellerAddress = pendingTransactionsSellerAddresses[j]

               if(userAddresses[i] === currentPendingTransactionSellerAddress){

                  // Get the instance address given the seller address
                  this.state.ContractInstance.getInstanceAddress(currentPendingTransactionSellerAddress, (err, sellerInstanceAddress) => {
                     return cb(sellerInstanceAddress)
                  })
               }
            }
         }

         return cb(null)
      })
   }

   checkPendingTransactions(){
      this.getFirstPendingTransactionAddress(sellerInstanceAddress => {
         if(sellerInstanceAddress !== null){

            // Generate the Transaction contract instance and get his data
            this.setState({
               TransactionInstance: web3.eth.contract(temporaryContract.abiTransaction).at(sellerInstanceAddress)
            }, () => {
               this.state.TransactionInstance.getInitialData((err, initialData) => {
                  this.state.TransactionInstance.getHashAddresses((err, hashAddresses) => {
                     this.createNotificationSeller(initialData, hashAddresses)
                  })
               })
            })
         }
      })
   }

   // If found a pending initiated transaction, execute this
   createNotificationSeller(initialData, hashAddresses){

      let newData = {
         displayBuyerForm: false,
         displaySellerForm: false,
         buyerName: web3.toUtf8(initialData[0]),
         buyerAddress: initialData[3],
         buyerEmail: web3.toUtf8(initialData[2]),
         invoiceHashAddress: web3.toUtf8(hashAddresses[0]),
         buyerCashLedgerHashAddress: web3.toUtf8(hashAddresses[1]),
         buyerAssetsLedgerHashAddress: web3.toUtf8(hashAddresses[2]),
         buyerGPSLocation: web3.toUtf8(initialData[4]),
         buyerVatNumber: parseInt(initialData[7]),
         sellerName: web3.toUtf8(initialData[5]),
         sellerAddress: initialData[1],
         sellerEmail: web3.toUtf8(initialData[6]),
         quantityBought: parseInt(initialData[8]),
         pricePerItem: web3.fromWei(parseInt(initialData[9]), 'ether'),
         amountPayEther: web3.fromWei(parseInt(initialData[10]), 'ether'),
      }

      this.setState(newData)
   }

   // Kills the contract
   declineSellerTransaction(){
      const instanceAddress = this.state.TransactionInstance.address
      l(instanceAddress)
      this.getFirstPendingTransactionAddress(instanceAddress => {
         this.state.ContractInstance.killInstance(instanceAddress, web3.eth.accounts[0], (err, result) => {

            l('Deleted contract, here is the transaction address')
            l(result)
         })
      })
   }

   submitSellerForm(data, newCashLedgerAmount, newAssetsLedgerAmount){

      l(data)

      // 1
      const updateIPFSInvoice = cb => {
         const checkNewLedgers = cb => {

            // If the cash ledger address is empty, then generate a new one with the cash indicated
            if(data.sellerCashLedgerHashAddress.length <= 0 && data.sellerAssetsLedgerHashAddress.length <= 0){
               this.state.ipfs.files.add(
                  new this.state.ipfs.types.Buffer(newCashLedgerAmount)
               ).then(results => {
                  data.sellerCashLedgerHashAddress = results[0].hash

                  this.state.ipfs.files.add(
                     new this.state.ipfs.types.Buffer(newAssetsLedgerAmount)
                  ).then(results => {
                     data.sellerAssetsLedgerHashAddress = results[0].hash

                     cb()
                  })
               })
            }else if(data.sellerCashLedgerHashAddress.length <= 0){
               this.state.ipfs.files.add(
                  new this.state.ipfs.types.Buffer(newCashLedgerAmount)
               ).then(results => {
                  data.sellerCashLedgerHashAddress = results[0].hash

                  cb()
               })
            }else if(data.sellerAssetsLedgerHashAddress.length <= 0){
               this.state.ipfs.files.add(
                  new this.state.ipfs.types.Buffer(newAssetsLedgerAmount)
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
               this.state.ipfs.files.cat(invoiceHash, (err, stream) => {
                  stream.on('data', file => {
                     let fileContent = new TextDecoder('utf-8').decode(file)
                     let invoiceData = JSON.parse(fileContent)
                     let combinedData = {...invoiceData, ...data}

                     l('Combined data')
                     l(combinedData)

                     this.state.ipfs.files.add(
                        new this.state.ipfs.types.Buffer(JSON.stringify(combinedData))
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
      const updateInvoiceInstance = (invoiceHash, cb) => {

         // Generate the smart contract instance and save the hash address of the invoice
         this.state.ContractInstance.completeSellerInvoiceData(
            this.state.TransactionInstance.address,
            data.sellerAssetsLedgerHashAddress,
            data.sellerCashLedgerHashAddress,
            data.sellerGpsLocation,
            data.sellerVatNumber,
            data.transactionVat,
            invoiceHash, {
               gas: 2000000,
               from: web3.eth.accounts[0],
            }, (err, result) => {

            cb()
         })
      }

      // 3
      const signIPFSInvoice = () => {

      }

      // Update the IPFS invoice
      updateIPFSInvoice(newInvoiceHash => {

         // Complete the contract data with the seller information
         updateInvoiceInstance(newInvoiceHash, done => {
            signIPFSInvoice()
         })
      })

      // TODO Sign it
      // Sign the IPFS invoice
      // GET the ether from the transaction when both sign
   }

   render(){
      if(this.state.displayBuyerForm){
         return (
            <div className="main-container">
               <BuyerForm
                  {...this.state}
                  submitBuyerForm={(data, newCashLedgerAmount, newAssetsLedgerAmount) => {
                     this.submitBuyerForm(data, newCashLedgerAmount, newAssetsLedgerAmount)
                  }}
                  handleState={stateObject => this.setState(stateObject)}
               />
            </div>
         )
      }else{
         return (
            <div className="main-container">
               <SellerForm {...this.state}
                  handleState={stateObject => this.setState(stateObject)}
                  declineTransaction={() => this.declineSellerTransaction()}
                  submitSellerForm={(data, newCashLedgerAmount, newAssetsLedgerAmount) => {
                     this.submitSellerForm(data, newCashLedgerAmount, newAssetsLedgerAmount)
                  }}
               />
            </div>
         )
      }
   }
}

window.addEventListener('load', () => {
   let div = document.createElement('div')
   div.id = 'root'
   document.body.appendChild(div)

   ReactDOM.render(
      <App />,
      document.querySelector('#root')
   )
})


// Helper function to make console.logs faster
function l(m){
   console.log(m)
}
