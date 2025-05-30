interface ShuffleIconProps {
  stroke?: string;
}

export const ShuffleIcon = ({ stroke = '#15112B80' }: ShuffleIconProps) => {
  return (
    <svg width="24" height="24" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.2009 1.72693H18.2009M18.2009 1.72693V6.72693M18.2009 1.72693L1.20093 18.7269M18.2009 14.7269V19.7269M18.2009 19.7269H13.2009M18.2009 19.7269L12.2009 13.7269M1.20093 2.72693L6.20093 7.72693"
        stroke={stroke}
        stroke-width="2.27719"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
