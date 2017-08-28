import Web3 from 'web3'
import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Route, Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import HomePage from './HomePage'
import Header from './Header'
import SecondPage from './SecondPage'
import PurchasePage from './PurchasePage'
import OrderSentPage from './OrderSentPage'
import IPFS from 'ipfs'
import temporaryContract from './../temporaryContract.json'
import LINKS from './utils.js'

const SIGN_RETURN_URL = `https://ipfs.io${LINKS.home}`

class Main extends React.Component {
   static contextTypes = {
      router: PropTypes.object
   }

   constructor(props, context){
      super(props, context)

      this.state = {
         ContractInstance: null,
         checkoutData: {},
         buyerData: {},
         sellerData: {},
      }
   }

   componentDidMount(){
      this.initState.bind(this)(done => {

         // TODO activate this
         // this.checkPendingTransactions.bind(this)()
      })
   }

   initState(cb){

      // IPFS crypto functions require https in order to work so redirect
      if(window.location.protocol === 'http:' && window.location.hostname != 'localhost')
         return window.location = window.location.href.replace('http', 'https')

      if(typeof web3 != undefined){
         window.web3 = new Web3(web3.currentProvider)
         window.ipfs = new IPFS({
            init: true,
            start: true,
            config: {
               Bootstrap: [
                  "/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd",
                  "/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3",
                  "/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM",
                  "/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu",
                  "/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm",
                  "/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64"
               ]
            }
         })

         // Check if we are in the page after signing to redirect the user to the confirmation page
         if(window.location.search === '?event=signing_complete')
            return this.context.router.history.push(LINKS.home + LINKS.order)

         this.setState({
            ContractInstance: new web3.eth.Contract(temporaryContract.abiManager, temporaryContract.address)
         }, () => {
            ipfs.on('ready', () => {
               l("IPFS node is ready")

               cb()
            })
         })
      }else{
         alert('This is a descentralized application, you must connect to the blockchain either by using Metamask or Mist. Right now you aren\'t connected. You\'ll be able to use this Dapp when connected')
         return
      }
   }

   // Kills the contract
   declineSellerTransaction(){
      const instanceAddress = this.state.TransactionInstance.address

      this.state.TransactionInstance.buyerAddress((err, buyerAddress) => {
         this.getFirstPendingTransactionAddress(instanceAddress => {
            this.state.ContractInstance.methods.killInstance(instanceAddress, web3.eth.accounts[0], buyerAddress, (err, result) => {

               // Deleted contract, here is the transaction address: result
            })
         })
      })
   }

   checkoutItem(dataObject) {
      this.setState({
         checkoutData: dataObject
      })

      this.context.router.history.push(LINKS.home + LINKS.purchase)
   }

   // Cancel the buying process removing the purchase item state and going back to second page
   declineFirstTransaction() {
      this.setState({
         checkoutData: {}
      })

      this.context.router.history.push(LINKS.home + LINKS.retailer)
   }

