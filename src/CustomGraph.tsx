import React, { useEffect, useState } from "react";
import Graph from "graphology";
import { Attributes } from "graphology-types";
import circular from "graphology-layout/circular";
import {
  useSigma,
  useRegisterEvents,
  useLoadGraph,
  useSetSettings
} from "react-sigma-v2";
import { IJSONData } from "./types";
import forceAtlas2 from "graphology-layout-forceatlas2";

interface IGraphHoverState {
  hoverNode: string | undefined;
  hoverNeighbours: string[] | undefined;
}

interface ICustomGraphProps {
  data: IJSONData;
}

const CustomGraph: React.FC<ICustomGraphProps> = ({ data }) => {
  // hooks
  const sigma = useSigma();
  const registerEvents = useRegisterEvents();
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();

  // State for the graph hovered node
  const [hoveredNode, setHoveredNode] = useState<IGraphHoverState>({
    hoverNode: undefined,
    hoverNeighbours: undefined
  });

  /**
   * When graph url changes, we compute the graph and load it in sigma
   */
  useEffect(() => {
    const graph = new Graph();

    // Create all nodes
    data.nodes.forEach((node) => {
      graph.addNode(node.id, {
        nodeType: "company",
        label: node.name,
        size: data.edges.reduce((prev, curr) => {
          if (curr.from === node.id) {
            return prev + 3;
          }
          return prev;
        }, 15),
        color: "#335996"
      });
    });

    // Create all edges
    data.edges.forEach((edge) => {
      graph.addEdge(edge.from, edge.to, {
        weight: edge.weight,
        type: "arrow",
        size: 5,
        label: `${edge.weight}%`
      });
    });

    circular.assign(graph);
    const settings = forceAtlas2.inferSettings(graph);
    forceAtlas2.assign(graph, { settings, iterations: 600 });
    loadGraph(graph);
  }, [loadGraph, data]);

  /**
   * When component mount
   *  - we set sigma settings
   *  - we register events
   */
  useEffect(() => {
    // Register Sigma events
    registerEvents({
      enterNode: ({ node }) => {
        setHoveredNode({
          hoverNode: node,
          hoverNeighbours: data.edges
            .filter((edge) => edge.from === node || edge.to === node)
            .map((edge) => {
              const idToGet = edge.from === node ? edge.to : edge.from;
              return data.nodes.find((x) => x.id === idToGet)?.id ?? "";
            })
        });
      },
      leaveNode: () => {
        setHoveredNode({
          hoverNode: undefined,
          hoverNeighbours: undefined
        });
      },
      clickNode: () => console.log("test")
    });
  }, [sigma, registerEvents, data]);

  /**
   * When the hoverer node change
   *  - we update the reducers
   */
  useEffect(() => {
    setSettings({
      nodeReducer: (node: string, data: { [key: string]: unknown }) => {
        const newData: Attributes = { ...data };
        if (
          hoveredNode.hoverNeighbours &&
          !hoveredNode.hoverNeighbours.includes(node) &&
          hoveredNode.hoverNode !== node
        ) {
          newData.label = "";
          newData.color = "#f6f6f6";
        }
        return newData;
      },
      edgeReducer: (edge: string, data: { [key: string]: unknown }) => {
        const graph = sigma.getGraph();
        const newData = { ...data, hidden: false };
        if (
          hoveredNode.hoverNode &&
          !graph.hasExtremity(edge, hoveredNode.hoverNode)
        ) {
          newData.hidden = true;
        }
        return newData;
      }
    });
  }, [sigma, setSettings, hoveredNode]);

  return null;
};

export default CustomGraph;
