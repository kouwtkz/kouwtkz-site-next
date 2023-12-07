import isStatic from "./isStatic.mjs";
import ServerData from "./ServerData";

const ServerDataMake = () => {
  return <ServerData isStatic={isStatic} />;
}

export default ServerDataMake;