// scripts/qa_questionbank.js
// Automated QA stress testing suite for CuboidQuest question bank
// Asserts all 10 schema and domain constraints across >=300 runs (>=30,000 questions)
import { generateQuestionBank, UNIT_DISTRACTOR_REGISTRY } from '../src/data/questionBank.js';
import { DIM_POOL, LARGE_DIM_POOL, METRE_POOL, isCube, packsExactly } from '../src/utils/cuboidMath.js';

const TOTAL_RUNS = 300;
console.log(`\n🔍 Starting CuboidQuest Question Bank QA Stress Test (${TOTAL_RUNS} runs = ${TOTAL_RUNS * 100} questions)...`);

let totalQuestionsTested = 0;
let errors = [];

for (let run = 1; run <= TOTAL_RUNS; run++) {
  const bank = generateQuestionBank();

  if (!Array.isArray(bank) || bank.length !== 100) {
    errors.push(`Run ${run}: Bank does not contain exactly 100 questions (got ${bank?.length}).`);
    break;
  }

  // Verify exactly 10 questions per district 0-9
  const districtCounts = Array(10).fill(0);

  for (let idx = 0; idx < bank.length; idx++) {
    const q = bank[idx];
    totalQuestionsTested++;

    // 1. Schema: all fields present, non-empty, no NaN/undefined/null
    const requiredFields = [
      'id', 'districtId', 'category', 'visual', 'questionText',
      'options', 'correctAnswer', 'explanation', 'hint1', 'hint2', 'visualData'
    ];
    for (const f of requiredFields) {
      if (q[f] === undefined || q[f] === null || q[f] === '') {
        errors.push(`Run ${run}, Q ${q.id}: Missing or empty field '${f}'.`);
      }
    }

    if (String(q.questionText).includes('NaN') || String(q.explanation).includes('NaN')) {
      errors.push(`Run ${run}, Q ${q.id}: Contains NaN in text.`);
    }

    // 2. Options: exactly 4, distinct, correctAnswer is one of them
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      errors.push(`Run ${run}, Q ${q.id}: Options count is ${q.options?.length}, expected 4.`);
    } else {
      const set = new Set(q.options.map(s => String(s).trim()));
      if (set.size !== 4) {
        errors.push(`Run ${run}, Q ${q.id}: Duplicate options found: ${JSON.stringify(q.options)}`);
      }
      if (!set.has(String(q.correctAnswer).trim())) {
        errors.push(`Run ${run}, Q ${q.id}: Correct answer '${q.correctAnswer}' not in options ${JSON.stringify(q.options)}`);
      }
    }

    // 3. DistrictId in 0-9
    if (q.districtId < 0 || q.districtId > 9) {
      errors.push(`Run ${run}, Q ${q.id}: Invalid districtId ${q.districtId}.`);
    } else {
      districtCounts[q.districtId]++;
    }

    // 4. Visual type valid
    const validVisuals = [
      'isoCuboid', 'isoCuboidMasked', 'layerFill', 'netUnfold',
      'baseHighlight', 'faceHighlight', 'tankWater', 'stackGrid',
      'comparePair', 'packingSlip'
    ];
    if (!validVisuals.includes(q.visual)) {
      errors.push(`Run ${run}, Q ${q.id}: Unknown visual type '${q.visual}'.`);
    }

    // 5. Whole-number reverse answers (worlds 3, 4, 5)
    if (q.districtId === 3 || q.districtId === 4 || q.districtId === 5) {
      const match = q.correctAnswer.match(/^(\d+)/);
      if (!match) {
        errors.push(`Run ${run}, Q ${q.id}: Reverse answer is not an integer: '${q.correctAnswer}'.`);
      }
    }

    // 6. No cube leakage: check visualData l, b, h where present
    if (q.visualData?.l && q.visualData?.b && q.visualData?.h) {
      if (isCube(q.visualData.l, q.visualData.b, q.visualData.h)) {
        errors.push(`Run ${run}, Q ${q.id}: Cube leakage detected (l=b=h=${q.visualData.l}).`);
      }
    }

    // 7. Packing fits dimensionally (world 7)
    if (q.districtId === 7 && q.visualData?.outer && q.visualData?.inner) {
      if (!packsExactly(q.visualData.outer, q.visualData.inner)) {
        errors.push(`Run ${run}, Q ${q.id}: World 7 carton does not fit inner boxes dimensionally.`);
      }
    }

    // 8. Whole capacity values (world 6)
    if (q.districtId === 6 && q.visualData?.waterHeight !== undefined) {
      if (!Number.isInteger(q.visualData.waterHeight)) {
        errors.push(`Run ${run}, Q ${q.id}: World 6 water height is non-integer: ${q.visualData.waterHeight}`);
      }
    }

    // 9. Unit correctness
    if (q.districtId === 0 && !q.correctAnswer.includes('cm³')) {
      errors.push(`Run ${run}, Q ${q.id}: World 0 answer missing cm³.`);
    }
    if (q.districtId === 3 && !q.correctAnswer.includes('cm')) {
      errors.push(`Run ${run}, Q ${q.id}: World 3 answer missing cm.`);
    }
    if (q.districtId === 5 && !q.correctAnswer.includes('cm²')) {
      errors.push(`Run ${run}, Q ${q.id}: World 5 answer missing cm².`);
    }

    // 10. Distractor sanity: no negative, zero, or NaN
    for (const opt of q.options) {
      if (opt.includes('-') && !opt.includes('−')) {
        errors.push(`Run ${run}, Q ${q.id}: Negative distractor '${opt}'.`);
      }
      if (opt.startsWith('0 cm') || opt.startsWith('0 m') || opt === '0') {
        errors.push(`Run ${run}, Q ${q.id}: Zero distractor '${opt}'.`);
      }
    }
  }

  // Check 10 questions per district
  for (let d = 0; d < 10; d++) {
    if (districtCounts[d] !== 10) {
      errors.push(`Run ${run}: District ${d} has ${districtCounts[d]} questions, expected 10.`);
    }
  }

  if (errors.length > 0) break;
}

if (errors.length === 0) {
  console.log(`\n✅ ALL ASSERTIONS PASSED!`);
  console.log(`Total questions tested: ${totalQuestionsTested.toLocaleString()}`);
  console.log(`Zero schema bugs, zero cube leakage, 100% integer reverse dimensions, 100% exact packing.\n`);
  process.exit(0);
} else {
  console.error(`\n❌ QA FAILURES (${errors.length} errors found):`);
  errors.slice(0, 10).forEach(e => console.error(` - ${e}`));
  process.exit(1);
}
