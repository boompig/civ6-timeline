# About

Civ 6 generates a timeline file at the end of the game. This visualizes an uploaded file.

The demo can be found [here](https://boompig.github.io/civ6-timeline). Limitations and ideas for future work are documented [here](https://boompig.github.io/civ6-timeline/about.html).

## Adding More Tooltips

- use `scripts/index.js --histogram` to extract moments from target file
- extract pattern for that moment using `scripts/index.js --pattern`
- add the pattern to `src/components/moment-text-parser.ts` and `src/components/moment.tsx`
- profit

## Building

Install javascript dependencies then build with webpack.

```
yarn install
webpack
```

## Linting

`yarn lint`