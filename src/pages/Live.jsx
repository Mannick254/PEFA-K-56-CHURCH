import React from 'react';
import Seo from '../components/Seo';
import LiveComponent from '../components/Live';

const Live = () => {
  return (
    <>
      <Seo 
        title="Live Service" 
        description="Watch our services live. Join our online community for live sermons, worship, and special events from PEFA Kawangware 56." 
        keywords="live stream, church online, PEFA live, online service, worship live, Nairobi church live"
      />
      <LiveComponent />
    </>
  );
};

export default Live;
