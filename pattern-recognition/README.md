# MMLC-202 - Pattern Recognition

**2021–22 scheme:** Semester 2 · MMLC-202 · Machine Learning core

**Course page:** [Pattern Recognition](https://arshad9999.github.io/MTech-Cse-CAS-Course/subject.html?code=MMLC-202)

**Official source:** [CAS syllabus, near page 22](https://cas.res.in/pdf/CSE-Syllabus%202021-22.pdf#page=22)

The existing guide below may use older course codes, semester labels or credit values. Consult the official syllabus and your department for your batch.

**Credits:** 3

Learn representations and decision rules from experience, then evaluate what generalizes.

> This guide expands only the topics named in the supplied syllabus. Confirm assessment rules and recommended readings with your institution.

## Course map

1. **Learning problems and models** - Introduction, Algorithmic models of learning, Classifiers, Functions, Relations, Grammars, Probabilistic models, Value functions, Behaviors, Programs from experience
2. **Bayesian, MAP and MDL frameworks** - Bayesian framework, Maximum a posteriori, Minimum description length
3. **Parameter estimation and model families** - Parameter estimation, Sufficient statistics, Decision trees, Neural networks, Support vector machines, Bayesian networks
4. **Text and sequence models** - Bag of words classifiers, N-gram models, Markov models, Hidden Markov models, Probabilistic relational models
5. **Instance, rule and ensemble methods** - Association rules, Nearest neighbour classifiers, Locally weighted regression, Ensemble classifiers
6. **Computational learning theory** - Mistake bound analysis, Sample complexity, VC dimension, Occam learning, Accuracy and confidence boosting
7. **Representation, reduction and visualization** - Dimensionality reduction, Feature selection, Visualization
8. **Clustering and mixture models** - Clustering, Mixture models, K-means, Hierarchical clustering, Distributional clustering
9. **Document recognition application** - Applications: document recognition

## Learning notes

### 1. Learning problems and models

**Syllabus topics:** Introduction, Algorithmic models of learning, Classifiers, Functions, Relations, Grammars, Probabilistic models, Value functions, Behaviors, Programs from experience

Learning uses experience to improve performance on a defined task. The output may be a label, function, relation, grammar, probability model, value estimate, behavior, or program. A sound formulation identifies input representation, target, loss, data source, and evaluation protocol.

**Key equation or relation:** `empirical risk = (1/n) sum L(f(x_i), y_i)`

**Worked example:** Document recognition maps an image or token sequence to a label. The same data could instead support probability estimation, structured parsing, or a learned decision policy.

**Must understand:** Define task, experience, performance measure, and generalization target.

### 2. Bayesian, MAP and MDL frameworks

**Syllabus topics:** Bayesian framework, Maximum a posteriori, Minimum description length

Bayesian inference combines prior belief and likelihood into a posterior. MAP selects the parameter with highest posterior density. MDL favors the model that gives the shortest combined description of model and data.

**Key equation or relation:** `posterior proportional to likelihood x prior; theta_MAP=argmax p(D|theta)p(theta)`

**Worked example:** With limited data, a prior can stabilize parameter estimates. As data accumulate, the likelihood often dominates. MDL penalizes complexity when it does not compress the observations enough.

**Must understand:** State priors and model assumptions; do not present MAP as prior-free.

### 3. Parameter estimation and model families

**Syllabus topics:** Parameter estimation, Sufficient statistics, Decision trees, Neural networks, Support vector machines, Bayesian networks

Parameter estimation fits a chosen model family. A sufficient statistic preserves all sample information relevant to a parameter under the model. Trees partition feature space, neural networks compose learned transformations, SVMs maximize a margin, and Bayesian networks encode conditional dependence.

**Key equation or relation:** `SVM margin is proportional to 1/||w||`

**Worked example:** For a Bernoulli model, the number of successes is sufficient for the success probability. A decision tree split can be chosen by impurity reduction, then validated on unseen data.

**Must understand:** Compare interpretability, capacity, optimization, data needs, and calibration.

### 4. Text and sequence models

**Syllabus topics:** Bag of words classifiers, N-gram models, Markov models, Hidden Markov models, Probabilistic relational models

Bag of words represents token counts while discarding order. N-grams preserve short local context. Markov models assume limited state dependence; hidden Markov models infer unobserved states from observed emissions. Relational models include dependencies among entities.

**Key equation or relation:** `P(w_1...w_T) approximately product P(w_t | previous n-1 words)`

**Worked example:** A bigram model estimates a word from its predecessor. In an HMM for document zones, hidden states might be title, paragraph, and caption while observations are visual or textual features.

**Must understand:** Identify what information is lost by the independence or Markov assumption.

### 5. Instance, rule and ensemble methods

**Syllabus topics:** Association rules, Nearest neighbour classifiers, Locally weighted regression, Ensemble classifiers

Association rules describe co-occurrence patterns using support and confidence. Nearest-neighbour methods predict from nearby training examples. Local regression fits around a query point. Ensembles combine diverse learners to reduce error.

**Key equation or relation:** `confidence(A -> B)=support(A union B)/support(A)`

**Worked example:** In k-nearest neighbours, feature scaling changes distance and therefore neighbours. A validation set can choose k; test data must remain untouched until final evaluation.

**Must understand:** Check leakage, scaling, distance choice, diversity, and validation design.

### 6. Computational learning theory

**Syllabus topics:** Mistake bound analysis, Sample complexity, VC dimension, Occam learning, Accuracy and confidence boosting

Learning theory relates hypothesis complexity, data volume, errors, accuracy, and confidence. VC dimension measures the largest set a hypothesis class can shatter. Occam-style reasoning controls complexity; boosting combines weak learners into a stronger classifier.

**Key equation or relation:** `generalization bounds commonly grow with complexity and shrink with sample size`

**Worked example:** A more expressive classifier may fit training data better yet need more observations to guarantee similar test performance. Boosting repeatedly emphasizes misclassified cases.

**Must understand:** Separate training error from a claim about unseen-data error.

### 7. Representation, reduction and visualization

**Syllabus topics:** Dimensionality reduction, Feature selection, Visualization

Feature selection retains a subset of original variables. Dimensionality reduction maps data to a smaller representation. Visualization supports exploration but a two-dimensional projection can distort global or local structure.

**Key equation or relation:** `PCA chooses directions maximizing projected variance`

**Worked example:** Standardize differently scaled features before PCA when scale should not dominate. Fit the transformation on training data only, then apply it to validation and test data.

**Must understand:** Treat a visualization as evidence to investigate, not automatic proof of separable classes.

### 8. Clustering and mixture models

**Syllabus topics:** Clustering, Mixture models, K-means, Hierarchical clustering, Distributional clustering

Clustering groups observations without supplied labels. K-means minimizes within-cluster squared distance to centroids. Hierarchical methods build nested merges or splits. Mixture models view observations as arising from latent component distributions.

**Key equation or relation:** `k-means objective = sum_i ||x_i - mu_(cluster(i))||^2`

**Worked example:** Different initial centroids can give different k-means solutions, so use multiple starts and report stability. A Gaussian mixture gives soft membership probabilities rather than only hard labels.

**Must understand:** Justify distance, scaling, cluster count, and evaluation method.

### 9. Document recognition application

**Syllabus topics:** Applications: document recognition

Document recognition integrates preprocessing, segmentation, representation, classification or sequence modeling, and evaluation. Errors can propagate across stages, so component and end-to-end metrics are both useful.

**Key equation or relation:** `F1 = 2 precision recall / (precision + recall)`

**Worked example:** A system may deskew a scan, detect text regions, recognize characters, reconstruct reading order, and compare output with ground truth using character or word error rate.

**Must understand:** Document data provenance, train-test separation, class imbalance, and representative failure cases.

## Files

- [Interactive course page](./index.html)
- [Detailed PDF handbook](./MCSC-106-pattern-recognition.pdf)
- [Semester home](../index.html)

## Study method

1. Define the terms without notes.
2. Reproduce the equation and state its assumptions.
3. Solve or trace the worked example.
4. Explain when the method should not be used.

## Scope and accuracy

This resource is based on the syllabus supplied for this repository. Explanations and examples clarify listed topics; they do not add official units, assessment weights, or institutional policies.
