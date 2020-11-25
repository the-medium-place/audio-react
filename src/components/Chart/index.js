import React, { useState, useEffect } from 'react'
import { Jumbotron, Col, Row, Container } from 'react-bootstrap'
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-dragdata/dist/chartjs-plugin-dragdata.js';



export default function Chart(props) {

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

            // IF earClick IS true, SET POINTS FOR RIGHT EAR, ELSE SET POINTS FOR LEFT EAR
            if (props.earState === true) {
                const arrCopy = [...props.rightEarDecibels]

                arrCopy.splice(valueX, 1, Math.floor(valueY))
                props.setRightEarDecibels(arrCopy);
                // props.setRightEarDecibels(newData);
            } else if (props.earState === false) {
                const arrCopy = [...props.leftEarDecibels]

                arrCopy.splice(valueX, 1, Math.floor(valueY))
                props.setLeftEarDecibels(arrCopy);
                // props.leftEarDecibels.splice(valueX, 1, Math.floor(valueY));
                // console.log(props.leftEarDecibels);
                // props.setLeftEarDecibels(newData);
            }

            // IF DATA PRESENT AT SAME INDEX FOR BOTH DATASETS, SET SLIDER TO AVERAGE VALUE
            let avgVal;
            if (this.data.datasets[0].data[valueX] && this.data.datasets[1].data[valueX]) {
                avgVal = Math.floor((this.data.datasets[0].data[valueX] + this.data.datasets[1].data[valueX]) / 2);
            }

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
            e.target.style.cursor = 'grabbing'

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

    return (
        <div className="Chart">
            <Row>
                <Col sm={1}></Col>
                <Col sm={10}>
                    <Line data={chartData} options={chartOptions} />
                </Col>
                <Col sm={1}></Col>
            </Row>
        </div>
    )
}
