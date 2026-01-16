export class FileHandlerService {
  static handleFiles(existingFiles: File[] = [], newFiles: File[]): File[] {
    const validFiles = newFiles.filter(
      (file) =>
        file.type.startsWith("image/") || file.type === "application/pdf"
    );
    return [...existingFiles, ...validFiles];
  }

  static handleDrop(e: React.DragEvent, callback: (files: File[]) => void) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.length) {
      callback(Array.from(e.dataTransfer.files));
    }
  }
}
