<template>
  <div
    v-if="show"
    id="UIMutableView"
    style="left: 31.4024vw; top: 29.9981vh; width: 32.9995vw;"
  >
    <div class="cse-resize-bar cse-resize-top" resize="n"></div>
    <div class="cse-resize-bar cse-resize-side cse-resize-w" resize="w"></div>
    <div class="cse-resize-bar cse-resize-side cse-resize-e" resize="e"></div>
    <div class="cse-resize-bar cse-resize-both cse-resize-nw" resize="nw"></div>
    <div class="cse-resize-bar cse-resize-both cse-resize-ne" resize="ne"></div>
    <div class="cse-resize-bar cse-drag-bar" movable="we"></div>
    <div class="cse-window-buttons cse-flex cse-center-y">
      <div class="cse-window-button" @click="toggleShow">
        <svg class="cse-svg" viewBox="0 0 24 24">
          <path d="M1 1 L23 23 M23 1 L1 23" stroke-width="3"></path>
        </svg>
      </div>
    </div>
    <div class="cse-view cse-flex-view">
      <div class="cse-search-header cse-flex cse-center-y">
        <input
          v-model="searchTerm"
          @keyup.enter="submit"
          class="cse-input cse-search-input cse-flex-item"
          placeholder="type keywords here" spellcheck="false"
          autocomplete="off"
          :disabled="disableInput"
        >
        <div class="cse-comment-count">{{ commentCount }}</div>
      </div>
      <div class="cse-container-view cse-flex-item">
        <div class="cse-view">
          <div class="cse-dialog-message">{{ responseMessage }}</div>
        </div>
        <div
          v-if="comments.length > 0"
          class="cse-view cse-scroll-view"
        >
          <thread
            v-for="(comment, key) in comments"
            :key="key"
            :video-id="videoId"
            :comment="comment"
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
        comments: [],
        searchTerm: '',
        statistics: {},
        responseMessage: '',
        disableInput: false
      }
    },

    mounted() {
      this.videoId = this.$root.videoId
      this.mountListeners()
      this.fetchStatistics()
      //this.notifyBackgroundOnLoad()
    },

    computed: {
      /**
       * Get total number of comments from statistics object.
       */
      commentCount() {
        return Object.keys(this.statistics).length !== 0 ? this.statistics.commentCount : 0
      },
    },

    methods: {
      /**
       * Toggle plugin visibility on page.
       */
      toggleShow() {
        this.show = !this.show
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
          part: 'statistics',
          id: this.videoId,
          key: config.apiKey
        }

        this.responseMessage = ''
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
      },

      /**
       * Fetch video comments by search term.
       */
      fetchSearchedComments() {
        const threadParams = {
          part: 'snippet, replies',
          videoId: this.videoId,
          searchTerms: this.searchTerm,
          maxResults: 100,
          order: 'relevance',
          key: config.apiKey
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
          this.comments = data.items.map((comment) => {
            return (new CommentResource(comment)).fetch
          })
        } else {
          this.responseMessage = `Nothing found in ${this.commentCount} comments`
          this.flushComments()
        }
      },

      handleErrorResponse(err) {
        console.log(err.response.data)
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
            this.fetchStatistics()
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
      }
    }
  }
</script>

