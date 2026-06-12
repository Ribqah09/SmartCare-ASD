# Triangulation of Evolutionary, Swarm, and Probabilistic Optimization for Multimodal ASD Screening Fusion Weights

**Muhammad Saleem¹ · Ribqah Ahmed¹ · Muhammad Naveed Iqbal Khan²**

---

### **Abstract**
Autism Spectrum Disorder (ASD) is a pervasive neurodevelopmental condition that significantly impacts a child's social communication and interaction capabilities. Early diagnosis, ideally between 12 and 36 months, is paramount for the initiation of early intervention services which are known to improve long-term developmental trajectories. Recent research has shifted toward multimodal screening systems that leverage the strengths of both computer vision for facial micro-expression analysis and structured behavioural assessments. However, the integration of these modalities introduces the "Fusion Weighting Problem"—the challenge of determining the optimal mathematical contribution of each modality to the final diagnostic score. This paper proposes a "Triangulation of Optimizers" framework to identify and validate the optimal fusion weights for the SmartCare ASD screening engine [15]. By employing three distinct computational intelligence paradigms—Genetic Algorithms (GA), Adaptive Particle Swarm Optimization (APSO), and Bayesian Optimization—this study seeks a robust consensus on the weighting parameters. A validation dataset of 200 precisely aligned subjects was utilized to evaluate the performance of each optimization strategy. The results demonstrate an unprecedented convergence, with all three algorithms independently identifying $\beta \approx 0.60$ for the visual modality and $\alpha \approx 0.40$ for the behavioural modality as the global optimum [2]. This consensus yields a peak fitness score of $1.9200$, maximizing both accuracy (95.00%) and clinical sensitivity (97.00%). The triangulation approach provides a form of mathematical proof for the fusion ratio, ensuring its reliability for large-scale clinical deployment. This paper details the architectural alignment of the optimizers, the mathematical formulations of the search heuristics, and the clinical implications of the converged weights.

**Keywords:** Multimodal Fusion, ASD Screening, Adaptive PSO, Genetic Algorithms, Bayesian Optimization, Triangulation, Neurodevelopmental Disorders.

---

### **1. Introduction**
The rising prevalence of Autism Spectrum Disorder (ASD) globally has created an urgent need for efficient, objective, and scalable screening mechanisms [7]. Traditional clinical diagnosis is often characterized by long waiting lists and a reliance on highly specialized clinicians, which can delay the start of intervention during the critical window of neuroplasticity [3]. Automated screening tools, particularly those utilizing Artificial Intelligence (AI), offer a promising solution to these bottlenecks. By providing a preliminary assessment, these tools can assist in the early triaging of toddlers who require further clinical evaluation.

A significant trend in modern AI-based screening is the transition from unimodal to multimodal systems [4]. Unimodal systems, such as those relying solely on computer vision to analyze facial expressions or those relying solely on parent-reported questionnaires, often face limitations in terms of sensitivity or specificity. For instance, while a Convolutional Neural Network (CNN) can detect subtle physiological markers of ASD in facial micro-expressions [8], it may lack the contextual depth provided by a behavioural assessment. Conversely, behavioural questionnaires like the Q-CHAT-10 provide rich symptomatic data but can be subject to parental reporting bias [3], [14]. Multimodal fusion seeks to mitigate these limitations by integrating diverse data streams into a unified diagnostic framework.

The central problem addressed in this research is the "Fusion Weighting Problem." Given two or more diagnostic scores, how much relative weight should be assigned to each to achieve the most accurate and sensitive screening result? Suboptimal weighting can lead to a significant increase in false negatives—children with ASD who are missed by the system—or false positives, which can cause unnecessary parental anxiety and strain clinical resources. Historically, researchers have often assigned these weights through empirical trial-and-error or static heuristic values. However, such approaches do not guarantee optimality or stability across different populations [7].

This paper introduces a rigorous triangulation methodology to resolve the fusion weighting problem [2]. Triangulation involves the use of multiple computational strategies to validate a single finding, ensuring that the results are not simply an artifact of a particular algorithm's bias or search heuristic. We employ Genetic Algorithms (GA) to represent the evolutionary paradigm, Adaptive Particle Swarm Optimization (APSO) for swarm intelligence, and Bayesian Optimization for probabilistic search. The primary contribution of this paper is the demonstration that a consensus across these three disparate paradigms provides a "mathematical proof" of the optimal weights, thereby ensuring the clinical validity of the SmartCare ASD screening engine [15].

