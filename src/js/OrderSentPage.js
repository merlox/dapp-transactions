import React from 'react'
import Header from './Header'
import './../stylus/index.styl'
import './../stylus/ordersentpage.styl'

class OrderSentPage extends React.Component {
   constructor(props) {
      super(props)
   }

   render(){
      return (
         <div style={{height: '100%'}}>
            <div className="order-sent-container">
               <img src="../img/order-sent/check-last.png" />
               <h1>Purchase Order Sent</h1>

               <div className="order-sent-buttons-container">
                  <button className="order-sent-back">Back to Login</button>
                  <button className="order-sent-login">Login as Wholesaler</button>
               </div>
            </div>
         </div>
      )
   }
}

export default OrderSentPage
