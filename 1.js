class AppController {
    index() {
        return 'hello';
    }
}

let controller = new AppController()
console.log(Reflect.getPrototypeOf(controller) === AppController.prototype);
// console.log(Object.getOwnPropertyNames(Reflect.getPrototypeOf(controller)),);.//