function mod(n, m) {
    return ((n % m) + m) % m;
}

function parseFraction(token) {
    if (token.includes("/")) {
        [numerator, denominator] = token.split("/", 2);
        return parseFloat(numerator) / parseFloat(denominator);
    }
    return parseFloat(token);
}

// Ya = 5-limit = 2.3.5 subgroup
const JI_YA = [Math.log(2), Math.log(3), Math.log(5)];

const BASIC_YA_INTERVALS = {
    "d2": [19, -12, 0],
    "d6": [18, -11, 0],
    "d3": [16, -10, 0],
    "d7": [15, -9, 0],
    "d4": [13, -8, 0],
    "d1": [11, -7, 0],
    "d5": [10, -6, 0],
    "m2": [8, -5, 0],
    "m6": [7, -4, 0],
    "m3": [5, -3, 0],
    "m7": [4, -2, 0],
    "P4": [2, -1, 0],
    "P1": [0, 0, 0],
    "P5": [-1, 1, 0],
    "M2": [-3, 2, 0],
    "M6": [-4, 3, 0],
    "M3": [-6, 4, 0],
    "M7": [-7, 5, 0],
    "A4": [-9, 6, 0],
    "A1": [-11, 7, 0],
    "A5": [-12, 8, 0],
    "A2": [-14, 9, 0],
    "A6": [-15, 10, 0],
    "A3": [-17, 11, 0],
    "A7": [-18, 12, 0],
};

function parseYaInterval(token) {
    const quality = token[0];
    token = token.slice(1);
    let arrows = 0;
    if (token.includes("u")) {
        [token, arrowToken] = token.split("u", 2);
        arrows = parseInt(arrowToken);
        if (isNaN(arrows)) {
            arrows = 1;
        }
    } else if (token.includes("d")) {
        [token, arrowToken] = token.split("d", 2);
        arrows = -parseInt(arrowToken);
        if (isNaN(arrows)) {
            arrows = -1;
        }
    }
    const intervalClass = parseInt(token);
    const octave = Math.floor((intervalClass - 1)/7);
    const basicClass = intervalClass - octave*7;

    const baseLookUp = quality + basicClass;
    const baseVector = BASIC_YA_INTERVALS[baseLookUp];
    return [baseVector[0] + octave -4*arrows, baseVector[1] + 4*arrows, baseVector[2] - arrows];
}

function parseYa(text) {
    const result = [];
    const pitch = [0, 0, 0];
    let time = 0;

    text.split(/\s+/).forEach(token => {
        if (token == "") {
            return;
        }
        let chordToken = "U";
        let inversionToken = "0";
        let durationToken = "1";
        let intervalToken;
        if (token.includes("(")) {
            [intervalToken, token] = token.split("(", 2);
            [chordToken, token] = token.split(")", 2);
            if (chordToken.includes("_")) {
                [chordToken, inversionToken] = chordToken.split("_", 2);
            }
        } else if (token.includes("[")) {
            [intervalToken, token] = token.split("[", 2);
        } else {
            intervalToken = token;
            token = "";
        }
        if (token.includes("]")) {
            if (token.startsWith("[")) {
                durationToken = token.slice(1, -1);
            } else {
                durationToken = token.slice(0, -1);
            }
        }

        const duration = parseFraction(durationToken);

        if (intervalToken != "Z") {
            let direction = 1;
            if (intervalToken[0] == "-") {
                direction = -1;
                intervalToken = intervalToken.slice(1);
            }
            if (intervalToken[0] == "+") {
                intervalToken = intervalToken.slice(1);
            }
            const interval = parseYaInterval(intervalToken);
            const chord = [];
            YA_CHORDS[chordToken].forEach(chordTone => {
                chord.push(parseYaInterval(chordTone));
            });
            const inversion = parseInt(inversionToken);
            for (let i = 0; i < inversion; ++i) {
                chord[i][0] += 1;
            }
            if (inversion > 0) {
                for (let i = 0; i < chord.length; ++i) {
                    chord[i][0] -= 1;
                }
            }
            for (let i = 0; i < 3; ++i) {
                pitch[i] += interval[i]*direction;
            }
            if (duration > 0) {
                const notes = [];
                for (let j = 0; j < chord.length; ++j) {
                    const notePitch = [pitch[0] + chord[j][0], pitch[1] + chord[j][1], pitch[2] + chord[j][2]];
                    notes.push({pitch: notePitch, duration, time});
                }
                result.push(notes);
            }
        }
        time += duration;
    });

    return result;
}

function parseConfiguration(text) {
    let baseFrequency = 440;
    let measure = [4, 4];
    let tempo = [[1, 4], 120];
    let unparsed = [];
    text.split("\n").forEach(line => {
        line = line.split("%", 1)[0];
        if (line.startsWith("A:")) {
            baseFrequency = parseFloat(line.split(":", 2)[1]);
        }
        else if (line.startsWith("M:")) {
            [numerator, denominator] = line.split(":", 2)[1].split("/", 2);
            measure = [parseInt(numerator), parseInt(denominator)];
        }
        else if (line.startsWith("Q:")) {
            [beat, value] = line.split(":", 2)[1].split("=", 2);
            [numerator, denominator] = beat.split("/", 2);
            tempo = [[parseInt(numerator), parseInt(denominator)], parseInt(value)];
        } else {
            unparsed.push(line.replaceAll("|", " "));
        }
    });
    beatDuration = 60/tempo[1] * (tempo[0][1]/tempo[0][0]) / measure[1];
    return {baseFrequency, beatDuration, unparsed: unparsed.join("\n")};
}

