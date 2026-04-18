class CartDrawer {
  constructor() {
    this.drawer = document.getElementById('cart-drawer');
    this.overlay = document.getElementById('cart-drawer-overlay');
    this.body = null;
    this.footer = null;
    this.loadingEl = null;
    this.isOpen = false;
    this.isLoading = false;
    this.cartData = null;
    this.previousFocusEl = null;
    this.debouncers = {};
    this.translations = {};
    this.isFetching = false;
    this.discountCode = null;
    this.appliedDiscount = null;

    // Free shipping settings (can be configured via data attributes)
    this.enableFreeShipping = false;
    this.freeShippingThreshold = 0;

    if (!this.drawer) return;
  }

  init() {
    this.body = this.drawer.querySelector('.cart-drawer-body');
    this.footer = this.drawer.querySelector('.cart-drawer-footer');
    this.loadingEl = this.drawer.querySelector('.cart-drawer-loading');

    // Free shipping configuration
    this.enableFreeShipping = this.drawer.dataset.enableFreeShipping === 'true';
    this.freeShippingThreshold = parseFloat(this.drawer.dataset.freeShippingThreshold) || 0;

    this.translations = {
      title: this.drawer.dataset.title || 'Your Cart',
      emptyText: this.drawer.dataset.emptyText || 'Your cart is empty',
      emptyBtn: this.drawer.dataset.emptyBtn || 'Shop Now',
      subtotal: this.drawer.dataset.subtotal || 'Subtotal',
      checkout: this.drawer.dataset.checkout || 'Checkout',
      viewCart: this.drawer.dataset.viewCart || 'View Cart',
      remove: this.drawer.dataset.remove || 'Remove',
      shopUrl: this.drawer.dataset.shopUrl || '/collections/all',
      freeShippingBefore: this.drawer.dataset.freeShippingBefore || 'You are',
      freeShippingAfter: this.drawer.dataset.freeShippingAfter || 'away from free shipping.',
      freeShippingReached: this.drawer.dataset.freeShippingReached || 'You have free shipping!',
      discountLabel: this.drawer.dataset.discountLabel || 'Discount code',
      discountPlaceholder: this.drawer.dataset.discountPlaceholder || 'Enter code',
      discountApply: this.drawer.dataset.discountApply || 'Apply',
      discountRemove: this.drawer.dataset.discountRemove || 'Remove',
    };

    this.bindEvents();
    // Fetch cart in background, don't block
    this.fetchCartInBackground();
  }

  bindEvents() {
    // Cart icon clicks - open immediately, fetch in background
    document.querySelectorAll('[data-cart-icon]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
        this.fetchCartInBackground();
      });
    });

    // Overlay click
    this.overlay.addEventListener('click', () => this.close());

    // Close button
    const closeBtn = this.drawer.querySelector('.cart-drawer-close');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });

    // Add-to-cart forms
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.action && form.action.includes('/cart/add')) {
        e.preventDefault();
        this.addItem(form);
      }
    });
  }

  open() {
    this.isOpen = true;
    this.previousFocusEl = document.activeElement;
    this.overlay.classList.add('is-open');
    this.drawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    const closeBtn = this.drawer.querySelector('.cart-drawer-close');
    if (closeBtn) closeBtn.focus();

    this.trapFocus();
  }

  close() {
    this.isOpen = false;
    this.overlay.classList.remove('is-open');
    this.drawer.classList.remove('is-open');
    document.body.style.overflow = '';

    this.releaseFocus();
    if (this.previousFocusEl) this.previousFocusEl.focus();
  }

  trapFocus() {
    this._focusHandler = (e) => {
      if (e.key !== 'Tab') return;
      const focusable = this.drawer.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', this._focusHandler);
  }

  releaseFocus() {
    if (this._focusHandler) {
      document.removeEventListener('keydown', this._focusHandler);
      this._focusHandler = null;
    }
  }

  setLoading(active) {
    this.isLoading = active;
    if (this.loadingEl) {
      this.loadingEl.classList.toggle('is-active', active);
    }
  }

  fetchCartInBackground() {
    if (this.isFetching) return;
    this.isFetching = true;

    fetch('/cart.js')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch cart');
        return res.json();
      })
      .then((data) => {
        this.cartData = data;
        this.renderCart(data);
      })
      .catch((err) => {
        console.error('CartDrawer: fetch error', err);
      })
      .finally(() => {
        this.isFetching = false;
      });
  }

  async fetchCart() {
    this.setLoading(true);
    try {
      const res = await fetch('/cart.js');
      if (!res.ok) throw new Error('Failed to fetch cart');
      const data = await res.json();
      this.cartData = data;
      this.renderCart(data);
    } catch (err) {
      console.error('CartDrawer: fetch error', err);
    } finally {
      this.setLoading(false);
    }
  }

  renderCart(data) {
    if (!data.items || data.items.length === 0) {
      this.renderEmpty();
      this.footer.style.display = 'none';
      return;
    }

    this.footer.style.display = '';

    // Render items
    const itemsHtml = data.items
      .map((item, index) => this.renderItem(item, index))
      .join('');

    this.body.innerHTML = `
      <div class="cart-drawer-loading">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      </div>
      <ul class="cart-drawer-items">${itemsHtml}</ul>
    `;

    this.loadingEl = this.body.querySelector('.cart-drawer-loading');

    // Rebind item events
    this.body.querySelectorAll('.cart-drawer-item').forEach((el) => {
      const idx = parseInt(el.dataset.index, 10);

      el.querySelector('[data-minus]').addEventListener('click', () => {
        this.updateQuantity(idx + 1, this.cartData.items[idx].quantity - 1);
      });

      el.querySelector('[data-plus]').addEventListener('click', () => {
        this.updateQuantity(idx + 1, this.cartData.items[idx].quantity + 1);
      });

      el.querySelector('[data-remove]').addEventListener('click', () => {
        this.updateQuantity(idx + 1, 0);
      });
    });

    // Render footer subtotal
    this.renderFooter(data);
  }

  renderItem(item, index) {
    const image = item.image
      ? `<img src="${this.getImageUrl(item.image, '160x')}" alt="${this.escapeHtml(item.title)}" loading="lazy">`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="90" fill="#e5e7eb" viewBox="0 0 72 90"><rect width="72" height="90" rx="4"/></svg>`;

    const variant = item.variant_title
      ? `<div class="cart-drawer-item-variant">${this.escapeHtml(item.variant_title)}</div>`
      : '';

    return `
      <li class="cart-drawer-item" data-index="${index}">
        <div class="cart-drawer-item-image">
          <a href="${item.url}">${image}</a>
        </div>
        <div class="cart-drawer-item-details">
          <a href="${item.url}" class="cart-drawer-item-title">${this.escapeHtml(item.product_title)}</a>
          ${variant}
          <div class="cart-drawer-item-price">${this.formatMoney(item.line_price)}</div>
          <div class="cart-drawer-item-qty">
            <button data-minus type="button" aria-label="Decrease quantity" ${item.quantity <= 1 ? 'disabled' : ''}>
              <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"/>
              </svg>
            </button>
            <span>${item.quantity}</span>
            <button data-plus type="button" aria-label="Increase quantity" ${item.quantity >= 10 ? 'disabled' : ''}>
              <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
              </svg>
            </button>
          </div>
        </div>
        <button data-remove type="button" class="cart-drawer-item-remove" aria-label="${this.translations.remove}">
          <svg class="size-4" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.2072 11.9916C25.0197 11.8042 24.7654 11.6988 24.5002 11.6988C24.235 11.6988 23.9807 11.8042 23.7932 11.9916L18.5002 17.2846L13.2072 11.9916C13.115 11.8961 13.0046 11.8199 12.8826 11.7675C12.7606 11.7151 12.6294 11.6875 12.4966 11.6864C12.3638 11.6852 12.2322 11.7105 12.1093 11.7608C11.9864 11.8111 11.8747 11.8853 11.7808 11.9792C11.6869 12.0731 11.6127 12.1848 11.5624 12.3077C11.5121 12.4306 11.4868 12.5623 11.488 12.695C11.4891 12.8278 11.5167 12.959 11.5691 13.081C11.6215 13.203 11.6977 13.3134 11.7932 13.4056L17.0862 18.6986L11.7932 23.9916C11.6111 24.1802 11.5103 24.4328 11.5125 24.695C11.5148 24.9572 11.62 25.208 11.8054 25.3934C11.9908 25.5789 12.2416 25.684 12.5038 25.6863C12.766 25.6886 13.0186 25.5878 13.2072 25.4056L18.5002 20.1126L23.7932 25.4056C23.9818 25.5878 24.2344 25.6886 24.4966 25.6863C24.7588 25.684 25.0096 25.5789 25.195 25.3934C25.3804 25.208 25.4856 24.9572 25.4879 24.695C25.4902 24.4328 25.3894 24.1802 25.2072 23.9916L19.9142 18.6986L25.2072 13.4056C25.3947 13.2181 25.5 12.9638 25.5 12.6986C25.5 12.4335 25.3947 12.1792 25.2072 11.9916Z" fill="currentColor"/>
          </svg>
        </button>
      </li>
    `;
  }

  renderFooter(data) {
    // Calculate free shipping progress
    const freeShippingCents = this.freeShippingThreshold * 100;
    const remaining = Math.max(0, freeShippingCents - data.total_price);
    const progress = Math.min(100, (data.total_price / freeShippingCents) * 100);
    const hasFreeShipping = data.total_price >= freeShippingCents;

    // Render applied discount if exists
    const discountHtml = this.appliedDiscount
      ? `
      <div class="cart-drawer-applied-discount">
        <span>${this.escapeHtml(this.appliedDiscount.code)}: -${this.formatMoney(this.appliedDiscount.amount)}</span>
        <button type="button" class="cart-drawer-discount-remove" data-remove-discount>
          ${this.translations.discountRemove || 'Remove'}
        </button>
      </div>
      `
      : '';

    // Render free shipping progress if enabled
    const freeShippingHtml = this.enableFreeShipping && this.freeShippingThreshold > 0
      ? `
      <div class="cart-drawer-free-shipping">
        <div class="cart-drawer-free-shipping-text ${hasFreeShipping ? 'is-success' : ''}">
          ${hasFreeShipping
            ? this.translations.freeShippingReached
            : `${this.translations.freeShippingBefore} <span class="amount" dir="ltr">${this.formatMoney(remaining)}</span> ${this.translations.freeShippingAfter}`
          }
        </div>
        ${!hasFreeShipping ? `
        <div class="cart-drawer-progress-bar">
          <div class="cart-drawer-progress-fill" style="width: ${progress}%"></div>
        </div>
        ` : ''}
      </div>
      `
      : '';

    // Render discount input if no discount applied
    const discountInputHtml = !this.appliedDiscount
      ? `
      <div class="cart-drawer-discount">
        <input
          type="text"
          class="cart-drawer-discount-input"
          placeholder="${this.translations.discountPlaceholder}"
          id="cart-drawer-discount-input"
          autocomplete="off"
        >
        <button type="button" class="cart-drawer-discount-btn" id="cart-drawer-apply-discount">
          ${this.translations.discountApply}
        </button>
      </div>
      `
      : '';

    this.footer.innerHTML = `
      ${freeShippingHtml}
      ${discountHtml}
      ${discountInputHtml}
      <div class="cart-drawer-subtotal">
        <span class="cart-drawer-subtotal-label">${this.translations.subtotal}</span>
        <span class="cart-drawer-subtotal-value">${this.formatMoney(data.total_price)}</span>
      </div>
      <a href="/checkout" class="cart-drawer-checkout">${this.translations.checkout}</a>
      <a href="/cart" class="cart-drawer-view-cart">${this.translations.viewCart}</a>
    `;

    // Bind discount events
    this.bindDiscountEvents(data);
  }

  bindDiscountEvents(data) {
    // Apply discount
    const applyBtn = this.footer.querySelector('#cart-drawer-apply-discount');
    const discountInput = this.footer.querySelector('#cart-drawer-discount-input');

    if (applyBtn && discountInput) {
      applyBtn.addEventListener('click', () => this.applyDiscount(discountInput.value));
      discountInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.applyDiscount(discountInput.value);
        }
      });
    }

    // Remove discount
    const removeBtn = this.footer.querySelector('[data-remove-discount]');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => this.removeDiscount());
    }
  }

  async applyDiscount(code) {
    if (!code || !code.trim()) return;

    const cleanCode = code.trim().toUpperCase();
    this.setLoading(true);

    try {
      const res = await fetch('/discount/' + encodeURIComponent(cleanCode), {
        method: 'POST',
      });

      if (res.ok || res.redirected) {
        // Discount applied, fetch updated cart
        await this.fetchCart();
      } else {
        // Show error
        const input = this.footer.querySelector('#cart-drawer-discount-input');
        if (input) {
          input.style.borderColor = '#ef4444';
          setTimeout(() => {
            input.style.borderColor = '';
          }, 2000);
        }
      }
    } catch (err) {
      console.error('CartDrawer: apply discount error', err);
    } finally {
      this.setLoading(false);
    }
  }

  async removeDiscount() {
    this.setLoading(true);

    try {
      await fetch('/discount/CLEAR', {
        method: 'POST',
      });

      // Re-fetch cart to get updated totals
      await this.fetchCart();
    } catch (err) {
      console.error('CartDrawer: remove discount error', err);
    } finally {
      this.setLoading(false);
    }
  }

  renderEmpty() {
    this.body.innerHTML = `
      <div class="cart-drawer-loading">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      </div>
      <div class="cart-drawer-empty">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
        </svg>
        <p>${this.translations.emptyText}</p>
        <a href="${this.translations.shopUrl}">${this.translations.emptyBtn}</a>
      </div>
    `;
    this.loadingEl = this.body.querySelector('.cart-drawer-loading');
  }

  async addItem(form) {
    if (this.isLoading) return;

    // Open drawer immediately for instant feedback
    this.open();

    this.setLoading(true);

    try {
      const formData = new FormData(form);

      // Get the variant ID and quantity from the form
      const variantId = formData.get('id');
      const quantity = parseInt(formData.get('quantity'), 10) || 1;

      // Optimistically update the cart data
      if (this.cartData && this.cartData.items) {
        const existingItem = this.cartData.items.find(item => item.variant_id === parseInt(variantId, 10));

        if (existingItem) {
          existingItem.quantity += quantity;
          existingItem.line_price = existingItem.price * existingItem.quantity;
        } else {
          // We need to fetch the item details - do this in background
          fetch(`/products/${form.dataset.productHandle || ''}.js`)
            .then(r => r.json())
            .then(product => {
              const variant = product.variants.find(v => v.id === parseInt(variantId, 10));
              if (variant) {
                this.cartData.items.unshift({
                  id: Math.random().toString(36).substr(2, 9),
                  product_id: product.id,
                  variant_id: variant.id,
                  title: product.title,
                  product_title: product.title,
                  variant_title: variant.title || '',
                  price: variant.price,
                  line_price: variant.price * quantity,
                  quantity: quantity,
                  url: `/products/${product.handle}`,
                  image: variant.featured_image?.src || product.featured_image || ''
                });
                this.cartData.item_count += quantity;
                this.cartData.total_price += variant.price * quantity;
                this.renderCart(this.cartData);
              }
            })
            .catch(() => {
              // Fallback: fetch full cart
              this.fetchCartInBackground();
            });
        }

        this.cartData.item_count += quantity;
        this.cartData.total_price += (existingItem?.price || 0) * quantity;
        this.renderCart(this.cartData);
      }

      // Actually add the item to Shopify cart
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to add item');
      const item = await res.json();

      // Dispatch events for existing components
      window.dispatchEvent(
        new CustomEvent('item-count-updated', {
          detail: { itemCount: 1 },
        })
      );

      window.dispatchEvent(
        new CustomEvent('item-added', {
          detail: {
            item: item,
            message: this.translations.itemAdded || 'Item added to cart!',
          },
        })
      );

      // Fetch real cart state in background to ensure sync
      this.fetchCartInBackground();
    } catch (err) {
      console.error('CartDrawer: add error', err);
      // Fallback: submit form normally
      this.close();
      form.submit();
    } finally {
      this.setLoading(false);
    }
  }

  async updateQuantity(line, quantity) {
    const key = `qty-${line}`;
    if (this.debouncers[key]) clearTimeout(this.debouncers[key]);

    this.debouncers[key] = setTimeout(async () => {
      if (this.isLoading) return;
      this.setLoading(true);

      try {
        const res = await fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ line, quantity }),
        });

        if (!res.ok) throw new Error('Failed to update quantity');
        const data = await res.json();

        const oldCount = this.cartData ? this.cartData.item_count : 0;
        this.cartData = data;

        // Calculate count diff for badge
        const diff = data.item_count - oldCount;
        if (diff !== 0) {
          window.dispatchEvent(
            new CustomEvent('item-count-updated', {
              detail: {
                itemCount: Math.abs(diff),
                action: diff > 0 ? 'increment' : 'decrement',
              },
            })
          );
        }

        this.renderCart(data);
      } catch (err) {
        console.error('CartDrawer: update error', err);
      } finally {
        this.setLoading(false);
      }
    }, 300);
  }

  formatMoney(cents) {
    const currency = this.cartData ? this.cartData.currency : 'USD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(cents / 100);
  }

  getImageUrl(url, size) {
    if (!url) return '';
    return url.replace(/(\.(?:jpg|jpeg|png|gif|webp))/i, `_${size}$1`);
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str || ''));
    return div.innerHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const drawer = new CartDrawer();
  drawer.init();
});
