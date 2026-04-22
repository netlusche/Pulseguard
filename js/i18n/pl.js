export default {
    app: {
        title: "PulseGuard",
        subtitle: "Twój osobisty monitor ciśnienia krwi",
        exportCsv: "Eksportuj CSV"
    },
    form: {
        title: "Nowy pomiar",
        sys: "Skurczowe",
        dia: "Rozkurczowe",
        pulse: "Puls (BPM)",
        notes: "Notatki",
        notesPlaceholder: "np. po ćwiczeniach...",
        timestamp: "Data i godzina",
        save: "Zapisz",
        feedback: {
            optimal: "Ciśnienie jest optymalne",
            normal: "Wysokie prawidłowe (Uwaga)",
            high: "Ostrzeżenie: Za wysokie!"
        }
    },
    dashboard: {
        chartTitle: "Trendy (Ostatnie 14 dni)",
        historyTitle: "Ostatnie wpisy",
        noData: "Brak danych.",
        deleteConfirm: "Usunąć ten wpis?",
        trendWarningTitle: "Ostrzeżenie: Krytyczny trend!",
        trendWarningDesc: "Średnia z ostatnich 3 pomiarów wskazuje na rosnące ciśnienie."
    },
    common: {
        unit: "mmHg",
        bpm: "BPM"
    },
    auth: {
        loginTitle: "Logowanie",
        registerTitle: "Rejestracja",
        email: "E-mail",
        password: "Hasło",
        passwordConfirm: "Potwierdź hasło",
        loginBtn: "Zaloguj się",
        registerBtn: "Utwórz konto",
        logoutBtn: "Wyloguj",
        switchToRegister: "Nie masz konta? Zarejestruj się tutaj",
        switchToLogin: "Masz już konto? Zaloguj się tutaj",
                error: "Błąd podczas zapisywania profilu.",
        emailPending: "Profil zaktualizowany. Sprawdź nowy e-mail (zobacz mail.log).",
                passwordMismatch: "Hasła nie są identyczne",
        registerSuccess: "Rejestracja zakończona sukcesem. Proszę się zalogować.",
        twoFactorTitle: "Uwierzytelnianie dwuskładnikowe",
        twoFactorLabel: "6-cyfrowy kod (sprawdź mail.log)",
        verifyCodeBtn: "Weryfikuj kod",
        backToLoginBtn: "Wróć do logowania",
        codeSent: "Kod wysłany na Twój email (sprawdź mail.log).",
        registerSuccessMail: "Rejestracja udana. Sprawdź mail.log, by znaleźć link.",
        verifyTitle: "Weryfikacja konta",
        verifying: "Weryfikowanie linku...",
        verifySuccess: "Sukces!",
        verifyFailed: "Weryfikacja nie powiodła się",
        verifyContinueBtn: "Przejdź do logowania",
        verifyGoLoginBtn: "Idź do logowania"
    },
    admin: {
        title: "Panel administratora",
        openAdmin: "Strefa administratora",
        backToApp: "Wróć do aplikacji",
        id: "ID",
        email: "E-mail",
        role: "Rola",
        registered: "Zarejestrowano",
        actions: "Akcje",
        delete: "Usuń",
        promote: "Zrób administratorem",
        confirmDelete: "Naprawdę usunąć tego użytkownika?",
                confirmPromote: "Naprawdę nadać temu użytkownikowi uprawnienia administratora?",
        globalSettings: "Ustawienia globalne",
        strictPasswordTitle: "Rygorystyczna polityka haseł",
        strictPasswordDesc: "Wymaga 12+ znaków, duże/małe litery, cyfry, znaki specjalne.",
        twoFactorTitle: "Uwierzytelnianie dwuskładnikowe (2FA)",
        twoFactorDesc: "Wymuś 2FA przez e-mail dla wszystkich użytkowników.",
        settingsSaved: "Ustawienia zapisane pomyślnie."
    },
    profile: {
        title: "Mój profil",
        changeEmail: "Adres e-mail",
        changePassword: "Nowe hasło (opcjonalnie)",
        currentPassword: "Obecne hasło (wymagane)",
        save: "Zapisz profil",
        success: "Profil zaktualizowany pomyślnie.",
        error: "Błąd podczas zapisywania profilu."
    }
};
