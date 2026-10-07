# 外观配置

本版以 https://butterfly.js.org/ 的首页为参考，使用官方 Butterfly 5.7.0 的布局和组件，不覆盖主题模板。

## 平时改哪里

所有外观设置都在 `_config.butterfly.yml`：

| 想修改的内容 | 配置项 |
| --- | --- |
| 顶部导航及下拉链接 | `menu` |
| 浏览器标签页图标 | `favicon` |
| 侧栏及移动端头像 | `avatar.img` |
| 首页背景图 | `index_img` |
| 其他页面的默认背景 | `default_top_img` |
| 首页打字字幕 | `subtitle.sub`，每一行是轮播的一句话 |
| 打字速度、停顿、循环 | `subtitle.typed_option` |
| 文章默认封面 | `cover.default_cover` |
| 右侧卡片 | `aside` |
| 页脚导航 | `footer.nav` |

站名和作者仍在 `_config.yml`。新增文章时，可以在开头的配置区写 `cover: /images/你的图片.jpg`，替换该文章的默认封面。

目前 `favicon` 和 `avatar.img` 都使用用户提供的原始头像 `/images/minxing-avatar.jpg`。更换图标时建议同时换文件名和配置路径，避免浏览器继续使用旧图标缓存。

`index_top_img_height` 和 `index_site_info_top` 留空，沿用主题的全屏首屏和居中标题。副标题使用主题原生 Typed.js，循环播放本地配置的三句话；`source: false` 表示不依赖随机句子接口。

## 图片来源

首页图片与参考官网相同：
https://oss.012700.xyz/butterfly/2024/10/index.jpg

原图保存在 `source/images/butterfly-hero.jpg`，构建和首页加载不再依赖该图床。归档、标签、分类和默认文章封面沿用官网配置中的外部图片链接；如果以后替换，只需将自己的图片放到 `source/images/` 再改相应链接。

参考配置：https://github.com/jerryc127/butterfly.js.org/blob/main/_config.butterfly.yml

## 配套页面

留言板位于 `source/messageboard/index.md`，提供跳转 GitHub Issues 的留言入口，没有接入站内评论服务。英语入口位于 `source/en/index.md`，整理已经存在的英语笔记，不代表整站已有英文翻译。
