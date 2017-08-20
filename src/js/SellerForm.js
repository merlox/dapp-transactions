import React from 'react'
import './../css/index.css'

class SellerForm extends React.Component {
   constructor(props){
      super(props)
   }

   handleSubmitForm(event){
      event.preventDefault()

      const data = {
         sellerGpsLocation: this.refs['seller-gps-location'].value,
         sellerVatNumber: this.refs['seller-vat-number'].value,
         transactionVat: this.refs['transaction-vat'].value,
         sellerCashLedgerHashAddress: this.refs['seller-cash-ledger-hash-address'].value,
         sellerAssetsLedgerHashAddress: this.refs['seller-assets-ledger-hash-address'].value,
      }

      let newCashLedgerAmount = this.refs['seller-new-cash-ledger-amount'].value
      let newAssetsLedgerAmount = this.refs['seller-new-assets-ledger-amount'].value

      if(data.sellerCashLedgerHashAddress.length <= 0 && newCashLedgerAmount <= 0){
         alert('You need to specify the hash of the cash ledger or the amount of cash for the new cash ledger')
         return
      }
      if(data.sellerAssetsLedgerHashAddress.length <= 0 && newAssetsLedgerAmount <= 0){
         alert('You need to specify the hash of the assets ledger or the amount of assets for the new cash ledger')
         return
      }

      this.props.submitSellerForm(
         data,
         parseInt(newCashLedgerAmount),
         parseInt(newAssetsLedgerAmount),
      )
   }

