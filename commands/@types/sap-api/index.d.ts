/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
*/
declare namespace sap {
    namespace ui5 {
        /** API */
        export interface Api {
            version: string;
            library: string;
            defaultComponent: string;
            symbols: Symbol[];
        }
        /** 符号 */
        export interface Symbol {
            /** 类型 */
            kind: "class" | "namespace" | "function" | "enum" | "interface" | "typedef";
            /** 名称 */
            name: string;
            /** 基本名称 */
            basename: string;
            /** 描述 */
            description: string;
            /** 代码文件 */
            resource: string;
            /** 模块路径 */
            module: string;
            /** 输出内容 */
            export: string;
            /** 是否静态 */
            static: boolean;
            /** 最终的 */
            final: boolean;
            /** 抽象的 */
            abstract: boolean;
            /** 开始版本 */
            since: string;
            /** 可见级别 */
            visibility: "public" | "protected" | "restricted";
            /** 基类名称 */
            extends: string;
            /** 实现的接口 */
            implements: string[];
            /** 构造方法 */
            "constructor": Constructor;
            /** 事件 */
            events: Method[];
            /** 属性 */
            properties: Property[];
            /** 方法 */
            methods: Method[];
            /** 归属组件 */
            component: string;
            /** 子节点 */
            nodes: Node[];
            /** 元数据 */
            "ui5-metadata": Metadata;
            /** 库 */
            lib?: string;
            /** 已弃用 */
            deprecated?: Deprecated | boolean;
            /** 显示名称 */
            displayName?: string;
        }
        /** 元数据 */
        export interface Metadata {
            stereotype: string;
            basetype: string;
        }
        /** 类型信息 */
        export interface TypeInfo {
            /** 模板类型表达式，如 "string"、"Array<string>"、"int | null" */
            template: string;
            /** UI5 类型列表，用于替换模板中的占位符 ${0}, ${1}... */
            UI5Types?: string[];
        }
        /** 子节点 */
        export interface Node {
            /** 名称 */
            name: string;
            /** 文本（旧格式） */
            text?: string;
            /** 描述（新格式） */
            description?: string;
            /** 链接（新格式） */
            href?: string;
            /** 是否已弃用（新格式） */
            deprecated?: boolean;
            /** 类型（api-index 中） */
            kind?: string;
            /** 库（api-index 中） */
            lib?: string;
            /** 子节点（api-index 中） */
            nodes?: Node[];
        }
        /** 属性 */
        export interface Property {
            /** 名称 */
            name: string;
            /** 可见级别 */
            visibility: "public" | "protected" | "restricted";
            /** 描述 */
            description: string;
            /** 可选 */
            optional: boolean;
            /** 类型（旧格式） */
            type?: string;
            /** 值（枚举属性） */
            value?: string;
            /** 类型信息（新格式，1.148.0+） */
            typeInfo?: TypeInfo;
        }
        /** 方法 */
        export interface Method {
            /** 名称 */
            name: string;
            /** 可见级别 */
            visibility: "public" | "protected" | "restricted";
            /** 描述 */
            description: string;
            /** 开始版本 */
            since: string;
            /** 是否静态 */
            static: boolean;
            /** 返回值 */
            returnValue: ReturnValue;
            /** 参数 */
            parameters: Parameter[];
            /** 已弃用 */
            deprecated: Deprecated;
        }
        /** 弃用的 */
        export interface Deprecated {
            /** 开始版本 */
            since: string;
            /** 描述 */
            text: string;
        }
        /** 方法返回值 */
        export interface ReturnValue {
            /** 类型（旧格式，1.148.0 中仍保留） */
            type: string;
            /** 描述 */
            description: string;
            /** 类型列表（旧格式） */
            types?: ParameterType[];
            /** 类型信息（新格式，1.148.0+） */
            typeInfo?: TypeInfo;
        }
        /** 参数 */
        export interface Parameter {
            /** 名称 */
            name: string;
            /** 可选 */
            optional: boolean;
            /** 描述 */
            description: string;
            /** 类型（简化格式，1.148.0 旧路径 api.json） */
            type?: string;
            /** 类型列表（旧格式，1.148.0 新路径中可能为空数组） */
            types?: ParameterType[];
            /** 类型信息（新格式，1.148.0+ apiref/api.json） */
            typeInfo?: TypeInfo;
            /** 默认值 */
            defaultValue: string;
            /** 深度 */
            depth: number;
        }
        /** 方法参数类型 */
        export interface ParameterType {
            /** 类型 */
            value: string;
        }
        /** 构造方法 */
        export interface Constructor {
            /** 可见级别 */
            visibility: "public" | "protected" | "restricted";
            /** 描述 */
            description: string;
            /** 参数 */
            parameters: ConstructorParameter[];
        }
        /** 构造方法参数 */
        export interface ConstructorParameter {
            /** 名称 */
            name: string;
            /** 可选 */
            optional: boolean;
            /** 描述 */
            description: string;
            /** 默认值 */
            defaultValue: string;
            /** 类型（简化格式，1.148.0 旧路径 api.json） */
            type?: string;
            /** 类型列表（旧格式，1.148.0 新路径中可能为空数组） */
            types?: ConstructorParameterType[];
            /** 类型信息（新格式，1.148.0+ apiref/api.json） */
            typeInfo?: TypeInfo;
            /** 深度 */
            depth: number;
        }
        /** 构造方法参数类型（旧格式） */
        export interface ConstructorParameterType {
            /** 类型 */
            name: string;
        }
    }
}