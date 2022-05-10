import { Post, User, Comment, ReComment, Photo } from '@prisma/client';
export interface ExtendedReComment extends ReComment {
  user: User;
}

export interface ExtendedComment extends Comment {
  user: User;
  reComments: ExtendedReComment[];
  _count: {
    reComments: number;
  };
}
export interface ExtendedPost extends Post {
  user: User;
  photos: Photo[];
  _count: {
    scraps: number;
    comments: number;
  };
  comments: ExtendedComment[];
}
export interface PostDetailResponse {
  ok: boolean;
  post: ExtendedPost;
  isScraped: boolean;
}
export interface CommentsResponse {
  ok: boolean;
  comments: ExtendedComment[];
}
export interface CommentDetailResponse {
  ok: boolean;
  comment: ExtendedComment;
}

export interface PostListResponse {
  ok: boolean;
  postList: ExtendedPost[];
}
