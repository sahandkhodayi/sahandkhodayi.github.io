window.PROJECTS = [
  {
    id: "001",
    slug: "number-guesser",
    title: "Number Guesser",
    blurb:
      "Handwritten digit recognition. A CNN trained in PyTorch, exported to a flat weight file, and re-implemented as a forward pass in C. The point was never the digit — it was proving the two implementations agree.",
    tags: ["pytorch", "cnn", "c", "mnist", "inference"],
    status: "built",
    spec: [
      ["input", "28 × 28 grayscale image"],
      ["model", "convolutional neural network"],
      ["training", "PyTorch / Python"],
      ["export", "weights → flat binary blob"],
      ["inference", "C — forward pass written by hand"],
      ["interface", "C UI"],
      ["verification", "PyTorch ↔ C output parity"],
      ["source", "github.com/sahandkhodayi/Number-Guesser"]
    ],
    pipeline: [
      ["draw", "28×28 canvas, normalized"],
      ["preprocess", "tensor reshape, mean/std"],
      ["train", "PyTorch · conv / pool / fc"],
      ["export", "state_dict → .bin"],
      ["infer", "C · im2col-free direct conv"],
      ["verify", "same input → same logits"]
    ],
    questions: [
      "Does a C forward pass reproduce PyTorch logits to within float tolerance?",
      "Where does the numeric drift actually come from — accumulation order or float32 rounding?",
      "How small can the exported model be before accuracy visibly degrades?",
      "What does the convolution actually cost in memory bandwidth, not FLOPs?"
    ],
    related: ["001", "002", "006"]
  },
  {
    id: "002",
    slug: "nn-from-scratch",
    title: "NN from Scratch with Visuals",
    blurb:
      "A neural network framework built from scratch with forward propagation, backpropagation, gradient descent, and real-time visualization of neurons, weights, and training. No autograd, no PyTorch — just NumPy and the chain rule.",
    tags: ["python", "numpy", "backprop", "visualization", "from-scratch"],
    status: "built",
    spec: [
      ["language", "Python + NumPy"],
      ["custom components", "neurons · layers · weights · biases"],
      ["forward pass", "implemented manually"],
      ["backward pass", "chain rule, gradient calculation"],
      ["optimizer", "gradient descent"],
      ["interface", "interactive GUI playground"],
      ["visualization", "network structure · live neuron outputs · decision boundaries · loss curve"],
      ["source", "github.com/sahandkhodayi/NN-s-from-scratch-with-viuals"]
    ],
    pipeline: [
      ["build", "define network topology in GUI"],
      ["forward", "manual matrix ops through layers"],
      ["loss", "compare prediction to target"],
      ["backward", "apply chain rule layer by layer"],
      ["update", "gradient descent on weights/biases"],
      ["visualize", "live weights, neurons, decision boundary"]
    ],
    questions: [
      "What does backpropagation actually look like when you implement every derivative by hand?",
      "How does the decision boundary evolve during training, frame by frame?",
      "At what point does adding more layers stop helping on simple datasets?",
      "What breaks first when you increase learning rate — convergence or stability?"
    ],
    related: ["003", "004"]
  },
  {
    id: "003",
    slug: "ml-models-from-scratch",
    title: "Machine Learning Models",
    blurb:
      "Linear and logistic regression built from first principles using only NumPy. The focus is understanding the mathematics behind machine learning by implementing the algorithms from scratch rather than relying on high-level libraries.",
    tags: ["python", "numpy", "linear-regression", "logistic-regression", "from-scratch"],
    status: "built",
    spec: [
      ["language", "Python + NumPy"],
      ["linear regression", "multiple features · feature normalization · MSE · R²"],
      ["logistic regression", "binary classification · sigmoid · cross-entropy"],
      ["optimization", "gradient descent (implemented manually)"],
      ["evaluation", "training visualization · R² · accuracy"],
      ["source", "github.com/sahandkhodayi/Machine-learning-Models"]
    ],
    pipeline: [
      ["data", "load and normalize features"],
      ["hypothesis", "weighted sum of inputs"],
      ["cost", "MSE (linear) / cross-entropy (logistic)"],
      ["gradient", "compute partial derivatives"],
      ["update", "gradient descent step"],
      ["evaluate", "R² / accuracy + convergence graph"]
    ],
    questions: [
      "How does feature normalization change the convergence path of gradient descent?",
      "What is the mathematical reason sigmoid introduces non-linearity?",
      "How does the choice of learning rate affect the cost surface traversal?",
      "When does logistic regression fail where a non-linear model would succeed?"
    ],
    related: ["004", "006"]
  },
  {
    id: "004",
    slug: "math-network",
    title: "Math Network",
    blurb:
      "A PyTorch neural network for approximating mathematical functions. It takes a function, generates training data from it, and trains an MLP to learn the relationship between x and f(x) — with Fourier-feature input encoding for high-frequency functions.",
    tags: ["pytorch", "mlp", "fourier-features", "function-approximation", "mathematics"],
    status: "built",
    spec: [
      ["framework", "PyTorch"],
      ["model", "Multi-Layer Perceptron (MLP)"],
      ["input encoding", "Fourier features (sin/cos of kπx)"],
      ["hidden activation", "Tanh"],
      ["loss", "MSE / L1"],
      ["optimizer", "SGD (configurable)"],
      ["evaluation", "R² score · loss tracking · true vs predicted graph"],
      ["source", "github.com/sahandkhodayi/Math-function-approximation-with-NN"]
    ],
    pipeline: [
      ["function", "define f(x)"],
      ["generate", "sample (x, f(x)) pairs"],
      ["split", "train / test"],
      ["encode", "Fourier feature mapping"],
      ["train", "MLP with Tanh hidden layers"],
      ["evaluate", "MSE / R² + visual comparison"]
    ],
    questions: [
      "Why can a standard MLP struggle with rapidly oscillating functions?",
      "How much does Fourier feature encoding improve approximation of sin(kx) vs a plain input?",
      "How does the number of hidden layers affect the smoothness of the learned function?",
      "What is the trade-off between fitting the function exactly and generalizing between sample points?"
    ],
    related: ["002", "005"]
  }
];

