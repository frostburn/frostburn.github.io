const EPSILON = 1e-6;

const TETRIS = {
    KeyI: [[-1, 1, 0], [-3, 2, 0], [2, -1, 0]],
    Slash: [[-2, 0, 1], [-4, 0, 2], [-6, 0, 3]],  // Dash on a Finnish Keyboard

    KeyT: [[-2, 0, 1], [3, 0, -1], [2, -1, 0]],
    KeyA: [[-2, 0, 1], [3, 0, -1], [-1, 1, 0]],
    KeyD: [[2, -1, 0], [-1, 1, 0], [-2, 0, 1]],
    KeyX: [[2, -1, 0], [-1, 1, 0], [3, 0, -1]],

    KeyL: [[2, -1, 0], [-1, 1, 0], [0, -1, 1]],
    Minus: [[2, -1, 0], [-1, 1, 0], [1, 1, -1]],  // Question mark on a Finnish Keyboard
    KeyF: [[-2, 0, 1], [-4, 0, 2], [2, -1, 0]],
    KeyY: [[-2, 0, 1], [3, 0, -1], [-3, 1, 1]],

    KeyJ: [[2, -1, 0], [-1, 1, 0], [4, -1, -1]],
    KeyP: [[2, -1, 0], [-1, 1, 0], [-3, 1, 1]],
    Comma: [[-2, 0, 1], [3, 0, -1], [4, -1, -1]],
    KeyU: [[-2, 0, 1], [-4, 0, 2], [-1, 1, 0]],

    KeyS: [[-1, 1, 0], [-3, 1, 1], [3, 0 -1]],

    KeyZ: [[-1, 1, 0], [1, 1, -1], [-2, 0, 1]],
    Digit5: [[2, -1, 0], [-3, 1, 1], [-2, 0, 1]],
};

function mod(n, m) {
    return ((n % m) + m) % m;
}

const cyrb53 = function(i, j, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    h1 = Math.imul(h1 ^ i, 2654435761);
    h2 = Math.imul(h2 ^ i, 1597334677);
    h1 = Math.imul(h1 ^ j, 2654435761);
    h2 = Math.imul(h2 ^ j, 1597334677);
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
};

const LYDIAN = ["F", "C", "G", "D", "A", "E", "B"];

function notename(threes, fives) {
    const index = 1 + threes + fives*4;
    const sharps = Math.floor(index / LYDIAN.length);
    const letter = LYDIAN[mod(index, LYDIAN.length)];
    let accidental;
    if (sharps == 0) {
        accidental = '\u266E';
        if (fives > 0) {
            accidental = '\u{1D12F}';
        }
        else if (fives < 0) {
            accidental = '\u{1D12E}';
        }
    }
    else if (sharps == 1) {
        accidental = '\u266F';
        if (fives > 0) {
            accidental = '\u{1D131}';
        }
        else if (fives < 0) {
            accidental = '\u{1D130}';
        }
    }
    else if (sharps == -1) {
        accidental = '\u266D';
        if (fives > 0) {
            accidental = '\u{1D12D}';
        }
        else if (fives < 0) {
            accidental = '\u{1D12C}';
        }
    }
    else if (sharps >= 2) {
        accidental = '\u{1D12A}';
    }
    else if (sharps <= -2) {
        accidental = '\u{1D12B}';
    }

    if (Math.abs(sharps) >= 2) {
        let s = sharps;
        while (s > 2) {
            if (s > 3) {
                accidental += '\u{1D12A}';
                s -= 2;
            }
            else {
                accidental = '\u266F' + accidental;
                s -= 1;
            }
        }
        while (s < -2) {
            if (s < -3) {
                accidental += '\u{1D12B}';
                s += 2;
            }
            else {
                accidental = '\u266D' + accidental;
                s += 1;
            }
        }
        if (fives > 0) {
            accidental += '\u{1F813}';
        }
        else if (fives < 0) {
            accidental += '\u{1F811}';
        }
    }

    result = letter + accidental;
    if (Math.abs(fives) > 1) {
        result += Math.abs(fives);
    }
    return result;
}

let ACTIVE_CHORD = null;

