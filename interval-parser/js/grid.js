function gridMain() {
    const tableEl = document.getElementById("grid");

    const N = 7;
    const M = 3;
    const baseIntervals = [Array(N).fill(0)];
    for (let i = 1; i < M+1; ++i) {
        let interval = Array(N).fill(0);
        interval[1] = i;
        baseIntervals.push(interval);
        interval = Array(N).fill(0);
        interval[1] = -i;
        baseIntervals.push(interval);
    }
    const five = Array(N).fill(0);
    five[2] = 1;
    baseIntervals.push(five);
    const oneFifth = Array(N).fill(0);
    oneFifth[2] = -1;
    baseIntervals.push(oneFifth);
    const fifteen = Array(N).fill(0);
    fifteen[1] = 1;
    fifteen[2] = 1;
    baseIntervals.push(fifteen);
    const oneFifteenth = Array(N).fill(0);
    oneFifteenth[1] = -1;
    oneFifteenth[2] = -1;
    baseIntervals.push(oneFifteenth);
    const fiveOverThree = Array(N).fill(0);
    fiveOverThree[1] = -1;
    fiveOverThree[2] = 1;
    baseIntervals.push(fiveOverThree);
    const threeOverFive = Array(N).fill(0);
    threeOverFive[1] = 1;
    threeOverFive[2] = -1;
    baseIntervals.push(threeOverFive);
    for (let i = 3; i < N; ++i) {
        let interval = Array(N).fill(0);
        interval[i] = 1;
        baseIntervals.push(interval);
        interval = Array(N).fill(0);
        interval[i] = -1;
        baseIntervals.push(interval);
    }
    const headerRow = document.createElement("tr");
    const corner = document.createElement("th");
    corner.textContent = "p/q";
    headerRow.appendChild(corner);
    baseIntervals.forEach(interval => {
        [numerator, denominator] = pitchToFraction(interval);
        const header = document.createElement("th");
        if (denominator == 1) {
            header.textContent = numerator;
        } else {
            header.textContent = numerator + "/" + denominator;
        }
        headerRow.appendChild(header);
    })
    tableEl.appendChild(headerRow);
    for (let i = 0; i < baseIntervals.length; ++i) {
        const row = document.createElement("tr");
        const rowHeader = document.createElement("th");
        [numerator, denominator] = pitchToFraction(baseIntervals[i]);
        if (denominator == 1) {
            rowHeader.textContent = numerator;
        } else {
            rowHeader.textContent = numerator + "/" + denominator;
        }
        row.appendChild(rowHeader);
        for (let j = 0; j < baseIntervals.length; ++j) {
            const data = document.createElement("td");
            const interval = Array(N).fill(0);
            for (let k = 0; k < interval.length; ++k) {
                interval[k] = baseIntervals[i][k] + baseIntervals[j][k];
            }
            const size = dot(interval, JI);
            while (JI[0]*interval[0] + size > JI[0]) {
                interval[0] -= 1;
            }
            while (JI[0]*interval[0] + size < 0) {
                interval[0] += 1;
            }
            data.textContent = tokenizeIntervalNotation(notateInterval(interval));
            row.appendChild(data);
        }
        tableEl.appendChild(row);
    }
}
