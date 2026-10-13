# Psychology & Behavioral Research

> Evidence-based foundation for design and conversion decisions. Each principle is tagged with proof level, source, limitations, and application notes.

## Proof Level Scale

| Level | Meaning |
|-------|---------|
| **Strong** | Replicated across multiple peer-reviewed studies / meta-analyses |
| **Moderate** | Supported by published research, some replication, or robust applied evidence |
| **Weak** | Limited studies, mixed results, or mostly applied/industry evidence |
| **Contested** | Conflicting evidence or failed replications in relevant contexts |
| **Rejected** | Popular marketing claim with no credible scientific support |

> **Rule**: Never present a "Weak", "Contested", or "Rejected" principle as scientific fact. Always expose the level.

---

## 1. Attention & Perception

### 1.1 Visual Hierarchy

- **Definition**: Users scan pages in predictable patterns; size, contrast, and position determine what is seen first.
- **Mechanism**: Pre-attentive processing — certain visual features (color, size, orientation) are detected before conscious attention.
- **Proof level**: **Strong**
- **Source**: Ware, C. (2012). *Information Visualization: Perception for Design* (3rd ed.). Morgan Kaufmann. / Tullis, T. & Wood, L. (1986). "How layout affects information acquisition." In *Screen Design Manual*.
- **Application**: Hero headline > subheadline > CTA in size/contrast; one focal point per viewport.
- **Limits**: F-pattern / Z-pattern research (Nielsen) is based on limited eye-tracking samples; treat as heuristic, not law.
- **Example**: Stripe homepage — single dominant headline, one primary CTA, supporting elements visibly secondary.

### 1.2 Fitts's Law

- **Definition**: Time to reach a target is a function of distance and target size.
- **Mechanism**: Motor control — larger/nearer targets are faster to acquire.
- **Proof level**: **Strong** (decades of replication since 1954)
- **Source**: Fitts, P.M. (1954). "The information capacity of the human motor system in controlling the amplitude of movement." *Journal of Experimental Psychology*, 47(6), 381–391.
- **Application**: CTA buttons ≥ 44×44px touch target (WCAG 2.5.5); primary CTA placed within easy reach; adequate spacing between interactive elements.
- **Limits**: Applies most directly to pointer/touch interaction; less about visual design, more about ergonomics.

### 1.3 Hick's Law

- **Definition**: Decision time increases with the number and complexity of choices.
- **Mechanism**: Information processing — more stimuli = longer selection time.
- **Proof level**: **Strong**
- **Source**: Hick, W.E. (1952). "On the rate of gain of information." *Quarterly Journal of Experimental Psychology*, 4(1), 11–26. / Hyman, R. (1953). "Stimulus information as a determinant of reaction time."
- **Application**: Limit hero to 1 primary CTA + 1 secondary; pricing pages: default-highlight one plan; avoid decision overload.
- **Limits**: Reduced when choices are categorically distinct or user has expertise. Does not mean "always offer fewer options" — it means "reduce unnecessary choice complexity."

### 1.4 Attention Is a Finite Resource

- **Definition**: Selective attention filters stimuli; unattended information is not processed.
- **Mechanism**: Bottleneck models of attention (Broadbent, Treisman).
- **Proof level**: **Strong**
- **Source**: Broadbent, D.E. (1958). *Perception and Communication*. / Lavie, N. (1995). "Perceptual load as a necessary condition for selective attention." *Journal of Experimental Psychology: HPP*, 21(2), 451–468.
- **Application**: One message per section; avoid competing CTAs; whitespace is functional (reduces load).
- **Limits**: Lavie's load theory shows high perceptual load can actually *increase* distraction in some cases — the relationship is not linear.

---

## 2. Cognitive Load & Memory

### 2.1 Cognitive Load Theory

