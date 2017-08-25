import React from 'react'
import { Link } from 'react-router-dom'
import '../stylus/header.styl'

class Header extends React.Component {
   constructor(props){
      super(props)

      this.state = {
         currentSection: window.location.pathname.split('/')[1]
      }
   }

   render(){
      return (
         <header>
            <Link to="#" className="header-icon" onClick={() => {this.props.handleMenu(true)}}></Link>
            <Link to="/"><img src={this.props.subRoute ? '../img/logo.png' : '/img/logo.png'} className="header-logo"/></Link>

            <nav>
               <Link className={this.state.currentSection === undefined ? 'active-header' : ''} to="#">Home</Link>
               <Link className={this.state.currentSection === 'ico' ? 'active-header' : ''} to="#">ICO</Link>
               <Link className={this.state.currentSection === 'press' ? 'active-header' : ''} to="#">Press</Link>
               <Link className={this.state.currentSection === 'development' ? 'active-header' : ''} to="#">Development</Link>
               <Link className={this.state.currentSection === 'mobile-app' ? 'active-header' : ''} to="#">Mobile App</Link>
               <Link className={this.state.currentSection === 'triple-entry' ? 'active-header' : ''} to="/triple-entry">Triple Entry</Link>
               <Link className={this.state.currentSection === 'team' ? 'active-header' : ''} to="#">Team</Link>
               <Link to="#" className="log-out-button">
                  Log out
                  <img src={this.props.subRoute ? '../img/icon.png' : 'img/icon.png'} className="log-out-button-icon"/>
               </Link>
            </nav>

            <div className="site-cache" onClick={() => {this.props.handleMenu(false)}}></div>
         </header>
      )
   }
}

export default Header
