export class Solver {
  public parseInputIntoPairs(input: string): {
    edges: Edge[];
    vertices: Vertex[];
  } {
    const pairs = input
      .split('\n')
      .filter((x) => x.length > 0)
      .map((line) => line.split('-').map((x) => x.trim()));
    console.debug('Parsed pairs:', pairs);
    const directionalPairs = pairs
      .map((pair) => [
        [pair[0], pair[1]],
        [pair[1], pair[0]],
      ])
      .flat();
    console.debug('Directional pairs:', directionalPairs);
    const sortedPairs = directionalPairs.sort((a, b) =>
      `${a[0]}${a[1]}`.localeCompare(`${b[0]}${b[1]}`)
    );
    console.debug('Sorted pairs:', sortedPairs);
    const vertices = Array.from(new Set(sortedPairs.map((p) => p[0])));
    console.debug('Vertices:', vertices);
    return {
      edges: sortedPairs as Edge[],
      vertices,
    };
  }

  public findTriangles(vertices: Vertex[], edges: Edge[]): VertexTriangle[] {
    const result: VertexTriangle[] = [];
    vertices.forEach((vertex) => {
      const neighbours = edges
        .filter((edge) => edge[0] === vertex)
        .map((edge) => edge[1]);
      console.debug(`Neighbours of ${vertex}:`, neighbours);
      for (let i = 0; i < neighbours.length - 1; i++) {
        for (let j = i; j < neighbours.length - 1; j++) {
          const neighbour1 = neighbours[i];
          const neighbour2 = neighbours[j + 1];
          if (edges.some((edge) => edge[0] === neighbour1 && edge[1] === neighbour2)) {
            result.push([vertex, neighbour1, neighbour2]);
            console.debug('Triangle:', [vertex, neighbour1, neighbour2]);
          }
        }
      }
    });
    console.debug('Triangles:', result);
    return result;
  }

  public getTrianglesWithVertexThatStartWithT(triangles: VertexTriangle[]): VertexTriangle[] {
    const result = triangles.filter(triangle => triangle.some(vertex => vertex.startsWith('t')));
    console.debug('Triangles with vertex that starts with T:', result);
    return result;
  }

  public getNumberOfDistinctTriangles(triangles: VertexTriangle[]): number {
    return new Set(triangles.map(triangle => triangle.sort().join(''))).size;
  }

  public getNumberOfEdgesFromEachVertex(vertices: Vertex[], edges: Edge[]): Map<Vertex, number> {
    const result = new Map<Vertex, number>();
    vertices.forEach(vertex => {
      result.set(vertex, edges.filter(edge => edge[0] === vertex).length);
    });
    console.debug('Number of edges from each vertex:', result);
    return result;
  }

  public findMaximalCliques(vertices: Vertex[], edges: Edge[]): Vertex[][] {
    const cliqueFinder = new CliqueFinder(vertices, edges);
    const cliques = cliqueFinder.findMaximalCliques();
    console.debug('Maximal cliques:', cliques);
    return cliques;
  }

  public getLargestCliques(cliques: Vertex[][]): Vertex[][] {
    const largestSize = Math.max(...cliques.map(clique => clique.length));
    const largestCliques = cliques.filter(clique => clique.length === largestSize);
    console.debug('Largest cliques:', largestCliques);
    return largestCliques;
  }

  public convertCliquesToStrings(cliques: Vertex[][]): string[] {
    return cliques.map(clique => clique.sort().join(','));
  }
}

export type Edge = [Vertex, Vertex];
export type Vertex = string;
export type VertexTriangle = [Vertex, Vertex, Vertex];

type Graph = Map<Vertex, Set<Vertex>>;

class CliqueFinder {
  private graph: Graph;
  private maximalCliques: Vertex[][];

  constructor(vertices: Vertex[], edges: Edge[]) {
    this.graph = new Map();
    this.maximalCliques = [];

    // Initialize empty sets for all vertices
    for (const vertex of vertices) {
      this.graph.set(vertex, new Set());
    }

    // Add edges
    for (const [v1, v2] of edges) {
      // Since we know both directions are in the input,
      // we only need to process one direction of each unique edge
      if (!this.graph.get(v1)?.has(v2)) {
        this.graph.get(v1)?.add(v2);
      }
    }
  }

  findMaximalCliques(): Vertex[][] {
    const r = new Set<Vertex>();
    const p = new Set(this.graph.keys());
    const x = new Set<Vertex>();

    this.bronKerbosch(r, p, x);
    return this.maximalCliques;
  }

  findLargestCliques(): Vertex[][] {
    const allCliques = this.findMaximalCliques();
    if (allCliques.length === 0) return [];

    const maxSize = Math.max(...allCliques.map(clique => clique.length));
    return allCliques.filter(clique => clique.length === maxSize);
  }

  private bronKerbosch(
    r: Set<Vertex>,
    p: Set<Vertex>,
    x: Set<Vertex>
  ): void {
    if (p.size === 0 && x.size === 0) {
      this.maximalCliques.push(Array.from(r));
      return;
    }

    for (const vertex of Array.from(p)) {
      const neighbors = this.graph.get(vertex) || new Set();

      this.bronKerbosch(
        new Set([...r, vertex]),
        this.intersection(p, neighbors),
        this.intersection(x, neighbors)
      );

      p.delete(vertex);
      x.add(vertex);
    }
  }

  private intersection(set1: Set<Vertex>, set2: Set<Vertex>): Set<Vertex> {
    return new Set([...set1].filter(v => set2.has(v)));
  }
}
