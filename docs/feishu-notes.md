# 从飞书发布笔记

日常在飞书编辑原稿，需要发布时导出 Markdown，再同步到本站。飞书中的修改不会自动出现在网站上，每次更新需要重新导出、检查和推送。

## 第一次发布一篇笔记

1. 在飞书桌面端或网页版打开文档，右上角 `… → 下载为 → Markdown`。如果提供“仅文本”和“所有内容”，有图片或附件时选择“所有内容”。
2. 在网站文件夹先运行 `git pull --ff-only`，然后运行 `npm run new:note -- svd`（将 svd 换成这篇笔记固定的英文文件名）。
3. 在 VS Code 打开 `source/_posts/svd.md`。保留顶部两个 `---` 之间的文章信息，修改 `title`、分类和标签；用飞书导出的正文替换第二个 `---` 之后的示例正文。保留 `permalink`，它决定文章网址。
4. 处理图片和附件，检查公式，方法见下文。
5. `npm run dev` 启动本地预览，打开 http://localhost:4000 检查文章。
6. Ctrl+C 停止预览，执行 `npm run build` 和 `npm run check`。
7. 在 VS Code 暂存本次笔记及图片的改动，提交并推送到 main。Actions 成功后，正式网站自动更新。

## 更新已经发布的文章

继续在飞书修改同一篇原稿，再次导出 Markdown。替换网站里对应 `.md` 文件的正文，保留原来的文章信息和 `permalink`；需要时更新 `updated` 日期。继续走预览、检查、推送的流程。固定使用同一文件名，就不会每次导出都新增一篇重复文章。

## 图片和附件

飞书官方说明，“所有内容”的 Markdown 导出包含图片和附件链接，需打开链接下载原始文件。发布到本站时，将图片保存到例如 `source/images/svd/`，再把正文中的图片链接改成本站路径：

```markdown
![推导示意图](/images/svd/figure-1.png)
```

PDF 等附件放到 `source/downloads/svd/`：

```markdown
[下载手写原稿](/downloads/svd/handwritten-notes.pdf)
```

不要把飞书登录后的临时下载链接直接当作公开网站的长期图片地址。

## 公式

本站使用 KaTeX，支持 `$...$` 行内公式和 `$$...$$` 独立公式：

```markdown
矩阵分解为 $W = U\Sigma V^\top$。

$$
\operatorname{Cov}(X,Y)
= \mathbb E[(X-\mathbb EX)(Y-\mathbb EY)].
$$
```

首次迁入飞书笔记时，先选一篇包含行内公式、矩阵、多行对齐和插图的短文检查导出结果。本流程尚未用用户实际导出的数学笔记验证，不能保证所有飞书公式都自动转成正确的 LaTeX；如果导出成图片，只能作为图片展示，或核对原稿后另行转录。

手写扫描可以直接作为插图或 PDF 附件；转成可复制、可搜索的公式需要另行转录，并核对上下标、矩阵维度和公式编号。

## 官方导出说明

- [飞书：支持导出 Markdown](https://www.feishu.cn/content/article/7644456827538820052)
- [下载云文档和文件夹到本地](https://www.feishu.cn/hc/zh-CN/articles/360049067463)

官方文档确认桌面端和网页版支持导出 Markdown；没有该菜单时，先检查客户端版本以及文档下载权限。Markdown 导出不包含评论。