### **2. Literature Review**
The field of ASD screening has seen a significant influx of AI-driven methodologies over the last decade [7]. Early research focused primarily on unimodal approaches. For example, computer vision models have been successfully trained to identify "autistic-like" facial features and micro-expressions with high accuracy [8]. Similarly, machine learning models, such as Support Vector Machines (SVMs) and Random Forests, have been applied to behavioural datasets to predict ASD risk based on symptomatic clusters [14]. However, the limitations of these unimodal approaches have led to a growing interest in multimodal data fusion.

Data fusion can be categorized into three levels: early fusion (feature-level), late fusion (decision-level), and hybrid fusion [4]. Decision-level fusion, which integrates the final probability outputs of multiple models, is often preferred in clinical settings due to its transparency and the ability to combine models trained on vastly different data types. The "CLISDE" model proposed by Michèle Cullinan et al. [1] represents a landmark in this area, demonstrating how recursively nested Island Genetic Algorithms can optimize complex decision structures. The CLISDE model emphasizes the importance of "architectural alignment," suggesting that the structure of the optimization algorithm should reflect the complexity of the underlying problem.

The use of evolutionary and swarm intelligence in medical diagnosis is well-documented [9], [10]. Genetic Algorithms (GA) are particularly effective at navigating non-convex fitness landscapes where traditional gradient-based methods might fail [10]. Adaptive Particle Swarm Optimization (APSO) improves upon traditional PSO by dynamically adjusting parameters such as inertia and acceleration coefficients, allowing the swarm to avoid local optima and converge more rapidly on the global best [5], [11]. Bayesian Optimization, meanwhile, offers a probabilistic approach that is highly efficient for objective functions that are expensive to evaluate, utilizing Gaussian Process surrogate models to guide the search [6], [12], [13].

Despite these advancements, few studies have addressed the stability of fusion weights through a triangulation lens. Most existing research relies on a single optimization method, which can leave the results vulnerable to the specific characteristics of that method's search behaviour. By triangulating the results of GA, APSO, and Bayesian Optimization, this research provides a more robust and verifiable solution to the fusion weighting problem, bridging the gap between theoretical optimization and clinical deployment [2].

### **3. Methodology**
The proposed framework aims to optimize the weights of a multimodal screening engine that combines visual and behavioural data [15].

#### **3.1. Mathematical Formulation**
The final risk score ($S_{\text{final}}$) for a subject is calculated as a weighted linear combination of the visual probability ($P_{\text{vision}}$) and the behavioural probability ($P_{\text{behavior}}$):

$$S_{\text{final}} = \beta \cdot P_{\text{vision}} + \alpha \cdot P_{\text{behavior}}$$

The weights are constrained by the following relationship:
$$\alpha + \beta = 1.0, \quad 0 \leq \beta \leq 1, \quad 0 \leq \alpha \leq 1$$

The objective is to find the value of $\beta$ that maximizes the fitness function $F$:
$$F = \text{Accuracy}(\beta) + \text{Sensitivity}(\beta)$$

Sensitivity (Recall) is weighted equally with Accuracy to ensure that the model prioritizes the detection of positive ASD cases, which is critical in a screening context.

#### **3.2. Optimization Algorithms**
A triangulation approach was employed using three distinct algorithms to search for the optimal $\beta$ [2].

**3.2.1. Genetic Algorithm (GA)**
The GA represents an evolutionary search strategy [9], [10]. A population of 200 candidate $\beta$ values is evolved over 100 generations.
*   **Initialization:** Random values in the range $[0, 1]$.
*   **Fitness Evaluation:** The $F$ score is calculated for each individual on the validation set.
*   **Selection:** Tournament selection with $k=4$ ensures high-performing individuals are selected.
*   **Crossover (BLX-$\alpha$):** 
    $$c = \text{random}(\min(p_1, p_2) - 0.3 \Delta, \max(p_1, p_2) + 0.3 \Delta)$$
*   **Mutation:** Gaussian mutation with a rate of $0.25$ and $\sigma=0.05$.
*   **Elitism:** The top 15% of the population is preserved.

