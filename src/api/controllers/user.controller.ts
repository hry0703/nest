import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/shared/dtos/user.dto';
import { UserService } from 'src/shared/services/user.service';

@Controller('api/users')
export class UserController {
    constructor(private readonly userService: UserService){}
    @Post()
    async create(@Body() createUserDto: CreateUserDto){
        // console.log('create',createUserDto)
        return this.userService.create(createUserDto);
    }

    @Get(":id")
    async findOne(@Param("id",ParseIntPipe) id: number){
        // console.log('create',createUserDto)
        return this.userService.findOne({where:{id}});
    }


    @Put(":id")
    async update(@Param("id",ParseIntPipe) id: number,@Body() updateUserDto: UpdateUserDto){
        // console.log('create',createUserDto)
        return this.userService.update(id,updateUserDto);
    }
    

    @Delete(":id")
    async delete(@Param("id",ParseIntPipe) id: number){
        return this.userService.delete(id);
    }
}
