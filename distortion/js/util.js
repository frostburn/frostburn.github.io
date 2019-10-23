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
