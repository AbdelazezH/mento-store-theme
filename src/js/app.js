import Alpine from 'alpinejs'
import focus from '@alpinejs/focus'
import persist from '@alpinejs/persist'
import collapse from '@alpinejs/collapse'
import Countdown from "./countdown";
import videoPlayer from "./videoPlayer";
import cartItemCount from "./cartItemCount";
import productCardButtons from "./productCardButtons";
import quickViewModal from "./quickViewModal";
import languagePicker from "./languagePicker";
import Cart from "./cart";
import sortingComponent from "./sortingComponent";
import filterComponent from "./filterComponent";
import zoomableImage from "./zoomableImage";
import selectFilterDropdown from "./selectFilterDropdown";

Alpine.plugin(focus)
Alpine.plugin(persist)
Alpine.plugin(collapse)

Alpine.data('Countdown', (endDate, autoplay = true, showDays = true) => Countdown(endDate, autoplay, showDays));
Alpine.data('videoPlayer', (autoplay, type = 'default') => videoPlayer(autoplay, type));
Alpine.data('cartItemCount', (initialCount = '0') => cartItemCount(initialCount));
Alpine.data('productCardButtons', (available = true) => productCardButtons(available));
Alpine.data('quickViewModal', () => quickViewModal());
Alpine.data('languagePicker', (showLangPicker, currentLang, defaultLang, availableLocales) => languagePicker(showLangPicker, currentLang, defaultLang, availableLocales));
Alpine.data('Cart', (enableFreeShippingThreshold, freeShippingThreshold, initialItemCount, showFeaturedProduct, featuredProductId) => Cart(enableFreeShippingThreshold, freeShippingThreshold, initialItemCount, showFeaturedProduct, featuredProductId));
Alpine.data('sortingComponent', (initialSort, defaultSort, type = 'collection') => sortingComponent(initialSort, defaultSort, type));
Alpine.data('filterComponent', (defaultLang, currentLang, collectionHandle = '') => filterComponent(defaultLang, currentLang, collectionHandle));
Alpine.data('zoomableImage', (zoomRatio) => zoomableImage(zoomRatio));
Alpine.data('selectFilterDropdown', (persistKey, displayMode) => selectFilterDropdown(persistKey, displayMode));

window.Alpine = Alpine
Alpine.start()

import "./global"