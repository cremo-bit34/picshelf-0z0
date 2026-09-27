// Test script to verify location tag logic and settings behaviors
const fs = require('fs');

const appJs = fs.readFileSync('web/app.js', 'utf8');

// Mock window and document
global.window = {
  t: (k) => k
};
global.document = {
  getElementById: () => null,
  querySelector: () => null
};
global.localStorage = {
  getItem: () => null,
  setItem: () => {}
};

// Evaluate getSuggestedLocationTagsForPhoto function logic from appJs
const fnMatch = appJs.match(/function getSuggestedLocationTagsForPhoto\(photo\) \{[\s\S]*?\n\}/);
if (!fnMatch) {
  console.error("FAIL: Could not extract getSuggestedLocationTagsForPhoto");
  process.exit(1);
}

eval(fnMatch[0]);

const samplePhotoWithGps = {
  id: 'test_1',
  location: {
    latitude: 18.9220,
    longitude: 72.8347,
    place: 'Gateway of India',
    city: 'Mumbai',
    country: 'India'
  }
};

// Scenario A: User screenshot state
// Extract Photo GPS Metadata is OFF (false)
// Suggest Location Tags is ON (true)
// Place is OFF (false)
// City is ON (true)
// Country is OFF (false)
global.state = {
  gpsMetadataEnabled: false,
  locationTagsEnabled: true,
  locationTagPlace: false,
  locationTagCity: true,
  locationTagCountry: false
};

const resA = getSuggestedLocationTagsForPhoto(samplePhotoWithGps);
console.log("Scenario A (User screenshot state - GPS Extraction OFF, Suggest ON, City ON):", resA);
if (resA.length !== 1 || resA[0].type !== 'city' || resA[0].label !== 'Mumbai') {
  console.error("FAIL in Scenario A: Expected exactly 1 suggestion: Mumbai (city)");
  process.exit(1);
} else {
  console.log("PASS Scenario A: Exactly 1 suggestion returned: Mumbai (city)");
}

// Scenario B: Suggest Location Tags is OFF (false)
global.state.locationTagsEnabled = false;
const resB = getSuggestedLocationTagsForPhoto(samplePhotoWithGps);
console.log("Scenario B (Suggest Location Tags OFF):", resB);
if (resB.length !== 0) {
  console.error("FAIL in Scenario B: Expected 0 suggestions when Suggest Location Tags is OFF");
  process.exit(1);
} else {
  console.log("PASS Scenario B: Correctly returns empty when Suggest Location Tags is OFF");
}

// Scenario C: All 3 sub-toggles ON
global.state.locationTagsEnabled = true;
global.state.locationTagPlace = true;
global.state.locationTagCity = true;
global.state.locationTagCountry = true;
const resC = getSuggestedLocationTagsForPhoto(samplePhotoWithGps);
console.log("Scenario C (All 3 sub-toggles ON):", resC);
if (resC.length !== 3) {
  console.error("FAIL in Scenario C: Expected 3 suggestions");
  process.exit(1);
} else {
  console.log("PASS Scenario C: Correctly returns place, city, country");
}

console.log("ALL TESTS PASSED SUCCESSFULLY!");
