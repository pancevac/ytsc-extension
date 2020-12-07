# Browser extension for YouTube comments search 

![](https://img.shields.io/amo/users/youtube-comment-search) ![](https://img.shields.io/amo/dw/youtube-comment-search)

Simple plugin for searching YouTube video comments by keywords.

![](docs/addon-screenshot.png)

Developed using:
- [vue-web-extension template](https://github.com/Kocal/vue-web-extension)

## Requirements
- Node.js from v8

## Server side implementation (Node.js)
- [https://github.com/pancevac/ytsc-proxy](https://github.com/pancevac/ytsc-proxy)

## Build

```bash
$ git clone https://github.com/pancevac/firefox-ytsc-extension.git
$ cd firefox-ytsc-extension
$ npm install
$ npm run build
```

### `npm run build`

Build the extension into `dist` folder for **production**.

### `npm run build:dev`

Build the extension into `dist` folder for **development**.

### `npm run watch`

Watch for modifications then run `npm run build`.

### `npm run watch:dev`

Watch for modifications then run `npm run build:dev`.

It also enable [Hot Module Reloading](https://webpack.js.org/concepts/hot-module-replacement), 
which also work on firefox, but after you temporary load plugin into browser.

### Temporary loading
https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/




