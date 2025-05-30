interface ThrashIconProps {
  height?: number;
  width?: number;
  color?: string;
}
export function ThrashIcon({ height = 22, width = 16, color }: ThrashIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 4H3C1.89543 4 1 4.89543 1 6V6.5C1 6.77614 1.22386 7 1.5 7H14.5C14.7761 7 15 6.77614 15 6.5V6C15 4.89543 14.1046 4 13 4H10M6 4V3C6 1.89543 6.89543 1 8 1V1C9.10457 1 10 1.89543 10 3V4M6 4H10M6 14V17M10 14V17M13.248 18.2716L13.9009 11.0905C13.9541 10.5049 13.493 10 12.905 10H3.09503C2.507 10 2.0459 10.5049 2.09914 11.0905L2.75196 18.2716C2.89244 19.8168 4.18803 21 5.73964 21H10.2604C11.812 21 13.1076 19.8168 13.248 18.2716Z"
        stroke={color || 'currentColor'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
