import {Board} from "./Board";
import {BoardLocation} from "./BoardLocation";

export class Move {

    public static fromJSON(raw: any, onBoard: Board): Move {
        return new Move(onBoard.state[raw.Piece.Location.Item2][raw.Piece.Location.Item1],
            onBoard.state[raw.MoveTo.Item2][raw.MoveTo.Item1]);
    }

    public readonly source: BoardLocation;
    public readonly destination: BoardLocation;

    constructor(source: BoardLocation, destination: BoardLocation) {
        this.source = source;
        this.destination = destination;
    }

}
