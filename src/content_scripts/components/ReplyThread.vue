<template>
  <div class="cse-comment cse-flex">
    <div>
      <a class="cse-user-image"
         :href="reply.authorChannelUrl"
         :style="{ 'background-image': 'url(' + reply.authorProfileImageUrl + ')' }"
         target="_blank"></a>
    </div>
    <div class="cse-flex-item">
      <div class="cse-comment-header cse-box">
        <div class="cse-box">
          <a class="cse-author-name"
             :href="reply.authorChannelUrl"
             target="_blank">{{ reply.authorName }}
          </a>
        </div>
        <div class="cse-comment-meta">
          <a class="cse-comment-date"
             :href="reply.commentUrl"
             target="_blank">{{ reply.publishedAt }}</a>
        </div>
      </div>
      <div
        class="cse-comment-text"
        v-bind:class="{ 'cse-trimmed': !this.expanded }"
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