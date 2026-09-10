window.SITE = {
  name: "sahand khodayi",
  handle: "sahand",
  identity: "ai / mathematics / c / systems",
  motto: "build it. break it. understand it.",
  github: "https://github.com/sahandkhodayi",
  email: "kingicebear8585@"
};

window.PROJECTS = [
  {
    id: "001", slug: "number-guesser", title: "Number Guesser",
    blurb: "Handwritten digit recognition with PyTorch, CNNs, a Python interface, and a C inference backend.",
    tags: ["pytorch", "cnn", "c", "mnist"], status: "active",
    media: "media/number-guesser/",
    spec: [["input", "28 × 28 grayscale image"], ["model", "convolutional neural network"], ["training", "PyTorch / Python"], ["inference", "C"], ["interface", "Python GUI"], ["source", "github.com/sahandkhodayi/Number-Guesser"]],
    pipeline: [["draw", "handwritten digit"], ["preprocess", "crop · resize · center"], ["train", "PyTorch CNN"], ["export", "trained weights"], ["infer", "C backend"]],
    questions: ["Can C reproduce the trained model?", "How much does preprocessing matter?", "What happens between the model and the machine?"], related: ["001", "006"]
  },
  {
    id: "002", slug: "nn-from-scratch", title: "NN from Scratch",
    blurb: "A neural network built with Python and NumPy, including forward pass, backpropagation, and gradient descent.",
    tags: ["python", "numpy", "backprop"], status: "built", media: "media/nn-from-scratch/",
    spec: [["language", "Python + NumPy"], ["model", "neurons · layers · weights · biases"], ["training", "backpropagation + gradient descent"], ["visuals", "training and network state"], ["source", "github.com/sahandkhodayi/NN-s-from-scratch-with-viuals"]],
    pipeline: [["build", "network topology"], ["forward", "calculate outputs"], ["loss", "measure error"], ["backward", "calculate gradients"], ["update", "change weights"]],
    questions: ["How does backprop work without autograd?", "How does the network change while training?"], related: ["002", "003"]
  },
  {
    id: "003", slug: "ml-models-from-scratch", title: "Machine Learning Models",
    blurb: "Linear and logistic regression implemented with NumPy, focused on the math behind learning.",
    tags: ["python", "numpy", "regression"], status: "built", media: "media/ml-models-from-scratch/",
    spec: [["language", "Python + NumPy"], ["models", "linear + logistic regression"], ["loss", "MSE + cross-entropy"], ["optimizer", "gradient descent"], ["source", "github.com/sahandkhodayi/Machine-learning-Models"]],
    pipeline: [["data", "load features"], ["model", "weighted inputs"], ["loss", "measure error"], ["gradient", "calculate update"], ["evaluate", "measure fit"]],
    questions: ["How does normalization affect learning?", "Why does logistic regression use sigmoid?"], related: ["003", "005"]
  },
  {
    id: "004", slug: "math-network", title: "Math Network",
    blurb: "A PyTorch network that learns mathematical functions using Fourier-feature inputs.",
    tags: ["pytorch", "mlp", "fourier"], status: "built", media: "media/math-network/",
    spec: [["framework", "PyTorch"], ["model", "MLP"], ["encoding", "Fourier features"], ["activation", "Tanh"], ["source", "github.com/sahandkhodayi/Math-function-approximation-with-NN"]],
    pipeline: [["function", "define f(x)"], ["sample", "generate data"], ["encode", "Fourier features"], ["train", "MLP"], ["inspect", "compare curves"]],
    questions: ["Why are high-frequency functions harder?", "What changes when the input representation changes?"], related: ["002", "004"]
  }
];

window.EXPERIMENTS = [
  { id: "001", title: "PyTorch → C parity", status: "built", tag: "ok", body: "Run the same input through both implementations and compare the result.", spec: [["metric", "maximum difference"], ["goal", "find mismatches"]] },
  { id: "002", title: "Backprop from scratch", status: "built", tag: "ok", body: "Implement the chain rule manually and watch the parameters update.", spec: [["method", "manual derivatives"]] },
  { id: "003", title: "Gradient descent study", status: "built", tag: "ok", body: "Compare learning rates and convergence.", spec: [["metric", "loss vs iteration"]] },
  { id: "004", title: "Activation comparison", status: "planned", tag: "p", body: "Compare common activation functions under the same setup.", spec: [["state", "not started"]] },
  { id: "005", title: "Fourier features", status: "built", tag: "ok", body: "Compare a plain MLP with Fourier-feature inputs.", spec: [["metric", "MSE · R²"]] },
  { id: "006", title: "MNIST preprocessing", status: "built", tag: "ok", body: "Test scaling, cropping, centering, resizing, and normalization.", spec: [["goal", "match MNIST input"]] },
  { id: "007", title: "Matrix multiplication", status: "planned", tag: "p", body: "Compare simple and cache-friendly implementations.", spec: [["state", "not started"]] }
];

window.KNOWLEDGE = [
  { branch: "AI", count: 12, leaves: [{ name: "neural networks", meta: "models · training", st: "built" }, { name: "CNNs", meta: "convolution · pooling", st: "built" }, { name: "training", meta: "loss · learning rate", st: "study" }, { name: "inference", meta: "weights · deployment", st: "built" }, { name: "from scratch", meta: "NumPy · gradients", st: "built" }] },
  { branch: "mathematics", count: 8, leaves: [{ name: "linear algebra", meta: "vectors · matrices", st: "study" }, { name: "calculus", meta: "derivatives · gradients", st: "study" }, { name: "probability", meta: "distributions · independence", st: "study" }, { name: "optimization", meta: "gradient descent", st: "study" }] },
  { branch: "C", count: 10, leaves: [{ name: "language basics", meta: "types · functions · structs", st: "study" }, { name: "pointers", meta: "addresses · dereferencing", st: "study" }, { name: "memory", meta: "stack · heap", st: "study" }, { name: "compilation", meta: "compiler · linker", st: "study" }, { name: "files", meta: "IO · binary data", st: "study" }] },
  { branch: "systems", count: 10, leaves: [{ name: "computer architecture", meta: "CPU · cache", st: "study" }, { name: "operating systems", meta: "processes · syscalls", st: "study" }, { name: "networking", meta: "TCP/IP · sockets", st: "study" }, { name: "Linux", meta: "shell · tooling", st: "built" }] }
];

window.CONNECTIONS = [["convolution", "number-guesser", "lab[001]"], ["backpropagation", "nn-from-scratch", "lab[002]"], ["gradient descent", "ml-models-from-scratch", "lab[003]"], ["Fourier features", "math-network", "lab[005]"], ["C", "number-guesser", "inference"], ["pointers", "C", "systems"]];
window.SYSTEMS_TOPICS = [["C", "language · pointers · structs · files"], ["memory", "stack · heap · lifetime"], ["cpu", "registers · instructions"], ["cache", "locality · cache lines"], ["processes", "programs · address spaces"], ["files", "buffers · binary data"], ["networking", "TCP/IP · sockets"], ["Linux", "shell · processes · tools"]];
window.MEM = { base: 0x7ffd2a10, bytes: [0x2f,0x00,0x1a,0x7f,0x00,0x00,0x00,0x00,0x48,0x65,0x6c,0x6c,0x6f,0x00,0x00,0x00] };
