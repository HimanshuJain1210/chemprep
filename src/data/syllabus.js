// JEE Main + Advanced syllabus across Chemistry, Physics, and Mathematics.
// Each topic carries a `subject` field. Views filter by `state.profile.subject`.
// Weightages are approximations from recent JEE Main/Adv papers.

export const SYLLABUS = [
  // ========================================================================
  //                                CHEMISTRY
  // ========================================================================
  // --------- PHYSICAL ---------
  { id:'p-basic', subject:'chemistry', cls:11, branch:'physical', name:'Some Basic Concepts of Chemistry', weight:'Low',
    subs:['Mole concept','Stoichiometry','Empirical & molecular formula','Limiting reagent','Concentration units'],
    traps:'Limiting reagent and % purity questions are free marks — don\'t lose them in a hurry.' },
  { id:'p-atom', subject:'chemistry', cls:11, branch:'physical', name:'Structure of Atom', weight:'Medium',
    subs:['Bohr model','Quantum numbers','Orbitals & shapes','Aufbau / Hund / Pauli','de Broglie & Heisenberg'],
    traps:'Confusing angular nodes (l) vs radial nodes (n-l-1). Memorise the formula; don\'t derive under pressure.' },
  { id:'p-states', subject:'chemistry', cls:11, branch:'physical', name:'States of Matter', weight:'Low',
    subs:['Gas laws','Ideal gas equation','Kinetic theory','Real gases & van der Waals','Liquefaction & critical constants'],
    traps:'vdW gas — sign convention of "a" and "b". Attractive forces reduce pressure; excluded volume reduces volume.' },
  { id:'p-thermo', subject:'chemistry', cls:11, branch:'physical', name:'Thermodynamics', weight:'High',
    subs:['System & processes','First law','Enthalpy, Hess law','Second law & entropy','Gibbs free energy','Bond enthalpies'],
    traps:'Sign of ΔH for the reverse reaction. q and w depend on path, U does not. Standard state means 1 bar, 298 K.' },
  { id:'p-eqm', subject:'chemistry', cls:11, branch:'physical', name:'Chemical & Ionic Equilibrium', weight:'High',
    subs:['Kc, Kp, Le Chatelier','Acids & bases','pH, buffers (Henderson)','Solubility product Ksp','Common ion effect'],
    traps:'Ka × Kb = Kw only for a conjugate pair. pH of salts of weak acid + weak base depends on BOTH Ka and Kb.' },
  { id:'p-redox', subject:'chemistry', cls:11, branch:'physical', name:'Redox Reactions', weight:'Low',
    subs:['Oxidation number rules','Balancing by ion-electron method','Redox titrations','Disproportionation'],
    traps:'Always balance atoms first, then charge, then H/O in acidic/basic medium.' },
  { id:'p-solutions', subject:'chemistry', cls:12, branch:'physical', name:'Solutions', weight:'Medium',
    subs:['Concentration terms','Raoult\'s law','Colligative properties','Abnormal molar mass','van\'t Hoff factor i'],
    traps:'Degree of dissociation α and the relationship i = 1 + (n−1)α. For associating solutes, i < 1.' },
  { id:'p-electro', subject:'chemistry', cls:12, branch:'physical', name:'Electrochemistry', weight:'High',
    subs:['Galvanic vs electrolytic','EMF, Nernst equation','Conductance, Kohlrausch law','Batteries & fuel cells','Corrosion'],
    traps:'Sign of E° and the Nernst log term — which species is in numerator vs denominator. 0.059/n at 298 K.' },
  { id:'p-kinetics', subject:'chemistry', cls:12, branch:'physical', name:'Chemical Kinetics', weight:'High',
    subs:['Rate laws & order','Integrated rate (1st, 2nd order)','Arrhenius & activation energy','Collision theory','Catalysis'],
    traps:'Half-life formulae — 1st order is independent of [A₀]; 2nd order depends on [A₀].' },
  { id:'p-solid', subject:'chemistry', cls:12, branch:'physical', name:'Solid State', weight:'Medium',
    subs:['7 crystal systems','Unit cells (SC, BCC, FCC)','Packing efficiency & density','Point defects','Semiconductors'],
    traps:'Density formula d = (Z·M)/(a³·Nₐ) — Z changes per cell type (1,2,4).' },
  { id:'p-surface', subject:'chemistry', cls:12, branch:'physical', name:'Surface Chemistry', weight:'Low',
    subs:['Adsorption (physi vs chemi)','Colloids, emulsions','Catalysis (homo/heterogeneous)','Tyndall, Brownian motion'],
    traps:'Freundlich vs Langmuir isotherms — plotting and limiting behaviour.' },

  // --------- ORGANIC ---------
  { id:'o-goc', subject:'chemistry', cls:11, branch:'organic', name:'General Organic Chemistry (GOC)', weight:'Very High',
    subs:['IUPAC nomenclature','Inductive, resonance, hyperconjugation','Electrophiles & nucleophiles','Carbocations, carbanions, radicals','Acidity & basicity comparisons'],
    traps:'GOC is the foundation. If this is weak, ALL organic will feel random. Master stability orders cold.' },
  { id:'o-isomer', subject:'chemistry', cls:11, branch:'organic', name:'Isomerism', weight:'High',
    subs:['Structural','Geometrical (cis/trans, E/Z)','Optical (R/S, D/L)','Conformations (Newman, chair)','Stereoisomers vs enantiomers'],
    traps:'Meso compounds have chiral centres but no net optical rotation. E/Z uses CIP priority, not cis/trans.' },
  { id:'o-hydro', subject:'chemistry', cls:11, branch:'organic', name:'Hydrocarbons', weight:'Medium',
    subs:['Alkanes (substitution)','Alkenes (addition, Markovnikov, peroxide effect)','Alkynes','Aromatic (EAS, directing effects)'],
    traps:'Anti-Markovnikov (peroxide) only for HBr — not HCl or HI. Don\'t fall for this classic trap.' },
  { id:'o-halo', subject:'chemistry', cls:12, branch:'organic', name:'Haloalkanes & Haloarenes', weight:'High',
    subs:['SN1 vs SN2 vs E1 vs E2','Zaitsev vs Hofmann','NAS on haloarenes','Uses (DDT, BHC, Freons)'],
    traps:'SN1 favours polar protic; SN2 favours polar aprotic. Tertiary → SN1/E1. Primary + strong nucleophile → SN2.' },
  { id:'o-alc', subject:'chemistry', cls:12, branch:'organic', name:'Alcohols, Phenols & Ethers', weight:'High',
    subs:['Preparation & properties','Acidity of phenol vs alcohol','Kolbe\'s reaction','Reimer-Tiemann','Williamson ether synthesis'],
    traps:'Phenols acidic due to resonance-stabilised phenoxide. EWG at o/p increases acidity; EDG decreases.' },
  { id:'o-carbonyl', subject:'chemistry', cls:12, branch:'organic', name:'Aldehydes, Ketones & Carboxylic Acids', weight:'Very High',
    subs:['Nucleophilic addition','Aldol, Crossed aldol, Cannizzaro','HVZ, Clemmensen, Wolff-Kishner','Acid derivatives (acyl chlorides, esters, anhydrides, amides)','Named reactions (Perkin, Stephen, Rosenmund, Gattermann-Koch)'],
    traps:'Named reactions = easy marks if memorised with examples. Make a notebook just for these.' },
  { id:'o-amines', subject:'chemistry', cls:12, branch:'organic', name:'Amines & Diazonium', weight:'High',
    subs:['Basicity order (aliphatic vs aromatic)','Hofmann\'s bromamide','Gabriel synthesis','Carbylamine test','Diazonium salts (Sandmeyer, Gattermann)'],
    traps:'Basicity in water ≠ gas phase. 2° amines most basic in water due to solvation + inductive balance.' },
  { id:'o-bio', subject:'chemistry', cls:12, branch:'organic', name:'Biomolecules', weight:'Low',
    subs:['Carbohydrates (mono, di, poly)','Proteins, amino acids, peptide bond','Nucleic acids (DNA, RNA)','Enzymes, vitamins, hormones'],
    traps:'Easy scoring chapter. Focus on Haworth projections, Fischer projections, zwitterions.' },
  { id:'o-poly', subject:'chemistry', cls:12, branch:'organic', name:'Polymers', weight:'Low',
    subs:['Addition vs condensation','Natural & synthetic polymers','Biodegradable polymers','Nylon, Teflon, PHBV'],
    traps:'Know monomers of common polymers — that\'s all they ask. One-shot chapter.' },
  { id:'o-everyday', subject:'chemistry', cls:12, branch:'organic', name:'Chemistry in Everyday Life', weight:'Low',
    subs:['Drugs classification','Antibiotics, antiseptics, analgesics','Cleansing agents (soaps vs detergents)','Food additives'],
    traps:'Dropped from some syllabi — check your year. Pure memorisation.' },
  { id:'o-practical', subject:'chemistry', cls:12, branch:'organic', name:'Practical Organic / Identification', weight:'Medium',
    subs:['Tests for functional groups','Purification & separation','Estimation (N, halogen, S)','Lassaigne\'s test'],
    traps:'High-yield for JEE Main MCQs. Iodoform test, Tollen\'s vs Fehling\'s — know which gives which.' },

  // --------- INORGANIC ---------
  { id:'i-period', subject:'chemistry', cls:11, branch:'inorganic', name:'Classification & Periodicity', weight:'Medium',
    subs:['Modern periodic law','Trends (radii, IE, EA, EN)','Diagonal relationships','Anomalies (Li, Be)'],
    traps:'Ionisation energy is NOT strictly increasing across a period — exceptions at group 2→13 and 15→16.' },
  { id:'i-bond', subject:'chemistry', cls:11, branch:'inorganic', name:'Chemical Bonding & Molecular Structure', weight:'Very High',
    subs:['Ionic vs covalent','VSEPR & shapes','Hybridisation','Molecular Orbital Theory (up to Ne₂)','Hydrogen bonding'],
    traps:'Bond order from MOT → magnetic property. For O₂, B.O.=2 but it\'s paramagnetic (two unpaired).' },
  { id:'i-hydrogen', subject:'chemistry', cls:11, branch:'inorganic', name:'Hydrogen', weight:'Low',
    subs:['Isotopes of H','Preparation & uses','Water, H₂O₂','Hydrides (ionic, covalent, metallic)','Heavy water'],
    traps:'Short, easy. Don\'t skip — 1-2 direct questions every year.' },
  { id:'i-s', subject:'chemistry', cls:11, branch:'inorganic', name:'s-Block Elements', weight:'Medium',
    subs:['Group 1 & 2 properties','Anomalous Li, Be behaviour','Biological importance (Na, K, Mg, Ca)','Key compounds (NaOH, Na₂CO₃, CaO, plaster)'],
    traps:'Flame colours & compound facts — rote. Make a 1-page cheat sheet.' },
  { id:'i-p1', subject:'chemistry', cls:11, branch:'inorganic', name:'p-Block (Groups 13 & 14)', weight:'Medium',
    subs:['Boron family — diborane, borazine, BX₃','Carbon family — allotropes, silicates, silicones'],
    traps:'Structure of diborane (3c-2e bonds) and borazine. Silicates classification by sharing of O atoms.' },
  { id:'i-p2', subject:'chemistry', cls:12, branch:'inorganic', name:'p-Block (Groups 15, 16, 17, 18)', weight:'Very High',
    subs:['N₂, P and their oxoacids','O, S — allotropes, oxoacids','Halogens & interhalogens','Noble gases & their compounds'],
    traps:'Oxoacids of P, S, Cl — structures and oxidation states. Memorise with diagrams.' },
  { id:'i-dfblock', subject:'chemistry', cls:12, branch:'inorganic', name:'d- and f-Block Elements', weight:'High',
    subs:['Transition series properties','K₂Cr₂O₇, KMnO₄ preparation & reactions','Lanthanoid/Actinoid contraction','Colour & magnetic properties'],
    traps:'All complex reactions of K₂Cr₂O₇ and KMnO₄ in acidic/basic/neutral medium. Learn the products cold.' },
  { id:'i-coord', subject:'chemistry', cls:12, branch:'inorganic', name:'Coordination Compounds', weight:'Very High',
    subs:['Werner theory & IUPAC naming','Types of isomerism','VBT (inner vs outer orbital)','CFT & spectrochemical series','Colour, magnetism, stability'],
    traps:'Strong field vs weak field — CFSE calculation. Pairing energy decides whether HS or LS.' },
  { id:'i-met', subject:'chemistry', cls:12, branch:'inorganic', name:'Metallurgy (Isolation of Elements)', weight:'Medium',
    subs:['Concentration of ores','Reduction methods','Refining (electrolytic, zone)','Ellingham diagrams','Extraction of Al, Cu, Fe, Zn'],
    traps:'Ellingham — which metal can reduce which oxide. Reductant lies BELOW the metal oxide line.' },
  { id:'i-qual', subject:'chemistry', cls:12, branch:'inorganic', name:'Qualitative Analysis (Salt Analysis)', weight:'Medium',
    subs:['Cation groups I to VI','Anion tests (CO₃²⁻, SO₄²⁻, NO₃⁻, Cl⁻, Br⁻, I⁻)','Confirmatory reactions'],
    traps:'Group separation logic (Ksp based). Brown ring test for NO₃⁻.' },
  { id:'i-env', subject:'chemistry', cls:12, branch:'inorganic', name:'Environmental Chemistry', weight:'Low',
    subs:['Air, water, soil pollution','Green chemistry principles','BOD, COD, ozone depletion'],
    traps:'Usually dropped from JEE Adv; still asked in Main. Quick revision only.' },

  // ========================================================================
  //                                 PHYSICS
  // ========================================================================
  // --------- MECHANICS ---------
  { id:'ph-units', subject:'physics', cls:11, branch:'mechanics', name:'Units, Dimensions & Errors', weight:'Low',
    subs:['Fundamental & derived units','Dimensional analysis','Significant figures','Error propagation (sum/product/power)'],
    traps:'Dimensional analysis can\'t catch dimensionless constants. Error in product/quotient: relative errors add.' },
  { id:'ph-kinematics', subject:'physics', cls:11, branch:'mechanics', name:'Kinematics', weight:'Medium',
    subs:['1D motion equations','Graphs (x-t, v-t, a-t)','Projectile motion','Relative velocity','Circular kinematics'],
    traps:'Average velocity = displacement / time, NOT average of speeds. Range max at θ=45° only on flat ground.' },
  { id:'ph-laws', subject:'physics', cls:11, branch:'mechanics', name:'Laws of Motion & Friction', weight:'High',
    subs:['Newton\'s three laws','Free body diagrams','Pulley & inclined plane','Static vs kinetic friction','Pseudo forces (non-inertial frame)'],
    traps:'Sign of friction depends on direction of relative motion / tendency. Pseudo force opposite to frame\'s acceleration.' },
  { id:'ph-work', subject:'physics', cls:11, branch:'mechanics', name:'Work, Energy & Power', weight:'High',
    subs:['Work-energy theorem','Conservative forces & PE','Energy conservation','Power & efficiency','Spring potential energy'],
    traps:'Work done by friction is path-dependent. Spring PE = ½kx² uses extension/compression x, not length.' },
  { id:'ph-com', subject:'physics', cls:11, branch:'mechanics', name:'Centre of Mass & Collisions', weight:'Medium',
    subs:['COM coordinates','Momentum conservation','1D & 2D collisions','Elastic vs inelastic','Coefficient of restitution e'],
    traps:'In elastic 1D collision with equal masses, velocities exchange. In perfectly inelastic, KE is lost (not zero).' },
  { id:'ph-rotation', subject:'physics', cls:11, branch:'mechanics', name:'Rotational Motion', weight:'Very High',
    subs:['Moment of inertia (parallel & perpendicular axes)','Torque & angular momentum','Rolling without slipping','Conservation of L'],
    traps:'Rolling friction can be static (no slipping). KE of rolling = ½Mv² + ½Iω², not just translational.' },
  { id:'ph-grav', subject:'physics', cls:11, branch:'mechanics', name:'Gravitation', weight:'Medium',
    subs:['Newton\'s law','Gravitational field & potential','Kepler\'s laws','Orbital & escape velocity','Satellites'],
    traps:'g\' = g(1 − 2h/R) for h<<R; g\' = g(1 − d/R) inside earth at depth d.' },
  { id:'ph-fluids', subject:'physics', cls:11, branch:'mechanics', name:'Mechanical Properties (Elasticity & Fluids)', weight:'Medium',
    subs:['Stress, strain, Young\'s modulus','Pressure, Pascal\'s & Archimedes\'','Surface tension & capillarity','Bernoulli\'s equation','Viscosity & Stokes\' law'],
    traps:'Bernoulli assumes incompressible, non-viscous, streamline flow. Don\'t apply to turbulent flow.' },

  // --------- THERMAL & WAVES ---------
  { id:'ph-thermal', subject:'physics', cls:11, branch:'thermal', name:'Thermal Properties & Calorimetry', weight:'Medium',
    subs:['Heat, temperature, specific heat','Latent heat & phase change','Conduction, convection, radiation','Stefan-Boltzmann & Wien\'s law','Newton\'s law of cooling'],
    traps:'Specific heat at constant pressure ≠ at constant volume. Cp − Cv = R (per mole) for ideal gas.' },
  { id:'ph-thermo', subject:'physics', cls:11, branch:'thermal', name:'Thermodynamics (Physics)', weight:'High',
    subs:['Zeroth, first, second laws','Isothermal, adiabatic, isobaric, isochoric','Heat engines & efficiency','Carnot cycle','Refrigerators & COP'],
    traps:'Adiabatic: Q=0, work = −ΔU. PV^γ = const. Carnot efficiency = 1 − T_cold/T_hot (Kelvin only).' },
  { id:'ph-kinetic', subject:'physics', cls:11, branch:'thermal', name:'Kinetic Theory of Gases', weight:'Low',
    subs:['Pressure of gas (microscopic)','rms, average, most probable speeds','Equipartition of energy','Mean free path','Degrees of freedom'],
    traps:'For diatomic, f=5 at moderate T (rotational included), f=7 at high T (vibrational). Cv = (f/2)R.' },
  { id:'ph-shm', subject:'physics', cls:11, branch:'waves', name:'Oscillations (SHM)', weight:'High',
    subs:['Simple harmonic motion','Energy in SHM','Pendulums (simple, physical)','Damped & forced oscillations','Resonance'],
    traps:'Time period of physical pendulum: T=2π√(I/mgd). Don\'t confuse d (distance to pivot) with length.' },
  { id:'ph-waves', subject:'physics', cls:11, branch:'waves', name:'Waves & Sound', weight:'High',
    subs:['Transverse vs longitudinal','Speed of waves on string & in air','Superposition, beats, interference','Stationary waves & resonance','Doppler effect'],
    traps:'Doppler: when source moves towards observer, frequency increases. Sign convention: take observer-to-source direction as +ve.' },

  // --------- ELECTROMAGNETISM ---------
  { id:'ph-electrostat', subject:'physics', cls:12, branch:'em', name:'Electrostatics', weight:'Very High',
    subs:['Coulomb\'s law & superposition','Electric field & potential','Gauss\'s law applications','Capacitors (parallel plate, with dielectric)','Energy stored'],
    traps:'For point charge, V is scalar; E is vector. Equipotential surfaces are perpendicular to field lines.' },
  { id:'ph-current', subject:'physics', cls:12, branch:'em', name:'Current Electricity', weight:'High',
    subs:['Ohm\'s law & resistivity','Kirchhoff\'s laws','Wheatstone bridge & meter bridge','Potentiometer','EMF, internal resistance, power'],
    traps:'Internal resistance r reduces terminal voltage. V = ε − Ir for discharging; V = ε + Ir for charging.' },
  { id:'ph-magnet', subject:'physics', cls:12, branch:'em', name:'Magnetic Effects of Current & Magnetism', weight:'High',
    subs:['Biot-Savart & Ampère\'s law','Force on current & moving charge','Magnetic moment & torque','Galvanometer & shunt','Earth\'s magnetism (basic)'],
    traps:'Force on parallel currents: same direction → attract; opposite → repel. F = BIL applies to component of L perpendicular to B.' },
  { id:'ph-emi', subject:'physics', cls:12, branch:'em', name:'EMI & AC', weight:'Very High',
    subs:['Faraday & Lenz\'s laws','Self & mutual inductance','LR, LC, LCR circuits','RMS values & phasors','Resonance & power factor'],
    traps:'Resonance: ω = 1/√(LC). At resonance impedance Z = R, current is in phase with voltage.' },
  { id:'ph-em-waves', subject:'physics', cls:12, branch:'em', name:'Electromagnetic Waves', weight:'Low',
    subs:['Displacement current','EM wave equation','Speed of light c=1/√(μ₀ε₀)','EM spectrum','Energy density'],
    traps:'E and B oscillate perpendicular to each other and to direction of propagation. E/B = c.' },

  // --------- OPTICS & MODERN ---------
  { id:'ph-rayoptics', subject:'physics', cls:12, branch:'optics', name:'Ray Optics', weight:'High',
    subs:['Reflection & refraction','Lens & mirror formulae','Total internal reflection','Optical instruments (microscope, telescope)','Prism & dispersion'],
    traps:'Sign convention (NCERT): distances measured from pole, +ve along incident ray direction. Get this wrong, lose all marks.' },
  { id:'ph-waveoptics', subject:'physics', cls:12, branch:'optics', name:'Wave Optics', weight:'Medium',
    subs:['Huygens\' principle','Young\'s double slit experiment','Diffraction (single slit)','Polarisation','Resolving power'],
    traps:'YDSE fringe width β = λD/d. Bright fringe at path difference = nλ; dark at (n+½)λ.' },
  { id:'ph-modern', subject:'physics', cls:12, branch:'modern', name:'Modern Physics (Atoms & Nuclei)', weight:'Very High',
    subs:['Photoelectric effect & Einstein\'s eqn','Bohr atom & spectra','Matter waves (de Broglie)','Nuclear structure & binding energy','Radioactivity (decay laws)'],
    traps:'Photoelectric: KE_max = hν − φ. Below threshold, no emission regardless of intensity. Half-life t₁/₂ = ln2/λ.' },
  { id:'ph-semi', subject:'physics', cls:12, branch:'modern', name:'Semiconductors & Devices', weight:'Medium',
    subs:['Energy bands','p-n junction & diode','Forward/reverse bias','Rectifiers (HW, FW)','Transistor & logic gates'],
    traps:'In reverse bias, depletion layer widens. In forward bias, current flows once V > 0.7 V (Si) or 0.3 V (Ge).' },

  // ========================================================================
  //                              MATHEMATICS
  // ========================================================================
  // --------- ALGEBRA ---------
  { id:'mt-sets', subject:'maths', cls:11, branch:'algebra', name:'Sets, Relations & Functions', weight:'Medium',
    subs:['Sets & operations','Relations (reflexive, symmetric, transitive)','Functions (one-one, onto)','Composite & inverse functions','Domain & range'],
    traps:'For inverse function to exist, function must be bijective. Always check domain of composite (g∘f).' },
  { id:'mt-trig', subject:'maths', cls:11, branch:'algebra', name:'Trigonometry & Identities', weight:'Medium',
    subs:['Trig ratios & identities','Compound, multiple & sub-multiple angles','Inverse trig functions','Solution of trig equations','Properties of triangles (sine, cosine rule)'],
    traps:'sin⁻¹(sin x) = x only for x ∈ [−π/2, π/2]. Outside, fold back into principal range.' },
  { id:'mt-comp', subject:'maths', cls:11, branch:'algebra', name:'Complex Numbers & Quadratic Equations', weight:'High',
    subs:['Argand plane, modulus, argument','De Moivre\'s theorem','Cube roots of unity','Quadratic equation, nature of roots','Common roots & symmetric functions'],
    traps:'arg(z₁z₂) = arg(z₁) + arg(z₂) only modulo 2π. Sum of roots = −b/a, product = c/a (sign flip!).' },
  { id:'mt-seq', subject:'maths', cls:11, branch:'algebra', name:'Sequences & Series', weight:'Medium',
    subs:['AP, GP, HP & their means','AM ≥ GM ≥ HM inequality','Arithmetico-geometric series','Sum of squares & cubes','Telescoping & V_n method'],
    traps:'In GP, common ratio r can be negative. Σn² = n(n+1)(2n+1)/6. Don\'t mix up Σn vs Σn².' },
  { id:'mt-perm', subject:'maths', cls:11, branch:'algebra', name:'Permutations & Combinations', weight:'Medium',
    subs:['Fundamental principles of counting','Permutations (with/without repetition, restricted)','Combinations (selection)','Circular permutations','Partition & arrangement'],
    traps:'Selection vs arrangement. Identical objects → divide by their factorial. Read "at least" / "at most" carefully.' },
  { id:'mt-binomial', subject:'maths', cls:11, branch:'algebra', name:'Binomial Theorem', weight:'Low',
    subs:['Binomial expansion (positive integer n)','General term & middle term','Binomial coefficients & properties','Binomial for any index'],
    traps:'Greatest term: depends on x. ⁿCᵣ = ⁿCₙ₋ᵣ. For (1+x)ⁿ, sum of coefficients = 2ⁿ.' },
  { id:'mt-matrix', subject:'maths', cls:12, branch:'algebra', name:'Matrices & Determinants', weight:'High',
    subs:['Matrix algebra & types','Transpose, symmetric, skew-symmetric','Determinant properties','Inverse via adjoint','System of linear equations (Cramer\'s rule)'],
    traps:'(AB)⁻¹ = B⁻¹A⁻¹ (order flips). |A^T| = |A|. If |A|=0, no inverse — system may be inconsistent or have infinite solutions.' },
  { id:'mt-prob', subject:'maths', cls:12, branch:'algebra', name:'Probability & Statistics', weight:'High',
    subs:['Conditional probability','Bayes\' theorem','Independent events','Binomial distribution','Mean & variance of probability distribution'],
    traps:'P(A∩B) = P(A)P(B) only if independent. Bayes: P(A|B) = P(B|A)P(A)/P(B). Don\'t skip prior probability.' },

  // --------- CALCULUS ---------
  { id:'mt-limits', subject:'maths', cls:11, branch:'calculus', name:'Limits, Continuity & Differentiability', weight:'High',
    subs:['Standard limits (sin x/x, (1+x)^(1/x))','L\'Hôpital\'s rule','Continuity at a point','Differentiability vs continuity','LHL = RHL = f(a)'],
    traps:'Differentiable ⇒ continuous, but NOT vice versa (e.g. |x| at 0). lim(sin x / x) = 1 only as x→0.' },
  { id:'mt-deriv', subject:'maths', cls:12, branch:'calculus', name:'Differentiation & Applications', weight:'Very High',
    subs:['Chain, product, quotient rules','Implicit & parametric differentiation','Tangents & normals','Maxima & minima (1st, 2nd derivative test)','Monotonicity, Rolle\'s, Mean Value theorems'],
    traps:'For MVT, function must be continuous on [a,b] AND differentiable on (a,b). At endpoint maxima, derivative may not be zero.' },
  { id:'mt-integ', subject:'maths', cls:12, branch:'calculus', name:'Integration & Applications', weight:'Very High',
    subs:['Standard integrals','Integration by parts (LIATE)','Partial fractions','Definite integral properties','Area under curves & between curves'],
    traps:'∫₀^a f(x)dx = ∫₀^a f(a−x)dx (a classic). Watch for absolute value when computing area below x-axis.' },
  { id:'mt-de', subject:'maths', cls:12, branch:'calculus', name:'Differential Equations', weight:'Medium',
    subs:['Order & degree','Variable separable','Linear (1st order)','Homogeneous','Applications (growth, decay)'],
    traps:'Linear DE: dy/dx + Py = Q ⇒ I.F. = e^∫P dx. Don\'t apply to non-linear without transformation.' },

  // --------- GEOMETRY ---------
  { id:'mt-line2d', subject:'maths', cls:11, branch:'geometry', name:'Coordinate Geometry — Lines & Circles', weight:'High',
    subs:['Distance & section formula','Slope, line equations (slope-intercept, two-point, normal)','Angle between lines','Circle equations & tangents','Family of circles'],
    traps:'For perpendicular lines, m₁m₂ = −1. Power of a point w.r.t. circle: positive outside, negative inside.' },
  { id:'mt-conics', subject:'maths', cls:11, branch:'geometry', name:'Conic Sections', weight:'High',
    subs:['Parabola: focus, directrix, latus rectum','Ellipse: a, b, eccentricity','Hyperbola: asymptotes','Tangent & normal to conics','Director circle, auxiliary circle'],
    traps:'Eccentricity: parabola e=1, ellipse 0<e<1, hyperbola e>1. For ellipse: b²=a²(1−e²); hyperbola: b²=a²(e²−1).' },
  { id:'mt-3dvec', subject:'maths', cls:12, branch:'geometry', name:'Vectors & 3D Geometry', weight:'Very High',
    subs:['Dot & cross products','Scalar & vector triple products','Equation of line in 3D','Equation of plane (vector & cartesian)','Distance from point to line/plane'],
    traps:'Dot product: scalar; cross product: vector. (a×b)×c ≠ a×(b×c) in general — use BAC-CAB rule carefully.' }
];

