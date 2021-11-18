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
