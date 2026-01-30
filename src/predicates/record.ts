import {Pred, ValidationResult} from '..';

/**
 * Returns a predicate that validates an object where all values match the given predicate.
 * Useful for validating Record<string, T> types like maps or dictionaries.
 *
 * @example
 * const nodeMap = record(nodeValidator);
 * nodeMap({ node1: {...}, node2: {...} }); // validates each value
 */
export function record<T>(valuePredicate: Pred<T>): Pred<Record<string, T>> {

    return (input: unknown): ValidationResult<Record<string, T>> => {

        if (typeof input !== 'object' || input === null || Array.isArray(input)) {

            return {
                isValid: false,
                errors: {root: 'must be an object'},
            };

        }

        const errors: Record<string, string> = {};

        for (const [key, value] of Object.entries(input)) {

            const result = valuePredicate(value);

            if (!result.isValid) {

                // Flatten nested errors with key prefix
                for (const [errorKey, errorMsg] of Object.entries(result.errors)) {

                    const fullKey = errorKey === 'root' ? key : `${key}.${errorKey}`;

                    errors[fullKey] = errorMsg;

                }

            }

        }

        if (Object.keys(errors).length > 0) {

            return {isValid: false, errors};

        }

        return {isValid: true, value: input as Record<string, T>};

    };

}
