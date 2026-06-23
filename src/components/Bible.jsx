import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Search, Book, Languages, Sparkles, Quote as QuoteIcon, ChevronDown, ChevronUp, Info } from 'lucide-react';
import styles from '../styles/Bible.module.css';

// Helper function to generate a reflective insight based on the verse
const generateInsight = (verseText, verseReference) => {
  const lowerCaseText = verseText.toLowerCase();
  let generatedInsight = `This verse, ${verseReference}, encourages us to reflect on the deeper meanings of our faith. It\'s a call to integrate spiritual truths into our everyday lives and to find strength in them.`;

  if (lowerCaseText.includes('love')) {
    generatedInsight = `In ${verseReference}, the theme of love is central. It reminds us of the importance of unconditional love for one another, as a reflection of divine love. This verse calls us to act with compassion and kindness in all our interactions.`;
  } else if (lowerCaseText.includes('faith')) {
    generatedInsight = `${verseReference} speaks powerfully about faith. It\'s a reminder that faith is not just a belief, but a deep trust and confidence in the divine. This verse encourages us to live by faith, especially in moments of uncertainty.`;
  } else if (lowerCaseText.includes('hope')) {
    generatedInsight = `The message of hope in ${verseReference} is a beacon of light. It encourages us to hold on to hope, even in difficult times, and to trust in the promise of a brighter future. This verse is a source of comfort and strength.`;
  } else if (lowerCaseText.includes('god') || lowerCaseText.includes('lord')) {
    generatedInsight = `This passage, ${verseReference}, draws our attention to the nature of God. It highlights His power, wisdom, and grace, urging us to deepen our relationship with Him and to trust in His divine plan.`;
  } else if (lowerCaseText.includes('jesus') || lowerCaseText.includes('christ')) {
    generatedInsight = `${verseReference} offers a profound insight into the life and teachings of Jesus Christ. It calls us to follow His example of humility, service, and love, and to find salvation through Him.`;
  }

  return generatedInsight;
};

const VerseOfTheDay = ({ setNotification }) => {
  const [verseData, setVerseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [error, setError] = useState('');
  const [insight, setInsight] = useState('');
  const [insightLoading, setInsightLoading] = useState(false);

  useEffect(() => {
    const fetchVerseOfTheDay = async () => {
      try {
        const response = await fetch('https://beta.ourmanna.com/api/v1/get?format=json&order=daily', { mode: 'cors' });
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setVerseData(data);
        if (setNotification) {
          setNotification({
            message: `Verse of the Day: ${data.verse.details.reference} - ${data.verse.details.text}`,
            type: 'success'
          });
        }
      } catch (err) {
        setError('Could not load daily verse');
      } finally {
        setLoading(false);
      }
    };
    fetchVerseOfTheDay();
  }, [setNotification]);

  useEffect(() => {
    if (verseData) {
      setInsightLoading(true);
      // Simulate an async call for insight generation
      setTimeout(() => {
        const generatedInsight = generateInsight(verseData.verse.details.text, verseData.verse.details.reference);
        setInsight(generatedInsight);
        setInsightLoading(false);
      }, 500);
    }
  }, [verseData]);

  if (loading) return <div className={styles.votdSkeleton}></div>;
  if (!verseData) return null;

  return (
    <div
      className={`${styles.votdContainer} ${showAnalysis ? styles.active : ''}`}
      onClick={() => setShowAnalysis(!showAnalysis)}
    >
      <div className={styles.votdHeader}>
        <div className={styles.votdLabel}>
          <Sparkles size={16} className={styles.sparkleIcon} />
          <span>Verse of the Day</span>
        </div>
        {showAnalysis ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      <blockquote className={styles.votdQuote}>
        <p>\"{verseData.verse.details.text}\"</p>
        <cite>— {verseData.verse.details.reference}</cite>
      </blockquote>

      {!showAnalysis && (
        <div className={styles.clickHint}>
          <Info size={14} /> <span>Click to see meaning</span>
        </div>
      )}

      {showAnalysis && (
        <div className={styles.analysisSection}>
          <div className={styles.analysisDivider}></div>
          <h4 className={styles.analysisTitle}>Reflective Insight</h4>
          {insightLoading ? (
            <p className={styles.analysisText}>Generating insight...</p>
          ) : (
            <p className={styles.analysisText}>{insight}</p>
          )}
        </div>
      )}
    </div>
  );
};

const Bible = ({ setNotification }) => {
  const [query, setQuery] = useState('John 3:16');
  const [translation, setTranslation] = useState('kjv');
  const [verseText, setVerseText] = useState('');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchContainerRef = useRef(null);

  const fetchVerse = async (passage, trans) => {
    if (!passage) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://bible-api.com/${passage}?translation=${trans}`, { mode: 'cors' });
      if (!response.ok) throw new Error('Verse not found. Try "John 3:16"');
      const data = await response.json();
      setVerseText(data.text);
      setReference(data.reference);
    } catch (err) {
      setError(err.message);
      setVerseText('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVerse('John 3:16', 'kjv'); }, []);

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 1 && !/\d/.test(value)) {
      const filtered = bibleBooks.filter(b => b.toLowerCase().startsWith(value.toLowerCase())).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className={styles.bibleWrapper}>
      <div className={styles.container}>
        <VerseOfTheDay setNotification={setNotification} />

        <div className={styles.searchSection}>
          <div className={styles.titleArea}>
            <h2 className={styles.mainTitle}>Explore the Scriptures</h2>
            <p className={styles.subtitle}>Search for any passage, chapter, or verse</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); fetchVerse(query, translation); }} className={styles.searchBar}>
            <div className={styles.inputGroup} ref={searchContainerRef}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Search (e.g. Romans 12:12)"
                value={query}
                onChange={handleQueryChange}
                className={styles.mainInput}
              />
              {suggestions.length > 0 && (
                <ul className={styles.suggestions}>
                  {suggestions.map(book => (
                    <li key={book} onClick={() => { setQuery(book + " "); setSuggestions([]); }}>{book}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.controls}>
              <div className={styles.selectWrapper}>
                <Languages size={16} className={styles.selectIcon} />
                <select value={translation} onChange={(e) => setTranslation(e.target.value)}>
                  <option value="kjv">KJV</option>
                  <option value="bbe">BBE</option>
                  <option value="web">WEB</option>
                </select>
              </div>
              <button type="submit" className={styles.searchBtn} disabled={loading}>
                {loading ? <div className={styles.spinner}></div> : 'Read'}
              </button>
            </div>
          </form>
        </div>

        <main className={styles.displayArea}>
          {error && <div className={styles.errorCard}>{error}</div>}
          
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.skeletonLine}></div>
              <div className={styles.skeletonLineShort}></div>
            </div>
          ) : verseText && (
            <div className={styles.verseReader}>
              <div className={styles.verseMeta}>
                <Book size={20} />
                <span>{reference}</span>
              </div>
              <div className={styles.verseContent}>
                <QuoteIcon className={styles.bgQuote} size={80} />
                <p className={styles.text}>{verseText.replace(/\n/g, ' ')}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const bibleBooks = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'];

export default Bible;
