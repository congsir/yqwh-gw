export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <img src="/assets/logo.svg" alt="砚秋文化" />
          <p>以墨为骨，以秋为韵。<br />文化创意与当代传媒工作室。</p>
        </div>
        <div className="footer__cols">
          <div>
            <h4>导航</h4>
            <a href="#about">关于我们</a>
            <a href="#services">服务</a>
            <a href="#works">作品</a>
            <a href="#contact">联系</a>
          </div>
          <div>
            <h4>关注</h4>
            <span>微信公众号 · 砚秋文化</span>
            <span>小红书 · 砚秋文创</span>
            <span>视频号 · 砚秋影像</span>
          </div>
        </div>
      </div>
      <div className="footer__bar container">
        <span>© {new Date().getFullYear()} 砚秋文化有限公司 · Demo 展示站</span>
        <span>品牌 · 文创 · 传媒</span>
      </div>
    </footer>
  )
}
