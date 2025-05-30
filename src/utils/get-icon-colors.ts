import generatePastelColor from '@/utils/generate-pastel-color';
import { lightenHexColor, rgbStringToHex } from '@/utils/helpers';

export const getIconColors = (id: string): [string, string] => {
  const color = generatePastelColor(id);
  const backgroundColor = lightenHexColor(rgbStringToHex(color), 80);
  return [backgroundColor, color];
};
