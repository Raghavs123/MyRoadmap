// LeetCode-style problem list: search, difficulty and topic filters, sorting, pagination, 'Pick One'. Rows are plain HTML, so the page also works without JavaScript.
(function () {
  var tbody = document.querySelector('#ps-body'); if (!tbody) return;
  var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr[data-num]'));
  var q = document.getElementById('ps-search'), dif = document.getElementById('ps-diff'), size = document.getElementById('ps-size');
  var pager = document.getElementById('ps-pages'), info = document.getElementById('ps-count'), empty = document.getElementById('ps-empty');
  var DORDER = { Easy: 1, Medium: 2, Hard: 3 }, state = { page: 1, tags: [], sort: 'num', dir: 1 };
  try { var s = JSON.parse(localStorage.getItem('lc-list') || '{}'); if (s.size) size.value = String(s.size); } catch (e) {}
  function matches(r) {
    var t = (q.value || '').trim().toLowerCase();
    if (t && (r.dataset.num + '. ' + r.dataset.title).toLowerCase().indexOf(t) < 0) return false;
    if (dif.value && r.dataset.diff !== dif.value) return false;
    var tags = r.dataset.tags.split('|');
    for (var i = 0; i < state.tags.length; i++) if (tags.indexOf(state.tags[i]) < 0) return false;
    return true;
  }
  function key(r) { return state.sort === 'num' ? +r.dataset.num : state.sort === 'title' ? r.dataset.title.toLowerCase() : state.sort === 'diff' ? DORDER[r.dataset.diff] * 10000 + (+r.dataset.num) : +r.dataset.tests; }
  function render() {
    var list = rows.filter(matches).sort(function (a, b) { var x = key(a), y = key(b); return (x > y ? 1 : x < y ? -1 : 0) * state.dir; });
    var per = +size.value, pages = Math.max(1, Math.ceil(list.length / per));
    if (state.page > pages) state.page = pages;
    rows.forEach(function (r) { r.hidden = true; });
    list.forEach(function (r) { tbody.appendChild(r); });
    list.slice((state.page - 1) * per, state.page * per).forEach(function (r) { r.hidden = false; });
    empty.hidden = list.length > 0;
    var from = list.length ? (state.page - 1) * per + 1 : 0, to = Math.min(state.page * per, list.length);
    info.textContent = 'Showing ' + from + '\u2013' + to + ' of ' + list.length + ' problem' + (list.length === 1 ? '' : 's') + (list.length < rows.length ? ' (filtered from ' + rows.length + ')' : '');
    pager.innerHTML = '';
    function btn(label, p, on, dis) { var b = document.createElement('button'); b.textContent = label; if (on) b.className = 'on'; b.disabled = !!dis; b.onclick = function () { state.page = p; render(); window.scrollTo({ top: document.querySelector('.ps-table-wrap').offsetTop - 80, behavior: 'smooth' }); }; pager.appendChild(b); }
    btn('\u2039', state.page - 1, false, state.page === 1);
    for (var p = 1; p <= pages; p++) btn(String(p), p, p === state.page, false);
    btn('\u203a', state.page + 1, false, state.page === pages);
    document.querySelectorAll('.ps-table th.sortable').forEach(function (th) { th.querySelector('.arw').textContent = th.dataset.sort === state.sort ? (state.dir > 0 ? ' \u25b2' : ' \u25bc') : ''; });
    try { localStorage.setItem('lc-list', JSON.stringify({ size: per })); } catch (e) {}
  }
  q.addEventListener('input', function () { state.page = 1; render(); });
  dif.addEventListener('change', function () { state.page = 1; render(); });
  size.addEventListener('change', function () { state.page = 1; render(); });
  document.querySelectorAll('.ps-tags button').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.dataset.tag, i = state.tags.indexOf(t);
      if (i < 0) state.tags.push(t); else state.tags.splice(i, 1);
      b.classList.toggle('on', i < 0); state.page = 1; render();
    });
  });
  document.querySelectorAll('.ps-table th.sortable').forEach(function (th) {
    th.addEventListener('click', function () { if (state.sort === th.dataset.sort) state.dir = -state.dir; else { state.sort = th.dataset.sort; state.dir = 1; } render(); });
  });
  document.getElementById('ps-reset').addEventListener('click', function () {
    q.value = ''; dif.value = ''; state.tags = []; state.sort = 'num'; state.dir = 1; state.page = 1;
    document.querySelectorAll('.ps-tags button').forEach(function (b) { b.classList.remove('on'); }); render();
  });
  document.getElementById('ps-pick').addEventListener('click', function () {
    var list = rows.filter(matches); if (!list.length) return;
    window.location.href = list[Math.floor(Math.random() * list.length)].querySelector('.title a').getAttribute('href');
  });
  render();
})();
