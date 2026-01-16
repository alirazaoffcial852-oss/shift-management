"use client";
import React from "react";
import { useEditTimesheet } from "@/hooks/timeSheet/useEditTimesheet";
import Navbar from "@/components/Navbar";
import { SMSBackButton } from "@workspace/ui/components/custom/SMSBackButton";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { Dialog, DialogContent } from "@workspace/ui/components/dialog";
import SignaturePad from "@/components/SignaturePad";
import { EditTimesheetForm } from "@/components/Forms/TimeSheet/EditTimesheetForm";
import { useAuth } from "@/providers/appProvider";
import { Timesheet } from "@/types/timeSheet";
import { DropZone } from "@/components/FileUpload/DropZone";
import { FileList } from "@/components/FileUpload/FileList";
import { FileText, X, ExternalLink, Image as ImageIcon, File as FileIcon } from "lucide-react";
import Image from "next/image";

export default function EditTimesheet() {
  const { user } = useAuth();
  const isClient = user?.role?.name === "CLIENT";

  const {
    timesheet,
    isLoading,
    isSubmitting,
    signatureModalOpen,
    setSignatureModalOpen,
    handleInputChange,
    handleSignature,
    handleSubmit,
    files,
    dragActive,
    handleDrag,
    handleDrop,
    handleFileInput,
    removeFile,
    viewDocument,
    existingDocuments,
    removeExistingDocument,
    viewExistingDocument,
  } = useEditTimesheet();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto w-[80%] bg-white shadow p-6 rounded-[30px] my-2">
        <div className="flex items-center gap-10 mb-6">
          <SMSBackButton />
          <h1 className="text-2xl font-bold">Edit Timesheet</h1>
        </div>

        {timesheet && (
          <div className="space-y-6">
            <EditTimesheetForm
              timesheet={timesheet as Timesheet}
              onUpdate={handleInputChange}
              errors={{}}
            />

            {/* File Upload Sections */}
            <div className="space-y-6 mt-6">
              {/* Documents Upload Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Documents</h3>
                <DropZone 
                  dragActive={dragActive} 
                  onDrag={handleDrag} 
                  onDrop={handleDrop} 
                  onFileSelect={handleFileInput} 
                  multiple={true} 
                />
                {existingDocuments && existingDocuments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Existing Documents:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {existingDocuments.map((doc: any) => {
                        const fileName = doc.document?.split("/").pop() || `Document ${doc.id}`;
                        const extension = fileName.split(".").pop()?.toLowerCase() || "";
                        const isImage = ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension || "");
                        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || "http://localhost:5051";
                        const previewUrl = `${baseUrl}/${doc.document}`;

                        const getFileIcon = () => {
                          if (["pdf"].includes(extension || "")) {
                            return <FileText className="h-6 w-6 text-red-500" />;
                          } else if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension || "")) {
                            return <ImageIcon className="h-6 w-6 text-blue-500" />;
                          } else {
                            return <FileIcon className="h-6 w-6 text-gray-500" />;
                          }
                        };

                        return (
                          <div
                            key={doc.id}
                            className="relative group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                          >
                            <button
                              type="button"
                              onClick={() => removeExistingDocument(doc.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                            >
                              <X size={16} />
                            </button>

                            <a
                              href={doc.document?.startsWith("http") ? doc.document : `${baseUrl}/${doc.document}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col items-center cursor-pointer"
                            >
                              {isImage ? (
                                <div className="relative w-full h-24 mb-2">
                                  <Image
                                    src={previewUrl}
                                    alt={fileName}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                              ) : (
                                <div className="mb-2">{getFileIcon()}</div>
                              )}
                              <span className="text-xs font-medium text-center truncate w-full">
                                {fileName}
                              </span>
                              <div className="flex items-center mt-1 text-xs text-blue-600">
                                <ExternalLink size={12} className="mr-1" />
                                Preview
                              </div>
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {files && files.length > 0 && (
                  <FileList 
                    file={files} 
                    onRemove={(index?: number) => removeFile(index as number)} 
                    multiple={true}
                    onView={viewDocument}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <SMSButton
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                Save
              </SMSButton>
              {!isClient && (
                <SMSButton
                  onClick={() => handleSubmit(true)}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  Save & Submit
                </SMSButton>
              )}
            </div>
          </div>
        )}

        <Dialog open={signatureModalOpen} onOpenChange={setSignatureModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <h3 className="text-lg font-semibold mb-4">Add Your Signature</h3>
            <SignaturePad onSave={handleSignature} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
