import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  multiple?: boolean;
  values?: string[];
  onMultipleChange?: (values: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ 
  label, 
  value, 
  onChange, 
  required = false,
  multiple = false,
  values = [],
  onMultipleChange,
  maxImages = 8
}: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (multiple && onMultipleChange) {
            if (values.length < maxImages) {
              onMultipleChange([...values, result]);
            }
          } else {
            onChange(result);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index?: number) => {
    if (multiple && onMultipleChange && typeof index === 'number') {
      onMultipleChange(values.filter((_, i) => i !== index));
    } else {
      onChange('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  if (multiple) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
          {maxImages > 1 && (
            <span className="text-gray-500 font-normal"> (max {maxImages})</span>
          )}
        </label>
        
        <div className="grid grid-cols-2 gap-4">
          {values.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {values.length < maxImages && (
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                dragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById(`file-input-${label}`)?.click()}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Prevucite sliku ovde ili kliknite za otpremanje
              </p>
            </div>
          )}
        </div>
        
        <input
          id={`file-input-${label}`}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="Upload preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-300"
          />
          <button
            type="button"
            onClick={() => removeImage()}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById(`file-input-${label}`)?.click()}
        >
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">Otpremi sliku</p>
          <p className="text-sm text-gray-600">
            Prevucite sliku ovde ili kliknite da izaberete
          </p>
        </div>
      )}
      
      <input
        id={`file-input-${label}`}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
    </div>
  );
}