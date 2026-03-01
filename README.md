# bloodsugar-game

控糖生存指南 — 七日饮食选择小游戏。

## 本地运行

```bash
npm install
npm run dev          # 本机 http://localhost:3000
npm run dev:mobile   # 局域网访问，手机可预览
```

## 部署到线上（在 health scheme 等链接看到最新效果）

1. **推送到 GitHub**（已完成）  
   仓库：`https://github.com/Ingrid-Chen/bloodsugar-game`

2. **用 Vercel 部署**
   - 打开 [vercel.com](https://vercel.com)，用 GitHub 登录
   - 点击 **Add New… → Project**，选择 **Import** 仓库 `Ingrid-Chen/bloodsugar-game`
   - 保持默认（Framework: Next.js），点击 **Deploy**
   - 部署完成后会得到 Production 链接（如 `bloodsugar-game-xxx.vercel.app`）

3. **绑定自定义域名（如 health scheme 的链接）**
   - 在 Vercel 项目里进入 **Settings → Domains**
   - 添加你的域名（例如 health scheme 使用的域名），按提示解析即可
   - 之后每次 `git push origin main` 都会自动部署，在绑定的域名上即可看到最新效果
