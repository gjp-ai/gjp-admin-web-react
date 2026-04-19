const { Editor } = require('@tiptap/core');
const Document = require('@tiptap/extension-document');
const Paragraph = require('@tiptap/extension-paragraph');
const Text = require('@tiptap/extension-text');
const Link = require('@tiptap/extension-link');

const editor = new Editor({
  extensions: [
    Document,
    Paragraph,
    Text,
    Link.configure({ HTMLAttributes: { target: null } })
  ],
  content: '<a href="https://example.com" target="_blank">Test</a>'
});

console.log('HTML with target=null:', editor.getHTML());

const editor2 = new Editor({
  extensions: [
    Document,
    Paragraph,
    Text,
    Link
  ],
  content: '<a href="https://example.com" target="_blank">Test</a>'
});

console.log('HTML with default:', editor2.getHTML());
