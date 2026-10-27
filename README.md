# 砚秋文化有限公司 · 官网 Demo

高端文创 / 传媒企业官网展示页（静态 Demo）。含自定义品牌色、SVG Logo、Three.js WebGL 首屏。

## 品牌速览

| Token | Hex | 用途 |
|--------|-----|------|
| Ink | `#0B0D10` | 主背景 |
| Ink Soft | `#14181F` | 卡片 / 面板 |
| Amber | `#C4A574` | 主强调色（秋金） |
| Amber Light | `#E8D5A8` | 高光文字 |
| Cream | `#F5F0E8` | 主文字 |
| Seal | `#A85A4A` | 次强调（朱印感） |

- Logo：`public/assets/logo.svg`（字标 + 墨滴印记）
- 印记：`public/assets/logo-mark.svg`
- Favicon：`public/assets/favicon.svg`

## 本地预览

在仓库根目录执行：

```bash
npm install
npm run dev
```

默认开发地址：`http://localhost:5173/`（以终端输出为准）。

生产构建：

```bash
npm run build
npm run preview
```

## 技术栈

- Vite + React
- Three.js + `@react-three/fiber`（首屏 WebGL：墨带 / 粒子 / 墨核）
- 无后端；联系表单为前端 Demo 提示

## 页面结构

单页滚动：首页首屏 → 关于我们 → 服务 → 作品 → 联系我们 → 页脚
