(function () {
  const storageKey = 'quantResearchKey:v1';
  const lockEl = document.getElementById('quant-lock');
  const contentEl = document.getElementById('quant-content');
  const formEl = document.getElementById('quant-form');
  const passwordEl = document.getElementById('quant-password');
  const rememberEl = document.getElementById('quant-remember');
  const errorEl = document.getElementById('quant-error');
  const payload = JSON.parse(document.getElementById('quant-payload').textContent);

  document.body.classList.add('quant-page');

  const fromBase64 = (value) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

  const escapeHtml = (value) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  function markdownToHtml(markdown) {
    const lines = markdown.trim().split(/\r?\n/);
    const html = [];
    let inList = false;

    const closeList = () => {
      if (inList) {
        html.push('</ul>');
        inList = false;
      }
    };

    for (const line of lines) {
      if (!line.trim()) {
        closeList();
        continue;
      }
      if (line.startsWith('## ')) {
        closeList();
        html.push(`<h2>${escapeHtml(line.slice(3))}</h2>`);
      } else if (line.startsWith('# ')) {
        closeList();
        html.push(`<h1>${escapeHtml(line.slice(2))}</h1>`);
      } else if (line.startsWith('- ')) {
        if (!inList) {
          html.push('<ul>');
          inList = true;
        }
        html.push(`<li>${escapeHtml(line.slice(2))}</li>`);
      } else {
        closeList();
        html.push(`<p>${escapeHtml(line)}</p>`);
      }
    }
    closeList();
    return html.join('\n');
  }

  async function deriveKey(password, salt) {
    const passwordBytes = new TextEncoder().encode(password);
    const baseKey = await crypto.subtle.importKey('raw', passwordBytes, 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: payload.iterations, hash: 'SHA-256' },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      true,
      ['decrypt']
    );
  }

  async function decryptWithKey(key) {
    const iv = fromBase64(payload.iv);
    const ciphertext = fromBase64(payload.ciphertext);
    const tag = fromBase64(payload.tag);
    const encrypted = new Uint8Array(ciphertext.length + tag.length);
    encrypted.set(ciphertext);
    encrypted.set(tag, ciphertext.length);
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted);
    return new TextDecoder().decode(plaintext);
  }

  async function exportKey(key) {
    const raw = await crypto.subtle.exportKey('raw', key);
    return btoa(String.fromCharCode(...new Uint8Array(raw)));
  }

  async function importRememberedKey(rawKey) {
    const bytes = fromBase64(rawKey);
    return crypto.subtle.importKey('raw', bytes, { name: 'AES-GCM' }, false, ['decrypt']);
  }

  function reveal(markdown) {
    contentEl.innerHTML = markdownToHtml(markdown);
    contentEl.hidden = false;
    lockEl.hidden = true;
  }

  function saveRememberedKey(rawKey) {
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    localStorage.setItem(storageKey, JSON.stringify({ rawKey, expiresAt }));
  }

  async function tryRememberedKey() {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (!parsed.expiresAt || parsed.expiresAt < Date.now()) {
        localStorage.removeItem(storageKey);
        return;
      }
      const key = await importRememberedKey(parsed.rawKey);
      reveal(await decryptWithKey(key));
    } catch (_) {
      localStorage.removeItem(storageKey);
    }
  }

  formEl.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorEl.textContent = '';
    const password = passwordEl.value;
    if (!password) return;

    try {
      const key = await deriveKey(password, fromBase64(payload.salt));
      const plaintext = await decryptWithKey(key);
      if (rememberEl.checked) {
        saveRememberedKey(await exportKey(key));
      }
      reveal(plaintext);
      passwordEl.value = '';
    } catch (_) {
      errorEl.textContent = 'Incorrect password.';
    }
  });

  tryRememberedKey();
})();
