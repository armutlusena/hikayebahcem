import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-gray-700 font-semibold mb-2 text-lg">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 border-2 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[48px] ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-2 text-red-600 text-sm">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
