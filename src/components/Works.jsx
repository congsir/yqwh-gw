const WORKS = [
  {
    title: '「秋水藏书」文创系列',
    type: '文创产品',
    desc: '以宋纸纹样与现代极简结合的文具礼盒，获城市文化礼赠年度优选。',
    tone: 'gold',
  },
  {
    title: '江南博物馆 · 四季联名',
    type: 'IP 联名',
    desc: '四季主题视觉与限定周边，带动线下客流与社媒话题双重增长。',
    tone: 'seal',
  },
  {
    title: '品牌纪录片《一墨》',
    type: '影像传媒',
    desc: '为传统制墨工坊拍摄的品牌长片，斩获区域文化影像单元提名。',
    tone: 'teal',
  },
  {
    title: '「城迹」沉浸展览',
    type: '空间叙事',
    desc: '城市记忆主题沉浸展，融合光影装置与声音叙事，三日售罄预约。',
    tone: 'cream',
  },
]

export default function Works() {
  return (
    <section className="works section" id="works">
      <div className="container">
        <div className="works__head">
          <p className="section-label">精选作品</p>
          <h2 className="section-title">让文化，被看见与被珍藏</h2>
          <p className="section-desc">
            以下为 Demo 展示案例，风格与品类供品牌意向参考，可按真实项目替换。
          </p>
        </div>

        <div className="works__grid">
          {WORKS.map((w) => (
            <article key={w.title} className={`work-card work-card--${w.tone}`}>
              <div className="work-card__visual" aria-hidden="true">
                <span className="work-card__glyph">墨</span>
              </div>
              <div className="work-card__body">
                <span className="work-card__type">{w.type}</span>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
