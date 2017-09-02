import React from 'react'
import { Link } from 'react-router-dom'
import '../stylus/header.styl'
import LINKS from './utils.js'

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
            <Link to={LINKS.home}><img src={LINKS.baseUrl + 'img/logo.png'} className="header-logo"/></Link>
         </header>
      )
   }
}

export default Header
