import cliSelect from "cli-select";
import { CliValue } from "./types/CliValue";
import { getFormattedBottomPortStatistics, getFormattedTopPortStatistics, getIntroductoryMessage, getPortsAtPercentiles } from "./services/terminalFormattingService";

async function app() {
  getIntroductoryMessage();

  const options = {
    values: [
      "Get the 5 ports with the highest port call number.",
      "Get the 5 ports with the lowest port call number.",
      "Calculate ports with port call durations at the 5th, 20th, 50th, 75th and 90th percentiles.",
      "Exit."],
  }

  cliSelect(options, async (valueId) => {
    // type casting here is necessary as the dependency lacks the ts type
    const cliValue: CliValue = valueId as unknown as CliValue;

    if (cliValue !== null) {
      switch (cliValue.id) {
        case 0:
          await getFormattedTopPortStatistics();
          app();
          break;
        case 1:
          await getFormattedBottomPortStatistics();
          app();
          break;
        case 2:
          await getPortsAtPercentiles();
          app();
          break;
        case 3:
          process.exit(0);
          break;
        default:
          console.log(cliValue);
      }
    } else {
      process.exit(0);
    }
  });
}

app();