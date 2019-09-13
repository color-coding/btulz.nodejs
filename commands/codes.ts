/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
import strings = require("string");
import format = require("string-format");
import fs = require("fs");
import path = require("path");

export namespace objects {
    /**
     * 是否为空
     * @param object 判断对象
     */
    export function isNull(object: any): boolean {
        if (object === undefined || object === null) {
            return true;
        }
        return false;
    }
    /**
     * 获取类型名称
     * @param type 类型
     */
    export function nameOf(type: Function | Object): string {
        if (objects.isNull(type)) {
            return undefined;
        }
        if (typeof type === "object") {
            type = typeOf(type);
        }
        if (typeof type !== "function") {
            throw new Error("is not a class.");
        }
        if (type.name) {
            return type.name;
        }
        return typeof type;
    }
    /**
     * 获取实例类型
     * @param 实例
     */
    export function typeOf(instance: Object): any {
        if (objects.isNull(instance)) {
            return undefined;
        }
        if (typeof instance !== "object") {
            throw new Error("is not a object.");
        }
        return instance.constructor;
    }
}
export module arrays {
    export function where<T>(values: T[], lambda?: (value: T) => boolean): T[] {
        let results: Array<T> = new Array<T>();
        if (values instanceof Array) {
            for (let item of values) {
                if (lambda instanceof Function && lambda(item) !== true) {
                    continue;
                }
                results.push(item);
            }
        }
        return results;
    }
    export function first<T>(values: T[], lambda?: (value: T) => boolean): T | null {
        let results: Array<T> = where(values, lambda);
        if (results.length > 0) {
            return results[0];
        }
        return null;
    }
    export function last<T>(values: T[], lambda?: (value: T) => boolean): T | null {
        let results: Array<T> = where(values, lambda);
        if (results.length > 0) {
            return results[results.length - 1];
        }
        return null;
    }
}
export namespace elements {
    export function naming(value: string): string {
        let name: string = value;
        if (!strings(name).isEmpty()) {
            let index: number = name.indexOf(":");
            if (index > 0 && index < value.length - 1) {
                name = name.substring(index + 1);
            }
            if (strings(name).include(".")) {
                name = strings(name).replaceAll(".", "_").toString();
            }
        }
        return name;
    }
}
export enum Visibility {
    "PUBLIC",
    "PROTECTED",
    "PRIVATE"
}
export class Element {
    constructor() {
    }
    /** 名称 */
    name: string;
    /** 输出字符串 */
    toString(): string {
        return format("{0}: {1}", objects.nameOf(this).replace(Element.name, ""), this.name);
    }
}
export class PackageElement extends Element {
    constructor() {
        super();
        this.elements = [];
    }
    /** 命名空间 */
    namespace: string;
    /** 子元素 */
    elements: Element[];
}
export class NamespaceElement extends Element {
    constructor() {
        super();
        this.elements = [];
        this.visibility = Visibility.PUBLIC;
    }
    /** 访问级别 */
    visibility: Visibility;
    /** 子元素 */
    elements: Element[];
}
export class ClassElement extends Element {
    constructor() {
        super();
        this.implements = [];
        this.constructors = [];
        this.properties = [];
        this.methods = [];
        this.visibility = Visibility.PUBLIC;
    }
    /** 访问级别 */
    visibility: Visibility;
    /** 最终的 */
    final: boolean;
    /** 抽象的 */
    abstract: boolean;
    /** 基类名称 */
    extends: string;
    /** 实现的接口 */
    implements: string[];
    /** 构造方法 */
    constructors: ConstructorElement[];
    /** 属性 */
    properties: PropertyElement[];
    /** 方法 */
    methods: FunctionElement[];
}
export class InterfaceElement extends Element {
    constructor() {
        super();
        this.properties = [];
        this.methods = [];
        this.extends = [];
        this.visibility = Visibility.PUBLIC;
    }
    /** 访问级别 */
    visibility: Visibility;
    /** 基类名称 */
    extends: string[];
    /** 属性 */
    properties: PropertyElement[];
    /** 方法 */
    methods: FunctionElement[];
}
export class EnumElement extends Element {
    constructor() {
        super();
        this.values = [];
        this.visibility = Visibility.PUBLIC;
    }
    /** 访问级别 */
    visibility: Visibility;
    /** 枚举值 */
    values: EnumValueElement[];
}
export class EnumValueElement extends Element {
    constructor() {
        super();
    }
    /** 值 */
    value: string;
}
export class FunctionElement extends Element {
    constructor() {
        super();
        this.parameters = [];
        this.returns = [];
        this.visibility = Visibility.PUBLIC;
    }
    /** 访问级别 */
    visibility: Visibility;
    /** 静态 */
    static: boolean;
    /** 最终的 */
    final: boolean;
    /** 抽象的 */
    abstract: boolean;
    /** 参数 */
    parameters: ParameterElement[];
    /** 返回值 */
    returns: ParameterTypeElement[];
}
export class ConstructorElement extends Element {
    constructor() {
        super();
        this.parameters = [];
        this.visibility = Visibility.PUBLIC;
    }
    /** 访问级别 */
    visibility: Visibility;
    /** 参数 */
    parameters: ParameterElement[];
}
export class PropertyElement extends Element {
    constructor() {
        super();
        this.types = [];
        this.visibility = Visibility.PUBLIC;
    }
    /** 访问级别 */
    visibility: Visibility;
    /** 静态 */
    static: boolean;
    /** 最终的 */
    final: boolean;
    /** 可选 */
    optional: boolean;
    /** 数组 */
    array: boolean;
    /** 类型 */
    types: ParameterTypeElement[];
}
export class ParameterElement extends Element {
    constructor() {
        super();
        this.types = [];
    }
    /** 可选 */
    optional: boolean;
    /** 类型 */
    types: ParameterTypeElement[];
}
export class ParameterTypeElement extends Element {
    naming(name: string): void {
        this.name = elements.naming(name);
    }
}
export class FnParameterElement extends ParameterElement {
    constructor() {
        super();
        this.parameters = [];
    }
    /** 参数 */
    parameters: ParameterElement[];
}
export class TypedefElement extends Element {
    constructor() {
        super();
        this.types = [];
        this.visibility = Visibility.PUBLIC;
    }
    /** 访问级别 */
    visibility: Visibility;
    /** 类型 */
    types: ParameterTypeElement[];
}
const PROPERTY_VALUES: symbol = Symbol("values");
const NEW_LINE: string = "\n";
/** 构建器 */
export class Builder {
    /** 值 */
    values(): Array<string> {
        if (!(this[PROPERTY_VALUES] instanceof Array)) {
            this[PROPERTY_VALUES] = new Array<string>();
        }
        return this[PROPERTY_VALUES];
    }
    /** 写入 */
    wirte(content: string): void {
        this.values().push(content);
    }
    /** 写入行 */
    wirteLine(content?: string): void {
        if (!strings(content).isEmpty()) {
            this.values().push(content);
        }
        this.values().push(NEW_LINE);
    }
    /** 输出字符串 */
    toString(): string {
        let value: string = "";
        for (let item of this.values()) {
            value += item;
        }
        return value;
    }
}
export abstract class CodeGenerator {

