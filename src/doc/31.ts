import { from, Observable,of } from "rxjs";
import {mergeMap, tap} from 'rxjs/operators'
// 模拟 路由处理程序
async function routerHandlerr(){
    console.log('pay...');
    return 'pay'
}

export class Logging1Interceptor {
    async intercept(_,next):Promise<Observable<any>>{
        console.log('before1');
        const now = Date.now()
        return next.handle().pipe(tap(()=>{
            console.log(`after1 ${Date.now() - now}ms`)
        }))
    }
}

export class Logging2Interceptor {
    // intercept(_,next):Observable<any>{
    async intercept(_,next):Promise<Observable<any>>{
        console.log('before2');
        const now = Date.now()
        return next.handle().pipe(tap(()=>{
            console.log(`after2 ${Date.now() - now}ms`)
        }))
    }
}
function executeInterceptor(interceptors){

}
const logging1Interceptor  = new Logging1Interceptor()
const logging2Interceptor  = new Logging2Interceptor()

function callInterceptors(interceptors){
    const nextFn = (i=0):Observable<any> =>{
        // debugger
        if(i >= interceptors.length){
            let result = routerHandlerr()
            return result instanceof Promise ? from(result) : of(result)
        }
        const result = interceptors[i].intercept(null,{handle:()=>nextFn(i+1)})
        // return result
        return from(result).pipe(mergeMap(res=> res instanceof Observable? res : of(res)))
    }
    return nextFn()
}
const interceptors = [logging2Interceptor,logging1Interceptor]

callInterceptors(interceptors).subscribe(value=>{
    console.log('value',value);
})