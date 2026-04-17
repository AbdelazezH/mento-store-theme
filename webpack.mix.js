let mix = require('laravel-mix');
const tailwindcss = require('tailwindcss')

mix.js('src/js/app.js', 'assets')
    .sass('src/sass/app.scss', 'assets')
    .options({
        processCssUrls: false,
        postCss: [ tailwindcss('tailwind.config.js') ],
        terser: {
            extractComments: false,
            terserOptions: {
                format: {
                    comments: false,
                }
            }
        }
    }).disableSuccessNotifications();