    package: PackageElement;

    workFolder: string;

    extension: string;

    protected tabSpace(level: number): string {
        let builder: Builder = new Builder();
        for (let index: number = 0; index < (level * 4) && level > 0; index++) {
            builder.wirte(" ");
        }
        return builder.toString();
    }

    do(completed?: (err: Error) => void): void {
        if (!(this.package instanceof PackageElement)) {
            if (completed instanceof Function) {
                completed(new Error("invaild package."));
            }
        } else if (!fs.statSync(this.workFolder).isDirectory()) {
            if (completed instanceof Function) {
                completed(new Error("invaild workFolder."));
            }
        } else {
            // 增加命名空间
            let namespaces: string[] = [];
            if (!strings(this.package.name).isEmpty()) {
                namespaces.push(this.package.name.toLowerCase());
            }
            if (!strings(this.package.namespace).isEmpty()) {
                let temps: string[] = this.package.namespace.split(".");
                for (let i: number = temps.length - 1; i >= 0; i--) {
                    namespaces.push(temps[i]);
                }
            }
            for (let item of namespaces) {
                let element: NamespaceElement = new NamespaceElement();
                element.name = item;
                element.elements = this.package.elements;
                this.package.elements = [];
                this.package.elements.push(element);
            }
            this.writePackage(this.package);
            if (completed instanceof Function) {
                completed(undefined);
            }
        }
    }
    protected writePackage(element: PackageElement): void {
        let outFile: string = path.join(this.workFolder, element.name + (strings(this.extension).isEmpty() ? "" : this.extension));
        let stream: fs.WriteStream = fs.createWriteStream(outFile);
        this.writeComment(stream);
        let level: number = -1;
        for (let item of element.elements) {
            this.writeElement(item, stream, level + 1);
        }
        console.log("out file: %s", outFile);
    }
    protected writeComment(outFile: fs.WriteStream): void {
        outFile.write("/**");
        outFile.write(NEW_LINE);
        outFile.write(" * @license");
        outFile.write(NEW_LINE);
        outFile.write(" * Copyright Color-Coding Studio. All Rights Reserved.");
        outFile.write(NEW_LINE);
        outFile.write(" *");
        outFile.write(NEW_LINE);
        outFile.write(" * Use of this source code is governed by an Apache License, Version 2.0");
        outFile.write(NEW_LINE);
        outFile.write(" * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0");
        outFile.write(NEW_LINE);
        outFile.write(" */");
        outFile.write(NEW_LINE);
    }
    protected writeElement(element: Element, outFile: fs.WriteStream, level: number): void {
        if (element instanceof NamespaceElement) {
            this.writeNamespace(element, outFile, level);
        } else if (element instanceof ClassElement) {
            this.writeClass(element, outFile, level);
        } else if (element instanceof InterfaceElement) {
            this.writeInterface(element, outFile, level);
        } else if (element instanceof EnumElement) {
            this.writeEnum(element, outFile, level);
        } else if (element instanceof TypedefElement) {
            this.writeTypedef(element, outFile, level);
        }
    }
    protected abstract writeNamespace(element: NamespaceElement, outFile: fs.WriteStream, level: number): void;
    protected abstract writeClass(element: ClassElement, outFile: fs.WriteStream, level: number): void;
    protected abstract writeInterface(element: InterfaceElement, outFile: fs.WriteStream, level: number): void;
    protected abstract writeEnum(element: EnumElement, outFile: fs.WriteStream, level: number): void;
    protected abstract writeTypedef(element: TypedefElement, outFile: fs.WriteStream, level: number): void;
}

