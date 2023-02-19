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
