export const parsePlaceholderParams = (chunkString: string): { chunk_id: string } => {
  // Trim the string and remove the surrounding tags to extract just the chunk_id
  const chunkId = chunkString
    .trim()
    .replace(/<\/?chunk>/g, '')
    .trim();
  return { chunk_id: chunkId };
};

// Process lists
const processList = (element: HTMLElement, level = 0, previousElement: Element | null = null): HTMLElement => {
  if (element.tagName === 'UL' || element.tagName === 'OL') {
    const listType = element.tagName === 'UL' ? 'unordered' : 'ordered';
    let count = 0;

    const wrapper = document.createElement('span');
    wrapper.className = 'list-wrapper';

    const listSpan = document.createElement('span');
    listSpan.className = `list-container level-${level}`;

    Array.from(element.children).forEach(child => {
      let itemIndex = 0;
      if (child.tagName === 'LI') {
        const itemWrapper = document.createElement('span');
        itemWrapper.className = 'item-wrapper';
        // Conditionally add <br> above itemSpan
        //we want to add the br between the list items every time / except the first item  and the previous sibling is not a span

        // if (itemIndex !== 0 && previousElement && previousElement.tagName !== 'SPAN') {

        //
        if (
          (itemIndex === 0 && previousElement && previousElement.tagName === 'SPAN') ||
          !previousElement ||
          previousElement.tagName === 'SPAN'
        ) {
          const itemBr = document.createElement('br');
          itemWrapper.appendChild(itemBr);
        }

        const itemSpan = document.createElement('span');
        itemSpan.className = 'list-item';

        let bullet;
        if (listType === 'unordered') {
          switch (level % 3) {
            case 0:
              bullet = '•';
              break; // Disc
            case 1:
              bullet = '○';
              break; // Circle
            case 2:
              bullet = '▪';
              break; // Square
          }
        } else {
          bullet = `${++count}.`;
        }

        const bulletSpan = document.createElement('span');
        bulletSpan.className = 'list-bullet';
        bulletSpan.textContent = bullet ?? '';

        itemSpan.appendChild(bulletSpan);

        Array.from(child.childNodes).forEach(node => {
          if (
            (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'UL') ||
            (node as Element).tagName === 'OL'
          ) {
            // Process nested list
            itemSpan.appendChild(processList(node as HTMLElement, level + 1));
          } else {
            itemSpan.appendChild(node.cloneNode(true));
          }
        });

        itemWrapper.appendChild(itemSpan);
        listSpan.appendChild(itemWrapper);
        itemIndex++;
      }
    });
    wrapper.appendChild(listSpan);
    return wrapper;
  }
  return element;
};
export const processContentRecursively = (node: HTMLElement): HTMLElement => {
  if (node.nodeType === Node.ELEMENT_NODE) {
    if (node.tagName === 'UL' || node.tagName === 'OL') {
      return processList(node, 0, node.previousElementSibling);
    } else {
      // Process child nodes
      Array.from(node.childNodes).forEach((child, index) => {
        const processed = processContentRecursively(child as HTMLElement);
        if (processed !== child) {
          node.replaceChild(processed, child);
        }
      });
    }
  }
  return node;
};
