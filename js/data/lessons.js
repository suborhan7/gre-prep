/* Original course lessons for GRE Prep Hub. Each lesson: id, track, week, mins, title, sum, body (HTML), rules, traps, examples. */
window.GRE_LESSONS = [
{
id:"s1", track:"Strategy", week:1, mins:20, title:"How the GRE works",
sum:"Format, scoring and the section-adaptive design, and what they mean for how you take the test.",
body:`<p>The current GRE General Test takes about <b>1 hour 58 minutes</b> with no scheduled break. It always opens with the essay, then Verbal and Quant sections follow in either order.</p>
<table><thead><tr><th>Part</th><th>Section 1</th><th>Section 2</th><th>Score</th></tr></thead><tbody>
<tr><td>Analytical Writing</td><td colspan="2">1 Issue essay, 30 min</td><td>0–6, half points</td></tr>
<tr><td>Verbal Reasoning</td><td>12 q · 18 min</td><td>15 q · 23 min</td><td>130–170</td></tr>
<tr><td>Quantitative Reasoning</td><td>12 q · 21 min</td><td>15 q · 26 min</td><td>130–170</td></tr></tbody></table>
<h4>Section-adaptive</h4>
<p>Your performance on the first Verbal section decides whether the second Verbal section is easier or harder, and the same for Quant. A harder second section lets you reach a higher score. So the first section of each measure matters a lot: work carefully there instead of rushing.</p>
<h4>Inside a section</h4>
<p>You can skip, mark and come back to any question inside the same section. There is no penalty for a wrong answer, so never leave anything blank. Quant has a basic on-screen calculator; use it for ugly arithmetic, not for things you can see by logic.</p>`,
rules:["Never leave a question blank: wrong answers cost nothing.","Mark hard questions and come back. One question never deserves 4 minutes.","Average pace: about 1.5 min per Verbal question and 1.7 min per Quant question.","Use the first section of each measure to earn the harder second section."],
traps:["Rushing section 1 to 'save time' for section 2. Time does not carry over.","Using the calculator for everything. It is slow and invites typing errors."],
examples:[{q:"You have 3 minutes left in a 15-question Quant section and 4 questions untouched. What should you do?",a:"Spend 10 seconds entering a guess on all four first, then use the remaining time to actually work the easiest-looking one. Blank answers are always wrong; guesses are sometimes right."}]
},
{
id:"v1", track:"Verbal", week:1, mins:15, title:"Building GRE vocabulary",
sum:"A system for learning about 600 words so they stick on test day.",
body:`<p>Text Completion and Sentence Equivalence are about half of Verbal, and they are mostly vocabulary tests. You do not need thousands of words. For a Verbal score around 155–160, about 600 high-frequency words that you recognize instantly, plus daily reading, is a strong target.</p>
<h4>The method that works</h4>
<ol><li><b>Learn in groups</b> of 25 words. The Vocab tab has 600 words in 24 groups: 1–12 are the core set (Weeks 1–6), 13–24 the advanced set (Weeks 7–10).</li>
<li><b>Spaced review.</b> A word you know comes back after a few days, then after a week, then after two. Words you miss come back tomorrow. The app does this scheduling for you.</li>
<li><b>Learn the meaning, then the feel.</b> GRE answers often hinge on whether a word is positive or negative, strong or mild.</li>
<li><b>Cluster synonyms.</b> SE answers come in pairs, so knowing that <i>laconic, terse</i> and <i>succinct</i> live together is directly useful.</li>
<li><b>Read one hard article a day.</b> Words you meet in context stick far better than words on a card.</li></ol>
<h4>Useful roots</h4>
<table><tbody><tr><td>bene / mal</td><td>good / bad: benevolent, malicious</td></tr><tr><td>loqu / locu</td><td>speak: loquacious, eloquent</td></tr><tr><td>vor</td><td>eat: voracious</td></tr><tr><td>cred</td><td>believe: credulous, incredulous</td></tr><tr><td>-phile / -phobe</td><td>lover / hater: bibliophile</td></tr><tr><td>pro / ante</td><td>forward, before: prolific, antecedent</td></tr></tbody></table>`,
rules:["About 25 new words a day in Weeks 1–6, about 11 a day in Weeks 7–10, then review only.","Always say the meaning out loud before flipping the card.","Mark a word 'known' only if you would bet on it."],
traps:["Learning definitions without tone: 'frugal' is positive, 'parsimonious' is negative.","Huge random word lists (1000+ words). High-frequency first."],
examples:[{q:"Group these words: terse, garrulous, laconic, verbose, succinct, prolix.",a:"Few words: terse, laconic, succinct. Too many words: garrulous, verbose, prolix. SE pairs are often drawn from exactly this kind of cluster."}]
},
{
id:"q9", track:"Quant", week:2, mins:25, title:"Quantitative Comparison strategy",
sum:"The four answer choices, simplifying both sides, and the number-testing routine that catches answer D.",
body:`<p>About a third of Quant is Quantitative Comparison (QC). You compare Quantity A with Quantity B and choose: <b>A</b> is greater, <b>B</b> is greater, the two are <b>equal</b>, or the relationship <b>cannot be determined</b> (D).</p>
<h4>Compare, don't calculate</h4>
<p>You never need the exact values, only which side is bigger. Treat the two quantities like a balance: you may add or subtract the same thing from both sides, and multiply or divide both sides by the same <b>positive</b> number.</p>
<h4>Test numbers with ZONEF</h4>
<p>When a variable appears, try values from each family: <b>Z</b>ero, <b>O</b>ne, <b>N</b>egatives, <b>E</b>xtremes (very large or very small), <b>F</b>ractions between 0 and 1. If two allowed values give different winners, the answer is D and you can stop.</p>
<h4>When D is impossible</h4>
<p>If both quantities are fixed numbers (no unknowns), the answer can never be D.</p>`,
rules:["Same operation on both sides keeps the comparison.","Multiply or divide by a variable only if you know it is positive.","Two different outcomes from allowed values means D.","No variables at all means D is impossible."],
traps:["Testing only positive integers like 2 and 3. Fractions and negatives break most 'obvious' answers.","Forgetting the given constraint (for example x > 0) when picking test numbers.","Assuming a figure is drawn to scale."],
examples:[{q:"Given x ≠ 0. Quantity A: x². Quantity B: x³.",a:"x = 2: A = 4, B = 8, so B wins. x = −1: A = 1, B = −1, so A wins. Different winners, answer D."},{q:"Quantity A: 51 × 49. Quantity B: 50².",a:"51 × 49 = (50 + 1)(50 − 1) = 50² − 1. A is 1 less than B, so B is greater. No calculator needed."}]
},
{
id:"q1", track:"Quant", week:2, mins:35, title:"Number properties",
sum:"Integers, divisibility, primes, factors, remainders, odd/even and units digits.",
body:`<h4>Basics the GRE assumes</h4>
<ul><li>0 is even, and is neither positive nor negative.</li><li>1 is not prime. 2 is the only even prime.</li><li>Primes under 30: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29.</li></ul>
<h4>Divisibility rules</h4>
<table><tbody><tr><td>3</td><td>digit sum divisible by 3</td></tr><tr><td>4</td><td>last two digits divisible by 4</td></tr><tr><td>6</td><td>divisible by 2 and 3</td></tr><tr><td>8</td><td>last three digits divisible by 8</td></tr><tr><td>9</td><td>digit sum divisible by 9</td></tr></tbody></table>
<h4>Counting factors</h4>
<p>Write the prime factorization, add 1 to each exponent and multiply. 72 = 2³ × 3², so it has (3+1)(2+1) = <b>12</b> factors.</p>
<h4>GCD and LCM</h4>
<p>GCD takes the lowest power of each shared prime; LCM takes the highest power of every prime. For two positive integers, GCD × LCM = the product of the numbers.</p>
<h4>Remainders</h4>
<p>"n divided by d leaves remainder r" means n = qd + r with 0 ≤ r &lt; d. List a few values: numbers that leave remainder 2 when divided by 5 are 2, 7, 12, 17…</p>
<h4>Odd and even</h4>
<p>Even ± even = even, odd ± odd = even, odd ± even = odd. A product is odd only if every factor is odd.</p>
<h4>Units digits</h4>
<p>Powers repeat their units digit in cycles of at most 4. Powers of 7 end in 7, 9, 3, 1, 7, 9… so 7<sup>23</sup> ends in the 3rd entry (23 = 4×5 + 3), which is 3.</p>`,
rules:["Prime factorize first: it unlocks factors, GCD, LCM and divisibility.","Number of factors = product of (exponent + 1).","For remainder problems, list the first few numbers that fit.","Units-digit cycles: find the cycle, then use the exponent's remainder mod the cycle length."],
traps:["Forgetting that 1 and the number itself are factors.","Treating 'integer' as 'positive integer'. Integers include negatives and 0.","Saying a remainder can equal the divisor."],
examples:[{q:"How many positive factors does 180 have?",a:"180 = 2² × 3² × 5. Factors = (2+1)(2+1)(1+1) = 18."},{q:"When n is divided by 6 the remainder is 4. What is the remainder when 2n is divided by 6?",a:"Try n = 4: 2n = 8, remainder 2. Check n = 10: 2n = 20, remainder 2. Answer 2."}]
},
{
id:"q2", track:"Quant", week:2, mins:30, title:"Fractions, percents and ratios",
sum:"Percent change, successive percents, ratio parts and simple and compound interest.",
body:`<h4>Percent change</h4>
<p>Percent change = (new − old) ÷ old × 100. The base is always the <b>original</b> value.</p>
<h4>Successive percents multiply</h4>
<p>Up 20% then down 20% is ×1.2 × 0.8 = ×0.96, a <b>4% decrease</b>, not zero change.</p>
<h4>"Of" and "is"</h4>
<p>"x is 30% of y" becomes x = 0.3y. "What percent of 80 is 20?" becomes p/100 × 80 = 20, so p = 25.</p>
<h4>Ratios</h4>
<p>If boys : girls = 3 : 5, then boys are 3/8 of the class and girls 5/8. The total must be a multiple of 8.</p>
<h4>Interest</h4>
<p>Simple: I = P × r × t. Compound: A = P(1 + r/n)<sup>nt</sup>, where n is how many times a year interest is added.</p>
<h4>Fraction comparisons</h4>
<p>To compare a/b and c/d (all positive), cross-multiply: compare ad with bc.</p>`,
rules:["Percent change always divides by the original value.","Chain percent changes by multiplying the factors.","A ratio a:b means parts a/(a+b) and b/(a+b) of the whole."],
traps:["Adding successive percents (+20% −20% ≠ 0%).","Using the new value as the base for percent change.","Treating a ratio as actual counts."],
examples:[{q:"A price rises 25%, then falls 20%. Net change?",a:"1.25 × 0.8 = 1.00, so the price is back where it started: 0% net change."},{q:"Red : blue marbles = 2 : 7 and there are 45 marbles. How many are red?",a:"Red is 2/9 of the total: 2/9 × 45 = 10."}]
},
{
id:"v2", track:"Verbal", week:2, mins:30, title:"Text Completion",
sum:"Predict the word before reading choices; use clue words and signal words; handle 2- and 3-blank questions.",
body:`<p>A Text Completion (TC) has 1 to 3 blanks. One-blank questions have 5 choices; multi-blank questions have 3 choices per blank. There is no partial credit: every blank must be right.</p>
<h4>The four-step method</h4>
<ol><li><b>Cover the choices.</b> Read the whole sentence first.</li>
<li><b>Find the clue:</b> the part of the sentence that tells you what the blank means.</li>
<li><b>Find the signal word:</b> does the sentence continue the clue or reverse it?</li>
<li><b>Predict a simple word</b> of your own, then pick the choice closest to it.</li></ol>
<table><tbody><tr><td>Reversal</td><td>although, but, yet, however, despite, while, rather than, far from</td></tr>
<tr><td>Continuation</td><td>and, because, so, thus, indeed, in fact, a colon or semicolon</td></tr></tbody></table>
<h4>Multiple blanks</h4>
<p>Start with the blank that has the most clues, which is often not the first one. Once you fill it, it becomes a clue for the others. Finally reread the full sentence with all your choices in place.</p>`,
rules:["Predict your own word before looking at choices.","Every answer must be justified by a clue in the sentence.","For 2–3 blanks, start with the easiest blank, not blank (i).","Reread the complete sentence before confirming."],
traps:["Choosing a word because it 'sounds GRE'. Fancy words are often wrong.","Picking a word that fits the blank's grammar but ignores the reversal signal.","Missing double negatives such as 'far from un-…'."],
examples:[{q:"Despite the director's reputation for ______, the film's plot was strikingly simple.",a:"'Despite' reverses 'simple', so predict 'complexity'. Choose a word like 'intricacy' or 'convolution'."}]
},
{
id:"w1", track:"Writing", week:2, mins:35, title:"The Issue essay",
sum:"A reliable structure, how scoring works, a 30-minute plan and building a bank of reusable examples.",
body:`<p>You get one prompt stating a claim and a specific instruction (for example: discuss how far you agree, and consider where the claim might not hold). You have 30 minutes. Essays are scored from 0 to 6 in half-point steps.</p>
<h4>What raises the score</h4>
<ul><li>A clear position in the first paragraph.</li><li>Reasons backed by <b>specific</b> examples, not general statements.</li><li>Directly answering the specific instruction in the prompt.</li><li>Recognizing where the claim fails or has limits.</li><li>Clean, varied sentences. Small typos matter less than clear thinking.</li></ul>
<h4>A dependable structure</h4>
<ol><li><b>Intro</b> (3–4 sentences): restate the issue, give your nuanced position.</li>
<li><b>Body 1</b>: strongest reason + one detailed example.</li>
<li><b>Body 2</b>: second reason + a different kind of example.</li>
<li><b>Counterpoint</b>: when the claim does not hold, and why your position survives it.</li>
<li><b>Conclusion</b> (2–3 sentences).</li></ol>
<h4>Timing</h4>
<p>5 min planning, 22 min writing, 3 min proofreading. Aim for about 450–600 words.</p>
<h4>Build an example bank now</h4>
<p>Prepare 8–10 examples you know well and can adapt: one each from science, technology, history, economics, education, politics, art and your own field. For instance, the printing press for spread of knowledge, open-source software for collaboration, microcredit for economic policy, or your own work on AI in radiology for technology and ethics.</p>`,
rules:["State a nuanced position early and keep it.","Follow the prompt's specific instruction exactly.","One reason per paragraph, each with a concrete example.","Always include a counterpoint paragraph."],
traps:["Writing a balanced essay with no position.","Generic examples like 'many people believe…'.","Ignoring the specific instruction."],
examples:[{q:"Prompt: 'Governments should fund only research with clear practical applications.'",a:"Position: mostly disagree. Body 1: basic research led to unexpected applications (number theory → modern cryptography). Body 2: practical needs are unpredictable. Counterpoint: limited budgets in poorer countries may justify prioritizing applied work, but a minimum share for basic research still pays off."}]
},
{
id:"q3", track:"Quant", week:3, mins:30, title:"Exponents and roots",
sum:"Exponent rules, negative and fractional exponents, and how numbers between 0 and 1 behave.",
body:`<table><tbody><tr><td>a<sup>m</sup> × a<sup>n</sup></td><td>a<sup>m+n</sup></td></tr><tr><td>a<sup>m</sup> ÷ a<sup>n</sup></td><td>a<sup>m−n</sup></td></tr><tr><td>(a<sup>m</sup>)<sup>n</sup></td><td>a<sup>mn</sup></td></tr><tr><td>a<sup>0</sup></td><td>1 (a ≠ 0)</td></tr><tr><td>a<sup>−n</sup></td><td>1 / a<sup>n</sup></td></tr><tr><td>a<sup>1/n</sup></td><td>the nth root of a</td></tr></tbody></table>
<h4>Same base first</h4>
<p>To compare or solve, rewrite with a common base: 8<sup>x</sup> = 2<sup>3x</sup>, 27 = 3<sup>3</sup>. If 2<sup>3x</sup> = 2<sup>12</sup>, then x = 4.</p>
<h4>Numbers between 0 and 1</h4>
<p>For 0 &lt; x &lt; 1, higher powers get <b>smaller</b> (x³ &lt; x² &lt; x) and roots get <b>bigger</b> (√x &gt; x).</p>
<h4>Negative bases</h4>
<p>A negative number to an even power is positive, to an odd power is negative.</p>
<h4>Roots</h4>
<p>√(ab) = √a × √b, so √72 = √36 × √2 = 6√2. But √(a + b) is <b>not</b> √a + √b. And √(x²) = |x|.</p>
<h4>Factor out common powers</h4>
<p>2<sup>10</sup> + 2<sup>10</sup> = 2 × 2<sup>10</sup> = 2<sup>11</sup>. And 3<sup>8</sup> − 3<sup>6</sup> = 3<sup>6</sup>(9 − 1) = 8 × 3<sup>6</sup>.</p>`,
rules:["Rewrite with a common base before comparing.","Factor out the smallest power when adding or subtracting powers.","0 < x < 1: powers shrink, roots grow."],
traps:["Adding exponents when bases are added (2³ + 2³ ≠ 2⁶).","√(a + b) = √a + √b. It doesn't.","Forgetting that x² = 16 has two solutions."],
examples:[{q:"If 4^(x+1) = 8^x, find x.",a:"4^(x+1) = 2^(2x+2) and 8^x = 2^(3x). So 2x + 2 = 3x, x = 2."},{q:"Simplify (5¹² − 5¹⁰) / 5¹⁰.",a:"5¹⁰(25 − 1) / 5¹⁰ = 24."}]
},
{
id:"q4", track:"Quant", week:3, mins:40, title:"Algebra",
sum:"Linear equations and systems, quadratics, special products, inequalities, absolute value and functions.",
body:`<h4>Systems of equations</h4>
<p>Use substitution or elimination. Before solving fully, check what is asked: if the question wants x + y, adding or subtracting the equations often gives it directly.</p>
<h4>Special products (memorize)</h4>
<ul><li>(a + b)² = a² + 2ab + b²</li><li>(a − b)² = a² − 2ab + b²</li><li>(a + b)(a − b) = a² − b²</li></ul>
<h4>Quadratics</h4>
<p>Move everything to one side, factor, set each factor to zero. x² − 5x + 6 = 0 → (x − 2)(x − 3) = 0 → x = 2 or 3. Never divide both sides by x unless you know x ≠ 0: x² = 3x has solutions 0 and 3.</p>
<h4>Inequalities</h4>
<p>Solve like equations, but <b>flip the sign</b> when you multiply or divide by a negative number.</p>
<h4>Absolute value</h4>
<p>|x − a| is the distance from x to a. |x − 3| &lt; 5 means −2 &lt; x &lt; 8. |x − 3| = 5 means x = 8 or x = −2.</p>
<h4>Functions and symbols</h4>
<p>f(x) = x² − 1 means "square it, subtract 1". If a ◆ b = 2a − b, then 3 ◆ 4 = 6 − 4 = 2. Just follow the definition.</p>`,
rules:["Look for the quantity asked (like x + y) before solving each variable.","Factor; never divide by a variable that could be zero.","Flip inequality signs when multiplying or dividing by a negative.","|x − a| < b means a − b < x < a + b."],
traps:["Dropping the zero solution of x² = kx.","Forgetting to flip the inequality.","Assuming variables are integers when the question doesn't say so."],
examples:[{q:"If x + 2y = 11 and 2x + y = 13, what is x + y?",a:"Add the equations: 3x + 3y = 24, so x + y = 8."},{q:"If x² − y² = 24 and x − y = 4, what is x + y?",a:"x² − y² = (x + y)(x − y), so 24 = 4(x + y), x + y = 6."}]
},
{
id:"v3", track:"Verbal", week:3, mins:25, title:"Sentence Equivalence",
sum:"Choose the two answers that complete the sentence and give it the same meaning.",
body:`<p>Sentence Equivalence (SE) has one blank and six choices. You must pick <b>exactly two</b> that each produce a sentence with the same meaning. No partial credit.</p>
<h4>Method</h4>
<ol><li>Read the sentence, find the clue and signal words (same as TC).</li>
<li>Predict your own word.</li>
<li>Scan for choices matching your prediction. Usually there are two clear synonyms.</li>
<li>Check that each choice, on its own, makes the sentence say the same thing.</li></ol>
<h4>The synonym trap</h4>
<p>Test makers often include <b>two</b> synonym pairs: one that fits and one that doesn't. Finding a pair is not enough; the pair must match your prediction.</p>
<h4>When you are unsure</h4>
<p>If you know only one right answer, look for its closest synonym among the choices. Eliminate words that have no partner, since the right answers always share a meaning.</p>`,
rules:["Predict first, then match.","Both answers must fit the sentence and give the same meaning.","Words with no synonym among the choices are almost never correct."],
traps:["Picking a synonym pair that contradicts the clue.","Picking two words that fit but give different meanings (for example 'praised' and 'criticized' both fit 'The critic ___ the film')."],
examples:[{q:"Though usually ______, the professor spoke at length about her research. Choices: reticent, verbose, taciturn, eloquent, garrulous, candid.",a:"'Though' reverses 'spoke at length', so predict 'quiet'. Reticent and taciturn. (Verbose and garrulous are a trap pair with the opposite meaning.)"}]
},
{
id:"q5", track:"Quant", week:4, mins:40, title:"Word problems",
sum:"Rate and distance, combined work, averages and weighted averages, overlapping sets and mixtures.",
body:`<h4>Distance = rate × time</h4>
<p>Two objects moving toward each other: add rates. Same direction: subtract rates. Average speed for a whole trip = total distance ÷ total time, <b>not</b> the average of the speeds.</p>
<h4>Combined work</h4>
<p>If A finishes a job in a hours and B in b hours, together they do 1/a + 1/b of the job per hour. Time together = 1 ÷ (1/a + 1/b) = ab/(a + b).</p>
<h4>Averages</h4>
<p>Sum = average × number of items. Most average problems are easiest through the sum. A weighted average sits closer to the group with more weight.</p>
<h4>Overlapping sets</h4>
<p>Total = A + B − Both + Neither. For more complex cases, draw a 2 × 2 table.</p>
<h4>Mixtures</h4>
<p>Track the amount of the pure ingredient: a 20% salt solution of 50 L contains 10 L of salt.</p>`,
rules:["Average speed = total distance / total time.","Work rates add; times don't.","Convert averages to sums.","Total = A + B − Both + Neither."],
traps:["Averaging two speeds directly.","Adding times in work problems.","Forgetting the 'neither' group in set problems."],
examples:[{q:"You drive 60 km at 30 km/h and 60 km back at 60 km/h. Average speed?",a:"Time = 2 h + 1 h = 3 h for 120 km, so 40 km/h, not 45."},{q:"A fills a tank in 6 hours, B in 3. Together?",a:"1/6 + 1/3 = 1/2 tank per hour, so 2 hours."}]
},
{
id:"v4", track:"Verbal", week:4, mins:35, title:"Reading: structure and main idea",
sum:"How to read GRE passages actively and answer primary-purpose and structure questions.",
body:`<p>About half of Verbal is Reading Comprehension: short passages (one paragraph), long passages (several paragraphs) and argument paragraphs. Topics include science, social science and the humanities. You never need outside knowledge.</p>
<h4>Read for structure, not detail</h4>
<p>As you read, write a short map: a few words per paragraph saying what it does. "P1: old theory. P2: new evidence against it. P3: author's middle view." Details can be looked up later; structure is what most questions test.</p>
<h4>Track the author</h4>
<p>Watch for opinion words (fortunately, misguided, compelling, overlooks). They show the author's view, which is usually the answer to main-idea questions.</p>
<h4>Primary purpose questions</h4>
<p>The right answer covers the <b>whole</b> passage and matches its tone. Verbs matter: a passage that "describes" is different from one that "argues" or "challenges".</p>
<h4>Common wrong answers</h4>
<ul><li><b>Too extreme</b>: "proves", "always", "completely rejects".</li><li><b>Too narrow</b>: covers one paragraph only.</li><li><b>Out of scope</b>: sounds sensible but the passage never says it.</li><li><b>Half right</b>: the first half matches, the second half doesn't.</li></ul>`,
rules:["Write a one-line map for each paragraph.","Identify the author's position and tone.","Main-idea answers must cover the whole passage.","Every right answer can be pointed to in the text."],
traps:["Choosing answers that are true in real life but not stated.","Extreme language when the author is moderate.","Answers about a single detail for a main-idea question."],
examples:[{q:"A passage presents a theory, gives two problems with it, then proposes a modified version. Best description?",a:"'The passage evaluates a theory and proposes a refinement of it.' Avoid 'refutes' (too strong) and 'describes' (too weak)."}]
},
{
id:"q6", track:"Quant", week:5, mins:45, title:"Geometry",
sum:"Lines and angles, triangles, polygons, circles, coordinate geometry and 3-D shapes.",
body:`<p><b>Figures are not drawn to scale</b> unless the question says so. Trust given numbers and marks, not appearance.</p>
<h4>Triangles</h4>
<ul><li>Angles sum to 180°. The largest side faces the largest angle.</li><li>Any side is less than the sum of the other two (triangle inequality).</li><li>Right-triangle triples: 3-4-5, 5-12-13, 8-15-17 (and multiples like 6-8-10).</li><li>45-45-90: sides x, x, x√2. 30-60-90: sides x, x√3, 2x.</li><li>Area = ½ × base × height.</li></ul>
<h4>Polygons</h4>
<p>Sum of interior angles = (n − 2) × 180°. Each angle of a regular hexagon = 720 ÷ 6 = 120°.</p>
<h4>Circles</h4>
<ul><li>Circumference 2πr, area πr².</li><li>Arc length = (θ/360) × 2πr; sector area = (θ/360) × πr².</li><li>An inscribed angle is half the central angle on the same arc.</li><li>A triangle drawn with the diameter as one side and the third vertex on the circle is a right triangle.</li></ul>
<h4>Coordinate geometry</h4>
<ul><li>Slope = (y₂ − y₁)/(x₂ − x₁). Line: y = mx + b.</li><li>Parallel lines share a slope; perpendicular slopes multiply to −1.</li><li>Distance: use the Pythagorean theorem on the horizontal and vertical gaps.</li></ul>
<h4>3-D</h4>
<p>Box: volume lwh, surface 2(lw + lh + wh), longest diagonal √(l² + w² + h²). Cylinder: volume πr²h.</p>`,
rules:["Never trust the drawing's proportions.","Look for special right triangles before using √.","Draw extra lines (heights, radii) to create triangles.","Each regular polygon angle = (n − 2)·180 / n."],
traps:["Assuming angles that look equal are equal.","Mixing up radius and diameter.","Forgetting both possible positions for a point in coordinate problems."],
examples:[{q:"A right triangle has legs 9 and 12. Hypotenuse?",a:"It's a 3-4-5 triple scaled by 3, so 15."},{q:"A sector of a circle with radius 6 has central angle 60°. Its area?",a:"(60/360) × π × 36 = 6π."}]
},
{
id:"v5", track:"Verbal", week:5, mins:30, title:"Reading: inference, detail and select-all",
sum:"Answering what the passage implies, what it states and the questions with several right answers.",
body:`<h4>Detail questions</h4>
<p>"According to the passage…" Go back to the text. The answer is a paraphrase of a specific line.</p>
<h4>Inference questions</h4>
<p>"It can be inferred…" On the GRE, an inference is something that <b>must be true</b> based on the text, one small step from what is stated. If you need to imagine extra facts, it is too far.</p>
<h4>Function questions</h4>
<p>"The author mentions X in order to…" Ask why the sentence is there: to give an example, to contrast, to support a claim? Look at the sentences just before and after.</p>
<h4>Select all that apply</h4>
<p>Three choices, any number may be correct (one, two or all three). Judge each choice independently against the text. No partial credit.</p>
<h4>Select in passage</h4>
<p>You click the sentence that does a job (for example, "gives evidence against the theory"). Check every sentence that might fit before clicking.</p>`,
rules:["Inference = must be true from the text.","For function questions, read the sentences around the reference.","Test each select-all choice separately."],
traps:["Inferences that are possible but not required.","Assuming select-all always has two answers.","Answering from memory instead of going back to the line."],
examples:[{q:"Passage: 'Unlike earlier surveys, the 2019 study included rural clinics.' What can be inferred?",a:"Earlier surveys did not include rural clinics. You cannot infer that rural results differed, or that the 2019 study was more accurate."}]
},
{
id:"v6", track:"Verbal", week:5, mins:30, title:"Argument paragraphs",
sum:"Conclusion, evidence and assumption; strengthen, weaken and evaluate questions.",
body:`<p>A few Reading questions present a short argument. Find three parts: the <b>conclusion</b> (what the author wants you to believe), the <b>evidence</b> (facts offered) and the <b>assumption</b> (the unstated link that must be true for the evidence to support the conclusion).</p>
<h4>Classic gaps</h4>
<ul><li><b>Cause from correlation</b>: two things happen together, so one must cause the other.</li><li><b>Unrepresentative sample</b>: a survey of one group used to judge everyone.</li><li><b>Percent vs. number</b>: a rising percentage doesn't mean a rising count.</li><li><b>Unfair comparison</b>: comparing groups that differ in other important ways.</li></ul>
<h4>Question types</h4>
<table><tbody><tr><td>Weaken</td><td>attack the assumption: show another cause, or a flawed sample</td></tr><tr><td>Strengthen</td><td>support the assumption: rule out another cause</td></tr><tr><td>Assumption</td><td>negate the choice; if the argument collapses, it is the assumption</td></tr><tr><td>Explain</td><td>resolve an apparent paradox: both facts are true; find what makes them fit</td></tr></tbody></table>`,
rules:["Separate conclusion from evidence before reading choices.","Weakeners and strengtheners target the assumption.","Negation test for assumptions."],
traps:["Answers that are relevant to the topic but not the reasoning.","Answers that address the evidence's truth instead of the logic."],
examples:[{q:"'Cities that built bike lanes saw fewer traffic deaths, so bike lanes improve safety.' Which weakens it?",a:"Something like: 'Those cities also lowered speed limits at the same time.' That offers another cause for the drop."}]
},
{
id:"q7", track:"Quant", week:6, mins:40, title:"Statistics and data interpretation",
sum:"Mean, median, mode, range, standard deviation, quartiles, normal distributions and reading charts.",
body:`<h4>Center</h4>
<p>Mean = sum ÷ count. Median = middle value of the sorted list (average the two middle values for an even count). Mode = most frequent value.</p>
<h4>Spread</h4>
<p>Range = max − min. Standard deviation measures how far values sit from the mean. Adding the same number to every value does not change SD; multiplying every value by k multiplies SD by |k|.</p>
<h4>Quartiles and boxplots</h4>
<p>Q1 is the median of the lower half, Q3 of the upper half. Interquartile range = Q3 − Q1. A boxplot shows min, Q1, median, Q3 and max.</p>
<h4>Normal distribution</h4>
<p>About 68% of values lie within 1 SD of the mean, about 95% within 2 SD. So about 16% lie above mean + 1 SD, and about 2.5% above mean + 2 SD.</p>
<h4>Data interpretation sets</h4>
<p>Several questions share one set of charts. Read the titles, axes and units first. Estimate when answer choices are far apart; calculate only when they're close.</p>`,
rules:["Sort before finding a median.","Adding a constant: mean shifts, SD stays.","1 SD ≈ 68%, 2 SD ≈ 95%.","Read chart units and scales before any calculation."],
traps:["Forgetting to sort.","Mixing percent of a total with absolute numbers in charts.","Assuming a larger range means a larger SD."],
examples:[{q:"The mean of 5 numbers is 12. One number, 20, is removed. New mean?",a:"Sum = 60. Without 20 the sum is 40 over 4 numbers: mean 10."},{q:"Test scores are normal with mean 70, SD 8. About what percent score above 86?",a:"86 = mean + 2 SD. About 2.5%."}]
},
{
id:"q8", track:"Quant", week:6, mins:35, title:"Probability and counting",
sum:"The counting principle, permutations, combinations and the main probability rules.",
body:`<h4>Counting principle</h4>
<p>If one choice has m options and another has n, together they have m × n.</p>
<h4>Order matters: permutations</h4>
<p>Arranging k of n distinct items in order: n!/(n − k)!. Arranging all n: n!.</p>
<h4>Order doesn't matter: combinations</h4>
<p>Choosing k from n: C(n, k) = n! / (k!(n − k)!). Picking a committee of 3 from 7 people: C(7, 3) = 35.</p>
<h4>Probability</h4>
<ul><li>P = favorable outcomes ÷ total outcomes.</li><li>P(not A) = 1 − P(A). Use it for "at least one" questions.</li><li>Independent events: P(A and B) = P(A) × P(B).</li><li>P(A or B) = P(A) + P(B) − P(A and B).</li></ul>`,
rules:["Ask first: does order matter?","'At least one' → 1 − P(none).","Without replacement, the second draw's total drops by one."],
traps:["Using permutations for teams or groups.","Adding probabilities of events that can happen together without subtracting the overlap."],
examples:[{q:"A coin is tossed 3 times. P(at least one head)?",a:"P(no heads) = (1/2)³ = 1/8, so 1 − 1/8 = 7/8."},{q:"In how many ways can 5 books be arranged on a shelf?",a:"5! = 120."}]
},
{
id:"s2", track:"Strategy", week:9, mins:20, title:"Mocks, pacing and test day",
sum:"How to take and review mock tests, what to do in the final weeks, and test-day logistics.",
body:`<h4>Taking a mock</h4>
<p>Simulate everything: same time of day as your test, no phone, no pausing, scratch paper only, the essay first.</p>
<h4>Reviewing a mock (the important part)</h4>
<p>Review every question you got wrong, guessed or spent too long on. For each, write in your error log: the type, why you missed it, and one lesson. A 2-hour mock deserves about 2–3 hours of review.</p>
<h4>Pacing checkpoints</h4>
<p>Halfway through a section you should be roughly halfway through the questions. If you're behind, guess on the next hard question and move on.</p>
<h4>Final week</h4>
<p>No new topics. Light mixed practice, reread your error log lessons, keep normal sleep.</p>
<h4>Test day</h4>
<ul><li>Bring the ID ETS requires, with a name that matches your registration exactly.</li><li>For the at-home test, check the room, desk and camera rules ahead of time.</li><li>Eat beforehand. There is no scheduled break.</li></ul>
<h4>Retakes</h4>
<p>Scores are valid for 5 years. You can retake if needed, and you can usually choose which scores to send.</p>`,
rules:["Mocks under real conditions only.","Review time ≥ test time.","No new material in the final week."],
traps:["Taking mock after mock without reviewing.","Changing strategy on test day."],
examples:[{q:"Your mock Verbal dropped 3 points from last week. What do you do?",a:"Check the error log by type. A single mock varies by a few points; look for a pattern (for example, RC inference misses) and drill that type before the next mock."}]
}
];
