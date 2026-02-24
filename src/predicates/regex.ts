import {Pred, ValidationResult} from '..';

export function regex(
    exp: RegExp,
    errorMessage: string,
): Pred<string> {

    return (value: unknown): ValidationResult<string> => {

        if (typeof value !== 'string') {

            return {
                isValid: false,
                errors: {root: errorMessage},
            };

        }

        if (!exp.test(value)) {

            return {
                isValid: false,
                errors: {root: errorMessage},
            };

        }

        return {
            isValid: true,
            value,
        };

    };

}