window.EXPERIMENTS = [
  {
    id: "001",
    title: "PyTorch → C inference parity",
    status: "built",
    tag: "ok",
    body:
      "Feed identical inputs through the trained PyTorch model and the hand-written C forward pass, then diff the logits element by element. This is the experiment Number Guesser was built to run.",
    spec: [
      ["input", "held-out MNIST batch, 1000 samples"],
      ["metric", "max absolute logit difference"],
      ["finding", "divergence traced to accumulation order, not the weights"],
      ["state", "reproducible"]
    ]
  },
  {
    id: "002",
    title: "backpropagation from scratch",
    status: "built",
    tag: "ok",
    body:
      "Implement the chain rule manually for every layer in the NN from Scratch framework. No autograd — just derivative calculations and weight updates. Visualized live to see the effect of each update.",
    spec: [
      ["component", "NN-s-from-scratch-with-viuals"],
      ["method", "manual derivative per layer"],
      ["visualization", "live weights and neuron outputs"],
      ["state", "reproducible"]
    ]
  },
  {
    id: "003",
    title: "gradient descent convergence study",
    status: "built",
    tag: "ok",
    body:
      "Compare learning rates, momentum, and convergence behaviour on linear and logistic regression problems implemented from scratch. Plot the cost surface and every step taken toward the minimum.",
    spec: [
      ["component", "Machine-learning-Models"],
      ["variants", "SGD · momentum"],
      ["metric", "cost vs iteration, final R²"],
      ["state", "reproducible"]
    ]
  },
  {
    id: "004",
    title: "activation function comparison",
    status: "planned",
    tag: "p",
    body:
      "ReLU vs leaky ReLU vs sigmoid vs tanh on the same architecture and seed. Measuring convergence rate, not just final accuracy.",
    spec: [["state", "not started"]]
  },
  {
    id: "005",
    title: "Fourier feature encoding for function approximation",
    status: "built",
    tag: "ok",
    body:
      "Compare a plain MLP receiving only x against an MLP with Fourier features (sin/cos of kπx) when approximating high-frequency functions. The Fourier version learns oscillation patterns that the plain version cannot.",
    spec: [
      ["component", "Math-Network"],
      ["metric", "MSE, R²"],
      ["finding", "Fourier features dramatically improve high-frequency fit"],
      ["state", "reproducible"]
    ]
  },
  {
    id: "006",
    title: "MNIST preprocessing",
    status: "built",
    tag: "ok",
    body:
      "Everything between a drawn stroke and a tensor the model accepts: scaling, centering, normalization, and the mismatch between MNIST's preprocessing and a hand-drawn input.",
    spec: [
      ["finding", "GUI input distribution differs from MNIST more than expected"],
      ["state", "reproducible"]
    ]
  },
  {
    id: "007",
    title: "matrix multiplication experiments",
    status: "planned",
    tag: "p",
    body:
      "Naive triple loop → loop reordering → blocked/tiled. Same arithmetic, wildly different performance. The clearest demonstration of why cache matters.",
    spec: [["state", "not started"]]
  }
];

