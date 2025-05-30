interface ShevronRightProps {
  width?: string;
  height?: string;
}

export const ShevronRightIcon = ({ width = '7', height = '12' }: ShevronRightProps) => {
  return (
    <svg
      width={width}
      height={height}
      style={{ transform: 'translateX(1px)' }}
      viewBox="0 0 13 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.84814 19.8348L10.9569 10.7261L1.84814 1.61731"
        stroke="#15112B"
        stroke-width="2.27719"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
