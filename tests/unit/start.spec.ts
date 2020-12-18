import startAll from "../../src/start";
import { startService } from "../../src/api/app";

jest.mock("../../src/api/app");
const mockStart = startService as jest.Mock;

describe("start test", () => {
  it("should start all designated services", async () => {
    expect.assertions(1);
    await startAll();
    expect(mockStart).toHaveBeenCalledTimes(1 + 1);
    mockStart.mockClear();
  });
});
