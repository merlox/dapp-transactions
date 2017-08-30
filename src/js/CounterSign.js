import React from 'react'
import Header from './Header'
import './../stylus/index.styl'
import './../stylus/countersign.styl'

class CounterSign extends React.Component {
   constructor(props) {
      super(props)
   }

   render() {
      return (
         <div style={{width: '100%'}}>
            <h1 className="sign-title">Sign the document with your name to complete the transaction</h1>

            <div className="sign-container">
               <p>Here is the transaction document: <a href={this.props.invoiceLink}>{this.props.invoiceLink}</a></p>
               <input type="text" placeholder="Write your name to sign the transaction" ref="transaction-input" />

               <button className="sign-button-confirm" onClick={() => {
                  if(this.refs['transaction-input'].value != undefined && this.refs['transaction-input'].value.length > 0)
                     this.props.completeTransaction(this.refs['transaction-input'].value)
                  else
                     alert('Your name can\'t be empty')
               }}>Sign & Complete Transaction</button>

               <button className="sign-button-cancel" onClick={() => {
                  this.props.declineFinalTransaction()
               }}>Decline</button>
            </div>
         </div>
      )
   }
}

export default CounterSign
