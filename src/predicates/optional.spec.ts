import {test} from 'kizu';
import {optional} from './optional';
import {string} from './string';
import {object} from './object';
import {Infer} from '..';

test('optional(): valid inputs', (assert) => {

    const pred = optional(string());

    assert.equal(pred('hi'), {isValid: true, value: 'hi'}, 'should return true for valid string');
    assert.equal(pred(undefined), {isValid: true, value: undefined}, 'should return true for undefined');
    assert.equal(pred('hello').isValid, true, 'should return true for valid strings');
    assert.equal(pred('world').isValid, true, 'should return true for valid strings');

});

test('optional(): validation errors', (assert) => {

    const pred = optional(string());

    assert.equal(pred(42), {isValid: false, errors: {root: 'must be a string'}}, 'should return false for numbers');
    assert.equal(pred(true), {isValid: false, errors: {root: 'must be a string'}}, 'should return false for booleans');
    assert.equal(pred(null), {isValid: false, errors: {root: 'must be a string'}}, 'should return false for null');
    assert.equal(pred({}), {isValid: false, errors: {root: 'must be a string'}}, 'should return false for objects');
    assert.equal(pred([]), {isValid: false, errors: {root: 'must be a string'}}, 'should return false for arrays');

});

test('optional(): type inference', (assert) => {

    // let's test the type inference
    const validator = object({
        name: string(),
        age: optional(string()), // age is optional
    });

    type T = Infer<typeof validator>;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function doStuff(_input: T): void { /* type test */ }

    doStuff({name: 'John', age: '30'}); // valid
    doStuff({name: 'John'}); // valid

    assert.equal(validator({name: 'John', age: '30'}).isValid, true, 'should work with object validation');
    assert.equal(validator({name: 'John'}).isValid, true, 'should work with object validation when optional field is missing');

});
