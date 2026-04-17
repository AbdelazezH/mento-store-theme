// zoomableImage.js
export default (
    zoomRatio = 2,
) => ({
    isZoomed: false,
    offsetX: 0,
    offsetY: 0,
    zoomRatio: zoomRatio,

    get zoomStyles() {
        return {
            transform: this.isZoomed ? `scale(${this.zoomRatio})` : 'scale(1)',
            transformOrigin: this.isZoomed ? `${this.offsetX}px ${this.offsetY}px` : 'center center'
        };
    },

    updateMouseOffset(event) {
        if (this.isZoomed) {
            this.offsetX = event.offsetX;
            this.offsetY = event.offsetY;
        }
    },
    resetZoomState() {
        this.isZoomed = false;
    },
    toggleZoom() {
        this.isZoomed = !this.isZoomed;
    }
});