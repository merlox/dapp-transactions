import React from 'react'
import Header from './Header'
import './../stylus/index.styl'
import './../stylus/secondpage.styl'

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
                  <div className="retailers-container">
                     <h1 className="title">Choose a Retailer</h1>

                     <div className="icon-box-container">
                        <div className="icon-box">
                           <img
                              src="img/retailer/garden.png"
                              onClick={() => { this.setState({
                                 dialog1: !this.state.dialog1,
                                 dialog2: false,
                                 dialog3: false,
                                 dialog4: false,
                                 oneActive: !this.state.dialog1,
                              }) }}
                           />
                           <p>Garden Gear</p>

                           <Dialog style={{ display: this.state.dialog1 ? 'block' : 'none' }} />
                        </div>
                        <div className="icon-box" ref="second-box">
                           <img
                              src="img/retailer/suits.png"
                              onClick={() => { this.setState({
                                 dialog1: false,
                                 dialog2: !this.state.dialog2,
                                 dialog3: false,
                                 dialog4: false,
                                 oneActive: !this.state.dialog2,
                              }) }}
                           />
                           <p>Sharp Suits</p>

                           <Dialog style={{ display: this.state.dialog2 ? 'block' : 'none' }} />
                        </div>
                        <div className="icon-box">
                           <img
                              src="img/retailer/box.png"
                              onClick={() => { this.setState({
                                 dialog1: false,
                                 dialog2: false,
                                 dialog3: !this.state.dialog3,
                                 dialog4: false,
                                 oneActive: !this.state.dialog3,
                              }) }}
                           />
                           <p>Toy Box</p>

                           <Dialog style={{ display: this.state.dialog3 ? 'block' : 'none' }} />
                        </div>
                        <div className="icon-box">
                           <img
                              src="img/retailer/jewelry.png"
                              onClick={() => { this.setState({
                                 dialog1: false,
                                 dialog2: false,
                                 dialog3: false,
                                 dialog4: !this.state.dialog4,
                                 oneActive: !this.state.dialog4,
                              }) }}
                           />
                           <p>Rhombus Jewelry</p>

                           <Dialog style={{ display: this.state.dialog4 ? 'block' : 'none' }} />
                        </div>
                     </div>
                  </div>

                  <div className={
                     !this.state.isMobile && this.state.oneActive ? 'wholesalers-container expand-retailers' : 'wholesalers-container'
                  }>
                     <h2>Wholesalers</h2>

                     <div className="icon-box-container">
                        <div className="icon-box">
                           <img src="img/retailer/menswear.png" />
                           <p>Menswear Stockist</p>
                        </div>
                        <div className="icon-box">
                           <img src="img/retailer/toydealer.png" />
                           <p>Toy Dealer</p>
                        </div>
                        <div className="icon-box">
                           <img src="img/retailer/diamondis.png" />
                           <p>Diamondis</p>
                        </div>
                        <div className="icon-box">
                           <img src="img/retailer/gardenerworld.png" />
                           <p>Gardener's World</p>
                        </div>
                     </div>
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
         <div className="dialog-box" style={this.props.style}>
            <h3>Choose a product</h3>

            <div className="dialog-box-items">
               <DialogItem
                  image="img/retailer/lawnmover.png"
                  name="Lawnmover"
                  price="12.99"
               />
               <DialogItem
                  image="img/retailer/hedgetrimmer.png"
                  name="Hedgetrimmer"
                  price="12.99"
               />
               <DialogItem
                  image="img/retailer/mover.png"
                  name="Wheelbarrow"
                  price="12.99"
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

            <button className="checkout-button">Checkout</button>
         </div>
      )
   }
}

export default SecondPage
