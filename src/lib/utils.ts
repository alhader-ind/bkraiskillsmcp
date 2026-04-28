/**
 * Strips the markdown frontmatter from a document string.
 * 
 * @param {string} markdown - The raw markdown text containing YAML frontmatter.
 * @returns {string} The markdown text without frontmatter.
 */
export const stripFrontmatter = (markdown: string): string => {
  return markdown.replace(/^---\n.*?\n---\n+/s, '');
};
