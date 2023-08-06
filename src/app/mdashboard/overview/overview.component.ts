import { ReviewService } from './../../services/review.service.ts.service';
import { CovidPositivity } from './../../models/covidPositivity.model';
import { Covid19PositivityByGender } from './../../models/covid19PositivityByGender.model';
import { Covid19OverallPositivityByFacility } from './../../models/covid19OverallPositivityByFacility.model';
import { CovidPositivityOvertime } from './../../models/covidPositivityOvertime.model';
import { CovidPositivityByAgeGender } from './../../models/covidPositivityByAgeGender.model';
import { NumEnrolled } from './../../models/numEnrolled.model';
import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css']
})

export class OverviewComponent implements OnInit {
    numberEnrolled: NumEnrolled[] = [];
    //Positivity --
  covidPositivity: CovidPositivity[] = [];

    //#region Prerequisites --> COVID-19 positivity overtime
    covid19PositivityOvertime: CovidPositivityOvertime[] = [];
    covid19PositivityOvertimeSeries: any[][] = [];
    covid19PositivityOvertimeOptions: {} = {};
    //#endregion

    //#region Prerequisites --> COVID-19 positivity by age gender
    covidPositivityByAgeGender: CovidPositivityByAgeGender[] = [];
    covid19PositivityByAgeGenderSeries: any[][] = [];
    covid19PositivityByAgeGenderOptions: {} = {};
    //#endregion

    positives: number = 0;
    negatives: number = 0;
    //---
  
  // Positivity By Gender----
  covid19PositivityByGender: Covid19PositivityByGender[]= [];
  covid19PositivityByGenderSeries: any[] = [];
  Gender: number = 0;
  // ---

   // Overall Positivity By Facility----
   covid19OverallPositivityByFacility: Covid19OverallPositivityByFacility[]= [];
   covid19OverallPositivityByFacilitySeries: any[][] = [];
   Facility: number = 0;
   // ---

  PositiveNumber: number = 0;
  highcharts = Highcharts;
    highcharts1 = Highcharts;
    highcharts2 = Highcharts;
    highcharts3 = Highcharts;
    overallpositivitychartOptions: {} = {};
  overallpositivitybygenderchartOptions: {} = {};
  overallpositivitybyfacilitychartOptions: {} = {};

    constructor(private reviewService: ReviewService,) {
        //this.loadOverallPositivity();
    }

    ngOnInit() {
        this.loadCovidPositivityData();
        this.loadCovidPositivityChart();

        this.loadCovid19PositivityOvertimeData();
        this.loadCovid19PositivityOvertimeChart();

        this.loadCovid19PositivityByAgeGenderData();
        this.loadCovid19PositivityByAgeGenderChart();

        this.loadCovid19OverallPositivityByFacilityData();
        this.loadCovid19OverallPositivityByFacilityChat();
  }
  loadCovid19OverallPositivityByFacilityData() {
    this.reviewService.findCovid19OverallPositivityByFacility().subscribe(
      response => {
        this.covid19OverallPositivityByFacility = response;

        // Health Facilities (index --> 0)
        this.covid19OverallPositivityByFacilitySeries.push([]);
        // Positive Numbers (index --> 1)
        this.covid19OverallPositivityByFacilitySeries.push([]);

        this.covid19OverallPositivityByFacility.forEach(dataInstance => {
            this.covid19OverallPositivityByFacilitySeries[0].push(dataInstance.Facility);
            this.covid19OverallPositivityByFacilitySeries[1].push(dataInstance.PositiveNumber); 
        });
      });

      this.loadCovid19OverallPositivityByFacilityChat();

  }

  
loadCovid19OverallPositivityByFacilityChat() {
  this.overallpositivitybyfacilitychartOptions = {
    title: {
      text: 'Overall Positivity By Facility',
      align: 'left'
    },
    chart: {
      // type: "column",
    },
    xAxis: {
      categories: [this.covid19OverallPositivityByFacilitySeries[0]], // Replace with your categories
    },
    yAxis: {
      title: {
        text: "Number Positive",
      },
    },
    series: [
      {
        name: "Health Facilities",
        data: this.covid19OverallPositivityByFacilitySeries[1],
        type: 'column',
        color: "#234FEA",
      },
    ],
  };
  HC_exporting(Highcharts);
}

