import {test} from 'kizu';
import {record} from './record';
import {string, number, object} from '.';
import type {Infer} from '..';

// Type-level test: Infer should produce Record<string, T>
const stringRecord = record(string());

type StringRecord = Infer<typeof stringRecord>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const typeTest: StringRecord = {foo: 'bar', baz: 'qux'};
// @ts-expect-error - number is not assignable to string
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const typeTestFail: StringRecord = {foo: 123};

test('record(): valid inputs', (assert) => {

    const stringMap = record(string());
    const numberMap = record(number());

    assert.equal(
        stringMap({a: 'hello', b: 'world'}),
        {isValid: true, value: {a: 'hello', b: 'world'}},
        'should return true for valid string record'
    );

    assert.equal(
        numberMap({x: 1, y: 2, z: 3}),
        {isValid: true, value: {x: 1, y: 2, z: 3}},
        'should return true for valid number record'
    );

    assert.equal(
        stringMap({}),
        {isValid: true, value: {}},
        'should return true for empty object'
    );

});

test('record(): invalid input types', (assert) => {

    const stringMap = record(string());

    assert.equal(
        stringMap(null),
        {isValid: false, errors: {root: 'must be an object'}},
        'should return false for null'
    );

    assert.equal(
        stringMap(undefined),
        {isValid: false, errors: {root: 'must be an object'}},
        'should return false for undefined'
    );

    assert.equal(
        stringMap([]),
        {isValid: false, errors: {root: 'must be an object'}},
        'should return false for arrays'
    );

    assert.equal(
        stringMap('string'),
        {isValid: false, errors: {root: 'must be an object'}},
        'should return false for strings'
    );

    assert.equal(
        stringMap(42),
        {isValid: false, errors: {root: 'must be an object'}},
        'should return false for numbers'
    );

});

test('record(): validation errors', (assert) => {

    const stringMap = record(string());
    const numberMap = record(number());

    assert.equal(
        stringMap({a: 'valid', b: 123}),
        {isValid: false, errors: {b: 'must be a string'}},
        'should return error for invalid value'
    );

    assert.equal(
        stringMap({a: 123, b: 456}),
        {isValid: false, errors: {a: 'must be a string', b: 'must be a string'}},
        'should return multiple errors for multiple invalid values'
    );

    assert.equal(
        numberMap({x: 'not a number'}),
        {isValid: false, errors: {x: 'must be a number'}},
        'should return error for non-number value'
    );

});

test('record(): nested object validation errors', (assert) => {

    const userRecord = record(object({
        name: string(),
        age: number(),
    }));

    assert.equal(
        userRecord({
            user1: {name: 'Alice', age: 30},
            user2: {name: 'Bob', age: 25},
        }),
        {isValid: true, value: {user1: {name: 'Alice', age: 30}, user2: {name: 'Bob', age: 25}}},
        'should return true for valid nested objects'
    );

    assert.equal(
        userRecord({
            user1: {name: 'Alice', age: 30},
            user2: {name: 123, age: 25},
        }),
        {isValid: false, errors: {'user2.name': 'must be a string'}},
        'should return nested error path for invalid nested value'
    );

    assert.equal(
        userRecord({
            user1: {name: 123, age: 'invalid'},
        }),
        {isValid: false, errors: {'user1.name': 'must be a string', 'user1.age': 'must be a number'}},
        'should return multiple nested errors'
    );

});

test('record(): edge cases', (assert) => {

    const stringMap = record(string());

    // Keys with special characters
    assert.equal(
        stringMap({'key.with.dots': 'value', 'key-with-dashes': 'value2'}),
        {isValid: true, value: {'key.with.dots': 'value', 'key-with-dashes': 'value2'}},
        'should handle keys with special characters'
    );

    // Numeric keys (from object)
    assert.equal(
        stringMap({0: 'zero', 1: 'one'}),
        {isValid: true, value: {0: 'zero', 1: 'one'}},
        'should handle numeric keys'
    );

});
