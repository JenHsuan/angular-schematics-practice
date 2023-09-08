import { Rule, SchematicContext, Tree, apply, mergeWith, url, template, MergeStrategy, Source, forEach, move, SchematicsException,  } from '@angular-devkit/schematics';
import { Schema } from './schema';
import { normalize, strings } from '@angular-devkit/core';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function reactFunctionalComponent(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const sourceTemplate = url('./files/fuctional-component');
    const sourceParameterizedTemplates = applyWithOverwrite(sourceTemplate, [
      template({
        ..._options,
        ...strings,
      }),
    ]);
    return sourceParameterizedTemplates; // merge the template into tree
  };
}

export function reactClassComponent(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const sourceTemplate = url('./files/class-component');
    const sourceParameterizedTemplates = applyWithOverwrite(sourceTemplate, [
      template({
        ..._options,
        ...strings,
      }),
    ]);
    return sourceParameterizedTemplates; // merge the template into tree
  };
}

export function applyWithOverwrite(source: Source, rules: Rule[]): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const rule = mergeWith(
      apply(source, [
        ...rules,
        forEach((fileEntry) => {
          if (tree.exists(fileEntry.path)) {
            tree.overwrite(fileEntry.path, fileEntry.content);
            return null;
          }
          return fileEntry;
        })
      ]),
    );

    return rule(tree, _context);
  };
}

