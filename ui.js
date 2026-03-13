// ui.js — Rendering, bottom sheet, swipe delete, toast, confirm modal, form helpers, stats, menu
(function () {
  'use strict';

  var RK = window.RK;

  // ==================== Bottom Sheet ====================
  var sheetOpen = false;

  RK.openSheet = function () {
    if (sheetOpen) return;
    sheetOpen = true;
    document.getElementById('bottomSheet').classList.add('open');
    document.getElementById('sheetOverlay').classList.add('open');
    document.body.classList.add('sheet-open');
    RK.hapticLight();
    setTimeout(function () { document.getElementById('taskName').focus(); }, 350);
  };

  RK.closeSheet = function () {
    if (!sheetOpen) return;
    sheetOpen = false;
    document.getElementById('bottomSheet').classList.remove('open');
    document.getElementById('sheetOverlay').classList.remove('open');
    document.body.classList.remove('sheet-open');
    document.getElementById('taskName').blur();
  };

  RK.isSheetOpen = function () { return sheetOpen; };

  // ==================== Form Helpers ====================
  RK.populateDayOfMonth = function () {
    var sel = document.getElementById('dayOfMonth');
    for (var i = 1; i <= 31; i++) {
      var opt = document.createElement('option');
      opt.value = i;
      opt.textContent = RK.ordinal(i);
      sel.appendChild(opt);
    }
  };

  RK.setTodayDefault = function () {
    var today = new Date();
    document.getElementById('onceDate').value = RK.formatDate(today);
    document.getElementById('dayOfMonth').value = today.getDate();
    document.getElementById('dayOfWeek').value = today.getDay();
    document.getElementById('monthSelect').value = today.getMonth();
  };

  RK.updateFormFields = function () {
    var freq = document.getElementById('frequency').value;
    document.getElementById('dayOfWeekGroup').style.display = 'none';
    document.getElementById('dayOfMonthGroup').style.display = 'none';
    document.getElementById('monthGroup').style.display = 'none';
    document.getElementById('onceDateGroup').style.display = 'none';
    var cg = document.getElementById('customGroup');
    if (cg) cg.style.display = 'none';

    if (freq === 'once') document.getElementById('onceDateGroup').style.display = '';
    if (freq === 'weekly') document.getElementById('dayOfWeekGroup').style.display = '';
    if (freq === 'monthly') document.getElementById('dayOfMonthGroup').style.display = '';
    if (freq === 'yearly') {
      document.getElementById('monthGroup').style.display = '';
      document.getElementById('dayOfMonthGroup').style.display = '';
    }
    if (freq === 'custom' && cg) cg.style.display = '';
  };

  RK.updateTimeVisibility = function () {
    var wrap = document.getElementById('timeInputWrap');
    var cb = document.getElementById('fullDay');
    if (!wrap) return;
    if (cb && cb.checked) wrap.classList.add('hidden');
    else wrap.classList.remove('hidden');
  };

  // ==================== Toast ====================
  var toastTimeout;
  RK.showToast = function (msg) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);

    requestAnimationFrame(function () { toast.classList.add('show'); });

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 300);
    }, 2500);
  };

  // ==================== Confirm Modal ====================
  var confirmCallback = null;

  RK.showConfirm = function (message, onConfirm) {
    var overlay = document.getElementById('confirmOverlay');
    var msg = document.getElementById('confirmMsg');
    if (!overlay) { if (onConfirm) onConfirm(); return; }
    msg.textContent = message;
    confirmCallback = onConfirm;
    overlay.classList.add('open');
  };

  RK.closeConfirm = function () {
    document.getElementById('confirmOverlay').classList.remove('open');
    confirmCallback = null;
  };

  RK.initConfirmModal = function () {
    var yes = document.getElementById('confirmYes');
    var no = document.getElementById('confirmNo');
    var overlay = document.getElementById('confirmOverlay');

    if (yes) {
      yes.addEventListener('click', function () {
        var cb = confirmCallback;
        RK.closeConfirm();
        if (cb) cb();
      });
    }
    if (no) no.addEventListener('click', RK.closeConfirm);
    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) RK.closeConfirm();
      });
    }
  };

  // ==================== Render ====================
  RK.render = function () {
    var taskListEl = document.getElementById('taskList');
    var emptyStateEl = document.getElementById('emptyState');
    var filtered = RK.getFilteredTasks();
    var todayStr = RK.formatDate(new Date());

    filtered.sort(function (a, b) {
      var aComp = a.completedDates.includes(todayStr) ? 1 : 0;
      var bComp = b.completedDates.includes(todayStr) ? 1 : 0;
      if (aComp !== bComp) return aComp - bComp;
      if (a.nextDue < b.nextDue) return -1;
      if (a.nextDue > b.nextDue) return 1;
      return 0;
    });

    taskListEl.innerHTML = '';
    emptyStateEl.style.display = filtered.length === 0 ? '' : 'none';

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
      checkBtn.innerHTML = '\u2713';
      checkBtn.title = isDoneToday ? t('btn_undo') : t('btn_mark_done');
      checkBtn.setAttribute('aria-label', isDoneToday ? t('btn_undo_completion') : t('btn_mark_done'));
      checkBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (isDoneToday) RK.uncompleteTask(task.id);
        else RK.completeTask(task.id);
      });

      // Info
      var infoDiv = document.createElement('div');
      infoDiv.className = 'task-info';

      var nameDiv = document.createElement('div');
      nameDiv.className = 'task-name';
      nameDiv.textContent = task.name;

      var metaDiv = document.createElement('div');
      metaDiv.className = 'task-meta';

      var freqBadge = document.createElement('span');
      freqBadge.className = 'task-badge badge-' + task.frequency;
      freqBadge.textContent = RK.freqLabel(task);
      metaDiv.appendChild(freqBadge);

      if (!task.fullDay && task.taskTime) {
        var timeSpan = document.createElement('span');
        timeSpan.className = 'task-time';
        timeSpan.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ' + RK.formatTime12(task.taskTime);
        metaDiv.appendChild(timeSpan);
      }

      if (isOverdue) {
        var badge = document.createElement('span');
        badge.className = 'task-badge badge-overdue';
        badge.textContent = t('badge_overdue') + ' \u00b7 ' + RK.prettyDate(task.nextDue);
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
        nextSpan.textContent = t('badge_next') + RK.prettyDate(task.nextDue);
        metaDiv.appendChild(nextSpan);
      }

      infoDiv.appendChild(nameDiv);
      infoDiv.appendChild(metaDiv);

      // Delete button
      var delBtn = document.createElement('button');
      delBtn.className = 'task-delete';
      delBtn.innerHTML = '\u2715';
      delBtn.title = t('btn_delete_task');
      delBtn.setAttribute('aria-label', t('btn_delete_task'));
      delBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        RK.showConfirm(t('confirm_delete').replace('{name}', task.name), function () {
          RK.deleteTask(task.id);
        });
      });

      el.appendChild(checkBtn);
      el.appendChild(infoDiv);
      el.appendChild(delBtn);
      taskListEl.appendChild(el);
    });

    RK.updateStats();
  };

  // ==================== Stats ====================
  RK.updateStats = function () {
    var todayStr = RK.formatDate(new Date());
    var dueToday = 0, overdue = 0, doneToday = 0;

    RK.tasks.forEach(function (task) {
      var isDoneToday = task.completedDates.includes(todayStr);
      if (isDoneToday) doneToday++;
      if (task.nextDue === todayStr && !isDoneToday) dueToday++;
      if (task.nextDue < todayStr && !isDoneToday) overdue++;
    });

    ['statToday', 'mStatToday'].forEach(function (id) {
      var el = document.getElementById(id); if (el) el.textContent = dueToday;
    });
    ['statOverdue', 'mStatOverdue'].forEach(function (id) {
      var el = document.getElementById(id); if (el) el.textContent = overdue;
    });
    ['statDone', 'mStatDone'].forEach(function (id) {
      var el = document.getElementById(id); if (el) el.textContent = doneToday;
    });
    ['statTotal', 'mStatTotal'].forEach(function (id) {
      var el = document.getElementById(id); if (el) el.textContent = RK.tasks.length;
    });
  };

  // ==================== Swipe to Delete ====================
  RK.initSwipeDelete = function () {
    var taskListEl = document.getElementById('taskList');
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
          setTimeout(function () { RK.deleteTask(taskId); }, 300);
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
  };

  // ==================== Three-dot Menu ====================
  RK.initMenu = function () {
    var menuBtn = document.getElementById('menuBtn');
    var menuDropdown = document.getElementById('menuDropdown');
    var btnExport = document.getElementById('btnExport');
    var btnImport = document.getElementById('btnImport');
    var sidebarExport = document.getElementById('sidebarExport');
    var sidebarImport = document.getElementById('sidebarImport');
    var importFileInput = document.getElementById('importFileInput');

    if (menuBtn) {
      menuBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        menuDropdown.classList.toggle('open');
      });
    }
    if (menuDropdown) {
      menuDropdown.addEventListener('click', function (e) {
        if (e.target.closest('.menu-lang-row')) e.stopPropagation();
      });
    }
    document.addEventListener('click', function () {
      if (menuDropdown) menuDropdown.classList.remove('open');
    });

    function triggerExport() { RK.exportData(); }
    function triggerImport() {
      if (importFileInput) importFileInput.click();
      if (menuDropdown) menuDropdown.classList.remove('open');
    }

    if (btnExport) btnExport.addEventListener('click', triggerExport);
    if (sidebarExport) sidebarExport.addEventListener('click', triggerExport);
    if (btnImport) btnImport.addEventListener('click', triggerImport);
    if (sidebarImport) sidebarImport.addEventListener('click', triggerImport);

    if (importFileInput) {
      importFileInput.addEventListener('change', function (e) {
        var file = e.target.files[0];
        if (!file) return;
        RK.handleImportFile(file);
        importFileInput.value = '';
      });
    }
  };

})();

