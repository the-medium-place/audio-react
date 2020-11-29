const recBtn = $("#record-btn");
const stopBtn = $("#stop-btn");
const playBtn = $('#play-btn');

// FLAG VARIABLE FOR SETTING EAR VALUES ON CHART
let earClick; // true for right ear, false for left ear

// CREATE OBJECT TO HOUSE EQ VALUES
const eqValsObj = {
    hz125: 0,
    hz250: 0,
    hz500: 0,
    hz1000: 0,
    hz2000: 0,
    hz4000: 0,
    hz8000: 0
}

// LISTEN TO EAR SELECTION BUTTONS TO FLIP THE SWITCH
$("#l-ear-btn").on('click', event => {
    $("#l-ear-btn").css("background", "salmon");
    $("#r-ear-btn").css("background", "rgb(125, 0, 0)")
    // set earClick to false to activate left ear datapoints
    earClick=false;
})
$("#r-ear-btn").on('click', event => {
    $("#r-ear-btn").css("background", "salmon");
    $("#l-ear-btn").css("background", "rgb(0, 0, 125)")
    // set earClick to true to activate right ear datapoints
    earClick=true;
})

// ADJUST FILTER VALUES USING SLIDERS
// ==================================
$('.slider-wrapper').on("input", "input[type='range']", event => {

    eqValsObj[event.target.id] = parseInt(event.target.value);

    console.log("testing data attribute output: \n", "====================");
    console.log(event.target.dataset.hertz)

    $(`.val-output[data-hertz="${event.target.dataset.hertz}"]`).text(event.target.value + 'db')

})

