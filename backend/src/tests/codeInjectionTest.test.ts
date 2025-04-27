import { isCodeInjection } from '../services/codeInjection';

console.log("CODE INJECTION TEST");

describe('isCodeInjection', () => {
  it('should detect obvious code injection', () => {
    const inputs = [
      "eval('2+2')",
      "<script>alert('hacked')</script>",
      "function() { return 1; }"
    ];
    
    inputs.forEach(input => {
      const result = isCodeInjection(input);
      console.log(`Input: "${input}" => Result: ${result}`);
      expect(result).toBe(true);
    });
  });

  it('should NOT detect normal input as code injection', () => {
    const inputs = [
      "normalUser123",
      "HelloWorld",
      "safe_email@example.com"
    ];

    inputs.forEach(input => {
      const result = isCodeInjection(input);
      console.log(`Input: "${input}" => Result: ${result}`);
      expect(result).toBe(false);
    });
  });

  it('should detect suspicious special characters', () => {
    const inputs = [
      "{ dangerous }",
      "[1,2,3]"
    ];

    inputs.forEach(input => {
      const result = isCodeInjection(input);
      console.log(`Input: "${input}" => Result: ${result}`);
      expect(result).toBe(true);
    });
  });
});
