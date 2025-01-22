import React from "react";

import ApiSelector from "./components/apiselector/ApiSelector";
import Header from "./components/header/header";

const App: React.FC = () => {
  const title = "News Aggregator";

  return (
    <>
      <Header title={title} />
      {/* space between */}
      <br />
      <br />
      {/* <Divider /> */}
      <ApiSelector />
    </>
  );
};

export default App;
