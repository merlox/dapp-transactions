import React from 'react'
import Header from './Header'
import './../stylus/index.styl'

class BuyerForm extends React.Component {
   constructor(props){
      super(props)
   }

   handleSubmitForm(event){
      event.preventDefault()

      const data = {
         buyerName: this.refs['buyer-name'].value,
         buyerAddress: this.refs['buyer-address-select'].children[this.refs['buyer-address-select'].selectedIndex].innerHTML,
         buyerEmail: this.refs['buyer-email'].value,
         buyerCashLedgerHashAddress: this.refs['buyer-cash-ledger-hash-address'].value,
         buyerAssetsLedgerHashAddress: this.refs['buyer-assets-ledger-hash-address'].value,
         buyerGPSLocation: this.refs['buyer-gps-location'].value,
         buyerVatNumber: this.refs['buyer-vat-number'].value,
         sellerName: this.refs['seller-name'].value,
         sellerAddress: this.refs['seller-address'].value,
         sellerEmail: this.refs['seller-email'].value,
         quantityBought: this.refs['quantity-buy'].value,
         pricePerItem: this.refs['price-per-item'].value,
         amountPayEther: this.refs['amount-pay-ether'].value,
      }

      let newCashLedgerAmount = this.refs['buyer-new-cash-ledger-amount'].value
      let newAssetsLedgerAmount = this.refs['buyer-new-assets-ledger-amount'].value

      if(data.buyerCashLedgerHashAddress.length <= 0 && newCashLedgerAmount <= 0){
         alert('You need to specify the hash of the cash ledger or the amount of cash for the new cash ledger')
         return
      }
      if(data.buyerAssetsLedgerHashAddress.length <= 0 && newAssetsLedgerAmount <= 0){
         alert('You need to specify the hash of the assets ledger or the amount of assets for the new cash ledger')
         return
      }

      this.props.submitBuyerForm(
         data,
         parseInt(newCashLedgerAmount),
         parseInt(newAssetsLedgerAmount),
      )
   }

   toggleMenu(open){
      if(open)
         this.refs['site-pusher'].className = 'site-pusher menu-open'
      else
         this.refs['site-pusher'].className = 'site-pusher'
   }

   render(){
      return (
         <div className="site-container">
            <div ref='site-pusher' className='site-pusher'>
               <Header handleMenu={state => this.toggleMenu(state)} />

               <div className="site-content">
                  <form className="main-form" ref="main-form" onSubmit={e => { this.handleSubmitForm(e) }}>
                     <label>
                        Buyers's name (your name):
                        <input ref="buyer-name" type="text" placeholder="Name"/>
                     </label>

                     <label>
                        Buyer's address selected:
                        <select ref="buyer-address-select">{this.props.addressNodes}</select>
                     </label>

                     <label>
                        Buyer's email:
                        <input ref="buyer-email" type="email" placeholder="Email"/>
                     </label>

                     <label>
                        Buyer's cash ledger hash address:
                        <div>
                           <input ref="buyer-cash-ledger-hash-address" type="text"
                              style={{display: this.props.hasCashLedgerAddress ? 'block' : 'none'}} placeholder="IPFS hash address"/>
                           <p ref="buyer-new-cash-ledger-hash-address" style={{display: this.props.hasNotCashLedgerAddress ? 'block' : 'none'}}>
                              If you don't have a cash ledger hash address, a new one will be created and you'll get the hash address. If so, please specify how much cash will be stored in it:
                              <input ref="buyer-new-cash-ledger-amount" type="number" placeholder="Cash in Ether" defaultValue="0"/>
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
                        Buyer's assets ledger hash address:
                        <div>
                           <input ref="buyer-assets-ledger-hash-address" type="text"
                              style={{display: this.props.hasAssetsLedgerAddress ? 'block' : 'none'}} placeholder="IPFS hash address"/>
                           <p ref="buyer-new-assets-ledger-hash-address" style={{display: this.props.hasNotAssetsLedgerAddress ? 'block' : 'none'}}>
                              If you don't have an assets ledger hash address, a new one will be created and you'll get the hash address. If so, please specify how many assets will be stored in it, only numbers:
                              <input ref="buyer-new-assets-ledger-amount" type="number" placeholder="Cash in Ether" defaultValue="0"/>
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

                     <label>
                        Buyer's GPS location:
                        <input ref="buyer-gps-location" type="text" placeholder="Gps coordinates"/>
                     </label>

                     <label>
                        Buyer's VAT number:
                        <input ref="buyer-vat-number" type="number" placeholder="VAT number"/>
                     </label>

                     <label>
                        Seller's name:
                        <input ref="seller-name" type="text" placeholder="Name"/>
                     </label>

                     <label>
                        Seller's address:
                        <input ref="seller-address" type="text" placeholder="Wallet address"/>
                     </label>

                     <label>
                        Seller's email:
                        <input ref="seller-email" type="email" placeholder="Email"/>
                     </label>

                     <label>
                        Quantity to buy:
                        <input ref="quantity-buy" type="number" placeholder="Quantity number"/>
                     </label>

                     <label>
                        Price per item:
                        <input ref="price-per-item" type="number" step="any" placeholder="Price per item"/>
                     </label>

                     <label>
                        Amount to pay in ether:
                        <input ref="amount-pay-ether" type="number" step="any" placeholder="Amount to pay ether"/>
                     </label>

                     {/* <button> are type="submit" by default */}
                     <button>Submit form & initiate transaction</button>
                  </form>
               </div>
            </div>
         </div>
      )
   }
}

export default BuyerForm
