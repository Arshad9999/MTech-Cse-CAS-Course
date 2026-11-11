# MCSC-102 - Probability and Statistics

**2021–22 scheme:** Semester 1 · MCSC-102 · Common core

**Course page:** [Probability and Statistics](https://arshad9999.github.io/MTech-Cse-CAS-Course/subject.html?code=MCSC-102)

**Official source:** [CAS syllabus, near page 12](https://cas.res.in/pdf/CSE-Syllabus%202021-22.pdf#page=12)

The existing guide below may use older course codes, semester labels or credit values. Consult the official syllabus and your department for your batch.

**Credits:** Not stated in the supplied syllabus

Model uncertainty, simulate systems, and make defensible statistical inferences from data.

> This guide expands only the topics named in the supplied syllabus. Confirm assessment rules and recommended readings with your institution.

## Course map

1. **Events and probability rules** - Introduction, Events and outcomes, Probability rules, Conditional probability, Independence, Bayes' rule, Combinatorics
2. **Random variables and discrete distributions** - Random variables and distributions, Discrete random variables, Bernoulli, Binomial, Geometric, Negative binomial, Poisson
3. **Continuous distributions, expectation and CLT** - Probability densities, Exponential, Gamma, Weibull, Hyperexponential, Normal, Expectation and moments, Central Limit Theorem
4. **Simulation and Monte Carlo** - Simulation of discrete variables, Simulation of continuous variables, Monte Carlo methods, Performance evaluation, Bootstrapping
5. **Stochastic processes** - Concepts and classification, Bernoulli process, Poisson process, Markov chains, Simple queuing systems
6. **Sampling, estimation and confidence intervals** - Sample mean distribution, Sample proportion distribution, Parameters and statistics, Method of moments, Maximum likelihood, Pivotal quantity confidence intervals
7. **Hypothesis testing and anomalies** - Hypothesis testing, Type I and Type II errors, Anomalous events, Parameter estimation and testing
8. **Exploration and statistical models** - Graphics and exploratory data analysis, Simple and multiple regression, Least squares, Logistic regression, Analysis of variance, Robust statistics, Nonparametric statistics

## Learning notes

### 1. Events and probability rules

**Syllabus topics:** Introduction, Events and outcomes, Probability rules, Conditional probability, Independence, Bayes' rule, Combinatorics

A sample space contains possible outcomes and an event is a subset. Conditional probability updates the relevant sample space. Independence means one event does not change the probability of the other. Bayes' rule reverses a conditional probability using priors and evidence.

**Key equation or relation:** `P(A|B)=P(A intersection B)/P(B); P(A|B)=P(B|A)P(A)/P(B)`

**Worked example:** If a detector is 95% sensitive, has 5% false positives, and prevalence is 1%, then a positive result has probability 0.0095/(0.0095+0.0495) about 16.1% of being a true case.

**Must understand:** Always define the sample space and distinguish P(A|B) from P(B|A).

### 2. Random variables and discrete distributions

**Syllabus topics:** Random variables and distributions, Discrete random variables, Bernoulli, Binomial, Geometric, Negative binomial, Poisson

A random variable maps outcomes to numbers. A probability mass function assigns probability to each discrete value. Each named distribution encodes a particular experiment and assumptions.

**Key equation or relation:** `Binomial: P(X=k)=C(n,k)p^k(1-p)^(n-k); Poisson: P(X=k)=e^(-lambda)lambda^k/k!`

**Worked example:** Ten independent requests each fail with probability 0.1. The number of failures is Binomial(10,0.1), so P(no failures)=0.9^10.

**Must understand:** Match the story to assumptions: fixed trials, waiting time, or event count.

### 3. Continuous distributions, expectation and CLT

**Syllabus topics:** Probability densities, Exponential, Gamma, Weibull, Hyperexponential, Normal, Expectation and moments, Central Limit Theorem

A continuous density integrates to probability. Expectation summarizes a distribution's center; moments describe shape. The Central Limit Theorem explains why standardized sums or means often approach a normal distribution under suitable conditions.

**Key equation or relation:** `E[X]=integral x f(x) dx; Z=(Xbar-mu)/(sigma/sqrt(n))`

**Worked example:** If service times are exponential with rate 0.5 per minute, the mean is 2 minutes and P(X>4)=e^(-2). The CLT can approximate a mean of many independent service times.

**Must understand:** A density value is not itself a probability; integrate over an interval.

### 4. Simulation and Monte Carlo

**Syllabus topics:** Simulation of discrete variables, Simulation of continuous variables, Monte Carlo methods, Performance evaluation, Bootstrapping

Simulation generates pseudo-random observations from a model. Monte Carlo estimates quantities by repeated sampling. Bootstrapping resamples observed data to approximate sampling variability when analytic formulas are difficult.

**Key equation or relation:** `Monte Carlo estimate = (1/N) sum(g(X_i))`

**Worked example:** Estimate pi by sampling N points uniformly in a unit square and multiplying the fraction inside the quarter circle by 4. Precision improves roughly with the square root of N.

**Must understand:** Report seed, number of runs, uncertainty, and convergence evidence.

### 5. Stochastic processes

**Syllabus topics:** Concepts and classification, Bernoulli process, Poisson process, Markov chains, Simple queuing systems

A stochastic process is a time-indexed family of random variables. Markov chains condition the future on the current state. Queuing systems combine arrival and service processes to study waiting and congestion.

**Key equation or relation:** `Markov: P(X_(t+1)=j | history)=P(X_(t+1)=j | X_t=i)`

**Worked example:** For a two-state up/down system, a transition matrix gives the chance of repair or failure per step. Multiplying a state distribution by the matrix advances it one step.

**Must understand:** State the index set, state space, transition assumptions, and whether time is discrete or continuous.

### 6. Sampling, estimation and confidence intervals

**Syllabus topics:** Sample mean distribution, Sample proportion distribution, Parameters and statistics, Method of moments, Maximum likelihood, Pivotal quantity confidence intervals

A parameter describes a population; a statistic is computed from a sample. Estimation uses data to infer parameters. Method of moments matches sample and population moments; maximum likelihood chooses parameters that make observed data most plausible.

**Key equation or relation:** `Xbar=(1/n)sum X_i; 95% large-sample CI: Xbar +/- 1.96 s/sqrt(n)`

**Worked example:** A sample mean of 52 with s=10 and n=100 has approximate 95% interval 52 +/- 1.96, assuming conditions for the approximation are reasonable.

**Must understand:** Report estimator, assumptions, standard error, confidence level, and interpretation.

### 7. Hypothesis testing and anomalies

**Syllabus topics:** Hypothesis testing, Type I and Type II errors, Anomalous events, Parameter estimation and testing

A hypothesis test measures how incompatible data are with a null model. Type I error rejects a true null; Type II error fails to reject a false null. Anomaly detection needs an explicit baseline and false-alarm trade-off.

**Key equation or relation:** `power = 1 - beta; significance level = alpha`

**Worked example:** At alpha=0.05, repeated testing across many independent metrics creates more opportunities for false positives, so multiplicity should be considered.

**Must understand:** A p-value is not the probability that the null hypothesis is true.

### 8. Exploration and statistical models

**Syllabus topics:** Graphics and exploratory data analysis, Simple and multiple regression, Least squares, Logistic regression, Analysis of variance, Robust statistics, Nonparametric statistics

Exploratory graphics reveal distribution, relationships, and data quality. Least squares models a numeric response; logistic regression models log-odds for a binary response. ANOVA compares variation among and within groups. Robust and nonparametric methods reduce reliance on fragile assumptions.

**Key equation or relation:** `least squares minimizes sum(y_i - yhat_i)^2; logit(p)=log(p/(1-p))`

**Worked example:** Plot residuals after regression: curvature suggests missing structure, while widening spread suggests non-constant variance. A coefficient must be interpreted with units and other predictors held constant.

**Must understand:** Inspect data and residuals before trusting a fitted model.

## Files

- [Interactive course page](./index.html)
- [Detailed PDF handbook](./MCSC-202-probability-and-statistics.pdf)
- [Semester home](../index.html)

## Study method

1. Define the terms without notes.
2. Reproduce the equation and state its assumptions.
3. Solve or trace the worked example.
4. Explain when the method should not be used.

## Scope and accuracy

This resource is based on the syllabus supplied for this repository. Explanations and examples clarify listed topics; they do not add official units, assessment weights, or institutional policies.
