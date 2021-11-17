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

/***
Notation is based on modifications of Pythagorean tuning by commas.
It is a loosely based on the Helholtz / Ellis / Wolf / Monzo notation.
Powers of three form the unbounded spiral of fifths ..., Eb, Bb, F, C, G, D, A, E, B, F#, C#, G#, D#, A#, E#, B#, Fx, Cx...
Powers of five correspond to syntonic commas 81/80 represented by + and -
Powers of seven correspond to Archytas commas 64/63 represented by > and <
Powers of eleven correspond to 11 M-diesis 33/32 represented by ^ and v
Powers of thirteen correspond to 13 L-diesis 27/26 represented by * and /
Powers of seventeen correspond to 17 kleismas 4131/4096 represented by u and d
Powers of nineteen correspond to Boethius' commas 513/512 represented by U and D
Powers of twentythree correspond to 23 commas 736/729 represented by A and V
Powers of twentynine correspond to 29 S-diesis 261/256 represented by M and W

There's a large bonus modifier for 416/405 represented by i and !. It allows you to spell the Barbados third 13/10 as M3i instead of P4+/.

Monzos
+,- : [-4, 4, -1>
>,< : [6, -2, 0, -1>
^,v : [-5, 1, 0, 0, 1>
*,/ : [-1, 3, 0, 0, 0, -1>
u,d : [-12, 5, 0, 0, 0, 0, 1>
U,D : [-9, 3, 0, 0, 0, 0, 0, 1>
A,V : [5, -6, 0, 0, 0, 0, 0, 0, 1>
M,W : [-8, 2, 0, 0, 0, 0, 0, 0, 0, 1>
i,! : [5, -4, -1, 0, 0, 1>

***/

const UPDOWNS = ["+-", "><", "^v", "*/", "ud", "UD", "AV", "MW", "i!"];

const COMMAS = {
    "+-": [-4, 4, -1],
    "><": [6, -2, 0, -1],
    "^v": [-5, 1, 0, 0, 1],
    "*/": [-1, 3, 0, 0, 0, -1],
    "ud": [-12, 5, 0, 0, 0, 0, 1],
    "UD": [-9, 3, 0, 0, 0, 0, 0, 1],
    "AV": [5, -6, 0, 0, 0, 0, 0, 0, 1],
    "MW": [-8, 2, 0, 0, 0, 0, 0, 0, 0, 1],
    "i!": [5, -4, -1, 0, 0, 1],
}

const JI = [Math.log(2), Math.log(3), Math.log(5), Math.log(7), Math.log(11), Math.log(13), Math.log(17), Math.log(19), Math.log(23), Math.log(29)];


const BASIC_INTERVALS = {
    "d2": [19, -12],
    "d6": [18, -11],
    "d3": [16, -10],
    "d7": [15, -9],
    "d4": [13, -8],
    "d1": [11, -7],
    "d5": [10, -6],
    "m2": [8, -5],
    "m6": [7, -4],
    "m3": [5, -3],
    "m7": [4, -2],
    "P4": [2, -1],
    "P1": [0, 0],
    "P5": [-1, 1],
    "M2": [-3, 2],
    "M6": [-4, 3],
    "M3": [-6, 4],
    "M7": [-7, 5],
    "A4": [-9, 6],
    "A1": [-11, 7],
    "A5": [-12, 8],
    "A2": [-14, 9],
    "A6": [-15, 10],
    "A3": [-17, 11],
    "A7": [-18, 12],
};

function parseInterval(token) {
    const quality = token[0];
    token = token.slice(1);
    const result = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    UPDOWNS.forEach(updown => {
        let arrows = 0;
        if (token.includes(updown[0])) {
            [token, arrowToken] = token.split(updown[0], 2);
            arrows = parseInt(arrowToken);
            if (isNaN(arrows)) {
                arrows = 1;
            }
        }
        if (token.includes(updown[1])) {
            [token, arrowToken] = token.split(updown[1], 2);
            arrows = -parseInt(arrowToken);
            if (isNaN(arrows)) {
                arrows = -1;
            }
        }
        for (let i = 0; i < COMMAS[updown].length; ++i) {
            result[i] += arrows * COMMAS[updown][i];
        }
    });
    const intervalClass = parseInt(token);
    const octave = Math.floor((intervalClass - 1)/7);
    const basicClass = intervalClass - octave*7;

    const baseLookUp = quality + basicClass;
    const baseVector = BASIC_INTERVALS[baseLookUp];
    result[0] += octave + baseVector[0];
    result[1] += baseVector[1];
    return result;
}

