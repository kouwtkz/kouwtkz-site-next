export const isStatic = process.env.OUTPUT_MODE === "export";
import ServerData from "./ServerData";

const ServerDataMake = () => {
  return <ServerData isStatic={isStatic} />;
}

export default ServerDataMake;