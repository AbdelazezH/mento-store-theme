// videoPlayer.js
export default (
    autoplay = false,
    type = 'default'
) => {
    let player = null;

    return {
        paused: !autoplay,
        hasStarted: autoplay,
        loading: true,
        timeoutId: null,

        init() {
            this.$nextTick(() => {
                this.initPlayer();
            });
        },

        initPlayer() {
            this.timeoutId = this.setLoadingTimeout(10000); // Set loading timeout

            if (type === 'vimeo') {
                this.loadVimeoAPI(); // Load Vimeo API
                this.initVimeoPlayer(); // Call the new Vimeo init method
            } else if (type === 'youtube') {
                this.loadYouTubeAPI(); // Load YouTube API
                this.initYouTubePlayer(); // Call the new YouTube init method
            } else {
                this.initHTML5Player(); // Call the new HTML5 init method
            }
        },

        // Load YouTube API script dynamically
        loadYouTubeAPI() {
            if (!window.YT) {
                const script = document.createElement('script');
                script.src = "https://www.youtube.com/iframe_api";
                script.async = true; // Set async to true
                document.body.appendChild(script);
            }
        },

        // Load Vimeo API script dynamically
        loadVimeoAPI() {
            if (!window.Vimeo) {
                const script = document.createElement('script');
                script.src = "https://player.vimeo.com/api/player.js";
                script.async = true; // Set async to true
                document.body.appendChild(script);
            }
        },


        setLoadingTimeout(time = 5000) {
            return setTimeout(() => {
                if (this.loading) {
                    console.warn('Player took too long to load, hiding spinner.');
                    this.loading = false;
                    player = null; // Set player to null to prevent further interactions
                }
            }, time); // 5 seconds as a fallback
        },

        initVimeoPlayer() {
            const checkAPILoaded = setInterval(() => {
                if (window.Vimeo && window.Vimeo.Player) {
                    clearInterval(checkAPILoaded);
                    player = new Vimeo.Player(this.$refs.videoPlayer);
                    player.on('loaded', () => {
                        clearTimeout(this.timeoutId); // Clear the timeout if loaded successfully
                        console.log('Vimeo player loaded');
                        this.loading = false; // Set loading to false when ready
                    });
                    player.on('error', (error) => {
                        clearTimeout(this.timeoutId); // Clear the timeout on error
                        console.error('Error loading Vimeo player:', error);
                        this.loading = false;
                        player = null; // Set player to null to prevent further interactions
                    });
                }
            }, 100); // Check every 100ms
        },

        initYouTubePlayer() {
            // Ensure the YouTube API is ready before initializing the player
            const checkAPILoaded = setInterval(() => {
                if (window.YT && window.YT.Player) {
                    clearInterval(checkAPILoaded);
                    player = new YT.Player(this.$refs.videoPlayer, {
                        events: {
                            'onReady': () => {
                                clearTimeout(this.timeoutId); // Clear the timeout if loaded successfully
                                console.log('YouTube player ready');
                                this.loading = false; // Player is ready
                            },
                            'onError': (error) => {
                                clearTimeout(this.timeoutId); // Clear the timeout on error
                                console.error('Error loading YouTube player:', error);
                                this.loading = false;
                                player = null; // Set player to null to prevent further interactions
                            }
                        }
                    });
                }
            }, 100); // Check every 100ms
        },

        initHTML5Player() {
            player = this.$refs.videoPlayer; // Reference to the HTML5 video element
            player.addEventListener('canplay', () => {
                clearTimeout(this.timeoutId); // Clear the timeout if loaded successfully
                console.log('HTML5 video can play');
                this.loading = false; // For native video elements
            });
            player.addEventListener('error', () => {
                clearTimeout(this.timeoutId); // Clear the timeout on error
                console.error('Error loading HTML5 video');
                this.loading = false;
                player = null; // Set player to null to prevent further interactions
            });
        },

        playPause() {
            if (this.loading) {
                console.error('Player is loading, please wait...');
                return; // Exit if player is still loading
            }

            if (!player) {
                console.error('Player is not initialized. Cannot play or pause.');
                return; // Exit if the player is null
            }

            if (this.paused) {
                this.playVideo(); // Call the play method for the respective player type
            } else {
                this.pauseVideo(); // Call the pause method for the respective player type
            }

            this.paused = !this.paused;
        },

        playVideo() {
            if (type === 'youtube') {
                player.playVideo();
                this.hasStarted = true;
            } else if (type === 'vimeo') {
                player.play();
                this.hasStarted = true;
            } else {
                player.play(); // For HTML5
            }
        },

        pauseVideo() {
            if (type === 'youtube') {
                player.pauseVideo();
            } else if (type === 'vimeo') {
                player.pause();
            } else {
                player.pause(); // For HTML5
            }
        },

        destroy() {
            clearTimeout(this.timeoutId);
            if (player) {
                if (type === 'youtube') {
                    this.destroyYouTubePlayer();
                } else if (type === 'vimeo') {
                    this.destroyVimeoPlayer();
                } else {
                    this.destroyHTML5Player();
                }
            }
        },

        destroyYouTubePlayer() {
            player.destroy(); // Clean up YouTube player
        },

        destroyVimeoPlayer() {
            player.unload(); // Clean up Vimeo player
        },

        destroyHTML5Player() {
            player.pause(); // Stop the video
            player.removeAttribute('src'); // Remove the video source
            player.load(); // Reset the video element
        }
    }
};