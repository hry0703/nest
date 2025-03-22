"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFiles = generateFiles;
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
const path = require("path");
const pluralize_1 = require("pluralize");
const ts = require("typescript");
function generateFiles(options) {
    //  schematics .:generateFiles --name=role --path=角色 --dry-run=true
    console.log('generateFiles', options); // generateFiles { name: 'role', path: '角色' }
    return (_tree, _context) => {
        const entityName = options.name;
        const title = options.path;
        const sourceTemplateRules = (0, schematics_1.apply)((0, schematics_1.url)('./files/src'), [
            (0, schematics_1.applyTemplates)(Object.assign(Object.assign({ entityName,
                title }, core_1.strings), { //向模版里传入方法
                plural: //向模版里传入方法
                pluralize_1.plural })),
            (0, schematics_1.move)(path.normalize('src'))
        ]);
        const viewTemplateRules = (0, schematics_1.apply)((0, schematics_1.url)('./files/views'), [
            (0, schematics_1.applyTemplates)(Object.assign(Object.assign({ entityName,
                title }, core_1.strings), { //向模版里传入方法
                plural: //向模版里传入方法
                pluralize_1.plural })),
            (0, schematics_1.move)(path.normalize('views'))
        ]);
        return (0, schematics_1.chain)([
            (0, schematics_1.mergeWith)(sourceTemplateRules),
            (0, schematics_1.mergeWith)(viewTemplateRules),
            updateAdminModule(entityName),
            updateSharedModule(entityName)
        ]);
    };
}
// 此方法用于更新src/admin/admin.module.ts文件
function updateSharedModule(entityName) {
    return (tree, _context) => {
        // 要修改的文件路径
        const adminModulePath = 'src/shared/shared.module.ts';
        // 读取并解析文件的内容为TS源文件
        const sourceFile = getSourceFile(tree, adminModulePath);
        // 如果成功找到了要修改的源文件
        if (sourceFile) {
            // 获取实体类的名称（用于代码）和名称的破折号形式（用于文件名）Role role
            const { classifiedName, dasherizeName } = getClassifiedAndDasherizeName(entityName);
            // 定义更新操作
            const updates = [
                addImportToModule(`${classifiedName}`, `./entities/${dasherizeName}.entity`),
                addImportToModule(`${classifiedName}Service`, `./services/${dasherizeName}.service`),
                addToModuleArray(`providers`, `${classifiedName}Service`),
                addToModuleArray(`exports`, `${classifiedName}Service`),
                addToMethodArray(`forFeature`, classifiedName)
            ];
            // 应用更新保存变更到AdminModule文件
            applyTransformationsAndSave(tree, adminModulePath, sourceFile, updates);
        }
        return tree;
    };
}
function addToMethodArray(mothodName, resourceName) {
    return (context) => (rootNode) => {
        // 定义一个访问者函数 用于遍历AST节点
        function visitor(node) {
            if (ts.isCallExpression(node)
                && ts.isPropertyAccessExpression(node.expression)
                && node.expression.name.text === mothodName
                && node.arguments.length === 1
                && ts.isArrayLiteralExpression(node.arguments[0])) {
                // 找到forFeature方法
                const elements = [...node.arguments[0].elements, ts.factory.createIdentifier(resourceName)];
                // 返回更新后的数组属性节点
                return ts.factory.updateCallExpression(node, node.expression, node.typeArguments, [ts.factory.createArrayLiteralExpression(elements)]);
            }
            return ts.visitEachChild(node, visitor, context);
        }
        return ts.visitNode(rootNode, visitor);
    };
}
// 此方法用于更新src/admin/admin.module.ts文件
function updateAdminModule(entityName) {
    return (tree, _context) => {
        // 要修改的文件路径
        const adminModulePath = 'src/admin/admin.module.ts';
        // 读取并解析文件的内容为TS源文件
        const sourceFile = getSourceFile(tree, adminModulePath);
        console.log('sourceFile', sourceFile);
        // 如果成功找到了要修改的源文件
        if (sourceFile) {
            // 获取实体类的名称（用于代码）和名称的破折号形式（用于文件名）Role role
            const { classifiedName, dasherizeName } = getClassifiedAndDasherizeName(entityName);
            // 定义更新操作
            const updates = [
                addImportToModule(`${classifiedName}Controller`, `./controllers/${dasherizeName}.controller`),
                addToModuleArray(`controllers`, `${classifiedName}Controller`)
            ];
            // 应用更新保存变更到AdminModule文件
            applyTransformationsAndSave(tree, adminModulePath, sourceFile, updates);
        }
        return tree;
    };
}
function addToModuleArray(arrayName, itemName) {
    return (context) => (rootNode) => {
        // 定义一个访问者函数 用于遍历AST节点
        function visitor(node) {
            if (ts.isPropertyAssignment(node) && ts.isIdentifier(node.name) && node.name.text === arrayName) {
                // 找到controllers数组
                if (ts.isArrayLiteralExpression(node.initializer)) {
                    const elements = [...node.initializer.elements.map(ele => ele.getText()), itemName];
                    // 返回更新后的数组属性节点
                    return ts.factory.updatePropertyAssignment(node, node.name, ts.factory.createArrayLiteralExpression(elements.map(ele => ts.factory.createIdentifier(ele))));
                }
            }
            return ts.visitEachChild(node, visitor, context);
        }
        return ts.visitNode(rootNode, visitor);
    };
}
// 应用变更并保存文件
function applyTransformationsAndSave(tree, filePath, sourceFile, transformations) {
    // 应用变更并获取更新后的源文件
    const updatedSourceFile = ts.transform(sourceFile, transformations).transformed[0];
    // 将更新后的文件内容写入指定的路径
    tree.overwrite(filePath, ts.createPrinter().printFile(updatedSourceFile));
}
// 在文件中添加import语句
function addImportToModule(imporName, importPath) {
    //     import { Module } from '@nestjs/common';
    //     import { DashboardController } from './controllers/dashboard.controller';
    //     import { UserController } from './controllers/user.controller';
    //    + import { RoleController } from './controllers/role.controller';
    //     @Module({
    //     controllers: [DashboardController, UserController, + RoleController],
    //     })
    //     export class AdminModule {}
    // 返回一个转换工厂的函数 用于添加导入语句
    // TransformerFactory 是一个高阶函数 接受一个ts.TransformationContext并返回另一个处理SourceFile的函数
    return (_context) => (rootNode) => {
        // 找到文件中的最后一个import语句
        const lastImport = (rootNode.statements.filter(ts.isImportDeclaration)).pop();
        // 创建新的import语句
        // modifiers 修饰符 importClause 导入的内容 moduleSpecifier 模块路径
        const newImport = ts.factory.createImportDeclaration(undefined, ts.factory.createImportClause(false, undefined, ts.factory.createNamedImports([ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier(imporName))])), ts.factory.createStringLiteral(importPath));
        const updatedStatements = ts.factory.createNodeArray([
            ...rootNode.statements.slice(0, rootNode.statements.indexOf(lastImport) + 1),
            newImport,
            ...rootNode.statements.slice(rootNode.statements.indexOf(lastImport) + 1),
        ]);
        return ts.factory.updateSourceFile(rootNode, updatedStatements);
    };
}
function getClassifiedAndDasherizeName(name) {
    return {
        classifiedName: core_1.strings.classify(name), // 获取类名形式
        dasherizeName: core_1.strings.dasherize(name), // 获取类名形式
    };
}
// 读取并解析文件的内容为TS源文件对象
function getSourceFile(tree, filePath) {
    var _a;
    // 读取指定路径的文件内容 并转换为字符串
    const content = (_a = tree.read(filePath)) === null || _a === void 0 ? void 0 : _a.toString('utf-8');
    return ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
}
/**
 * Rule 是 Angular DevKit 提供的一种用于描述和执行操作的机制。
 * 它是一个函数，接受两个参数：tree 和 context。返回一个新的Tree对象 用于定义文件系统树的变更规则
 * context: SchematicContext 对象，提供有关当前运行中的原理图上下文信息和工厂，比如说日志记录和任务调度
 * tree: Tree 对象，是一个虚拟的文件系统 用于暂存和记录对市级文件系统的更新 直到提交时才真正应用到文件系统
 */
/**
 * url 指定模版文件所在的目录 通常是本地的文件 ./files指的是当前目录下的files目录下的所有文件（模版文件以.template结尾）
 * applyTemplates 应用模版引擎 将模版文件与上下文数据结合生成目标文件
 * move 移动生成的文件到目标目录中
 * apply 应用一系列的规则到文件树中 返回一个转换后的文件树
 * mergeWith 将生成的文件树与目标文件树合并 返回一个合并后的文件树
 * chain 将多个规则组按顺序进行串联执行
 */
