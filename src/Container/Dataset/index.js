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
import { Typography, Box } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ListItem = ({ title, subTitle, grade, color }) => {
  return (
    <Box className="flex justify-between items-center py-2 border-b">
      <Box>
        <p className="text-xl font-bold">{title}</p>
        <p className="text-xs text-slate-600">{subTitle}</p>
      </Box>
      <Box className="text-2xl font-bold" style={{ color: color }}>
        {grade}
      </Box>
    </Box>
  );
};

const GradeTable = () => {
  return (
    <Box className="flex flex-col">
      <p className="border-l-4 border-black pl-2 text-2xl mb-2">
        葡萄糖相關指標
      </p>
      <Box className="border border-slate-300 rounded p-2">
        <Box className="flex justify-evenly border-b-2 pb-2">
          <Box className="flex flex-col justify-between grow space-y-6">
            <Typography>2023/03/23 - 2023/04/02</Typography>
            <Typography>
              <span className="text-2xl font-bold">10</span>天
            </Typography>
          </Box>
          <Box className="flex flex-col justify-between border-l-2 border-slate-300 grow pace-y-6">
            <Typography>CGM運作時間</Typography>
            <Typography>
              <span className="text-2xl font-bold">100</span>%
            </Typography>
          </Box>
        </Box>
        <Box className="flex justify-evenly pt-2">
          <Box className="flex flex-col justify-between grow space-y-14">
            <Typography>平均值</Typography>
            <Typography>
              <span className="text-2xl font-bold">121</span>mg/dL
            </Typography>
          </Box>
          <Box className="flex flex-col justify-between border-l-2 border-slate-300 grow pace-y-14">
            <Typography>醣化血色素預估值(GMI)</Typography>
            <Typography>
              <span className="text-2xl font-bold">6.2</span>%
            </Typography>
          </Box>
          <Box className="flex flex-col justify-between border-l-2 border-slate-300 grow pace-y-14">
            <Typography>葡萄糖變異度(CV%)</Typography>
            <Typography>
              <span className="text-2xl font-bold">13.6</span>%
            </Typography>
          </Box>
        </Box>
      </Box>
      <p className="text-xs text-slate-600">*葡萄糖變異係數(%CV),目標≦36%</p>
    </Box>
  );
};

function dataset() {
  return (
    <Box>
      <Box className="flex">
        <GradeTable />
        <Box className="flex flex-col grow">
          <Box className="flex flex-row grow">
            <Box className="w-1/2 ml-2">
              <p className="border-l-4 border-black pl-2 text-2xl mb-2">
                達標狀況
              </p>
              <ListItem
                title="0分"
                subTitle="高於 (> 250 mg/dL)"
                grade="0%"
                color="rgb(217 119 6)"
              />
              <ListItem
                title="14分"
                subTitle="181-250 mg/dl"
                grade="1%"
                color="rgb(245 158 11)"
              />
              <ListItem
                title="23時46分"
                subTitle="目標範圍(70-180 mg/dl)"
                grade="99%"
                color="rgb(101 163 13)"
              />
              <ListItem
                title="0分"
                subTitle="54 - 69 mg/dl"
                grade="0%"
                color="rgb(251 113 133)"
              />
              <ListItem
                title="0分"
                subTitle="< 54 mg/dl"
                grade="0%"
                color="rgb(190 18 60)"
              />
            </Box>
            <Box className="flex flex-col grow mx-4">
              <Box>
                <p className="text-2xl mb-2">&nbsp;</p>
              </Box>
              <Box className="flex flex-col grow">
                {[
                  {
                    color: "rgb(217 119 6)",
                    height: 0,
                  },
                  {
                    color: "rgb(245 158 11)",
                    height: 1,
                  },
                  {
                    color: "rgb(101 163 13)",
                    height: 99,
                  },
                  {
                    color: "rgb(251 113 133)",
                    height: 0,
                  },
                  {
                    color: "rgb(190 18 60)",
                    height: 0,
                  },
                ].map(({ color, height }) => {
                  return (
                    <Box
                      key={color}
                      className="w-full "
                      style={{ backgroundColor: color, height: `${height}%` }}
                    ></Box>
                  );
                })}
              </Box>
            </Box>
            <Box className="w-5/12">
              <p className="border-l-4 border-black pl-2 text-2xl mb-2">
                目標值
              </p>
              <ListItem
                title="< 5% · 1 時 12 分"
                subTitle="高於 (> 250 mg/dL)"
              />
              <ListItem title="< 25% · 6 時 0 分" subTitle="181-250 mg/dl" />
              <ListItem
                title="> 70% · 16 時 48 分"
                subTitle="目標範圍(70-180 mg/dl)"
              />
              <ListItem title="< 4% · 58 分" subTitle="54 - 69 mg/dl" />
              <ListItem title="< 1% · 14 分" subTitle="< 54 mg/dl" />
            </Box>
          </Box>
          <p className="text-xs text-slate-600">
            *每增加5%的理想範圍(70-180 mg/dL) 可有效降低並發症風險
          </p>
        </Box>
      </Box>
    </Box>
  );
}

export default dataset;
