# SnapScroll

### Installing

Install the package:

```bash
yarn install snapscroll
```

Import the plugin: 

```javascript
import SnapScroll from 'snapscroll';

SnapScroll('.snapscroll-element', options);
```

Available options:

```javascript
{
    proximity: 100,
    duration: 200,
    easing: time => time,
    onSnapWait: 50,
}
```