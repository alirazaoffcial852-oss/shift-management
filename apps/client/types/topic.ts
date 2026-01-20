import { ApiPaginatedResponse, PaginationParams } from "./pagination";
import { BaseEntity, FormProps, DialogProps, ApiSuccessResponse } from "./shared/global";

export type TopicCategory = "CUSTOMER" | "EMPLOYEE" | "COMPANY";

export interface Topic extends BaseEntity {
  topic: string;
  category?: TopicCategory;
  status?: string;
}

export interface TopicFormErrors {
  topicName?: string;
  category?: string;
}

export interface TopicFormProps extends FormProps {}

export interface TopicDialogProps extends DialogProps {}

export interface GetAllTopicsParams extends PaginationParams {}

export interface FetchTopicResponse extends ApiPaginatedResponse<Topic> {}

export interface CreateTopicRequest {
  topics: {
    topic: string;
    category: TopicCategory;
  }[];
}

export interface CreateTopicResponse extends ApiSuccessResponse<Topic> {}
