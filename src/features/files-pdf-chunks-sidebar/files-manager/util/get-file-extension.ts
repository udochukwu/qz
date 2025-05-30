export function getFileExtension(filename: string): string {
  const lastIndex = filename.lastIndexOf('.');
  if (lastIndex === -1) {
    return '';
  }
  return filename.slice(lastIndex + 1);
}
