import React from 'react';
import './style/Footer.css';

const YourComponent = () => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="style.css" />
      </head>
      <body>
        <div></div>
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-top">
              <div className="footer-column">
                <h6 className="footer-title">Eventus Page</h6>
                <ul className="footer-list">
                  <li className="footer-list-item">
                    <a href="#" className="footer-list-link">
                      About
                    </a>
                  </li>
                  <li className="footer-list-item">
                    <a href="#" className="footer-list-link">
                      Careers
                    </a>
                  </li>
                  <li className="footer-list-item">
                    <a href="#" className="footer-list-link">
                      Affiliates
                    </a>
                  </li>
                  <li className="footer-list-item">
                    <a href="#" className="footer-list-link">
                      Sitemap
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <hr className="footer-divider" />

            <div className="footer-bottom">
              <span className="copyright">&copy; 2022 Eventus. All rights reserved.</span>
              <ul className="footer-list">
                <li className="footer-list-item">
                  <a href="#" className="footer-list-link">
                    <i className="ri-facebook-circle-line"></i>
                  </a>
                </li>
                <li className="footer-list-item">
                  <a href="#" className="footer-list-link">
                    <i className="ri-instagram-line"></i>
                  </a>
                </li>
                <li className="footer-list-item">
                  <a href="#" className="footer-list-link">
                    <i className="ri-twitter-line"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
};

export default YourComponent;
