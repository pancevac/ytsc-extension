/**
 * Mark searched word
 * @param {string} sentence
 * @param {string} query
 * @returns {*|void|string}
 */
const highlight = (sentence, query) => {
  const iQuery = new RegExp(query, "ig");
  return sentence.replace(iQuery, function(matchedTxt, a, b){
    return ('<mark>' + matchedTxt + '</mark>');
  });
}

/**
 * Search through text for given words
 * @param {string} sentence
 * @param {string} words
 * @returns {null}
 */
const getHighLighted = (sentence, words) => {
  // sanitize input, trim empty spaces and split words into array
  words = words.trim().replace(/\s+/g, ' ').split(' ')
  let highlighted = null

  // iterate thought each word and search in text
  words.forEach((word) => {
    highlighted = highlight(highlighted ? highlighted : sentence, word)
  })

  return highlighted
}

export { getHighLighted }