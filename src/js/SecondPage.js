import React from 'react'
import Header from './Header'
import './../stylus/index.styl'
import './../stylus/secondpage.styl'

class SecondPage extends React.Component {
   constructor(props){
      super(props)
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
                           <img src="img/retailer/garden.png" />
                           <p>Garden Gear</p>

                           <div className="dialog-box">
                              <div className="piramid"></div>

                              <h3>Choose a product</h3>

                              <div className="dialog-box-item">
                                 <img src="img/retailer/lawnmover.png" />
                                 <p className="product-title">Lawnmover</p>
                                 <p className="product-price">$ 12.99</p>
                                 <p className="qty">QTY</p>

                                 <div className="counter-container">
                                    <button className="counter-sign">-</button>
                                    <span className="qty-selected">1</span>
                                    <button className="counter-sign">+</button>
                                 </div>

                                 <button className="checkout-button">Checkout</button>
                              </div>
                           </div>
                        </div>
                        <div className="icon-box" ref="second-box">
                           <img src="img/retailer/suits.png" />
                           <p>Sharp Suits</p>
                        </div>
                        <div className="icon-box">
                           <img src="img/retailer/box.png" />
                           <p>Toy Box</p>
                        </div>
                        <div className="icon-box">
                           <img src="img/retailer/jewelry.png" />
                           <p>Rhombus Jewelry</p>
                        </div>
                     </div>
                  </div>

                  <div className="wholesalers-container">
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

export default SecondPage
