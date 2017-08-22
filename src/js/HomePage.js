import React from 'react'
import Header from './Header'
import './../stylus/index.styl'

class HomePage extends React.Component {
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
                  <div className="banner">
                     <h1>Triple Entry <br/>
                        Accounting Demo</h1>
                  </div>
               </div>
            </div>
         </div>
      )
   }
}

export default HomePage
