import {test} from 'kizu';
import {object} from './object';
import {number} from './number';
import {string} from './string';
import {optional} from './optional';

test('object(): valid inputs', (assert) => {

    const pred = object({
        name: string(),
        age: number(),
    });

    assert.equal(pred({
        name: 'John',
        age: 42,
    }), {isValid: true, value: {name: 'John', age: 42}}, 'should return true for valid simple objects');

    assert.equal(pred({
        name: 'Jane',
        age: 30,
    }).isValid, true, 'should return true for valid simple objects');

});

test('object(): nested valid inputs', (assert) => {

    const nestedPred = object({
        name: string(),
        age: number(),
        address: object({
            line1: string(),
            line2: optional(string()),
            city: string(),
            state: string({len: {min: 2, max: 2}}),
            zip: string({len: {min: 5, max: 5}}),
        }),
    });

    assert.equal(nestedPred({
        name: 'John',
        age: 42,
        address: {
            line1: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zip: '62701',
        },
    }).isValid, true, 'should return true for valid nested objects');

});

test('object(): validation errors', (assert) => {

    const pred = object({
        name: string(),
        age: number(),
    });

    assert.equal(pred({name: 42, age: 'John'}), {
        isValid: false,
        errors: {
            name: 'must be a string',
            age: 'must be a number',
        },
    }, 'should return false with multiple validation errors');

});

test('object(): invalid schema', (assert) => {

    assert.throws(
        // @ts-expect-error testing invalid schema
        () => object(Math.PI),
        new Error('invalid schema, must be object'),
    );

});

test('object(): invalid input types', (assert) => {

    const pred = object({
        name: string(),
        age: number(),
    });

    assert.equal(pred(Math.PI), {
        isValid: false,
        errors: {
            root: 'must be an object with keys name, age',
        },
    }, 'should return false for non-object inputs');

    assert.equal(pred(null), {
        isValid: false,
        errors: {
            root: 'must be an object with keys name, age',
        },
    }, 'should return false for null inputs');

    assert.equal(pred(undefined), {
        isValid: false,
        errors: {
            root: 'must be an object with keys name, age',
        },
    }, 'should return false for undefined inputs');

    assert.equal(pred('string'), {
        isValid: false,
        errors: {
            root: 'must be an object with keys name, age',
        },
    }, 'should return false for string inputs');

});

test('object(): nested validation errors', (assert) => {

    const nestedPred = object({
        name: string(),
        age: number(),
        address: object({
            line1: string(),
            line2: optional(string()),
            city: string(),
            state: string({len: {min: 2, max: 2}}),
            zip: string({len: {min: 5, max: 5}}),
        }),
    });

    assert.equal(nestedPred({
        name: 'John',
        age: 42,
        address: {
            line1: 5,
            state: 'IL',
            zip: '627041',
        },
    }), {
        isValid: false,
        errors: {
            'address.line1': 'must be a string',
            'address.city': 'must be a string',
            'address.zip': 'must be at most 5 characters',
        },
    }, 'should return false with nested validation errors using dot notation');

});

test('object(): unknown keys validation', (assert) => {

    const pred = object({
        name: string(),
        age: number(),
    });

    assert.equal(pred({
        name: 'John',
        age: 42,
        blub: 'gurgle',
    }), {
        isValid: false,
        errors: {
            blub: 'unknown key',
        },
    }, 'should return false when unknown keys are present');

});

test('object(): allowUnknownKeys option', (assert) => {

    const pred = object({
        name: string(),
        age: number(),
    }, {allowUnknownKeys: true});

    assert.equal(pred({
        name: 'John',
        age: 42,
        blub: 'gurgle',
    }).isValid, true, 'should return true when allowUnknownKeys is true');

});

test('object(): no schema - accepts any object', (assert) => {

    const pred = object();

    assert.equal(pred({foo: 'bar'}), {isValid: true, value: {foo: 'bar'}}, 'should return true for any object');
    assert.equal(pred({a: 1, b: 2, c: 'three'}), {isValid: true, value: {a: 1, b: 2, c: 'three'}}, 'should return true for objects with any keys');
    assert.equal(pred({}), {isValid: true, value: {}}, 'should return true for empty objects');

});

test('object(): no schema - rejects non-objects', (assert) => {

    const pred = object();

    assert.equal(pred(null), {isValid: false, errors: {root: 'must be an object'}}, 'should return false for null');
    assert.equal(pred(undefined), {isValid: false, errors: {root: 'must be an object'}}, 'should return false for undefined');
    assert.equal(pred('string'), {isValid: false, errors: {root: 'must be an object'}}, 'should return false for strings');
    assert.equal(pred(42), {isValid: false, errors: {root: 'must be an object'}}, 'should return false for numbers');
    assert.equal(pred(true), {isValid: false, errors: {root: 'must be an object'}}, 'should return false for booleans');
    assert.equal(pred([]), {isValid: false, errors: {root: 'must be an object'}}, 'should return false for arrays');

});

test('object(): no schema with options', (assert) => {

    const pred = object({allowUnknownKeys: true});

    assert.equal(pred({foo: 'bar'}), {isValid: true, value: {foo: 'bar'}}, 'should return true for any object even with options');

});
