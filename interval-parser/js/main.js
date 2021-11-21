const EPSILON = 1e-6;

function mod(n, m) {
    return ((n % m) + m) % m;
}

function isDigit(str) {
    return !isNaN(str);
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
Powers of thirteen correspond to 13 L-diesis 27/26 represented by * and %
Powers of seventeen correspond to 17 kleismas 4131/4096 represented by u and d
Powers of nineteen correspond to Boethius' commas 513/512 represented by U and D
Powers of twentythree correspond to 23 commas 736/729 represented by A and V
Powers of twentynine correspond to 29 S-diesis 261/256 represented by M and W

There's a large bonus modifier for 416/405 represented by i and !. It allows you to spell the Barbados third 13/10 as M3i instead of P4+%.
***/

const UPDOWNS = ["+-", "><", "^v", "*%", "ud", "UD", "AV", "MW", "i!"];

const ANY_UPDOWN = UPDOWNS.join("");

const COMMAS = {
    "+": [-4, 4, -1],
    "-": [4, -4, 1],
    ">": [6, -2, 0, -1],
    "<": [-6, 2, 0, 1],
    "^": [-5, 1, 0, 0, 1],
    "v": [5, -1, 0, 0, -1],
    "*": [-1, 3, 0, 0, 0, -1],
    "%": [1, -3, 0, 0, 0, 1],
    "u": [-12, 5, 0, 0, 0, 0, 1],
    "d": [12, -5, 0, 0, 0, 0, -1],
    "U": [-9, 3, 0, 0, 0, 0, 0, 1],
    "D": [9, -3, 0, 0, 0, 0, 0, -1],
    "A": [5, -6, 0, 0, 0, 0, 0, 0, 1],
    "V": [-5, 6, 0, 0, 0, 0, 0, 0, -1],
    "M": [-8, 2, 0, 0, 0, 0, 0, 0, 0, 1],
    "W": [8, -2, 0, 0, 0, 0, 0, 0, 0, -1],
    "i": [5, -4, -1, 0, 0, 1],
    "!": [-5, 4, 1, 0, 0, -1],
}

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
const JI = [Math.log(2), Math.log(3), Math.log(5), Math.log(7), Math.log(11), Math.log(13), Math.log(17), Math.log(19), Math.log(23), Math.log(29)];
const JI_SUBGROUP = [];
for (let i = 0; i < JI.length; ++i) {
    const vector = [];
    for (let j = 0; j < JI.length; ++j) {
        if (i == j) {
            vector.push(1);
        } else {
            vector.push(0);
        }
    }
    JI_SUBGROUP.push(vector);
}
const CENTS_MAPPING = Math.log(2) / 1200;
const HZ_MAPPING = 0;  // Hz offset requires special treatment. Mapped to nothing to reduce interference.
const CENTS_INDEX = JI.length;
const HZ_INDEX = CENTS_INDEX + 1;
const EXTRA_COORDS = 2;

function toVector(num) {
    if (num < 1) {
        throw "Non-vectorizable number";
    }
    const result = Array(JI.length).fill(0);
    for (let i = 0; i < result.length; ++i) {
        const p = PRIMES[i];
        while (num % p == 0) {
            num /= p;
            result[i] += 1;
        }
    }
    if (num != 1) {
        throw "Number not in 29-limit"
    }
    return result;
}

// TODO: Exponents
function parseNumericExpression(token) {
    [numerator, denominator] = token.split("/", 2);
    numerator = parseInt(numerator);
    denominator = parseInt(denominator || 1);
    const pitch = toVector(numerator);
    const denominatorPitch = toVector(denominator);
    for (let i = 0; i < pitch.length; ++i) {
        pitch[i] -= denominatorPitch[i];
    }
    return pitch;
}

function pitchToFraction(pitch) {
    let numerator = 1;
    let denominator = 1;
    for (let i = 0; i < PRIMES.length; ++i) {
        const coord = pitch[i] || 0;
        if (coord > 0) {
            numerator *= Math.pow(PRIMES[i], coord);
        } else {
            denominator *= Math.pow(PRIMES[i], -coord);
        }
    }
    return [numerator, denominator];
}

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

function parseInterval(token, generator) {
    let direction = 1;
    if (token[0] == "-") {
        direction = -1;
        token = token.slice(1);
    }
    if (token[0] == "+") {
        token = token.slice(1);
    }
    const result = Array(JI.length + EXTRA_COORDS).fill(0);
    if (token.endsWith("c")) {
        result[CENTS_INDEX] = parseFraction(token.slice(0, -1))*direction*CENTS_MAPPING;
        return result;
    } else if (token.endsWith("Hz")) {
        result[HZ_INDEX] = parseFraction(token.slice(0, -2))*direction;
        return result;
    } else if (isDigit(token[0])) {
        if (token.includes("\\")) {
            [steps, divisionsOfTwo] = token.split("\\", 2);
            if (divisionsOfTwo === undefined || divisionsOfTwo == "") {
                result[CENTS_INDEX] = parseFloat(steps)*generator*direction;
            } else {
                result[CENTS_INDEX] = direction*parseFloat(steps)*Math.log(2)/parseFloat(divisionsOfTwo);
            }
        } else {
            const pitch = parseNumericExpression(token);
            for (let i = 0; i < pitch.length; ++i) {
                result[i] = pitch[i]*direction;
            }
        }
        return result;
    }
    const quality = token[0];
    token = token.slice(1);

    const separated = []
    let currentArrowToken = "";
    token.split("").forEach(character => {
        if (ANY_UPDOWN.includes(character)) {
            separated.push(currentArrowToken);
            currentArrowToken = "";
        }
        currentArrowToken += character;
    });
    separated.push(currentArrowToken);
    token = separated[0];
    separated.slice(1).forEach(arrowToken => {
        if (arrowToken[0] in COMMAS) {
            let arrows = parseInt(arrowToken.slice(1));
            if (isNaN(arrows)) {
                arrows = 1;
            }
            const comma = COMMAS[arrowToken[0]];
            for (let i = 0; i < comma.length; ++i) {
                result[i] += arrows*comma[i];
            }
        }
    });

    const intervalClass = parseInt(token);
    const octave = Math.floor((intervalClass - 1)/7);
    const basicClass = intervalClass - octave*7;

    const baseLookUp = quality + basicClass;
    const baseVector = BASIC_INTERVALS[baseLookUp];
    result[0] += octave + baseVector[0];
    result[1] += baseVector[1];
    if (direction < 0) {
        for (let i = 0; i < result.length; ++i) {
            result[i] *= direction;
        }
    }
    return result;
}

function parseHarmony(text, extraChords, generator) {
    const result = [];
    const pitch = Array(JI.length + EXTRA_COORDS).fill(0);
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

        let floaty = false;
        let absolute = false;
        if (intervalToken[0] == "~") {
            floaty = true;
            intervalToken = intervalToken.slice(1);
        } else if (intervalToken[0] == "@") {
            absolute = true;
            intervalToken = intervalToken.slice(1);
        }

        const duration = parseFraction(durationToken);

        if (intervalToken != "Z") {
            const interval = Array(JI.length + EXTRA_COORDS).fill(0);
            intervalToken.split("&").forEach(subTone => {
                accumulate(interval, parseInterval(subTone, generator));
            });
            const chord = [];
            if (chordToken == "U") {
                chord.push(parseInterval("P1"));
            } else {
                let chordTones;
                if (chordToken.includes(":")) {
                    chordTones = chordToken.split(":");
                } else if (chordToken.includes(";")) {
                    chordTones = chordToken.split(";");
                } else {
                    chordTones = chordToken.split(",");
                }
                if (chordTones.length <= 1) {
                    if (chordToken in extraChords) {
                        chordTones = extraChords[chordToken];
                    } else {
                        chordTones = parseChord(chordToken);
                    }
                }
                chordTones.forEach(chordTone => {
                    const chordPitch = Array(JI.length + EXTRA_COORDS).fill(0);
                    chordTone.split("&").forEach(subTone => {
                        accumulate(chordPitch, parseInterval(subTone, generator));
                    });
                    chord.push(chordPitch);
                });
                // Otonal chords
                if (chordToken.includes(":")) {
                    const root = parseInterval(chordTones[0], generator);
                    chord.forEach(chordPitch => {
                        for (let i = 0; i < root.length; ++i) {
                            chordPitch[i] -= root[i];
                        }
                    });
                }
                // Utonal chords
                if (chordToken.includes(";")) {
                    const root = parseInterval(chordTones[0], generator);
                    chord.forEach(chordPitch => {
                        for (let i = 0; i < root.length; ++i) {
                            chordPitch[i] = root[i] - chordPitch[i];
                        }
                    });
                }
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
                if (absolute) {
                    pitch[i] = interval[i];
                } else {
                    pitch[i] += interval[i];
                }
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
            if (floaty) {
                for (let i = 0; i < pitch.length; ++i) {
                    pitch[i] -= interval[i];
                }
            }
        }
        time += duration;
    });

    return result;
}

