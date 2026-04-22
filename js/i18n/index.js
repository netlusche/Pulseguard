import de from './de.js';
import en from './en.js';
import tr from './tr.js';
import ru from './ru.js';
import pl from './pl.js';
import uk from './uk.js';
import ro from './ro.js';
import ar from './ar.js';

const messages = { de, en, tr, ru, pl, uk, ro, ar };

export const initI18n = (Vue) => {
    // Determine language: localStorage -> browser -> default 'de'
    const savedLang = localStorage.getItem('pulseguard_lang');
    const browserLang = navigator.language.split('-')[0];
    const defaultLang = savedLang || (messages[browserLang] ? browserLang : 'de');
    
    const locale = Vue.ref(defaultLang);
    
    // Set initial dir
    document.documentElement.dir = defaultLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = defaultLang;
    
    const t = (path) => {
        const keys = path.split('.');
        let current = messages[locale.value];
        for (const key of keys) {
            if (current[key] === undefined) return path;
            current = current[key];
        }
        return current;
    };
    
    const setLocale = (newLocale) => {
        if (messages[newLocale]) {
            locale.value = newLocale;
            localStorage.setItem('pulseguard_lang', newLocale);
            document.documentElement.lang = newLocale;
            document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
        }
    };

    return { locale, t, setLocale, availableLocales: Object.keys(messages) };
};
