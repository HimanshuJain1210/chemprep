// Curated formula sheet + 2-3 Previous Year Questions per topic across all 3 JEE subjects.
// PYQs are representative style; students should still practise from official papers.

export const FORMULAS = {
  // ============================== CHEMISTRY ==============================
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
  },

  // =============================== PHYSICS ===============================
  'ph-kinematics': {
    formulas: [
      { f: 'v = u + at', note: 'constant acceleration' },
      { f: 's = ut + ½at²', note: '' },
      { f: 'v² = u² + 2as', note: 'no time' },
      { f: 'Range R = u²·sin(2θ)/g', note: 'projectile, flat ground' },
      { f: 'H_max = u²·sin²θ / (2g)', note: 'projectile' },
      { f: 'Time of flight T = 2u·sinθ / g', note: '' }
    ]
  },
  'ph-laws': {
    formulas: [
      { f: 'F = ma', note: '2nd law' },
      { f: 'Friction: f ≤ μ_s N (static), f = μ_k N (kinetic)', note: 'μ_s ≥ μ_k' },
      { f: 'Inclined plane: a = g(sinθ − μcosθ)', note: 'block sliding down' },
      { f: 'Pulley (Atwood): a = (m₁−m₂)g/(m₁+m₂); T = 2m₁m₂g/(m₁+m₂)', note: '' }
    ]
  },
  'ph-work': {
    formulas: [
      { f: 'W = F·s·cosθ', note: 'constant force' },
      { f: 'KE = ½mv²;  W_net = ΔKE', note: 'work-energy theorem' },
      { f: 'PE_grav = mgh;  PE_spring = ½kx²', note: '' },
      { f: 'P_avg = W/t;  P_inst = F·v', note: '' }
    ]
  },
  'ph-rotation': {
    formulas: [
      { f: 'τ = Iα;  L = Iω', note: 'rotational analogues' },
      { f: 'Rolling: v = Rω; KE = ½mv² + ½Iω²', note: 'no slip' },
      { f: 'I_disk (axis ⟂) = ½MR²;  I_ring = MR²;  I_sphere = (2/5)MR²', note: 'common moments' },
      { f: 'Parallel axis: I = I_cm + Md²', note: '' }
    ]
  },
  'ph-grav': {
    formulas: [
      { f: 'F = G m₁m₂ / r²', note: 'G = 6.67×10⁻¹¹' },
      { f: 'g = GM/R²;  g\' = g(1 − 2h/R) for h<<R', note: '' },
      { f: 'v_orbital = √(GM/r);  v_escape = √(2GM/R)', note: 'v_e = √2 · v_o' },
      { f: 'T² = (4π²/GM) r³', note: 'Kepler\'s 3rd law' }
    ]
  },
  'ph-shm': {
    formulas: [
      { f: 'x(t) = A·sin(ωt + φ);  ω = 2π/T', note: '' },
      { f: 'a = −ω²x;  v = ω√(A²−x²)', note: '' },
      { f: 'Energy: E = ½mω²A² (constant)', note: '' },
      { f: 'Pendulum: T = 2π√(L/g);  Spring: T = 2π√(m/k)', note: '' }
    ]
  },
  'ph-thermo': {
    formulas: [
      { f: 'ΔU = Q − W (physics convention W=work BY gas)', note: 'note sign convention' },
      { f: 'Isothermal (ideal): W = nRT·ln(V₂/V₁); ΔU=0', note: '' },
      { f: 'Adiabatic: PV^γ = const; W = (P₁V₁ − P₂V₂)/(γ−1)', note: '' },
      { f: 'η_Carnot = 1 − T_cold/T_hot', note: 'Kelvin' },
      { f: 'COP_ref = T_cold/(T_hot − T_cold)', note: '' }
    ]
  },
  'ph-electrostat': {
    formulas: [
      { f: 'F = (1/4πε₀) · q₁q₂/r²;  k = 9×10⁹', note: 'Coulomb' },
      { f: 'E = F/q;  V = U/q;  E = −dV/dr', note: '' },
      { f: 'Point charge: E = kq/r²; V = kq/r', note: '' },
      { f: 'Capacitor: C = Q/V; parallel plate C = ε₀A/d', note: '' },
      { f: 'Energy in cap: U = ½CV² = Q²/(2C)', note: '' }
    ]
  },
  'ph-current': {
    formulas: [
      { f: 'V = IR;  ρ = RA/L', note: 'Ohm + resistivity' },
      { f: 'Series: R_eq = ΣR; Parallel: 1/R_eq = Σ(1/R)', note: '' },
      { f: 'P = VI = I²R = V²/R', note: '' },
      { f: 'EMF: V = ε − Ir (discharging)', note: '' },
      { f: 'Wheatstone balance: P/Q = R/S', note: '' }
    ]
  },
  'ph-magnet': {
    formulas: [
      { f: 'F = qv × B;  F = IL × B', note: 'Lorentz' },
      { f: 'Long wire: B = μ₀I/(2πr)', note: '' },
      { f: 'Solenoid (long): B = μ₀nI', note: 'n = turns/length' },
      { f: 'Circular loop centre: B = μ₀I/(2R)', note: '' }
    ]
  },
  'ph-emi': {
    formulas: [
      { f: 'ε = −dΦ/dt', note: 'Faraday' },
      { f: 'L = Φ/I;  V_L = L·dI/dt', note: 'self-inductance' },
      { f: 'X_L = ωL;  X_C = 1/(ωC)', note: 'reactance' },
      { f: 'Z = √(R² + (X_L − X_C)²)', note: 'LCR series impedance' },
      { f: 'Resonance: ω₀ = 1/√(LC)', note: '' }
    ]
  },
  'ph-rayoptics': {
    formulas: [
      { f: '1/v − 1/u = 1/f (lens, NCERT sign conv.)', note: '' },
      { f: '1/f = (n−1)(1/R₁ − 1/R₂)', note: 'lens-maker' },
      { f: 'Magnification m = v/u (lens) = h\'/h', note: '' },
      { f: 'Critical angle: sinθ_c = 1/n', note: 'TIR' },
      { f: 'Prism: A + δ = i + e;  δ_min when i = e', note: '' }
    ]
  },
  'ph-waveoptics': {
    formulas: [
      { f: 'YDSE fringe width β = λD/d', note: '' },
      { f: 'Bright at Δx = nλ; Dark at (n+½)λ', note: '' },
      { f: 'Single slit: minima at a·sinθ = nλ', note: 'n ≠ 0' },
      { f: 'Brewster: tan θ_p = n', note: 'reflected light fully polarised' }
    ]
  },
  'ph-modern': {
    formulas: [
      { f: 'Photoelectric: KE_max = hν − φ', note: 'φ = work function' },
      { f: 'de Broglie: λ = h/p', note: '' },
      { f: 'E_n (H) = −13.6/n² eV', note: 'Bohr' },
      { f: 'Radioactivity: N = N₀e^(−λt); t_½ = 0.693/λ', note: '' },
      { f: 'Mass-energy: E = Δm·c²', note: '1 amu = 931.5 MeV' }
    ]
  },

  // ============================ MATHEMATICS ============================
  'mt-trig': {
    formulas: [
      { f: 'sin²θ + cos²θ = 1; 1 + tan²θ = sec²θ', note: 'fundamental' },
      { f: 'sin(A±B) = sinA·cosB ± cosA·sinB', note: '' },
      { f: 'cos(A±B) = cosA·cosB ∓ sinA·sinB', note: '' },
      { f: 'sin2θ = 2sinθ·cosθ; cos2θ = 1 − 2sin²θ = 2cos²θ − 1', note: 'double angle' },
      { f: 'Sine rule: a/sinA = b/sinB = c/sinC = 2R', note: 'triangle' },
      { f: 'Cosine rule: a² = b² + c² − 2bc·cosA', note: '' }
    ]
  },
  'mt-comp': {
    formulas: [
      { f: '|z|² = z·z̄;  arg(z₁z₂) = arg z₁ + arg z₂', note: '' },
      { f: 'De Moivre: (cosθ + i sinθ)ⁿ = cos(nθ) + i·sin(nθ)', note: 'integer n' },
      { f: 'Cube roots of unity: 1, ω, ω²;  1+ω+ω² = 0', note: 'ω³ = 1' },
      { f: 'Quadratic ax² + bx + c = 0: roots = (−b ± √(b²−4ac))/(2a)', note: '' },
      { f: 'Sum = −b/a;  Product = c/a', note: 'Vieta' }
    ]
  },
  'mt-seq': {
    formulas: [
      { f: 'AP: T_n = a + (n−1)d;  S_n = (n/2)(2a + (n−1)d)', note: '' },
      { f: 'GP: T_n = ar^(n−1);  S_n = a(rⁿ−1)/(r−1);  S_∞ = a/(1−r), |r|<1', note: '' },
      { f: 'AM ≥ GM ≥ HM', note: 'equality iff all equal' },
      { f: 'Σn = n(n+1)/2; Σn² = n(n+1)(2n+1)/6; Σn³ = (Σn)²', note: '' }
    ]
  },
  'mt-binomial': {
    formulas: [
      { f: '(x+y)ⁿ = Σ ⁿCₖ x^(n−k) y^k', note: 'k = 0..n' },
      { f: 'General term T_(r+1) = ⁿCᵣ x^(n−r) y^r', note: '' },
      { f: 'Middle term: n even → T_(n/2 + 1); n odd → 2 middle terms', note: '' },
      { f: 'ⁿCᵣ = ⁿCₙ₋ᵣ;  ⁿCᵣ + ⁿCᵣ₋₁ = (n+1)Cᵣ', note: 'Pascal' }
    ]
  },
  'mt-matrix': {
    formulas: [
      { f: 'A·A⁻¹ = I; A⁻¹ = adj(A)/|A|', note: 'requires |A| ≠ 0' },
      { f: '(AB)⁻¹ = B⁻¹A⁻¹;  (Aᵀ)⁻¹ = (A⁻¹)ᵀ', note: '' },
      { f: '|kA| = kⁿ|A| (n×n);  |Aᵀ| = |A|', note: '' },
      { f: 'Cramer: x = D_x/D, etc.;  unique solution iff D ≠ 0', note: '' }
    ]
  },
  'mt-prob': {
    formulas: [
      { f: 'P(A∪B) = P(A) + P(B) − P(A∩B)', note: '' },
      { f: 'P(A∩B) = P(A)·P(B|A)', note: 'conditional' },
      { f: 'Bayes: P(A|B) = P(B|A)·P(A) / P(B)', note: '' },
      { f: 'Binomial: P(X=k) = ⁿCₖ p^k (1−p)^(n−k)', note: 'mean = np, var = np(1−p)' }
    ]
  },
  'mt-limits': {
    formulas: [
      { f: 'lim(x→0) sin x / x = 1;  lim(x→0) (1−cos x)/x² = ½', note: '' },
      { f: 'lim(x→0) (e^x − 1)/x = 1;  lim(x→0) (a^x − 1)/x = ln a', note: '' },
      { f: 'lim(x→∞) (1 + 1/x)^x = e;  lim(x→0) (1+x)^(1/x) = e', note: '' },
      { f: 'L\'Hôpital: lim f/g = lim f\'/g\' for 0/0 or ∞/∞', note: '' }
    ]
  },
  'mt-deriv': {
    formulas: [
      { f: 'd/dx[sin x] = cos x; d/dx[cos x] = −sin x; d/dx[tan x] = sec² x', note: '' },
      { f: 'd/dx[ln x] = 1/x;  d/dx[e^x] = e^x;  d/dx[a^x] = a^x ln a', note: '' },
      { f: 'Chain rule: d/dx[f(g(x))] = f\'(g(x))·g\'(x)', note: '' },
      { f: 'Product: (uv)\' = u\'v + uv\';  Quotient: (u/v)\' = (u\'v − uv\')/v²', note: '' },
      { f: 'Critical points: f\'(x)=0 or undefined; max if f\'\'<0, min if f\'\'>0', note: '' }
    ]
  },
  'mt-integ': {
    formulas: [
      { f: '∫xⁿ dx = x^(n+1)/(n+1) + C  (n ≠ −1)', note: '' },
      { f: '∫dx/x = ln|x| + C; ∫e^x dx = e^x + C', note: '' },
      { f: '∫sin x dx = −cos x;  ∫cos x dx = sin x', note: '' },
      { f: 'By parts: ∫u dv = uv − ∫v du  (LIATE order)', note: '' },
      { f: '∫₀^a f(x)dx = ∫₀^a f(a−x)dx', note: 'definite integral property' }
    ]
  },
  'mt-de': {
    formulas: [
      { f: 'Variable separable: ∫dy/g(y) = ∫f(x)dx + C', note: '' },
      { f: 'Linear 1st order: dy/dx + Py = Q;  IF = e^∫P dx;  y·IF = ∫Q·IF dx + C', note: '' },
      { f: 'Homogeneous: y = vx substitution', note: 'reduces to variable separable' }
    ]
  },
  'mt-line2d': {
    formulas: [
      { f: 'Distance: √((x₂−x₁)² + (y₂−y₁)²)', note: '' },
      { f: 'Slope-intercept: y = mx + c;  perpendicular: m₁m₂ = −1', note: '' },
      { f: 'Distance from point to line ax+by+c=0: |ax₁+by₁+c|/√(a²+b²)', note: '' },
      { f: 'Circle: (x−h)² + (y−k)² = r²', note: 'centre (h,k)' }
    ]
  },
  'mt-conics': {
    formulas: [
      { f: 'Parabola y² = 4ax: focus (a,0), directrix x = −a, latus rectum 4a', note: '' },
      { f: 'Ellipse x²/a² + y²/b² = 1: e = √(1 − b²/a²)', note: 'a > b' },
      { f: 'Hyperbola x²/a² − y²/b² = 1: e = √(1 + b²/a²); asymptotes y = ±(b/a)x', note: '' }
    ]
  },
  'mt-3dvec': {
    formulas: [
      { f: 'a·b = |a||b|cosθ;  a×b = |a||b|sinθ·n̂', note: '' },
      { f: '|a×b|² + (a·b)² = |a|²|b|²', note: 'Lagrange identity' },
      { f: 'Scalar triple = a·(b×c) = volume of parallelepiped', note: '' },
      { f: 'Line in 3D: r = a + λb;  Plane: r·n = d', note: '' },
      { f: 'Distance point to plane: |a·n − d|/|n|', note: '' }
    ]
  }
};

