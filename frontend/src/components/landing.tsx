import React from 'react';
import Header from './header';
import Footer from './footer';
import ReadMore from './readmore';
import '../styles/header.css';
import { response } from 'express';

const LandingPage = () => (
  <>
    <div>
      <div className="home">
        <Header />
        <ReadMore />
      </div>
      <Footer />
    </div>
  </>
);

export default LandingPage;
