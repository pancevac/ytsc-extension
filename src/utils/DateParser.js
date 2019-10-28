/**
 * Format date timestamp into 'day/s ago...'
 *
 * @param {number} date
 * @returns {string}
 */
const timeSince = function (date) {

  let seconds = Math.floor((new Date() - date) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

/**
 * Parse RCF3339 time format into timestamp.
 *
 * @param {string} rfc
 * @return {number}
 */
const parseRFCDate = function (rfc) {
  return Date.parse(rfc)
}

/**
 * Format given date into user friendly form.
 *
 * @param date
 * @returns {string}
 */
const formatDate = function (date) {
  return timeSince(parseRFCDate(date))
}

export default formatDate

