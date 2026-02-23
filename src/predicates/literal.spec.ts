import {test} from 'kizu';
import {literal} from './literal';
import type {Infer} from '..';

// Type-level test: Infer should preserve literal types
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const textValidator = literal('text');

type TextType = Infer<typeof textValidator>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const typeTest: TextType = 'text';
// @ts-expect-error - 'other' is not assignable to 'text'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const typeTestFail: TextType = 'other';

test('literal(): valid inputs', (assert) => {

    assert.equal(literal(null)(null), {isValid: true, value: null}, 'should return true for matching null values');
    assert.equal(literal(42)(42), {isValid: true, value: 42}, 'should return true for matching number values');
    assert.equal(literal('whatever')('whatever'), {isValid: true, value: 'whatever'}, 'should return true for matching string values');
    assert.equal(literal(true)(true).isValid, true, 'should return true for matching boolean true values');
    assert.equal(literal(false)(false).isValid, true, 'should return true for matching boolean false values');

});

test('literal(): validation errors', (assert) => {

    assert.equal(literal(null)(42), {isValid: false, errors: {root: 'must be null'}}, 'should return false for non-matching null literal');
    assert.equal(literal(69)('string'), {isValid: false, errors: {root: 'must be 69'}}, 'should return false for non-matching number literal');
    assert.equal(literal(true)(false), {isValid: false, errors: {root: 'must be true'}}, 'should return false for non-matching boolean true literal');
    assert.equal(literal(false)(true), {isValid: false, errors: {root: 'must be false'}}, 'should return false for non-matching boolean false literal');
    assert.equal(literal('whatever')(42), {isValid: false, errors: {root: 'must be whatever'}}, 'should return false for non-matching string literal');

});

test('literal(): edge cases', (assert) => {

    assert.equal(literal(0)(0).isValid, true, 'should return true for zero values');
    assert.equal(literal(0)(1), {isValid: false, errors: {root: 'must be 0'}}, 'should return false for non-zero when expecting zero');
    assert.equal(literal('')('').isValid, true, 'should return true for empty string values');
    assert.equal(literal('')(' '), {isValid: false, errors: {root: 'must be '}}, 'should return false for non-empty when expecting empty string');
    assert.equal(literal(undefined)(undefined).isValid, true, 'should return true for undefined values');
    assert.equal(literal(undefined)(null), {isValid: false, errors: {root: 'must be undefined'}}, 'should return false for null when expecting undefined');

});
