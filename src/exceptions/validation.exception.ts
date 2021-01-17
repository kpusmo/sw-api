import {BadRequestException, ValidationError} from '@nestjs/common';

export class ValidationException extends BadRequestException {
    constructor(errors?: string | object | any) {
        super({
            errors,
            statusCode: 422,
            message: 'Validation Failed',
        });
    }

    getStatus(): number {
        return 422;
    }
}

export const validationExceptionFactory = (rawErrors: ValidationError[]) => new ValidationException(mapErrors(rawErrors));

const mapErrors = (rawErrors: ValidationError[]) => {
    const errors = {};
    rawErrors.forEach(rawError => {
        if (rawError.constraints) {
            errors[rawError.property] = (errors[rawError.property] || []).concat(Object.values(rawError.constraints));
        }
        if (rawError.children) {
            const childrenErrors = Object.values(mapErrors(rawError.children));
            errors[rawError.property] = (errors[rawError.property] || []).concat(childrenErrors).flat();
        }
    });
    return errors;
};
