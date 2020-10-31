/**
 * Filter only youtube/watch* tab events...
 * 
 * @param changeInfo 
 * @param tab 
 */
const isYoutubeTab = (changeInfo, tab) => {
  if (!changeInfo.hasOwnProperty('title')) return false
  const youtubeUrlMatchPattern = new RegExp('^((?:https:)\/\/)((?:www)\.)?((?:youtube\.com))\/watch(.*)', 'gm') 
  if (!tab.url.match(youtubeUrlMatchPattern)) return false
  return true
}

export { isYoutubeTab }