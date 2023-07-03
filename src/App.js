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
import annotationPlugin from "chartjs-plugin-annotation";
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
import AssignTable from "../src/Container/AssignTable";
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
} from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
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

const MainDoc = ({ handleReset }) => {
  const ref = createRef();
  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });
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
  const [dietContent, setDietContent] = useState([]);
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
      title: `第一餐${getTimeText(times.startDay1Time, times.endDay1Time)}`,
      dietContent: "",
      iDiet: "",
      remarks: { iVal: false, dVal: false, pcVal: false },
    },
    {
      title: `第二餐${getTimeText(times.startDay2Time, times.endDay2Time)}`,
      dietContent: "",
      iDiet: "",
      remarks: { iVal: false, dVal: false, pcVal: false },
    },
    {
      title: `第三餐${getTimeText(times.startDay3Time, times.endDay3Time)}`,
      dietContent: "",
      iDiet: "",
      remarks: { iVal: false, dVal: false, pcVal: false },
    },
    {
      title: `第四餐${getTimeText(times.startDay4Time, times.endDay4Time)}`,
      dietContent: "",
      iDiet: "",
      remarks: { iVal: false, dVal: false, pcVal: false },
    },
    {
      title: `第五餐${getTimeText(times.startDay5Time, times.endDay5Time)}`,
      dietContent: "",
      iDiet: "",
      remark: "1",
      remarks: { iVal: false, dVal: false, pcVal: false },
    },
  ]);

  const [listDay, setListDay] = useState([]);

  const handleChangeChart = (event) => {
    setSelectedChart(event.target.value);
  };

  const handleDietContent = (e, day) => {
    const updatedDietContent = dietContent; // 建立陣列副本

    updatedDietContent[day - 1] = e.target.value;

    setDietContent(updatedDietContent);
  };
  console.log(records);

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

  const handleSubmit = (selectedDateTime) => {
    const alignedData = new Array(listDay.length * 1440).fill("");
    for (let i = 0; i < rawData.length; i++) {
      let idx = listDay.findIndex(
        (val) => Number(val) === Number(rawData[i][0])
      );
      alignedData[rawData[i][1] * 60 + rawData[i][2] + 1440 * idx] = rawData[i];
    }

    const alignedArr = [];

    for (let i = 0; i < listDay.length - 1; i++) {
      alignedArr.push([
        `${listDay[i]}`,
        alignedData.slice(
          selectedDateTime + i * 1440,
          selectedDateTime + 1440 + i * 1440
        ),
      ]);
    }

    const alignedCharts = [];

    alignedArr.map((row) => {
      const tmpArr = [];
      for (let idx = 0; idx < row[1].length; idx++) {
        tmpArr.push({
          x: row[1][idx][1] * 60 + row[1][idx][2],
          y: row[1][idx][3],
          bsv: round(row[1][idx][3] / 18, 1),
        });
      }
      alignedCharts.push({
        label: row[0],
        data: {
          labels: new Array(1440).fill(0).map((_, i) => {
            const tmpLabel =
              Math.trunc(selectedDateTime / 60) + Math.trunc(i / 60);
            return tmpLabel >= 24 ? tmpLabel - 24 : tmpLabel;
          }),
          datasets: [
            {
              label: row[0],
              data: tmpArr,
              borderColor: "rgb(22, 88, 146)",
              backgroundColor: "rgba(22, 88, 146, 0.5)",
              pointStyle: false,
            },
          ],
        },
      });
    });

    setCharts(alignedCharts);
    if (!isEmpty(alignedCharts) && selectedChart === "allDays") {
      setChart(alignedCharts);
    }
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
        const selectedDateTime = 0;
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
              labels: new Array(1440).fill(0).map((_, i) => {
                return Math.trunc(selectedDateTime / 60);
              }),
              datasets: [
                {
                  label: row[0],
                  data: tmpArr,
                  borderColor: "rgb(22, 88, 146)",
                  backgroundColor: "rgba(22, 88, 146, 0.5)",
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
          maxTicksLimit: 24,
          color: "red",
        },
      },
      y: {
        min: 50,
        max: 250,
      },
    },
    plugins: {
      annotation: {
        annotations: {
          box1: {
            type: "box",
            xMin: times.startDay1Time.$H * 60 + times.startDay1Time.$m || 0,
            xMax:
              times.endDay1Time.$H * 60 + times.endDay1Time.$m ||
              times.startDay1Time.$H * 60 + times.startDay1Time.$m ||
              0,
            yMin: 50,
            yMax: 250,
            backgroundColor: "rgba(2, 152, 154, 0.34)",
          },
          box2: {
            type: "box",
            xMin: times.startDay2Time.$H * 60 + times.startDay2Time.$m || 0,
            xMax:
              times.endDay2Time.$H * 60 + times.endDay2Time.$m ||
              times.startDay2Time.$H * 60 + times.startDay2Time.$m ||
              0,
            yMin: 50,
            yMax: 250,
            backgroundColor: "rgba(2, 152, 154, 0.34)",
          },
          box3: {
            type: "box",
            xMin: times.startDay3Time.$H * 60 + times.startDay3Time.$m || 0,
            xMax:
              times.endDay3Time.$H * 60 + times.endDay3Time.$m ||
              times.startDay3Time.$H * 60 + times.startDay3Time.$m ||
              0,
            yMin: 50,
            yMax: 250,
            backgroundColor: "rgba(2, 152, 154, 0.34)",
          },
          box4: {
            type: "box",
            xMin: times.startDay4Time.$H * 60 + times.startDay4Time.$m || 0,
            xMax:
              times.endDay4Time.$H * 60 + times.endDay4Time.$m ||
              times.startDay4Time.$H * 60 + times.startDay4Time.$m ||
              0,
            yMin: 50,
            yMax: 250,
            backgroundColor: "rgba(2, 152, 154, 0.34)",
          },
          box5: {
            type: "box",
            xMin: times.startDay5Time.$H * 60 + times.startDay5Time.$m || 0,
            xMax:
              times.endDay5Time.$H * 60 + times.endDay5Time.$m ||
              times.startDay5Time.$H * 60 + times.startDay5Time.$m ||
              0,
            yMin: 50,
            yMax: 250,
            backgroundColor: "rgba(2, 152, 154, 0.34)",
          },
        },
      },
    },
  };

  useEffect(() => {
    setShowChart(false);
    if (selectedChart === "allDays") {
      setSelectedDate("");
    }
    setChart(selectedChart === "allDays" ? charts : oneChart);
  }, [selectedChart, selectedDate, times.startDateTime]);

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
    setShowChart(false);
  }, [times.startDateTime]);

  useEffect(() => {
    setRecords([
      {
        title: `第一餐${getTimeText(times.startDay1Time, times.endDay1Time)}`,
        dietContent: dietContent[0],
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
        title: `第二餐${getTimeText(times.startDay2Time, times.endDay2Time)}`,
        dietContent: dietContent[1],
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
        title: `第三餐${getTimeText(times.startDay3Time, times.endDay3Time)}`,
        dietContent: dietContent[2],
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
        title: `第四餐${getTimeText(
          times.startDay4Time,
          times.endDay4Time,
          times.endDay4Time
        )}`,
        dietContent: dietContent[3],
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
        title: `第五餐${getTimeText(
          times.startDay5Time,
          times.endDay5Time,
          times.endDay5Time
        )}`,
        dietContent: dietContent[4],
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
  }, [times, records]);

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
              {!isEmpty(charts) && (
                <Box className="mb-2">
                  <RowRadioButtonsGroup onChange={handleChangeChart} />
                  {!isEmpty(selectedChart) && (
                    <>
                      <Typography>選擇開始時間段</Typography>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["TimePicker"]}>
                          <TimePicker
                            value={times.startDateTime || null}
                            label="Basic time picker"
                            onChange={(e) =>
                              handleChangeTime(e, "startDateTime")
                            }
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </>
                  )}
                </Box>
              )}
              {selectedChart === "oneDay" && (
                <AssignTable
                  records={records}
                  listDay={listDay}
                  selectedDate={selectedDate}
                  handleDate={handleChangeDate}
                  handleTime={handleChangeTime}
                  handleDietContent={handleDietContent}
                />
              )}
              <Box className="flex space-x-2 my-2">
                <Button
                  variant="contained"
                  className="w-1/3"
                  onClick={() =>
                    handleSubmit(
                      times.startDateTime.$H * 60 + times.startDateTime.$m
                    )
                  }
                >
                  Submit
                </Button>
                <Button
                  variant="contained"
                  className="w-1/3"
                  onClick={handleReset}
                >
                  Reset
                </Button>
                {showChart && (
                  <Button
                    variant="contained"
                    className="w-1/3"
                    onClick={handlePrint}
                  >
                    Print
                  </Button>
                )}
              </Box>
            </Box>
          </FormGroup>
        </form>
      </Box>
      <div
        style={{ margin: "0 auto", width: "100%", height: "100%" }}
        ref={ref}
        filename="gmt.pdf"
      >
        <MainChart
          showChart={showChart}
          chart={chart}
          opts={opts}
          selectedDate={selectedDate}
          times={times}
          records={records}
          dayVal={dayVal}
        />
      </div>
    </Box>
  );
};

const MainChart = ({
  showChart = false,
  chart = [],
  opts = {},
  selectedDate = false,
  times = {},
  records = [],
}) => {
  return (
    <>
      {showChart && (
        <Box className="w-full">
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
    </>
  );
};

function App() {
  const [count, setCount] = useState(0);
  const handleReset = () => {
    setCount((pre) => pre + 1);
  };

  return <MainDoc key={count} handleReset={handleReset} />;
}

export default App;
