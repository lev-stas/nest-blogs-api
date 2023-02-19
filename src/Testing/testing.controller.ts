import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { BlogsRepository } from '../Blogs/blogs.repository';

@Controller('testing')
export class TestingController {
  constructor(protected blogsRepository: BlogsRepository) {}
  @Delete('all-data')
  @HttpCode(204)
  async deleteAllData() {
    return this.blogsRepository.deleteAll();
  }
}
