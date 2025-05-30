export const AddIcon = ({ width = 25, height = 25, color }: { width?: number; height?: number; color?: string }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.5 5.55273V19.5527M5.5 12.5527H19.5"
        stroke={color || 'currentColor'}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
