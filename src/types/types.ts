import { Like } from '../Likes/likes.schema';
import { IsEmail, Length } from 'class-validator';

export type CreateBlogDtoType = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogsResponseDtoType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type FullBlogsResponseDtoType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogsResponseDtoType[];
};

export type CreatePostDtoType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type PostsResponseDtoType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: Like[] | [];
  };
};

export type FullPostResponseDtoType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostsResponseDtoType[];
};

export class CreateUserDtoType {
  @Length(3, 10)
  login: string;
  @Length(6, 20)
  password: string;
  @IsEmail()
  email: string;
}

export type SimpleUserDtoType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type UsersResponseDtoType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: SimpleUserDtoType[];
};
