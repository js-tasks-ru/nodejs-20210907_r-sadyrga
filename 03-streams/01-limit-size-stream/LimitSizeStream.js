const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.fileSizeLimit = options.limit;
    this.writtenFileSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this.writtenFileSize = this.writtenFileSize + chunk.length;

    callback(
      this.fileSizeLimit < this.writtenFileSize ?
        new LimitExceededError() :
        null,
      chunk,
    );
  }
}

module.exports = LimitSizeStream;
