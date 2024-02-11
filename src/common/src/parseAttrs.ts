/******************************************************************
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Mora <qiuzhongleiabc@126.com> (https://github.com/qiu8310)
*******************************************************************/

// import { config } from '../../plugin/lib/config'
import { getComponentProps } from '../../plugin/lib/ScriptFile'
import { ComponentAttr } from './dev'

/*
  先尝试解析单行的情况，再解析多行情况

  单行如：
    properties: {foo: Number, bar: {type: String, others: {type: Number}}}

  多行如：
    properties = {
      foo: Number,
      bar: {
        type: String,
        others: {
          type: Number
        }
      }
    }
*/

const SINGLE_LINE_REGEXP = /^\s+(?:\w+.)?properties\s*[:=]\s*\{(.*)\}\s*$/m
const MULTIPLE_LINE_START_REGEXP = /^(\s+)(?:\w+.)?properties\s*[:=]\s*\{(.*?)$/
// 单行以及多行注释
const DOC_REGEXP = /\/\*\*([\s\S]*?)\*\/[\s\n\r]*(\w+)\s*:|\/\/([\s\S]*?)[\s\n\r]*(\w+)\s*:/g
const TYPE_REGEXP = /^function\s+(\w+)\(/

const VALUE_REGEXP = /(\w+:\s*{(?:[^}]+,\s*)*\s*value:\s*)[^,}]+/g;

export function parseAttrs(content: string): ComponentAttr[] {
  let attrs: ComponentAttr[] | undefined
  if (SINGLE_LINE_REGEXP.test(content)) {
    attrs = parseObjStr(RegExp.$1, content)
  }

   if (!attrs) {
    let flag = 0
    let spaces = ''
    let objstr = ''
    content.split(/\r?\n/).forEach(l => {
      if (flag === 2) return
      if (flag === 1) {
        if ([spaces + '},', spaces + '}'].includes(l.trimRight())) flag = 2
        else objstr += '\n' + l
      } else if (MULTIPLE_LINE_START_REGEXP.test(l)) {
        flag = 1
        spaces = RegExp.$1
        objstr += RegExp.$2
      }
    })
    if (flag === 2) attrs = parseObjStr(objstr, content)
  }

  return attrs || []
}

function checkPropertiesValid(objstr: string) {
  try {
    const fn = new Function(`return {${objstr}}`)
    fn()
  } catch {
    return false
  }
  return true
}

/**
 * 优先使用正则表达式解析（速度更快），但是部分语法不支持，会解析报错
 * 解析报错后使用 AST 进行解析，
 */
function parseObjStr(objstr: string, content: string) {
  try {
    if(!checkPropertiesValid(objstr)) {
      objstr = objstr.replace(VALUE_REGEXP, '$1undefined')
    }
    const fn = new Function(`return {${objstr}}`)
    const obj = fn()

    const attrs = Object.keys(obj).map(name => {
      let val = obj[name]
      let defaultValue: any
      if (val && typeof val !== 'function') {
        defaultValue = val.value
        val = val.type
      }
      let type = 'any'
      if (val && TYPE_REGEXP.test(val.toString())) {
        type = RegExp.$1.toLowerCase()
      }
      const attr: ComponentAttr = {
        name,
        type: {
          name: type,
        },
      }

      if (defaultValue !== undefined) attr.defaultValue = defaultValue
      return attr
    })

    objstr.replace(DOC_REGEXP, (r, doc, name) => {
      const index = attrs.findIndex(a => a.name === name)
      if (index >= 0) {
        attrs[index] = { ...attrs[index], ...parseDocStr(doc) }
      }
      return r
    })

    return attrs
  } catch (e) {
    // 如果解析失败则使用 AST 解析
    return getComponentProps(content)
    // console.log(`{${objstr}}`)
  }
  return
}

function parseDocStr(docstr: string) {
  const desc: string[] = []
  const obj: any = {}

  const lines = docstr.split(/\r?\n/).map(k => k.replace(/^\s*\*\s*/, '').trim())
  let beforeAt = true
  let lastLineIsEmpty = false

  lines.forEach(line => {
    if (/^@(\w+)(?:\s+(.*))?$/.test(line)) {
      beforeAt = false
      let key = RegExp.$1
      let val = RegExp.$2
      if (key === 'default') {
        key = 'defaultValue'
        try {
          if (val) val = JSON.parse(val)
        } catch (e) {}
      }
      obj[key] = val ? val : true
    } else if (beforeAt) {
      if (line) {
        if (lastLineIsEmpty || !desc.length) {
          desc.push(line)
        } else {
          desc[desc.length - 1] += line
        }
      }
      lastLineIsEmpty = line === ''
    }
  })

  if (obj.type) obj.type = { name: obj.type }
  if (desc.length) obj.desc = desc
  return obj
}
