
/* 
CWE-94: Improper Control of Generation of Code ('Code Injection')

console.log(isCodeInjection("console.log('hi')")); // true
console.log(isCodeInjection("eval('2+2')"));       // true
console.log(isCodeInjection("HelloWorld123"));     // false
console.log(isCodeInjection("<script>alert(1)</script>")); // true
console.log(isCodeInjection("normalUsername_123")); // false
*/
export function isCodeInjection(input) {
    if (typeof input !== 'string') return false;
  
    // Patterns that look suspicious
    const dangerousPatterns = [
      /[\{\}\[\]\(\);]/,          // Braces, brackets, parentheses, semicolons
      /\b(eval|function|new Function|setTimeout|setInterval|exec|require)\b/i, // Dangerous keywords
      /[`$]/,                    // Template literals / interpolation signs
      /<script\b/i,               // Script tags (for XSS)
      /\bimport\b/i,              // Trying to import modules
      /\bwhile\s*\(/i,            // Trying to create loops
      /\bfor\s*\(/i,              // Trying to create loops
      /\bif\s*\(/i,               // Trying to create conditionals
    ];
  
    // Check if any pattern matches
    for (const pattern of dangerousPatterns) {
      if (pattern.test(input)) {
        return true; // suspicious input detected
      }
    }
    
    return false; // input looks clean
  }
  