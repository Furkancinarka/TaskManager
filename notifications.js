// notifications.js — Local notification scheduling, channels, permissions
(function () {
  'use strict';

  var RK = window.RK;

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
    if (!RK.LocalNotif) { if (cb) cb(false); return; }
    if (notifPermRequested) { if (cb) cb(true); return; }

    RK.LocalNotif.checkPermissions().then(function (result) {
      if (result.display === 'granted') {
        notifPermRequested = true;
        if (cb) cb(true);
      } else {
        RK.LocalNotif.requestPermissions().then(function (req) {
          notifPermRequested = req.display === 'granted';
          if (cb) cb(notifPermRequested);
        }).catch(function () { if (cb) cb(false); });
      }
    }).catch(function () { if (cb) cb(false); });
  }

  // Schedule a notification using task.notifyBefore (minutes before due)
  RK.scheduleTaskNotification = function (task) {
    if (!RK.LocalNotif) return;

    ensureNotifPermission(function (granted) {
      if (!granted) return;

      var notifId = taskIdToNotifId(task.id);

      // Cancel notification for completed one-time tasks
      if (task.frequency === 'once' && task.completedDates.length > 0) {
        RK.LocalNotif.cancel({ notifications: [{ id: notifId }] }).catch(function () {});
        return;
      }

      // Determine reminder offset (default 30 min for backward compat)
      var notifyBefore = (task.notifyBefore !== undefined && task.notifyBefore !== null) ? parseInt(task.notifyBefore) : 30;

      // -1 means user disabled notifications for this task
      if (notifyBefore < 0) {
        RK.LocalNotif.cancel({ notifications: [{ id: notifId }] }).catch(function () {});
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
        notifDate.setMinutes(notifDate.getMinutes() - notifyBefore);
      } else {
        notifDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 8, 0, 0);
        notifDate.setMinutes(notifDate.getMinutes() - notifyBefore);
      }

      // If time is in the past, leave existing notification alone
      if (notifDate.getTime() < Date.now()) return;

      // Cancel old then schedule new
      RK.LocalNotif.cancel({ notifications: [{ id: notifId }] }).catch(function () {});

      var bodyText;
      if (!task.fullDay && task.taskTime) {
        if (notifyBefore === 0) {
          bodyText = t('notif_body_now').replace('{name}', task.name);
        } else {
          bodyText = t('notif_body_time').replace('{name}', task.name).replace('{time}', RK.formatTime12(task.taskTime)).replace('{mins}', String(notifyBefore));
        }
      } else {
        bodyText = t('notif_body').replace('{name}', task.name);
      }

      RK.LocalNotif.schedule({
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
  };

  // Cancel notification for a task
  RK.cancelTaskNotification = function (task) {
    if (!RK.LocalNotif) return;
    var notifId = taskIdToNotifId(task.id);
    RK.LocalNotif.cancel({ notifications: [{ id: notifId }] }).catch(function () {});
  };

  // Create notification channel for Android 8+
  RK.createNotifChannel = function () {
    if (!RK.LocalNotif) return;
    if (!RK.LocalNotif.createChannel) return;

    RK.LocalNotif.createChannel({
      id: 'recurkit_reminders',
      name: 'Task Reminders',
      description: 'Notifications for upcoming and due tasks',
      importance: 4,
      visibility: 1,
      sound: 'default',
      vibration: true,
      lights: true
    }).catch(function () {});
  };

  // Schedule notifications for all tasks
  RK.scheduleAllNotifications = function () {
    if (!RK.LocalNotif) return;

    ensureNotifPermission(function (granted) {
      if (!granted) return;
      RK.tasks.forEach(function (task) {
        RK.scheduleTaskNotification(task);
      });
    });
  };

  // Init: channel + schedule + listener
  RK.initNotifications = function () {
    if (!RK.isNative || !RK.LocalNotif) return;

    RK.createNotifChannel();
    setTimeout(RK.scheduleAllNotifications, 1500);

    RK.LocalNotif.addListener('localNotificationActionPerformed', function () {
      // Bring app to foreground — task list shows due tasks
    });
  };

})();

