global.browser = require('webextension-polyfill')

browser.browserAction.onClicked.addListener((tab) => {
  browser.tabs.sendMessage(tab.id, {command: 'openWindow', tab})
});

