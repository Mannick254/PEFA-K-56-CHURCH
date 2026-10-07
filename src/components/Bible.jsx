import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  BookOpen, 
  Languages, 
  Sparkles, 
  Quote as QuoteIcon, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Radio, 
  Clock 
} from 'lucide-react';
import styles from '../styles/Bible.module.css';

// Backup scriptures in case external APIs fail
const FALLBACK_VERSES = [
  { reference: 'Proverbs 3:5-6', text: 'Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.' },
  { reference: 'Philippians 4:13', text: 'I can do all this through him who gives me strength.' },
  { reference: 'Jeremiah 29:11', text: '"For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future."' },
  { reference: 'Psalm 118:24', text: 'This is the day that the LORD has made; let us rejoice and be glad in it.' },
  { reference: 'Isaiah 40:31', text: 'But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.' }
];

// Helper function to generate a reflective insight based on the verse
const generateInsight = (verseText = '', verseReference = '') => {
  const lowerCaseText = verseText.toLowerCase();
  let generatedInsight = `This passage from ${verseReference} offers essential ethical and spiritual guidance. It challenges readers to align daily conduct with enduring truths and find resilient faith amidst life's complexities.`;

  if (lowerCaseText.includes('love')) {
    generatedInsight = `${verseReference} establishes unconditional love as a primary imperative. It urges individuals toward radical empathy, selfless community service, and active reconciliation across social boundaries.`;
  } else if (lowerCaseText.includes('faith')) {
    generatedInsight = `In ${verseReference}, faith is defined not as passive agreement, but as decisive trust in action. It serves as an anchor during institutional or personal crises.`;
  } else if (lowerCaseText.includes('hope')) {
    generatedInsight = `The commentary surrounding ${verseReference} highlights hope as a transformative power. It encourages perseverance when facing adversity, offering confidence in long-term restoration.`;
  } else if (lowerCaseText.includes('god') || lowerCaseText.includes('lord')) {
    generatedInsight = `${verseReference} emphasizes divine sovereignty and wisdom. It invites believers to realign priorities around higher purpose, justice, and transcendent truth.`;
  } else if (lowerCaseText.includes('jesus') || lowerCaseText.includes('christ')) {
    generatedInsight = `${verseReference} captures core tenets of Christ's teaching—servant leadership, restorative mercy, and sacrificial love as a blueprint for contemporary living.`;
  }

  return generatedInsight;
};

