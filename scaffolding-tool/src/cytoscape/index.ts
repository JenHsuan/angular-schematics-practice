import { Rule, SchematicContext, Tree, apply, mergeWith, url, template, MergeStrategy, Source, forEach, move, SchematicsException, chain,  } from '@angular-devkit/schematics';
import { Schema } from './schema';
import { normalize, strings } from '@angular-devkit/core';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { parse } from 'comment-json';

/*
 * 1. Add json files to assets folder
 * 2. Update angular.json
 * 3. Update package.json
 * 4. Update tsconfig.json
 * 5. Add base folder
 * 6. npm install
 */
export function setupCytoscapeProject(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspaceConfigBuffer = tree.read('angular.json');
    if (!workspaceConfigBuffer) {
      throw new SchematicsException('Not Angular CLI workspace');
    }

    const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());  
    const projectName = _options.project || workspaceConfig.defaultProject;
    const project = workspaceConfig.projects[projectName];

    // const projectType = project.projectType === 'application' ? 'app' : 'lib';
            
    //_options.path = `${project.sourceRoot}/${projectType}`;
    //_options.path = `${project.sourceRoot}/assets`;
    
    // 1. Add json files to assets folder
    let sourceTemplate = url('./files/json');
    let sourceParameterizedTemplates = applyWithOverwrite(sourceTemplate, [
      template({
        ..._options,
        ...strings,
      }),
      move(normalize(`${project.sourceRoot}/assets`))
    ]);

    // 2. Update angular.json
    workspaceConfig.projects[projectName].architect.build.options['allowedCommonJsDependencies'] = [
      "cytoscape",
      "cytoscape-klay"
    ];
    tree.overwrite('./angular.json', JSON.stringify(workspaceConfig, null, 2));
        
    // 3. Update package.json
    const dependencies = [
      { name: 'cytoscape', version: '^3.26.0' },
      { name: 'cytoscape-klay', version: '^3.1.4' },
      { name: 'cytoscape-popper', version: '^2.0.0' }
    ];
    dependencies.forEach(dependency => {
      addDependencyToPackageJson(
        tree,
        dependency.name,
        dependency.version
      );
    });

    const devDependencies = [
      { name: "@types/cytoscape", version: "^3.19.11" },
      { name: "@types/cytoscape-popper", version: "^2.0.1" }
    ];
    devDependencies.forEach(dependency => {
      addDevDependencyToPackageJson(
        tree,
        dependency.name,
        dependency.version
      );
    });

    // 4. Update tsconfig.json
    const tsconfigConfigBuffer = tree.read('tsconfig.json');
    if (!tsconfigConfigBuffer) {
      throw new SchematicsException('Not Angular CLI workspace');
    }

    const tsconfigConfig = JSON.parse(tsconfigConfigBuffer!.toString().split('*/')[1]); 
    tsconfigConfig.compilerOptions["resolveJsonModule"] = true;
    tsconfigConfig.compilerOptions["esModuleInterop"] = true;
    tsconfigConfig.compilerOptions["noImplicitAny"] = false;
    tsconfigConfig.compilerOptions["strictPropertyInitialization"] = false;
    tree.overwrite('./tsconfig.json', JSON.stringify(tsconfigConfig, null, 2));

    // 5. Add base folder
    const projectType = project.projectType === 'application' ? 'app' : 'lib';
            
    //_options.path = `${project.sourceRoot}/${projectType}`;
    //_options.path = `${project.sourceRoot}/assets`;
    
    let sourceTemplate2 = url('./files/setup');
    let sourceParameterizedTemplates2 = applyWithOverwrite(sourceTemplate2, [
      template({
        ..._options,
        ...strings,
      }),
      move(normalize(`${project.sourceRoot}/app`))
    ]);

    // 6. npm install
    const packageConfigBuffer = tree.read('package.json');
    if (!packageConfigBuffer) {
      throw new SchematicsException('Not Angular CLI workspace');
    }

    const packageConfig = JSON.parse(packageConfigBuffer.toString());  
    //Object.keys(packageConfig.dependencies)
    _context.addTask(
      new NodePackageInstallTask({
        packageName: Object.keys(packageConfig.dependencies).join(' ') + ' ' + Object.keys(packageConfig.devDependencies).join(' ')
      })
    );

    // _context.addTask(
    //   new NodePackageInstallTask({
    //     packageName: devDependencies.map(d => d.name).join(' ')
    //   })
    // );
    
    return chain([sourceParameterizedTemplates, sourceParameterizedTemplates2]); // merge the template into tree
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

function addDependencyToPackageJson(host: Tree, pkg: string, version: string): Tree {
  if (host.exists('package.json')) {
    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);
    if (!json.dependencies) {
      json.dependencies = {};
    }
    if (!json.dependencies[pkg]) {
      json.dependencies[pkg] = version;
      json.dependencies = sortObjectByKeys(json.dependencies);
    }
    host.overwrite('package.json', JSON.stringify(json, null, 2));
  }
  return host;
}

function addDevDependencyToPackageJson(host: Tree, pkg: string, version: string): Tree {
  if (host.exists('package.json')) {
    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);
    if (!json.devDependencies) {
      json.devDependencies = {};
    }
    if (!json.dependencies[pkg]) {
      json.devDependencies[pkg] = version;
      json.devDependencies = sortObjectByKeys(json.devDependencies);
    }
    host.overwrite('package.json', JSON.stringify(json, null, 2));
  }
  return host;
}

function sortObjectByKeys(obj: any) {
  return Object.keys(obj).sort().reduce((result, key) => (result[key] = obj[key]) && result, {} as any);
}