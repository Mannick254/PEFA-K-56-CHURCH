
import React from 'react';
import { Helmet } from 'react-helmet-async';

const Seo = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title ? `${title} | PEFA Kawangware 56` : 'PEFA Kawangware 56 Church | Nairobi, Kenya'}</title>
      <meta name="description" content={description || 'Welcome to PEFA Kawangware 56 Church. Join our community in Nairobi for transformative sermons, worship, and fellowship. A place to belong, a place to grow.'} />
      <meta name="keywords" content={keywords || 'PEFA Church, Kawangware 56, Church in Nairobi, PEFA Kenya, Christian Community, Sermons, Prayer Requests'} />
    </Helmet>
  );
};

export default Seo;
