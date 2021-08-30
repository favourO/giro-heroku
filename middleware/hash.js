exports.unique = String.prototype.hashCode = function(code) {
    var hash = 0, i, chr;
    if (code.length === 0) return hash;
    for (i = 0; i < code.length; i++) {
      chr   = code.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
};