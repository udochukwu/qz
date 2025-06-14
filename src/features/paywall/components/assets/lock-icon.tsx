import React from 'react';

const LockIcon = ({ width, height }: { width?: number; height?: number }) => {
  return (
    <svg
      width={width || '26'}
      height={height || '26'}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.125 10.3333V7.66667C5.125 3.98477 8.20304 1 12 1C14.8192 1 17.242 2.64546 18.3029 5M12 16.3333V19M7.6 25H16.4C18.7102 25 19.8653 25 20.7477 24.564C21.5239 24.1805 22.1549 23.5686 22.5504 22.816C23 21.9603 23 20.8402 23 18.6V16.7333C23 14.4931 23 13.373 22.5504 12.5174C22.1549 11.7647 21.5239 11.1528 20.7477 10.7693C19.8653 10.3333 18.7102 10.3333 16.4 10.3333H7.6C5.28978 10.3333 4.13468 10.3333 3.25229 10.7693C2.47612 11.1528 1.84508 11.7647 1.4496 12.5174C1 13.373 1 14.4931 1 16.7333V18.6C1 20.8402 1 21.9603 1.4496 22.816C1.84508 23.5686 2.47612 24.1805 3.25229 24.564C4.13468 25 5.28978 25 7.6 25Z"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default LockIcon;