const VerseOfTheDay = ({ setNotification }) => {
  const [verseData, setVerseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [insight, setInsight] = useState('');
  const [insightLoading, setInsightLoading] = useState(false);

  useEffect(() => {
    const fetchVerseOfTheDay = async () => {
      try {
        // Updated to OurManna API (free public VOTD service)
        const response = await fetch('https://beta.ourmanna.com/api/v1/get?format=json&order=daily');
        if (!response.ok) throw new Error('Primary VOTD API offline');
        const data = await response.json();

        const cleanText = data.verse.details.text.replace(/<[^>]*>?/gm, '').trim();
        const adaptedData = {
          verse: {
            details: {
              text: cleanText,
              reference: data.verse.details.reference,
            },
          },
        };

        setVerseData(adaptedData);
        if (setNotification) {
          setNotification({
            message: `Daily Scripture: ${adaptedData.verse.details.reference} loaded successfully.`,
            type: 'success',
          });
        }
      } catch (err) {
        console.warn('VOTD API failed, switching to local backup scripture.', err);
        const fallback = FALLBACK_VERSES[Math.floor(Math.random() * FALLBACK_VERSES.length)];
        setVerseData({ verse: { details: fallback } });
      } finally {
        setLoading(false);
      }
    };

    fetchVerseOfTheDay();
  }, [setNotification]);

  useEffect(() => {
    if (verseData) {
      setInsightLoading(true);
      const timer = setTimeout(() => {
        const generatedInsight = generateInsight(
          verseData.verse.details.text, 
          verseData.verse.details.reference
        );
        setInsight(generatedInsight);
        setInsightLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [verseData]);

  if (loading) {
    return (
      <div className={styles.cnnVotdSkeleton}>
        <div className={styles.cnnSkeletonPulse} />
      </div>
    );
  }

  if (!verseData) return null;

  return (
    <div className={styles.cnnVotdCard}>
      {/* Top Header Bar */}
      <div className={styles.cnnVotdHeader}>
        <div className={styles.cnnLiveBadge}>
          <Radio size={12} className={styles.livePulseIcon} />
          <span>DAILY SCRIPTURE WIRE</span>
        </div>
        <button 
          className={styles.cnnExpandBtn} 
          onClick={() => setShowAnalysis(!showAnalysis)}
          aria-label="Toggle Commentary"
        >
          <span>{showAnalysis ? 'Collapse Insight' : 'Editorial Commentary'}</span>
          {showAnalysis ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Main Scripture Quote */}
      <blockquote className={styles.cnnVotdQuote}>
        <p className={styles.cnnVotdText}>"{verseData.verse.details.text}"</p>
        <cite className={styles.cnnVotdRef}>— {verseData.verse.details.reference}</cite>
      </blockquote>

      {/* Editorial Commentary Drawer */}
      {showAnalysis && (
        <div className={styles.cnnAnalysisDrawer}>
          <div className={styles.cnnAnalysisHeader}>
            <Sparkles size={14} className={styles.cnnIconRed} />
            <h4>EDITORIAL & REFLECTIVE ANALYSIS</h4>
          </div>
          {insightLoading ? (
            <p className={styles.cnnAnalysisText}>Synthesizing theological context...</p>
          ) : (
            <p className={styles.cnnAnalysisText}>{insight}</p>
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
    if (!passage.trim()) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://bible-api.com/${encodeURIComponent(passage)}?translation=${trans}`);
      if (!response.ok) throw new Error('Passage not found. Try queries like "John 3:16" or "Romans 12".');
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

  useEffect(() => { 
    fetchVerse('John 3:16', 'kjv'); 
  }, []);

  // Close auto-suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div className={styles.cnnBibleWrapper}>
      <div className={styles.container}>
        
        {/* Header Section */}
        <header className={styles.cnnBibleHeader}>
          <div className={styles.cnnCategoryBadge}>
            <BookOpen size={13} />
            <span>PEFA KAWANGWARE 56 | SCRIPTURE INDEX</span>
          </div>
          <h2 className={styles.cnnMainTitle}>
            Interactive <span className={styles.cnnHighlight}>Scripture Desk</span>
          </h2>
          <p className={styles.cnnSubtitle}>
            Query canonical books, chapters, and verses across primary translations using our real-time search tool.
          </p>
        </header>

        {/* Daily Verse Wire Card */}
        <VerseOfTheDay setNotification={setNotification} />

        {/* Search Console */}
        <section className={styles.cnnSearchConsole}>
          <form 
            onSubmit={(e) => { 
              e.preventDefault(); 
              setSuggestions([]);
              fetchVerse(query, translation); 
            }} 
            className={styles.cnnForm}
          >
            <div className={styles.cnnInputGroup} ref={searchContainerRef}>
              <Search className={styles.cnnSearchIcon} size={18} />
              <input
                type="text"
                placeholder="Search scripture passage (e.g., Romans 12:12, Isaiah 40)"
                value={query}
                onChange={handleQueryChange}
                className={styles.cnnInput}
              />
              {suggestions.length > 0 && (
                <ul className={styles.cnnSuggestions}>
                  {suggestions.map(book => (
                    <li 
                      key={book} 
                      onClick={() => { 
                        setQuery(book + " "); 
                        setSuggestions([]); 
                      }}
                    >
                      <span>{book}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.cnnControls}>
              <div className={styles.cnnSelectWrapper}>
                <Languages size={15} className={styles.cnnSelectIcon} />
                <select 
                  value={translation} 
                  onChange={(e) => {
                    const newTrans = e.target.value;
                    setTranslation(newTrans);
                    fetchVerse(query, newTrans);
                  }}
                  className={styles.cnnSelect}
                >
                  <option value="kjv">KJV - King James Version</option>
                  <option value="web">WEB - World English Bible</option>
                  <option value="bbe">BBE - Bible in Basic English</option>
                </select>
              </div>

              <button type="submit" className={styles.cnnSearchBtn} disabled={loading}>
                {loading ? <div className={styles.cnnSpinner} /> : 'Fetch Passage'}
              </button>
            </div>
          </form>
        </section>

        {/* Passage Display Area */}
        <main className={styles.cnnDisplayArea}>
          {error && (
            <div className={styles.cnnErrorCard}>
              <Info size={18} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className={styles.cnnLoadingState}>
              <div className={styles.cnnSkeletonLine} style={{ width: '90%' }} />
              <div className={styles.cnnSkeletonLine} style={{ width: '75%' }} />
              <div className={styles.cnnSkeletonLine} style={{ width: '80%' }} />
            </div>
          ) : verseText && (
            <article className={styles.cnnReaderCard}>
              <div className={styles.cnnReaderMeta}>
                <div className={styles.cnnMetaPrimary}>
                  <BookOpen size={18} className={styles.cnnIconRed} />
                  <h3 className={styles.cnnReference}>{reference}</h3>
                  <span className={styles.cnnTranslationTag}>{translation.toUpperCase()}</span>
                </div>
                <div className={styles.cnnMetaSecondary}>
                  <span className={styles.cnnReadTime}>
                    <Clock size={13} /> ~1 min read
                  </span>
                </div>
              </div>

              <div className={styles.cnnTextBody}>
                <QuoteIcon className={styles.cnnWatermarkQuote} size={90} />
                <p className={styles.cnnPassageText}>
                  {verseText.replace(/\n/g, ' ')}
                </p>
              </div>
            </article>
          )}
        </main>

      </div>
    </div>
  );
};

const bibleBooks = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', 
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 
  'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 
  'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', 
  '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', 
  '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', 
  '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

export default Bible;