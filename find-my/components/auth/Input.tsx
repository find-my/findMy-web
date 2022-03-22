import type { UseFormRegisterReturn } from 'react-hook-form';
interface InputProps {
  register: UseFormRegisterReturn;
  icon: React.ReactNode;
  type: string;
  placeholder: string;
}

export default function Input({ register, icon, type, placeholder }: InputProps) {
  return (
    <div className="mb-3 relative">
      <div className="mr-1.5 text-2xl absolute left-2 top-1 text-gray-400">{icon}</div>
      <input
        {...register}
        className="bg-white shadow appearance-none border  rounded w-full px-10 py-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-400"
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
}
