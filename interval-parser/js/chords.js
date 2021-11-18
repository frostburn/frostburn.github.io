const CHORD_MODIFIERS = {
    "2": "M2",
    "4": "P4",
    "6": "M6",
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
    "b4": "d4",
    "#4": "A4",
    "b6": "m6",
    "b8": "d8",
    "#8": "A8",
    "b9": "m9",
    "b10": "m10",
    "b11": "d11",
    "#11": "A11",
    "b12": "d12",
    "#12": "A12",
    "b13": "m13",
    "b14": "m14",
    "b15": "d15",
    "#15": "A15",
    "b16": "m16",
    "b17": "m17",
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

    "M9": [["P1", "M3", "P5", "M7", "M9"], [1, 3]],

    "m9": [["P1", "m3", "P5", "m7", "M9"], [1, 3]],

    "mb9": [["P1", "m3", "P5", "m7", "m9"], [1, 3, 4]],

    "M11": [["P1", "M3", "P5", "M7", "M9", "P11"], [1, 3, 5]],

    "m11": [["P1", "m3", "P5", "m7+", "M9", "P11"], [1, 3, 5]],

    "M#11": [["P1", "M3", "P5", "M7", "M9", "A11"], [1, 3, 5]],

    "M13": [["P1", "M3", "P5", "M7", "M9", "M13"], [1, 3, 5]],

    "M#15": [["P1", "M3", "P5", "M7", "M9", "M13", "A15"], [1, 3, 5]],
};


function parseChord(token) {
    let greed = 0;
    let result;
    Object.keys(CHORDS).forEach(modifiable => {
        if (token.startsWith(modifiable) && modifiable.length > greed) {
            [modifiers, ...added] = token.slice(modifiable.length).split("add");
            const chord = [];
            CHORDS[modifiable][0].forEach(mtoken => chord.push(mtoken));
            CHORDS[modifiable][1].forEach(index => chord[index] += modifiers);
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
