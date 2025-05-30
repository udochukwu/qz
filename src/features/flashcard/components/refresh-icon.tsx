interface RefreshIconProps {
  height?: number;
  width?: number;
}

export const RefreshIcon = ({ height = 16, width = 16 }: RefreshIconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0.875 6C0.875 6 2.37874 3.95116 3.60038 2.72868C4.82202 1.5062 6.5102 0.75 8.375 0.75C12.1029 0.75 15.125 3.77208 15.125 7.5C15.125 11.2279 12.1029 14.25 8.375 14.25C5.29768 14.25 2.70133 12.1907 1.88882 9.375M0.875 6V1.5M0.875 6H5.375"
        stroke="#15112B"
        stroke-opacity="0.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
