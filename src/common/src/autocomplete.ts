/******************************************************************
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Mora <qiuzhongleiabc@126.com> (https://github.com/qiu8310)
*******************************************************************/

import { TextDocument } from 'vscode'
import { CustomOptions, getCustomComponents, getGlobalComponents } from './custom'
import {
  components,
  Component,
  ComponentAttr,
  ComponentAttrValue,
  CustomAttr,
  getComponentMarkdown,
  getComponentAttrMarkdown,
  getComponentAttrValueMarkdown,
  LanguageConfig,
} from './dev'
import { readFile } from './lib'

export interface TagItem {
  component: Component
  markdown: string
}

export interface TagAttrItem {
  attr: CustomAttr
  markdown: string
}

// 优先级
// customs > natives > basics

/**
 * 自动补全支持的所有的 tag
 * @param {CustomOptions} co 用于解析自定义组件的配置
 */
export async function autocompleteTagName(lc: LanguageConfig, doc: TextDocument, name: string, co?: CustomOptions) {
  const natives: TagItem[] = [...lc.components, ...components].map(mapComponent)
  const globals: TagItem[] = (await getGlobalComponents(doc, name, co)).map(mapComponent)
  const customs: TagItem[] = (await getCustomComponents(name, co)).map(mapComponent)

  return {
    customs,
    globals,
    natives,
  }
}

/**
 * 自动补全 tag 上的属性
 *
 * @export
 * @param {string} tagName 当前 tag 的名称
 * @param {{[key: string]: string}} attrs 当前已经写了的属性的集合
 * @param {CustomOptions} co 用于解析自定义组件的配置
 */
export async function autocompleteTagAttr(
  tagName: string,
  tagAttrs: { [key: string]: string | boolean },
  lc: LanguageConfig,
  doc: TextDocument,
  co?: CustomOptions
) {
  const attrs = await getAvailableAttrs(tagName, tagAttrs, lc, doc, co)

  // 属性不能是已经存在的，也不能是事件
  const filter = createComponentFilter(tagAttrs, false)

  const noBasics = lc.noBasicAttrsComponents && lc.noBasicAttrsComponents.includes(tagName)
  return {
    basics: noBasics ? [] : (lc.baseAttrs.filter(filter).map(mapComponentAttr) as TagAttrItem[]),
    natives: attrs.filter(filter).map(mapComponentAttr) as TagAttrItem[],
  }
}

/**
 * 自动补全指定的属性的值
 */
export async function autocompleteTagAttrValue(
  tagName: string,
  tagAttrName: string,
  lc: LanguageConfig,
  doc: TextDocument,
  co?: CustomOptions
) {
  const comp = await getComponent(tagName, lc, doc, co)
  if (!comp || !comp.attrs) return []
  const attr = comp.attrs.find(a => a.name === tagAttrName)
  if (!attr) return []
  const values: ComponentAttrValue[] = attr.enum
    ? attr.enum
    : attr.subAttrs
    ? attr.subAttrs.map(s => ({ value: s.equal }))
    : []

  return values.map(v => {
    return {
      value: v.value,
      markdown: getComponentAttrValueMarkdown(v),
    }
  })
}

// triggerEvent 的参数说明
const TRIGGER_EVENT_REX = /this\.triggerEvent\(\s*['"]([^'"]+)['"]/gm

export async function autocompleteSpecialTagAttr(
  prefix: string,
  tagName: string,
  tagAttrs: { [key: string]: string | boolean },
  lc: LanguageConfig,
  doc: TextDocument,
  co?: CustomOptions
) {
  let customs: TagAttrItem[] = []
  let natives: TagAttrItem[] = []

  if (lc.custom.hasOwnProperty(prefix)) {
    natives = lc.custom[prefix].attrs.filter(attr => tagAttrs[prefix + attr.name] == null).map(mapComponentAttr)
  } else if (lc.event.prefixes.includes(prefix)) {
    customs = []
    // 1.首先找到对应组件的 js 或者 ts 文件，然后正则匹配？
    const comp = await getComponent(tagName, lc, doc, co)
    if(comp?.path) {
      // 表示是自定义组件
      const fileContent = (await readFile(comp.path)).toString();
      // 使用 match 方法提取所有匹配项
      const matches = [...fileContent.matchAll(TRIGGER_EVENT_REX)];
      // 提取并打印第一个参数（去除引号）
      const eventNames = [...new Set(matches.map(match => match[1]))];
      customs = eventNames.map(i => ({ name: i })).map(mapComponentAttr)
    }
    natives = lc.event.attrs.filter(attr => tagAttrs[prefix + attr.name] == null).map(mapComponentAttr)
  }
  return { customs, natives }
}

function mapComponent(component: Component) {
  return { component, markdown: getComponentMarkdown(component) }
}

function mapComponentAttr(attr: ComponentAttr) {
  return { attr, markdown: getComponentAttrMarkdown(attr) } as TagAttrItem
}

function createComponentFilter(existsTagAttrs: { [key: string]: string | boolean }, event?: boolean) {
  return (attr: ComponentAttr) => {
    // let isEvent = attr.name.startsWith('bind') || attr.name.startsWith('catch')
    const isEvent = false
    return existsTagAttrs[attr.name] == null && (event == null || (event ? isEvent : !isEvent))
  }
}

async function getComponent(tagName: string, lc: LanguageConfig, doc: TextDocument, co?: CustomOptions) {
  let comp = [...lc.components, ...components].find(c => c.name === tagName)
  if (!comp) {
    comp = ([...await getCustomComponents(tagName, co), ...await getGlobalComponents(doc, tagName, co)]).find(c => c.name === tagName)
  }
  return comp
}

async function getAvailableAttrs(
  tagName: string,
  tagAttrs: { [key: string]: string | boolean },
  lc: LanguageConfig,
  doc: TextDocument,
  co?: CustomOptions
) {
  const comp = await getComponent(tagName, lc, doc, co)
  return comp ? getAvailableAttrsFromComponent(comp, tagAttrs) : []
}

function getAvailableAttrsFromComponent(
  comp: Component,
  tagAttrs: { [key: string]: string | boolean }
): ComponentAttr[] {
  const attrs = comp.attrs || []
  const results = attrs.filter(a => tagAttrs[a.name] == null) // 先取出没有写的属性
    // 如果没写的属性中有 subAttrs，则要把它们全取出来
  ;[...results].forEach(a => {
    if (a.subAttrs) {
      a.subAttrs.forEach(s => {
        s.attrs.forEach(suba => {
          if (results.every(_ => _.name !== suba.name)) results.push(suba) // 去重
        })
      })
    }
  })

  // 写了的属性需要找出 subAttrs
  attrs
    .filter(a => tagAttrs[a.name] != null && a.subAttrs && a.subAttrs.length)
    .forEach(a => {
      const sub = (a.subAttrs || []).find(s => s.equal === tagAttrs[a.name])
      if (sub) results.push(...sub.attrs.filter(sa => tagAttrs[sa.name] == null))
    })

  return results
}
