import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';

const SmoothScroll = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      scroller.scrollTo(location.hash.slice(1), {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return children;
};

export default SmoothScroll;
