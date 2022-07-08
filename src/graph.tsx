import React from "react";
import { IJSONData } from "./types";
import { SigmaContainer } from "react-sigma-v2";
import "react-sigma-v2/lib/react-sigma-v2.css";
import CustomGraph from "./CustomGraph";

interface IGraphProps {
  data: IJSONData;
}

const Graph: React.FC<IGraphProps> = ({ data }) => {
  return (
    <SigmaContainer>
      <CustomGraph data={data} />
    </SigmaContainer>
  );
};

export default Graph;
