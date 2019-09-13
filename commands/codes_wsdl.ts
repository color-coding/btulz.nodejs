/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
import fs = require("fs");
import code = require("./codes");
import xmldom = require("xmldom");
import path = require("path");
import format = require("string-format");
import strings = require("string");

export module files {
    export function readXml(file: string, completed: (err: Error, xmlDoc: Document) => void): void {
        // 文件
        fs.readFile(file, function (error: Error, data: Buffer): void {
            if (error instanceof Error) {
                if (completed instanceof Function) {
                    completed(error, undefined);
                }
            } else {
                console.log("wsdl document: %s", file);
                let xmlDoc: Document = new xmldom.DOMParser().parseFromString(data.toString());
                if (completed instanceof Function) {
                    completed(null, xmlDoc);
                }
            }
        });
    }
    export function mkdirs(dirpath: string, completed: (error: Error) => void): void {
        fs.exists(dirpath, function (exists: boolean): void {
            if (exists) {
                if (completed instanceof Function) {
                    completed(undefined);
                }
            } else {
                // 尝试创建父目录，然后再创建当前目录
                mkdirs(path.dirname(dirpath), function (error: Error): void {
                    fs.mkdir(dirpath, completed);
                });
            }
        });
    }
}
export module documents {

    export function childNodes(parent: Node, name?: string, types?: number[]): Node[] {
        let nodes: Node[] = [];
        if (parent && parent.hasChildNodes()) {
            for (let index: number = 0; index < parent.childNodes.length; index++) {
                let node: Node = parent.childNodes.item(index);
                if (types instanceof Array && types.length > 0) {
                    let done: boolean = false;
                    for (let item of types) {
                        if (node.nodeType === item) {
                            done = true;
                            break;
                        }
                    }
                    if (!done) {
                        continue;
                    }
                }
                if (name && node.nodeName !== name) {
                    continue;
                }
                nodes.push(node);
            }
        }
        return nodes;
    }
    export function childElements(parent: Node, name?: string): Node[] {
        return childNodes(parent, name, [parent.ELEMENT_NODE]);
    }
    export function childAttributes(parent: Node, name?: string): Node[] {
        let attrs: Attr[] = [];
        if (code.objects.nameOf(parent) === "Element" || parent instanceof Element) {
            for (let index: number = 0; index < (<Element>parent).attributes.length; index++) {
                let item: Attr = (<Element>parent).attributes.item(index);
                if (item.name === name) {
                    attrs.push(item);
                }
            }
        }
        return attrs;
    }

