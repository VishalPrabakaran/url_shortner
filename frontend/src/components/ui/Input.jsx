import clsx from 'clsx';

export default function Input({
  label,
  icon,
  className = '',
  containerClassName = '',
  ...props
}) {
  return (
    <div className={clsx('space-y-2', containerClassName)}>
      {label && <label className="text-[11px] font-bold uppercase tracking-wider text-[#111111]">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={clsx(
            'w-full rounded-md border border-[#EAEAEA] bg-[#FAFAFA] py-2 pr-3 text-[13px] text-[#111111] placeholder-gray-400 transition-all duration-200 focus:border-[#0057FF] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0057FF]',
            icon ? 'pl-9' : 'pl-3',
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
}
