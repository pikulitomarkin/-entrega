interface BadgeProps {
  label: string;
  color?: string;
  bgColor?: string;
  className?: string;
}

export default function Badge({ label, color = 'text-white', bgColor = 'bg-dark-700', className = '' }: BadgeProps) {
  return (
    <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${bgColor} ${color} ${className}`}>
      {label}
    </span>
  );
}
