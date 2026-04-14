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
    },
    {
      id: 'm5',
      text: 'What is the square root of 144?',
      options: ['10', '12', '14', '16'],
      correctAnswerIndex: 1,
      explanation: '12 multiplied by 12 equals 144.'
    },
    {
      id: 'm6',
      text: 'What is the formula for the area of a circle?',
      options: ['2 * Pi * r', 'Pi * r^2', 'Pi * d', '2 * Pi * r^2'],
      correctAnswerIndex: 1,
      explanation: 'The area of a circle is Pi times the radius squared (Pi * r^2).'
    },
    {
      id: 'm7',
      text: 'What is the value of sin(90 degrees)?',
      options: ['0', '0.5', '1', '-1'],
      correctAnswerIndex: 2,
      explanation: 'In trigonometry, the sine of a 90-degree angle is exactly 1.'
    },
    {
      id: 'm8',
      text: 'If a triangle has sides 3, 4, and 5, what type of triangle is it?',
      options: ['Equilateral', 'Isosceles', 'Right-angled', 'Obtuse'],
      correctAnswerIndex: 2,
      explanation: 'It satisfies the Pythagorean theorem (3^2 + 4^2 = 5^2), making it a right-angled triangle.'
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
    },
    {
      id: 'ds5',
      text: 'Which data structure uses FIFO (First In, First Out)?',
      options: ['Stack', 'Queue', 'Tree', 'Array'],
      correctAnswerIndex: 1,
      explanation: 'A Queue follows the First In, First Out (FIFO) principle, like a line of people.'
    },
    {
      id: 'ds6',
      text: 'What is the worst-case time complexity of QuickSort?',
      options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(1)'],
      correctAnswerIndex: 2,
      explanation: 'The worst-case time complexity of QuickSort is O(n^2), which occurs when the pivot is consistently the smallest or largest element.'
    },
    {
      id: 'ds7',
      text: 'In a graph, what is a cycle?',
      options: ['A path that starts and ends at the same vertex', 'A disconnected node', 'A directed edge', 'A tree structure'],
      correctAnswerIndex: 0,
      explanation: 'A cycle in a graph is a path of edges and vertices wherein a vertex is reachable from itself.'
    },
    {
      id: 'ds8',
      text: 'Which traversal method is used to get elements of a BST in sorted order?',
      options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
      correctAnswerIndex: 1,
      explanation: 'An in-order traversal of a Binary Search Tree visits the left subtree, the root, and then the right subtree, resulting in sorted order.'
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
    },
    {
      id: 'ml5',
      text: 'What is a common metric for evaluating a regression model?',
      options: ['Accuracy', 'F1-Score', 'Mean Squared Error (MSE)', 'Precision'],
      correctAnswerIndex: 2,
      explanation: 'Mean Squared Error (MSE) measures the average squared difference between the estimated values and the actual value.'
    },
    {
      id: 'ml6',
      text: 'Which of the following is an unsupervised learning technique?',
      options: ['Decision Trees', 'Support Vector Machines', 'K-Means Clustering', 'Random Forest'],
      correctAnswerIndex: 2,
      explanation: 'K-Means Clustering is an unsupervised learning algorithm used to group unlabeled data.'
    },
    {
      id: 'ml7',
      text: 'What is the vanishing gradient problem?',
      options: ['When gradients become too large', 'When gradients become extremely small, preventing weights from updating', 'When the learning rate is too high', 'When the model trains too quickly'],
      correctAnswerIndex: 1,
      explanation: 'The vanishing gradient problem occurs when gradients become so small that the neural network weights barely update during training.'
    },
    {
      id: 'ml8',
      text: 'What is the purpose of dropout in neural networks?',
      options: ['To increase training speed', 'To prevent overfitting', 'To add more layers', 'To increase the learning rate'],
      correctAnswerIndex: 1,
      explanation: 'Dropout is a regularization technique that randomly ignores some neurons during training to prevent overfitting.'
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
    },
    {
      id: 'p5',
      text: 'What is the fundamental force responsible for radioactive decay?',
      options: ['Gravity', 'Electromagnetism', 'Strong Nuclear Force', 'Weak Nuclear Force'],
      correctAnswerIndex: 3,
      explanation: 'The weak nuclear force is responsible for the radioactive decay of subatomic particles.'
    },
    {
      id: 'p6',
      text: 'What is the SI unit of force?',
      options: ['Joule', 'Newton', 'Pascal', 'Watt'],
      correctAnswerIndex: 1,
      explanation: 'The Newton (N) is the SI unit of force.'
    },
    {
      id: 'p7',
      text: 'Which particle has a negative electrical charge?',
      options: ['Proton', 'Neutron', 'Electron', 'Photon'],
      correctAnswerIndex: 2,
      explanation: 'The electron is a subatomic particle with a negative elementary electric charge.'
    },
    {
      id: 'p8',
      text: 'What does the First Law of Thermodynamics state?',
      options: ['Entropy always increases', 'Energy cannot be created or destroyed', 'Force equals mass times acceleration', 'For every action there is an equal and opposite reaction'],
      correctAnswerIndex: 1,
      explanation: 'The First Law of Thermodynamics is the law of conservation of energy, stating that energy cannot be created or destroyed, only transformed.'
    }
  ],
  'Quantum Computing': [
    {
      id: 'qc1',
      text: 'What is the basic unit of quantum information?',
      options: ['Bit', 'Byte', 'Qubit', 'Quantum'],
      correctAnswerIndex: 2,
      explanation: 'A qubit (quantum bit) is the basic unit of quantum information, analogous to a classical bit.'
    },
    {
      id: 'qc2',
      text: 'Which quantum phenomenon allows a qubit to be in multiple states simultaneously?',
      options: ['Entanglement', 'Superposition', 'Interference', 'Teleportation'],
      correctAnswerIndex: 1,
      explanation: 'Superposition is the ability of a quantum system to be in multiple states at the same time until it is measured.'
    },
    {
      id: 'qc3',
      text: 'What is quantum entanglement?',
      options: ['When qubits are perfectly isolated', 'When qubits are destroyed', 'When the state of one qubit instantly affects another, regardless of distance', 'When a qubit splits into two'],
      correctAnswerIndex: 2,
      explanation: 'Entanglement is a phenomenon where quantum particles become connected such that the state of one instantly influences the state of the other.'
    },
    {
      id: 'qc4',
      text: 'Which algorithm demonstrates a quantum advantage for factoring large numbers?',
      options: ["Grover's Algorithm", "Shor's Algorithm", "Deutsch-Jozsa Algorithm", 'RSA Algorithm'],
      correctAnswerIndex: 1,
      explanation: "Shor's algorithm is a quantum algorithm for integer factorization that runs exponentially faster than the best-known classical algorithm."
    },
    {
      id: 'qc5',
      text: 'What does quantum decoherence refer to?',
      options: ['The process of creating qubits', 'The loss of quantum properties due to environmental interaction', 'The entanglement of multiple qubits', 'The measurement of a quantum state'],
      correctAnswerIndex: 1,
      explanation: 'Decoherence is the loss of quantum coherence, causing a system to lose its quantum behavior and act classically.'
    }
  ],
  'Advanced Algorithms': [
    {
      id: 'aa1',
      text: 'Which algorithmic paradigm does Dijkstra\'s algorithm use?',
      options: ['Divide and Conquer', 'Dynamic Programming', 'Greedy', 'Backtracking'],
      correctAnswerIndex: 2,
      explanation: 'Dijkstra\'s algorithm uses a greedy approach to find the shortest path from a single source vertex to all other vertices.'
    },
    {
      id: 'aa2',
      text: 'What is the main advantage of Dynamic Programming over plain Recursion?',
      options: ['It uses less memory', 'It avoids recalculating overlapping subproblems', 'It is easier to write', 'It always finds the optimal solution faster'],
      correctAnswerIndex: 1,
      explanation: 'Dynamic Programming stores the results of overlapping subproblems (memoization or tabulation) to avoid redundant calculations.'
    },
    {
      id: 'aa3',
      text: 'Which algorithm is used to find the Minimum Spanning Tree of a graph?',
      options: ['Bellman-Ford', 'Kruskal\'s Algorithm', 'Floyd-Warshall', 'Depth First Search'],
      correctAnswerIndex: 1,
      explanation: 'Kruskal\'s algorithm is a greedy algorithm that finds a minimum spanning forest of an undirected edge-weighted graph.'
    },
    {
      id: 'aa4',
      text: 'What is the time complexity of the Floyd-Warshall algorithm?',
      options: ['O(V^2)', 'O(E log V)', 'O(V^3)', 'O(V + E)'],
      correctAnswerIndex: 2,
      explanation: 'The Floyd-Warshall algorithm uses three nested loops over the vertices, resulting in an O(V^3) time complexity.'
    },
    {
      id: 'aa5',
      text: 'What problem does the Knapsack problem belong to?',
      options: ['P', 'NP-Complete', 'NP-Hard', 'BPP'],
      correctAnswerIndex: 1,
      explanation: 'The 0/1 Knapsack problem is a classic example of an NP-Complete problem.'
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
  },
  {
    id: 'g5',
    text: 'What is the chemical symbol for Gold?',
    options: ['Ag', 'Au', 'Fe', 'Cu'],
    correctAnswerIndex: 1,
    explanation: 'Au is the chemical symbol for Gold, derived from the Latin word "aurum".'
  },
  {
    id: 'g6',
    text: 'How many continents are there on Earth?',
    options: ['5', '6', '7', '8'],
    correctAnswerIndex: 2,
    explanation: 'There are 7 continents: Africa, Antarctica, Asia, Europe, North America, Australia (Oceania), and South America.'
  }
];

