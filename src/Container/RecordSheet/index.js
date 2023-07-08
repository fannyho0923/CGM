import React from "react";
import { Box } from "@mui/material";
import classNames from "classnames";
import { getIDietBgColor } from "../../utils";

const RecordTableTemplate = ({
  date = "",
  idx = "",
  title = "",
  dietContent = "",
  iDiet = "",
  remarks = {},
}) => {
  const { iVal, dVal, pcVal } = remarks;
  return (
    <Box className="border border-black w-1/5">
      <Box className="border-b border-black">
        <Box
          className="flex border-b text-white"
          style={{ backgroundColor: "#2A4479" }}
        >
          {idx === 0 && (
            <Box className="w-1/4 border-r-2 border-black py-2">餐別</Box>
          )}
          <Box className="py-2">{title}</Box>
        </Box>
        <Box
          className={classNames(
            "grid divide-x text-white",
            idx === 0 ? "grid-cols-4" : "grid-cols-3"
          )}
          style={{ backgroundColor: "#2A4479" }}
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
          <Box
            className="flex items-center p-2 border-r-2 border-black"
            style={{ backgroundColor: "#2A4479" }}
          >
            {date}
          </Box>
        )}
        <Box className="flex grow p-x break-all overflow-auto">
          {dietContent}
        </Box>
        <Box
          className="flex items-center grow p-px"
          style={{
            backgroundColor: iDiet ? getIDietBgColor(iDiet) : "",
            color: iDiet > 10 ? "red" : "black",
          }}
        >
          {iDiet || ""}
        </Box>
        <Box className="grow divide-y divide-dashed">
          <Box className="h-1/5 flex items-center p-px">{iVal && "i"}</Box>
          <Box className="grow flex items-center p-px">
            {`${dVal ? "D" : ""}${dVal && pcVal ? "," : ""}${
              pcVal ? "PC" : ""
            }`}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

function RecordSheet({ date = "", records = [] }) {
  return (
    <Box className="p-2 flex justify-center items-center">
      <Box className="border border-black w-full">
        <Box className="flex">
          {records.map((item, idx) => {
            const { title, dietContent, iDiet, remarks } = item;
            return (
              <RecordTableTemplate
                date={date}
                key={idx}
                idx={idx}
                title={title}
                dietContent={dietContent}
                iDiet={iDiet}
                remarks={remarks}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

export default RecordSheet;
