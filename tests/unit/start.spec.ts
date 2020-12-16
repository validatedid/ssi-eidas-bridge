import startAll from "../../src/start";
import { startService } from "../../src/api/app";

jest.mock("../src/api/app");
const mockStartEbsi = startService as jest.Mock;

describe("start test", () => {
  it("should start all designated services", async () => {
    expect.hasAssertions();
    await startAll();
    expect(mockStartEbsi).toHaveBeenCalledTimes(1 + 1);
    mockStartEbsi.mockClear();
  });
});
