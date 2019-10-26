import Vue from 'vue'
import App from './App'
import config from '../config'

global.browser = require('webextension-polyfill')
Vue.prototype.$browser = global.browser

window.axios = require('axios').default
window.axios.defaults.baseURL = config.apiUrl

/**
 * Init vue app. First create div tag on the bottom of body, with id
 * of app, then init Vue...
 */
function initApp({url}) {
  // Append page body with new div on which will be mounted vue app...
  let app = document.createElement('div')
  app.setAttribute('id', 'app')
  document.body.appendChild(app)

  // Extract video ID from youtube url
  const videoId = url.split('v=')[1]

  new Vue({
    el: '#app',
    data: {videoId},
    render: h => h(App)
  })
}

/**
 * Listen for the messages from the background script.
 * Call init app if not already initialized.
 */
browser.runtime.onMessage.addListener((message) => {
  if (!window.hasRun) {
    initApp(message.tab)
    window.hasRun = true
  }
})
