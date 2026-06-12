// Q-CHAT-10 questions with Likert scale labels (0-4)
// Reverse-scored items: 1,2,3,4,5,6,7,9 → "Always/Usually" = LOW risk
// Items 8, 10 scored normally

export const QCHAT_QUESTIONS = [
  {
    id: 'q1',
    num: 1,
    text: 'Does your child look at you when you call his/her name?',
    options: ['Always', 'Usually', 'Sometimes', 'Rarely', 'Never'],
    hint: 'Observe how often the child turns to look when their name is called.',
    reverse: true,
  },
  {
    id: 'q2',
    num: 2,
    text: 'How easy is it for you to get eye contact with your child?',
    options: ['Very Easy', 'Quite Easy', 'Quite Difficult', 'Very Difficult', 'Impossible'],
    hint: 'Consider spontaneous eye contact during play and conversation.',
    reverse: true,
  },
  {
    id: 'q3',
    num: 3,
    text: 'When your child is playing alone, does he/she line objects up?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often / Always'],
    hint: 'E.g., cars, blocks, crayons placed in a row repeatedly.',
    reverse: false,
  },
  {
    id: 'q4',
    num: 4,
    text: 'Can other people easily understand your child\'s speech?',
    options: ['Always', 'Usually', 'Sometimes', 'Rarely', 'Never / Not yet speaking'],
    hint: 'Consider strangers as well as family members.',
    reverse: true,
  },
  {
    id: 'q5',
    num: 5,
    text: 'Does your child point to indicate that he/she wants something?',
    options: ['Many times a day', 'A few times a day', 'A few times a week', 'Less than once a week', 'Never'],
    hint: 'E.g., pointing at food, toys, or something out of reach.',
    reverse: true,
  },
  {
    id: 'q6',
    num: 6,
    text: 'Does your child point to share interest with you (not to get something)?',
    options: ['Many times a day', 'A few times a day', 'A few times a week', 'Less than once a week', 'Never'],
    hint: 'E.g., pointing at a bird, plane, or interesting object to show you.',
    reverse: true,
  },
  {
    id: 'q7',
    num: 7,
    text: 'How many words does your child use? (Exclude babbling)',
    options: ['Over 100', '50–100', '10–50', 'Less than 10', 'None'],
    hint: 'Count only clear, intentional words (not sounds or imitations).',
    reverse: true,
  },
  {
    id: 'q8',
    num: 8,
    text: 'Does your child repetitively copy actions/words?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often / Always'],
    hint: 'E.g., echoing phrases from TV, repeating the same action over and over.',
    reverse: false,
  },
  {
    id: 'q9',
    num: 9,
    text: 'Does your child use simple gestures? (e.g., wave goodbye)',
    options: ['Many times a day', 'A few times a day', 'A few times a week', 'Less than once a week', 'Never'],
    hint: 'Consider waving, clapping, or reaching arms up to be held.',
    reverse: true,
  },
  {
    id: 'q10',
    num: 10,
    text: 'Does your child stare at nothing with no apparent purpose?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often / Always'],
    hint: 'Gazing at blank walls or lights for extended periods.',
    reverse: false,
  },
];

export const RISK_THRESHOLDS = {
  HIGH:     0.65,
  MODERATE: 0.40,
};

export const getRiskLabel = (score) => {
  if (score >= RISK_THRESHOLDS.HIGH)     return 'High';
  if (score >= RISK_THRESHOLDS.MODERATE) return 'Moderate';
  return 'Low';
};

export const getRiskConfig = (label) => ({
  High:     { color: 'text-red-700',   bg: 'bg-red-50',    border: 'border-red-200',   badge: 'badge-high',     dot: 'bg-red-500',    label: 'High Risk' },
  Moderate: { color: 'text-amber-700', bg: 'bg-amber-50',  border: 'border-amber-200', badge: 'badge-moderate', dot: 'bg-amber-500',  label: 'Moderate Risk' },
  Low:      { color: 'text-green-700', bg: 'bg-green-50',  border: 'border-green-200', badge: 'badge-low',      dot: 'bg-green-500',  label: 'Low Risk' },
}[label] || {});
