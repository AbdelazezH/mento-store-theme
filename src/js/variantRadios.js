import { toKebabCase } from './utils';
class VariantRadios extends HTMLElement {
    constructor() {
        super();

        this.addEventListener('change', this.onVariantChange);
    }

    onVariantChange() {
        this.updateOptions();
        this.updateMasterId();
        this.toggleAddButton(true, false, false);

        if (!this.currentVariant) {
            this.toggleAddButton(true, false, true);
        } else {
            this.setAvailability();
            this.updateURL();
            this.updateVariantInput();
            this.renderProductInfo();
        }
    }

    updateOptions() {
        const fieldSetElements = Array.from(this.querySelectorAll('fieldset'));
        this.options = fieldSetElements.map((fieldset) => {
            return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
        });
    }

    updateMasterId() {
        this.currentVariant = this.getVariantData().find((variant) => {
            return !variant.options.map((option, index) => {
                return this.options[index] === option;
            }).includes(false);
        });
    }

    updateURL() {
        if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
        window.history.replaceState({}, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
    }

    updateVariantInput() {
        const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}`);
        productForms.forEach((productForm) => {
            const input = productForm.querySelector('input[name="id"]');
            input.value = this.currentVariant.id;
            input.dispatchEvent(new Event('change', {bubbles: true}));
        });
    }

    renderProductInfo() {
        const fetchUrl = `${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`;

        fetch(fetchUrl)
            .then((response) => response.text())
            .then((responseText) => {
                const id = `price-${this.dataset.section}`;
                const html = new DOMParser().parseFromString(responseText, 'text/html')

                const destination = document.getElementById(id);
                const source = html.getElementById(id);
                if (source && destination) destination.innerHTML = source.innerHTML;

                this.toggleAddButton(!this.currentVariant.available, true);
            });
    }

    toggleAddButton(disable = true, changeText = false, modifyClass = true) {
        const productForm = document.getElementById(`product-form-${this.dataset.section}`);
        if (!productForm) return;
        const addButton = productForm.querySelector('[name="add"]');
        const addButtonText = productForm.querySelector('[name="add"] > span');

        if (!addButton) return;

        if (disable) {
            addButton.setAttribute('disabled', 'disabled');
            if (changeText) addButtonText.textContent = addButton.dataset.textOutOfStock;
        } else {
            addButton.removeAttribute('disabled');
            addButtonText.textContent = addButton.dataset.textAddToCart;
        }

        if (!modifyClass) return;
    }

    setAvailability() {
        if (!this.currentVariant.available) {
            this.options.forEach(opt => {
                const elmId = `${this.dataset.section}-${toKebabCase(opt)}`;
                const elm = document.getElementById(elmId);
                if (!elm) return;
                elm.classList.add('not-available');
            });
        } else {
            const notAvailableElements = document.querySelectorAll('.not-available');
            notAvailableElements.forEach(elm => {
                elm.classList.remove('not-available');
            })
        }
    }

    getVariantData() {
        this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
        return this.variantData;
    }
}

customElements.define('variant-radios', VariantRadios);