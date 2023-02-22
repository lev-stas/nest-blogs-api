import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CreateBlogDtoType } from '../types/types';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
  @Prop({
    required: true,
  })
  id: string;
  @Prop({
    required: true,
  })
  name: string;
  @Prop({
    required: true,
  })
  description: string;
  @Prop({
    required: true,
  })
  websiteUrl: string;
  @Prop()
  createdAt: string;
  @Prop({
    default: false,
  })
  isMembership: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
