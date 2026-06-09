// components/Icon.tsx
// Thin wrapper around Google Material Symbols Outlined font.
// Usage: <Icon name="arrow_forward" size={16} className="text-primary-action" />

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function Icon({ name, size = 20, className = '' }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontSize: size }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
