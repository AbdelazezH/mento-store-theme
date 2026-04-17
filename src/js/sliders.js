import Swiper from "swiper";
import {Navigation, Pagination, Autoplay} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

window.Swiper = Swiper;
window.SwiperPagination = Pagination;
window.SwiperNavigation = Navigation;


// Function to destroy existing Swiper instance if it exists
function destroyExistingSwiper(sliderElm) {
    if (sliderElm.swiper) {
        sliderElm.swiper.destroy(true, true);
    }
}

// Initialize featured collection & product recommendations sliders
function initializeFeaturedCollectionSliders() {
    const sliders = document.querySelectorAll(".featured-collection__swiper, .product-recommendations__swiper");
    const previews = document.querySelectorAll(".featured-collection__preview");
    sliders.forEach(sliderElm => {
        // Destroy the old swiper instance if it exists
        destroyExistingSwiper(sliderElm);
        const autoplay = sliderElm.dataset.autoplay === "true";

        const swiperConfig = {
            modules: [Navigation, Autoplay],
            direction: 'horizontal',
            slidesPerView: 'auto',
            spaceBetween: 8,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 3,
                },
                1024: {
                    slidesPerView: 4,
                },
            },
            on: {
                init: function () {
                    this.el.classList.remove('!hidden');
                    previews.forEach(preview => {
                        preview.classList.add('hidden');
                    });

                    setTimeout(() => {
                        if (autoplay) {
                            this.autoplay.start();
                        }
                    }, 3000);
                }
            }
        };

        if (autoplay) {
            swiperConfig.autoplay = {
                delay: 3500,
                disableOnInteraction: false,
            };

            swiperConfig.loop = true;
        }

        sliderElm.swiper = new Swiper(`#${sliderElm.id}`, swiperConfig);
    });
}

// Initialize store features sliders
function initializeStoreFeaturesSliders() {
    const sliders = document.querySelectorAll(".store-features__swiper");
    const previews = document.querySelectorAll(".store-features__preview");
    sliders.forEach(sliderElm => {
        // Destroy the old swiper instance if it exists
        destroyExistingSwiper(sliderElm);

        sliderElm.swiper = new Swiper(`#${sliderElm.id}`, {
            modules: [Pagination],
            direction: 'horizontal',
            slidesPerView: 1,
            pagination: {
                el: '.swiper-pagination',
                type: 'progressbar',
            },
            on: {
                init: function () {
                    this.el.classList.remove('!hidden');
                    previews.forEach(preview => {
                        preview.classList.add('hidden');
                    });
                }
            }
        });
    });
}

// Initialize testimonials sliders
function initializeTestimonialsSliders() {
    const sliders = document.querySelectorAll(".testimonials__swiper");
    const previews = document.querySelectorAll(".testimonials__preview");
    sliders.forEach(sliderElm => {
        // Destroy the old swiper instance if it exists
        destroyExistingSwiper(sliderElm);

        const autoplay = sliderElm.dataset.autoplay === "true";

        const swiperConfig = {
            modules: [Autoplay, Pagination, Navigation],
            slidesPerView: 'auto',
            centeredSlides: true,
            speed: 600,
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            on: {
                init: function () {
                    this.el.classList.remove('!hidden');
                    this.el.classList.add('flex');

                    previews.forEach(preview => {
                        preview.classList.add('hidden');
                    });

                    setTimeout(() => {
                        if (autoplay) {
                            this.autoplay.start();
                        }
                    }, 3000);
                }
            }
        };

        if (autoplay) {
            swiperConfig.autoplay = {
                delay: 3500,
                disableOnInteraction: false,
            };

            swiperConfig.loop = true;
            swiperConfig.initialSlide = 1;
        } else {
            swiperConfig.initialSlide = 1;
        }

        sliderElm.swiper = new Swiper(`#${sliderElm.id}`, swiperConfig)
    })
}

// Initialize featured product sliders
function initializeFeaturedProductSliders() {
    const sliders = document.querySelectorAll(".featured-product__swiper");
    const previews = document.querySelectorAll(".featured-product__preview");
    sliders.forEach(sliderElm => {
        // Destroy the old swiper instance if it exists
        destroyExistingSwiper(sliderElm);

        sliderElm.swiper = new Swiper(`#${sliderElm.id}`, {
            modules: [Pagination, Navigation],
            direction: 'horizontal',
            speed: 600,
            pagination: {
                el: '.swiper-pagination',
                type: 'fraction'
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            on: {
                init: function () {
                    this.el.classList.remove('!hidden');
                    previews.forEach(preview => {
                        preview.classList.add('hidden');
                    });
                }
            }
        })
    })
}

// Initialize featured articles sliders
function initializeFeaturedArticlesSliders() {
    const sliders = document.querySelectorAll(".latest-articles__swiper");
    const previews = document.querySelectorAll(".latest-articles__preview");
    sliders.forEach(sliderElm => {
        // Destroy the old swiper instance if it exists
        destroyExistingSwiper(sliderElm);
        const autoplay = sliderElm.dataset.autoplay === "true";

        const swiperConfig = {
            modules: [Navigation, Autoplay],
            direction: 'horizontal',
            slidesPerView: 'auto',
            spaceBetween: 8,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 3,
                    spaceBetween: 11
                }
            },
            on: {
                init: function () {
                    this.el.classList.remove('!hidden');
                    previews.forEach(preview => {
                        preview.classList.add('hidden');
                    });

                    setTimeout(() => {
                        if (autoplay) {
                            this.autoplay.start();
                        }
                    }, 3000);
                }
            }
        };

        if (autoplay) {
            swiperConfig.autoplay = {
                delay: 3500,
                disableOnInteraction: false,
            };

            swiperConfig.loop = true;
        }

        sliderElm.swiper = new Swiper(`#${sliderElm.id}`, swiperConfig);
    });
}

