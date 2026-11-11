# MCSC-103 - Advanced Computer Networks and Communication

**2021–22 scheme:** Semester 1 · MCSC-103 · Common core

**Course page:** [Advanced Computer Networks and Communication](https://arshad9999.github.io/MTech-Cse-CAS-Course/subject.html?code=MCSC-103)

**Official source:** [CAS syllabus, near page 13](https://cas.res.in/pdf/CSE-Syllabus%202021-22.pdf#page=13)

The existing guide below may use older course codes, semester labels or credit values. Consult the official syllabus and your department for your batch.

**Credits:** 4

Connect physical transmission, network protocols, management, mobility, and security into one operational view.

> This guide expands only the topics named in the supplied syllabus. Confirm assessment rules and recommended readings with your institution.

## Course map

1. **Telecommunications foundations** - Telecommunications history, Conducted media, Radiated media, Transmission characteristics
2. **Coding, modulation and errors** - Coding techniques, Modulation techniques, Error characteristics, Error detection, Error correction
3. **Networks, standards and layered design** - LAN and WAN applications, hardware, and software, OSI model, Industry standards, Topologies, Protocols, Internetworking devices
4. **Applications and system selection** - Information system applications, Selection of telecommunications and networking systems, Communications management
5. **Security, signatures and authentication** - Security and recovery, Communication security, Digital signatures, Authentication protocols
6. **Wireless mobility** - WLAN, Mobile IP
7. **SNMP models and proxying** - SNMP v1 and v2 organizational model, System overview, Information model, Communication model, Functional model, SNMP proxy server
8. **Broadband, ATM and network management** - Broadband networks and services, ATM technology, Configuration management, Fault management, Performance management, Network management tools, Network statistics measurement systems
9. **Web and XML management plus laboratory** - Web-based management, XML-based network management, Programming protocols using C/C++ and MATLAB, Theory practice

## Learning notes

### 1. Telecommunications foundations

**Syllabus topics:** Telecommunications history, Conducted media, Radiated media, Transmission characteristics

Telecommunication moves information over distance. Conducted media guides signals through copper or fiber; radiated media uses electromagnetic propagation. Bandwidth, attenuation, noise, delay, and signal-to-noise ratio shape achievable communication.

**Key equation or relation:** `Shannon capacity: C = B log2(1 + S/N)`

**Worked example:** Increasing bandwidth raises theoretical capacity, but noise and attenuation still limit reliable transmission. Fiber offers high bandwidth and low electromagnetic interference; radio supports mobility but shares spectrum.

**Must understand:** Compare a medium by bandwidth, reach, interference, mobility, cost, and security exposure.

### 2. Coding, modulation and errors

**Syllabus topics:** Coding techniques, Modulation techniques, Error characteristics, Error detection, Error correction

Line and channel coding map information into transmitted symbols. Modulation varies a carrier. Detection adds redundancy to identify corruption; correction adds enough structured redundancy to recover some errors.

**Key equation or relation:** `Hamming distance d_min detects up to d_min-1 errors and corrects floor((d_min-1)/2)`

**Worked example:** A parity bit detects any odd number of flipped bits but cannot identify which bit changed. A CRC treats the bit string as a polynomial and checks a transmitted remainder.

**Must understand:** Distinguish source coding, channel coding, line coding, and modulation.

### 3. Networks, standards and layered design

**Syllabus topics:** LAN and WAN applications, hardware, and software, OSI model, Industry standards, Topologies, Protocols, Internetworking devices

Layering separates concerns through services and protocols. The OSI model organizes communication into seven conceptual layers. Hubs, switches, routers, and gateways act at different scopes; standards allow independently built systems to interoperate.

**Key equation or relation:** `End-to-end delay = processing + queueing + transmission + propagation`

**Worked example:** A switch forwards frames within a LAN using link-layer addresses; a router forwards packets between networks using network-layer addresses.

**Must understand:** For any device or protocol, name its layer, inputs, outputs, and failure scope.

### 4. Applications and system selection

**Syllabus topics:** Information system applications, Selection of telecommunications and networking systems, Communications management

Network design translates application requirements into topology, capacity, redundancy, manageability, security, and cost choices. Selection should follow measured requirements rather than brand preference.

**Key equation or relation:** `Availability = uptime / total time`

**Worked example:** A video service prioritizes throughput and jitter control; a transaction system prioritizes correctness, latency, availability, and secure recovery. A requirements matrix makes trade-offs visible.

**Must understand:** Record functional needs, service-level targets, risks, and total cost before selecting a system.

### 5. Security, signatures and authentication

**Syllabus topics:** Security and recovery, Communication security, Digital signatures, Authentication protocols

Confidentiality prevents unauthorized disclosure, integrity detects alteration, and availability preserves service. Digital signatures bind a private-key operation to data; authentication protocols establish identity or possession of credentials.

**Key equation or relation:** `signature = Sign(private_key, Hash(message))`

**Worked example:** A verifier recomputes the message hash and verifies the signature with the public key. A nonce prevents an old authentication response from being replayed as fresh proof.

**Must understand:** Separate encryption from signatures and authentication from authorization.

### 6. Wireless mobility

**Syllabus topics:** WLAN, Mobile IP

A WLAN connects devices over radio through access points or peer modes. Mobility introduces association, roaming, interference, and security concerns. Mobile IP preserves reachability as a node changes its point of attachment.

**Key equation or relation:** `Effective wireless throughput < nominal link rate`

**Worked example:** A roaming device may reassociate with a new access point while higher layers try to preserve sessions; congestion and interference can dominate performance even with a strong signal.

**Must understand:** Analyze mobility at link, network, transport, and application layers.

### 7. SNMP models and proxying

**Syllabus topics:** SNMP v1 and v2 organizational model, System overview, Information model, Communication model, Functional model, SNMP proxy server

SNMP managers query or configure agents using managed objects defined in MIB modules. The information model names typed objects; the communication model exchanges protocol data units; the functional model covers monitoring and control. A proxy represents devices that cannot communicate directly with the manager.

**Key equation or relation:** `managed object identifier = hierarchical OID`

**Worked example:** A manager polls an interface counter, compares successive values, and estimates utilization. Traps or notifications report selected events without waiting for a poll.

**Must understand:** Explain manager, agent, MIB, OID, polling, notification, and proxy roles.

### 8. Broadband, ATM and network management

**Syllabus topics:** Broadband networks and services, ATM technology, Configuration management, Fault management, Performance management, Network management tools, Network statistics measurement systems

ATM transports fixed-size cells through virtual connections. Operational management keeps inventory and configuration consistent, detects and isolates faults, and measures performance indicators such as latency, loss, throughput, and utilization.

**Key equation or relation:** `utilization = observed traffic / link capacity`

**Worked example:** A monitoring tool correlates rising interface errors with packet loss, while configuration history reveals whether a recent change preceded the fault.

**Must understand:** For each metric, define its unit, collection interval, baseline, and alert threshold.

### 9. Web and XML management plus laboratory

**Syllabus topics:** Web-based management, XML-based network management, Programming protocols using C/C++ and MATLAB, Theory practice

Web-based management exposes operational views through browser-accessible interfaces. XML represents structured management data. Laboratory work connects protocol theory to parsers, sockets, traffic experiments, and numerical analysis.

**Key equation or relation:** `goodput = useful application bits / elapsed time`

**Worked example:** A lab can implement a client-server message exchange, inject controlled loss, measure round-trip time, and plot results in MATLAB while documenting protocol states.

**Must understand:** Every lab report should state topology, assumptions, procedure, raw observations, calculations, and limitations.

## Files

- [Interactive course page](./index.html)
- [Detailed PDF handbook](./MCSC-103-advanced-computer-networks-and-communication.pdf)
- [Semester home](../index.html)

## Study method

1. Define the terms without notes.
2. Reproduce the equation and state its assumptions.
3. Solve or trace the worked example.
4. Explain when the method should not be used.

## Scope and accuracy

This resource is based on the syllabus supplied for this repository. Explanations and examples clarify listed topics; they do not add official units, assessment weights, or institutional policies.
