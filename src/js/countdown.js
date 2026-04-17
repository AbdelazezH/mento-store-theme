// countdown.js
export default (
    endDate = '',
    autoplay = true,
    showDays = true
) => ({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    endTime: null,
    now: new Date().getTime(),
    timeLeft: 0,

    init() {
        this.$nextTick(() => {
            this.initCountdown();
        })
    },

    initCountdown: function () {
        if (endDate === '' || endDate === undefined) {
            this.endTime = new Date(Date.now()).getTime();
        } else {
            this.endTime = new Date(endDate).getTime();
        }

        if (autoplay) {
            this.countdown();
        } else {
            this.updateCountdown();
        }
    },

    updateCountdown: function () {
        this.now = new Date().getTime();
        this.timeLeft = (this.endTime - this.now) / 1000;
        this.seconds = this.format(this.timeLeft % 60);
        this.minutes = this.format((this.timeLeft / 60) % 60);

        if (showDays) {
            this.hours =
                this.format((this.timeLeft / (60 * 60)) % 24);
            this.days = this.format(
                this.timeLeft / (60 * 60 * 24)
            );
        } else {
            this.hours = this.format(
                this.timeLeft / (60 * 60)
            );
        }

    },

    countdown: function () {
        let counter = setInterval(() => {
            this.updateCountdown();
            if (this.timeLeft <= 0) {
                clearInterval(counter);
                this.seconds = '00';
                this.minutes = '00';
                this.hours = '00';
                this.days = '00';
            }
        }, 1000);
    },
    format: function (value) {
        if (value < 10) {
            return '0' + Math.floor(value);
        } else return Math.floor(value);
    }
});