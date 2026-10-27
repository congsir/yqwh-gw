const SERVICES = [
  {
    num: '01',
    title: '品牌文化策略',
    desc: '从品牌原点出发，梳理文化叙事与视觉语法，建立可长期延展的品牌文化体系。',
    tags: ['品牌定位', '文化叙事', '视觉识别'],
  },
  {
    num: '02',
    title: '文创产品开发',
    desc: '博物馆、城市与企业 IP 的产品化落地：礼赠、零售、联名，兼顾美学与商业。',
    tags: ['产品设计', 'IP 联名', '礼赠体系'],
  },
  {
    num: '03',
    title: '内容传媒制作',
    desc: '短视频、纪录片、品牌片与空间影像，以影像语言传递文化温度与专业质感。',
    tags: ['影像创作', '短视频', '品牌片'],
  },
  {
    num: '04',
    title: '展览与空间叙事',
    desc: '策展、展陈与沉浸式空间设计，让观众在现场完成一次「可走动的阅读」。',
    tags: ['策展', '展陈', '沉浸体验'],
  },
  {
    num: '05',
    title: '数字文化传播',
    desc: '社交媒体运营、数字藏品与互动 H5，让文化内容在新媒介中持续生长。',
    tags: ['社媒运营', '互动设计', '数字藏品'],
  },
]

export default function Services() {
  return (
    <section className="services section" id="services">
      <div className="container">
        <div className="services__head">
          <p className="section-label">我们的服务</p>
          <h2 className="section-title">以专业，成全文化表达</h2>
          <p className="section-desc">
            覆盖策略、设计、内容与传播全链路，为文创与传媒项目提供一体化解决方案。
          </p>
        </div>

        <div className="services__grid">
          {SERVICES.map((s) => (
            <article key={s.num} className="service-card">
              <span className="service-card__num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <ul className="service-card__tags">
                {s.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
