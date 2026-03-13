// ===== RecurKit — Dead Simple Recurring Task Manager =====

(function () {
  'use strict';

  // ---- Capacitor Native Detection ----
  var isNative = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  var CapPlugins = isNative && window.Capacitor.Plugins ? window.Capacitor.Plugins : {};
  var Haptics = CapPlugins.Haptics || null;
  var StatusBarPlugin = CapPlugins.StatusBar || null;
  var SplashPlugin = CapPlugins.SplashScreen || null;
  var LocalNotif = CapPlugins.LocalNotifications || null;

  // Native init — set status bar + hide splash
  if (isNative) {
    if (StatusBarPlugin) {
      StatusBarPlugin.setBackgroundColor({ color: '#4f46e5' }).catch(function () {});
      StatusBarPlugin.setStyle({ style: 'LIGHT' }).catch(function () {});
    }
    if (SplashPlugin) {
      SplashPlugin.hide().catch(function () {});
    }
  }

  // Haptic feedback helpers
  function hapticLight() {
    if (Haptics) { Haptics.impact({ style: 'LIGHT' }).catch(function () {}); }
    else if (navigator.vibrate) { navigator.vibrate(30); }
  }
  function hapticSuccess() {
    if (Haptics) { Haptics.notification({ type: 'SUCCESS' }).catch(function () {}); }
    else if (navigator.vibrate) { navigator.vibrate([30, 50, 30]); }
  }

  // ---- Register Service Worker (PWA only) ----
  if (!isNative && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }

  // ---- PWA Install Prompt (browser only) ----
  var deferredPrompt = null;
  if (!isNative) {
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
      '<button class="install-dismiss" id="installDismiss">✕</button>';

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

  // ---- Constants ----
  var STORAGE_KEY = 'recurkit_tasks';
  var ONBOARD_KEY = 'recurkit_onboarded';
  var BACKUP_KEY = 'recurkit_last_backup';
  var BATTERY_KEY = 'recurkit_battery_dismissed';
  var BACKUP_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days

  // ---- State ----
  var tasks = loadTasks();
  var currentFilter = 'today';

  // ---- DOM refs ----
  var form = document.getElementById('taskForm');
  var nameInput = document.getElementById('taskName');
  var freqSelect = document.getElementById('frequency');
  var dayOfWeekGroup = document.getElementById('dayOfWeekGroup');
  var dayOfMonthGroup = document.getElementById('dayOfMonthGroup');
  var monthGroup = document.getElementById('monthGroup');
  var onceDateGroup = document.getElementById('onceDateGroup');
  var dayOfWeekSelect = document.getElementById('dayOfWeek');
  var dayOfMonthSelect = document.getElementById('dayOfMonth');
  var monthSelect = document.getElementById('monthSelect');
  var onceDateInput = document.getElementById('onceDate');
  var taskTimeInput = document.getElementById('taskTime');
  var fullDayCheckbox = document.getElementById('fullDay');
  var timeGroup = document.getElementById('timeInputWrap');
  var customGroup = document.getElementById('customGroup');
  var customIntervalInput = document.getElementById('customInterval');
  var customUnitSelect = document.getElementById('customUnit');
  var taskListEl = document.getElementById('taskList');
  var emptyStateEl = document.getElementById('emptyState');
  var filterBtns = document.querySelectorAll('.filter-btn');
  var addTaskCard = document.getElementById('addTaskCard');
  var fab = document.getElementById('fabAdd');

  // Bottom sheet refs
  var bottomSheet = document.getElementById('bottomSheet');
  var sheetOverlay = document.getElementById('sheetOverlay');

  // Menu refs
  var menuBtn = document.getElementById('menuBtn');
  var menuDropdown = document.getElementById('menuDropdown');
  var btnExport = document.getElementById('btnExport');
  var btnImport = document.getElementById('btnImport');
  var sidebarExport = document.getElementById('sidebarExport');
  var sidebarImport = document.getElementById('sidebarImport');
  var importFileInput = document.getElementById('importFileInput');

  // Onboarding refs
  var onboardingEl = document.getElementById('onboarding');
  var onboardSamples = document.getElementById('onboardSamples');
  var onboardSkip = document.getElementById('onboardSkip');

  // Battery banner refs
  var batteryBanner = document.getElementById('batteryBanner');
  var batteryDismiss = document.getElementById('batteryDismiss');

  // Stats — desktop
  var statToday = document.getElementById('statToday');
  var statOverdue = document.getElementById('statOverdue');
  var statDone = document.getElementById('statDone');
  var statTotal = document.getElementById('statTotal');

  // Stats — mobile
  var mStatToday = document.getElementById('mStatToday');
  var mStatOverdue = document.getElementById('mStatOverdue');
  var mStatDone = document.getElementById('mStatDone');
  var mStatTotal = document.getElementById('mStatTotal');

  // ---- Init ----
  populateDayOfMonth();
  setTodayDefault();
  updateFormFields();
  updateTimeVisibility();
  render();

  // Expose render so i18n can call it on language change
  window.recurkitRender = render;

  // Check onboarding
  checkOnboarding();

  // Check backup reminder (after 2 sec so app loads first)
  setTimeout(checkBackupReminder, 2000);

  // ---- Events ----
  freqSelect.addEventListener('change', updateFormFields);

  // Full day toggle — show/hide time picker
  if (fullDayCheckbox) {
    fullDayCheckbox.addEventListener('change', updateTimeVisibility);
  }

  function updateTimeVisibility() {
    if (!timeGroup) return;
    if (fullDayCheckbox && fullDayCheckbox.checked) {
      timeGroup.classList.add('hidden');
    } else {
      timeGroup.classList.remove('hidden');
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    addTask();
  });

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render();
      hapticLight();
    });
  });

  // ---- Bottom Sheet Logic ----
  var sheetOpen = false;

  function openSheet() {
    if (sheetOpen) return;
    sheetOpen = true;
    bottomSheet.classList.add('open');
    sheetOverlay.classList.add('open');
    document.body.classList.add('sheet-open');
    hapticLight();
    // Focus input after animation
    setTimeout(function () {
      nameInput.focus();
    }, 350);
  }

  function closeSheet() {
    if (!sheetOpen) return;
    sheetOpen = false;
    bottomSheet.classList.remove('open');
    sheetOverlay.classList.remove('open');
    document.body.classList.remove('sheet-open');
    nameInput.blur();
  }

  // FAB toggles bottom sheet on mobile, scrolls on desktop
  if (fab) {
    fab.addEventListener('click', function () {
      if (window.innerWidth <= 600) {
        if (sheetOpen) {
          closeSheet();
        } else {
          openSheet();
        }
      } else {
        // Desktop: scroll to form
        if (addTaskCard) {
          addTaskCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(function () { nameInput.focus(); }, 400);
        }
      }
    });
  }

  // Close sheet when tapping overlay
  if (sheetOverlay) {
    sheetOverlay.addEventListener('click', closeSheet);
  }

  // Close sheet on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sheetOpen) {
      closeSheet();
    }
  });

  // Swipe-to-delete support for mobile
  (function initSwipeDelete() {
    var startX = 0;
    var currentItem = null;
    var threshold = 80;

    taskListEl.addEventListener('touchstart', function (e) {
      var item = e.target.closest('.task-item');
      if (!item) return;
      startX = e.touches[0].clientX;
      currentItem = item;
      currentItem.style.transition = 'none';
    }, { passive: true });

    taskListEl.addEventListener('touchmove', function (e) {
      if (!currentItem) return;
      var diffX = e.touches[0].clientX - startX;
      if (diffX < 0) {
        currentItem.style.transform = 'translateX(' + Math.max(diffX, -120) + 'px)';
        currentItem.style.opacity = Math.max(1 + diffX / 200, 0.5);
      }
    }, { passive: true });

    taskListEl.addEventListener('touchend', function () {
      if (!currentItem) return;
      var transform = currentItem.style.transform;
      var match = transform.match(/translateX\((-?\d+\.?\d*)px\)/);
      var offset = match ? parseFloat(match[1]) : 0;

      currentItem.style.transition = 'transform .3s, opacity .3s';

      if (offset < -threshold) {
        var taskId = currentItem.dataset.taskId;
        if (taskId) {
          currentItem.style.transform = 'translateX(-100%)';
          currentItem.style.opacity = '0';
          setTimeout(function () { deleteTask(taskId); }, 300);
        } else {
          currentItem.style.transform = '';
          currentItem.style.opacity = '';
        }
      } else {
        currentItem.style.transform = '';
        currentItem.style.opacity = '';
      }
      currentItem = null;
    }, { passive: true });
  })();

  // ---- Populate day-of-month dropdown ----
  function populateDayOfMonth() {
    for (var i = 1; i <= 31; i++) {
      var opt = document.createElement('option');
      opt.value = i;
      opt.textContent = ordinal(i);
      dayOfMonthSelect.appendChild(opt);
    }
  }

  function setTodayDefault() {
    var today = new Date();
    onceDateInput.value = formatDate(today);
    dayOfMonthSelect.value = today.getDate();
    dayOfWeekSelect.value = today.getDay();
    monthSelect.value = today.getMonth();
  }

  // ---- Show/hide form fields based on frequency ----
  function updateFormFields() {
    var freq = freqSelect.value;
    dayOfWeekGroup.style.display = 'none';
    dayOfMonthGroup.style.display = 'none';
    monthGroup.style.display = 'none';
    onceDateGroup.style.display = 'none';
    if (customGroup) customGroup.style.display = 'none';

    if (freq === 'once') onceDateGroup.style.display = '';
    if (freq === 'weekly') dayOfWeekGroup.style.display = '';
    if (freq === 'monthly') dayOfMonthGroup.style.display = '';
    if (freq === 'yearly') {
      monthGroup.style.display = '';
      dayOfMonthGroup.style.display = '';
    }
    if (freq === 'custom' && customGroup) customGroup.style.display = '';
  }

  // ---- Add task ----
  function addTask() {
    var name = nameInput.value.trim();
    if (!name) return;

    var freq = freqSelect.value;
    var isFullDay = fullDayCheckbox ? fullDayCheckbox.checked : true;
    var taskTime = (!isFullDay && taskTimeInput) ? taskTimeInput.value : null;

    var task = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name: name,
      frequency: freq,
      fullDay: isFullDay,
      taskTime: taskTime,
      createdAt: new Date().toISOString(),
      completedDates: []
    };

    if (freq === 'once') {
      task.onceDate = onceDateInput.value;
    } else if (freq === 'weekly') {
      task.dayOfWeek = parseInt(dayOfWeekSelect.value);
    } else if (freq === 'monthly') {
      task.dayOfMonth = parseInt(dayOfMonthSelect.value);
    } else if (freq === 'yearly') {
      task.month = parseInt(monthSelect.value);
      task.dayOfMonth = parseInt(dayOfMonthSelect.value);
    } else if (freq === 'custom') {
      task.customInterval = parseInt(customIntervalInput ? customIntervalInput.value : 2) || 2;
      task.customUnit = customUnitSelect ? customUnitSelect.value : 'days';
    }

    task.nextDue = calcNextDue(task);

    tasks.push(task);
    saveTasks();
    render();
    form.reset();
    setTodayDefault();
    updateFormFields();
    // Reset time and custom fields
    if (fullDayCheckbox) fullDayCheckbox.checked = true;
    if (taskTimeInput) taskTimeInput.value = '09:00';
    if (customIntervalInput) customIntervalInput.value = '2';
    if (customUnitSelect) customUnitSelect.value = 'days';
    updateTimeVisibility();
    showToast(t('toast_added'));
    hapticLight();

    // Close bottom sheet on mobile after adding
    closeSheet();

    // Schedule notification
    scheduleTaskNotification(task);
  }

  // ---- Calculate next due date ----
  function calcNextDue(task, afterDate) {
    var now = afterDate ? new Date(afterDate) : new Date();
    var today = stripTime(now);

    if (task.frequency === 'daily') {
      return formatDate(today);
    }

    if (task.frequency === 'weekly') {
      var d = new Date(today);
      var diff = (task.dayOfWeek - d.getDay() + 7) % 7;
      if (diff === 0 && afterDate) diff = 7;
      d.setDate(d.getDate() + diff);
      return formatDate(d);
    }

    if (task.frequency === 'monthly') {
      var d = new Date(today);
      d.setDate(task.dayOfMonth);
      if (d <= today || (afterDate && d.getTime() === today.getTime())) {
        d.setMonth(d.getMonth() + 1);
        d.setDate(task.dayOfMonth);
      }
      if (d.getDate() !== task.dayOfMonth) {
        d.setDate(0);
      }
      return formatDate(d);
    }

    if (task.frequency === 'yearly') {
      var d = new Date(today.getFullYear(), task.month, task.dayOfMonth);
      if (d <= today || (afterDate && d.getTime() === today.getTime())) {
        d = new Date(today.getFullYear() + 1, task.month, task.dayOfMonth);
      }
      return formatDate(d);
    }

    if (task.frequency === 'once') {
      return task.onceDate;
    }

    if (task.frequency === 'custom') {
      var interval = task.customInterval || 2;
      var unit = task.customUnit || 'days';
      var d = new Date(today);
      if (afterDate) {
        // After completing, advance from today
        if (unit === 'days') d.setDate(d.getDate() + interval);
        else if (unit === 'weeks') d.setDate(d.getDate() + interval * 7);
        else if (unit === 'months') d.setMonth(d.getMonth() + interval);
      }
      return formatDate(d);
    }

    return formatDate(today);
  }

  // ---- Complete a task ----
  function completeTask(id) {
    var task = tasks.find(function (tk) { return tk.id === id; });
    if (!task) return;

    var todayStr = formatDate(new Date());

    if (task.frequency === 'once') {
      if (!task.completedDates.includes(todayStr)) {
        task.completedDates.push(todayStr);
      }
      saveTasks();
      render();
      showToast(t('toast_done_once'));
      hapticSuccess();
      cancelTaskNotification(task);
      return;
    }

    if (!task.completedDates.includes(todayStr)) {
      task.completedDates.push(todayStr);
    }
    // Cap completedDates to last 60 entries to prevent localStorage bloat
    if (task.completedDates.length > 60) {
      task.completedDates = task.completedDates.slice(-60);
    }
    task.nextDue = calcNextDue(task, new Date());
    saveTasks();
    render();
    showToast(t('toast_done_next') + prettyDate(task.nextDue));
    hapticSuccess();

    // Reschedule notification for new due date
    scheduleTaskNotification(task);
  }

  // ---- Uncomplete (undo) ----
  function uncompleteTask(id) {
    var task = tasks.find(function (tk) { return tk.id === id; });
    if (!task) return;
    var todayStr = formatDate(new Date());
    task.completedDates = task.completedDates.filter(function (d) { return d !== todayStr; });

    if (task.frequency !== 'once') {
      var today = stripTime(new Date());
      var dueDateCheck = new Date(task.nextDue + 'T00:00:00');
      if (dueDateCheck > today) {
        task.nextDue = calcNextDue(task);
      }
    }
    saveTasks();
    render();
    showToast(t('toast_unmarked'));

    // Reschedule notification
    scheduleTaskNotification(task);
  }

  // ---- Delete task ----
  function deleteTask(id) {
    var task = tasks.find(function (tk) { return tk.id === id; });
    if (task) cancelTaskNotification(task);

    tasks = tasks.filter(function (tk) { return tk.id !== id; });
    saveTasks();
    render();
    showToast(t('toast_deleted'));
    hapticLight();
  }

  // ---- Filtering ----
  function getFilteredTasks() {
    var todayStr = formatDate(new Date());

    return tasks.filter(function (task) {
      var isDoneToday = task.completedDates.includes(todayStr);
      var isDueToday = task.nextDue === todayStr;
      var isOverdue = task.nextDue < todayStr && !isDoneToday;

      if (currentFilter === 'today') {
        return isDueToday || isDoneToday || isOverdue;
      }
      if (currentFilter === 'upcoming') {
        return task.nextDue > todayStr;
      }
      if (currentFilter === 'overdue') {
        return isOverdue;
      }
      return true;
    });
  }

  // ---- Render ----
  function render() {
    var filtered = getFilteredTasks();
    var todayStr = formatDate(new Date());

    filtered.sort(function (a, b) {
      var aComp = a.completedDates.includes(todayStr) ? 1 : 0;
      var bComp = b.completedDates.includes(todayStr) ? 1 : 0;
      if (aComp !== bComp) return aComp - bComp;
      if (a.nextDue < b.nextDue) return -1;
      if (a.nextDue > b.nextDue) return 1;
      return 0;
    });

    taskListEl.innerHTML = '';

    if (filtered.length === 0) {
      emptyStateEl.style.display = '';
    } else {
      emptyStateEl.style.display = 'none';
    }

    filtered.forEach(function (task) {
      var isDoneToday = task.completedDates.includes(todayStr);
      var isOverdue = task.nextDue < todayStr && !isDoneToday;
      var isDueToday = task.nextDue === todayStr;

      var el = document.createElement('div');
      el.className = 'task-item';
      el.dataset.taskId = task.id;
      if (isDoneToday) el.className += ' completed-today';
      else if (isOverdue) el.className += ' overdue';
      else if (isDueToday) el.className += ' due-today';

      // Check button
      var checkBtn = document.createElement('button');
      checkBtn.className = 'task-check';
      checkBtn.innerHTML = '✓';
      checkBtn.title = isDoneToday ? t('btn_undo') : t('btn_mark_done');
      checkBtn.setAttribute('aria-label', isDoneToday ? t('btn_undo_completion') : t('btn_mark_done'));
      checkBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (isDoneToday) uncompleteTask(task.id);
        else completeTask(task.id);
      });

      // Info section
      var infoDiv = document.createElement('div');
      infoDiv.className = 'task-info';

      var nameDiv = document.createElement('div');
      nameDiv.className = 'task-name';
      nameDiv.textContent = task.name;

      var metaDiv = document.createElement('div');
      metaDiv.className = 'task-meta';

      var freqBadge = document.createElement('span');
      freqBadge.className = 'task-badge badge-' + task.frequency;
      freqBadge.textContent = freqLabel(task);
      metaDiv.appendChild(freqBadge);

      // Show time if not full day
      if (!task.fullDay && task.taskTime) {
        var timeSpan = document.createElement('span');
        timeSpan.className = 'task-time';
        timeSpan.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ' + formatTime12(task.taskTime);
        metaDiv.appendChild(timeSpan);
      }

      if (isOverdue) {
        var badge = document.createElement('span');
        badge.className = 'task-badge badge-overdue';
        badge.textContent = t('badge_overdue') + ' · ' + prettyDate(task.nextDue);
        metaDiv.appendChild(badge);
      } else if (isDueToday && !isDoneToday) {
        var badge = document.createElement('span');
        badge.className = 'task-badge badge-today';
        badge.textContent = t('badge_due_today');
        metaDiv.appendChild(badge);
      } else if (isDoneToday) {
        var badge = document.createElement('span');
        badge.className = 'task-badge badge-done';
        badge.textContent = t('badge_done_today');
        metaDiv.appendChild(badge);
      } else {
        var nextSpan = document.createElement('span');
        nextSpan.textContent = t('badge_next') + prettyDate(task.nextDue);
        metaDiv.appendChild(nextSpan);
      }

      infoDiv.appendChild(nameDiv);
      infoDiv.appendChild(metaDiv);

      // Delete button
      var delBtn = document.createElement('button');
      delBtn.className = 'task-delete';
      delBtn.innerHTML = '✕';
      delBtn.title = t('btn_delete_task');
      delBtn.setAttribute('aria-label', t('btn_delete_task'));
      delBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        showConfirm(t('confirm_delete').replace('{name}', task.name), function () {
          deleteTask(task.id);
        });
      });

      el.appendChild(checkBtn);
      el.appendChild(infoDiv);
      el.appendChild(delBtn);
      taskListEl.appendChild(el);
    });

    updateStats();
  }

  // ---- Update stats ----
  function updateStats() {
    var todayStr = formatDate(new Date());
    var dueToday = 0, overdue = 0, doneToday = 0;

    tasks.forEach(function (task) {
      var isDoneToday = task.completedDates.includes(todayStr);
      if (isDoneToday) doneToday++;
      if (task.nextDue === todayStr && !isDoneToday) dueToday++;
      if (task.nextDue < todayStr && !isDoneToday) overdue++;
    });

    // Desktop stats
    if (statToday) statToday.textContent = dueToday;
    if (statOverdue) statOverdue.textContent = overdue;
    if (statDone) statDone.textContent = doneToday;
    if (statTotal) statTotal.textContent = tasks.length;

    // Mobile stats
    if (mStatToday) mStatToday.textContent = dueToday;
    if (mStatOverdue) mStatOverdue.textContent = overdue;
    if (mStatDone) mStatDone.textContent = doneToday;
    if (mStatTotal) mStatTotal.textContent = tasks.length;
  }

  // ---- Storage ----
  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) { /* silently fail */ }
  }

  function loadTasks() {
    try {
      var data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  // ---- Helpers ----
  function stripTime(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function formatDate(d) {
    var dd = d instanceof Date ? d : new Date(d);
    var y = dd.getFullYear();
    var m = String(dd.getMonth() + 1).padStart(2, '0');
    var day = String(dd.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function prettyDate(str) {
    if (!str) return '';
    var parts = str.split('-');
    var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    var todayStr = formatDate(new Date());
    if (str === todayStr) return t('date_today');

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (str === formatDate(tomorrow)) return t('date_tomorrow');

    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (str === formatDate(yesterday)) return t('date_yesterday');

    return t('mon_' + d.getMonth()) + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function ordinal(n) {
    var s = ['th','st','nd','rd'];
    var v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  // Format "HH:MM" 24h to 12h with AM/PM
  function formatTime12(timeStr) {
    if (!timeStr) return '';
    var parts = timeStr.split(':');
    var h = parseInt(parts[0]);
    var m = parts[1];
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return h + ':' + m + ' ' + ampm;
  }

  function freqLabel(task) {
    if (task.frequency === 'once') return t('flabel_once');
    if (task.frequency === 'daily') return t('flabel_daily');
    if (task.frequency === 'weekly') return t('flabel_weekly') + ' · ' + t('dayname_' + task.dayOfWeek);
    if (task.frequency === 'monthly') return t('flabel_monthly') + ' · ' + ordinal(task.dayOfMonth);
    if (task.frequency === 'yearly') return t('flabel_yearly') + ' · ' + t('mon_' + task.month) + ' ' + task.dayOfMonth;
    if (task.frequency === 'custom') {
      var n = task.customInterval || 2;
      var u = task.customUnit || 'days';
      return t('flabel_every') + ' ' + n + ' ' + t('custom_' + u);
    }
    return task.frequency;
  }

  // ---- Native back button handler (Android hardware back) ----
  if (isNative && CapPlugins.App) {
    CapPlugins.App.addListener('backButton', function (ev) {
      if (sheetOpen) {
        closeSheet();
      } else if (ev.canGoBack) {
        window.history.back();
      } else {
        CapPlugins.App.minimizeApp();
      }
    });
  }

  // ---- Toast notification ----
  var toastTimeout;
  function showToast(msg) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('show');
    });

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 300);
    }, 2500);
  }

  // ===== CUSTOM CONFIRM MODAL =====
  var confirmOverlay = document.getElementById('confirmOverlay');
  var confirmMsg = document.getElementById('confirmMsg');
  var confirmYes = document.getElementById('confirmYes');
  var confirmNo = document.getElementById('confirmNo');
  var confirmCallback = null;

  function showConfirm(message, onConfirm) {
    if (!confirmOverlay) { if (onConfirm) onConfirm(); return; }
    confirmMsg.textContent = message;
    confirmCallback = onConfirm;
    confirmOverlay.classList.add('open');
  }

  function closeConfirm() {
    confirmOverlay.classList.remove('open');
    confirmCallback = null;
  }

  if (confirmYes) {
    confirmYes.addEventListener('click', function () {
      var cb = confirmCallback;
      closeConfirm();
      if (cb) cb();
    });
  }
  if (confirmNo) {
    confirmNo.addEventListener('click', closeConfirm);
  }
  if (confirmOverlay) {
    confirmOverlay.addEventListener('click', function (e) {
      if (e.target === confirmOverlay) closeConfirm();
    });
  }

  // ===== THREE-DOT MENU =====
  if (menuBtn) {
    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      menuDropdown.classList.toggle('open');
    });
  }
  // Stop menu from closing when interacting with items inside (like lang select)
  if (menuDropdown) {
    menuDropdown.addEventListener('click', function (e) {
      // Only stop propagation for non-link items (let lang select work)
      if (e.target.closest('.menu-lang-row')) {
        e.stopPropagation();
      }
    });
  }
  // Close menu when clicking elsewhere
  document.addEventListener('click', function () {
    if (menuDropdown) menuDropdown.classList.remove('open');
  });

  // ===== EXPORT DATA =====
  function exportData() {
    var data = {
      version: 1,
      exported: new Date().toISOString(),
      tasks: tasks
    };
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'recurkit-backup-' + formatDate(new Date()) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Mark backup timestamp
    localStorage.setItem(BACKUP_KEY, Date.now().toString());
    showToast(t('toast_exported'));
    hapticSuccess();

    // Close menu
    if (menuDropdown) menuDropdown.classList.remove('open');
  }

  // Wire up all export buttons
  if (btnExport) btnExport.addEventListener('click', exportData);
  if (sidebarExport) sidebarExport.addEventListener('click', exportData);

  // ===== IMPORT DATA =====
  function importData() {
    if (importFileInput) importFileInput.click();
    if (menuDropdown) menuDropdown.classList.remove('open');
  }

  if (btnImport) btnImport.addEventListener('click', importData);
  if (sidebarImport) sidebarImport.addEventListener('click', importData);

  if (importFileInput) {
    importFileInput.addEventListener('change', function (e) {
      var file = e.target.files[0];
      if (!file) return;

      var reader = new FileReader();
      reader.onload = function (ev) {
        try {
          var data = JSON.parse(ev.target.result);
          var importedTasks = data.tasks || data;

          // Validate: must be array
          if (!Array.isArray(importedTasks)) {
            showToast(t('toast_import_fail'));
            return;
          }

          // Validate each task has required fields
          var valid = importedTasks.every(function (tk) {
            return tk.id && tk.name && tk.frequency && tk.nextDue;
          });
          if (!valid) {
            showToast(t('toast_import_fail'));
            return;
          }

          // Merge imported tasks
          var count = importedTasks.length;

          function doImport() {
            var existingIds = {};
            tasks.forEach(function (tk) { existingIds[tk.id] = true; });

            var added = 0;
            importedTasks.forEach(function (tk) {
              if (!existingIds[tk.id]) {
                if (!Array.isArray(tk.completedDates)) tk.completedDates = [];
                if (tk.fullDay === undefined) tk.fullDay = true;
                tasks.push(tk);
                added++;
              }
            });

            saveTasks();
            render();
            showToast(t('toast_imported').replace('{count}', added));
            hapticSuccess();

            if (isNative && LocalNotif) {
              setTimeout(scheduleAllNotifications, 500);
            }
          }

          if (tasks.length > 0) {
            showConfirm(t('import_confirm_merge').replace('{count}', count), doImport);
          } else {
            doImport();
          }
        } catch (err) {
          showToast(t('toast_import_fail'));
        }
      };
      reader.readAsText(file);

      // Reset file input so same file can be imported again
      importFileInput.value = '';
    });
  }

  // ===== ONBOARDING =====
  function checkOnboarding() {
    if (localStorage.getItem(ONBOARD_KEY)) return;
    if (tasks.length > 0) {
      // User already has tasks (maybe from before), skip onboarding
      localStorage.setItem(ONBOARD_KEY, '1');
      return;
    }
    // Show onboarding
    if (onboardingEl) onboardingEl.style.display = '';
  }

  function dismissOnboarding() {
    localStorage.setItem(ONBOARD_KEY, '1');
    if (onboardingEl) onboardingEl.style.display = 'none';
  }

  if (onboardSkip) {
    onboardSkip.addEventListener('click', dismissOnboarding);
  }

  if (onboardSamples) {
    onboardSamples.addEventListener('click', function () {
      addSampleTasks();
      dismissOnboarding();
    });
  }

  function addSampleTasks() {
    var samples = [
      { name: t('sample_invoice'), frequency: 'monthly', dayOfMonth: 1, fullDay: true, taskTime: null },
      { name: t('sample_inventory'), frequency: 'weekly', dayOfWeek: 4, fullDay: true, taskTime: null },
      { name: t('sample_domain'), frequency: 'yearly', month: 2, dayOfMonth: 15, fullDay: true, taskTime: null },
      { name: t('sample_report'), frequency: 'weekly', dayOfWeek: 5, fullDay: false, taskTime: '17:00' },
      { name: t('sample_backup'), frequency: 'daily', fullDay: false, taskTime: '22:00' }
    ];

    samples.forEach(function (s, idx) {
      var task = {
        id: (Date.now() + idx).toString(36) + Math.random().toString(36).slice(2, 7),
        name: s.name,
        frequency: s.frequency,
        fullDay: s.fullDay,
        taskTime: s.taskTime,
        createdAt: new Date().toISOString(),
        completedDates: []
      };
      if (s.dayOfWeek !== undefined) task.dayOfWeek = s.dayOfWeek;
      if (s.dayOfMonth !== undefined) task.dayOfMonth = s.dayOfMonth;
      if (s.month !== undefined) task.month = s.month;
      task.nextDue = calcNextDue(task);
      tasks.push(task);
    });

    saveTasks();
    render();
    showToast(t('toast_samples'));
    hapticSuccess();
  }

  // ===== BATTERY OPTIMIZATION BANNER =====
  function checkBatteryBanner() {
    if (!isNative) return;
    if (localStorage.getItem(BATTERY_KEY)) return;
    // Show after a short delay
    setTimeout(function () {
      if (batteryBanner) batteryBanner.style.display = '';
    }, 3000);
  }

  if (batteryDismiss) {
    batteryDismiss.addEventListener('click', function () {
      localStorage.setItem(BATTERY_KEY, '1');
      if (batteryBanner) batteryBanner.style.display = 'none';
    });
  }

  // ===== BACKUP REMINDER =====
  function checkBackupReminder() {
    // Only remind if user has 3+ tasks
    if (tasks.length < 3) return;

    var lastBackup = parseInt(localStorage.getItem(BACKUP_KEY) || '0');
    var now = Date.now();

    // Never backed up, or it's been > 7 days
    if (lastBackup === 0 || (now - lastBackup) > BACKUP_INTERVAL) {
      showBackupReminder();
    }
  }

  function showBackupReminder() {
    var existing = document.querySelector('.backup-reminder');
    if (existing) return; // Already showing

    var div = document.createElement('div');
    div.className = 'backup-reminder';
    div.innerHTML =
      '<div class="backup-reminder-text">' + t('backup_reminder_text') + '</div>' +
      '<div class="backup-reminder-btns">' +
        '<button class="backup-btn-export" id="backupExportBtn">' + t('backup_btn_export') + '</button>' +
        '<button class="backup-btn-later" id="backupLaterBtn">' + t('backup_btn_later') + '</button>' +
      '</div>';
    document.body.appendChild(div);

    document.getElementById('backupExportBtn').addEventListener('click', function () {
      exportData();
      div.remove();
    });
    document.getElementById('backupLaterBtn').addEventListener('click', function () {
      // Snooze for 3 days
      localStorage.setItem(BACKUP_KEY, (Date.now() - BACKUP_INTERVAL + 3 * 24 * 60 * 60 * 1000).toString());
      div.remove();
    });
  }

  // ===== LOCAL NOTIFICATIONS =====

  // Convert task id string to a positive integer for notification ID
  function taskIdToNotifId(id) {
    var hash = 0;
    for (var i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash) + id.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) || 1;
  }

  // Request notification permission (call once)
  var notifPermRequested = false;
  function ensureNotifPermission(cb) {
    if (!LocalNotif) { if (cb) cb(false); return; }

    if (notifPermRequested) { if (cb) cb(true); return; }

    LocalNotif.checkPermissions().then(function (result) {
      if (result.display === 'granted') {
        notifPermRequested = true;
        if (cb) cb(true);
      } else {
        LocalNotif.requestPermissions().then(function (req) {
          notifPermRequested = req.display === 'granted';
          if (cb) cb(notifPermRequested);
        }).catch(function () { if (cb) cb(false); });
      }
    }).catch(function () { if (cb) cb(false); });
  }

  // Schedule a notification for a task — 30 min before task time, or 8:00 AM if full day
  function scheduleTaskNotification(task) {
    if (!LocalNotif) return;

    ensureNotifPermission(function (granted) {
      if (!granted) return;

      var notifId = taskIdToNotifId(task.id);

      // Cancel notification for completed one-time tasks
      if (task.frequency === 'once' && task.completedDates.length > 0) {
        LocalNotif.cancel({ notifications: [{ id: notifId }] }).catch(function () {});
        return;
      }

      // Parse the next due date
      var parts = task.nextDue.split('-');
      var notifDate;

      if (!task.fullDay && task.taskTime) {
        var timeParts = task.taskTime.split(':');
        var taskHour = parseInt(timeParts[0]);
        var taskMin = parseInt(timeParts[1]);
        notifDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), taskHour, taskMin, 0);
        notifDate.setMinutes(notifDate.getMinutes() - 30);
      } else {
        notifDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 8, 0, 0);
      }

      // If time is in the past, leave existing notification alone (don't cancel it)
      if (notifDate.getTime() < Date.now()) return;

      // Cancel old then schedule new (only for future notifications)
      LocalNotif.cancel({ notifications: [{ id: notifId }] }).catch(function () {});

      var bodyText;
      if (!task.fullDay && task.taskTime) {
        bodyText = t('notif_body_time').replace('{name}', task.name).replace('{time}', formatTime12(task.taskTime));
      } else {
        bodyText = t('notif_body').replace('{name}', task.name);
      }

      LocalNotif.schedule({
        notifications: [{
          title: 'RecurKit',
          body: bodyText,
          id: notifId,
          schedule: { at: notifDate, allowWhileIdle: true },
          sound: 'default',
          smallIcon: 'ic_stat_notify',
          largeIcon: 'ic_launcher',
          channelId: 'recurkit_reminders'
        }]
      }).catch(function (err) {
        console.log('Notification schedule error:', err);
      });
    });
  }

  // Cancel notification for a task
  function cancelTaskNotification(task) {
    if (!LocalNotif) return;
    var notifId = taskIdToNotifId(task.id);
    LocalNotif.cancel({ notifications: [{ id: notifId }] }).catch(function () {});
  }

  // Create notification channel for Android (required for Android 8+)
  function createNotifChannel() {
    if (!LocalNotif) return;
    if (!LocalNotif.createChannel) return;

    LocalNotif.createChannel({
      id: 'recurkit_reminders',
      name: 'Task Reminders',
      description: 'Notifications for upcoming and due tasks',
      importance: 4, // HIGH
      visibility: 1, // PUBLIC
      sound: 'default',
      vibration: true,
      lights: true
    }).catch(function () {});
  }

  // Schedule notifications for all tasks — called on start & after import
  // Does NOT cancel existing notifications; scheduleTaskNotification handles that per-task
  function scheduleAllNotifications() {
    if (!LocalNotif) return;

    ensureNotifPermission(function (granted) {
      if (!granted) return;
      tasks.forEach(function (task) {
        scheduleTaskNotification(task);
      });
    });
  }

  // Handle notification click — open the app and show the task
  if (LocalNotif) {
    LocalNotif.addListener('localNotificationActionPerformed', function () {
      // Just bring the app to foreground — no special action needed
      // The task list will show the due tasks
    });
  }

  // Init notifications
  if (isNative && LocalNotif) {
    createNotifChannel();
    // Small delay to let the app fully load
    setTimeout(scheduleAllNotifications, 1500);
    // Show battery optimization banner (once)
    checkBatteryBanner();
  }

})();
