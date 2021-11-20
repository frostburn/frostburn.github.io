// Ya = 5-limit = 2.3.5 subgroup
const YA = "2.3.5";
const YA_TEMPERAMENTS = {
    // Exotemperaments
    "father": ["15/16"],
    "bug": ["27/25"],
    // Main sequence
    "dicot": ["25/26"],
    "meantone": ["81/80"],
    "augmented": ["128/125"],
    "mavila": ["135/128"],
    "porcupine": ["250/243"],
    "blackwood": ["256/243"],
    "dimipent": ["648/625"],
    "diaschismic": ["2028/2025"],
    "magic": ["3125/3072"],
    "ripple": ["6561/6250"],
    "hanson": ["15625/15552"],
    "negripent": ["16875/16384"],
    "tetracot": ["20000/19683"],
    "superpyth": ["20480/19683"],
    "helmholtz": ["32805/32768"],
    "sensipent": ["78732/78125"],
    "passion": ["262144/253125"],
    "würschmidt": ["393216/390625"],
    "compton": ["531441/524288"],
    "amity": ["1600000/1594323"],
    "orson": ["2109375/2097152"],
    // Bonus
    "vishnu": ["6115295232/6103515625"],
    "luna": ["274877906944/274658203125"],

    // Equal temperament meets
    // TODO: All up to at least 31
    "12tet": ["81/80", "128/125"],  // meantone | augmented
    "19tet": ["81/80", "3125/3072"],  // meantone | magic
    "22tet": ["250/243", "2028/2025"],  // porcupine | diaschismic
    "31tet": ["81/80", "393216/390625"],  // meantone | würschmidt
};

const ZA = "2.3.7";
const ZA_TEMPERAMENTS = {
    "archy": ["64/63"],
    "slendric": ["1029/1024"],
};

const YAZA = "2.3.5.7";
const YAZA_TEMPERAMENTS = {
    "srutal": ["2048/2025", "4375/4374"],
}

const YAZALA = "2.3.5.7.11";
const YAZALA_TEMPERAMENTS = {
    "rastmic": ["243/242"],
    "unimarv": ["225/224", "385/384"],
};

const ISLAND_TEMPERAMENTS = {
    "island": [["676/675"], "2.3.5.7.11.13"],
    "parizekmic": [["676/675"], "2.3.5.13"],
    "barbados": [["676/675"], "2.3.13/5"],
    "pinkan": [["676/675", "1216/1215"], "2.3.13/5.19/5"],
};

const TEMPERAMENTS = {
    "neutral": [["243/242"], "2.3.11"],
    "orgone": [["65536/65219"], "2.7.11"],
    "negra": [["49/48", "65/64", "91/90"], "2.3.5.7.13"],
};

Object.entries(YA_TEMPERAMENTS).forEach(entry => {TEMPERAMENTS[entry[0]] = [entry[1], YA]});
Object.entries(ZA_TEMPERAMENTS).forEach(entry => {TEMPERAMENTS[entry[0]] = [entry[1], ZA]});
Object.entries(YAZA_TEMPERAMENTS).forEach(entry => {TEMPERAMENTS[entry[0]] = [entry[1], YAZA]});
Object.entries(YAZALA_TEMPERAMENTS).forEach(entry => {TEMPERAMENTS[entry[0]] = [entry[1], YAZALA]});
Object.assign(TEMPERAMENTS, ISLAND_TEMPERAMENTS);
