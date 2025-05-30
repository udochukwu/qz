import { styled } from 'styled-system/jsx';
import { GridSectionHeaderText } from './grid-section-header-text';
import { GenericGrid } from './generic-grid';
import { ReactNode } from 'react';

interface GenericGridSectionProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
}

const StickyHeader = styled('div', {
  base: {
    position: 'sticky',
    top: '0',
    backgroundColor: '#F8F8F9',
    zIndex: '5',
    paddingBottom: '24px',
  },
});

export const GenericGridSection = <T,>({ title, items, renderItem }: GenericGridSectionProps<T>) => {
  return (
    <div>
      <StickyHeader>
        <GridSectionHeaderText text={title} />
      </StickyHeader>
      <GenericGrid items={items} renderItem={renderItem} />
    </div>
  );
};
