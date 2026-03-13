// onboarding.js — First-run onboarding, battery banner, backup reminder
(function () {
  'use strict';

  var RK = window.RK;

  // ---- Onboarding ----
  RK.checkOnboarding = function () {
    if (localStorage.getItem(RK.ONBOARD_KEY)) return;
    if (RK.tasks.length > 0) {
      localStorage.setItem(RK.ONBOARD_KEY, '1');
      return;
    }
    var el = document.getElementById('onboarding');
    if (el) el.style.display = '';
  };

  function dismissOnboarding() {
    localStorage.setItem(RK.ONBOARD_KEY, '1');
    var el = document.getElementById('onboarding');
    if (el) el.style.display = 'none';
  }

  RK.initOnboarding = function () {
    var skip = document.getElementById('onboardSkip');
    var samples = document.getElementById('onboardSamples');

    if (skip) {
      skip.addEventListener('click', dismissOnboarding);
    }
    if (samples) {
      samples.addEventListener('click', function () {
        RK.addSampleTasks();
        dismissOnboarding();
      });
    }
  };

  // ---- Battery Optimization Banner ----
  RK.checkBatteryBanner = function () {
    if (!RK.isNative) return;
    if (localStorage.getItem(RK.BATTERY_KEY)) return;
    setTimeout(function () {
      var el = document.getElementById('batteryBanner');
      if (el) el.style.display = '';
    }, 3000);
  };

  RK.initBatteryBanner = function () {
    var dismiss = document.getElementById('batteryDismiss');
    if (dismiss) {
      dismiss.addEventListener('click', function () {
        localStorage.setItem(RK.BATTERY_KEY, '1');
        var el = document.getElementById('batteryBanner');
        if (el) el.style.display = 'none';
      });
    }
  };

  // ---- Backup Reminder ----
  RK.checkBackupReminder = function () {
    if (RK.tasks.length < 3) return;

    var lastBackup = parseInt(localStorage.getItem(RK.BACKUP_KEY) || '0');
    var now = Date.now();

    if (lastBackup === 0 || (now - lastBackup) > RK.BACKUP_INTERVAL) {
      showBackupReminder();
    }
  };

  function showBackupReminder() {
    var existing = document.querySelector('.backup-reminder');
    if (existing) return;

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
      RK.exportData();
      div.remove();
    });
    document.getElementById('backupLaterBtn').addEventListener('click', function () {
      localStorage.setItem(RK.BACKUP_KEY, (Date.now() - RK.BACKUP_INTERVAL + 3 * 24 * 60 * 60 * 1000).toString());
      div.remove();
    });
  }

})();

