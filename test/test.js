const assert = require('assert'),
      fs = require('fs')
describe('AWS', function() {
  describe('./aws.json', function() {
    it('should have a file called "aws.json" which exists', function() {
      const fileExists = fs.existsSync('./aws.json')
      assert.equal(true, fileExists);
    })
  })
})
