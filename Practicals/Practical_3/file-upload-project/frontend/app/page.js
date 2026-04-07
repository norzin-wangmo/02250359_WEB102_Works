'use client';

import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

export default function Home() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const selectedFile = watch('file');

  const validateFile = (fileList) => {
    if (!fileList || fileList.length === 0) {
      return 'Please select a file';
    }

    const file = fileList[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      return 'Only JPG, PNG, and PDF files are allowed';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }

    return true;
  };

  const createPreview = (file) => {
    if (!file) {
      setFilePreview(null);
      return;
    }

    if (file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      setFilePreview({
        url: previewUrl,
        name: file.name,
        type: file.type,
      });
    } else if (file.type === 'application/pdf') {
      setFilePreview({
        name: file.name,
        type: file.type,
      });
    } else {
      setFilePreview(null);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setValue('file', acceptedFiles, { shouldValidate: true });
        createPreview(file);
      }
    },
    [setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf'],
    },
  });

  useEffect(() => {
    if (selectedFile && selectedFile.length > 0) {
      createPreview(selectedFile[0]);
    }
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (filePreview?.url) {
        URL.revokeObjectURL(filePreview.url);
      }
    };
  }, [filePreview]);

  const onSubmit = async (data) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('file', data.file[0]);

      const response = await axios.post(
        'http://localhost:8000/api/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentage = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentage);
            }
          },
        }
      );

      setUploadResult({
        success: true,
        message: 'File uploaded successfully!',
        data: response.data,
      });

      reset();
      setFilePreview(null);
      setUploadProgress(0);
    } catch (error) {
      setUploadResult({
        success: false,
        message:
          error?.response?.data?.error || 'Upload failed. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-2">File Upload Form</h1>
        <p className="text-gray-600 mb-6">
          Upload JPG, PNG, or PDF files up to 5MB
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block font-medium mb-2">Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-2">Choose File</label>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <p className="font-medium">
                {isDragActive
                  ? 'Drop the file here...'
                  : 'Drag & drop a file here, or click to select'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supported: JPG, PNG, PDF (Max: 5MB)
              </p>
            </div>

            <input
              type="file"
              className="hidden"
              {...register('file', {
                validate: validateFile,
              })}
            />

            {errors.file && (
              <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
            )}
          </div>

          {filePreview && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Preview:</h3>
              <div className="border rounded p-3">
                {filePreview.type.startsWith('image/') ? (
                  <img
                    src={filePreview.url}
                    alt={filePreview.name}
                    className="max-w-full h-auto max-h-48 rounded"
                  />
                ) : filePreview.type === 'application/pdf' ? (
                  <div className="py-2 px-3 bg-gray-100 rounded flex items-center">
                    <span className="text-red-600 mr-2 text-lg">📄</span>
                    <span>{filePreview.name}</span>
                  </div>
                ) : (
                  <div>File selected: {filePreview.name}</div>
                )}
              </div>
            </div>
          )}

          {isUploading && (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isUploading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg disabled:bg-gray-400"
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>

        {uploadResult && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              uploadResult.success
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            <p className="font-semibold">{uploadResult.message}</p>

            {uploadResult.success && uploadResult.data && (
              <div className="mt-2 text-sm space-y-1">
                <p>
                  <strong>Original Name:</strong> {uploadResult.data.originalName}
                </p>
                <p>
                  <strong>Saved Name:</strong> {uploadResult.data.filename}
                </p>
                <p>
                  <strong>Type:</strong> {uploadResult.data.mimetype}
                </p>
                <p>
                  <strong>Size:</strong> {uploadResult.data.size} bytes
                </p>
                <p>
                  <strong>URL:</strong>{' '}
                  <a
                    href={`http://localhost:8000${uploadResult.data.url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    Open uploaded file
                  </a>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}