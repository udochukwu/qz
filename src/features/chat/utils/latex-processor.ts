export const processLatexContentGitstart = (content: string): string => {
  let processed = content
    // Block-level LaTeX
    .replace(/\\\[(.*?)\\\]/gs, (_, equation) => `$$${equation}$$`)
    // Inline LaTeX
    .replace(/\\\((.*?)\\\)/gs, (_, equation) => `$${equation}$`)
    // Highlight marks
    .replace(/==(\S(?:(?!==).)*\S)==/g, '<mark>$1</mark>')
    // Process mathpix content
    .replace(
      /\\begin\{(\w+)\}((?:(?!\\begin\{\1\})(?!\\end\{\1\})[\s\S])*?)\\end\{\1\}/g,
      (_, key, content) => `<br/><br/><mathpix content="\\begin{${key}}${content}\\end{${key}}"></mathpix><br/><br/>`,
    );

  // Ensure proper spacing around block-level LaTeX
  processed = processed.replace(/(\$\$.*?\$\$)(?!<br\/>)/g, '$1<br/><br/>');

  return processed;
};

/**
 * @param content
 * @returns
 */
export const processLatexContent = (content: string): string => {
  let processed = content
    // Block-level LaTeX
    .replace(/\\\[(.*?)\\\]/gs, (_, equation) => `$$${equation}$$`)
    // Inline LaTeX
    .replace(/\\\((.*?)\\\)/gs, (_, equation) => `$${equation}$`)
    // Highlight marks
    .replace(/==(\S(?:(?!==).)*\S)==/g, '<mark>$1</mark>')
    // Process mathpix content
    .replace(
      /\\begin\{(\w+)\}((?:(?!\\begin\{\1\})(?!\\end\{\1\})[\s\S])*?)\\end\{\1\}/g,
      (_, key, content) => `<mathpix content="\\begin{${key}}${content}\\end{${key}}"></mathpix>`,
    );
  // Ensure a newline follows block-level LaTeX if not present
  processed = processed.replace(/(\$\$.*?\$\$)(?!\n)/gs, '$1\n');
  return processed;
};
