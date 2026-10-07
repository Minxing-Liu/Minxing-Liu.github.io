'use strict';
const cheerio = require('cheerio');

// Keep the curated directory and automatically include notes published from Feishu.
hexo.extend.filter.register('after_generate', async function() {
  const route = 'notes/index.html';
  const stream = hexo.route.get(route);
  if (!stream) return;
  const posts = hexo.locals.get('posts').filter(post => post.feishu_key).sort('date', -1).toArray();
  if (!posts.length) return;
  let document = '';
  for await (const chunk of stream) document += chunk.toString();
  const $ = cheerio.load(document);
  $('#feishu-published-notes').remove();
  const section = $('<section>').attr('id', 'feishu-published-notes');
  section.append($('<h2>').text('近期笔记'));
  const list = $('<ul>');
  for (const post of posts) {
    const href = '/' + post.path.replace(/^\/+/, '');
    list.append($('<li>').append($('<a>').attr('href', href).text(post.title)));
  }
  section.append(list);
  $('#article-container').prepend(section);
  hexo.route.set(route, $.html());
}, 25);
