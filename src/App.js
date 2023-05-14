import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import { groupBy } from "lodash-es";
import { OutTable, ExcelRenderer } from "react-excel-renderer";
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
  const [isOpen, setIsOpen] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataset, setDataset] = useState([]);
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
        // const array = [];
        // Object.entries(rows).map((pre) => console.log(pre));
        // console.log(Object.keys(rows).length);
        const tmpCharts = [];
        Object.entries(rows).map((row) => {
          const tmpArr = [];
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
                },
              ],
            },
          });
        });
        const aaa = new Array(1440).fill(0).map((_, i) => i);

        console.log(aaa);
        setCharts(tmpCharts);

        // {
        //   label: "Dataset 1",
        //   data: dataset,
        //   borderColor: "rgb(255, 99, 132)",
        //   backgroundColor: "rgba(255, 99, 132, 0.5)",
        // }

        // const tmpArr = [];
        // for (let idx = 0; idx < rows.length; idx++) {
        //   // const idx = x[1]*60+x[2];
        //   // dataArr[idx] = x[3];
        //   tmpArr.push({ x: rows[idx][1] * 60 + rows[idx][2], y: rows[idx][3] });
        //   // tmpArr.push({ x: rows[idx][1] * 60 + rows[idx][2], y: rows[idx][3] });
        // }
        // setDataset(tmpArr);
        // console.log(tmpArr);

        // this.setState({
        //   dataLoaded: true,
        //   cols: resp.cols,
        //   rows: resp.rows
        // });
      }
    });
  };
  console.log(charts);

  // console.log("groupByDay");
  // console.log(groupByDay);

  // ["Date(年/月/日)", "時", "分", "CGMGlucoseValue"],
  const arr = [
    [20230324, 15, 31, 110],
    [20230323, 17, 32, 96],
    [20230325, 21, 32, 104],
    [20230324, 21, 32, 104],
    [20230323, 23, 32, 108],
  ];

  // const groupByDay = groupBy(arr, (product) => {
  //   return product[0];
  // });

  // console.log(groupByDay);
  //
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
          display: false
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

  const data = {
    labels: labelArr,
    datasets: [
      {
        label: "Dataset 1",
        data: dataset,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      // {
      //   label: "Dataset 2",
      //   data: timeLabel.map(() => -1000),
      //   borderColor: "rgb(53, 162, 235)",
      //   backgroundColor: "rgba(53, 162, 235, 0.5)",
      // },
    ],
  };

  return (
    <div>
      <div></div>
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
        {/* <p>{console.log(charts)}</p> */}
        {charts.map((chart) => {
          const { label, data } = chart;
          return <Line key={label} data={data} options={opts} />;
        })}
      </Box>
    </div>
  );
}

export default App;
