import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isValidEmail } from './emailValidation.js';

describe('isValidEmail', () => {
  it('rejects incomplete email text', () => {
    assert.equal(isValidEmail('docente'), false);
    assert.equal(isValidEmail('docente@'), false);
    assert.equal(isValidEmail('docente@ciip'), false);
  });

  it('accepts a complete email address', () => {
    assert.equal(isValidEmail('docente@ciip.com'), true);
  });
});
