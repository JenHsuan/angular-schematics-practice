import { Rule, SchematicContext, Tree, apply, mergeWith, url, template, MergeStrategy, Source, forEach, move, SchematicsException,  } from '@angular-devkit/schematics';
import { Schema } from './schema';
import { normalize, strings } from '@angular-devkit/core';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function myComponent(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    // const workspaceConfigBuffer = tree.read('angular.json');
    // if (!workspaceConfigBuffer) {
    //   throw new SchematicsException('Not Angular CLI workspace');
    // }

    // const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());  
    // const projectName = _options.project || workspaceConfig.defaultProject;
    // const project = workspaceConfig.projects[projectName];

    // const projectType = project.projectType === 'application' ? 'app' : 'lib';
            
    // _options.path = `${project.sourceRoot}/${projectType}`;
    
    const sourceTemplate = url('./files');
    const sourceParameterizedTemplates = applyWithOverwrite(sourceTemplate, [
      template({
        ..._options,
        ...strings,
      }),
      //move(normalize(_options.path as string))
    ]);

    /*
    applyWithOverwrite(url('./files/stylelint'), [
        template({
          dot: '.',
        }),
      ]),
    */

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

