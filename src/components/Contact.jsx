import { useState } from 'react';
import useReveal from '../useReveal.js';

const initial = {
  name: '',
  org: '',
  email: '',
  intent: '品牌策略',
  message: '',
};

const intents = ['品牌策略', '视觉与文创', '影像内容', '空间展览', '其他'];

export default function Contact() {
  const ref = useReveal();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = '请留下称呼';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = '请填写有效邮箱';
    if (form.message.trim().length < 8) next.message = '请用一两句话说明来意';
    setErrors(next);
    if (Object.keys(next).length) {
      setSent(false);
      return;
    }
    setSent(true);
  };

  return (
    <section className="section contact" id="contact">
      <div className="wrap contact-grid reveal" ref={ref}>
        <div>
          <p className="kicker">联系</p>
          <h2>下一季，从这方砚台开始</h2>
          <p className="section-lead">
            项目咨询、品牌合作与媒体约访，写下机构与意向即可。砚秋工作室在杭州。
          </p>
          <dl className="contact-meta">
            <div>
              <dt>地点</dt>
              <dd>杭州 · 砚秋文化工作室</dd>
            </div>
            <div>
              <dt>方向</dt>
              <dd>文化策略、视觉文创、影像与空间叙事</dd>
            </div>
          </dl>
        </div>
        <form className="form" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">称呼</label>
            <input id="name" name="name" value={form.name} onChange={update('name')} autoComplete="name" />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>
          <div className="field">
            <label htmlFor="org">机构</label>
            <input id="org" name="org" value={form.org} onChange={update('org')} autoComplete="organization" />
          </div>
          <div className="field">
            <label htmlFor="email">邮箱</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={update('email')}
              autoComplete="email"
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>
          <div className="field">
            <label htmlFor="intent">意向</label>
            <select id="intent" name="intent" value={form.intent} onChange={update('intent')}>
              {intents.map((intent) => (
                <option key={intent}>{intent}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="message">来意</label>
            <textarea id="message" name="message" rows="4" value={form.message} onChange={update('message')} />
            {errors.message && <p className="field-error">{errors.message}</p>}
          </div>
          <button className="btn btn-gold" type="submit">
            发送咨询
          </button>
          <p className="form-note" role="status">
            {sent
              ? `已在页面上确认「${form.name}」的意向。此为前端示意，内容不会发送到服务器。`
              : '此为前端示意。提交只会在页面上确认，不会真正发信。'}
          </p>
        </form>
      </div>
    </section>
  );
}
