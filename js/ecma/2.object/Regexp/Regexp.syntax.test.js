const { expect } = require ('chai');

describe ('Regexp Syntax', function () {
  describe('zero-length assertions',function() {
    describe('basic boundary type assertion',function() {
      describe('^',function() {
        it('test match start position',function() {
          let startWithA = /^a/

          expect(startWithA.test('a')).true
          expect(startWithA.test(' a')).false
        })

        it('test match start position multi line model',function() {
          let hasLineStartWithA = /^a/m

          expect(hasLineStartWithA.test(' \na')).true
          expect(hasLineStartWithA.test(' a \n ds')).false
        })
      })

      describe('$',function() {
        it('test match end position',function() {
          let endWithA = /^a/

          expect(endWithA.test('a')).true
          expect(endWithA.test(' a ')).false
        })

        it('test match end position multi line model',function() {
          let hasLineendWithA = /^a/m

          expect(hasLineendWithA.test(' \na')).true
          expect(hasLineendWithA.test(' a \n ds')).false
        })
      })

      describe('\\b',function() {
        it('word boundary is position between \\w and \\W',function() {
          let startAWord = /\ba/

          expect(startAWord.test(' apple ')).true
          expect(startAWord.test(' salad moon ')).false
        })

        it('word boundary is position beginning or end is with word \\w ',function() {
          let hasLineOnlyOneWord = /^\b\w+\b$/m

          expect(hasLineOnlyOneWord.test('a demo\ndemosdffdsfsdfd')).true
          expect(hasLineOnlyOneWord.test(' a \n ds')).false
        })
      })

      describe('\\B',function() {
        it('not word boundary',function() {
          let wordInsideContainon = /\Boo\B/m

          expect(wordInsideContainon.test(' moon ')).true
          expect(wordInsideContainon.test(' ooa\n oo')).false
        })
      })
    })


    describe('lookaround boundary assertion',function() {
      describe('x(?=y) Lookahead assertion',function() {
        it('split number',function() {
          let num = 1e6+'';
          let res = num.replace(/(?=(\d{3})+$)/g, ',')
          expect(res).eq('1,000,000')
        })
      })

      describe('x(?!y) Negative lookahead assertion',function() {
        it('check end positon not match pattern',function() {
        })

      })

      describe('(?<=y)x Lookbehind assertion',function() {
        it('check before match pattern',function() {
          let matchWordStart = /(?<=\W)\b/;

          expect('hello world'.replace(matchWordStart,'-')).eq('hello -world')
        })

      })

      describe('(?<!y)x Negative lookbehind assertion',function() {
        it('check before not match pattern',function() {
          let matchWordStartNotH = /(?<!\W)\b/;

          expect('hello world'.replace(matchWordStartNotH,'-')).eq('-hello world')


        })
      })
    })
  })
});
