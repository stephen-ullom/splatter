module.exports = function (filePath, options, callback) {

    require('fs').readFile(filePath, function (err, content) {
        if (err) return callback(err)

        // Remove all comments *[ <comment> ]
        var rendered = content.toString().replace(/([^\*])\*\[.*?\]/g, '$1');

        rendered = 'var output=\`' + render(rendered) + '\`;';

        try {
            rendered = eval(rendered);
        } catch (err) {
            console.error(err.stack);
        }

        return callback(null, rendered);
    })
}

function render(text) {
    // If no splatter code is present just return
    if(text.indexOf('*') == -1) {
        return text;
    }

    // Loop all asterisks
    var output = '';
    var lastIndex = 0;
    var starIndex = -1;
    while ((starIndex = text.indexOf('*', starIndex + 1)) >= 0) {
        // log('found star ' + sprightIndex);
        // Next char
        switch (text.charAt(starIndex + 1)) {
            case '{':
                // Code block
                log('Code block');
                output += text.slice(lastIndex, starIndex) + '\`;';
                lastIndex = starIndex + 2;

                var javascript = getInsideBracket(text.slice(lastIndex), '{', '}');
                output += javascript + ' output+=\`';

                lastIndex += javascript.length + 1;
                starIndex = lastIndex;
                break;
            case '(':
                // Expression Group
                log('Expression group');
                output += text.slice(lastIndex, starIndex) + '\`+';
                lastIndex = starIndex + 2;

                var javascript = getInsideBracket(text.slice(lastIndex), '(', ')');
                output += javascript + '+\`';

                lastIndex += javascript.length + 1;
                break;
            // case '[':
            //     // Comment
            //     log('Comment');

            //     output += text.slice(lastIndex, starIndex);
            //     lastIndex = starIndex + 2;

            //     var comment = getInsideBracket(text.slice(lastIndex), '[', ']');

            //     lastIndex += comment.length + 1;
                break;
            case '*':
                // Escape star
                log('Escape star');
                output += text.slice(lastIndex, starIndex + 1);
                lastIndex = starIndex + 2;
                starIndex++;
                break;
            default:
                var word = /^(\w+)[\w\.\[\]\(\)]*/.exec(text.slice(starIndex + 1));
                // log(word);
                if (word) {
                    if (['if', 'for', 'while'].indexOf(word[1].toString()) > -1) {
                        // Function
                        log('Function - ' + word[1]);

                        // Output HTML
                        output += text.slice(lastIndex, starIndex) + '\`;';
                        // Find '{' after function
                        var functionParams = text.slice(starIndex).indexOf('{') + 1;
                        // Output function with params
                        output += text.slice(starIndex + 1, starIndex + functionParams) + 'output+=\`';
                        lastIndex = starIndex + functionParams;
                        // Render 
                        var functionOutput = getInsideBracket(text.slice(lastIndex), '{', '}');
                        // log(functionOutput);
                        // output += render(text.slice(lastIndex, functionOutput)) + '}+var output+=\`';
                        output += render(functionOutput) + '\`}output+=\`';
                        lastIndex += functionOutput.length + 1;
                        starIndex = lastIndex;
                    } else {
                        // Expression
                        log('Expression - ' + word[0]);

                        output += text.slice(lastIndex, starIndex) + '\`+' + word[0] + '+\`';
                        lastIndex = starIndex + word[0].length + 1;
                    }
                } else {
                    log('Lone *');
                }
                break;
        }
    }

    output += text.slice(lastIndex);
    // log('Rendered');

    return output;
}

function log(text) {
    // console.log(text);
}

function getInsideBracket(text, openBracket, closeBracket) {
    var position = 0,
        depth = 1,
        doubleQoutes = false,
        singleQoutes = false;

    while (position <= text.length) {
        var char = text.charAt(position);

        switch (char) {
            case openBracket:
                if (!doubleQoutes && !singleQoutes) {
                    depth++;
                }
                break;
            case closeBracket:
                if (!doubleQoutes && !singleQoutes) {
                    depth--
                    if (depth == 0) {
                        // log(text.slice(0, position + 1))
                        return text.slice(0, position);
                    }
                }
                break;
            case '"':
                if (!singleQoutes) {
                    doubleQoutes = !doubleQoutes;
                }
                break;
            case "'":
                if (!doubleQoutes) {
                    singleQoutes = !singleQoutes;
                }
                break;
            case '\\':
                // Skip all backslashes
                position++;
                break;
        }
        position++;
    }

    console.error('No matching brackets found in: \n' + text)
    return '';
}