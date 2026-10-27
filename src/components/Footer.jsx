import Logo from './Logo.jsx';
import { nav } from '../content.js';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <Logo />
          <p>以砚承文，以秋传声。</p>
        </div>
        <nav aria-label="页脚导航">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <p className="footer-colophon">
          文化创意 · 品牌传播 · 内容影像
          <br />
          杭州
        </p>
      </div>
      <div className="wrap footer-bar">
        <span>© {year} 砚秋文化 Yanqiu Culture</span>
        <span>方向案例仅供方法示意</span>
      </div>
    </footer>
  );
}
