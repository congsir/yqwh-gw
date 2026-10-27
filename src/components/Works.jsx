import useReveal from '../useReveal.js';
import { works } from '../content.js';

export default function Works() {
  const ref = useReveal();

  return (
    <section className="section works" id="works">
      <div className="wrap reveal" ref={ref}>
        <div className="section-head">
          <p className="kicker kicker-dark">作品</p>
          <h2>让文化被看见，也被带走</h2>
          <p className="section-lead">
            以下为方向案例，用来呈现砚秋的工作方法，可按真实项目替换。画面是器物、空间与影像，不再用字作占位。
          </p>
        </div>
        <div className="works-grid">
          {works.map((work) => (
            <article className="work-card" key={work.title}>
              <div className="work-media">
                <img src={work.image} alt={work.alt} width="1152" height="864" />
                <span>{work.tag}</span>
              </div>
              <div className="work-body">
                <h3>{work.title}</h3>
                <p>{work.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
