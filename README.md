# GrandeBocce

![](https://badgen.net/badge/version/GPL-3.0/blue)
![License](https://img.shields.io/github/license/ArthurBeaulieu/GrandeBocce.svg)
![Doc](https://badgen.net/badge/documentation/TODO/orange)
![Test](https://badgen.net/badge/test/TODO/orange)

A bocce tournament handler for tons of fun. Made in French, because it's Bocce's homeland. If you require additionnal language, DM me :)

[See it live](https://ArthurBeaulieu.github.io/GrandeBocce/index.html) or [Read the documentation](https://ArthurBeaulieu.github.io/GrandeBocce/doc/index.html)

# Usage

If you need more information on those components methods and internals, you can read the online [documentation](https://ArthurBeaulieu.github.io/GrandeBocce/doc/).

# Development

If you clone this repository, you can `npm install` to install development dependencies. This will allow you to build dist file, run the component tests or generate the documentation ;

- `npm run build` to generate the minified file ;
- `npm run watch` to watch for any change in source code ;
- `npm run server` to launch a local development server ;
- `npm run test` to perform tests ;
- `npm run test-dev` to debug tests ;
- `npm run doc` to generate documentation ;
- `npm run beforecommit` to perform tests, generate doc and bundle the source files.

To avoid CORS when locally loading the example HTML file, run the web server. Please do not use it on a production environment. Unit tests are performed on both Firefox and Chrome ; ensure you have both installed before running tests, otherwise they might fail.

GrandeBocce 0.0.1 - GPL-3.0 - ArthurBeaulieu
