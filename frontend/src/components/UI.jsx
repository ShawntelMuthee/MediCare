import React, { useState, useEffect, useRef } from "react";

// --- Badge.jsx ---

const colorMap = {
  blue: 'bg-primary-50 text-primary-700 border border-primary-200',
  green: 'bg-success-50 text-success-700 border border-success-200',
  yellow: 'bg-warning-50 text-warning-600 border border-warning-200',
  red: 'bg-danger-50 text-danger-700 border border-danger-200',
  slate: 'bg-slate-100 text-slate-600 border border-slate-200',
  purple: 'bg-purple-50 text-purple-700 border border-purple-200',
};

const sizeMap = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export function Badge({
  children,
  color = 'blue',
  size = 'md',
  dot = false,
  className = '',
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${colorMap[color] || colorMap.blue}
        ${sizeMap[size] || sizeMap.md}
        ${className}
      `.trim()}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full bg-current opacity-70`} />
      )}
      {children}
    </span>
  );
}

export function getBmiColor(bmi) {
  if (bmi < 18.5) return 'blue';
  if (bmi < 25) return 'green';
  if (bmi < 30) return 'yellow';
  return 'red';
}

export function getBmiLabel(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}


// --- Button.jsx ---

const variants = {
  primary: `
    bg-primary-600 text-white
    hover:bg-primary-700 active:bg-primary-800
    shadow-sm hover:shadow-md
    focus-visible:ring-2 focus-visible:ring-primary-500/30 focus-visible:ring-offset-2
  `,
  secondary: `
    bg-white text-slate-700 border border-slate-200
    hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100
    focus-visible:ring-2 focus-visible:ring-primary-500/20 focus-visible:ring-offset-2
  `,
  danger: `
    bg-danger-600 text-white
    hover:bg-danger-700 active:bg-danger-800
    shadow-sm hover:shadow-md
    focus-visible:ring-2 focus-visible:ring-danger-500/30 focus-visible:ring-offset-2
  `,
  ghost: `
    text-slate-600
    hover:bg-slate-100 hover:text-slate-800 active:bg-slate-200
    focus-visible:ring-2 focus-visible:ring-primary-500/20
  `,
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  icon,
  fullWidth = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-200 ease-out
        outline-none cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}


// --- Card.jsx ---

export function Card({
  children,
  title,
  subtitle,
  headerAction,
  className = '',
  padding = true,
  hoverable = false,
  onClick,
}) {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-slate-100 shadow-card
        transition-all duration-200 ease-out
        ${hoverable ? 'hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer' : ''}
        ${className}
      `.trim()}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-800">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={padding ? 'p-6' : ''}>{children}</div>
    </div>
  );
}


// --- EmptyState.jsx ---

export function EmptyState({
  icon,
  title = 'No data found',
  description = 'There are no records to display at this time.',
  action,
  className = '',
}) {
  const defaultIcon = (
    <svg className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  );

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in ${className}`}>
      <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center mb-5">
        {icon || defaultIcon}
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}


// --- FormField.jsx ---

export function FormField({
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
  ...props
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
          {...props}
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
          {...props}
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
              {...props}
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
        {...props}
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


// --- LoadingSkeleton.jsx ---

export function SkeletonLine({ className = '', width = 'w-full' }) {
  return (
    <div
      className={`h-4 rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:400%_100%] animate-shimmer ${width} ${className}`}
    />
  );
}

export function SkeletonBlock({ className = '', lines = 3 }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine
          key={i}
          width={i === lines - 1 ? 'w-2/3' : 'w-full'}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 p-6 ${className}`}>
      <div className="flex items-center gap-4 mb-5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:400%_100%] animate-shimmer flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonLine width="w-1/3" />
          <SkeletonLine width="w-1/2" className="h-3" />
        </div>
      </div>
      <SkeletonBlock lines={3} />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 overflow-hidden ${className}`}>
      <div className="grid gap-4 px-6 py-4 border-b border-slate-100" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonLine key={i} width="w-3/4" className="h-3" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="grid gap-4 px-6 py-4 border-b border-slate-50 last:border-b-0"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <SkeletonLine key={colIdx} width={colIdx === 0 ? 'w-full' : 'w-2/3'} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function LoadingSkeleton({ type = 'block', ...props }) {
  switch (type) {
    case 'card':
      return <SkeletonCard {...props} />;
    case 'table':
      return <SkeletonTable {...props} />;
    case 'line':
      return <SkeletonLine {...props} />;
    default:
      return <SkeletonBlock {...props} />;
  }
}


// --- Modal.jsx ---

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);

  const sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      dialogRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`
          bg-white rounded-2xl shadow-modal w-full ${sizeMap[size]}
          animate-slide-in-up outline-none border border-slate-100
        `}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 id="modal-title" className="text-lg font-semibold text-slate-800">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}


// --- Toast.jsx ---

const iconMap = {
  success: (
    <svg className="w-5 h-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 text-danger-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const bgMap = {
  success: 'bg-success-50 border-success-200',
  error: 'bg-danger-50 border-danger-200',
  info: 'bg-primary-50 border-primary-200',
};

const progressMap = {
  success: 'bg-success-500',
  error: 'bg-danger-500',
  info: 'bg-primary-500',
};

function ToastItem({ toast, onRemove }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 200);
  };

  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => onRemove(toast.id), 200);
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border shadow-toast backdrop-blur-md
        transition-all duration-200
        ${bgMap[toast.type] || bgMap.info}
        ${isExiting ? 'opacity-0 translate-x-8' : 'animate-toast-in'}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3 p-4">
        <div className="flex-shrink-0 mt-0.5">{iconMap[toast.type] || iconMap.info}</div>
        <div className="flex-1 min-w-0">
          {toast.title && <p className="text-sm font-semibold text-slate-800">{toast.title}</p>}
          {toast.message && <p className="text-sm text-slate-600 mt-0.5">{toast.message}</p>}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Dismiss notification"
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {toast.duration > 0 && (
        <div className="h-0.5 w-full bg-black/5">
          <div
            className={`h-full ${progressMap[toast.type] || progressMap.info} opacity-40`}
            style={{ animation: `toast-progress ${toast.duration}ms linear forwards` }}
          />
        </div>
      )}
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}
