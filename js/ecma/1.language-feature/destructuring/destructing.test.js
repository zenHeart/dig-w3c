const { expect } = require('chai');

describe('destructing 解构', function() {
    it('对象解构数组属性', function() {
        let url = 'quiz.typeofnan.dev';
        let { length: ln, [ln - 1]: domain = 'quiz' } = url
            .split('.')
            .filter(Boolean);

        expect(domain).eq('dev');
    });
});
