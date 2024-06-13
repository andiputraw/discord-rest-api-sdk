type logFn = (...args: any[]) => void;
export const logger = (testName: string): logFn => {
  return (...args: any[]) => {
    args.forEach((arg) => {
      if (typeof arg === "object") {
        console.log(`${testName}`, JSON.stringify(arg, null, 2));
      } else {
        try {
          const parsedArg = JSON.parse(arg);
          console.log(`${testName}`, JSON.stringify(parsedArg, null, 2));
        } catch (error) {
          console.log(`${testName}`, arg);
        }
      }
    });
  };
};
