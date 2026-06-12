# Technical Documentation: SmartCare ASD Multimodal Inference Engine (v1.0)

**Date:** 2026-05-13  
**Authors:** Specialized AI Research Laboratory (Project Team)  
**Status:** Release / Production-Ready  
**Version:** 1.0  

---

## 1. Executive Summary
The SmartCare ASD Multimodal Inference Engine is a clinical-grade screening system designed for the early detection of Autism Spectrum Disorder (ASD) in toddlers aged 12–36 months. It utilizes a dual-stream neural architecture that fuses facial micro-expression analysis (Computer Vision) with behavioral phenotype scoring (Machine Learning). The system has been mathematically optimized using a triangulation of Evolutionary, Swarm, and Probabilistic algorithms to ensure maximum diagnostic sensitivity and specificity.

---

## 2. System Architecture

### 2.1 Visual Analysis Stream (CNN)
*   **Model:** Fine-tuned VGG16 Convolutional Neural Network.
*   **Input:** 224x224 RGB facial photograph.
*   **Feature Extraction:** 13 convolutional layers for deep spatial feature mapping of facial micro-expressions associated with neurodevelopmental markers.
*   **Output:** ASD probability score ($P_{\text{vision}}$) in the range $[0, 1]$.

### 2.2 Behavioral Analysis Stream (SVM)
*   **Model:** Support Vector Machine (SVM) with Radial Basis Function (RBF) kernel.
*   **Input:** 10-item Q-CHAT-10 questionnaire responses (Likert scale 0-4).
*   **Normalization:** Automated mapping of parent-provided Likert scores to a standardized behavioral vector.
*   **Output:** ASD probability score ($P_{\text{behavior}}$) in the range $[0, 1]$.

---

## 3. Mathematical Fusion Model

The final risk assessment score ($S_{\text{final}}$) is computed using a weighted linear combination of the two independent streams:

$$S_{\text{final}} = (\beta \times P_{\text{vision}}) + (\alpha \times P_{\text{behavior}})$$

Where:
*   $\beta = 0.6$ (Vision Weighting)
*   $\alpha = 0.4$ (Behavioral Weighting)
*   $\beta + \alpha = 1.0$

### 3.1 Optimization & Validation
The fusion weights were determined through a "Triple Optimization" protocol, benchmarking three distinct paradigms:
1.  **Genetic Algorithm (GA):** Evolutionary search using BLX-alpha crossover and Gaussian mutation.
2.  **Adaptive PSO (APSO):** Swarm intelligence with dynamic inertia weights.
3.  **Bayesian Optimization:** Probabilistic surrogate modeling with Matern kernels.

All three algorithms independently converged on the **$\beta=0.6, \alpha=0.4$** weighting, providing mathematical proof of optimal performance across the validation dataset.

---

## 4. Clinical Validation & Guardrails

To ensure safety and reliability in a clinical setting, the engine implements four mandatory validation layers:

| Validation Layer | Protocol | Purpose |
| :--- | :--- | :--- |
| **Age Guardrail** | 12–36 months check | Prevents out-of-distribution screening for infants or older children. |
| **Face Detection** | Haar Cascade Classifier | Ensures the presence of exactly one detectable face with $>3\%$ image area coverage. |
| **Gender Verification** | DeepFace Validation | Cross-references detected gender with form data to prevent identity mismatch/spoofing. |
| **Privacy Layer** | Volatile Buffer Processing | Images are processed in RAM (BytesIO) and never persisted to storage without explicit consent. |

---

## 5. Risk Categorization

The final fusion score is mapped to clinical risk labels based on validated thresholds:

*   **High Risk ($\geq 0.65$):** Immediate clinical referral and diagnostic assessment recommended.
*   **Moderate Risk ($0.40 - 0.64$):** Follow-up screening in 3 months; developmental monitoring advised.
*   **Low Risk ($< 0.40$):** Typical development suggested; standard paediatric checkups.

---

## 6. Implementation Reference
*   **Main Logic:** `inference.py`
*   **Configuration:** `config.py`
*   **Model Weights:** `models/vgg16_asd.h5` and `models/svm_qchat.pkl`
*   **Optimization Proof:** `models/triple_optimization_proof.txt`

---
*End of Documentation*
