function main() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const colorDim = 4;
    const MAX_ITER = 128;
    const TAU = 2*Math.PI;

    let exponent = 1.25;
    let zoom_level = 10;
    let center_x = 0;
    let center_y = 0;

    const branch_angles = [];
    for (let i = 0; i < MAX_ITER; ++i) {
        branch_angles.push(Math.random()*10000);
    }

    function updatePattern() {
        for (let i = 0; i < canvas.width; ++i) {
            const x = zoom_level*(i-0.5*canvas.width)/canvas.width + center_x;
            for (let j = 0; j < canvas.height; ++j) {
                const y = zoom_level*(j-0.5*canvas.height)/canvas.width + center_y;
                let real = x;
                let imag = y;

                let value = 0;
                for (let n = 0; n < MAX_ITER; ++n) {
                    let magnitude = Math.sqrt(real*real + imag*imag);
                    if (magnitude > 5) {
                        value = Math.sqrt((n+10) / (MAX_ITER+12));
                        break;
                    }
                    const phase = ((Math.atan2(imag, real) + branch_angles[n]) % TAU - branch_angles[n]) * exponent;
                    magnitude = Math.pow(magnitude, exponent);
                    real = Math.cos(phase)*magnitude + x;
                    imag = Math.sin(phase)*magnitude + y;
                }
                index = (i + j * canvas.width) * colorDim;
                data[index + 0] = value * 255;
                data[index + 1] = value * 255;
                data[index + 2] = value * 255;
                data[index + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    canvas.onclick = ((e) => {
        console.log(e.offsetX, e.offsetY);
        const x = zoom_level*(e.offsetX - 0.5*canvas.width)/canvas.width + center_x;
        const y = zoom_level*(e.offsetY - 0.5*canvas.height)/canvas.width + center_y;
        center_x = x;
        center_y = y;
        zoom_level *= 0.4;
        updatePattern();
        console.log(center_x, center_y, zoom_level);
    });

    document.getElementById('randomize').onclick = ((e) => {
        console.log("Randomizing...");
        for (let i = 0; i < MAX_ITER; ++i) {
            branch_angles[i] = Math.random()*10000;
        }
        updatePattern();
        console.log("Randomizing done.");
    });

    document.getElementById('exponent').onchange = ((e) => {
        console.log("Changing exponent");
        exponent = parseFloat(e.target.value);
        updatePattern();
        console.log("Changed exponent to", exponent);
    });
    updatePattern();
}
