import marked from 'marked'
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import 'github-markdown-css/github-markdown.css'

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function(code) {
    return hljs.highlightAuto(code).value;
  },
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
})

export { marked }