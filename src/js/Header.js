import React from 'react'
import { Link } from 'react-router-dom'

class Header extends React.Component {
   constructor(props){
      super(props)
   }

   toggleMenu(open){
      this.props.handleMenu(open)
   }

   render(){
      return (
         <header>
            <a href="#" className="header-icon" onClick={() => {this.toggleMenu(true)}}></a>
            <Link to="/"><img src="img/logo.png" className="header-logo"/></Link>

            <nav>
               <a href="#">Home</a>
               <a href="#">ICO</a>
               <a href="#">Press</a>
               <a href="#">Development</a>
               <a href="#">Mobile App</a>
               <a href="#">Triple Entry</a>
               <a href="#">Team</a>
               <a href="#" className="log-out-button">
                  Log out
                  <img src="img/icon.png" className="log-out-button-icon"/>
               </a>
            </nav>

            <div className="site-cache" onClick={() => {this.toggleMenu(false)}}></div>
         </header>
      )
   }
}

export default Header
