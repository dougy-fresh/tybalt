import child_process from 'node:child_process';
import { tmpdir } from 'node:os';
import { mkdir, mkdtemp, rmdir } from 'node:fs/promises';
import { join, basename } from 'node:path';

import { afterAll, beforeAll, beforeEach, describe, it, expect } from '@jest/globals';

import packageJson from '../package.json';

const temporaryRoot = join(tmpdir(), 'tybalt-tests');

describe('cli', () => {
    beforeAll(async () => {
        await mkdir(temporaryRoot);
    });

    let fixtureName;
    beforeEach(async () => {
        const temporaryDirectoryTemplate = join(temporaryRoot, 'fixture-');
        const temporaryDirectory = await mkdtemp(temporaryDirectoryTemplate);

        fixtureName = basename(temporaryDirectory);
        process.chdir(temporaryDirectory);
    });

    afterAll(async () => {
        await rmdir(temporaryRoot, { recursive: true });
    });

    it('should emit the version', () => {
        const results = child_process.execSync(`yarn run cli --version`);

        expect(results.toString()).toContain(packageJson.version);
    });

    it('should not error when you forget a name when scaffolding', () => {
        let caughtError;
        try {
            child_process.execSync(`yarn run cli -- scaffold eleventy`);
        } catch (error) {
            // execSync throws an error when the command fails, but we expect the command to fail because
            // we're testing an error message, so we catch the error and continue
            caughtError = error;
        }

        expect(caughtError.message).not.toContain('ERR_INVALID_ARG_TYPE');
        expect(caughtError.message).toContain("error: required option '-n, --name <string>' not specified");
    });

    it.each(['eleventy', 'library', 'component', 'fastify'])(
        'should scaffold, lint, and tests a %s project',
        (type) => {
            expect(() => {
                child_process.execSync(`yarn run cli -- scaffold ${type} --name ${fixtureName}`);
                child_process.execSync(`yarn run cli -- lint`);
                child_process.execSync(`yarn run cli -- build`);
                child_process.execSync(`yarn run cli -- test`);
            }).not.toThrow();
        },
    );
});
