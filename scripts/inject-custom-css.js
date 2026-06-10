hexo.extend.filter.register('after_render:html', function (html) {
  const stylesheet = '<link rel="stylesheet" href="/css/custom.css">';
  if (html.includes('/css/custom.css')) return html;
  return html.replace('</head>', `${stylesheet}\n</head>`);
});
