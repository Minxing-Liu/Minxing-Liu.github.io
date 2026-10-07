(function () {
  function normalizePath(pathname) {
    var path = pathname || '/';
    path = path.replace(/\/index\.html$/, '/');
    if (path.length > 1 && !path.endsWith('/')) path += '/';
    return path;
  }

  function toChinese(path) {
    if (path === '/') return '/zh/';
    if (path.indexOf('/zh/') === 0) return path;
    if (path.indexOf('/notes/soft-matter-core-notes/') === 0) {
      return path.replace('/notes/soft-matter-core-notes/', '/zh/course-notes/soft-matter-core-notes/');
    }
    if (path === '/notes/advanced-statistical-mechanics/') {
      return '/zh/course-notes/advanced-statistical-mechanics/';
    }
    if (path === '/notes/thermal-statistical-physics/') {
      return '/zh/course-notes/thermal-statistical-physics/';
    }
    if (path === '/notes/soft-matter-core-notes/') {
      return '/zh/course-notes/soft-matter-core-notes/';
    }
    if (path === '/notes/') return '/zh/course-notes/';
    return '/zh/';
  }

  function toEnglish(path) {
    if (path === '/zh/') return '/';
    if (path.indexOf('/zh/course-notes/soft-matter-core-notes/') === 0) {
      return path.replace('/zh/course-notes/soft-matter-core-notes/', '/notes/soft-matter-core-notes/');
    }
    if (path === '/zh/course-notes/advanced-statistical-mechanics/') {
      return '/notes/advanced-statistical-mechanics/';
    }
    if (path === '/zh/course-notes/thermal-statistical-physics/') {
      return '/notes/thermal-statistical-physics/';
    }
    if (path === '/zh/course-notes/soft-matter-core-notes/') {
      return '/notes/soft-matter-core-notes/';
    }
    if (path === '/zh/course-notes/') return '/notes/';
    if (path.indexOf('/zh/') === 0) return '/';
    return path;
  }

  function buildLink(label, href, isActive) {
    var link = document.createElement('a');
    link.className = 'language-switch-link' + (isActive ? ' is-active' : '');
    link.href = href;
    link.textContent = label;
    link.setAttribute('aria-current', isActive ? 'page' : 'false');
    return link;
  }

  function addDesktopSwitcher(englishHref, chineseHref, currentLang) {
    var nav = document.getElementById('main-nav');
    if (!nav || nav.querySelector('.language-switch')) return;

    var switcher = document.createElement('span');
    switcher.className = 'language-switch';
    switcher.setAttribute('aria-label', 'Language');
    switcher.appendChild(buildLink('EN', englishHref, currentLang === 'en'));
    switcher.appendChild(buildLink('\u4e2d\u6587', chineseHref, currentLang === 'zh'));
    nav.appendChild(switcher);
  }

  function addMobileSwitcher(englishHref, chineseHref, currentLang) {
    var mobileNav = document.getElementById('mobile-nav');
    if (!mobileNav || mobileNav.querySelector('.language-mobile-switch')) return;

    var divider = document.createElement('span');
    divider.className = 'language-mobile-switch';
    divider.textContent = 'Language';
    mobileNav.appendChild(divider);

    var english = document.createElement('a');
    english.className = 'mobile-nav-link language-mobile-link' + (currentLang === 'en' ? ' is-active' : '');
    english.href = englishHref;
    english.textContent = 'English';
    mobileNav.appendChild(english);

    var chinese = document.createElement('a');
    chinese.className = 'mobile-nav-link language-mobile-link' + (currentLang === 'zh' ? ' is-active' : '');
    chinese.href = chineseHref;
    chinese.textContent = '\u4e2d\u6587';
    mobileNav.appendChild(chinese);
  }

  function initLanguageSwitcher() {
    var path = normalizePath(window.location.pathname);
    var currentLang = path.indexOf('/zh/') === 0 ? 'zh' : 'en';
    var englishHref = currentLang === 'zh' ? toEnglish(path) : path;
    var chineseHref = currentLang === 'en' ? toChinese(path) : path;

    addDesktopSwitcher(englishHref, chineseHref, currentLang);
    addMobileSwitcher(englishHref, chineseHref, currentLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
  } else {
    initLanguageSwitcher();
  }
})();
