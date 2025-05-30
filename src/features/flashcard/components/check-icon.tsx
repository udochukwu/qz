interface CheckIconProps {
  width?: string;
  height?: string;
}

export const CheckIcon = ({ width = '19', height = '14' }: CheckIconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.4194 1.37939L6.06593 12.7328L0.905273 7.57218"
        stroke="#00B389"
        stroke-width="1.62192"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