   acceptTransaction() {

      // 1. Get the conversion price from USD to Ether
      httpGet('https://coinmarketcap-nexuist.rhcloud.com/api/eth', response => {
         try{
            response = JSON.parse(response)
         }catch(e) {
            alert('Error getting ether - usd conversion, try again')
            return console.log('Error getting ether - usd conversion, try again')
         }

         // Set demo fake data to test the function
         this.setState({
            buyerData: {
               name: 'Example',
               email: 'merunasgrincalaitis@gmail.com',
               address: 'Random Address Example, 23',
               city: 'City Example',
               code: 'SW3492',
               ledger: 'QmslulksifhASFIykJFBNSkufbkASFGHkAKSJFH/ledger',
            },
            sellerData: {
               name: this.state.checkoutData.retailerName,
               email: 'example@example.com',
               address: this.state.checkoutData.retailerAddress,
               city: this.state.checkoutData.retailerCity,
               code: this.state.checkoutData.retailerCode,
               ledger: 'QmsdfiOIHkfhdskjnWUhyfklHKSjfgkuYWUEkjA/ledger',
               walletAddress: '0xDKUSYH4328423khjFHS8k32j4FAS324FH9'
            },
         }, () => {
            const usd = response.price.usd
            const totalPrice = this.state.checkoutData.itemPrice * this.state.checkoutData.itemQuantity
            const etherCost = totalPrice / usd

            /*
               We'll use the checkoutData, the buyerData and the sellerData
            */
            const invoice = `
Item name: ${this.state.checkoutData.itemName}
Item price: $ ${this.state.checkoutData.itemPrice}
Item quantity: ${this.state.checkoutData.itemQuantity}
Total cost: $ ${totalPrice}

---

Seller name: ${this.state.sellerData.name}
Seller email: ${this.state.sellerData.email}
Seller address: ${this.state.sellerData.address}
Seller city: ${this.state.sellerData.city}
Seller code: ${this.state.sellerData.code}
Seller ledger address: ${this.state.sellerData.ledger}
Seller wallet address: ${this.state.sellerData.walletAddress}

---

Buyer name: ${this.state.buyerData.name}
Buyer email: ${this.state.buyerData.email}
Buyer address: ${this.state.buyerData.address}
Buyer city: ${this.state.buyerData.city}
Buyer code: ${this.state.buyerData.code}
Buyer ledger address: ${this.state.buyerData.ledger}
Buyer wallet address: ${web3.eth.accounts[0]}
            `

            const signInvoice = () => {
               const postBody = {
                  fileContent: btoa(invoice), // Convert data to base64
                  firstEmail: this.state.sellerData.email,
                  firstName: this.state.sellerData.name,
                  secondEmail: this.state.buyerData.email,
                  secondName: this.state.buyerData.name,
               }

               // 2. Initiate the sign request
               httpPost('http://esign.comprarymirar.com/first-step', postBody, response => {
                  response = JSON.parse(response)

                  let secondStepBody = {
                     clientUserId: 1001,
                     email: this.state.sellerData.email,
                     recipientId: 1,
                     returnUrl: SIGN_RETURN_URL,
                     userName: this.state.sellerData.name,
                     envelopeId: response.envelopeId,
                  }

                  // 3. Get the seller sign url & redirect him
                  httpPost('http://esign.comprarymirar.com/second-step', secondStepBody, response => {
                     let signUrl = JSON.parse(response).url;

                     window.location = signUrl
                  })
               })
            }

            const generateIpfsInstance = done => {
               ipfs.files.add(
                  new ipfs.types.Buffer(invoice)
               ).then(invoiceHashAddress => {
                  let buyerCompleteAddress = `${this.state.buyerData.address} ${this.state.buyerData.city} ${this.state.buyerData.code}`
                  let sellerCompleteAddress = `${this.state.sellerData.address} ${this.state.sellerData.city} ${this.state.sellerData.code}`
                  invoiceHashAddress = invoiceHashAddress[0].hash

                  console.log('Invoice IPFS address')
                  console.log(invoiceHashAddress)

                  web3.eth.getAccounts().then(accounts => {
                     if(accounts === null  || accounts === 'undefined' || accounts.length <= 0)
                        return alert('Error, could not get the wallet account')

                     console.log('Data')
                     console.log([this.state.buyerData.name,
                     this.state.buyerData.email,
                     accounts[0], // Buyer's wallet address
                     buyerCompleteAddress,
                     this.state.sellerData.name,
                     this.state.sellerData.email,
                     this.state.sellerData.walletAddress,
                     sellerCompleteAddress,
                     this.state.checkoutData.itemName,
                     parseFloat(this.state.checkoutData.itemPrice),
                     parseInt(this.state.checkoutData.itemQuantity),
                     invoiceHashAddress])

                     // Generate the smart contract instance and save the hash address of the invoice
                     this.state.ContractInstance.methods.createInstance(
                        this.state.buyerData.name,
                        this.state.buyerData.email,
                        accounts[0], // Buyer's wallet address
                        buyerCompleteAddress,
                        this.state.sellerData.name,
                        this.state.sellerData.email,
                        this.state.sellerData.walletAddress,
                        sellerCompleteAddress,
                        this.state.checkoutData.itemName,
                        parseFloat(this.state.checkoutData.itemPrice),
                        parseInt(this.state.checkoutData.itemQuantity),
                        invoiceHashAddress, {
                           from: accounts[0],
                           gas: 3000000,
                           value: web3.utils.toWei(etherCost, 'ether')
                        }, (err, result) => {

                           l('Invoice hash addres')
                           l(invoiceHashAddress)
                           done()
                     })
                  })
               }).catch(console.log)
            }

            generateIpfsInstance(done => {
               l('Dones')
               signInvoice()
            })
         })
      })
   }

   render() {
      return (
         <App {...this.state}>
            <Route exact path={LINKS.home} component={HomePage} />
            <Route path={LINKS.home + LINKS.retailer} render={() => (
               <SecondPage checkoutItem={data => this.checkoutItem(data)}
               />
            )} />
            <Route path={LINKS.home + LINKS.purchase} render={() => (
               <PurchasePage
                  {...this.state}
                  declineTransaction={() => this.declineFirstTransaction()}
                  acceptTransaction={() => this.acceptTransaction()}
               />
            )} />
            <Route path={LINKS.home + LINKS.order} component={OrderSentPage} />
         </App>
      )
   }
}

class App extends React.Component {
   constructor(props){
      super(props)

      this.state = {
         currentSection: window.location.pathname.split('/')[1]
      }
   }

   toggleMenu(open){
      if(open) this.refs['site-pusher'].className = 'site-pusher menu-open'
      else this.refs['site-pusher'].className = 'site-pusher'
   }

   render(){
      return (
         <div className="site-container">
            <div ref='site-pusher' className='site-pusher'>
               <Header handleMenu={state => this.toggleMenu(state)} />

               <div className="site-content">
                  {this.props.children}
               </div>
            </div>
         </div>
      )
   }
}

window.addEventListener('load', () => {
   ReactDOM.render(
      <BrowserRouter>
         <Main />
      </BrowserRouter>,
      document.querySelector('#root')
   )
})

// Helper function to make console.logs faster
function l(m){
   console.log(m)
}

// Helper function to make Ajax calls
function httpGet(url, cb){
   const xhr = new XMLHttpRequest()
   xhr.open('GET', url)
   xhr.addEventListener('readystatechange', () => {
      if(xhr.readyState === XMLHttpRequest.DONE) cb(xhr.responseText)
   })
   xhr.send()
}

// Helper function to make Ajax calls
function httpPost(url, bodyObject, cb){
   const xhr = new XMLHttpRequest()
   xhr.open('POST', url)
   xhr.setRequestHeader('Content-Type', 'application/json')
   xhr.addEventListener('readystatechange', () => {
      if(xhr.readyState === XMLHttpRequest.DONE) cb(xhr.responseText)
   })
   xhr.send(JSON.stringify(bodyObject))
}
