interface ShevronLeftProps {
  width?: string;
  height?: string;
}

export const ShevronLeftIcon = ({ width = '7', height = '12' }: ShevronLeftProps) => {
  return (
    <svg
      width={width}
      height={height}
      style={{ transform: 'translateX(-1px)' }}
      viewBox="0 0 7 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.14124 10.8911L1.25 5.99988L6.14124 1.10864"
        stroke="#15112B"
        strokeWidth="1.22281"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
