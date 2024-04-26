import { Token } from './tokenizer'
import { Node } from '../ast/ast'
import { NewCodeBlockParser } from './code_block'
import { NewTableParser } from './table'

interface BaseParser {
  Match(tokens: Token[]): [Node, number];
}

interface InlineParser extends BaseParser {}
interface BlockParser extends BaseParser {}

function Parse(tokens: Token[]): [Node[], Error] {
  return ParseBlock(tokens);
}

const defaultBlockParsers: BlockParser[] = [
  NewCodeBlockParser(),
  NewTableParser(),
  NewHorizontalRuleParser(),
  NewHeadingParser(),
  NewBlockquoteParser(),
  NewTaskListParser(),
  NewUnorderedListParser(),
  NewOrderedListParser(),
  NewMathBlockParser(),
  NewEmbeddedContentParser(),
  NewParagraphParser(),
  NewLineBreakParser(),
];
