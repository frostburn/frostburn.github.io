function makeSigmoidCurve() {
  const nSamples = 44100;
  const curve = new Float32Array(nSamples);

  for (let i = 0; i < nSamples; ++i) {
    let x = i - 0.5 * nSamples;
    x /= nSamples;
    x *= 10;
    curve[i] = Math.tanh(x) * 0.5;
  }
  return curve;
}


function makeSoftBuzzPeriodicWave(context, sharpness=0.1) {
  // TODO: Dynamically calculate number of needed harmonics for sharp sounds.
  const nHarmonics = 256;
  var real = new Float32Array(nHarmonics);
  var imag = new Float32Array(nHarmonics);

  real[0] = 0;
  imag[0] = 0;
  for (let i = 1; i < nHarmonics; ++i) {
    real[i] = 0;
    imag[i] = Math.exp(-sharpness * i*i);
  }

  return context.createPeriodicWave(real, imag);
}



function frequencyToMidiPitch(frequency) {
  return 69 + 12 * Math.log(frequency / 440.0) / Math.log(2);
}

NOTE_NAMES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B"];

function frequencyToLabel(frequency) {
  const pitch = frequencyToMidiPitch(frequency);
  let nearest = Math.round(pitch);
  const detune = pitch - nearest;
  const cents = Math.floor(detune * 100);

  let plus = "";
  if (cents >= 0) {
    plus = "+";
  }

  const noteName = NOTE_NAMES[nearest % 12];
  const octaveNumber = Math.floor(nearest / 12.0);

  return `${noteName}${octaveNumber} ${plus}${cents}`;
}
