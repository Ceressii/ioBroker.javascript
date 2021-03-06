![Logo](admin-config/javascript.png)
# Javascript Script Engine

![Number of Installations](http://iobroker.live/badges/javascript-installed.svg) ![Number of Installations](http://iobroker.live/badges/javascript-stable.svg) [![NPM version](http://img.shields.io/npm/v/iobroker.javascript.svg)](https://www.npmjs.com/package/iobroker.javascript)
[![Downloads](https://img.shields.io/npm/dm/iobroker.javascript.svg)](https://www.npmjs.com/package/iobroker.javascript)
[![Tests](https://travis-ci.org/ioBroker/ioBroker.javascript.svg?branch=master)](https://travis-ci.org/ioBroker/ioBroker.javascript)

[![NPM](https://nodei.co/npm/iobroker.javascript.png?downloads=true)](https://nodei.co/npm/iobroker.javascript/)

Executes Javascript, Typescript Scripts.

[Function documentation](docs/en/javascript.md)

[Benutzung](docs/de/usage.md)

Here you can find description of [blockly](docs/en/blockly.md).

Hier kann man die Beschreibung von [Blockly](docs/de/blockly.md) finden.

Описание по [blockly](docs/ru/blockly.md) можно найти [здесь](docs/ru/blockly.md).

**This adapter uses Sentry libraries to automatically report exceptions and code errors to the developers.** For more details and for information how to disable the error reporting see [Sentry-Plugin Documentation](https://github.com/ioBroker/plugin-sentry#plugin-sentry)! Sentry reporting is used starting with js-controller 3.0.

## How to build (only for developers)
Just run `npm i` in the root and in the src folders.

And then call `npm run build`.

## Todo
- new rule editor (future releases)
- heating profile (future releases)
- ...

<!--
	Placeholder for the next version (at the beginning of the line):
	### __WORK IN PROGRESS__
-->

## Changelog
### 4.10.8 (2020-12-07)
* (paul53) Corrected `variables.isDayTime`
* (AlCalzone) catch errors during virtual-tsc compile calls
* (Apollon77) Prevent crash case (Sentry)

### 4.10.7 (2020-12-03)
* (Apollon77) Prevent crash case (Sentry IOBROKER-JAVASCRIPT-4Q)
* (paul53) Corrected `variables.isDayTime`

### 4.10.6 (2020-12-01)
* (AlCalzone) TypeScripts which augment the global scope are now correctly compiled
* (AlCalzone) If no type declarations are found for an installed package, `require` will no longer show the error "module not found"
* (AlCalzone) Removed the `--prefix` argument in `npm install`, so package installations on Windows no longer mess up the install directory
* (bluefox) Corrected the set of the binary state

### 4.10.5 (2020-11-15)
* (bluefox) null timeouts are checked now

### 4.10.4 (2020-11-09)
* (bluefox) null timeouts are checked now
* (AlCalzone) Correction for the typescript with async functions

## License

The MIT License (MIT)

Copyright (c) 2014-2020 bluefox <dogafox@gmail.com>,

Copyright (c) 2014      hobbyquaker
