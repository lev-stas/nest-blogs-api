import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(protected commentsService: CommentsService) {}

  @Get()
  async getCommentById(@Param('id') id: string) {
    const comment = await this.commentsService.getCommentById(id);
    if (!comment) {
      throw new NotFoundException();
    }
    return comment;
  }
}