// Representative PYQ-style questions (mentor will flag these as practice targets).
// Kept concise; the AI tutor can generate additional variants on demand.
export const PYQS = {
  // Chemistry
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
  ],

  // Physics
  'ph-kinematics': [
    { year: 2023, exam: 'JEE Main', q: 'A ball is thrown up at 20 m/s. Find max height reached. (g = 10 m/s²)', ans:'H = u²/(2g) = 400/20 = 20 m' },
    { year: 2022, exam: 'JEE Main', q: 'Projectile launched at 30° with 40 m/s. Range? (g=10)', ans:'R = u²sin60°/g = 1600·0.866/10 ≈ 138.6 m' }
  ],
  'ph-laws': [
    { year: 2023, exam: 'JEE Main', q: 'Block on inclined plane (30°) just slides. Find μ_s.', ans:'μ_s = tanθ = tan30° = 1/√3 ≈ 0.577' }
  ],
  'ph-rotation': [
    { year: 2022, exam: 'JEE Adv', q: 'Solid sphere rolls without slipping down incline of height h. Find v at bottom.', ans:'mgh = ½mv² + ½(2/5 mR²)(v/R)² ⇒ v = √(10gh/7)' }
  ],
  'ph-shm': [
    { year: 2023, exam: 'JEE Main', q: 'A particle in SHM has T = 4s, amplitude = 5 cm. Find max velocity.', ans:'v_max = ωA = (2π/4)(5×10⁻²) ≈ 0.0785 m/s' }
  ],
  'ph-electrostat': [
    { year: 2023, exam: 'JEE Main', q: 'Two charges +q and −q at separation 2a. Find E at perpendicular bisector at distance r.', ans:'E = kq·(2a)/(r²+a²)^(3/2), directed along axis (towards −q for +q at +a)' }
  ],
  'ph-current': [
    { year: 2022, exam: 'JEE Main', q: 'Battery EMF = 12V, internal resistance 1Ω, external 5Ω. Terminal voltage?', ans:'I = 12/6 = 2A; V = ε − Ir = 12 − 2 = 10V' }
  ],
  'ph-emi': [
    { year: 2023, exam: 'JEE Main', q: 'LCR series: R=10Ω, L=0.1H, C=10μF. Resonant frequency?', ans:'f₀ = 1/(2π√(LC)) ≈ 159 Hz' }
  ],
  'ph-rayoptics': [
    { year: 2023, exam: 'JEE Main', q: 'Object 30cm in front of concave mirror f=10cm. Find image distance.', ans:'1/v + 1/(−30) = 1/(−10) ⇒ v = −15 cm (real, inverted)' }
  ],
  'ph-modern': [
    { year: 2022, exam: 'JEE Main', q: 'Threshold wavelength of metal = 500nm. KE_max for incident λ=300nm? (h=6.63×10⁻³⁴, c=3×10⁸)', ans:'KE = hc(1/λ − 1/λ₀) ≈ 1.32 eV' }
  ],

  // Mathematics
  'mt-trig': [
    { year: 2023, exam: 'JEE Main', q: 'If sinθ + cosθ = 1, find sin³θ + cos³θ.', ans:'1 (using a³+b³ = (a+b)(a²−ab+b²) and 1 = a²+b²+2ab)' }
  ],
  'mt-comp': [
    { year: 2022, exam: 'JEE Main', q: 'If z = 1 + i, find arg(z²).', ans:'arg(z) = π/4, so arg(z²) = π/2' }
  ],
  'mt-seq': [
    { year: 2023, exam: 'JEE Main', q: 'Sum of n terms of an AP is 3n² + 5n. Find the 10th term.', ans:'T_n = S_n − S_(n−1) = (3n²+5n) − (3(n−1)²+5(n−1)) = 6n+2; T_10 = 62' }
  ],
  'mt-matrix': [
    { year: 2023, exam: 'JEE Main', q: 'If A is 3×3 with |A|=5, find |adj(A)|.', ans:'|adj A| = |A|^(n−1) = 5² = 25' }
  ],
  'mt-deriv': [
    { year: 2023, exam: 'JEE Main', q: 'Find max value of f(x) = x³ − 12x + 5 on [0, 4].', ans:'f\'(x) = 3x² − 12 = 0 ⇒ x = 2 (min). Max at endpoints: f(0)=5, f(4)=21. Answer: 21' }
  ],
  'mt-integ': [
    { year: 2023, exam: 'JEE Main', q: 'Evaluate ∫₀^(π/2) (sin x)/(sin x + cos x) dx.', ans:'π/4 (use property ∫₀^a f(x) = ∫₀^a f(a−x))' }
  ],
  'mt-3dvec': [
    { year: 2022, exam: 'JEE Main', q: 'If a = i + 2j + 3k and b = 2i − j + 4k, find a · b and |a × b|.', ans:'a·b = 2 − 2 + 12 = 12; |a×b| = √((8+3)² + (6−4)² + (−1−4)²) — compute the cross product first.' }
  ],
  'mt-prob': [
    { year: 2023, exam: 'JEE Main', q: 'Two dice rolled. P(sum = 8 | sum even).', ans:'P(sum=8)=5/36; P(even)=18/36; conditional = 5/18' }
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
  'Physical Chem: don\'t memorise formulas; derive them once, and the units will save you.',
  'Physics: draw the FBD before any equation. If your FBD is wrong, your maths cannot save you.',
  'Maths: solve 10 problems per concept on day 1, 5 the next week, 3 the week after. Spaced reps.',
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
