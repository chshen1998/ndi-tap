import React from 'react'
import PropTypes from 'prop-types'
import singpass_logo from '../assets/singpass_logo.png'

const Header = ({title}) => {
  return (
    <header> 
    <h2>SendSecure</h2>
    <img className='logo' src={singpass_logo}/>
    </header>
  )
}

Header.defaultProps = {
    title: 'SendSecure',
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
}

export default Header