function expandRepeats(text) {
    while (1) {
        let start = text.indexOf("|:");
        if (start < 0) {
            break;
        }
        let end = text.indexOf(":|");
        if (end < 0) {
            end = text.length;
        }
        const repeatedSection = text.slice(start+2, end).replace("|:", "|");  // To prevent infinite recursion
        let numRepeats;
        let endSection;
        if (isDigit(text[end+2])) {
            endSection = text.slice(end + 3);
            numRepeats = parseInt(text[end+2]);
        } else {
            endSection = text.slice(end + 2);
            numRepeats = 2;
        }
        let expanded = "";
        for (let i = 0; i < numRepeats; ++i) {
            expanded += "|" + repeatedSection;
        }
        text = text.slice(0, start) + "|" + expanded + "|" + endSection;
    }
    return text;
}

function parseConfiguration(text, temperaments) {
    let baseFrequency = 440;
    let unit = [1, 4];
    let tempo = [[1, 4], 120];
    let unparsed = [];
    let commaList;
    let divisions;
    let numberDivided;
    let gain = 1.0;
    let constraints;
    let subgroup = JI_SUBGROUP;
    let mapEDN = true;
    let doCommaReduction = false;
    let waveform = "triangle";

    text.split("\n").forEach(line => {
        line = line.split("$", 1)[0];
        if (line.startsWith("A:")) {
            baseFrequency = parseFloat(line.split(":", 2)[1]);
        }
        else if (line.startsWith("L:")) {
            [numerator, denominator] = line.split(":", 2)[1].split("/", 2);
            unit = [parseInt(numerator), parseInt(denominator)];
        }
        else if (line.startsWith("Q:")) {
            [beat, value] = line.split(":", 2)[1].split("=", 2);
            [numerator, denominator] = beat.split("/", 2);
            tempo = [[parseInt(numerator), parseInt(denominator)], parseInt(value)];
        } else if (line.startsWith("CL:")) {
            tokens = line.split(":", 2)[1].split(",");
            commaList = [];
            tokens.forEach(token => {
                commaList.push(parseNumericExpression(token.trim()));
            });
        } else if (line.startsWith("SG:")) {
            tokens = line.split(":", 2)[1].split(".");
            subgroup = [];
            tokens.forEach(token => {
                subgroup.push(parseNumericExpression(token.trim()));
            });
        } else if (line.startsWith("T:")) {
            const temperament = line.split(":", 2)[1].trim();
            [tokens, subgroupToken] = temperaments[temperament];
            commaList = [];
            subgroup = [];
            tokens.forEach(token => commaList.push(parseNumericExpression(token)));
            subgroupToken.split(".").forEach(token => subgroup.push(parseNumericExpression(token)));
        } else if (line.startsWith("EDO:")) {
            divisions = parseInt(line.split(":", 2)[1]);
            numberDivided = 2;
        } else if (line.startsWith("EDN:")) {
            [divisionsToken, dividedToken] = line.split(":", 2)[1].split(",", 2);
            divisions = parseInt(divisionsToken);
            numberDivided = parseFraction(dividedToken);
        } else if (line.startsWith("G:")){
            gain = parseFraction(line.split(":", 2)[1]);
        } else if (line.startsWith("C:")){
            constraints = [];
            line.split(":", 2)[1].split(",").forEach(token => constraints.push(parseInterval(token.trim())));
        } else if (line.startsWith("F:")) {
            const flags = line.split(":", 2)[1].split(",").map(f => f.trim());
            if (flags.includes("unmapEDN")) {
                mapEDN = false;
            }
            if (flags.includes("CR")) {
                doCommaReduction = true;
            }
        } else if (line.startsWith("WF:")) {
            waveform = line.split(":", 2)[1].trim();
        } else {
            unparsed.push(line.replaceAll("|", " "));
        }
    });
    beatDuration = 60/tempo[1] * (tempo[0][1]/tempo[0][0]) * (unit[0]/unit[1]);
    return {
        baseFrequency,
        waveform,
        beatDuration,
        commaList,
        subgroup,
        divisions,
        numberDivided,
        gain,
        constraints,
        mapEDN,
        doCommaReduction,
        unparsed: unparsed.join("\n")
    };
}

