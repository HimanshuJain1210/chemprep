// Curated formula sheet + 2-3 Previous Year Questions per topic (JEE Main/Adv style).
// PYQs here are representative style; students should still practise from official papers.

export const FORMULAS = {
  'p-basic': {
    formulas: [
      { f: 'n = m / M', note: 'moles = mass / molar mass' },
      { f: 'N = n × Nₐ', note: 'Nₐ = 6.022 × 10²³ mol⁻¹' },
      { f: 'Molarity M = n_solute / V_L', note: 'Temperature dependent' },
      { f: 'Molality m = n_solute / kg_solvent', note: 'Temperature INDEPENDENT' },
      { f: 'ppm = (mass solute / mass solution) × 10⁶', note: 'dilute solutions' },
      { f: '% yield = (actual / theoretical) × 100', note: 'always < 100%' }
    ]
  },
  'p-atom': {
    formulas: [
      { f: 'E_n = −13.6 × Z²/n² eV', note: 'Bohr energy (H-like)' },
      { f: 'r_n = 0.529 × n²/Z Å', note: 'Bohr radius' },
      { f: '1/λ = R_H × Z² × (1/n₁² − 1/n₂²)', note: 'Rydberg; R_H = 1.097×10⁷ m⁻¹' },
      { f: 'λ = h/mv (de Broglie)', note: 'p = mv' },
      { f: 'Δx · Δp ≥ h/4π', note: 'Heisenberg uncertainty' },
      { f: 'radial nodes = n−l−1; angular = l', note: 'total = n−1' }
    ]
  },
  'p-thermo': {
    formulas: [
      { f: 'ΔU = q + w', note: '1st law; w = −P_ext ΔV (expansion work)' },
      { f: 'ΔH = ΔU + Δn_g RT', note: 'gases only' },
      { f: 'q_rev = nC ΔT', note: 'Cp or Cv depending on process' },
      { f: 'ΔS_sys = q_rev / T', note: 'reversible' },
      { f: 'ΔG = ΔH − TΔS', note: 'spontaneity: ΔG < 0' },
      { f: 'ΔG° = −RT ln K = −nFE°_cell', note: 'links thermo & electro' }
    ]
  },
  'p-eqm': {
    formulas: [
      { f: 'Kp = Kc (RT)^Δn_g', note: 'Δn_g = moles gas products − reactants' },
      { f: 'pH = −log[H⁺]', note: '' },
      { f: 'pH = pKa + log([A⁻]/[HA])', note: 'Henderson–Hasselbalch' },
      { f: 'Ka · Kb = Kw = 10⁻¹⁴ (298 K)', note: 'conjugate pair only' },
      { f: 'S (solubility) from Ksp: A_xB_y → x·S^x · y·S^y · … = Ksp', note: '' },
      { f: 'α = √(Ka/C) for weak acid', note: 'Ostwald dilution (dilute)' }
    ]
  },
  'p-solutions': {
    formulas: [
      { f: 'ΔT_b = K_b · m · i', note: 'ebullioscopy' },
      { f: 'ΔT_f = K_f · m · i', note: 'cryoscopy' },
      { f: 'π = CRT · i', note: 'osmotic pressure' },
      { f: 'Raoult: P_total = x_A P°_A + x_B P°_B', note: 'ideal' },
      { f: 'i = 1 + (n − 1)α  (dissociation)', note: 'i < 1 for association' }
    ]
  },
  'p-electro': {
    formulas: [
      { f: 'E_cell = E°_cell − (0.059/n) log Q  (at 298 K)', note: 'Nernst' },
      { f: 'ΔG° = −nFE°_cell', note: 'F = 96485 C/mol' },
      { f: 'Λ_m = κ × 1000 / C', note: 'molar conductivity' },
      { f: 'Λ°_m(AB) = ν₊ λ°₊ + ν₋ λ°₋', note: 'Kohlrausch' },
      { f: 'w = Z·I·t', note: 'Faraday: 1 F = 96500 C' }
    ]
  },
  'p-kinetics': {
    formulas: [
      { f: 'Rate = k[A]^m[B]^n', note: 'order = m+n' },
      { f: '1st order: ln([A]/[A₀]) = −kt;  t_½ = 0.693/k', note: 'independent of [A₀]' },
      { f: '2nd order: 1/[A] − 1/[A₀] = kt;  t_½ = 1/(k[A₀])', note: 'depends on [A₀]' },
      { f: 'k = A·e^(−Ea/RT)', note: 'Arrhenius' },
      { f: 'ln(k₂/k₁) = (Ea/R)(1/T₁ − 1/T₂)', note: 'two-temperature form' }
    ]
  },
  'p-solid': {
    formulas: [
      { f: 'SC: Z=1, r = a/2, packing = 52%', note: '' },
      { f: 'BCC: Z=2, 4r = a√3, packing = 68%', note: '' },
      { f: 'FCC/CCP: Z=4, 4r = a√2, packing = 74%', note: '' },
      { f: 'd = Z·M / (a³·Nₐ)', note: 'crystal density' },
      { f: 'HCP same 74% packing as FCC', note: 'different stacking' }
    ]
  },

  'o-goc': {
    formulas: [
      { f: '+I order: (CH₃)₃C > (CH₃)₂CH > CH₃CH₂ > CH₃', note: 'carbanion stability: OPPOSITE' },
      { f: '−I order: −NO₂ > −CN > −F > −Cl > −Br > −I > −OH', note: 'decreasing electronegativity' },
      { f: 'Carbocation stability: allyl/benzyl > 3° > 2° > 1° > methyl', note: 'resonance + hyperconjugation' },
      { f: 'Aromatic: planar, cyclic, (4n+2)π', note: 'Hückel rule' }
    ]
  },
  'o-carbonyl': {
    formulas: [
      { f: 'Aldol: 2 R-CHO → R-CH(OH)-CHR-CHO (base)', note: 'needs α-H' },
      { f: 'Cannizzaro: 2 HCHO → HCOO⁻ + CH₃OH (strong base)', note: 'no α-H' },
      { f: 'Clemmensen: Zn/Hg, HCl → C=O to CH₂', note: 'acid-stable substrates' },
      { f: 'Wolff-Kishner: NH₂NH₂ / KOH → C=O to CH₂', note: 'base-stable substrates' },
      { f: 'HVZ: R-CH₂-COOH + Br₂/P → R-CHBr-COOH', note: 'α-halogenation of acid' }
    ]
  },

  'i-bond': {
    formulas: [
      { f: 'Bond order = (N_b − N_a) / 2', note: 'MOT' },
      { f: 'μ = q · d  (in debye, 1 D = 3.336×10⁻³⁰ C·m)', note: 'dipole moment' },
      { f: 'Formal charge = V − L − B/2', note: 'Lewis structures' },
      { f: 'Hybridisation = σ + lone pairs at central atom', note: '2 sp, 3 sp², 4 sp³, 5 sp³d, 6 sp³d²' }
    ]
  },
  'i-coord': {
    formulas: [
      { f: 'CFSE (oct): −0.4×n(t₂g) + 0.6×n(eg)  [Δ₀]', note: 'in units of Δ₀' },
      { f: 'μ (spin-only) = √(n(n+2)) BM', note: 'n = unpaired electrons' },
      { f: 'Strong field: CN⁻ > CO > NO₂⁻ > en > NH₃ > H₂O > OH⁻ > F⁻ > Cl⁻ > Br⁻ > I⁻', note: 'spectrochemical series' }
    ]
  }
};

