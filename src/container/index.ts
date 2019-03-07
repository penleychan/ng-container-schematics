import { Rule, SchematicContext, Tree, apply, url, filter, move, template, noop, mergeWith, MergeStrategy } from '@angular-devkit/schematics';
import { setupOptions } from './setup';
import { normalize, strings } from '@angular-devkit/core';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function container(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    setupOptions(tree, _options);

    const movePath = (_options.flat) ?
      normalize(_options.path) :
      normalize(_options.path + '/' + strings.dasherize(_options.name));

    const templateSource = apply(url('./files'), [
      _options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
      template({
          ...strings,
          ..._options,
      }),
      move(movePath),
    ]);

    const rule = mergeWith(templateSource, MergeStrategy.Default);

    return rule(tree, _context);
  };
}
