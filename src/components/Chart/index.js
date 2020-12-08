import React, { useState } from 'react'
import { Col, Row, Button } from 'react-bootstrap'
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-dragdata/dist/chartjs-plugin-dragdata.js';
import useWindowDimensions from '../../hooks/WindowDimensions';


export default function Chart(props) {

    const { width, height } = useWindowDimensions();

    const [showState, setShowState] = useState(false);
    const [earState, setEarState] = useState(false);


    const chartData = {
        labels: ['125hz', '250hz', '500hz', '1000hz', '2000hz', '4000hz', '8000hz'],
        datasets: [
            {
                label: 'Right Ear',
                borderColor: 'red',
                fill: false,
                pointRadius: 10,
                pointHoverRadius: 15,
                data: props.rightEarDecibels,
                pointStyle: 'circle',
                lineTension: 0
            },
            {
                label: 'Left Ear',
                fill: false,
                borderColor: 'blue',
                data: props.leftEarDecibels,
                pointRadius: 10,
                pointHoverRadius: 15,
                pointStyle: 'crossRot',
                lineTension: 0
            }
        ]
    }
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
        onClick: function (element, dataAtClick) {
            let scaleRef,
                valueX,
                valueY;
            for (var scaleKey in this.scales) {
                scaleRef = this.scales[scaleKey];
                if (scaleRef.isHorizontal() && scaleKey === 'x-axis-0') {
                    valueX = scaleRef.getValueForPixel(element.offsetX);
                    // console.log(valueX); // index of value in dataset (hz level)
                } else if (scaleKey === 'y-axis-0') {
                    valueY = scaleRef.getValueForPixel(element.offsetY);
                    // console.log(valueY); // db value at click
                }
            }

            // IF earState IS true, SET POINTS FOR RIGHT EAR, ELSE SET POINTS FOR LEFT EAR
            if (earState) {
                const arrCopy = [...props.rightEarDecibels]
                arrCopy.splice(valueX, 1, Math.floor(valueY))
                props.setRightEarDecibels(arrCopy);
                // console.log(props.rightEarDecibels);
            } else if (!earState) {
                const arrCopy = [...props.leftEarDecibels]
                arrCopy.splice(valueX, 1, Math.floor(valueY))
                props.setLeftEarDecibels(arrCopy);
                // console.log(props.leftEarDecibels)
            }

            // IF DATA PRESENT AT SAME INDEX FOR BOTH DATASETS, SET SLIDER TO AVERAGE VALUE
            // let avgVal;
            // if (this.data.datasets[0].data[valueX] && this.data.datasets[1].data[valueX]) {
            //     avgVal = Math.floor((this.data.datasets[0].data[valueX] + this.data.datasets[1].data[valueX]) / 2);
            // }

            // switch (valueX) {
            //     case 0:
            //         $('#hz125').val((-avgVal) + 25)
            //         eqValsObj.hz125 = (-avgVal) + 25
            //         $(`.val-output[data-hertz="125"]`).text((-avgVal) + 25 + 'db')
            //         break;
            //     case 1:
            //         $('#hz250').val((-avgVal) + 25)
            //         eqValsObj.hz250 = (-avgVal) + 25
            //         $(`.val-output[data-hertz="250"]`).text((-avgVal) + 25 + 'db')
            //         break;
            //     case 2:
            //         $('#hz500').val((-avgVal) + 25)
            //         eqValsObj.hz500 = (-avgVal) + 25
            //         $(`.val-output[data-hertz="500"]`).text((-avgVal) + 25 + 'db')
            //         break;
            //     case 3:
            //         $('#hz1000').val((-avgVal) + 25)
            //         eqValsObj.hz1000 = (-avgVal) + 25
            //         $(`.val-output[data-hertz="1000"]`).text((-avgVal) + 25 + 'db')
            //         break;
            //     case 4:
            //         $('#hz2000').val((-avgVal) + 25)
            //         eqValsObj.hz2000 = (-avgVal) + 25
            //         $(`.val-output[data-hertz="2000"]`).text((-avgVal) + 25 + 'db')
            //         break;
            //     case 5:
            //         $('#hz4000').val((-avgVal) + 25)
            //         eqValsObj.hz4000 = (-avgVal) + 25
            //         $(`.val-output[data-hertz="4000"]`).text((-avgVal) + 25 + 'db')
            //         break;
            //     case 6:
            //         $('#hz8000').val((-avgVal) + 25)
            //         eqValsObj.hz8000 = (-avgVal) + 25
            //         $(`.val-output[data-hertz="8000"]`).text((-avgVal) + 25 + 'db')
            //         break;
            //     default:
            //         break;
            // }
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
            console.log(e)
        },
        onDrag: (e, datasetIndex, index, value) => {
            e.target.style.cursor = 'grabbing';

            if (datasetIndex === 1) {
                const leftEarArray = props.leftEarDecibels;
                leftEarArray.splice(index, 1, value);
                props.setLeftEarDecibels(leftEarArray);
            } else {
                const rightEarArray = props.rightEarDecibels;
                rightEarArray.splice(index, 1, value);
                props.setRightEarDecibels(rightEarArray);
            }


            //CAPTURE VALUE OF DRAGGED ELEMENT, INJECT IT INTO THE SLIDERS

            // const rightDatasetValAtIndex = chart.data.datasets[0].data[index];
            // const leftDatasetValAtIndex = chart.data.datasets[1].data[index];
            // let avgVal;
            // if (leftDatasetValAtIndex && rightDatasetValAtIndex) {
            //     avgVal = Math.round((leftDatasetValAtIndex + rightDatasetValAtIndex) / 2) // average of two values at single hz level
            // }

            // switch (index) {
            //     case 0:
            //         // $('#hz125').val((-avgVal) + 25)
            //         // eqValsObj.hz125 = (-avgVal) + 25
            //         // $('.hz125').text((-avgVal) + 25 + 'db')
            //         // $(`.val-output[data-hertz="125"]`).text((-avgVal) + 25 + 'db')

            //         break;
            //     case 1:
            //         // $('#hz250').val((-avgVal) + 25)
            //         // eqValsObj.hz250 = (-avgVal) + 25
            //         // $(`.val-output[data-hertz="250"]`).text((-avgVal) + 25 + 'db')

            //         break;
            //     case 2:
            //         // $('#hz500').val((-avgVal) + 25)
            //         // eqValsObj.hz500 = (-avgVal) + 25
            //         // $(`.val-output[data-hertz="500"]`).text((-avgVal) + 25 + 'db')

            //         break;
            //     case 3:
            //         // $('#hz1000').val((-avgVal) + 25)
            //         // eqValsObj.hz1000 = (-avgVal) + 25
            //         // $(`.val-output[data-hertz="1000"]`).text((-avgVal) + 25 + 'db')

            //         break;
            //     case 4:
            //         // $('#hz2000').val((-avgVal) + 25)
            //         // eqValsObj.hz2000 = (-avgVal) + 25
            //         // $(`.val-output[data-hertz="2000"]`).text((-avgVal) + 25 + 'db')

            //         break;
            //     case 5:
            //         // $('#hz4000').val((-avgVal) + 25)
            //         // eqValsObj.hz4000 = (-avgVal) + 25
            //         // $(`.val-output[data-hertz="4000"]`).text((-avgVal) + 25 + 'db')

            //         break;
            //     case 6:
            //         // $('#hz8000').val((-avgVal) + 25)
            //         // eqValsObj.hz8000 = (-avgVal) + 25
            //         // $(`.val-output[data-hertz="8000"]`).text((-avgVal) + 25 + 'db')

            //         break;
            //     default:
            //         break;
            // }
            console.log(datasetIndex, index, value)
        },
        onDragEnd: function (e, datasetIndex, index, value) {
            e.target.style.cursor = 'default'
            console.log(datasetIndex, index, value)


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

    const chartClasses = {
        lgScreen: "d-flex justify-content-center w-100 rounded shadow p-3 bg-light",
        smScreen: "d-flex justify-content-center w-100 rounded shadow p-3 bg-light"
    }

    return (
        <div className="Chart mb-3">
            <Row className="d-flex">
                <Col className="d-flex justify-content-end">
                    <button
                        type="button"
                        class="close"
                        aria-label="Close"
                        onClick={() => props.setShowChartState(false)}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </Col>
            </Row>
            <Row className="mt-3 d-flex justify-content-center">
                <Col sm={10} className="bg-light mb-2 rounded shadow-sm pt-3">
                    <p>
                        Welcome to the Ear Chart! You should have received a chart that looks very similar to the one below from your audiologist. All you have to do is make our chart look like yours! Clicks the 'Ear Setting' button below to toggle between adding <span className="text-danger font-weight-bold">Right-Ear</span> or <span className="text-primary font-weight-bold">Left-Ear</span> datapoints. Then you can drag the points into place! Save with the 'Save' button, or click 'Clear' to start over with a fresh chart!
                        </p>
                </Col>
            </Row>
            <Row>
                <div className={width < 450 ? chartClasses.smScreen : chartClasses.lgScreen}>
                    <Line data={chartData} options={chartOptions} />
                </div>
            </Row>
            <Row className="mt-3">
                <Col md={6}>
                    <div className="d-flex flex-column rounded p-1 pt-2 text-center justify-content-center bg-secondary text-light shadow-sm">

                        <div>
                            <h4 className="border-bottom border-light pb-2 font-weight-bold">Ear Data:</h4>
                        </div>
                        <div >
                            <h5>Currently adding {earState ? <Button onClick={() => setEarState(!earState)} variant="danger" className="btn-lg">RIGHT</Button> : <Button onClick={() => setEarState(!earState)} variant="primary" className="btn-lg">LEFT</Button>} ear data</h5>
                        </div>
                    </div>
                </Col>
                <Col md={6} className={width < 768 ? "d-flex justify-content-center" : "d-flex justify-content-end"}>
                    <div className="p-3 d-flex align-items-center bg-secondary rounded shadow-sm">
                        <Button onClick={props.handleChartClear} variant="warning" className="m-1 btn-lg">
                            Clear chart
                            </Button>
                        <Button onClick={props.handleChartRestore} className="m-1 btn-lg">
                            Restore values
                            </Button>
                        <Button onClick={props.handleChartSave} variant="success" className="m-1 btn-lg">
                            Save values
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    )
}
