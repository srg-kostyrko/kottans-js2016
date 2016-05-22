module.exports = function transformJsClasses(tree) {
    
    tree.match({attrs: {class: /\bjs-/}}, (node) => {
        let cssClasses = node.attrs.class.split(' ');
        let jsClasses = cssClasses.filter((cls) => cls.startsWith('js-'));

        if (jsClasses.length > 0) {
            node.attrs['data-js'] = jsClasses.map((cls) => cls.substr(3)).join(' ');
            let clearedCssClasses = cssClasses.filter((cls) => jsClasses.indexOf(cls) === -1);
            if (clearedCssClasses.length > 0) {
                node.attrs.class = clearedCssClasses.join(' ');
            } else {
                node.attrs.class = null;
            }
        }

        return node;
    });

    return tree;
};
