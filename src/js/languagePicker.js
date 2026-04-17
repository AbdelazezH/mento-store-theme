// languagePicker.js
export default (
    isLangPickerVisible,
    currentLang,
    defaultLang,
    languages
) => ({
    open: false,
    currentLang: currentLang,
    defaultLang: defaultLang,
    languages: languages,
    currentPath: window.location.pathname,
    get showLangPicker() {
        return this.languages.length > 1 && isLangPickerVisible === 'true';
    },
    get shouldUseDropdown() {
        return this.languages.length > 2;
    },
    generateUrl(language) {
        // If the selected language is the current one, return the current path
        if (language === this.currentLang) {
            return this.currentPath; // Return the current path without modification
        }

        // Create a base path from the current path
        let newPath = this.currentPath;

        // Check if switching to the default language
        if (language === this.defaultLang) {
            newPath = this.handleDefaultLanguage(newPath);

            // If the new path is the root, return it immediately
            if (newPath === '/') {
                return newPath;
            }
        } else {
            // Add the new language code to the path
            newPath = this.addNewLanguage(language, newPath);
        }

        // Clean up the path: ensure no double slashes and remove trailing slash if on home page
        return this.cleanPath(newPath);
    },
    handleDefaultLanguage(path) {
        // If current path is the home page in a specific language, redirect to the root
        if (path === `/${this.currentLang}` || path === '') {
            return '/'; // Redirect to home page
        }

        // Remove the current language from the path
        return this.removeCurrentLang(path);
    },
    addNewLanguage(language, path) {
        // Add the new language code to the path
        return `/${language}${path}`;
    },
    removeCurrentLang(path) {
        // Define a function to remove the current language from the path
        return path.replace(`/${this.currentLang}`, '');
    },
    cleanPath(path) {
        // Clean up the path: ensure no double slashes and remove trailing slash if on home page
        return path.replace(/\/{2,}/g, '/').replace(/\/$/, ''); // Remove double slashes and trailing slash
    }
});