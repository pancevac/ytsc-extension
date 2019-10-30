global.browser = require('webextension-polyfill')

/**
 * Notify when tab is updated (new video is loaded).
 * It will send new video ID to the content script.
 *
 * @param tabId
 * @param title
 * @param tabInfo
 */
const notifyOnUpdatedTab = (tabId, {title}, tabInfo) => {
  if (title) {
    browser.tabs.sendMessage(tabId, {
      status: 'pageChanged',
      tabId: tabId,
      videoId: tabInfo.url.split('v=')[1].split('&')[0] // extract video ID from youtube url
    })
  }
}

/**
 * Notify current active tab when user click on action button.
 */
browser.browserAction.onClicked.addListener((tab) => {
  browser.tabs.sendMessage(tab.id, {command: 'openWindow', tab})
});

/**
 * Register listener for url changes (page title).
 * When change occurs, trigger function for notifying content script (vue instance).
 */
browser.tabs.onUpdated.addListener(notifyOnUpdatedTab, {
  urls: ['https://www.youtube.com/watch*'],
  properties: ['title'],
})

