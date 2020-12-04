import startAll from "../../src/start";
import { startEbsiService } from "../../src/api/app";

jest.mock("../src/api/app");
const mockStartEbsi = startEbsiService as jest.Mock;

describe("start test", () => {
  it("should start all designated services", () => {
    expect.hasAssertions();
    startAll();
    expect(mockStartEbsi).toHaveBeenCalledTimes(1 + 1);
    mockStartEbsi.mockClear();
  });
});
