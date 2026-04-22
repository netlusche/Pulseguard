export default {
    app: {
        title: "PulseGuard",
        subtitle: "Your personal blood pressure tracker",
        exportCsv: "Export CSV"
    },
    form: {
        title: "New Measurement",
        sys: "Systolic",
        dia: "Diastolic",
        pulse: "Pulse (BPM)",
        notes: "Notes",
        notesPlaceholder: "e.g. after exercise...",
        timestamp: "Date & Time",
        save: "Save",
        feedback: {
            optimal: "Blood pressure is optimal",
            normal: "High-Normal (Caution)",
            high: "Warning: Too high!"
        }
    },
    dashboard: {
        chartTitle: "Trends (Last 14 Days)",
        historyTitle: "Recent Entries",
        noData: "No data available yet.",
        deleteConfirm: "Delete this entry?",
        trendWarningTitle: "Warning: Critical Trend!",
        trendWarningDesc: "The average of your last 3 measurements shows rising blood pressure."
    },
    common: {
        unit: "mmHg",
        bpm: "BPM"
    },
    auth: {
        loginTitle: "Login",
        registerTitle: "Register",
        email: "Email",
        password: "Password",
        passwordConfirm: "Confirm Password",
        loginBtn: "Sign In",
        registerBtn: "Create Account",
        logoutBtn: "Logout",
        switchToRegister: "No account yet? Register here",
        switchToLogin: "Already registered? Login here",
                error: "Error saving profile.",
        emailPending: "Profile updated. Please check your new email to verify the change (see mail.log).",
                passwordMismatch: "Passwords do not match",
        registerSuccess: "Registration successful. Please login.",
        twoFactorTitle: "2-Factor Authentication",
        twoFactorLabel: "6-Digit Code (Check mail.log)",
        verifyCodeBtn: "Verify Code",
        backToLoginBtn: "Back to Login",
        codeSent: "Code sent to your email (check mail.log).",
        registerSuccessMail: "Registration successful. Check mail.log for verification link.",
        verifyTitle: "Account Verification",
        verifying: "Verifying your link...",
        verifySuccess: "Success!",
        verifyFailed: "Verification Failed",
        verifyContinueBtn: "Continue to Login",
        verifyGoLoginBtn: "Go to Login"
    },
    admin: {
        title: "Admin Dashboard",
        openAdmin: "Admin Area",
        backToApp: "Back to App",
        id: "ID",
        email: "Email",
        role: "Role",
        registered: "Registered At",
        actions: "Actions",
        delete: "Delete",
        promote: "Make Admin",
        confirmDelete: "Really delete this user?",
                confirmPromote: "Really make this user an admin?",
        globalSettings: "Global Settings",
        strictPasswordTitle: "Strict Password Policy",
        strictPasswordDesc: "Requires 12+ chars, uppercase, lowercase, numbers, special characters.",
        twoFactorTitle: "Two-Factor Authentication (2FA)",
        twoFactorDesc: "Enforce email-based 2FA for all users on login.",
        settingsSaved: "Settings saved successfully."
    },
    profile: {
        title: "My Profile",
        changeEmail: "Email Address",
        changePassword: "New Password (optional)",
        currentPassword: "Current Password (required)",
        save: "Save Profile",
        success: "Profile updated successfully.",
        error: "Error saving profile."
    }
};
