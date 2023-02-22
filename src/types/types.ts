import { Like } from '../Likes/likes.schema';

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

export type CreateUserDtoType = {
  login: string;
  password: string;
  email: string;
};

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