function canonize(threes, fives, horogram) {
    if (horogram == "dicot") {
        // return [0, fives + 2*threes];
        // return [4*(fives + 2*threes), 0];
        const permutation = [0, 4, 1, 5, 2, 6, 3];
        const num = fives + 2*threes;
        return [Math.floor(num/permutation.length)*permutation.length + permutation[mod(num, permutation.length)], 0];
    }
    if (horogram == "meantone") {
        return [threes + 4*fives, 0];
    }
    if (horogram == "augmented") {
        return [threes, fives - Math.floor((fives+1)/3)*3];
    }
    if (horogram == "mavila") {
        return [threes - 3*fives, 0];
    }
    if (horogram == "porcupine") {
        if (fives % 3 == 0) {
            return [threes+5*fives/3, 0];
        }
        else if (mod(fives, 3) == 1) {
            return [threes+5*(fives-1)/3, 1];
        }
        else {
            return [threes+5*(fives+1)/3, -1];
        }
    }
    if (horogram == "blackwood") {
        // return [threes - Math.floor((threes + 2)/5)*5, fives];
        threes = threes - Math.floor((threes + 1)/5)*5;
        if (threes == 3) {
            return [threes + 4*fives + 4, -1];
        }
        return [threes + 4*fives, 0];
    }
    if (horogram == "dimipent") {
        const f = Math.floor((fives+2)/4);
        return [threes + f*4, fives - f*4];
    }
    if (horogram == "srutal") {
        if (fives % 2 == 0) {
            return [threes - 2*fives, 0];
        } else {
            return [threes - 2*(fives-1), 1];
        }
    }
    if (horogram == "magic") {
        // return [0, fives + 5*threes];
        const fifths_19edo = [0, 7, 14, 2, 9, 16, 4, 11, 18, 6, 13, 1, 8, 15, 3, 10, 17, 5, 12];
        const id = fives + 5*threes;
        const edo19 = mod(threes*30 + fives*44, 19);
        const meantone = fifths_19edo[edo19];
        const arrows = Math.floor(id/19);
        return [meantone + arrows*4, -arrows];
    }
    if (horogram == "ripple") {
        const m = fives - Math.floor((fives+2)/5)*5;
        return [threes + 8*(fives - m)/5, m];
    }
    if (horogram == "hanson") {
        const m = fives - Math.floor((fives+3)/6)*6;
        return [threes + 5*(fives - m) / 6, m];
    }
    if (horogram == "negripent") {
        const m = fives - Math.floor((fives+2)/4)*4;
        return [threes - 3*(fives - m)/4, m];
    }
    return [threes, fives];
}

