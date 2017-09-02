import React from 'react'
import Header from './Header'
import {Link} from 'react-router-dom'
import './../stylus/index.styl'
import './../stylus/ordersentpage.styl'
import LINKS from './utils.js'

class OrderSentPage extends React.Component {
   constructor(props) {
      super(props)
   }

   render(){
      return (
         <div style={{height: '100%'}}>
            <div className="order-sent-container">
               <img src={LINKS.baseUrl + "img/order-sent/check-last.png"} />
               <h1>Purchase Order Sent</h1>

               <div className="order-sent-buttons-container">
                  <Link to={LINKS.home} className="order-sent-back">Back to Login</Link>
                  <Link to={LINKS.retailer}
                     onClick={() => {this.props.hideRetailers()}}
                     className="order-sent-login">Login as Wholesaler</Link>
               </div>
            </div>
         </div>
      )
   }
}

export default OrderSentPage
