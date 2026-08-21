import { calculateBMI } from '../utils/bmi.util.js';

function assertEqual<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) {
    throw new Error(`FAIL: ${message}. Expected: ${expected}, Got: ${actual}`);
  }
  console.log(`PASS: ${message}`);
}

function runTests() {
  console.log('--- RUNNING BMI UTILITY UNIT TESTS ---');

  // Underweight calculation
  const result1 = calculateBMI(180, 50); // Height: 1.8m, Weight: 50kg, BMI: 15.43
  assertEqual(result1.bmi, 15.43, 'Should calculate correct BMI for underweight');
  assertEqual(result1.classification, 'Underweight', 'Classification should be Underweight');
  assertEqual(result1.recommendedAssessment, 'General Assessment', 'Should recommend General Assessment');

  // Normal weight calculation
  const result2 = calculateBMI(170, 65); // Height: 1.7m, Weight: 65kg, BMI: 22.49
  assertEqual(result2.bmi, 22.49, 'Should calculate correct BMI for normal weight');
  assertEqual(result2.classification, 'Normal', 'Classification should be Normal');
  assertEqual(result2.recommendedAssessment, 'General Assessment', 'Should recommend General Assessment');

  //  Overweight calculation
  const result3 = calculateBMI(160, 64); // Height: 1.6m, Weight: 64kg, BMI: 25.00
  assertEqual(result3.bmi, 25.00, 'Should calculate correct BMI for boundary normal/overweight');
  assertEqual(result3.classification, 'Overweight', 'Classification should be Overweight (>= 25)');
  assertEqual(result3.recommendedAssessment, 'General Assessment', 'Should recommend General Assessment (BMI <= 25)');

  // Overweight calculation (> 25)
  const result4 = calculateBMI(160, 70); // Height: 1.6m, Weight: 70kg, BMI: 27.34
  assertEqual(result4.bmi, 27.34, 'Should calculate correct BMI for overweight');
  assertEqual(result4.classification, 'Overweight', 'Classification should be Overweight');
  assertEqual(result4.recommendedAssessment, 'Overweight Assessment', 'Should recommend Overweight Assessment (BMI > 25)');

  console.log('--- ALL TESTS PASSED SUCCESSFULLY ---');
}

try {
  runTests();
  process.exit(0);
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
