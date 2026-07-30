export type PromptStatus = "ACTIVE" | "INACTIVE" | "COMPLETED";
export type ResponseScope = "campus" | "market" | "national";

export interface TodayPrompt {
  id: string;
  competitionId: string;
  title: string;
  description: string;
  promptDate: string;
  status: PromptStatus;
  createdByAdminId: string;
  createdAt: string;
}

export interface ArchivePrompt {
  id: string;
  competitionId: string;
  title: string;
  description: string;
  promptDate: string;
  status: PromptStatus;
  createdByAdminId: string;
  createdAt: string;
}

export interface PromptsArchiveResponse {
  items: ArchivePrompt[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PromptResponseUser {
  id: string;
  fullName: string | null;
  email: string;
  school?: { id: string; name: string } | null;
  market?: { id: string; name: string } | null;
}

export interface PromptResponse {
  id: string;
  promptId: string;
  userId: string;
  content?: string;
  responseText?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  user?: PromptResponseUser;
  isLiked?: boolean;
}

export interface PromptResponseCommentUser {
  id: string;
  fullName: string | null;
}

export interface PromptResponseComment {
  id: string;
  userId: string;
  responseId: string;
  commentText: string;
  createdAt: string;
  user?: PromptResponseCommentUser;
}

export interface ResponseCommentsResponse {
  items: PromptResponseComment[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PromptResponsesResponse {
  prompt: Pick<TodayPrompt, "id" | "title" | "description" | "promptDate">;
  items: PromptResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetPromptResponsesParams {
  promptId: string;
  scope?: ResponseScope;
  page?: number;
  limit?: number;
}

export interface SubmitPromptResponsePayload {
  promptId: string;
  responseText: string;
}

export interface SubmitPromptResponseResult {
  id: string;
  promptId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface LikeResponsePayload {
  responseId: string;
}

export interface LikeResponseResult {
  liked: boolean;
  likesCount: number;
}

export interface CommentOnResponsePayload {
  responseId: string;
  commentText: string;
}

export interface CommentOnResponseResult {
  id: string;
  responseId: string;
  userId: string;
  commentText: string;
  createdAt: string;
  user?: PromptResponseCommentUser;
}
