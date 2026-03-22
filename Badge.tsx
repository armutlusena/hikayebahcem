import * as LucideIcons from 'lucide-react';

interface BadgeProps {
  name: string;
  description: string;
  icon: string;
  earned?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Badge({ name, description, icon, earned = false, size = 'md' }: BadgeProps) {
  const Icon = (LucideIcons as any)[icon] || LucideIcons.Award;

  const sizes = {
    sm: { container: 'w-20 h-20', icon: 24, text: 'text-xs' },
    md: { container: 'w-28 h-28', icon: 32, text: 'text-sm' },
    lg: { container: 'w-36 h-36', icon: 48, text: 'text-base' },
  };

  const currentSize = sizes[size];

  return (
    <div className="flex flex-col items-center gap-2 p-3">
      <div
        className={`${currentSize.container} rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          earned
            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 scale-100'
            : 'bg-gray-300 scale-95 opacity-50'
        }`}
      >
        <Icon size={currentSize.icon} className={earned ? 'text-white' : 'text-gray-500'} />
      </div>
      <div className="text-center">
        <p className={`font-bold ${currentSize.text}`}>{name}</p>
        <p className={`text-gray-600 ${currentSize.text} max-w-[120px]`}>{description}</p>
      </div>
    </div>
  );
}
