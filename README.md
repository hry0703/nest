# Getting Started With Schematics

This repository is a basic Schematic implementation that serves as a starting point to create and publish Schematics to NPM.

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with

```bash
schematics --help
```

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

That's it!


## 如何编译
```bash
npm run build
或者
tsc
```

## 如何运行
```bash
tsc

schematics .:generateFiles --name=role --path=角色 --dry-run=true 干运行 不写入文件
schematics .:generateFiles --name=role --path=角色 --no-dry-run 
```

package.json中schematics字段指示该包是一个schematics集合
它指定了schematics集合的入口文件
```js
 "schematics": "./src/collection.json",
```
```js
{
  "$schema": "../node_modules/@angular-devkit/schematics/collection-schema.json",
  "schematics": {
    "generateFiles": {
      "description": "A blank schematic.",
      "factory": "./cms-generator/index#generateFiles"
    }
  }
}
```
- $schema：这条字段指定了用于验证和解释此 JSON 文件的模式（schema）。它指向了 Angular DevKit Schematics 提供的 collection-schema.json 文件，确保文件结构符合 Schematics 集合的标准格式。
- schematics：这是整个配置文件的核心部分，定义了该集合中的所有 Schematics。在这个例子中，只定义了一个 Schematic，名为 generateFiles。
- generateFiles：这是 Schematic 的名称。在运行这个 Schematic 时，可以通过命令行使用这个名称来调用，例如：schematics .:generateFiles。
- description：对这个 Schematic 的简短描述。这里描述为 "A blank schematic."，意思是这是一个空白模板的 Schematic。
- factory：指定了工厂函数的位置，这个工厂函数生成 Schematic 的实际逻辑。
- "./cms-gen/index#generateFiles"：表示工厂函数位于 cms-gen/index.ts 文件中，并且工厂函数的名称是 generateFiles。当这个 Schematic 被执行时，这个函数将会被调用。

```js
// ./cms-generator/index.ts
export function generateFiles(_options: any): Rule {
  console.log('generateFiles', _options);
  return (tree: Tree, _context: SchematicContext) => {
    return tree;
  };
}
/**
 * Rule 是 Angular DevKit 提供的一种用于描述和执行操作的机制。
 * 它是一个函数，接受两个参数：tree 和 context。返回一个新的Tree对象 用于定义文件系统树的变更规则
 * context: SchematicContext 对象，提供有关当前运行中的原理图上下文信息和工厂，比如说日志记录和任务调度
 * tree: Tree 对象，是一个虚拟的文件系统 用于暂存和记录对市级文件系统的更新 直到提交时才真正应用到文件系统
 */
```


npm i --save-dev @types/pluralize
npm i pluralize