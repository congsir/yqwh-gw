import useReveal from '../useReveal.js';
import { services } from '../content.js';

export default function Services() {
  const ref = useReveal();

  return (
    <section className="section services" id="services">
      <div className="wrap reveal" ref={ref}>
        <div className="section-head">
          <p className="kicker">服务</p>
          <h2>四件事，在同一方台面上</h2>
          <p className="section-lead">
            策略、视觉、影像和空间不分开交货。砚秋用同一套材料语言把它们对齐，让品牌从一句话走到一件可以带走的东西。
          </p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.index}>
              <span className="service-index">{service.index}</span>
              <h3>{service.title}</h3>
              <p className="service-lead">{service.lead}</p>
              <p>{service.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