window.KNOWLEDGE = [
  {
    branch: "AI",
    count: 12,
    leaves: [
      { name: "neural networks", meta: "backprop · activations · optimization", st: "built" },
      { name: "convolutional networks", meta: "convolution · pooling · feature maps", st: "built" },
      { name: "training dynamics", meta: "loss surfaces · learning rate · overfitting", st: "study" },
      { name: "model export & inference", meta: "weights · precision · parity", st: "built" },
      { name: "from-scratch implementations", meta: "NumPy · no autograd · chain rule", st: "built" },
      { name: "function approximation", meta: "MLP · Fourier features · Tanh", st: "built" }
    ]
  },
  {
    branch: "mathematics",
    count: 8,
    leaves: [
      { name: "linear algebra", meta: "vectors · matrices · matrix multiplication", st: "study" },
      { name: "calculus", meta: "derivatives · chain rule · gradients", st: "study" },
      { name: "probability", meta: "distributions · bayes · expectation", st: "study" },
      { name: "optimization", meta: "gradient descent · convexity · constraints", st: "study" }
    ]
  },
  {
    branch: "systems",
    count: 10,
    leaves: [
      { name: "C", meta: "pointers · memory · compilation", st: "study" },
      { name: "computer architecture", meta: "cpu · cache · assembly", st: "study" },
      { name: "memory", meta: "stack · heap · layout · alignment", st: "study" },
      { name: "networking", meta: "tcp/ip · sockets", st: "study" },
      { name: "tooling", meta: "linux · wsl · git", st: "built" }
    ]
  }
];

window.CONNECTIONS = [
  ["convolution", "number-guesser", "lab[001]"],
  ["backpropagation", "nn-from-scratch", "lab[002]"],
  ["gradient descent", "ml-models-from-scratch", "lab[003]"],
  ["Fourier features", "math-network", "lab[005]"],
  ["matrix multiplication", "nn-from-scratch", "lab[007]"],
  ["pointers / memory", "number-guesser · C inference", "systems"],
  ["float precision", "number-guesser · parity", "lab[001]"]
];

window.SYSTEMS_TOPICS = [
  ["C", "pointers · manual memory · the cost of every allocation"],
  ["memory", "stack, heap, layout, alignment, lifetime"],
  ["cpu", "registers, instruction flow, pipelines"],
  ["cache", "locality, cache lines, why loop order matters"],
  ["processes", "address space, syscalls, context switches"],
  ["filesystems", "inodes, buffering, what a write actually does"],
  ["networking", "layers, sockets, bytes on a wire"],
  ["assembly", "what the compiler actually emitted"]
];

window.MEM = {
  base: 0x7ffd2a10,
  bytes: [0x2f, 0x00, 0x1a, 0x7f, 0x00, 0x00, 0x00, 0x00,
          0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x00, 0x00, 0x00]
};
