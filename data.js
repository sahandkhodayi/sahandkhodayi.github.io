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
  { branch: "AI", count: 12, leaves: [
    { name: "neural networks", meta: "models · training", st: "built", note: "Layers of weighted connections trained to approximate a function from data." },
    { name: "CNNs", meta: "convolution · pooling", st: "built", note: "Convolutional filters that learn local, translation-invariant features." },
    { name: "training", meta: "loss · learning rate", st: "study", note: "Adjusting weights via gradient descent on a loss computed over labeled data." },
    { name: "inference", meta: "weights · deployment", st: "built", note: "Running a trained model forward, weights frozen, to produce a prediction." },
    { name: "from scratch", meta: "NumPy · gradients", st: "built", note: "Rebuilding the pipeline without autograd, to see the update rule directly." }
  ] },
  { branch: "mathematics", count: 8, leaves: [
    { name: "linear algebra", meta: "vectors · matrices", st: "study", note: "Vectors, matrices, and the transformations that move data between spaces." },
    { name: "calculus", meta: "derivatives · gradients", st: "study", note: "Derivatives and gradients — the machinery behind every training step." },
    { name: "probability", meta: "distributions · independence", st: "study", note: "Distributions and uncertainty, the language most loss functions are written in." },
    { name: "optimization", meta: "gradient descent", st: "study", note: "Finding parameters that minimize a loss, usually iteratively." }
  ] },
  { branch: "C", count: 10, leaves: [
    { name: "language basics", meta: "types · functions · structs", st: "study", note: "Types, functions, structs — no garbage collector, no hidden allocations." },
    { name: "pointers", meta: "addresses · dereferencing", st: "study", note: "Variables that hold addresses, not values." },
    { name: "memory", meta: "stack · heap", st: "study", note: "Stack for scoped lifetimes, heap for manual lifetimes." },
    { name: "compilation", meta: "compiler · linker", st: "study", note: "Source to object code to linked binary — three separate failure points." },
    { name: "files", meta: "IO · binary data", st: "study", note: "Reading and writing raw bytes, with no framework deciding the format for you." }
  ] },
  { branch: "systems", count: 10, leaves: [
    { name: "computer architecture", meta: "CPU · cache", st: "study", note: "How a CPU actually executes instructions: registers, pipelines, cache." },
    { name: "operating systems", meta: "processes · syscalls", st: "study", note: "Processes, syscalls, and the boundary between a program and the machine." },
    { name: "networking", meta: "TCP/IP · sockets", st: "study", note: "How bytes move between machines: TCP/IP, sockets, the stack underneath every request." },
    { name: "Linux", meta: "shell · tooling", st: "built", note: "Shell, processes, and the tools used daily to build everything else here." }
  ] },
  { branch: "osint", count: 5, leaves: [
    { name: "footprinting", meta: "domains · metadata · public records", st: "study", note: "Mapping what's publicly discoverable about a target before touching it." },
    { name: "recon methodology", meta: "passive vs active collection", st: "study", note: "Passive collection first, active collection only when it's justified." },
    { name: "social engineering theory", meta: "pretexting · information leakage", st: "study", note: "How information leaks through people, not just systems." },
    { name: "threat modeling", meta: "attack surfaces · adversary thinking", st: "study", note: "Thinking like an adversary to find what actually needs defending." }
  ] }
];

window.CONNECTIONS = [["convolution", "number-guesser", "lab[001]"], ["backpropagation", "nn-from-scratch", "lab[002]"], ["gradient descent", "ml-models-from-scratch", "lab[003]"], ["Fourier features", "math-network", "lab[005]"], ["C", "number-guesser", "inference"], ["pointers", "C", "systems"]];
window.SYSTEMS_TOPICS = [["C", "language · pointers · structs · files"], ["memory", "stack · heap · lifetime"], ["cpu", "registers · instructions"], ["cache", "locality · cache lines"], ["processes", "programs · address spaces"], ["files", "buffers · binary data"], ["networking", "TCP/IP · sockets"], ["Linux", "shell · processes · tools"], ["OSINT", "recon · footprinting · public records"]];
window.MEM = { base: 0x7ffd2a10, bytes: [0x2f,0x00,0x1a,0x7f,0x00,0x00,0x00,0x00,0x48,0x65,0x6c,0x6c,0x6f,0x00,0x00,0x00] };

// Recent activity — a real, single-author log, not a fake multi-user feed.
// Add a line here whenever you actually ship or log something.
window.ACTIVITY = [
  { who: "sahand", verb: "logged", target: "lab[001] — PyTorch → C inference parity", ref: "#/lab" },
  { who: "sahand", verb: "shipped", target: "Number Guesser — C inference backend", ref: "#/projects/number-guesser" },
  { who: "sahand", verb: "opened", target: "OSINT — recon methodology notes", ref: "#/knowledge" },
  { who: "sahand", verb: "wrote", target: "Machine Learning Models — regression from scratch", ref: "#/projects/ml-models-from-scratch" }
];

// A dossier, not a member directory — this is one operator's file, styled
// like a case record. Kept as an array/shape in case that's ever untrue,
// but the copy never pretends it's more than one person today.
window.MEMBERS = [
  {
    handle: "sahand",
    name: "Sahand Khodayi",
    role: "operator",
    clearance: "root",
    identity: "ai / mathematics / c / systems / osint",
    status: "active",
    focus: ["pytorch", "cnn", "c", "numpy"],
    link: "#/portfolio"
  }
];

// Dispatches — a real feed you publish into, not a placeholder for other
// people's submissions. Uploads/accounts from other users need a backend
// (auth, storage, moderation) — a genuinely separate build from this static
// site; this is yours to write in the meantime.
window.NEWS = [
  {
    id: "003",
    tag: "osint",
    title: "Starting point: passive recon methodology",
    date: "2026-09-10",
    body: "TODO — replace with your actual write-up: passive vs active collection, first tools/sources you're working through, what you're testing them against.",
    ref: null
  },
  {
    id: "002",
    tag: "systems",
    title: "Why the inference path had to leave PyTorch",
    date: "2026-08-XX",
    body: "TODO — the real story behind moving Number Guesser's forward pass to C: what broke first, what you had to learn about memory layout to fix it.",
    ref: "#/projects/number-guesser"
  },
  {
    id: "001",
    tag: "ai",
    title: "lab[001] closed: PyTorch \u2194 C parity",
    date: "2026-08-XX",
    body: "TODO — summarize the actual result: tolerance achieved, what mismatched first, what fixed it.",
    ref: "#/lab"
  }
];
