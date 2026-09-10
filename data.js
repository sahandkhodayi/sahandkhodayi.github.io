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
      ["interface", "Python GUI"],
      ["verification", "PyTorch ↔ C output parity"],
      ["source", "github.com/you/number-guesser"]
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
    title: "convolution from scratch",
    status: "ongoing",
    tag: "q",
    body:
      "Implement 2D convolution with no library calls — direct nested loops first, then im2col, then compare. The goal is to feel where the time actually goes before reaching for an optimized kernel.",
    spec: [
      ["variants", "direct · im2col · strided"],
      ["measure", "wall time, cache behaviour"],
      ["state", "in progress"]
    ]
  },
  {
    id: "003",
    title: "gradient descent experiments",
    status: "ongoing",
    tag: "q",
    body:
      "Learning-rate sweeps, momentum, and convergence behaviour on small problems where every step can be plotted and understood by hand.",
    spec: [
      ["variants", "SGD · momentum · Adam"],
      ["state", "in progress"]
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
    title: "CNN architecture experiments",
    status: "planned",
    tag: "p",
    body:
      "Depth, kernel size, and channel width as independent variables. How much of the accuracy comes from the architecture versus the training regime?",
    spec: [["state", "not started"]]
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
    count: 9,
    leaves: [
      { name: "neural networks", meta: "backprop · activations · optimization", st: "study" },
      { name: "convolutional networks", meta: "convolution · pooling · feature maps", st: "built" },
      { name: "training dynamics", meta: "loss surfaces · learning rate · overfitting", st: "study" },
      { name: "model export & inference", meta: "weights · precision · parity", st: "built" }
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
  ["convolution", "number-guesser", "lab[002]"],
  ["backpropagation", "number-guesser", "lab[003]"],
  ["matrix multiplication", "number-guesser", "lab[007]"],
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