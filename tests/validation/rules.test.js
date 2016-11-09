import expect from 'expect';
import * as rules from 'validation/rules';

describe('(Validation) Rules', () => {
  describe('Empty', () => {
    it('error when value is empty', () => {
      expect(rules.notEmpty('a', '', 'err')).toEqual({ a: 'err' });
      expect(rules.notEmpty('a', undefined, 'err')).toEqual({ a: 'err' });
      expect(rules.notEmpty('a', null, 'err')).toEqual({ a: 'err' });
    });
    it('success when value is not empty', () => {
      expect(rules.notEmpty('a', ' ', 'err')).toEqual(null);
      expect(rules.notEmpty('a', 'val', 'err')).toEqual(null);
    });
  });
});
