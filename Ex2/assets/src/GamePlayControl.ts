import { array } from "./../../creator.d";
const { ccclass, property } = cc._decorator;
import { io } from "socket.io-client";
enum GameStatus {
  Ready = 1,
  Playing,
  Stop,
}
enum gameResult {
  "dragonWin" = 1,
  "tigerWin",
  "tie",
}

interface ScoreBoardInfo {
  currentColumn: cc.Node;
  currentDot: cc.Node;
  canAddMore: boolean;
  newDotTigerWin: cc.Node;
  newDotDragonWin: cc.Node;
  newDotDrawYellow: cc.Node;
  newDotDrawRed: cc.Node;
  newHistoryColumn: cc.Node;
  currentContent: cc.Node[];
}
interface GameResult {
  dragonCard: string;
  winner: string;
  tigerCard: string;
  gameStatus: GameStatus;
  isEqualPreGame?: boolean;
}

@ccclass
export default class GamePlayControl extends cc.Component {
  sampleHistoryColumn: cc.Node = null;
  sampleWinLoseDot: cc.Node = null;
  scoreBoardContainer: cc.Node = null;
  history100Game: [] = [];
  dragonCard: cc.Node = null;
  tigerCard: cc.Node = null;
  winner: cc.Node = null;
  btnPlay: cc.Button = null;
  socket: any = null;
  preWinner: string = null;
  onLoad() {
    this.socket = io("http://localhost:4500", {
      path: "/socketIo/dragon-tiger",
    });

    this.socket.on("dragon-tiger", (res) => this.handlerSocket(res));
    this.socket.emit("dragon-tiger", { type: 1 });

    this.btnPlay = this.node.getChildByName("Play").getComponent(cc.Button);
    this.btnPlay.node.on(cc.Node.EventType.TOUCH_END, this.playGame, this);

    const gamePlayArea = this.node.getChildByName("GamePlayArea");
    this.dragonCard = gamePlayArea.getChildByName("Dragon").getChildByName("cards");
    this.tigerCard = gamePlayArea.getChildByName("Tiger").getChildByName("cards");

    this.winner = this.node.getChildByName("GameResult").getChildByName("win-frame");

    const sampleNodes = this.node.getChildByName("sampleNode");
    this.sampleHistoryColumn = sampleNodes.getChildByName("historyColumn");
    this.sampleWinLoseDot = sampleNodes.getChildByName("winLoseDot");

    this.scoreBoardContainer = this.node.getChildByName("ScoreBoard").getChildByName("ScrollView").getComponent(cc.ScrollView).content;
  }
  start() {}
  update(dt) {}

  playGame() {
    this.socket.emit("dragon-tiger", { type: 2 });
  }

  refreshCard(dragonCard: string, tigerCard: string) {
    this.dragonCard.children.forEach((e) => {
      e.active = e.name === dragonCard ? true : false;
    });
    this.tigerCard.children.forEach((e) => {
      e.active = e.name === tigerCard ? true : false;
    });
  }

  refreshWinLosePanel(winner: string) {
    this.winner.active = true;
    this.winner.children.forEach((e) => {
      e.active = e.name === winner ? true : false;
    });
  }
  handlerSocket(req: { resType: number; data: GameResult }) {
    switch (req.resType) {
      case 1:
        this.renderHistory(req.data);
        return;
      case 2:
        const { dragonCard = "Default", winner = "", tigerCard = "Default", isEqualPreGame } = req.data;
        this.refreshCard(dragonCard, tigerCard);
        this.refreshWinLosePanel(winner);
        this.refreshScoreBoard(winner, isEqualPreGame);
        this.preWinner = winner;
      default:
        return;
    }
  }
  /* info of Column:
  {
    x: 290
    y:-60
    anchor: 0.5, 0.5
    size: 20, 120
  } 
  phep toanm tru truc X của column là -20
  phep toan tru truc Y của dot là -20
  info of first Dot {
    position(0,50)
    size(19,19),
  }
  */

  prepareStep(gameResult: string): ScoreBoardInfo {
    let newHistoryColumn = cc.instantiate(this.sampleHistoryColumn);
    let newDotTigerWin = cc.instantiate(this.sampleWinLoseDot.getChildByName("tiger"));
    let newDotDragonWin = cc.instantiate(this.sampleWinLoseDot.getChildByName("dragon"));
    let newDotDrawYellow = cc.instantiate(this.sampleWinLoseDot.getChildByName("draw-vang"));
    let newDotDrawRed = cc.instantiate(this.sampleWinLoseDot.getChildByName("draw-do"));
    let newestColumnContainer = this.scoreBoardContainer.children[0];
    let newestDotIndex = newestColumnContainer.children.length - 1;
    let newestDot = newestColumnContainer.children[newestDotIndex];
    let canAddMore = this.scoreBoardContainer.children[0].children.length < 6;
    return {
      currentColumn: newestColumnContainer,
      currentDot: newestDot,
      canAddMore: canAddMore,
      newDotTigerWin,
      newDotDragonWin,
      newDotDrawYellow,
      newDotDrawRed,
      newHistoryColumn,
      currentContent: this.scoreBoardContainer,
    };
  }

