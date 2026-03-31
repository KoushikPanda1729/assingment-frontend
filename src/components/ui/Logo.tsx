interface LogoProps {
  size?: number
}

export function Logo({ size = 32 }: LogoProps) {
  const id = `grad-${size}`
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient
          id={`${id}-shine`}
          x1="0"
          y1="0"
          x2="0"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="white" stopOpacity="0.15" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="40" height="40" rx="11" fill={`url(#${id})`} />

      {/* Shine overlay */}
      <rect width="40" height="40" rx="11" fill={`url(#${id}-shine)`} />

      {/* Film strip — left side */}
      <rect x="8" y="11" width="4" height="6" rx="1.5" fill="white" opacity="0.9" />
      <rect x="8" y="23" width="4" height="6" rx="1.5" fill="white" opacity="0.9" />

      {/* Vertical divider line */}
      <rect x="14" y="10" width="1.5" height="20" rx="0.75" fill="white" opacity="0.2" />

      {/* Play triangle */}
      <path d="M19 13.5L30.5 20L19 26.5V13.5Z" fill="white" />
    </svg>
  )
}