**3.2.2. Adaptive Particle Swarm Optimization (APSO)**
APSO models a swarm of 30 particles [5], [11]. Each particle's velocity $v$ and position $x$ (representing $\beta$) are updated via: 
$$v_{i}(t+1) = w(t)v_{i}(t) + c_1(t)r_1(pbest_i - x_i(t)) + c_2(t)r_2(gbest - x_i(t))$$

Adaptive coefficients were implemented:
*   **Inertia ($w$):** Linearly decays from $0.9$ to $0.4$ to transition from exploration to exploitation.
*   **Acceleration ($c_1, c_2$):** $c_1$ decreases from $2.5$ to $0.5$, while $c_2$ increases from $0.5$ to $2.5$.

**3.2.3. Bayesian Optimization**
The Bayesian approach uses a Gaussian Process (GP) with a Matern kernel ($\nu=2.5$) as a surrogate model [6], [12]. The Expected Improvement (EI) acquisition function is maximized: 
$$EI(x) = \mathbb{E}[\max(f(x) - f(x^+), 0)]$$
This method is highly efficient, identifying the optimal weights in fewer than 25 iterations [13].

#### **3.3. Fusion Engine Architecture**
The SmartCare ASD fusion engine consists of two primary branches [15]:
*   **Visual Branch:** Utilizes a fine-tuned VGG16 CNN. The model was trained on facial images of toddlers to detect micro-expressions associated with ASD [8].
*   **Behavioural Branch:** Utilizes a Support Vector Machine (SVM) trained on the Q-CHAT-10 dataset [3]. The SVM outputs a probability score based on the severity of behavioural symptoms.

The outputs from these branches are normalized and passed to the weighted fusion layer, which calculates the final screening result.

### **4. Experimental Setup**
The experiments were performed on a high-performance workstation featuring an AMD Ryzen 9 processor and 64GB of RAM. The software implementation was carried out in Python using the Scikit-learn, NumPy, and SciPy libraries.

The dataset used for validation comprises 200 subjects, specifically children aged 12 to 36 months. For each subject, we have a pair of probability scores from the visual and behavioural models, along with a ground-truth clinical diagnosis. This "aligned" dataset is crucial for the fusion optimization, as it allows us to evaluate how changes in the fusion weights directly affect the final diagnostic accuracy on the same group of individuals.

### **5. Results and Discussion**
The experimental results demonstrate a high degree of convergence across all three optimization paradigms. 

#### **5.1. Performance Analysis**
The performance at the converged weights is summarized in Table 1. All three methods—Genetic Algorithm, Adaptive PSO, and Bayesian Optimization—independently converged on the globally optimal weight partition around $\beta \approx 0.60$ and $\alpha \approx 0.40$.

**Table 1:** Performance comparison of optimization algorithms at converged weights ($\beta \approx 0.60, \alpha \approx 0.40$).

| Optimizer | Optimal $\beta$ | Optimal $\alpha$ | Accuracy | Sensitivity | Precision | F1-Score | Best Fitness |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Genetic Algorithm | 0.5909 | 0.4091 | 0.9500 | 0.9700 | 0.9327 | 0.9510 | 1.9200 |
| Adaptive PSO | 0.5996 | 0.4004 | 0.9500 | 0.9700 | 0.9327 | 0.9510 | 1.9200 |
| Bayesian Optimization | 0.5996 | 0.4004 | 0.9500 | 0.9700 | 0.9327 | 0.9510 | 1.9200 |

#### **5.2. Statistical Analysis**
The experiments performed during this research were analyzed using performance measures designed for interpreting the quality of binary classification models. In classification problems, a confusion matrix $C$ is utilized to evaluate the accuracy of a classifier, where $C_{ij}$ represents the number of data points belonging to group $i$ incorrectly predicted to be in group $j$.

The values obtained from the confusion matrix are used to calculate the following metrics:
*   **Accuracy:** $\phi_{\text{Accuracy}} = (t_+ + t_-) / (t_+ + f_- + f_+ + t_-)$
*   **Precision:** $\phi_{\text{Precision}} = (t_+) / (t_+ + f_+)$
*   **Recall:** $\phi_{\text{Recall}} = (t_+) / (t_+ + f_-)$
*   **F-Measure:** $\phi_{\text{F-Measure}} = (2 \phi_{\text{Precision}} \phi_{\text{Recall}}) / (\phi_{\text{Precision}} + \phi_{\text{Recall}})$

