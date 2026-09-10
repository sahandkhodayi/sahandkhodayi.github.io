window.SITE = {
  name: "sahand khodayi",
  handle: "sahand",
  identity: "ai / mathematics / systems",
  motto: "build it. break it. understand it.",
  github: "https://github.com/sahandkhodayi",
  email: "sahandkhodayi@gmail.com"
};

window.PROJECTS = [
  {
    id: "001", slug: "number-guesser", title: "Number Guesser",
    blurb: "Handwritten digit recognition built as a bridge between ML abstractions and the machine underneath: PyTorch training, exported weights, C inference, and a Python interface.",
    tags: ["pytorch", "cnn", "c", "mnist", "inference"], status: "active",
    spec: [["input", "28 × 28 grayscale image"], ["model", "convolutional neural network"], ["training", "PyTorch / Python"], ["export", "state_dict → flat binary weights"], ["inference", "C — forward pass implemented manually"], ["interface", "Python GUI"], ["verification", "PyTorch ↔ C output parity"], ["source", "github.com/sahandkhodayi/Number-Guesser"]],
    pipeline: [["draw", "handwritten input"], ["preprocess", "crop · resize · center · normalize"], ["train", "PyTorch · conv / pool / linear"], ["export", "trained weights → binary"], ["infer", "C · direct convolution + pooling + linear"], ["verify", "same input → comparable logits"]],
    questions: ["Can a hand-written C forward pass reproduce the trained PyTorch model?", "Where does numerical drift appear between the two implementations?", "How much of an ML framework is actually needed at inference time?", "How does input preprocessing affect a model trained on MNIST?"],
    related: ["001", "006"]
  },
  {
    id: "002", slug: "nn-from-scratch", title: "NN from Scratch with Visuals",
    blurb: "A neural network framework built with Python and NumPy: forward propagation, backpropagation, gradient descent, and live visualization of the network during training.",
    tags: ["python", "numpy", "backprop", "visualization", "from-scratch"], status: "built",
    spec: [["language", "Python + NumPy"], ["components", "neurons · layers · weights · biases"], ["forward", "matrix operations implemented manually"], ["backward", "chain rule + gradient calculation"], ["optimizer", "gradient descent"], ["interface", "interactive GUI playground"], ["visualization", "weights · neuron outputs · decision boundary · loss"], ["source", "github.com/sahandkhodayi/NN-s-from-scratch-with-viuals"]],
    pipeline: [["build", "define network topology"], ["forward", "propagate values through layers"], ["loss", "measure prediction error"], ["backward", "propagate derivatives"], ["update", "gradient descent"], ["observe", "watch learning happen"]],
    questions: ["What does backpropagation look like when autograd is removed?", "How does the decision boundary change during training?", "What fails first when the learning rate becomes too large?"], related: ["002", "003"]
  },
  {
    id: "003", slug: "ml-models-from-scratch", title: "Machine Learning Models",
    blurb: "Linear and logistic regression implemented from first principles with NumPy, focusing on the mathematics behind optimization instead of hiding it behind a library.",
    tags: ["python", "numpy", "regression", "optimization", "from-scratch"], status: "built",
    spec: [["language", "Python + NumPy"], ["linear", "multiple features · normalization · MSE · R²"], ["logistic", "binary classification · sigmoid · cross-entropy"], ["optimization", "gradient descent implemented manually"], ["evaluation", "R² · accuracy · convergence plots"], ["source", "github.com/sahandkhodayi/Machine-learning-Models"]],
    pipeline: [["data", "load and normalize features"], ["model", "weighted combination of inputs"], ["loss", "MSE / cross-entropy"], ["gradient", "derive parameter updates"], ["update", "gradient descent"], ["evaluate", "measure convergence and fit"]],
    questions: ["How does normalization change the path of gradient descent?", "Why does logistic regression need the sigmoid function?", "How does learning rate affect convergence?"], related: ["003", "005"]
  },
  {
    id: "004", slug: "math-network", title: "Math Network",
    blurb: "A PyTorch MLP that learns mathematical functions, with Fourier-feature input encoding for functions containing higher-frequency structure.",
    tags: ["pytorch", "mlp", "fourier", "mathematics"], status: "built",
    spec: [["framework", "PyTorch"], ["model", "multi-layer perceptron"], ["encoding", "Fourier features: sin / cos"], ["activation", "Tanh"], ["loss", "MSE / L1"], ["optimizer", "SGD"], ["evaluation", "loss · R² · true vs predicted curve"], ["source", "github.com/sahandkhodayi/Math-function-approximation-with-NN"]],
    pipeline: [["function", "define f(x)"], ["sample", "generate training pairs"], ["encode", "map x into Fourier features"], ["train", "MLP + Tanh"], ["evaluate", "MSE / R²"], ["inspect", "compare learned and true functions"]],
    questions: ["Why do high-frequency functions challenge a plain MLP?", "What does Fourier feature encoding change about the input space?", "How does model depth affect the learned function?"], related: ["002", "004"]
  }
];

