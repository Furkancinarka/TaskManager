// tasks.js — Task CRUD, calcNextDue, filtering, sample tasks
(function () {
  'use strict';

  var RK = window.RK;

  // ---- Calculate next due date ----
  RK.calcNextDue = function (task, afterDate) {
    var now = afterDate ? new Date(afterDate) : new Date();
    var today = RK.stripTime(now);

    if (task.frequency === 'daily') {
      return RK.formatDate(today);
    }

    if (task.frequency === 'weekly') {
      var d = new Date(today);
      var diff = (task.dayOfWeek - d.getDay() + 7) % 7;
      if (diff === 0 && afterDate) diff = 7;
      d.setDate(d.getDate() + diff);
      return RK.formatDate(d);
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
      return RK.formatDate(d);
    }

    if (task.frequency === 'yearly') {
      var d = new Date(today.getFullYear(), task.month, task.dayOfMonth);
      if (d <= today || (afterDate && d.getTime() === today.getTime())) {
        d = new Date(today.getFullYear() + 1, task.month, task.dayOfMonth);
      }
      return RK.formatDate(d);
    }

    if (task.frequency === 'once') {
      return task.onceDate;
    }

    if (task.frequency === 'custom') {
      var interval = task.customInterval || 2;
      var unit = task.customUnit || 'days';
      var d = new Date(today);
      if (afterDate) {
        if (unit === 'days') d.setDate(d.getDate() + interval);
        else if (unit === 'weeks') d.setDate(d.getDate() + interval * 7);
        else if (unit === 'months') d.setMonth(d.getMonth() + interval);
      }
      return RK.formatDate(d);
    }

    return RK.formatDate(today);
  };

  // ---- Add task ----
  RK.addTask = function () {
    var nameInput = document.getElementById('taskName');
    var freqSelect = document.getElementById('frequency');
    var fullDayCheckbox = document.getElementById('fullDay');
    var taskTimeInput = document.getElementById('taskTime');
    var onceDateInput = document.getElementById('onceDate');
    var dayOfWeekSelect = document.getElementById('dayOfWeek');
    var dayOfMonthSelect = document.getElementById('dayOfMonth');
    var monthSelect = document.getElementById('monthSelect');
    var customIntervalInput = document.getElementById('customInterval');
    var customUnitSelect = document.getElementById('customUnit');
    var form = document.getElementById('taskForm');

    var name = nameInput.value.trim();
    if (!name) return;

    var freq = freqSelect.value;
    var isFullDay = fullDayCheckbox ? fullDayCheckbox.checked : true;
    var taskTime = (!isFullDay && taskTimeInput) ? taskTimeInput.value : null;
    var notifyBeforeSelect = document.getElementById('notifyBefore');
    var notifyBefore = notifyBeforeSelect ? parseInt(notifyBeforeSelect.value) : 30;

    var task = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name: name,
      frequency: freq,
      fullDay: isFullDay,
      taskTime: taskTime,
      notifyBefore: notifyBefore,
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

    task.nextDue = RK.calcNextDue(task);

    RK.tasks.push(task);
    RK.saveTasks();
    RK.render();
    form.reset();
    RK.setTodayDefault();
    RK.updateFormFields();

    if (fullDayCheckbox) fullDayCheckbox.checked = true;
    if (taskTimeInput) taskTimeInput.value = '09:00';
    if (customIntervalInput) customIntervalInput.value = '2';
    if (customUnitSelect) customUnitSelect.value = 'days';
    RK.updateTimeVisibility();

    RK.showToast(t('toast_added'));
    RK.hapticLight();
    RK.closeSheet();
    RK.scheduleTaskNotification(task);
  };

  // ---- Complete a task ----
  RK.completeTask = function (id) {
    var task = RK.tasks.find(function (tk) { return tk.id === id; });
    if (!task) return;

    var todayStr = RK.formatDate(new Date());

    if (task.frequency === 'once') {
      if (!task.completedDates.includes(todayStr)) {
        task.completedDates.push(todayStr);
      }
      if (task.completedDates.length > 60) {
        task.completedDates = task.completedDates.slice(-60);
      }
      RK.saveTasks();
      RK.render();
      RK.showToast(t('toast_done_once'));
      RK.hapticSuccess();
      RK.cancelTaskNotification(task);
      return;
    }

    if (!task.completedDates.includes(todayStr)) {
      task.completedDates.push(todayStr);
    }
    // Cap completedDates to last 60 entries to prevent localStorage bloat
    if (task.completedDates.length > 60) {
      task.completedDates = task.completedDates.slice(-60);
    }
    task.nextDue = RK.calcNextDue(task, new Date());
    RK.saveTasks();
    RK.render();
    RK.showToast(t('toast_done_next') + RK.prettyDate(task.nextDue));
    RK.hapticSuccess();
    RK.scheduleTaskNotification(task);
  };

  // ---- Uncomplete (undo) ----
  RK.uncompleteTask = function (id) {
    var task = RK.tasks.find(function (tk) { return tk.id === id; });
    if (!task) return;
    var todayStr = RK.formatDate(new Date());
    task.completedDates = task.completedDates.filter(function (d) { return d !== todayStr; });

    if (task.frequency !== 'once') {
      var today = RK.stripTime(new Date());
      var dueDateCheck = new Date(task.nextDue + 'T00:00:00');
      if (dueDateCheck > today) {
        task.nextDue = RK.calcNextDue(task);
      }
    }
    RK.saveTasks();
    RK.render();
    RK.showToast(t('toast_unmarked'));
    RK.scheduleTaskNotification(task);
  };

  // ---- Delete task ----
  RK.deleteTask = function (id) {
    var task = RK.tasks.find(function (tk) { return tk.id === id; });
    if (task) RK.cancelTaskNotification(task);

    RK.tasks = RK.tasks.filter(function (tk) { return tk.id !== id; });
    RK.saveTasks();
    RK.render();
    RK.showToast(t('toast_deleted'));
    RK.hapticLight();
  };

  // ---- Filtering ----
  RK.getFilteredTasks = function () {
    var todayStr = RK.formatDate(new Date());

    return RK.tasks.filter(function (task) {
      var isDoneToday = task.completedDates.includes(todayStr);
      var isDueToday = task.nextDue === todayStr;
      var isOverdue = task.nextDue < todayStr && !isDoneToday;

      if (RK.currentFilter === 'today') {
        return isDueToday || isDoneToday || isOverdue;
      }
      if (RK.currentFilter === 'upcoming') {
        return task.nextDue > todayStr;
      }
      if (RK.currentFilter === 'overdue') {
        return isOverdue;
      }
      return true;
    });
  };

  // ---- Sample tasks (onboarding) ----
  RK.addSampleTasks = function () {
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
      task.nextDue = RK.calcNextDue(task);
      RK.tasks.push(task);
    });

    RK.saveTasks();
    RK.render();
    RK.showToast(t('toast_samples'));
    RK.hapticSuccess();
  };

})();

