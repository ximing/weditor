import Embed from 'quill/blots/embed';
import { sanitize } from 'quill/formats/link';

const ATTRIBUTES = [
  'alt',
  'height',
  'width'
];


class Image extends Embed {
  static create(value) {
    let node = super.create(value);
    if (typeof value === 'string') {
      node.setAttribute('src', this.sanitize(value));
    }else {
        if(value.src){
            node.setAttribute('src', this.sanitize(value.src));
        }
        if (value.width) {
            node.setAttribute('width', value.width);
        }
        if (value.height) {
            node.setAttribute('height', value.height);
        }
    }
    return node;
  }

  static formats(domNode) {
    return ATTRIBUTES.reduce(function(formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  static match(url) {
    return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
  }

  static sanitize(url) {
    return sanitize(url, ['http', 'https', 'data']) ? url : '//:0';
  }

  static value(domNode) {
    return domNode.getAttribute('src');
  }

  format(name, value) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}
Image.blotName = 'xmimage';
Image.tagName = 'IMG';


export default Image;
