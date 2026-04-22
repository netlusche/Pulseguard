export default {
    app: {
        title: "PulseGuard",
        subtitle: "Monitorul tău personal de tensiune arterială",
        exportCsv: "Exportă CSV"
    },
    form: {
        title: "Măsurătoare nouă",
        sys: "Sistolică",
        dia: "Diastolică",
        pulse: "Puls (BPM)",
        notes: "Note",
        notesPlaceholder: "ex. după exerciții...",
        timestamp: "Data și Ora",
        save: "Salvează",
        feedback: {
            optimal: "Tensiunea arterială este optimă",
            normal: "Normal-Ridicat (Atenție)",
            high: "Avertisment: Prea mare!"
        }
    },
    dashboard: {
        chartTitle: "Tendințe (Ultimele 14 zile)",
        historyTitle: "Înregistrări recente",
        noData: "Nu există date încă.",
        deleteConfirm: "Ștergeți această înregistrare?",
        trendWarningTitle: "Avertisment: Tendință critică!",
        trendWarningDesc: "Media ultimelor 3 măsurători indică o creștere a tensiunii arteriale."
    },
    common: {
        unit: "mmHg",
        bpm: "BPM"
    },
    auth: {
        loginTitle: "Autentificare",
        registerTitle: "Înregistrare",
        email: "E-mail",
        password: "Parolă",
        passwordConfirm: "Confirmă parola",
        loginBtn: "Autentificare",
        registerBtn: "Creare cont",
        logoutBtn: "Deconectare",
        switchToRegister: "Nu ai cont? Înregistrează-te aici",
        switchToLogin: "Deja înregistrat? Autentifică-te aici",
                error: "Eroare la salvarea profilului.",
        emailPending: "Profil actualizat. Te rugăm să verifici noul e-mail (vezi mail.log).",
                passwordMismatch: "Parolele nu se potrivesc",
        registerSuccess: "Înregistrare cu succes. Te rog să te autentifici.",
        twoFactorTitle: "Autentificare în 2 pași",
        twoFactorLabel: "Cod din 6 cifre (vezi mail.log)",
        verifyCodeBtn: "Verifică codul",
        backToLoginBtn: "Înapoi la autentificare",
        codeSent: "Codul a fost trimis pe e-mail (vezi mail.log).",
        registerSuccessMail: "Înregistrare cu succes. Verifică mail.log pentru link.",
        verifyTitle: "Verificarea contului",
        verifying: "Se verifică linkul...",
        verifySuccess: "Succes!",
        verifyFailed: "Verificare eșuată",
        verifyContinueBtn: "Continuă la autentificare",
        verifyGoLoginBtn: "Mergi la autentificare"
    },
    admin: {
        title: "Panou de control Administrator",
        openAdmin: "Zona Administrator",
        backToApp: "Înapoi la aplicație",
        id: "ID",
        email: "E-mail",
        role: "Rol",
        registered: "Înregistrat la",
        actions: "Acțiuni",
        delete: "Șterge",
        promote: "Fă Administrator",
        confirmDelete: "Sigur ștergi acest utilizator?",
                confirmPromote: "Ești sigur că vrei ca acest utilizator să fie admin?",
        globalSettings: "Setări globale",
        strictPasswordTitle: "Politică strictă de parole",
        strictPasswordDesc: "Necesită 12+ caractere, majuscule, minuscule, numere, caractere speciale.",
        twoFactorTitle: "Autentificare în doi pași (2FA)",
        twoFactorDesc: "Impune 2FA prin e-mail pentru toți utilizatorii.",
        settingsSaved: "Setări salvate cu succes."
    },
    profile: {
        title: "Profilul meu",
        changeEmail: "Adresa de e-mail",
        changePassword: "Parolă nouă (opțional)",
        currentPassword: "Parola curentă (obligatoriu)",
        save: "Salvează profilul",
        success: "Profil actualizat cu succes.",
        error: "Eroare la salvarea profilului."
    }
};
