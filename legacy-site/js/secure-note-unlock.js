(function () {
  const lockEl = document.getElementById('secure-note-lock');
  const contentEl = document.getElementById('secure-note-content');
  const formEl = document.getElementById('secure-note-form');
  const passwordEl = document.getElementById('secure-note-password');
  const rememberEl = document.getElementById('secure-note-remember');
  const errorEl = document.getElementById('secure-note-error');
  const payload = JSON.parse(document.getElementById('secure-note-payload').textContent);
  const storageKey = `secureNoteKey:${payload.id || 'default'}:v1`;
  let sessionPassword = '';

  document.body.classList.add('quant-page');

  const fromBase64 = (value) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

  async function deriveKey(password, salt, extractable = true) {
    const passwordBytes = new TextEncoder().encode(password);
    const baseKey = await crypto.subtle.importKey('raw', passwordBytes, 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: payload.iterations, hash: 'SHA-256' },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      extractable,
      ['decrypt']
    );
  }

  async function deriveAttachmentKey(password, salt, iterations) {
    const passwordBytes = new TextEncoder().encode(password);
    const baseKey = await crypto.subtle.importKey('raw', passwordBytes, 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
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
    bindSecureDownloads();
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

  function setDownloadStatus(button, message, isError) {
    let status = button.nextElementSibling;
    if (!status || !status.classList || !status.classList.contains('secure-download-status')) {
      status = button.parentElement.querySelector('.secure-download-status');
    }
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', Boolean(isError));
  }

  async function decryptAttachment(url, password) {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error('Attachment not found.');
    const data = await response.json();
    const key = await deriveAttachmentKey(password, fromBase64(data.salt), Number(data.iterations || payload.iterations));
    const encrypted = new Uint8Array(fromBase64(data.ciphertext).length + fromBase64(data.tag).length);
    encrypted.set(fromBase64(data.ciphertext));
    encrypted.set(fromBase64(data.tag), fromBase64(data.ciphertext).length);
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(data.iv) }, key, encrypted);
    return {
      filename: data.filename || 'attachment.bin',
      mime: data.mime || 'application/octet-stream',
      bytes: plaintext
    };
  }

  function saveBlob(file) {
    const blob = new Blob([file.bytes], { type: file.mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function bindSecureDownloads() {
    contentEl.querySelectorAll('[data-secure-download]').forEach((button) => {
      if (button.dataset.bound === 'true') return;
      button.dataset.bound = 'true';
      button.addEventListener('click', async () => {
        const attachmentPassword = sessionPassword || window.prompt('Password for encrypted attachment:');
        if (!attachmentPassword) return;
        button.disabled = true;
        setDownloadStatus(button, 'Decrypting...', false);
        try {
          saveBlob(await decryptAttachment(button.dataset.secureDownload, attachmentPassword));
          setDownloadStatus(button, 'Downloaded.', false);
        } catch (_) {
          setDownloadStatus(button, 'Could not decrypt. Check the password.', true);
        } finally {
          button.disabled = false;
        }
      });
    });
  }

  formEl.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorEl.textContent = '';
    if (!passwordEl.value) return;

    try {
      const password = passwordEl.value;
      const key = await deriveKey(password, fromBase64(payload.salt));
      const html = await decryptWithKey(key);
      if (rememberEl.checked) {
        saveRememberedKey(await exportKey(key));
      }
      sessionPassword = password;
      reveal(html);
      passwordEl.value = '';
    } catch (_) {
      errorEl.textContent = 'Incorrect password.';
    }
  });

  tryRememberedKey();
})();
