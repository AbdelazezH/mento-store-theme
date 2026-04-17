// selectFilterDropdown.js
export default (
    persistKey,
    displayMode
) => ({
    search: '',
    dropdownOpen: Alpine.$persist(false).as('dropdownOpen_' + persistKey),
    selectedOptions: [],
    options: [],
    highlightedIndex: -1,
    init() {
        this.initializeOptions();
        this.selectedOptions = this.options.filter(o => o.active).map(o => ({
            param_name: o.param_name,
            value: o.value
        }));

        const persistedIndex = this.getFromLocalStorage('highlightedIndex_' + persistKey);
        this.highlightedIndex = persistedIndex !== null ? persistedIndex : -1;

        this.addEscListener();
        this.addOpenListener();
    },
    get filteredOptions() {
        const lowerSearch = this.search.toLowerCase();
        return this.options
            .filter(option =>
                option.label.toLowerCase().includes(lowerSearch)
            )
            .slice(0, 10);
    },
    openDropdown() {
        const input = this.$refs.dropdownSearchRef;
        if (input) {
            input.focus();
        }

        this.dropdownOpen = true;

        this.addEscListener();
    },
    closeDropdown() {
        this.dropdownOpen = false;
        this.highlightedIndex = -1;

        this.removeFromLocalStorage('highlightedIndex_' + persistKey);
        this.removeEscListener();
    },
    isSelected(value) {
        return this.selectedOptions.some(o => o.value === value);
    },
    toggle(option) {
        const index = this.selectedOptions.findIndex(o => o.value === option.value);
        if (index >= 0) {
            this.selectedOptions.splice(index, 1); // Remove if already selected
        } else {
            this.selectedOptions.push({ param_name: option.param_name, value: option.value });
        }

        this.persistHighlightedIndex();

        this.$dispatch('filter-updated', {
            component: this,
            dropdownOpen: this.dropdownOpen
        });
    },
    initializeOptions() {
        const filterOptionsScript = document.querySelector('#filter_options_' + displayMode);
        if (filterOptionsScript) {
            this.options = JSON.parse(filterOptionsScript.textContent);
        }
    },
    highlightNext() {
        if (this.filteredOptions.length > 0) {
            this.highlightedIndex =
                (this.highlightedIndex + 1) % this.filteredOptions.length;
            this.scrollToHighlighted();
        }
    },
    highlightPrevious() {
        if (this.filteredOptions.length > 0) {
            this.highlightedIndex =
                (this.highlightedIndex - 1 + this.filteredOptions.length) %
                this.filteredOptions.length;
            this.scrollToHighlighted();
        }
    },
    scrollToHighlighted() {
        const dropdown = this.$el.querySelector(`[data-id='item-${this.highlightedIndex}']`);

        if (dropdown) {
            dropdown.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    },
    selectHighlighted() {
        if (this.highlightedIndex >= 0 && this.filteredOptions[this.highlightedIndex]) {
            this.toggle(this.filteredOptions[this.highlightedIndex]);
        }
    },
    persistHighlightedIndex() {
        this.saveToLocalStorage('highlightedIndex_' + persistKey, this.highlightedIndex);
    },
    saveToLocalStorage(key, value) {
        if (value !== undefined && value !== null) {
            localStorage.setItem(key, JSON.stringify(value));
        } else {
            console.warn(`Attempted to save undefined or null value for key: ${key}`);
        }
    },
    getFromLocalStorage(key) {
        const value = localStorage.getItem(key);
        if (value !== null) {
            return JSON.parse(value);
        }
        return null;
    },
    removeFromLocalStorage(key) {
        localStorage.removeItem(key);
    },

    // Handle ESC key press
    handleEscKey(event) {
        if (event.key === 'Escape') {
            this.closeDropdown();

            const input = this.$refs.dropdownSearchRef;
            if (input) {
                input.blur();
            }
        }
    },

    handleOpenKey(event) {
        if (event.ctrlKey && event.key === 'k') {
            event.preventDefault();
            event.stopPropagation();

            this.openDropdown();
        }
    },

    addEscListener() {
        document.addEventListener('keydown', this.handleEscKey.bind(this));
    },

    removeEscListener() {
        document.removeEventListener('keydown', this.handleEscKey.bind(this));
    },

    addOpenListener() {
        document.addEventListener('keydown', this.handleOpenKey.bind(this));
    }
});