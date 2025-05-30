interface FavouriteIconProps {
  isFavourite?: boolean;
  height?: number;
  width?: number;
}
export const FavouriteIcon = ({ height = 20, width = 20, isFavourite = false }: FavouriteIconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.6107 3L12.8851 7.60778L17.9713 8.35121L14.291 11.9359L15.1596 17L10.6107 14.6078L6.06178 17L6.93034 11.9359L3.25 8.35121L8.33623 7.60778L10.6107 3Z"
        stroke={isFavourite ? '#FCD87C' : '#898794'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={isFavourite ? '#FCD87C' : 'none'}
      />
    </svg>
  );
};
