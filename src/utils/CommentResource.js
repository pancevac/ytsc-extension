import DateParser from "./DateParser";

class CommentResource {
  constructor({id, snippet, replies}) {
    this.id = id
    this.totalReplyCount = snippet.totalReplyCount
    this.authorName = snippet.topLevelComment.snippet.authorDisplayName
    this.authorProfileImageUrl = snippet.topLevelComment.snippet.authorProfileImageUrl
    this.authorChannelUrl = snippet.topLevelComment.snippet.authorChannelUrl
    this.textDisplay = snippet.topLevelComment.snippet.textDisplay
    this.commentUrl = `https://www.youtube.com/watch?v=${snippet.videoId}&lc=${id}`
    this.publishedAt = DateParser(snippet.topLevelComment.snippet.publishedAt)
    this.likeCount = snippet.topLevelComment.snippet.likeCount
    this.replies = replies ?
      replies.comments.map((comment) => (new ReplyResource(comment)).fetch).reverse() :
      []
  }

  get fetch() {
    return this
  }
}

class ReplyResource {
  constructor({id, snippet}) {
    this.id = id
    this.parentId = snippet.parentId
    this.authorName = snippet.authorDisplayName
    this.authorProfileImageUrl = snippet.authorProfileImageUrl
    this.authorChannelUrl = snippet.authorChannelUrl
    this.textDisplay = snippet.textDisplay
    this.commentUrl = `https://www.youtube.com/watch?v=${snippet.videoId}&lc=${id}`
    this.publishedAt = DateParser(snippet.publishedAt)
    this.likeCount = snippet.likeCount
  }

  get fetch() {
    return this
  }
}

export { CommentResource, ReplyResource }