- **Definition**: Working memory has limited capacity; instructional/Interface design should minimize extraneous load.
- **Mechanism**: Sweller's CLT — three types: intrinsic, extraneous, germane.
- **Proof level**: **Strong** (extensive research in education; growing in UX)
- **Source**: Sweller, J. (1988). "Cognitive load during problem solving: Effects on learning." *Cognitive Science*, 12(2), 257–285. / Sweller, J., van Merriënboer, J. & Paas, F. (2019). "Cognitive Architecture and Instructional Design." *Educational Psychology Review*, 31, 291–312.
- **Application**: Break content into chunks; progressive disclosure for complex pricing; limit form fields per step; use familiar patterns.
- **Limits**: CLT originated in educational contexts; direct transfer to marketing pages is inferred, not directly tested. Effects vary by domain expertise.

### 2.2 Miller's Law (Working Memory Capacity)

- **Definition**: Working memory holds approximately 7±2 items.
- **Proof level**: **Moderate** — original 1956 paper influential but subsequent research suggests 4±1 for complex items (Cowan, 2001).
- **Source**: Miller, G.A. (1956). "The magical number seven, plus or minus two." *Psychological Review*, 63(2), 81–97. / Cowan, N. (2001). "The magical number 4 in short-term memory." *Behavioral and Brain Sciences*, 24(1), 87–114.
- **Application**: Navigation items ≤ 5–7; feature grids ≤ 6 per row; pricing tiers ≤ 4.
- **Limits**: Do not cite "7±2" as precise fact — Cowan's 4±1 is more accurate for meaningful chunks. The practical takeaway (limit simultaneous items) is robust.

### 2.3 Recognition Over Recall

- **Definition**: It is easier to recognize options than to recall them from memory.
- **Proof level**: **Strong**
- **Source**: Nielsen, J. (1993). *Usability Engineering*. Academic Press. / Norman, D. (1988). *The Design of Everyday Things*. (Gulf of affordances, recognition as core usability principle)
- **Application**: Show navigation options (not hidden hamburger on desktop); display plan features (not "contact us for details"); visible form labels (not placeholder-only).
- **Limits**: Recognition interfaces take more screen space than recall interfaces.

### 2.4 Serial Position Effect

- **Definition**: Users best recall the first and last items in a sequence (primacy and recency).
- **Proof level**: **Strong** (Ebbinghaus onward, extensively replicated)
- **Source**: Ebbinghaus, H. (1885). *Über das Gedächtnis*. / Murdock, B.B. (1962). "The serial position effect of free recall." *Journal of Experimental Psychology*, 64(5), 482–488.
- **Application**: Place most important features first and last in grids; key benefit at top of feature list; CTA repeated at beginning and end of page.
- **Limits**: Recency effect degrades with delay/distraction; primacy stronger for meaningful material.

---

## 3. Decision-Making & Heuristics

### 3.1 Dual-Process Theory (System 1 / System 2)

