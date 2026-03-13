// storage.js — Save, load, export, import
(function () {
  'use strict';

  var RK = window.RK;

  RK.saveTasks = function () {
    try {
      localStorage.setItem(RK.STORAGE_KEY, JSON.stringify(RK.tasks));
    } catch (e) { /* silently fail */ }
  };

  RK.loadTasks = function () {
    try {
      var data = localStorage.getItem(RK.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  };

  RK.exportData = function () {
    var data = {
      version: 1,
      exported: new Date().toISOString(),
      tasks: RK.tasks
    };
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'recurkit-backup-' + RK.formatDate(new Date()) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    localStorage.setItem(RK.BACKUP_KEY, Date.now().toString());
    RK.showToast(t('toast_exported'));
    RK.hapticSuccess();

    var menuDropdown = document.getElementById('menuDropdown');
    if (menuDropdown) menuDropdown.classList.remove('open');
  };

  RK.handleImportFile = function (file) {
    var reader = new FileReader();
    reader.onload = function (ev) {
      try {
        var data = JSON.parse(ev.target.result);
        var importedTasks = data.tasks || data;

        if (!Array.isArray(importedTasks)) {
          RK.showToast(t('toast_import_fail'));
          return;
        }

        var valid = importedTasks.every(function (tk) {
          return tk.id && tk.name && tk.frequency && tk.nextDue;
        });
        if (!valid) {
          RK.showToast(t('toast_import_fail'));
          return;
        }

        var count = importedTasks.length;

        function doImport() {
          var existingIds = {};
          RK.tasks.forEach(function (tk) { existingIds[tk.id] = true; });

          var added = 0;
          importedTasks.forEach(function (tk) {
            if (!existingIds[tk.id]) {
              if (!Array.isArray(tk.completedDates)) tk.completedDates = [];
              if (tk.fullDay === undefined) tk.fullDay = true;
              RK.tasks.push(tk);
              added++;
            }
          });

          RK.saveTasks();
          RK.render();
          RK.showToast(t('toast_imported').replace('{count}', added));
          RK.hapticSuccess();

          if (RK.isNative && RK.LocalNotif) {
            setTimeout(RK.scheduleAllNotifications, 500);
          }
        }

        if (RK.tasks.length > 0) {
          RK.showConfirm(t('import_confirm_merge').replace('{count}', count), doImport);
        } else {
          doImport();
        }
      } catch (err) {
        RK.showToast(t('toast_import_fail'));
      }
    };
    reader.readAsText(file);
  };

})();

