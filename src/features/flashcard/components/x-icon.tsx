interface XIconProps {
  width?: string;
  height?: string;
}

export const XIcon = ({ width = '16', height = '16' }: XIconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.3054 1.50537L1.19629 14.6145M1.19629 1.50537L14.3054 14.6145"
        stroke="#FF0D0D"
        stroke-width="1.63865"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
