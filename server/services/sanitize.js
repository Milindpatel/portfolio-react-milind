const sanitizeHtml = require('sanitize-html');

/** Only the tags the blog editor can produce are kept; everything else is stripped. */
const options = {
  allowedTags: ['p', 'br', 'blockquote', 'ul', 'ol', 'li', 'h1', 'h2', 'strong', 'em', 'u', 'code'],
  allowedAttributes: {},
};

exports.sanitizeStory = (html) => sanitizeHtml(String(html || ''), options);

/** Copies only the allowed keys that are present on `source`. */
exports.pick = (source, keys) =>
  Object.fromEntries(keys.filter((k) => source && source[k] !== undefined).map((k) => [k, source[k]]));
