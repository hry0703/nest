
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
export class CreateUserDto {
    @IsString()
    @MinLength(4)
    @MaxLength(8)
    @IsString()
    username: string;
    @IsString()
    @IsOptional()
    password: string;
    @IsString()
    mobile:string;
    @IsEmail()
    email:string;
    @IsNumber()
    status:number;
    @IsBoolean()
    is_super:boolean;
    @IsNumber()
    sort:number
}

export class UpdateUserDto extends CreateUserDto {
    id: number;
}

