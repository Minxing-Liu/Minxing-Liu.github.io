# 飞书一键发布到学术网站

这是为本站编写的 Chrome / Edge 扩展，配套的发布程序已放在仓库里。无需自己租服务器，也无需发布时打开 VS Code。

日常操作：**写好飞书文档 → 等待飞书保存 → 点击浏览器插件 → 发布到网站**。同一篇原稿再次发布会更新原文章和固定网址，不会重复新建。

首次需要安装扩展，并连接飞书与 GitHub。下面按顺序完成一次即可。当前已通过模拟文档自动化测试及网站构建检查；你的飞书应用授权、真实图片下载和实际文档排版，仍需首次配置后验证。

## 1. 安装浏览器扩展

1. [下载插件 ZIP](https://minxing-liu.github.io/downloads/feishu-publisher.zip)，解压到一个长期保留的文件夹。
2. Chrome 地址栏打开 `chrome://extensions`；Edge 打开 `edge://extensions`。
3. 打开“开发者模式”，选择“加载已解压的扩展程序”。
4. 选择解压后的 **feishu-publisher** 文件夹，它里面应直接有 `manifest.json`。不要选择 ZIP 或它的外层目录。
5. 在浏览器扩展菜单中，将“飞书 → Minxing 的学术网站”固定到工具栏。

这是个人自用的源码扩展，尚未提交浏览器商店。加载后请保留该文件夹；以后更新代码后，在扩展管理页面点击重新加载。

## 2. 创建飞书应用，让它读你指定的文档

1. 打开 [飞书开发者后台](https://open.feishu.cn/app)，在文档所属的组织中创建一个**企业自建应用**，例如“学术笔记发布”。
2. 在“添加应用能力”中开启**机器人**，方便将应用添加为文档协作者。无需配置消息事件、回调地址、Webhook 或消息发送权限。
3. 在“权限管理”中，选择**应用身份**并申请以下只读 API 权限。

| 权限码 | 用途 |
|---|---|
| `docx:document:readonly` | 读取新版文档标题和内容块 |
| `drive:drive:readonly` | 下载文档中的图片素材 |
| `wiki:wiki:readonly` | 解析知识库 `/wiki/` 链接；只用 `/docx/` 可不申请 |

4. 到“版本管理与发布”创建并发布一个版本，确保权限审批通过、应用可用范围包含你和原稿所有者。企业限制自建应用时，需要该组织管理员处理；仅有浏览器登录并不等于应用有权读取原稿。
5. 在“凭证与基础信息”找到 **App ID** 和 **App Secret**，下一步分别填入 GitHub Secrets。**不要把 Secret 发到聊天、文章、仓库文件或插件设置里。**
6. 打开一篇准备发布的飞书文档：右上角 `… → 更多 → 添加文档应用`，搜索刚创建的应用，授予**可阅读**权限。应用还需具备下载该文档素材的权限。每篇新原稿首次发布前都需要授权；后续更新无需重复添加。

知识库文档同样可通过“添加文档应用”授权当前页面。不需要为了发一篇文章开放整个知识库。若搜索不到应用，先检查机器人能力、版本发布状态、可用范围是否包含文档所有者。个人账号或跨组织文档若无法添加此应用，先使用[手动导出流程](feishu-notes.md)，不要取消原稿访问控制。

## 3. 把飞书凭证保存在 GitHub

打开本站仓库的 [Actions Secrets 设置](https://github.com/Minxing-Liu/Minxing-Liu.github.io/settings/secrets/actions)，依次点击 **New repository secret**，添加：

| Name | Secret |
|---|---|
| `FEISHU_APP_ID` | 飞书应用的 App ID |
| `FEISHU_APP_SECRET` | 飞书应用的 App Secret |

这两项由 GitHub 后台发布程序读取，不会写进生成的网站。应用密钥更换时，更新这里即可。

## 4. 给浏览器插件配置 GitHub 授权

1. 打开 [GitHub Fine-grained personal access tokens](https://github.com/settings/personal-access-tokens/new)。
2. 名称可写“Feishu Publisher”；设置你方便维护的有效期。
3. Resource owner 选择 `Minxing-Liu`。Repository access 选择 **Only select repositories**，仅选 `Minxing-Liu.github.io`。
4. Repository permissions 中将 **Actions** 设为 **Read and write**。Metadata 的默认只读权限保留，不需要给这个 Token 配置 Contents 写权限。
5. 生成 Token 后，打开插件 → 设置，仓库保留 `Minxing-Liu/Minxing-Liu.github.io`，粘贴 Token，点击“检查连接并保存”。

Token 只存在当前浏览器的扩展本机存储中，不通过 Chrome Sync 同步；该存储并不是加密保险箱。它只发送到 GitHub API。换电脑或浏览器需要重新配置；过期后生成新 Token 替换。移除插件本机授权不会撤销 GitHub Token，如需撤销请在 GitHub 删除。

## 5. 第一次试发

先选一篇你愿意公开的短笔记，包含标题、段落、列表、一张图片和一个飞书公式组件。

1. 完成文档授权后，在 Chrome / Edge 打开该飞书文档，等待保存完成。
2. 点击插件，它会自动填入当前文档网址。也可从飞书桌面端复制链接，再粘贴到插件。
3. 展开“文章设置”，首次可填一个英文网址简称，例如 `svd-notes`。这篇文章就会发布在 `https://minxing-liu.github.io/notes/svd-notes/`。留空则自动生成固定简称。
4. 点击“发布到网站”。无需手动导出、处理图片、commit 或 push。
5. 等插件显示 **“已发布，网站更新完成”**，或打开“查看发布进度 / 错误日志”，确认 `import` 和 `deploy` 均成功。任务的 Summary 中有文章链接。
6. 检查线上图片、矩阵、上下标和多行公式。修改飞书原稿后再按一次发布，网址简称留空即可更新同一篇。

请求“已提交”只代表 GitHub 接受了任务。构建与发布需要一些时间，插件会继续显示进度；关掉弹窗不会取消已提交的任务，再打开可以继续查看。先等上一篇发布结束，再发布下一篇；GitHub 共用发布队列，连续排队的旧任务可能被新的等待任务替换。

## 能处理哪些内容

| 内容 | 当前处理方式 |
|---|---|
| 段落、标题、粗体、斜体、删除线、下划线、链接 | 转为文章；颜色与部分飞书样式不保留 |
| 有序/无序列表、嵌套列表、待办、引用、高亮块 | 转为 Markdown；待办保留勾选文字，高亮块转引用 |
| 代码块 | 保留代码；不映射飞书语言编号，默认纯文本显示 |
| 飞书公式组件 | 转成 LaTeX，先用 KaTeX 校验，再构建网站 |
| PNG / JPEG / GIF / WebP 图片 | 下载到网站，使用本地地址；单张上限 20 MB，每篇合计 80 MB |
| 普通表格 | 支持文字、链接、行内公式；无表头表格增加空表头 |
| 手写扫描 | 作为图片展示，不会自动识别和转录数学公式 |
| 附件/PDF、合并单元格、画板、多维表格、嵌入、同步块、@人员等 | 停止发布并提示；请改成支持的内容，或走手动流程 |

正文里直接键入的 `$...$` 会作为普通文字保留。请使用**飞书自带公式组件**输入数学表达式。KaTeX 语法不支持的命令会使本次导入失败；不会自动猜测或改写你的推导。

## 原稿和网站文件的关系

一篇飞书文档通过固定文档 ID 绑定一篇网站文章，映射保存在 `data/feishu-posts.json`，该文件只保存 ID 哈希和发布元信息。导入后的文件在 `source/_posts/`，图片在 `source/images/feishu/`。网站标题跟随飞书文档标题，首次发布时间保留，内容改变后更新修改时间。新文章会自动出现在首页、搜索、分类和笔记目录的“近期笔记”中。

已经绑定的飞书笔记，建议日常只在飞书改正文；已有手动维护的其他笔记仍可继续使用 VS Code。插件不允许用一个新原稿覆盖已有的同名文章。

插件检测到导入文章在仓库里被改过时会停止覆盖。解决方法：先备份本地修改并同步回飞书，再通过 GitHub 文件历史恢复该 `.md` 到上次插件生成的版本，然后重试。不要随意修改映射或哈希来跳过检查。

飞书删除原稿不会自动删除网站内容。需要下架时，在仓库删除对应文章、它的图片目录和映射记录后提交；历史 Git 版本仍可能保留内容。更换原稿为副本会产生新的文档 ID，会视为新文章。每次发布后，本地开始工作前先运行 `git pull --ff-only`。

点击发布即将正文与图片发布到**公开网站和公开 GitHub 仓库**。文档链接作为工作流输入传给 GitHub，可能在任务信息或日志中可见。插件不读取飞书 Cookie，也不扫描其他文档。不要用它发布私密草稿。

## 出错时看这里

| 提示/现象 | 处理 |
|---|---|
| 缺少 FEISHU_APP_ID / FEISHU_APP_SECRET | 按第 3 步添加 repository secrets |
| 飞书权限错误 / 403 | 检查权限审批、版本发布、机器人可用范围，以及原稿是否添加了应用 |
| 图片下载失败 | 检查云空间 API 和原稿素材下载权限；大图先压缩 |
| 读取期间文档发生修改 | 等待飞书保存，暂时停止编辑后重试 |
| 不支持某组件 / 公式不合法 | 修改原稿对应内容，再次发布；此次转换不会提交文章 |
| GitHub 401 / 403 / 404 | Token 是否过期、仓库是否正确、是否有本仓库 Actions 读写权限 |
| git push 被拒绝 | 有其他提交同时进入 main；等待完成后重新发布，不要强推 |
| 源码已提交但 deploy 失败 | 文章源码仍保留。到失败任务中重跑失败的 deploy，或运行正常的 Build and publish Butterfly 工作流 |
| 请求超时且始终找不到任务 | 先在 Actions 核对；确认未创建后，在插件设置中清除任务记录，再试 |
| 浏览器不能安装扩展 | 可在 [Publish Feishu note](https://github.com/Minxing-Liu/Minxing-Liu.github.io/actions/workflows/feishu-publish.yml) 页面点 Run workflow，选择 main 并粘贴链接 |

普通站点发布与飞书发布共用一个队列，构建检查通过后才提交导入的文章。图片失效、公式错误、转换失败不会推送半篇文章。GitHub 发布服务自身失败时可能出现“源码已提交、网站尚未更新”，以上表对应步骤恢复。

## 开发与校验

```sh
npm ci
npm run test:publisher
npm run build
npm run check
```

修改扩展后执行 `npm run package:publisher` 重新生成下载包（打包需要 Python 3；Windows 可直接执行 `py tools/package-publisher.py`）。普通用户只安装 ZIP，不需要 Python 或 Node。

程序使用飞书官方 `tenant_access_token`、Docx blocks、Wiki get_node、Drive media download 接口；GitHub `workflow_dispatch` 触发后台程序。没有付费 AI 服务、常驻服务器或自定义 OAuth 服务。

参考：[飞书官方 SDK 的文档数据结构](https://github.com/larksuite/oapi-sdk-go/blob/v3_main/service/docx/v1/model.go)、[飞书文档授权说明](https://www.feishu.cn/hc/zh-CN/articles/360044508113)、[飞书素材下载](https://open.feishu.cn/document/server-docs/docs/drive-v1/media/download)、[GitHub workflow_dispatch](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event)、[Chrome activeTab](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab)。
