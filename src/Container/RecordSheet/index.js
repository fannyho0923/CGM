import { Box } from "@mui/material";
import classNames from "classnames";

const RecordTableTemplate = ({
  idx = "",
  title = "",
  dietContent = "",
  iDiet = "",
  remark = "",
}) => {
  return (
    <Box className="border border-black w-1/5">
      <Box className="border-b border-black">
        <Box className="flex border-b">
          {idx === 0 && (
            <Box className="w-1/4 border-r-2 border-black py-2">餐別</Box>
          )}
          <Box className="py-2">{title}</Box>
        </Box>
        <Box
          className={classNames(
            "grid divide-x",
            idx === 0 ? "grid-cols-4" : "grid-cols-3"
          )}
        >
          {idx === 0 && (
            <Box className="py-2 text-sm border-r-2 border-black">日期</Box>
          )}
          <Box className="py-2 text-sm">飲食內容</Box>
          <Box className="py-2 text-sm">iDiet分數</Box>
          <Box className="py-2 text-sm">備註</Box>
        </Box>
      </Box>
      <Box
        className={classNames(
          "grid grow border-t border-black divide-x divide-dashed h-60",
          idx === 0 ? "grid-cols-4" : "grid-cols-3"
        )}
      >
        {idx === 0 && (
          <Box className="flex items-center p-2 border-r-2 border-black">
            02/13
          </Box>
        )}
        <Box className="flex items-center grow break-all p-px">
          {dietContent}
        </Box>
        <Box
          className="flex items-center grow p-px"
          style={{ backgroundColor: iDiet ? "rgb(163 230 53)" : "" }}
        >
          {iDiet}
        </Box>
        <Box className="grow divide-y divide-dashed">
          <Box className="h-1/5 flex items-center p-px">{remark}</Box>
          <Box className="grow flex items-center p-px"></Box>
        </Box>
      </Box>
    </Box>
  );
};

function RecordSheet() {
  return (
    <Box className="p-2 flex justify-center items-center">
      <Box className="border border-black">
        <Box className="flex">
          {[
            { title: `第一餐(06:00-10:00)` },
            {
              title: `第二餐(10:00-14:00)`,
              dietContent: "1227Buffet",
              iDiet: "0.72",
              remark: "1",
            },
            { title: `第三餐(14:00-17:00)` },
            {
              title: `第四餐(17:00-21:00)`,
              dietContent: "1833木瓜+黑木耳露無糖",
              iDiet: "0.10",
            },
            { title: `第五餐(22:00-24:00)` },
          ].map((item, idx) => {
            const { title, dietContent, iDiet, remark } = item;
            return (
              <RecordTableTemplate
                key={idx}
                idx={idx}
                title={title}
                dietContent={dietContent}
                iDiet={iDiet}
                remark={remark}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

export default RecordSheet;
