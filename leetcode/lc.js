(function () {
  var KEY = 'lc-lang';
  function apply(lang) {
    document.querySelectorAll('.lang-tabs button[data-lang]').forEach(function (b) { b.classList.toggle('active', b.dataset.lang === lang); });
    document.querySelectorAll('.lang-code').forEach(function (p) { p.classList.toggle('active', p.dataset.lang === lang); });
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }
  document.querySelectorAll('.lang-tabs button[data-lang]').forEach(function (b) { b.addEventListener('click', function () { apply(b.dataset.lang); }); });
  document.querySelectorAll('.lang-tabs .copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var box = b.closest('.code-box'); var pre = box.querySelector('.lang-code.active code');
      if (navigator.clipboard && pre) { navigator.clipboard.writeText(pre.innerText).then(function () { b.textContent = 'Copied!'; setTimeout(function () { b.textContent = 'Copy'; }, 1200); }); }
    });
  });
  var saved = 'cpp'; try { saved = localStorage.getItem(KEY) || 'cpp'; } catch (e) {}
  apply(saved);
})();
