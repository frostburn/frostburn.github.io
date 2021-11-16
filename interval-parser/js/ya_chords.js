// Ya = 5-limit = 2.3.5 subgroup
const YA_CHORDS = {
    "U": ["P1"],

    "sus2": ["P1", "M2", "P5"],
    "sus4": ["P1", "P4", "P5"],
    "quartal": ["P1", "P4", "m7"],
    "quintal": ["P1", "P5", "M9"],

    "sus2d": ["P1", "M2d", "P5"],
    "qu": ["P1", "P4", "m7u"],
    "qd": ["P1", "P5", "M9d"],

    "sus2add6": ["P1", "M2", "P5", "M6"],
    "sus2dadd6": ["P1", "M2d", "P5", "M6"],
    "sus2add6d": ["P1", "M2", "P5", "M6d"],
    "sus2dadd6d": ["P1", "M2d", "P5", "M6d"],

    "sus2add4": ["P1", "M2", "P4", "P5"],
    "sus2add4u": ["P1", "M2", "P4u", "P5"],

    "M": ["P1", "M3d", "P5"],

    "M7": ["P1", "M3d", "P5", "M7d"],
    "M7add2": ["P1", "M2", "M3d", "P5", "M7d"],
    "M7add6": ["P1", "M3d", "P5", "M6", "M7d"],
    "M7add6d": ["P1", "M3d", "P5", "M6d", "M7d"],
    "M7add6dno3": ["P1", "P5", "M6d", "M7d"],

    "m": ["P1", "m3u", "P5"],

    "m7": ["P1", "m3u", "P5", "m7u"],

    "7": ["P1", "M3d", "P5", "m7u"],
    "dom": ["P1", "M3d", "P5", "m7"],

    "M7no3": ["P1", "P5", "M7d"],
    "M7no5": ["P1", "M3d", "M7d"],
    "m7no3": ["P1", "P5", "m7u"],
    "domno3": ["P1", "P5", "m7"],

    "6no3": ["P1", "P5", "M6"],
    "6dno3": ["P1", "P5", "M6d"],

    "b6no3": ["P1", "P5", "m6u"],

    "o": ["P1", "m3u", "d5u2"],
    "dim": ["P1", "m3u", "d5u2"],
    "dim7": ["P1", "m3u", "d5u2", "d7u3"],
    "o10": ["P1", "m3u", "d5u2", "M10d"],
    "dim10": ["P1", "m3u", "d5u2", "M10d"],
    "o11": ["P1", "m3u", "d5u2", "P11"],
    "o11u": ["P1", "m3u", "d5u2", "P11u"],
    "dim11": ["P1", "m3u", "d5u2", "P11"],
    "dim11u": ["P1", "m3u", "d5u2", "P11u"],

    "+": ["P1", "M3d", "A5d2"],
    "aug": ["P1", "M3d", "A5d2"],
    "+b10": ["P1", "M3d", "A5d2", "m10u"],
    "augb10": ["P1", "M3d", "A5d2", "m10u"],

    "ø":     ["P1", "m3u", "d5u2", "m7u"],
    "hdim":  ["P1", "m3u", "d5u2", "m7u"],
    "ø7":    ["P1", "m3u", "d5u2", "m7u"],
    "hdim7": ["P1", "m3u", "d5u2", "m7u"],

    "hdom":  ["P1", "m3u", "d5u2", "m7"],

    "mM7": ["P1", "m3u", "P5", "M7d"],

    "add2": ["P1", "M2", "M3d", "P5"],
    "add4": ["P1", "M3d", "P4", "P5"],

    "6": ["P1", "M3d", "P5", "M6"],
    "6d": ["P1", "M3d", "P5", "M6d"],

    "madd2": ["P1", "M2", "m3u", "P5"],
    "madd4": ["P1", "m3u", "P4", "P5"],
    "madd4u": ["P1", "m3u", "P4u", "P5"],

    "m6": ["P1", "m3u", "P5", "M6"],
    "m6d": ["P1", "m3u", "P5", "M6d"],

    "+7": ["P1", "M3d", "A5d2", "m7u"],
    "+dom": ["P1", "M3d", "A5d2", "m7"],
    "aug7": ["P1", "M3d", "A5d2", "m7u"],
    "augdom": ["P1", "M3d", "A5d2", "m7"],

    "M7+": ["P1", "M3d", "A5d2", "M7d"],

    "M7+6add2": ["P1", "M2", "M3d", "P5", "A5d2", "M6", "M7d"],
    "M7+6add2#4": ["P1", "M2", "M3d", "P5", "A5d2", "M6", "M7d", "A4d"],

    "7b5": ["P1", "m3u", "d5u2", "m7u"],

    "6/9": ["P1", "M3d", "P5", "M6", "M9"],
    "6d/9": ["P1", "M3d", "P5", "M6d", "M9"],
    "6/9d": ["P1", "M3d", "P5", "M6", "M9d"],
    "6d/9d": ["P1", "M3d", "P5", "M6d", "M9d"],

    "m6/9": ["P1", "m3u", "P5", "M6", "M9"],
    "m6d/9": ["P1", "m3u", "P5", "M6d", "M9"],
    "m6/9d": ["P1", "m3u", "P5", "M6", "M9d"],
    "m6d/9d": ["P1", "m3u", "P5", "M6d", "M9d"],

    "M9": ["P1", "M3d", "P5", "M7d", "M9"],
    "M9no5": ["P1", "M3d", "M7d", "M9"],
    "M9d": ["P1", "M3d", "P5", "M7d", "M9d"],
    "M9dno5": ["P1", "M3d", "M7d", "M9d"],

    "m9": ["P1", "m3u", "P5", "m7u", "M9"],

    "9": ["P1", "M3d", "P5", "m7u", "M9"],
    "9d": ["P1", "M3d", "P5", "m7u", "M9d"],
    "dom9": ["P1", "M3d", "P5", "m7", "M9"],
    "dom9d": ["P1", "M3d", "P5", "m7", "M9d"],

    "mb9u": ["P1", "m3u", "P5", "m7u", "m9u"],
    "mb6u/b9u": ["P1", "m3u", "P5", "m6u", "m7u", "m9u"],

    "Mb10": ["P1", "M3d", "P5", "M7d", "m10u"],
    "Mb10no5": ["P1", "M3d", "M7d", "m10u"],

    "m10": ["P1", "M10d", "P5", "m7u", "m3u"],
    "m10no5": ["P1", "M10d", "m7u", "m3u"],

    "7b10": ["P1", "M3d", "P5", "m7u", "m10u"],
    "7b10no5": ["P1", "M3d", "m7u", "m10u"],
    "domb10": ["P1", "M3d", "P5", "m7", "m10"],
    "domb10u": ["P1", "M3d", "P5", "m7", "m10u"],

    "7b9": ["P1", "M3d", "P5", "m7u", "m9u2"],
    "domb9": ["P1", "M3d", "P5", "m7", "m9u"],

    "M11": ["P1", "M3d", "P5", "M7d", "M9", "P11"],
    "M11u": ["P1", "M3d", "P5", "M7d", "M9", "P11u"],

    "11": ["P1", "M3d", "P5", "m7u", "M9", "P11"],
    "11u": ["P1", "M3d", "P5", "m7u", "M9", "P11u"],
    "dom11": ["P1", "M3d", "P5", "m7", "M9", "P11"],
    "dom11u": ["P1", "M3d", "P5", "m7", "M9", "P11u"],
    "dom11du": ["P1", "M3d", "P5", "m7", "M9d", "P11u"],

    "m11": ["P1", "m3u", "P5", "m7u", "M9", "P11"],
    "m11u": ["P1", "m3u", "P5", "m7u", "M9", "P11u"],

    "M#11": ["P1", "M3d", "P5", "M7d", "M9", "A11d"],

    "#11": ["P1", "M3d", "P5", "m7u", "M9", "A11d"],
    "b12u": ["P1", "M3d", "P5", "m7u", "M9", "d12u2"],
    "domb12": ["P1", "M3d", "P5", "m7", "M9", "d12u"],
    "domb12d": ["P1", "M3d", "P5", "m7", "M9d", "d12u"],

    "M13": ["P1", "M3d", "P5", "M7d", "M9", "M13"],
    "M13d": ["P1", "M3d", "P5", "M7d", "M9", "M13d"],

    "13": ["P1", "M3d", "P5", "m7u", "M9", "M13"],
    "13d": ["P1", "M3d", "P5", "m7u", "M9", "M13d"],
    "dom13": ["P1", "M3d", "P5", "m7", "M9", "M13"],
    "dom13d": ["P1", "M3d", "P5", "m7", "M9", "M13d"],
    "dom13d1": ["P1", "M3d", "P5", "m7", "M9d", "M13"],
    "dom13d2": ["P1", "M3d", "P5", "m7", "M9d", "M13d"],

    "m13": ["P1", "m3u", "P5", "m7u", "M9", "M13"],
    "m13d": ["P1", "m3u", "P5", "m7u", "M9", "M13d"],


    "TetrisI": ["P1", "M2", "P5", "M6"],  // Same as sus2add6
    "TetrisIquintal": ["P1", "P5", "M9", "M13"],
    "TetrisIquartal": ["P1", "P4", "m7", "m10"],
    "TetrisI+": ["P1", "M3d", "A5d2", "A7d3"],

    "TetrisL": ["P1", "M2", "M3d", "P5"],  // Same as add2
    "TetrisL+add2": ["P1", "A2d2", "M3d", "A5d2"],
    "TetrisL+9": ["P1", "A9d2", "M3d", "A5d2"],
    "TetrisL+add4": ["P1", "M3d", "P4", "A5d2"],
    "TetrisL+11": ["P1", "M3d", "P11", "A5d2"],
    "TetrisLsus7": ["P1", "M2", "P5", "m7u"],
    "TetrisLmadd4": ["P1", "m3u", "P4", "P5"],  // Same as madd4

    "TetrisJ": ["P1", "M2", "P5", "m6u"],
    "TetrisJ+add8": ["P1", "A8d2", "M3d", "A5d2"],
    "TetrisJ#11": ["P1", "P5", "M9", "A11d"],
    "TetrisJ+12": ["P1", "M3d", "P12", "A5d2"],
    "TetrisJ#12": ["P1", "M3d", "P5", "A12d2"],

    "TetrisT": ["P1", "M3d", "A5d2", "M6d"],
    "TetrisT+7": ["P1", "M3d", "A5d2", "M7d"], // # Same as M7+
    "TetrisTsus7": ["P1", "M2", "P5", "M7d"],
    "TetrisTadd4": ["P1", "M3d", "P4", "P5"],  // Same as add4
    "TetrisTmadd2": ["P1", "M2", "m3u", "P5"],  // Same as madd2

    "TetrisZ": ["P1", "m10u", "M3d", "P5"],
    "TetrisZ#11": ["P1", "P5", "M7d", "A11d"],

    "TetrisS": ["P1", "P5", "m6u", "M7d"],
    "TetrisSm7": ["P1", "m3u", "P5", "m7u"],  // Same as m7

    "TetrisO": ["P1", "M3d", "P5", "M7d"],  // Same as M7

    "HexHelmet": ["P1", "P5", "M7d", "A12d2"],
    "HexHockey+": ["P1", "M3d", "A5d2", "A10d3"],
    "HexMouse": ["P1", "M3d", "P4", "m10u"],
    "HexMoldorm": ["P1", "m3u", "P5", "d12u2"],
    "HexRocket": ["P1", "P5", "M6d", "m13u"],
    "HexWorm": ["P1", "M3d", "A8d2", "m10u"],
    "HexHockeyo": ["P1", "m3u", "d5u2", "m9u2"],
    "HexHockeyo10": ["P1", "m3u", "d5u2", "d10u3"],
    "HexVine": ["P1", "P5", "M6d", "m7u"],
    "HexMoldorm#8": ["P1", "M3d", "P5", "A8d2"],
    "HexVisor": ["P1", "P5", "m7u", "d12u2"],
    "HexSnake": ["P1", "M3d", "d8u2", "m10u"],
};
