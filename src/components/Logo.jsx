export default function Logo() {
  return (
    <a className="logo" href="#top" aria-label="砚秋文化，回到页首">
      <svg className="logo-mark" viewBox="0 0 48 48" aria-hidden="true">
        <rect x="1.35" y="1.35" width="45.3" height="45.3" rx="13" fill="#14110E" stroke="currentColor" strokeWidth="1.15" />
        <path
          fill="#E7D3A1"
          d="M24 31 L23.25 24.2 C17 23.3 12.4 19.4 13.4 14.1 C14.2 10 18.7 9.5 21.9 13.5 C22.9 14.9 23.5 16.7 24 18.7 C24.5 16.7 25.1 14.9 26.1 13.5 C29.3 9.5 33.8 10 34.6 14.1 C35.6 19.4 31 23.3 24.75 24.2 Z"
        />
        <path d="M24 18.9 V29.4" stroke="#8C6A32" strokeWidth="0.7" strokeLinecap="round" />
        <rect x="15.2" y="33.7" width="17.6" height="3.4" rx="1.7" fill="none" stroke="#E7D3A1" strokeWidth="1.15" />
        <circle cx="19.15" cy="35.4" r="1.05" fill="#0C0A09" />
        <circle cx="18.8" cy="35.12" r="0.3" fill="#E7D3A1" />
      </svg>
      <span className="logo-text">
        <span className="logo-cn">砚秋文化</span>
        <span className="logo-en">Yanqiu Culture</span>
      </span>
    </a>
  );
}
