// script.js - initial scaffold; logic will be added in subsequent commits
document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('addBtn');
  const exportBtn = document.getElementById('exportBtn');
  const importFile = document.getElementById('importFile');
  const titleInput = document.getElementById('title');
  const urlInput = document.getElementById('url');
  const listEl = document.getElementById('bookmarksList');

  function loadBookmarks() {
    try {
      const raw = localStorage.getItem('bookmarks');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to load bookmarks', e);
      return [];
    }
  }

  function saveBookmarks(bookmarks) {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
  }

  function render() {
    const bookmarks = loadBookmarks();
    listEl.innerHTML = '';
    for (const bm of bookmarks) {
      const li = document.createElement('li');
      li.className = 'bookmark';
      li.dataset.id = bm.id;

      li.innerHTML = `
        <div class="meta">
          <a href="${bm.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(bm.title || bm.url)}</a>
          <div class="actions">
            <button class="edit">Edit</button>
            <button class="remove">Remove</button>
          </div>
        </div>
        <small>${escapeHtml(bm.url)}</small>
      `;

      li.querySelector('.remove').addEventListener('click', () => {
        removeBookmark(bm.id);
      });

      li.querySelector('.edit').addEventListener('click', () => {
        const newTitle = prompt('Edit title', bm.title) || bm.title;
        const newUrl = prompt('Edit URL', bm.url) || bm.url;
        editBookmark(bm.id, newTitle.trim(), newUrl.trim());
      });

      listEl.appendChild(li);
    }
  }

  function addBookmark(title, url) {
    const bookmarks = loadBookmarks();
    const bm = { id: generateId(), title: title || url, url };
    bookmarks.unshift(bm);
    saveBookmarks(bookmarks);
    render();
  }

  function editBookmark(id, title, url) {
    const bookmarks = loadBookmarks();
    const idx = bookmarks.findIndex(b => b.id === id);
    if (idx === -1) return;
    bookmarks[idx].title = title || url;
    bookmarks[idx].url = url;
    saveBookmarks(bookmarks);
    render();
  }

  function removeBookmark(id) {
    let bookmarks = loadBookmarks();
    bookmarks = bookmarks.filter(b => b.id !== id);
    saveBookmarks(bookmarks);
    render();
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"]+/g, (m)=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[m]));
  }

  addBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const url = urlInput.value.trim();
    if (!url) return alert('Please enter a URL');
    // simple url normalization
    const normalized = url.startsWith('http') ? url : `https://${url}`;
    addBookmark(title, normalized);
    titleInput.value = '';
    urlInput.value = '';
    urlInput.focus();
  });

  exportBtn.addEventListener('click', () => {
    const bookmarks = loadBookmarks();
    const blob = new Blob([JSON.stringify(bookmarks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'bookmarks.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  importFile.addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        if (Array.isArray(imported)) {
          const existing = loadBookmarks();
          // merge and dedupe by url (keep newer imported first)
          const merged = [...imported.map(it => ({ id: generateId(), title: it.title || it.url, url: it.url })), ...existing];
          const seen = new Set();
          const dedup = [];
          for (const item of merged) {
            if (!item || !item.url) continue;
            if (seen.has(item.url)) continue;
            seen.add(item.url);
            dedup.push(item);
          }
          saveBookmarks(dedup);
          render();
        } else {
          alert('Import file must be an array of bookmarks');
        }
      } catch (err) {
        alert('Failed to import file');
      }
    };
    reader.readAsText(f);
    importFile.value = '';
  });

  // initial render
  render();
});

