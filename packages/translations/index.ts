export * from "./utils";

export type TranslationMessages = {
  common: {
    buttons: Record<string, string>;
    labels: Record<string, string>;
    validation: Record<string, string>;
    notifications: Record<string, string>;
    [key: string]: Record<string, string> | string;
  };
  components: {
    dialog: Record<string, string>;
    sidebar: Record<string, string>;
    pagination: Record<string, string>;
    [key: string]: Record<string, string> | string;
  };
  pages: {
    dashboard: Record<string, any>;
    settings: Record<string, any>;
    auth: Record<string, any>;
    calandar?: {
      view: Record<string, string>;
      Actions: Record<string, string>;
      status: Record<string, string>;
      months: Record<string, string>;
      days: Record<string, string>;
      [key: string]: any;
    };
    roles?: Record<string, any>;
    [key: string]: any;
  };
  [key: string]: any;
};
