/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
import fs = require("fs");
import path = require("path");
import code = require("./codes");
const NEW_LINE: string = "\n";

export module sapUI5 {
    const INDENT: string = "....";
    const DOT: string = ".";
    export module strings {
        /**
         * 比较字符串
         * @param value1 字符1
         * @param value2 字符2
         */
        export function equals(value1: string, value2: string): boolean {
            return value1 === value2;
        }
        /**
         * 比较字符串，忽略大小写
         * @param value1 字符1
         * @param value2 字符2
         */
        export function equalsIgnoreCase(value1: string, value2: string): boolean {
            if (value1 === undefined || value1 === null) { return false; }
            if (value2 === undefined || value2 === null) { return false; }
            let tmp1: string = value1.toLowerCase();
            let tmp2: string = value2.toLowerCase();
            return equals(tmp1, tmp2);
        }
    }
    export module format {
        export function copyrights(): string {
            let builder: code.Builder = new code.Builder();
            builder.wirteLine("/**");
            builder.wirteLine(" * @license");
            builder.wirteLine(" * Copyright Color-Coding Studio. All Rights Reserved.");
            builder.wirteLine(" *");
            builder.wirteLine(" * Use of this source code is governed by an Apache License, Version 2.0");
            builder.wirteLine(" * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0");
            builder.wirteLine(" */");
            return builder.toString();
        }
        export function names(content: string): string {
            if (content) {
                let index: number = content.lastIndexOf(DOT);
                if (index > 0) {
                    content = content.substring(index + 1);
                }
            }
            return content;
        }
        export function ends(): string {
            return `}` + NEW_LINE;
        }
        export function comments(content: string): string {
            let builder: code.Builder = new code.Builder();
            builder.wirteLine("/**");
            if (content) {
                builder.wirte(" * ");
                builder.wirte(content);
                builder.wirteLine("");
            }
            builder.wirteLine(" */");
            return builder.toString();
        }
        export function namespaces(content: string, head: string = undefined): string {
            let builder: code.Builder = new code.Builder();
            if (head) {
                builder.wirte(head);
                builder.wirte(" ");
            }
            builder.wirte("namespace");
            builder.wirte(" ");
            builder.wirte(content);
            builder.wirte(" ");
            builder.wirteLine("{");
            return builder.toString();
        }
        export function enums(content: string): string {
            let builder: code.Builder = new code.Builder();
            builder.wirte("export");
            builder.wirte(" ");
            builder.wirte("enum");
            builder.wirte(" ");
            builder.wirte(content);
            builder.wirte(" ");
            builder.wirteLine("{");
            return builder.toString();
        }
        export function enumValues(content: string): string {
            let builder: code.Builder = new code.Builder();
            builder.wirte(content);
            builder.wirte(" ");
            builder.wirte("=");
            builder.wirte(" ");
            builder.wirte("\"");
            builder.wirte(content);
            builder.wirte("\"");
            builder.wirteLine(",");
            return builder.toString();
        }
        export function classes(content: string, extend: string, implement: string[], abstract: boolean): string {
            let builder: code.Builder = new code.Builder();
            builder.wirte("export");
            builder.wirte(" ");
            if (abstract === true) {
                builder.wirte("abstract");
                builder.wirte(" ");
            }
            builder.wirte("class");
            builder.wirte(" ");
            builder.wirte(content);
            builder.wirte(" ");
            if (extend) {
                builder.wirte("extends");
                builder.wirte(" ");
                builder.wirte(extend);
                builder.wirte(" ");
            }
            if (implement instanceof Array && implement.length > 0) {
                builder.wirte("implements");
                builder.wirte(" ");
                for (let index: number = 0; index < implement.length; index++) {
                    let item: string = implement[index];
                    if (index > 0) {
                        builder.wirte(", ");
                    }
                    builder.wirte(item);
                }
                builder.wirte(" ");
            }
            builder.wirteLine("{");
            return builder.toString();
        }
        export function interfaces(content: string, implement: string[]): string {
            let builder: code.Builder = new code.Builder();
            builder.wirte("export");
            builder.wirte(" ");
            builder.wirte("interface");
            builder.wirte(" ");
            builder.wirte(content);
            builder.wirte(" ");
            if (implement instanceof Array && implement.length > 0) {
                builder.wirte("extends");
                builder.wirte(" ");
                for (let index: number = 0; index < implement.length; index++) {
                    let item: string = implement[index];
                    if (index > 0) {
                        builder.wirte(", ");
                    }
                    builder.wirte(item);
                }
            }
            builder.wirteLine("{");
            return builder.toString();
        }
        export function types(content: string): string {
            if (strings.equalsIgnoreCase(content, "function")) {
                return "Function";
            } else if (strings.equalsIgnoreCase(content, "int")) {
                return "number";
            } else if (strings.equalsIgnoreCase(content, "int[]")) {
                return "number[]";
            } else if (strings.equalsIgnoreCase(content, "float")) {
                return "number";
            } else if (strings.equalsIgnoreCase(content, "float[]")) {
                return "number[]";
            } else if (strings.equalsIgnoreCase(content, "DomNode")
                || strings.equalsIgnoreCase(content, "DomRef")
                || strings.equalsIgnoreCase(content, "Element")) {
                return "HTMLElement";
            } else if (strings.equalsIgnoreCase(content, "DomNode[]")
                || strings.equalsIgnoreCase(content, "DomRef[]")
                || strings.equalsIgnoreCase(content, "Element[]")) {
                return "HTMLElement[]";
            } else if (strings.equalsIgnoreCase(content, "Map")) {
                return "{ [key: string]: any }";
            } else if (strings.equalsIgnoreCase(content, "object")) {
                return "any";
            } else if (strings.equalsIgnoreCase(content, "*")) {
                return "any";
            } else if (strings.equalsIgnoreCase(content, "Array")) {
                return "any[]";
            } else if (strings.equalsIgnoreCase(content, "Promise")) {
                return "Promise<any>";
            } else if (strings.equalsIgnoreCase(content, "string|Promise")) {
                return "string | Promise<any>";
            } else if (strings.equalsIgnoreCase(content, "oPromise")) {
                return "any";
            } else if (typeof (content) === "string" && content.indexOf("jQuery") >= 0) {
                return "any";
            } else if (strings.equalsIgnoreCase(content, "iScroll")) {
                return "any";
            } else if (typeof (content) === "string"
                && (content.indexOf(":") > 0
                    || content.indexOf(">") > 0
                    || content.indexOf("<") > 0)) {
                return "any";
            } else if (typeof (content) === "string"
                && content.toLowerCase().endsWith("callback")) {
                return "Function";
            }
            return content;
        }
        export function visibilities(content: string): string {
            if (!content) {
                return "";
            } else if (content === "publice") {
                return "";
            } else if (content === "restricted") {
                return "private";
            }
            return content;
        }
        export function references(content: string): string {
            let builder: code.Builder = new code.Builder();
            builder.wirte("///");
            builder.wirte(" ");
            builder.wirte("<");
            builder.wirte("reference");
            builder.wirte(" ");
            builder.wirte("path");
            builder.wirte(" ");
            builder.wirte("=");
            builder.wirte("\"");
            builder.wirte(content);
            builder.wirte("\"");
            builder.wirte(" ");
            builder.wirte("/>");
            builder.wirteLine("");
            return builder.toString();
        }
    }

