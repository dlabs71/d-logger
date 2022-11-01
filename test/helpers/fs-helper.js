import fs from "fs";
import moment from "moment";
import path from "path";

export function createLogDir(logDir) {
    if (fs.existsSync(logDir)) {
        fs.rmSync(logDir, {recursive: true, force: true});
    }
    fs.mkdirSync(logDir);
}

export function generateLogFiles(count, logDir, logPrefix) {
    let currDate = moment();
    for (let i = 1; i <= count; i++) {
        currDate = currDate.subtract(1, "days");
        fs.writeFileSync(path.join(logDir, `${logPrefix}.${currDate.format("YYYY-MM-DD")}.log`), "1");
    }
}