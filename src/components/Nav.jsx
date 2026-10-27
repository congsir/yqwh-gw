import { useEffect, useState } from 'react';
import Logo from './Logo.jsx';
import { nav } from '../content.js';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('nav-open', open);
    return () => document.body.classList.remove('nav-open');
  }, [open]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="wrap nav-bar">
        <Logo />
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? '关闭菜单' : '打开菜单'}</span>
          <i />
          <i />
        </button>
        <nav id="site-nav" className={`nav-links ${open ? 'is-open' : ''}`} aria-label="主导航">
          {nav.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a className="btn btn-gold btn-small" href="#contact" onClick={() => setOpen(false)}>
            预约咨询
          </a>
        </nav>
      </div>
    </header>
  );
}
