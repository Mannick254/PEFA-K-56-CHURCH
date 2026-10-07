import React from 'react';
import HolyricsStudio from '../components/HolyricsStudio/HolyricsStudio';
import { Helmet } from 'react-helmet-async';

const LyricsStudioPage = () => {
  return (
    <>
       <Helmet>
        <title>Lyrics Studio - PEFA 56</title>
        <meta name="description" content="Create, manage, and present lyrics for live services with Holyrics Studio. A powerful, offline-first lyrics projection tool." />
        <link rel="manifest" href="/lyrics-studio.webmanifest" />
      </Helmet>
      <HolyricsStudio />
    </>
  );
};

export default LyricsStudioPage;
