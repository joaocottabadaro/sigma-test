import Graph from "./graph";
import "./styles.css";
import data from "./data.json";

export default function App() {
  return (
    <div className="App">
      <Graph data={data} />
    </div>
  );
}