// USER CLICKS RECORD BUTTON
// =========================
recBtn.on('click', () => {

    // CAPTURE MICROPHONE INPUT
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            // SET UP RECORDING WITH MICROPHONE
            const mediaRecorder = new MediaRecorder(stream);

            // START RECORDING
            mediaRecorder.start();

            const audioChunks = [];

            // AUDIO IS CAPTURED IN MULTIPLE 'CHUNKS'
            mediaRecorder.addEventListener("dataavailable", event => {
                // PUSH ALL AUDIO CHUNKS TO SINGLE ARRAY
                audioChunks.push(event.data)
            })

            // USER CLICKS STOP BUTTON
            stopBtn.on('click', () => {
                // STOP RECORDING
                mediaRecorder.stop()
            })

            let audioBlob;
            let audioURL;
            let audio;
            mediaRecorder.addEventListener('stop', () => {
                // CAPTURE RAW AUDIO DATA INFO (BLOBS)
                audioBlob = new Blob(audioChunks);
                audioURL = URL.createObjectURL(audioBlob);

                // CREATE AUDIO OBJECT FROM CAPTURED BLOBS
                audio = new Audio(audioURL);
                console.log("audioBlob: ", audioBlob)
                console.log("audioURL: ", audioURL)
                console.log("audio: ", audio)

                // CREATE AUDIO PROCESSING CONTEXT AND FILTERS
                const context = new AudioContext();
                const audioSource = context.createMediaElementSource(audio);

                // ANALYSER WILL BE USED FOR VISUALIZATIONS AND INFO OUTPUT I THINK
                const analyser = context.createAnalyser();

                // SEPARATE STEREOPANNERS FOR EACH SIDE
                const rightEar = context.createStereoPanner();
                const leftEar = context.createStereoPanner();
                // SET PANNERS TO RESPECTIVE SIDES
                rightEar.pan.value = 1 // full right side pan
                leftEar.pan.value = -1 // full left side pan

                // analyser.fftSize = 2048;
                // const bufferLength = analyser.frequencyBinCount;
                // const dataArray = new Uint8Array(bufferLength);
                // analyser.getByteTimeDomainData(dataArray);
                // analyser.minDecibels = -40;
                // analyser.maxDecibels = 120;

                // GET CANVAS FOR ISCILLOSCOPE
                // const canvas = document.getElementById('oscilloscope');
                // const canvasCtx = canvas.getContext("2d");

                // draw an oscilloscope of the current audio source

                // function draw() {
                //     // console.log(dataArray);

                //     requestAnimationFrame(draw);

                //     analyser.getByteTimeDomainData(dataArray);

                //     canvasCtx.fillStyle = "rgb(200, 200, 200)";
                //     canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

                //     canvasCtx.lineWidth = 2;
                //     canvasCtx.strokeStyle = "red";

                //     canvasCtx.beginPath();

                //     var sliceWidth = canvas.width * 1.0 / bufferLength;
                //     var x = 0;

                //     for (var i = 0; i < bufferLength; i++) {

                //         var v = dataArray[i] / 128.0;
                //         var y = v * canvas.height / 2;

                //         if (i === 0) {
                //             canvasCtx.moveTo(x, y);
                //         } else {
                //             canvasCtx.lineTo(x, y);
                //         }

                //         x += sliceWidth;
                //     }

                //     canvasCtx.lineTo(canvas.width, canvas.height / 2);
                //     canvasCtx.stroke();
                // }

                const filter1 = context.createBiquadFilter();
                const filter2 = context.createBiquadFilter();
                const filter3 = context.createBiquadFilter();
                const filter4 = context.createBiquadFilter();
                const filter5 = context.createBiquadFilter();
                const filter6 = context.createBiquadFilter();
                const filter7 = context.createBiquadFilter();

                const filterArr = [filter1, filter2, filter3, filter4, filter5, filter6, filter7]

                filterArr.forEach((filter, index) => {

                    let hertz,
                        gainVal;

                    switch (index){
                        case 0:
                            hertz=125;
                            gainVal=eqValsObj.hz125;
                            break;

                        case 1:
                            hertz=250;
                            gainVal=eqValsObj.hz250;
                            break;
                
                        case 2:
                            hertz=500;
                            gainVal=eqValsObj.hz500;
                            break;

                        case 3:
                            hertz=1000;
                            gainVal=eqValsObj.hz1000;
                            break;

                        case 4:
                            hertz=2000;
                            gainVal=eqValsObj.hz2000;
                            break;

                        case 5:
                            hertz=4000;
                            gainVal=eqValsObj.hz4000;
                            break;

                        default:
                            hertz=8000;
                            gainVal=eqValsObj.hz8000;
                            break;
                    }
                    // CONNECT THE MediaElementAudioSourceNode TO THE FILTERS/PANNERS
                    // AND THE FILTERS/PANNERS TO THE DESTINATION  
                    audioSource.connect(filter);
                    filter.connect(context.destination);
                    // CONFIGURE FILTERS
                    filter.type = 'peaking';
                    filter.frequency.value = hertz;
                    filter.Q.value = 100;
                    filter.gain.value = gainVal;
                })

                audioSource.connect(rightEar);
                audioSource.connect(leftEar);

                rightEar.connect(context.destination);
                leftEar.connect(context.destination);

                // console.log("filter after:/n", "=======================");
                // console.log(filter1, filter2, filter7);
                // console.log(analyser);
                // draw();

            })

            // USER CLICKS PLAY BUTTON
            playBtn.on('click', () => {
                audio.play();
            })
        })
})

// =============
// CHARTJS SETUP
// =============
const ctx = document.getElementById('myChart').getContext('2d');

