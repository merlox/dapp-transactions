import React from 'react'
import './../css/index.css'

class BuyerSign extends React.Component {
   constructor(props){
      super(props)
   }

   render(){
      return(
         <div>
            <h1>You have to counter sign a transaction</h1>
            <p>The seller {this.props.sellerName} has confirmed and signed the transation with the following data,
               now you have to counter sign to complete the agreement. Check the data and sign or decline:</p>
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

               <li>Seller name: {this.props.sellerName}</li>
               <li>Seller address: {this.props.sellerAddress}</li>
               <li>Seller email: {this.props.sellerEmail}</li>
               <li>Seller GPS location: {this.props.sellerGpsLocation}</li>
               <li>Seller VAT number: {this.props.sellerVatNumber}</li>
               <li>Seller cash ledger link: &nbsp;
                  <a href={"https://gateway.ipfs.io/ipfs/" + this.props.sellerCashLedgerAddress}>
                     {"https://gateway.ipfs.io/ipfs/" + this.props.sellerCashLedgerAddress}
                  </a>
               </li>
               <li>Seller assets ledger link: &nbsp;
                  <a href={"https://gateway.ipfs.io/ipfs/" + this.props.sellerAssetsLedgerAddress}>
                     {"https://gateway.ipfs.io/ipfs/" + this.props.sellerAssetsLedgerAddress}
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
               <li>Transaction VAT (set by seller): {this.props.vat}</li>
            </ul>

            <div style={{display: this.props.displayAreYouSure ? 'none' : 'block'}}>
               <button onClick={() => {
                  this.props.handleState({ displaySellerForm: true })
               }}>Counter sign and complete transaction</button>
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

            <p>After counter signing the invoice you'll be able to download the invoice from the DocuSign page.
            Also the ether will be transfered to the seller.</p>
            <p>If you decline the transaction, the ether will be reverted to the buyer and it'll be cancelled.</p>
         </div>
         )
   }
}

export default BuyerSign
