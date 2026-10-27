export default function Contact() {
  return (
    <section className="contact section" id="contact">
      <div className="container contact__grid">
        <div>
          <p className="section-label">联系我们</p>
          <h2 className="section-title">开启一次文化对话</h2>
          <p className="section-desc">
            无论是品牌焕新、文创孵化，还是影像与展览项目，欢迎留下意向。
            本页为 Demo 展示，提交将仅作本地演示，不会真实发送。
          </p>

          <ul className="contact__meta">
            <li>
              <span>邮箱</span>
              <a href="mailto:hello@yanqiu.culture">hello@yanqiu.culture</a>
            </li>
            <li>
              <span>电话</span>
              <a href="tel:+8602112345678">+86 021-1234 5678</a>
            </li>
            <li>
              <span>地址</span>
              <em>上海市 · 静安区 · 文化创意园区（示意）</em>
            </li>
          </ul>
        </div>

        <form
          className="contact__form"
          onSubmit={(e) => {
            e.preventDefault()
            const btn = e.currentTarget.querySelector('[type="submit"]')
            const prev = btn.textContent
            btn.textContent = '已收到（Demo）'
            btn.disabled = true
            setTimeout(() => {
              btn.textContent = prev
              btn.disabled = false
              e.currentTarget.reset()
            }, 2200)
          }}
        >
          <label>
            <span>您的称呼</span>
            <input name="name" type="text" placeholder="如何称呼您" required />
          </label>
          <label>
            <span>联系方式</span>
            <input name="contact" type="text" placeholder="邮箱或手机" required />
          </label>
          <label>
            <span>项目意向</span>
            <select name="interest" defaultValue="">
              <option value="" disabled>请选择</option>
              <option>品牌文化策略</option>
              <option>文创产品开发</option>
              <option>内容传媒制作</option>
              <option>展览与空间叙事</option>
              <option>数字文化传播</option>
              <option>其他合作</option>
            </select>
          </label>
          <label>
            <span>简要说明</span>
            <textarea name="message" rows={4} placeholder="告诉我们您的想法…" />
          </label>
          <button type="submit" className="btn btn-primary">发送意向</button>
        </form>
      </div>
    </section>
  )
}
