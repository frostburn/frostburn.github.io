const CHORD_MODIFIERS = {
    "2": "M2",
    "3": "M3",
    "4": "P4",
    "5": "P5",
    "6": "M6",
    "7": "M7",
    "8": "P8",
    "9": "M9",
    "10": "M10",
    "11": "P11",
    "12": "P12",
    "13": "M13",
    "14": "M14",
    "15": "P15",
    "16": "M16",
    "17": "M17",
    "18": "P18",
    "19": "P19",

    "b2": "m2",
    "#2": "A2",
    "b3": "m3",
    "#3": "A3",
    "b4": "d4",
    "#4": "A4",
    "b5": "d5",
    "#5": "A5",
    "b6": "m6",
    "#6": "A6",
    "b7": "m7",
    "#7": "A7",
    "b8": "d8",
    "#8": "A8",
    "b9": "m9",
    "#9": "A9",
    "b10": "m10",
    "#10": "A10",
    "b11": "d11",
    "#11": "A11",
    "b12": "d12",
    "#12": "A12",
    "b13": "m13",
    "#13": "A13",
    "b14": "m14",
    "#14": "A14",
    "b15": "d15",
    "#15": "A15",
    "b16": "m16",
    "#16": "A16",
    "b17": "m17",
    "#17": "A17",
    "b19": "d19",
    "#19": "A19",
};

const CHORDS = {
    "sus2": [["P1", "M2", "P5"], [1]],
    "sus4": [["P1", "P4", "P5"], [1]],
    "quartal": [["P1", "P4", "m7"], [1, 2]],
    "quintal": [["P1", "P5", "M9"], [2]],

    "M": [["P1", "M3", "P5"], [1]],

    "M7": [["P1", "M3", "P5", "M7"], [1, 3]],

    "m": [["P1", "m3", "P5"], [1]],

    "m7": [["P1", "m3", "P5", "m7"], [1, 3]],

    "dom": [["P1", "M3", "P5", "m7"], [1]],

    "M9": [["P1", "M3", "P5", "M7", "M9"], [1, 3]],

    "m9": [["P1", "m3", "P5", "m7", "M9"], [1, 3]],

    "mb9": [["P1", "m3", "P5", "m7", "m9"], [1, 3, 4]],

    "dom9": [["P1", "M3", "P5", "m7", "M9"], [1]],

    "M11": [["P1", "M3", "P5", "M7", "M9", "P11"], [1, 3, 5]],

    "m11": [["P1", "m3", "P5", "m7+", "M9", "P11"], [1, 3, 5]],

    "M#11": [["P1", "M3", "P5", "M7", "M9", "A11"], [1, 3, 5]],

    "dom11": [["P1", "M3", "P5", "m7", "M9", "P11"], [1]],

    "domb12": [["P1", "M3-", "P5", "m7", "M9", "d12"], [1]],

    "M13": [["P1", "M3", "P5", "M7", "M9", "M13"], [1, 3, 5]],

    "dom13": [["P1", "M3-", "P5", "m7", "M9", "M13"], [1]],

    "M#15": [["P1", "M3", "P5", "M7", "M9", "M13", "A15"], [1, 3, 5]],
};

const IRREPLACABLES = ["sus2", "sus4", "quartal", "quintal"];


function parseChord(token) {
    let greed = 0;
    let result;
    Object.keys(CHORDS).forEach(modifiable => {
        if (token.startsWith(modifiable) && modifiable.length > greed) {
            [base, ...added] = token.slice(modifiable.length).split("add");
            let modifiers;
            let susReplacement;
            if (IRREPLACABLES.includes(modifiable)) {
                modifiers = base;
            } else {
                [modifiers, susReplacement] = base.split("sus");
            }
            const chord = [];
            CHORDS[modifiable][0].forEach(mtoken => chord.push(mtoken));
            CHORDS[modifiable][1].forEach(index => chord[index] += modifiers);
            if (susReplacement !== undefined) {
                if (susReplacement[0] in CHORD_MODIFIERS) {
                    chord[1] = CHORD_MODIFIERS[susReplacement[0]] + susReplacement.slice(1);
                } else if (susReplacement.slice(0, 2) in CHORD_MODIFIERS) {
                    chord[1] = CHORD_MODIFIERS[susReplacement.slice(0, 2)] + susReplacement.slice(2);
                } else if (susReplacement.slice(0, 3) in CHORD_MODIFIERS) {
                    chord[1] = CHORD_MODIFIERS[susReplacement.slice(0, 3)] + susReplacement.slice(3);
                }
            }
            added.forEach(addedToken => {
                if (addedToken[0] in CHORD_MODIFIERS) {
                    chord.push(CHORD_MODIFIERS[addedToken[0]] + addedToken.slice(1));
                } else if (addedToken.slice(0, 2) in CHORD_MODIFIERS) {
                    chord.push(CHORD_MODIFIERS[addedToken.slice(0, 2)] + addedToken.slice(2));
                } else if (addedToken.slice(0, 3) in CHORD_MODIFIERS) {
                    chord.push(CHORD_MODIFIERS[addedToken.slice(0, 3)] + addedToken.slice(3));
                }
            });
            result = chord;
            greed = modifiable.length;
        }
    });
    return result;
}
