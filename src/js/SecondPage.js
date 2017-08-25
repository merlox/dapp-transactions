import React from 'react'
import Header from './Header'
import './../stylus/index.styl'
import './../stylus/secondpage.styl'

const LINKS = {
   home: '/triple-entry',
   retailer: '/retailer',
   purchase: '/purchase',
   order: '/order-sent',
}

class SecondPage extends React.Component {
   constructor(props){
      super(props)

      this.state = {
         dialog1: false,
         dialog2: false,
         dialog3: false,
         dialog4: false,
         oneActive: false,
         isMobile: false,
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
         <div style={{height: '100%'}}>
            <div className="retailers-container">
               <h1 className="title">Choose a Retailer</h1>

               <div className="icon-box-container">
                  <div className="icon-box">
                     <img
                        src="../img/retailer/garden.png"
                        onClick={() => { this.setState({
                           dialog1: !this.state.dialog1,
                           dialog2: false,
                           dialog3: false,
                           dialog4: false,
                           oneActive: !this.state.dialog1,
                        }) }}
                     />
                     <p>Garden Gear</p>

                     <input ref="retailer1-address" type="hidden"
                        value="8 sloane square, South Kensignton" />
                     <input ref="retailer1-city" type="hidden"
                        value="London" />
                     <input ref="retailer1-code" type="hidden"
                        value="SW75RD" />

                     <Dialog
                        extraClass="dialog-number-1"
                        style={{ display: this.state.dialog1 ? 'block' : 'none' }}
                        checkoutItem={data => {
                           this.props.checkoutItem({
                              ...data,
                              retailerName: 'Garden Gear',
                              retailerImage: '../img/retailer/garden.png',
                              retailerAddress: this.refs['retailer1-address'].value,
                              retailerCity: this.refs['retailer1-city'].value,
                              retailerCode: this.refs['retailer1-code'].value,
                           })
                        }}
                     />
                  </div>
                  <div className="icon-box" ref="second-box">
                     <img
                        src="../img/retailer/suits.png"
                        onClick={() => { this.setState({
                           dialog1: false,
                           dialog2: !this.state.dialog2,
                           dialog3: false,
                           dialog4: false,
                           oneActive: !this.state.dialog2,
                        }) }}
                     />
                     <p>Sharp Suits</p>

                     <input ref="retailer2-address" type="hidden"
                        value="8 sloane square, South Kensignton" />
                     <input ref="retailer2-city" type="hidden"
                        value="London" />
                     <input ref="retailer2-code" type="hidden"
                        value="SW75RD" />

                     <Dialog
                        extraClass="dialog-number-2"
                        style={{ display: this.state.dialog2 ? 'block' : 'none' }}
                        checkoutItem={data => {
                           this.props.checkoutItem({
                              ...data,
                              retailerName: 'Sharp Suits',
                              retailerImage: '../img/retailer/suits.png',
                              retailerAddress: this.refs['retailer2-address'].value,
                              retailerCity: this.refs['retailer2-city'].value,
                              retailerCode: this.refs['retailer2-code'].value,
                           })
                        }}
                     />
                  </div>
                  <div className="icon-box">
                     <img
                        src="../img/retailer/box.png"
                        onClick={() => { this.setState({
                           dialog1: false,
                           dialog2: false,
                           dialog3: !this.state.dialog3,
                           dialog4: false,
                           oneActive: !this.state.dialog3,
                        }) }}
                     />
                     <p>Toy Box</p>

                     <input ref="retailer3-address" type="hidden"
                        value="8 sloane square, South Kensignton" />
                     <input ref="retailer3-city" type="hidden"
                        value="London" />
                     <input ref="retailer3-code" type="hidden"
                        value="SW75RD" />

                     <Dialog
                        extraClass="dialog-number-3"
                        style={{ display: this.state.dialog3 ? 'block' : 'none' }}
                        checkoutItem={data => {
                           this.props.checkoutItem({
                              ...data,
                              retailerName: 'Toy Box',
                              retailerImage: '../img/retailer/box.png',
                              retailerAddress: this.refs['retailer3-address'].value,
                              retailerCity: this.refs['retailer3-city'].value,
                              retailerCode: this.refs['retailer3-code'].value,
                           })
                        }}
                     />
                  </div>
                  <div className="icon-box">
                     <img
                        src="../img/retailer/jewelry.png"
                        onClick={() => { this.setState({
                           dialog1: false,
                           dialog2: false,
                           dialog3: false,
                           dialog4: !this.state.dialog4,
                           oneActive: !this.state.dialog4,
                        }) }}
                     />
                     <p>Rhombus Jewelry</p>

                     <input ref="retailer4-address" type="hidden"
                        value="8 sloane square, South Kensignton" />
                     <input ref="retailer4-city" type="hidden"
                        value="London" />
                     <input ref="retailer4-code" type="hidden"
                        value="SW75RD" />

                     <Dialog
                        extraClass="dialog-number-4"
                        style={{ display: this.state.dialog4 ? 'block' : 'none' }}
                        checkoutItem={data => {
                           this.props.checkoutItem({
                              ...data,
                              retailerName: 'Rhombus Jewelry',
                              retailerImage: '../img/retailer/jewelry.png',
                              retailerAddress: this.refs['retailer4-address'].value,
                              retailerCity: this.refs['retailer4-city'].value,
                              retailerCode: this.refs['retailer4-code'].value,
                           })
                        }}
                     />
                  </div>
               </div>
            </div>

            <div className={
               !this.state.isMobile && this.state.oneActive ? 'wholesalers-container expand-retailers' : 'wholesalers-container'
            }>
               <h2>Wholesalers</h2>

               <div className="icon-box-container">
                  <div className="icon-box">
                     <img src="../img/retailer/menswear.png" />
                     <p>Menswear Stockist</p>
                  </div>
                  <div className="icon-box">
                     <img src="../img/retailer/toydealer.png" />
                     <p>Toy Dealer</p>
                  </div>
                  <div className="icon-box">
                     <img src="../img/retailer/diamondis.png" />
                     <p>Diamondis</p>
                  </div>
                  <div className="icon-box">
                     <img src="../img/retailer/gardenerworld.png" />
                     <p>Gardener's World</p>
                  </div>
               </div>
            </div>
         </div>
      )
   }
}