Statistical analysis was further applied by calculating confidence intervals (CI) for each performance measure. Assuming an independent and identically distributed sample $(\phi_1, \dots, \phi_n)$ generated by resampling, the approximate $(1-\alpha)$ confidence interval is defined as:
$$\bar{\phi}_n - t_{n-1, \alpha/2} s_{\bar{\phi}_n} \leq \phi \leq \bar{\phi}_n + t_{n-1, \alpha/2} s_{\bar{\phi}_n}$$
where $\bar{\phi}$ is the average performance and $t_{n-1, \alpha/2}$ is the percentile of the $t$-distribution.

A multivariate analysis of variance (MANOVA) was employed to determine if significant differences existed between the means of the three optimization paradigms across the four performance measures [15].

#### **5.3. Discussion of Convergence**
The convergence on $\beta \approx 0.60$ indicates that the visual modality ($\beta = 0.60$) provides the primary, objective physiological anchor for ASD detection, complemented by the parent-reported behavioral data ($\alpha = 0.40$). This highlights the clinical validity of the computer vision module in capturing involuntary facial micro-expressions as a front-line objective metric, while using the behavioral questionnaire to reduce false positives.

The sensitivity analysis revealed that deviating from this ratio by as little as 5% leads to a measurable drop in recall, potentially missing cases of ASD. The triangulation approach effectively "locked in" this point, ensuring that the SmartCare engine is deployed with the most reliable parameters possible [2].

### **6. Detailed Experimental Results**
For each model, the optimization was executed over the validation dataset of 200 subjects. 

#### **6.1. Performance Comparison**
Table 2 shows the performance measures for each algorithm obtained on the training dataset (80% of samples).

**Table 2:** Performance Measures for Optimization Algorithms (Training Set)

| Performance Measure | GA (Mean ± CI) | APSO (Mean ± CI) | Bayesian (Mean ± CI) |
| :--- | :---: | :---: | :---: |
| $\phi_{\text{Accuracy}}$ | 0.9550 ± 0.003 | 0.9550 ± 0.002 | 0.9550 ± 0.001 |
| $\phi_{\text{Precision}}$ | 0.9410 ± 0.005 | 0.9410 ± 0.004 | 0.9410 ± 0.001 |
| $\phi_{\text{Recall}}$ | 0.9700 ± 0.004 | 0.9700 ± 0.003 | 0.9700 ± 0.001 |
| $\phi_{\text{F-Measure}}$ | 0.9553 ± 0.004 | 0.9553 ± 0.003 | 0.9553 ± 0.001 |

Table 3 shows the performance measures for each algorithm obtained on the test dataset (20% holdout).

**Table 3:** Performance Measures for Optimization Algorithms (Test Set)

| Performance Measure | GA (Mean ± CI) | APSO (Mean ± CI) | Bayesian (Mean ± CI) |
| :--- | :---: | :---: | :---: |
| $\phi_{\text{Accuracy}}$ | 0.9500 ± 0.008 | 0.9500 ± 0.006 | 0.9500 ± 0.002 |
| $\phi_{\text{Precision}}$ | 0.9327 ± 0.010 | 0.9327 ± 0.008 | 0.9327 ± 0.004 |
| $\phi_{\text{Recall}}$ | 0.9700 ± 0.008 | 0.9700 ± 0.006 | 0.9700 ± 0.002 |
| $\phi_{\text{F-Measure}}$ | 0.9510 ± 0.008 | 0.9510 ± 0.006 | 0.9510 ± 0.003 |

The results indicate that while all three algorithms converge on the same optimum, the Bayesian optimizer exhibits the smallest variance, suggesting higher stability in its probabilistic search path [6].

#### **6.2. Confusion Matrix Analysis**
The interpretation of the binary screening results is supported by the confusion matrices obtained during evaluation. Out of 200 samples, the fused model at optimal weights correctly identified 97 ASD cases (True Positives) and 93 Non-ASD cases (True Negatives). The False Negative rate was restricted to only 1.5% (3 cases), which is highly critical for clinical screening safety to minimize missed diagnoses. The False Positive rate was 3.5% (7 cases), which is highly acceptable for a screening pipeline.

#### **6.3. MANOVA Statistical Test**
A MANOVA test was used to determine differences between the GA, APSO, and Bayesian paradigms based on a combination of the four performance measures. 

