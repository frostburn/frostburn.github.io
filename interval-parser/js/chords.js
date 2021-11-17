const CHORD_MODIFIERS = {
    "2": "M",
    "4": "P",
    "6": "M",
    "9": "M",
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
};


function parseChord(token) {
    let greed = 0;
    let result;
    Object.keys(CHORDS).forEach(modifiable => {
        if (token.startsWith(modifiable) && modifiable.length > greed) {
            [modifiers, added] = token.slice(modifiable.length).split("add", 2);
            const chord = [];
            CHORDS[modifiable][0].forEach(mtoken => chord.push(mtoken));
            CHORDS[modifiable][1].forEach(index => chord[index] += modifiers);
            if (added !== undefined) {
                const addedToken = CHORD_MODIFIERS[added[0]] + added;
                chord.push(addedToken);
            }
            result = chord;
            greed = modifiable.length;
        }
    });
    return result;
}
