<template>

  <div class="ytcs-thread">
    <div class="ytcs-comment ytcs-flex">
      <div>
        <a class="ytcs-user-image"
           :href="comment.authorChannelUrl"
           :style="{ 'background-image': 'url(' + comment.authorProfileImageUrl + ')' }"
           target="_blank"></a>
      </div>
      <div class="ytcs-flex-item">
        <div class="ytcs-comment-header ytcs-box">
          <div class="ytcs-box">
            <a class="ytcs-author-name"
               :href="comment.authorChannelUrl"
               target="_blank">{{ comment.authorName }}
            </a>
          </div>
          <div class="ytcs-comment-meta">
            <a class="ytcs-comment-date"
               :href="comment.commentUrl"
               target="_blank">{{ comment.publishedAt }}
            </a>
          </div>
        </div>
        <div
          class="ytcs-comment-text"
          dir="ltr"
          lang="en"
          role="commentText"
          v-html="getHighLightedHtml()"
        >
        </div>
      </div>
    </div>

    <reply
      v-if="comment.replies.length > 0"
      v-for="(reply, key) in comment.replies"
      :key="key"
      :video-id="videoId"
      :reply="reply"
      :search-term="searchTerm"
    ></reply>

  </div>

</template>

<script>
  import ReplyThread from "./ReplyThread";
  import { getHighLighted } from '../../utils/highLighter'

  export default {
    name: "CommentThread",

    components: { reply: ReplyThread },

    props: {
      comment: {
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
        query: this.searchTerm
      }
    },

    methods: {
      getHighLightedHtml() {
        return getHighLighted(this.comment.textDisplay, this.query)
      }
    }
  }
</script>
