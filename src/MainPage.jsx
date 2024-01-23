import React from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import './style/MainPage.css';
import Nav from './Nav';
import Footer from './Footer';

const HomePage = () => {
  return (
    <div className='main-page'>
      <Nav />
      <section className="intro-main-page" id="home">
        <div className="welcome-container">
          <h3>Welcome</h3>
          <h3>To</h3>
          <h3 className='h3teksts'>Eventus</h3>
        </div>
      </section>

      <section className='second-page'>
        <div className='second-page'>
          <div className="second-page-container">
            <h4>Music genres for you </h4>
            <h4 className='h4teksts'>
              Explore a world of musical diversity, from Hip Hop to Jazz and Rock. Whether you're a seasoned enthusiast or new to music, discover your favorite genres in our curated selection. Dive into a rich tapestry of musical expressions and find your soul's perfect soundtrack.
            </h4>
            <div className='music-type-container'>
              <a href="eventpage?genre=pop" className='music-type'>
                <div className='MusicType-image-container'>
                  <div className='text-at-bottom'>Pop</div>
                </div>
              </a>
              <a href="eventpage?genre=hip-hop" className='music-type'>
                <div className='HipHop-image-container'>
                  <div className='text-at-bottom'>HipHop</div>
                </div>
              </a>
              <a href="eventpage?genre=country" className='music-type'>
                <div className='Jazz-image-container'>
                  <div className='text-at-bottom'>Country</div>
                </div>
              </a>
              <a href="eventpage?genre=metal" className='music-type'>
                <div className='Metal-image-container'>
                  <div className='text-at-bottom'>Metal</div>
                </div>
              </a>
              <a href="/eventpage" className='music-type'>
                <div className='Rap-image-container'>
                  <div className='text-at-bottom'>See All Concerts</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className='third-page'>
        <Footer />
      </section>
    </div>
  );
};

export default HomePage;
