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
*[ I'm feeling blue ]
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