import { Rule, SchematicContext, Tree, apply, applyTemplates, chain, mergeWith, move, url } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import * as path from 'path';
import {plural} from 'pluralize';
export interface GenerateFilesSchema {
  name: string;
  path?: string;
}

export function generateFiles(options: GenerateFilesSchema): Rule {
  //  schematics .:generateFiles --name=role --path=角色 --dry-run=true
  console.log('generateFiles', options); // generateFiles { name: 'role', path: '角色' }
  return (_tree: Tree, _context: SchematicContext) => {
    const entityName = options.name;
    
    const sourceTemplateRules = apply(
      url('./files'),
      [
        applyTemplates({
          entityName,
          ...strings,//向模版里传入方法
          plural
        }),
        move(path.normalize('target'))
      ]
    );

    return chain([
      mergeWith(sourceTemplateRules)
    ]);
  };
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




