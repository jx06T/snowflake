const opt_D = document.getElementById("opt")
const optt_D = document.getElementById("optt")
const ResetAll_A = document.getElementById("ResetAll")
function init() {
    optt_D.querySelectorAll('.ww').forEach((e) => {
        const target = e
        const id = target.id
        target.value = SnowflakeData[id]
        // console.log(id)
    })
}
opt_D.addEventListener("click", () => {
    opt_D.classList.add("sting")
})

optt_D.addEventListener("input", (e) => {
    const target = e.target
    const id = target.id
    let temp = (id.replace(/(\D+)((T|D))/, "$1^$2")).split("^")
    let type = temp[0]
    let TD = temp[1]
    if (TD == "T") {
        var targetD = optt_D.querySelector(`[id="${type}D"]`)
        var targetT = target
    } else if (TD == "D") {
        var targetT = optt_D.querySelector(`[id="${type}T"]`)
        var targetD = target
    }
    if (TD == "T") {
        if (parseFloat(targetD.value) > parseFloat(target.value)) {
            targetD.value = parseFloat(target.value) - 1
        }
    } else if (TD == "D") {
        if (parseFloat(targetT.value) < parseFloat(target.value)) {
            targetT.value = parseFloat(target.value) + 1
        }
    }
    if (TD) {
        SnowflakeData[type + "T"] = parseFloat(targetT.value)
        SnowflakeData[type + "D"] = parseFloat(targetD.value)
    } else {
        SnowflakeData[type] = parseFloat(target.value)
    }
    // Rcount()
    // console.log(SnowflakeData)
})

optt_D.addEventListener("click", (e) => {
    F()
    const target = e.target
    if (!target.classList.contains("RB")) {
        return
    }
    let target2 = target.previousElementSibling
    if (!target2.classList.contains("ww")) {
        target2 = target2.firstChild.nextSibling
    }
    const id = target2.id
    // console.log(id)
    let temp = (id.replace(/(\D*)((T|D))/, "$1^$2")).split("^")
    let type = temp[0]
    let TD = temp[1]
    if (TD) {
        SnowflakeData[type + "T"] = initdata[type + "T"]
        SnowflakeData[type + "D"] = initdata[type + "D"]
    } else {
        SnowflakeData[type] = initdata[type]
    }
    // console.log(TD, type, SnowflakeData, initdata)
    // Rcount()
    init()
})

ResetAll_A.addEventListener("click", () => {
    F()
    SnowflakeData = { ...initdata }
    UpData(SnowflakeData)
    init()
    // Rcount()

})
window.onbeforeunload = () => {
    UpData(SnowflakeData)
};
init()
//--------------------------------------------------------------
const recordBtn = document.getElementById('recordBtn');
let mediaRecorder;
let recordedBlobs = [];

recordBtn.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        recordBtn.textContent = 'Start Recording';
    } else {
        canvas.width = Wh;
        canvas.height = Ht;
        startRecording();
        recordBtn.textContent = 'Stop Recording';
    }
});

function startRecording() {
    recordedBlobs = [];
    // Adjust video quality settings
    const options = {
        mimeType: 'video/webm;codecs=vp8', // Consider VP8 for better quality within WebM
        // Adjust videoBitsPerSecond to a higher value for better quality,
        // but be mindful of file size implications. Experiment for your needs.
        videoBitsPerSecond: 85000000, // Start with 2Mbps, adjust as needed
        bitsPerSecond: 85000000,
    };

    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not supported`);
        return;
    }

    const stream = canvas.captureStream(30);
    mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
    setupRecorderStop();
}

function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

function stopRecording() {
    mediaRecorder.stop();
}

function setupRecorderStop() {
    mediaRecorder.onstop = () => {
        const blobbedVideo = new Blob(recordedBlobs, { type: 'video/webm' });
        const url = window.URL.createObjectURL(blobbedVideo);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'snowflake.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    };
}


function F() {
    opt_D.classList.add("flashh")
    setTimeout(() => {
        opt_D.classList.remove("flashh")
    },
        400);
}