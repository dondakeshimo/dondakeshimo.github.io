import unified from 'unified'
import remarkParse from 'remark-parse'
import math from 'remark-math'
import slug from 'remark-slug'
import toc from 'remark-toc'
import emoji from 'remark-emoji'
//@ts-ignore
import oembed from 'remark-oembed'
import remark2rehype from 'remark-rehype'
import katex from 'rehype-katex'
import stringify from 'rehype-stringify'
//@ts-ignore
import rehypePrism from '@mapbox/rehype-prism'

export default async function markdownToHtml(markdown: string) {
  const result = await unified()
  .use(remarkParse)
  .use(slug)
  .use(math)
  .use(emoji)
  .use(oembed)
  .use(toc, {heading: '目次', tight: true})
  .use(remark2rehype)
  .use(katex)
  .use(rehypePrism)
  .use(stringify)
  .process(markdown)
  return result.toString()
}