// OPTIONS OBJECT FOR CHART
const chartOptions = {
    // tooltips: {
    //     callbacks: {
    //         label: function(context) {
    //             // var label = context["yLabel"] || '';
    //             // return label + 'db';
    //             // if (label) {
    //             //     label += ': ';
    //             // }
    //             // if (!isNaN(context.dataPoint.y)) {
    //             //     label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.dataPoint.y);
    //             // }
    //             // return label;
    //         }
    //     }
    // },

    legend: {
        labels: {
            usePointStyle: true,
        }
    },
    // CAPTURE CLICK LOCATION ON CHART TO ADD NEW DATA TO DATASET ARRAY?
    // =============================================================================
    onClick: function(element, dataAtClick){
        let scaleRef,
            valueX,
            valueY;
        for (var scaleKey in this.scales) {
            scaleRef = this.scales[scaleKey];
            if (scaleRef.isHorizontal() && scaleKey == 'x-axis-0') {
                valueX = scaleRef.getValueForPixel(element.offsetX);
                // console.log(valueX); // index of value in dataset (hz level)
            } else if (scaleKey == 'y-axis-0') {
                valueY = scaleRef.getValueForPixel(element.offsetY);
                // console.log(valueY); // db value at click
            }
        }

        // IF earClick IS true, SET POINTS FOR RIGHT EAR, ELSE SET POINTS FOR LEFT EAR
        if(earClick===true){
            this.data.datasets[0].data.splice(valueX, 1, Math.floor(valueY)) 
        } else if(earClick===false){
            this.data.datasets[1].data.splice(valueX, 1, Math.floor(valueY));
        } 

        // IF DATA PRESENT AT SAME INDEX FOR BOTH DATASETS, SET SLIDER TO AVERAGE VALUE
        let avgVal;
        if (this.data.datasets[0].data[valueX] && this.data.datasets[1].data[valueX]){
            avgVal = Math.floor((this.data.datasets[0].data[valueX] + this.data.datasets[1].data[valueX]) / 2);
        }

        switch (valueX) {
            case 0:
                $('#hz125').val((-avgVal) + 25)
                eqValsObj.hz125 = (-avgVal) + 25
                $(`.val-output[data-hertz="125"]`).text((-avgVal) + 25 + 'db')

                break;
            case 1:
                $('#hz250').val((-avgVal) + 25)
                eqValsObj.hz250 = (-avgVal) + 25
                $(`.val-output[data-hertz="250"]`).text((-avgVal) + 25 + 'db')

                break;
            case 2:
                $('#hz500').val((-avgVal) + 25)
                eqValsObj.hz500 = (-avgVal) + 25
                $(`.val-output[data-hertz="500"]`).text((-avgVal) + 25 + 'db')

                break;
            case 3:
                $('#hz1000').val((-avgVal) + 25)
                eqValsObj.hz1000 = (-avgVal) + 25
                $(`.val-output[data-hertz="1000"]`).text((-avgVal) + 25 + 'db')

                break;
            case 4:
                $('#hz2000').val((-avgVal) + 25)
                eqValsObj.hz2000 = (-avgVal) + 25
                $(`.val-output[data-hertz="2000"]`).text((-avgVal) + 25 + 'db')

                break;
            case 5:
                $('#hz4000').val((-avgVal) + 25)
                eqValsObj.hz4000 = (-avgVal) + 25
                $(`.val-output[data-hertz="4000"]`).text((-avgVal) + 25 + 'db')

                break;
            case 6:
                $('#hz8000').val((-avgVal) + 25)
                eqValsObj.hz8000 = (-avgVal) + 25
                $(`.val-output[data-hertz="8000"]`).text((-avgVal) + 25 + 'db')

                break;
            default:
                break;
        }
        // UPDATE CHART WITH NEW ADDED VALUES
        this.update();
    },
    responsive: true,
    scales: {
        yAxes: [{
            ticks: {
                min: -10,
                max: 120,
                stepSize: 5,
                reverse: true,
                callback: function (value, index, values) {
                    const vals = [-10, 0, 10, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]
                    if (vals.includes(value)) return value + 'db';

                }
            }
        }]
    },
    dragData: true,
    dragDataRound: 0,
    dragOptions: {
        showTooltip: true
    },
    onDragStart: function (e) {
        //   console.log(e)
    },
    onDrag: (e, datasetIndex, index, value) => {
        e.target.style.cursor = 'grabbing'

        //CAPTURE VALUE OF DRAGGED ELEMENT, INJECT IT INTO THE SLIDERS

        const rightDatasetValAtIndex = chart.data.datasets[0].data[index];
        const leftDatasetValAtIndex = chart.data.datasets[1].data[index];
        let avgVal;
        if (leftDatasetValAtIndex && rightDatasetValAtIndex) {
            avgVal = Math.round((leftDatasetValAtIndex + rightDatasetValAtIndex) / 2) // average of two values at single hz level
        }

        switch (index) {
            case 0:
                $('#hz125').val((-avgVal) + 25)
                eqValsObj.hz125 = (-avgVal) + 25
                $('.hz125').text((-avgVal) + 25 + 'db')
                $(`.val-output[data-hertz="125"]`).text((-avgVal) + 25 + 'db')

                break;
            case 1:
                $('#hz250').val((-avgVal) + 25)
                eqValsObj.hz250 = (-avgVal) + 25
                $(`.val-output[data-hertz="250"]`).text((-avgVal) + 25 + 'db')

                break;
            case 2:
                $('#hz500').val((-avgVal) + 25)
                eqValsObj.hz500 = (-avgVal) + 25
                $(`.val-output[data-hertz="500"]`).text((-avgVal) + 25 + 'db')

                break;
            case 3:
                $('#hz1000').val((-avgVal) + 25)
                eqValsObj.hz1000 = (-avgVal) + 25
                $(`.val-output[data-hertz="1000"]`).text((-avgVal) + 25 + 'db')

                break;
            case 4:
                $('#hz2000').val((-avgVal) + 25)
                eqValsObj.hz2000 = (-avgVal) + 25
                $(`.val-output[data-hertz="2000"]`).text((-avgVal) + 25 + 'db')

                break;
            case 5:
                $('#hz4000').val((-avgVal) + 25)
                eqValsObj.hz4000 = (-avgVal) + 25
                $(`.val-output[data-hertz="4000"]`).text((-avgVal) + 25 + 'db')

                break;
            case 6:
                $('#hz8000').val((-avgVal) + 25)
                eqValsObj.hz8000 = (-avgVal) + 25
                $(`.val-output[data-hertz="8000"]`).text((-avgVal) + 25 + 'db')

                break;
            default:
                break;
        }
        //   console.log(datasetIndex, index, value)
    },
    onDragEnd: function (e, datasetIndex, index, value) {
        e.target.style.cursor = 'default'
        //   console.log(datasetIndex, index, value)
        // console.log(value);
    },
    hover: {
        onHover: function (e) {
            const point = this.getElementAtEvent(e)
            if (point.length) e.target.style.cursor = 'grab'
            else e.target.style.cursor = 'default'
        }
    }
}
// DATA OBJECT FOR CHART
const chartData = {
    labels: ['125hz', '250hz', '500hz', '1000hz', '2000hz', '4000hz', '8000hz'],
    datasets: [
        {
            label: 'Right Ear',
            borderColor: 'red',
            fill: false,
            pointRadius: 10,
            pointHoverRadius: 15,
            data: [null, null, null, null, null, null, null],
            pointStyle: 'circle',
            lineTension: 0
        },
        {
            label: 'Left Ear',
            fill: false,
            borderColor: 'blue',
            data: [null, null, null, null, null, null, null],
            pointRadius: 10,
            pointHoverRadius: 15,
            pointStyle: 'crossRot',
            lineTension: 0
        }
    ]
}

const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: chartData,
    // Configuration options go here
    options: chartOptions
});

// MODAL CLEAR BUTTON
// ==================
$('#clear-btn').on('click', () => {
    // RESET DATA ARRAYS TO ALL 'null'
    chart.data.datasets.forEach(dataset => {
        dataset.data = [null, null, null, null, null, null, null]
    })

    // RESET eqValsObj VALUES TO 0
    Object.keys(eqValsObj).forEach(key => eqValsObj[key] = 0)

    // RESET SLIDER VALUES TO 0
    $('.eq-slider').val(0);

    // RESET EAR SELECT BUTTONS AND earClick VALUE
    $("#r-ear-btn").css("background", "rgb(125, 0, 0)");
    $("#l-ear-btn").css("background", "rgb(0, 0, 125)");
    earClick=undefined;

    // RESET db OUTPUT DIVs
    $('.val-output').text("0db");

    // UPDATE CHART
    chart.update();
})

