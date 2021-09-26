const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.fileSizeLimit = options.limit;
    this.writtenFileSize = 0;
  }

  async _transform(chunk) {
    this.writtenFileSize = this.writtenFileSize + chunk.length;

    if (this.fileSizeLimit < this.writtenFileSize) {
      throw new LimitExceededError();
    }

    await this.push(chunk);
  }
}

module.exports = LimitSizeStream;
