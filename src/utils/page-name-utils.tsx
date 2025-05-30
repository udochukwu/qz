export function getPageName(page_path: string): string {
  if (page_path.includes('/c/')) {
    return 'chat';
  } else if (page_path.includes('/classes/')) {
    return 'class';
  } else if (page_path == '/files') {
    return 'files';
  } else if (page_path == '/collection') {
    return 'collection';
  } else {
    return 'other';
  }
}

export function getChatIdFromPath(page_path: string): string {
  const path_parts = page_path.split('/');
  const chat_id_index = path_parts.indexOf('c') + 1;
  return path_parts[chat_id_index];
}
