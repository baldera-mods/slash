'use strict';

const S = require('./string');

const PREFIX = '`';
const STRICT = true;

const map = new WeakMap;

function slash(dispatch) {
  this.dispatch = dispatch;

  if (!map.has(dispatch)) {
    map.set(dispatch, {});

    function runCommand(raw) {
      const args = S.decodeHTMLEntities(S.stripTags(raw)).split(/\s+/);
      const cmd = args[0].toLowerCase();
      const cb = map.get(dispatch)[cmd];
      if (typeof cb === 'function') {
        cb(args, raw);
        return false;
      } else if (STRICT) {
        console.error('[slash] Unrecognized command:', cmd);
        return false;
      }
    }

    function parseMessage(event) {
      const message = event.message;
      const pos = (message.startsWith('<FONT>') ? 6 : 0);
      if (message.startsWith(PREFIX, pos)) {
        return runCommand(message.slice(pos + PREFIX.length));
      } else if (message.startsWith('\\' + PREFIX, pos)) {
        event.message = message.slice(0, pos) + message.slice(pos + 1);
        return true;
      }
    }

    dispatch.hook('cChat', function cChat(event) {
      return parseMessage(event);
    });

    dispatch.hook('cWhisper', function cWhisper(event) {
      // if prefixed command, use that first
      const res = parseMessage(event);
      if (res !== undefined) {
        return res;
      // otherwise, use whisper target
      } else if (event.target[0] === '/') {
        return runCommand(event.target.slice(1) + ' ' + event.message);
      }
    });
  }
};

slash.prototype.on = function on(command, cb) {
  const cmds = map.get(this.dispatch);
  cmds[command.toLowerCase()] = cb;
};

slash.prototype.print = function print(message, formatted) {
  message += '';

  if (!formatted) {
    message = S.escapeHTML(message);
  }

  this.dispatch.toClient('sChat', {
    channel: 206,
    authorID: { high: 0, low: 0 },
    unk1: 0,
    gm: 0,
    unk2: 0,
    authorName: '',
    message: message
  });
};

module.exports = slash;
