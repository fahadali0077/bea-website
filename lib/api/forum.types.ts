// Forum types for /forum/* endpoints

export type ForumScope = "CAMPUS" | "MARKET" | "NATIONAL";

export interface ForumPostUser {
  id: string;
  fullName: string | null;
  role: string;
  schoolId?: string | null;
}

export interface ForumCommentUser {
  id: string;
  fullName: string | null;
  role?: string;
}

export interface ForumComment {
  id: string;
  postId: string;
  userId: string;
  commentText: string;
  createdAt: string;
  user?: ForumCommentUser;
}

export interface ForumPost {
  id: string;
  userId: string;
  scope: ForumScope;
  schoolId: string | null;
  marketId: string | null;
  title: string;
  body: string;
  isPinned: boolean;
  status: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  user?: ForumPostUser;
  isLiked?: boolean;
  comments?: ForumComment[];
}

export interface ListForumPostsParams {
  scope?: ForumScope;
  search?: string;
  sortBy?: "recent" | "popular" | string;
  page?: number;
  limit?: number;
}

export interface ListForumPostsResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: ForumPost[];
}

export interface CreateForumPostPayload {
  title: string;
  body: string;
  scope: ForumScope;
}

export interface CreateForumPostResponse {
  success: boolean;
  message: string;
  data: ForumPost;
}

export interface LikeForumPostResponse {
  success: boolean;
  message: string;
  data?: {
    liked: boolean;
    likesCount: number;
  };
}

export interface CommentForumPostPayload {
  postId: string;
  commentText: string;
}

export interface CommentForumPostResponse {
  success: boolean;
  message: string;
  data: ForumComment;
}
