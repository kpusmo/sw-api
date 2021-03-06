import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
    private readonly envConfig: { [key: string]: string };

    constructor(filePath: string) {
        this.envConfig = dotenv.parse(fs.readFileSync(filePath));
    }

    getString(key: string): string {
        return this.envConfig[key];
    }

    getNumber(key: string): number {
        return parseInt(this.envConfig[key], 10);
    }

    getBoolean(key: string): boolean {
        return this.envConfig[key] === 'true' || this.getNumber(key) === 1;
    }

    getArray(key: string, separator: string): string[] {
        return this.envConfig[key].split(separator);
    }
}
