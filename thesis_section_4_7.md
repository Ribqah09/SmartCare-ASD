## 4.7 Frontend Interface Integration and Screening Output Verification

The integration tests reported in Sections 4.4–4.6 confirmed that the VGG16 visual branch, the SVM behavioural branch, and the weighted fusion service operate correctly at the API and persistence layers. Section 4.7 closes Chapter 4 by verifying the caregiver-facing React client: that intake data are collected under the platform’s privacy constraints, that multimodal inference is invoked in the correct sequence, and that fused outcomes are rendered in a form suitable for parental interpretation and paediatric hand-off.

---

### 4.7.1 User Workflow Overview

The SmartCare ASD frontend is implemented as a linear four-step screening wizard within a React (Vite) single-page application. The design prioritises **data intake isolation**: behavioural responses and biometric uploads are collected only at the stages required for inference, with explicit consent gating for any persistent storage of facial imagery. Navigation, progress indication, and bilingual (English/Urdu) content are unified under a single parent dashboard entry point.

**Authentication and session boundary.** Caregivers access the screening pipeline after authenticating through federated Google Sign-In or conventional email credentials. Successful authentication issues a role-scoped JSON Web Token; only parent accounts may register child profiles, initiate screenings, and retrieve reports. This entry control establishes the first isolation boundary between public marketing content and protected clinical intake functions.

[Insert Figure 4.10: Login interface showing Google Sign-In and parent dashboard entry]

**Child profile selection.** From the parent dashboard, the caregiver registers or selects a child profile constrained to the 12–36 month eligibility window enforced consistently on the client and server. Ineligible profiles remain visible but cannot proceed to screening, reducing invalid submissions before behavioural or visual data are transmitted.

[Insert Figure 4.11: Parent dashboard with child profile list and “Add Child” workflow]

**Q-CHAT-10 behavioural intake.** Step two presents the validated Q-CHAT-10 instrument as a paginated questionnaire. Each item is displayed with item numbering (e.g., “Question 1 of 10”), a progress indicator, contextual hints, and five-point Likert response cards. Selections are encoded as ordinal values and submitted to the backend, where the SVM behavioural branch computes a probability score. This stage completes the first modality of the dual-input framework before any facial data are requested.

**Secure image upload and pre-transmission validation.** Step three introduces the photograph drop-zone. The interface surfaces a prominent **Privacy Protected** notice stating that facial data are processed in ephemeral memory and deleted after inference unless the caregiver grants explicit storage consent. Before upload, the client enforces file type (JPG/PNG), size (≤10 MB), and face-presence checks; the server subsequently validates image quality, age guardrails, and profile–image gender consistency. Together, these layers implement intake isolation by rejecting unsuitable biometric submissions locally and clinically, thereby limiting unnecessary transmission and backend processing.

[Insert Figure 4.12: Photo upload drop-zone with privacy disclaimer, face verification state, and consent checkbox]

**Fusion invocation and report routing.** On confirmation, the client submits the image together with the selected child gender metadata to the inference endpoint. The backend executes CNN visual scoring, retrieves the stored behavioural score, applies the 0.6/0.4 fusion rule, generates a Gemini-supported narrative summary, and produces a downloadable PDF. The caregiver is routed to the results view upon successful completion; validation failures (e.g., gender mismatch or out-of-range age) return structured error responses surfaced as targeted interface notifications without advancing the wizard.

---

### 4.7.2 Output Verification and Reporting

The results interface translates the continuous fused probability into a discrete **Low**, **Moderate**, or **High** risk label using the thresholds configured in the production system (Moderate ≥ 0.40; High ≥ 0.65). This discretisation supports rapid parental comprehension while preserving access to underlying branch scores for clinical review.

**Visual risk encoding.** The results page employs a consistent colour hierarchy aligned with clinical urgency:

| Risk band   | Interface treatment | Caregiver-facing implication                          |
|------------|---------------------|--------------------------------------------------------|
| Low        | Green indicators    | Routine developmental monitoring                       |
| Moderate   | Amber indicators    | Enhanced monitoring; discuss at next well-child visit  |
| High       | Red indicators      | Prompt specialist referral recommended                 |

The primary risk banner, badge styling, and iconography (confirmatory vs. cautionary) reinforce the classification at a glance. Three circular progress rings present the **Vision (CNN, 60% weight)**, **Behaviour (SVM, 40% weight)**, and **Fusion** scores as complementary views of the same decision, enabling caregivers and clinicians to identify which modality contributed most to the outcome without exposing raw model internals.

[Insert Figure 4.13: Screening results view showing colour-coded risk banner, tri-modal score rings, and Gemini clinician summary]

**Clinical narrative and referral support.** Below the quantitative breakdown, the interface renders a plain-language clinician’s summary generated by Google Gemini from the fused scores and individual Q-CHAT responses. For Moderate and High classifications, the client lists recommended referral centres in Pakistan (e.g., IHRI, Karachi; CARTS, Sindh) to support care navigation in settings where specialist services are geographically concentrated. A persistent clinical disclaimer clarifies that the output is a screening aid, not a DSM-5 diagnosis.

**PDF hand-off verification.** A one-click download retrieves the server-generated PDF report, which mirrors the on-screen screening identifier, risk label, branch scores, narrative summary, and recommendations. This artefact serves as the portable record for paediatrician hand-offs, continuity of care, and auditability alongside the immutable database screening entry verified in earlier integration tests.

[Insert Figure 4.14: PDF screening report opened from the results page download action]

**Verification outcome.** End-to-end walkthrough confirms that the frontend correctly orchestrates authentication, behavioural intake, privacy-aware biometric upload, multimodal inference, and report delivery. The colour-coded results view and PDF export satisfy the Chapter 4 objective of demonstrating a complete, caregiver-usable screening pathway built on the dual-input ASD framework established in preceding sections.

---

*Figure placement note:* Capture screenshots from the running application at `http://localhost:5173` (login → `/login`, dashboard → `/dashboard`, wizard → `/screen`, results → `/results` after a completed screening). Save exported images under `docs/thesis/figures/` using the filenames referenced above before final thesis compilation.
