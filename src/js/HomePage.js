import React from 'react'
import {Link} from 'react-router-dom'
import './../stylus/index.styl'
import './../stylus/homepage.styl'
import LINKS from './utils.js'

class HomePage extends React.Component {
   constructor(props) {
      super(props)

      this.state = {
         orderCancelled: false,
         showVideo: false
      }
   }

   componentDidMount() {
      this.checkOrderDeclined.bind(this)()
   }

   checkOrderDeclined() {
      if(window.location.search === '?state=order_cancelled'){
         this.setState({
            orderCancelled: true
         })
      }
   }

   render(){
      return (
         <div style={{height: '100%'}}>
            <div
               className="order-cancelled"
               style={{
                  display: this.state.orderCancelled ? 'block' : 'none'
               }}>Transaction Declined<span
                  className="order-cancelled-close"
                  onClick={() => this.setState({orderCancelled: false})}
               >close</span></div>

            <div className="banner">
               <h1>Triple Entry <br/>
                  Accounting Demo</h1>
            </div>

            <div className="banner-shadow">
               <p>The purpose of this demo is to introduce to the concept of <i>Triple Entry Accounting</i> using <i>Fizcal</i>.
                  <i> Fizcal</i> will have it's own propriety distributed file system and blockchain but for demonstration
                  purposes we will be using <i>IPFS</i> to store ledgers and the <i>Etheruem Blockchain</i> to store and implement
                  the smart contract
               </p>

               <div className="legend-container">
                  <h2>To run the demo you need</h2>
                  <p>To be running a web browser running the <a href="https://metamask.io/">MetaMask</a> or <a href="https://github.com/ethereum/mist">Mist plugin</a>.</p>
                  <p>You will also need to have some ether in your wallet.</p>
                  <div className="button-container">
                     <Link to={LINKS.home + LINKS.retailer} className="button-second-page">Start Demo</Link>
                  </div>
               </div>
            </div>

            <div className="video-block">
               <h2>If you don't have any ether
                  you can watch a video demonstration here</h2>
               <img
                  style={{display: this.state.showVideo ? 'none' : 'block'}}
                  src={LINKS.baseUrl + 'img/video.png'}
                  onClick={() => {
                     this.setState({showVideo: true})
                  }}
               />
               <div
                  className="youtube-container"
                  style={{display: this.state.showVideo ? 'block' : 'none'}}
               >
                  <YouTube src="https://www.youtube.com/embed/XwWfaALQ1zI?autoplay=1" />
               </div>
            </div>
         </div>
      )
   }
}

class YouTube extends React.Component {
   constructor(props) {
      super(props)
   }

   render() {
      return (
         <iframe src={this.props.src} width="100%" height="100%" allowFullScreen/>
      )
   }
}

export default HomePage