- **Definition**: Fast, intuitive (System 1) vs. slow, deliberative (System 2) thinking; most decisions are System 1.
- **Proof level**: **Moderate-to-Strong** — foundational in behavioral economics; some critiques of oversimplification (Kruglanski's UC-6 model).
- **Source**: Kahneman, D. (2011). *Thinking, Fast and Slow*. Farrar, Straus and Giroux. / Evans, J.St.B.T. & Stanovich, K.E. (2013). "Dual-process theories of higher cognition." *Perspectives on Psychological Science*, 8(3), 223–241.
- **Application**: Reduce friction for first-time visitors (System 1: emotional, visual); provide depth for evaluators (System 2: comparison tables, docs).
- **Limits**: "System 1/System 2" is a metaphor, not a literal brain structure. Don't claim to "hack System 1."

### 3.2 Anchoring

- **Definition**: Initial information disproportionately influences subsequent judgments.
- **Proof level**: **Strong** (core behavioral economics finding, replicated widely)
- **Source**: Tversky, A. & Kahneman, D. (1974). "Judgment under Uncertainty: Heuristics and Biases." *Science*, 185(4157), 1124–1131. / Ariely, D., Loewenstein, G. & Prelec, D. (2003). "Coherent arbitrariness." *Quarterly Journal of Economics*, 118(1), 73–105.
- **Application**: Show annual plan (higher anchor) before monthly; display "was $X" with real historical price; show the highest-value plan first in comparison.
- **Limits / Ethics**: Anchoring with fabricated prices is dishonest and may be illegal (see [ETHICS.md](ETHICS.md)). Only anchor with genuine, verifiable reference points.

### 3.3 Loss Aversion

- **Definition**: Losses feel roughly 2× more painful than equivalent gains feel pleasurable.
- **Proof level**: **Moderate** — original 2× estimate (Kahneman & Tversky 1979) is well-known; meta-analyses (Gal & Rucker 2018) show the effect exists but magnitude is debated and context-dependent.
- **Source**: Kahneman, D. & Tversky, A. (1979). "Prospect Theory: An Analysis of Decision under Risk." *Econometrica*, 47(2), 263–291. / Gal, D. & Rucker, D.D. (2018). "The Loss of Loss Aversion." *Journal of Consumer Psychology*, 28(3), 497–516.
- **Application**: Frame value as "avoid lost time / lost revenue" alongside gains; free trial framed as "don't lose your data when trial ends" (honest version); risk-reversal ("cancel anytime, no lock-in").
- **Limits**: The specific "2×" figure is contested. Loss aversion effects are weaker than originally claimed in many consumer contexts. Never manufacture fake losses.

### 3.4 Social Proof (Informational)

- **Definition**: People infer correct behavior from others' behavior, especially under uncertainty.
- **Proof level**: **Strong** (original research) / **Moderate** for marketing applications
- **Source**: Cialdini, R.B. (2001). "Influence: Science and Practice" (4th ed.). Allyn & Bacon. / Sherif, M. (1936). *The Psychology of Social Norms*. / Denrell, J. & Le Mens, G. (2004). "The social construction of the social brain."
- **Application**: Authentic testimonials with names/roles/photos; real customer counts ("Trusted by 2,000+ teams" — must be true); logo clouds of actual customers; verified reviews.
- **Limits**: Fabricated social proof (fake reviews, fake user counts) is fraud-adjacent. Social proof is weakest when the audience is expert or the product category is unique. See [ETHICS.md](ETHICS.md).

### 3.5 Scarcity (Genuine Only)

- **Definition**: Perceived scarcity increases perceived value and urgency.
- **Proof level**: **Moderate** — well-documented in Cialdini's work and Worchel et al. (1975); effects moderated by product type and consumer skepticism.
- **Source**: Worchel, S., Lee, J. & Adewole, A. (1975). "Effects of supply and demand on ratings of object value." *Journal of Personality and Social Psychology*, 32(5), 906–914. / Cialdini (2001).
- **Application**: Genuine seat limits in beta programs; real deadline pricing; authentic inventory signals for physical products.
- **Limits**: Fake scarcity (fake countdown timers, fake stock counts) triggers skepticism and destroys trust — the opposite effect. Digital SaaS rarely has genuine scarcity; do not manufacture it.

### 3.6 The Framing Effect

- **Definition**: Equivalent information presented differently leads to different decisions.
- **Proof level**: **Strong**
- **Source**: Tversky, A. & Kahneman, D. (1981). "The framing of decisions and the psychology of choice." *Science*, 211(4481), 453–458.
- **Application**: "$8.25/mo billed annually" vs "$99/year" — choose the frame that maximizes clarity (not just conversion); "Start free" vs "Sign up" — outcome-oriented framing.
- **Limits**: Heavily exploited in dark patterns (obfuscating true cost). Ethical framing = clarity enhancement, not deception.

---

## 4. Trust & Credibility

### 4.1 Source Credibility

- **Definition**: Perceived expertise, trustworthiness, and attractiveness of a source influence persuasion.
- **Proof level**: **Strong**
- **Source**: Hovland, C.I. & Weiss, W. (1951). "The influence of source credibility on communication effectiveness." *Public Opinion Quarterly*, 15(4), 635–650. / Ohanian, R. (1990). "Construction and validation of a scale to measure expert endorsers' perceived credibility."
- **Application**: Specific testimonials (real name, title, company, photo); expert endorsements with real credentials; transparent "About" and "Contact" information.
- **Limits**: Credibility is transferable only when source-product fit exists. Fake credentials are fraud.

### 4.2 Trust Signals in E-Commerce/HCI

- **Definition**: Visible security, privacy, and guarantee signals reduce perceived risk and increase conversion.
- **Proof level**: **Moderate**
- **Source**: Bonetti, F., Zamecnik, P.K. & de Vries, P.W. (2009). "Developing trustworthiness on the Internet." *The Design of Everyday Things* (applied). / McKinsey & Company research on trust indicators (industry). / Nadkarni, S. & Gupta, H.R. (2007). "A causal model of e-trust." (academic)
- **Application**: Money-back guarantee badges (with actual policy link); SSL/security indicators; privacy policy link near forms; real contact info.
- **Limits**: Trust badges show diminishing returns; some studies show no effect when baseline trust is already high. Avoid badge clutter (the "trust badge soup" anti-pattern).

### 4.3 The Mere Exposure Effect (Branding)

- **Definition**: Repeated exposure to a stimulus increases liking.
- **Proof level**: **Strong**
- **Source**: Zajonc, R.B. (1968). "Attitudinal effects of mere exposure." *Journal of Personality and Social Psychology*, 9(2, Pt.2), 1–27.
- **Application**: Consistent visual identity across pages; logo placement in sticky nav; brand color consistency.
- **Limits**: Effect plateaus and can reverse with very high exposure or negative stimuli.

---

## 5. Motivation & Action

### 5.1 Self-Determination Theory (Autonomy, Competence, Relatedness)

- **Definition**: Intrinsic motivation is driven by three basic psychological needs.
- **Proof level**: **Strong** (extensively validated across domains)
- **Source**: Deci, E.L. & Ryan, R.M. (2000). "The 'what' and 'why' of goal pursuits." *Psychological Inquiry*, 11(4), 227–268. / Ryan, R.M. & Deci, E.L. (2017). *Self-Determination Theory*. Guilford Press.
- **Application**: CTAs emphasizing autonomy ("Start your free trial" = user control, not "Buy now"); onboarding copy supporting competence ("You're all set!"); social features for relatedness.
- **Limits**: Primarily developed for motivation/education research; application to marketing copy is inferred from theory, not directly tested in landing page contexts.

### 5.2 Goal-Gradient Effect

- **Definition**: Effort toward a goal increases as the person approaches the goal.
- **Proof level**: **Moderate**
- **Source**: Hull, C.L. (1932). "The goal-gradient hypothesis and maze learning." *Psychological Review*, 39(1), 25–34. / Kivetz, R., Urminsky, I. & Zheng, Y. (2006). "The goal-gradient hypothesis resurrected." *Journal of Marketing Research*, 43(1), 59–72.
- **Application**: Multi-step signup with visible progress; onboarding checklist with partial completion shown; progressive profiling (don't ask everything at once).
- **Limits**: Primarily demonstrated in loyalty programs and gamified contexts. Don't fake progress bars on forms that don't actually progress.

### 5.3 Implementation Intentions (If-Then Planning)

- **Definition**: Specific if-then plans significantly increase goal attainment.
- **Proof level**: **Strong** (meta-analyses: Gollwitzer & Sheeran 2006, d = 0.65)
- **Source**: Gollwitzer, P.M. & Sheeran, P. (2006). "Implementation Intentions and Goal Achievement." In *Advances in Experimental Social Psychology*, Vol. 38. Elsevier.
- **Application**: CTA copy that prompts specific planning ("Add to calendar: Demo Thursday 2pm"); follow-up emails with specific next steps.
- **Limits**: Effect size (d = 0.65) is for goal-pursuit contexts generally, not specifically for landing page CTAs.

### 5.4 Reducing Perceived Risk

- **Definition**: Consumers avoid transactions with high perceived risk (financial, functional, social, psychological).
- **Proof level**: **Moderate** (well-established in consumer behavior literature)
- **Source**: Mitchell, V.-W. (1999). "Consumer perceived risk: conceptualisations and models." *European Journal of Marketing*, 33(1/2), 163–195. / Taylor, J.W. (1974). "The role of risk in consumer behavior."
- **Application**: Free trials (no financial risk); money-back guarantees (financial risk); demos (functional risk); case studies from similar companies (social risk); transparent pricing (uncertainty risk).
- **Limits**: Risk reduction techniques work best when risk is genuinely reduced — not just hidden.

---

## 6. Principles REJECTED or Corrected

| Claim | Status | Why |
|-------|--------|-----|
| "Color X increases conversions by Y%" | **Rejected** | No credible controlled research supports universal color→conversion causal claims. Context, contrast, and brand matter more than hue. |
| "Neuro-marketing proves this layout works" | **Rejected** | fMRI/EEG marketing studies have small samples, poor ecological validity, and rarely replicate. |
| "The subcortex is triggered by..." | **Rejected** | Neuro-pseudoscience. No legitimate evidence marketing techniques "bypass conscious thought." |
| "Users only read 20% of a page" | **Contested** | Nielsen's F-pattern reading claim is based on limited eye-tracking; users actually vary behavior significantly by content type and motivation. |
| "7±2 items in working memory" | **Corrected** | Cowan (2001) shows ~4±1 for meaningful complex items. Use ≤ 6 as practical guideline, not 7 as magic number. |
| "Loss aversion = 2×" | **Corrected** | Original Kahneman & Tversky estimate; Gal & Rucker (2018) show the effect is real but smaller and more context-dependent than claimed. |
| "Scarcity always increases desire" | **Corrected** | Genuine scarcity works; fake scarcity backfires with skeptical audiences (modern consumers are highly skeptical). |
| "The Z-pattern governs all page scanning" | **Contested** | Eyetracking patterns are highly content-dependent. Use visual hierarchy principles, not rigid pattern templates. |
| "First impression in 3 seconds" | **Weak** | Various "3-second rule" claims lack rigorous citation. Trust formation research (Fogg) suggests credibility judgments are fast but the exact timeframe varies. |
| "Dopamine from clicking CTA buttons" | **Rejected** | No legitimate research supports "CTA buttons trigger dopamine loops." Neuro-pseudoscience. |

---

## 7. Conversion Funnel: Mechanism Map

The conversion journey maps to documented mechanisms:

```
ATTENTION
  └─ Visual hierarchy (Strong) / Pre-attentive processing (Strong)
  └─ Fitts's Law for interactive targets (Strong)

COMPREHENSION
  └─ Cognitive Load Theory → chunking (Strong, transfer inferred)
  └─ Recognition over recall (Strong)
  └─ Hick's Law → limited choices (Strong)

TRUST
  └─ Source credibility (Strong)
  └─ Social proof — informational (Strong/Moderate)
  └─ Trust signals / risk reduction (Moderate)

INTEREST
  └─ Framing effects (Strong)
  └─ Self-Determination Theory → autonomy-supportive copy (Strong)
  └─ Mere exposure → brand consistency (Strong)

ACTION
  └─ Loss aversion → risk reversal (Moderate)
  └─ Anchoring → reference pricing (Strong, ethics-constrained)
  └─ Goal-gradient → progressive onboarding (Moderate)
  └─ Implementation intentions → specific CTA copy (Strong)
  └─ Reducing perceived risk → trials/guarantees (Moderate)
```

---

## 8. Evidence Hierarchy for Our Decisions

When making design/conversion decisions, evidence priority:

1. **Meta-analyses & systematic reviews** (strongest)
2. **Peer-reviewed replications**
3. **Single peer-reviewed studies** (flag limitations)
4. **Applied industry research** (Baymard, NN/g, CXL — useful, but not academic-grade)
5. **Expert heuristic** (defensible opinion, label as such)
6. **Blog article / marketing claim** (never sufficient alone)

> We use level 4–5 sources for practical heuristics but NEVER present them as level 1–3 scientific findings.

---

*Next: [Conversion](CONVERSION.md) — Frameworks for different SaaS types*