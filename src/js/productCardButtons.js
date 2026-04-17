// productCardButtons.js
export default (
    available = true
) => ({
    copied: false,
    loading: false,
    available: available,
    copyToClipboard(textContent) {
        this.loading = true;
        navigator.clipboard.writeText(textContent)
            .then(() => {
                this.copied = true;
                setTimeout(() => this.copied = false, 2000);
            })
            .catch(error => {
                console.error('Failed to copy text: ', error);
            })
            .finally(() => {
                this.loading = false;
            });
    },
    addToCart(event) {
        event.preventDefault();
        if (!this.available) return;

        this.loading = true;
        const formData = new FormData(event.target);
        const notificationMessage = event.target.dataset.message;

        fetch('/cart/add.js', {
            method: 'POST',
            body: formData

        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            this.$dispatch('item-count-updated', {itemCount: 1});

            this.$dispatch('item-added', {message: notificationMessage});
        }).catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        }).finally(() => {
            this.loading = false;
        });
    },
    openQuickView(productHandle, optionsWithValues) {
        this.loading = true;
        setTimeout(() => {
            this.$dispatch('quick-view-open', { productHandle: productHandle, optionsWithValues: optionsWithValues });
            this.loading = false;
        }, 200)
    }
});