export let HANDLERS = { };

export function registerHandler(type, callback) {
  let nextHandler = HANDLERS[type] || function() { };

  HANDLERS[type] = function(message, options) {
    callback(message, options, nextHandler);
  };
}

export function invoke(type, message, test, options) {
  if (test) { return; }

  let handlerForType = HANDLERS[type];

  if (!handlerForType) { return; }

  if (handlerForType) {
    handlerForType(message, options);
  }
}
