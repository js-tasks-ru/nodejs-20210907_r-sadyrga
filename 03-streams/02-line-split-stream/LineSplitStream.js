const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.inputBuffer = '';
  }

  _transform(chunk, encoding, callback) {
    this.inputBuffer = this.inputBuffer + chunk.toString();
    const inputBufferLines = this.inputBuffer.split(os.EOL);

    inputBufferLines.forEach((str, index) => {
      const lastBufferedLineIndex = inputBufferLines.length - 1;
      index === lastBufferedLineIndex ?
            this.inputBuffer = inputBufferLines[lastBufferedLineIndex] :
            this.push(str);
    });
    callback();
  }

  _flush(callback) {
    this.push(this.inputBuffer);
    this.inputBuffer = '';
    callback();
  }
}

module.exports = LineSplitStream;
