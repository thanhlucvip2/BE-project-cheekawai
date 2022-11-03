import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserDto } from './user.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/shared/auth.guard';
import { ValidationPipe } from 'src/shared/validation.pipe';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(new AuthGuard()) // check token
  async getAllUser() {
    return await this.userService.showAllUser();
  }
  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() body: UserDto) {
    return await this.userService.register(body);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() body: UserDto) {
    return await this.userService.login(body);
  }
}
