import axios from 'axios'

// 装饰器实现一个axios get请求
const Get =( url:string):MethodDecorator =>{
return (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor)=>{
    const fnc = descriptor.value
    axios.get(url).then((res)=>{
        fnc(res,{status:200})
    }).catch(e=>{
        fnc(e,{status:500})
    })
}
}


class Controller  {
    constructor(){

    }

    @Get('https://api.apiopen.top/api/getHaoKanVideo?page=0&size=10')
    getList(res,status){
        console.log(res.data.result,status);
    }

}