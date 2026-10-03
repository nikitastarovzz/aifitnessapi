import type { ClusterEntry } from "@/lib/cluster";

/**
 * AUTO-ASSEMBLED health-data compliance & privacy pages (originally
 * auto-assembled; since hand-edited — edit here). Article + FAQPage (no HowTo).
 * General engineering guidance, not legal advice (see ClusterDisclaimer legal
 * variant). Consumer-app default stated plainly; HIPAA applicability not overstated.
 */
export const complianceEntries: ClusterEntry[] =
[
  {
    "slug": "hipaa-compliance-fitness-app",
    "primaryQuery": "does my fitness app need to be hipaa compliant",
    "h1": "Does My Fitness App Need to Be HIPAA Compliant?",
    "metaTitle": "Does My Fitness App Need to Be HIPAA Compliant?",
    "metaDescription": "Most direct-to-consumer fitness apps aren't HIPAA covered. Learn when HIPAA applies, when it doesn't, and what rules apply instead.",
    "updated": "2026-07-14",
    "answer": "Usually no. HIPAA binds only covered entities (providers, health plans, clearinghouses) and their business associates, so a direct-to-consumer fitness app that collects data for its own users generally falls outside it. HIPAA does apply if you build or run the app on behalf of a covered entity under a Business Associate Agreement. But being outside HIPAA is not being unregulated: the FTC Health Breach Notification Rule, GDPR, and state consumer-health laws usually apply instead. This is general guidance, not legal advice, so confirm your status with a qualified professional.",
    "body": "## Does HIPAA apply to your app?\n\nHIPAA applies only to two kinds of entities. If you are neither, you do not have to comply with the HIPAA Rules.\n\n- **Covered entities** — health care providers who transmit health information electronically for covered transactions, health plans, and health care clearinghouses.\n- **Business associates** — a person or company that creates, receives, maintains, or transmits Protected Health Information (PHI) *on behalf of* a covered entity, under a signed Business Associate Agreement (BAA).\n\nPer HHS guidance, if you offer services **directly to and collect information for or on behalf of consumers** — and not on behalf of a provider, health plan, or clearinghouse — you are **not likely subject to HIPAA** as either a covered entity or a business associate. Data a user downloads or enters into an app for personal use is generally not protected by HIPAA, regardless of where it originally came from, unless the app was provided by a covered entity or its business associate. In fact, once a covered entity sends PHI to a consumer app at the individual's direction, that data is no longer subject to HIPAA in the app's hands.\n\nThe deciding factor is the **relationship and purpose** — are you doing a covered entity's work? — not the sensitivity of the data. A heart-rate reading is only \"PHI\" when a covered entity or business associate holds it; the identical reading in a standalone consumer app is not PHI. For the full breakdown of PHI versus other data labels, see [is fitness data PHI?](/compliance/is-fitness-data-phi).\n\n## When a fitness app *does* fall under HIPAA\n\nHIPAA can pull your app in when you step into a covered entity's shoes. Typical triggers:\n\n- You **build or offer the app on behalf of a covered entity** (or that entity's contractor or business associate) — you may be a business associate.\n- **B2B2C deployments** where a hospital, provider, or health plan sponsors or offers the app to its patients or members.\n- The app is contracted to handle PHI **for** the covered entity, and you **sign a BAA**.\n\nRule of thumb: if a provider or plan is paying you to handle their patients' data, assume HIPAA is in scope and get advice.\n\n## What HIPAA requires *if* you are covered\n\nIf you are a covered entity or business associate, these are the obligations at a high level. This is not a compliance checklist — HIPAA compliance is contextual and should be confirmed with a qualified professional.\n\n| Requirement | What it means for your app |\n| --- | --- |\n| Privacy Rule | Limits uses and disclosures of PHI, applies \"minimum necessary,\" and grants individual rights (access, amendment, accounting of disclosures). |\n| Security Rule | For electronic PHI: administrative, physical, and technical safeguards — access controls, audit controls, risk analysis, and encryption (currently \"addressable\"). |\n| Breach Notification Rule | The HIPAA breach rule (distinct from the FTC rule below). |\n| Business Associate Agreements | A BAA with every downstream vendor that touches PHI. |\n\nTwo cautions: penalty amounts are inflation-adjusted annually, so verify current figures at HHS before relying on any number. And there is no official HHS \"HIPAA certification\" — any vendor claiming one is a red flag.\n\n## What applies *instead* for consumer apps\n\nThis is the part most builders miss. \"Not HIPAA\" does not mean \"unregulated.\" For a typical consumer fitness app, these usually matter more than HIPAA:\n\n- **FTC Health Breach Notification Rule (HBNR).** For consumer health apps not covered by HIPAA, this is often the operative breach law. A 2024 update (effective July 29, 2024) made explicit that makers of health apps, connected devices, and similar products are covered. It reaches vendors of personal health records and their service providers — precisely the non-HIPAA world. A \"breach of security\" is read broadly, and can include unauthorized disclosures such as sharing health data with third-party ad tech, not just outside hacks (verify exact phrasing against the final rule). When triggered, you must notify affected individuals, the FTC, and — for large breaches — the media.\n- **FTC Act Section 5.** Unfair or deceptive practices are a baseline for all US consumer apps — a broken privacy promise is an enforcement risk independent of HIPAA or the HBNR.\n- **GDPR** for EU users. Fitness and wearable metrics are generally treated as special-category \"data concerning health,\" and GDPR applies to non-EU companies that offer services to or monitor people in the EU. See [GDPR for fitness apps](/compliance/gdpr-fitness-app).\n- **State consumer-health laws** such as Washington's My Health My Data Act, Nevada's SB 370, and Connecticut's amendments. These use deliberately broad \"consumer health data\" definitions that capture the wearable and workout data HIPAA leaves untouched, and often require opt-in consent — Washington even adds a private right of action. Treat the state landscape as fast-moving and verify the current roster as of 2026.\n- **App-store policy.** Apple and Google impose their own health-data requirements (consent, disclosure, and bans on selling health data) that often bite before any statute does. See [Apple's health-data rules](/compliance/app-store-health-data-rules) and [Google Play's health-data policy](/compliance/google-play-health-data-policy).\n\n## What this means for your fitness app\n\n- Do **not** market a standalone consumer app as \"HIPAA compliant.\" It is usually inapplicable and can mislead users.\n- Do **not** assume that being outside HIPAA leaves you unregulated — map your real obligations to the FTC HBNR, GDPR, and state laws.\n- Remember an OS permission grant (a HealthKit or Health Connect prompt) is a device access control, not automatically a legal consent basis.\n- The safe engineering posture — consent, data minimization, encryption, access control, and deletion — satisfies GDPR and state consumer-health laws even where HIPAA does not apply. See [storing health data securely](/compliance/store-health-data-securely).\n\n## A note on limits\n\nWhether HIPAA, the FTC rule, GDPR, or a state law applies turns on your specific relationships, users, and jurisdictions — and several of these rules are actively changing in 2026. Use this as a starting map, verify the current text of any rule you rely on, and get advice from a qualified professional for your particular case.",
    "faqs": [
      {
        "q": "Is a consumer fitness app automatically covered by HIPAA because it handles health data?",
        "a": "No. HIPAA is tied to covered entities and business associates, not to the sensitivity of the data. Per HHS guidance, an app that collects information directly from and for consumers is not likely subject to HIPAA. The same heart-rate reading is PHI only when a covered entity or business associate holds it."
      },
      {
        "q": "When would my fitness app actually fall under HIPAA?",
        "a": "Typically when you build or offer the app on behalf of a covered entity, or in B2B2C deployments where a provider or health plan sponsors the app to its patients or members and you sign a Business Associate Agreement to handle PHI for them. The relationship and purpose decide it, not the data type."
      },
      {
        "q": "If HIPAA doesn't apply, is my app unregulated?",
        "a": "No. Non-HIPAA health apps still face the FTC Health Breach Notification Rule (updated in 2024 to cover health apps and connected devices), the FTC Act's ban on deceptive practices, GDPR for EU users, state consumer-health laws like Washington's My Health My Data Act, and app-store policies. These often matter more than HIPAA for consumer apps."
      },
      {
        "q": "Can I advertise my consumer app as HIPAA compliant?",
        "a": "It is usually the wrong claim for a standalone consumer app and can mislead users, since HIPAA typically does not apply. There is also no official HHS HIPAA certification, so any vendor claiming one is a red flag. Focus on the rules that do apply to you and verify current requirements with a professional."
      }
    ],
    "related": [
      {
        "href": "/compliance/is-fitness-data-phi",
        "label": "Is fitness data PHI or PII?"
      },
      {
        "href": "/compliance/gdpr-fitness-app",
        "label": "GDPR for fitness & health apps"
      },
      {
        "href": "/compliance/health-app-privacy-policy",
        "label": "Health app privacy policy"
      },
      {
        "href": "/compliance",
        "label": "Health-data compliance & privacy"
      }
    ],
    "cta": {
      "pitch": "Health-data rules shift fast in 2026 across the FTC, GDPR, and state laws; subscribe for plain-English updates on what changes for fitness apps."
    }
  },
  {
    "slug": "gdpr-fitness-app",
    "primaryQuery": "gdpr for fitness apps",
    "h1": "GDPR for Fitness Apps: What Developers Need to Know",
    "metaTitle": "GDPR for Fitness Apps: A Developer's Guide",
    "metaDescription": "Does GDPR apply to your fitness app? How EU rules treat wearable data as health data, plus lawful basis, consent, and core obligations for developers.",
    "updated": "2026-07-14",
    "answer": "If your fitness app has users in the EU, GDPR almost certainly applies, even to a US company, because offering a service to or monitoring EU users brings you into scope. Fitness and wearable metrics are generally treated as special-category health data, so you typically need explicit consent plus a lawful basis and must support user rights like access, portability, and erasure. This is general guidance, not legal advice; how GDPR applies depends on what your app does, so confirm your obligations with a qualified professional.",
    "body": "## Does GDPR apply to a US fitness app?\n\nYes, if you offer your service to people in the EU or monitor their behaviour there. GDPR's territorial scope (Article 3) reaches a controller or processor that is not established in the EU whenever the processing relates to:\n\n- **offering goods or services** to data subjects in the Union, or\n- **monitoring their behaviour** within the Union.\n\nA US-based startup with an app that EU users can download, sign up for, and use is offering a service to EU data subjects — so it is in scope. Tracking EU users' activity (steps, workouts, sleep) also counts as monitoring behaviour. \"We're a US company, so GDPR doesn't apply\" is one of the most common — and most expensive — misreadings.\n\nIn-scope non-EU controllers generally also have to appoint an **EU representative** (Article 27), with limited exceptions. Verify whether an exception fits your case.\n\n## Why fitness data is treated as \"special category\" health data\n\nGDPR Article 9 prohibits processing \"special categories\" of personal data — including **data concerning health**, plus genetic and biometric data used to identify a person — unless a specific Article 9(2) condition applies. EU regulators read \"data concerning health\" broadly, and fitness, wearable, and workout metrics (heart rate, sleep, steps that reveal something about health, and similar) are generally treated as health data. That means the default is: processing is prohibited unless you fit an exception.\n\nThe practical consequence is that you need **two things stacked together**, not one:\n\n| Layer | What it is | Typical route for a fitness app |\n|---|---|---|\n| Article 6 lawful basis | A general basis for any processing | Consent, contract, or legitimate interests, depending on the processing |\n| Article 9 condition | An extra condition for special-category (health) data | Explicit consent (Article 9(2)(a)) is the usual route |\n\nOne does not substitute for the other. Relying on a single \"lawful basis\" is a frequent mistake — for health data you generally need both an Article 6 basis and a separate Article 9 condition.\n\nA caution on consent: it is not always valid where there is a power imbalance. In an employer–employee wellness program, for example, regulators warn that consent may not be genuinely \"freely given.\" For the consent standard itself, see our [health data user consent](/compliance/health-data-user-consent) page.\n\n## What GDPR generally requires\n\n| Obligation | What it means for your app |\n|---|---|\n| Lawful basis + transparency | Identify your Article 6 basis and Article 9 condition; give users a clear privacy notice (Articles 12–14). See our [health app privacy policy](/compliance/health-app-privacy-policy) guide. |\n| Data subject rights | Support access, rectification, **erasure** (\"right to be forgotten\"), restriction, **data portability**, and objection (Articles 15–22). |\n| Records of processing | Maintain records of processing activities (Article 30); a DPIA (Article 35) is typically expected for large-scale health-data processing. |\n| Data Protection Officer | Required where core activities involve large-scale processing of special-category data — a fitness app at scale often meets this. Verify against your specific processing scale. |\n| Breach notification | Notify the supervisory authority without undue delay and, where feasible, within **72 hours** of becoming aware — unless the breach is unlikely to risk people's rights. Notify affected individuals if the risk is high (Article 33). |\n| International transfers | Transfers out of the EEA need a mechanism — Standard Contractual Clauses (SCCs), an adequacy decision, or the EU–US Data Privacy Framework. Verify current DPF certification status as of 2026. |\n\n### The consent standard\n\nWhere you rely on consent, it must be **freely given, specific, informed, and unambiguous** — a clear affirmative action — and it must be **withdrawable at any time**, as easily as it was given. Explicit consent (the higher bar Article 9 needs for health data) means an express opt-in statement, not something implied. A pre-ticked box or consent bundled into your general terms is not valid consent.\n\nOne distinction worth burning in: an OS permission prompt is **not** the same as GDPR consent. An iOS HealthKit authorization sheet or an Android Health Connect grant is a device-level access control — it decides whether your app can read those data types. It is not automatically a lawful basis for what you then do with the data. You typically still need separate, GDPR-valid consent (or another lawful basis). For how OAuth scopes fit in, see [what is OAuth for health data](/learn/what-is-oauth-for-health-data).\n\n## What this means for a fitness app\n\n- **Assume you're in scope** the moment you have EU users, and plan for it rather than bolting it on later.\n- **Design consent as a separate, granular opt-in** for health data — not a pre-ticked box, not buried in your terms — and make withdrawal a one-step action. Keep versioned records of who consented, when, and to what.\n- **Build the data-subject rights in as features**, especially access, export (portability), and deletion — see [health data retention and deletion](/compliance/health-data-retention-deletion) for how erasure interacts with retention.\n- **Map your transfers.** If EU user data leaves the EEA (a US-hosted backend counts), put a transfer mechanism in place.\n- **Know your thresholds.** Whether you need a DPO or a DPIA depends on your scale of processing — verify these rather than assuming.\n- Note that GDPR is about health data as a category, not about being \"HIPAA compliant.\" Whether your data is even PHI is a separate question — see [is fitness data PHI](/compliance/is-fitness-data-phi).\n\n## A note on the UK, and on limits\n\nPost-Brexit, the **UK GDPR** (alongside the Data Protection Act 2018) mirrors the EU regime but is administered by UK bodies (the ICO) with its own guidance. Treat the UK as a separate-but-parallel compliance target if you have UK users. UK reforms are ongoing, so verify the current UK position as of 2026.\n\nFinally, the maximum GDPR fine tier is often quoted as \"4% of turnover.\" The actual ceiling is **up to €20M or 4% of global annual turnover, whichever is higher** — but that is a maximum applied case-by-case, not a flat rate. Verify figures before quoting them.\n\nJurisdiction and application vary with what your app actually does. Use this as a starting map, not a compliance sign-off, and get advice from a qualified professional for your specific case.",
    "faqs": [
      {
        "q": "Does GDPR apply to a US fitness app with EU users?",
        "a": "Generally yes. GDPR's territorial scope (Article 3) reaches non-EU companies that offer goods or services to people in the EU or monitor their behaviour there. A US app that EU users can download and use is offering a service to EU data subjects, so it is in scope. In-scope non-EU controllers usually also need to appoint an EU representative (Article 27), with limited exceptions to verify."
      },
      {
        "q": "Is fitness or wearable data considered health data under GDPR?",
        "a": "Usually. GDPR Article 9 treats 'data concerning health' as a protected special category, and EU regulators read that broadly. Fitness, wearable, and workout metrics such as heart rate, sleep, and activity are generally treated as health data, which means processing is prohibited unless a specific Article 9 condition applies."
      },
      {
        "q": "Is explicit consent always required for health data?",
        "a": "Explicit consent is the usual route for a consumer fitness app, but it is not the only one. For special-category health data you generally need both an Article 6 lawful basis and a separate Article 9 condition; explicit consent can satisfy the Article 9 side. Consent must be freely given, specific, informed, unambiguous, and withdrawable. Note that consent may not be valid where there is a power imbalance, such as employer wellness programs. Confirm the right basis for your case."
      },
      {
        "q": "Is an iOS or Android health permission the same as GDPR consent?",
        "a": "No. A HealthKit authorization sheet or a Health Connect permission grant is a device-level access control that decides whether your app can read those data types. It is not automatically a GDPR lawful basis for what you then do with the data. You typically still need separate, GDPR-valid consent or another lawful basis for your downstream processing."
      },
      {
        "q": "How quickly must I report a data breach under GDPR?",
        "a": "Under Article 33 you must notify the relevant supervisory authority without undue delay and, where feasible, within 72 hours of becoming aware of a personal data breach, unless it is unlikely to risk people's rights and freedoms. If the risk to individuals is high, you must also notify affected users. Verify the exact procedure for your supervisory authority."
      }
    ],
    "related": [
      {
        "href": "/compliance/health-data-user-consent",
        "label": "Valid consent for health data"
      },
      {
        "href": "/compliance/is-fitness-data-phi",
        "label": "Is fitness data PHI or PII?"
      },
      {
        "href": "/compliance/health-data-retention-deletion",
        "label": "Health-data retention & deletion"
      },
      {
        "href": "/compliance",
        "label": "Health-data compliance & privacy"
      }
    ],
    "cta": {
      "pitch": "Health-data rules shift fast across the EU, UK, and US states; subscribe for plain-English updates on what changes for fitness app builders."
    }
  },
  {
    "slug": "is-fitness-data-phi",
    "primaryQuery": "is fitness data phi",
    "h1": "Is Fitness Data PHI? PII, PHI, and Health Data Untangled",
    "metaTitle": "Is Fitness Data PHI? PII vs PHI Explained",
    "metaDescription": "Usually not. PHI is a HIPAA term tied to who holds the data. The same reading can be PHI, GDPR health data, or consumer health data by context.",
    "updated": "2026-07-14",
    "answer": "Usually not. PHI is a specific HIPAA term for health information held by a covered entity or its business associate, so most direct-to-consumer fitness data is not PHI. But the same heart-rate or step reading can be GDPR special-category health data for EU users and consumer health data under state laws like Washington MHMDA, so not PHI does not mean unregulated. The label depends on who holds the data and why, not on the data type alone. This is general guidance, not legal advice.",
    "body": "## The one insight that clears up most of the confusion\n\nA single heart-rate reading can be PHI in one place and not PHI in another. Inside a hospital's patient app, that reading is Protected Health Information and HIPAA applies. In a standalone consumer workout app, the exact same reading is **not** PHI — but it is very likely GDPR special-category \"health data\" for EU users and \"consumer health data\" under laws like Washington's My Health My Data Act.\n\nNothing about the number changed. What changed is the **relationship and purpose**: HIPAA attaches to data held by a health care provider, health plan, or clearinghouse (a \"covered entity\") or a vendor working on its behalf (a \"business associate\"). Outside that relationship, health-related data simply is not PHI — even when it came from a medical source originally. So \"is fitness data PHI?\" is the wrong question to ask in isolation; the real question is \"which framework covers this data in my context?\"\n\n## The four labels — and why they are not interchangeable\n\nPeople use PII, PHI, \"health data,\" and \"consumer health data\" as if they were synonyms. They are not. Each comes from a different body of law and pulls in different obligations.\n\n| Term | What it is | Who / when it applies |\n|---|---|---|\n| **PII** (personally identifiable information) | Broad umbrella for any data that identifies a person. Not a HIPAA term; used across US privacy law generally. | Effectively any app holding identifying data. A wide baseline, not health-specific. |\n| **PHI** (Protected Health Information) | A HIPAA term of art: individually identifiable health information held or transmitted **by a covered entity or business associate**. | Only when a covered entity (provider, health plan, clearinghouse) or its business associate holds it. Outside that context, health data is **not** PHI. |\n| **\"Data concerning health\" / special-category data** | A GDPR term (Article 9). Read broadly by EU regulators to cover fitness, wearable, and workout metrics that reveal health. | Any app processing EU users' data — including US companies that target or monitor EU users. Generally needs explicit consent or another Article 9 condition. |\n| **\"Consumer health data\"** | A newer US state-law term (Washington MHMDA, Nevada, Connecticut). Deliberately very broad. | Consumer apps handling data of residents of those states — capturing precisely the fitness data HIPAA leaves uncovered. |\n\nThe takeaway: \"not PHI\" does **not** mean \"not regulated.\" For a consumer fitness app, the obligations that actually bite usually live in GDPR, state consumer-health laws, the FTC Health Breach Notification Rule, and app-store policy — not HIPAA. See the [HIPAA page](/compliance/hipaa-compliance-fitness-app) for when HIPAA does reach you, and the [GDPR page](/compliance/gdpr-fitness-app) for the EU side.\n\n## Washington MHMDA and how broad \"consumer health data\" really is\n\nThe state term worth understanding first is Washington's My Health My Data Act (MHMDA), because its \"consumer health data\" definition is deliberately wide. It covers personal information **linked or reasonably linkable** to a consumer that identifies their past, present, or future physical or mental health status — expressly including **bodily functions, vital signs, symptoms, or measurements**, health conditions and treatment, and even **precise location** that suggests an attempt to seek health services.\n\nThat definition plainly sweeps in wearable and workout metrics — heart rate, sleep, activity — that HIPAA would never touch in a consumer context. A few practical notes (verify current specifics, as this area is moving fast in 2026):\n\n- MHMDA took effect March 31, 2024 (later for small businesses). It generally reaches conduct affecting Washington residents regardless of where your company sits.\n- It requires **opt-in consent** to collect or share consumer health data beyond what is necessary to deliver what the user asked for, and a **separate, distinct authorization to sell** it.\n- It includes a **geofencing ban** near facilities that provide in-person health care (the statute uses a roughly 2,000-foot radius — verify), and that ban has no consent exception.\n- It carries a **private right of action** via Washington's Consumer Protection Act, which makes it a real litigation risk. Nevada's similar law is enforced by the state Attorney General only (no private right of action). California's CCPA/CPRA treats health data as \"sensitive personal information\" with its own opt-out and limit-use rights. Treat these as broader than HIPAA, not \"HIPAA-lite.\"\n\n## What this means for a fitness app\n\nThe practical rule falls out of all of the above: **treat wearable, workout, biometric, and inferred-health data as sensitive by default**, regardless of whether it is technically \"PHI.\" If you build to that standard, you satisfy GDPR and state consumer-health laws even when HIPAA does not apply to you.\n\n- **Do not claim \"HIPAA compliant\" as a standalone consumer app.** It is usually inapplicable and can mislead users. If you are deployed on behalf of a provider or health plan (a B2B2C setup with a business associate agreement), that is a different situation — see the [HIPAA page](/compliance/hipaa-compliance-fitness-app).\n- **Assume GDPR reaches you if EU users can use your app.** Fitness metrics are special-category data there, which generally means explicit consent.\n- **Scope for state consumer-health laws.** If you have users in Washington, Nevada, Connecticut, or California, their fitness data likely qualifies as consumer health / sensitive data with opt-in consent and separate sale rules.\n- **Do not forget precise geolocation.** It is sensitive under California law and can become \"consumer health data\" under MHMDA when it implies health-seeking.\n- **Apply the sensitive-by-default engineering posture:** clear consent, data minimization, encryption, access control, and deletion. Whether you keep data on the device or in the cloud changes your exposure — see [on-device vs cloud health data](/learn/on-device-vs-cloud-health-data).\n\n## A short, honest note on the limits here\n\nThe single most common mistake is reasoning \"it's not PHI, so I'm fine.\" That skips the frameworks that actually govern consumer fitness data. The second most common is the reverse — slapping \"PHI\" on every health value and assuming HIPAA everywhere, which is also wrong because PHI is context-dependent.\n\nThis is general guidance, not legal advice, and the state landscape is changing quickly in 2026. Exact definitions, effective dates, geofencing distances, and penalties vary by jurisdiction and get amended — verify them against the current primary sources, and get advice from a qualified professional for your specific product, users, and data flows.",
    "faqs": [
      {
        "q": "Is heart-rate or step data PHI?",
        "a": "It depends on the context. Held by a health care provider's app or a vendor working for one, it is PHI and HIPAA applies. The identical reading in a standalone consumer fitness app is not PHI, because HIPAA only attaches to covered entities and their business associates. It may still be GDPR health data and state consumer health data, so treat it as sensitive regardless."
      },
      {
        "q": "What is the difference between PII and PHI?",
        "a": "PII (personally identifiable information) is a broad umbrella for any data that identifies a person, used across US privacy law generally. PHI (Protected Health Information) is a narrower HIPAA term of art: individually identifiable health information held or transmitted by a covered entity or business associate. All PHI is PII, but most PII is not PHI, and health data outside a HIPAA relationship is not PHI at all."
      },
      {
        "q": "If my fitness data is not PHI, is it unregulated?",
        "a": "No. Non-PHI fitness data is often heavily regulated by other frameworks: GDPR treats it as special-category health data for EU users, and US state laws such as Washington MHMDA, Nevada, and Connecticut treat it as consumer health data. The FTC Health Breach Notification Rule and FTC Act also apply to many consumer health apps. Concluding not PHI equals not regulated is a common and costly mistake."
      },
      {
        "q": "What counts as consumer health data under Washington MHMDA?",
        "a": "Washington's My Health My Data Act defines consumer health data very broadly: personal information linked or reasonably linkable to a consumer that identifies their past, present, or future physical or mental health status, expressly including bodily functions, vital signs, symptoms, or measurements, and precise location suggesting health-seeking. That sweeps in wearable and workout metrics HIPAA would not touch. Verify current details, as this area is evolving in 2026."
      },
      {
        "q": "How should a fitness app treat this data in practice?",
        "a": "Treat wearable, workout, biometric, and inferred-health data as sensitive by default, whether or not it is technically PHI. Apply clear consent, data minimization, encryption, access control, and deletion. That posture generally satisfies GDPR and state consumer-health laws even when HIPAA does not apply. Confirm your specific obligations with a qualified professional, since jurisdiction and data flows change what applies."
      }
    ],
    "related": [
      {
        "href": "/compliance/hipaa-compliance-fitness-app",
        "label": "Does your fitness app need HIPAA?"
      },
      {
        "href": "/compliance/gdpr-fitness-app",
        "label": "GDPR for fitness & health apps"
      },
      {
        "href": "/learn/on-device-vs-cloud-health-data",
        "label": "On-device vs cloud health data"
      },
      {
        "href": "/compliance",
        "label": "Health-data compliance & privacy"
      }
    ],
    "cta": {
      "pitch": "State consumer-health laws and health-data definitions keep shifting; get plain-English updates on what changes for fitness apps in your inbox."
    }
  },
  {
    "slug": "fda-fitness-app-regulation",
    "primaryQuery": "does the fda regulate fitness apps",
    "h1": "Does the FDA Regulate Fitness Apps?",
    "metaTitle": "Does the FDA Regulate Fitness Apps? The 2-Prong Test",
    "metaDescription": "Most fitness and wellness apps fall under the FDA's general wellness policy, not device rules — unless you claim to diagnose or treat a disease.",
    "updated": "2026-07-14",
    "answer": "For most fitness and wellness apps the answer is no: step, calorie, sleep, and general-fitness features typically fall under the FDA's general wellness policy, where the agency applies enforcement discretion rather than regulating them as medical devices. What crosses the line is a claim — marketing that your app diagnoses, treats, or cures a disease (for example, detects AFib or diagnoses sleep apnea) can make it Software as a Medical Device and pull it into FDA oversight. General wellness is a policy and guidance posture, not a blanket statutory exemption, and the guidance was refreshed in early 2026, so verify the current text. This is general engineering guidance, not legal advice — confirm your product's pathway with a qualified professional.",
    "body": "## Does the FDA apply to your app at all?\n\nThe FDA regulates **medical devices** — and software can be a device. The relevant guidance is the FDA's **\"General Wellness: Policy for Low Risk Devices,\"** which describes when the agency's Center for Devices and Radiological Health (CDRH) will exercise enforcement discretion and *not* regulate a low-risk general-wellness product as a device. Separately, the **21st Century Cures Act (Section 3060)** removed certain \"healthy lifestyle\" software from the medical-device definition altogether.\n\nTwo things are worth being precise about:\n\n- **Enforcement discretion is not the same as \"exempt.\"** The general wellness policy means the FDA is saying it does not intend to enforce device requirements against qualifying low-risk products — not that a statute carves them out. The agency retains authority and can change the policy (and did refresh it in early 2026). Do not describe it as a \"blanket exemption.\"\n- **The FDA does not regulate your data privacy.** The FDA is concerned with the safety and effectiveness of medical claims, not how you store or share health data. Privacy obligations come from elsewhere — the FTC, state consumer-health laws, and GDPR for EU users. See the [HIPAA page](/compliance/hipaa-compliance-fitness-app) and [is fitness data PHI?](/compliance/is-fitness-data-phi) for who actually governs the data side.\n\n## The two-prong test for general wellness\n\nA product qualifies for the general wellness policy only if it meets **both** of these:\n\n| Prong | What it means for your app |\n| --- | --- |\n| **1. General wellness use only** | The intended use — as shown by your claims and marketing — is about maintaining or encouraging a general state of health or a healthy activity, not diagnosing or treating a disease. |\n| **2. Low risk** | The product is **not** invasive, **not** implanted, and does not involve technology that poses a safety risk without regulatory controls (for example, lasers or radiation). |\n\nIf either prong fails, the product falls outside the policy.\n\n### Prong 1 has two acceptable kinds of claims\n\n- **Category 1 — general wellness only.** Claims about maintaining or encouraging a general state of health or a healthy activity, **with no reference to a specific disease or condition**. Examples the FDA gives include weight management, physical fitness, relaxation and stress management, mental acuity, self-esteem, sleep management, and sexual function.\n- **Category 2 — healthy lifestyle linked to disease risk (well-established links only).** Claims that connect a healthy lifestyle to **reducing the risk of, or helping you live well with, a chronic disease or condition** — but *only* where that link is well understood and established in peer-reviewed science or health-professional-organization statements. For example, \"promotes a healthy weight, which may help you live well with type 2 diabetes.\"\n\nCategory 2 is a narrow, evidence-gated allowance — not a green light to reference diseases freely.\n\n## Concrete examples: which side of the line?\n\n**Generally general wellness (enforcement discretion likely):**\n\n- Step counting and activity tracking\n- Calorie and nutrition tracking\n- Sleep tracking and sleep-management coaching\n- \"General fitness\" coaching and workout guidance\n- Monitoring pulse or oxygen \"during exercise and hiking\"\n- Stress, relaxation, and weight-management features\n\n**Can cross into medical-device / SaMD territory (disease claims):**\n\n- \"Detects **atrial fibrillation (AFib)**\"\n- \"Diagnoses **sleep apnea**\"\n- \"Treats depression\"\n- \"Monitors blood glucose for diabetes management\" as a medical function\n\nSoftware that claims to diagnose, treat, cure, or mitigate a specific disease generally meets the device definition and may need FDA clearance or authorization (for example, a **510(k)** or **De Novo** pathway). In the real world, AFib-detection features on consumer wearables have gone through FDA clearance or De Novo — so if you are considering a feature like that, verify the specific product pathway rather than assuming a wellness disclaimer will cover it.\n\n## What this means for a fitness app\n\n- **Your marketing copy is a legal surface.** The intended use is inferred from your claims. The same heart-rate feature can be general wellness (\"track your pulse during workouts\") or a device claim (\"detects AFib\"). Write claims deliberately.\n- **A \"for wellness only\" disclaimer does not cure a disease claim.** If your app says it detects or diagnoses a condition, you are likely a device regardless of a disclaimer that says otherwise.\n- **Staying general-wellness keeps you out of device territory, not out of regulation entirely.** You still have privacy and consumer-protection obligations — see the sibling [compliance pages](/compliance). The general wellness policy answers \"am I an FDA device?\", not \"am I compliant overall?\"\n- **If you are heading toward a disease claim on purpose,** plan for a regulatory pathway (clearance/authorization) and get specialist advice early; it changes your product timeline, not just your copy.\n\n## A note on limits and change\n\nThe general wellness guidance is **active and evolving**: the guidance page reflects a January 6, 2026 update, and the FDA held a related town hall in February 2026. Treat the current text as the source of truth and verify it before you rely on any specific wording, category, or example — details in this area are being revisited in 2026. Whether a specific feature is \"low risk\" or crosses into a \"disease claim\" is a judgment call that depends on your exact wording and design, so this page is general guidance rather than a compliance determination. For your particular product, confirm your obligations with a qualified regulatory professional.",
    "faqs": [
      {
        "q": "Does the FDA regulate fitness apps?",
        "a": "Usually not. Low-risk apps intended for general wellness use — step counting, calorie and sleep tracking, general-fitness coaching, monitoring pulse or oxygen during exercise — typically fall under the FDA's general wellness policy, where the agency applies enforcement discretion rather than regulating them as medical devices. That is a policy posture, not a statutory exemption, and the guidance was refreshed in early 2026, so verify the current text before relying on it."
      },
      {
        "q": "What is the difference between general wellness and Software as a Medical Device (SaMD)?",
        "a": "General wellness covers claims about maintaining or encouraging a general state of health or a healthy activity, with no reference to a specific disease. Software as a Medical Device is software intended for a medical purpose — to diagnose, treat, cure, mitigate, or prevent a disease — which can meet the FDA's device definition and face regulation. To qualify for the general wellness policy a product must meet both prongs of the FDA's test: intended for general wellness use only, and low risk (not invasive, not implanted, no unsafe technology)."
      },
      {
        "q": "Does calling my app 'for wellness only' keep it out of FDA regulation?",
        "a": "No. A 'wellness only' disclaimer does not cure a disease claim. The FDA infers intended use from what you actually claim and how you market the app, so if your copy says the app detects, diagnoses, or treats a condition, it can be treated as a device regardless of a disclaimer that says otherwise. Your marketing language is effectively a legal surface — write claims deliberately."
      },
      {
        "q": "Does the FDA regulate how my fitness app stores or shares data?",
        "a": "No. The FDA's concern is the safety and effectiveness of medical claims, not data privacy. Privacy and security obligations come from other sources — the FTC, state consumer-health laws, and GDPR for EU users. Staying within the general wellness policy answers whether you are an FDA device, not whether you are compliant overall; see the HIPAA and 'is fitness data PHI' pages for the data side."
      },
      {
        "q": "My app detects AFib or analyzes ECG data — is that a medical device?",
        "a": "Likely yes. A claim to detect a specific condition such as atrial fibrillation is a disease-detection claim, which generally makes the software a device and may require FDA clearance or authorization (for example, a 510(k) or De Novo pathway). AFib-detection features on consumer wearables have gone through FDA clearance or De Novo in the real world. If you are building a feature like this, plan for a regulatory pathway and verify the specific product route with a specialist rather than assuming a wellness disclaimer covers it."
      }
    ],
    "related": [
      {
        "href": "/compliance/hipaa-compliance-fitness-app",
        "label": "Does your fitness app need HIPAA?"
      },
      {
        "href": "/compliance/is-fitness-data-phi",
        "label": "Is fitness data PHI or PII?"
      },
      {
        "href": "/compliance/health-app-privacy-policy",
        "label": "Health app privacy policy"
      },
      {
        "href": "/compliance",
        "label": "Health-data compliance & privacy"
      }
    ],
    "cta": {
      "pitch": "The FDA refreshed its general wellness policy in 2026 and the general-wellness-versus-device line keeps shifting — subscribe and we'll flag the changes that affect what your fitness app can claim."
    }
  },
  {
    "slug": "app-store-health-data-rules",
    "primaryQuery": "apple app store health data rules",
    "h1": "Apple App Store Health Data Rules: What You Need to Ship a HealthKit App",
    "metaTitle": "Apple App Store Health Data Rules Explained",
    "metaDescription": "What Apple requires to ship a health app or use HealthKit: privacy policy, no ad use or third-party disclosure, in-app account deletion, and more.",
    "updated": "2026-10-02",
    "answer": "To ship an iOS health app or use HealthKit, Apple's App Review Guidelines require a privacy policy linked in the app and in App Store Connect, forbid using HealthKit and other health data for advertising, marketing or use-based data mining or disclosing it to third parties for those purposes, and require in-app account deletion if you offer account creation. These are contractual App Store rules, not law, and don't replace GDPR or state-law obligations. This is general guidance, not legal advice; the section numbers here match the guidelines as last updated June 8, 2026, and Apple revises them, so verify the current text.",
    "body": "## Does this apply to you?\n\nIf your iOS app touches health or fitness data, yes. The rules bite hardest on apps that use these Apple frameworks:\n\n- **HealthKit** (steps, heart rate, workouts, sleep, and everything else in the Health app)\n- **Clinical Health Records API**\n- **Motion & Fitness** and the **MovementDisorder APIs**\n\nData from these sources gets the strictest treatment. But even a fitness app that never touches HealthKit — say, one that only stores workouts you type in — still needs a privacy policy and still faces the general privacy rules in Section 5.1 of the guidelines. There is essentially no version of \"health app\" that escapes these requirements.\n\nOne more scoping point: guideline 5.1.1(ix) lists healthcare among the \"highly regulated fields\" whose apps \"should be submitted by a legal entity that provides the services, and not by an individual developer.\"\n\n## What Apple's rules actually require\n\nThe subsection numbers below match the App Review Guidelines as last updated June 8, 2026, checked on October 2, 2026. Apple revises the guidelines, so confirm the live subsection before you cite a number; the rules matter more than the numbering.\n\n| Requirement | What it means for your app |\n| --- | --- |\n| **Privacy policy is mandatory** (guideline 5.1.1(i)) | Link a privacy policy both in App Store Connect metadata and inside the app. It must say what data you collect, how, and every use; confirm any third parties give equal protection; and explain retention, deletion, and how users revoke consent. |\n| **Consent for collection** (5.1.1(ii)) | Get user consent even for data considered anonymous, offer an easily accessible way to withdraw it, write purpose strings that clearly and completely describe your use of the data, and don't make paid functionality depend on granting access. |\n| **Data minimization** (5.1.1(iii)) | Request only the data relevant to your app's core functionality. |\n| **No advertising or data mining** (5.1.2(vi) and 5.1.3(i)) | Data from HealthKit, Clinical Health Records, Motion and Fitness, and the MovementDisorder APIs may NOT be used for marketing, advertising, or use-based data mining — including by third parties you pass it to. |\n| **No disclosure to third parties for those purposes** (5.1.3(i)) | You may not use or disclose health, fitness, or medical research data to third parties for advertising, marketing, or other use-based data mining. The only permitted purposes are improving health management or health research, and then only with permission. You must also disclose the specific health data you collect from the device. |\n| **Sharing with third-party AI** (5.1.2(i)) | Clearly disclose where personal data will be shared with third parties, \"including with third-party AI,\" and get explicit permission before doing so. |\n| **Data accuracy + no iCloud** (5.1.3(ii)) | Don't write false or inaccurate data into HealthKit, and don't store personal health information in iCloud. The iCloud rule is easy to miss when you design sync. |\n| **Account deletion in-app** (5.1.1(v)) | If your app supports account creation, it must offer account deletion within the app. Apple's account-deletion guidance says to offer deletion of the entire account record along with associated personal data; offering only to deactivate the account is insufficient. Apps that connect to a social network must also include a way to revoke those credentials and disable data access between the app and the network from within the app, and may not store the network's credentials or tokens off the device. |\n\n### The narrow \"direct benefit\" carve-out\n\nThere is one limited exception to the no-sharing rule: an app may share health data for a direct user benefit — the classic example is a reduced insurance premium — but only if the app is submitted by the benefit provider itself AND the data is not shared with any other third party. Do not read this as a general \"you can share health data if the user gets something.\" It is deliberately narrow and conditional.\n\n### If you run research\n\nHuman-subject research raises the bar. Under guidelines 5.1.3(iii) and (iv), you need:\n\n- **Informed consent** covering the nature, purpose, and duration of the study; procedures, risks, and benefits; confidentiality and any third-party sharing; a contact; and how to withdraw. Minors need parent or guardian consent.\n- **Approval from an independent ethics review board**, which Apple can ask you to prove on request.\n\n## App Privacy labels and privacy manifests\n\nTwo more Apple requirements live outside the review guidelines proper:\n\n- **App Privacy \"nutrition labels.\"** Apple requires you to describe your app's privacy practices in App Store Connect to submit new apps and updates — including the practices of third-party partners whose code you integrate — and to identify all the data you or those partners collect, unless it meets Apple's criteria for optional disclosure. Health and Fitness are their own data types, and Apple's definitions name HealthKit, Clinical Health Records, Movement Disorder and Motion and Fitness data. You are responsible for keeping the answers accurate and up to date.\n- **Privacy manifests and required-reason APIs.** Apple's documentation says that starting May 1, 2024, App Store Connect stopped accepting apps that use a \"required reason\" API without describing why in their privacy manifest (`PrivacyInfo.xcprivacy`). Separately, when a new app — or an update that adds it — includes one of the commonly used SDKs on Apple's list, that SDK must carry its own privacy manifest, plus a signature when it is a binary dependency. Confirm the current list before you submit.\n\n## What this means for a fitness app\n\n- **Ship a privacy policy first.** Guideline 5.1.1(i) makes it mandatory for every app, HealthKit or not, and it is cheap to get right. Cover collection, use, sharing, retention, and deletion. See the [health app privacy policy guide](/compliance/health-app-privacy-policy) for what to include.\n- **Wall off health data from your ad stack.** Don't pipe HealthKit data into advertising, marketing or data-mining tools — that is a hard prohibition, not a preference — and we would treat values derived from it the same way.\n- **Build in-app account deletion before launch.** Retrofitting it later is painful. Apple's guidance says deletion should reach the associated personal data too, not just the login row.\n- **Don't lean on iCloud for health data.** Keep personal health information out of iCloud storage; verify the current guideline wording as you architect sync.\n- **Remember Apple's rules are not the whole picture.** An App Store approval does not make you GDPR- or state-law-compliant. A HealthKit permission prompt is an OS access control, not a legal consent. See [health data user consent](/compliance/health-data-user-consent) for the distinction.\n\nFor the implementation details of requesting HealthKit permissions and handling the authorization sheet, see the [HealthKit integration guide](/integrate/healthkit). Building for Android too? The equivalent rules live on the [Google Play health data policy](/compliance/google-play-health-data-policy) page — they overlap heavily but differ in the specifics.\n\n## Guideline-by-guideline pages\n\nIf App Review cited a specific guideline, these pages quote it in full with a checklist:\n\n- [App Store guideline 5.1.1: Data Collection and Storage](/compliance/app-store-guideline-5-1-1-data-collection-storage)\n- [App Store guideline 5.1.2: Data Use and Sharing](/compliance/app-store-guideline-5-1-2-data-use-sharing)\n- [App Store guideline 5.1.3: Health and Health Research](/compliance/app-store-guideline-5-1-3-health-research)\n- [App Store guideline 1.4.1: Physical Harm and medical apps](/compliance/app-store-guideline-1-4-1-physical-harm)\n- [App Store guideline 2.5.1: Software Requirements and HealthKit](/compliance/app-store-guideline-2-5-1-healthkit-software-requirements)\n- Shipping on Android too: [Health Connect publishing requirements on Google Play](/compliance/google-play-health-connect-publishing-requirements)\n\n## A note on limits\n\nApple's guidelines are contractual App Store rules, enforced through app review — they are not a substitute for HIPAA, GDPR, or state consumer-health laws, and passing review does not mean you've met those legal obligations. Apple also revises the guidelines — this page matches the June 8, 2026 revision — so the exact subsection numbers may shift; always read the live guideline text at the time you submit. For anything with legal consequences, confirm your obligations with a qualified professional.",
    "faqs": [
      {
        "q": "Do I need a privacy policy to use HealthKit?",
        "a": "Yes. Under App Review Guideline 5.1.1(i), every app must link a privacy policy in App Store Connect metadata and within the app. It must state what data you collect, how, and every use, confirm that third parties you share with give equal protection, and cover retention, deletion, and how users revoke consent. Apps using HealthKit fall squarely under this."
      },
      {
        "q": "Can I use HealthKit data for advertising or analytics?",
        "a": "No. Data from HealthKit, the Clinical Health Records API, Motion and Fitness, and the MovementDisorder APIs may not be used for marketing, advertising, or use-based data mining, including by any third party you pass it to. That prohibition sits in guidelines 5.1.2(vi) and 5.1.3(i) as of the June 8, 2026 revision. Keep health data out of your ad, marketing and data-mining tools."
      },
      {
        "q": "Can I store health data in iCloud?",
        "a": "No. Apple's guideline 5.1.3(ii) says apps may not store personal health information in iCloud (June 8, 2026 revision). This rule is easy to miss when designing sync, so confirm the live guideline wording before you architect any cloud storage for health data."
      },
      {
        "q": "Does my app need in-app account deletion?",
        "a": "If your app supports account creation, yes. Guideline 5.1.1(v) requires offering account deletion within the app, and Apple's account-deletion guidance says to offer deletion of the entire account record along with associated personal data — offering only to deactivate the account is insufficient. A manual deletion process is acceptable if you tell users how long it will take and confirm when it is done."
      },
      {
        "q": "Do Apple's rules make my app HIPAA or GDPR compliant?",
        "a": "No. Apple's guidelines are contractual App Store rules enforced through app review; passing review does not satisfy HIPAA, GDPR, or state consumer-health laws. A HealthKit permission prompt is an OS access control, not a legal consent. Confirm your separate legal obligations with a qualified professional."
      }
    ],
    "related": [
      {
        "href": "/compliance/google-play-health-data-policy",
        "label": "Google Play health-data policy"
      },
      {
        "href": "/integrate/healthkit",
        "label": "How to integrate Apple HealthKit"
      },
      {
        "href": "/compliance/health-app-privacy-policy",
        "label": "Health app privacy policy"
      },
      {
        "href": "/compliance",
        "label": "Health-data compliance & privacy"
      }
    ],
    "cta": {
      "pitch": "Apple revises its App Review Guidelines — subscribe for plain-English updates when App Store and health-privacy rules change."
    },
    "sources": [
      {
        "url": "https://developer.apple.com/app-store/review/guidelines/",
        "checked": "2026-10-02",
        "note": "guidelines 5.1.1(i)–(v) and (ix), 5.1.2(i) and (vi), 5.1.3(i)–(iv), last updated June 8, 2026"
      },
      {
        "url": "https://developer.apple.com/support/offering-account-deletion-in-your-app/",
        "checked": "2026-10-02",
        "note": "deleting the account record with associated data; deactivation alone insufficient; manual processes"
      },
      {
        "url": "https://developer.apple.com/app-store/app-privacy-details/",
        "checked": "2026-10-02",
        "note": "App Privacy disclosures, third-party partners, optional disclosure, Health and Fitness data types"
      },
      {
        "url": "https://developer.apple.com/documentation/bundleresources/privacy-manifest-files",
        "checked": "2026-10-02",
        "note": "PrivacyInfo.xcprivacy and what it records"
      },
      {
        "url": "https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api",
        "checked": "2026-10-02",
        "note": "required reason APIs; App Store Connect enforcement from May 1, 2024"
      },
      {
        "url": "https://developer.apple.com/support/third-party-SDK-requirements/",
        "checked": "2026-10-02",
        "note": "listed SDKs need a privacy manifest, and a signature as binary dependencies"
      }
    ]
  },
  {
    "slug": "google-play-health-data-policy",
    "primaryQuery": "google play health data policy",
    "h1": "What does Google Play's health data policy require?",
    "metaTitle": "Google Play Health Data Policy: What It Requires",
    "metaDescription": "What Google Play requires for health apps and Health Connect: permitted uses, no ad use, prominent disclosure, the Data safety form, and deletion.",
    "updated": "2026-07-14",
    "answer": "If your Android app handles fitness or health data, Google Play requires that you use it only for disclosed, user-facing features and never sell it, transfer it to data brokers, or use it for ads. You also need an in-app prominent disclosure plus consent, a privacy policy, an accurate Data safety form, and account and data deletion paths — with extra rules for data accessed through Health Connect. This is general engineering guidance, not legal advice, and some Play Console policy pages are hard to fetch, so confirm the exact current wording in the official Console.",
    "body": "## Does this apply to your app?\n\nIf your app collects, uses, or shares any personal or sensitive user data, Google Play's User Data policy applies — and health and fitness data is squarely within it. Two layers matter:\n\n- **The Personal and Sensitive User Data policy** covers all sensitive data your app touches, however you obtained it (direct entry, sensors, an SDK, or another API).\n- **The Health Connect data policy** adds further requirements specifically for data you access **through Health Connect permissions**. Data pulled via Health Connect is treated as personal and sensitive user data plus these extra rules.\n\nA useful distinction: the Health Connect rules govern data obtained *through Health Connect*, but other health data your app collects directly still falls under the broader (and still strict) sensitive-data policy. Do not assume the Health Connect rules are the only ones in play.\n\n### Why Health Connect matters now\n\nHealth Connect is Google's on-device store and permission layer for health and fitness data, and one of the replacements for the older Google Fit APIs. New Google Fit sign-ups closed (reported as May 1, 2024). Google's [Fit migration guide](https://developer.android.com/health-and-fitness/health-connect/migration/fit), updated September 10, 2026, cautions that \"The Google Fit API (including the REST API) will only be supported until the end of 2026.\" The guide recommends Health Connect for step tracking and mobile-first apps and the Google Health API for cloud-based integrations, and it states an end of support, not a switch-off date. For the integration mechanics, see [our Health Connect integration guide](/integrate/google-health-connect) and the [HealthKit vs Health Connect comparison](/fitness-apis/apple-healthkit-vs-google-health-connect).\n\n## What Google Play requires\n\n| Requirement | What it means for your app |\n| --- | --- |\n| Permitted use / minimum necessary | Request only the health data types your stated, user-facing features actually need, and justify each type. A March 5, 2025 Health Connect update tightened this with added eligibility and justification requirements, especially for health-records data types (verify). |\n| No advertising use | Data accessed via Health Connect may not be transferred, sold, or used to serve ads, including personalized or interest-based ads. |\n| No sale or transfer to third parties | You may not transfer or sell health and fitness data to advertising platforms, data brokers, or information resellers. |\n| Prominent disclosure + consent | You must show an in-app prominent disclosure (an on-screen message) and get consent before collecting sensitive data. This is separate from — and not satisfied by — your store listing or privacy policy alone. |\n| Privacy policy | Apps handling personal and sensitive data must post a privacy policy both in the store listing and accessible in-app, covering collection, use, sharing, and secure handling. |\n| Data safety form | Every Play listing must complete the Data safety section, accurately stating what data is collected, how it is used, and whether it is shared. It must match your actual behavior and your privacy policy. |\n| Account + data deletion | Apps offering account creation must provide account deletion, an option to request data deletion without deleting the account, and a web-accessible deletion path — disclosed in the Data safety form (verify exact wording and deadlines). |\n| Background location | Accessing location in the background needs separate justification and declaration, is only allowed when core to a user-facing feature, and must be disclosed and consented. |\n\nA note on the health-specific content rules: Google Play also maintains a Health apps declaration and health content and services policies that can apply on top of the data rules. If your app makes health claims or offers health services, check those declarations in the Console too.\n\n## What this means for a fitness app\n\n- **Treat the OS permission grant as access control, not legal consent.** A Health Connect permission prompt decides whether your app can read a data type; it is not, by itself, a GDPR lawful basis or a substitute for the in-app disclosure and consent Google requires. See [health data user consent](/compliance/health-data-user-consent).\n- **Keep three surfaces in sync.** Your in-app disclosure, your privacy policy, and your Data safety form must all describe the same behavior. Mismatches are a common rejection and enforcement trigger.\n- **Do not monetize the data.** No ad use, no selling, no handing it to data brokers — this is a hard line for Health Connect data.\n- **Ask for the minimum.** Request only the health data types your features use, and be ready to justify each one, particularly for sensitive health-records types.\n- **Build deletion in early.** Plan for in-app account deletion, data-only deletion, and a web deletion route from the start rather than retrofitting. See [health data retention and deletion](/compliance/health-data-retention-deletion).\n\n## A note on limits\n\nGoogle reorganizes and renumbers its policies often, and several items here — the Fit end-of-support timeline, the March 2025 Health Connect tightening, and the exact deletion-flow wording and deadlines — change over time and are flagged to verify. Play policy is also only one layer: depending on your users you may also owe obligations under GDPR, US state consumer-health laws, and the FTC. Use this as a map, confirm the live policy text in the Play Console, and check [Apple's health-data rules](/compliance/app-store-health-data-rules) and your own [health app privacy policy](/compliance/health-app-privacy-policy) before you ship. This is general guidance, not legal advice — get advice from a qualified professional for your specific case.",
    "faqs": [
      {
        "q": "Is Health Connect data treated differently from other data?",
        "a": "Yes. Data accessed through Health Connect permissions is treated as personal and sensitive user data plus additional Health Connect rules — notably no advertising use and no sale or transfer to third parties. Other health data your app collects directly still falls under Google's broader sensitive-data policy, so the Health Connect rules are not the only ones that apply."
      },
      {
        "q": "Does the Health Connect permission prompt count as user consent?",
        "a": "No. The permission prompt is an OS-level access control that decides whether your app can read a data type. Google separately requires an in-app prominent disclosure and consent before collecting sensitive data, and a permission grant is not automatically a legal basis such as GDPR consent. Treat them as distinct requirements."
      },
      {
        "q": "What is the Data safety form and how strict is it?",
        "a": "The Data safety section is mandatory for every Play listing and must accurately state what data you collect, how you use it, and whether you share it. It has to match your actual behavior and your privacy policy — mismatches between your in-app disclosure, privacy policy, and Data safety form are a common rejection and enforcement trigger."
      },
      {
        "q": "What deletion options does Google Play require?",
        "a": "Apps that offer account creation generally must provide in-app account deletion, an option to request deletion of data without deleting the account, and a web-accessible deletion path, all disclosed in the Data safety form. The exact wording and deadlines have evolved, so verify the current User Data and Data safety policy pages in the Play Console before you rely on specifics."
      },
      {
        "q": "Is Health Connect replacing Google Fit?",
        "a": "Partly. Google's Fit migration guide, updated September 10, 2026, says the Google Fit API, including the REST API, \"will only be supported until the end of 2026\" and recommends Health Connect for step tracking and mobile-first apps. Cloud-based integrations go to the Google Health API instead, and the guide lists no replacement API for the Fit Goals API. New Fit sign-ups reportedly closed in May 2024."
      }
    ],
    "related": [
      {
        "href": "/compliance/app-store-health-data-rules",
        "label": "Apple App Store health-data rules"
      },
      {
        "href": "/integrate/google-health-connect",
        "label": "How to integrate Google Health Connect"
      },
      {
        "href": "/compliance/health-app-privacy-policy",
        "label": "Health app privacy policy"
      },
      {
        "href": "/compliance",
        "label": "Health-data compliance & privacy"
      }
    ],
    "cta": {
      "pitch": "Google reworks its Play health-data and Health Connect rules often — subscribe and we'll flag the policy changes, deadline shifts, and Fit deprecation dates before they break your build."
    }
  },
  {
    "slug": "store-health-data-securely",
    "primaryQuery": "how to store health data securely",
    "h1": "How to Store Health Data Securely",
    "metaTitle": "How to Store Health Data Securely (Guide)",
    "metaDescription": "Engineering practices for storing health data securely: encryption in transit and at rest, key management, access control, and data minimization.",
    "updated": "2026-07-14",
    "answer": "Store health data securely by encrypting it in transit (TLS 1.2+/1.3) and at rest (AES-256), managing keys in a KMS or HSM, enforcing least-privilege access, logging access, and collecting as little as possible. No single control makes you 'compliant' — but together these map onto the HIPAA Security Rule safeguards and GDPR Article 32's 'appropriate technical measures.' This is general engineering guidance, not legal advice; verify what applies to your app.",
    "body": "Treat wearable, workout, and biometric data as sensitive by default, regardless of whether it technically counts as PHI.\n\n## The two anchors: HIPAA safeguards and GDPR Article 32\n\nTwo frameworks are worth keeping in mind as targets, even if only one applies to you.\n\nThe **HIPAA Security Rule** organizes protections for electronic health data into three safeguard categories: **administrative** (risk analysis, workforce training, access management, policies), **physical** (facility, device, and media controls), and **technical** (access control, audit controls, integrity, transmission security, encryption). Most direct-to-consumer fitness apps are not HIPAA-covered — see [HIPAA compliance for fitness apps](/compliance/hipaa-compliance-fitness-app) — but the safeguard structure is a useful checklist regardless.\n\n**GDPR Article 32** requires \"appropriate technical and organisational measures\" and explicitly names encryption and pseudonymisation, alongside confidentiality, integrity, availability, resilience, and regular testing. Crucially, it is **risk-based and does not mandate specific algorithms** — the standard is what is appropriate to the risk, not a fixed cipher.\n\nA note on a moving target: a HIPAA Security Rule NPRM (proposed Dec 27, 2024) would make encryption mandatory and add measures like MFA, but as of mid-2026 it is **still proposed, not finalized**. Under the current rule, encryption is \"addressable\" — implement it or document an equivalent measure. Do not treat mandatory encryption as settled HIPAA law yet.\n\n## Core practices for storing health data securely\n\nThe table below is the short version. The sections that follow add the \"how.\"\n\n| Practice | Why it matters |\n| --- | --- |\n| Encrypt in transit (TLS 1.2+/1.3) | Protects data moving between app, API, and backend from interception. |\n| Encrypt at rest (AES-256) | Renders stored data unreadable if disks, DBs, or backups are exposed. |\n| Manage keys with a KMS/HSM | Keys separate from data; rotate and revoke without re-architecting. |\n| Access control & least privilege | Limits who and what can reach health data; shrinks blast radius. |\n| Audit logging | Creates a tamper-resistant record of access for detection and review. |\n| Data minimization | Data you never collect can't be breached and stays out of scope. |\n| Pseudonymization / tokenization | Separates identity from health values so datasets aren't directly identifying. |\n| Secure, tested backups | Prevents backups from becoming an unencrypted, forgotten leak. |\n| Secrets management | Keeps credentials out of code, logs, and client binaries. |\n\n### Encrypt in transit\n\nEnforce HTTPS everywhere. `TLS 1.2` is the practical minimum and **`TLS 1.3` is recommended** — it removes weak ciphers, speeds up the handshake, and encrypts more metadata. On mobile, consider certificate pinning to resist man-in-the-middle attacks.\n\n### Encrypt at rest\n\n`AES-256` is the widely-cited baseline for stored data — servers, databases, backups, and device storage alike. It is a strong industry norm cited across common security guidance, not a universal legal mandate, but it is the sensible default.\n\n### Key management\n\nEncryption is only as good as your key handling. Generate, store, rotate, and destroy keys with a dedicated **key management service (KMS) or hardware security module (HSM)**, ideally using validated modules. **Never hardcode keys or secrets** in app binaries or source repositories. Prefer envelope encryption — a data encryption key (DEK) wrapped by a key encryption key (KEK) — and keep keys separate from the data they protect.\n\n### Access control and least privilege\n\nUse role-based access with a deny-by-default posture and scoped service credentials. Separate production from non-production environments, and require MFA for administrative access. The goal is that no person or service can reach health data unless they specifically need to.\n\n### Audit logging\n\nLog access to health data and protect those logs from tampering. Just as important: **do not log sensitive health values or PII in plaintext** logs, crash reports, or analytics. Leaked data most often shows up where nobody meant to put it.\n\n### Data minimization\n\nThe cheapest security control is not collecting data in the first place. Applying the \"collect less\" principle shrinks both your breach exposure and your regulatory scope — this is also the backbone of retention discipline, covered in [health-data retention and deletion](/compliance/health-data-retention-deletion). Segregate identifiers from health values wherever you can.\n\n### Pseudonymization and tokenization\n\nUse tokenization or pseudonymization so that a dataset of health values is not directly identifying on its own. GDPR Article 32 names pseudonymisation explicitly, and separating the \"who\" from the \"what\" limits the damage of any single exposure.\n\n### Secure backups\n\nBackups are a common blind spot. Encrypt them with managed keys, test that you can actually restore from them, and make sure they fall under the same retention and deletion policy as your primary data — a deletion that never reaches backups is not really a deletion.\n\n### On-device vs. cloud trade-offs\n\nWhere you store data changes your security model. On-device storage keeps data off your servers, shrinking the attack surface, but complicates recovery and sync. Cloud storage centralizes control and audit but concentrates risk. For the fuller comparison, see [on-device vs. cloud health data](/learn/on-device-vs-cloud-health-data).\n\nIf you store on-device, use the platform's secure primitives: iOS **Keychain** (Secure Enclave-backed, with protection classes such as `kSecAttrAccessibleWhenPasscodeSetThisDeviceOnly`), and Android **Keystore** with Jetpack Security (`EncryptedFile` / `EncryptedSharedPreferences`). Do **not** put sensitive data in `NSUserDefaults`, plain `SharedPreferences`, plaintext files, the clipboard, or unencrypted local databases. OWASP's mobile storage guidance (MASVS-STORAGE) exists precisely because these leaks are the most common finding in mobile assessments — data escapes into keyboard caches, screenshots, backups, logs, and crash reporters. Audit all of those.\n\n### Secrets handling\n\nUse a secrets manager or vault, rotate credentials, and keep secrets out of source control, logs, and client-side code. A leaked API key can undo every other control on this page.\n\n## What this means for a fitness app\n\n- **Encrypt everywhere, but don't stop there.** TLS in transit and `AES-256` at rest are table stakes; access control, logging, and minimization are what actually contain a breach.\n- **Collect less.** Every field you don't store is one you never have to secure, delete, or explain in a breach notice.\n- **Watch the quiet leaks.** Logs, crash reporters, analytics SDKs, screenshots, and backups are where health data most often escapes — treat them as in scope.\n- **If you rely on an aggregator,** understand where the data lives and how it's protected across the pipeline. See [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis).\n- **Match the strongest standard that applies to you.** GDPR's Article 32 and state consumer-health laws often set the real bar for a consumer app, even when HIPAA does not.\n\n## A note on limits\n\nThese practices are good engineering, not a compliance guarantee. Both GDPR Article 32 and the current HIPAA Security Rule are outcome- and risk-based — they ask whether your measures are \"appropriate,\" not whether you used a specific algorithm. Implementing everything here does not by itself make you \"compliant\" with any particular law, and the HIPAA encryption rules in particular are actively being revised in 2026. Use this as a baseline, verify the current requirements that apply to your app, and get advice from a qualified professional for your specific case.",
    "faqs": [
      {
        "q": "What encryption should I use for health data?",
        "a": "The common baselines are TLS 1.2 or higher (TLS 1.3 recommended) for data in transit and AES-256 for data at rest, including databases, backups, and device storage. These are strong industry norms rather than universal legal mandates — GDPR Article 32 and the current HIPAA Security Rule are risk-based and don't prescribe a specific algorithm — but they are the sensible default. Verify the current requirements for your jurisdiction."
      },
      {
        "q": "Does encrypting health data make my app HIPAA or GDPR compliant?",
        "a": "No. Encryption is one important control, not compliance in itself. Both GDPR Article 32 and the HIPAA Security Rule are outcome-based and cover far more than encryption — access control, audit logging, risk analysis, minimization, and organizational measures. Implementing strong encryption helps and can reduce breach-notification burden, but confirm your full obligations with a qualified professional."
      },
      {
        "q": "Should I store health data on the device or in the cloud?",
        "a": "It's a trade-off. On-device storage (using iOS Keychain or Android Keystore) keeps data off your servers and shrinks the attack surface, but complicates recovery and sync. Cloud storage centralizes control and audit but concentrates risk. Whichever you choose, avoid insecure local stores like NSUserDefaults, plain SharedPreferences, or unencrypted files. See our on-device vs. cloud guide for the fuller comparison."
      },
      {
        "q": "How should I manage encryption keys?",
        "a": "Generate, store, rotate, and destroy keys using a dedicated key management service (KMS) or hardware security module (HSM), ideally with validated modules. Never hardcode keys or secrets in app binaries or source repositories. Envelope encryption — a data key wrapped by a key-encryption key — is a common pattern, and keys should be kept separate from the data they protect."
      },
      {
        "q": "Why does data minimization matter for security?",
        "a": "Data you never collect can't be breached, and it stays out of regulatory scope entirely. Applying the 'collect less' principle shrinks both your attack surface and your compliance burden. It pairs with segregating identifiers from health values and using tokenization or pseudonymization so datasets aren't directly identifying on their own."
      }
    ],
    "related": [
      {
        "href": "/learn/on-device-vs-cloud-health-data",
        "label": "On-device vs cloud health data"
      },
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/compliance/health-data-retention-deletion",
        "label": "Health-data retention & deletion"
      },
      {
        "href": "/compliance",
        "label": "Health-data compliance & privacy"
      }
    ],
    "cta": {
      "pitch": "Security norms and health-data rules shift fast — subscribe for plain-English updates on encryption standards, HIPAA changes, and storage best practices for fitness apps."
    }
  },
  {
    "slug": "health-data-user-consent",
    "primaryQuery": "user consent for health data",
    "h1": "How to Get Valid User Consent for Health Data",
    "metaTitle": "User Consent for Health Data: What's Valid",
    "metaDescription": "How to get valid consent for health data under GDPR: opt-in, granular, withdrawable. Why an OS permission is not legal consent, plus consent to sell.",
    "updated": "2026-07-14",
    "answer": "Valid consent under GDPR must be freely given, specific, informed, and unambiguous — a clear opt-in, never a pre-ticked box or bundled into your terms. Because fitness data is special-category health data, you usually need explicit consent, granular per purpose and as easy to withdraw as to give. The key trap: an iOS HealthKit or Android Health Connect permission is a device access control, not automatically a legal basis for what you then do with the data. This is general guidance, not legal advice, so confirm your obligations with a qualified professional.",
    "body": "## What makes consent \"valid\" under GDPR\n\nConsent is only one of several lawful bases, but when you rely on it, it has to meet every one of these conditions at once. If any is missing, the consent is not valid.\n\n| Requirement | What it means for your app |\n|---|---|\n| Freely given | The user has a genuine choice and suffers no detriment for refusing. Consent must not be bundled with your terms or made a condition of using the service. |\n| Specific | Tied to defined, named purposes — not a blanket \"we may use your data.\" |\n| Informed | The user knows who you are (the controller), what data you take, why, and what their rights are. |\n| Unambiguous | A clear affirmative action. **No pre-ticked boxes, no silence or inactivity, no opt-out, no default-on settings** count as consent. |\n| Granular | A separate opt-in per distinct purpose or type of processing — unbundled, so a user can say yes to one thing and no to another. |\n| Withdrawable | As easy to withdraw as it was to give — ideally a one-step, accessible action. Withdrawal does not undo processing that was lawful before it. |\n\nBecause health data is **special-category data** under GDPR Article 9, the usual route is **explicit consent** — an express opt-in statement, not something implied. And explicit consent typically has to sit on top of a separate general lawful basis. For how the two layers stack, see our [GDPR for fitness apps](/compliance/gdpr-fitness-app) page. Consent is not the only lawful basis, and it is not always the right one, so do not assume consent is always required or always the answer.\n\n## An OS permission grant is not legal consent\n\nThis is the distinction that trips up the most builders. When a user taps \"Allow\" on an iOS **HealthKit** authorization sheet or grants an Android **Health Connect** permission, that is a **device-level access control**. It decides whether your app is technically able to read or write those data types on that device. It is **not automatically a GDPR lawful basis** for what you subsequently do with the data.\n\nIn practice you often still need a separate, GDPR-valid consent (or another lawful basis) for your actual processing — storing it on your servers, running analytics on it, sharing it, and so on. Treating the OS grant as end-to-end legal cover is a mistake: a permission and a consent are different instruments doing different jobs. App-store rules reinforce this from their own side — both Apple and Google require in-app consent and disclosure independent of the OS prompt. See [Apple's health-data rules](/compliance/app-store-health-data-rules) and [Google Play's health-data policy](/compliance/google-play-health-data-policy).\n\n## OAuth scopes: consent to access, not to everything\n\nWhen a user authorizes your app through OAuth — for example, connecting a wearable or health platform — the **scopes** they grant define exactly what data access they consented to. This is a technical, auditable consent to *access* the data. It is a clean record of what the user allowed you to reach.\n\nWhat it is not, on its own, is consent for downstream purposes like marketing or selling the data. Access authorization and purpose consent are separate. For how OAuth works in this context, see [what is OAuth for health data](/learn/what-is-oauth-for-health-data).\n\n## Consent to sell or share is a separate thing (US state law)\n\nUnder Washington's **My Health My Data Act (MHMDA)**, consent and authorization-to-sell are treated as **different instruments**:\n\n- **Consent to collect or share** consumer health data (opt-in).\n- A **distinct, valid authorization to SELL** that data — a separate, standalone, **signed** document with statutorily prescribed contents.\n\nUnder Washington's MHMDA, that sale authorization must be its own signed document, and **both the seller and the purchaser have to retain it for six years**. MHMDA has been in force since March 31, 2024 (small businesses June 30, 2024) and carries a notable private right of action, which makes it a real litigation risk. MHMDA is Washington-specific but reaches conduct affecting Washington residents wherever your company sits, and other states (Nevada, Connecticut expansions, and more) have similar-but-different rules. Verify the current state-law landscape for your users.\n\n## Keep records that prove consent\n\nGDPR requires you to be able to **demonstrate** that a user consented. That means keeping versioned consent logs that capture:\n\n- **who** consented,\n- **when** they did,\n- **what they were told** — the exact wording and version they saw, and\n- **how** they can withdraw.\n\nIf you cannot show these, you effectively cannot show valid consent. Treat consent records as a first-class part of your data model, not an afterthought.\n\n## Children's data and age gates (briefly)\n\nIf children may use your app, extra rules apply. In the US, **COPPA** requires verifiable parental consent to collect data from children under 13; the usual mechanism is an age gate or neutral age-screen. Apple and Google add their own limits for kids (for example, restrictions on behavioral advertising). Under GDPR, the digital-consent age is **16, which member states may lower to as low as 13** — below that threshold, parental or guardian consent is required. Age thresholds vary by jurisdiction, so verify the current numbers for the markets you serve.\n\n## What this means for a fitness app\n\n- **Design consent as a real, granular opt-in** for health data — separate per purpose, never pre-ticked, never bundled into your terms.\n- **Make withdrawal as easy as consent** — ideally one step — and remember that prior lawful processing stays lawful.\n- **Do not treat the HealthKit or Health Connect prompt as your legal basis.** Layer a proper consent (or other basis) on top for what you do with the data.\n- **Separate \"share\" from \"sell.\"** If you might sell consumer health data, treat the authorization to sell as its own signed, retained instrument.\n- **Log everything** — who, when, what wording, and how to withdraw — in versioned records you can produce on demand.\n- **Gate for age** if children may use the app, and check the threshold per jurisdiction.\n\n## A note on limits\n\nConsent is one lawful basis among several, and for health data you generally need Article 9 explicit consent (or another Article 9 condition) on top of a general basis — do not read this page as saying consent is the only route. State laws differ, age thresholds move, and platform rules change. Use this as a starting map, not a compliance sign-off, and get advice from a qualified professional for your specific case.",
    "faqs": [
      {
        "q": "Is an iOS HealthKit or Android Health Connect permission the same as GDPR consent?",
        "a": "No. An OS permission grant is a device-level access control that decides whether your app can read or write those data types. It is not automatically a GDPR lawful basis for your subsequent processing, storage, or sharing. You typically still need a separate, GDPR-valid consent (or another lawful basis) for what you do with the data."
      },
      {
        "q": "What makes consent valid under GDPR?",
        "a": "It must be freely given, specific, informed, and unambiguous — a clear affirmative opt-in, with no pre-ticked boxes, silence, or default-on settings counting as consent. It should be granular (a separate opt-in per purpose) and as easy to withdraw as to give. For health data, which is special-category, the usual route is explicit consent, a higher bar."
      },
      {
        "q": "Do I need separate consent to sell or share health data?",
        "a": "Under Washington's My Health My Data Act, yes — consent to collect or share is separate from a distinct, signed authorization to sell consumer health data. Per the statute, that sale authorization is its own signed document, and both seller and purchaser must retain it for six years. Other states have similar-but-different rules, so verify the current landscape."
      },
      {
        "q": "What consent records do I need to keep?",
        "a": "GDPR requires you to be able to demonstrate consent, so keep versioned logs of who consented, when, what they were told (the exact wording and version they saw), and how they can withdraw. If you cannot show these, you effectively cannot show valid consent. Treat consent records as part of your data model, not an afterthought."
      },
      {
        "q": "What about consent for children's health data?",
        "a": "In the US, COPPA requires verifiable parental consent to collect data from children under 13, usually via an age gate or neutral age-screen. GDPR sets a digital-consent age of 16 that member states may lower to as low as 13, below which parental consent is required. Thresholds vary by jurisdiction, so verify the current numbers for your markets."
      }
    ],
    "related": [
      {
        "href": "/learn/what-is-oauth-for-health-data",
        "label": "What is OAuth for health data?"
      },
      {
        "href": "/compliance/gdpr-fitness-app",
        "label": "GDPR for fitness & health apps"
      },
      {
        "href": "/compliance/health-app-privacy-policy",
        "label": "Health app privacy policy"
      },
      {
        "href": "/compliance",
        "label": "Health-data compliance & privacy"
      }
    ],
    "cta": {
      "pitch": "Consent rules for health data shift fast across GDPR and state laws in 2026; subscribe for plain-English updates on what changes for fitness apps."
    }
  },
  {
    "slug": "health-app-privacy-policy",
    "primaryQuery": "fitness app privacy policy",
    "h1": "What Does a Fitness App Privacy Policy Need to Include?",
    "metaTitle": "Fitness App Privacy Policy: What to Include",
    "metaDescription": "What a health or fitness app privacy policy must cover, from data collected and legal basis to user rights, and why it must match your real practices.",
    "updated": "2026-07-14",
    "answer": "If your app collects health or fitness data, you need a privacy policy: both Apple and Google require one, in your store listing and inside the app, and GDPR's transparency rules expect it too. It should cover who you are, what data you collect (health data specifically), why and on what legal basis, who you share it with, transfers, retention, user rights, security, children, and how you handle changes. The critical part is accuracy: it must match what your app actually does and your app-store data labels. This is general guidance, not legal advice, so have a qualified professional review your policy.",
    "body": "## Do you actually need one?\n\nAlmost certainly, if you handle any health or fitness data. Two separate forces make it non-negotiable:\n\n- **Platform rules.** Apple requires a linked privacy policy under its App Store Review Guidelines (guideline 5.1.1(i), verify current numbering). Google requires one for any app handling \"personal and sensitive user data,\" which explicitly includes health and fitness data. Both want it in the store listing and in-app.\n- **Data-protection law.** GDPR's transparency duty (Articles 13-14) requires you to tell people specific things about how you process their data, in clear language, at the point you collect it. For EU users that transparency notice is, in practice, your privacy policy. Many US state consumer-health laws also require a health-data privacy notice.\n\nSo the question is rarely \"do I need one\" but \"does mine say the right things and match reality.\" For the wider question of which laws apply to a consumer fitness app, see the [GDPR for fitness apps](/compliance/gdpr-fitness-app) page — most direct-to-consumer apps are not HIPAA-covered, so don't model your policy on a hospital's.\n\n## What a health-app privacy policy must cover\n\nThe list below synthesizes GDPR Articles 13-14 with Apple and Google platform requirements. Treat it as a checklist of sections to draft and then have reviewed — not as text to paste.\n\n| Section | What to include |\n| --- | --- |\n| **Identity and contact** | Who the data controller is (your legal entity, not just a brand name) and how to reach you. Include a **Data Protection Officer** contact if you're required to appoint one — GDPR expects a DPO where core activities involve large-scale processing of special-category data, which a fitness app at scale can hit (verify against your own scale). |\n| **What data you collect** | Every category, with an explicit call-out of **health and fitness data** and any other special-category data. Be specific: heart rate, workouts, sleep, location, and so on — not a vague \"usage data.\" |\n| **Purposes and legal basis** | Why you process each category, and the legal basis for it (for example consent, contract, or legitimate interests). For health data under GDPR you generally also need an Article 9 condition, usually explicit consent. |\n| **Third parties and processors** | Who you share data with — analytics, cloud hosting, embedded SDKs — by name or category, and what they do with it. |\n| **International transfers** | If data leaves its region (for example EU data going to US servers), say so and name the safeguard, such as Standard Contractual Clauses or an adequacy decision. |\n| **Retention periods** | How long you keep each category, or the criteria you use to decide. GDPR sets no fixed number — you define and justify it. See the [retention and deletion](/compliance/health-data-retention-deletion) guide. |\n| **User rights and how to exercise them** | Access, rectification, erasure, restriction, portability, objection, and withdrawing consent — plus the actual mechanism (an email, an in-app control) to use them. |\n| **Security summary** | A high-level, honest description of how you protect the data. Don't over-promise specifics you don't do. |\n| **Children** | Whether the service is intended for or collects data from minors, and how you handle that (age gates, parental consent where required). |\n| **Policy changes** | How you notify users when the policy changes, and where they can see the current version. |\n| **How to complain** | For EU users, the right to lodge a complaint with a supervisory authority. |\n\n## Accuracy is the whole point\n\nThe single biggest failure mode here is a policy that's technically present but factually wrong — usually because it was copied from a template or another app. Three things must line up:\n\n1. **The policy** — what you say you do.\n2. **Your actual data practices** — what your code actually does.\n3. **Your app-store data labels** — Apple's App Privacy \"nutrition labels\" and Google's Data safety form, both of which you fill in separately and both of which must reflect real behavior, including your third-party SDKs.\n\nWhen these three disagree, you have a problem. A policy that promises you \"never share data with third parties\" while an analytics SDK quietly ships events is a broken promise — and broken privacy promises are a classic FTC \"deceptive practices\" hook in the US, on top of app-store rejection. A copy-paste template that describes a different app's data flows is a liability, not a shortcut.\n\n## What this means for a fitness app builder\n\n- **Write the policy from your data map, not from a template.** Inventory what you collect, where it goes, and who touches it first; the policy is the write-up of that inventory. If you can't describe a data flow, you can't disclose it accurately.\n- **Keep the policy, your code, and your store labels in sync.** Treat a change to any one as a prompt to check the other two. Adding an SDK is a policy-and-label event, not just an engineering one.\n- **A policy is necessary but not sufficient.** It does not, by itself, satisfy Google's in-app **prominent disclosure and consent** requirement, or Apple's purpose strings and consent prompts. Those are additional, in-app steps. And an OS permission grant is not the same as legal consent — see [health data user consent](/compliance/health-data-user-consent).\n- **Match it to the platform rules you ship under.** The [Apple App Store health data rules](/compliance/app-store-health-data-rules) page covers what Apple expects the policy to contain; Google's expectations differ in the details.\n- **Have counsel review before you publish.** This page tells you what sections to include; a qualified professional confirms the wording is correct for your jurisdictions and your actual processing.\n\n## A note on limits\n\nThis is general guidance, not legal advice, and privacy-policy obligations vary by jurisdiction and by exactly what your app does. The section list here is a drafting aid, not a compliance guarantee — a policy that ticks every box but misdescribes your app still fails. App-store requirements and data-protection law both evolve, so verify the current Apple and Google policy text and the current legal requirements for your markets, and have a qualified professional review the finished policy before you rely on it.",
    "faqs": [
      {
        "q": "Do Apple and Google require a privacy policy for a health app?",
        "a": "Yes. Apple requires a linked privacy policy under its App Store Review Guidelines, and Google requires one for any app handling personal and sensitive user data, which includes health and fitness data. Both expect it in the store listing and accessible inside the app. Verify the current policy text before you submit, since both platforms update their rules."
      },
      {
        "q": "Can I use a privacy policy template for my fitness app?",
        "a": "You can use one as a starting structure, but not as finished text. A template that misdescribes what your app actually collects, shares, or retains is a liability, because a mismatch between your policy and your real behavior is what triggers app-store rejection and, in the US, FTC deceptive-practices risk. Write the policy from your actual data map and have counsel review it."
      },
      {
        "q": "Does having a privacy policy mean I have valid consent?",
        "a": "No. A privacy policy is a transparency document, not a consent mechanism. It does not by itself satisfy Google's in-app prominent disclosure and consent requirement or Apple's consent prompts and purpose strings, which are additional steps. An operating-system permission grant is also not the same as legal consent for what you do with the data."
      },
      {
        "q": "Do I need a DPO contact in my privacy policy?",
        "a": "Only if you are required to appoint a Data Protection Officer. Under GDPR that is generally expected where your core activities involve large-scale processing of special-category data, which a fitness app at scale can meet. If you have appointed one, include their contact. Verify whether the requirement applies to your specific processing."
      },
      {
        "q": "What retention period should my policy state?",
        "a": "GDPR sets no fixed number. You define, document, and justify a retention period for each data category, or state the criteria you use to decide, then delete or anonymize when the purpose ends. Avoid stating a universal figure; base it on your actual purposes. See the retention and deletion guide for how to set and honor these periods."
      }
    ],
    "related": [
      {
        "href": "/compliance/health-data-retention-deletion",
        "label": "Health-data retention & deletion"
      },
      {
        "href": "/compliance/gdpr-fitness-app",
        "label": "GDPR for fitness & health apps"
      },
      {
        "href": "/compliance/app-store-health-data-rules",
        "label": "Apple App Store health-data rules"
      },
      {
        "href": "/compliance",
        "label": "Health-data compliance & privacy"
      }
    ],
    "cta": {
      "pitch": "Privacy-policy and app-store data-disclosure rules keep shifting; subscribe for plain-English updates on what fitness app builders need to change."
    }
  },
  {
    "slug": "health-data-retention-deletion",
    "primaryQuery": "health data retention and deletion",
    "h1": "Health Data Retention and Deletion: A Developer's Guide",
    "metaTitle": "Health Data Retention & Deletion for Apps",
    "metaDescription": "How long can a fitness app keep health data, and how do you delete it? GDPR storage limitation, the right to erasure, and in-app deletion, explained.",
    "updated": "2026-07-14",
    "answer": "You generally cannot keep health or fitness data longer than you need it: GDPR's storage limitation principle expects a documented retention schedule per data type, and the right to erasure lets users require deletion in defined cases. Apple and Google separately require an in-app account and data deletion path, and any deletion has to reach backups, logs, and third-party processors, not just your main database. This is general engineering guidance, not legal advice; retention periods and how erasure applies depend on your app and jurisdiction, so confirm your obligations with a qualified professional.",
    "body": "## The short answer\n\nTwo different obligations sit on top of each other here, and it helps to keep them separate:\n\n- **Retention** — GDPR's *storage limitation* principle (Article 5(1)(e)): keep personal data no longer than necessary for the purpose you collected it for, then delete or anonymize it.\n- **Deletion** — the *right to erasure* (Article 17): users can require you to delete their data in specific circumstances, \"without undue delay.\"\n\nAnd running alongside GDPR: **app-store rules**. Apple and Google require an in-app deletion path regardless of where your users live. These are contractual store requirements, related to but distinct from GDPR law.\n\n## Retention: storage limitation and data minimization\n\nGDPR's storage limitation principle (Article 5(1)(e)) is the core rule: don't keep personal data longer than you need it for the stated purpose. Importantly, **GDPR sets no fixed retention periods** — there is no universal \"delete after N days.\" Instead, you as the controller have to **define, document, and justify** a retention schedule for each category of data, and then delete or anonymize that data once the purpose ends.\n\nThis works hand in hand with **data minimization** (Article 5(1)(c)): collect less, and keep less. Data you don't hold can't be breached, and it stays out of scope for a deletion request. For sensitive health data, that \"collect less, keep less\" posture is one of the highest-leverage things you can do.\n\nA practical way to make this concrete is a retention schedule mapped per data type. The values below are illustrative, not legal minimums — you have to set and justify your own based on your actual purposes.\n\n| Data type | Suggested approach | Notes |\n|---|---|---|\n| Raw workout / wearable metrics (heart rate, steps, sleep) | Keep while the account is active; delete or anonymize when the purpose ends | The core sensitive data — minimize what you store and for how long |\n| Derived/aggregate stats (trends, scores) | Consider anonymizing rather than retaining raw inputs | Anonymized data falls outside personal-data rules if truly non-identifying |\n| Account / profile data | Keep for the life of the account; delete on account deletion | Tie its lifetime to the account |\n| Consent records | Retain as long as you rely on the consent, plus a reasonable proof window | You must be able to demonstrate consent even after processing |\n| Logs / analytics containing personal data | Keep the shortest period that meets your operational need | A common blind spot — health values should not sit in plaintext logs |\n| Records under a legal-retention obligation (e.g. tax, financial) | Retain for the legally required period only | An erasure exception applies — see below |\n\nThe point isn't the specific numbers; it's that you can point to a documented, justified reason for each period.\n\n## Deletion: the right to erasure (Article 17)\n\nUnder Article 17, a user can require you to delete their personal data \"without undue delay\" in situations including:\n\n- the data is **no longer necessary** for the purpose it was collected,\n- they **withdraw consent** and there's no other legal basis,\n- they **object** to the processing, or\n- the data was **unlawfully processed**.\n\nBut the right to erasure is **not absolute** — don't design (or market) it as \"users can always force instant, total deletion of everything.\" Article 17(3) sets out exceptions where you may lawfully retain data despite an erasure request:\n\n| Exception (Art. 17(3)) | What it covers |\n|---|---|\n| Legal obligation / legal retention | Records you're required by law to keep (tax, financial, certain health records) |\n| Legal claims | Data needed to establish, exercise, or defend legal claims (a \"legal hold\") |\n| Freedom of expression and information | Limited public-interest / expression contexts |\n| Public health; archiving, research, statistics | Defined public-interest and scientific/statistical purposes |\n\nThe discipline here: honor the deletion request except where a lawful retention basis genuinely applies — and when one does, **document the exception, retain only the minimum data it actually covers, for the specific reason**, and delete it once the hold or obligation ends.\n\n## The in-app deletion requirement (Apple and Google)\n\nIndependent of GDPR, the app stores impose their own deletion rules:\n\n- **Apple** (guideline 5.1.1(v), verify current subsection) requires apps that support account creation to offer **account deletion — and the associated data — from within the app**. A link to email support isn't enough.\n- **Google Play** requires an in-app **account deletion** path *and* an option to **delete data without deleting the account**, plus a **web-accessible** deletion route, all disclosed in the Play **Data safety** form. Verify the exact current wording and scope, as Google's deletion-flow requirements have evolved.\n\nThese are contractual store requirements that can bite before any statute does. For the full platform picture see our [Apple App Store health-data rules](/compliance/app-store-health-data-rules) and [Google Play health-data policy](/compliance/google-play-health-data-policy) pages.\n\n## The hard part: propagating deletion everywhere\n\nA deletion isn't done when the row leaves your primary database. To actually erase a user's data, deletion has to reach:\n\n- **backups and replicas**,\n- **caches**,\n- **logs and analytics** (a frequent place health data leaks into),\n- and every **third-party processor and sub-processor** you've sent data to.\n\nTwo things make this a real engineering problem. First, **processors**: under GDPR Article 28 you should contractually require your processors (analytics, cloud, aggregators, SDK vendors) to delete data on your instruction — and you need a way to actually issue and confirm that instruction. Second, **backups**: they're the classic gap. Deletions can lawfully lag against a backup cycle if you **document how deletions reconcile against backups** and keep access to those backups restricted in the meantime — but you have to have a plan, not a silent gap. Design a deletion pipeline, not a single `DELETE` statement.\n\nFor how you store the data in the first place — including why backups need their own retention and deletion coverage — see [store health data securely](/compliance/store-health-data-securely).\n\n## What this means for a fitness app\n\n- **Write down a retention schedule** per data type and justify each period. \"We keep everything indefinitely\" is the posture regulators push back on.\n- **Minimize first.** The less you collect and keep, the smaller your breach surface and your deletion workload.\n- **Ship deletion as a real feature**, in-app, covering both the account and its data — you need it for the stores anyway, and it's how you operationalize Article 17.\n- **Build deletion to fan out** to backups, caches, logs, analytics, and processors — and put Article 28 delete-on-instruction terms in your processor contracts.\n- **Handle legal holds explicitly.** Have a documented way to retain the minimum necessary when a lawful exception applies, and to delete it when the reason ends.\n- **State your retention and deletion practices in your privacy policy** — see our [health app privacy policy](/compliance/health-app-privacy-policy) guide — and keep those statements matching what your systems actually do.\n\n## Limits and nuance\n\nRetention periods are context-specific: avoid committing to a universal number of days or years, and set yours against your actual purposes. The right to erasure is real but bounded by the Article 17(3) exceptions. And remember the two tracks are distinct — the platform in-app-deletion requirements are store rules, while GDPR erasure and storage limitation are law; you generally have to satisfy both. For how erasure fits into the wider set of EU obligations, see [GDPR for fitness apps](/compliance/gdpr-fitness-app). Use this as a starting map, not a compliance sign-off, and get advice from a qualified professional for your specific case.",
    "faqs": [
      {
        "q": "How long can a fitness app keep users' health data?",
        "a": "There is no universal number. GDPR's storage limitation principle (Article 5(1)(e)) says keep personal data no longer than necessary for the purpose you collected it for, but it sets no fixed periods. You have to define, document, and justify your own retention schedule per data category, then delete or anonymize the data once the purpose ends. Avoid committing to a universal figure and set yours against your actual purposes."
      },
      {
        "q": "Can a user always force me to delete all their data?",
        "a": "Not always. The right to erasure (Article 17) lets users require deletion in defined situations, such as the data no longer being needed or consent being withdrawn, but it is not absolute. Article 17(3) allows you to retain data despite an erasure request where a lawful basis applies, for example a legal-retention obligation or a legal hold to defend claims. In those cases retain only the minimum data the exception covers, document it, and delete once the reason ends."
      },
      {
        "q": "Do I have to let users delete their account inside the app?",
        "a": "For the app stores, yes. Apple requires apps that support account creation to offer account and associated-data deletion from within the app. Google Play requires an in-app account deletion path plus an option to delete data without deleting the account, and a web-accessible deletion route disclosed in the Data safety form. These are contractual store rules, distinct from GDPR erasure; verify the current wording as both platforms update it."
      },
      {
        "q": "Does deleting a database record satisfy a deletion request?",
        "a": "Usually not on its own. Deletion has to propagate to backups, replicas, caches, logs, analytics, and any third-party processors or sub-processors that hold the data. Under GDPR Article 28 you should contractually require processors to delete on your instruction. Backups are a common gap: deletion can lawfully lag a backup cycle if you document how it reconciles and keep backup access restricted in the meantime."
      },
      {
        "q": "Is data minimization the same as retention?",
        "a": "They are related but distinct. Data minimization (Article 5(1)(c)) is about collecting and keeping less in the first place; storage limitation (Article 5(1)(e)) is about not holding data longer than needed. Together they shrink both your breach surface and your deletion workload, which is why minimizing what you store is one of the highest-leverage steps for sensitive health data."
      }
    ],
    "related": [
      {
        "href": "/compliance/health-app-privacy-policy",
        "label": "Health app privacy policy"
      },
      {
        "href": "/compliance/store-health-data-securely",
        "label": "How to store health data securely"
      },
      {
        "href": "/compliance/gdpr-fitness-app",
        "label": "GDPR for fitness & health apps"
      },
      {
        "href": "/compliance",
        "label": "Health-data compliance & privacy"
      }
    ],
    "cta": {
      "pitch": "Retention and deletion rules keep shifting across GDPR and the app stores; subscribe for plain-English updates on what changes for fitness app builders."
    }
  },
  {
    "slug": "app-store-guideline-5-1-3-health-research",
    "primaryQuery": "app store guideline 5.1.3",
    "h1": "App Store Guideline 5.1.3: Health and Health Research",
    "metaTitle": "App Store Guideline 5.1.3: Health and Health Research",
    "metaDescription": "Apple's guideline 5.1.3 quoted in full: what it means for HealthKit and fitness apps, what triggers it, and a checklist to clear before resubmitting.",
    "updated": "2026-10-03",
    "answer": "App Store Review Guideline 5.1.3, Health and Health Research, bars apps from using or disclosing health, fitness and medical data for advertising, marketing or use-based data mining, from writing false or inaccurate data into HealthKit, and from storing personal health information in iCloud. Apps must also disclose the specific health data they collect from the device. Apps that run health-related human-subject research additionally need informed consent and approval from an independent ethics review board. Quoted from the guidelines as last updated June 8, 2026, checked October 3, 2026; this is general guidance, not legal advice.",
    "body": "## The guideline text\n\nQuoted verbatim from Apple's [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#5.1.3), which the page states were last updated June 8, 2026. We checked the text on October 3, 2026. Apple revises the guidelines and sometimes renumbers sub-items, so compare this against the live page before you cite it in a reply to App Review.\n\n> **5.1.3 Health and Health Research**\n>\n> Health, fitness, and medical data are especially sensitive and apps in this space have some additional rules to make sure customer privacy is protected:\n>\n> (i) Apps may not use or disclose to third parties data gathered in the health, fitness, and medical research context—including from the Clinical Health Records API, HealthKit API, Motion and Fitness, MovementDisorder APIs, or health-related human subject research—for advertising, marketing, or other use-based data mining purposes other than improving health management, or for the purpose of health research, and then only with permission. Apps may, however, use a user’s health or fitness data to provide a benefit directly to that user (such as a reduced insurance premium), provided that the app is submitted by the entity providing the benefit, and the data is not shared with a third party. You must disclose the specific health data that you are collecting from the device.\n>\n> (ii) Apps must not write false or inaccurate data into HealthKit or any other medical research or health management apps, and may not store personal health information in iCloud.\n>\n> (iii) Apps conducting health-related human subject research must obtain consent from participants or, in the case of minors, their parent or guardian. Such consent must include the (a) nature, purpose, and duration of the research; (b) procedures, risks, and benefits to the participant; (c) information about confidentiality and handling of data (including any sharing with third parties); (d) a point of contact for participant questions; and (e) the withdrawal process.\n>\n> (iv) Apps conducting health-related human subject research must secure approval from an independent ethics review board. Proof of such approval must be provided upon request.\n\n## What it means for a fitness or health app\n\nGuideline 5.1.3 sits inside section 5.1, Privacy, and adds rules on top of the general data rules in [guideline 5.1.1](/compliance/app-store-guideline-5-1-1-data-collection-storage) and [guideline 5.1.2](/compliance/app-store-guideline-5-1-2-data-use-sharing). Read item by item:\n\n- **5.1.3(i) restricts what you do with the data.** It covers data gathered in \"the health, fitness, and medical research context\" and names the Clinical Health Records API, the HealthKit API, Motion and Fitness, the MovementDisorder APIs and health-related human subject research. You may not use that data, or disclose it to third parties, for advertising, marketing or \"other use-based data mining purposes\". The exceptions are improving health management and health research, \"and then only with permission\".\n- **The benefit carve-out is narrow.** You can use a user's health or fitness data to give that same user a benefit, and Apple's example is a reduced insurance premium. Two conditions apply: the app must be submitted by the entity providing the benefit, and the data must not be shared with a third party.\n- **5.1.3(i) also requires disclosure.** \"You must disclose the specific health data that you are collecting from the device.\" In our reading, a generic line such as \"we collect health data\" falls short of \"specific\". Name the types.\n- **5.1.3(ii) contains two separate rules.** Don't write false or inaccurate data into HealthKit or into other health apps, and don't store personal health information in iCloud.\n- **5.1.3(iii) and (iv) apply only to research.** If your app runs health-related human subject research, you need informed consent with the five listed elements and approval from an independent ethics review board. A typical workout tracker doesn't run research and isn't affected.\n\n## What typically triggers it in a HealthKit app\n\nThe patterns below come from the guideline text and from Apple's HealthKit documentation, not from a database of rejections. Apple doesn't publish one. In Apple's [\"Protecting user privacy\"](https://developer.apple.com/documentation/healthkit/protecting-user-privacy) article, the rules for all HealthKit apps include:\n\n- \"Your app may not use information gained through the use of the HealthKit framework for advertising or similar services. Note that you may still serve advertising in an app that uses the HealthKit framework, but you can’t use data from the HealthKit store to serve ads.\"\n- \"You must not disclose any information gained through HealthKit to a third party without express permission from the user. Even with permission, you can only share information to a third party if they also provide a health or fitness service to the user.\"\n- \"You can’t sell information gained through HealthKit to advertising platforms, data brokers, or information resellers.\"\n- \"You must clearly disclose to the user how you and your app will use their HealthKit data.\"\n\nIn practice, these designs run into those rules:\n\n- **Health values in analytics or attribution events.** A workout's heart rate or step total attached as an event property and sent to a marketing or ad SDK is a use the guideline names.\n- **A partner integration without a health or fitness purpose.** Under Apple's HealthKit documentation, sending HealthKit data to a third party needs express permission, and the third party must provide a health or fitness service to the user.\n- **No specific disclosure.** The privacy policy or the in-app explanation doesn't say which health data types you collect.\n- **Sync built on iCloud.** Personal health information stored in any iCloud-backed storage your sync relies on is covered by 5.1.3(ii) as written.\n- **Writing samples you can't vouch for.** Examples include demo or seed data left in a release build, or duplicates written on every launch. Our reading is that these fall under \"false or inaccurate data\".\n\n## Checklist before you resubmit\n\n1. **Trace every path HealthKit data takes.** List each place a HealthKit, Motion and Fitness or other health value goes after your app reads it: your backend, analytics, crash reporting, attribution and ad SDKs, and any partner API. Guideline 5.1.3(i) is about use and disclosure, so the audit has to cover destinations, not just the read call.\n2. **Cut health data out of advertising, marketing and data-mining tools.** Remove health values from ad, attribution, marketing and data-mining pipelines, including event properties and user attributes that carry them. Apple's HealthKit documentation says you may still serve ads in a HealthKit app but cannot use data from the HealthKit store to serve them.\n3. **Check every third party that receives health data.** For each recipient, confirm the user gave express permission and that the recipient provides a health or fitness service to the user, which is the condition Apple's HealthKit documentation sets. Remove any sale or transfer to advertising platforms, data brokers or information resellers.\n4. **Disclose the specific health data you collect.** Name the health data types you collect from the device, in your privacy policy and in the app, and say how you use them. Guideline 5.1.3(i) requires disclosing the specific health data, and Apple's HealthKit documentation requires clearly disclosing how you use it.\n5. **Stop writing anything you cannot stand behind into HealthKit.** Remove demo, test, placeholder and duplicate samples from production write paths, and check that units and timestamps are correct. Guideline 5.1.3(ii) bars writing false or inaccurate data into HealthKit.\n6. **Move personal health information out of iCloud.** If your sync or backup stores personal health information in iCloud, redesign it before resubmitting. Guideline 5.1.3(ii) says apps may not store personal health information in iCloud.\n7. **If you run research, have the consent form and ethics approval ready.** For health-related human subject research, make sure the in-app consent covers all five elements listed in 5.1.3(iii), with parent or guardian consent for minors, and keep the independent ethics review board approval on hand, because 5.1.3(iv) says Apple can ask for proof.\n\nWhen you reply to App Review, a short list of what you changed is easier to check than a general statement that you comply.\n\n## Related guidelines\n\n- **5.1.2(vi)** separately says data from HealthKit, the Clinical Health Records API and the MovementDisorder APIs \"may not be used for marketing, advertising or use-based data mining, including by third parties\". See [guideline 5.1.2](/compliance/app-store-guideline-5-1-2-data-use-sharing).\n- **2.5.18** says ads \"may not engage in targeted or behavioral advertising based on sensitive user data such as health/medical data (e.g. from the HealthKit APIs)\".\n- For an overview of all of Apple's health-data rules, see [Apple App Store health data rules](/compliance/app-store-health-data-rules). For the permission flow itself, see the [HealthKit integration guide](/integrate/healthkit).\n\n## A note on limits\n\nApp Store guidelines are contractual rules enforced through App Review. They aren't law, and passing review doesn't make an app compliant with GDPR, HIPAA or state consumer-health laws. Apple doesn't define \"use-based data mining\" in the guideline, so where your design depends on how that phrase is read, ask App Review or a qualified professional. This page is general guidance, not legal advice.\n",
    "steps": [
      {
        "name": "Trace every path HealthKit data takes",
        "text": "List each place a HealthKit, Motion and Fitness or other health value goes after your app reads it: your backend, analytics, crash reporting, attribution and ad SDKs, and any partner API. Guideline 5.1.3(i) is about use and disclosure, so the audit has to cover destinations, not just the read call."
      },
      {
        "name": "Cut health data out of advertising, marketing and data-mining tools",
        "text": "Remove health values from ad, attribution, marketing and data-mining pipelines, including event properties and user attributes that carry them. Apple's HealthKit documentation says you may still serve ads in a HealthKit app but cannot use data from the HealthKit store to serve them."
      },
      {
        "name": "Check every third party that receives health data",
        "text": "For each recipient, confirm the user gave express permission and that the recipient provides a health or fitness service to the user, which is the condition Apple's HealthKit documentation sets. Remove any sale or transfer to advertising platforms, data brokers or information resellers."
      },
      {
        "name": "Disclose the specific health data you collect",
        "text": "Name the health data types you collect from the device, in your privacy policy and in the app, and say how you use them. Guideline 5.1.3(i) requires disclosing the specific health data, and Apple's HealthKit documentation requires clearly disclosing how you use it."
      },
      {
        "name": "Stop writing anything you cannot stand behind into HealthKit",
        "text": "Remove demo, test, placeholder and duplicate samples from production write paths, and check that units and timestamps are correct. Guideline 5.1.3(ii) bars writing false or inaccurate data into HealthKit."
      },
      {
        "name": "Move personal health information out of iCloud",
        "text": "If your sync or backup stores personal health information in iCloud, redesign it before resubmitting. Guideline 5.1.3(ii) says apps may not store personal health information in iCloud."
      },
      {
        "name": "If you run research, have the consent form and ethics approval ready",
        "text": "For health-related human subject research, make sure the in-app consent covers all five elements listed in 5.1.3(iii), with parent or guardian consent for minors, and keep the independent ethics review board approval on hand, because 5.1.3(iv) says Apple can ask for proof."
      }
    ],
    "faqs": [
      {
        "q": "Does guideline 5.1.3 stop me from showing ads in a HealthKit app?",
        "a": "Not by itself. Apple's HealthKit documentation says you may still serve advertising in an app that uses HealthKit, but you cannot use data from the HealthKit store to serve ads. Guideline 2.5.18 also bars targeted or behavioral advertising based on health or medical data, so keep health values out of ad targeting entirely."
      },
      {
        "q": "What is the insurance-premium exception in guideline 5.1.3(i)?",
        "a": "Guideline 5.1.3(i) lets an app use a user's health or fitness data to provide a benefit directly to that user, with a reduced insurance premium as Apple's example. It applies only if the app is submitted by the entity providing the benefit and the data is not shared with a third party. It is not a general permission to share health data."
      },
      {
        "q": "Does guideline 5.1.3 apply if my app only reads step count from HealthKit?",
        "a": "Yes. The guideline covers data gathered in the health, fitness and medical research context and names the HealthKit API, so step count read through HealthKit is covered. You still have to disclose the specific health data you collect and keep it out of advertising, marketing and use-based data mining."
      },
      {
        "q": "Does a fitness app need ethics board approval under guideline 5.1.3?",
        "a": "Only if it conducts health-related human subject research. Guidelines 5.1.3(iii) and (iv) require participant consent covering five listed elements and approval from an independent ethics review board, with proof provided on request. An ordinary workout or step tracker that runs no research is not affected by those two items."
      }
    ],
    "related": [
      {
        "href": "/compliance/app-store-health-data-rules",
        "label": "Apple App Store health data rules (overview)"
      },
      {
        "href": "/compliance/app-store-guideline-5-1-2-data-use-sharing",
        "label": "App Store guideline 5.1.2: Data Use and Sharing"
      },
      {
        "href": "/integrate/healthkit",
        "label": "How to integrate Apple HealthKit"
      },
      {
        "href": "/compliance/health-app-privacy-policy",
        "label": "Health app privacy policy"
      },
      {
        "href": "/compliance",
        "label": "Health-data compliance & privacy"
      }
    ],
    "cta": {
      "pitch": "Apple revises its App Review Guidelines without much notice. Subscribe and we'll flag changes to the health-data sections when they happen."
    },
    "sources": [
      {
        "url": "https://developer.apple.com/app-store/review/guidelines/",
        "checked": "2026-10-03",
        "note": "guideline 5.1.3(i)–(iv), 5.1.2(vi) and 2.5.18; last updated June 8, 2026"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/protecting-user-privacy",
        "checked": "2026-10-03",
        "note": "HealthKit rules on advertising, third-party disclosure, sale and disclosure to users"
      }
    ]
  },
  {
    "slug": "app-store-guideline-5-1-1-data-collection-storage",
    "primaryQuery": "app store guideline 5.1.1",
    "h1": "App Store Guideline 5.1.1: Data Collection and Storage",
    "metaTitle": "App Store Guideline 5.1.1: Data Collection and Storage",
    "metaDescription": "Guideline 5.1.1 for health apps: privacy policy links, consent, purpose strings, data minimization and in-app account deletion, quoted with a checklist.",
    "updated": "2026-10-03",
    "answer": "App Store Review Guideline 5.1.1, Data Collection and Storage, requires every app to link a privacy policy in App Store Connect and in the app, get consent before collecting data, write purpose strings that fully describe the use, and request only the data its core features need. Paid features can't depend on granting data access. Apps that let users create an account must also offer account deletion inside the app. Quoted from the guidelines as last updated June 8, 2026, checked October 3, 2026; this is general guidance, not legal advice.",
    "body": "## The guideline text\n\nQuoted verbatim from Apple's [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#5.1.1), which the page states were last updated June 8, 2026. We checked the text on October 3, 2026. Apple revises the guidelines and sometimes renumbers sub-items, so compare this against the live page before you cite it in a reply to App Review.\n\nGuideline 5.1.1 has ten sub-items. The ones a health or fitness app most often runs into are quoted below. The others cover password discovery, SafariViewController, compiling personal information from other sources and optional contact information.\n\n> **5.1.1 Data Collection and Storage**\n>\n> (i) Privacy Policies: All apps must include a link to their privacy policy in the App Store Connect metadata field and within the app in an easily accessible manner. The privacy policy must clearly and explicitly:\n>\n> - Identify what data, if any, the app/service collects, how it collects that data, and all uses of that data.\n>\n> - Confirm that any third party with whom an app shares user data (in compliance with these Guidelines)—such as analytics tools, advertising networks and third-party SDKs, as well as any parent, subsidiary or other related entities that will have access to user data—will provide the same or equal protection of user data as stated in the app’s privacy policy and required by these Guidelines.\n>\n> - Explain its data retention/deletion policies and describe how a user can revoke consent and/or request deletion of the user’s data.\n>\n> (ii) Permission: Apps that collect user or usage data must secure user consent for the collection, even if such data is considered to be anonymous at the time of or immediately following collection. Paid functionality must not be dependent on or require a user to grant access to this data. Apps must also provide the customer with an easily accessible and understandable way to withdraw consent. Ensure your purpose strings clearly and completely describe your use of the data. Apps that collect data for a legitimate interest without consent by relying on the terms of the European Union’s General Data Protection Regulation (“GDPR”) or similar statute must comply with all terms of that law. Learn more about Requesting Permission.\n>\n> (iii) Data Minimization: Apps should only request access to data relevant to the core functionality of the app and should only collect and use data that is required to accomplish the relevant task. Where possible, use the out-of-process picker or a share sheet rather than requesting full access to protected resources like Photos or Contacts.\n>\n> (iv) Access: Apps must respect the user’s permission settings and not attempt to manipulate, trick, or force people to consent to unnecessary data access. For example, apps that include the ability to post photos to a social network must not also require microphone access before allowing the user to upload photos. Where possible, provide alternative solutions for users who don’t grant consent. For example, if a user declines to share Location, offer the ability to manually enter an address.\n>\n> (v) Account Sign-In: If your app doesn’t include significant account-based features, let people use it without a login. If your app supports account creation, you must also offer account deletion within the app. Apps may not require users to enter personal information to function, except when directly relevant to the core functionality of the app or required by law. If your core app functionality is not related to a specific social network (e.g. Facebook, WeChat, Weibo, X, etc.), you must provide access without a login or via another mechanism. Pulling basic profile information, sharing to the social network, or inviting friends to use the app are not considered core app functionality. The app must also include a mechanism to revoke social network credentials and disable data access between the app and social network from within the app. An app may not store credentials or tokens to social networks off of the device and may only use such credentials or tokens to directly connect to the social network from the app itself while the app is in use.\n>\n> (ix) Apps that provide services in highly regulated fields (such as banking and financial services, healthcare, gambling, legal cannabis use, air travel and crypto exchanges) or that require sensitive user information should be submitted by a legal entity that provides the services, and not by an individual developer. Apps that facilitate the legal sale of cannabis must be geo-restricted to the corresponding legal jurisdiction.\n\n## What it means for a fitness or health app\n\n- **5.1.1(i): every app needs a privacy policy linked in two places,** in App Store Connect and inside the app. The policy has to cover three points: what you collect, how and for which uses; equal protection from any third party you share with, which Apple says includes analytics tools, ad networks and third-party SDKs; and retention, deletion and how users revoke consent. Our [health app privacy policy](/compliance/health-app-privacy-policy) page covers the content in more detail.\n- **5.1.1(ii): consent and purpose strings.** Collecting user or usage data needs consent, even when you consider the data anonymous. Users need an easy way to withdraw consent. Paid features can't depend on granting data access. Purpose strings must \"clearly and completely describe your use of the data\".\n- **5.1.1(iii) and (iv): ask for less, and don't push.** Request only data relevant to the app's core function. Respect the user's permission settings and don't \"manipulate, trick, or force\" consent. Where possible, offer an alternative for users who decline.\n- **5.1.1(v): logins and account deletion.** Let people use the app without a login unless it has significant account-based features. If users can create an account, they must also be able to delete it from inside the app.\n- **5.1.1(ix): healthcare is a \"highly regulated field\".** Apps providing services in healthcare should be submitted by the legal entity that provides the services. The guideline doesn't say where a fitness app ends and a healthcare service begins, so if your app is close to that line, decide which side it is on before you submit.\n\n## What typically triggers it in a HealthKit app\n\nThese come from the guideline text and Apple's own developer documentation, not from a log of rejections.\n\n- **Missing or vague purpose strings.** Apple's HealthKit documentation is blunt about the first failure: \"Apps must include usage descriptions, or it will crash when you request authorization to access HealthKit data.\" It names the keys too: \"Include the NSHealthShareUsageDescription key to read, and NSHealthUpdateUsageDescription key to write data to Healthkit.\" A string that is present but generic (\"This app uses Health data\") has a harder time meeting the \"clearly and completely\" bar in 5.1.1(ii). If authorization fails or reads come back empty, see [HealthKit authorization denied](/fix/healthkit-authorization-denied).\n- **Asking for every type at first launch.** Apple's HealthKit documentation says: \"you don’t need to request permission for all data types at once. Instead, it might make more sense to wait until you need to access the data before asking for permission.\" Requesting types no feature uses conflicts with 5.1.1(iii).\n- **A paywall that needs Health access.** A subscription feature that won't run until the user grants HealthKit access conflicts with 5.1.1(ii).\n- **Deactivation instead of deletion.** Apple's [account-deletion guidance](https://developer.apple.com/support/offering-account-deletion-in-your-app/) says: \"Offer to delete the entire account record, along with associated personal data. You may include additional options, but only offering to temporarily deactivate or disable an account is insufficient.\" It also says apps outside highly regulated industries \"should not require people to make a phone call, send an email, or go through other support flows\". Apple adds that apps using Sign in with Apple \"should use the Sign in with Apple REST API to revoke user tokens\".\n- **Guest accounts with no delete option.** The same guidance says users should be able to delete automatically created \"guest\" accounts and their data.\n\n## Checklist before you resubmit\n\n1. **Link the privacy policy in both places.** Add the privacy policy URL to the App Store Connect metadata field and put an easily found link inside the app, for example in settings. Guideline 5.1.1(i) requires both.\n2. **Make the policy cover the three required points.** Check that the policy states what data you collect, how and for what uses; that third parties you share with give the same or equal protection; and what your retention and deletion policy is, including how a user revokes consent or requests deletion.\n3. **Rewrite the HealthKit purpose strings.** Make the read and write usage descriptions (NSHealthShareUsageDescription and NSHealthUpdateUsageDescription) say plainly what you read or write and why. Guideline 5.1.1(ii) asks that purpose strings clearly and completely describe your use of the data.\n4. **Request only the types a feature uses, when it needs them.** Remove HealthKit types no shipped feature reads or writes, and consider asking at the moment a feature needs the data. Apple's HealthKit documentation says you don't need to request all types at once.\n5. **Unlock paid features without requiring data access.** Make sure no purchased or subscribed feature refuses to work until the user grants Health or other data access. Guideline 5.1.1(ii) says paid functionality must not depend on it. Where you can, offer a fallback such as manual entry, as 5.1.1(iv) suggests.\n6. **Ship in-app account deletion if users can create accounts.** Put deletion where users can find it, usually in account settings. It should delete the account record along with the associated personal data, not just deactivate it. If a website finishes the process, link straight to that page. If deletion takes time, say how long and confirm when it is done.\n7. **Check whether your app needs a login at all.** If the app has no significant account-based features, let people use it without signing in, as 5.1.1(v) requires.\n8. **Submit as the legal entity if you provide healthcare services.** If your app provides services in healthcare, guideline 5.1.1(ix) says it should be submitted by the legal entity providing them, not by an individual developer account.\n\n## Related\n\n- For what Apple says you may do with the data after collecting it, see [guideline 5.1.2: Data Use and Sharing](/compliance/app-store-guideline-5-1-2-data-use-sharing). For the extra health-specific rules, see [guideline 5.1.3: Health and Health Research](/compliance/app-store-guideline-5-1-3-health-research).\n- For deletion on the data side, see [health data retention and deletion](/compliance/health-data-retention-deletion). For all of Apple's health-data rules in one place, see the [App Store health data rules overview](/compliance/app-store-health-data-rules).\n\n## A note on limits\n\nApple's account-deletion guidance describes deletion as removing the account \"along with any data associated with the account that the developer isn’t legally required to maintain\", and tells you to follow applicable legal requirements for retention. Data you are legally required to keep is not part of what Apple asks you to delete. App Store rules are contractual, not law, and meeting them doesn't settle your obligations under GDPR or state consumer-health laws. This page is general guidance, not legal advice.\n",
    "steps": [
      {
        "name": "Link the privacy policy in both places",
        "text": "Add the privacy policy URL to the App Store Connect metadata field and put an easily found link inside the app, for example in settings. Guideline 5.1.1(i) requires both."
      },
      {
        "name": "Make the policy cover the three required points",
        "text": "Check that the policy states what data you collect, how and for what uses; that third parties you share with give the same or equal protection; and what your retention and deletion policy is, including how a user revokes consent or requests deletion."
      },
      {
        "name": "Rewrite the HealthKit purpose strings",
        "text": "Make the read and write usage descriptions (NSHealthShareUsageDescription and NSHealthUpdateUsageDescription) say plainly what you read or write and why. Guideline 5.1.1(ii) asks that purpose strings clearly and completely describe your use of the data."
      },
      {
        "name": "Request only the types a feature uses, when it needs them",
        "text": "Remove HealthKit types no shipped feature reads or writes, and consider asking at the moment a feature needs the data. Apple's HealthKit documentation says you don't need to request all types at once."
      },
      {
        "name": "Unlock paid features without requiring data access",
        "text": "Make sure no purchased or subscribed feature refuses to work until the user grants Health or other data access. Guideline 5.1.1(ii) says paid functionality must not depend on it. Where you can, offer a fallback such as manual entry, as 5.1.1(iv) suggests."
      },
      {
        "name": "Ship in-app account deletion if users can create accounts",
        "text": "Put deletion where users can find it, usually in account settings. It should delete the account record along with the associated personal data, not just deactivate it. If a website finishes the process, link straight to that page. If deletion takes time, say how long and confirm when it is done."
      },
      {
        "name": "Check whether your app needs a login at all",
        "text": "If the app has no significant account-based features, let people use it without signing in, as 5.1.1(v) requires."
      },
      {
        "name": "Submit as the legal entity if you provide healthcare services",
        "text": "If your app provides services in healthcare, guideline 5.1.1(ix) says it should be submitted by the legal entity providing them, not by an individual developer account."
      }
    ],
    "faqs": [
      {
        "q": "Does guideline 5.1.1(v) let me send users to a website to delete their account?",
        "a": "Users must be able to start deletion inside the app. Apple's account-deletion guidance says that if people need to visit a website to finish, you should link directly to the page where they complete it. Apps outside highly regulated industries should not make people phone, email or go through other support flows."
      },
      {
        "q": "Can a fitness app require a login under guideline 5.1.1?",
        "a": "Only if it has significant account-based features. Guideline 5.1.1(v) says that if your app does not include significant account-based features, you should let people use it without a login, and that apps may not require personal information to function unless it is directly relevant to the core functionality or required by law."
      },
      {
        "q": "Can I lock premium features until the user grants HealthKit access?",
        "a": "Guideline 5.1.1(ii) says paid functionality must not depend on or require a user to grant access to the data the app collects. A subscription feature that refuses to work until Health access is granted conflicts with that sentence. Where possible, offer an alternative such as manual entry, as 5.1.1(iv) suggests."
      },
      {
        "q": "Does guideline 5.1.1(ix) stop individual developers from publishing health apps?",
        "a": "It says apps that provide services in highly regulated fields, with healthcare named among them, should be submitted by a legal entity that provides the services rather than by an individual developer. The guideline does not define where a fitness app becomes a healthcare service, so decide which side your app is on before you submit."
      }
    ],
    "related": [
      {
        "href": "/compliance/app-store-health-data-rules",
        "label": "Apple App Store health data rules (overview)"
      },
      {
        "href": "/compliance/health-app-privacy-policy",
        "label": "Health app privacy policy"
      },
      {
        "href": "/fix/healthkit-authorization-denied",
        "label": "HealthKit authorization denied"
      },
      {
        "href": "/compliance/health-data-retention-deletion",
        "label": "Health data retention & deletion"
      },
      {
        "href": "/compliance",
        "label": "Health-data compliance & privacy"
      }
    ],
    "cta": {
      "pitch": "Apple's privacy rules and account-deletion guidance change between guideline revisions. Subscribe and we'll tell you when the parts that affect health apps move."
    },
    "sources": [
      {
        "url": "https://developer.apple.com/app-store/review/guidelines/",
        "checked": "2026-10-03",
        "note": "guideline 5.1.1(i)–(v) and (ix); last updated June 8, 2026"
      },
      {
        "url": "https://developer.apple.com/support/offering-account-deletion-in-your-app/",
        "checked": "2026-10-03",
        "note": "account record plus associated data, website links, support flows, Sign in with Apple, guest accounts"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/protecting-user-privacy",
        "checked": "2026-10-03",
        "note": "usage-description keys and the crash without them"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/authorizing-access-to-health-data",
        "checked": "2026-10-03",
        "note": "requesting types when needed rather than all at once"
      }
    ]
  },
  {
    "slug": "app-store-guideline-5-1-2-data-use-sharing",
    "primaryQuery": "app store guideline 5.1.2",
    "h1": "App Store Guideline 5.1.2: Data Use and Sharing",
    "metaTitle": "App Store Guideline 5.1.2: Data Use and Sharing",
    "metaDescription": "Guideline 5.1.2 for health apps: permission before sharing, the third-party AI clause, no repurposing, and the HealthKit ad ban, quoted with a checklist.",
    "updated": "2026-10-03",
    "answer": "App Store Review Guideline 5.1.2, Data Use and Sharing, requires permission before you use or share personal data, plus clear disclosure and explicit permission before sharing with any third party, explicitly including third-party AI. Data collected for one purpose can't be repurposed without new consent. Data from HealthKit, the Clinical Health Records API and the MovementDisorder APIs can't be used for marketing, advertising or use-based data mining. Quoted from the guidelines as last updated June 8, 2026, checked October 3, 2026; this is general guidance, not legal advice.",
    "body": "## The guideline text\n\nQuoted verbatim from Apple's [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#5.1.2), which the page states were last updated June 8, 2026. We checked the text on October 3, 2026. Apple revises the guidelines and sometimes renumbers sub-items, so compare this against the live page before you cite it in a reply to App Review.\n\nGuideline 5.1.2 has seven sub-items. The four most relevant to a health or fitness app are quoted below. The others cover contact databases, messaging contacts and Apple Pay data.\n\n> **5.1.2 Data Use and Sharing**\n>\n> (i) Unless otherwise permitted by law, you may not use, transmit, or share someone’s personal data without first obtaining their permission. You must provide access to information about how and where the data will be used. You must clearly disclose where personal data will be shared with third parties, including with third-party AI, and obtain explicit permission before doing so. Data collected from apps may only be shared with third parties to improve the app or serve advertising (in compliance with the Apple Developer Program License Agreement). You must receive explicit permission from users via the App Tracking Transparency APIs to track their activity. Learn more about tracking. Your app may not require users to enable system functionalities (e.g. push notifications, location services, tracking) in order to access functionality, content, use the app, or receive monetary or other compensation, including but not limited to gift cards and codes. Apps that share user data without user consent or otherwise complying with data privacy laws may be removed from sale and may result in your removal from the Apple Developer Program.\n>\n> (ii) Data collected for one purpose may not be repurposed without further consent unless otherwise explicitly permitted by law.\n>\n> (iii) Apps should not attempt to surreptitiously build a user profile based on collected data and may not attempt, facilitate, or encourage others to identify anonymous users or reconstruct user profiles based on data collected from Apple-provided APIs or any data that you say has been collected in an “anonymized,” “aggregated,” or otherwise non-identifiable way.\n>\n> (vi) Data gathered from the HomeKit API, HealthKit, Clinical Health Records API, MovementDisorder APIs, ClassKit or from depth and/or facial mapping tools (e.g. ARKit, Camera APIs, or Photo APIs) may not be used for marketing, advertising or use-based data mining, including by third parties. Learn more about best practices for implementing CallKit, HealthKit, ClassKit, and ARKit.\n\n## What it means for a fitness or health app\n\n- **5.1.2(i): permission before use, and disclosure before sharing.** You need permission before you \"use, transmit, or share\" personal data. Users need access to information about how and where it will be used. Sharing with third parties needs clear disclosure and explicit permission first. The guideline names \"third-party AI\" alongside other third parties.\n- **5.1.2(i) also limits sharing and requirements.** Apple allows sharing with third parties only \"to improve the app or serve advertising (in compliance with the Apple Developer Program License Agreement)\". Tracking needs App Tracking Transparency. You can't require users to enable push notifications, location services or tracking to use the app.\n- **5.1.2(ii): no repurposing without new consent,** unless the law explicitly permits it.\n- **5.1.2(iii): no profile building or re-identification** from data you collected, including data you describe as anonymized or aggregated.\n- **5.1.2(vi): HealthKit data is off-limits for marketing, advertising and use-based data mining,** and so are the Clinical Health Records API and the MovementDisorder APIs. The ban includes third parties. [Guideline 5.1.3](/compliance/app-store-guideline-5-1-3-health-research) repeats and extends it for health, fitness and medical research data.\n\n## The third-party AI clause and AI coaching features\n\nIf your app sends a user's workouts, heart rate or sleep to an external model API to generate coaching, the text of 5.1.2(i) applies directly. Disclose that personal data goes to a third-party AI and get explicit permission before the first request.\n\nFor HealthKit-derived data, Apple's [\"Protecting user privacy\"](https://developer.apple.com/documentation/healthkit/protecting-user-privacy) article adds a condition: \"Even with permission, you can only share information to a third party if they also provide a health or fitness service to the user.\" Apple doesn't say whether a general-purpose model provider called by your coaching feature meets that condition, and we couldn't verify an official reading. Until Apple clarifies, treat it as an open question to raise with App Review. Don't assume the answer. For the engineering side of sending wearable data to a model, see [personalizing an app with wearable data](/ai/personalize-with-wearable-data).\n\n## What typically triggers it in a health app\n\nThese come from the guideline text and Apple's HealthKit documentation, not from a log of rejections.\n\n- **An AI or analytics vendor nobody disclosed.** Personal data goes to a third party, AI or not, with no in-app disclosure and no explicit permission beforehand.\n- **Health values in ad or marketing tooling.** HealthKit-derived values reach an ad, attribution or marketing SDK. Apple's HealthKit documentation adds that \"you can’t use data from the HealthKit store to serve ads\".\n- **Features gated on system permissions.** For example, workout history that unlocks only after the user enables notifications, or a reward that requires allowing tracking.\n- **Quiet repurposing.** Data collected for one feature is reused for another purpose, such as model training or a partner program, without new consent.\n\n## Checklist before you resubmit\n\n1. **List every third party that receives personal data.** Include analytics, crash reporting, ad and attribution SDKs, your own vendors, and any AI or LLM API that receives user data in a prompt or as context. Guideline 5.1.2(i) names third-party AI explicitly.\n2. **Disclose each recipient and get explicit permission before sharing.** Before the first transfer, tell users in the app where their personal data will go and ask for explicit permission. Guideline 5.1.2(i) requires both the disclosure and the permission before sharing.\n3. **Remove HealthKit data from marketing, advertising and data mining.** Guideline 5.1.2(vi) bars using data from HealthKit, the Clinical Health Records API and the MovementDisorder APIs for marketing, advertising or use-based data mining, including by third parties. Check SDK event payloads as well as your own code.\n4. **Use App Tracking Transparency for any tracking.** If the app tracks users as Apple defines tracking, ask through the App Tracking Transparency APIs, and don't make features or rewards depend on the user allowing it.\n5. **Get new consent before using data for a new purpose.** If you now want to use data for something the user didn't agree to, such as a new feature or model training, ask again unless the law explicitly permits the new use. Guideline 5.1.2(ii) requires it.\n6. **Don't make features depend on push, location or tracking.** Users must be able to use the app's functionality without enabling system features such as push notifications, location services or tracking. Guideline 5.1.2(i) bars requiring them.\n\n## Related\n\n- Guideline 2.5.18 also bars ads that \"engage in targeted or behavioral advertising based on sensitive user data such as health/medical data (e.g. from the HealthKit APIs)\".\n- For collection-side rules (privacy policy, consent, deletion), see [guideline 5.1.1](/compliance/app-store-guideline-5-1-1-data-collection-storage). For consent from a legal rather than App Store angle, see [user consent for health data](/compliance/health-data-user-consent). For all of Apple's rules in one place, see the [App Store health data rules overview](/compliance/app-store-health-data-rules).\n\n## A note on limits\n\nApple doesn't define \"use-based data mining\" in the guidelines, and the guideline text doesn't address whether training a model counts. Where your design depends on those readings, ask App Review or a qualified professional. App Store rules are contractual, not law. This page is general guidance, not legal advice.\n",
    "steps": [
      {
        "name": "List every third party that receives personal data",
        "text": "Include analytics, crash reporting, ad and attribution SDKs, your own vendors, and any AI or LLM API that receives user data in a prompt or as context. Guideline 5.1.2(i) names third-party AI explicitly."
      },
      {
        "name": "Disclose each recipient and get explicit permission before sharing",
        "text": "Before the first transfer, tell users in the app where their personal data will go and ask for explicit permission. Guideline 5.1.2(i) requires both the disclosure and the permission before sharing."
      },
      {
        "name": "Remove HealthKit data from marketing, advertising and data mining",
        "text": "Guideline 5.1.2(vi) bars using data from HealthKit, the Clinical Health Records API and the MovementDisorder APIs for marketing, advertising or use-based data mining, including by third parties. Check SDK event payloads as well as your own code."
      },
      {
        "name": "Use App Tracking Transparency for any tracking",
        "text": "If the app tracks users as Apple defines tracking, ask through the App Tracking Transparency APIs, and don't make features or rewards depend on the user allowing it."
      },
      {
        "name": "Get new consent before using data for a new purpose",
        "text": "If you now want to use data for something the user didn't agree to, such as a new feature or model training, ask again unless the law explicitly permits the new use. Guideline 5.1.2(ii) requires it."
      },
      {
        "name": "Don't make features depend on push, location or tracking",
        "text": "Users must be able to use the app's functionality without enabling system features such as push notifications, location services or tracking. Guideline 5.1.2(i) bars requiring them."
      }
    ],
    "faqs": [
      {
        "q": "Does guideline 5.1.2(i) cover sending health data to an LLM API?",
        "a": "Yes. Guideline 5.1.2(i) says you must clearly disclose where personal data will be shared with third parties, including with third-party AI, and obtain explicit permission before doing so. For HealthKit data, Apple's HealthKit documentation adds that a third party must also provide a health or fitness service to the user, and Apple does not say how that applies to model providers."
      },
      {
        "q": "Is the App Tracking Transparency prompt enough to satisfy guideline 5.1.2?",
        "a": "Not on its own. The guideline lists App Tracking Transparency as the way to get permission to track users' activity, and separately requires permission before using or sharing personal data and explicit permission before sharing with third parties. Treat ATT as one requirement among several."
      },
      {
        "q": "Can I reuse workout data collected for one feature to train a model?",
        "a": "Guideline 5.1.2(ii) says data collected for one purpose may not be repurposed without further consent unless the law explicitly permits it. Apple does not define use-based data mining, and the text does not address model training. Ask for consent for the new use, and keep HealthKit data out of any use the guideline names."
      },
      {
        "q": "Can my app require push notifications or location to unlock features?",
        "a": "No. Guideline 5.1.2(i) says your app may not require users to enable system functionalities such as push notifications, location services or tracking in order to access functionality or content, use the app, or receive monetary or other compensation."
      }
    ],
    "related": [
      {
        "href": "/compliance/app-store-health-data-rules",
        "label": "Apple App Store health data rules (overview)"
      },
      {
        "href": "/compliance/app-store-guideline-5-1-3-health-research",
        "label": "App Store guideline 5.1.3: Health and Health Research"
      },
      {
        "href": "/ai/personalize-with-wearable-data",
        "label": "Personalize an app with wearable data"
      },
      {
        "href": "/compliance/health-data-user-consent",
        "label": "User consent for health data"
      },
      {
        "href": "/compliance",
        "label": "Health-data compliance & privacy"
      }
    ],
    "cta": {
      "pitch": "Apple added third-party AI to its sharing rules and will keep revising them. Subscribe for plain-English notes when the health-data guidelines change."
    },
    "sources": [
      {
        "url": "https://developer.apple.com/app-store/review/guidelines/",
        "checked": "2026-10-03",
        "note": "guideline 5.1.2(i)–(iii) and (vi), 2.5.18; last updated June 8, 2026"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/protecting-user-privacy",
        "checked": "2026-10-03",
        "note": "third-party sharing condition and the ad-serving rule for HealthKit data"
      }
    ]
  },
  {
    "slug": "app-store-guideline-1-4-1-physical-harm",
    "primaryQuery": "app store guideline 1.4.1",
    "h1": "App Store Guideline 1.4.1: Physical Harm and Medical Apps",
    "metaTitle": "App Store Guideline 1.4.1: Physical Harm (Medical Apps)",
    "metaDescription": "Guideline 1.4.1 for health apps: closer review for medical apps, accuracy claims needing methodology, banned sensor-only vitals, and a checklist.",
    "updated": "2026-10-03",
    "answer": "App Store Review Guideline 1.4.1, under Physical Harm, gives closer review to medical apps that could provide inaccurate information or be used to diagnose or treat patients. Apps must disclose the data and methodology behind health-measurement accuracy claims, and Apple rejects apps whose accuracy can't be validated, including any that claim to measure blood pressure, body temperature, blood glucose or blood oxygen with only the device's sensors. Apps should also remind users to check with a doctor. Quoted from the guidelines as last updated June 8, 2026, checked October 3, 2026; this is general guidance, not legal advice.",
    "body": "## The guideline text\n\nQuoted verbatim from Apple's [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#1.4.1), which the page states were last updated June 8, 2026. We checked the text on October 3, 2026. Apple revises the guidelines and sometimes renumbers sub-items, so compare this against the live page before you cite it in a reply to App Review.\n\n> **1.4 Physical Harm**\n>\n> If your app behaves in a way that risks physical harm, we may reject it. For example:\n>\n> **1.4.1 Medical apps that could provide inaccurate data or information, or that could be used for diagnosing or treating patients may be reviewed with greater scrutiny.**\n>\n> - Apps must clearly disclose data and methodology to support accuracy claims relating to health measurements, and if the level of accuracy or methodology cannot be validated, we will reject your app. For example, apps that claim to take x-rays, measure blood pressure, body temperature, blood glucose levels, or blood oxygen levels using only the sensors on the device are not permitted.\n>\n> - Apps should remind users to check with a doctor in addition to using the app and before making medical decisions.\n>\n> If your medical app has received regulatory clearance, please submit a link to that documentation with your app.\n\n## What it means for a fitness or health app\n\n- **Apple reviews medical apps more closely.** This covers apps that \"could provide inaccurate data or information\" or \"could be used for diagnosing or treating patients\". The guideline doesn't define \"medical app\". Our reading is that a fitness app showing health measurements, such as heart rate, recovery scores or readiness scores, should expect the accuracy sentence to be applied to it.\n- **Accuracy claims need disclosed data and methodology.** \"Apps must clearly disclose data and methodology to support accuracy claims relating to health measurements\". If Apple can't validate the accuracy or the method, the guideline says the app will be rejected.\n- **Named examples are banned outright.** Apps that claim to take x-rays, or to measure blood pressure, body temperature, blood glucose or blood oxygen, \"using only the sensors on the device\" are not permitted. The list is introduced with \"for example\", so it isn't complete.\n- **Remind users to check with a doctor,** both alongside using the app and before making medical decisions.\n- **If you have regulatory clearance, link it** in your submission. Whether your app needs clearance at all is a separate question. See [does the FDA regulate fitness apps](/compliance/fda-fitness-app-regulation).\n\n## What typically triggers it in a fitness app\n\nThese come from the guideline text, not from a log of rejections.\n\n- **A camera or sensor-only vital sign.** A feature that reads one of the named vitals from the phone's own sensors is the case the guideline describes. For vitals the guideline doesn't name, the general rule still applies: disclose the data and methodology, or expect rejection if Apple can't validate them.\n- **Marketing that promises more than the method supports.** For example, \"clinically accurate\" or \"medical-grade\" in the description, with no methodology in the app.\n- **Health scores with no stated basis.** A readiness or stress number that appears without saying what data and method produce it, when the app presents it as a health measurement.\n- **No doctor reminder** where health results are shown.\n\nTwo nearby guidelines matter for fitness apps. Guideline 1.1.6 lists \"False information and features, including inaccurate device data\" as objectionable content and says calling a feature \"for entertainment purposes\" won't overcome it. Guideline 1.4.5 says: \"Apps should not urge customers to participate in activities (like bets, challenges, etc.) or use their devices in a way that risks physical harm to themselves or others.\"\n\n## Checklist before you resubmit\n\n1. **List every health measurement the app claims.** Go through the app, the description, screenshots and previews, and note every reading the app says it produces or estimates, and how it produces it.\n2. **Remove sensor-only claims Apple names as not permitted.** Guideline 1.4.1 says apps claiming to take x-rays or to measure blood pressure, body temperature, blood glucose or blood oxygen using only the device's sensors are not permitted. Remove those claims or the feature.\n3. **Disclose data and methodology for any accuracy claim.** For each remaining measurement, say in the app and in your review notes where the value comes from (a paired device, HealthKit, or your own algorithm) and how accurate it is. If you can't validate the accuracy, remove the accuracy claim.\n4. **Add a check-with-a-doctor reminder.** Show a visible reminder, at the point where results appear, to check with a doctor in addition to using the app and before making medical decisions. 1.4.1 asks for it.\n5. **Attach regulatory clearance if you have it.** If the app has received regulatory clearance, include a link to the documentation with your submission.\n6. **Check challenges and goals for physical-harm risk.** If the app runs challenges, streaks or bets, make sure none urges people to do something that risks physical harm. Guideline 1.4.5 bars that.\n\n## Related\n\n- Where the data comes from matters for accuracy. Values read from HealthKit come from whatever source wrote them. See the [HealthKit integration guide](/integrate/healthkit) for how reads work.\n- Writing an estimate back into HealthKit raises a separate rule: [guideline 5.1.3(ii)](/compliance/app-store-guideline-5-1-3-health-research) bars false or inaccurate data in HealthKit. For all of Apple's health-data rules, see the [App Store health data rules overview](/compliance/app-store-health-data-rules).\n\n## A note on limits\n\nApple doesn't publish the accuracy threshold or validation method App Review uses. \"Validated\" is Apple's judgement, case by case. Whether a medical-device regulator also has a say in your app is a separate legal question. This page is general guidance, not legal or regulatory advice.\n",
    "steps": [
      {
        "name": "List every health measurement the app claims",
        "text": "Go through the app, the description, screenshots and previews, and note every reading the app says it produces or estimates, and how it produces it."
      },
      {
        "name": "Remove sensor-only claims Apple names as not permitted",
        "text": "Guideline 1.4.1 says apps claiming to take x-rays or to measure blood pressure, body temperature, blood glucose or blood oxygen using only the device's sensors are not permitted. Remove those claims or the feature."
      },
      {
        "name": "Disclose data and methodology for any accuracy claim",
        "text": "For each remaining measurement, say in the app and in your review notes where the value comes from (a paired device, HealthKit, or your own algorithm) and how accurate it is. If you can't validate the accuracy, remove the accuracy claim."
      },
      {
        "name": "Add a check-with-a-doctor reminder",
        "text": "Show a visible reminder, at the point where results appear, to check with a doctor in addition to using the app and before making medical decisions. 1.4.1 asks for it."
      },
      {
        "name": "Attach regulatory clearance if you have it",
        "text": "If the app has received regulatory clearance, include a link to the documentation with your submission."
      },
      {
        "name": "Check challenges and goals for physical-harm risk",
        "text": "If the app runs challenges, streaks or bets, make sure none urges people to do something that risks physical harm. Guideline 1.4.5 bars that."
      }
    ],
    "faqs": [
      {
        "q": "Can my app measure heart rate with the iPhone camera under guideline 1.4.1?",
        "a": "Guideline 1.4.1 does not name heart rate. Its named examples of sensor-only claims that are not permitted are x-rays, blood pressure, body temperature, blood glucose and blood oxygen. Any accuracy claim about a health measurement still needs disclosed data and methodology, and Apple says it will reject the app if the accuracy or method cannot be validated."
      },
      {
        "q": "Does a fitness app need a check-with-your-doctor reminder?",
        "a": "Guideline 1.4.1 says apps should remind users to check with a doctor in addition to using the app and before making medical decisions. The sentence sits under medical apps, and Apple does not define where a fitness app becomes one. If your app shows health measurements, adding the reminder costs little."
      },
      {
        "q": "What should I submit if my health app has regulatory clearance?",
        "a": "Guideline 1.4.1 says that if your medical app has received regulatory clearance, you should submit a link to that documentation with your app. Whether your app needs clearance in the first place is a separate legal question that the guideline does not answer."
      },
      {
        "q": "Do Apple's physical-harm rules cover fitness challenges?",
        "a": "Guideline 1.4.5 says apps should not urge customers to take part in activities, including bets and challenges, or use their devices in a way that risks physical harm to themselves or others. A challenge or streak mechanic that pushes users past safe limits falls under that sentence."
      }
    ],
    "related": [
      {
        "href": "/compliance/app-store-health-data-rules",
        "label": "Apple App Store health data rules (overview)"
      },
      {
        "href": "/compliance/fda-fitness-app-regulation",
        "label": "Does the FDA regulate fitness apps?"
      },
      {
        "href": "/compliance/app-store-guideline-5-1-3-health-research",
        "label": "App Store guideline 5.1.3: Health and Health Research"
      },
      {
        "href": "/integrate/healthkit",
        "label": "How to integrate Apple HealthKit"
      },
      {
        "href": "/compliance",
        "label": "Health-data compliance & privacy"
      }
    ],
    "cta": {
      "pitch": "Apple tightens its health-accuracy rules from time to time. Subscribe and we'll flag changes to the medical-app guidelines when they ship."
    },
    "sources": [
      {
        "url": "https://developer.apple.com/app-store/review/guidelines/",
        "checked": "2026-10-03",
        "note": "guidelines 1.4 and 1.4.1, plus 1.1.6 and 1.4.5; last updated June 8, 2026"
      }
    ]
  },
  {
    "slug": "app-store-guideline-2-5-1-healthkit-software-requirements",
    "primaryQuery": "app store guideline 2.5.1 healthkit",
    "h1": "App Store Guideline 2.5.1: Software Requirements and HealthKit",
    "metaTitle": "App Store Guideline 2.5.1: Software Requirements",
    "metaDescription": "Guideline 2.5.1 for HealthKit apps: use HealthKit for health and fitness, show it in the app and listing, drop unused capabilities. With a checklist.",
    "updated": "2026-10-03",
    "answer": "App Store Review Guideline 2.5.1, under Software Requirements, says apps may use only public APIs, must run on the currently shipping OS, and should use frameworks for their intended purposes and mention the integration in the app description. It names HealthKit directly: HealthKit should be used for health and fitness purposes and integrate with the Health app, and Apple's HealthKit documentation adds that the use must be clear in both marketing text and the user interface. Quoted from the guidelines as last updated June 8, 2026, checked October 3, 2026; this is general guidance, not legal advice.",
    "body": "## The guideline text\n\nQuoted verbatim from Apple's [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#2.5.1), which the page states were last updated June 8, 2026. We checked the text on October 3, 2026. Apple revises the guidelines and sometimes renumbers sub-items, so compare this against the live page before you cite it in a reply to App Review.\n\n> **2.5 Software Requirements**\n>\n> **2.5.1** Apps may only use public APIs and must run on the currently shipping OS. Learn more about public APIs. Keep your apps up-to-date and make sure you phase out any deprecated features, frameworks or technologies that will no longer be supported in future versions of an OS. Apps should use APIs and frameworks for their intended purposes and indicate that integration in their app description. For example, the HomeKit framework should provide home automation services; and HealthKit should be used for health and fitness purposes and integrate with the Health app.\n\n## What it means for a HealthKit app\n\nMost of guideline 2.5.1 is about any app: use only public APIs, run on the currently shipping OS, and phase out deprecated technology. HealthKit is named in two sentences:\n\n- \"Apps should use APIs and frameworks for their intended purposes and indicate that integration in their app description.\"\n- \"HealthKit should be used for health and fitness purposes and integrate with the Health app.\"\n\nApple's HealthKit documentation says the same thing more strongly. In [\"Protecting user privacy\"](https://developer.apple.com/documentation/healthkit/protecting-user-privacy): \"your app must not access the HealthKit APIs unless the use is for health or fitness purposes and this usage is clear in both your marketing text and your user interface.\"\n\nSo there are three things to check:\n\n1. **Purpose.** The HealthKit use serves health or fitness.\n2. **Visible in the product.** A reviewer can see the integration in the UI.\n3. **Stated in the listing.** The App Store description mentions it.\n\n## What typically triggers it in a HealthKit app\n\nThese come from the guideline text and Apple's HealthKit documentation, not from a log of rejections.\n\n- **The HealthKit entitlement is on but the feature isn't visible.** The capability is enabled, for example for a planned feature, but nothing a reviewer can reach uses Health data.\n- **The description doesn't mention Health.** The app integrates with the Health app but the App Store description never says so.\n- **Unused Clinical Health Records.** Apple's [Setting up HealthKit](https://developer.apple.com/documentation/healthkit/setting-up-healthkit) article: \"Only select the Clinical Health Records checkbox if your app needs to access the user’s clinical records. App Review may reject apps that enable the Clinical Health Records capability if the app doesn’t actually use the health record data.\"\n- **HealthKit used for something other than health or fitness,** for example reading Health data only to fill a profile that serves no health feature. That conflicts with the \"intended purposes\" sentence.\n\nThere's also a related setup detail that isn't a 2.5.1 rule. Apple documents that \"When you enable the HealthKit capabilities on an iOS app, Xcode adds HealthKit to the list of required device capabilities, which prevents users from purchasing or installing the app on devices that don’t support HealthKit.\" If HealthKit is optional for your app, Apple says to delete that entry.\n\n## Checklist before you resubmit\n\n1. **Say in the App Store description that the app works with Apple Health.** Add a plain sentence on what the app reads from or writes to the Health app and why. Guideline 2.5.1 asks apps to indicate the integration in their app description, and Apple's HealthKit documentation asks for it in marketing text and in the UI.\n2. **Make the Health integration visible in the app.** Make sure a reviewer can reach a feature that uses HealthKit data, and explain in the review notes where to find it if it's behind onboarding or a login.\n3. **Remove capabilities you don't use.** If the app doesn't actually use clinical health records, untick the Clinical Health Records checkbox. Apple's setup documentation warns App Review may reject apps that enable it without using the data.\n4. **Confirm the use is for health or fitness.** Check that every HealthKit read and write supports a health or fitness feature. Guideline 2.5.1 says HealthKit should be used for health and fitness purposes and integrate with the Health app.\n5. **Remove deprecated and private APIs.** Guideline 2.5.1 allows only public APIs and asks you to phase out deprecated frameworks and features, so clear the deprecation warnings in your HealthKit code.\n6. **Decide whether HealthKit is a required device capability.** If the app works without HealthKit, remove the healthkit entry from Required device capabilities so devices without HealthKit aren't blocked from installing it.\n\n## Related\n\n- For the permission sheet, usage descriptions and the read and write flow, see the [HealthKit integration guide](/integrate/healthkit).\n- What you may do with HealthKit data once you have it is covered by [guideline 5.1.3](/compliance/app-store-guideline-5-1-3-health-research) and [guideline 5.1.2](/compliance/app-store-guideline-5-1-2-data-use-sharing). All of Apple's health-data rules are summarized in the [App Store health data rules overview](/compliance/app-store-health-data-rules).\n\n## A note on limits\n\nApple doesn't publish required wording for the App Store description, and we couldn't verify any. The guideline asks you to \"indicate that integration\", nothing more specific. This page is general guidance, not legal advice.\n",
    "steps": [
      {
        "name": "Say in the App Store description that the app works with Apple Health",
        "text": "Add a plain sentence on what the app reads from or writes to the Health app and why. Guideline 2.5.1 asks apps to indicate the integration in their app description, and Apple's HealthKit documentation asks for it in marketing text and in the UI."
      },
      {
        "name": "Make the Health integration visible in the app",
        "text": "Make sure a reviewer can reach a feature that uses HealthKit data, and explain in the review notes where to find it if it's behind onboarding or a login."
      },
      {
        "name": "Remove capabilities you don't use",
        "text": "If the app doesn't actually use clinical health records, untick the Clinical Health Records checkbox. Apple's setup documentation warns App Review may reject apps that enable it without using the data."
      },
      {
        "name": "Confirm the use is for health or fitness",
        "text": "Check that every HealthKit read and write supports a health or fitness feature. Guideline 2.5.1 says HealthKit should be used for health and fitness purposes and integrate with the Health app."
      },
      {
        "name": "Remove deprecated and private APIs",
        "text": "Guideline 2.5.1 allows only public APIs and asks you to phase out deprecated frameworks and features, so clear the deprecation warnings in your HealthKit code."
      },
      {
        "name": "Decide whether HealthKit is a required device capability",
        "text": "If the app works without HealthKit, remove the healthkit entry from Required device capabilities so devices without HealthKit aren't blocked from installing it."
      }
    ],
    "faqs": [
      {
        "q": "Do I have to mention Apple Health in my App Store description?",
        "a": "Guideline 2.5.1 says apps should indicate their use of frameworks such as HealthKit in the app description, and Apple's HealthKit documentation says the health or fitness use must be clear in both marketing text and the user interface. Apple does not prescribe exact wording; a plain sentence on what you read or write and why is enough to state it."
      },
      {
        "q": "Can I enable the HealthKit capability now for a feature I will ship later?",
        "a": "Guideline 2.5.1 asks that frameworks be used for their intended purposes and that the integration be visible, so a HealthKit entitlement with no reachable feature invites questions. Apple's setup documentation warns specifically that apps enabling Clinical Health Records without using that data may be rejected. Enable capabilities in the release that uses them."
      },
      {
        "q": "Does enabling HealthKit limit which devices can install my app?",
        "a": "It can. Apple documents that enabling the HealthKit capability on an iOS app adds HealthKit to the required device capabilities, which prevents installation on devices that do not support HealthKit. If your app works without HealthKit, Apple says to delete the healthkit entry from Required device capabilities."
      }
    ],
    "related": [
      {
        "href": "/compliance/app-store-health-data-rules",
        "label": "Apple App Store health data rules (overview)"
      },
      {
        "href": "/integrate/healthkit",
        "label": "How to integrate Apple HealthKit"
      },
      {
        "href": "/fix/healthkit-health-data-unavailable",
        "label": "HealthKit health data unavailable"
      },
      {
        "href": "/compliance/app-store-guideline-5-1-3-health-research",
        "label": "App Store guideline 5.1.3: Health and Health Research"
      },
      {
        "href": "/compliance",
        "label": "Health-data compliance & privacy"
      }
    ],
    "cta": {
      "pitch": "Apple changes HealthKit setup requirements between OS releases. Subscribe and we'll flag the changes that affect App Review."
    },
    "sources": [
      {
        "url": "https://developer.apple.com/app-store/review/guidelines/",
        "checked": "2026-10-03",
        "note": "guideline 2.5.1; last updated June 8, 2026"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/protecting-user-privacy",
        "checked": "2026-10-03",
        "note": "health or fitness purpose, clear in marketing text and UI"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/setting-up-healthkit",
        "checked": "2026-10-03",
        "note": "Clinical Health Records capability warning; required device capabilities"
      }
    ]
  },
  {
    "slug": "google-play-health-connect-publishing-requirements",
    "primaryQuery": "health connect google play publishing requirements",
    "h1": "Publishing a Health Connect App on Google Play: What's Required",
    "metaTitle": "Health Connect App Publishing Requirements on Google Play",
    "metaDescription": "What Google requires before a Health Connect app ships: Data safety, the Health apps declaration with per-type justifications, and one privacy policy.",
    "updated": "2026-10-03",
    "answer": "Google's Health Connect publishing guide lists three required Play Console steps: review the Google Play policies, fill out the Data safety section, and complete the Health apps declaration. The declaration asks which health features your app supports and needs a clear justification for every Health Connect data type you request, and your Play listing must carry the same privacy policy Health Connect shows users. This reflects Google's developer.android.com guides as read October 3, 2026; the linked Play policy pages themselves could not be verified. This is general guidance, not legal advice.",
    "body": "## What Google requires before a Health Connect app ships\n\nGoogle's [\"Publish your health app on Google Play\"](https://developer.android.com/health-and-fitness/health-connect/publish) guide (page last updated March 10, 2026, read October 3, 2026) states the requirement directly: \"To get your health app published on Google Play, you must complete a few required steps in the Play Console.\" It lists three:\n\n1. Review the Google Play policies (User Data, and Permissions and APIs that access sensitive information, \"including additional requirements for Health Connect\").\n2. Fill out the Data safety section in the Play Console.\n3. Fill out the Health apps declaration form in the Play Console.\n\n**About the policy pages.** The guide links the actual policy text on support.google.com, which we can't reach from our verification environment. **We couldn't verify the policy pages themselves.** Everything below comes from the developer.android.com guides. For Google Play's data-use rules (no ads, no sale and so on), see our separate [Google Play health data policy](/compliance/google-play-health-data-policy) page, and check its claims against the live policy in the Play Console.\n\n## The Health apps declaration\n\nGoogle says the declaration \"must be completed for all publishing requests, both for a new app that has not been published yet, or when updating an existing, already published app that now uses a different set of data types.\"\n\n**Step one: pick your health features.** On the Play Console's App content page, the Health apps form asks which health features your app supports. Google lists them, including Activity and fitness, Nutrition and weight management, Sleep management, Medical device apps and Human subjects research. If the app touches no health data, Google says to select \"My app does not have any health features\".\n\n**Step two: justify each data type.** The data types are grouped into Activity and fitness, Body composition, Energy, Nutrition, Reproductive and sexual health, Respiratory system and Sleep management. Google's guidance for the justifications:\n\n> For each permission requested, provide a clear and detailed justification explaining how your app uses the data to benefit the user.\n>\n> If your app does not require access to specific data types, you must not request access to them.\n>\n> Request the minimum data types needed and provide a valid use case for each request.\n\n**Privacy policy.** Post your privacy policy on the Play store page. Google says \"This must be the same privacy policy that is displayed to users when they click the privacy policy link in Health Connect\".\n\n## What the app itself must contain\n\nGoogle's [Health Connect get-started guide](https://developer.android.com/health-and-fitness/health-connect/get-started) (last updated September 8, 2026) sets two build-time requirements that tie into the declaration:\n\n- **Manifest permissions.** Declare read and write permissions as `uses-permission` entries in AndroidManifest.xml, \"which should match the ones you declared access to in the Play Console\".\n- **A privacy-policy rationale screen.** \"Your Android manifest needs to have an Activity that displays your app's privacy policy, which is your app's rationale of the requested permissions, describing how the user's data is used and handled.\" It handles the `ACTION_SHOW_PERMISSIONS_RATIONALE` intent. Google's sample adds an activity alias for `VIEW_PERMISSION_USAGE` with the `HEALTH_PERMISSIONS` category for Android 14 and later. Google adds: \"The activity must display the same privacy policy you provide for your app in the Google Play Console\".\n\n## Updates, re-review and what happens if you skip it\n\n- **Changing data types means refiling.** Google says to include existing and new health features, exclude ones you no longer need, and \"Make sure you justify every requested access.\"\n- **A new version alone doesn't need a new request.** \"The data type accesses are allow-listed for a package name regardless of app version.\" Google also notes: \"When you submit a new app version, your app's declaration may be reviewed again.\"\n- **Skipping the declaration.** If a published app never requested data type access, Google says end users get a dialog when they try to link with Health Connect, under the heading \"Unable to access Health Connect\".\n- **Old request form.** Developers who used the earlier Google Health Connect API Request form had to declare those data types in the Play Console by January 22, 2025, according to the guide.\n\n## Checklist before you submit\n\n1. **Cut the requested data types to what shipped features use.** Compare your Health Connect permission list against user-facing features. Google's publishing guide says to request only permissions that support the specific health features you offer, and not to request data types you don't need.\n2. **Make the manifest match the declaration.** Declare Health Connect read and write permissions in AndroidManifest.xml for exactly the data types you will declare in the Play Console. Google's get-started guide says they should match.\n3. **Add the permissions-rationale activity.** Add an activity that shows your privacy policy for the ACTION_SHOW_PERMISSIONS_RATIONALE intent, and an activity alias for VIEW_PERMISSION_USAGE with the HEALTH_PERMISSIONS category on Android 14 and later, as Google's get-started guide shows.\n4. **Use one privacy policy everywhere.** The policy on your Play listing must be the same one Health Connect shows when users tap your privacy-policy link, and the one the rationale activity displays.\n5. **Complete the Data safety section.** Fill in Play's Data safety section for the health data you collect and share. Google's guide makes it one of the three required publishing steps.\n6. **File the Health apps declaration with a justification per data type.** On the App content page, choose the health features your app supports, then explain how the app uses each Health Connect data type to benefit the user. Be as detailed as you can, and request the minimum.\n7. **Refile when your data types change.** If you add or drop a data type, submit the declaration again. Include every health feature you still use and the new ones, leave out the ones you've dropped, and justify each access.\n\n## Related\n\n- For the code side (permissions, client setup, reads and writes), see the [Health Connect integration guide](/integrate/google-health-connect). If reads come back empty after approval, see [Health Connect returns no data](/fix/health-connect-no-data).\n- Shipping on iOS too? Apple's equivalent rules are covered in the [App Store health data rules overview](/compliance/app-store-health-data-rules) and in guideline pages such as [5.1.3: Health and Health Research](/compliance/app-store-guideline-5-1-3-health-research).\n\n## A note on limits\n\nThis page reflects Google's developer.android.com guides as read on October 3, 2026. The Play policies they link (User Data, Permissions, Data safety, the Health apps declaration help page) are on support.google.com, and we couldn't verify them. Google also says \"Further questions\" go to Health Connect Developer Support on its issue tracker. This page is general guidance, not legal advice.\n",
    "steps": [
      {
        "name": "Cut the requested data types to what shipped features use",
        "text": "Compare your Health Connect permission list against user-facing features. Google's publishing guide says to request only permissions that support the specific health features you offer, and not to request data types you don't need."
      },
      {
        "name": "Make the manifest match the declaration",
        "text": "Declare Health Connect read and write permissions in AndroidManifest.xml for exactly the data types you will declare in the Play Console. Google's get-started guide says they should match."
      },
      {
        "name": "Add the permissions-rationale activity",
        "text": "Add an activity that shows your privacy policy for the ACTION_SHOW_PERMISSIONS_RATIONALE intent, and an activity alias for VIEW_PERMISSION_USAGE with the HEALTH_PERMISSIONS category on Android 14 and later, as Google's get-started guide shows."
      },
      {
        "name": "Use one privacy policy everywhere",
        "text": "The policy on your Play listing must be the same one Health Connect shows when users tap your privacy-policy link, and the one the rationale activity displays."
      },
      {
        "name": "Complete the Data safety section",
        "text": "Fill in Play's Data safety section for the health data you collect and share. Google's guide makes it one of the three required publishing steps."
      },
      {
        "name": "File the Health apps declaration with a justification per data type",
        "text": "On the App content page, choose the health features your app supports, then explain how the app uses each Health Connect data type to benefit the user. Be as detailed as you can, and request the minimum."
      },
      {
        "name": "Refile when your data types change",
        "text": "If you add or drop a data type, submit the declaration again. Include every health feature you still use and the new ones, leave out the ones you've dropped, and justify each access."
      }
    ],
    "faqs": [
      {
        "q": "Do I need to refile the Health apps declaration for every app update?",
        "a": "No, not for a version change alone. Google's publishing guide says Health Connect data type access is allow-listed per package name regardless of app version, though a new version's declaration may be reviewed again. You do refile when your app adds or stops using a data type, listing every feature you still use and justifying each access."
      },
      {
        "q": "What happens if I publish a Health Connect app without declaring data types?",
        "a": "Google's publishing guide says that if your app is published and released to the public but you did not request data type access, end users receive a dialog when they try to link your app with Health Connect, under the heading Unable to access Health Connect. Complete the Health apps declaration before release."
      },
      {
        "q": "Does the privacy policy in Health Connect have to match my Play listing?",
        "a": "Yes. Google's publishing guide says the privacy policy on your Play store page must be the same one shown when users click the privacy policy link in Health Connect, and the get-started guide says your permissions-rationale activity must display the same policy you provide in the Play Console."
      },
      {
        "q": "What do I select if my app has no health features?",
        "a": "Google's publishing guide says that if your app does not access any health or fitness information, you select the checkbox labelled My app does not have any health features on the Health apps form in the Play Console."
      }
    ],
    "related": [
      {
        "href": "/compliance/google-play-health-data-policy",
        "label": "Google Play health-data policy"
      },
      {
        "href": "/integrate/google-health-connect",
        "label": "How to integrate Google Health Connect"
      },
      {
        "href": "/fix/health-connect-no-data",
        "label": "Health Connect returns no data"
      },
      {
        "href": "/compliance/app-store-health-data-rules",
        "label": "Apple App Store health data rules"
      },
      {
        "href": "/compliance",
        "label": "Health-data compliance & privacy"
      }
    ],
    "cta": {
      "pitch": "Google changes Health Connect's publishing steps and deadlines often. Subscribe and we'll flag changes to the declaration process before they hold up a release."
    },
    "sources": [
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/publish",
        "checked": "2026-10-03",
        "note": "required Play Console steps, Health apps declaration, justification rules, reapplying, allow-listing per package"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/get-started",
        "checked": "2026-10-03",
        "note": "manifest permissions matching the Play Console declaration; permissions-rationale activity and privacy policy"
      }
    ]
  },
  {
    "slug": "app-store-guideline-3-1-3-d-person-to-person-fitness",
    "primaryQuery": "app store guideline 3.1.3(d) fitness training",
    "h1": "App Store Guideline 3.1.3(d): Person-to-Person Fitness Training",
    "metaTitle": "App Store Guideline 3.1.3(d): Live Fitness Training",
    "metaDescription": "Guideline 3.1.3(d) lets live one-to-one fitness training skip in-app purchase; one-to-few and one-to-many live sessions must use it. With a checklist.",
    "updated": "2026-10-03",
    "answer": "App Store Review Guideline 3.1.3(d) lets an app that sells real-time person-to-person services between two individuals, with fitness training as one of Apple's examples, collect those payments with purchase methods other than in-app purchase. The same guideline says one-to-few and one-to-many real-time services must use in-app purchase, so live group sessions don't qualify, and recorded content falls under 3.1.1's in-app purchase rule. Quoted from the guidelines as last updated June 8, 2026, checked October 3, 2026; this is general guidance, not legal advice.",
    "body": "## The guideline text\n\nQuoted verbatim from Apple's [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#3.1.3d), which the page states were last updated June 8, 2026. We checked the text on October 3, 2026. Apple revises the guidelines and sometimes renumbers sub-items, so compare this against the live page before you cite it in a reply to App Review.\n\n> **3.1.3(d) Person-to-Person Services:** If your app enables the purchase of real-time person-to-person services between two individuals (for example tutoring students, medical consultations, real estate tours, or fitness training), you may use purchase methods other than in-app purchase to collect those payments. One-to-few and one-to-many real-time services must use in-app purchase.\n\nGuideline 3.1.3(d) sits under 3.1.3, whose opening paragraph applies to every app in the section:\n\n> **3.1.3 Other Purchase Methods:** The following apps may use purchase methods other than in-app purchase. Apps in this section cannot, within the app, encourage users to use a purchasing method other than in-app purchase, except for apps on the United States storefront and as set forth in 3.1.1(a) and 3.1.3(a). Developers can send communications outside of the app to their user base about purchasing methods other than in-app purchase.\n\n## The rules next to it\n\n3.1.3(d) is an exception to the default in 3.1.1:\n\n> **3.1.1 In-App Purchase:**\n>\n> If you want to unlock features or functionality within your app, (by way of example: subscriptions, in-game currencies, game levels, access to premium content, or unlocking a full version), you must use in-app purchase. Apps may not use their own mechanisms to unlock content or functionality, such as license keys, augmented reality markers, QR codes, cryptocurrencies and cryptocurrency wallets, etc.\n\nThe next item, 3.1.3(e), covers things used away from the app:\n\n> **3.1.3(e) Goods and Services Outside of the App:** If your app enables people to purchase physical goods or services that will be consumed outside of the app, you must use purchase methods other than in-app purchase to collect those payments, such as Apple Pay or traditional credit card entry.\n\nThe two are worded differently. 3.1.3(d) says you *may* use other purchase methods for a live one-to-one service. 3.1.3(e) says you *must* use purchase methods other than in-app purchase.\n\n## What it means for a fitness app\n\nApple's four examples in 3.1.3(d) include \"fitness training\". The wording sets three conditions:\n\n1. **Real-time.** The service happens live. Recorded workouts aren't a real-time service.\n2. **Between two individuals.** One trainer and one client. The guideline's last sentence sends one-to-few and one-to-many real-time services back to in-app purchase.\n3. **A purchase of the service.** The exception covers collecting \"those payments\", meaning the payments for the person-to-person service, not everything else the app sells.\n\nHere is how common fitness products line up against the text:\n\n| What the app sells | What the guideline text says |\n| --- | --- |\n| A live one-to-one video session with a trainer | 3.1.3(d): you may use purchase methods other than in-app purchase |\n| A live session with one trainer and a small group | 3.1.3(d): one-to-few real-time services must use in-app purchase |\n| A live-streamed class for many participants | 3.1.3(d): one-to-many real-time services must use in-app purchase |\n| A recorded workout library, premium plans, a subscription to app features | 3.1.1: unlocking features or premium content must use in-app purchase |\n| An in-person session at a gym or outdoors, booked in the app | 3.1.3(e), read literally: services consumed outside the app must use purchase methods other than in-app purchase |\n\nApple's text gives no fitness example for 3.1.3(e). The in-person row is our reading of \"services that will be consumed outside of the app\", not an example Apple gives.\n\n## What typically triggers it in a fitness coaching app\n\nThese come from the guideline text, not from a log of rejections.\n\n- **Small-group sessions billed as person-to-person.** A live session with a trainer and three clients is one-to-few, and 3.1.3(d) says those must use in-app purchase.\n- **Live classes for an audience.** A streamed class is one-to-many, which 3.1.3(d) also sends to in-app purchase.\n- **One charge that also unlocks in-app content.** A payment collected outside in-app purchase for a live session that also unlocks recorded workouts or premium features. 3.1.3(d) covers payments for the real-time service; 3.1.1 says unlocking features or premium content uses in-app purchase.\n- **In-app prompts to pay elsewhere.** Outside the United States storefront, the 3.1.3 opening paragraph says apps in this section can't encourage users within the app to use another purchasing method, except as 3.1.1(a) and 3.1.3(a) set out.\n\n**Coaching that isn't live.** Plan reviews, chat check-ins and form videos a coach watches later aren't real-time, so 3.1.3(d)'s wording doesn't cover them. The guidelines don't say which rule does, and we couldn't find Apple text on it.\n\n## Checklist before you resubmit\n\n1. **List each thing you sell and mark whether it happens live.** Go through every paid item and note whether it is a real-time service. Guideline 3.1.3(d) covers only real-time person-to-person services, so anything recorded or self-serve falls outside it.\n2. **Count the people in each live session.** A session between one trainer and one client is the two-individual case 3.1.3(d) describes. If a live session has a small group or a large audience, 3.1.3(d) says one-to-few and one-to-many real-time services must use in-app purchase.\n3. **Keep recorded content and app features on in-app purchase.** Guideline 3.1.1 says unlocking features or functionality, including subscriptions and access to premium content, must use in-app purchase. A recorded workout library or a premium plan is not a real-time service.\n4. **Check in-person sessions against 3.1.3(e).** If the app sells sessions that take place away from the app, 3.1.3(e) says services consumed outside the app must use purchase methods other than in-app purchase, such as Apple Pay or traditional credit card entry.\n5. **Review in-app wording about other payment methods.** The opening paragraph of 3.1.3 says apps in this section cannot, within the app, encourage users to use a purchasing method other than in-app purchase, except on the United States storefront and as 3.1.1(a) and 3.1.3(a) set out. You can still contact your users outside the app.\n6. **Explain the payment model in your App Review notes.** Say which items are live one-to-one sessions and how each is paid for. Apple's introduction to the Business section asks you to explain a business model that isn't obvious in the metadata and App Review notes.\n\n## Related\n\n- All of Apple's health-data rules are summarized in the [App Store health data rules overview](/compliance/app-store-health-data-rules).\n- For the product side of a coaching app, see [how to build an AI fitness coaching app](/build/ai-fitness-coaching-app).\n- Other App Review guidelines that workout apps run into: [2.5.4 background services](/compliance/app-store-guideline-2-5-4-background-services) and [2.5.11 SiriKit and Shortcuts](/compliance/app-store-guideline-2-5-11-sirikit-shortcuts).\n\n## A note on limits\n\nEverything on this page comes from the guideline text. The guidelines don't define one-to-few, and we couldn't find Apple text on where a session stops being between two individuals. Storefront rules and entitlements also differ by region. This page is general guidance, not legal advice.\n",
    "steps": [
      {
        "name": "List each thing you sell and mark whether it happens live",
        "text": "Go through every paid item and note whether it is a real-time service. Guideline 3.1.3(d) covers only real-time person-to-person services, so anything recorded or self-serve falls outside it."
      },
      {
        "name": "Count the people in each live session",
        "text": "A session between one trainer and one client is the two-individual case 3.1.3(d) describes. If a live session has a small group or a large audience, 3.1.3(d) says one-to-few and one-to-many real-time services must use in-app purchase."
      },
      {
        "name": "Keep recorded content and app features on in-app purchase",
        "text": "Guideline 3.1.1 says unlocking features or functionality, including subscriptions and access to premium content, must use in-app purchase. A recorded workout library or a premium plan is not a real-time service."
      },
      {
        "name": "Check in-person sessions against 3.1.3(e)",
        "text": "If the app sells sessions that take place away from the app, 3.1.3(e) says services consumed outside the app must use purchase methods other than in-app purchase, such as Apple Pay or traditional credit card entry."
      },
      {
        "name": "Review in-app wording about other payment methods",
        "text": "The opening paragraph of 3.1.3 says apps in this section cannot, within the app, encourage users to use a purchasing method other than in-app purchase, except on the United States storefront and as 3.1.1(a) and 3.1.3(a) set out. You can still contact your users outside the app."
      },
      {
        "name": "Explain the payment model in your App Review notes",
        "text": "Say which items are live one-to-one sessions and how each is paid for. Apple's introduction to the Business section asks you to explain a business model that isn't obvious in the metadata and App Review notes."
      }
    ],
    "faqs": [
      {
        "q": "Can a personal training app take payments outside Apple's in-app purchase?",
        "a": "For live one-to-one sessions, guideline 3.1.3(d) says yes. It covers real-time person-to-person services between two individuals, names fitness training as an example, and says you may use purchase methods other than in-app purchase to collect those payments. The exception covers the payments for those sessions, not the rest of what the app sells."
      },
      {
        "q": "Do live group workout classes qualify for the 3.1.3(d) exception?",
        "a": "No. The last sentence of guideline 3.1.3(d) says one-to-few and one-to-many real-time services must use in-app purchase. A live session with a trainer and a small group, or a streamed class, is one of those."
      },
      {
        "q": "Does guideline 3.1.3(d) cover recorded workouts or training plans?",
        "a": "No. 3.1.3(d) is limited to real-time services. Guideline 3.1.1 says that unlocking features or functionality in the app, including subscriptions and access to premium content, must use in-app purchase."
      },
      {
        "q": "What about in-person training sessions booked through the app?",
        "a": "Guideline 3.1.3(e) says that if your app lets people buy physical goods or services that will be consumed outside of the app, you must use purchase methods other than in-app purchase, such as Apple Pay or traditional credit card entry. Apple gives no fitness example there; applying it to in-person sessions is a literal reading of the text."
      }
    ],
    "related": [
      {
        "href": "/compliance/app-store-health-data-rules",
        "label": "Apple App Store health data rules (overview)"
      },
      {
        "href": "/build/ai-fitness-coaching-app",
        "label": "How to build an AI fitness coaching app"
      },
      {
        "href": "/compliance/app-store-guideline-2-5-4-background-services",
        "label": "App Store guideline 2.5.4: background services"
      },
      {
        "href": "/compliance",
        "label": "Health-data compliance & privacy"
      }
    ],
    "cta": {
      "pitch": "Apple's payment rules change by storefront and revision. Subscribe and we'll flag the changes that affect how a fitness app can charge."
    },
    "sources": [
      {
        "url": "https://developer.apple.com/app-store/review/guidelines/",
        "checked": "2026-10-03",
        "note": "guidelines 3.1.1, 3.1.3 (opening paragraph), 3.1.3(d), 3.1.3(e) and the Business section introduction; last updated June 8, 2026"
      }
    ]
  },
  {
    "slug": "app-store-guideline-2-5-4-background-services",
    "primaryQuery": "app store guideline 2.5.4 background modes workout app",
    "h1": "App Store Guideline 2.5.4: Background Modes for Workout Apps",
    "metaTitle": "App Store Guideline 2.5.4: Background Workout Modes",
    "metaDescription": "Guideline 2.5.4 limits background services to their intended purposes. What Apple's docs say about workout, audio and location modes. With a checklist.",
    "updated": "2026-10-03",
    "answer": "App Store Review Guideline 2.5.4 says multitasking apps may only use background services for their intended purposes, and lists VoIP, audio playback, location, task completion and local notifications. For workout apps, Apple's HealthKit documentation says Apple Watch workout sessions require the Workout processing background mode, plus the Audio mode if the app plays audio or haptic feedback during the session. Quoted from the guidelines as last updated June 8, 2026 and from Apple's documentation, checked October 3, 2026; this is general guidance, not legal advice.",
    "body": "## The guideline text\n\nQuoted verbatim from Apple's [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#2.5.4), which the page states were last updated June 8, 2026. We checked the text on October 3, 2026. Apple revises the guidelines and sometimes renumbers sub-items, so compare this against the live page before you cite it in a reply to App Review.\n\n> **2.5.4** Multitasking apps may only use background services for their intended purposes: VoIP, audio playback, location, task completion, local notifications, etc.\n\nThat is the whole guideline. It doesn't mention workouts; its list ends with \"etc.\" and doesn't name a workout mode. What a workout app's background modes are for is set out in Apple's developer documentation, quoted below.\n\n## What Apple's documentation says about workout apps\n\n### Apple Watch workout sessions\n\nApple's [Running workout sessions](https://developer.apple.com/documentation/healthkit/running-workout-sessions) article (\"Track a workout on Apple Watch\") says:\n\n> Apps with an active workout session can run in the background, so you need to add the background modes capability to your WatchKit App Extension.\n>\n> Workout sessions require the Workout processing background mode. If your app plays audio or provides haptic feedback during the workout session, you must also add the Audio background mode.\n\nOn audio, the same article adds a note (Apple's grammar, quoted as written):\n\n> Workout apps can use the AVFoundation framework to play short audio clips in the background, such as coaching or notifications. In order to play an audio clip, an active workout session must be running; any attempt to play background audio outside a workout session are invalid.\n\nIt also limits how much the app may do while in the background:\n\n> To maintain high performance on Apple Watch, you must limit the amount of work your app performs in the background. If your app uses an excessive amount of CPU while in the background, watchOS may suspend it.\n\n### Background location for route tracking\n\nApple's [Handling location updates in the background](https://developer.apple.com/documentation/corelocation/handling-location-updates-in-the-background) article opens with a caution:\n\n> Consider carefully whether your app really needs background location updates. Most apps need location data only while someone actively uses the app. Consider background updates only when your app needs to receive those updates in real time, perhaps to:\n\nThe first item on Apple's list is \"Track the precise path taken during a hike or fitness workout.\" The article says to enable the Location updates option on the Signing & Capabilities tab, to receive updates through a `CLBackgroundActivitySession`, and: \"For Always authorization, inform the user that location updates arrive in the background.\"\n\n### Where the modes are declared\n\nThe modes live in the `UIBackgroundModes` Info.plist key, which Apple's [reference](https://developer.apple.com/documentation/bundleresources/information-property-list/uibackgroundmodes) describes as \"Services provided by an app that require it to run in the background.\" Apple says: \"To add this key to your Information Property List, enable the Background Modes capability in Xcode.\"\n\n## What it means for a workout app\n\nEvery background mode the app declares should match something a reviewer can see running in the background:\n\n| Mode | The use Apple's text supports |\n| --- | --- |\n| Workout processing (Apple Watch) | An active workout session; Apple says workout sessions require it |\n| Audio | Audio or haptic feedback during the workout session; \"audio playback\" is on 2.5.4's list |\n| Location updates | Real-time location, such as the path of a workout; \"location\" is on 2.5.4's list |\n\nOn Apple Watch, background audio depends on the workout session. Apple says a clip can play only while an active workout session is running.\n\n## What typically triggers it in a workout app\n\nThese come from the guideline text and Apple's documentation, not from a log of rejections.\n\n- **The Audio mode with nothing to play.** Declaring the Audio background mode to keep the app alive when it doesn't play audio. 2.5.4 limits background services to their intended purposes, and the one it lists for audio is playback.\n- **Background location with no live use.** The Location updates mode is on, but the app only uses location while it's open, for example to set a home city. Apple's Core Location documentation says most apps need location only while someone actively uses the app.\n- **Background audio outside a workout session on Apple Watch.** Apple calls any attempt to play background audio outside a workout session invalid.\n- **Modes left over from a removed feature.** A mode no feature uses has no intended purpose to point to.\n\n## Checklist before you resubmit\n\n1. **List every background mode the app declares.** Open UIBackgroundModes in Info.plist, which Xcode writes when you enable the Background Modes capability, and match each mode to a feature a reviewer can see. Remove any mode no feature uses: guideline 2.5.4 allows background services only for their intended purposes.\n2. **Declare Workout processing for Apple Watch workout sessions.** Apple's HealthKit documentation says workout sessions require the Workout processing background mode, added through the background modes capability on the WatchKit App Extension.\n3. **Add Audio only if the workout plays audio or haptics.** Apple says to add the Audio background mode if the app plays audio or provides haptic feedback during the workout session, and that playing a background audio clip requires an active workout session.\n4. **Tie background location to a live feature.** Keep the Location updates mode only if the app needs updates in real time, such as recording a route. Apple's Core Location documentation names tracking the precise path of a hike or fitness workout, and says most apps need location only while someone actively uses the app.\n5. **Tell users when location arrives in the background.** For Always authorization, Apple's Core Location documentation says to inform the user that location updates arrive in the background.\n6. **Keep background work light on Apple Watch.** Apple warns that watchOS may suspend an app that uses an excessive amount of CPU in the background. Test with Xcode's CPU report or the time profiler in Instruments, as Apple suggests.\n\n## Related\n\n- How watchOS keeps a workout app running is covered in [background execution on Apple Watch](/watch-apps/apple-watch-background-execution) and [the anatomy of a watchOS workout app](/watch-apps/watchos-workout-app-anatomy).\n- What App Review expects of HealthKit data itself is in the [App Store health data rules overview](/compliance/app-store-health-data-rules).\n- If your app's workouts can be started by voice, see [guideline 2.5.11: SiriKit and Shortcuts](/compliance/app-store-guideline-2-5-11-sirikit-shortcuts).\n\n## A note on limits\n\nThe workout-session article quoted here is about Apple Watch, and we haven't verified the equivalent iPhone guidance for this page. Guideline 2.5.4 itself doesn't name a platform. This page is general guidance, not legal advice.\n",
    "steps": [
      {
        "name": "List every background mode the app declares",
        "text": "Open UIBackgroundModes in Info.plist, which Xcode writes when you enable the Background Modes capability, and match each mode to a feature a reviewer can see. Remove any mode no feature uses: guideline 2.5.4 allows background services only for their intended purposes."
      },
      {
        "name": "Declare Workout processing for Apple Watch workout sessions",
        "text": "Apple's HealthKit documentation says workout sessions require the Workout processing background mode, added through the background modes capability on the WatchKit App Extension."
      },
      {
        "name": "Add Audio only if the workout plays audio or haptics",
        "text": "Apple says to add the Audio background mode if the app plays audio or provides haptic feedback during the workout session, and that playing a background audio clip requires an active workout session."
      },
      {
        "name": "Tie background location to a live feature",
        "text": "Keep the Location updates mode only if the app needs updates in real time, such as recording a route. Apple's Core Location documentation names tracking the precise path of a hike or fitness workout, and says most apps need location only while someone actively uses the app."
      },
      {
        "name": "Tell users when location arrives in the background",
        "text": "For Always authorization, Apple's Core Location documentation says to inform the user that location updates arrive in the background."
      },
      {
        "name": "Keep background work light on Apple Watch",
        "text": "Apple warns that watchOS may suspend an app that uses an excessive amount of CPU in the background. Test with Xcode's CPU report or the time profiler in Instruments, as Apple suggests."
      }
    ],
    "faqs": [
      {
        "q": "Does guideline 2.5.4 allow the workout processing background mode?",
        "a": "Guideline 2.5.4 doesn't name it: its list of intended purposes is VoIP, audio playback, location, task completion and local notifications, ending in \"etc.\". Apple's HealthKit documentation says Apple Watch workout sessions require the Workout processing background mode, so an active workout session is the purpose Apple documents for it."
      },
      {
        "q": "Can an Apple Watch workout app play coaching audio in the background?",
        "a": "Apple's HealthKit documentation says workout apps can use AVFoundation to play short audio clips in the background, such as coaching or notifications, but only while an active workout session is running. If the app plays audio or haptic feedback during the session, Apple says to add the Audio background mode as well."
      },
      {
        "q": "When does a running or cycling app need background location?",
        "a": "When it needs location updates in real time while in the background. Apple's Core Location documentation names tracking the precise path taken during a hike or fitness workout as an example, and says most apps need location only while someone actively uses the app. For Always authorization, Apple says to tell users that updates arrive in the background."
      }
    ],
    "related": [
      {
        "href": "/watch-apps/apple-watch-background-execution",
        "label": "Background execution on Apple Watch"
      },
      {
        "href": "/watch-apps/watchos-workout-app-anatomy",
        "label": "Anatomy of a watchOS workout app"
      },
      {
        "href": "/compliance/app-store-guideline-2-5-11-sirikit-shortcuts",
        "label": "App Store guideline 2.5.11: SiriKit and Shortcuts"
      },
      {
        "href": "/compliance",
        "label": "Health-data compliance & privacy"
      }
    ],
    "cta": {
      "pitch": "Apple changes background execution rules between OS releases. Subscribe and we'll flag the changes that affect workout apps in App Review."
    },
    "sources": [
      {
        "url": "https://developer.apple.com/app-store/review/guidelines/",
        "checked": "2026-10-03",
        "note": "guideline 2.5.4; last updated June 8, 2026"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/running-workout-sessions",
        "checked": "2026-10-03",
        "note": "Workout processing and Audio background modes; background audio needs an active session; background CPU limits"
      },
      {
        "url": "https://developer.apple.com/documentation/corelocation/handling-location-updates-in-the-background",
        "checked": "2026-10-03",
        "note": "when background location is warranted; Location updates capability; telling users under Always authorization"
      },
      {
        "url": "https://developer.apple.com/documentation/bundleresources/information-property-list/uibackgroundmodes",
        "checked": "2026-10-03",
        "note": "UIBackgroundModes key and the Background Modes capability"
      }
    ]
  },
  {
    "slug": "app-store-guideline-2-5-11-sirikit-shortcuts",
    "primaryQuery": "app store guideline 2.5.11 sirikit shortcuts",
    "h1": "App Store Guideline 2.5.11: SiriKit and Shortcuts in Fitness Apps",
    "metaTitle": "App Store Guideline 2.5.11: SiriKit and Shortcuts",
    "metaDescription": "Guideline 2.5.11 uses starting a workout as its example: register only intents you can handle, keep Siri aliases relevant, and fulfil requests directly.",
    "updated": "2026-10-03",
    "answer": "App Store Review Guideline 2.5.11 covers SiriKit and Shortcuts in three parts: sign up only for intents your app can handle without another app and that users would expect, keep plist vocabulary and aliases tied to your app, and resolve requests directly without ads or marketing in between. Its own example is a meal planning app that should not incorporate an intent to start a workout. Quoted from the guidelines as last updated June 8, 2026, checked October 3, 2026; this is general guidance, not legal advice.",
    "body": "## The guideline text\n\nQuoted verbatim from Apple's [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#2.5.11), which the page states were last updated June 8, 2026. We checked the text on October 3, 2026. Apple revises the guidelines and sometimes renumbers sub-items, so compare this against the live page before you cite it in a reply to App Review.\n\n> **2.5.11 SiriKit and Shortcuts**\n>\n> (i) Apps integrating SiriKit and Shortcuts should only sign up for intents they can handle without the support of an additional app and that users would expect from the stated functionality. For example, if your app is a meal planning app, you should not incorporate an intent to start a workout, even if the app shares integration with a fitness app.\n>\n> (ii) Ensure that the vocabulary and phrases in your plist pertains to your app and the Siri functionality of the intents the app has registered for. Aliases must relate directly to your app or company name and should not be generic terms or include third-party app names or services.\n>\n> (iii) Resolve the Siri request or Shortcut in the most direct way possible and do not insert ads or other marketing between the request and its fulfillment. Only request a disambiguation when required to complete the task (e.g. asking the user to specify a particular type of workout).\n\n## What it means for a fitness app\n\nApple uses workouts as the example twice in this guideline: once for an intent an app shouldn't register, and once for a follow-up question that's acceptable.\n\n- **(i) Which intents to register.** A workout app that starts and tracks workouts itself can register a start-workout intent. A meal planning or nutrition app shouldn't, according to the guideline's own example, \"even if the app shares integration with a fitness app\". The test is whether your app can complete the intent without another app, and whether users would expect it from what the app says it does.\n- **(ii) Vocabulary and aliases.** Phrases in your plist should be about your app and the intents it registers. An alias has to relate directly to your app or company name. A bare generic word, or another company's app name, doesn't qualify.\n- **(iii) Fulfilment.** When someone asks Siri or runs a shortcut to start a workout, the workout should start with nothing promotional in between. Asking which type of workout is the one disambiguation the guideline names as acceptable, and only when it's needed.\n\n### The workout intents Apple documents\n\nTwo Apple APIs carry a start-workout request:\n\n- **SiriKit's [INStartWorkoutIntent](https://developer.apple.com/documentation/intents/instartworkoutintent).** Apple: \"SiriKit creates an INStartWorkoutIntent object when the user asks to start a workout using your app. A start workout intent identifies the user-selected workout type and goals.\" It also says that \"SiriKit launches your app and passes it an NSUserActivity object your app must then use to start the workout.\"\n- **App Intents' [StartWorkoutIntent](https://developer.apple.com/documentation/appintents/startworkoutintent),** \"An App Intent for starting a workout\", which Apple lists as available from iOS 16.0 and watchOS 9.0. Apple: \"On Apple Watch Ultra, this intent registers a start workout action for the Action button.\"\n\nGuideline 2.5.11 covers both, since it names SiriKit and Shortcuts.\n\n## What typically triggers it in a fitness app\n\nThese come from the guideline text, not from a log of rejections.\n\n- **A start-workout intent the app can't fulfil by itself.** For example, a nutrition app that registers one and hands the workout to a partner app. The guideline's example rules this out.\n- **Generic or third-party aliases.** An alias that is a generic term, or that includes another app's or service's name.\n- **Marketing before the workout starts.** An ad or promotion between the Siri request and the workout, which 2.5.11(iii) says not to insert.\n- **Follow-up questions the request didn't need.** Asking for details when the request was already complete. The guideline says to request a disambiguation only when required.\n\n## Checklist before you resubmit\n\n1. **Register only intents the app fulfils by itself.** Go through each SiriKit intent and shortcut the app signs up for, and drop any that needs another app to complete. Guideline 2.5.11(i) says apps should only sign up for intents they can handle without the support of an additional app.\n2. **Match intents to what the app says it does.** A start-workout intent belongs in an app users would expect to start workouts. The guideline's own example is a meal planning app that should not incorporate an intent to start a workout, even if it shares integration with a fitness app.\n3. **Audit plist vocabulary and aliases.** Keep the vocabulary and phrases in your plist about your app and the intents it registers. Under 2.5.11(ii), aliases must relate directly to your app or company name, not generic terms or third-party app names or services.\n4. **Start the workout directly.** Remove ads, promotions or other marketing between the Siri request or shortcut and the workout starting. Guideline 2.5.11(iii) asks you to resolve the request in the most direct way possible.\n5. **Ask follow-up questions only when you need the answer.** Request a disambiguation, such as which type of workout, only when the request can't be completed without it. That is the example 2.5.11(iii) itself uses.\n\n## Related\n\n- If a voice-started workout keeps running with the screen off, background modes come under [guideline 2.5.4](/compliance/app-store-guideline-2-5-4-background-services).\n- For how a watchOS workout app is put together, see [the anatomy of a watchOS workout app](/watch-apps/watchos-workout-app-anatomy).\n- Apple's health-data rules are summarized in the [App Store health data rules overview](/compliance/app-store-health-data-rules).\n\n## A note on limits\n\nThe guideline doesn't say how App Review treats a start-workout intent behind a subscription, and we couldn't find Apple text on it. 2.5.11(iii) covers ads and marketing between a request and its fulfilment, nothing more specific. This page is general guidance, not legal advice.\n",
    "steps": [
      {
        "name": "Register only intents the app fulfils by itself",
        "text": "Go through each SiriKit intent and shortcut the app signs up for, and drop any that needs another app to complete. Guideline 2.5.11(i) says apps should only sign up for intents they can handle without the support of an additional app."
      },
      {
        "name": "Match intents to what the app says it does",
        "text": "A start-workout intent belongs in an app users would expect to start workouts. The guideline's own example is a meal planning app that should not incorporate an intent to start a workout, even if it shares integration with a fitness app."
      },
      {
        "name": "Audit plist vocabulary and aliases",
        "text": "Keep the vocabulary and phrases in your plist about your app and the intents it registers. Under 2.5.11(ii), aliases must relate directly to your app or company name, not generic terms or third-party app names or services."
      },
      {
        "name": "Start the workout directly",
        "text": "Remove ads, promotions or other marketing between the Siri request or shortcut and the workout starting. Guideline 2.5.11(iii) asks you to resolve the request in the most direct way possible."
      },
      {
        "name": "Ask follow-up questions only when you need the answer",
        "text": "Request a disambiguation, such as which type of workout, only when the request can't be completed without it. That is the example 2.5.11(iii) itself uses."
      }
    ],
    "faqs": [
      {
        "q": "Can a nutrition app offer a Siri intent to start a workout?",
        "a": "Guideline 2.5.11(i) uses almost exactly this case as its example: a meal planning app should not incorporate an intent to start a workout, even if the app shares integration with a fitness app. Apps should sign up only for intents they can handle without an additional app and that users would expect from the app's stated functionality."
      },
      {
        "q": "Can I show a promotion before a Siri-started workout begins?",
        "a": "Guideline 2.5.11(iii) says to resolve the Siri request or shortcut in the most direct way possible and not to insert ads or other marketing between the request and its fulfillment. The guideline says nothing more specific than that, and we couldn't find Apple text on subscription-gated intents."
      },
      {
        "q": "When may a workout intent ask the user a follow-up question?",
        "a": "Only when the answer is needed to complete the task. Guideline 2.5.11(iii) gives asking the user to specify a particular type of workout as its example of an acceptable disambiguation."
      },
      {
        "q": "Which Apple APIs receive a request to start a workout?",
        "a": "Apple documents SiriKit's INStartWorkoutIntent, which SiriKit creates when the user asks to start a workout using your app, and the App Intents StartWorkoutIntent, which Apple lists from iOS 16.0 and watchOS 9.0 and which registers the Action button's start workout action on Apple Watch Ultra."
      }
    ],
    "related": [
      {
        "href": "/engagement/app-intents-start-workout",
        "label": "App Intents: start a workout from Siri and Shortcuts"
      },
      {
        "href": "/compliance/app-store-guideline-2-5-4-background-services",
        "label": "App Store guideline 2.5.4: background services"
      },
      {
        "href": "/watch-apps/watchos-workout-app-anatomy",
        "label": "Anatomy of a watchOS workout app"
      },
      {
        "href": "/compliance/app-store-health-data-rules",
        "label": "Apple App Store health data rules (overview)"
      },
      {
        "href": "/compliance",
        "label": "Health-data compliance & privacy"
      }
    ],
    "cta": {
      "pitch": "Apple keeps reshaping Siri, Shortcuts and App Intents. Subscribe and we'll flag the changes that affect workout apps in App Review."
    },
    "sources": [
      {
        "url": "https://developer.apple.com/app-store/review/guidelines/",
        "checked": "2026-10-03",
        "note": "guideline 2.5.11(i)–(iii); last updated June 8, 2026"
      },
      {
        "url": "https://developer.apple.com/documentation/intents/instartworkoutintent",
        "checked": "2026-10-03",
        "note": "what SiriKit creates for a start-workout request and how the app receives it"
      },
      {
        "url": "https://developer.apple.com/documentation/appintents/startworkoutintent",
        "checked": "2026-10-03",
        "note": "StartWorkoutIntent abstract, availability and the Apple Watch Ultra Action button"
      }
    ]
  }
];
