const WaveIcon = ({ width, height }: { width?: number; height?: number }) => {
  return (
    <svg
      width={width || '26'}
      height={height || '26'}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 9.55556L1 14.4444M6.5 10.7778V13.2222M12 4.66667V19.3333M17.5 1V23M23 9.55556V14.4444"
        stroke="#6D56FA"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default WaveIcon;
