slash
-----

Easy handling of slash commands.

### Users

There are two ways to use a slash command:

* `/w /command args` to send a whisper with a target starting with a slash, or
* type `` `command args `` into any chat channel

Currently the prefix `` ` `` is not settable anywhere but in the code.

### Developers

To register slash commands, instantiate an object of `Slash` passing `dispatch`
as the sole argument to the constructor, and then use
`Slash#on(command, callback)` to register a hook.

`callback` will be passed two parameters:
* `args`: the arguments for the slash command with all HTML tags removed and
  HTML entities decoded (note that `args[0]` will be the command name)
* `raw`: the original, raw text of the slash command

#### Usage Example

```js
const Slash = require('slash');

module.exports = function Example(dispatch) {
  const slash = new Slash(dispatch);

  slash.on('command', function onCommand(args, raw) {
    // ...
  });
};
```
