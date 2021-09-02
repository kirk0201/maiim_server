import { Body, Controller, Post, Get, SerializeOptions } from '@nestjs/common'
import { joinUserDto, loginDto } from './users.dto'
import { UsersService } from './users.service'

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
    
  @Post('join')
  public async joinUser(@Body() joinUserDto: joinUserDto) {
      await this.usersService.joinUser(joinUserDto)
      return "회원가입 성공!"
  }

  @Post('login')
  @SerializeOptions({
    groups: ["me"],
  })  
  public async login(@Body() loginDto: loginDto) {
    return this.usersService.login(loginDto)
  }
}