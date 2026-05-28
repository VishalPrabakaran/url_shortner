import clsx from 'clsx';

const variantClasses = {
  primary: 'bg-[#0057FF] text-white hover:bg-[#0046CC] focus-visible:ring-[#0057FF]',
  secondary: 'bg-white text-[#111111] border border-[#EAEAEA] hover:border-gray-300 hover:bg-gray-50',
  outline: 'bg-transparent text-[#111111] border border-[#EAEAEA] hover:bg-[#F7F8FA]',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'bg-transparent text-[#666666] hover:bg-gray-100',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-md font-semibold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-60 disabled:pointer-events-none',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
