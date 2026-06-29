(function () {
  const lockEl = document.getElementById('secure-note-lock');
  const contentEl = document.getElementById('secure-note-content');
  const formEl = document.getElementById('secure-note-form');
  const passwordEl = document.getElementById('secure-note-password');
  const rememberEl = document.getElementById('secure-note-remember');
  const errorEl = document.getElementById('secure-note-error');
  const payload = JSON.parse(document.getElementById('secure-note-payload').textContent);
  const storageKey = `secureNoteKey:${payload.id || 'default'}:v1`;

  document.body.classList.add('quant-page');

  const fromBase64 = (value) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

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
    const encrypted = new Uint8Array(fromBase64(payload.ciphertext).length + fromBase64(payload.tag).length);
    encrypted.set(fromBase64(payload.ciphertext));
    encrypted.set(fromBase64(payload.tag), fromBase64(payload.ciphertext).length);
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(payload.iv) }, key, encrypted);
    return new TextDecoder().decode(plaintext);
  }

  async function exportKey(key) {
    const raw = await crypto.subtle.exportKey('raw', key);
    return btoa(String.fromCharCode(...new Uint8Array(raw)));
  }

  async function importRememberedKey(rawKey) {
    return crypto.subtle.importKey('raw', fromBase64(rawKey), { name: 'AES-GCM' }, false, ['decrypt']);
  }

  function reveal(html) {
    contentEl.innerHTML = html;
    contentEl.hidden = false;
    lockEl.hidden = true;
  }

  function saveRememberedKey(rawKey) {
    localStorage.setItem(storageKey, JSON.stringify({
      rawKey,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
    }));
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
      reveal(await decryptWithKey(await importRememberedKey(parsed.rawKey)));
    } catch (_) {
      localStorage.removeItem(storageKey);
    }
  }

  formEl.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorEl.textContent = '';
    if (!passwordEl.value) return;

    try {
      const key = await deriveKey(passwordEl.value, fromBase64(payload.salt));
      const html = await decryptWithKey(key);
      if (rememberEl.checked) {
        saveRememberedKey(await exportKey(key));
      }
      reveal(html);
      passwordEl.value = '';
    } catch (_) {
      errorEl.textContent = 'Incorrect password.';
    }
  });

  tryRememberedKey();
})();
