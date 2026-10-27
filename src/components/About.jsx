const STATS = [
  { value: '12+', label: '年文化与传媒积淀' },
  { value: '180+', label: '品牌与机构合作' },
  { value: '40+', label: '文创系列落地' },
  { value: 'A+', label: '内容与视觉标准' },
]

export default function About() {
  return (
    <section className="about section" id="about">
      <div className="container about__grid">
        <div className="about__copy">
          <p className="section-label">关于我们</p>
          <h2 className="section-title">墨落秋声，文化新生</h2>
          <p className="section-desc">
            砚秋文化有限公司成立于东方美学与当代传播的交汇处。我们相信：
            好的文化产品不只是「好看」，更是可被记住的故事、可被携带的气质、
            可被持续传播的品牌资产。
          </p>
          <p className="about__extra">
            从城市文旅 IP、博物馆联名、到企业品牌视觉与短视频内容矩阵，
            砚秋以策展式的工作方法，连接设计、内容、媒介与商业。
          </p>
          <blockquote className="about__quote">
            「一墨含千秋，一念见当代。」
          </blockquote>
        </div>

        <div className="about__panel">
          <div className="about__seal" aria-hidden="true">
            <img src="/assets/logo-mark.svg" alt="" />
          </div>
          <ul className="about__stats">
            {STATS.map((s) => (
              <li key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