const PYTHAGOREAN_QUALITIES = ["m", "m", "m", "m", "P", "P", "P", "M", "M", "M", "M"];
const PYTHAGOREAN_INDEX_P1 = 5;

// TODO: Notate cents & Hz
function notateInterval(interval) {
    let twos = interval[0] || 0;
    let threes = interval[1] || 0;
    let fives = interval[2] || 0;
    const sevens = interval[3] || 0;
    const elevens = interval[4] || 0;
    let thirteens = interval[5] || 0;
    const seventeens = interval[6] || 0;
    const nineteens = interval[7] || 0;
    const twentythrees = interval[8] || 0;
    const twentynines = interval[9] || 0;

    let islands = 0;
    if (thirteens > 0 && fives < 0) {
        islands = Math.min(thirteens, -fives);
    }
    if (thirteens < 0 && fives > 0) {
        islands = Math.max(thirteens, -fives);
    }
    thirteens -= islands;
    fives += islands;

    twos += -4*fives + 6*sevens + 5*elevens -thirteens + 12*seventeens + 9*nineteens -5*twentythrees + 8*twentynines - 5*islands;
    threes += 4*fives - 2*sevens - elevens + 3*thirteens - 5*seventeens - 3*nineteens + 6*twentythrees - 2*twentynines + 4*islands;

    let index = threes + PYTHAGOREAN_INDEX_P1;
    let quality;
    if (index >= 0 && index < PYTHAGOREAN_QUALITIES.length) {
        quality = PYTHAGOREAN_QUALITIES[index];
    } else if (index < 0) {
        quality = "";
        while (index < 0) {
            quality += "d";
            index += 7;
        }
    } else {
        index -= PYTHAGOREAN_QUALITIES.length;
        quality = "";
        while (index >= 0) {
            quality += "A";
            index -= 7
        }
    }
    let value = 7*twos + 11*threes;
    let sign = "";
    if (value < 0) {
        sign = "-";
    }
    value = Math.abs(value) + 1;

    return {
        sign,
        quality,
        value,
        "+-": -fives,
        "><": -sevens,
        "^v": elevens,
        "*%": -thirteens,
        "ud": seventeens,
        "UD": nineteens,
        "AV": twentythrees,
        "MW": twentynines,
        "i!": islands,
    }
}

