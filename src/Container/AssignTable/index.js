import { Box } from "@mui/material";

const AssignTable = ({ listDay, selectedDate, onChange = () => {} }) => {
  return (
    <>
      <FormControl className="w-1/2">
        <InputLabel id="select-label">選擇第幾天</InputLabel>
        <Select
          labelId="select-label"
          id="select-date"
          value={selectedDate}
          label="選擇第幾天"
          onChange={onChange}
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
                <TimePicker label="Basic time picker" />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker label="Basic time picker" />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </Box>
        <Box>
          <Typography>第二餐</Typography>
          <Box className="flex space-x-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker label="Basic time picker" />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker label="Basic time picker" />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </Box>
        <Box>
          <Typography>第三餐</Typography>
          <Box className="flex space-x-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker label="Basic time picker" />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker label="Basic time picker" />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </Box>
        <Box>
          <Typography>第四餐</Typography>
          <Box className="flex space-x-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker label="Basic time picker" />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker label="Basic time picker" />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </Box>
        <Box>
          <Typography>第五餐</Typography>
          <Box className="flex space-x-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker label="Basic time picker" />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker label="Basic time picker" />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AssignTable;
