import React from 'react'
import Header from './Header'
import './../stylus/index.styl'
import './../stylus/purchasepage.styl'

class PurchasePage extends React.Component {
   constructor(props) {
      super(props)

      this.state = {
         isMobile: false,
         menuOpen: false,
      }

      this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
   }

   componentDidMount() {
      this.updateWindowDimensions()
      window.addEventListener('resize', this.updateWindowDimensions)
   }

   componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions)
   }

   updateWindowDimensions() {
      if(window.innerWidth <= 750 && this.state.isMobile === false)
         this.setState({ isMobile: true })
      else if(window.innerWidth > 750 && this.state.isMobile)
         this.setState({ isMobile: false })
   }

   render(){
      return (
         <div className="site-container">
            <div className={this.state.menuOpen ? 'site-pusher menu-open' : 'site-pusher'}>
               <Header handleMenu={open => this.setState({menuOpen: open})} />

               <div className="site-content">
                  <h1 className="purchase-title">Purchase Order</h1>

                  <div className="purchase-box-container">
                     <div className="purchase-box">
                        <h2>Seller</h2>
                        <img src={this.props.retailerImage} />
                        <p className="retailer-name">{this.props.retailerName}</p>
                        <p className="retailer-address">{this.props.retailerAddress}</p>
                        <p className="retailer-address">{this.props.retailerCity}</p>
                        <p className="retailer-address">{this.props.retailerCode}</p>
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
                           <td>{this.props.itemName}</td>
                           <td>{this.props.itemQuantity}</td>
                           <td>{'$ ' + this.props.itemPrice}</td>
                        </tr>
                        <tr>
                           <td></td>
                           <td className="purchase-total-amount">Total Amount: </td>
                           <td>{'$ ' + this.props.itemPrice * this.props.itemQuantity}</td>
                        </tr>
                     </tbody>
                  </table>

                  <div className="purchase-buttons-container">
                     <button
                        className="purchase-decline-button"
                        onClick={() => this.props.declineTransaction()}
                     >Decline</button>
                     <button className="purchase-accept-button">Accept and Sign</button>
                  </div>
               </div>
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
