
import React from 'react';
import { Helmet } from 'react-helmet-async';

const Seo = ({
  title,
  description,
  keywords,
  url,
  type = 'website', // Default type
  imageData,
  author,
  datePublished,
  dateModified,
  location,
  startDate,
  endDate
}) => {
  // Dynamically determine the origin, falling back to the production URL.
  // This makes it work in development (localhost) and production.
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pefa-k-56-church.vercel.app';

  const fullUrl = `${origin}${url || ''}`;

  const baseSchema = {
    "@context": "https://schema.org",
    "publisher": {
      "@type": "Organization",
      "name": "PEFA Kawangware 56 Church",
      "url": origin, // Use dynamic origin
      "logo": {
        "@type": "ImageObject",
        "url": "https://res.cloudinary.com/dtcb3ffnv/image/upload/v1780723691/Untitled-design-24-_lfef05.png"
      }
    }
  };

  let schema;

  switch (type) {
    case 'blogpost':
      schema = {
        ...baseSchema,
        "@type": "BlogPosting",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": fullUrl
        },
        "headline": title.toUpperCase(),
        "description": description,
        "image": imageData,
        "author": {
          "@type": "Person",
          "name": author
        },
        "datePublished": datePublished,
        "dateModified": dateModified
      };
      break;
    case 'sermon':
        schema = {
            ...baseSchema,
            "@type": "PodcastEpisode",
            "partOfSeries": {
              "@type": "PodcastSeries",
              "name": "PEFA 56 Sermons"
            },
            "name": title.toUpperCase(),
            "description": description,
            "url": fullUrl,
            "datePublished": datePublished,
          };
          break;
    case 'event':
        schema = {
            ...baseSchema,
            "@type": "Event",
            "name": title.toUpperCase(),
            "description": description,
            "startDate": startDate,
            "endDate": endDate,
            "location": {
                "@type": "Place",
                "name": location,
                "address": location
            },
            "image": imageData,
            "organizer": {
                "@type": "Organization",
                "name": "PEFA Kawangware 56 Church",
                "url": origin // Use dynamic origin
            }
        };
        break;
    default: // website or webpage
      schema = {
        ...baseSchema,
        "@type": "WebSite",
        "url": `${origin}/`, // Use dynamic origin
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${origin}/search?q={search_term_string}`, // Use dynamic origin
          "query-input": "required name=search_term_string"
        }
      };
  }


  return (
    <Helmet>
      <title>{title ? `${title.toUpperCase()} | PEFA Kawangware 56` : 'PEFA Kawangware 56 Church | Nairobi, Kenya'}</title>
      <meta name="description" content={description || 'Welcome to PEFA Kawangware 56 Church. Join our community in Nairobi for transformative sermons, worship, and fellowship. A place to belong, a place to grow.'} />
      <meta name="keywords" content={keywords || 'PEFA Church, Kawangware 56, Church in Nairobi, PEFA Kenya, Christian Community, Sermons, Prayer Requests'} />
      <link rel="canonical" href={fullUrl} />
      <meta property="og:title" content={title ? title.toUpperCase() : 'PEFA Kawangware 56 Church | Nairobi, Kenya'} />
      <meta property="og:description" content={description || 'Welcome to PEFA Kawangware 56 Church. Join our community in Nairobi for transformative sermons, worship, and fellowship. A place to belong, a place to grow.'} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type === 'event' ? 'event' : 'website'} />
      <meta property="og:image" content={imageData || "https://res.cloudinary.com/dtcb3ffnv/image/upload/v1780723691/Untitled-design-24-_lfef05.png"} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title ? title.toUpperCase() : 'PEFA Kawangware 56 Church | Nairobi, Kenya'} />
      <meta name="twitter:description" content={description || 'Welcome to PEFA Kawangware 56 Church. Join our community in Nairobi for transformative sermons, worship, and fellowship. A place to belong, a place to grow.'} />
      <meta name="twitter:image" content={imageData || "https://res.cloudinary.com/dtcb3ffnv/image/upload/v1780723691/Untitled-design-24-_lfef05.png"} />
      {type === 'event' && (
        <>
          <meta property="og:type" content="event" />
          <meta property="event:start_time" content={startDate} />
          {endDate && <meta property="event:end_time" content={endDate} />}
        </>
      )}
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default Seo;