// Representative PYQ-style questions (mentor will flag these as practice targets).
// Kept concise; the AI tutor can generate additional variants on demand.
export const PYQS = {
  'p-eqm': [
    { year: 2023, exam: 'JEE Main', q: 'For the equilibrium A(g) ⇌ 2B(g), Kp = 4 atm at 300 K. If the initial pressure of A is 2 atm and no B, calculate the equilibrium partial pressure of A.', ans:'≈ 0.37 atm (solve 4(2−x) = (2x)²)' },
    { year: 2022, exam: 'JEE Adv', q: 'Identify which of the following buffers has the highest buffer capacity around pH 4.7: (a) 0.1 M CH₃COOH + 0.1 M CH₃COONa (b) 0.01 M each (c) 0.5 M each.', ans:'(c) highest — capacity scales with concentration.' }
  ],
  'p-thermo': [
    { year: 2022, exam: 'JEE Main', q: 'For an isothermal reversible expansion of ideal gas, ΔU = ?', ans:'0 (ideal gas, ΔT = 0 ⇒ ΔU = 0)' },
    { year: 2021, exam: 'JEE Adv', q: 'Calculate w for isothermal reversible expansion of 2 mol ideal gas from 10 L to 20 L at 300 K.', ans:'w = −nRT ln(V₂/V₁) ≈ −3457 J' }
  ],
  'p-kinetics': [
    { year: 2023, exam: 'JEE Main', q: 'For a 1st order reaction, 75% completion requires how many half-lives?', ans:'2 half-lives (0.5 → 0.25; 1 − 0.25 = 0.75)' },
    { year: 2022, exam: 'JEE Adv', q: 'Activation energy of a reaction is 75 kJ/mol. By what factor does the rate change when T goes from 300→310 K?', ans:'k₂/k₁ ≈ exp[(Ea/R)(1/300 − 1/310)] ≈ 2.6' }
  ],
  'p-electro': [
    { year: 2023, exam: 'JEE Main', q: 'Calculate E_cell for Zn|Zn²⁺(0.1 M)||Cu²⁺(1 M)|Cu given E°_cell = 1.10 V.', ans:'E = 1.10 − (0.059/2) log(0.1/1) = 1.13 V' }
  ],
  'o-carbonyl': [
    { year: 2023, exam: 'JEE Main', q: 'Which reagent converts R-CHO to R-CH₃?', ans:'Zn(Hg)/HCl (Clemmensen) or NH₂NH₂/KOH (Wolff-Kishner)' },
    { year: 2022, exam: 'JEE Adv', q: 'Identify product of crossed Cannizzaro between HCHO and C₆H₅CHO in NaOH.', ans:'HCOO⁻Na⁺ + C₆H₅CH₂OH (HCHO acts as reductant)' }
  ],
  'o-goc': [
    { year: 2023, exam: 'JEE Main', q: 'Arrange in order of decreasing acidity: phenol, p-nitrophenol, p-methoxyphenol.', ans:'p-nitrophenol > phenol > p-methoxyphenol (EWG ↑ acidity)' }
  ],
  'i-coord': [
    { year: 2023, exam: 'JEE Main', q: 'Magnetic moment of [Fe(CN)₆]³⁻ (spin-only).', ans:'Fe³⁺ d⁵, CN⁻ strong field → LS t₂g⁵, 1 unpaired ⇒ μ ≈ 1.73 BM' },
    { year: 2022, exam: 'JEE Adv', q: 'Hybridisation and geometry of [Ni(CO)₄] and [Ni(CN)₄]²⁻.', ans:'[Ni(CO)₄]: sp³ tetrahedral (Ni 0); [Ni(CN)₄]²⁻: dsp² square planar (Ni²⁺)' }
  ],
  'i-bond': [
    { year: 2023, exam: 'JEE Main', q: 'Number of π-bonds in SO₃.', ans:'2 pπ-pπ (and some delocalisation); commonly counted as 2.' }
  ],
  'p-solid': [
    { year: 2023, exam: 'JEE Main', q: 'If edge length of FCC is 400 pm, calculate radius of atom.', ans:'r = a/(2√2) = 400/2.828 ≈ 141.4 pm' }
  ]
};

