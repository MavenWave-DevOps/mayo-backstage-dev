
/*****************DO NOT EDIT CONTENT IN THIS FILE **************/

import { Grid, Card, CardContent, makeStyles } from "@material-ui/core";

/**
 *  process response */

export function convertSchema(schema, rows) {

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

/**
 * Object Data converstion utility method 
 * @param {*} input must be Object
 * @returns 
 */

export const withoutKeyObject = (input) => {
    let result = {};
    for (const key in input) {
        if (!input.hasOwnProperty(key)) {
            continue;
        }
        if (typeof input[key] === "object" && !Array.isArray(input[key])) {
            var subFlatObject = withoutKeyObject(input[key]);
            for (const subkey in subFlatObject) {
                result[key + "_" + subkey] = subFlatObject[subkey];
            }
        } else {
            result[key] = input[key];
        }
    }
    return result;
}

/**
 * Object Data converstion utility method!
 * @param {*} input must be data Object
 * @param {*} keyName must be the specific key which we need to retrieve the values
 * @returns 
 */
export const withKeyObject = (input, keyName) => {
    var result = {};
    for (const key in input) {
        const newKey = keyName ? `${keyName}_${key}` : key;
        if (typeof input[key] === "object" && !Array.isArray(input[key])) {
            result = { ...result, ...withKeyObject(input[key], newKey) }
        } else {
            result[newKey] = input[key];
        }
    }
    return result;
};

/**
 * Chart Style Properties
 */
export const useStyles = makeStyles((theme) => ({
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
