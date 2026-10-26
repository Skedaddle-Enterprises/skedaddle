// Augments @types/mdx's ambient `*.mdx` module declaration so our
// content/legal/*.mdx files can export named frontmatter-style constants
// (title, lastUpdated, description) alongside the default MDX component.
declare module '*.mdx' {
  import type { MDXProps } from 'mdx/types';

  export const title: string;
  export const lastUpdated: string;
  export const description: string;

  export default function MDXContent(props: MDXProps): React.JSX.Element;
}