    const PROPERTY_SYMBOLS: symbol = Symbol("symbols");
    const PROPERTY_CLASS_SYMBOLS: symbol = Symbol("classSymbols");
    export class Exporter {
        protected outFile: fs.WriteStream;
        protected mapSymbols(): Map<string, sap.ui5.Symbol> {
            if (!(this[PROPERTY_SYMBOLS] instanceof Map)) {
                this[PROPERTY_SYMBOLS] = new Map<string, sap.ui5.Symbol>();
            }
            return this[PROPERTY_SYMBOLS];
        }
        protected outPutLibrary(symbols: sap.ui5.Symbol[]): void {
            let nsSymbols: Array<sap.ui5.Symbol> = new Array<sap.ui5.Symbol>();
            for (let item of symbols) {
                this.mapSymbols().set(item.name, item);
                if (item.kind === "class") {
                    // 记录类类型
                    this.classSymbols().set(item.name, item);
                }
                if (item.kind !== "namespace") {
                    continue;
                }
                if (typeof item.name === "string" && item.name.indexOf(":") > 0) {
                    continue;
                }
                if (typeof item.name === "string" && item.name.startsWith("sap.ui.test")) {
                    continue;
                }
                if (typeof item.name === "string" && item.name.startsWith("sap.ui.model.odata.")) {
                    continue;
                }
                if (typeof item.name === "string" && item.name.startsWith("jQuery")) {
                    continue;
                }
                nsSymbols.push(item);
                // 命名空间输出，则不再处理
                this.mapSymbols().delete(item.name);
            }
            for (let item of nsSymbols) {
                let namespaces: string[] = item.name.split(".");
                let head: string = undefined;
                if (namespaces.length > 1) {
                    for (let index: number = 0; index < namespaces.length - 1; index++) {
                        this.outFile.write(format.namespaces(namespaces[index], index === 0 ? "declare" : undefined));
                    }
                } else {
                    head = "declare";
                }
                if (item["ui5-metadata"] && item["ui5-metadata"].stereotype) {
                    // 类型
                    this.outPutType(item);
                } else if (item.events && !item.nodes) {
                    // 存在事件，则为类
                    this.outPutClass(item);
                } else if (item.properties && item.description.indexOf("Enumeration") >= 0) {
                    // 描述枚举类型
                    this.outPutEnum(item);
                } else {
                    this.outPutNamespace(item, head);
                }
                if (namespaces.length > 1) {
                    for (let index: number = 0; index < namespaces.length - 1; index++) {
                        this.outFile.write(format.ends());
                    }
                }
            }
        }
        protected outPutType(tpSymbol: sap.ui5.Symbol): void {
            console.log("out %s: %s", "type", tpSymbol.name);
            this.outFile.write(format.comments(tpSymbol.description));
            let builder: code.Builder = new code.Builder();
            builder.wirte("export");
            builder.wirte(" ");
            builder.wirte("type");
            builder.wirte(" ");
            builder.wirte(tpSymbol.basename);
            builder.wirte(" ");
            builder.wirte("=");
            builder.wirte(" ");
            builder.wirte(format.types(tpSymbol["ui5-metadata"].basetype));
            builder.wirte(";");
            builder.wirteLine("");
            this.outFile.write(builder.toString());
        }
        protected outPutNamespace(nsSymbol: sap.ui5.Symbol, head: string = undefined): void {
            console.log("out %s: %s", nsSymbol.kind, nsSymbol.name);
            this.outFile.write(format.comments(nsSymbol.description));
            if (head) {
                this.outFile.write(head);
                this.outFile.write(" ");
            }
            this.outFile.write(format.namespaces(format.names(nsSymbol.name)));
            if (nsSymbol.properties) {
                if (nsSymbol.description.indexOf("Enumeration") >= 0) {
                    // 描述枚举类型
                    this.outPutEnum(nsSymbol);
                } else {
                    for (let item of nsSymbol.properties) {
                        // 命名空间的内部及私有属性不输出
                        if (item.visibility === "protected"
                            || item.visibility === "restricted") {
                            continue;
                        }
                        this.outPutProperty(item, "var");
                    }
                }
            }
            if (nsSymbol.methods) {
                for (let method of nsSymbol.methods) {
                    // 命名空间的内部及私有方法不输出
                    if (method.visibility === "protected"
                        || method.visibility === "restricted") {
                        continue;
                    }
                    if (method.returnValue) {
                        // 命名空间方法返回值类型是自身时，修正为object
                        if (method.returnValue.type === nsSymbol.name) {
                            method.returnValue.type = "object";
                        }
                        if (method.returnValue.types) {
                            for (let item of method.returnValue.types) {
                                if (item.value === nsSymbol.name) {
                                    item.value = "object";
                                }
                            }
                        }
                    }
                    this.outPutFunction(method, "function");
                }
            }
            if (nsSymbol.nodes) {
                for (let node of nsSymbol.nodes) {
                    let symbol: sap.ui5.Symbol = this.mapSymbols().get(node.name);
                    if (!symbol) {
                        continue;
                    }
                    this.outPutSymbol(symbol);
                }
            }
            this.outFile.write(format.ends());
        }
        protected outPutSymbol(symbol: sap.ui5.Symbol): void {
            if (symbol.kind === "namespace") {
                this.outPutNamespace(symbol);
            } else if (symbol.kind === "enum") {
                this.outPutEnum(symbol);
            } else if (symbol.kind === "class") {
                this.outPutClass(symbol);
                if (symbol.nodes) {
                    this.outFile.write(format.namespaces(format.names(symbol.name)));
                    for (let node of symbol.nodes) {
                        let symbol: sap.ui5.Symbol = this.mapSymbols().get(node.name);
                        if (!symbol) {
                            continue;
                        }
                        this.outPutSymbol(symbol);
                    }
                    this.outFile.write(format.ends());
                }
            } else if (symbol.kind === "interface") {
                this.outPutInterface(symbol);
            } else if (symbol.kind === "typedef") {
                if (symbol.properties) {
                    this.outPutInterface(symbol);
                }
            } else {
                throw new Error("unkown symbol type " + symbol.kind + " @" + symbol.name);
            }
            // 清除输出过的
            this.mapSymbols().delete(symbol.name);
        }
        protected outPutClass(csSymbol: sap.ui5.Symbol): void {
            console.log("out %s: %s", csSymbol.kind, csSymbol.name);
            this.outFile.write(format.comments(csSymbol.description));
            // 去除不存在的接口
            let impDatas: string[] = [];
            if (csSymbol.implements instanceof Array) {
                for (let item of csSymbol.implements) {
                    if (!this.mapSymbols().has(item)) {
                        continue;
                    }
                    impDatas.push(item);
                }
            }
            this.outFile.write(format.classes(format.names(csSymbol.name), csSymbol.extends, impDatas, csSymbol.abstract));
            // 静态方法
            if (csSymbol.methods) {
                for (let item of csSymbol.methods) {
                    if (item.static !== true) {
                        continue;
                    }
                    if (item.visibility !== "public") {
                        // 私有方法不处理
                        continue;
                    }
                    if (csSymbol.name !== "sap.ui.base.EventProvider" && (
                        item.name.endsWith("extend") ||
                        item.name.endsWith("getMetadata"))) {
                        continue;
                    }
                    this.outPutFunction(item);
                }
            }
            // 构造方法
            for (let item in csSymbol) {
                if (item === "constructor") {
                    this.outPutConstructor(csSymbol[item]);
                    break;
                }
            }
            // 属性
            if (csSymbol.properties) {
                for (let item of csSymbol.properties) {
                    if (item.visibility === "restricted") {
                        // 私有方法不处理
                        continue;
                    }
                    this.outPutProperty(item);
                }
            }
            // 其他方法
            if (csSymbol.methods) {
                for (let item of csSymbol.methods) {
                    if (item.static === true) {
                        continue;
                    }
                    if (item.visibility === "restricted") {
                        // 私有方法不处理
                        continue;
                    }
                    if (((item.name === "addStyleClass" || item.name === "removeStyleClass") && !item.parameters)
                        || (item.name === "getDomRef" && (!item.returnValue || format.types(item.returnValue.type) !== "HTMLElement"))
                        || item.name === "getMetadata"
                        || (item.name.startsWith("set") && !item.parameters)
                        || (item.name.startsWith("get") && !item.returnValue)) {
                        // 跳过方法
                        continue;
                    }
                    // 输出基类方法
                    if (this.outPutOverloads(csSymbol, item) === true) {
                        // 输出方法
                        this.outPutFunction(item);
                    }
                }
            }
            this.outFile.write(format.ends());
        }
        private classSymbols(): Map<string, sap.ui5.Symbol> {
            if (!(this[PROPERTY_CLASS_SYMBOLS] instanceof Map)) {
                this[PROPERTY_CLASS_SYMBOLS] = new Map<string, sap.ui5.Symbol>();
            }
            return this[PROPERTY_CLASS_SYMBOLS];
        }
        protected outPutOverloads(csSymbol: sap.ui5.Symbol, method: sap.ui5.Method): boolean {
            if (!(csSymbol.extends)) {
                return true;
            }
            if (!(method.name)) {
                return true;
            }
            let faSymbol: sap.ui5.Symbol = this.classSymbols().get(csSymbol.extends);
            if (!(faSymbol)) {
                return true;
            }
            // 输出基类方法
            if (this.outPutOverloads(faSymbol, method) !== true) {
                return false;
            }
            if (faSymbol.methods instanceof Array) {
                for (let item of faSymbol.methods) {
                    // 基类中存在同名方法
                    if (item.name !== method.name) {
                        continue;
                    }
                    // 跳过私有
                    if (item.visibility === "restricted") {
                        continue;
                    }
                    // 可见不一致
                    if (item.visibility !== method.visibility) {
                        return false;
                    }
                    // 输出方法
                    this.outPutFunction(item);
                }
            }
            return true;
        }
        protected outPutInterface(inSymbol: sap.ui5.Symbol): void {
            console.log("out %s: %s", inSymbol.kind, inSymbol.name);
            this.outFile.write(format.comments(inSymbol.description));
            this.outFile.write(format.interfaces(format.names(inSymbol.name), inSymbol.implements));
            // 属性
            if (inSymbol.properties) {
                for (let item of inSymbol.properties) {
                    if (item.visibility === "restricted") {
                        // 私有方法不处理
                        continue;
                    }
                    this.outPutProperty(item);
                }
            }
            // 方法
            if (inSymbol.methods) {
                for (let item of inSymbol.methods) {
                    if (item.static === true) {
                        continue;
                    }
                    if (item.visibility === "restricted") {
                        // 私有方法不处理
                        continue;
                    }
                    this.outPutFunction(item);
                }
            }
            this.outFile.write(format.ends());
        }
        protected outPutEnum(emSymbol: sap.ui5.Symbol): void {
            console.log("out %s: %s", emSymbol.kind, emSymbol.name);
            this.outFile.write(format.comments(emSymbol.description));
            this.outFile.write(format.enums(format.names(emSymbol.name)));
            if (emSymbol.properties) {
                for (let item of emSymbol.properties) {
                    this.outFile.write(format.comments(item.description));
                    this.outFile.write(format.enumValues(format.names(item.name)));
                }
            }
            this.outFile.write(format.ends());
        }
        protected outPutProperty(property: sap.ui5.Property, head: string = undefined): void {
            this.outFile.write(format.comments(property.description));
            let builder: code.Builder = new code.Builder();
            if (head) {
                builder.wirte(head);
                builder.wirte(" ");
            } else {
                if (property.visibility && property.visibility !== "public") {
                    builder.wirte(format.visibilities(property.visibility));
                    builder.wirte(" ");
                }
            }
            builder.wirte(format.names(property.name));
            builder.wirte(":");
            builder.wirte(" ");
            if (property.type) {
                builder.wirte(format.types(property.type));
            } else {
                builder.wirte("any");
            }
            builder.wirte(";");
            builder.wirteLine("");
            this.outFile.write(builder.toString());
        }
        protected outPutFunction(method: sap.ui5.Method, head: string = undefined): void {
            if (method.deprecated) {
                // 跳过已弃用的
                return;
            }
            let builder: code.Builder = new code.Builder();
            // 输出注释
            builder.wirteLine("/**");
            if (method.description) {
                builder.wirte(" * ");
                builder.wirte(method.description);
                builder.wirteLine("");
            }
            if (method.parameters instanceof Array && method.parameters.length > 0) {
                for (let i: number = 0; i < method.parameters.length; i++) {
                    let parameter: sap.ui5.Parameter = method.parameters[i];
                    if (parameter.depth > 0) {
                        // 子参数，不处理
                        continue;
                    }
                    builder.wirte(" * ");
                    builder.wirte("@param");
                    builder.wirte(" ");
                    if (parameter.types instanceof Array && parameter.types.length > 0) {
                        builder.wirte("{");
                        for (let j: number = 0; j < parameter.types.length; j++) {
                            let type: sap.ui5.ParameterType = parameter.types[j];
                            if (j > 0) {
                                builder.wirte(" | ");
                            }
                            builder.wirte(format.types(type.value));
                        }
                        builder.wirte("}");
                        builder.wirte(" ");
                    }
                    builder.wirte(parameter.name);
                    builder.wirte(" ");
                    builder.wirte(parameter.description);
                    builder.wirteLine("");
                }
            }
            if (method.returnValue) {
                builder.wirte(" * ");
                builder.wirte("@returns");
                builder.wirte(" ");
                builder.wirte(format.types(method.returnValue.type));
                builder.wirte(" ");
                builder.wirte(method.returnValue.description);
                builder.wirteLine("");
            }
            builder.wirteLine(" */");
            this.outFile.write(builder.toString());
            // 输出方法
            builder = new code.Builder();
            if (head) {
                builder.wirte(head);
                builder.wirte(" ");
            } else {
                if (method.visibility && method.visibility !== "public") {
                    builder.wirte(format.visibilities(method.visibility));
                    builder.wirte(" ");
                }
                if (method.static === true) {
                    builder.wirte("static");
                    builder.wirte(" ");
                }
            }
            builder.wirte(format.names(method.name));
            builder.wirte("(");
            if (method.parameters instanceof Array && method.parameters.length > 0) {
                for (let i: number = 0; i < method.parameters.length; i++) {
                    let parameter: sap.ui5.Parameter = method.parameters[i];
                    if (parameter.depth > 0) {
                        // 子参数，不处理
                        continue;
                    }
                    if (i > 0) {
                        builder.wirte(",");
                        builder.wirte(" ");
                    }
                    if (parameter.name.indexOf("&") > 0 || parameter.name.indexOf(";") > 0) {
                        builder.wirte("arg" + String(i));
                    } else {
                        builder.wirte(parameter.name);
                    }
                    if (parameter.optional === true) {
                        // 后面也必须是可选的
                        let optional: boolean = true;
                        for (let ii: number = i + 1; ii < method.parameters.length; ii++) {
                            let tmp: sap.ui5.Parameter = method.parameters[ii];
                            if (tmp.optional !== optional) {
                                optional = false;
                                break;
                            }
                        }
                        if (optional === true) {
                            builder.wirte("?");
                        }
                    }
                    builder.wirte(":");
                    builder.wirte(" ");
                    if (parameter.types instanceof Array && parameter.types.length > 0) {
                        for (let j: number = 0; j < parameter.types.length; j++) {
                            let type: sap.ui5.ParameterType = parameter.types[j];
                            if (j > 0) {
                                builder.wirte(" | ");
                            }
                            builder.wirte(format.types(type.value));
                        }
                    }
                }
            }
            builder.wirte(")");
            builder.wirte(":");
            builder.wirte(" ");
            if (method.returnValue) {
                if (method.returnValue.types instanceof Array) {
                    for (let j: number = 0; j < method.returnValue.types.length; j++) {
                        let type: sap.ui5.ParameterType = method.returnValue.types[j];
                        if (j > 0) {
                            builder.wirte(" | ");
                        }
                        builder.wirte(format.types(type.value));
                    }
                } else {
                    builder.wirte(format.types(method.returnValue.type));
                }
            } else if (method.name.startsWith("get")) {
                // get方法，默认返回any
                builder.wirte("any");
            } else {
                builder.wirte("void");
            }
            builder.wirte(";");
            builder.wirteLine("");
            this.outFile.write(builder.toString());
        }
        protected outPutConstructor(method: sap.ui5.Constructor): void {
            let builder: code.Builder = new code.Builder();
            // 输出注释
            builder.wirteLine("/**");
            if (method.description) {
                builder.wirte(" * ");
                builder.wirte(method.description);
                builder.wirteLine("");
            }
            if (method.parameters instanceof Array && method.parameters.length > 0) {
                for (let i: number = 0; i < method.parameters.length; i++) {
                    let parameter: sap.ui5.ConstructorParameter = method.parameters[i];
                    if (parameter.depth > 0) {
                        // 子参数，不处理
                        continue;
                    }
                    builder.wirte(" * ");
                    builder.wirte("@param");
                    builder.wirte(" ");
                    if (parameter.types instanceof Array && parameter.types.length > 0) {
                        builder.wirte("{");
                        for (let j: number = 0; j < parameter.types.length; j++) {
                            let type: sap.ui5.ConstructorParameterType = parameter.types[j];
                            if (j > 0) {
                                builder.wirte(" | ");
                            }
                            builder.wirte(format.types(type.name));
                        }
                        builder.wirte("}");
                        builder.wirte(" ");
                    }
                    builder.wirte(parameter.name);
                    builder.wirte(" ");
                    builder.wirte(parameter.description);
                    builder.wirteLine("");
                }
            }
            builder.wirteLine(" */");
            this.outFile.write(builder.toString());
            // 输出方法
            builder = new code.Builder();
            builder.wirte("constructor");
            builder.wirte("(");
            if (method.parameters instanceof Array && method.parameters.length > 0) {
                for (let i: number = 0; i < method.parameters.length; i++) {
                    let parameter: sap.ui5.ConstructorParameter = method.parameters[i];
                    if (parameter.depth > 0) {
                        // 子参数，不处理
                        continue;
                    }
                    if (i > 0) {
                        builder.wirte(",");
                        builder.wirte(" ");
                    }
                    if (parameter.name.indexOf("&") > 0 || parameter.name.indexOf(";") > 0) {
                        builder.wirte("arg" + String(i));
                    } else {
                        builder.wirte(parameter.name);
                    }
                    if (parameter.optional === true) {
                        // 后面也必须是可选的
                        let optional: boolean = true;
                        for (let ii: number = i + 1; ii < method.parameters.length; ii++) {
                            let tmp: sap.ui5.ConstructorParameter = method.parameters[ii];
                            if (tmp.optional !== optional) {
                                optional = false;
                                break;
                            }
                        }
                        if (optional === true) {
                            builder.wirte("?");
                        }
                    }
                    builder.wirte(":");
                    builder.wirte(" ");
                    if (parameter.types instanceof Array && parameter.types.length > 0) {
                        for (let j: number = 0; j < parameter.types.length; j++) {
                            let type: sap.ui5.ConstructorParameterType = parameter.types[j];
                            if (j > 0) {
                                builder.wirte(" | ");
                            }
                            builder.wirte(format.types(type.name));
                        }
                    }
                }
            }
            builder.wirte(")");
            builder.wirte(";");
            builder.wirteLine("");
            this.outFile.write(builder.toString());
        }
        run(data: string | Buffer, outFolder: string, callBack: Function = undefined): string {
            let api: sap.ui5.Api = JSON.parse(data.toString());
            if (!api || !api.library) {
                throw new Error("invaild api data.");
            }
            let outFile: string = path.join(outFolder, api.library + ".d.ts");
            this.outFile = fs.createWriteStream(outFile, {
                encoding: "utf-8"
            });
            this.outFile.once("close", function (): void {
                if (callBack instanceof Function) {
                    callBack();
                }
            });
            this.outFile.write(format.copyrights());
            this.outPutLibrary(api.symbols);
            this.outFile.end();
            return outFile;
        }
    }
}