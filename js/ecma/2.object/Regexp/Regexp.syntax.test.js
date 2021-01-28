const { expect } = require('chai')

describe('Regexp Syntax', () => {
  describe('zero-length assertions', () => {
    describe('basic boundary type assertion', () => {
      describe('^', () => {
        it('test match start position', () => {
          const startWithA = /^a/

          expect(startWithA.test('a')).true
          expect(startWithA.test(' a')).false
        })

        it('test match start position multi line model', () => {
          const hasLineStartWithA = /^a/m

          expect(hasLineStartWithA.test(' \na')).true
          expect(hasLineStartWithA.test(' a \n ds')).false
        })
      })

      describe('$', () => {
        it('test match end position', () => {
          const endWithA = /^a/

          expect(endWithA.test('a')).true
          expect(endWithA.test(' a ')).false
        })

        it('test match end position multi line model', () => {
          const hasLineendWithA = /^a/m

          expect(hasLineendWithA.test(' \na')).true
          expect(hasLineendWithA.test(' a \n ds')).false
        })
      })

      describe('\\b', () => {
        it('word boundary is position between \\w and \\W', () => {
          const startAWord = /\ba/

          expect(startAWord.test(' apple ')).true
          expect(startAWord.test(' salad moon ')).false
        })

        it('word boundary is position beginning or end is with word \\w ', () => {
          const hasLineOnlyOneWord = /^\b\w+\b$/m

          expect(hasLineOnlyOneWord.test('a demo\ndemosdffdsfsdfd')).true
          expect(hasLineOnlyOneWord.test(' a \n ds')).false
        })
      })

      describe('\\B', () => {
        it('not word boundary', () => {
          const wordInsideContainon = /\Boo\B/m

          expect(wordInsideContainon.test(' moon ')).true
          expect(wordInsideContainon.test(' ooa\n oo')).false
        })
      })
    })


    describe('lookaround boundary assertion', () => {
      describe('x(?=y) Lookahead assertion', () => {
        it('split number', () => {
          const num = `${1e6}`
          const res = num.replace(/(?=(\d{3})+$)/g, ',')
          expect(res).eq('1,000,000')
        })
      })

      describe('x(?!y) Negative lookahead assertion', () => {
        it('check end positon not match pattern', () => {
        })
      })

      describe('(?<=y)x Lookbehind assertion', () => {
        it('check before match pattern', () => {
          const matchWordStart = /(?<=\W)\b/

          expect('hello world'.replace(matchWordStart, '-')).eq('hello -world')
        })
      })

      describe('(?<!y)x Negative lookbehind assertion', () => {
        it('check before not match pattern', () => {
          const matchWordStartNotH = /(?<!\W)\b/

          expect('hello world'.replace(matchWordStartNotH, '-')).eq('-hello world')
        })
      })
    })
  })

  describe('group and ranges', () => {
    describe('| or logic', () => {
      it('test or logic', () => {
        const matchFruits = /apple|pear/

        expect(matchFruits.test('demo')).false
        expect(matchFruits.test('apple')).true
        expect(matchFruits.test('pear')).true
      })
    })

    describe('() group', () => {
      it('test group', () => {
        const matchGroups = /(a)(b)(c)/
        const [, a, b, c] = matchGroups.exec('abcd')

        expect(a).eq('a')
        expect(b).eq('b')
        expect(c).eq('c')
      })

      it('group order left to right alse nest group ', () => {
        const matchGroups = /(a(b(c)))/
        const [, a, b, c] = matchGroups.exec('abcd')

        expect(a).eq('abc')
        expect(b).eq('bc')
        expect(c).eq('c')
      })
    })

    describe('\\n group back reference', () => {
      it('\\n match group n', () => {
        const duplicateGroup = /(a)(b)\1\2/


        expect(duplicateGroup.test('abab')).true
      })

      it('\\n match in nest group', () => {
        const duplicateGroup = /(a(b))\1\2/

        expect(duplicateGroup.test('ababb')).true
      })
    })
  })
})
