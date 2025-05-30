interface EditIconProps {
  height?: number;
  width?: number;
}
export function EditIcon({ width = 18, height = 18 }: EditIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.9626 3.83161C13.1414 3.65279 13.3537 3.51094 13.5874 3.41416C13.821 3.31739 14.0714 3.26758 14.3243 3.26758C14.5772 3.26758 14.8276 3.31739 15.0612 3.41416C15.2949 3.51094 15.5072 3.65279 15.686 3.83161C15.8648 4.01042 16.0066 4.22271 16.1034 4.45635C16.2002 4.68999 16.25 4.9404 16.25 5.19329C16.25 5.44617 16.2002 5.69659 16.1034 5.93022C16.0066 6.16386 15.8648 6.37615 15.686 6.55497L6.49462 15.7463L2.75 16.7676L3.77126 13.023L12.9626 3.83161Z"
        stroke="#15112B"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
