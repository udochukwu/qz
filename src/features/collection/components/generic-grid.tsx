import { Grid } from 'styled-system/jsx';
import { ReactNode } from 'react';

interface GenericGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
}

export const GenericGrid = <T,>({ items, renderItem }: GenericGridProps<T>) => {
  return (
    <Grid columns={{ base: 1, lg: 3 }} overflow="auto" gap={{ base: 16, md: 21 }}>
      {items.length > 0 ? items.map((item, index) => renderItem(item, index)) : null}
    </Grid>
  );
};
