import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import { convertSchema, useStyles } from 'backstage-plugin-costinsight/src/hooks/utility';
import { Grid, Card, CardContent, makeStyles } from "@material-ui/core";
import { env } from 'process';
import { Page, Header, HeaderLabel, Content } from '@backstage/core-components';


const CostInsight = () => {
    const apiUrl = process.env.APP_CONFIG[0].data.backend.baseUrl
    var projectId = []
    var usage_amount = []
    var service_description = []

    useEffect(() => {
        const getData = async () => {

            const url = `${apiUrl}/api/bigqueryapi/dataset`
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                });

                const data = await response.json();

                const rrows = convertSchema(data.responseData.schema.fields, data.responseData.rows);
                projectId.push(rrows[0].id)

                for (var i = 0; i < 5; i++) {
                    usage_amount.push(rrows[i].usage_amt)
                    service_description.push(rrows[i].description)
                }
            } catch (error) {
                console.log(error);
            }
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
            data: usage_amount
        },
        {
            name: 'Q2 Budget',
            group: 'budget',
            data: [12000, 42000, 38000, 89000, 88700]
        },
        {
            name: 'Q2 Consumed',
            group: 'actual',
            data: usage_amount
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
            text: 'Cost Trend Year - (2023 - 2024)',
            align: 'center',
            offsetX: 90,
            style: {
                fontSize: '18px'
            }
        },
        // subtitle: {
        //     text: projectId,
        //     align: 'center',
        //     margin: 5,
        //     offsetY: 40,
        //     style: {
        //         color: '#df6124',
        //         fontSize: '14px',
        //     }
        // },
        dataLabels: {
            formatter: (val) => { return val / 1000 + "$" }
        },
        xaxis: {
            categories: service_description,
            tickAmount: 5,
            labels: {
                formatter: (val) => {
                    return val / 1000 + '$'
                }
            },
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

    const classes = useStyles();
    return (
        <Page themeId="tool">
            <Header title="MCCP Cloud Expense Summary" subtitle="(Google Cloud Environment)" >
                <HeaderLabel label="PROJECT" value={projectId} />
            </Header>
            <Content>
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
            </Content>
        </Page>
    )
}

export default CostInsight
