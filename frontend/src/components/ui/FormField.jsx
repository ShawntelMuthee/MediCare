export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  options = [],
  rows = 3,
  className = '',
  helpText,
}) {
  const id = `field-${name}`;

  const baseInputClasses = `
    w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800
    placeholder:text-slate-400
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
    disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
    ${error ? 'border-danger-500 ring-2 ring-danger-500/10' : 'border-slate-200 hover:border-slate-300'}
  `.trim();

  const renderInput = () => {
    if (type === 'select') {
      return (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${baseInputClasses} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%2394a3b8%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22/%3E%3C/svg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
        >
          <option value="">{placeholder || `Select ${label}`}</option>
          {options.map((opt) => (
            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (type === 'textarea') {
      return (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={`${baseInputClasses} resize-none`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
        />
      );
    }

    if (type === 'checkbox') {
      return (
        <label htmlFor={id} className="flex items-center gap-3 cursor-pointer select-none group">
          <div className="relative">
            <input
              type="checkbox"
              id={id}
              name={name}
              checked={!!value}
              onChange={onChange}
              disabled={disabled}
              className="peer sr-only"
              aria-invalid={!!error}
            />
            <div className={`
              w-5 h-5 rounded-md border-2 transition-all duration-200
              peer-checked:bg-primary-500 peer-checked:border-primary-500
              peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500/20
              ${error ? 'border-danger-500' : 'border-slate-300 group-hover:border-slate-400'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}>
              <svg
                className="w-full h-full text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150 absolute inset-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <svg
              className="absolute inset-0 w-full h-full text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150 p-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className={`text-sm ${disabled ? 'text-slate-400' : 'text-slate-700'}`}>
            {label}
            {required && <span className="text-danger-500 ml-0.5">*</span>}
          </span>
        </label>
      );
    }

    return (
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={baseInputClasses}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
      />
    );
  };

  if (type === 'checkbox') {
    return (
      <div className={`${className}`}>
        {renderInput()}
        {error && (
          <p id={`${id}-error`} className="mt-1.5 text-xs text-danger-600 animate-slide-in-up" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-danger-500 ml-0.5">*</span>}
      </label>
      {renderInput()}
      {helpText && !error && (
        <p id={`${id}-help`} className="mt-1.5 text-xs text-slate-400">
          {helpText}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-danger-600 animate-slide-in-up" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
