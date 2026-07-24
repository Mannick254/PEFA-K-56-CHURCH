import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';
import styles from '../../styles/StatementOfFaithadmin.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Edit2, Trash2, CheckCircle, 
  Book, Type, Hash, AlertCircle, Loader2 
} from 'lucide-react';

const StatementOfFaith = () => {
  const [statements, setStatements] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reference, setReference] = useState('');
  const [priority, setPriority] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatements();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchStatements = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('statement_of_faith')
      .select('*')
      .order('priority', { ascending: true });

    if (error) setError(error.message);
    else setStatements(data);
    setLoading(false);
  };

  const filteredStatements = useMemo(() => {
    return statements.filter(s => 
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [statements, searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Get current user for RLS policies
    const { data: { user } } = await supabase.auth.getUser();

    const payload = { 
      title, 
      content, 
      bible_reference: reference, 
      priority: parseInt(priority), 
      user_id: user?.id // attach owner for RLS
    };

    try {
      if (editing) {
        const { data, error } = await supabase
          .from('statement_of_faith')
          .update(payload)
          .eq('id', editing.id)
          .select();

        if (error) throw error;
        if (data && data.length > 0) setSuccess('Doctrine updated successfully');
        else throw new Error("Update failed. Check permissions.");
      } else {
        const { data, error } = await supabase
          .from('statement_of_faith')
          .insert([payload])
          .select();

        if (error) throw error;
        if (data && data.length > 0) setSuccess('New doctrine added to the foundation');
        else throw new Error("Insert failed. Check permissions.");
      }
      resetForm();
      fetchStatements();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s) => {
    setEditing(s);
    setTitle(s.title);
    setContent(s.content);
    setReference(s.bible_reference || '');
    setPriority(s.priority || 1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this statement from the foundation?')) return;
    const { error } = await supabase.from('statement_of_faith').delete().eq('id', id);
    if (error) setError(error.message);
    else {
      setSuccess('Statement removed');
      fetchStatements();
    }
  };

  const resetForm = () => {
    setEditing(null);
    setTitle('');
    setContent('');
    setReference('');
    setPriority(statements.length + 1);
  };

  return (
    <div className={styles.adminWrapper}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.mainTitle}>Statement of Faith</h2>
          <p className={styles.subtitle}>Define the theological pillars of PEFA 56</p>
        </div>
        <div className={styles.countBadge}>
          <Book size={18} />
          <span>{statements.length} Doctrines</span>
        </div>
      </header>

      <div className={styles.layout}>
        {/* FORM SIDEBAR */}
        <aside className={styles.sidebar}>
          <form onSubmit={handleSubmit} className={styles.formCard}>
            <h3>{editing ? 'Modify Doctrine' : 'Add New Doctrine'}</h3>
            
            <div className={styles.inputGroup}>
              <label><Type size={14}/> Doctrine Title</label>
              <input
                type="text"
                placeholder="e.g. The Holy Trinity"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label><Book size={14}/> Bible Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Matthew 28:19"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup} style={{ width: '80px' }}>
                <label><Hash size={14}/> Order</label>
                <input
                  type="number"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Full Content</label>
              <textarea
                placeholder="Describe this statement in detail..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? <Loader2 className={styles.spin} /> : (editing ? 'Save Changes' : 'Publish Statement')}
              </button>
              {editing && (
                <button type="button" onClick={resetForm} className={styles.cancelBtn}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <AnimatePresence>
            {success && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={styles.toastSuccess}>
                <CheckCircle size={18} /> {success}
              </motion.div>
            )}
            {error && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={styles.toastError}>
                <AlertCircle size={18} /> {error}
              </motion.div>
            )}
          </AnimatePresence>
        </aside>

        {/* LIST MAIN AREA */}
        <main className={styles.listArea}>
          <div className={styles.searchBar}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Filter doctrines..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.statementList}>
            {filteredStatements.map((s) => (
              <motion.div 
                layout
                key={s.id} 
                className={styles.statementCard}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.titleInfo}>
                    <span className={styles.priorityLabel}>#{s.priority}</span>
                    <h4>{s.title}</h4>
                  </div>
                  <div className={styles.cardActions}>
                    <button onClick={() => handleEdit(s)} className={styles.editBtn}><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(s.id)} className={styles.deleteBtn}><Trash2 size={16}/></button>
                  </div>
                </div>
                <p className={styles.contentPreview}>{s.content}</p>
                {s.bible_reference && (
                  <div className={styles.refBadge}>
                    <Book size={12} /> {s.bible_reference}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StatementOfFaith;
