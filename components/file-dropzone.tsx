"use client";

import { useState, useMemo, forwardRef } from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { twMerge } from "tailwind-merge";
import { IoMdCheckmarkCircleOutline as CheckCircleIcon } from "react-icons/io";
import {
  LuFileWarning as FileWarning,
  LuUploadCloud as UploadCloudIcon,
} from "react-icons/lu";
import { BiTrashAlt as DeleteIcon } from "react-icons/bi";
import { AiOutlineClose as CloseIcon } from "react-icons/ai";
import { BsInfoCircle as InfoIcon } from "react-icons/bs";

import { formatFileSize } from "@/utils/file";
import FileTypeIcon from "./file-type-icons";

const variants = {
  base: "relative rounded-md p-4 w-full flex justify-center items-center flex-col cursor-pointer border border-dashed border-gray-400 dark:border-gray-300 transition-colors duration-200 ease-in-out",
  active: "border-2",
  disabled:
    "bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700 dark:border-gray-600",
  accept: "border border-blue-500 bg-blue-500 bg-opacity-10",
  reject: "border border-red-700 bg-red-700 bg-opacity-10",
};

type MultiFileDropzoneProps = {
  className?: string;
  value?: FileState[];
  onChange?: (files: FileState[]) => void | Promise<void>;
  onFilesAdded?: (addedFiles: FileState[]) => void | Promise<void>;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, "disabled">;
};

const ERROR_MESSAGES = {
  fileTooLarge(maxSize: number) {
    return `The file is too large. Max size is ${formatFileSize(maxSize)}.`;
  },
  fileInvalidType() {
    return "Invalid file type.";
  },
  tooManyFiles(maxFiles: number) {
    return `You can only add ${maxFiles} file(s).`;
  },
  fileNotSupported() {
    return "The file is not supported.";
  },
};

const MultiFileDropzone = forwardRef<HTMLInputElement, MultiFileDropzoneProps>(
  (
    { dropzoneOptions, value, className, disabled, onFilesAdded, onChange },
    ref
  ) => {
    const [customError, setCustomError] = useState<string>();
    if (dropzoneOptions?.maxFiles && value?.length) {
      disabled = disabled ?? value.length >= dropzoneOptions.maxFiles;
    }
    // dropzone configuration
    const {
      getRootProps,
      getInputProps,
      fileRejections,
      isFocused,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      disabled,
      onDrop: (acceptedFiles) => {
        const files = acceptedFiles;
        setCustomError(undefined);
        if (
          dropzoneOptions?.maxFiles &&
          (value?.length ?? 0) + files.length > dropzoneOptions.maxFiles
        ) {
          setCustomError(ERROR_MESSAGES.tooManyFiles(dropzoneOptions.maxFiles));
          return;
        }
        if (files) {
          const addedFiles = files.map<FileState>((file) => ({
            file,
            key: Math.random().toString(36).slice(2),
            progress: "PENDING",
          }));
          void onFilesAdded?.(addedFiles);
          void onChange?.([...(value ?? []), ...addedFiles]);
        }
      },
      ...dropzoneOptions,
    });

    // styling
    const dropZoneClassName = useMemo(
      () =>
        twMerge(
          variants.base,
          isFocused && variants.active,
          disabled && variants.disabled,
          (isDragReject ?? fileRejections[0]) && variants.reject,
          isDragAccept && variants.accept,
          className
        ).trim(),
      [
        isFocused,
        fileRejections,
        isDragAccept,
        isDragReject,
        disabled,
        className,
      ]
    );

    // error validation messages
    let errorMessage = useMemo(() => {
      if (fileRejections[0]) {
        const { errors } = fileRejections[0];
        if (errors[0]?.code === "file-too-large") {
          return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
        } else if (errors[0]?.code === "file-invalid-type") {
          return ERROR_MESSAGES.fileInvalidType();
        } else if (errors[0]?.code === "too-many-files") {
          return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0);
        } else {
          return ERROR_MESSAGES.fileNotSupported();
        }
      }
      return undefined;
    }, [fileRejections, dropzoneOptions]);

    errorMessage = customError ?? errorMessage;

    return (
      <div className="w-full">
        <div className="flex w-full flex-col gap-2">
          <div className="w-full">
            {/* Main File Input */}
            <div
              {...getRootProps({
                className: dropZoneClassName,
              })}
            >
              <input ref={ref} {...getInputProps()} />
              <div className="flex flex-col items-center justify-center text-xs text-gray-400">
                <UploadCloudIcon className="mb-1 h-7 w-7" />
                <div className="text-gray-400">
                  Drag & drop or click to upload
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-2 flex items-center gap-x-2 text-xs text-red-700">
                <InfoIcon className="text-base" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {value?.map(({ file, abortController, progress }, i) => {
            const extension = file.name.split(".").pop();

            return (
              <div
                key={i}
                className="flex h-16 w-full flex-col justify-center rounded border border-gray-300 px-4 py-2"
              >
                <div className="flex items-center gap-2 text-gray-500 dark:text-white">
                  <FileTypeIcon type={extension}  />
                  <div className="min-w-0 text-sm">
                    <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                  <div className="grow" />
                  <div className="flex w-12 justify-end text-xs">
                    {progress === "PENDING" ? (
                      <button
                        type="button"
                        className="rounded-md p-1 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          void onChange?.(
                            value.filter((_, index) => index !== i)
                          );
                        }}
                      >
                        <DeleteIcon size={20} className="shrink-0" />
                      </button>
                    ) : progress === "ERROR" ? (
                      <FileWarning className="shrink-0 text-red-600 dark:text-red-400" />
                    ) : progress !== "COMPLETE" ? (
                      <div className="flex flex-col items-end gap-0.5">
                        {abortController && (
                          <button
                            type="button"
                            className="rounded-md p-0.5 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            disabled={progress === 100}
                            onClick={() => {
                              abortController.abort();
                            }}
                          >
                            <CloseIcon className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-400" />
                          </button>
                        )}
                        <div>{Math.round(progress)}%</div>
                      </div>
                    ) : (
                      <CheckCircleIcon className="shrink-0 text-green-600 dark:text-gray-400" />
                    )}
                  </div>
                </div>

                {typeof progress === "number" && (
                  <div className="relative h-0">
                    <div className="absolute top-1 h-1 w-full overflow-clip rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-full bg-gray-400 transition-all duration-300 ease-in-out dark:bg-white"
                        style={{
                          width: progress ? `${progress}%` : "0%",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
MultiFileDropzone.displayName = "MultiFileDropzone";

export default MultiFileDropzone;
