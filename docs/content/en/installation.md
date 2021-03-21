---

title: Installation
description: 'ngrok exposes your localhost to the world for easy testing and sharing! No need to mess with DNS or deploy just to have others test out your changes'
category: Guide
position: 1
---Add `@slvrdigital/statics-prefetch` dependency using yarn or npm to your project

<code-group>
  <code-block label="NPM" active>

```bash
npm install @slvrdigital/statics-prefetch
```

  </code-block>

  <code-block label="Yarn">

```bash
yarn add @slvrdigital/statics-prefetch
```

  </code-block>
</code-group>

Add `@slvrdigital/statics-prefetch` to the buildModules section of your `nuxt.config.js`

```js{}[nuxt.config.js]
buildModules: ['@slvrdigital/statics-prefetch']
```