function tokenizeIntervalNotation(notation) {
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

    return notation.sign + notation.quality + notation.value + arrows;
}

const LYDIAN = ["F", "C", "G", "D", "A", "E", "B"];
const LYDIAN_INDEX_A = LYDIAN.indexOf("A");
const REFERENCE_OCTAVE = 4;
const INDEX_A_12EDO = 9;

// TODO: Notate cents & Hz
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
        "*%": -thirteens,
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

function updateAbsolutePitches(notess, commaList) {
    const el = document.getElementById('absolute');
    tokens = [];
    notess.forEach(notes => {
        let token;
        if (notes.length == 1) {
            let pitch = notes[0].pitch;
            if (commaList !== undefined) {
                pitch = commaReduce(pitch, commaList);
            }
            token = tokenizeNotation(notate(pitch));
        } else {
            subtokens = [];
            notes.forEach(note => {
                let pitch = note.pitch;
                if (commaList !== undefined) {
                    pitch = commaReduce(pitch, commaList);
                }
                subtokens.push(tokenizeNotation(notate(pitch)));
            });
            token = "(" + subtokens.join(",") + ")";
        }
        if (notes[0].duration != 1) {
            token += "[" + notes[0].duration + "]";
        }
        tokens.push(token);
    });
    el.textContent += tokens.join(" ") + "||";
}

