const not = (fn) => {
    return (...args) => !fn(...args);
};
const isBootstrapGridClass = (cls) => /^col-(xs|sm|md|lg)(-(offset|pull|push))?-([0-9]{1,2})/.test(cls);
const isBootstrapVisibilityCls = (cls) => /^(visible|hidden)-(xs|sm|md|lg)(-(block|inline|inline-block))?|clearfix/.test(cls);
const isBootstrapTypographyCls = (cls) => /^text-|h[1-6]|lead|page-header/.test(cls);
const isBootstrapListClass = (cls) => /list-(unstyled|inline|horizontal|group(-item(-(heading|text))?)?)/.test(cls);

module.exports = function stripBootstrapClasses(tree) {
    tree.match({attrs: {class: true}}, (node) => {
        let cssClasses = node.attrs.class.split(' ');

        let filteredClasses = cssClasses
            .filter(not(isBootstrapGridClass))
            .filter(not(isBootstrapVisibilityCls))
            .filter(not(isBootstrapTypographyCls))
            .filter(not(isBootstrapListClass));

        if (filteredClasses.length > 0) {
            node.attrs.class = filteredClasses.join(' ');
        } else {
            node.attrs.class = null;
        }

        return node;
    });

    return tree;
};
