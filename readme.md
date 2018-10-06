# Splatter

A quicker, unopinionated template engine for Express.js



Write server-side JavaScript inside HTML using a code block:

`filename.splat`
```html
*{
    title = 'Oh look...';
    colors = ['Red', 'Blue', 'Green'];
}
<html>...
```

Output JavaScript variables:

```html
<h1>*title</h1>

```

Use parenthisis if needed:

```html
<h1>*(title + ' colors.')</h1>
```

Loop just like in JavaScript:

```html
*for (color in colors) {
    <li>*color</li>
}
```

Conditions:
```html
*if (title.length > 3) {
    <h1>*title</h1>
}
```

Make comments anywhere:

```html
*[ I'm feeling blue ]*
```
Here's an example:

`index.splat`

```html
*{
    title = 'Oh look...';
    colors = ['Red', 'Blue', 'Green'];
}

<html>
<body>

    <h1>*(title + ' colors.')</h1>

    <ul>
    *[I'm feeling blue]
    *for (color in colors) {
        <li *if (colors[color] == 'Blue') {style="color: blue"}>
            *colors[color]
        </li>
    }
    </ul>

</body>
</html>
```
# Express Example
Here's an example of how to set up with express:

``` javascript
const express = require('express')
const splatter = require('splatter');
const app = express()

app.engine('splat', splatter)

app.set('views', './views') // specify the views directory
app.set('view engine', 'splat') // register the template engine

app.get('/', function (req, res) {
    res.render('index', {
        title: 'Page Title',
        message: 'Hello there!'
    })
})
var port = 3000;
app.listen(port, () => console.log('Listening on http://localhost:' + port))
```

Use `*input.title` to output variables passed to the template.