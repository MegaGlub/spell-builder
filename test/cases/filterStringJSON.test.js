import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { filterStringForJSON } from './src/elementHelpers.js';

describe('JSON String Filter', () => {
    it('should escape backslashes', () => {
        const singleBackslash = filterStringForJSON("\\");
        const doubleBackslash = filterStringForJSON("\\\\");

        assert.equal(singleBackslash, "\\\\");
        assert.equal(doubleBackslash, "\\\\\\\\");
    });

    it('should replace newlines', () => {
        // Newlines are surrounded by x's to prevent them from being trimmed/
        const crlf = filterStringForJSON("x\r\nx");
        const lf = filterStringForJSON("x\nx");
        const complex = filterStringForJSON("x\r\n\n\r\nx");

        assert.equal(crlf, "x\\nx");
        assert.equal(lf, "x\\nx");
        assert.equal(complex, "x\\n\\n\\nx");
    });
});
