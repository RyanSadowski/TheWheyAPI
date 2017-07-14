var acquit = require('acquit');
var testFiles = ['./test/server.js','./test/user.js','./test/lift.js'];  //put mocha test files here.

for (var o = 0; o < testFiles.length; o++){

  var content = require('fs').
  readFileSync(testFiles[o]).toString();
  // Parse the contents of the test file into acquit 'blocks'
  var blocks = acquit.parse(content);
  var header = require('fs').readFileSync('./header.md').toString();
  if(o ==0){
    var mdOutput = header + '\n\n';
  }

  // For each describe() block
  for (var i = 0; i < blocks.length; ++i) {
    var describe = blocks[i];
    mdOutput += '## ' + describe.contents + '\n\n';
    mdOutput += describe.comments[0] ?
    acquit.trimEachLine(describe.comments[0]) + '\n\n' :
    '';

    // This test file only has it() blocks underneath a
    // describe() block, so just loop through all the
    // it() calls.
    for (var j = 0; j < describe.blocks.length; ++j) {
      var it = describe.blocks[j];
      mdOutput += '#### It ' + it.contents + '\n\n';
      mdOutput += it.comments[0] ?
      acquit.trimEachLine(it.comments[0]) + '\n\n' :
      '';
      mdOutput += '```javascript\n';
      mdOutput += '    ' + it.code + '\n';
      mdOutput += '```\n\n';
    }
  }
}
require('fs').writeFileSync('wiki.md', mdOutput);
