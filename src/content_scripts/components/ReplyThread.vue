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
        responder=""
        @click="expand"
        v-html="reply.textDisplay"
      >
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ReplyThread",

    props: {
      reply: {
        type: Object
      },
      videoId: {
        type: String
      }
    },

    data() {
      return {
        expanded: false
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
      }
    }
  }
</script>