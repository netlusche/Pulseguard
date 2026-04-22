export default {
    app: {
        title: "PulseGuard",
        subtitle: "Ваш особистий трекер артеріального тиску",
        exportCsv: "Експорт CSV"
    },
    form: {
        title: "Нове вимірювання",
        sys: "Систолічний",
        dia: "Діастолічний",
        pulse: "Пульс (уд/хв)",
        notes: "Примітки",
        notesPlaceholder: "напр. після тренування...",
        timestamp: "Дата і час",
        save: "Зберегти",
        feedback: {
            optimal: "Тиск оптимальний",
            normal: "Високий нормальний (Увага)",
            high: "Попередження: Занадто високий!"
        }
    },
    dashboard: {
        chartTitle: "Тренди (Останні 14 днів)",
        historyTitle: "Останні записи",
        noData: "Даних поки немає.",
        deleteConfirm: "Видалити цей запис?",
        trendWarningTitle: "Увага: Критичний тренд!",
        trendWarningDesc: "Середнє значення ваших останніх 3 вимірювань показує підвищення тиску."
    },
    common: {
        unit: "мм рт. ст.",
        bpm: "уд/хв"
    },
    auth: {
        loginTitle: "Увійти",
        registerTitle: "Реєстрація",
        email: "Ел. пошта",
        password: "Пароль",
        passwordConfirm: "Підтвердіть пароль",
        loginBtn: "Увійти",
        registerBtn: "Створити акаунт",
        logoutBtn: "Вийти",
        switchToRegister: "Немає акаунту? Зареєструйтесь тут",
        switchToLogin: "Вже зареєстровані? Увійдіть тут",
                error: "Помилка збереження профілю.",
        emailPending: "Профіль оновлено. Будь ласка, перевірте новий email (див. mail.log).",
                passwordMismatch: "Паролі не збігаються",
        registerSuccess: "Реєстрація успішна. Будь ласка, увійдіть.",
        twoFactorTitle: "Двофакторна автентифікація",
        twoFactorLabel: "6-значний код (див. mail.log)",
        verifyCodeBtn: "Перевірити код",
        backToLoginBtn: "Повернутися до входу",
        codeSent: "Код надіслано на ваш email (див. mail.log).",
        registerSuccessMail: "Реєстрація успішна. Перевірте mail.log для посилання.",
        verifyTitle: "Верифікація акаунту",
        verifying: "Перевірка вашого посилання...",
        verifySuccess: "Успіх!",
        verifyFailed: "Верифікація не вдалася",
        verifyContinueBtn: "Продовжити вхід",
        verifyGoLoginBtn: "Перейти до входу"
    },
    admin: {
        title: "Панель адміністратора",
        openAdmin: "Зона адміністратора",
        backToApp: "Повернутися в додаток",
        id: "ID",
        email: "Ел. пошта",
        role: "Роль",
        registered: "Зареєстровано",
        actions: "Дії",
        delete: "Видалити",
        promote: "Зробити адміністратором",
        confirmDelete: "Дійсно видалити цього користувача?",
                confirmPromote: "Зробити цього користувача адміністратором?",
        globalSettings: "Глобальні налаштування",
        strictPasswordTitle: "Сувора політика паролів",
        strictPasswordDesc: "Потрібно 12+ символів, великі, малі, цифри, спецсимволи.",
        twoFactorTitle: "Двофакторна автентифікація (2FA)",
        twoFactorDesc: "Примусово використовувати 2FA через email.",
        settingsSaved: "Налаштування успішно збережено."
    },
    profile: {
        title: "Мій профіль",
        changeEmail: "Адреса ел. пошти",
        changePassword: "Новий пароль (необов'язково)",
        currentPassword: "Поточний пароль (обов'язково)",
        save: "Зберегти профіль",
        success: "Профіль успішно оновлено.",
        error: "Помилка збереження профілю."
    }
};
