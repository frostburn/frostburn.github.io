// Assumes util.js imported

// TODO:
// * Show pitch + cents for each voice
// * Presets for major and minor
// * Spectrograph visualization
// * Make it pretty

function main() {
  const context = new AudioContext({latencyHint: "interactive"});
  context.suspend();

  let voiceCount = 0;

  const sigmoidDistortion = context.createWaveShaper();
  sigmoidDistortion.curve = makeSigmoidCurve();
  sigmoidDistortion.connect(context.destination);

  const softBuzz = makeSoftBuzzPeriodicWave(context, 0.2);

  const baseFrequency = document.querySelector("#base-frequency");
  const preGainSlider = document.querySelector("#pre-gain");
  const voiceContainer = document.querySelector("#voices");

  const preGain = context.createGain();
  preGain.connect(sigmoidDistortion);
  function adjustPreGain() {
    if (voiceCount) {
      preGain.gain.linearRampToValueAtTime(
        parseFloat(preGainSlider.value) / voiceCount,
        context.currentTime + 0.05
      );
    }
  }

  preGainSlider.addEventListener('input', adjustPreGain);

  function makeVoiceElement(multiplier=1) {
    const oscillator = context.createOscillator();
    const type = document.querySelector('input[name="voice-type"]:checked').value;
    if (type === "buzz") {
      oscillator.setPeriodicWave(softBuzz);
    } else {
      oscillator.type = type;
    }

    const voiceBox = document.createElement('div');

    const multiplierInput = document.createElement('input');
    multiplierInput.setAttribute("type", "number");
    multiplierInput.setAttribute("step", "0.001");
    multiplierInput.setAttribute("value", multiplier);
    voiceBox.appendChild(multiplierInput);

    const noteLabel = document.createElement('span');
    voiceBox.appendChild(noteLabel);

    function followBaseFrequency() {
      const frequency = parseFloat(baseFrequency.value) * parseFloat(multiplierInput.value);
      oscillator.frequency.setValueAtTime(
        frequency,
        context.currentTime
      );
      noteLabel.textContent = frequencyToLabel(frequency);
    }

    followBaseFrequency();
    baseFrequency.addEventListener('input', followBaseFrequency);
    multiplierInput.addEventListener('input', followBaseFrequency);

    const gainInput = document.createElement('input');
    gainInput.setAttribute("type", "range");
    gainInput.setAttribute("min", "0");
    gainInput.setAttribute("max", "1");
    gainInput.setAttribute("step", "0.001");
    gainInput.setAttribute("value", "0.3");
    voiceBox.appendChild(gainInput);

    const gain = context.createGain();
    oscillator.connect(gain); //.connect(preGain);

    function followGain() {
      gain.gain.linearRampToValueAtTime(
        parseFloat(gainInput.value),
        context.currentTime + 0.05
      );
    }

    gain.gain.setValueAtTime(0.0, context.currentTime);
    followGain();
    gainInput.addEventListener('input', followGain);

    const panInput = document.createElement('input');
    panInput.setAttribute("type", "range");
    panInput.setAttribute("min", "-1");
    panInput.setAttribute("max", "1");
    panInput.setAttribute("step", "0.001");
    panInput.setAttribute("value", "0");
    voiceBox.appendChild(panInput);

    const pan = context.createStereoPanner();
    gain.connect(pan).connect(preGain);

    function followPan() {
      pan.pan.linearRampToValueAtTime(
        parseFloat(panInput.value),
        context.currentTime + 0.05
      );
    }

    pan.pan.setValueAtTime(0.0, context.currentTime);
    panInput.addEventListener('input', followPan);

    adjustPreGain();
    oscillator.start();
    voices.appendChild(voiceBox);
  }

  document.querySelector('#add-one-button').addEventListener('click', function() {
    context.resume();
    voiceCount += 1;
    makeVoiceElement(voiceCount);
  });
  document.querySelector('#panic-button').addEventListener('click', function() {
    context.suspend().then(() => {
      console.log('Playback halted successfully');
    });
  });
}
