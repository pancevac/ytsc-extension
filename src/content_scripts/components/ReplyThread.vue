<template>
  <div class="ytcs-comment ytcs-flex">
    <div>
      <a class="ytcs-user-image"
         :href="reply.authorChannelUrl"
         :style="{ 'background-image': 'url(' + reply.authorProfileImageUrl + ')' }"
         target="_blank"></a>
    </div>
    <div class="ytcs-flex-item">
      <div class="ytcs-comment-header ytcs-box">
        <div class="ytcs-box">
          <a class="ytcs-author-name"
             :href="reply.authorChannelUrl"
             target="_blank">{{ reply.authorName }}
          </a>
        </div>
        <div class="ytcs-comment-meta">
          <a class="ytcs-comment-date"
             :href="reply.commentUrl"
             target="_blank">{{ reply.publishedAt }}</a>
        </div>
      </div>
      <div
        class="ytcs-comment-text"
        v-bind:class="{ 'ytcs-trimmed': !this.expanded }"
        dir="ltr"
        lang="en"
        role="commentText"
        @click="expand"
        v-html="getHighLightedHtml()"
      >
      </div>
      <div
        v-if="reply.likeCount > 0"
        class="ytcs-comment-likes ytcs-box"
      >
        <div class="ytcs-box">
          <img class="ytcs-comment-likes-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABCElEQVR4nO2UsWoCQRCGvwTrdJZRi0Bs0gesBQsfII2vYJfSN7CxkJAQENHUaVLYWOQFfAetbBKSQiRwajj4D5Yld7fn7UECGViY2Zv5v2GZG/hltgbegAlQ9y1+ARyM8wlc+QR0JDwHnuS/+ATcS/QWOJP/4Uu8CwQSbQBl+e95hUvAUGJ7oAecAE3dLfKIh88wk9AWuDG+9XU/yCIYTUdkz4rD0bw27k+BpTVR5lkBLRfAl+KalddOEDchqQA7drXYuj8BOFfNpijAnWqmRQAqGowgbhHmBTwoP9y0+AZUje4viwA8KneclHQsoOrS/U+CK4c/1jyjtE5sQMsRsgNetcL/jcz2DT1MixkpDKX3AAAAAElFTkSuQmCC">
        </div>
        <div 
          class="ytcs-comment-meta ytcs-comment-likes-number"
        >{{ reply.likeCount }}</div>
        </div>
    </div>
  </div>
</template>

<script>
  import { getHighLighted } from '../../utils/highLighter'

  export default {
    name: "ReplyThread",

    props: {
      reply: {
        type: Object
      },
      videoId: {
        type: String
      },
      searchTerm: {
        type: String
      }
    },

    data() {
      return {
        expanded: false,
        query: this.searchTerm
      }
    },

    methods: {
      /**
       * Expand text comment if not expanded, only once.
       */
      expand() {
        if (!this.expanded) {
          this.expanded = true
        }
      },

      getHighLightedHtml() {
        return getHighLighted(this.reply.textDisplay, this.query)
      }
    }
  }
</script>