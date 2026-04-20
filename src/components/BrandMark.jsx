const VARIANTS = {
  red:   { mark: '#FD454C', cutout: '#FFFFFF' },
  white: { mark: '#FFFFFF', cutout: '#151233' },
  navy:  { mark: '#151233', cutout: '#FFFFFF' },
};

export default function BrandMark({ size = 28, variant = 'red' }) {
  const { mark, cutout } = VARIANTS[variant] ?? VARIANTS.red;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 90 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="0" y="30" width="60" height="60" fill={mark} />
      <path d="M 30 0 H 60 A 30 30 0 0 1 60 60 H 30 Z" fill={mark} />
      <rect x="30" y="30" width="30" height="30" fill={cutout} />
    </svg>
  );
}