// Per-subject branch metadata (used for grouping & colour cues in views).
export const BRANCHES_BY_SUBJECT = {
  chemistry: [
    { id: 'physical',  name: 'Physical',  color: 'brand'   },
    { id: 'organic',   name: 'Organic',   color: 'emerald' },
    { id: 'inorganic', name: 'Inorganic', color: 'sky'     }
  ],
  physics: [
    { id: 'mechanics', name: 'Mechanics', color: 'brand'   },
    { id: 'thermal',   name: 'Heat & Thermo', color: 'rose'},
    { id: 'waves',     name: 'Waves & SHM', color: 'amber' },
    { id: 'em',        name: 'Electromagnetism', color: 'emerald' },
    { id: 'optics',    name: 'Optics',    color: 'sky'     },
    { id: 'modern',    name: 'Modern Physics', color: 'violet' }
  ],
  maths: [
    { id: 'algebra',   name: 'Algebra',   color: 'brand'   },
    { id: 'calculus',  name: 'Calculus',  color: 'emerald' },
    { id: 'geometry',  name: 'Geometry',  color: 'sky'     }
  ]
};

// Legacy export for any code that still imports BRANCHES (defaults to chemistry).
export const BRANCHES = BRANCHES_BY_SUBJECT.chemistry;

export const SUBJECTS = [
  { id: 'chemistry', name: 'Chemistry', short: 'Chem' },
  { id: 'physics',   name: 'Physics',   short: 'Phys' },
  { id: 'maths',     name: 'Maths',     short: 'Math' }
];

export const subjectName = (s) => (SUBJECTS.find(x => x.id === s) || SUBJECTS[0]).name;
export const branchesFor = (s) => BRANCHES_BY_SUBJECT[s] || BRANCHES_BY_SUBJECT.chemistry;
export const topicsFor = (s) => SYLLABUS.filter(t => t.subject === s);

export const WEIGHT_RANK = { 'Very High': 4, 'High': 3, 'Medium': 2, 'Low': 1 };

export const topicById = id => SYLLABUS.find(t => t.id === id);
