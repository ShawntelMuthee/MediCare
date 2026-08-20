export default function Card({
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
