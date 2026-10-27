import useReveal from '../useReveal.js';
import { steps } from '../content.js';

export default function About() {
  const ref = useReveal();

  return (
    <section className="section about" id="about">
      <div className="wrap reveal" ref={ref}>
        <div className="about-grid">
          <div>
            <p className="kicker kicker-dark">关于砚秋</p>
            <h2>一方砚台，托住品牌要说的话</h2>
            <div className="prose">
              <p>
                砚秋文化是一家文化创意与品牌传播工作室。我们从「砚」出发——一方承纸、承时间、也承得住品牌语气的器物——为博物馆、城市品牌与当代机构建立清晰而有温度的叙事。
              </p>
              <p>
                名字里的「秋」，是色温，也是收成。把散落的文化资产，收成可以被看见、被使用、被记住的内容与产品。石脉、纸纹、节气与当代媒介，在同一张台面上工作。
              </p>
            </div>
            <ul className="principles">
              <li>
                <strong>砚石</strong>
                <span>承托品牌的器物尺度</span>
              </li>
              <li>
                <strong>秋色</strong>
                <span>视觉里稳定的温度</span>
              </li>
              <li>
                <strong>纸页</strong>
                <span>内容真正发生的地方</span>
              </li>
            </ul>
          </div>
          <figure className="about-figure">
            <img
              src="/assets/about-studio.jpg"
              alt="砚秋工作室：长木桌上的砚台、纸样，以及窗外的银杏"
              width="1280"
              height="720"
            />
            <figcaption>
              <span className="seal" aria-hidden="true">
                <em>砚</em>
                <em>秋</em>
              </span>
              杭州 · 工作室
            </figcaption>
          </figure>
        </div>
        <ol className="steps">
          {steps.map((step) => (
            <li key={step.title}>
              <span>{step.index}</span>
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