class Dialog extends React.Component {
   constructor(props){
      super(props)
   }

   render(){
      return (
         <div
            className={'dialog-box ' + (this.props.extraClass ? this.props.extraClass : '')}
            style={this.props.style} >
            <h3>Choose a product</h3>

            <div className="dialog-box-items">
               <DialogItem
                  image="../img/retailer/lawnmover.png"
                  name="Lawnmover"
                  price="12.99"
                  checkoutItem={data => this.props.checkoutItem(data)}
               />
               <div className="dialog-border"></div>
               <DialogItem
                  image="../img/retailer/hedgetrimmer.png"
                  name="Hedgetrimmer"
                  price="12.99"
                  checkoutItem={data => this.props.checkoutItem(data)}
               />
               <div className="dialog-border"></div>
               <DialogItem
                  image="../img/retailer/mover.png"
                  name="Wheelbarrow"
                  price="12.99"
                  checkoutItem={data => this.props.checkoutItem(data)}
               />
            </div>
         </div>
      )
   }
}

class DialogItem extends React.Component{
   constructor(props){
      super(props)

      this.state = {
         quantity: 1
      }
   }

   updateQuantity(increase){
      if(increase)
         this.setState({ quantity: this.state.quantity + 1 })
      else if(this.state.quantity > 1)
         this.setState({ quantity: this.state.quantity - 1 })
   }

   render(){
      return (
         <div className="dialog-box-item">
            <img src={this.props.image} />
            <p className="product-title">{this.props.name}</p>
            <p className="product-price">$ {this.props.price}</p>
            <p className="qty">QTY</p>

            <div className="counter-container">
               <button
                  className="counter-sign"
                  onClick={() => this.updateQuantity(false)}
               >-</button>
               <span className="qty-selected">{this.state.quantity}</span>
               <button
                  className="counter-sign"
                  onClick={() => this.updateQuantity(true)}
               >+</button>
            </div>

            <button
               className="checkout-button"
               onClick={() => {
                  this.props.checkoutItem({
                     itemName: this.props.name,
                     itemPrice: this.props.price,
                     itemQuantity: this.state.quantity,
                  })
               }}
            >Checkout</button>
         </div>
      )
   }
}

export default SecondPage
