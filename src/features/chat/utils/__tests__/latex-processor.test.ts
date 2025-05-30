import { processLatexContent, processLatexContentOld } from '../latex-processor';

describe('processLatexContent', () => {
  it('should process block-level LaTeX correctly', () => {
    const input = '\\[E = mc^2\\]';
    const expected = '$$E = mc^2$$<br/><br/>';
    expect(processLatexContent(input)).toBe(expected);
  });

  it('should process inline LaTeX correctly', () => {
    const input = '\\(F = ma\\)';
    const expected = '$F = ma$';
    expect(processLatexContent(input)).toBe(expected);
  });

  it('should process highlight marks correctly', () => {
    const input = '==important text==';
    const expected = '<mark>important text</mark>';
    expect(processLatexContent(input)).toBe(expected);
  });

  it('should process mathpix content correctly', () => {
    const input = '\\begin{equation}E = mc^2\\end{equation}';
    const expected = '<br/><br/><mathpix content="\\begin{equation}E = mc^2\\end{equation}"></mathpix><br/><br/>';
    expect(processLatexContent(input)).toBe(expected);
  });

  it('should handle multiple LaTeX expressions in the same text', () => {
    const input = '\\[E = mc^2\\] and \\(F = ma\\)';
    const expected = '$$E = mc^2$$<br/><br/> and $F = ma$';
    expect(processLatexContent(input)).toBe(expected);
  });

  it('should handle nested mathpix environments', () => {
    const input = '\\begin{equation}\\begin{matrix}a & b \\\\ c & d\\end{matrix}\\end{equation}';
    const expected =
      '<br/><br/><mathpix content="\\begin{equation}\\begin{matrix}a & b \\\\ c & d\\end{matrix}\\end{equation}"></mathpix><br/><br/>';
    expect(processLatexContent(input)).toBe(expected);
  });

  it('should handle text with no LaTeX content', () => {
    const input = 'Plain text without any LaTeX';
    expect(processLatexContent(input)).toBe(input);
  });

  it('should handle empty string', () => {
    expect(processLatexContent('')).toBe('');
  });

  it('should handle mixed content with highlights and LaTeX', () => {
    const input = '==Important== \\[E = mc^2\\] and \\(F = ma\\)';
    const expected = '<mark>Important</mark> $$E = mc^2$$<br/><br/> and $F = ma$';
    expect(processLatexContent(input)).toBe(expected);
  });

  // New test cases
  it('should handle complex mathpix environments with multiple nested structures', () => {
    const input = '\\begin{align}\\begin{cases}x = y \\\\ y = z\\end{cases}\\end{align}';
    const expected =
      '<br/><br/><mathpix content="\\begin{align}\\begin{cases}x = y \\\\ y = z\\end{cases}\\end{align}"></mathpix><br/><br/>';
    expect(processLatexContent(input)).toBe(expected);
  });

  it('should handle multiple consecutive block-level LaTeX expressions', () => {
    const input = '\\[E = mc^2\\]\\[F = ma\\]';
    const expected = '$$E = mc^2$$<br/><br/>$$F = ma$$<br/><br/>';
    expect(processLatexContent(input)).toBe(expected);
  });

  it('should handle highlight marks with special characters', () => {
    const input = '==text with spaces and special chars: @#$%==';
    const expected = '<mark>text with spaces and special chars: @#$%</mark>';
    expect(processLatexContent(input)).toBe(expected);
  });

  it('should handle highlight marks with LaTeX inside', () => {
    const input = '==text with \\[E = mc^2\\]==';
    const expected = '<mark>text with $$E = mc^2$$<br/><br/></mark>';
    expect(processLatexContent(input)).toBe(expected);
  });

  it('should handle multiple mathpix environments with different types', () => {
    const input = '\\begin{equation}E = mc^2\\end{equation}\\begin{align}F = ma\\end{align}';
    const expected =
      '<br/><br/><mathpix content="\\begin{equation}E = mc^2\\end{equation}"></mathpix><br/><br/><br/><br/><mathpix content="\\begin{align}F = ma\\end{align}"></mathpix><br/><br/>';
    expect(processLatexContent(input)).toBe(expected);
  });

  it('should handle text with all types of content mixed together', () => {
    const input = '==Important== \\[E = mc^2\\] and \\(F = ma\\) \\begin{equation}x = y\\end{equation}';
    const expected =
      '<mark>Important</mark> $$E = mc^2$$<br/><br/> and $F = ma$ <br/><br/><mathpix content="\\begin{equation}x = y\\end{equation}"></mathpix><br/><br/>';
    expect(processLatexContent(input)).toBe(expected);
  });

  it('should handle whitespace around LaTeX expressions', () => {
    const input = '  \\[E = mc^2\\]  \\(F = ma\\)  ';
    const expected = '  $$E = mc^2$$<br/><br/>  $F = ma$  ';
    expect(processLatexContent(input)).toBe(expected);
  });

  it('should handle escaped characters in LaTeX expressions', () => {
    const input = '\\[\\text{text with \\\\ backslash}\\]';
    const expected = '$$\\text{text with \\\\ backslash}$$<br/><br/>';
    expect(processLatexContent(input)).toBe(expected);
    expect(processLatexContent(input)).toMatchSnapshot();
  });

  it('should handle multiple formula expressions in parallel', () => {
    const input = `
$$ \\int e^x dx = e^x + C $$
$$ \\int a^x dx = \\frac{a^x}{\\ln a} + C $$
`;
    const expected = `
$$ \\int e^x dx = e^x + C $$<br/><br/>
$$ \\int a^x dx = \\frac{a^x}{\\ln a} + C $$<br/><br/>
`;
    expect(processLatexContent(input)).toBe(expected);
    expect(processLatexContent(input)).toMatchSnapshot();
  });
});
