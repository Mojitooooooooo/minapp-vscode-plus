/******************************************************************
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Mora <qiuzhongleiabc@126.com> (https://github.com/qiu8310)
*******************************************************************/

import { ConditionalCacheableFile, readdir, readFile, exists, statSync } from './lib/'
import { JSON_REGEXP, Component } from './dev/'
import { map } from './mora/async';
import { parseAttrs } from './parseAttrs'
import * as JSON5 from 'json5'
import * as path from 'path'
import * as vscode from 'vscode'
import { noderequire } from '../../utils/noderequire';
import { config } from '../../plugin/lib/config';
import { TextDocument } from 'vscode';

const JSON_CACHE: { [key: string]: ConditionalCacheableFile } = {}

export interface CustomOptions {
  filename: string
  resolves?: string[]
}

export { Component }

const getComponents = async (co: CustomOptions, currentTagName: string): Promise<Component[]> => {
  const f = getCachedJsonFile(co.filename)
  try {
    const data = await f.getContent()
    const jsonfile = f.filename as string
    if (data?.usingComponents) {
      const componentsKeys = Object.keys(data.usingComponents);
      // 执照当前标签名过滤掉
      const meetConditionComponents = componentsKeys.filter(key => key.startsWith(currentTagName.replace(/^</, '')));
      return await map(
        meetConditionComponents,
        async name => {
          const filepath = data.usingComponents[name]
          try {
            const comp = await parseComponentFile(filepath, jsonfile, co.resolves)
            comp.name = name
            return comp
          } catch (e) {
            return { name } as Component
          }
        },
        0
      )
    }
  } catch (e) {
  }
  return []
}

export async function getGlobalComponents(doc: TextDocument, currentTagName: string, co?: CustomOptions,): Promise<Component[]> {
  const { globalAppJsonPath } = config
  if(!globalAppJsonPath) {
    return []
  }
  const root = vscode.workspace.getWorkspaceFolder(doc.uri)

  return getComponents({ filename: path.join(root?.uri.fsPath || '', globalAppJsonPath), resolves: co?.resolves || [] }, currentTagName)
}

export async function getCustomComponents(currentTagName: string, co?: CustomOptions): Promise<Component[]> {
  if (!co) return []

  return getComponents(co, currentTagName)
}

async function parseComponentFile(
  filepath: string,
  refFile: string,
  resolves: string[] | undefined
): Promise<Component> {
  if (filepath.startsWith('~')) filepath = filepath.substr(1)
  resolves = resolves || []
  const localResolves = filepath.startsWith('.')
    ? [path.dirname(refFile)] // 只使用相对目录
    : filepath.startsWith('/')
    ? resolves // 只使用绝对目录
    : [path.dirname(refFile), ...resolves] // 使用相对和绝对目录

  let found: string | undefined
  const cache: { [key: string]: boolean } = {}

  for (const root of localResolves) {
    for (const ext of ['.ts', '.js', '']) {
      const f = path.join(root, filepath + ext)
      if (cache[f]) continue
      cache[f] = true

      try {
        console.time(`statSync ${f}`)
        const stats = statSync(f)
        console.timeEnd(`statSync ${f}`)
        if (stats.isFile()) {
          found = f
          break
        } else if (stats.isDirectory() && ext === '') {
          // 解析 index 文件 或 package.json 中的 main 文件
          if (f.includes('node_modules')) {
            try {
              const pkg = noderequire(path.join(f, 'package.json'))
              if (pkg.main) {
                found = path.resolve(f, pkg.main)
                break
              }
            } catch (e) {}
          }

          if (!found) {
            // 看看有没有 index.ts 或 index.js
            const f1 = path.join(f, 'index.js')
            const f2 = path.join(f, 'index.ts')
            if (await exists(f1)) {
              found = f1
              break
            } else if (await exists(f2)) {
              found = f2
              break
            }
          }
        }
      } catch (e) {}
    }
    if (found) break
  }

  if (found) {
    const f = getCachedJsonFile(found)
    const data = await f.getContent()
    if (data && data.minapp && data.minapp.component) {
      return data.minapp.component
    }
    // 实时解析
    const attrs = parseAttrs((await readFile(found)).toString())
    if (attrs.length) return { attrs, path: found } as any
    return { path: found } as any;
  }
  return {} as any
}

function getCachedJsonFile(filename: string) {
  const dir = path.dirname(filename)
  const base = path.basename(filename, path.extname(filename))
  const cacheKey = path.join(dir, base)
  if (!JSON_CACHE[cacheKey]) {
    JSON_CACHE[cacheKey] = new ConditionalCacheableFile(
      () => getJsonFilePath(dir, base),
      (name, buf) => JSON5.parse(buf.toString())
    )
  }
  return JSON_CACHE[cacheKey]
}

/**
 * 根据目录中的某个文件来获取当前目录中同名的 json 文件
 * 如果没找到，则找到该目录下的第一个 json 文件
 * @export
 * @param {string} filename 目录中的某个文件
 */
async function getJsonFilePath(dir: string, base: string) {
  base += '.'
  const names = await readdir(dir)
  let name = names.find(n => n.startsWith(base) && !n.substr(base.length).includes('.') && JSON_REGEXP.test(n))
  if(!name) {
    name = names.find(n => JSON_REGEXP.test(n))
  }
  return name ? path.join(dir, name) : undefined
}
