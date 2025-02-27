// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
};
import 'jest-preset-angular/setup-jest';
// Add this custom console.log implementation
console.log = function(...args) {
  // Serialize objects to clean strings
  const cleanArgs = args.map(arg =>
    typeof arg === 'object' ? JSON.stringify(arg) : arg
  );

  // Print just the content, no stack trace
  process.stdout.write(cleanArgs.join(' ') + '\n');
};
