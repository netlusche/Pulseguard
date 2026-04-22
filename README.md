# PulseGuard - Blood Pressure Tracker

PulseGuard is a privacy-focused, multi-lingual web application for tracking and analyzing blood pressure and pulse measurements. It features a modern, responsive Glassmorphism UI, comprehensive data visualization, and an advanced, clinically-inspired multi-tier status system for cardiovascular health monitoring.

## 🌟 Key Features

*   **Health Tracking:** Easily log Systolic, Diastolic, and Pulse measurements along with custom notes.
*   **Modern Glassmorphism UI:** A visually stunning, accessible interface utilizing dynamic blur effects, mesh gradients, and semantic color coding.
*   **Interactive Dashboards:** Historical list views and Chart.js integration (up to 30-day extended views) for long-term health monitoring.
*   **Data Portability:** 1-click CSV export of all personal measurements.
*   **Internationalization (i18n):** Full support for 8 languages (English, German, Turkish, Polish, Russian, Ukrainian, Romanian, Arabic) with automatic detection.
*   **Secure Administration:** Built-in admin dashboard with strict password policies and optional 2FA (Two-Factor Authentication).

---

## 🚦 Multi-tier Grading System & Trend Detection

PulseGuard automatically analyzes the user's recent measurements and provides immediate, color-coded feedback on their dashboard.

### 1. The 7-Day Moving Average (Static Status)
The application calculates the average of all measurements taken over the **last 7 days**. Based on medical guidelines (similar to WHO/ESC), the average is categorized into:

*   🟢 **Optimal (Green):** Average Systolic < 130 and Diastolic < 85. 
    *   *Everything is in the optimal range.*
*   🟡 **High-Normal (Yellow):** Average Systolic 130-139 or Diastolic 85-89. 
    *   *Slightly elevated. Requires monitoring.*
*   🔴 **Consistently High (Red):** Average Systolic >= 140 or Diastolic >= 90. 
    *   *Warning! A doctor's visit is recommended.*

*(Fallback: If there are fewer than 3 measurements in the last 7 days, the system safely falls back to analyzing the last 3 measurements regardless of their date).*

### 2. Acute Trend Overrides (Dynamic Status)
A static average can hide dangerous sudden spikes or positive lifestyle changes. Therefore, PulseGuard analyzes the **trend between the 3 most recent measurements**:

*   📈 **Rising Tendency (Yellow Trend):** A sudden increase of > 5 mmHg pushing the user into the High-Normal (Yellow) zone.
*   🚨 **Critical Trend (Red Trend):** A sudden, steep increase pushing the user into the Hypertension (Red) zone. This immediately overrides any static "Green" or "Yellow" averages.
*   📉 **Positive Trend (Green Trend):** A significant decrease (improvement) moving the user back into the Optimal (Green) zone.

---

## 🛠 Installation & Configuration

PulseGuard runs on a lightweight PHP 8.x + SQLite (or MySQL/MariaDB) backend, requiring no Node.js build steps for deployment.

### Requirements
- PHP 8.0 or higher
- SQLite3 or PDO_MySQL extension enabled
- PDO enabled

### 1. Configuration (`api/config.php`)
By default, PulseGuard uses a local **SQLite** database which requires zero setup. 
If you wish to use a **MySQL or MariaDB** database, you must configure this **BEFORE** running the installation:
1. Open `api/config.php`.
2. Change `DB_TYPE` from `'sqlite'` to `'mariadb'`.
3. Fill in your `DB_HOST`, `DB_NAME`, `DB_USER`, and `DB_PASS`.

### 2. Installation Steps

1. Upload the files to your web server (e.g., Apache/Nginx).
2. Ensure the `api/` directory has write permissions (so PHP can create the `database.sqlite` file if you are using SQLite).
3. Run the installation script by navigating to:
   ```text
   https://your-domain.com/install.php
   ```

### What does the `install.php` do?
*   Creates the database structure (Tables: `users`, `settings`, `measurements`) correctly for either SQLite or MySQL/MariaDB.
*   **Disables** the `strict_password_policy` and `two_factor_enabled` temporarily to allow easy first-time access.
*   Creates a default Admin User: 
    *   **Email:** `admin@user.local`
    *   **Password:** `admin`
*   Creates a default Test User with 3 months of randomized sample data to explore the charts:
    *   **Email:** `test@user.local`
    *   **Password:** `password`

> [!WARNING]
> **IMPORTANT SECURITY NOTICE**
> 1. After running `install.php`, log in immediately with the `admin@user.local` account.
> 2. Go to your Profile and **change the email address and password** to valid, secure credentials.
> 3. Go to the Admin Dashboard and **re-enable the 'Strict Password Policy' and 'Two-Factor Authentication (2FA)'**. This is strongly recommended to protect sensitive health data.
> 4. **CRITICAL:** You must delete the `install.php` file from your server immediately after completing the setup to prevent unauthorized users from resetting your database!
