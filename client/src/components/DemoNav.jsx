export default function DemoNav({ demos, active, onSelect }) {
  return (
    <nav className="demo-nav" aria-label="Demo steps">
      {demos.map((demo) => (
        <button
          key={demo.id}
          type="button"
          className={`demo-nav-item ${active === demo.id ? "active" : ""}`}
          onClick={() => onSelect(demo.id)}
        >
          <span className="demo-num">{demo.id}</span>
          <span className="demo-text">
            <span className="demo-title">{demo.title}</span>
            <span className="demo-sub">{demo.subtitle}</span>
          </span>
        </button>
      ))}
    </nav>
  );
}
