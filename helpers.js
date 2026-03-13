// helpers.js — Constants, Capacitor detection, haptics, pure utility functions
(function () {
  'use strict';

  var RK = window.RK = {};

  // ---- Capacitor Native Detection ----
  RK.isNative = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  RK.CapPlugins = RK.isNative && window.Capacitor.Plugins ? window.Capacitor.Plugins : {};
  RK.Haptics = RK.CapPlugins.Haptics || null;
  RK.StatusBarPlugin = RK.CapPlugins.StatusBar || null;
  RK.SplashPlugin = RK.CapPlugins.SplashScreen || null;
  RK.LocalNotif = RK.CapPlugins.LocalNotifications || null;

  // ---- Constants ----
  RK.STORAGE_KEY = 'recurkit_tasks';
  RK.ONBOARD_KEY = 'recurkit_onboarded';
  RK.BACKUP_KEY = 'recurkit_last_backup';
  RK.BATTERY_KEY = 'recurkit_battery_dismissed';
  RK.BACKUP_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days

  // ---- Shared State ----
  RK.tasks = [];
  RK.currentFilter = 'today';
  RK.searchQuery = '';

  // ---- Theme Management ----
  RK.THEME_KEY = 'recurkit_theme';

  RK.getTheme = function () {
    return localStorage.getItem(RK.THEME_KEY) || 'auto';
  };

  RK.applyTheme = function (theme) {
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = theme === 'dark' || (theme === 'auto' && prefersDark);
    document.documentElement.classList.toggle('dark', isDark);
  };

  RK.setTheme = function (theme) {
    localStorage.setItem(RK.THEME_KEY, theme);
    RK.applyTheme(theme);
  };

  // ---- Haptic Feedback ----
  RK.hapticLight = function () {
    if (RK.Haptics) { RK.Haptics.impact({ style: 'LIGHT' }).catch(function () {}); }
    else if (navigator.vibrate) { navigator.vibrate(30); }
  };

  RK.hapticSuccess = function () {
    if (RK.Haptics) { RK.Haptics.notification({ type: 'SUCCESS' }).catch(function () {}); }
    else if (navigator.vibrate) { navigator.vibrate([30, 50, 30]); }
  };

  // ---- Date Helpers ----
  RK.stripTime = function (d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  RK.formatDate = function (d) {
    var dd = d instanceof Date ? d : new Date(d);
    var y = dd.getFullYear();
    var m = String(dd.getMonth() + 1).padStart(2, '0');
    var day = String(dd.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  };

  RK.prettyDate = function (str) {
    if (!str) return '';
    var parts = str.split('-');
    var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    var todayStr = RK.formatDate(new Date());
    if (str === todayStr) return t('date_today');

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (str === RK.formatDate(tomorrow)) return t('date_tomorrow');

    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (str === RK.formatDate(yesterday)) return t('date_yesterday');

    return t('mon_' + d.getMonth()) + ' ' + d.getDate() + ', ' + d.getFullYear();
  };

  RK.ordinal = function (n) {
    var s = ['th', 'st', 'nd', 'rd'];
    var v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  RK.formatTime12 = function (timeStr) {
    if (!timeStr) return '';
    var parts = timeStr.split(':');
    var h = parseInt(parts[0]);
    var m = parts[1];
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return h + ':' + m + ' ' + ampm;
  };

  RK.escapeHtml = function (str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  RK.freqLabel = function (task) {
    if (task.frequency === 'once') return t('flabel_once');
    if (task.frequency === 'daily') return t('flabel_daily');
    if (task.frequency === 'weekly') return t('flabel_weekly') + ' \u00b7 ' + t('dayname_' + task.dayOfWeek);
    if (task.frequency === 'monthly') return t('flabel_monthly') + ' \u00b7 ' + RK.ordinal(task.dayOfMonth);
    if (task.frequency === 'yearly') return t('flabel_yearly') + ' \u00b7 ' + t('mon_' + task.month) + ' ' + task.dayOfMonth;
    if (task.frequency === 'custom') {
      var n = task.customInterval || 2;
      var u = task.customUnit || 'days';
      return t('flabel_every') + ' ' + n + ' ' + t('custom_' + u);
    }
    return task.frequency;
  };

})();

