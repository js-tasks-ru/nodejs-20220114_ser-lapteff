const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.chunks = '';
  }

  _transform(chunk, encoding, callback) {
    this.chunks += chunk.toString('utf-8');
    const arrStrings = this.chunks.split(os.EOL);

    this.chunks = arrStrings.pop();

    callback(null, arrStrings.shift());
    arrStrings.forEach((str) => this.push(str));
  }

  _flush(callback) {
    callback(null, this.chunks);
  }
}

module.exports = LineSplitStream;
