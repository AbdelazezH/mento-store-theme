// cartItemCount.js
export default (
    initialCount = '0' // Default value from the template
) => ({
    // Convert the initial string count to an integer, defaulting to 0 if invalid
    itemCount: isNaN(parseInt(initialCount, 10)) ? 0 : parseInt(initialCount, 10),

    updateItemCount(event) {
        const { itemCount, action = 'increment' } = event.detail;

        // Adjust the item count based on action ('increment' or 'decrement')
        this.itemCount += (action === 'increment' ? itemCount : -itemCount);
    }
});