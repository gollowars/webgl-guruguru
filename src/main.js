// Requires
require("babel/polyfill");
const UltraQ = require('./scripts/ultraq.js');
var ultraq = new UltraQ();

jQuery(document).ready(function($) {
  ultraq.run();
});
