import React from 'react';
import './style/Sidebar.css';
import Logout from './Logout';

const Nav = ({ unpurchasedCount }) => {
  return (
    <div>
      <div className="area"></div>
      <nav className="main-menu">
        <ul>
          <li>
          <a href="/mainpage">
  <i className="fa fa-home fa-2x"></i>
  <span className="nav-text">Main Page</span>
</a>
          </li>
          <li className="has-subnav">
            <a href="/EventPage">
              <i className="fa fa-globe fa-2x"></i>
              <span className="nav-text">UpComing Events</span>
            </a>
          </li>
          <li className="has-subnav">
            <a href="/pastEvents">
            <i class="fa fa-ticket fa-2x" aria-hidden="true"></i>
              <span className="nav-text">Past Events</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fa fa-book fa-2x"></i>
              <span className="nav-text">Reviews</span>
            </a>
          </li>
          <li>
          <a href="/orders">
              <i class="fa fa-shopping-cart fa-2x" aria-hidden="true"></i>
              <span className="nav-text">Cart  {unpurchasedCount > 0 && (
                <span className='unpurchased-count'>{unpurchasedCount}</span>
              )}</span>
            </a>
          </li>
          <li>
            <a href="/newevent">
            <i class="fa fa-lock fa-2x" aria-hidden="true"></i>
              {/* Only visible to admins */}
              <span className="nav-text">Create New Event</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fa fa-info fa-2x"></i>
              <span className="nav-text">About Us</span>
            </a>
          </li>
        </ul>

        <ul className="logout">
          <li>
            <a href="#">
              <Logout/>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
