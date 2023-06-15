## Tezos Domains Resolution

#### Technologies

- Electron 20.3.0
- Node 16.18.0
- Vite 4.0.4
- Vue 2.7.14

Note: Patch package is executed on punycode to solve error "cannot read property 'decode' of undefined". This is due to punycode's module (punycode.es6.js) missing the ucs2 export.