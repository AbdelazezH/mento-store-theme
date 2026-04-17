// cart.js
export default (
    enableFreeShippingThreshold,
    freeShippingThreshold,
    initialItemCount = 0,
    showFeaturedProduct = false,
    featuredProductId = null
) => ({
    // Cart properties
    cartItems: [],
    totalItemsCount: initialItemCount,
    linesCount: 0,
    totalPrice: 0,
    loading: false,
    defaultCurrency: 'USD',

    // Free shipping properties
    enableFreeShippingThreshold: enableFreeShippingThreshold || false,
    freeShippingThreshold: freeShippingThreshold || 0,
    remainingAmount: 0,
    progressPercentage: 0,

    // Featured Product
    showFeaturedProduct: showFeaturedProduct,
    featuredProductId: featuredProductId === 'null' ? null : parseInt(featuredProductId, 10),

    init() {
        this.loadCart();

        window.addEventListener('item-added', (event) => {
            const {item} = event.detail;

            this.updateCartState({
                items: [item, ...this.cartItems],
                item_count: this.totalItemsCount + item.quantity,
                total_price: this.totalPrice + item.line_price,
                currency: this.defaultCurrency
            });

            if (this.featuredProductId && item.product_id === this.featuredProductId) {
                this.showFeaturedProduct = false;
            }
        });
    },

    // Getter to check if the cart total meets free shipping
    get meetsFreeShippingThreshold() {
        return this.totalPrice >= freeShippingThreshold * 100;
    },

    loadCart() {
        this.loading = true;
        fetch('/cart.js')
            .then(response => this.handleResponse(response))
            .catch(error => this.handleError(error));
    },

    handleResponse(response, action = null, quantity = null) {
        if (!response.ok) {
            this.loading = false;
            throw new Error('Network response was not ok');
        }
        return response.json() // Parse the JSON response
            .then(data => {
                this.updateCartState(data); // Update the entire cart state

                if (quantity && action) {
                    window.dispatchEvent(new CustomEvent('item-count-updated', {
                        detail: {itemCount: quantity, action: action}
                    }));
                }

                this.loading = false; // Reset loading state
            });
    },

    handleError(error) {
        console.error('Error fetching cart items:', error);
        this.loading = false;
    },

    updateCartState(data) {
        this.cartItems = data.items;
        this.totalItemsCount = data.item_count;
        this.linesCount = data.items.length;
        this.totalPrice = data.total_price;
        this.defaultCurrency = data.currency;

        if (this.enableFreeShippingThreshold) {
            this.calculateFreeShipping();
        }
    },

    calculateFreeShipping() {
        const freeShippingThresholdCents = this.freeShippingThreshold * 100;
        this.remainingAmount = freeShippingThresholdCents - this.totalPrice;
        this.progressPercentage = Number(((this.totalPrice / freeShippingThresholdCents) * 100).toFixed(2));
    },

    updateQuantity(lineNumber, newQuantity) {
        this.loading = true;

        // Find the current quantity of the item
        const currentItem = this.cartItems[lineNumber - 1];
        const oldQuantity = currentItem.quantity;

        // Determine the action and quantity using the new method
        const {action, quantity} = this.determineActionAndQuantity(newQuantity, oldQuantity);

        // Send a request to update the cart
        fetch('/cart/change.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({line: lineNumber, quantity: newQuantity})
        })
            .then(response => {
                this.handleResponse(response, action, quantity);

                if (currentItem.product_id === this.featuredProductId && newQuantity === 0) {
                    this.showFeaturedProduct = true;
                }
            })
            .catch(error => this.handleError(error));
    },

    determineActionAndQuantity(newQuantity, oldQuantity) {
        const action = newQuantity === 0 ? 'decrement' : (newQuantity > oldQuantity ? 'increment' : 'decrement');
        const quantity = newQuantity === 0 ? oldQuantity : Math.abs(newQuantity - oldQuantity);

        return {action, quantity};
    },

    deleteItem(index) {
        this.updateQuantity(index + 1, 0);
    },

    increment(index) {
        if (this.cartItems[index].quantity < 10) {
            this.updateQuantity(index + 1, this.cartItems[index].quantity + 1);
        }
    },

    decrement(index) {
        if (this.cartItems[index].quantity > 1) {
            this.updateQuantity(index + 1, this.cartItems[index].quantity - 1);
        }
    },

    addFeatured(event) {
        event.preventDefault();
        this.loading = true;
        const formData = new FormData(event.target);
        const notificationMessage = event.target.dataset.message;

        fetch('/cart/add.js', {
            method: 'POST',
            body: formData

        }).then(response => {
            if (!response.ok) {
                this.loading = false;
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            window.dispatchEvent(new CustomEvent('item-count-updated', {
                detail: {itemCount: 1}
            }));

            window.dispatchEvent(new CustomEvent('item-added', {
                detail: {item: data, message: notificationMessage}
            }));

            this.loading = false;
        }).catch(error => this.handleError(error));
    },

    // Method to determine if the border should be shown
    shouldShowBorder(index) {
        return this.linesCount > 1 && index < this.linesCount - 1;
    },

    // Method to determine the padding case based on item position
    getPaddingCase(index) {
        if (this.linesCount === 1) return 'single';
        if (index === 0) return 'first';
        if (index === this.linesCount - 1) return 'last';
        return 'middle';
    },

    // Generic method to truncate any string to a specific number of words
    truncateWords(text, wordLimit) {
        let words = text.split(' ');
        return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
    },

    formatMoney(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: this.defaultCurrency
        }).format(value / 100);
    },
});