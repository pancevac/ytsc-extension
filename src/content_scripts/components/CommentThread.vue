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
        <div
          v-if="comment.likeCount > 0"
          class="ytcs-comment-likes ytcs-box"
        >
          <div class="ytcs-box">
            <img class="ytcs-comment-likes-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABCElEQVR4nO2UsWoCQRCGvwTrdJZRi0Bs0gesBQsfII2vYJfSN7CxkJAQENHUaVLYWOQFfAetbBKSQiRwajj4D5Yld7fn7UECGViY2Zv5v2GZG/hltgbegAlQ9y1+ARyM8wlc+QR0JDwHnuS/+ATcS/QWOJP/4Uu8CwQSbQBl+e95hUvAUGJ7oAecAE3dLfKIh88wk9AWuDG+9XU/yCIYTUdkz4rD0bw27k+BpTVR5lkBLRfAl+KalddOEDchqQA7drXYuj8BOFfNpijAnWqmRQAqGowgbhHmBTwoP9y0+AZUje4viwA8KneclHQsoOrS/U+CK4c/1jyjtE5sQMsRsgNetcL/jcz2DT1MixkpDKX3AAAAAElFTkSuQmCC">
          </div>
          <div 
            class="ytcs-comment-meta ytcs-comment-likes-number"
          >{{ comment.likeCount }}</div>
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
