// filterComponent.js
export default (
    defaultLang,
    currentLang,
    collectionHandle = ''
) => ({
    isLoadingProducts: false,
    isLoadingDesktopFilters: false,
    isDesktop: window.innerWidth >= 768,
    isDropdownOpen: false,
    init() {
        if (!collectionHandle) {
            this.$nextTick(() => this.focusSearchInput());
        }
    },
    applyFilters(event) {
        this.toggleLoadingState();

        const {dropdownOpen} = event.detail;

        if (dropdownOpen !== undefined) {
            this.isDropdownOpen = dropdownOpen;
        } else {
            this.isDropdownOpen = false;
        }

        this.$nextTick(() => {
            this.fetchFilteredResults(this.buildFetchUrl(event));
        });
    },
    buildFetchUrl(event) {
        const sortByParam = this.getSortByParam();
        const langPrefix = this.getLangPrefix(defaultLang, currentLang);

        if (event.detail.filterUrl) {
            return this.getCustomFilterUrl(event.detail.filterUrl, sortByParam);
        } else {
            const form = event.detail.component.$el.closest('form');
            const queryString = new URLSearchParams(new FormData(form)).toString();

            if (!collectionHandle) {
                return `${langPrefix}/search?${sortByParam ? `${sortByParam}&` : ''}${queryString}`;
            } else {
                return `${langPrefix}/collections/${collectionHandle}?${sortByParam ? `${sortByParam}&` : ''}${queryString}`;
            }
        }
    },
    getSortByParam() {
        const params = new URLSearchParams(window.location.search);

        const sortBy = params.get('sort_by');
        return sortBy ? `sort_by=${sortBy}` : '';
    },
    getLangPrefix(defaultLang, currentLang) {
        return currentLang !== defaultLang ? `/${currentLang}` : '';
    },
    getCustomFilterUrl(filterUrl, sortByParam) {
        const url = new URL(filterUrl, window.location.origin);
        if (!url.searchParams.has('sort_by') && sortByParam) {
            return filterUrl + (filterUrl.includes('?') ? '&' : '?') + sortByParam;
        }
        return filterUrl;
    },
    fetchFilteredResults(fetchUrl) {
        fetch(fetchUrl)
            .then(response => response.text())
            .then(data => this.updateDOM(data, fetchUrl))
            .catch(error => console.error('Error:', error))
            .finally(() => this.resetLoadingState());
    },
    updateDOM(data, fetchUrl) {
        const parsedHTML = new DOMParser().parseFromString(data, 'text/html');

        if (this.isDesktop) {
            this.updateContainerContent('#desktopFilters', parsedHTML);
        } else {
            this.updateContainerContent('#mobileFilters', parsedHTML);
        }

        this.updateContainerContent('#appliedFilters', parsedHTML);
        this.updateContainerContent('#productsContainer', parsedHTML);

        this.$nextTick(() => {
            if (this.isDropdownOpen) {
                this.focusInput('dropdown'); // Focus dropdown input
            } else if (!collectionHandle) {
                this.focusInput('search'); // Focus search input
            }
        });

        this.updateUrl(fetchUrl);
    },
    updateContainerContent(selector, parsedHTML) {
        const element = document.querySelector(selector);
        if (element) {
            const newContent = parsedHTML.querySelector(selector);
            if (newContent) {
                element.innerHTML = newContent.innerHTML;
            }
        }
    },
    updateUrl(fetchUrl) {
        const newUrl = new URL(fetchUrl, window.location.origin);

        history.replaceState(null, null, newUrl.search || newUrl.pathname);
    },
    toggleLoadingState() {
        if (this.isDesktop) {
            this.isLoadingDesktopFilters = true;
        } else {
            this.$dispatch('loading-start');
        }
        this.isLoadingProducts = true;
    },
    resetLoadingState() {
        this.isLoadingProducts = false;
        this.isLoadingDesktopFilters = false;
        this.$dispatch('loading-stop');
    },
    focusInput(target) {
        const selector = this.isDesktop
            ? (target === 'search' ? '#desktopFilters #Filter-q' : '#desktopFilters #dropdownSearch')
            : (target === 'search' ? '#mobileFilters #Filter-q' : '#mobileFilters #dropdownSearch');

        const input = document.querySelector(selector);

        if (input && input.offsetParent !== null) {
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length); // Move cursor to the end
        }
    }
});