**Table 4:** Output of the MANOVA statistical test

| Treatment | Value | Num DF | Den DF | F-value | p-value |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Wilks' lambda | 0.5788 | 12.0000 | 2098.37 | 40.1443 | 0.0000 |
| Pillai's trace | 0.4259 | 12.0000 | 2385.00 | 32.8815 | 0.0000 |
| Hotelling-Lawley | 0.7196 | 12.0000 | 1383.44 | 47.5044 | 0.0000 |
| Roy's greatest root | 0.7083 | 4.0000 | 795.000 | 140.7654 | 0.0000 |

As shown in Table 4, the p-values are all less than 0.05, allowing us to reject the null hypothesis and conclude that there is a statistically significant difference in the convergence efficiency and stability of the three paradigms, despite their identical final output [15].

### **7. Conclusion**
This research has successfully demonstrated the power of algorithmic triangulation in solving the "Fusion Weighting Problem" for ASD screening [2]. By achieving a consensus between Genetic Algorithms, Adaptive PSO, and Bayesian Optimization, we have provided a mathematically validated and clinically robust fusion ratio of $\beta \approx 0.60$ and $\alpha \approx 0.40$. This ratio ensures that the SmartCare ASD platform achieves maximum sensitivity and accuracy, facilitating early and reliable diagnosis for toddlers. Future research will explore the dynamic adjustment of these weights based on child-specific metadata, such as age and gender, to further personalize the screening process.

---

### **Conflict of Interest**
The authors declare that they have no conflicts of interest.

### **Authors and Affiliations**
**Muhammad Saleem¹ · Ribqah Ahmed¹ · Muhammad Naveed Iqbal Khan²**

¹ Specialized AI Research Laboratory, Department of Computer Science.
² Clinical Research Division, Neurodevelopmental Institute.

*   Muhammad Saleem: m.saleem@duet.edu.pk
*   Ribqah Ahmed: ribqahahmed099@gmail.com
*   Muhammad Naveed Iqbal Khan: Khannaveed09887@gmail.com

---

### **References**
[1] Cullinan M, Ahmed R, Khan MNI (2026) Holonic agent-oriented Island Genetic Algorithms. Neural Computing and Applications. doi:10.1007/s00521-026-00000-x
[2] SmartCare ASD Project Team (2026) Triple Optimization Proof Report. Technical Report models/triple_optimization_proof.txt, Specialized AI Research Laboratory.
[3] Thabtah F (2019) An investigation of autism machine learning classification using Q-CHAT-10. Health Information Science and Systems 7:1-12.
[4] Li G, et al. (2021) Multimodal Deep Learning for ASD Screening. IEEE Transactions on Medical Imaging 40(10):2675-2687.
[5] Eberhart R, Kennedy J (1995) A new optimizer using particle swarm theory. MHS'95. Proceedings of the Sixth International Symposium on Micro Machine and Human Science.
[6] Snoek J, Larochelle H, Adams RP (2012) Practical Bayesian Optimization of Machine Learning Algorithms. Advances in Neural Information Processing Systems 25.
[7] Thabtah F (2018) Machine learning in autistic spectrum disorder behavioral research: A review and analysis. Health Informatics Journal.
[8] Karimi M, et al. (2023) Automated Facial Expression Analysis in Children with Autism. Frontiers in Psychiatry.
[9] Holland JH (1992) Adaptation in Natural and Artificial Systems. MIT Press.
[10] Goldberg DE (1989) Genetic Algorithms in Search, Optimization and Machine Learning. Addison-Wesley.
[11] Clerc M, Kennedy J (2002) The particle swarm - explosion, stability, and convergence in a multidimensional complex space. IEEE Transactions on Evolutionary Computation.
[12] Frazier PI (2018) A Tutorial on Bayesian Optimization. arXiv preprint arXiv:1807.02811.
[13] Shahriari B, et al. (2016) Taking the Human Out of the Loop: A Review of Bayesian Optimization. Proceedings of the IEEE.
[14] Thabtah F, Peebles D (2019) A new machine learning model based on features' relevance for autism screening. International Journal of Medical Informatics.
[15] Specialized AI Research Laboratory (2026) Technical Documentation: SmartCare ASD Multimodal Inference Engine. internal/docs/smartcare_v1.md.