export const generateQuiz = (subjectName?: string): QuizQuestion[] => {
  let pool: QuizQuestion[] = [];
  
  if (subjectName && subjectQuestions[subjectName]) {
    pool = [...subjectQuestions[subjectName]];
  } else if (subjectName) {
    // If we have a subject name but no specific questions, generate mock questions for it
    pool = [
      {
        id: `mock1_${Date.now()}`,
        text: `What is a core concept of ${subjectName}?`,
        options: ['Fundamentals', 'Advanced Theory', 'Practical Application', 'All of the above'],
        correctAnswerIndex: 3,
        explanation: `${subjectName} encompasses fundamentals, theory, and practical applications.`
      },
      {
        id: `mock2_${Date.now()}`,
        text: `Why is studying ${subjectName} important?`,
        options: ['It is not important', 'It builds critical thinking', 'It is required', 'It is easy'],
        correctAnswerIndex: 1,
        explanation: `Studying ${subjectName} helps develop critical thinking and problem-solving skills.`
      },
      {
        id: `mock3_${Date.now()}`,
        text: `Which of these is a common tool used in ${subjectName}?`,
        options: ['Hammer', 'Analysis', 'Microscope', 'Telescope'],
        correctAnswerIndex: 1,
        explanation: `Analysis is a fundamental tool used across almost all academic disciplines, including ${subjectName}.`
      },
      {
        id: `mock4_${Date.now()}`,
        text: `How does ${subjectName} relate to other fields?`,
        options: ['It is isolated', 'It is interdisciplinary', 'It only relates to math', 'It only relates to science'],
        correctAnswerIndex: 1,
        explanation: `Most modern fields of study, including ${subjectName}, are highly interdisciplinary.`
      }
    ];
  } else {
    // Fallback to generic questions
    pool = [...genericQuestions];
  }
  
  // Shuffle the pool and return up to 4 questions
  return pool.sort(() => 0.5 - Math.random()).slice(0, 4);
};
