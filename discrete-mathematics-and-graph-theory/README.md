# MCSC-105 - Discrete Mathematics and Graph Theory

**2021–22 scheme:** Semester 1 · MCSC-105 · Common core

**Course page:** [Discrete Mathematics and Graph Theory](https://arshad9999.github.io/MTech-Cse-CAS-Course/subject.html?code=MCSC-105)

**Official source:** [CAS syllabus, near page 15](https://cas.res.in/pdf/CSE-Syllabus%202021-22.pdf#page=15)

The existing guide below may use older course codes, semester labels or credit values. Consult the official syllabus and your department for your batch.

**Credits:** 4

Reason about finite structures, prove what must be true, and turn graph models into efficient algorithms.

> This guide expands only the topics named in the supplied syllabus. Confirm assessment rules and recommended readings with your institution.

## Course map

1. **Counting principles** - Basic counting principle, Pigeonhole principle, Inclusion-exclusion principle
2. **Recurrences and generating functions** - Recurrence relations, Generating functions
3. **Logic, sets, languages and machines** - Fundamentals of logic, Set theory, Language, Finite state machines
4. **Graphs, trails and cycles** - Undirected and directed graphs, Modelling with graphs, Trail and cycle, Eulerian trail, Hamilton cycle
5. **Connectivity and trees** - Connectivity, Trees
6. **Graph traversal and shortest paths** - Breadth-first search (BFS), Depth-first search (DFS), Shortest path
7. **Spanning trees, matching and assignment** - Optimal spanning trees, Matching, Job assignment problem
8. **Network flows and transportation** - Optimal transportation through flows in networks

## Learning notes

### 1. Counting principles

**Syllabus topics:** Basic counting principle, Pigeonhole principle, Inclusion-exclusion principle

The product rule multiplies the number of choices made in sequence. The pigeonhole principle guarantees repetition when more objects are placed into fewer boxes. Inclusion-exclusion corrects double counting across overlapping sets.

**Key equation or relation:** `|A union B| = |A| + |B| - |A intersection B|`

**Worked example:** A system generates a two-letter code followed by one digit. There are 26 x 26 x 10 = 6,760 possible codes. If 11 requests are assigned to 10 servers, at least one server receives two requests.

**Must understand:** Can you identify whether a problem needs the sum rule, product rule, pigeonhole principle, or inclusion-exclusion?

### 2. Recurrences and generating functions

**Syllabus topics:** Recurrence relations, Generating functions

A recurrence defines each term using earlier terms. A generating function encodes a sequence as coefficients of a formal power series, allowing algebraic manipulation of the whole sequence.

**Key equation or relation:** `F(x) = sum(a_n x^n, n >= 0);  a_n = a_(n-1) + a_(n-2)`

**Worked example:** For binary strings with no consecutive 1s, let a_n be the count at length n. Splitting on the last bit gives a_n = a_(n-1) + a_(n-2), with a_1 = 2 and a_2 = 3.

**Must understand:** Write base cases before expanding or solving a recurrence.

### 3. Logic, sets, languages and machines

**Syllabus topics:** Fundamentals of logic, Set theory, Language, Finite state machines

Logic formalizes valid inference; set theory describes collections and operations. A formal language is a set of strings over an alphabet. A finite state machine accepts a string by following transitions from a start state to an accepting state.

**Key equation or relation:** `p implies q is equivalent to (not p) or q`

**Worked example:** A two-state machine can accept binary strings ending in 1: state q0 means the current suffix ends in 0 or is empty; q1 is accepting and means it ends in 1.

**Must understand:** Construct a truth table and trace at least three strings through a finite state machine.

### 4. Graphs, trails and cycles

**Syllabus topics:** Undirected and directed graphs, Modelling with graphs, Trail and cycle, Eulerian trail, Hamilton cycle

A graph G=(V,E) contains vertices and edges. Directed edges have orientation. An Eulerian trail uses every edge once; a Hamilton cycle visits every vertex once and returns to its start.

**Key equation or relation:** `sum(deg(v), v in V) = 2|E|`

**Worked example:** A connected undirected graph has an Eulerian circuit exactly when every vertex has even degree. A delivery route that must traverse every road is an edge-focused Euler problem; visiting every city once is vertex-focused and Hamiltonian.

**Must understand:** Do not confuse an Eulerian condition with a Hamiltonian condition.

### 5. Connectivity and trees

**Syllabus topics:** Connectivity, Trees

A connected graph has a path between every pair of vertices. A tree is a connected acyclic undirected graph; with n vertices it has exactly n-1 edges and a unique simple path between each pair.

**Key equation or relation:** `For a tree: |E| = |V| - 1`

**Worked example:** Removing any edge from a tree disconnects it, while adding any new edge creates exactly one cycle. These dual properties are useful when proving minimal connectivity.

**Must understand:** Prove the tree properties from connectedness and absence of cycles.

### 6. Graph traversal and shortest paths

**Syllabus topics:** Breadth-first search (BFS), Depth-first search (DFS), Shortest path

BFS explores by distance layers and gives shortest unweighted paths. DFS explores deeply before backtracking and supports connectivity, cycle detection, and ordering tasks. Weighted shortest paths require an algorithm whose assumptions match the edge weights.

**Key equation or relation:** `BFS time = O(|V| + |E|)`

**Worked example:** In an unweighted social graph, BFS from a profile discovers all profiles one connection away before those two connections away; the parent links reconstruct a shortest path.

**Must understand:** State whether the graph is directed, weighted, and allowed to contain negative weights before choosing an algorithm.

### 7. Spanning trees, matching and assignment

**Syllabus topics:** Optimal spanning trees, Matching, Job assignment problem

A minimum spanning tree connects every vertex with minimum total edge weight. A matching contains edges with no shared endpoint. Job assignment is a weighted bipartite matching problem between workers and jobs.

**Key equation or relation:** `MST has |V|-1 edges; assignment minimizes sum(c_ij x_ij)`

**Worked example:** Kruskal's method repeatedly adds the lightest edge that does not create a cycle. In assignment, each worker and job must appear in exactly one selected pair.

**Must understand:** Explain why a locally light edge is safe before applying a greedy MST step.

### 8. Network flows and transportation

**Syllabus topics:** Optimal transportation through flows in networks

A flow network is a directed graph with capacities, a source, and a sink. A feasible flow respects capacity constraints and flow conservation. Maximum flow models transportation, routing, and allocation.

**Key equation or relation:** `0 <= f(u,v) <= c(u,v); inflow(v) = outflow(v)`

**Worked example:** If two routes from source to sink have bottlenecks 5 and 3 and share no capacity, they can carry 8 units. An augmenting path increases flow by its smallest residual capacity.

**Must understand:** Check capacity, conservation, and residual edges after every augmentation.

## Files

- [Interactive course page](./index.html)
- [Detailed PDF handbook](./MCSC-105-discrete-mathematics-and-graph-theory.pdf)
- [Semester home](../index.html)

## Study method

1. Define the terms without notes.
2. Reproduce the equation and state its assumptions.
3. Solve or trace the worked example.
4. Explain when the method should not be used.

## Scope and accuracy

This resource is based on the syllabus supplied for this repository. Explanations and examples clarify listed topics; they do not add official units, assessment weights, or institutional policies.
