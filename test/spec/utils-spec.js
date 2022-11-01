import {formatLocation, getLocation, isAllowedLevel, isError} from "../../src/utils.js";
import {LOG_LEVEL} from "../../src/constants.js";

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
});