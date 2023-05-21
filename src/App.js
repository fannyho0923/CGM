import "./App.css";
import React, { useState, useRef } from "react";
import { groupBy } from "lodash-es";
import { ExcelRenderer } from "react-excel-renderer";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Dataset from "../src/Container/Dataset";
import { Line } from "react-chartjs-2";
import { Input, FormGroup, Typography, Button, Box } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [charts, setCharts] = useState([]);
  const [isFormInvalid, setIsFormInvalid] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [groupByDay, setGroupByDay] = useState([]);
  const fileInput = useRef();
  const openFileBrowser = () => {
    fileInput.current.click();
  };

  const fileHandler = (event) => {
    if (event.target.files.length) {
      let fileObj = event.target.files[0];
      let fileName = fileObj.name;

      //check for file extension and pass only if it is .xlsx and display error message otherwise
      if (fileName.slice(fileName.lastIndexOf(".") + 1) === "xlsx") {
        setUploadedFileName(fileName);
        setIsFormInvalid(false);
        // console.log(fileObj);
        renderFile(fileObj);
      } else {
        setUploadedFileName("");
        setIsFormInvalid(true);
      }
    }
  };

  const renderFile = (fileObj) => {
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log("err");
      } else {
        const rows = groupBy(resp.rows.slice(1), (date) => {
          return date[0];
        });
        setGroupByDay(rows);
        const tmpCharts = [];
        Object.entries(rows).map((row) => {
          const tmpArr = [];
          const minArr = [];
          const maxArr = [];
          for (let idx = 0; idx < row[1].length; idx++) {
            tmpArr.push({
              x: row[1][idx][1] * 60 + row[1][idx][2],
              y: row[1][idx][3],
            });
          }

          tmpCharts.push({
            label: row[0],
            data: {
              labels: new Array(1440).fill(0).map((_, i) => i),
              datasets: [
                {
                  label: row[0],
                  data: tmpArr,
                  borderColor: "rgb(255, 99, 132)",
                  backgroundColor: "rgba(255, 99, 132, 0.5)",
                  pointStyle: false,
                },
              ],
            },
            plugins: {
              annotation: {
                annotations: {
                  line1: {
                    type: "line",
                    yMin: 60,
                    yMax: 60,
                    borderColor: "rgb(255, 99, 132)",
                    borderWidth: 2,
                  },
                },
              },
            },
          });
        });
        setCharts(tmpCharts);
      }
    });
  };
  console.log(charts);

  const arr = [
    [20230324, 15, 31, 110],
    [20230323, 17, 32, 96],
    [20230325, 21, 32, 104],
    [20230324, 21, 32, 104],
    [20230323, 23, 32, 108],
  ];

  const labelArr = new Array(1440).fill(0).map((_, i) => i);
  let tmpArr = [];

  for (let idx = 0; idx < arr.length; idx++) {
    // const idx = x[1]*60+x[2];
    // dataArr[idx] = x[3];
    tmpArr.push({ x: arr[idx][1] * 60 + arr[idx][2], y: arr[idx][3] });
  }

  const opts = {
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          // For a category axis, the val is the index so the lookup via getLabelForValue is needed
          callback: function (val, index) {
            // Hide every 2nd tick label
            return index % 120 === 0 ? this.getLabelForValue(val) / 60 : "";
          },
          color: "red",
        },
      },
    },
  };

  return (
    <Box>
      <Box>
        <form>
          <FormGroup row>
            <Box xs={4} sm={8} lg={10}>
              <Box>
                <Box addonType="prepend">
                  <Button color="info" onClick={openFileBrowser}>
                    <i className="cui-file"></i> Browse&hellip;
                  </Button>
                  <input
                    type="file"
                    hidden
                    onChange={fileHandler}
                    ref={fileInput}
                    onClick={(event) => {
                      event.target.value = null;
                    }}
                    style={{ padding: "10px" }}
                  />
                </Box>
                <Input
                  type="text"
                  className="form-control"
                  value={uploadedFileName}
                  readOnly
                  invalid={isFormInvalid}
                />
              </Box>
            </Box>
          </FormGroup>
        </form>
      </Box>

      <Box style={{ width: "50%" }}>
        {charts.map((chart) => {
          const { label, data } = chart;
          return <Line key={label} data={data} options={opts} />;
        })}
      </Box>
      <Dataset />
    </Box>
  );
}

export default App;
