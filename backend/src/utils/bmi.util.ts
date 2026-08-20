export interface BMIResult {
  bmi: number;
  classification: 'Underweight' | 'Normal' | 'Overweight';
  recommendedAssessment: 'General Assessment' | 'Overweight Assessment';
}

export function calculateBMI(heightCm: number, weightKg: number): BMIResult {
  if (heightCm <= 0 || weightKg <= 0) {
    throw new Error('Height and weight must be greater than zero');
  }

  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(2));

  let classification: 'Underweight' | 'Normal' | 'Overweight';
  if (bmi < 18.5) {
    classification = 'Underweight';
  } else if (bmi < 25) {
    classification = 'Normal';
  } else {
    classification = 'Overweight';
  }

  const recommendedAssessment = bmi > 25 ? 'Overweight Assessment' : 'General Assessment';

  return {
    bmi,
    classification,
    recommendedAssessment,
  };
}
