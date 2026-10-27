# 砚秋文化

砚秋文化（Yanqiu Culture）官网。文化创意与品牌传播工作室的单页站点，视觉围绕砚台、秋色与纸页。

## 开发

```bash
npm install
npm run dev
```

生产构建：

```bash
npm install
npm run build
npm run preview
```

## 结构

- `src/components/HeroScene.jsx`：Three.js 雕刻砚台、秋金丝带与落叶。WebGL 不可用时改用 `public/assets/inkstone-fallback.png`。
- `public/assets/`：页首氛围图、工作室照片，以及 `works/` 下的作品图片。
- `BRAND.md`：色彩、字体、标志与语气。

中文字体为 Noto Serif SC / Noto Sans SC，许可见 `public/fonts/OFL.txt`。