function populateLattice(context, voices) {
    // const horogram = "JI";
    // const mapping = [Math.log(2), Math.log(3), Math.log(5)];
    // const horogram = "dicot";
    // const mapping = [0.70100704, 1.100135, 1.60157806];
    // const mapping = [Math.log(2), Math.log(3), Math.log(24)*0.5];
    // const mapping = [Math.log(2), Math.log(6/5)*2, Math.log(24/5)];
    // const horogram = "meantone";
    // const mapping = [0.69465294, 1.09710653, 1.60981435];
    // const mapping = [Math.log(2), Math.log(5)*0.25 + Math.log(2), Math.log(5)];
    // const horogram = "augmented";
    // const mapping = [0.69077553, 1.09939323, 1.61180957];
    // const horogram = "mavila";
    // const mapping = [0.69805797, 1.0937015, 1.60530132];
    // const horogram = "porcupine";
    // const mapping = [0.69192113, 1.10200897, 1.60604123];
    // const horogram = "blackwood";
    // const mapping = [0.68913826, 1.10262121, 1.61101742];
    // const horogram = "dimipent";
    // const mapping = [0.69050286, 1.09508653, 1.61296367];
    const horogram = "srutal";
    const mapping = [0.69248279, 1.09927668, 1.61010196];
    // const horogram = "magic";
    // const mapping = [0.69430008, 1.09842424, 1.60828501];
    // const horogram = "ripple";
    // const mapping = [0.69410165, 1.0949502,  1.6131];
    // const horogram = "hanson";
    // const mapping = [0.69343685, 1.09885368, 1.60914825];
    // const horogram = "negripent";
    // const mapping = [0.69461467, 1.09757457, 1.60797042];

    const draw = SVG().addTo("#lattice").size(1100, 750);

    const points = [];
    for (let i = 0; i < 6; ++i) {
        const theta = 2*Math.PI/6*i;
        points.push([Math.cos(theta), Math.sin(theta)]);
    }
    for (let j = 0; j < 20; j++) {
        for (let i = 0; i < 31; i++) {
            const fives = i-15;
            const threes = 11 - j - Math.floor(fives/2);
            const tf = canonize(threes, fives, horogram);
            const x = 1.05*1.5*i;
            const y = 1.05*Math.sqrt(3)*(j+0.5*(i%2));
            const r = cyrb53(tf[0], tf[1], 1);
            const g = cyrb53(tf[0], tf[1], 2);
            const b = cyrb53(tf[0], tf[1], 3);
            const color = "rgb(" + (mod(r, 200)+56) + "," + (mod(g, 200)+56) + "," + (mod(b, 200)+56) + ")";
            const hexagon = draw.polygon(points).scale(20).move(x, y).fill(color);
            const label = draw.text(notename(tf[0], tf[1])).font({size: 15}).move(20*(x+0.5), 20*(y+0.5));

            const makeSound = e => {
                context.resume();
                let pitch = mapping[1]*threes + mapping[2]*fives;
                while (pitch < 0) {
                    pitch += mapping[0];
                }
                while (pitch >= mapping[0] || Math.abs(pitch - mapping[0]) < EPSILON) {
                    pitch -= mapping[0];
                }
                voices[0][0].frequency.setValueAtTime(220*Math.exp(pitch), context.currentTime);
                if (ACTIVE_CHORD !== null) {
                    for (let i = 0; i < 3; ++i) {
                        voices[i+1][0].frequency.setValueAtTime(
                            220*Math.exp(pitch + ACTIVE_CHORD[i][0]*mapping[0] + ACTIVE_CHORD[i][1]*mapping[1] + ACTIVE_CHORD[i][2]*mapping[2]),
                            context.currentTime
                        );
                        voices[i+1][1].gain.setValueAtTime(0.2, context.currentTime);
                    }
                } else {
                    if (e.ctrlKey || e.altKey || e.shiftKey) {
                        voices[1][0].frequency.setValueAtTime(220*Math.exp(pitch + mapping[1] - mapping[0]), context.currentTime);
                        voices[0][1].gain.setValueAtTime(0.2, context.currentTime);
                        voices[1][1].gain.setValueAtTime(0.2, context.currentTime);
                        voices[2][1].gain.setValueAtTime(0.2, context.currentTime);
                    }
                    if (e.ctrlKey && e.altKey) {
                        if (e.shiftKey) {
                            voices[2][0].frequency.setValueAtTime(220*Math.exp(pitch + mapping[2] - 2*mapping[0]), context.currentTime);
                            voices[3][0].frequency.setValueAtTime(220*Math.exp(pitch + 2*mapping[1] - mapping[2]), context.currentTime);
                        } else {
                            voices[2][0].frequency.setValueAtTime(220*Math.exp(pitch + mapping[1] - mapping[2] + mapping[0]), context.currentTime);
                            voices[3][0].frequency.setValueAtTime(220*Math.exp(pitch + mapping[1] + mapping[2] - 3*mapping[0]), context.currentTime);
                        }
                        voices[3][1].gain.setValueAtTime(0.2, context.currentTime);
                    } else if (e.ctrlKey) {
                        voices[2][0].frequency.setValueAtTime(220*Math.exp(pitch + mapping[2] - 2*mapping[0]), context.currentTime);
                        if (e.shiftKey) {
                            voices[3][0].frequency.setValueAtTime(220*Math.exp(pitch + mapping[1] + mapping[2] - 3*mapping[0]), context.currentTime);
                            voices[3][1].gain.setValueAtTime(0.2, context.currentTime);
                        } else {
                            voices[3][1].gain.setValueAtTime(0.0, context.currentTime);
                        }
                    } else if (e.altKey) {
                        voices[2][0].frequency.setValueAtTime(220*Math.exp(pitch + mapping[1] - mapping[2] + mapping[0]), context.currentTime);
                        if (e.shiftKey) {
                            voices[3][0].frequency.setValueAtTime(220*Math.exp(pitch + 2*mapping[1] - mapping[2]), context.currentTime);
                            voices[3][1].gain.setValueAtTime(0.2, context.currentTime);
                        } else {
                            voices[3][1].gain.setValueAtTime(0.0, context.currentTime);
                        }
                    } else if (e.shiftKey) {
                        voices[2][0].frequency.setValueAtTime(220*Math.exp(pitch - mapping[1] + 2*mapping[0]), context.currentTime);
                    }
                    else {
                        voices[0][1].gain.setValueAtTime(0.4, context.currentTime);
                        voices[1][1].gain.setValueAtTime(0.0, context.currentTime);
                        voices[2][1].gain.setValueAtTime(0.0, context.currentTime);
                        voices[3][1].gain.setValueAtTime(0.0, context.currentTime);
                    }
                }
            }

            hexagon.on("mousedown", makeSound);
            label.on("mousedown", makeSound);
        }
    }
}

function main() {
    const context = new AudioContext({latencyHint: "interactive"});
    context.suspend();

    let freq = 220;
    const generator = 2;
    const modulus = 3;

    const voices = [];
    for (let i = 0; i < 4; ++i) {
        const oscillator = context.createOscillator();
        oscillator.type = "triangle";
        const gain = context.createGain();
        gain.gain.setValueAtTime(0.0, context.currentTime);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start();
        voices.push([oscillator, gain]);
    }
    document.addEventListener('keydown', function(e) {
        context.resume();
        // console.log(e.code);
        const chord = TETRIS[e.code];
        if (chord !== undefined) {
            ACTIVE_CHORD = chord;
        }
        if (e.code == "Space" || e.code == "Escape") {
            for (let i = 0; i < voices.length; ++i) {
                voices[i][1].gain.setValueAtTime(0.0, context.currentTime);
            }
        }
    });
    document.addEventListener('keyup', function(e) {
        ACTIVE_CHORD = null;
    });

    populateLattice(context, voices);
}
