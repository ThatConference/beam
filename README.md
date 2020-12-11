# beam

dev-that cli for gcp and other stuff we decide to throw in there

## Summary

beam is a nodejs-based cli for working with gcp PubSub and Firestore emulators. It will work against production end points as well though that support has not been added yet. 

## Getting started

The project uses [Babel](https://babeljs.io) to transpile ES6 code to code usable by nodejs 12 & 14. This project targets `$ cat .node-version`. We recommend using `nodenv` to manage nodejs versions on your system. To load the running version for this project simply run the following from the root folder of this project, `$ nodenv install $(cat .node-version)`

Until something smoother is done, use the following line to execute the cli:

```sh
npx babel-node -- ./src/index.js <command> <sub-command> [options]
```

For example to list topics:

```sh
npx babel-node -- ./src/index.js list topic
```

Help is available for by using:

```sh
# for a list of commands
npx babel-node -- ./src/index.js -h
# or for command-specific help
npx babel-node -- ./src/index.js <command> -h
```
