export interface PipeTransform<T,R> {
    transform(value:T,metadata?:any):R
}