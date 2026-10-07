# 迁移清单

主题：官方 Butterfly 5.7.0，通过 npm 锁定版本，不修改主题源文件。

## 内容来源

1. 本地 myblog.zip 中的 PCA Markdown。
2. GitHub 源码分支 codex/add-sm-preprocessing-content，提交 2eb0755c0ab1a1d93bfae3937f16bae9ce711c32。
3. 线上 master 快照 241b8070e983cc2d68912cad70fe8c32ea93d914。

16 篇主要笔记进入 source/_posts；正文原先只有 HTML 的笔记以 Markdown 内嵌 HTML 保留。英文课程页使用 Butterfly page 模板恢复。原始 master 的全部文件保存在 legacy-site，构建时仅补充新站未生成的 URL，因此旧附件、加密资料和尚未转换的页面仍可访问。legacy-site 不用于日常编辑。

PCA 原 Markdown 的数学表达式由 markdown-it + KaTeX 生成。旧 HTML 中的数学定界符由 after_post_render 转换，避免旧公式丢失。仅修复 HTML 小于号转义，不更改数学推导。

quant-intern-strategy 和 chapter-4-information-theory 上传文件正文为空，未发布空页面；旧加密量化页面与密文附件按原字节保留，不解密。

旧个人文章中部分经历待用户核实：它们仍可经旧 URL 访问，但未放到新首页列表。About 使用已确认的简短经历。

## 发布边界

2026-10-07，PR #2 已合并至 main，正式站点 https://minxing-liu.github.io/ 已切换为 Butterfly。GitHub Actions 运行 37561582300 的 build 与 deploy 均成功，正式首页及背景图片已核验。

今后在 main 维护源码；每次 push 会触发构建和 GitHub Pages 发布。master 旧版快照保持不变，可作为回退起点。操作步骤见仓库 README。
