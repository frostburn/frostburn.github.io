// https://github.com/SeanArchibald/scale-workshop/blob/master/src/js/synth/Synth.js
// set up custom waveforms
function createWaveforms(audioCtx) {
  return {
    warm1: audioCtx.createPeriodicWave(
      new Float32Array([0, 1, 0.2, 0.2, 0.2, 0.1, 0.1, 0.05]),
      new Float32Array([0, 0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.00])
    ),
    warm2: audioCtx.createPeriodicWave(
      new Float32Array([0, 1, 0.5, 0.333, 0.2, 0.1]),
      new Float32Array([0, 0, 0.0, 0.000, 0.0, 0.0])
    ),
    warm3: audioCtx.createPeriodicWave(
      new Float32Array([0, 1, 0.5, 0.5, 0.3]),
      new Float32Array([0, 0, 0.0, 0.0, 0.0])
    ),
    warm4: audioCtx.createPeriodicWave(
      new Float32Array([0, 1, 0.2, 0.2, 0.1]),
      new Float32Array([0, 0, 0.0, 0.0, 0.0])
    ),
    octaver: audioCtx.createPeriodicWave(
      new Float32Array([0,1,0.5,0,0.333,0,0,0,0.25,0,0,0,0,0,0,0,0.166]),
      new Float32Array([0,0,0,  0,0,    0,0,0,0,   0,0,0,0,0,0,0,0])
    ),
    brightness: audioCtx.createPeriodicWave(
      new Float32Array([0,1,0,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.1,0.1,0.1,0.1,0.1]),
      new Float32Array([0,0,0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0])
    ),
    harmonicbell: audioCtx.createPeriodicWave(
      new Float32Array([0, 1, 0.2, 0.2, 0.2, 0.2,0,0,0,0,0,0.7]),
      new Float32Array([0, 0, 0.0, 0.0, 0.0, 0.0,0,0,0,0,0,0])
    ),
    semisine: audioCtx.createPeriodicWave(
      new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      new Float32Array([0, 1, 0.25, 0.111111, 0.0625, 0.04, 0.027777, 0.020408, 0.015625, 0.0123456, 0.01, 0.008264, 0.0069444, 0.0059171, 0.005102041, 0.0044444, 0.00390625])
    ),
    template: audioCtx.createPeriodicWave(
      // first element is DC offset, second element is fundamental, third element is 2nd harmonic, etc.
      new Float32Array([0, 1, 0.5, 0.333, 0.25, 0.2, 0.167]), // sine components
      new Float32Array([0, 0, 0.0, 0.000, 0.00, 0.0, 0.000])  // cosine components
    )
  };
}
