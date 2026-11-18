import 'server-only';
import { createHighlighter, type Highlighter } from 'shiki';
import type { CodeBlock, ContentBlock } from './content-types';

// Syntax highlighting runs once at build time, so pages ship coloured HTML and no highlighter JS.
// Only the languages offered in the Studio code picker are loaded; anything else renders as plain text.
const LANGUAGES = ['typescript', 'tsx', 'javascript', 'jsx', 'json', 'html', 'css', 'bash', 'python', 'sql', 'yaml', 'markdown'] as const;
const THEME = 'github-dark';

let highlighter: Promise<Highlighter> | undefined;
const getHighlighter = () => (highlighter ??= createHighlighter({ themes: [THEME], langs: [...LANGUAGES] }));

const isCode = (block: ContentBlock): block is CodeBlock => block?._type === 'code';

const highlight = async (block: CodeBlock): Promise<CodeBlock> => {
  const code = typeof block.code === 'string' ? block.code : '';
  if (!code.trim()) return block;
  const lang = LANGUAGES.find(language => language === block.language) ?? 'text';
  const marked = new Set(Array.isArray(block.highlightedLines) ? block.highlightedLines : []);
  const html = (await getHighlighter()).codeToHtml(code, {
    lang,
    theme: THEME,
    transformers: [{ line(node, line) { if (marked.has(line)) this.addClassToHast(node, 'is-highlighted'); } }],
  });
  return { ...block, html };
};

export const withHighlightedCode = async (blocks?: ContentBlock[] | null): Promise<ContentBlock[]> =>
  Promise.all((blocks ?? []).map(block => (isCode(block) ? highlight(block) : block)));
