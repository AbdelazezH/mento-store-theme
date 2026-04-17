import './variantRadios';
import {
    initializeFeaturedCollectionSliders,
    initializeStoreFeaturesSliders,
    initializeTestimonialsSliders,
    initializeFeaturedProductSliders,
    initializeFeaturedArticlesSliders,
    initializeTeamMembersSliders,
    initializeStoreStatisticsSliders,
    initializeMobileProductGallerySliders,
    initializeThumbnailSliders
} from './sliders';

window.addEventListener('load', () => {

    initializeFeaturedCollectionSliders();
    initializeStoreFeaturesSliders();
    initializeTestimonialsSliders();
    initializeFeaturedProductSliders();
    initializeFeaturedArticlesSliders();
    initializeTeamMembersSliders();
    initializeStoreStatisticsSliders();
    initializeMobileProductGallerySliders();
    initializeThumbnailSliders();

});

document.addEventListener('shopify:section:load', (event) => {
    const updatedSectionId = event.detail.sectionId;
    const isArticlePageSlider = document.querySelector('[data-page-type="article-slider"]') !== null;

    // Check if the updated section is relevant to the featured collection
    if (updatedSectionId.includes('featured-collection') ||
        updatedSectionId.includes('featured_collection') ||
        updatedSectionId.includes('product-recommendations')) {
        initializeFeaturedCollectionSliders();
    }

    // Check if the updated section is relevant to the store features sliders
    if (updatedSectionId.includes('store-features') ||
        updatedSectionId.includes('store_features')) {
        initializeStoreFeaturesSliders();
    }

    // Check if the updated section is relevant to testimonials sliders
    if (updatedSectionId.includes('testimonials')) {
        initializeTestimonialsSliders();
    }

    // Check if the updated section is relevant to featured product sliders
    if (updatedSectionId.includes('featured-product') ||
        updatedSectionId.includes('featured_product')) {
        initializeFeaturedProductSliders();
    }

    // Check if the updated section is relevant to team members sliders
    if (updatedSectionId.includes('team-members') ||
        updatedSectionId.includes('team_members')) {
        initializeTeamMembersSliders();
    }

    // Check if the updated section is relevant to store statistics sliders
    if (updatedSectionId.includes('store-statistics') ||
        updatedSectionId.includes('store_statistics')) {
        initializeStoreStatisticsSliders();
    }

    // Check if the updated section is relevant to featured articles sliders
    if (updatedSectionId.includes('latest-articles') ||
        updatedSectionId.includes('featured_articles') ||
        isArticlePageSlider) {
        initializeFeaturedArticlesSliders();
    }

    // Check if the updated section is relevant to the thumbnail sliders
    if (updatedSectionId.includes('thumbnail-slider') ||
        updatedSectionId.includes('thumbnail_slider')) {
        initializeThumbnailSliders();
    }
});