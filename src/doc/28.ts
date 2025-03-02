// import { from } from 'rxjs'
// from 是一个创建可观察对象的函数，它可以接受各种可迭代对象（如数组、字符串等）作为参数，遍历并将它们的值作为可观察对象的输出发出。
class Observable {
    constructor(private _subscribe) { }
    // 订阅方法 接受一个观察者对象作为参数
    subscribe(observer) {
        // 调用存储的订阅方法，并将观察者对象传递给它
        return this._subscribe(typeof observer === 'function' ? { next: observer,error:()=>{},complete:()=>{} } : observer)
    }
}

// 定义一个from函数 用于创建包含指定值的可观察对象
function from(input) {
    return new Observable((observer) => {
        if(input instanceof Promise){
            input.then((value)=>{
                observer.next(value)
                observer.complete()
            }).catch((err)=>{
                observer.error(err)
            })
            return
       }else {
           for(let value of input){
            observer.next(value)
           }
           observer.complete()
       }
    })
}

from([1,2,3]).subscribe({
    next:console.log,
    error:console.error,
    complete:()=>console.log('completed')
})

from(Promise.reject('p')).subscribe({
    next:console.log,
    error:console.error,
    complete:()=>console.log('completed')
})

/**
 *  1
    2
    3
    completed
 */

export {}