    export function attributeValue<T>(node: Node, name: string, cast?: (value: string) => T): T {
        if (code.objects.nameOf(node) === "Element" || node instanceof Element) {
            let attr: Attr = (<Element>node).getAttributeNode(name);
            if (!code.objects.isNull(attr)) {
                let value: string = attr.nodeValue;
                if (cast instanceof Function) {
                    return cast(value);
                }
                return <T><any>value;
            }
        }
        return undefined;
    }
}
const NODE_NAME_DEFINITIONS: string = "wsdl:definitions";
const NODE_NAME_PORT_TYPE: string = "wsdl:portType";
const NODE_NAME_SERVICE: string = "wsdl:service";
const NODE_NAME_PORT: string = "wsdl:port";
const NODE_NAME_TYPES: string = "wsdl:types";
const NODE_NAME_BINDING: string = "wsdl:binding";
const NODE_NAME_OPERATION: string = "wsdl:operation";
const NODE_NAME_INPUT: string = "wsdl:input";
const NODE_NAME_OUTPUT: string = "wsdl:output";
const NODE_NAME_FAULT: string = "wsdl:fault";
const NODE_NAME_SCHEMA: string = "xsd:schema";
const NODE_NAME_ELEMENT: string = "xsd:element";
const NODE_NAME_COMPLEX_TYPE: string = "xsd:complexType";
const NODE_NAME_SIMPLE_CONTENT: string = "xsd:simpleContent";
const NODE_NAME_SIMPLE_TYPE: string = "xsd:simpleType";
const NODE_NAME_SEQUENCE: string = "xsd:sequence";
const NODE_NAME_EXTENSION: string = "xsd:extension";
const NODE_NAME_RESTRICTION: string = "xsd:restriction";
const NODE_NAME_ENUMERATION: string = "xsd:enumeration";
export class ElementParser {
    /** 数据文档 */
    document: Document;
    /** 包 */
    package: code.PackageElement;
    /** 基本类型 */
    basicTypes: string[];
    /** 是否基本类型 */
    protected isBasicTypes(name: string): boolean {
        if (this.basicTypes instanceof Array) {
            for (let item of this.basicTypes) {
                if (item === name) {
                    return true;
                }
            }
        }
        return false;
    }
    /** 解析 */
    parser(completed: (err: Error, pack: code.PackageElement) => void): void {
        if (code.objects.isNull(this.document)) {
            completed(new Error("invaild document."), undefined);
        } else {
            this.package = new code.PackageElement();
            this.parsing(this.document);
            completed(undefined, this.package);
        }
    }
    protected parsing(node: Document): void {
        for (let nItem of documents.childElements(node, NODE_NAME_DEFINITIONS)) {
            this.parsingDefinitions(nItem);
        }
    }
    protected parsingDefinitions(node: Node): void {
        for (let nItem of documents.childElements(node)) {
            if (nItem.nodeName === NODE_NAME_PORT_TYPE) {
                this.parsingPortType(nItem);
            } else if (nItem.nodeName === NODE_NAME_TYPES) {
                this.parsingTypes(nItem);
            }
        }
    }
    protected parsingPortType(node: Node): void {
        this.package.name = documents.attributeValue(node, "name");
        console.log("--%s", this.package.toString());
        let element: code.InterfaceElement = new code.InterfaceElement();
        element.name = "ServiceClient";
        console.log("--%s", element.toString());
        for (let nItem of documents.childElements(node, NODE_NAME_OPERATION)) {
            let method: code.FunctionElement = new code.FunctionElement();
            method.name = documents.attributeValue(nItem, "name");
            for (let item of documents.childElements(nItem)) {
                if (item.nodeName === NODE_NAME_INPUT) {
                    let parm: code.ParameterElement = new code.ParameterElement();
                    parm.name = code.elements.naming(item.nodeName);
                    let parmType: code.ParameterTypeElement = new code.ParameterTypeElement();
                    parmType.naming(documents.attributeValue(item, "message"));
                    parm.types.push(parmType);
                    method.parameters.push(parm);
                } else if (item.nodeName === NODE_NAME_OUTPUT || item.nodeName === NODE_NAME_FAULT) {
                    let parm: code.ParameterElement = code.arrays.first(method.parameters, c => c.name === "completed");
                    if (!(parm instanceof code.FnParameterElement)) {
                        parm = new code.FnParameterElement();
                        parm.name = "completed";
                        method.parameters.push(parm);
                    }
                    let fnParm: code.ParameterElement = new code.ParameterElement();
                    fnParm.name = code.elements.naming(item.nodeName);
                    let fnParmType: code.ParameterTypeElement = new code.ParameterTypeElement();
                    fnParmType.naming(documents.attributeValue(item, "message"));
                    fnParm.types.push(fnParmType);
                    (<code.FnParameterElement>parm).parameters.push(fnParm);
                }
            }
            element.methods.push(method);
        }
        this.package.elements.push(element);
    }
    protected parsingTypes(node: Node): void {
        for (let nItem of documents.childElements(node)) {
            if (nItem.nodeName === NODE_NAME_SCHEMA) {
                this.parsingSchema(nItem);
            }
        }
    }
    protected parsingSchema(node: Node): void {
        for (let nItem of documents.childElements(node)) {
            if (nItem.nodeName === NODE_NAME_ELEMENT) {
                this.parsingElement(nItem);
            } else if (nItem.nodeName === NODE_NAME_COMPLEX_TYPE) {
                this.parsingComplexType(nItem);
            } else if (nItem.nodeName === NODE_NAME_SIMPLE_TYPE) {
                this.parsingSimpleType(nItem);
            }
        }
    }
    protected parsingElement(node: Node): void {
        let element: code.InterfaceElement = new code.InterfaceElement();
        element.name = documents.attributeValue(node, "name");
        console.log("--%s", element.toString());
        let type: string = code.elements.naming(documents.attributeValue(node, "type"));
        if (!strings(type).isEmpty()) {
            element.extends.push(type);
        }
        this.package.elements.push(element);
    }
    protected parsingComplexType(node: Node): void {
        for (let nItem of documents.childElements(node)) {
            if (nItem.nodeName === NODE_NAME_SEQUENCE) {
                let element: code.InterfaceElement = new code.InterfaceElement();
                element.name = documents.attributeValue(node, "name");
                console.log("--%s", element.toString());
                for (let sItem of documents.childElements(nItem)) {
                    if (sItem.nodeName === NODE_NAME_ELEMENT) {
                        let property: code.PropertyElement = new code.PropertyElement();
                        property.name = documents.attributeValue(sItem, "name");
                        let type: code.ParameterTypeElement = new code.ParameterTypeElement();
                        type.naming(documents.attributeValue(sItem, "type"));
                        property.types.push(type);
                        if (documents.attributeValue(sItem, "minOccurs") === "0") {
                            property.optional = true;
                        }
                        if (documents.attributeValue(sItem, "maxOccurs") === "unbounded") {
                            property.array = true;
                        }
                        element.properties.push(property);
                    }
                }
                this.package.elements.push(element);
            } else if (nItem.nodeName === NODE_NAME_SIMPLE_CONTENT) {
                for (let sItem of documents.childElements(nItem)) {
                    if (sItem.nodeName === NODE_NAME_EXTENSION) {
                        let element: code.TypedefElement = new code.TypedefElement();
                        element.name = documents.attributeValue(node, "name");
                        console.log("--%s", element.toString());
                        let type: code.ParameterTypeElement = new code.ParameterTypeElement();
                        type.naming(documents.attributeValue(sItem, "base"));
                        element.types.push(type);
                        this.package.elements.push(element);
                    }
                }
            }
        }
    }
    protected parsingSimpleType(node: Node): void {
        for (let nItem of documents.childElements(node)) {
            if (nItem.nodeName === NODE_NAME_RESTRICTION) {
                let element: code.TypedefElement = new code.TypedefElement();
                element.name = code.elements.naming(documents.attributeValue(node, "name"));
                // 对基本类型的定义无效
                if (this.isBasicTypes(element.name)) {
                    return;
                }
                console.log("--%s", element.toString());
                let enumNodes: Node[] = documents.childElements(nItem, NODE_NAME_ENUMERATION);
                if (enumNodes.length > 0) {
                    for (let sItem of enumNodes) {
                        let type: code.ParameterTypeElement = new code.ParameterTypeElement();
                        type.naming(documents.attributeValue(sItem, "value"));
                        type.name = format("\"{0}\"", type.name);
                        element.types.push(type);
                    }
                } else {
                    let type: code.ParameterTypeElement = new code.ParameterTypeElement();
                    type.naming(documents.attributeValue(nItem, "base"));
                    element.types.push(type);
                }
                this.package.elements.push(element);
            }
        }
    }
    protected parsingService(node: Node): void {
    }
    protected parsingBinding(node: Node): void {
    }
}
export class InterfaceParser extends ElementParser {

}
export class Exporter {

}