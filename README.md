# MoodArc

演示模式默认开启，**无需 OAuth**。

## 30 秒跑通 demo

```bash
cd mood-arc
# 先关掉占用 3000 的旧进程（很重要）
lsof -i :3000
# 若有 node，记下 PID 后：kill <PID>

cp .env.local.example .env.local
npm install
npm run dev
```

**必须用终端里显示的地址打开**，推荐：

**http://localhost:3000**

不要用 `127.0.0.1` 和 `localhost` 混用（会导致页面卡在加载中）。

## 环境变量

| 变量 | Mock 模式 |
|------|-----------|
| `MOODARC_MOCK=true` | 服务端用模拟数据（未配 Google OAuth 时也会自动启用） |
| `NEXT_PUBLIC_MOODARC_MOCK=true` | 可选；未设置时会从 `MOODARC_MOCK` 同步到前端 |

关闭 Mock、接 YouTube：设 `MOODARC_MOCK=false`，配置 `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `NEXTAUTH_SECRET`。

## 部署到 Vercel（公开演示链接）

在 Vercel 项目 **Environment Variables** 中设置：

- `MOODARC_MOCK=true`（或同时设 `NEXT_PUBLIC_MOODARC_MOCK=true`）

重新部署后，访客打开 `https://mood-arc.vercel.app/` 会**自动进入演示**，无需 Google 登录。若仍看到登录按钮，说明构建时未启用 Mock，请检查变量后 **Redeploy**。

分享链接给他人即可体验；「生成歌单」需先选**心情**和**调节目标**（按钮下方有提示）。

## 打不开？

1. 必须在 **本目录** 运行 `npm run dev`
2. 路径：`gender-awareness-demo/mood-arc`
3. `lsof -i :3000` 确认有 node 在监听

详见 [PRODUCT.md](./PRODUCT.md)。用户说明见 [USER-GUIDE.md](./USER-GUIDE.md)（或 `用户说明.md`）。
