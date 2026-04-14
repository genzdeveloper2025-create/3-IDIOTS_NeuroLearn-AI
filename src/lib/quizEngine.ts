import { QuizQuestion } from '../types';

const subjectQuestions: Record<string, QuizQuestion[]> = {
  'Mathematics': [
    {
      id: 'm1',
      text: 'What is the derivative of x^2?',
      options: ['x', '2x', 'x^2', '2'],
      correctAnswerIndex: 1,
      explanation: 'Using the power rule, the derivative of x^n is n*x^(n-1). So, the derivative of x^2 is 2x.'
    },
    {
      id: 'm2',
      text: 'What is the value of Pi to two decimal places?',
      options: ['3.12', '3.14', '3.16', '3.18'],
      correctAnswerIndex: 1,
      explanation: 'Pi is approximately equal to 3.14159...'
    },
    {
      id: 'm3',
      text: 'Solve for x: 2x + 5 = 15',
      options: ['5', '10', '4', '6'],
      correctAnswerIndex: 0,
      explanation: 'Subtract 5 from both sides to get 2x = 10. Then divide by 2 to get x = 5.'
    },
    {
      id: 'm4',
      text: 'What is the integral of 2x dx?',
      options: ['x^2 + C', '2x^2 + C', 'x + C', '2 + C'],
      correctAnswerIndex: 0,
      explanation: 'The integral of x^n is (x^(n+1))/(n+1). So, the integral of 2x is 2*(x^2)/2 + C = x^2 + C.'
    }
  ],
  'Data Structures': [
    {
      id: 'ds1',
      text: 'Which data structure uses LIFO (Last In, First Out)?',
      options: ['Queue', 'Stack', 'Tree', 'Graph'],
      correctAnswerIndex: 1,
      explanation: 'A Stack follows the Last In, First Out (LIFO) principle.'
    },
    {
      id: 'ds2',
      text: 'What is the time complexity of searching in a balanced Binary Search Tree?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
      correctAnswerIndex: 2,
      explanation: 'In a balanced BST, each comparison halves the remaining search space, leading to O(log n) time complexity.'
    },
    {
      id: 'ds3',
      text: 'Which data structure is best for implementing a priority queue?',
      options: ['Array', 'Linked List', 'Heap', 'Stack'],
      correctAnswerIndex: 2,
      explanation: 'A Heap is the most efficient data structure for a priority queue, allowing O(log n) insertions and extractions.'
    },
    {
      id: 'ds4',
      text: 'What is a hash collision?',
      options: ['When two keys map to the same index', 'When a hash table is full', 'When a key is not found', 'When the hash function fails'],
      correctAnswerIndex: 0,
      explanation: 'A hash collision occurs when two different keys generate the same hash value and map to the same bucket.'
    }
  ],
  'Machine Learning': [
    {
      id: 'ml1',
      text: 'What is overfitting?',
      options: ['Model performs well on training data but poorly on unseen data', 'Model performs poorly on all data', 'Model is too simple', 'Model trains too fast'],
      correctAnswerIndex: 0,
      explanation: 'Overfitting happens when a model learns the training data too well, including its noise, failing to generalize to new data.'
    },
    {
      id: 'ml2',
      text: 'Which algorithm is used for classification?',
      options: ['Linear Regression', 'K-Means', 'Logistic Regression', 'PCA'],
      correctAnswerIndex: 2,
      explanation: 'Despite its name, Logistic Regression is a classification algorithm used to predict discrete outcomes.'
    },
    {
      id: 'ml3',
      text: 'What does PCA stand for?',
      options: ['Primary Component Analysis', 'Principal Component Analysis', 'Predictive Cost Analysis', 'Partial Component Algorithm'],
      correctAnswerIndex: 1,
      explanation: 'PCA stands for Principal Component Analysis, a dimensionality reduction technique.'
    },
    {
      id: 'ml4',
      text: 'In neural networks, what is the purpose of an activation function?',
      options: ['To initialize weights', 'To introduce non-linearity', 'To calculate loss', 'To update learning rate'],
      correctAnswerIndex: 1,
      explanation: 'Activation functions introduce non-linear properties to the network, allowing it to learn complex patterns.'
    }
  ],
  'Physics': [
    {
      id: 'p1',
      text: "What is Newton's Second Law of Motion?",
      options: ['E = mc^2', 'F = ma', 'v = d/t', 'P = IV'],
      correctAnswerIndex: 1,
      explanation: "Newton's Second Law states that Force equals mass times acceleration (F = ma)."
    },
    {
      id: 'p2',
      text: 'What is the speed of light in a vacuum?',
      options: ['3 x 10^8 m/s', '3 x 10^6 m/s', '3 x 10^10 m/s', '3 x 10^5 m/s'],
      correctAnswerIndex: 0,
      explanation: 'The speed of light in a vacuum is approximately 299,792,458 meters per second, often approximated as 3 x 10^8 m/s.'
    },
    {
      id: 'p3',
      text: 'What is the unit of electrical resistance?',
      options: ['Volt', 'Ampere', 'Ohm', 'Watt'],
      correctAnswerIndex: 2,
      explanation: 'The Ohm is the SI derived unit of electrical resistance.'
    },
    {
      id: 'p4',
      text: 'What type of energy is associated with motion?',
      options: ['Potential Energy', 'Thermal Energy', 'Kinetic Energy', 'Chemical Energy'],
      correctAnswerIndex: 2,
      explanation: 'Kinetic energy is the energy that an object possesses due to its motion.'
    }
  ]
};

const genericQuestions: QuizQuestion[] = [
  {
    id: 'g1',
    text: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswerIndex: 2,
    explanation: 'Paris is the capital and most populous city of France.'
  },
  {
    id: 'g2',
    text: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswerIndex: 1,
    explanation: 'Mars is often called the Red Planet due to the iron oxide prevalent on its surface.'
  },
  {
    id: 'g3',
    text: 'What is the largest ocean on Earth?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    correctAnswerIndex: 3,
    explanation: "The Pacific Ocean is the largest and deepest of Earth's oceanic divisions."
  },
  {
    id: 'g4',
    text: 'Who wrote "Romeo and Juliet"?',
    options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
    correctAnswerIndex: 1,
    explanation: 'William Shakespeare wrote the tragedy Romeo and Juliet early in his career.'
  }
];

export const generateQuiz = (subjectName?: string): QuizQuestion[] => {
  if (subjectName && subjectQuestions[subjectName]) {
    // Return a copy of the questions to avoid mutating the original array
    return [...subjectQuestions[subjectName]].sort(() => 0.5 - Math.random()).slice(0, 4);
  }
  
  // Fallback to generic questions or a random subject
  const subjects = Object.keys(subjectQuestions);
  const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
  return [...subjectQuestions[randomSubject]].sort(() => 0.5 - Math.random()).slice(0, 4);
};
