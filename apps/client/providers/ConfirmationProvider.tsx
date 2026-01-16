"use client";
import { ConfirmationDialog } from "@workspace/ui/components/custom/ConfirmationDialog";
import React, { createContext, useContext, useState } from "react";

interface ConfirmationContextType {
  showConfirmation: (options: ConfirmationOptions) => void;
  hideConfirmation: () => void;
}

export interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
}

const ConfirmationContext = createContext<ConfirmationContextType>(
  {} as ConfirmationContextType
);

export const ConfirmationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    options: ConfirmationOptions | null;
  }>({
    isOpen: false,
    options: null,
  });

  const showConfirmation = (options: ConfirmationOptions) => {
    setConfirmationState({ isOpen: true, options });
  };

  const hideConfirmation = () => {
    setConfirmationState({ isOpen: false, options: null });
  };

  return (
    <ConfirmationContext.Provider
      value={{ showConfirmation, hideConfirmation }}
    >
      {children}
      {confirmationState.options && (
        <ConfirmationDialog
          isOpen={confirmationState.isOpen}
          onClose={hideConfirmation}
          onConfirm={() => {
            confirmationState.options?.onConfirm();
            hideConfirmation();
          }}
          title={confirmationState.options.title}
          description={confirmationState.options.description}
          confirmText={confirmationState.options.confirmText}
          variant={confirmationState.options.variant}
        />
      )}
    </ConfirmationContext.Provider>
  );
};

export const useConfirmation = () => useContext(ConfirmationContext);