  refreshScoreBoard(winner: string, isEqualPreGame: boolean) {
    /*   
  "If new game result is different from the previous one  
      => add and dislay on top of a new column right next to it
  Else => add and dislay in the same column with the previous one. 
          If the number of row exceeds the max height, go to the new column right next to it
          .
  If result is Tie then don't add new result, just add a mark like above picture to previous result

  Tiger: Red
  Dragon: Yellow
  Tie: Blue
  Please be noted that Scoreboard can be scrolled from left to right and vice versa" */

    const resolveDraw = (gameResult, newestDot: cc.Node) => {};

    const incerateLabel = () => {
      console.log("incerateLabel");
    };
    const addDot = (winner: string, forceAddNewColumn: boolean) => {
      const scoreBoardInfo = this.prepareStep(winner);
      const { currentColumn, currentDot, currentContent, newDotTigerWin } = scoreBoardInfo;

      let newDot = cc.instantiate(this.sampleWinLoseDot.children[2]);
      let newCol = cc.instantiate(this.sampleHistoryColumn);
      newCol.addChild(newDot);
      newCol.position = cc.v2(this.scoreBoardContainer.children[0].position.x + 20, -1);
      this.scoreBoardContainer.addChild(newCol);
      //let newScoreBoardContainerChild = cc.instantiate(this.scoreBoardContainer.children);
      // newScoreBoardContainerChild.forEach((col) => (col.position.x -= 20));
      this.scoreBoardContainer.children.forEach((c, index) => (c.position = cc.v2(index * 20, -1)));

      /*  let newHistoryColumn = cc.instantiate(this.sampleHistoryColumn);

      const mocX = -2;
      const mocY = -1;

      newDotTigerWin.position = cc.v2(mocX + 20, mocY);
      console.log("newDotTigerWin.position ", newDotTigerWin.position);
      newHistoryColumn.addChild(newDotTigerWin);
      this.scoreBoardContainer.children.unshift(newHistoryColumn);
      this.scoreBoardContainer.children.forEach((col) => (col.position.x -= 20));
      console.log("this.scoreBoardContainer", this.scoreBoardContainer);
      console.log(
        "this.new ...",
        this.scoreBoardContainer.children.forEach((col) => console.log(col.position))
      ); */

      // if (forceAddNewColumn) {
      //} else {
      //if (scoreBoardInfo.canAddMore) {
      /*  .position = cc.v2(.position.x, newestDot.position.y - 20);
          console.log("1", newestDot.position.x, newestDot.position.y);
          console.log("2", newDotDrawYellow.position.x, newDotDrawYellow.position.y); */
      //} else {
      //newHistoryColumn.addChild(newDotTigerWin);
      //currentContent.push(newHistoryColumn);
      //}
      //}
    };
    const changeCurrentDotToDrawDot = () => {
      console.log("changeCurrentDotToDrawDot");
    };

    const gameResultHandler = [
      {
        isEqualPreGame: true,
        resolve: () => {
          if (winner === "draw") {
            incerateLabel();
          } else {
            addDot(winner, false);
          }
        },
      },
      {
        isEqualPreGame: false,
        resolve: () => {
          if (winner === "draw") {
            changeCurrentDotToDrawDot();
          } else {
            addDot(winner, true);
          }
        },
      },
    ];
    gameResultHandler.filter((e) => e.isEqualPreGame === isEqualPreGame)[0].resolve();
  }

  renderHistory(data: { historyData: [] }) {
    console.log("historyData", data);
    const newDos: cc.Node = new cc.Node("container");

    const makeNode = (preDot: {}) => {
      return new cc.Node();
    };

    const calculatePosition = (dots: array) => {
      const MAX_NOTE = 6;
      let preDot = cc.instantiate(dots[0]);
      preDot.position = cc.v2(0, 0);

      let preDotNoe = makeNode(preDot);
      newDos.addChild(preDotNoe);

      let counterEqual = 0;
      for (let i = 1; i < 100; i++) {
        const dot = dots[i]; // khi do là dot thứ 2
        if (dot.value === preDot.value) {
          counterEqual++;
          if (dot.value === "draw") {
            // =3 đó
            dot.position = cc.v2(preDot.position.x, preDot.position.y);
            // tăng label
            let createLabel = cc.instantiate(this.sampleWinLoseDot.children[6]); // 6 là label chẳng hạn
          } else if (dot.value !== "draw" && counterEqual < 6) {
            dot.position = cc.v2(preDot.position.x, preDot.position.y - 20);
          } else {
            dot.position = cc.v2(preDot.position.x + 20, 0);
          }

          dot;
        } else {
          if (dot.value === "draw") {
          } else {
            dot.position = cc.v2(preDot.position.x + 20);
          }
        }

        let tmpPostion = cc.v2(preDotPosition.x, preDotPosition.y - 20);
      }
    };

    return newDos;
  }
}
