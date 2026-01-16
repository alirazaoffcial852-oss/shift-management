export interface Topic {
  id?: number;
  topic: string;
  category?: "CUSTOMER" | "EMPLOYEE" | "COMPANY";
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TopicFormErrors {
  topicName?: string;
  category?: string;
}

export interface TopicFormProps {
  useComponentAs: "ADD" | "EDIT";
  id?: number;
  onClose?: () => void;
  isDialog?: boolean;
  onSubmit?: (success: boolean) => void;
  refetch?: () => void;
}

export interface DialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  type: "add" | "edit";
  id?: string;
  refetch?: () => void;
}

export interface GetAllTopicsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface FetchTopicResponse {
  data: {
    data: Topic[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message?: string;
  success?: boolean;
}

export interface CreateTopicRequest {
  topics: {
    topic: string;
    category: "CUSTOMER" | "EMPLOYEE" | "COMPANY";
  }[];
}

export interface CreateTopicResponse {
  data: Topic;
  message: string;
  success: boolean;
}
