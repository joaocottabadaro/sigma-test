export interface IJSONData {
  nodes: {
    id: string;
    name: string;
  }[];
  edges: {
    from: string;
    to: string;
    weight: number;
  }[];
}

export interface IState {
  hoverNode: string | undefined;
  hoverNeighbours: string[] | undefined;
}