window.EXPERIMENTS = [
  { id: "001", title: "PyTorch → C inference parity", status: "built", tag: "ok", body: "Feed the same inputs through the trained PyTorch model and the hand-written C inference path, then compare logits and intermediate tensors.", spec: [["input", "held-out MNIST samples"], ["metric", "max absolute difference"], ["goal", "find the first divergent layer"], ["state", "reproducible"]] },
  { id: "002", title: "backpropagation from scratch", status: "built", tag: "ok", body: "Implement the chain rule manually for every trainable layer and visualize the resulting parameter updates.", spec: [["component", "NN from Scratch"], ["method", "manual derivatives"], ["visualization", "weights + neuron outputs"], ["state", "reproducible"]] },
  { id: "003", title: "gradient descent convergence study", status: "built", tag: "ok", body: "Compare learning rates and optimization behaviour on regression problems implemented without a high-level ML estimator.", spec: [["component", "Machine Learning Models"], ["variants", "gradient descent"], ["metric", "loss vs iteration"], ["state", "reproducible"]] },
  { id: "004", title: "activation function comparison", status: "planned", tag: "p", body: "Compare ReLU, leaky ReLU, sigmoid, and tanh under the same architecture and initialization.", spec: [["state", "not started"]] },
  { id: "005", title: "Fourier feature encoding", status: "built", tag: "ok", body: "Compare a plain MLP against Fourier-feature input encoding while approximating increasingly oscillatory functions.", spec: [["component", "Math Network"], ["metric", "MSE · R²"], ["finding", "encoding changes the representation available to the MLP"], ["state", "reproducible"]] },
  { id: "006", title: "MNIST preprocessing", status: "built", tag: "ok", body: "Study everything between a human stroke and the tensor consumed by the model: scaling, cropping, centering, resizing, and normalization.", spec: [["finding", "hand-drawn input has a different distribution from MNIST"], ["state", "reproducible"]] },
  { id: "007", title: "matrix multiplication experiments", status: "planned", tag: "p", body: "Naive triple loop → loop reordering → blocked/tiled. Same arithmetic, different memory behaviour.", spec: [["state", "not started"]] }
];

window.KNOWLEDGE = [
  { branch: "AI", count: 12, leaves: [{ name: "neural networks", meta: "backprop · activations · optimization", st: "built" }, { name: "convolutional networks", meta: "convolution · pooling · feature maps", st: "built" }, { name: "training dynamics", meta: "loss · learning rate · overfitting", st: "study" }, { name: "model export & inference", meta: "weights · precision · parity", st: "built" }, { name: "from-scratch implementations", meta: "NumPy · chain rule · manual gradients", st: "built" }, { name: "function approximation", meta: "MLP · Fourier features · Tanh", st: "built" }] },
  { branch: "mathematics", count: 8, leaves: [{ name: "linear algebra", meta: "vectors · matrices · matrix multiplication", st: "study" }, { name: "calculus", meta: "derivatives · chain rule · gradients", st: "study" }, { name: "probability", meta: "distributions · independence · expectation", st: "study" }, { name: "optimization", meta: "gradient descent · objectives", st: "study" }] },
  { branch: "systems", count: 10, leaves: [{ name: "C", meta: "pointers · memory · compilation", st: "study" }, { name: "computer architecture", meta: "cpu · cache · assembly", st: "study" }, { name: "memory", meta: "stack · heap · layout · alignment", st: "study" }, { name: "networking", meta: "tcp/ip · sockets", st: "study" }, { name: "tooling", meta: "linux · wsl · git", st: "built" }] }
];

window.CONNECTIONS = [["convolution", "number-guesser", "lab[001]"], ["backpropagation", "nn-from-scratch", "lab[002]"], ["gradient descent", "ml-models-from-scratch", "lab[003]"], ["Fourier features", "math-network", "lab[005]"], ["matrix multiplication", "nn-from-scratch", "lab[007]"], ["pointers / memory", "number-guesser · C inference", "systems"], ["float precision", "number-guesser · parity", "lab[001]"]];

window.SYSTEMS_TOPICS = [["C", "pointers · manual memory · compilation"], ["memory", "stack · heap · layout · alignment · lifetime"], ["cpu", "registers · instructions · pipelines"], ["cache", "locality · cache lines · memory bandwidth"], ["processes", "address spaces · syscalls · context switches"], ["filesystems", "buffers · files · persistence"], ["networking", "TCP/IP · sockets · packets · protocols"], ["assembly", "what the compiler actually emitted"]];
window.MEM = { base: 0x7ffd2a10, bytes: [0x2f, 0x00, 0x1a, 0x7f, 0x00, 0x00, 0x00, 0x00, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x00, 0x00, 0x00] };
