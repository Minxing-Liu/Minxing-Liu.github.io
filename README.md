# Minxing Liu 的学术网站

使用 **Hexo + 官方 Butterfly 5.7.0**。

## 第一次在 Windows / VS Code 打开

安装 [VS Code](https://code.visualstudio.com/)、[Node.js 22](https://nodejs.org/en/download) 和 [Git](https://git-scm.com/downloads)。已经安装的不必重复安装。

新建一个专门放网站的文件夹，在 VS Code 打开它，然后打开“终端 → 新建终端”。Windows 可以将终端类型选为“Command Prompt / 命令提示符”。先下载当前正式版源码：

```powershell
git clone --branch main https://github.com/Minxing-Liu/Minxing-Liu.github.io.git academic-site
cd academic-site
npm ci
npm run dev
```

浏览器打开 http://localhost:4000 。终端保持运行，按 Ctrl+C 停止预览。在 VS Code 中用“文件 → 打开文件夹”打开下载得到的 `academic-site` 文件夹，以后都打开它。左下角分支应为 `main`。

第一次要下载依赖；以后只有依赖文件改变时才需要重新运行 `npm ci`。如果之前下载过旧版 myblog 文件夹，先保留原稿，日常更新使用这份新下载的源码。

首次提交前，如果 Git 提示缺少作者信息，在网站文件夹的终端中设置（邮箱替换成自己的 GitHub 提交邮箱，也可以使用 GitHub 提供的 noreply 邮箱）：

```text
git config user.name "Minxing Liu"
git config user.email "你的GitHub提交邮箱"
```

首次推送时，按照 Git / VS Code 的提示在浏览器登录自己的 GitHub 账号。

## 平时写笔记

每次开始编辑前，在网站文件夹中同步最新版本并启动预览：

```powershell
git pull --ff-only
npm run dev
```

编辑已有文章：打开 `source/_posts/` 中对应的 `.md` 文件。新建文章：另外打开一个终端，执行：

```powershell
npm run new:note -- svd
```

会新建 `source/_posts/svd.md`。在 VS Code 编辑这个 Markdown：标题、日期、分类写在开头两个 `---` 之间，正文写在后面。每篇文章可以用 `$x$` 写行内公式，用 `$$ ... $$` 写独立公式。

想从现有笔记开始，可打开 `source/_posts/covariance-correlation-pca.md`。保存后刷新本地浏览器页面查看效果。修改 `_config.yml` 或 `_config.butterfly.yml` 后，先 Ctrl+C 停止，再运行 `npm run dev`。

图片放在 `source/images/`，PDF 放在 `source/downloads/`，用 Markdown 链接插入。私密原稿不要放入这个公开仓库，草稿标记并不让源码变私密。

## 发布前

```powershell
npm run build
npm run check
```

先用 Ctrl+C 停止预览，再运行上面的检查命令。本地预览和检查正常后，在 VS Code 左侧的“源代码管理”中：查看改动 → 点击 `+` 暂存 → 填写提交说明 → 提交（Commit）→ 推送（Push），或点击“同步更改”（Sync Changes）。如果 Git 提示冲突，先解决提示的文件，再提交；不要强制推送。

保存文件只影响本机；commit 保存本地版本；push 把版本同步到 GitHub；Actions 根据源文件生成网页并更新正式网站。

也可以在终端完成同样操作（`git add` 后写本次要发布的文件或目录）：

```powershell
git add source/_posts/svd.md
git commit -m "添加 SVD 笔记"
git push origin main
```

打开 [Actions](https://github.com/Minxing-Liu/Minxing-Liu.github.io/actions/workflows/site.yml)，本次运行的 `build` 和 `deploy` 都通过后，访问 https://minxing-liu.github.io/ 。若看到旧页面，可 Ctrl+F5 刷新。

## 当前发布设置

Butterfly 已正式上线。`main` 保存日常维护的源码，`.github/workflows/site.yml` 已验证能够自动构建并发布 GitHub Pages。

`main` 上每次 push 都会自动更新网站。历史 `master` 分支保留旧版网页，日常不编辑它。不要从旧 Hexo 文件夹运行 `hexo deploy`，也不要编辑生成的 `public/` 文件。

## 文件分工

| 文件 | 用途 |
|---|---|
| source/_posts/ | 日常编辑的笔记 |
| source/notes/index.md | 笔记目录 |
| source/about/index.md | 个人简介 |
| _config.yml | 网站信息、网址、语言 |
| _config.butterfly.yml | Butterfly 菜单、封面、侧栏、公式、搜索 |
| legacy-site/ | 旧站完整快照，构建自动保留尚未转换的页面和附件 |
| docs/migration.md | 来源及迁移范围 |
| .github/workflows/site.yml | 自动构建与发布 |

模板样式来自 Butterfly，未重写页面布局。首页使用官网同款全屏背景、导航下拉菜单和循环打字副标题；文章、作者和菜单目标换成本站内容。头像暂用主题默认头像。修改背景、字幕、菜单等，见 [外观配置](docs/appearance.md)。

- [Butterfly 官方文档](https://butterfly.js.org/posts/21cfbf15/)
- [官方主题仓库](https://github.com/jerryc127/hexo-theme-butterfly)
