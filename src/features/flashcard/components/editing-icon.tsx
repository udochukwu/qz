interface EditingIconProps {
  height?: number;
  width?: number;
}
export function EditingIcon({ width = 16, height = 16 }: EditingIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.3279 1.10902C10.4868 0.950073 10.6755 0.823987 10.8832 0.737964C11.0909 0.651941 11.3135 0.607666 11.5383 0.607666C11.763 0.607666 11.9856 0.651941 12.1933 0.737964C12.401 0.823987 12.5897 0.950073 12.7486 1.10902C12.9076 1.26797 13.0337 1.45667 13.1197 1.66435C13.2057 1.87203 13.25 2.09462 13.25 2.31941C13.25 2.5442 13.2057 2.76678 13.1197 2.97446C13.0337 3.18214 12.9076 3.37084 12.7486 3.52979L4.57855 11.6999L1.25 12.6077L2.15779 9.27911L10.3279 1.10902Z"
        stroke="#6D56FA"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
