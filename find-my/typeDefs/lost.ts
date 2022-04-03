import { Lost, User, Comment, ReComment } from '@prisma/client';
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
export interface ExtendedLost extends Lost {
  user: User;
  _count: {
    scraps: number;
    comments: number;
  };
  comments: ExtendedComment[];
}
export interface LostDetailResponse {
  ok: boolean;
  lost: ExtendedLost;
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

export interface LostListResponse {
  ok: boolean;
  lostList: ExtendedLost[];
}
