# 飞书 → 学术网站

Chrome / Edge Manifest V3 扩展。此目录可直接“加载已解压的扩展程序”。

完整配置说明：https://github.com/Minxing-Liu/Minxing-Liu.github.io/blob/main/docs/feishu-publisher.md

不读取飞书 Cookie，不在浏览器保存飞书 Secret，不注入页面脚本。只在点击扩展时读取当前标签的网址；GitHub Token 保存在本机扩展存储（并非加密保险箱），只发送到 api.github.com。授权的 GitHub Actions 使用仓库 Secrets 读取飞书原稿，生成公开文章和图片。同一文档重复发布会更新原文章。

请仅发布计划公开的内容；附件、画板、多维表格、同步块等复杂组件暂不支持。不会自动把手写图片转成公式。删除飞书原稿不会自动删除网站文章。
