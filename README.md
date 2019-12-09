# spatial-navigator [![Build Status](https://travis-ci.org/ajsoriar/spatial-navigator.svg?branch=master)](https://travis-ci.org/ajsoriar/spatial-navigator)

[![npm version](https://badge.fury.io/js/spatial-navigator.svg)](https://badge.fury.io/js/spatial-navigator)

spatial-navigator is a javascript spatial navigation library

## Use it this way

### 1 Download and Install spatial-navigator

- NPM: **npm install spatial-navigator**
- Bower: **bower install spatial-navigator**
- Yarn: **yarn add spatial-navigator**
- github: **<https://github.com/ajsoriar/spatial-navigator>**
<!--- - NuGet: **PM> Install-Package spatial-navigator** -->

### 2 Initialize the plugin by referencing the necessary files

```javascript
<script src="./../../src/spatial-navigator.js"></script>
```

### 3 Examples

```javascript
nav.reset();

nav.move.left();

nav.move.up();

nav.move.right();

nav.move.down();

<div class="btn focusable" data-focus-action-link="https://www.subidote.com">OK</div>
<div class="btn focusable" data-focus-action-function="console.log('LOL')">OK</div>

nav.action();

nav.focusById(1574711748163);

nav.groupBy('pop');
undefined
nav.curretGroup;
"pop"
nav.ungroup();
undefined

nav.map.draw();

nav.map.clear();

nav.focusArea('zone-1', 'bottom', 'right');

nav.focusArea('zone-1'); // top left
```

### 4 License

spatial-navigator is [MIT licensed](./LICENSE)
