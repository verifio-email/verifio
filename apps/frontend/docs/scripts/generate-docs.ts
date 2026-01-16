import { openapi } from '@fe/docs/lib/openapi';
import { generateFiles } from 'fumadocs-openapi';

void generateFiles({
  input: openapi,
  output: './content/docs/api-reference',
  includeDescription: true,
});
