interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'blue' | 'green' | 'purple' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  value,
  max = 100,
  color = 'blue',
  size = 'md'
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
  };

  const sizes = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-right text-sm text-gray-600 mt-1">
        {Math.round(percentage)}%
      </p>
    </div>
  );
}
