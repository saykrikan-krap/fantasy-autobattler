import "./styles.css";

export default function App() {
  return (
    <div className="app">
      <header className="app__header">
        <p className="app__eyebrow">Fantasy Autobattler</p>
        <h1>Desktop Replay Viewer</h1>
        <p className="app__sub">
          Tauri v2 + React scaffold. Replace this screen with the replay viewer.
        </p>
      </header>
      <section className="app__panel">
        <div className="app__stat">
          <span className="app__label">Status</span>
          <span className="app__value">Hello from Tauri v2</span>
        </div>
        <div className="app__stat">
          <span className="app__label">Mode</span>
          <span className="app__value">Local dev</span>
        </div>
      </section>
    </div>
  );
}
