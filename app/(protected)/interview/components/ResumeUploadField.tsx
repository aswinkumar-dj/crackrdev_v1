"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";
import FieldError from "./FieldError";

type ResumeUploadFieldProps = {
  file: File | null;
  fileError?: string;
  requiredError?: string;
  onFileSelect: (file?: File) => void;
  onRemove: () => void;
};

export default function ResumeUploadField({
  file,
  fileError,
  requiredError,
  onFileSelect,
  onRemove,
}: ResumeUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFileSelect(event.target.files?.[0]);
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    onFileSelect(event.dataTransfer.files?.[0]);
  };

  const removeFile = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onRemove();
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#101616]">Resume</p>
          <p className="mt-1 text-sm text-[#536461]">
            Upload a PDF so the interview can use your background.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[#e8f5f4] px-3 py-1 text-xs font-bold text-[#127d82]">
          PDF only
        </span>
      </div>

      <label
        htmlFor="resume-upload"
        onDragEnter={() => setIsDragging(true)}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#17a1a6] px-6 py-8 text-center transition-colors ${
          isDragging
            ? "bg-[#e8f5f4] ring-2 ring-[#17a1a6]/20"
            : "bg-[#fbfdfd] hover:bg-[#e8f5f4]"
        }`}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e8f5f4]">
          <FiUploadCloud className="h-6 w-6 text-[#17a1a6]" aria-hidden="true" />
        </span>
        <span className="mt-3 text-sm font-semibold text-[#101616]">
          Drag and drop your resume
        </span>
        <span className="mt-1 text-sm text-[#536461]">
          or click to browse from your device
        </span>
      </label>

      <input
        ref={inputRef}
        id="resume-upload"
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={handleFileChange}
      />

      <FieldError message={fileError} />
      <FieldError message={requiredError} />

      {file ? (
        <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-[#dcebea] bg-white px-4 py-3">
          <p className="min-w-0 truncate text-sm font-medium text-[#101616]">
            {file.name}
          </p>
          <button
            type="button"
            onClick={removeFile}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#536461] transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/40"
            aria-label="Remove resume"
          >
            <FiX className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
