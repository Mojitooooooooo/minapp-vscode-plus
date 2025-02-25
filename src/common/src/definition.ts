/******************************************************************
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Mora <qiuzhongleiabc@126.com> (https://github.com/qiu8310)
*******************************************************************/

import { TextDocument } from "vscode";
import { Component, CustomOptions, getCustomComponents, getGlobalComponents } from "./custom";
import { LanguageConfig } from "./dev";

export async function definitionTagName(tagName: string, lc: LanguageConfig, doc: TextDocument, co?: CustomOptions): Promise<Component | undefined> {
  if (['wxs', 'include'].indexOf(tagName) !== -1 || lc.components.some(item => item.name === tagName)) {
    return undefined;
  }

  const components: Component[] = [...await getCustomComponents(tagName, co), ...await getGlobalComponents(doc, tagName, co)];
  for (const component of components) {
    if (component.name === tagName) {
      return component;
    }
  }

  return undefined;
}