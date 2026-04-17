# Shopify Theme Development with NPM and Shopify CLI

This project is a Shopify theme built with modern development tools and workflows. It leverages **npm** for dependency management and **Shopify CLI** for theme management.

---

## Features
- **Tailwind CSS** for styling
- **Alpine.js** for reactive components
- Integration of **Swiper.js** for sliders
- Support for ES6+ JavaScript
- Live reloading with Shopify CLI
- Optimized build process for production

---

## Prerequisites

Before starting, ensure you have the following installed:
- **Node.js** (v18 or later) and npm
- **Shopify CLI**: [Installation Guide](https://shopify.dev/docs/api/shopify-cli)
- A Shopify store with admin access
- Basic knowledge of Liquid and Shopify's templating system

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/IhsenMostapha/aquarium-shopify.git
cd aquarium-shopify
```

### 2. Install Dependencies
Run the following command to install required npm packages:
```bash
npm install
```

### 3. Authenticate Shopify CLI
Log in to your Shopify store using Shopify CLI:
```bash
shopify login
```

---

## Development Workflow

### 1. Start the Shopify Development Server
Run the following command to serve your theme locally with live reloading:
```bash
shopify theme dev
```
This will:
- Sync changes to your Shopify development theme
- Provide a live preview URL for testing

### 2. Start Asset Watching
Run the following command in a new terminal to watch and compile assets:
```bash
npm run dev
```
This will:
- Compile Tailwind CSS and JavaScript
- Watch for changes in your source files
- Automatically rebuild the assets when changes are detected

### 3. Build for Production
To prepare your theme for production, run:
```bash
npm run build
```
This will:
- Minify assets
- Optimize CSS and JavaScript for production
- Output the final theme files to the `assets` folder


---

## Scripts

Here are the npm scripts available for development and production:

- `npm run dev`: Start the development workflow with file watching and asset compilation.
- `npm run build`: Build optimized assets for production.

---

## Recommended Tools

- **VS Code**: A lightweight code editor with excellent Liquid support.
- **Shopify CLI**: Use for theme previewing, live reload, and deploying themes.
