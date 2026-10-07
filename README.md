# Minxing Liu 的学术网站

使用 **Hexo + 官方 Butterfly 5.7.0**。

## 第一次在 Windows / VS Code 打开

安装 Node.js 22 和 Git。在 VS Code 打开终端：

```powershell
git clone -b codex/butterfly-academic-site https://github.com/Minxing-Liu/Minxing-Liu.github.io.git academic-site
cd academic-site
npm ci
npm run dev
```

浏览器打开 http://localhost:4000 。终端保持运行，按 Ctrl+C 停止预览。第一次要下载依赖；之后不用重复安装。若 PR 已合并，则 clone 默认 main，不再指定 -b。

## 平时写笔记

```powershell
npm run new:note -- svd
```

会新建 `source/_posts/svd.md`。在 VS Code 编辑这个 Markdown：标题、日期、分类写在开头两个 `---` 之间，正文写在后面。每篇文章可以用 `$x$` 写行内公式，用 `$$ ... $$` 写独立公式。

想从现有笔记开始，可打开 `source/_posts/covariance-correlation-pca.md`。只保存文件即可在本地预览新内容。

图片放在 `source/images/`，PDF 放在 `source/downloads/`，用 Markdown 链接插入。私密原稿不要放入这个公开仓库，草稿标记并不让源码变私密。

## 发布前

```powershell
npm run build
npm run check
```

本地预览正常后，在 VS Code 的“源代码管理”中暂存改动、填写提交说明、提交并推送。commit 保存本地版本；push 把版本同步到 GitHub；Actions 再根据这些源文件生成网页。

## 第一次切换线上版本

1. 核对此 PR 的构建与预览，通过后合并到 main。
2. GitHub 仓库 Settings → Pages → Source 选择 **GitHub Actions**。
3. Actions → “Build and publish Butterfly” → Run workflow，选择 main。
4. 构建及发布成功后，访问 https://minxing-liu.github.io/ 。

完成这一次设置后，main 上每次 push 都会自动更新网站。PR 分支的 push 只构建，不会替换线上站点。不要再从旧 Hexo 文件夹运行 hexo deploy。

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
