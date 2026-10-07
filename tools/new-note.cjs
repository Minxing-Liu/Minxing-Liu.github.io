const fs = require('node:fs');
const path = require('node:path');
const slug = process.argv[2];
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('请给笔记起一个英文文件名，例如：npm run new:note -- svd'); process.exit(1);
}
const filename = path.join('source', '_posts', slug + '.md');
const date = new Intl.DateTimeFormat('sv-SE', {timeZone: 'Asia/Shanghai'}).format(new Date());
try {
  fs.writeFileSync(filename, `---\ntitle: ${slug}\ndate: ${date}\npermalink: notes/${slug}/\ncategories:\n  - 数学工具\ntags: []\nkatex: true\ncomments: false\n---\n\n## 问题\n\n## 设定与符号\n\n## 推导\n\n$$\n\\Sigma = \\mathbb E[(x-\\mu)(x-\\mu)^\\top]\n$$\n\n## 结论与适用条件\n\n## 参考资料\n`, {flag: 'wx'});
  console.log('已创建：' + filename);
} catch (e) {
  console.error(e.code === 'EEXIST' ? '同名笔记已经存在，没有覆盖。' : e.message); process.exit(1);
}
