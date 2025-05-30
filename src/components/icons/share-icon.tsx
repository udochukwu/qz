interface ShareIconProps {
  height?: number;
  width?: number;
  color?: string;
}
export function ShareIcon({ height = 16, width = 18, color }: ShareIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 7V10.75C1 12.8211 2.34315 14.5 4 14.5H14C15.6569 14.5 17 12.8211 17 10.75V7M9 9.5V1M9 1L5.875 4.125M9 1L12.125 4.125"
        stroke={color || 'currentColor'}
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
