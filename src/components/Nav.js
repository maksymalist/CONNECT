import '../App.css';
import React from 'react'
import { Link } from 'react-router-dom'

function Nav() {
    const navStyle = {
        color: "white"
    }

  return (
    <nav>
        <ul>
            <Link style={navStyle} to='/'>
            <li className="nav-links">Home</li>
            </Link>
            <Link style={navStyle} to='/newquiz'>
            <li className="nav-links liright">New Quiz</li>
            </Link>
            <Link style={navStyle} to='/browsequizes'>
            <li className="nav-links liright">Browse Existing Quizes</li>
            </Link>
        </ul>
    </nav>

  );
}

export default Nav;

