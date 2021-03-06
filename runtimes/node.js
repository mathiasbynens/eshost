var vm = require('vm');
var $ = {
  global: this,
  createRealm: function (options) {
    options = options || {};
    options.globals = options.globals || {};

    context = {
      console: console,
      require: require
    };

    for(var glob in options.globals) {
       context[glob] = options.globals[glob];
    }

    var context = vm.createContext(context);
    vm.runInContext(this.source, context);
    context.$.source = this.source;
    context.$.context = context;
    context.$.destroy = function () {
      if (options.destroy) {
        options.destroy();
      }
    };
    return context.$;
  },
  evalScript: function (code) {
    try {
      if (this.context) {
        vm.runInContext(code, this.context, {displayErrors: false});
      } else {
        vm.runInThisContext(code, {displayErrors: false});
      }

      return { type: 'normal', value: undefined };
    } catch (e) {
      return { type: 'throw', value: e };
    }
  },
  getGlobal: function (name) {
    return this.global[name];
  },
  setGlobal: function (name, value) {
    this.global[name] = value;
  },
  destroy: function() { /* noop */ },
  source: $SOURCE
};
function print() { console.log.apply(console, arguments) }
