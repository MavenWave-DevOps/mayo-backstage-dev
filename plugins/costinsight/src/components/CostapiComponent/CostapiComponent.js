import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import { convertSchema, useStyles } from 'backstage-plugin-costinsight/src/hooks/utility';
import { Grid, Card, CardContent, makeStyles } from "@material-ui/core";
import { env } from 'process';
import { Page, Header, HeaderLabel, Content } from '@backstage/core-components';

export const CostapiComponent = () => {
    const apiUrl = process.env.APP_CONFIG[0].data.backend.baseUrl
    var invoiceMonth = []
    var usage_amount = []
    var service_description = []
    var folderId = []
    var Environment = []
    var TotalCost = []

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
                folderId.push(rrows[0].folderID)
                invoiceMonth.push(rrows[0].invoice_month)

                for (var i = 0; i < 2; i++) {
                    usage_amount.push(rrows[i].usage_amount)
                    service_description.push(rrows[i].service_description)
                    if (rrows[i].env === null) {
                        Environment.push('N/A')
                    }
                    else {
                        Environment.push(rrows[i].env)
                    }
                }
                const TotalValues = Object.values(usage_amount);
                sum = values.reduce((accumulator, TotalValues) => {
                    return accumulator + value;
                }, 0);
                TotalCost.push(sum);

            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, []);

    var randomizeArray = function (arg) {
        var array = arg.slice();
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
    var sparklineData = [47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46];

    var spark1 = {
        chart: {
            id: 'sparkline1',
            group: 'sparklines',
            type: 'area',
            height: 160,
            sparkline: {
                enabled: true
            },
        },
        stroke: {
            curve: 'straight'
        },
        fill: {
            opacity: 1,
        },
        series: [{
            name: 'Spend',
            data: randomizeArray(sparklineData)
        }],
        labels: [...Array(24).keys()].map(n => `2018-09-0${n + 1}`),
        yaxis: {
            min: 0,
            labels: {
                show: false
            }
        },
        xaxis: {
            type: 'datetime',
        },
        colors: ['#DCE6EC'],
        title: {
            text: '$ -' + [usage_amount],
            offsetX: 30,
            style: {
                fontSize: '24px',
                cssClass: 'apexcharts-yaxis-title'
            }
        },
        subtitle: {
            text: 'Total Cost',
            offsetX: 30,
            style: {
                fontSize: '14px',
                cssClass: 'apexcharts-yaxis-title'
            }
        }
    }

    var optionsArea = {
        chart: {
            type: 'bar',
            height: 250,
            width: '100%',
            stacked: true,
            foreColor: '#999',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: false
                },
                columnWidth: '75%',
                endingShape: 'rounded',

                borderRadius: 4,
                horizontal: true,
            }
        },
        colors: ["#4287f5", '#F3F2FC'],
        series: [{
            data: [400, 430, 448]
        }],
        // labels: [15, 16, 17, 18, 19, 20, 21, 22],
        xaxis: {
            categories: Environment,
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            crosshairs: {
                show: false
            },
            labels: {
                show: false,
                style: {
                    fontSize: '14px'
                }
            },
        },
        grid: {
            xaxis: {
                lines: {
                    show: false
                },
            },
            yaxis: {
                lines: {
                    show: false
                },
            }
        },
        yaxis: {
            categories: service_description,
            axisBorder: {
                show: false
            },
            labels: {
                show: true
            },
        },
        legend: {
            floating: true,
            position: 'top',
            horizontalAlign: 'right',
            offsetY: -36
        },
        title: {
            text: 'Monthly Spend Per Environment',
            align: 'left',
        },
        subtitle: {
            text: folderId
        },
        tooltip: {
            shared: true,
            intersect: false
        }
    }

    var colorPalette = ['#00D8B6', '#008FFB', '#FEB019', '#FF4560', '#775DD0']
    var optionDonut = {
        chart: {
            type: 'bar',
            height: 250,
            width: '100%',
            stacked: true,
            foreColor: '#999',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                },
                columnWidth: '75%',
                endingShape: 'rounded',
                borderRadius: 6,
            }
        },
        colors: ["#4287f5", '#F3F2FC'],
        series: [{
            data: [400, 430, 908, 470, 540, 580, 690, 1100]
        }],
        xaxis: {
            categories: service_description,
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            crosshairs: {
                show: false
            },
            labels: {
                show: true,
                style: {
                    fontSize: '14px'
                }
            },
        },
        grid: {
            xaxis: {
                lines: {
                    show: false
                },
            },
            yaxis: {
                lines: {
                    show: false
                },
            }
        },
        yaxis: {
            axisBorder: {
                show: false
            },
            labels: {
                show: false
            },
        },
        legend: {
            floating: true,
            position: 'top',
            horizontalAlign: 'right',
            offsetY: -36
        },
        title: {
            text: 'Monthly Spend per Folder-ID',
            align: 'left',
        },
        subtitle: {
            text: folderId
        },
        tooltip: {
            shared: true,
            intersect: false
        }
    }

    const classes = useStyles();
    return (
        <Page themeId="tool">
            <div id='boxes'>
                <div>
                    <Content>
                        <Grid className={classes.container} container spacing={0}>
                            <Grid item className={classes.item}>
                                <Grid container className={classes.charts} spacing={2}>
                                    <Grid item>
                                        <Card className={classes.card}>
                                            <CardContent>
                                                <div className={classes.content}>
                                                    <div className={classes.chartWrapper}>
                                                        <Chart
                                                            options={spark1}
                                                            series={spark1.series}
                                                            type="area"
                                                            height="100%"
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
                </div>

                <div>
                    <Content>
                        <Grid className={classes.container} container spacing={0}>
                            <Grid item className={classes.item}>
                                <Grid container className={classes.charts} spacing={2}>
                                    <Grid item>
                                        <Card className={classes.card}>
                                            <CardContent>
                                                <div id='rightbox' className={classes.content}>
                                                    <div className={classes.chartWrapper}>
                                                        <Chart
                                                            options={optionsArea}
                                                            series={optionsArea.series}
                                                            type="bar"
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
                </div>
            </div>
            <div>
                <Content>
                    <Grid className={classes.container} container spacing={0}>
                        <Grid item className={classes.item}>
                            <Grid container className={classes.charts} spacing={2}>
                                <Grid item>
                                    <Card className={classes.card}>
                                        <CardContent>
                                            <div id='rightbox' className={classes.content}>
                                                <div className={classes.chartWrapper}>
                                                    <Chart
                                                        options={optionDonut}
                                                        series={optionDonut.series}
                                                        type="bar"
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
            </div>

        </Page>
    )
}
