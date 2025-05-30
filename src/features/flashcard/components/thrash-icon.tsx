interface ThrashIconProps {
  height?: number;
  width?: number;
  strokeOpacity?: number;
  color?: string;
}
export function ThrashIcon({ height = 18, width = 18, strokeOpacity = 0.5, color }: ThrashIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.1969 5.40508V4.86508C12.1969 4.10901 12.1969 3.73097 12.0497 3.44219C11.9203 3.18817 11.7138 2.98165 11.4598 2.85222C11.171 2.70508 10.7929 2.70508 10.0369 2.70508H8.95687C8.2008 2.70508 7.82277 2.70508 7.53399 2.85222C7.27997 2.98165 7.07345 3.18817 6.94402 3.44219C6.79687 3.73097 6.79687 4.10901 6.79687 4.86508V5.40508M3.42188 5.40508H15.5719M14.2219 5.40508V12.9651C14.2219 14.0992 14.2219 14.6662 14.0012 15.0994C13.807 15.4804 13.4972 15.7902 13.1162 15.9844C12.683 16.2051 12.116 16.2051 10.9819 16.2051H8.01188C6.87777 16.2051 6.31072 16.2051 5.87754 15.9844C5.49652 15.7902 5.18673 15.4804 4.99259 15.0994C4.77187 14.6662 4.77187 14.0992 4.77187 12.9651V5.40508"
        stroke={color || 'currentColor'}
        strokeOpacity={strokeOpacity}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
