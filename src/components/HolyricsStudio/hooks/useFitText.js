
import { useLayoutEffect, useState } from 'react';

const useFitText = (text, { width, height, fontFamily, maxFontSize }) => {
  const [fontSize, setFontSize] = useState(maxFontSize);

  useLayoutEffect(() => {
    if (!text || !width || !height) {
      setFontSize(maxFontSize);
      return;
    }

    const measureElement = document.createElement('div');
    measureElement.style.position = 'absolute';
    measureElement.style.visibility = 'hidden';
    measureElement.style.height = 'auto';
    measureElement.style.width = `${width}px`; // Constrain width
    measureElement.style.fontFamily = fontFamily;
    measureElement.innerHTML = text.replace(/\n/g, '<br>');
    document.body.appendChild(measureElement);

    let currentFontSize = maxFontSize;
    measureElement.style.fontSize = `${currentFontSize}px`;

    // Decrease font size until the text fits within the container's height
    while (measureElement.offsetHeight > height && currentFontSize > 10) {
      currentFontSize--;
      measureElement.style.fontSize = `${currentFontSize}px`;
    }

    setFontSize(currentFontSize);
    document.body.removeChild(measureElement);

  }, [text, width, height, fontFamily, maxFontSize]);

  return fontSize;
};

export default useFitText;
