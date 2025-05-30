export const HomeIcon = ({ size = 23, color = '#6D56FA', fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 22 23" fill={fill} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.9513 1.87515C11.8491 0.979606 10.27 0.979605 9.16776 1.87515L3.16776 6.75015C2.46663 7.31982 2.05954 8.17511 2.05954 9.07849V17.8766C2.05954 19.5334 3.40269 20.8766 5.05954 20.8766H17.0595C18.7164 20.8766 20.0595 19.5334 20.0595 17.8766V9.07849C20.0595 8.17511 19.6524 7.31982 18.9513 6.75015L12.9513 1.87515Z"
      stroke={color}
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
  </svg>
);
export const SidePanelIconClosed = ({ size = 23, color }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.29001 6.6625V18.1625M22.39 5.5125C22.39 3.60712 20.8454 2.0625 18.94 2.0625H5.14001C3.23463 2.0625 1.69001 3.60712 1.69001 5.5125V19.3125C1.69001 21.2179 3.23463 22.7625 5.14001 22.7625H18.94C20.8454 22.7625 22.39 21.2179 22.39 19.3125V5.5125Z"
      stroke={color || 'currentColor'}
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SidePanelIconOpened = ({ size = 23, color }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18.31 6.29V17.79M22.41 5.14C22.41 3.23462 20.8654 1.69 18.96 1.69H5.16003C3.25465 1.69 1.71003 3.23462 1.71003 5.14V18.94C1.71003 20.8454 3.25465 22.39 5.16003 22.39H18.96C20.8654 22.39 22.41 20.8454 22.41 18.94V5.14Z"
      stroke={color || 'currentColor'}
      stroke-width="2.3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const FolderIcon = ({ size = 23, color }: { size?: number; color?: string }) => (
  <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18.3484 18.8525C19.7943 18.8525 20.8788 17.5806 20.5952 16.2173L19.2204 9.60794C19.0062 8.57815 18.0658 7.83688 16.9736 7.83688H4.24485M18.3484 18.8525H5.40834H4.69121C3.59898 18.8525 2.65859 18.1113 2.44439 17.0815L1.0696 10.4721C0.786027 9.1088 1.87049 7.83688 3.31642 7.83688H4.24485M18.3484 18.8525H19.1776C20.3085 18.8525 21.2703 18.0592 21.4422 16.9844L23.0285 7.07031C23.2421 5.73575 22.1682 4.53218 20.7639 4.53218H15.4956C14.7295 4.53218 14.0141 4.16403 13.5892 3.55112L12.6583 2.20853C12.2333 1.59562 11.5179 1.22748 10.7518 1.22748H7.12683C5.97127 1.22748 4.99654 2.05483 4.85321 3.15735L4.24485 7.83688"
      stroke={color || 'currentColor'}
      strokeWidth="1.83594"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export const LaptopIcon = ({ size = 23, color }: { size?: number; color?: string }) => (
  <svg className="fill-color" width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.56001 4.11999C4.56001 3.30261 5.22263 2.63999 6.04001 2.63999H18.04C18.8574 2.63999 19.52 3.30261 19.52 4.11999V13.72C19.52 14.2281 19.9319 14.64 20.44 14.64C20.9481 14.64 21.36 14.2281 21.36 13.72V4.11999C21.36 2.2864 19.8736 0.799988 18.04 0.799988H6.04001C4.20642 0.799988 2.72001 2.2864 2.72001 4.11999V13.72C2.72001 14.2281 3.13191 14.64 3.64001 14.64C4.14811 14.64 4.56001 14.2281 4.56001 13.72V4.11999ZM1.24001 17.6C0.731905 17.6 0.320007 18.0119 0.320007 18.52C0.320007 19.0281 0.731905 19.44 1.24001 19.44H22.84C23.3481 19.44 23.76 19.0281 23.76 18.52C23.76 18.0119 23.3481 17.6 22.84 17.6H1.24001ZM7.24001 13.72C7.24001 13.0572 7.77727 12.52 8.44001 12.52H12.04C12.7027 12.52 13.24 13.0572 13.24 13.72V14.62C13.24 14.7857 13.1057 14.92 12.94 14.92H7.54001C7.37432 14.92 7.24001 14.7857 7.24001 14.62V13.72Z"
      fill={color || 'currentColor'}
    />
  </svg>
);

export const ClockIcon = ({
  height = '25',
  width = '28',
  color,
}: {
  height?: string;
  width?: string;
  color?: string;
}) => (
  <svg width={width} height={height} viewBox="0 0 28 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M23.3733 12.2C23.3733 6.23535 18.5977 1.40002 12.7067 1.40002C6.81564 1.40002 2.04001 6.23535 2.04001 12.2C2.04001 18.1647 6.81564 23 12.7067 23C15.9467 23 18.8493 21.5374 20.8056 19.2287M23.3733 12.2L26.04 9.50002M23.3733 12.2L20.04 10.175M12.84 8.00002V13.1515C12.84 13.3106 12.9032 13.4632 13.0157 13.5758L14.6839 15.244"
      stroke={color || 'currentColor'}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CollectionIcon = ({ color }: { color?: string }) => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16.04 6.70605L20.04 20.7061"
      stroke={color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.04 6.70605V20.7061"
      stroke={color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.04004 8.70605V20.7061"
      stroke={color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.04004 4.70605V20.7061"
      stroke={color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
