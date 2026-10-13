import container from 'markdown-it-container'

/**
 * `::: pieceofcake2 [title]` marks content that is specific to Piece of Cake 2
 * (the pieceofcake2/cakephp fork) and not part of the original CakePHP
 * documentation.
 */
export function pieceofcake2Container(md) {
  md.use(container, 'pieceofcake2', {
    render(tokens, idx) {
      const token = tokens[idx]
      if (token.nesting === 1) {
        const title = token.info.trim().slice('pieceofcake2'.length).trim() || 'pieceofcake2 fork'
        return `<div class="pieceofcake2 custom-block"><p class="custom-block-title">${md.utils.escapeHtml(title)}</p>\n`
      }
      return '</div>\n'
    }
  })
}
