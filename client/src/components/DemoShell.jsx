export default function DemoShell({
  step,
  title,
  concept,
  talkTrack,
  children,
}) {
  return (
    <section className="demo-shell">
      <header className="demo-header">
        <p className="step-pill">Demo {step}</p>
        <h1>{title}</h1>
        <p className="concept">{concept}</p>
      </header>

      <div className="demo-grid">
        <div className="demo-stage">{children}</div>
        <aside className="talk-track">
          <h2>Presenter notes</h2>
          <ol>
            {talkTrack.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  );
}
