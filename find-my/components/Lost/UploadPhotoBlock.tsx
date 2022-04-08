import { UseFormRegisterReturn } from 'react-hook-form';
import React from 'react';
interface Props {
  register: UseFormRegisterReturn;
  previewImage?: string;
  clear: () => void;
}
function UploadPhotoBlock({ register, previewImage, clear }: Props) {
  return (
    <div>
      {!previewImage ? (
        <div className="flex flex-col items-center justify-center border border-slate-400 rounded w-20 h-20">
          <label className="hover:text-blue-400 cursor-pointer">
            <svg className="h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input {...register} className="hidden" type="file" accept="image/*" />
          </label>
          <span className="-mt-2 ">사진추가</span>
        </div>
      ) : (
        <div className="w-20 h-20 bg-slate-500 rounded relative z-10">
          <img src={previewImage} className="w-20 h-20 bg-slate-500 rounded" />
          <button onClick={clear} className="absolute text-white p-1 bg-black rounded-full -right-1 -top-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default React.memo(UploadPhotoBlock);
