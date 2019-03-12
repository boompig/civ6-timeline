# About

Civ 6 generates a timeline file at the end of the game. This visualizes an uploaded file.

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