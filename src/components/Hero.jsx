import HeroScene from './HeroScene.jsx';

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-photo" role="img" aria-label="秋日工作室里的砚台、宣纸与窗外金叶" />
      <div className="hero-mesh" aria-hidden="true">
        <span className="orb orb-gold" />
        <span className="orb orb-seal" />
        <span className="orb orb-cream" />
      </div>
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-scrim" aria-hidden="true" />
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <p className="kicker">
            <i className="seal-dot" aria-hidden="true" />
            文化策略 · 品牌内容 · 影像传播
          </p>
          <h1>
            <span>以砚承文</span>
            <span>以秋传声</span>
          </h1>
          <p className="lede">
            砚秋文化以砚石的沉稳、纸页的肌理与秋色的温度，为机构与品牌构筑可感知、可传播、可珍藏的文化体验。
          </p>
          <div className="hero-actions">
            <a className="btn btn-gold" href="#services">
              探索服务
            </a>
            <a className="btn btn-line" href="#works">
              查看作品
            </a>
          </div>
        </div>
        <HeroScene />
      </div>
      <a className="scroll-cue" href="#about">
        <span>向下展开</span>
        <i />
      </a>
    </section>
  );
}
