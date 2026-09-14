# LARPSOCIETY

LARPSOCIETY is an experimental web clubhouse for curious people: projects, experiments, learning, people, and things worth poking at.

The site is intentionally small and static. The goal is not to build a conventional portfolio. It is to make technical work feel **playable**.

## Interactive user lab

The Lab should become the center of the site. A visitor should be able to open a project or learning idea and immediately **touch the concept** instead of only reading a description.

### Project playgrounds

Turn serious projects into small browser experiences:

- **Number Guesser / CNN playground** — draw a digit, watch the 28×28 input, inspect preprocessing, see layer activations, compare the Python/PyTorch result with the C inference result, and intentionally break preprocessing to see why accuracy drops.
- **NN from Scratch** — add/remove neurons, change learning rate, train step-by-step, inspect weights, gradients, activations, and loss.
- **Machine Learning Models** — move data points, switch linear/logistic regression, change the learning rate, and watch the decision boundary or regression line update.
- **Math Network** — choose a mathematical function, change Fourier-feature settings, train the MLP, and compare the learned curve with the target.

### Mini learning projects

Short experiments that teach one idea in a few minutes:

1. **Gradient descent** — drag the starting point and learning rate; watch the parameter move toward a minimum.
2. **Backpropagation** — click through a tiny network and highlight the chain-rule path used to compute a gradient.
3. **Activation functions** — compare ReLU, sigmoid, tanh, and their derivatives with a draggable input.
4. **Convolution** — move a 3×3 kernel across a tiny image and see each output value being calculated.
5. **Pooling** — switch max/average pooling and change the window/stride.
6. **Matrix multiplication** — edit a matrix and vector and highlight the row-column products that create each output.
7. **Probability playground** — run coin/dice experiments and compare observed frequencies with expected probabilities.
8. **Overfitting playground** — change model complexity and dataset noise while watching training and validation error diverge.
9. **Normalization explorer** — compare raw, standardized, and normalized features and see how optimization changes.
10. **Loss-function lab** — compare MSE, binary cross-entropy, and cross-entropy on the same predictions.
11. **Learning-rate lab** — show stable convergence, slow learning, and divergence from the same starting point.
12. **MNIST preprocessing** — draw a digit and toggle scaling, cropping, centering, resizing, and normalization one at a time.

### Design rules for the Lab

- **One idea per screen.** Avoid turning experiments into dashboards.
- **Manipulation first.** Sliders, draggable points, toggles, buttons, and step controls should expose the mechanism.
- **Show the math.** When useful, display the exact equation behind the visualization.
- **Show the state.** Expose inputs, parameters, intermediate values, and outputs.
- **Let people break things.** Bad learning rates, strange inputs, oversized kernels, and noisy data are useful states.
- **Explain after interaction.** Keep prose short and let the experiment carry the explanation.
- **No backend by default.** Prefer browser-native HTML/CSS/JS and small self-contained experiments.
- **Project pages should connect to the real source code.** The website is the playground; GitHub remains the source.

### Suggested Lab architecture

```text
LAB
├── PLAYGROUND
│   ├── gradient descent
│   ├── convolution
│   ├── backpropagation
│   └── matrix multiplication
├── PROJECTS
│   ├── number guesser
│   ├── neural network from scratch
│   ├── ML models from scratch
│   └── math network
└── CHALLENGES
    ├── tune the learning rate
    ├── fix the broken preprocessing
    ├── make the model overfit
    └── make it generalize again
```

## Current direction

The visual language can keep the existing terminal/amber/LARP atmosphere, but content should feel more like a **playground and clubhouse** than a fake hacker dashboard. Avoid unnecessary jargon, decorative status labels, and visual noise when they do not help the experience.

The next major step is to turn the existing Lab entries into real interactive experiments, then connect those experiments directly to the Projects pages.