export const DAILY_TIPS = [
  'Consistency > intensity. Two honest hours beat six exhausted ones.',
  'Revise two old topics for every new one you start. No exceptions.',
  'After every concept, solve at least 10 MCQs within 48 hours — that\'s when recall decay hits hardest.',
  'Sleep is a study tool. Seven hours. Protect it like marks.',
  'Do a 5-minute formula flash every morning before school. Over a year that\'s 30+ hours of free revision.',
  'Organic: write the mechanism. Don\'t just read it. Your hand teaches your brain.',
  'Inorganic: make one-page cheat sheets per group. Revise them weekly.',
  'Physical: don\'t memorise formulas; derive them once, and the units will save you.',
  'If you\'re stuck on a problem for 12+ minutes, mark it and move on. Return tomorrow.',
  'Your phone is a distraction, not a reward. Put it in another room during study.',
  'Sunday = mock + review. No new concepts. Your week gets audited here.',
  'Backlogs are just today\'s work, delayed. Don\'t treat them as a separate category — clear one every day.',
  'Compare yourself to last week\'s you, not the topper in your batch.',
  'Write down WHY a wrong answer was wrong. Not what the right answer was — WHY yours failed.',
  'Read the question twice before you start calculating. JEE loves traps in wording.'
];

export const MENTOR_WELCOME = [
  'Welcome back. No pep talk today — open Syllabus and pick one topic. We move.',
  'Good to see you. First: any pending cards? Clear them before new material. Revision compounds.',
  'You showed up. That\'s 40% of the battle. Let\'s do the other 60%.',
  'Ready? Tell me what\'s scaring you most right now — I\'ll start from there.',
  'Plan first, then study. A plan you half-follow beats no plan you fully ignored.'
];
