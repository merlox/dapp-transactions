import React from 'react'
import Header from './Header'
import './../stylus/index.styl'
import './../stylus/purchasepage.styl'

class PurchasePage extends React.Component {
   constructor(props) {
      super(props)
   }

   render(){
      return (
         <div style={{height: '100%'}}>
            <h1 className="purchase-title">Purchase Order</h1>

            <div className="purchase-box-container">
               <div className="purchase-box">
                  <h2>Seller</h2>
                  <img src={this.props.checkoutData.retailerImage} />
                  <p className="retailer-name">{this.props.checkoutData.retailerName}</p>
                  <p className="retailer-address">{this.props.checkoutData.retailerAddress}</p>
                  <p className="retailer-address">{this.props.checkoutData.retailerCity}</p>
                  <p className="retailer-address">{this.props.checkoutData.retailerCode}</p>
               </div>

               <Box
                  className="purchase-box"
                  party="Sender"
                  name="Company Name"
                  address="Unit 24, The Henfield Business Park"
                  city="Henfield"
                  code="BN5 9SL"
                  ledger="/ipfs/QmAkfhkHIWliuewnkhasfJoqiwhkfhShfkuashfsf/ledger"
               />
               <Box
                  className="purchase-box"
                  party="Buyer"
                  name="Firsname Lastname"
                  address="71 Elmore"
                  city="Swindon"
                  code="SN3 3TN"
                  ledger="/ipfs/QmAkfhkHIWliuewsdfsdfaerwqvzxcvhfzcvzvcsf/ledger"
               />
            </div>

            <table className="purchase-table">
               <thead>
                  <tr>
                     <td>Item Name</td>
                     <td>Quantity</td>
                     <td>Price</td>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td>{this.props.checkoutData.itemName}</td>
                     <td>{this.props.checkoutData.itemQuantity}</td>
                     <td>{'$ ' + this.props.checkoutData.itemPrice}</td>
                  </tr>
                  <tr>
                     <td></td>
                     <td className="purchase-total-amount">Total Amount: </td>
                     <td>{'$ ' + this.props.checkoutData.itemPrice * this.props.checkoutData.itemQuantity}</td>
                  </tr>
               </tbody>
            </table>

            <div className="purchase-buttons-container">
               <button
                  className="purchase-decline-button"
                  onClick={() => this.props.declineTransaction()}
               >Decline</button>
               <button
                  className="purchase-accept-button"
                  onClick={() => this.props.acceptTransaction()}
               >Accept and Sign</button>
            </div>
         </div>
      )
   }
}

class Box extends React.Component {
   constructor(props){
      super(props)
   }

   render(){
      return (
         <div className={this.props.className}>
            <h2>{this.props.party}</h2>
            <p className="retailer-name">{this.props.name}</p>
            <p className="retailer-address">{this.props.address}</p>
            <p className="retailer-address">{this.props.city}</p>
            <p className="retailer-address">{this.props.code}</p>
            <div className="horizontal-rule"></div>
            <p>Ledger address</p>
            <a href={"https://gateway.ipfs.io" + this.props.ledger}>{this.props.ledger}</a>
         </div>
      )
   }
}

export default PurchasePage
