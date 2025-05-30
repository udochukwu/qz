export function extractFileName(filename: string): string {
  const lastIndex = filename.lastIndexOf('.');
  if (lastIndex === -1) {
    return '';
  }
  return filename.slice(0, lastIndex);
}
