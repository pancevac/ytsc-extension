import Vue from 'vue'
import App from './App'

global.browser = require('webextension-polyfill')
Vue.prototype.$browser = global.browser

/**
 * Init vue app. First create div tag on the bottom of body, with id
 * of app, then init Vue...
 */
function initApp() {
  let app = document.createElement('div')
  app.setAttribute('id', 'app')
  document.body.appendChild(app)

  new Vue({
    el: '#app',
    render: h => h(App)
  })
}

/**
 * Listen for the messages from the background script.
 * Call init app if not already initialized.
 */
browser.runtime.onMessage.addListener((message) => {
  if (!window.hasRun) {
    initApp()
    window.hasRun = true
  }
})
