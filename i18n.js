// ===== RecurKit i18n — Multi-language support =====
(function () {
  'use strict';

  var LANG_KEY = 'recurkit_lang';

  window.RECURKIT_LANGS = {
    // ======================== ENGLISH ========================
    en: {
      // Nav
      nav_about: 'About', nav_privacy: 'Privacy', nav_home: 'Home', nav_privacy_policy: 'Privacy Policy',
      // Hero
      hero_title: 'Your recurring tasks.<br>Dead simple.',
      hero_sub: 'No projects, no boards, no teams. Just the stuff you need to do \u2014 on repeat.',
      // Mobile stats
      stat_due: 'Due', stat_overdue: 'Overdue', stat_done: 'Done', stat_total: 'Total',
      // Add task
      new_task: '+ New Recurring Task',
      placeholder: 'e.g. "Send invoice to client"',
      label_repeats: 'Repeats',
      freq_daily: 'Every day', freq_weekly: 'Every week', freq_monthly: 'Every month',
      freq_yearly: 'Every year', freq_once: 'One time only',
      label_day: 'Day', label_day_of_month: 'Day of month', label_month: 'Month', label_date: 'Date',
      label_time: 'Time', label_fullday: 'Full day',
      btn_add: 'Add Task',
      // Day names
      day_mon: 'Monday', day_tue: 'Tuesday', day_wed: 'Wednesday', day_thu: 'Thursday',
      day_fri: 'Friday', day_sat: 'Saturday', day_sun: 'Sunday',
      // Month names
      month_0: 'January', month_1: 'February', month_2: 'March', month_3: 'April',
      month_4: 'May', month_5: 'June', month_6: 'July', month_7: 'August',
      month_8: 'September', month_9: 'October', month_10: 'November', month_11: 'December',
      // Month abbreviations (for display)
      mon_0: 'Jan', mon_1: 'Feb', mon_2: 'Mar', mon_3: 'Apr', mon_4: 'May', mon_5: 'Jun',
      mon_6: 'Jul', mon_7: 'Aug', mon_8: 'Sep', mon_9: 'Oct', mon_10: 'Nov', mon_11: 'Dec',
      // Day names full (Sunday=0)
      dayname_0: 'Sunday', dayname_1: 'Monday', dayname_2: 'Tuesday', dayname_3: 'Wednesday',
      dayname_4: 'Thursday', dayname_5: 'Friday', dayname_6: 'Saturday',
      // Filters
      filter_today: 'Today', filter_upcoming: 'Upcoming', filter_overdue: 'Overdue', filter_all: 'All',
      // Empty state
      empty_text: 'No tasks here. Add your first recurring task above!',
      // Sidebar
      stats_title: 'Quick Stats',
      stat_due_today: 'Due today', stat_overdue_label: 'Overdue', stat_done_today: 'Done today', stat_total_tasks: 'Total tasks',
      how_title: 'How it works',
      how_1: '<strong>Add</strong> a task and set how often it repeats.',
      how_2: '<strong>Check it off</strong> when done \u2014 it auto-schedules the next one.',
      how_3: '<strong>Never forget</strong> a recurring task again.',
      // Footer
      footer_text: '\u00A9 2026 RecurKit. Built for people who just need to get things done.',
      // Toasts
      toast_added: 'Task added!',
      toast_done_once: 'Done! One-time task completed.',
      toast_done_next: 'Done! Next: ',
      toast_unmarked: 'Unmarked \u2014 task is back.',
      toast_deleted: 'Task deleted.',
      // Badges / labels
      badge_overdue: 'Overdue',
      badge_due_today: 'Due today',
      badge_done_today: '\u2713 Done today',
      badge_next: 'Next: ',
      // Frequency labels
      flabel_daily: 'Daily', flabel_weekly: 'Weekly', flabel_monthly: 'Monthly',
      flabel_yearly: 'Yearly', flabel_once: 'One-time',
      // Dates
      date_today: 'Today', date_tomorrow: 'Tomorrow', date_yesterday: 'Yesterday',
      // Confirm
      confirm_delete: 'Delete "{name}"?',
      confirm_yes: 'Yes', confirm_no: 'Cancel',
      // Buttons
      btn_undo: 'Undo', btn_mark_done: 'Mark as done', btn_undo_completion: 'Undo completion', btn_delete_task: 'Delete task',
      // Install banner
      install_title: 'Install RecurKit', install_text: 'Add to your home screen for quick access', install_btn: 'Install',
      // Notifications
      notif_body: '{name} is due today',
      notif_body_time: '{name} is due at {time} -- 30 min heads up!',
      // Menu
      menu_export: 'Export Data', menu_import: 'Import Data',
      // Data section
      data_title: 'Your Data',
      data_warn: 'Tasks are stored on this device only. Export regularly to keep a backup.',
      // Export/Import toasts
      toast_exported: 'Backup saved!',
      toast_imported: '{count} task(s) imported.',
      toast_import_fail: 'Invalid backup file.',
      toast_samples: 'Sample tasks added!',
      import_confirm_merge: 'Import {count} task(s)? New tasks will be added alongside your existing ones.',
      // Onboarding
      onboard_title: 'Welcome to RecurKit',
      onboard_sub: 'The dead simple recurring task manager. Add tasks that repeat -- daily, weekly, monthly, yearly -- and never forget them again.',
      onboard_ex1: 'Send invoice on the 1st',
      onboard_ex2: 'Check inventory every Thursday',
      onboard_ex3: 'Renew domain on March 15',
      onboard_btn_samples: 'Start with sample tasks',
      onboard_btn_skip: 'Start empty',
      // Sample task names
      sample_invoice: 'Send invoice to client',
      sample_inventory: 'Check inventory',
      sample_domain: 'Renew domain',
      sample_report: 'Send weekly report',
      sample_backup: 'Backup data',
      // Battery
      battery_title: 'Notifications may not work',
      battery_text: 'Some phones kill background apps. Open Settings > Apps > RecurKit > Battery and set to "Unrestricted" for reliable reminders.',
      // Backup reminder
      backup_reminder_text: 'Your tasks are only stored on this device. Export a backup to keep them safe.',
      backup_btn_export: 'Export now',
      backup_btn_later: 'Later'
    },

    // ======================== TURKISH ========================
    tr: {
      nav_about: 'Hakkında', nav_privacy: 'Gizlilik', nav_home: 'Ana Sayfa', nav_privacy_policy: 'Gizlilik Politikası',
      hero_title: 'Tekrarlayan görevleriniz.<br>Çok basit.',
      hero_sub: 'Proje yok, pano yok, takım yok. Sadece tekrar tekrar yapmanız gereken işler.',
      stat_due: 'Bugün', stat_overdue: 'Gecikmiş', stat_done: 'Bitti', stat_total: 'Toplam',
      new_task: '+ Yeni Tekrarlayan Görev',
      placeholder: 'örn. "Müşteriye fatura gönder"',
      label_repeats: 'Tekrar',
      freq_daily: 'Her gün', freq_weekly: 'Her hafta', freq_monthly: 'Her ay',
      freq_yearly: 'Her yıl', freq_once: 'Tek seferlik',
      label_day: 'Gün', label_day_of_month: 'Ayın günü', label_month: 'Ay', label_date: 'Tarih',
      label_time: 'Saat', label_fullday: 'Tüm gün',
      btn_add: 'Görev Ekle',
      day_mon: 'Pazartesi', day_tue: 'Salı', day_wed: 'Çarşamba', day_thu: 'Perşembe',
      day_fri: 'Cuma', day_sat: 'Cumartesi', day_sun: 'Pazar',
      month_0: 'Ocak', month_1: 'Şubat', month_2: 'Mart', month_3: 'Nisan',
      month_4: 'Mayıs', month_5: 'Haziran', month_6: 'Temmuz', month_7: 'Ağustos',
      month_8: 'Eylül', month_9: 'Ekim', month_10: 'Kasım', month_11: 'Aralık',
      mon_0: 'Oca', mon_1: 'Şub', mon_2: 'Mar', mon_3: 'Nis', mon_4: 'May', mon_5: 'Haz',
      mon_6: 'Tem', mon_7: 'Ağu', mon_8: 'Eyl', mon_9: 'Eki', mon_10: 'Kas', mon_11: 'Ara',
      dayname_0: 'Pazar', dayname_1: 'Pazartesi', dayname_2: 'Salı', dayname_3: 'Çarşamba',
      dayname_4: 'Perşembe', dayname_5: 'Cuma', dayname_6: 'Cumartesi',
      filter_today: 'Bugün', filter_upcoming: 'Yaklaşan', filter_overdue: 'Gecikmiş', filter_all: 'Tümü',
      empty_text: 'Henüz görev yok. İlk tekrarlayan görevinizi yukarıdan ekleyin!',
      stats_title: 'Hızlı İstatistikler',
      stat_due_today: 'Bugün yapılacak', stat_overdue_label: 'Gecikmiş', stat_done_today: 'Bugün tamamlanan', stat_total_tasks: 'Toplam görev',
      how_title: 'Nasıl çalışır',
      how_1: '<strong>Ekleyin</strong> \u2014 bir görev ekleyin ve ne sıklıkla tekrarlandığını belirleyin.',
      how_2: '<strong>İşaretleyin</strong> \u2014 bittiğinde tıklayın, sonraki otomatik hesaplanır.',
      how_3: '<strong>Asla unutmayın</strong> \u2014 tekrarlayan görevlerinizi bir daha kaçırmayın.',
      footer_text: '\u00A9 2026 RecurKit. İşlerini halletmesi gereken insanlar için yapıldı.',
      toast_added: 'Görev eklendi!',
      toast_done_once: 'Bitti! Tek seferlik görev tamamlandı.',
      toast_done_next: 'Bitti! Sonraki: ',
      toast_unmarked: 'Geri alındı \u2014 görev geri döndü.',
      toast_deleted: 'Görev silindi.',
      badge_overdue: 'Gecikmiş',
      badge_due_today: 'Bugün yapılacak',
      badge_done_today: '\u2713 Bugün tamamlandı',
      badge_next: 'Sonraki: ',
      flabel_daily: 'Günlük', flabel_weekly: 'Haftalık', flabel_monthly: 'Aylık',
      flabel_yearly: 'Yıllık', flabel_once: 'Tek seferlik',
      date_today: 'Bugün', date_tomorrow: 'Yarın', date_yesterday: 'Dün',
      confirm_delete: '"{name}" silinsin mi?',
      confirm_yes: 'Evet', confirm_no: '\u0130ptal',
      btn_undo: 'Geri al', btn_mark_done: 'Tamamlandı olarak işaretle', btn_undo_completion: 'Geri al', btn_delete_task: 'Görevi sil',
      install_title: 'RecurKit\'i Yükle', install_text: 'Hızlı erişim için ana ekranınıza ekleyin', install_btn: 'Yükle',
      notif_body: '{name} bugün yapılmalı',
      notif_body_time: '{name} saat {time} -- 30 dk sonra!',
      menu_export: 'Veriyi D\u0131\u015fa Aktar', menu_import: 'Veri \u0130\u00e7e Aktar',
      data_title: 'Verileriniz',
      data_warn: 'G\u00f6revler sadece bu cihazda saklan\u0131r. D\u00fczenli olarak yedek al\u0131n.',
      toast_exported: 'Yedek kaydedildi!',
      toast_imported: '{count} g\u00f6rev i\u00e7e aktar\u0131ld\u0131.',
      toast_import_fail: 'Ge\u00e7ersiz yedek dosyas\u0131.',
      toast_samples: '\u00d6rnek g\u00f6revler eklendi!',
      import_confirm_merge: '{count} g\u00f6rev i\u00e7e aktar\u0131ls\u0131n m\u0131? Yeni g\u00f6revler mevcut g\u00f6revlerinizin yan\u0131na eklenecek.',
      onboard_title: 'RecurKit\'e Ho\u015f Geldiniz',
      onboard_sub: '\u00c7ok basit tekrarlayan g\u00f6rev y\u00f6neticisi. G\u00fcnl\u00fck, haftal\u0131k, ayl\u0131k veya y\u0131ll\u0131k tekrarlanan g\u00f6revler ekleyin ve bir daha unutmay\u0131n.',
      onboard_ex1: 'Her ay\u0131n 1\'inde fatura g\u00f6nder',
      onboard_ex2: 'Her per\u015fembe envanter kontrol\u00fc',
      onboard_ex3: '15 Mart\'ta alan ad\u0131 yenile',
      onboard_btn_samples: '\u00d6rnek g\u00f6revlerle ba\u015fla',
      onboard_btn_skip: 'Bo\u015f ba\u015fla',
      sample_invoice: 'M\u00fc\u015fteriye fatura g\u00f6nder',
      sample_inventory: 'Envanter kontrol\u00fc',
      sample_domain: 'Alan ad\u0131n\u0131 yenile',
      sample_report: 'Haftal\u0131k rapor g\u00f6nder',
      sample_backup: 'Veri yedekle',
      battery_title: 'Bildirimler \u00e7al\u0131\u015fmayabilir',
      battery_text: 'Baz\u0131 telefonlar arka plan uygulamalar\u0131n\u0131 kapat\u0131r. Ayarlar > Uygulamalar > RecurKit > Pil b\u00f6l\u00fcm\u00fcnden "S\u0131n\u0131rs\u0131z" olarak ayarlay\u0131n.',
      backup_reminder_text: 'G\u00f6revleriniz sadece bu cihazda saklan\u0131yor. Güvende tutmak i\u00e7in yedek al\u0131n.',
      backup_btn_export: '\u015eimdi yedekle',
      backup_btn_later: 'Sonra'
    },

    // ======================== GERMAN ========================
    de: {
      nav_about: 'Über uns', nav_privacy: 'Datenschutz', nav_home: 'Startseite', nav_privacy_policy: 'Datenschutzrichtlinie',
      hero_title: 'Ihre wiederkehrenden Aufgaben.<br>Ganz einfach.',
      hero_sub: 'Keine Projekte, keine Boards, keine Teams. Nur das, was regelmäßig erledigt werden muss.',
      stat_due: 'Fällig', stat_overdue: 'Überfällig', stat_done: 'Erledigt', stat_total: 'Gesamt',
      new_task: '+ Neue wiederkehrende Aufgabe',
      placeholder: 'z.B. "Rechnung an Kunden senden"',
      label_repeats: 'Wiederholung',
      freq_daily: 'Jeden Tag', freq_weekly: 'Jede Woche', freq_monthly: 'Jeden Monat',
      freq_yearly: 'Jedes Jahr', freq_once: 'Einmalig',
      label_day: 'Tag', label_day_of_month: 'Tag des Monats', label_month: 'Monat', label_date: 'Datum',
      label_time: 'Uhrzeit', label_fullday: 'Ganzer Tag',
      btn_add: 'Aufgabe hinzufügen',
      day_mon: 'Montag', day_tue: 'Dienstag', day_wed: 'Mittwoch', day_thu: 'Donnerstag',
      day_fri: 'Freitag', day_sat: 'Samstag', day_sun: 'Sonntag',
      month_0: 'Januar', month_1: 'Februar', month_2: 'März', month_3: 'April',
      month_4: 'Mai', month_5: 'Juni', month_6: 'Juli', month_7: 'August',
      month_8: 'September', month_9: 'Oktober', month_10: 'November', month_11: 'Dezember',
      mon_0: 'Jan', mon_1: 'Feb', mon_2: 'Mär', mon_3: 'Apr', mon_4: 'Mai', mon_5: 'Jun',
      mon_6: 'Jul', mon_7: 'Aug', mon_8: 'Sep', mon_9: 'Okt', mon_10: 'Nov', mon_11: 'Dez',
      dayname_0: 'Sonntag', dayname_1: 'Montag', dayname_2: 'Dienstag', dayname_3: 'Mittwoch',
      dayname_4: 'Donnerstag', dayname_5: 'Freitag', dayname_6: 'Samstag',
      filter_today: 'Heute', filter_upcoming: 'Bevorstehend', filter_overdue: 'Überfällig', filter_all: 'Alle',
      empty_text: 'Noch keine Aufgaben. Fügen Sie oben Ihre erste wiederkehrende Aufgabe hinzu!',
      stats_title: 'Kurzstatistik',
      stat_due_today: 'Heute fällig', stat_overdue_label: 'Überfällig', stat_done_today: 'Heute erledigt', stat_total_tasks: 'Aufgaben gesamt',
      how_title: 'So funktioniert\u2019s',
      how_1: '<strong>Hinzufügen</strong> \u2014 erstellen Sie eine Aufgabe und legen Sie die Wiederholung fest.',
      how_2: '<strong>Abhaken</strong> \u2014 wenn erledigt, wird die nächste automatisch berechnet.',
      how_3: '<strong>Nie vergessen</strong> \u2014 verpassen Sie nie wieder eine wiederkehrende Aufgabe.',
      footer_text: '\u00A9 2026 RecurKit. Für Menschen, die einfach Dinge erledigen müssen.',
      toast_added: 'Aufgabe hinzugefügt!',
      toast_done_once: 'Erledigt! Einmalige Aufgabe abgeschlossen.',
      toast_done_next: 'Erledigt! Nächste: ',
      toast_unmarked: 'Rückgängig \u2014 Aufgabe ist zurück.',
      toast_deleted: 'Aufgabe gelöscht.',
      badge_overdue: 'Überfällig',
      badge_due_today: 'Heute fällig',
      badge_done_today: '\u2713 Heute erledigt',
      badge_next: 'Nächste: ',
      flabel_daily: 'Täglich', flabel_weekly: 'Wöchentlich', flabel_monthly: 'Monatlich',
      flabel_yearly: 'Jährlich', flabel_once: 'Einmalig',
      date_today: 'Heute', date_tomorrow: 'Morgen', date_yesterday: 'Gestern',
      confirm_delete: '"{name}" l\u00f6schen?',
      confirm_yes: 'Ja', confirm_no: 'Abbrechen',
      btn_undo: 'R\u00fcckg\u00e4ngig', btn_mark_done: 'Als erledigt markieren', btn_undo_completion: 'Rückgängig', btn_delete_task: 'Aufgabe löschen',
      install_title: 'RecurKit installieren', install_text: 'Zum Startbildschirm hinzufügen', install_btn: 'Installieren',
      notif_body: '{name} ist heute fällig',
      notif_body_time: '{name} ist um {time} fällig -- in 30 Min!',
      menu_export: 'Daten exportieren', menu_import: 'Daten importieren',
      data_title: 'Ihre Daten',
      data_warn: 'Aufgaben werden nur auf diesem Ger\u00e4t gespeichert. Exportieren Sie regelm\u00e4\u00dfig ein Backup.',
      toast_exported: 'Backup gespeichert!',
      toast_imported: '{count} Aufgabe(n) importiert.',
      toast_import_fail: 'Ung\u00fcltige Backup-Datei.',
      toast_samples: 'Beispielaufgaben hinzugef\u00fcgt!',
      import_confirm_merge: '{count} Aufgabe(n) importieren? Neue Aufgaben werden neben Ihren bestehenden hinzugef\u00fcgt.',
      onboard_title: 'Willkommen bei RecurKit',
      onboard_sub: 'Der einfachste Aufgabenmanager f\u00fcr wiederkehrende Aufgaben. T\u00e4glich, w\u00f6chentlich, monatlich oder j\u00e4hrlich -- nie wieder vergessen.',
      onboard_ex1: 'Rechnung am 1. senden',
      onboard_ex2: 'Jeden Donnerstag Bestand pr\u00fcfen',
      onboard_ex3: 'Domain am 15. M\u00e4rz verl\u00e4ngern',
      onboard_btn_samples: 'Mit Beispielaufgaben starten',
      onboard_btn_skip: 'Leer starten',
      sample_invoice: 'Rechnung an Kunden senden',
      sample_inventory: 'Bestand pr\u00fcfen',
      sample_domain: 'Domain verl\u00e4ngern',
      sample_report: 'Wochenbericht senden',
      sample_backup: 'Daten sichern',
      battery_title: 'Benachrichtigungen funktionieren m\u00f6glicherweise nicht',
      battery_text: 'Einige Telefone beenden Hintergrund-Apps. \u00d6ffnen Sie Einstellungen > Apps > RecurKit > Akku und setzen Sie auf "Uneingeschr\u00e4nkt".',
      backup_reminder_text: 'Ihre Aufgaben sind nur auf diesem Ger\u00e4t gespeichert. Exportieren Sie ein Backup, um sie zu sichern.',
      backup_btn_export: 'Jetzt exportieren',
      backup_btn_later: 'Sp\u00e4ter'
    },

    // ======================== FRENCH ========================
    fr: {
      nav_about: 'À propos', nav_privacy: 'Confidentialité', nav_home: 'Accueil', nav_privacy_policy: 'Politique de confidentialité',
      hero_title: 'Vos tâches récurrentes.<br>Ultra simple.',
      hero_sub: 'Pas de projets, pas de tableaux, pas d\u2019équipes. Juste ce que vous devez faire \u2014 encore et encore.',
      stat_due: 'À faire', stat_overdue: 'En retard', stat_done: 'Fait', stat_total: 'Total',
      new_task: '+ Nouvelle tâche récurrente',
      placeholder: 'ex. "Envoyer la facture au client"',
      label_repeats: 'Répétition',
      freq_daily: 'Chaque jour', freq_weekly: 'Chaque semaine', freq_monthly: 'Chaque mois',
      freq_yearly: 'Chaque année', freq_once: 'Une seule fois',
      label_day: 'Jour', label_day_of_month: 'Jour du mois', label_month: 'Mois', label_date: 'Date',
      label_time: 'Heure', label_fullday: 'Toute la journ\u00e9e',
      btn_add: 'Ajouter',
      day_mon: 'Lundi', day_tue: 'Mardi', day_wed: 'Mercredi', day_thu: 'Jeudi',
      day_fri: 'Vendredi', day_sat: 'Samedi', day_sun: 'Dimanche',
      month_0: 'Janvier', month_1: 'Février', month_2: 'Mars', month_3: 'Avril',
      month_4: 'Mai', month_5: 'Juin', month_6: 'Juillet', month_7: 'Août',
      month_8: 'Septembre', month_9: 'Octobre', month_10: 'Novembre', month_11: 'Décembre',
      mon_0: 'Jan', mon_1: 'Fév', mon_2: 'Mar', mon_3: 'Avr', mon_4: 'Mai', mon_5: 'Jui',
      mon_6: 'Jul', mon_7: 'Aoû', mon_8: 'Sep', mon_9: 'Oct', mon_10: 'Nov', mon_11: 'Déc',
      dayname_0: 'Dimanche', dayname_1: 'Lundi', dayname_2: 'Mardi', dayname_3: 'Mercredi',
      dayname_4: 'Jeudi', dayname_5: 'Vendredi', dayname_6: 'Samedi',
      filter_today: 'Aujourd\u2019hui', filter_upcoming: 'À venir', filter_overdue: 'En retard', filter_all: 'Tout',
      empty_text: 'Aucune tâche ici. Ajoutez votre première tâche récurrente ci-dessus\u00A0!',
      stats_title: 'Statistiques rapides',
      stat_due_today: 'À faire aujourd\u2019hui', stat_overdue_label: 'En retard', stat_done_today: 'Fait aujourd\u2019hui', stat_total_tasks: 'Total des tâches',
      how_title: 'Comment ça marche',
      how_1: '<strong>Ajoutez</strong> une tâche et définissez sa fréquence de répétition.',
      how_2: '<strong>Cochez-la</strong> quand c\u2019est fait \u2014 la prochaine est planifiée automatiquement.',
      how_3: '<strong>N\u2019oubliez plus jamais</strong> une tâche récurrente.',
      footer_text: '\u00A9 2026 RecurKit. Conçu pour ceux qui veulent simplement faire avancer les choses.',
      toast_added: 'Tâche ajoutée\u00A0!',
      toast_done_once: 'Fait\u00A0! Tâche unique terminée.',
      toast_done_next: 'Fait\u00A0! Prochaine\u00A0: ',
      toast_unmarked: 'Annulé \u2014 la tâche est de retour.',
      toast_deleted: 'Tâche supprimée.',
      badge_overdue: 'En retard',
      badge_due_today: 'À faire aujourd\u2019hui',
      badge_done_today: '\u2713 Fait aujourd\u2019hui',
      badge_next: 'Prochaine\u00A0: ',
      flabel_daily: 'Quotidien', flabel_weekly: 'Hebdomadaire', flabel_monthly: 'Mensuel',
      flabel_yearly: 'Annuel', flabel_once: 'Unique',
      date_today: 'Aujourd\u2019hui', date_tomorrow: 'Demain', date_yesterday: 'Hier',
      confirm_delete: 'Supprimer \u00ab {name} \u00bb\u00a0?',
      confirm_yes: 'Oui', confirm_no: 'Annuler',
      btn_undo: 'Annuler', btn_mark_done: 'Marquer comme fait', btn_undo_completion: 'Annuler', btn_delete_task: 'Supprimer la tâche',
      install_title: 'Installer RecurKit', install_text: 'Ajouter à l\u2019écran d\u2019accueil pour un accès rapide', install_btn: 'Installer',
      notif_body: '{name} est pr\u00e9vu aujourd\u2019hui',
      notif_body_time: '{name} est pr\u00e9vu \u00e0 {time} -- dans 30 min!',
      menu_export: 'Exporter les donn\u00e9es', menu_import: 'Importer les donn\u00e9es',
      data_title: 'Vos donn\u00e9es',
      data_warn: 'Les t\u00e2ches sont stock\u00e9es uniquement sur cet appareil. Exportez r\u00e9guli\u00e8rement une sauvegarde.',
      toast_exported: 'Sauvegarde enregistr\u00e9e\u00a0!',
      toast_imported: '{count} t\u00e2che(s) import\u00e9e(s).',
      toast_import_fail: 'Fichier de sauvegarde invalide.',
      toast_samples: 'T\u00e2ches d\u2019exemple ajout\u00e9es\u00a0!',
      import_confirm_merge: 'Importer {count} t\u00e2che(s)\u00a0? Les nouvelles t\u00e2ches seront ajout\u00e9es \u00e0 c\u00f4t\u00e9 des existantes.',
      onboard_title: 'Bienvenue sur RecurKit',
      onboard_sub: 'Le gestionnaire de t\u00e2ches r\u00e9currentes ultra simple. Ajoutez des t\u00e2ches qui se r\u00e9p\u00e8tent et ne les oubliez plus jamais.',
      onboard_ex1: 'Envoyer la facture le 1er',
      onboard_ex2: 'V\u00e9rifier l\u2019inventaire chaque jeudi',
      onboard_ex3: 'Renouveler le domaine le 15 mars',
      onboard_btn_samples: 'D\u00e9marrer avec des exemples',
      onboard_btn_skip: 'D\u00e9marrer vide',
      sample_invoice: 'Envoyer la facture au client',
      sample_inventory: 'V\u00e9rifier l\u2019inventaire',
      sample_domain: 'Renouveler le domaine',
      sample_report: 'Envoyer le rapport hebdomadaire',
      sample_backup: 'Sauvegarder les donn\u00e9es',
      battery_title: 'Les notifications peuvent ne pas fonctionner',
      battery_text: 'Certains t\u00e9l\u00e9phones ferment les apps en arri\u00e8re-plan. Ouvrez Param\u00e8tres > Apps > RecurKit > Batterie et choisissez "Non restreint".',
      backup_reminder_text: 'Vos t\u00e2ches sont uniquement sur cet appareil. Exportez une sauvegarde pour les prot\u00e9ger.',
      backup_btn_export: 'Exporter maintenant',
      backup_btn_later: 'Plus tard'
    }
  };

  // ---- Get / Set current language ----
  window.getLang = function () {
    return localStorage.getItem(LANG_KEY) || 'en';
  };

  window.t = function (key) {
    var lang = window.getLang();
    return window.RECURKIT_LANGS[lang][key] || window.RECURKIT_LANGS['en'][key] || key;
  };

  window.setLang = function (lang) {
    localStorage.setItem(LANG_KEY, lang);
    applyLang(lang);
    // Re-render app task list if available
    if (typeof window.recurkitRender === 'function') {
      window.recurkitRender();
    }
  };

  function applyLang(lang) {
    var strings = window.RECURKIT_LANGS[lang] || window.RECURKIT_LANGS['en'];

    // Update all [data-i18n] → textContent
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (strings[key] != null) el.textContent = strings[key];
    });

    // Update all [data-i18n-html] → innerHTML
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (strings[key] != null) el.innerHTML = strings[key];
    });

    // Update all [data-i18n-placeholder] → placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (strings[key] != null) el.placeholder = strings[key];
    });

    // Update language selector
    var sel = document.getElementById('langSelect');
    if (sel) sel.value = lang;

    // Update html lang attribute
    document.documentElement.lang = lang;
  }

  // ---- Init on DOM ready ----
  document.addEventListener('DOMContentLoaded', function () {
    var lang = window.getLang();
    var sel = document.getElementById('langSelect');
    if (sel) {
      sel.value = lang;
      sel.addEventListener('change', function () {
        window.setLang(this.value);
      });
    }
    applyLang(lang);
  });
})();

