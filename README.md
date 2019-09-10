# About

Civ 6 generates a timeline file at the end of the game. This visualizes an uploaded file.

The demo can be found [here](https://boompig.github.io/civ6-timeline). Limitations and ideas for future work are documented [here](https://boompig.github.io/civ6-timeline/about.html).

## Run

This is the client code only. To run, use `http-server` or similar from the root directory.
To test the functionality locally you can use sample files in the `game-data` directory.

If you have the server-side code locally, you can run as is. Make sure the local port of the server is the same as the one specified in `src/components/constants.ts`. Otherwise you will have to recompile the code by changing `localApiServer` variable in `src/components/constants.ts` to the same value as `remoteApiServer`.

## Adding More Tooltips

- use `scripts/index.js --histogram` to extract moments from target file
- extract pattern for that moment using `scripts/index.js --pattern`
- add the pattern to `src/components/moment-text-parser.ts` and `src/components/moment.tsx`
- profit

## Building

Install JavaScript dependencies then build with `webpack`.

```
yarn install
webpack
```

## Linting

`yarn lint`
