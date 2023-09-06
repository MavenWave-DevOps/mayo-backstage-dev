import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import { Grid, Card, CardContent, makeStyles } from "@material-ui/core";
import { env } from 'process';


export const CostGraph = () => {

    useEffect(() => {
        const getData = async () => {

        };
        getData();
    }, []);

    /**
     * Y- Axis Data
     */
    const series = [

        {
            name: 'Q1 Budget',
            group: 'budget',
            data: [101000, 20200, 30030, 40200, 50000]
        },
        {
            name: 'Q1 Consumed',
            group: 'actual',
            data: [4000, 25000]
        },
        {
            name: 'Q2 Budget',
            group: 'budget',
            data: [12000, 42000, 38000, 89000, 88700]
        },
        {
            name: 'Q2 Consumed',
            group: 'actual',
            data: [4000, 25000]
        }
    ];

    /**
     * X- Axis Data
     */
    const options = {
        chart: { id: 'bar-chart', stacked: true, height: 750 },
        stroke: {
            width: 1,
            colors: ['#fff'],
        },
        title: {
            floating: false,
            text: 'MCCP- Cost Analysis (GCP)',
            align: 'center',
            offsetX: 90,
            style: {
                fontSize: '18px'
            }
        },
        subtitle: {
            text: "projectId",
            align: 'center',
            margin: 5,
            offsetY: 40,
            style: {
                color: '#9574bd',
                fontSize: '14px',
            }
        },
        // dataLabels: {
        //     formatter: (val) => { return val / 1000 + "$" }
        // },
        xaxis: {
            // categories: 'service_description',
            // tickAmount: 5,
            // labels: {
            //     formatter: (val) => {
            //         return val / 1000 + '$'
            //     }
            // },
        },


        fill: {
            opacity: 1,
        },
        colors: ['#80c7fd', '#008FFB', '#80f1cb', '#00E396'],

        legend: {
            position: 'top',
            horizontalAlign: 'left'
        },
        plotOptions: {
            bar: {
                horizontal: true,
                dataLables: {
                    position: 'bottom'
                }
            }
        },
    };
    // });



    const useStyles = makeStyles((theme) => ({
        container: {
            backgroundColor: "grey"
        },
        item: {
            width: "100%"
        },
        charts: {
            flexDirection: "column"
        },
        card: {
            height: "100%"
        },
        content: {
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        chartWrapper: {
            width: "95%",
            height: "100%",
            overflow: "hidden"
        }
    }));

    const classes = useStyles();
    return (
        <Grid className={classes.container} container spacing={2}>
            <Grid item className={classes.item}>
                <Grid container className={classes.charts} spacing={2}>
                    <Grid item>
                        <Card className={classes.card}>
                            <CardContent>
                                <div className={classes.content}>
                                    <div className={classes.chartWrapper}>
                                        <Chart
                                            options={options}
                                            series={series}
                                            type="bar"
                                            height="650"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}