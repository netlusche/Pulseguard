export default {
    app: {
        title: "PulseGuard",
        subtitle: "Ваш персональный трекер артериального давления",
        exportCsv: "Экспорт CSV"
    },
    form: {
        title: "Новое измерение",
        sys: "Систолическое",
        dia: "Диастолическое",
        pulse: "Пульс (уд/мин)",
        notes: "Заметки",
        notesPlaceholder: "напр. после тренировки...",
        timestamp: "Дата и время",
        save: "Сохранить",
        feedback: {
            optimal: "Давление оптимальное",
            normal: "Высокое нормальное (Внимание)",
            high: "Предупреждение: Слишком высокое!"
        }
    },
    dashboard: {
        chartTitle: "Тренды (Последние 14 дней)",
        historyTitle: "Последние записи",
        noData: "Данных пока нет.",
        deleteConfirm: "Удалить эту запись?",
        trendWarningTitle: "Внимание: Критический тренд!",
        trendWarningDesc: "Среднее значение ваших последних 3 измерений показывает повышение давления."
    },
    common: {
        unit: "мм рт. ст.",
        bpm: "уд/мин"
    },
    auth: {
        loginTitle: "Вход",
        registerTitle: "Регистрация",
        email: "Эл. почта",
        password: "Пароль",
        passwordConfirm: "Подтвердите пароль",
        loginBtn: "Войти",
        registerBtn: "Создать аккаунт",
        logoutBtn: "Выйти",
        switchToRegister: "Нет аккаунта? Зарегистрируйтесь здесь",
        switchToLogin: "Уже зарегистрированы? Войдите здесь",
                error: "Ошибка сохранения профиля.",
        emailPending: "Профиль обновлен. Пожалуйста, проверьте новый email (см. mail.log).",
                passwordMismatch: "Пароли не совпадают",
        registerSuccess: "Регистрация успешна. Пожалуйста, войдите.",
        twoFactorTitle: "Двухфакторная аутентификация",
        twoFactorLabel: "6-значный код (см. mail.log)",
        verifyCodeBtn: "Проверить код",
        backToLoginBtn: "Вернуться к входу",
        codeSent: "Код отправлен на ваш email (см. mail.log).",
        registerSuccessMail: "Регистрация успешна. Проверьте mail.log для ссылки.",
        verifyTitle: "Верификация аккаунта",
        verifying: "Проверка ссылки...",
        verifySuccess: "Успех!",
        verifyFailed: "Верификация не удалась",
        verifyContinueBtn: "Продолжить вход",
        verifyGoLoginBtn: "Перейти ко входу"
    },
    admin: {
        title: "Панель администратора",
        openAdmin: "Зона администратора",
        backToApp: "Вернуться в приложение",
        id: "ID",
        email: "Эл. почта",
        role: "Роль",
        registered: "Зарегистрирован",
        actions: "Действия",
        delete: "Удалить",
        promote: "Сделать администратором",
        confirmDelete: "Действительно удалить этого пользователя?",
                confirmPromote: "Сделать пользователя администратором?",
        globalSettings: "Глобальные настройки",
        strictPasswordTitle: "Строгая политика паролей",
        strictPasswordDesc: "Требуется 12+ символов, заглавные, строчные, цифры, спецсимволы.",
        twoFactorTitle: "Двухфакторная аутентификация (2FA)",
        twoFactorDesc: "Принудительно использовать 2FA по email.",
        settingsSaved: "Настройки успешно сохранены."
    },
    profile: {
        title: "Мой профиль",
        changeEmail: "Адрес эл. почты",
        changePassword: "Новый пароль (необязательно)",
        currentPassword: "Текущий пароль (обязательно)",
        save: "Сохранить профиль",
        success: "Профиль успешно обновлен.",
        error: "Ошибка сохранения профиля."
    }
};
