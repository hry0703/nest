import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@ValidatorConstraint({ name: 'customText', async: false })
export class StartsWithConstraint implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments) {
    // validationArguments {
    //     targetName: 'CreateUserDto',
    //     property: 'username',
    //     object: CreateUserDto {
    //         username: 'user031208',
    //         password: '999999',
    //         mobile: '1350001230',
    //         email: '1231@qq.com',
    //         status: 1,
    //         is_super: false,
    //         sort: 231
    //     },
    //     value: 'user031208',
    //     constraints: [ 'user_' ]
    // }
    console.log('validate', validationArguments);
    return value.startsWith(validationArguments?.constraints[0]);
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    console.log('defaultMessage', validationArguments);
    return `${validationArguments?.property} must start with ${validationArguments?.constraints[0]}`;
  }
}

export function StartsWith(
  prefix: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      // object 是createUserDto的类的原型
      target: object.constructor, // 注册装饰器的目标类 createUserDto
      propertyName, // username 目标属性名
      options: validationOptions, // 验证选项
      constraints: prefix, // 传递给装饰器的目标类 比如前缀
      validator: StartsWithConstraint, // 指定使用哪个炎症期类
    });
  };
}

// 暂时解决方案 注入作用域问题 后续解决
let userRepository: any = null;
@Injectable()
@ValidatorConstraint({ name: 'IsUserNameUniqueConstraint', async: true })
export class IsUserNameUniqueConstraint
  implements ValidatorConstraintInterface
{
  // 这里依赖注入 需要在shared.module中导入到providers里才行
  constructor(@InjectRepository(User) protected repository: Repository<User>) {
    // console.log('repository',repository);
    if (!userRepository) {
      userRepository = repository;
    }
  }
  validate = async (value: any, validationArguments?: ValidationArguments) => {
    // console.log('this',this);
    const result = await this.repository.findOneBy({ username: value });
    // console.log('result',result);

    return !result;
  };
  defaultMessage(validationArguments?: ValidationArguments): string {
    console.log('defaultMessage', validationArguments);
    return `${validationArguments?.property} is aready exist`;
  }
}

export function StartsWithAsync(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      // object 是createUserDto的类的原型
      target: object.constructor, // 注册装饰器的目标类 createUserDto
      propertyName, // username 目标属性名
      options: validationOptions, // 验证选项
      constraints: [], // 传递给装饰器的目标类 比如前缀
      validator: IsUserNameUniqueConstraint, // 指定使用哪个炎症期类
    });
  };
}
