#!/usr/bin/env node
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
import yargs = require("yargs");
var argv: {} = yargs
    .commandDir("commands")
    .demandCommand(1)
    .help()
    .locale("en")
    .showHelpOnFail(true, "Specify --help for available options")
    .argv;
