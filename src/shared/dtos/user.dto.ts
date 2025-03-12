
import { applyDecorators } from '@nestjs/common';
import { ApiHideProperty, ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, MaxLength, MinLength, Validate } from 'class-validator';
import { IsUserNameUniqueConstraint, StartsWith, StartsWithAsync, StartsWithConstraint } from 'src/shared/validators/user-validator';
function passwordValidators(){
    return applyDecorators(IsString(),MinLength(6),MaxLength(8))
}

export class CreateUserDto {
    // 规定所有的用户名必须以某个前缀开头 user_
    @ApiProperty({description:'用户名称',example:'uuser_001'}) 
    @IsString()
    // @Validate(StartsWithConstraint,['user__'],{/**message:"custom message"*/ }) // class-validator 官方文档写法
    // @StartsWith(['user_'],{message:'用户名必须以user_开头'}) // StartsWith等于是自己手写了Validate装饰器
    // @StartsWithAsync()   // 异步版
    @Validate(IsUserNameUniqueConstraint)  // 异步版
    username: string;

    // @ApiProperty({description:'密码',example:'123456'}) 
    @ApiHideProperty() // 表示这是一个隐藏字段不会出现在swagger文档中
    @passwordValidators()
    password: string;

    @ApiProperty({description:'手机号',example:'12345612345'}) 
    @IsString()
    @IsOptional()
    @ApiPropertyOptional() // 文档中标注该参数非必填
    mobile:string;

    @ApiProperty({description:'邮箱',example:'1@qq.com'}) 
    @IsEmail()
    email:string;

    @ApiProperty({description:'状态',example:1}) 
    @IsNumber()
    @Type(()=>Number)// 强制类型转换 ‘1’->1
    status:number;

    @ApiProperty({description:'是否超级管理员',example:true}) 
    @IsBoolean()
    @Type(()=>Boolean)
    is_super:boolean;

    @ApiProperty({description:'排序',example:100}) 
    @IsNumber()
    sort:number
}


// PartialType  指定类中的所有属性可选  eg:创建用户时所有参数必填 更新时除了id 其他参数都选填
export class UpdateUserDto extends PartialType(CreateUserDto)  {
    @ApiProperty({description:'用户id',example:1}) 
    id: number;
}