const LYDIAN = ["F", "C", "G", "D", "A", "E", "B"];
const LYDIAN_INDEX_A = LYDIAN.indexOf("A");
const REFERENCE_OCTAVE = 4;
const INDEX_A_12EDO = 9;

function notateYa(pitch) {
    const twos = pitch[0];
    const threes = pitch[1];
    const fives = pitch[2];

    const index = LYDIAN_INDEX_A + threes + fives*4;
    const sharps = Math.floor(index / LYDIAN.length);
    const letter = LYDIAN[mod(index, LYDIAN.length)];
    const arrows = -fives;

    const edo12 = twos*12 + threes*19 + fives*28;
    const octaves = REFERENCE_OCTAVE + Math.floor((edo12 + INDEX_A_12EDO)/12);

    return {letter, sharps, arrows, octaves};
}

function tokenizeNotation(notation) {
    let syntonicArrows = notation.syntonicArrows;
    if (syntonicArrows === undefined) {
        syntonicArrows = notation.arrows;
    }
    if (syntonicArrows === undefined) {
        syntonicArrows = 0;
    }
    let sharps = notation.sharps;
    let accidental = "";
    if (sharps > 0) {
        if (sharps % 2) {
            accidental = "#";
        }
        while (sharps > 0) {
            accidental = accidental + "x";
            sharps -= 2;
        }
    } else if (sharps < 0) {
        while (sharps < 0) {
            accidental += "b";
            sharps += 1;
        }
    }
    let arrows = "";
    if (syntonicArrows > 0) {
        arrows = "u";
        if (syntonicArrows > 1) {
            arrows += syntonicArrows;
        }
    } else if (syntonicArrows < 0) {
        arrows = "d";
        if (syntonicArrows < -1) {
            arrows += (-syntonicArrows);
        }
    }
    return notation.letter + notation.octaves + accidental + arrows;
}

function updateAbsolutePitches(notess) {
    const el = document.getElementById('absolute');
    tokens = [];
    notess.forEach(notes => {
        let token;
        if (notes.length == 1) {
            token = tokenizeNotation(notateYa(notes[0].pitch));
        } else {
            subtokens = [];
            notes.forEach(note => {
                subtokens.push(tokenizeNotation(notateYa(note.pitch)));
            });
            token = "(" + subtokens.join(" ") + ")";
        }
        if (notes[0].duration != 1) {
            token += "[" + notes[0].duration + "]";
        }
        tokens.push(token);
    });
    el.textContent = tokens.join(" ");
}

function main() {
    const context = new AudioContext({latencyHint: "interactive"});
    context.suspend();
    const attackTime = 0.01;
    const decayTime = 0.02;

    const globalGain = context.createGain();
    globalGain.connect(context.destination);
    globalGain.gain.setValueAtTime(0.199, context.currentTime);

    const voices = [];
    for (let i = 0; i < 8; ++i) {
        const oscillator = context.createOscillator();
        oscillator.type = "triangle";
        const gain = context.createGain();
        gain.gain.setValueAtTime(0.0, context.currentTime);
        oscillator.connect(gain).connect(globalGain);
        oscillator.frequency.setValueAtTime(200+100*i, context.currentTime);
        oscillator.start();
        voices.push({oscillator, gain});
    }

    const playEl = document.getElementById('play');
    const panicEl = document.getElementById('panic');
    const textEl = document.getElementById('text');

    const mapping = JI_YA;

    playEl.onclick = e => {
        const config = parseConfiguration(textEl.value);
        const notess = parseYa(config.unparsed);
        updateAbsolutePitches(notess);

        const now = context.currentTime;

        for (let i = 0; i < voices.length; ++i) {
            voices[i].oscillator.frequency.cancelScheduledValues(now);
            voices[i].gain.gain.cancelScheduledValues(now);
            voices[i].gain.gain.setValueAtTime(0.0, now);
        }

        notess.forEach(notes => {
            for (let i = 0; i < notes.length; ++i) {
                if (i > voices.length) {
                    continue;
                }
                let logRatio = 0;
                for (let j = 0; j < mapping.length; ++j) {
                    logRatio += mapping[j]*notes[i].pitch[j];
                }
                const frequency = config.baseFrequency * Math.exp(logRatio);
                const time = notes[i].time * config.beatDuration + now;
                const duration = notes[i].duration * config.beatDuration;
                voices[i].oscillator.frequency.setValueAtTime(frequency, time);
                voices[i].gain.gain.setValueAtTime(0.0, time);
                voices[i].gain.gain.linearRampToValueAtTime(1.0, time + attackTime);
                voices[i].gain.gain.setValueAtTime(1.0, time + duration - decayTime);
                voices[i].gain.gain.linearRampToValueAtTime(0.0, time + duration);
            }
        });

        context.resume();
    }

    panicEl.onclick = e => {
        context.suspend();
    }
}
