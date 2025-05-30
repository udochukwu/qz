import { render, screen, fireEvent } from '@testing-library/react';
import MessageRendererV2 from '../message-rendererengine';
import { useUserStore } from '@/stores/user-store';
import { useTranslation } from 'react-i18next';

// Mock the dependencies
jest.mock('@/stores/user-store');
jest.mock('react-i18next');
jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children, className, components }: any) {
    // Process the content to handle custom components
    const content = typeof children === 'string' ? children : '';
    const parts = content.split(/(<mathpix[^>]*>.*?<\/mathpix>)/);

    return (
      <div data-testid="markdown-content" className={className}>
        {parts.map((part, index) => {
          const mathpixMatch = part.match(/<mathpix content="([^"]*)">/);
          if (mathpixMatch) {
            return <div key={index}>{components.mathpix({ content: mathpixMatch[1] })}</div>;
          }
          return <span key={index}>{part}</span>;
        })}
      </div>
    );
  };
});

// Mock styled-system components
jest.mock('@/components/elements/switch', () => ({
  Switch: ({ children, checked, onChange }: any) => (
    <button role="switch" aria-checked={checked} onClick={onChange}>
      {children}
    </button>
  ),
}));

// Mock ChunkButton
jest.mock('@/components/chunk-button', () => ({
  __esModule: true,
  default: ({ chunk_id }: { chunk_id: string }) => <button data-testid="chunk-button">{chunk_id}</button>,
}));

// Mock styled-system/css
jest.mock('styled-system/css', () => ({
  css: (...args: any[]) => args,
}));

// Mock rehype and remark plugins
jest.mock('rehype-katex', () => () => {});
jest.mock('rehype-raw', () => () => {});
jest.mock('remark-math', () => () => {});

jest.mock('mathpix-markdown-it', () => ({
  MathpixLoader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  MathpixMarkdown: ({ text }: { text: string }) => <div data-testid="mathpix-content">{text}</div>,
}));

// Mock the latex processor
jest.mock('../../utils/latex-processor', () => ({
  processLatexContent: jest.fn((text: string) => {
    // Only process text that contains latex delimiters
    if (text.includes('$') || text.includes('\\')) {
      return `<mathpix content="${text}"></mathpix>`;
    }
    return text;
  }),
}));

// Mock MessageLoading and MessageErrorCard components
jest.mock('../message-loading', () => ({
  __esModule: true,
  default: () => <div data-testid="message-loading">Loading...</div>,
}));

jest.mock('../message-error-card', () => ({
  MessageErrorCard: () => <div data-testid="message-error-card">Error occurred</div>,
}));