    //#region Covid-19 Positivity
    loadCovidPositivityData() {
        this.reviewService.findCovidPositivity().subscribe(
            response => {
                this.covidPositivity = response;
                this.positives = this.covidPositivity[0].Covid19Positive;
                this.negatives = this.covidPositivity[0].Covid19Negative;
                this.loadCovidPositivityChart();
            });
    }

    loadCovidPositivityChart() {
        this.overallpositivitychartOptions = {
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Overall COVID-19 Positivity',
            },
            colors: [
                "#FF0000",
                "green",
            ],
            series: [{

                name: "Data",

                data: [{
                    name: 'Positives',
                    y: this.positives

                }, {
                    name: 'Negatives',
                    y: this.negatives
                }
                ],

            }],
            plotOptions: {
                pie: {
                    innerSize: "60%", // Adjust the innerSize to control the size of the inner hole (donut hole)
                    depth: 25, // Adjust the depth to control the thickness of the donut
                    dataLabels: {
                        enabled: true, // Disable data labels inside the donut segments
                    },
                },
            },
        };
        HC_exporting(Highcharts);
    }
    //#endregion

    //#region Load Chart --> COVID-19 Positivity Overtime
    loadCovid19PositivityOvertimeData() {
        this.reviewService.findCovidPositivityOvertime().subscribe(
            response => {
                this.covid19PositivityOvertime = response;

                //#region Init series indexes
                //EpiWeek (Index --> 0)
                this.covid19PositivityOvertimeSeries.push([]);

                // SampleTested (Index --> 1)
                this.covid19PositivityOvertimeSeries.push([]);

                // CovidPositive (Index --> 2)
                this.covid19PositivityOvertimeSeries.push([]);
                //#endregion

                //#region Push series data into array at specific indexes
                this.covid19PositivityOvertime.forEach(dataInstance => {
                    this.covid19PositivityOvertimeSeries[0].push(dataInstance.EpiWeek);
                    this.covid19PositivityOvertimeSeries[1].push(dataInstance.SampleTested);
                    this.covid19PositivityOvertimeSeries[2].push(dataInstance.CovidPositive);
                });
                //#endregion

                this.loadCovid19PositivityOvertimeChart();
            });
    }

    loadCovid19PositivityOvertimeChart() {
        this.covid19PositivityOvertimeOptions = {
            chart: {
                // type: 'pie'
            },
            title: {
                text: 'Covid-19 Positivity Overtime',
                align: 'left'
            },
            xAxis: [{
                title: {
                    text: 'Epi Week'
                },
                categories: this.covid19PositivityOvertimeSeries[0],
                crosshair: true
            }],
            yAxis: [
                { // Primary yAxis
                    labels: {
                        format: '{value}',
                        // style: {
                        //     color: Highcharts.getOptions().colors[1]
                        // }
                    },
                    title: {
                        text: 'Samples Tested',
                        // style: {
                        //     color: Highcharts.getOptions().colors[1]
                        // }
                    }
                },
                { // Secondary yAxis
                    title: {
                        text: 'Covid-19 Positive',
                        // style: {
                        //     color: Highcharts.getOptions().colors[0]
                        // }
                    },
                    labels: {
                        format: '{value}%',
                        // style: {
                        //     color: Highcharts.getOptions().colors[0]
                        // }
                    },
                    opposite: true
                }
            ],
            colors: [
                "#FF0000",
                "green",
            ],
            series: [
                {
                    name: 'Samples Tested',
                    type: 'column',
                    color: '#234FEA',
                    yAxis: 1,
                    data: this.covid19PositivityOvertimeSeries[1]
                },
                {
                    name: 'Positivity (%)',
                    type: 'spline',
                    color: 'red',
                    accessibility: { point: { valueSuffix: '%' } },
                    data: this.covid19PositivityOvertimeSeries[2],
                }
            ],
            plotOptions: {
                pie: {
                    innerSize: "60%", // Adjust the innerSize to control the size of the inner hole (donut hole)
                    depth: 25, // Adjust the depth to control the thickness of the donut
                    dataLabels: {
                        enabled: true, // Disable data labels inside the donut segments
                    },
                },
            },
        };
        HC_exporting(Highcharts);
    }
    //#endregion

    //#region Load Chart --> COVID-19 Positivity By Age and Gender
    loadCovid19PositivityByAgeGenderData() {
        this.reviewService.findCovid19PositivityByAgeGender().subscribe(
            response => {
                this.covidPositivityByAgeGender = response;

                //#region Init series indexes
                // Age Group(Index --> 0)
                this.covid19PositivityByAgeGenderSeries.push([]);
                this.covid19PositivityByAgeGenderSeries[0].push("0-4 Yrs");
                this.covid19PositivityByAgeGenderSeries[0].push("5-14 Yrs");
                this.covid19PositivityByAgeGenderSeries[0].push("15-34 Yrs");
                this.covid19PositivityByAgeGenderSeries[0].push("35-64 Yrs");
                this.covid19PositivityByAgeGenderSeries[0].push("65-84 Yrs");
                this.covid19PositivityByAgeGenderSeries[0].push("85+ Yrs");

                //Positivity - Female (Index --> 1)
                this.covid19PositivityByAgeGenderSeries.push([]);

                //Positivity - Male (Index --> 2)
                this.covid19PositivityByAgeGenderSeries.push([]);
                //#endregion

                //#region Push series data into array at specific indexes
                this.covid19PositivityByAgeGenderSeries[0].forEach(ageGroupInstance => {
                    this.covidPositivityByAgeGender.forEach(dataInstance => {
                        //Compile Male Positivity
                        if ((dataInstance.AgeGroup == ageGroupInstance) && (dataInstance.Gender == "Female")) {
                            this.covid19PositivityByAgeGenderSeries[1].push(dataInstance.PositiveNumber);
                        }

                        //Compile Female Positivity
                        if ((dataInstance.AgeGroup == ageGroupInstance) && (dataInstance.Gender == "Male")) {
                            this.covid19PositivityByAgeGenderSeries[2].push(dataInstance.PositiveNumber * -1);
                        }
                    });
                });
                //#endregion

                this.loadCovid19PositivityByAgeGenderChart();
            });
    }

    loadCovid19PositivityByAgeGenderChart() {
        this.covid19PositivityByAgeGenderOptions = {
            title: {
                text: 'Covid-19 Positivity By Age and Gender',
                align: 'left',
            },
            chart: { type: "bar" },
            xAxis: [
                {
                    categories: this.covid19PositivityByAgeGenderSeries[0],
                    title: { text: "" },
                    reversed: false
                },
                {
                    categories: this.covid19PositivityByAgeGenderSeries[0],
                    title: { text: "" },
                    reversed: false,
                    linkedTo: 0,
                    opposite: true,
                },
            ],
            yAxis: [
                {
                    title: {
                        text: "Positivity"
                    }
                }
            ],
            plotOptions: { series: { stacking: "normal" }, bar: { pointWidth: 18 } },
            tooltip: {
            },
            legend: { align: "left", verticalAlign: "top", y: 0, x: 80 },
            series: [
                {
                    name: "Female",
                    data: this.covid19PositivityByAgeGenderSeries[1],
                    color: "#FC7500",
                    type: 'bar'
                },
                {
                    name: "Male",
                    data: this.covid19PositivityByAgeGenderSeries[2],
                    color: "#234FEA",
                    type: 'bar'
                },
            ],
        };
    }
    //#endregion

    /*    Highcharts: typeof Highcharts = Highcharts;
       overallpositivitychartOptions: Highcharts.Options = {
           title: {
               text: 'Overall COVID-19 Positivity',
           },
           colors: [
               "#FF0000",
               "green",
           ],
           series: [
               {
                   name: "Data",
                   type: 'pie',
                   data: [
                       ["Posivite", 20],
                       ["Negative", 30],
                   ], // Replace with your data values
               },
           ],
           // series: [{
           //     data: [1, 2,],
           //     type: 'pie'
           // }],
   
           plotOptions: {
               pie: {
                   innerSize: "70%", // Adjust the innerSize to control the size of the inner hole (donut hole)
                   depth: 25, // Adjust the depth to control the thickness of the donut
                   dataLabels: {
                       enabled: true, // Disable data labels inside the donut segments
                   },
               },
           },
       }; */

    /*overallpositivitybyfacilitychartOptions: Highcharts.Options = {
        title: {
            text: 'Overall Positivity By Facility',
            align: 'left'
        },
        chart: {
            type: "column",
        },
        // title: {
        //  text: "Enrollment Cascade",
        // },
        xAxis: {
            categories: ["Kenyatta National Hospital", "Busia County Referral", "Marsabit County ", "JOOTRH", "Makueni"], // Replace with your categories
        },
        yAxis: {
            title: {
                text: "Number Positive",
            },
        },
        series: [
            {
                name: "Health Facilities",
                data: [60, 55, 20, 20, 15],
                type: 'column',
                color: "#234FEA",
            },
        ],
    };*/
    positivitybysexandagechartOptions: Highcharts.Options = {
        chart: {
            //zoomType: 'xy'
        },
        title: {
            text: 'Covid-19 Positivity over Time',
            align: 'left'
        },
        // subtitle: {
        //     text: 'Source: ' +
        //         '<a href="https://www.yr.no/nb/historikk/graf/5-97251/Norge/Troms%20og%20Finnmark/Karasjok/Karasjok?q=2021"' +
        //         'target="_blank">YR</a>',
        //     align: 'left'
        // },
        xAxis: [{
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}',
                // style: {
                //     color: Highcharts.getOptions().colors[1]
                // }
            },
            title: {
                text: 'Number Tested',
                // style: {
                //     color: Highcharts.getOptions().colors[1]
                // }
            }
        }, { // Secondary yAxis
            title: {
                text: 'Tested Positive',
                // style: {
                //     color: Highcharts.getOptions().colors[0]
                // }
            },
            labels: {
                format: '{value}%',
                // style: {
                //     color: Highcharts.getOptions().colors[0]
                // }
            },
            opposite: true
        }],
        tooltip: {
            shared: true
        },
        legend: {
            align: 'left',
            x: 80,
            verticalAlign: 'top',
            y: 60,
            floating: true,
            // backgroundColor:
            //     Highcharts.defaultOptions.legend.backgroundColor || // theme
            //     'rgba(255,255,255,0.25)'
        },
        series: [{
            name: 'Sample Tested',
            type: 'column',
            color: '#234FEA',
            yAxis: 1,
            data: [27.6, 28.8, 21.7, 34.1, 29.0, 28.4, 45.6, 51.7, 39.0,
                60.0, 28.6, 32.1],
            tooltip: {
                valueSuffix: ' mm'
            }

        }, {
            name: '% Positivity',
            type: 'spline',
            data: [-13.6, -14.9, -5.8, -0.7, 3.1, 13.0, 14.5, 10.8, 5.8,
            -0.7, -11.0, -16.4],
            color: 'red',
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
            },
            accessibility: { point: { valueSuffix: '%' } },
            // valueSuffix: '°C'
            // tooltip: {
            //     pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
            // },
            // accessibility: { point: { valueSuffix: '%' } },

        }]
    };
    /*covid19positivitybygenderchartOptions: Highcharts.Options = {

        title: {
            text: 'Covid 19 Positivity by Gender',
            align: 'left'
        },

        chart: {
            type: "pie",
        },

        colors: [
            "#234FEA", // Color for Category 2
            "#FC7500", // Color for Category 3
        ],
        series: [
            {
                name: "Data",
                type: 'pie',
                data: [
                    ["Male", 20],
                    ["Female", 30],
                ], // Replace with your data values
            },
        ],
    };*/
    screenedovertimechartOptions: Highcharts.Options = {
        title: {
            text: 'Screened Over Time',
            align: 'left',
        },

        chart: { type: "bar" },
        xAxis: [
            {
                categories: ["0-4 yrs", "5-9 yrs", "15-34 yrs"],
                title: { text: "" },
                reversed: false
            },
            {
                categories: ["0-4 yrs", "5-9 yrs", "15-34 yrs"],
                title: { text: "" },
                reversed: false,
                linkedTo: 0,
                opposite: true,
            },
        ],
        yAxis: [
            {
                // labels: {
                //     formatter: function () {
                //         return Math.abs(parseInt(this.value)).toString();
                //     },
                // },
            },
        ],
        plotOptions: { series: { stacking: "normal" }, bar: { pointWidth: 18 } },
        tooltip: {
        },
        legend: { align: "left", verticalAlign: "top", y: 0, x: 80 },
        series: [
            {
                name: "Female",
                data: [10, 60, 30],
                color: "#FC7500",
                type: 'bar'
            },
            {
                name: "Male",
                data: [-9, -41, -34],
                color: "#234FEA",
                type: 'bar'
            },
        ],


    }
}
