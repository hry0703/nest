"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular-devkit/core");
var pluralize_1 = require("pluralize");
console.log(core_1.strings.camelize('user-controller')); // userController
console.log(core_1.strings.dasherize('userController')); // user-controller
console.log(core_1.strings.capitalize('usercontroller')); // Usercontroller
console.log(core_1.strings.classify('user-controller')); // UserController
console.log((0, pluralize_1.plural)('user')); // users
