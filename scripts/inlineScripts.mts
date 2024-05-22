import * as path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import glob from 'fast-glob';
import { minify } from 'terser';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

const preamble = [
  '// This file is autogenerated. Do not edit it directly.',
  '// To update it, modify the corresponding source file and run `pnpm inline-scripts`.',
].join('\n');

/**
 * Finds files with the `.template.js` extension in the `mui-base` package, minifies them, and writes
 * the code to a new file with the `.min.ts` extension.
 * The minified code is then exported as a string literal.
 */
async function run() {
  const files = await glob('**/*.template.js', {
    absolute: true,
    cwd: path.resolve(currentDirectory, '../packages/mui-base/src'),
  });

  files.forEach(async (sourceFile) => {
    const sourceContent = await readFile(sourceFile, 'utf8');
    const { code: minifiedCode } = await minify(sourceContent, { ecma: 2020 });
    const escapedCode = minifiedCode!.replace(/'/g, "\\'");

    const output = [
      preamble,
      '',
      '// prettier-ignore',
      `export const script = '${escapedCode}';\n`,
    ].join('\n');
    const outputFilename = sourceFile.replace('.template.js', '.min.ts');
    await writeFile(outputFilename, output);
  });
}

await run();