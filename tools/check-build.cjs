const fs = require('node:fs');
const path = require('node:path');
const cheerio = require('cheerio');
const output = path.resolve('public');
const errors = [];
const required = ['index.html', 'notes/index.html', 'about/index.html', 'research/index.html', 'notes/covariance-correlation-pca/index.html', 'search.xml', 'css/index.css', 'vendor/katex/katex.min.css'];
for (const name of required) if (!fs.existsSync(path.join(output, name))) errors.push('缺少文件：' + name);
const visit = dir => fs.readdirSync(dir, {withFileTypes: true}).flatMap(e => e.isDirectory() ? visit(path.join(dir, e.name)) : [path.join(dir, e.name)]);
if (!errors.length) {
  const home = fs.readFileSync('public/index.html', 'utf8');
  if (!home.includes('Butterfly')) errors.push('首页没有 Butterfly 主题标识');
  const pca = fs.readFileSync('public/notes/covariance-correlation-pca/index.html', 'utf8');
  if ((pca.match(/class="katex"/g) || []).length < 50) errors.push('PCA 公式未充分渲染');
  if (pca.includes('katex-error')) errors.push('PCA 包含公式错误');
  for (const file of visit('source/_posts')) {
    const src = fs.readFileSync(file, 'utf8');
    const permalink = src.match(/^permalink:\s*(.+)$/m)?.[1];
    if (!permalink) continue;
    const route = permalink.replace(/^\//, '') + 'index.html';
    const target = path.join(output, route);
    if (!fs.existsSync(target)) {errors.push('缺少文章：' + route); continue;}
    const rendered = fs.readFileSync(target, 'utf8');
    const $ = cheerio.load(rendered);
    if ($('#article-container .katex-error').length) errors.push('公式错误：' + route);
    const content = $('#article-container').text();
    if (/\\\(|\\\[/.test(content)) errors.push('旧公式定界符未转换：' + route);
    $('#article-container a[href], #article-container img[src]').each(function() {
      const href = $(this).attr('href') || $(this).attr('src');
      if (!href || !href.startsWith('/') || href.startsWith('//')) return;
      let p = decodeURIComponent(href.split(/[?#]/)[0]);
      if (p.endsWith('/')) p += 'index.html';
      if (!fs.existsSync(path.join(output, p))) errors.push('文章链接缺失：' + route + ' → ' + href);
    });
  }
}
if (fs.existsSync('legacy-site')) {
  for (const f of visit('legacy-site')) {
    const rel = path.relative('legacy-site', f);
    if (!fs.existsSync(path.join(output, rel))) errors.push('旧路径丢失：' + rel);
    if (rel.startsWith('downloads/') || rel.startsWith('quant/')) {
      if (fs.existsSync(path.join(output, rel)) && !fs.readFileSync(f).equals(fs.readFileSync(path.join(output, rel)))) errors.push('原附件/加密页字节变化：' + rel);
    }
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('检查通过：Butterfly 首页、PCA 公式、文章链接、旧 URL 和受保护附件。');
