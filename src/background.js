global.browser = require('webextension-polyfill')
const is = require('is_js')
import { isYoutubeTab } from './utils/eventFilter'

/**
 * Notify when tab is updated (new video is loaded).
 * It will send new video ID to the content script.
 *
 * @param tabId
 * @param changeInfo
 * @param tab
 */
const notifyOnUpdatedTab = (tabId, changeInfo, tab) => {
  // workaround for chrome browser because it doesn't support event filtering
  // see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onUpdated#Parameters
  if (is.chrome()) {
    if (!isYoutubeTab(changeInfo, tab)) return
  }

  if (changeInfo.title) {
    browser.tabs.sendMessage(tabId, {
      status: 'pageChanged',
      tabId: tabId,
      videoId: tab.url.split('v=')[1].split('&')[0] // extract video ID from youtube url
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
if (is.firefox()) {
  browser.tabs.onUpdated.addListener(notifyOnUpdatedTab, {
    urls: ['https://www.youtube.com/watch*'],
    properties: ['title'],
  })
} else {
  browser.tabs.onUpdated.addListener(notifyOnUpdatedTab)
}


