const { ccclass, property } = cc._decorator;


@ccclass
export default class CardControl extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        console.log(this.node)
    }

    start() {

    }

    // update (dt) {}
}
