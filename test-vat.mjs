import { validateVAT } from './server/vat-validation.ts';

const testCases = [
  'ATU12345678',
  'ATU1234567',  // Too short
  'atu12345678', // Lowercase
  'DE12345678',  // Wrong country
];

for (const uid of testCases) {
  const result = await validateVAT(uid);
  console.log(`${uid}: ${result.status} - ${result.message}`);
}
