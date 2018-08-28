import {BoardLocation} from "./BoardLocation";
import {Piece} from "./Piece";
import {Move} from "./Move";

export class Board {
    get legal_moves(): Move[] {
        return this._legal_moves;
    }

    set legal_moves(value: Move[]) {
        this._legal_moves = value;
        this.clearHighlights();
        this.highlightLegalStarts();
    }

    set on_move_callback(value: Function) {
        this._on_move_callback = value;
    }

    public static fromJSON(board: any): Board {
        const new_board = new Board();
        board.Pieces.filter((board_location: any) => board_location).forEach((board_location: any) => {
            new_board.state[board_location.Location.Item2][board_location.Location.Item1].value = new Piece(board_location.Player, board_location.IsKing);
        });
        return new_board;
    }

    public state: BoardLocation[][];
    private _legal_moves: Move[] = [];
    private _on_move_callback: Function;
    private last_clicked: BoardLocation | null = null;

    constructor() {
        this.state = [];
        for (let row: number = 0; row < 8; ++row) {
            this.state[row] = [];
            for (let column: number = 0; column < 8; ++column) {
                this.state[row][column] = new BoardLocation([row, column]);
                this.state[row][column].registerOnClick((clicked_location: BoardLocation) => this.onBoardClick(clicked_location));
            }
        }
    }

    public updateFromOtherBoard(new_board: Board): void {
        for (let row: number = 0; row < 8; ++row) {
            for (let column: number = 0; column < 8; ++column) {
                this.state[row][column].value = new_board.state[row][column].value;
            }
        }
    }

    private clearHighlights() {
        for (let row: number = 0; row < 8; ++row) {
            for (let column: number = 0; column < 8; ++column) {
                this.state[row][column].highlighted = false;
            }
        }
    }

    private highlightLegalStarts() {
        this._legal_moves.map((item: Move) => item.source).forEach((item: BoardLocation) => item.highlighted = true);
    }

    private onBoardClick(location: BoardLocation) {
        // do something because of a click, sometimes call self._on_move_callback
        if (this.last_clicked !== null) {
            // There is already a piece selected
            if (this.last_clicked == location) {
                // Picked the same piece to deselect it
                this.last_clicked.selected = false;
                this.last_clicked = null;
                this.clearHighlights();
                this.highlightLegalStarts();
            } else {
                // Different piece is selected
                const possible_destinations = this._legal_moves.filter((item: Move) => item.source === this.last_clicked).map((item: Move) => item.destination);
                if (possible_destinations.indexOf(location) !== -1) {
                    // This is a legal move to move to
                    this._on_move_callback(this.last_clicked, location);
                    if (Math.abs(this.last_clicked.location[0] - location.location[0]) === 2) {
                        // It was a jump so remove the jumped piece
                        this.state[(this.last_clicked.location[0] + ((location.location[0] - this.last_clicked.location[0]) / 2))][(this.last_clicked.location[1] + ((location.location[1] - this.last_clicked.location[1]) / 2))].value = null;
                    }
                    // Move the piece
                    location.value = this.last_clicked.value;
                    // Null out the moved from location
                    this.last_clicked.value = null;
                    this.last_clicked = null;
                    this.clearHighlights();
                }
            }
        } else {
            // There is no piece selected
            this.clearHighlights();
            const possible_sources = this._legal_moves.map((item: Move) => item.source);
            if (possible_sources.indexOf(location) !== -1) {
                // If it is a valid starting piece
                this.last_clicked = location;
                // Highlight possible destinations
                this._legal_moves.filter((item: Move) => item.source === this.last_clicked)
                    .map((item: Move) => item.destination)
                    .forEach((item: BoardLocation) => item.highlighted = true);
            }
        }
    }
}
