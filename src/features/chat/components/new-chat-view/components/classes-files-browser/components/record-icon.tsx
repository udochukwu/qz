import React from 'react';
import { styled } from 'styled-system/jsx';
export const RecordIcon = ({ size = 20, color = 'currentColor' }) => (
  <styled.svg width={size} height={size} fill="white" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 1.5C5.30558 1.5 1.5 5.30558 1.5 10C1.5 14.6944 5.30558 18.5 10 18.5C14.6944 18.5 18.5 14.6944 18.5 10C18.5 5.30558 14.6944 1.5 10 1.5ZM0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z"
      fill={color || 'currentColor'}
    />
    <path
      d="M14 10C14 12.2091 12.2091 14 10 14C7.79086 14 6 12.2091 6 10C6 7.79086 7.79086 6 10 6C12.2091 6 14 7.79086 14 10Z"
      fill={color || 'currentColor'}
    />
  </styled.svg>
);
export const RecordIconInverted = ({ size = 20, color = 'currentColor' }) => (
  <styled.svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM7 9.8C8.5464 9.8 9.8 8.5464 9.8 7C9.8 5.4536 8.5464 4.2 7 4.2C5.4536 4.2 4.2 5.4536 4.2 7C4.2 8.5464 5.4536 9.8 7 9.8Z"
      fill={color || 'currentColor'}
    />
  </styled.svg>
);

export const RecordIconSmall = ({ size = 20, color = 'currentColor' }) => (
  <styled.svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.1895 3.2C6.65483 3.2 3.78945 6.06538 3.78945 9.6C3.78945 13.1346 6.65483 16 10.1895 16C13.7241 16 16.5895 13.1346 16.5895 9.6C16.5895 6.06538 13.7241 3.2 10.1895 3.2ZM2.18945 9.6C2.18945 5.18172 5.77118 1.6 10.1895 1.6C14.6077 1.6 18.1895 5.18172 18.1895 9.6C18.1895 14.0183 14.6077 17.6 10.1895 17.6C5.77118 17.6 2.18945 14.0183 2.18945 9.6Z"
      fill={color || 'currentColor'}
    />
    <path
      d="M13.3895 9.6C13.3895 11.3673 11.9568 12.8 10.1895 12.8C8.42214 12.8 6.98945 11.3673 6.98945 9.6C6.98945 7.83269 8.42214 6.4 10.1895 6.4C11.9568 6.4 13.3895 7.83269 13.3895 9.6Z"
      fill={color || 'currentColor'}
    />
  </styled.svg>
);
