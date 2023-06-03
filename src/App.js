import "./App.css";
import { useReactToPrint } from "react-to-print";
import React, { useState, useRef, useEffect, createRef } from "react";
import dayjs from "dayjs";
import { groupBy, round, isEmpty } from "lodash-es";
import { ExcelRenderer } from "react-excel-renderer";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
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
import {
  getTimeText,
  getRangeArr,
  getIArr,
  getJArr,
  getMaxBsv,
  getIDiet,
  getIval,
  getDval,
  getPCval,
} from "../src/utils";
import Dataset from "../src/Container/Dataset";
import RecordSheet from "../src/Container/RecordSheet";
import { Line } from "react-chartjs-2";
import {
  Input,
  FormGroup,
  Typography,
  Button,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RowRadioButtonsGroup = ({ onChange = () => {} }) => {
  return (
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        onChange={onChange}
      >
        <FormControlLabel
          value="allDays"
          control={<Radio />}
          label="整合各天數"
        />
        <FormControlLabel
          value="oneDay"
          control={<Radio />}
          label="一日完整報告"
        />
      </RadioGroup>
    </FormControl>
  );
};

const AssignTable = ({
  listDay,
  selectedDate,
  handleDate = () => {},
  handleTime = () => {},
}) => {
  return (
    <>
      <FormControl className="w-1/2">
        <InputLabel id="select-label">選擇第幾天</InputLabel>
        <Select
          labelId="select-label"
          id="select-date"
          value={selectedDate}
          label="選擇第幾天"
          onChange={handleDate}
        >
          {listDay.map((val) => (
            <MenuItem value={val}>{val}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box className="grid grid-cols-2 gap-4">
        <Box>
          <Typography>第一餐</Typography>
          <Box className="flex space-x-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  label="第一餐開始"
                  onChange={(e) => handleTime(e, "startDay1Time")}
                />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  label="第一餐結束"
                  onChange={(e) => handleTime(e, "endDay1Time")}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </Box>
        <Box>
          <Typography>第二餐</Typography>
          <Box className="flex space-x-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  label="第二餐開始"
                  onChange={(e) => handleTime(e, "startDay2Time")}
                />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  label="第二餐結束"
                  onChange={(e) => handleTime(e, "endDay2Time")}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </Box>
        <Box>
          <Typography>第三餐</Typography>
          <Box className="flex space-x-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  label="第三餐開始"
                  onChange={(e) => handleTime(e, "startDay3Time")}
                />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  label="第三餐結束"
                  onChange={(e) => handleTime(e, "endDay3Time")}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </Box>
        <Box>
          <Typography>第四餐</Typography>
          <Box className="flex space-x-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  label="第四餐開始"
                  onChange={(e) => handleTime(e, "startDay4Time")}
                />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  label="第四餐結束"
                  onChange={(e) => handleTime(e, "endDay4Time")}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </Box>
        <Box>
          <Typography>第五餐</Typography>
          <Box className="flex space-x-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  label="第五餐開始"
                  onChange={(e) => handleTime(e, "startDay5Time")}
                />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  label="第五餐結束"
                  onChange={(e) => handleTime(e, "endDay5Time")}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </Box>
      </Box>
    </>
  );
};

const MainDoc = () => {
  const [rawData, setRawData] = useState([]);
  const [chart, setChart] = useState([]);
  const [charts, setCharts] = useState([]);
  const [oneChart, setOneChart] = useState([]);
  const [isFormInvalid, setIsFormInvalid] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [groupByDay, setGroupByDay] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedChart, setSelectedChart] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [dayVal, setDayVal] = useState([]);
  const [times, setTimes] = useState({
    startDateTime: "",
    startDay1Time: "",
    startDay2Time: "",
    startDay3Time: "",
    startDay4Time: "",
    startDay5Time: "",
    endDay1Time: "",
    endDay2Time: "",
    endDay3Time: "",
    endDay4Time: "",
    endDay5Time: "",
  });

  const [records, setRecords] = useState([
    {
      title: `第一餐(${getTimeText(times.startDay1Time, times.endDay1Time)})`,
      dietContent: "1227Buffet",
      iDiet: "",
      remarks: { iVal: false, dVal: false, pcVal: false },
    },
    {
      title: `第二餐(${getTimeText(times.startDay2Time, times.endDay2Time)})`,
      dietContent: "1227Buffet",
      iDiet: "",
      remarks: { iVal: false, dVal: false, pcVal: false },
    },
    {
      title: `第三餐(${getTimeText(times.startDay3Time, times.endDay3Time)})`,
      dietContent: "1227Buffet",
      iDiet: "",
      remarks: { iVal: false, dVal: false, pcVal: false },
    },
    {
      title: `第四餐(${getTimeText(times.startDay4Time, times.endDay4Time)})`,
      dietContent: "1227Buffet",
      iDiet: "",
      remarks: { iVal: false, dVal: false, pcVal: false },
    },
    {
      title: `第五餐(${getTimeText(times.startDay5Time, times.endDay5Time)})`,
      dietContent: "1227Buffet",
      iDiet: "",
      remark: "1",
      remarks: { iVal: false, dVal: false, pcVal: false },
    },
  ]);

  const [listDay, setListDay] = useState([]);

  function handleChangeChart(event) {
    setSelectedChart(event.target.value);
  }

  const handleChangeTime = (e, name) => {
    setTimes((prevState) => ({
      ...prevState,
      [name]: e,
    }));
  };

  const fileInput = useRef();
  const openFileBrowser = () => {
    fileInput.current.click();
  };

  const handleChangeDate = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSubmit = () => {
    setShowChart(true);
  };

  const fileHandler = (event) => {
    if (event.target.files.length) {
      let fileObj = event.target.files[0];
      let fileName = fileObj.name;

      //check for file extension and pass only if it is .xlsx and display error message otherwise
      if (fileName.slice(fileName.lastIndexOf(".") + 1) === "xlsx") {
        setUploadedFileName(fileName);
        setIsFormInvalid(false);
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
        setRawData(resp.rows.slice(1));
        const rows = groupBy(resp.rows.slice(1), (date) => {
          return date[0];
        });
        setGroupByDay(rows);
        const tmpCharts = [];
        Object.entries(rows).map((row) => {
          const tmpArr = [];
          for (let idx = 0; idx < row[1].length; idx++) {
            tmpArr.push({
              x: row[1][idx][1] * 60 + row[1][idx][2],
              y: row[1][idx][3],
              bsv: round(row[1][idx][3] / 18, 1),
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
          });
        });
        setCharts(tmpCharts);
        setListDay(Object.keys(groupBy(tmpCharts, "label")));
      }
    });
  };

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
            return index % 120 === 0
              ? parseInt(this.getLabelForValue(val) / 60)
              : "";
          },
          color: "red",
        },
        // min: times.startDateTime.$H * 60 + times.startDateTime.$m || 0,
      },
      y: {
        min: 50,
        max: 250,
      },
    },
  };

  useEffect(() => {
    setShowChart(false);
    if (selectedChart === "allDays") {
      setSelectedDate("");
    }
    setChart(selectedChart === "allDays" ? charts : oneChart);
  }, [selectedChart, selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      setChart([charts.find(({ label }) => label === selectedDate)]);
      setDayVal(chart[0]?.data.datasets[0].data);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      setDayVal(chart[0]?.data.datasets[0].data);
    }
  }, [chart]);

  useEffect(() => {
    const selectedDateTime =
      times.startDateTime.$H * 60 + times.startDateTime.$m;

    const tempArr = [];
    for (let i = 0; i < rawData.length; i++) {
      if (rawData[i][1] * 60 + rawData[i][2] >= selectedDateTime) {
        if (
          tempArr.find((tempItem) => tempItem[0] === rawData[i][0]) ===
          undefined
        ) {
          tempArr.push(rawData[i]);
        } else {
          continue;
        }
      }
    }
    const resArr = [];
    for (let i = 0; i < tempArr.length - 1; i++) {
      resArr.push([
        `${tempArr[i][0]}`,
        rawData.slice(
          rawData.findIndex((item) => item === tempArr[i]),
          rawData.findIndex((item) => item === tempArr[i + 1])
        ),
      ]);
    }
    const tmpCharts = [];

    resArr.map((row) => {
      const tmpArr = [];
      for (let idx = 0; idx < row[1].length; idx++) {
        tmpArr.push({
          x: row[1][idx][1] * 60 + row[1][idx][2],
          y: row[1][idx][3],
          bsv: round(row[1][idx][3] / 18, 1),
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
      });
    });

    setCharts(tmpCharts);
    setListDay(Object.keys(groupBy(tmpCharts, "label")));
  }, [times.startDateTime]);

  useEffect(() => {
    setRecords([
      {
        title: `第一餐(${getTimeText(times.startDay1Time, times.endDay1Time)})`,
        dietContent: "1227Buffet",
        iDiet: getIDiet(
          getIArr(getRangeArr(dayVal, times.startDay1Time, times.endDay1Time)),
          getJArr(
            getIArr(getRangeArr(dayVal, times.startDay1Time, times.endDay1Time))
          )
        ),
        remarks: {
          iVal: getIval(
            getRangeArr(dayVal, times.startDay1Time, times.endDay1Time)?.shift()
              ?.bsv,
            dayVal,
            getRangeArr(dayVal, times.startDay1Time, times.endDay1Time)
          ),
          dVal: getDval(
            getRangeArr(dayVal, times.startDay1Time, times.endDay1Time)?.pop()
              ?.bsv,
            getRangeArr(dayVal, times.startDay1Time, times.endDay1Time)?.shift()
              ?.bsv
          ),
          pcVal: getPCval(
            getMaxBsv(
              getRangeArr(dayVal, times.startDay1Time, times.endDay1Time)
            ),
            getRangeArr(dayVal, times.startDay1Time, times.endDay1Time)?.shift()
              ?.bsv
          ),
        },
      },
      {
        title: `第二餐(${getTimeText(times.startDay2Time, times.endDay2Time)})`,
        dietContent: "1227Buffet",
        iDiet: getIDiet(
          getIArr(getRangeArr(dayVal, times.startDay2Time, times.endDay2Time)),
          getJArr(
            getIArr(getRangeArr(dayVal, times.startDay2Time, times.endDay2Time))
          )
        ),
        remarks: {
          iVal: getIval(
            getRangeArr(dayVal, times.startDay2Time, times.endDay2Time)?.shift()
              ?.bsv,
            dayVal,
            getRangeArr(dayVal, times.startDay2Time, times.endDay2Time)
          ),
          dVal: getDval(
            getRangeArr(dayVal, times.startDay2Time, times.endDay2Time)?.pop()
              ?.bsv,
            getRangeArr(dayVal, times.startDay2Time, times.endDay2Time)?.shift()
              ?.bsv
          ),
          pcVal: getPCval(
            getMaxBsv(
              getRangeArr(dayVal, times.startDay2Time, times.endDay2Time)
            ),
            getRangeArr(dayVal, times.startDay2Time, times.endDay2Time)?.shift()
              ?.bsv
          ),
        },
      },
      {
        title: `第三餐(${getTimeText(times.startDay3Time, times.endDay3Time)})`,
        dietContent: "1227Buffet",
        iDiet: getIDiet(
          getIArr(getRangeArr(dayVal, times.startDay3Time, times.endDay3Time)),
          getJArr(
            getIArr(getRangeArr(dayVal, times.startDay3Time, times.endDay3Time))
          )
        ),
        remarks: {
          iVal: getIval(
            getRangeArr(dayVal, times.startDay3Time, times.endDay3Time)?.shift()
              ?.bsv,
            dayVal,
            getRangeArr(dayVal, times.startDay3Time, times.endDay3Time)
          ),
          dVal: getDval(
            getRangeArr(dayVal, times.startDay3Time, times.endDay3Time)?.pop()
              ?.bsv,
            getRangeArr(dayVal, times.startDay3Time, times.endDay3Time)?.shift()
              ?.bsv
          ),
          pcVal: getPCval(
            getMaxBsv(
              getRangeArr(dayVal, times.startDay3Time, times.endDay3Time)
            ),
            getRangeArr(dayVal, times.startDay3Time, times.endDay3Time)?.shift()
              ?.bsv
          ),
        },
      },
      {
        title: `第四餐(${getTimeText(
          times.startDay4Time,
          times.endDay4Time,
          times.endDay4Time
        )})`,
        dietContent: "1227Buffet",
        iDiet: getIDiet(
          getIArr(getRangeArr(dayVal, times.startDay4Time, times.endDay4Time)),
          getJArr(
            getIArr(getRangeArr(dayVal, times.startDay4Time, times.endDay4Time))
          )
        ),
        remarks: {
          iVal: getIval(
            getRangeArr(dayVal, times.startDay4Time, times.endDay4Time)?.shift()
              ?.bsv,
            dayVal,
            getRangeArr(dayVal, times.startDay4Time, times.endDay4Time)
          ),
          dVal: getDval(
            getRangeArr(dayVal, times.startDay4Time, times.endDay4Time)?.pop()
              ?.bsv,
            getRangeArr(dayVal, times.startDay4Time, times.endDay4Time)?.shift()
              ?.bsv
          ),
          pcVal: getPCval(
            getMaxBsv(
              getRangeArr(dayVal, times.startDay4Time, times.endDay4Time)
            ),
            getRangeArr(dayVal, times.startDay4Time, times.endDay4Time)?.shift()
              ?.bsv
          ),
        },
      },
      {
        title: `第五餐(${getTimeText(
          times.startDay5Time,
          times.endDay5Time,
          times.endDay5Time
        )})`,
        dietContent: "1227Buffet",
        iDiet: getIDiet(
          getIArr(getRangeArr(dayVal, times.startDay5Time, times.endDay5Time)),
          getJArr(
            getIArr(getRangeArr(dayVal, times.startDay5Time, times.endDay5Time))
          )
        ),
        remark: "1",
        remarks: {
          iVal: getIval(
            getRangeArr(dayVal, times.startDay5Time, times.endDay5Time)?.shift()
              ?.bsv,
            dayVal,
            getRangeArr(dayVal, times.startDay5Time, times.endDay5Time)
          ),
          dVal: getDval(
            getRangeArr(dayVal, times.startDay5Time, times.endDay5Time)?.pop()
              ?.bsv,
            getRangeArr(dayVal, times.startDay5Time, times.endDay5Time)?.shift()
              ?.bsv
          ),
          pcVal: getPCval(
            getMaxBsv(
              getRangeArr(dayVal, times.startDay5Time, times.endDay5Time)
            ),
            getRangeArr(dayVal, times.startDay5Time, times.endDay5Time)?.shift()
              ?.bsv
          ),
        },
      },
    ]);
  }, [times]);

  return (
    <Box style={{ width: "100%" }}>
      <Box>
        <form>
          <FormGroup row>
            <Box className="flex flex-col">
              <Box className="flex space-x-2">
                <Box>
                  <Button
                    variant="outlined"
                    color="info"
                    onClick={openFileBrowser}
                  >
                    <i className="cui-file"></i> 匯入excel&hellip;
                  </Button>
                  <input
                    type={isEmpty(charts) ? "file" : "text"}
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
              <Typography>選擇開始時間段</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["TimePicker"]}>
                  <TimePicker
                    value={times.startDateTime || null}
                    label="Basic time picker"
                    onChange={(e) => handleChangeTime(e, "startDateTime")}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <RowRadioButtonsGroup onChange={handleChangeChart} />
              {selectedChart === "oneDay" && (
                <AssignTable
                  listDay={listDay}
                  selectedDate={selectedDate}
                  handleDate={handleChangeDate}
                  handleTime={handleChangeTime}
                />
              )}
              <Button
                variant="contained"
                className="w-1/2 "
                onClick={handleSubmit}
              >
                送出
              </Button>
            </Box>
          </FormGroup>
        </form>
      </Box>

      {showChart && (
        <Box style={{ width: "50%" }}>
          {chart.map((chart) => {
            const { label, data } = chart;
            return <Line key={label} data={data} options={opts} />;
          })}
        </Box>
      )}
      <Dataset />
      <RecordSheet
        date={selectedDate ? dayjs(selectedDate).format("M/D") : ""}
        times={times}
        records={records}
        dayVal={chart[0]?.data.datasets[0].data}
      />
    </Box>
  );
};

function App() {
  const ref = createRef();
  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });
  return (
    <>
      <div
        style={{ margin: "0 auto", width: "100%", height: "100%" }}
        ref={ref}
        filename="gmt.pdf"
      >
        <MainDoc />
      </div>
      <Button onClick={handlePrint}> Print</Button>
    </>
  );
}

export default App;
