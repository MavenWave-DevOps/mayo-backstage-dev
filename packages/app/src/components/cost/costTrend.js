import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import { Grid, Card, CardContent, makeStyles } from "@material-ui/core";
import { env } from 'process';


const CostInsight = () => {
    const apiKey = process.env.APP_CONFIG[0].data.auth.environment
    var projectId = []
    var usage_amount = []
    var service_description = []

    useEffect(() => {
        const getData = async () => {

            const url = 'https://bigquery.googleapis.com/bigquery/v2/projects/cedar-setup-394210/queries?access_token=' + apiKey
            // Query block
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify({
                        "query":
                            "SELECT distinct billing.project.id,price.service.description,price.billing_account_price.tiered_rates[SAFE_OFFSET(0) ].start_usage_amount AS usage_amt FROM cedar-setup-394210.costtrend.cloud_pricing_export price, cedar-setup-394210.costtrend.gcp_billing_export_v1_018341_C12D96_C76360 billing WHERE price.billing_account_price.tiered_rates[SAFE_OFFSET(0) ].start_usage_amount is not null AND TIMESTAMP_TRUNC(billing._PARTITIONTIME, DAY) = TIMESTAMP(current_date('UTC')) ORDER BY usage_amt DESC LIMIT 5"
                        , "useLegacySql": false
                    }),

                });
                /**
                 * Query block End
                 */
                const data = await response.json();
                const rrows = convertSchema(data.schema.fields, data.rows);
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
            text: 'MCCP- Cost Analysis (March-2023 - March 2024)',
            align: 'center',
            offsetX: 90,
            style: {
                fontSize: '18px'
            }
        },
        subtitle: {
            text: projectId,
            align: 'center',
            margin: 5,
            offsetY: 40,
            style: {
                color: '#9574bd',
                fontSize: '14px',
            }
        },
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

export default CostInsight

/**
 *  process response */

function convertSchema(schema, rows) {

    var resultRows = []

    function recurse(schemaCur, rowsCur, colName) {

        if (Array.isArray(schemaCur) && !Array.isArray(result[colName])) {
            for (var i = 0, l = schemaCur.length; i < l; i++) {
                if (colName === "")
                    recurse(schemaCur[i], rowsCur.f[i], colName + schemaCur[i].name)
                else
                    recurse(schemaCur[i], rowsCur.f[i], colName + "." + schemaCur[i].name)
            }
        }

        if (schemaCur.type && schemaCur.type === "RECORD") {
            if (schemaCur.mode !== "REPEATED") {
                var valIndex = 0
                for (var p in schemaCur.fields) {
                    if (rowsCur.v === null) {
                        recurse(schemaCur.fields[p], rowsCur, colName + "." + schemaCur.fields[p].name)
                    } else {
                        recurse(schemaCur.fields[p], rowsCur.v.f[valIndex], colName + "." + schemaCur.fields[p].name)
                    }

                    valIndex++
                }
            }

            if (schemaCur.mode === "REPEATED") {
                result[colName] = []
                for (var x in rowsCur.v) {
                    recurse(schemaCur.fields, rowsCur.v[x], colName)
                }
            }
        } else {
            if (schemaCur.mode === "REPEATED") {
                if (rowsCur.v !== null) {
                    result[colName] = rowsCur.v.map((value, index) => { return value.v })
                } else {
                    result[colName] = [null]
                }

            } else if (Array.isArray(result[colName])) {
                let nextRow = {}
                for (var j in schemaCur) {
                    nextRow[colName + "." + schemaCur[j].name] = Array.isArray(rowsCur.v.f[j].v) ? rowsCur.v.f[j].v.map((value, index) => { return value.v }) : rowsCur.v.f[j].v
                }
                result[colName].push(nextRow)
            } else {
                if (colName !== "")
                    result[colName] = rowsCur.v
            }
        }
    }

    for (var r = 0, rowsCount = rows.length; r < rowsCount; r++) {
        var result = {};
        recurse(schema, rows[r], "")
        resultRows.push(result)
    }
    return resultRows
};
/**
 * process response end*/ 