function parseHarmony(text, extraChords) {
    const result = [];
    const pitch = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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
            const interval = parseInterval(intervalToken);
            const chord = [];
            if (chordToken == "U") {
                chord.push("P1");
            } else {
                let chordTones;
                if (chordToken in extraChords) {
                    chordTones = extraChords[chordToken];
                } else {
                    chordTones = parseChord(chordToken);
                }
                chordTones.forEach(chordTone => {
                    chord.push(parseInterval(chordTone));
                });
            }
            const inversion = parseInt(inversionToken);
            for (let i = 0; i < inversion; ++i) {
                chord[i][0] += 1;
            }
            if (inversion > 0) {
                for (let i = 0; i < chord.length; ++i) {
                    chord[i][0] -= 1;
                }
            }
            for (let i = 0; i < pitch.length; ++i) {
                pitch[i] += interval[i]*direction;
            }
            if (duration > 0) {
                const notes = [];
                for (let j = 0; j < chord.length; ++j) {
                    const notePitch = [];
                    for (let i = 0; i < pitch.length; ++i) {
                        notePitch.push(pitch[i] + chord[j][i]);
                    }
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

function notate(pitch) {
    const twos = pitch[0] || 0;
    const threes = pitch[1] || 0;
    let fives = pitch[2] || 0;
    const sevens = pitch[3] || 0;
    const elevens = pitch[4] || 0;
    let thirteens = pitch[5] || 0;
    const seventeens = pitch[6] || 0;
    const nineteens = pitch[7] || 0;
    const twentythrees = pitch[8] || 0;
    const twentynines = pitch[9] || 0;

    let islands = 0;
    if (thirteens > 0 && fives < 0) {
        islands = Math.min(thirteens, -fives);
    }
    if (thirteens < 0 && fives > 0) {
        islands = Math.max(thirteens, -fives);
    }
    thirteens -= islands;
    fives += islands;

    const index = LYDIAN_INDEX_A + threes + fives*4 - 2*sevens - elevens + 3*thirteens - 5*seventeens - 3*nineteens + 6*twentythrees - 2*twentynines + 4*islands;
    const sharps = Math.floor(index / LYDIAN.length);
    const letter = LYDIAN[mod(index, LYDIAN.length)];
    const arrows = -fives;

    const edo12 = twos*12 + threes*19 + fives*28 + sevens*34 + elevens*42 + thirteens*44 + seventeens*49 + nineteens*51 + twentythrees*54 + twentynines*58 + islands*17;
    const octaves = REFERENCE_OCTAVE + Math.floor((edo12 + INDEX_A_12EDO)/12);

    return {
        letter,
        sharps,
        octaves,
        "+-": -fives,
        "><": -sevens,
        "^v": elevens,
        "*/": -thirteens,
        "ud": seventeens,
        "UD": nineteens,
        "AV": twentythrees,
        "MW": twentynines,
        "i!": islands,
    };
}

function tokenizeNotation(notation) {
    let sharps = notation.sharps;
    let accidental = "";
    if (sharps > 0) {
        if (sharps % 2) {
            accidental = "#";
            sharps -= 1;
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
    UPDOWNS.forEach(updown => {
        const amount = notation[updown];
        if (amount > 0) {
            arrows += updown[0];
        } else if (amount < 0) {
            arrows += updown[1];
        }
        if (Math.abs(amount) > 1) {
            arrows += Math.abs(amount);
        }
    });
    return notation.letter + notation.octaves + accidental + arrows;
}

function updateAbsolutePitches(notess) {
    const el = document.getElementById('absolute');
    tokens = [];
    notess.forEach(notes => {
        let token;
        if (notes.length == 1) {
            token = tokenizeNotation(notate(notes[0].pitch));
        } else {
            subtokens = [];
            notes.forEach(note => {
                subtokens.push(tokenizeNotation(notate(note.pitch)));
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

    const mapping = JI;

    playEl.onclick = e => {
        const config = parseConfiguration(textEl.value);
        const notess = parseHarmony(config.unparsed, YA_CHORDS);
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
                for (let j = 0; j < notes[i].pitch.length; ++j) {
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
