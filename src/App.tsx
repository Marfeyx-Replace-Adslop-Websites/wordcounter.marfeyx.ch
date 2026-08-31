import { useMemo, useState } from "react";
import { analyzeText } from "./textStats";
import type { TextStats, TopWord } from "./types";

const sampleText = `Private text analysis should be fast, clear, and respectful of the reader.

This word counter runs entirely in your browser. Paste any draft, article, message, or report to see the total words, character counts, sentence structure, and the words that appear most often.

No text is uploaded, saved, or sent to a server. Refresh the page and the text is gone.`;

export default function App() {
  const [text, setText] = useState("");
  const stats = useMemo(() => analyzeText(text), [text]);
  const hasText = text.trim().length > 0;

  return (
    <main className="app-shell">
      <aside className="control-panel">
        <div>
          <p className="eyebrow">Wordcounter</p>
          <h1>Your text stats, computed privately.</h1>
          <p className="lede">Paste text below. Everything is analyzed in this browser and disappears when the tab closes.</p>
        </div>

        <div className="privacy-badge">
          <span aria-hidden="true">Local</span>
          <strong>No uploads. No saved text.</strong>
          <small>This app does not use accounts, cookies, localStorage, or a backend.</small>
        </div>

        <label className="text-input-card">
          <span>Text input</span>
          <textarea
            value={text}
            spellCheck
            placeholder="Paste an article, essay, message, or any other text..."
            onChange={(event) => setText(event.target.value)}
          />
        </label>

        <div className="actions">
          <button className="primary-button" type="button" onClick={() => setText(sampleText)}>
            Use sample text
          </button>
          <button className="text-button" type="button" disabled={!hasText} onClick={() => setText("")}>
            Clear
          </button>
        </div>

        <section className="panel-block compact-stats">
          <MiniStat label="Words" value={stats.words} />
          <MiniStat label="Characters" value={stats.characters} />
          <MiniStat label="Lines" value={stats.lines} />
        </section>
      </aside>

      <section className="story-panel">
        <div className="story-header">
          <p className="eyebrow">Live analysis</p>
          <h2>{hasText ? "Your Wordcounter" : "Paste text to start"}</h2>
          <p>
            {hasText
              ? `${stats.words.toLocaleString()} words across ${stats.paragraphs.toLocaleString()} paragraphs.`
              : "The dashboard updates instantly once text is entered."}
          </p>
        </div>

        <div className="hero-metrics">
          <MetricCard label="Total words" value={stats.words} />
          <MetricCard label="Characters" value={stats.characters} />
          <MetricCard label="No spaces" value={stats.charactersNoSpaces} />
          <MetricCard label="Reading time" value={formatMinutes(stats.readingMinutes)} />
        </div>

        <section className="wrapped-section">
          <SectionTitle eyebrow="Structure" title="How the text is built" />
          <div className="split-grid">
            <Highlight label="Sentences" value={stats.sentences} detail={`${formatDecimal(stats.averageWordsPerSentence)} words per sentence`} />
            <Highlight label="Paragraphs" value={stats.paragraphs} detail={`${stats.lines.toLocaleString()} total lines`} />
          </div>
          <div className="structure-grid">
            <ProgressRow label="Words" value={stats.words} total={Math.max(1, stats.words + stats.charactersNoSpaces)} />
            <ProgressRow label="Unique words" value={stats.uniqueWords} total={Math.max(1, stats.words)} />
            <ProgressRow label="Content-word variety" value={stats.lexicalDensity} total={100} suffix="%" />
          </div>
        </section>

        <section className="wrapped-section">
          <SectionTitle eyebrow="Words" title="Most used words" />
          {stats.topWords.length ? <TopWords words={stats.topWords} /> : <p className="empty">No repeated content words yet.</p>}
        </section>
      </section>

      <aside className="detail-panel">
        <section className="panel-block">
          <h2>Quick read</h2>
          <ResponseLine label="Reading time" value={formatMinutes(stats.readingMinutes)} detail="Estimated at 200 words per minute" />
          <ResponseLine label="Average word" value={`${formatDecimal(stats.averageCharactersPerWord)} chars`} detail="Whitespace excluded" />
          <ResponseLine label="Lexical density" value={`${stats.lexicalDensity}%`} detail="Unique non-filler words divided by all words" />
        </section>

        <section className="panel-block">
          <h2>Character split</h2>
          <ProgressRow label="Without spaces" value={stats.charactersNoSpaces} total={Math.max(1, stats.characters)} />
          <ProgressRow label="Whitespace" value={Math.max(0, stats.characters - stats.charactersNoSpaces)} total={Math.max(1, stats.characters)} />
        </section>

        <section className="panel-block word-list">
          <h2>Top word share</h2>
          {stats.topWords.length ? (
            stats.topWords.slice(0, 6).map((word) => (
              <article className="word-row" key={word.word}>
                <strong>{word.word}</strong>
                <span>{word.count.toLocaleString()} uses</span>
                <small>{formatDecimal(word.percentage)}% of all words</small>
              </article>
            ))
          ) : (
            <p className="empty">Top words appear here after you paste text.</p>
          )}
        </section>
      </aside>
    </main>
  );
}

function TopWords({ words }: { words: TopWord[] }) {
  const max = Math.max(...words.map((word) => word.count), 1);
  return (
    <div className="top-words">
      {words.map((word) => (
        <div className="top-word-row" key={word.word}>
          <div>
            <strong>{word.word}</strong>
            <span>{word.count.toLocaleString()}</span>
          </div>
          <div className="word-track" aria-label={`${word.word}: ${word.count} uses`}>
            <i style={{ width: `${Math.max(4, (word.count / max) * 100)}%` }} />
          </div>
          <small>{formatDecimal(word.percentage)}%</small>
        </div>
      ))}
    </div>
  );
}

function ResponseLine({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="response-line">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function ProgressRow({ label, value, total, suffix = "" }: { label: string; value: number; total: number; suffix?: string }) {
  const percentage = total ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <div className="progress-row">
      <div>
        <span>{label}</span>
        <strong>
          {value.toLocaleString()}
          {suffix}
        </strong>
      </div>
      <div className="progress-track">
        <i style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="section-title">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{typeof value === "number" ? value.toLocaleString() : value}</strong>
    </article>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <strong>{value.toLocaleString()}</strong>
      <span>{label}</span>
    </div>
  );
}

function Highlight({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <article className="highlight-card">
      <span>{label}</span>
      <strong>{value.toLocaleString()}</strong>
      <small>{detail}</small>
    </article>
  );
}

function formatMinutes(minutes: number) {
  if (!minutes) return "0m";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining ? `${hours}h ${remaining}m` : `${hours}h`;
}

function formatDecimal(value: number) {
  return Number.isInteger(value) ? value.toLocaleString() : value.toLocaleString(undefined, { maximumFractionDigits: 1 });
}
