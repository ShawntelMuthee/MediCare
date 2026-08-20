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

export default function Badge({
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

/** Convenience helper to color-code BMI values */
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
