// quickViewModal.js
export default () => ({
    // State
    open: false,
    loading: false,
    product: {},
    selectedVariant: {},
    selectedOptions: {},
    hasRatingBadge: false,

    // Computed properties
    get isAvailable() {
        return this.selectedVariant.available;
    },
    get buttonText() {
        return this.isAvailable ? this.getButtonText('textAddToCart') : this.getButtonText('textOutOfStock');
    },
    get limitedMedia() {
        return this.product?.media?.slice(0, 3) ?? [];
    },
    get hasMultipleVariants() {
        return this.product.variants?.length > 1;
    },


    openModal(event) {
        this.startLoading();
        this.open = true; // open the modal

        const {productHandle, optionsWithValues} = event.detail;

        this.fetchProductData(productHandle)
            .then(product => {
                this.setupProduct(product, optionsWithValues);
                this.$nextTick(() => this.insertRatingBadgeHTML());
            })
            .catch(error => {
                this.handleError(error);
            })
            .finally(() => {
                this.stopLoading();

                this.$nextTick(() => {
                    if (this.hasRatingBadge) {
                        this.$focus.focus(this.$focus.focusables()[2]);
                    } else {
                        this.$focus.next();
                    }

                    this.initSwiper();
                });
            });
    },

    addToCart(event) {
        event.preventDefault();
        this.startLoading();

        // Create FormData from the form
        const form = event.target;
        const formData = new FormData(form);
        const notificationMessage = form.dataset.message;

        this.addItemToCart(formData)
            .then(cartItem => {
                this.closeModal();

                // Dispatch cart update and notification after a brief delay
                this.dispatchCartEvents(cartItem, notificationMessage);
            })
            .catch(error => console.error('Error adding to cart:', error))
            .finally(() => {
                this.stopLoading();
            });
    },

    closeModal() {
        this.open = false;

        setTimeout(() => {
            this.product = {};
            this.selectedVariant = {};
            this.selectedOptions = {};
            this.hasRatingBadge = false;
        }, 300);
    },

    fetchProductData(productHandle) {
        return fetch(`/products/${productHandle}.js`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch product data');
                }
                return res.json();
            });
    },

    setupProduct(product, optionsWithValues) {
        this.product = product;
        this.product.optionsWithValues = optionsWithValues;
        this.selectedVariant = this.getAvailableVariant();
        this.initializeSelectedOptions();
    },

    getAvailableVariant() {
        return this.product.variants.find(variant => variant.available) || this.product.variants[0];
    },

    initializeSelectedOptions() {
        this.product.optionsWithValues.forEach((option, index) => {
            this.selectedOptions[option.name] = this.selectedVariant.options[index];
        });
    },

    // Helper method to handle the fetch request for adding items to the cart
    addItemToCart(formData) {
        return fetch('/cart/add.js', {
            method: 'POST',
            body: formData,
        }).then(res => {
            if (!res.ok) {
                throw new Error('Failed to add item to cart');
            }
            return res.json();
        });
    },

    // Helper method to dispatch the item count update and notification events
    dispatchCartEvents(cartItem, notificationMessage) {
        setTimeout(() => {
            // Dispatch item count update event
            window.dispatchEvent(new CustomEvent('item-count-updated', {
                detail: {itemCount: cartItem.quantity}
            }));

            // Dispatch notification event
            window.dispatchEvent(new CustomEvent('item-added', {
                detail: {item: cartItem, message: notificationMessage}
            }));
        }, 300);
    },

    // Core methods
    selectOption(optionName, value) {
        this.selectedOptions[optionName] = value;
        this.updateSelectedVariant();
    },
    findMatchingVariant() {
        return this.product.variants.find(variant =>
            Object.keys(this.selectedOptions).every(optionName =>
                variant.options.includes(this.selectedOptions[optionName])
            )
        );
    },
    updateSelectedVariant() {
        const matchingVariant = this.findMatchingVariant();
        if (matchingVariant) {
            this.selectedVariant = matchingVariant;
        }
    },

    initSwiper() {
        const swiperContainer = this.$refs.quickViewSwiper;

        if (swiperContainer) {
            new window.Swiper(swiperContainer, {
                modules: [window.SwiperPagination, window.SwiperNavigation],
                pagination: {
                    el: swiperContainer.querySelector('.swiper-pagination'),
                    type: 'fraction',
                    clickable: true,
                },
                navigation: {
                    nextEl: swiperContainer.querySelector('.swiper-button-next'),
                    prevEl: swiperContainer.querySelector('.swiper-button-prev'),
                },
                slidesPerView: 1,
                spaceBetween: 10,
            });
        }
    },

    // Helper methods
    getButtonText(ref) {
        return this.$refs.submitButton.dataset[ref];
    },
    isFeaturedMedia(index) {
        return index === 0;
    },
    isImage(media) {
        return media.media_type === 'image';
    },
    formatMoney(value, currencyCode = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode
        }).format(value / 100);
    },
    startLoading() {
        this.loading = true;
    },
    stopLoading() {
        this.loading = false;
    },
    handleError(error) {
        console.error('An error occurred:', error);
    },
    insertRatingBadgeHTML() {
        const ratingBadgeElement = document.querySelector(`.product-${this.product.id}-rating-badge`);
        const ratingBadgeContainer = this.$el.querySelector('#product-rating__badge');

        if (!ratingBadgeElement || !ratingBadgeContainer) return;
        ratingBadgeContainer.innerHTML = ratingBadgeElement.outerHTML;
        this.hasRatingBadge = true;
    }
});