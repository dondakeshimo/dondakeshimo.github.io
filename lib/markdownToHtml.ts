import {unified} from 'unified'
import remarkParse from 'remark-parse'
import math from 'remark-math'
import toc from 'remark-toc'
import emoji from 'remark-emoji'
//@ts-ignore
import oembed from 'remark-oembed'
import remark2rehype from 'remark-rehype'
import slug from 'rehype-slug'
import katex from 'rehype-katex'
import rehypePrismPlus from 'rehype-prism-plus'
import stringify from 'rehype-stringify'

export default async function markdownToHtml(markdown: string) {
  const result = await unified()
  .use(remarkParse)
  .use(math)
  .use(emoji)
  .use(oembed)
  .use(toc, {heading: '目次', tight: true})
  .use(remark2rehype)
  .use(slug)
  .use(katex, {output: 'mathml'})
  .use(rehypePrismPlus)
  .use(stringify)
  .process(markdown)
  return result.toString()
}
