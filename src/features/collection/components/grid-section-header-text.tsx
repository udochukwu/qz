import { styled } from 'styled-system/jsx';

interface GridSectionHeaderTextProps {
  text: string;
}

export const GridSectionHeaderText = ({ text }: GridSectionHeaderTextProps) => {
  return (
    <styled.p fontWeight={500} fontSize="1.125rem" lineHeight="1.375rem" color="#3E3646" margin={0}>
      {text}
    </styled.p>
  );
};
