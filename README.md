# Markdown Site Map Generator Plugin

> Generate Site Map from markdown

## Installation

Node.js

```bash
npm install markdown-rss-generator-webpack-plugin
```

## Usage Example (ES6)

In your Webpack Config file

```javascript
const MarkdownSiteMapGeneratorPlugin = require("markdown-sitemap-generator-webpack-plugin").default;

//define the options
const option = {
      host: Config.url,
      links: [], //links that you also want to include in the site map
      route: "/items",
      outputPath:"sitemap.txt"
    }

//In the plugin section

 plugins: [
  new MarkdownSiteMapGeneratorPlugin(option)
 ]

```
