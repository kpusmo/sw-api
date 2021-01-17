import {registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';
import {getConnection} from 'typeorm';

@ValidatorConstraint()
export class NotExistsConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): Promise<boolean> | boolean {
        const tableName = args.constraints[0];
        const columnName = args.constraints[1] || args.property;
        return queryEntity(value, tableName, columnName).then(result => {
            return !result.length;
        });
    }

    defaultMessage(args: ValidationArguments): string {
        return `$property must not exist in ${args.constraints[0].split(',')[0]}`;
    }
}

export function NotExists(tableName: string, column?: string, validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            propertyName,
            name: 'notExists',
            target: object.constructor,
            constraints: [tableName, column],
            options: validationOptions,
            validator: NotExistsConstraint,
        });
    };
}

function queryEntity(value, table, column?) {
    return getConnection()
        .createQueryBuilder()
        .select(column)
        .from(table, '_entity_exists_alias')
        .where(`${column} = :value`, {value})
        .execute();
}
