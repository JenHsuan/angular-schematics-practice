import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { Schema } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function myComponent(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const { name } = _options; // 從 _options 讀取 name

    tree.create('hello.js', `console.log('Hello ${name}');`);
    return tree;
  };
}