const BASIC_WAVEFORMS = ["sine", "square", "sawtooth", "triangle"];
let WAVEFORMS;

function parseElementContent(textEl, voices, now) {
    const glideTime = 0.01;
    const attackTime = 0.01;
    const decayTime = 0.02;
    const silence = EPSILON;
    const text = expandRepeats(textEl.value);
    const config = parseConfiguration(text, TEMPERAMENTS);

    voices.forEach(voice => {
        if (BASIC_WAVEFORMS.includes(config.waveform)) {
            voice.oscillator.type = config.waveform;
        } else {
            voice.oscillator.setPeriodicWave(WAVEFORMS[config.waveform]);
        }
    });

    let mapping = [...JI];
    let generator = Math.log(2) / 12;
    if (config.divisions !== undefined) {
        generator = Math.log(config.numberDivided) / config.divisions;
    }
    if (config.divisions !== undefined && config.mapEDN) {
        mapping = [];
        JI.forEach(logPrime => mapping.push(generator*Math.round(logPrime/generator)));
    } else if (config.commaList !== undefined) {
        mapping = temper(config.commaList, JI, config.constraints);
        if (config.constraints === undefined) {
            mapping = minimax(mapping, JI);
        }
    }
    mapping.push(1);  // Cents are already mapped when parsed
    mapping.push(HZ_MAPPING);

    const notess = parseHarmony(config.unparsed, EXTRA_CHORDS, generator);
    if (config.doCommaReduction) {
        updateAbsolutePitches(notess, config.commaList);
    } else {
        updateAbsolutePitches(notess);
    }

    for (let i = 0; i < voices.length; ++i) {
        voices[i].oscillator.frequency.cancelScheduledValues(now);
        voices[i].gain.gain.cancelScheduledValues(now);
        voices[i].gain.gain.setValueAtTime(0.0, now);
    }

    notess.forEach(notes => {
        for (let i = 0; i < notes.length; ++i) {
            if (i >= voices.length) {
                continue;
            }
            let logRatio = 0;
            for (let j = 0; j < notes[i].pitch.length; ++j) {
                logRatio += mapping[j]*notes[i].pitch[j];
            }
            const frequency = config.baseFrequency * Math.exp(logRatio) + notes[i].pitch[HZ_INDEX];
            const time = notes[i].time * config.beatDuration + now;
            const duration = notes[i].duration * config.beatDuration;
            voices[i].oscillator.frequency.exponentialRampToValueAtTime(frequency, time);
            voices[i].oscillator.frequency.setValueAtTime(frequency, time + duration - glideTime);
            voices[i].gain.gain.setValueAtTime(silence, time);
            voices[i].gain.gain.exponentialRampToValueAtTime(Math.max(config.gain, silence), time + attackTime);
            voices[i].gain.gain.setValueAtTime(Math.max(config.gain, silence), time + duration - decayTime);
            voices[i].gain.gain.exponentialRampToValueAtTime(silence, time + duration);
        }
    });
}

function main() {
    const max_polyphony = 12;
    const context = new AudioContext();
    context.suspend();

    WAVEFORMS = createWaveforms(context);

    const globalGain = context.createGain();
    globalGain.connect(context.destination);
    globalGain.gain.setValueAtTime(0.199, context.currentTime);

    const voicess = [];
    for (let j = 0; j < 2; ++j) {
        const voices = [];
        for (let i = 0; i < max_polyphony; ++i) {
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            gain.gain.setValueAtTime(0.0, context.currentTime);
            oscillator.connect(gain).connect(globalGain);
            oscillator.start();
            voices.push({oscillator, gain});
        }
        voicess.push(voices);
    }

    const playEl = document.getElementById('play');
    const panicEl = document.getElementById('panic');
    const textEls = [document.getElementById('text0'), document.getElementById('text1')];
    const absoluteEl = document.getElementById('absolute');

    playEl.onclick = e => {
        absoluteEl.textContent = "";
        context.suspend();
        const now = context.currentTime;
        for (let i = 0; i < 2; ++i) {
            parseElementContent(textEls[i], voicess[i], now);
        }
        context.resume();
    }

    panicEl.onclick = e => {
        context.suspend();
    }
}
