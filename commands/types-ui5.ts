/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
import codes = require("./codes");
import fs = require("fs");
import os = require("os");
import path = require("path");
import request = require("request");
import yargs = require("yargs");
import strings = require("string");

var command: yargs.CommandModule<{}, { out: string, data: string, indexUrl: string }> = {
    command: "types-ui5 <data> [out]",
    describe: "Get the library json file of sap-ui5 and out put sap.d.ts.",
    builder: {
        data: {
            demandOption: true,
            describe: "Folder of library json"
        },
        out: {
            default: ".",
            describe: "Out put folder"
        },
        indexUrl: {
            default: "https://openui5.hana.ondemand.com/{VERSION}/docs/api/api-index.json"
        },
        apiUrl: {
            default: "https://openui5.hana.ondemand.com/{VERSION}/test-resources/{LIBRARY}/designtime/apiref/api.json"
        }
    },
    handler: function (args: yargs.Arguments<{ out: string, data: string, indexUrl: string, apiUrl: string }>): void {
        if (!args.data) {
            throw new Error("not specify --data which is library files.");
        }
        if (args.data.toLocaleLowerCase().startsWith("v")) {
            // 提供版本号，自动从网络下载
            let version: string = args.data.substring(1);
            let libFolder: string = path.join(os.tmpdir(), "btulz", "sap-ui5", version);
            mkdirs(libFolder, function (error: Error): void {
                if (error instanceof Error) {
                    throw error;
                }
                let url: string = strings(args.indexUrl).replaceAll("{VERSION}", version).toString();
                console.log("url: %s", url);
                let file: string = path.join(libFolder, "api-index.json");
                let stream: fs.WriteStream = fs.createWriteStream(file);
                request(url).pipe(stream).on("close", function (error: Error): void {
                    if (error instanceof Error) {
                        throw error;
                    }
                    fs.readFile(file, function (error: Error, data: Buffer): void {
                        if (error instanceof Error) {
                            throw error;
                        }
                        console.log("api: %s", file);
                        let api: sap.ui5.Api = JSON.parse(data.toString());
                        if (!api || !api.library) {
                            throw new Error("invaild index data.");
                        }
                        let apiUrl: string = strings(args.apiUrl).replaceAll("{VERSION}", version).toString();
                        let libs: Map<string, string> = new Map<string, string>();
                        let eachSymbol: Function = function (symbol: sap.ui5.Symbol): void {
                            if (!symbol.lib) {
                                return;
                            }
                            if (symbol.deprecated === true) {
                                return;
                            }
                            if (symbol.visibility === "restricted") {
                                return;
                            }
                            if (!libs.has(symbol.lib)) {
                                libs.set(symbol.lib, strings(apiUrl).replaceAll("{LIBRARY}", strings(symbol.lib).replaceAll(".", "/").toString()).toString());
                            }
                            if (symbol.nodes instanceof Array) {
                                for (let item of symbol.nodes) {
                                    eachSymbol(item);
                                }
                            }
                        };
                        for (let item of api.symbols) {
                            eachSymbol(item);
                        }
                        let count: number = libs.size;
                        for (let lib of libs.entries()) {
                            console.log("url: %s", lib[1]);
                            let file: string = path.join(libFolder, "api-" + lib[0] + ".json");
                            let stream: fs.WriteStream = fs.createWriteStream(file);
                            request(lib[1]).pipe(stream).on("close", function (error: Error): void {
                                if (error instanceof Error) {
                                    throw error;
                                } else {
                                    console.log("api: %s", file);
                                    count = count - 1;
                                    if (count === 0) {
                                        // 全部下载完成
                                        mkdirs(args.out, function (error: Error): void {
                                            if (error instanceof Error) {
                                                throw error;
                                            }
                                            outPutFolder(libFolder, args.out);
                                        });
                                    }
                                }
                            });
                        }
                    });
                });
            });
        } else if (args.data.toLocaleLowerCase().endsWith(".json")) {
            // 文件
            fs.readFile(args.data, function (error: Error, data: Buffer): void {
                if (error instanceof Error) {
                    throw error;
                }
                console.log("data: %s", args.data);
                mkdirs(args.out, function (error: Error): void {
                    if (error instanceof Error) {
                        throw error;
                    }
                    let exporter: codes.sapUI5.Exporter = new codes.sapUI5.Exporter();
                    let outFile: string = exporter.run(data, args.out, function (): void {
                        console.log("out: %s", outFile);
                        process.exit(0);
                    });
                });
            });
        } else {
            mkdirs(args.out, function (error: Error): void {
                if (error instanceof Error) {
                    throw error;
                }
                outPutFolder(args.data, args.out);
            });
        }
    }
};
function mkdirs(dirpath: string, callback: (error: Error) => void): void {
    fs.exists(dirpath, function (exists: boolean): void {
        if (exists) {
            callback(undefined);
        } else {
            // 尝试创建父目录，然后再创建当前目录
            mkdirs(path.dirname(dirpath), function (): void {
                fs.mkdir(dirpath, callback);
            });
        }
    });
}
function outPutFolder(workFolder: string, out: string): void {
    // 目录
    fs.readdir(workFolder, function (error: Error, files: string[]): void {
        if (error instanceof Error) {
            throw error;
        }
        if (files instanceof Array) {
            // 存在文件
            let outPut: Function = function (index: number): void {
                if (index >= files.length) {
                    fs.readdir(out, function (error: Error, files: string[]): void {
                        if (error instanceof Error) {
                            throw error;
                        }
                        var file: number = fs.openSync(path.join(out, "index.d.ts"), "w");
                        fs.writeSync(file, codes.sapUI5.format.copyrights());
                        for (let item of files) {
                            if (!item.toLowerCase().endsWith(".d.ts")) {
                                continue;
                            }
                            if (item.toLowerCase().endsWith("index.d.ts")) {
                                continue;
                            }
                            fs.writeSync(file, codes.sapUI5.format.references("./" + item));
                        }
                        fs.closeSync(file);
                        process.exit(0);
                    });
                } else {
                    let file: string = files[index];
                    if (!file.toLowerCase().endsWith(".json")) {
                        outPut(index + 1);
                    } else if (file.toLowerCase().endsWith("api-index.json")) {
                        outPut(index + 1);
                    } else {
                        file = path.join(workFolder, file);
                        fs.readFile(file, function (error: Error, data: Buffer): void {
                            if (error instanceof Error) {
                                throw error;
                            }
                            console.log("data: %s", file);
                            let exporter: codes.sapUI5.Exporter = new codes.sapUI5.Exporter();
                            let outFile: string = exporter.run(data, out, function (): void {
                                console.log("out: %s", outFile);
                                outPut(index + 1);
                            });
                        });
                    }
                }
            };
            outPut(0);
        }
    });
}
export =command;