<style>

  html {
    --cse_windowBackground: #222;
    --cse_headerBackground: #292929;
    --cse_placeholderColor: rgba(255, 255, 255, .1);
    --cse_textColor: #d6d6d6;
    --cse_linkColor: #609fff;
    --cse_metaColor: #888;
    --cse_commentChainBackground: #333;
    --cse_imgBackground: #2f2f2f;
    --cse_ownerBadgeColor: #717171;
    --cse_ccBadgeBackground: #333;
    --cse_ccBadgeColor: #777;
    --cse_ccBadgeBorderColor: transparent;
    --cse_ccBadgeColorActive: #fff;
    --cse_ccBadgeBorderColorActive: orange;
    --cse_codeSnippetBackground: #999;
    --cse_codeSnippetColor: #000;
    --cse_infoViewTextColor: #aaa;
  }
  html:not([dark="true"]):not([cse-fullscreen="true"]) {
    --cse_windowBackground: #fff;
    --cse_headerBackground: #dadada;
    --cse_placeholderColor: rgba(0, 0, 0, .29);
    --cse_textColor: #111;
    --cse_linkColor: #065fd4;
    --cse_metaColor: #888;
    --cse_commentChainBackground: #ddd;
    --cse_imgBackground: #eee;
    --cse_ownerBadgeColor: #9f9f9f;
    --cse_ccBadgeBackground: #ccc;
    --cse_ccBadgeBorderColor: transparent;
    --cse_ccBadgeColor: #555;
    --cse_ccBadgeColorActive: #222;
    --cse_ccBadgeBorderColorActive: darkcyan;
    --cse_codeSnippetBackground: #e5e5e5;
    --cse_infoViewTextColor: #222;
  }
  [hidden] {
    display: none !important;
  }
  #UIMutableView {
    background: var(--cse_windowBackground);
    color: var(--cse_textColor);
    display: block;
    position: fixed;
    z-index: 9999999999;
    width: 33vw;
    top: 30vh;
    left: 64vw;
    bottom: 0;
    transform: translateZ(0);
    box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.4);
    font-size: 14px;
    line-height: 20px;
    cursor: default;
  }
  #UIMutableView a {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
  }
  .cse-noSelect {
    user-select: none;
  }
  .cse-noScrollbar::-webkit-scrollbar {
    display: none !important;
  }
  .cse-canOverScroll::after {
    content: "";
    display: block;
    width: 100%;
    height: 60%;
  }
  .cse-view {
    background-color: var(--cse_windowBackground);
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .cse-scroll-view {
    overflow-y: scroll;
  }
  .cse-scroll-view::-webkit-scrollbar {
    display: none !important;
  }
  .cse-container-view {
    position: relative;
  }
  .cse-flex-view {
    display: flex;
    flex-flow: column;
  }
  .cse-onmove {
    pointer-events: none;
    user-select: none;
  }
  .cse-svg {
    display: block;
    fill: currentColor;
    stroke: currentColor;
    stroke-width: 0;
  }
  .cse-input {
    color: inherit;
    background: none;
    outline: none;
    border: none;
  }
  .cse-underline {
    text-decoration: underline;
  }
  .cse-box {
    display: -webkit-box;
  }
  .cse-flex {
    display: flex;
  }
  .cse-vflex {
    display: flex;
    flex-flow: column;
  }
  .cse-center-y {
    align-items: center;
  }
  .cse-center-x {
    justify-content: center;
  }
  .cse-center-xy {
    align-items: center;
    justify-content: center;
  }
  .cse-flex-item {
    flex: 1;
  }
  .cse-resize-bar {
    position: absolute;
    background-color: transparent;
  }
  .cse-resize-w {
    left: -4px;
  }
  .cse-resize-e {
    right: -4px;
  }
  .cse-resize-side {
    width: 10px;
    height: 100%;
    cursor: ew-resize;
  }
  .cse-drag-bar {
    z-index: 1;
    top: 0;
    height: 20px;
    width: 100%;
    cursor: move;
  }
  .cse-resize-top {
    z-index: 2;
    top: -4px;
    height: 8px;
    width: 100%;
    cursor: ns-resize;
  }
  .cse-resize-both {
    z-index: 3;
    top: -6px;
    width: 16px;
    height: 16px;
  }
  .cse-resize-nw {
    left: -6px;
    cursor: nwse-resize;
  }
  .cse-resize-ne {
    right: -6px;
    cursor: nesw-resize;
  }
  .cse-window-buttons {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 20px;
    height: 56px;
  }
  .cse-window-button {
    height: 14px;
    width: 14px;
    opacity: .2;
    box-sizing: border-box;
    margin-left: 10px;
  }
  .cse-window-button:hover {
    opacity: .6;
  }
  .cse-back-button {
    position: absolute;
    width: 24px;
    height: 24px;
    top: 14px;
    left: 15px;
    opacity: .6;
  }
  .cse-back-button:hover {
    opacity: 1;
  }
  .cse-search-header {
    height: 56px;
    padding-right: 52px;
    background-color: var(--cse_headerBackground);
    padding-left: 20px;
    user-select: none;
  }
  .cse-comment-count {
    background-color: var(--cse_ccBadgeBackground);
    color: var(--cse_ccBadgeColor);
    border-bottom: 2px solid var(--cse_ccBadgeBorderColor);
    border-radius: 4px;
    padding: 2px 5px 0;
    min-width: 22px;
    font-size: 12px;
    text-align: center;
    transition: border-color .25s, color .25;
  }
  .cse-comment-count.cse-active {
    color: var(--cse_ccBadgeColorActive);
    border-color: var(--cse_ccBadgeBorderColorActive);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    opacity: .7;
  }
  .cse-comment-count.cse-active:hover {
    opacity: 1;
  }
  .cse-search-input {
    width: 100%;
    font-size: 16px;
  }
  .cse-search-input::placeholder {
    color: var(--cse_placeholderColor);
    -webkit-font-smoothing: antialiased;
    font-size: 15px;
  }
  .cse-search-input:focus::placeholder {
    opacity: 0;
  }
  .cse-search-input:not(:focus)::placeholder {
    opacity: 1;
    transition: opacity .25s ease-in;
  }
  .cse-thread {
    margin-top: 16px;
    padding-left: 20px;
    padding-right: 40px;
  }
  .cse-comment {
    padding-bottom: 20px;
    position: relative;
  }
  .cse-comment:not(:first-child) {
    margin-left: 56px;
  }
  .cse-comment:not(:first-child) .cse-user-image {
    width: 24px;
    height: 24px;
  }
  .cse-chained:before {
    content: "";
    display: block;
    height: 100%;
    width: 2px;
    background: var(--cse_commentChainBackground);
    position: absolute;
    left: 11px;
    z-index: 0;
  }
  .cse-comment.cse-hidden {
    display: none;
  }
  .cse-author-name {
    color: inherit;
    font-weight: 500;
    line-height: 18px;
  }
  .cse-owner-badge {
    display: none;
    fill: var(--cse_ownerBadgeColor);
    width: 13px;
    height: 13px;
    margin-top: 2px;
    margin-left: 4px;
  }
  .byUploader .cse-owner-badge {
    display: block;
  }
  .byUploader .cse-comment-meta {
    display: none;
  }
  .cse-comment-meta {
    line-height: 18px;
    margin-left: 6px;
  }
  .cse-comment-date {
    color: var(--cse_metaColor);
  }
  .cse-comment-date:hover {
    color: inherit;
  }
  .cse-comment-text {
    display: -webkit-box;
  }
  .cse-comment-text[dir="rtl"] {
    -webkit-box-orient: vertical;
    -webkit-box-align: end;
  }
  .cse-comment-text:lang(ar) {
    font-family: sans-serif;
    font-size: medium;
  }
  .cse-comment-text a {
    color: var(--cse_linkColor) !important;
  }
  .cse-trimmed {
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-break: break-word;
  }
  .cse-user-image {
    display: block;
    background-color: var(--cse_imgBackground);
    background-size: 100%;
    width: 40px;
    height: 40px;
    margin-right: 16px;
    border-radius: 50%;
    position: relative;
  }
  .cse-comment-header {
    height: 20px;
    margin-bottom: 2px;
    font-size: 13px;
    line-height: normal;
  }
  .cse-dialog-message {
    padding: 20px;
    text-align: center;
    user-select: none;
  }
  .cse-dialog-message a {
    text-decoration: underline;
  }
  .cse-embedded-player {
    background: #000;
    position: relative;
    margin-top: 12px;
    padding-bottom: 56.25%;
  }
  .cse-embedded-frame {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .cse-info-view {
    color: var(--cse_infoViewTextColor);
    padding: 56px 20px;
    padding-right: 38px;
  }
  .cse-info-title {
    font-size: large;
    margin-bottom: 18px;
  }
  .cse-info-text {
    margin-bottom: 15px;
  }
  .cse-info-list {
    margin-bottom: 20px;
    padding-left: 25px;
  }
  .cse-info-list div {
    margin-bottom: 2px;
  }
  .cse-info-code {
    display: inline-block;
    background-color: var(--cse_codeSnippetBackground);
    color: var(--cse_codeSnippetColor);
    border-radius: 2px;
    letter-spacing: 1px;
    padding: 1px 6px 2px;
    margin: 0 3px;
    line-height: normal;
    font-size: smaller;
    font-family: monospace;
  }
</style>
