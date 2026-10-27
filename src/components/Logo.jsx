export default function Logo() {
  return (
    <a className="logo" href="#top" aria-label="砚秋文化，回到页首">
      <svg className="logo-mark" viewBox="0 0 40 40" aria-hidden="true">
        <rect x="3.5" y="11" width="33" height="20" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="14.2" cy="21" rx="5.6" ry="4.4" fill="none" stroke="currentColor" strokeWidth="1.35" />
        <path d="M23 17.2c2.8.5 5.6 0 7.6-2.2-.5 3.4-2.8 5.8-6.2 6.6-1.2-1.4-1.7-3-1.4-4.4z" fill="#C6A15A" />
      </svg>
      <span className="logo-text">
        <span className="logo-cn">砚秋文化</span>
        <span className="logo-en">Yanqiu Culture</span>
      </span>
    </a>
  );
}
