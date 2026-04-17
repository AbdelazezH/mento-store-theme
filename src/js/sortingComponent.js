// sortingComponent.js
export default (
    initialSort,
    defaultSort,
    type = 'collection' // search or collection
) => ({
    openSorting: false,
    isDesktop: window.innerWidth >= 1024,
    sortBy: initialSort,
    defaultSortBy: defaultSort,
    init() {
        if (type === 'search' || this.sortBy !== this.defaultSortBy) {
            this.applySorting();
        }
    },
    applySorting() {
        this.dispatchSortStarted();

        this.fetchAndUpdateProducts(this.buildFetchUrl());

        // Close only on desktop
        if (this.isDesktop) {
            this.closeSortingMenu();
        }
    },
    buildFetchUrl() {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        // Update or add `sort_by` parameter
        if (type === 'search' || this.sortBy !== this.defaultSortBy) {
            params.set('sort_by', this.sortBy);
        } else {
            params.delete('sort_by'); // Remove if sorting is default
        }

        // Ensure that only products are searched by setting type=product
        if (type === 'search') {
            params.set('type', 'product');
        }

        // Preserve the `page` parameter if it's already in the URL
        const page = params.get('page');
        if (page) {
            params.set('page', page);
        }

        return `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    },
    fetchAndUpdateProducts(url) {
        fetch(url)
            .then(response => response.text())
            .then(data => this.handleResponse(data, url))
            .catch(error => console.error('Error: ', error))
            .finally(() => this.dispatchSortCompleted());
    },
    handleResponse(data, url) {
        this.updateProductContainer(data);

        this.updateUrl(url);
    },
    updateProductContainer(data) {
        document.querySelector('#productsContainer').innerHTML = new DOMParser()
            .parseFromString(data, 'text/html')
            .querySelector('#productsContainer').innerHTML;
    },
    updateUrl(url) {
        history.replaceState(null, null, url);
    },
    toggleSort(option) {
        this.sortBy = (this.sortBy === option) ? this.defaultSortBy : option;
        this.applySorting();
    },
    dispatchSortStarted() {
        this.$dispatch('sort-started');
    },
    dispatchSortCompleted() {
        this.$dispatch('sort-completed');
    },
    openSortingMenu() {
        this.openSorting = true;
    },
    closeSortingMenu() {
        setTimeout(() => {
            this.openSorting = false;
        }, 200);
    },
    closeOnOutsideClick() {
        this.openSorting = false;
    }
});