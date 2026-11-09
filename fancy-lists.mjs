/**
 * Fancy ordered lists under the stock book-theme (interim, until the
 * QuantEcon book theme renders list style itself).
 *
 * The QuantEcon mystmd fork (qe-v8+) parses `(i)`, `(a)` and `iv.` markers
 * into ordered lists that carry `style` and `delimiter` (QuantEcon/mystmd#50).
 * book-theme renders every ordered list as a bare <ol>, and drops a class set
 * on the list node itself. It does render a class on a `div`, so this
 * transform wraps each styled list in
 *
 *     <div class="fancy-list list-<style> delimiter-<delimiter>">
 *
 * and fancy-lists.css (site.options.style) draws the markers from those
 * classes, following quantecon-theme.mystmd's styles/lists.css.
 */
const STYLES = new Set(['lower-alpha', 'upper-alpha', 'lower-roman', 'upper-roman']);

const isWrapper = (node) =>
  node.type === 'div' && String(node.class ?? '').split(/\s+/).includes('fancy-list');

function wrap(node) {
  if (!Array.isArray(node.children)) return;
  node.children = node.children.map((child) => {
    wrap(child);
    if (child.type !== 'list' || !child.ordered || !STYLES.has(child.style) || isWrapper(node)) {
      return child;
    }
    return {
      type: 'div',
      class: `fancy-list list-${child.style} delimiter-${child.delimiter || 'period'}`,
      children: [child],
    };
  });
}

const plugin = {
  name: 'Fancy lists for book-theme',
  transforms: [
    {
      name: 'wrap-fancy-lists',
      doc: 'Wrap styled ordered lists in a classed div so fancy-lists.css can draw their markers.',
      stage: 'document',
      plugin: () => (tree) => {
        wrap(tree);
      },
    },
  ],
};

export default plugin;
