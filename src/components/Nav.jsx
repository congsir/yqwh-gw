import { useEffect, useState } from 'react'

const LINKS = [
  { href: '#about', label: '关于我们' },
  { href: '#services', label: '服务' },
  { href: '#works', label: '作品' },
  { href: '#contact', label: '联系' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header className={`nav ${scrolled || open ? 'nav--solid' : ''}`}>
      <div className="nav__inner container">
        <a href="#top" className="nav__brand" aria-label="砚秋文化首页">
          <img src="/assets/logo.svg" alt="砚秋文化" className="nav__logo" />
        </a>

        <nav className="nav__links" aria-label="主导航">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>

        <a href="#contact" className="nav__cta btn btn-ghost">预约咨询</a>

        <button
          className={`nav__toggle ${open ? 'is-open' : ''}`}
          aria-label={open ? '关闭菜单' : '打开菜单'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={`nav__drawer ${open ? 'is-open' : ''}`}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
        ))}
        <a href="#contact" className="btn btn-primary" onClick={() => setOpen(false)}>预约咨询</a>
      </div>
    </header>
  )
}
