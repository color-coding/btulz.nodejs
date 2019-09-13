/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
import yargs = require("yargs");
import fs = require("fs");
import path = require("path");
import code = require("./codes");
import wsdl = require("./codes_wsdl");

var command: yargs.CommandModule<{}, { wsdl: string, out: string, namespace: string, typedefs: string }> = {
    command: "wsdl-to-ts <wsdl> [out] [namespace] [typedefs]",
    describe: "Generate TypeScript typings from a WSDL service.",
    builder: {
        wsdl: {
            demandOption: true,
            describe: "WSDL file"
        },
        out: {
            default: ".",
            describe: "Out put folder"
        },
        namespace: {
            default: "",
            describe: "External namespace"
        },
        typedefs: {
            default: "",
            describe: "External typedef element"
        },
    },
    handler: function (args: yargs.Arguments<{ wsdl: string, out: string, namespace: string, typedefs: string }>): void {
        if (!args.wsdl) {
            throw new Error("not specify --wsdl which is service files.");
        }
        wsdl.files.mkdirs(args.out, (err: Error) => {
            if (err instanceof Error) {
                throw err;
            }
            fs.stat(args.wsdl, (err, stat) => {
                if (err instanceof Error) {
                    throw err;
                }
                if (stat.isDirectory()) {
                    fs.readdir(args.wsdl, (err, files) => {
                        if (err instanceof Error) {
                            throw err;
                        }
                        for (let item of files) {
                            if (item.endsWith(".wsdl")) {
                                exportCode(path.join(args.wsdl, item), args, (err, pack) => {
                                    if (err instanceof Error) {
                                        throw err;
                                    }
                                });
                            }
                        }
                    });
                } else if (stat.isFile() && args.wsdl.endsWith(".wsdl")) {
                    exportCode(args.wsdl, args, (err, pack) => {
                        if (err instanceof Error) {
                            throw err;
                        }
                    });
                }
            });
        });
    }
};
function exportCode(file: string,
    args: { wsdl: string, out: string, namespace: string, typedefs: string },
    completed: (err: Error, pack: code.PackageElement) => void): void {
    wsdl.files.readXml(file, (err, xmlDoc) => {
        if (err instanceof Error) {
            completed(err, undefined);
        } else {
            let parser: wsdl.ElementParser = new wsdl.InterfaceParser();
            parser.document = xmlDoc;
            parser.basicTypes = [
                "string",
                "number",
                "boolean",
                "Date",
            ];
            parser.parser((err, pack) => {
                if (err instanceof Error) {
                    completed(err, undefined);
                } else {
                    let generator: code.TypescriptGenerator = new code.TypescriptGenerator();
                    generator.package = pack;
                    generator.workFolder = args.out;
                    generator.extension = ".d.ts";
                    if (args.namespace) {
                        generator.package.namespace = args.namespace;
                    }
                    if (args.typedefs) {
                        for (let item of args.typedefs.split(";")) {
                            let index: number = item.indexOf("=");
                            if (index > 0) {
                                let element: code.TypedefElement = new code.TypedefElement();
                                element.name = item.substring(0, index);
                                let type: code.ParameterTypeElement = new code.ParameterTypeElement();
                                type.name = item.substring(index + 1);
                                element.types.push(type);
                                generator.package.elements.push(element);
                            }
                        }
                    }
                    generator.do();
                }
            });
        }
    });
}
export =command;