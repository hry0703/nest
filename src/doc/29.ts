// import { map } from 'rxjs'
import { of, map, Observable } from 'rxjs'
// mergeMap 是 RxJS 中的一个操作符，用于将每个源值映射为一个新的可观察对象，然后将这些对象合并到单一输出的可观察对象。

// class Observable {
//     constructor(private _subscribe) { }
//     // 订阅方法 接受一个观察者对象作为参数
//     subscribe(observer) {
//         // 调用存储的订阅方法，并将观察者对象传递给它
//         return this._subscribe(typeof observer === 'function' ? { next: observer,error:()=>{},complete:()=>{} } : observer)
//     }
//     // 管道方法 接受一个或多个操作符函数作为参数 并依次应用它们
//     pipe(operator:any){  // 这里假设只传单个操作符函数
//         return operator(this)
//     }
// }

// // 定义一个of函数 用于创建包含指定值的可观察对象
// function of(...values) {
//     return new Observable((observer) => {
//         values.forEach(value => observer.next(value))
//         observer.complete()
//     })
// }

function mergeMap(project) {
    //返回一个可接收源可观察对象的函数
    return function(source){
        // 返回一个新的可观察对象
        return new Observable((observer) => {
            source.subscribe({
                next(value) {
                    const innerValue = project(value)
                    innerValue.subscribe({
                        next:(innerValue)=>observer.next(innerValue),
                    })
                },
                complete() {
                    observer.complete()
                },
                error(err) {
                    observer.error(err)
                }
            })
        })
    }
}


of(1,2,3).pipe(
    map((x:any)=>of(x*2))
).subscribe((x)=>console.log(x))

of(1,2,3).pipe(
    mergeMap((x)=>of(x*2))
).subscribe((x)=>console.log(x))



export {}
