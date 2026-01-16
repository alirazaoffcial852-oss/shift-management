"use client";

import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { useEffect, useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { toast } from "sonner";
import {
  TopicFormErrors,
  Topic,
  TopicFormProps,
  CreateTopicRequest,
} from "@/types/topic";
import TopicService from "../../services/topic";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { useTranslations } from "next-intl";

const TopicForm: React.FC<
  TopicFormProps & { addLocalTopic?: (topic: any) => void }
> = ({
  useComponentAs,
  id,
  onClose,
  isDialog = false,
  onSubmit,
  refetch,
  addLocalTopic,
}) => {
  const t = useTranslations("pages.qualityManagement");
  const [topics, setTopics] = useState<Topic[]>([
    {
      topic: "",
    } as Topic,
  ]);

  const [errors, setErrors] = useState<TopicFormErrors[]>([{}]);
  const [loading, setLoading] = useState(false);

  const categoryOptions = [
    { value: "CUSTOMER", label: "Customer" },
    { value: "EMPLOYEE", label: "Employee" },
    { value: "COMPANY", label: "Company" },
  ];

  const handleInputChange = (
    index: number,
    field: keyof TopicFormErrors,
    value: string
  ) => {
    const safeValue = value ?? "";

    setTopics((prev) => {
      const updated = [...prev];
      // Map field names to match the new API structure
      const fieldMapping: Record<string, string> = {
        topicName: "topic",
        category: "category",
      };
      const apiField = fieldMapping[field as string] || field;
      updated[index] = { ...updated[index], [apiField]: safeValue } as Topic;
      return updated;
    });

    if (errors[index]?.[field]) {
      setErrors((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: undefined };
        return updated;
      });
    }
  };

  const addTopicEntry = () => {
    setTopics((prev) => [
      ...prev,
      {
        topic: "",
      } as Topic,
    ]);
    setErrors((prev) => [...prev, {}]);
  };

  const removeTopicEntry = (index: number) => {
    if (topics.length > 1) {
      setTopics((prev) => prev.filter((_, i) => i !== index));
      setErrors((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: TopicFormErrors[] = [];
    let isValid = true;

    topics.forEach((topic, index) => {
      const errorObj: TopicFormErrors = {};

      if (!topic.topic?.trim()) {
        errorObj.topicName = "Topic name is required";
        isValid = false;
      }

      if (!topic.category?.trim()) {
        errorObj.category = "Category is required";
        isValid = false;
      }

      newErrors[index] = errorObj;
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (useComponentAs === "ADD") {
        // Create multiple topics with new API format
        const validTopics = topics
          .filter((topic) => topic.topic.trim() !== "")
          .map((topic) => ({
            topic: topic.topic.trim(),
            category: (topic.category?.trim() || "CUSTOMER") as
              | "CUSTOMER"
              | "EMPLOYEE"
              | "COMPANY",
          }));

        if (validTopics.length === 0) {
          toast.error("Please add at least one topic");
          return;
        }

        const payload: CreateTopicRequest = {
          topics: validTopics,
        };

        const response = await TopicService.createTopics(payload);

        if (response?.data) {
          // Refetch to get the newly created topics from the API
          // No need to add to localTopics since they're now in the database
          onClose?.();
          onSubmit?.(true);
          await refetch?.();
          const message =
            validTopics.length === 1
              ? "Topic created successfully"
              : `${validTopics.length} topics created successfully`;
          toast.success(response?.message || message);
        }
      } else {
        // For edit, update single topic
        const firstTopic = topics[0];

        if (!firstTopic || !firstTopic.topic.trim()) {
          toast.error("Please enter a topic name");
          return;
        }

        const payload = {
          topic: firstTopic.topic.trim(),
          category: (firstTopic.category?.trim() || "CUSTOMER") as
            | "CUSTOMER"
            | "EMPLOYEE"
            | "COMPANY",
        };

        const response = await TopicService.updateTopicById(id!, payload);

        if (response?.data) {
          onClose?.();
          onSubmit?.(true);
          await refetch?.();
          toast.success(response?.message || "Topic updated successfully");
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      onSubmit?.(false);
      toast.error("Failed to save topic");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (useComponentAs === "EDIT" && id) {
      const fetchTopic = async () => {
        try {
          setLoading(true);
          const response = await TopicService.getTopicById(id);

          // Handle different response structures
          const topicData = response?.data?.data || response?.data;

          if (topicData) {
            setTopics([
              {
                topic: topicData.topic || topicData.topicName || "",
                category: topicData.category || "CUSTOMER",
              } as Topic,
            ]);
          } else {
            toast.error("Failed to load topic data");
          }
        } catch (error) {
          console.error("Error fetching topic:", error);
          toast.error("Failed to load topic");
        } finally {
          setLoading(false);
        }
      };
      fetchTopic();
    }
  }, [useComponentAs, id]);

  return (
    <div className={`${isDialog ? "flex flex-col h-full" : ""}`}>
      <form
        onSubmit={handleSubmit}
        className={`${isDialog ? "flex flex-col h-full" : "space-y-6"}`}
      >
        <div
          className={`${
            isDialog
              ? "flex-1 overflow-y-auto space-y-6 pr-2 pb-4"
              : "space-y-6"
          }`}
        >
          {topics.map((topic, index) => (
            <div key={index} className="p-2 sm:p-4 mb-4 rounded-lg">
              <div className="flex items-center justify-center mb-4">
                {/* Main container with padding */}
                <div className="md:w-[80%] w-full rounded-lg p-4 sm:p-6 bg-white">
                  <div className="flex flex-col md:flex-row items-start gap-4">
                    {/* Topic Name Field */}
                    <div className="flex-1 w-full">
                      {/* Label with icons on mobile only */}
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-sm font-medium text-gray-700">
                          {t("topicName")}
                          <span className="text-red-500 ml-1">*</span>
                        </label>

                        {/* Icons - appear next to Topic Name on MOBILE only */}
                        <div className="flex md:hidden items-center space-x-1 sm:space-x-2">
                          {topics.length > 1 && useComponentAs === "ADD" && (
                            <button
                              type="button"
                              onClick={() => removeTopicEntry(index)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1 sm:p-2"
                              aria-label="Remove topic"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                          {index === topics.length - 1 &&
                            useComponentAs === "ADD" && (
                              <button
                                type="button"
                                onClick={addTopicEntry}
                                className="text-green-600 hover:text-green-800 transition-colors p-1 sm:p-2"
                                aria-label="Add topic"
                              >
                                <PlusCircle size={18} />
                              </button>
                            )}
                        </div>
                      </div>

                      {/* Input field without label (label is above) */}
                      <SMSInput
                        value={topic.topic}
                        onChange={(e) =>
                          handleInputChange(index, "topicName", e.target.value)
                        }
                        required
                        error={errors[index]?.topicName}
                        placeholder={t("enterTopicName")}
                        maxLength={255}
                      />
                    </div>

                    {/* Category Field with Icons on Tablet/Desktop */}
                    <div className="flex-1 w-full">
                      <div className="flex gap-3">
                        <div className="flex-1">
                          {/* Label matching Topic Name style - same structure */}
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-sm font-medium text-gray-700">
                              {t("category")}
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                          </div>

                          <SMSCombobox
                            options={categoryOptions}
                            value={topic.category || ""}
                            onValueChange={(value: string) =>
                              handleInputChange(index, "category", value)
                            }
                            placeholder={t("selectCategory")}
                            className="w-full"
                            required
                            error={errors[index]?.category}
                          />
                        </div>

                        {/* Icons - appear on right side of Category on TABLET/DESKTOP only */}
                        <div className="hidden md:flex items-center space-x-2 self-end pb-2">
                          {topics.length > 1 && useComponentAs === "ADD" && (
                            <button
                              type="button"
                              onClick={() => removeTopicEntry(index)}
                              className="text-red-500 hover:text-red-700 transition-colors p-2"
                              aria-label="Remove topic"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                          {index === topics.length - 1 &&
                            useComponentAs === "ADD" && (
                              <button
                                type="button"
                                onClick={addTopicEntry}
                                className="text-green-600 hover:text-green-800 transition-colors p-2"
                                aria-label="Add topic"
                              >
                                <PlusCircle size={18} />
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`${
            isDialog
              ? "flex-shrink-0 sticky bottom-0 bg-white pt-4 pb-2"
              : "mt-8"
          } flex justify-center px-2`}
        >
          <SMSButton
            text={id ? t("update") : t("save")}
            className="bg-black rounded-full w-full sm:w-auto min-w-[120px]"
            type="submit"
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default TopicForm;
