import clsx from 'clsx';

export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-3xl border border-[#EAEAEA] bg-white shadow-sm transition-shadow duration-200 hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
