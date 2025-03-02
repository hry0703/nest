// import { of } from 'rxjs'
// of 是一个创建可观察对象的函数，它接受一个或多个参数，并将它们作为可观察对象的输出发出。
class Observable {
    constructor(private _subscribe) { }
    // 订阅方法 接受一个观察者对象作为参数
    subscribe(observer) {
        // 调用存储的订阅方法，并将观察者对象传递给它
        return this._subscribe(typeof observer === 'function' ? { next: observer,error:()=>{},complete:()=>{} } : observer)
    }
}

// 定义一个of函数 用于创建包含指定值的可观察对象
function of(...values) {
    return new Observable((observer) => {
        values.forEach(value => observer.next(value))
        observer.complete()
    })
}

of(1,2,3).subscribe({
    next:console.log,
    error:console.error,
    complete:()=>console.log('completed')
})

export {}