// Initialize team members sliders
function initializeTeamMembersSliders() {
    const sliders = document.querySelectorAll(".team-members__swiper");
    sliders.forEach(sliderElm => {
        // Destroy the old swiper instance if it exists
        destroyExistingSwiper(sliderElm);
        const autoplay = sliderElm.dataset.autoplay === "true";

        const swiperConfig = {
            modules: [Autoplay, Navigation],
            direction: 'horizontal',
            slidesPerView: 'auto',
            spaceBetween: 8,
            speed: 600,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 4,
                    spaceBetween: 48
                }
            },
            on: {
                init: function () {
                    this.el.classList.remove('!hidden');

                    setTimeout(() => {
                        if (autoplay) {
                            this.autoplay.start();
                        }
                    }, 3000);
                }
            }
        };

        if (autoplay) {
            swiperConfig.autoplay = {
                delay: 3500,
                disableOnInteraction: false,
            };

            swiperConfig.loop = true;
        }

        sliderElm.swiper = new Swiper(`#${sliderElm.id}`, swiperConfig)
    });
}

// Initialize store statistics sliders
function initializeStoreStatisticsSliders() {
    const sliders = document.querySelectorAll(".store-statistics__swiper");
    sliders.forEach(sliderElm => {
        // Destroy the old swiper instance if it exists
        destroyExistingSwiper(sliderElm);
        const autoplay = sliderElm.dataset.autoplay === "true";

        const swiperConfig = {
            modules: [Autoplay, Navigation],
            direction: 'horizontal',
            slidesPerView: 2,
            spaceBetween: 8,
            speed: 600,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 4,
                    spaceBetween: 48
                }
            },
            on: {
                init: function () {
                    this.el.classList.remove('!hidden');

                    setTimeout(() => {
                        if (autoplay) {
                            this.autoplay.start();
                        }
                    }, 3000);
                }
            }
        };

        if (autoplay) {
            swiperConfig.autoplay = {
                delay: 2500,
                disableOnInteraction: false,
            };

            swiperConfig.loop = true;
        }

        sliderElm.swiper = new Swiper(`#${sliderElm.id}`, swiperConfig);
    });
}

// Initialize product gallery sliders
function initializeMobileProductGallerySliders() {
    const sliders = document.querySelectorAll(".product-gallery-mobile__swiper");
    sliders.forEach(sliderElm => {
        // Destroy the old swiper instance if it exists
        destroyExistingSwiper(sliderElm);

        sliderElm.swiper = new Swiper(`#${sliderElm.id}`, {
            modules: [Navigation, Pagination],
            direction: 'horizontal',
            slidesPerView: 1,
            spaceBetween: 10,
            pagination: {
                el: '.swiper-pagination',
                type: 'fraction',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            on: {
                init: function () {
                    this.el.classList.remove('!hidden');
                }
            }
        });
    });
}

// Initialize thumbnail sliders
function initializeThumbnailSliders() {
    const sliders = document.querySelectorAll(".thumbnail__swiper");
    const previews = document.querySelectorAll(".thumbnail__preview");
    sliders.forEach(sliderElm => {
        // Destroy the old swiper instance if it exists
        destroyExistingSwiper(sliderElm);

        const autoplay = sliderElm.dataset.autoplay === "true";
        const totalSlides = sliderElm.querySelectorAll('.swiper-slide').length;
        const mdSlidesPerView = totalSlides > 4 ? 4 : totalSlides;
        const lgSlidesPerView = totalSlides > 5 ? 5 : totalSlides;

        const swiperConfig = {
            modules: [Autoplay, Navigation],
            direction: 'horizontal',
            slidesPerView: 'auto',
            spaceBetween: 4,
            speed: 600,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: mdSlidesPerView,
                },
                1024: {
                    slidesPerView: lgSlidesPerView,
                },
            },
            on: {
                init: function () {
                    this.el.classList.remove('!hidden');
                    previews.forEach(preview => {
                        preview.classList.add('hidden');
                    });

                    setTimeout(() => {
                        if (autoplay) {
                            this.autoplay.start();
                        }
                    }, 3000);
                }
            }
        };

        if (autoplay) {
            swiperConfig.autoplay = {
                delay: 2500,
                disableOnInteraction: false,
            };

            swiperConfig.loop = true;
        }

        sliderElm.swiper = new Swiper(`#${sliderElm.id}`, swiperConfig);
    });
}

// Export functions for use in other files
export {
    initializeFeaturedCollectionSliders,
    initializeStoreFeaturesSliders,
    initializeTestimonialsSliders,
    initializeFeaturedProductSliders,
    initializeFeaturedArticlesSliders,
    initializeTeamMembersSliders,
    initializeStoreStatisticsSliders,
    initializeMobileProductGallerySliders,
    initializeThumbnailSliders
};