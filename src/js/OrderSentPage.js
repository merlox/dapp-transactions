import React from 'react'
import Header from './Header'
import './../stylus/index.styl'
import './../stylus/ordersentpage.styl'

class OrderSentPage extends React.Component {
   constructor(props) {
      super(props)

      this.state = {
         menuOpen: false,
      }
   }

   render(){
      return (
         <div className="site-container">
            <div className={this.state.menuOpen ? 'site-pusher menu-open' : 'site-pusher'}>
               <Header
                  handleMenu={open => this.setState({menuOpen: open})}
                  subRoute={true}
               />

               <div className="site-content">
                  <div className="order-sent-container">
                     <img src="../img/order-sent/check-last.png" />
                     <h1>Purchase Order Sent</h1>

                     <div className="order-sent-buttons-container">
                        <button className="order-sent-back">Back to Login</button>
                        <button className="order-sent-login">Login as Wholesaler</button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )
   }
}

export default OrderSentPage
