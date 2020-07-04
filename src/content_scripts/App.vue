<template>
  <div
    v-if="show"
    id="UIMutableView"
    style="left: 31.4024vw; top: 29.9981vh; width: 32.9995vw;"
  >
    <div class="ytcs-resize-bar ytcs-resize-top"></div>
    <div class="ytcs-resize-bar ytcs-resize-side ytcs-resize-w"></div>
    <div class="ytcs-resize-bar ytcs-resize-side ytcs-resize-e"></div>
    <div class="ytcs-resize-bar ytcs-resize-both ytcs-resize-nw"></div>
    <div class="ytcs-resize-bar ytcs-resize-both ytcs-resize-ne"></div>
    <div class="ytcs-resize-bar ytcs-drag-bar"></div>
    <div class="ytcs-window-buttons ytcs-flex ytcs-center-y">
      <div class="ytcs-window-button" @click="toggleShow">
        <svg class="ytcs-svg" viewBox="0 0 24 24">
          <path d="M1 1 L23 23 M23 1 L1 23" stroke-width="3"></path>
        </svg>
      </div>
    </div>
    <div class="ytcs-view ytcs-flex-view">
      <div class="ytcs-search-header ytcs-flex ytcs-center-y">
        <input
          v-model="searchTerm"
          @keyup.enter="submit"
          class="ytcs-input ytcs-search-input ytcs-flex-item"
          placeholder="Type keywords here" spellcheck="false"
          ref="search"
          autocomplete="off"
          :disabled="disableInput"
        >
        <button type="button" @click="submit" class="ytcs-search-button" :disabled="disableInput">Search</button>
        <div class="ytcs-comment-count">{{ formatNumber(commentCount) }} comments</div>
      </div>
      <div class="ytcs-container-view ytcs-flex-item">
        <div class="ytcs-view">
          <div class="ytcs-dialog-message">{{ responseMessage }}</div>
        </div>
        <div
          v-if="comments.length > 0"
          class="ytcs-view ytcs-scroll-view"
        >
          <p class="ytcs-thread">
            <b v-if="totalResults > 1">Search Results: {{ totalResults }}</b>
            <b v-else>Search Result: {{ totalResults }}</b>
          </p>
          <thread
            v-for="(comment, key) in comments"
            :key="key"
            :video-id="videoId"
            :comment="comment"
            :search-term="searchTerm"
          ></thread>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import config from "../config";
  import { CommentResource } from "../utils/CommentResource";
  import CommentThread from "./components/CommentThread";

  export default {

    components: { thread: CommentThread },

    data() {
      return {
        show: true,
        //searching: false,
        videoId: '',
        historyVideoId: '',
        comments: [],
        searchTerm: '',
        statistics: {},
        responseMessage: '',
        disableInput: false,
        totalResults: 0
      }
    },

    mounted() {
      this.videoId = this.$root.videoId
      this.mountListeners()
      this.fetchStatistics()
      //this.notifyBackgroundOnLoad()
      //this.$refs.search.focus() // add autofocus on search field
    },

    computed: {
      /**
       * Get total number of comments from statistics object.
       */
      commentCount() {
        return Object.keys(this.statistics).length !== 0 && this.statistics.hasOwnProperty('commentCount') ?
          this.statistics.commentCount : 0
      },
    },

    methods: {
      /**
       * Toggle plugin visibility on page.
       */
      toggleShow() {
        this.show = !this.show

        // if search window is closed, remember current videoId for later
        if (!this.show) {
          this.historyVideoId = this.videoId
        }

        // if app is already initialized and search window is closed,
        // if user open's search window again, on different video, we want to 
        // refresh statistics for current video
        if (this.show && this.videoId !== this.historyVideoId) {
          this.fetchStatistics()
        }
      },

      /**
       * Submit search term and call method for fetching comments.
       */
      submit() {
        this.fetchSearchedComments()
      },

      /**
       * Fetch video statistics, including comment count.
       */
      fetchStatistics() {
        const statParams = {
          videoId: this.videoId
        }

        this.responseMessage = ''
        this.disableInput = false
        axios.get('/videos', {params: statParams})
          .then(this.handleStatisticsResponse)
          .catch(this.handleErrorResponse)
      },

      /**
       * Put statistics response in component data.
       */
      handleStatisticsResponse({data}) {
        if (data.items.length) {
          this.statistics = data.items[0].statistics
          this.flushComments()
        }

        // check if comments on video are disabled
        if (!this.statistics.hasOwnProperty('commentCount')) {
          // if commentCount property is missing, means that comments are disabled so we need to disable input
          this.disableInput = true
          this.responseMessage = 'Comments are disabled for this video.'
        }
      },

      /**
       * Fetch video comments by search term.
       */
      fetchSearchedComments() {
        const threadParams = {
          videoId: this.videoId,
          searchTerms: this.searchTerm,
        }

        this.disableInput = true
        this.responseMessage = 'Searching...'
        this.flushComments()
        axios.get('/commentThreads', {params: threadParams})
          .then(this.handleCommentsResponse)
          .catch(this.handleErrorResponse)
      },

      /**
       * Map returned comments with replies with CommentResource class
       * into single array and load into template.
       *
       * @param data
       */
      handleCommentsResponse({data}) {
        this.disableInput = false
        if (data.items.length > 0) {
          this.totalResults = data.pageInfo.totalResults
          this.comments = data.items.map((comment) => {
            return (new CommentResource(comment)).fetch
          })
        } else {
          this.responseMessage = `Nothing found in ${this.commentCount} comments`
          this.flushComments()
        }
      },

      handleErrorResponse(err) {
        this.responseMessage = 'Ups, something went wrong...'
        this.flushComments()
        this.disableInput = false
      },

      /**
       * Listen for messages from background script (commands and status).
       * Example, if youtube page is changed, update videoId property and fetch new video statistics.
       */
      mountListeners() {
        browser.runtime.onMessage.addListener((message) => {
          if (message.command === 'openWindow') {
            this.toggleShow()
          } else if (message.status === 'pageChanged') {
            this.videoId = message.videoId
            
            // if search window is active during page change, refresh statistics
            // this will save resources(API quotas) if window is closed
            if (this.show) {
              this.fetchStatistics()
            }
          }
        })
      },

      /**
       * Notify background script when component is mounted,
       * with corresponded tab ID and window ID.
       */
      notifyBackgroundOnLoad() {
        browser.runtime.sendMessage({
          status: 'pageLoaded',
          tabId: this.$root.tabId,
          windowId: this.$root.windowId
        })
      },

      /**
       * Empty existing comments array.
       */
      flushComments() {
        this.comments = []
      },

      /**
       * Format integer number with thousand separator.
       *
       * @param num
       * @returns {string}
       */
      formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
      }
    }
  }
</script>

<style>
  @import "main.css";
</style>
