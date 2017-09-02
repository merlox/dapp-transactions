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
               <h1>Transaction Accepted and Funds to be Released</h1>

               <div className="order-sent-buttons-container">
                  <Link to={LINKS.home}
                     onClick={() => this.props.showRetailers()}
                     className="order-sent-back">Back to Login</Link>
               </div>
            </div>
         </div>
      )
   }
}

export default OrderSentPage
