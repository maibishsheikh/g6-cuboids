// scripts/generate_audio.js
// Offline pre-generation script for ElevenLabs narration audio files.
// Strictly follows audio_generation_pipeline (5).md specifications.

import fs from 'fs';
import path from 'path';

// Helper to read environment variables without external dependencies
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').replace(/^["']|["']$/g, '').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const apiKey = process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.log("\nℹ️ Notice: VITE_ELEVENLABS_API_KEY is not defined in .env.local or .env.");
  console.log("Audio generation requires an API key. Skipping offline generation.\n");
  process.exit(0);
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice — Clear, Engaging Educator
const VOICE_MODEL = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  instruction:   { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  question:      { stability: 0.55, similarity_boost: 0.75, style: 0.50, use_speaker_boost: true },
  encouragement: { stability: 0.50, similarity_boost: 0.85, style: 0.60, use_speaker_boost: true },
  emphasis:      { stability: 0.75, similarity_boost: 0.90, style: 0.20, use_speaker_boost: true },
  thinking:      { stability: 0.70, similarity_boost: 0.78, style: 0.40, use_speaker_boost: true },
  celebration:   { stability: 0.45, similarity_boost: 0.85, style: 0.80, use_speaker_boost: true },
};

const phrases = [
  // ─── WONDER PHASE ────────────────────────────────────────────────────────
  { text: "Welcome to CuboidQuest! Let's investigate the big depot mystery!", style: 'statement' },
  { text: "A customer needs two litres of fish food packed into a shipping box at the depot.", style: 'statement' },
  { text: "Wei Jie grabs a carton measuring twenty centimetres by ten centimetres by eight centimetres. Does this box hold enough volume, or is it too small?", style: 'question' },
  { text: "Let's investigate how to calculate volume and capacity inside a three-dimensional box!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 0 ────────────────────────────────────────────────
  { text: "At the neighbourhood Box and Parcel Depot, customer orders are piling up!", style: 'statement' },
  { text: "A customer needs two litres of fish food packed securely for the pet shop next door. Wei Jie grabs a huge cardboard carton from the back shelf. Will this hold it? he asks.", style: 'statement' },
  { text: "Rina shakes her head with a smile. How do you know it is the right size without measuring? Neither of them can say for sure.", style: 'statement' },
  { text: "Bo the Beaver taps his wooden ruler against the bench — it is time to measure the space inside!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 1 ────────────────────────────────────────────────
  { text: "Bo grabs a utility knife and carefully cuts along the seams of a carton, unfolding it flat onto the depot floor.", style: 'statement' },
  { text: "Look! exclaims Wei Jie. A flat net with six rectangular faces — top, bottom, front, back, and two sides!", style: 'statement' },
  { text: "Rina takes out her chalk and marks the edges. Even though there are six faces, their sizes are decided by just three measurements: Length, Breadth, and Height.", style: 'statement' },

  // ─── STORY PHASE: PANEL 2 ────────────────────────────────────────────────
  { text: "Wei Jie begins lining the bottom of a box with one-centimetre wooden cubes. Along the length, six cubes fit. Along the breadth, four cubes fit.", style: 'statement' },
  { text: "Six multiplied by four is twenty-four cubes covering the bottom, Wei Jie calculates. That is the Base Area! notes Rina.", style: 'statement' },
  { text: "Next, they stack cubes upwards. Each layer adds another twenty-four cubes. Three layers tall makes twenty-four multiplied by three equals seventy-two cubic centimetres!", style: 'statement' },
  { text: "Volume is simply base area multiplied by height!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 3 ────────────────────────────────────────────────
  { text: "A wooden delivery crate arrives at the loading dock stamped with a volume of nine hundred and sixty cubic centimetres.", style: 'statement' },
  { text: "The shipping label shows a length of twelve centimetres and a breadth of eight centimetres, but the height has rubbed off!", style: 'statement' },
  { text: "How do we find the missing height? asks Wei Jie.", style: 'question' },
  { text: "Rina smiles: We reverse the multiplication using division! Length multiplied by breadth is ninety-six square centimetres. Nine hundred and sixty divided by ninety-six gives a height of exactly ten centimetres!", style: 'statement' },

  // ─── STORY PHASE: PANEL 4 ────────────────────────────────────────────────
  { text: "The pet shop owner calls in an urgent order: their new rectangular display aquarium has a base of thirty centimetres by twenty centimetres and needs water filled to an exact depth of twelve centimetres.", style: 'statement' },
  { text: "Water behaves just like unit cubes! Bo chitters happily. One cubic centimetre holds exactly one millilitre, and one thousand cubic centimetres make one litre.", style: 'celebration' },
  { text: "With a base area of six hundred square centimetres and a height of twelve centimetres, they pour exactly seven point two litres.", style: 'statement' },
  { text: "The depot is officially ready for business!", style: 'celebration' },

  // ─── SIMULATE STATION INTROS ─────────────────────────────────────────────
  { text: "Welcome to Station A — Unfold and Fill Lab!", style: 'instruction' },
  { text: "Explore why Volume equals Base Area multiplied by Height. Unfold the carton into a six-face net, or stack cubes layer by layer to see volume grow!", style: 'instruction' },
  { text: "Welcome to Station B — Custom Crate Builder!", style: 'instruction' },
  { text: "Build wooden shipping crates to match customer orders. Adjust the length, breadth, and height sliders to hit exact target volumes!", style: 'instruction' },
  { text: "Welcome to Station C — Aquarium Fill Mission!", style: 'instruction' },
  { text: "Size the aquarium tank base, pour water using litre jugs, and calculate the exact water depth inside a rectangular tank!", style: 'instruction' },
  { text: "Welcome to Station D — Packing Slip Detective!", style: 'instruction' },
  { text: "Three depot shipping slips came back with math mistakes. Tap the incorrect calculation line and choose the correct working to stamp the slip!", style: 'instruction' },

  // ─── FEEDBACK & HINTS ────────────────────────────────────────────────────
  { text: "Spot on! That calculation is exact! 📦", style: 'celebration' },
  { text: "Awesome! Three correct in a row! ⭐", style: 'celebration' },
  { text: "Incredible streak! You are a master crate packer! 🔥", style: 'celebration' },
  { text: "Not quite — check the hint, verify the formula, and try again! 💡", style: 'thinking' },
  { text: "Here is your first hint! Look at the formula and identify whether you need to multiply or divide.", style: 'encouragement' },
  { text: "Here is your final clue! Break down the arithmetic step by step.", style: 'encouragement' },
  { text: "World Complete! Spectacular job conquering this depot district! 🌟", style: 'celebration' },
  { text: "The Boss Battle begins! Solve the depot challenges correctly to defeat the boss and claim your reward badge!", style: 'emphasis' },
  { text: "Victory! You defeated the depot boss and earned your reward badge! 🏆", style: 'celebration' },
  { text: "Welcome to the Reflect Phase! Let's review key cuboid volume and capacity concepts and inspect your depot scorecard! 📓", style: 'statement' },
  { text: "Outstanding! You have mastered cuboid volume, reverse dimensions, and liquid capacity! You are a true Master of the Depot! 🏆", style: 'celebration' },
];

const outputDir = './public/assets/audio';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function cleanString(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 45).replace(/_+/g, '_').replace(/^_|_$/g, '');
}

async function main() {
  console.log(`\n🎙️ Starting ElevenLabs Audio Generation Pipeline`);
  console.log(`Voice ID: ${VOICE_ID} | Model: ${VOICE_MODEL}`);
  console.log(`Total phrases to process: ${phrases.length}\n`);

  const mapping = {};

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const cleanText = cleanString(text);
    const fileName = `audio_${cleanText}_${i}.mp3`;
    const destPath = path.join(outputDir, fileName);

    const relativeWebPath = `/assets/audio/${fileName}`;
    mapping[text] = relativeWebPath;

    if (fs.existsSync(destPath)) {
      console.log(`[${i + 1}/${phrases.length}] ⏩ Skipped (already exists): ${fileName}`);
      continue;
    }

    console.log(`[${i + 1}/${phrases.length}] 🔊 Generating: "${text.substring(0, 40)}..." -> ${fileName}`);

    const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: VOICE_MODEL,
          voice_settings: settings,
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`HTTP ${response.status}: ${errBody}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(destPath, buffer);
      console.log(`   ✅ Saved: ${destPath}`);
    } catch (e) {
      console.error(`   ❌ Failed to generate phrase "${text}":`, e.message);
    }
  }

  // Write mapping to src/utils/audioMap.js
  const mapContent = `// Auto-generated by generate_audio.js\n// Static asset mapping for offline generated narration phrases in CuboidQuest\n\nexport const audioMap = ${JSON.stringify(mapping, null, 2)};\n\nexport default audioMap;\n`;
  fs.writeFileSync('./src/utils/audioMap.js', mapContent);
  console.log("\n✨ Audio mapping updated in src/utils/audioMap.js!");
  console.log("🎉 Audio generation completed successfully!\n");
}

main().catch(console.error);
