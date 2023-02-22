import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService) {}
  @Post()
  async createUser(
    @Body() dto: { login: string; email: string; password: string },
  ) {
    return this.usersService.createUser(true, dto);
  }

  @Get()
  async getUsers(
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Query('pageNumber') pageNumber: number,
    @Query('pageSize') pageSize: number,
    @Query('searchLoginTerm') searchLoginTerm: string,
    @Query('searchEmailTerm') searchEmailTerm: string,
  ) {
    return await this.usersService.getAllUsers(
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
      searchLoginTerm,
      searchEmailTerm,
    );
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUserById(@Param('id') id: string) {
    const deletionResult = await this.usersService.deleteUserById(id);
    if (!deletionResult) {
      throw new NotFoundException();
    }
    return {};
  }
}