   render(){
      if(this.props.displaySellerForm != false){
         return(
            <div>
               <h1>Complete the transaction data</h1>
               <button onClick={() => {
                  this.props.handleState({ displaySellerForm: false })
               }}>Back</button>
               <form className="main-form" ref="main-form" onSubmit={e => { this.handleSubmitForm(e) }}>
                  <label>
                     Seller's GPS location:
                     <input ref="seller-gps-location" type="text" placeholder="GPS location"/>
                  </label>

                  <label>
                     Seller's VAT number:
                     <input ref="seller-vat-number" type="number" placeholder="VAT number"/>
                  </label>

                  <label>
                     VAT for the transaction:
                     <input ref="transaction-vat" type="number" placeholder="VAT amount"/>
                  </label>

                  <label>
                     Sellers's cash ledger hash address:
                     <div>
                        <input ref="seller-cash-ledger-hash-address" type="text"
                           style={{display: this.props.hasCashLedgerAddress ? 'block' : 'none'}} placeholder="IPFS hash address"/>
                        <p ref="seller-new-cash-ledger-hash-address" style={{display: this.props.hasNotCashLedgerAddress ? 'block' : 'none'}}>
                           If you don't have a cash ledger hash address, a new one will be created and you'll get the hash address. If so, please specify how much cash will be stored in it:
                           <input ref="seller-new-cash-ledger-amount" type="number" placeholder="Cash in Ether" defaultValue="0"/>
                        </p>
                     </div>

                     <div>
                        <button type="button" onClick={() => {
                           this.props.handleState({
                              hasNotCashLedgerAddress: false,
                              hasCashLedgerAddress: true
                           })
                        }}>I have a cash ledger IPFS hash address</button>

                        <button type="button" onClick={() => {
                           this.props.handleState({
                              hasNotCashLedgerAddress: true,
                              hasCashLedgerAddress: false
                           })
                        }}>I don't have a cash ledger IPFS hash address</button>
                     </div>
                  </label>

                  <label>
                     Seller's assets ledger hash address:
                     <div>
                        <input ref="seller-assets-ledger-hash-address" type="text"
                           style={{display: this.props.hasAssetsLedgerAddress ? 'block' : 'none'}} placeholder="IPFS hash address"/>
                        <p ref="seller-new-assets-ledger-hash-address" style={{display: this.props.hasNotAssetsLedgerAddress ? 'block' : 'none'}}>
                           If you don't have an assets ledger hash address, a new one will be created and you'll get the hash address. If so, please specify how many assets will be stored in it, only numbers:
                           <input ref="seller-new-assets-ledger-amount" type="number" placeholder="Cash in Ether" defaultValue="0"/>
                        </p>
                     </div>

                     <div>
                        <button type="button" onClick={() => {
                           this.props.handleState({
                              hasNotAssetsLedgerAddress: false,
                              hasAssetsLedgerAddress: true
                           })
                        }}>I have an assets ledger IPFS hash address</button>

                        <button type="button" onClick={() => {
                           this.props.handleState({
                              hasNotAssetsLedgerAddress: true,
                              hasAssetsLedgerAddress: false
                           })
                        }}>I don't have an assets ledger IPFS hash address</button>
                     </div>
                  </label>

                  <input type="submit" value="Submit form and confirm transaction" />
                  <p>After submiting the form you'll have to pay for the gas of saving the transaction data on the blockchain,
                  then you'll be redirected to eSign the invoice. You'll get the Ether from the transaction when both sign.
                  An email will be sent to the buyer to counter-sign the invoice.</p>
               </form>
            </div>
         )
      }else{
         return(
            <div>
               <h1>You have an incoming transaction</h1>
               <p>Here is the data of the interested buyer, choose to accept or decline the transaction:</p>
               <ul>
                  <li>From buyer name: {this.props.buyerName}</li>
                  <li>Buyer wallet address: {this.props.buyerAddress}</li>
                  <li>Buyer email: {this.props.buyerEmail}</li>
                  <li>Buyer GPS location: {this.props.buyerGPSLocation}</li>
                  <li>Buyer VAT number: {this.props.buyerVatNumber}</li>
                  <li>Buyer cash ledger link: &nbsp;
                     <a href={"https://gateway.ipfs.io/ipfs/" + this.props.buyerCashLedgerHashAddress}>
                        {"https://gateway.ipfs.io/ipfs/" + this.props.buyerCashLedgerHashAddress}
                     </a>
                  </li>
                  <li>Buyer assets ledger link: &nbsp;
                     <a href={"https://gateway.ipfs.io/ipfs/" + this.props.buyerAssetsLedgerHashAddress}>
                        {"https://gateway.ipfs.io/ipfs/" + this.props.buyerAssetsLedgerHashAddress}
                     </a>
                  </li>
                  <li>Price per item: {this.props.pricePerItem}</li>
                  <li>Quantity bought: {this.props.quantityBought}</li>
                  <li>Amount paid in Ether: {this.props.amountPayEther}</li>
                  <li>Invoice link: &nbsp;
                     <a href={"https://gateway.ipfs.io/ipfs/" + this.props.invoiceHashAddress}>
                        {"https://gateway.ipfs.io/ipfs/" + this.props.invoiceHashAddress}
                     </a>
                  </li>
                  <li>Your name (seller name): {this.props.sellerName}</li>
                  <li>Your address (seller address): {this.props.sellerAddress}</li>
                  <li>Your email (seller email): {this.props.sellerEmail}</li>
               </ul>

               <div style={{display: this.props.displayAreYouSure ? 'none' : 'block'}}>
                  <button onClick={() => {
                     this.props.handleState({ displaySellerForm: true })
                  }}>Accept transaction</button>
                  <button onClick={() => {
                     this.props.handleState({ displayAreYouSure: true })
                  }}>Decline transaction</button>
               </div>
               <div style={{display: this.props.displayAreYouSure ? 'block' : 'none'}}>
                  Are you sure that you want to cancel the transaction? (irreversible) &nbsp;
                  <button onClick={() => {
                     this.props.declineTransaction()
                  }}>Yes</button>
                  <button onClick={() => {
                     this.props.handleState({ displayAreYouSure: false })
                  }}>No</button>
               </div>

               <p>After accepting the transaction, you'll receive the ether and you'll have to complete the order.
                  Also, you'll have to sing the invoice.</p>
               <p>If you decline the transaction, the ether will be reverted to the buyer and it'll be cancelled.</p>
            </div>
         )
      }
   }
}

export default SellerForm
