function norm(vector) {
    let norm = 0;
    vector.forEach(coord => norm += coord*coord);
    return Math.sqrt(norm);
}

function dot(vectorA, vectorB) {
    let result = 0;
    for (let i = 0; i < vectorA.length; ++i) {
        result += vectorA[i]*vectorB[i];
    }
    return result;
}

function add(vectorA, vectorB) {
    const result = [...vectorA];
    for (let i = 0; i < vectorA.length; ++i) {
        result[i] += vectorB[i];
    }
    return result;
}

function accumulate(vectorA, vectorB) {
    for (let i = 0; i < vectorA.length; ++i) {
        vectorA[i] += vectorB[i];
    }
}

function subtract(vectorA, vectorB) {
    const result = [...vectorA];
    for (let i = 0; i < vectorA.length; ++i) {
        result[i] -= vectorB[i];
    }
    return result;
}

function scalarMultiply(vector, scalar) {
    const result = [...vector];
    for (let i = 0; i < vector.length; ++i) {
        result[i] *= scalar;
    }
    return result;
}

function temper(commaList, justMapping, constraints, numIterations=1000, stepSize=0.1) {
    /*
    Temper out a given list of commas.

    The magnitude of the resulting mapping is arbitrary, but reasonably close to just intonation
    */
    const jFactors = [];
    if (constraints === undefined) {
        constraints = [];
    }
    constraints.forEach(constraint => jFactors.push(dot(constraint, justMapping)));

    const mapping = [];
    justMapping.forEach(logPrime => mapping.push(logPrime));

    const normalizedCommaList = [];
    commaList.forEach(comma => {
        const norm_ = norm(comma);
        const normalized = [];
        comma.forEach(coord => normalized.push(coord/norm_));
        normalizedCommaList.push(normalized);
    });
    for (let i = 0; i < numIterations; ++i) {
        normalizedCommaList.forEach(comma => {
            const dot_ = dot(mapping, comma);
            for (let j = 0; j < mapping.length; ++j) {
                mapping[j] -= dot_ * comma[j];
            }
        });
        for (let j = 0; j < constraints.length; ++j) {
            // TODO: Proper analysis to check if this is the best way to enforce constraints.
            const mFactor = dot(constraints[j], mapping);
            const step = (mFactor - jFactors[j]) * mFactor * stepSize;
            for (let k = 0; k < mapping.length; ++k) {
                mapping[k] -= constraints[j][k]*step;
            }
        }
    }
    return mapping
}

// TODO: Measure error using subgroup
function minimax(mapping, justMapping) {
    /*
    Re-scale the mapping vector to minimize the maximum deviation from just intonation.
    */
    let leastError = Infinity;
    let bestRescale;
    for (let i = 0; i < mapping.length; ++i) {
        for (let j = i+1; j < mapping.length; ++j) {
            const rescale = (justMapping[i] + justMapping[j]) / (mapping[i] + mapping[j]);
            let error = 0;
            for (let k = 0; k < mapping.length; ++k) {
                error = Math.max(error, Math.abs(mapping[k]*rescale - justMapping[k]));
            }
            if (error < leastError) {
                leastError = error;
                bestRescale = rescale;
            }
        }
    }
    const result = [];
    mapping.forEach(coord => result.push(coord*bestRescale));
    return result;
}

function isLessComplex(pitchA, pitchB) {
    // Measure pitch-class complexity, ignoring octaves
    for (let i = pitchA.length - 1; i >= 1; i--) {
        if (Math.abs(pitchA[i]) < Math.abs(pitchB[i])) {
            return true;
        }
        if (Math.abs(pitchA[i]) > Math.abs(pitchB[i])) {
            return false;
        }
    }
    // All components equal in magnitude.
    for (let i = pitchA.length - 1; i >= 1; i--) {
        if (pitchA[i] > 0 && pitchB[i] < 0) {
            return true;
        }
        if (pitchA[i] < 0 && pitchB[i] > 0) {
            return false;
        }
    }
    return false;
}

function commaReduce(pitch, commaList, persistence=5) {
    /*
    Reduce the dimensionality of the pitch vector as much as possible by adding commas from the list
    */
    // Random walk towards "zero"
    let current = pitch;
    let didAdvance = true;
    while (didAdvance) {
        didAdvance = false;
        commaList.forEach(comma => {
            let candidate = add(current, comma);
            if (isLessComplex(candidate, current)) {
                current = candidate;
                didAdvance = true;
            }
            candidate = subtract(current, comma);
            if (isLessComplex(candidate, current)) {
                current = candidate;
                didAdvance = true;
            }
        });
    }
    let best = current;
    function combine(coefs) {
        if (coefs.length == commaList.length) {
            const candidate = [...current];
            for (let i = 0; i < coefs.length; ++i) {
                accumulate(candidate, scalarMultiply(commaList[i], coefs[i]));
            }
            if (isLessComplex(candidate, best)) {
                best = candidate;
            }
            return;
        }
        for (let i = -persistence; i < persistence+1; ++i) {
            const newCoefs = [...coefs];
            newCoefs.push(i);
            combine(newCoefs);
        }
    }
    combine([]);
    return best;
}
