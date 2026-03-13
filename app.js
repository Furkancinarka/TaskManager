// app.js — RecurKit init: native setup, event wiring, boot sequence
(function () {
  'use strict';

  var RK = window.RK;

  // ---- Native init (status bar + splash) ----
  if (RK.isNative) {
    if (RK.StatusBarPlugin) {
      RK.StatusBarPlugin.setBackgroundColor({ color: '#4f46e5' }).catch(function () {});
      RK.StatusBarPlugin.setStyle({ style: 'LIGHT' }).catch(function () {});
    }
    if (RK.SplashPlugin) {
      RK.SplashPlugin.hide().catch(function () {});
    }
  }

  // ---- Load tasks into shared state ----
  RK.tasks = RK.loadTasks();

  // ---- Init form + render ----
  RK.populateDayOfMonth();
  RK.setTodayDefault();
  RK.updateFormFields();
  RK.updateTimeVisibility();
  RK.render();

  // Expose render for i18n language change callback
  window.recurkitRender = RK.render;

  // ---- Wire events ----

  // Theme selector
  var themeSelect = document.getElementById('themeSelect');
  if (themeSelect) {
    themeSelect.value = RK.getTheme();
    themeSelect.addEventListener('change', function () {
      RK.setTheme(this.value);
    });
    // Listen for system preference changes (for auto mode)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (RK.getTheme() === 'auto') RK.applyTheme('auto');
    });
  }

  // Search input
  var searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      RK.searchQuery = this.value.trim();
      RK.render();
    });
  }

  // Frequency selector
  document.getElementById('frequency').addEventListener('change', RK.updateFormFields);

  // Full day toggle
  var fullDayCheckbox = document.getElementById('fullDay');
  if (fullDayCheckbox) {
    fullDayCheckbox.addEventListener('change', RK.updateTimeVisibility);
  }

  // Form submit
  document.getElementById('taskForm').addEventListener('submit', function (e) {
    e.preventDefault();
    RK.addTask();
  });

  // Filter buttons
  var filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      RK.currentFilter = btn.dataset.filter;
      RK.render();
      RK.hapticLight();
    });
  });

  // FAB button
  var fab = document.getElementById('fabAdd');
  var addTaskCard = document.getElementById('addTaskCard');
  if (fab) {
    fab.addEventListener('click', function () {
      if (window.innerWidth <= 600) {
        if (RK.isSheetOpen()) RK.closeSheet();
        else RK.openSheet();
      } else {
        if (addTaskCard) {
          addTaskCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(function () { document.getElementById('taskName').focus(); }, 400);
        }
      }
    });
  }

  // Sheet overlay
  var sheetOverlay = document.getElementById('sheetOverlay');
  if (sheetOverlay) {
    sheetOverlay.addEventListener('click', RK.closeSheet);
  }

  // Escape to close sheet
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && RK.isSheetOpen()) RK.closeSheet();
  });

  // ---- Init modules ----
  RK.initSwipeDelete();
  RK.initConfirmModal();
  RK.initMenu();
  RK.initOnboarding();
  RK.initBatteryBanner();

  // ---- Onboarding + backup ----
  RK.checkOnboarding();
  setTimeout(RK.checkBackupReminder, 2000);

  // ---- Notifications ----
  RK.initNotifications();
  if (RK.isNative) RK.checkBatteryBanner();

  // ---- Android hardware back button ----
  if (RK.isNative && RK.CapPlugins.App) {
    RK.CapPlugins.App.addListener('backButton', function (ev) {
      if (RK.isSheetOpen()) {
        RK.closeSheet();
      } else if (ev.canGoBack) {
        window.history.back();
      } else {
        RK.CapPlugins.App.minimizeApp();
      }
    });
  }

})();
