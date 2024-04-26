// import { tokenize } from "./parse/tokenizer"

// export function parse(inputs: string[]): any {
//     const markdown: string = inputs[0];
//     const tokens = tokenize(markdown);
//     const astNodes = Parse(tokens);

//     if (astNodes instanceof Error) {
//         throw astNodes;
//     }

//     const nodes = convertFromASTNodes(astNodes);
//     const bytes = JSON.stringify(nodes);
//     const data: any[] = JSON.parse(bytes);

//     return data;
// }
