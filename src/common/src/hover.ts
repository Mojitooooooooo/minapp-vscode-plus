/******************************************************************
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Mora <qiuzhongleiabc@126.com> (https://github.com/qiu8310)
*******************************************************************/

import { TextDocument } from 'vscode'
import { CustomOptions, getCustomComponents, getGlobalComponents } from './custom'
import { components, getComponentMarkdown, getComponentAttrMarkdown, ComponentAttr, LanguageConfig } from './dev'

export async function hoverComponentMarkdown(tag: string, lc: LanguageConfig, doc: TextDocument, co?: CustomOptions) {
  const comp = await getComponent(tag, lc, doc, co)
  return comp ? getComponentMarkdown(comp) : undefined
}

export async function hoverComponentAttrMarkdown(tag: string, name: string, lc: LanguageConfig, doc: TextDocument, co?: CustomOptions) {
  const comp = await getComponent(tag, lc, doc, co)
  if (!comp) return
  const attrs = comp.attrs || []

  let attr: ComponentAttr | undefined
  attrs.find(a => {
    if (a.name === name) {
      attr = a
    } else if (a.subAttrs) {
      a.subAttrs.some(s =>
        s.attrs.some(sa => {
          if (sa.name === name) {
            attr = a
          }
          return !!attr
        })
      )
    }
    return !!attr
  })

  return attr ? getComponentAttrMarkdown(attr) : undefined
}

async function getComponent(tagName: string, lc: LanguageConfig, doc: TextDocument, co?: CustomOptions) {
  let comp = [...lc.components, ...components].find(c => c.name === tagName)
  if (!comp) {
    comp = ([...await getCustomComponents(tagName, co), ...await getGlobalComponents(doc, tagName, co)]).find(c => c.name === tagName)
  }
  return comp
}
