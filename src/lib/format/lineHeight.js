/**
 * Created by yeanzhi on 17/7/18.
 */
'use strict';
import Quill from 'quill';
const Parchment = Quill.import('parchment');
class Block extends Parchment.Block {
}
let config = {
    scope: Parchment.Scope.BLOCK,
    whitelist: null//[1, 1.15, 1.35, 1.5, 2, 2.5, 3]
};

let LineHeightAttribute = new Parchment.Attributor.Attribute('lineheight', 'lineHeight', config);
let LineHeightStyle = new Parchment.Attributor.Style('lineheight', 'line-height', config);
// Parchment.register(LineHeightStyle)
export { LineHeightAttribute, LineHeightStyle };

//['1.0', '1.15', '1.35', '1.5', '12', '2.5', '3.0']