export class TypescriptGenerator extends CodeGenerator {

    protected visibility(value: Visibility): string {
        if (value === Visibility.PUBLIC) {
            return "";
        } else if (value === Visibility.PRIVATE) {
            return "private ";
        } else if (value === Visibility.PROTECTED) {
            return "protected ";
        }
    }
    protected writeNamespace(element: NamespaceElement, outFile: fs.WriteStream, level: number): void {
        outFile.write(this.tabSpace(level));
        if (level === 0) {
            outFile.write("declare ");
        }
        if (element.visibility === Visibility.PUBLIC && !strings(this.extension).endsWith(".d.ts")) {
            outFile.write("export ");
        }
        outFile.write("namespace ");
        outFile.write(element.name);
        outFile.write(" ");
        outFile.write("{");
        outFile.write(NEW_LINE);
        // 命名空间下元素去重
        let elements: Element[] = [];
        for (let item of element.elements) {
            let has: boolean = false;
            for (let sItem of elements) {
                if (sItem.toString() === item.toString()) {
                    has = true;
                    break;
                }
            }
            if (has) {
                continue;
            }
            elements.push(item);
        }
        for (let item of elements) {
            this.writeElement(item, outFile, level + 1);
        }
        outFile.write(this.tabSpace(level));
        outFile.write("}");
        outFile.write(NEW_LINE);
    }
    protected writeClass(element: ClassElement, outFile: fs.WriteStream, level: number): void {
        outFile.write(this.tabSpace(level));
        if (element.visibility === Visibility.PUBLIC && !strings(this.extension).endsWith(".d.ts")) {
            outFile.write("export ");
        }
        outFile.write("class ");
        outFile.write(element.name);
        outFile.write(" ");
        if (!strings(element.extends).isEmpty()) {
            outFile.write("extends ");
            outFile.write(element.extends);
            outFile.write(" ");
        }
        for (let item of element.implements) {
            if (element.implements.indexOf(item) > 0) {
                outFile.write(", ");
            } else {
                outFile.write("implements ");
            }
            outFile.write(item);
            outFile.write(" ");
        }
        outFile.write("{");
        outFile.write(NEW_LINE);
        // 静态方法
        for (let item of element.methods) {
            if (item.static !== true) {
                continue;
            }
            if (item.visibility === Visibility.PUBLIC) {
                continue;
            }
            this.writeFunction(item, outFile, level + 1);
        }
        // 构造
        for (let item of element.constructors) {
            this.writeConstructor(item, outFile, level + 1);
        }
        // 属性
        for (let item of element.properties) {
            this.writeProperty(item, outFile, level + 1);
        }
        // 方法
        for (let item of element.methods) {
            this.writeFunction(item, outFile, level + 1);
        }
        outFile.write(this.tabSpace(level));
        outFile.write("}");
        outFile.write(NEW_LINE);
        outFile.write(NEW_LINE);
    }
    protected writeFunction(element: FunctionElement, outFile: fs.WriteStream, level: number): void {
        outFile.write(this.tabSpace(level));
        if (element.visibility === Visibility.PUBLIC && element.static === true && !strings(this.extension).endsWith(".d.ts")) {
            outFile.write("export ");
        } else {
            outFile.write(this.visibility(element.visibility));
        }
        if (element.static) {
            outFile.write("static function ");
        }
        outFile.write(element.name);
        let writeParameters: Function = function (parameters: ParameterElement[]): void {
            for (let pItem of parameters) {
                if (parameters.indexOf(pItem) > 0) {
                    outFile.write(", ");
                }
                outFile.write(pItem.name);
                if (pItem.optional) {
                    outFile.write("?");
                }
                outFile.write(": ");
                if (pItem instanceof FnParameterElement) {
                    outFile.write("(");
                    writeParameters(pItem.parameters);
                    outFile.write(")");
                    outFile.write(" => ");
                    if (pItem.types.length === 0) {
                        outFile.write("void");
                    } else {
                        for (let tItem of pItem.types) {
                            if (pItem.types.indexOf(tItem) > 0) {
                                outFile.write(" | ");
                            }
                            outFile.write(tItem.name);
                        }
                    }
                } else {
                    for (let tItem of pItem.types) {
                        if (pItem.types.indexOf(tItem) > 0) {
                            outFile.write(" | ");
                        }
                        outFile.write(tItem.name);
                    }
                }
            }
        };
        outFile.write("(");
        writeParameters(element.parameters);
        outFile.write(")");
        outFile.write(": ");
        if (element.returns.length === 0) {
            outFile.write("void");
        } else {
            for (let tItem of element.returns) {
                if (element.returns.indexOf(tItem) > 0) {
                    outFile.write(" | ");
                }
                outFile.write(tItem.name);
            }
        }
        outFile.write(";");
        outFile.write(NEW_LINE);
    }

