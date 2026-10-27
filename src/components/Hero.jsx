import { Suspense, lazy, useEffect, useState } from 'react'

const HeroScene = lazy(() => import('./HeroScene'))

export default function Hero() {
  const [webglOk, setWebglOk] = useState(true)

  useEffect(() => {
    try {
      const c = document.createElement('canvas')
      const ok = !!(c.getContext('webgl') || c.getContext('experimental-webgl'))
      setWebglOk(ok)
    } catch {
      setWebglOk(false)
    }
  }, [])

  return (
    <section className="hero" id="top">
      {webglOk ? (
        <Suspense fallback={<div className="hero-canvas__fallback" />}>
          <HeroScene />
        </Suspense>
      ) : (
        <div className="hero-canvas__fallback" aria-hidden="true" />
      )}

      <div className="hero__veil" />

      <div className="hero__content container">
        <p className="hero__eyebrow">文创设计 · 品牌传媒 · 内容叙事</p>
        <h1 className="hero__title">
          以墨为骨<span className="hero__dot">·</span>以秋为韵
        </h1>
        <p className="hero__lead">
          砚秋文化，深耕文化创意与当代传媒。我们把东方气质融入品牌叙事，
          为机构与品牌打造可感知、可传播、可珍藏的文化体验。
        </p>
        <div className="hero__actions">
          <a href="#services" className="btn btn-primary">探索服务</a>
          <a href="#works" className="btn btn-ghost">查看作品</a>
        </div>
      </div>

      <a href="#about" className="hero__scroll" aria-label="向下滚动">
        <span>下滑了解</span>
        <i />
      </a>
    </section>
  )
}
