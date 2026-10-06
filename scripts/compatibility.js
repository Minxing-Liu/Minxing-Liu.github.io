'use strict';
const fs = require('node:fs');
const path = require('node:path');
const cheerio = require('cheerio');
const katex = require('katex');

// Convert the math delimiters preserved in recovered HTML; leave normal Markdown math to its renderer.
hexo.extend.filter.register('after_post_render', function(data) {
  if (!data.content || data.password) return data;
  const $ = cheerio.load(data.content, null, false);
  $('*').addBack().contents().filter(function() { return this.type === 'text'; }).each(function() {
    const text = this.data;
    if (!text || (!text.includes('\\(') && !text.includes('\\['))) return;
    if ($(this).parents('code, pre, script, style, math, .katex').length) return;
    const re = /\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g;
    let end = 0, result = '', match;
    const escape = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    while ((match = re.exec(text))) {
      result += escape(text.slice(end, match.index));
      result += katex.renderToString(match[1] === undefined ? match[2] : match[1], {
        displayMode: match[1] === undefined, throwOnError: true, strict: false
      });
      end = re.lastIndex;
    }
    if (end) $(this).replaceWith(result + escape(text.slice(end)));
  });
  data.content = $.html();
  return data;
}, 15);

// Keep old URLs and files without allowing the old snapshot to overwrite generated Butterfly pages.
hexo.extend.filter.register('after_generate', function() {
  const published = new Set(hexo.route.list());
  const register = (route, file) => {
    route = route.replaceAll(path.sep, '/');
    if (!published.has(route)) {
      hexo.route.set(route, () => fs.createReadStream(file));
      published.add(route);
    }
  };
  const walk = (root, fn, prefix = '') => {
    if (!fs.existsSync(root)) return;
    for (const entry of fs.readdirSync(root, {withFileTypes: true})) {
      const rel = prefix + entry.name;
      if (entry.isDirectory()) walk(path.join(root, entry.name), fn, rel + '/');
      else if (entry.isFile()) fn(rel, path.join(root, entry.name));
    }
  };
  const redirects = require(path.join(hexo.base_dir, 'data/redirects.json'));
  for (const [from, to] of Object.entries(redirects)) {
    const route = from.replace(/^\//, '').replace(/\/$/, '/index.html');
    if (published.has(route)) continue;
    const safe = to.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
    hexo.route.set(route, `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta http-equiv="refresh" content="0;url=${safe}"><link rel="canonical" href="${safe}"><title>笔记已迁移</title></head><body><a href="${safe}">打开笔记</a></body></html>`);
    published.add(route);
  }
  walk(path.join(hexo.base_dir, 'legacy-site'), register);
  const dist = path.join(path.dirname(require.resolve('katex/package.json')), 'dist');
  walk(dist, (relative, file) => {
    if (relative === 'katex.min.css' || relative.startsWith('fonts/')) register('vendor/katex/' + relative, file);
  });
  register('vendor/katex/copy-tex.min.js', path.join(dist, 'contrib/copy-tex.min.js'));
});
