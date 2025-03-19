import { strings } from '@angular-devkit/core';
import {plural} from 'pluralize';
console.log(strings.camelize('user-controller')); // userController

console.log(strings.dasherize('userController')); // user-controller

console.log(strings.capitalize('usercontroller')); // Usercontroller

console.log(strings.classify('user-controller')); // UserController

console.log(plural('user')); // users