describe('MessageRendererV2', () => {
  const mockT = jest.fn(key => key);
  const mockSetImpersonated = jest.fn();
  const mockUseUserStore = useUserStore as unknown as jest.Mock;

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
    mockUseUserStore.mockReturnValue({
      impersonated: false,
      setImpersonated: mockSetImpersonated,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render markdown content correctly', () => {
    const message = 'Hello **world**';
    render(<MessageRendererV2 message_id="1" message={message} />);

    expect(screen.getByTestId('markdown-content')).toBeInTheDocument();
  });

  it('should render mathpix content correctly', () => {
    const message = '<mathpix content="E = mc^2"></mathpix>';
    render(<MessageRendererV2 message_id="1" message={message} />);

    expect(screen.getByTestId('mathpix-content')).toBeInTheDocument();
    expect(screen.getByTestId('mathpix-content')).toHaveTextContent('E = mc^2');
  });

  it('should process latex content correctly', () => {
    const { processLatexContent } = require('../../utils/latex-processor');
    const message = 'The formula is $E = mc^2$';
    render(<MessageRendererV2 message_id="1" message={message} />);

    expect(processLatexContent).toHaveBeenCalledWith(message);
    expect(processLatexContent).toHaveReturnedWith('<mathpix content="The formula is $E = mc^2$"></mathpix>');
  });

  it('should process multiple latex formulas in the same message', () => {
    const { processLatexContent } = require('../../utils/latex-processor');
    const message = 'First formula: $E = mc^2$ and second formula: $F = ma$';
    render(<MessageRendererV2 message_id="1" message={message} />);

    expect(processLatexContent).toHaveBeenCalledTimes(1);
    expect(processLatexContent).toHaveBeenCalledWith(message);
    expect(processLatexContent).toHaveReturnedWith(
      '<mathpix content="First formula: $E = mc^2$ and second formula: $F = ma$"></mathpix>',
    );
  });

  it('should handle both inline and display latex formulas', () => {
    const { processLatexContent } = require('../../utils/latex-processor');
    const message = `
      Inline formula: $x^2 + y^2 = z^2$
      
      Display formula:
      $$
      \\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
      $$
    `;
    render(<MessageRendererV2 message_id="1" message={message} />);

    expect(processLatexContent).toHaveBeenCalledTimes(1);
    expect(processLatexContent).toHaveBeenCalledWith(message);
    expect(processLatexContent).toHaveReturnedWith(`<mathpix content="${message}"></mathpix>`);
  });

  it('should not process non-latex content', () => {
    const { processLatexContent } = require('../../utils/latex-processor');
    const message = 'This is just regular text without any formulas';
    render(<MessageRendererV2 message_id="1" message={message} />);

    expect(processLatexContent).toHaveBeenCalledWith(message);
    expect(processLatexContent).toHaveReturnedWith(message);
  });

  it('should handle escaped latex characters', () => {
    const { processLatexContent } = require('../../utils/latex-processor');
    const message = 'The formula is $\\alpha + \\beta = \\gamma$';
    render(<MessageRendererV2 message_id="1" message={message} />);

    expect(processLatexContent).toHaveBeenCalledWith(message);
    expect(processLatexContent).toHaveReturnedWith(
      '<mathpix content="The formula is $\\alpha + \\beta = \\gamma$"></mathpix>',
    );
  });

  // SNAPSHOT TESTS
  it('should match snapshot for markdown content', () => {
    const message = 'Hello **world** with some *italic* and `code`';
    const { container } = render(<MessageRendererV2 message_id="1" message={message} />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot for mathpix content', () => {
    const message = '<mathpix content="E = mc^2"></mathpix>';
    const { container } = render(<MessageRendererV2 message_id="1" message={message} />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot for mixed content', () => {
    const message = 'Hello **world** <mathpix content="E = mc^2"></mathpix> and some more text';
    const { container } = render(<MessageRendererV2 message_id="1" message={message} />);
    expect(container).toMatchSnapshot();
  });

  it('should handle complex mathematical formulas correctly', () => {
    const complexMath = '<mathpix content="\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}"></mathpix>';
    const { container } = render(<MessageRendererV2 message_id="1" message={complexMath} />);
    expect(container).toMatchSnapshot();
  });

  it('should handle multiple mathpix formulas in sequence', () => {
    const multipleMath = `
      <mathpix content="\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}"></mathpix>
      <mathpix content="\\sum_{i=1}^n i = \\frac{n(n+1)}{2}"></mathpix>
      <mathpix content="\\lim_{x \\to \\infty} \\frac{1}{x} = 0"></mathpix>
    `;
    const { container } = render(<MessageRendererV2 message_id="1" message={multipleMath} />);
    expect(container).toMatchSnapshot();
  });

  it('should handle complex markdown with code blocks and inline code', () => {
    const complexMarkdown = `
      # Heading 1
      ## Heading 2
      
      This is a **bold** and *italic* text with \`inline code\`.
      
      \`\`\`python
      def hello_world():
          print("Hello, World!")
      \`\`\`
      
      - List item 1
      - List item 2
        - Nested item
      
      > Blockquote
      
      | Table | Header |
      |-------|---------|
      | Cell  | Cell    |
    `;
    const { container } = render(<MessageRendererV2 message_id="1" message={complexMarkdown} />);
    expect(container).toMatchSnapshot();
  });

  it('should handle mixed content with complex markdown and math formulas', () => {
    const mixedComplexContent = `
      # Mathematical Analysis
      
      The quadratic formula is:
      <mathpix content="x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}"></mathpix>
      
      ## Code Example
      \`\`\`python
      def quadratic_formula(a, b, c):
          discriminant = b**2 - 4*a*c
          return (-b + math.sqrt(discriminant))/(2*a)
      \`\`\`
      
      ### Important Notes
      - The **discriminant** determines the nature of the roots
      - When discriminant > 0: Two real roots
      - When discriminant = 0: One real root
      
      The integral of e^x is:
      <mathpix content="\\int e^x dx = e^x + C"></mathpix>
      
      > Note: C is the constant of integration
    `;
    const { container } = render(<MessageRendererV2 message_id="1" message={mixedComplexContent} />);
    expect(container).toMatchSnapshot();
  });

  it('should handle special characters in mathpix content', () => {
    const specialChars = '<mathpix content="\\alpha + \\beta = \\gamma \\pm \\delta"></mathpix>';
    const { container } = render(<MessageRendererV2 message_id="1" message={specialChars} />);
    expect(container).toMatchSnapshot();
  });

  it('should handle markdown with links and images', () => {
    const markdownWithMedia = `
      [Link to documentation](https://example.com)
      
      ![Image description](https://example.com/image.jpg)
      
      <mathpix content="\\text{Image processing formula: } \\mathcal{F}\\{f(x,y)\\}"></mathpix>
    `;
    const { container } = render(<MessageRendererV2 message_id="1" message={markdownWithMedia} />);
    expect(container).toMatchSnapshot();
  });
});
