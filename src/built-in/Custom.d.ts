import { type } from "os"
// import CardModel from "../core/view/CardModel"
// import PlayerModel from "../core/view/PlayerModel"

declare global {

    //模块结构
    type Gender = 'female'|'male'|'none'|'unknown'
    type Key = string | Array<any>
    type MarkKey = string | string | ((any,PlayerModel,string?) => any)
    type Num = string | number
    type Keyword = string | Array<string>
    type AObject = {[propName: string]: Array<string>}
    type Keymap = {[propName: string]: string | Array<string>}
    type Aimap = {[propName: string]: string | Array<string> | number | Keymap}
    type St = {[propName: string]: number}
    type Stat = { card: St, skill: St, isMe?:boolean}
    type Statmap = {judges?:{viewAs?}[],handcards?:{gaintag?}[],[propName: string]: string | Array<string> | number | boolean}
    type Dialogword = Array<Key>
    type Charaword = Array<>
	type skillContent = () => void
	type skillCheck = (event:EventModel, player?:PlayerModel) => boolean|number|string
    type targetCheck = (card:CardModel, player?:PlayerModel, event?:EventModel) => boolean
    interface Skill{
		audio?: number|boolean|string
        enable?: Keyword
        trigger?: Keymap
        usable?: number
        group?: Keyword
        filter?: skillCheck
        check?: skillCheck
        init?: (PlayerModel,skill:string)=>void
        prompt2?: string | skillCheck
        logTarget?: string | ((event:EventModel, player?:PlayerModel) => boolean|number|string|string[])
        filterTarget?: boolean | targetCheck
		content?: skillContent | skillContent[]
        subSkill?: {[propName: string]: Skill}
        position?: string
        derivation?: string | string[]
        involve?: string | string[]
        unique?: true
        juexingji?: true
        firstDo?: true
        mark?: true | string
        intro?: {content?:MarkKey,onunmark?:MarkKey,name?:string,mark?:Function,markcount?:(storage, player)=>number}
        chooseButton?: {dialog:(event?:EventModel,player?:PlayerModel)=>any,[propName: string]: any}
        [propName: string]: any
    }
    interface Chara{
        [propName: string]: [Gender, string, number | string, Array<string>, Array<string>?]
    }
    interface currentObject {
        character: Chara
        skill: { [propName: string]: Skill }
        characterTitle?: { [propName: string]: string }
        [propName: string]: any
    }

    //常用变量结构
    var player: PlayerModel, source: PlayerModel | string, target: PlayerModel
    var targets: PlayerModel[]
    var card: CardModel
    var cards: CardModel[]
    var trigger:EventModel
    var galgame: { sce(string): void }
    var targets: PlayerModel[]
    var num: any
    // number | Function
    var skill: string
    var result: number | any | {
        bool?: Boolean
        targets?: PlayerModel[]
        cards?: CardModel[]
        links?: Array
    }
    type cardArray = {name:string,suit?:string,number?:string,nature?:string}
    declare var Evt:EventModel
    //原生游戏核心类
    var cheat:{[propName: string]:Function}
    interface Window{
        game
        play
        isNonameServer
        isNonameServerIp
        /**屏幕常亮相关 */
        plugins
        noSleep
        /**更改游戏设置延时 */
        resetGameTimeout:NodeJS.Timeout
        /**cheat相关 */
        cheat,
        ui,
        get,
        ai,
        lib,
        _status,
        /**导入介质 */
        data
        translate
        group
        groupnature
        /**初始界面 */
        inSplash
        /**菜单 */
        StatusBar
        /**Rank */
        vtuberkill_character_rank
        resolveLocalFileSystemURL//？？？
        require//？？？
    }
    interface HTMLDivElement{
        getModel:()=>Object
        node?:{[propName: string]: HTMLDivElement|HTMLElement}
        noclick?:boolean
        _doubleClicking?:boolean
        onClickAvatar?
        onClickAvatar2?
        onClickCharacter?
        onClickIdentity?
        link?
    }
    interface ChildNode{
        innerHTML:string
        setBackgroundImage
        delete
        style
        classList?:DOMTokenList
        name?:string
        viewAs?:string
        tempJudge?:string
        markidentifer?
    }
    //扩展的类
    class JSZip {
        generate(Object): String|Uint8Array|ArrayBuffer|Buffer|Blob
        file(name: string | RegExp, data?: String | ArrayBuffer | Uint8Array | Buffer, o?: Object): JSZip | Object | Array
        files: JSZip[]
    }
    /**特殊接口 */
    interface Result {
        (...args): boolean;
        _filter_args: [any, number];
    }
}
export { }