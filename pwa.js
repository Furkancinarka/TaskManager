// pwa.js — Service worker registration, PWA install prompt
(function () {
  'use strict';

  var RK = window.RK;

  // Register service worker (PWA only)
  if (!RK.isNative && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }

  // Install prompt (browser only)
  var deferredPrompt = null;
  if (!RK.isNative) {
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferredPrompt = e;
      showInstallBanner();
    });
  }

  function showInstallBanner() {
    if (localStorage.getItem('recurkit_install_dismissed')) return;

    var banner = document.createElement('div');
    banner.className = 'install-banner show';
    banner.innerHTML =
      '<div class="install-banner-text">' +
        '<strong>' + t('install_title') + '</strong>' +
        '<span>' + t('install_text') + '</span>' +
      '</div>' +
      '<button class="install-btn" id="installBtn">' + t('install_btn') + '</button>' +
      '<button class="install-dismiss" id="installDismiss">\u2715</button>';

    document.body.insertBefore(banner, document.body.firstChild);

    document.getElementById('installBtn').addEventListener('click', function () {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function () {
          deferredPrompt = null;
          banner.remove();
        });
      }
    });

    document.getElementById('installDismiss').addEventListener('click', function () {
      banner.remove();
      localStorage.setItem('recurkit_install_dismissed', '1');
    });
  }

})();