    protected writeConstructor(element: ConstructorElement, outFile: fs.WriteStream, level: number): void {
        outFile.write(element.name);
        outFile.write("(");
        for (let pItem of element.parameters) {
            if (element.parameters.indexOf(pItem) > 0) {
                outFile.write(", ");
            }
            outFile.write(pItem.name);
            if (pItem.optional) {
                outFile.write("?");
            }
            outFile.write(": ");
            for (let tItem of pItem.types) {
                if (pItem.types.indexOf(tItem) > 0) {
                    outFile.write(" | ");
                }
                outFile.write(tItem.name);
            }
        }
        outFile.write(");");
        outFile.write(NEW_LINE);
    }
    protected writeProperty(element: PropertyElement, outFile: fs.WriteStream, level: number): void {
        outFile.write(this.tabSpace(level));
        outFile.write(element.name);
        if (element.optional) {
            outFile.write("?");
        }
        outFile.write(": ");
        for (let tItem of element.types) {
            if (element.types.indexOf(tItem) > 0) {
                outFile.write(" | ");
            }
            outFile.write(tItem.name);
            if (element.array) {
                outFile.write("[]");
            }
        }
        outFile.write(";");
        outFile.write(NEW_LINE);
    }
    protected writeInterface(element: InterfaceElement, outFile: fs.WriteStream, level: number): void {
        outFile.write(this.tabSpace(level));
        if (element.visibility === Visibility.PUBLIC && !strings(this.extension).endsWith(".d.ts")) {
            outFile.write("export ");
        }
        outFile.write("interface ");
        outFile.write(element.name);
        outFile.write(" ");
        for (let item of element.extends) {
            if (element.extends.indexOf(item) > 0) {
                outFile.write(", ");
            } else {
                outFile.write("extends ");
            }
            outFile.write(item);
            outFile.write(" ");
        }
        outFile.write("{");
        outFile.write(NEW_LINE);
        // 属性
        for (let item of element.properties) {
            this.writeProperty(item, outFile, level + 1);
        }
        // 方法
        for (let item of element.methods) {
            this.writeFunction(item, outFile, level + 1);
        }
        outFile.write(this.tabSpace(level));
        outFile.write("}");
        outFile.write(NEW_LINE);
        outFile.write(NEW_LINE);
    }
    protected writeEnum(element: EnumElement, outFile: fs.WriteStream, level: number): void {
        outFile.write(this.tabSpace(level));
        if (element.visibility === Visibility.PUBLIC && !strings(this.extension).endsWith(".d.ts")) {
            outFile.write("export ");
        }
        outFile.write("enum ");
        outFile.write(element.name);
        outFile.write(" ");
        outFile.write("{");
        outFile.write(NEW_LINE);
        // 值
        for (let item of element.values) {
            outFile.write(this.tabSpace(level + 1));
            outFile.write(item.name);
            outFile.write(" ");
            outFile.write("=");
            outFile.write(" ");
            outFile.write(item.value);
            outFile.write(",");
            outFile.write(NEW_LINE);
        }
        outFile.write(this.tabSpace(level));
        outFile.write("}");
        outFile.write(NEW_LINE);
        outFile.write(NEW_LINE);
    }
    protected writeTypedef(element: TypedefElement, outFile: fs.WriteStream, level: number): void {
        outFile.write(this.tabSpace(level));
        if (element.visibility === Visibility.PUBLIC && !strings(this.extension).endsWith(".d.ts")) {
            outFile.write("export ");
        }
        outFile.write("type ");
        outFile.write(element.name);
        outFile.write(" ");
        outFile.write("=");
        outFile.write(" ");
        // 值
        for (let item of element.types) {
            if (element.types.indexOf(item) > 0) {
                outFile.write(" | ");
            }
            outFile.write(item.name);
        }
        outFile.write(";");
        outFile.write(NEW_LINE);
        outFile.write(NEW_LINE);
    }
}