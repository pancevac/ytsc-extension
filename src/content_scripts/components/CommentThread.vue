<template>

  <div class="cse-thread">
    <div class="cse-comment cse-flex">
      <div>
        <a class="cse-user-image"
           :href="comment.authorChannelUrl"
           :style="{ 'background-image': 'url(' + comment.authorProfileImageUrl + ')' }"
           target="_blank"></a>
      </div>
      <div class="cse-flex-item">
        <div class="cse-comment-header cse-box">
          <div class="cse-box">
            <a class="cse-author-name"
               :href="comment.authorChannelUrl"
               target="_blank">{{ comment.authorName }}
            </a>
          </div>
          <div class="cse-comment-meta">
            <a class="cse-comment-date"
               :href="comment.commentUrl"
               target="_blank">{{ comment.publishedAt }}
            </a>
          </div>
        </div>
        <div
          class="cse-comment-text"
          dir="ltr"
          lang="en"
          role="commentText"
          v-html="comment.textDisplay"
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
    ></reply>

  </div>

</template>

<script>
  import ReplyThread from "./ReplyThread";

  export default {
    name: "CommentThread",

    props: {
      comment: {
        type: Object
      },
      videoId: {
        type: String
      }
    },

    components: { reply: ReplyThread }
  }
</script>
