import *  as signalR from "@aspnet/signalr";
import {Board} from "./DataTypes/Board";
import {BoardLocation} from "./DataTypes/BoardLocation";
import {Action} from "./DataTransferObjects/Action";
import {StartGame} from "./DataTransferObjects/StartGame";
import {Turn} from "./DataTransferObjects/Turn";
import {EndGame} from "./DataTransferObjects/EndGame";
import {Color, GameEndReason} from "./DataTypes/Enums";
import {Move} from "./DataTypes/Move";

const GAME_CONNECTION_URL = "/game";

export class GameConnection {
    private readonly board: Board;
    private readonly connection: signalR.HubConnection = null;
    private my_color: Color = null;

    constructor(board: Board) {
        this.board = board;
        this.connection = new signalR.HubConnectionBuilder().withUrl(GAME_CONNECTION_URL).build();
        this.initializeCallbacks();
    }

    public start(): void {
        this.connection.start().catch(err => console.error(err));
    }

    private initializeCallbacks(): void {
        this.connection.on("gameStart", (data: String) => this.on_game_start(StartGame.decode(data)));
        this.connection.on("yourMove", (data: String) => this.on_your_turn(Turn.decode(data)));
        this.connection.on("gameEnd", (data: String) => this.on_game_end(EndGame.decode(data)));
    }

    private on_game_end(data: EndGame): void {
        // Do something with the winner and reason
        const end_reason: GameEndReason = data.reason;
        const winner: Color = data.winner;

    }

    private on_game_start(data: StartGame): void {
        if (this.my_color !== null)
            console.error("Got game start message when game was already started");
        this.board.updateFromString(data.raw_board);
        this.my_color = data.color;
    }

    private on_your_turn(data: Turn): void {
        this.board.updateFromString(data.raw_board);
        const possible_moves = data.raw_moves.map((raw_move_str: String) => Move.fromString(raw_move_str, this.board));

    }

    private sendMove(from: BoardLocation, to: BoardLocation): void {
        const item = new Action(from.location, to.location);
        this.connection.send("onMove", (new Action(from.location, to.location)).encode());
    }
}