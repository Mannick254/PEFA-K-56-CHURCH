import React from 'react';
import styles from './Header.module.css';
import {
  Plus,
  Monitor,
  PanelLeft,
  SquarePen,
  Tv,
  LayoutTemplate,
  Radio,
  Sliders,
  Layers
} from 'lucide-react';

export function Header({
  visibleColumns = { list: true, editor: true, presenter: true },
  setVisibleColumns,
  addSong,
  openDisplayWindow
}) {
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <header className={styles.studioHeader}>
      {/* Brand Identity */}
      <div className={styles.brandContainer}>
        <div className={styles.logoBadge}>
          <Radio size={16} className={styles.livePulseIcon} />
        </div>
        <div className={styles.brandTitle}>
          <h1>PEFAK56 Holyrics</h1>
          <span className={styles.badge}>Live Presenter Studio</span>
        </div>
      </div>

      {/* Control Groups */}
      <div className={styles.headerActions}>
        {/* Output Launcher Controls */}
        <div className={styles.displayLauncher} role="region" aria-label="Output Displays">
          <button
            onClick={() => openDisplayWindow('/presenter/main', 'main')}
            className={styles.displayBtn}
            title="Open Main Projector Display Window (F7)"
          >
            <Tv size={15} />
            <span>Main Display</span>
          </button>
          
          <button
            onClick={() => openDisplayWindow('/presenter/stage', 'stage')}
            className={styles.displayBtn}
            title="Open Stage / Confidence Monitor Window"
          >
            <Monitor size={15} />
            <span>Stage Monitor</span>
          </button>
          
          <button
            onClick={() => openDisplayWindow('/presenter/stream', 'stream')}
            className={styles.displayBtn}
            title="Open OBS Lower Thirds Stream Overlay"
          >
            <LayoutTemplate size={15} />
            <span>OBS Overlay</span>
          </button>
        </div>

        <div className={styles.divider} />

        {/* View Column Toggles */}
        <div className={styles.viewControls} role="group" aria-label="Layout Column Toggles">
          <button
            onClick={() => toggleColumn('list')}
            className={`${styles.viewBtn} ${visibleColumns.list ? styles.activeView : ''}`}
            title="Toggle Library / Setlist Side Panel"
            aria-pressed={visibleColumns.list}
            aria-label="Toggle Library Panel"
          >
            <PanelLeft size={16} />
            <span className={styles.viewLabel}>Library</span>
          </button>

          <button
            onClick={() => toggleColumn('editor')}
            className={`${styles.viewBtn} ${visibleColumns.editor ? styles.activeView : ''}`}
            title="Toggle Song Editor Panel"
            aria-pressed={visibleColumns.editor}
            aria-label="Toggle Editor Panel"
          >
            <SquarePen size={16} />
            <span className={styles.viewLabel}>Editor</span>
          </button>

          <button
            onClick={() => toggleColumn('presenter')}
            className={`${styles.viewBtn} ${visibleColumns.presenter ? styles.activeView : ''}`}
            title="Toggle Presenter Output Console"
            aria-pressed={visibleColumns.presenter}
            aria-label="Toggle Presenter Console"
          >
            <Layers size={16} />
            <span className={styles.viewLabel}>Presenter</span>
          </button>
        </div>

        <div className={styles.divider} />

        {/* Action Button */}
        <button onClick={addSong} className={styles.addButton}>
          <Plus size={16} strokeWidth={2.5} />
          <span>New Song</span>
        </button>
      </div>
    </header>
  );
}