import {
    createTemplate,
    depersonalizeObj,
    depersonalizeValue,
    formatLocation,
    getLocation,
    isAllowedLevel,
    isError,
    len,
    mergeObjects,
    templateFns
} from "../../src/utils.js";
import {LOG_LEVEL} from "../../src/index.js";
import moment from "moment";

describe("testing utils", () => {

    it("test getLocation", () => {
        let location = getLocation();
        expect(location).toMatch("utils-spec.js");
    })

    it("test formatLocation", () => {
        let location = getLocation();
        console.log("location: ", location);
        let formattedLocation1 = formatLocation(location);
        console.log("formattedLocation1: ", formattedLocation1);
        expect(location).toBe(formattedLocation1);

        let formattedLocation2 = formatLocation(location, true);
        console.log("formattedLocation2: ", formattedLocation2);
        expect(formattedLocation2).toMatch("utils-spec.js");
    });

    it("test isError", () => {
        let err = new Error("error");
        expect(isError(err)).toBeTrue();
        expect(isError({})).toBeFalse();
    });

    it("test isAllowedLevel", () => {
        expect(isAllowedLevel(LOG_LEVEL.error, LOG_LEVEL.info)).toBeTrue();
        expect(isAllowedLevel(LOG_LEVEL.info, LOG_LEVEL.error)).toBeFalse();
    });

    it("test createTemplate", () => {
        let template = createTemplate(
            templateFns.level(),
            templateFns.text(' - '),
            templateFns.date('DD.MM.YYYY HH:mm:ss'),
            templateFns.text(' - '),
            templateFns.location(true),
            templateFns.newLine(),
            templateFns.message(),
            templateFns.newLine(),
        );

        let location = getLocation(1);
        let info = template({
            level: "debug",
            message: "info",
            date: moment("02.11.2022 12:22:29", "DD.MM.YYYY HH:mm:ss"),
            location: location
        });
        console.log(info);
        expect(info).toMatch(/^DEBUG - 02\.11\.2022 12:22:29 - /);
    });

    it("test createTemplate with l10n", () => {
        let template = createTemplate(
            templateFns.level(),
            templateFns.text(' - '),
            templateFns.date("DD MMMM YYYY HH:mm:ss"),
            templateFns.text(' - '),
            templateFns.location(true),
            templateFns.newLine(),
            templateFns.message(),
            templateFns.newLine(),
        );

        let location = getLocation(1);
        let info = template({
            level: "debug",
            message: "info",
            date: moment("02.11.2022 12:22:29", "DD.MM.YYYY HH:mm:ss"),
            location: location,
            dateL10n: "ru",

        });
        console.log(info);
        expect(info).toMatch(/^DEBUG - 02 ноября 2022 12:22:29 - /);
    });

    it("test len", () => {
        let string = "qwerty$4";
        expect(len(string)).toBe(8);
        expect(len(null)).toBe(null);
        expect(len(undefined)).toBe(undefined);
    });

    it("test depersonalizeValue", () => {
        expect(depersonalizeValue("qwerty$4", "password")).toBe("password:8");
        expect(depersonalizeValue(null, "password")).toBe("password:null");
        expect(depersonalizeValue(undefined, "password")).toBe("password:undefined");
    });

    it("test depersonalizeObj", () => {
        let dataObj = {
            login: "daivanov",
            password: "qwerty$4",
            secretKey: "12345678"
        };
        let result = depersonalizeObj(dataObj, "password", "secretKey");
        expect(result.password).toBe("password:8");
        expect(result.secretKey).toBe("secretKey:8");
    });

    it("test mergeObjects", () => {
        let dataObj1 = {
            name: "name",
            password: "password"
        };
        let dataObj2 = {
            password: "password123",
            parameter1: "parameter1"
        };
        let result = mergeObjects(dataObj1, dataObj2);
        expect(result.name).toBe("name");
        expect(result.password).toBe("password123");
        expect(result.parameter1).toBe("parameter1");
    });
});