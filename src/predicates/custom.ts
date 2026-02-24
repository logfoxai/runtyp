import {Pred, ValidationResult} from '..';

export function custom<T>(
    predicate: (value: T) => boolean,
    errorMessage: string,
): Pred<T> {

    return (value: unknown): ValidationResult<T> => {

        if (!predicate(value as T)) {

            return {
                isValid: false,
                errors: {root: errorMessage},
            };

        }

        return {
            isValid: true,
            value: value as T,
        };

    };

}
