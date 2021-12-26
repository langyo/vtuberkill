var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./_context", "./view/PlayerModel", "./content/content", "./skill/skill", "./base/EventModel"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const _context = __importStar(require("./_context"));
    const { _status, lib, game, ui, get, ai, mixin } = _context;
    const PlayerModel_1 = __importDefault(require("./view/PlayerModel"));
    const content_1 = __importDefault(require("./content/content"));
    const skill_1 = __importDefault(require("./skill/skill"));
    const EventModel_1 = __importDefault(require("./base/EventModel"));
    mixin(lib, {
        discoloration1: "<samp id='渐变'><font face='yuanli'><style>#渐变{animation:change 0.8s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}20%{color:#F0A00F;}50% {color:#F000FF;}80%{color: #F0A00F;}100%{color:#FF0000;}}</style>",
        config: null,
        configprefix: 'vtuberkill_1.9_',
        versionOL: 27,
        updateURLS: {
            coding: 'https://v8gamemaker.coding.net/p/vtuberkill/d/vtuberkill_github/git/raw/',
            github: 'https://v8gamemaker.coding.net/p/vtuberkill/d/vtuberkill_github/git/raw/',
        },
        updateURL: 'https://v8gamemaker.coding.net/p/vtuberkill/d/vtuberkill_github/git/raw/',
        mirrorURL: 'https://v8gamemaker.coding.net/p/vtuberkill/d/vtuberkill_github/git/raw/',
        hallURL: 'www.vtuberkill.com',
        assetURL: '',
        changeLog: [],
        updates: [],
        canvasUpdates: [],
        video: [],
        skilllist: [],
        connectBanned: [],
        characterIntro: {},
        characterTitle: {},
        characterPack: {},
        characterFilter: {},
        characterSort: {},
        characterReplace: {},
        dynamicTranslate: {},
        cardPack: {},
        onresize: [],
        onphase: [],
        onwash: [],
        onover: [],
        ondb: [],
        ondb2: [],
        chatHistory: [],
        animate: {
            skill: {},
            card: {},
        },
        arenaReady: [],
        onfree: [],
        inpile: [],
        extensions: [],
        extensionPack: {},
        cardType: {},
        hook: { globaltrigger: {}, globalskill: {} },
        hookmap: {},
        imported: {},
        layoutfixed: ['chess', 'tafang', 'stone'],
        characterDialogGroup: {
            '收藏': function (name, capt) {
                return lib.config.favouriteCharacter.contains(name) ? capt : null;
            },
            '最近': function (name, capt) {
                var list = get.config('recentCharacter') || [];
                return list.contains(name) ? capt : null;
            }
        },
        listenEnd: function (node) {
            if (!node._listeningEnd) {
                node._listeningEnd = true;
                node.listenTransition(function () {
                    delete node._listeningEnd;
                    if ('_onEndMoveDelete' in node) {
                        node.moveDelete(node._onEndMoveDelete);
                    }
                    else if (node._onEndDelete) {
                        node.delete();
                    }
                    node._transitionEnded = true;
                });
            }
        },
        mode: {
            yindao: {
                name: '引导',
                config: {
                    update: function (config, map) {
                    },
                }
            },
            identity: {
                name: '身份',
                connect: {
                    update: function (config, map) {
                        if (config.connect_identity_mode == 'zhong') {
                            map.connect_change_choice.hide();
                            map.choice_ex.hide();
                            map.connect_player_number.hide();
                            map.connect_enhance_zhu.hide();
                            map.connect_double_nei.hide();
                            map.connect_zhong_card.show();
                            map.connect_special_identity.hide();
                            map.connect_double_character.show();
                        }
                        else if (config.connect_identity_mode == 'purple') {
                            map.connect_change_choice.hide();
                            map.choice_ex.hide();
                            map.connect_player_number.hide();
                            map.connect_enhance_zhu.hide();
                            map.connect_double_nei.hide();
                            map.connect_zhong_card.hide();
                            map.connect_special_identity.hide();
                            map.connect_double_character.hide();
                        }
                        else {
                            map.connect_change_choice.show();
                            map.choice_ex.show();
                            map.connect_double_character.show();
                            map.connect_player_number.show();
                            map.connect_enhance_zhu.show();
                            if (config.connect_player_number != '2') {
                                map.connect_double_nei.show();
                            }
                            else {
                                map.connect_double_nei.hide();
                            }
                            map.connect_zhong_card.hide();
                            if (config.connect_player_number == '8') {
                                map.connect_special_identity.show();
                            }
                            else {
                                map.connect_special_identity.hide();
                            }
                        }
                    },
                    connect_identity_mode: {
                        name: '游戏模式',
                        init: 'normal',
                        item: {
                            normal: '标准',
                            zhong: '明忠',
                            purple: '3v3v2',
                        },
                        restart: true,
                        frequent: true,
                        intro: '明忠模式和3v3v2模式详见帮助'
                    },
                    connect_player_number: {
                        name: '游戏人数',
                        init: '8',
                        item: {
                            '2': '两人',
                            '3': '三人',
                            '4': '四人',
                            '5': '五人',
                            '6': '六人',
                            '7': '七人',
                            '8': '八人'
                        },
                        frequent: true,
                        restart: true,
                    },
                    connect_zhong_card: {
                        name: '明忠卡牌替换',
                        init: true,
                        frequent: true,
                        restart: true
                    },
                    connect_double_nei: {
                        name: '双内奸',
                        init: false,
                        restart: true,
                        intro: '开启后游戏中将有两个内奸（内奸胜利条件仍为主内1v1时击杀主公）'
                    },
                    connect_double_character: {
                        name: '双将模式',
                        init: false,
                        frequent: true,
                        restart: true,
                    },
                    connect_change_card: {
                        name: '启用手气卡',
                        init: false,
                        frequent: true,
                        restart: true,
                    },
                    connect_change_choice: {
                        name: '点将模式',
                        init: false,
                        frequent: true,
                        restart: true,
                    },
                    connect_special_identity: {
                        name: '特殊身份',
                        init: false,
                        restart: true,
                        frequent: true,
                        intro: '开启后游戏中将增加军师、大将、贼首三个身份'
                    },
                    connect_enhance_zhu: {
                        name: '加强主公',
                        init: false,
                        restart: true,
                        intro: '为主公增加一个额外技能'
                    },
                    choice_ex: {
                        name: '额外选将框',
                        init: '0',
                        restart: true,
                        item: {
                            '0': '关闭',
                            '1': '一',
                            '3': '三',
                            '5': '五',
                            '7': '七',
                            '9': '九',
                        },
                        intro: '为所有玩家分配额外选将框'
                    },
                    card_remark: {
                        name: '装备回调',
                        init: false,
                        frequent: true,
                        restart: true,
                        intro: '将军争和基础包的装备牌回调至《三国杀》原版'
                    }
                },
                config: {
                    update: function (config, map) {
                        if (config.identity_mode == 'zhong') {
                            map.player_number.hide();
                            map.enhance_zhu.hide();
                            map.double_nei.hide();
                            map.auto_identity.hide();
                            map.choice_ex.hide();
                            map.choice_zhu.hide();
                            map.choice_zhong.hide();
                            map.choice_nei.hide();
                            map.choice_fan.hide();
                            map.ban_identity.hide();
                            map.ban_identity2.hide();
                            map.ban_identity3.hide();
                            map.zhong_card.show();
                            map.special_identity.hide();
                            map.choose_group.show();
                            map.change_choice.show();
                            map.auto_mark_identity.show();
                            map.double_character.show();
                            map.free_choose.show();
                            map.change_identity.show();
                            if (config.double_character) {
                                map.double_hp.show();
                            }
                            else {
                                map.double_hp.hide();
                            }
                            map.continue_game.show();
                        }
                        else if (config.identity_mode == 'purple') {
                            map.player_number.hide();
                            map.enhance_zhu.hide();
                            map.double_nei.hide();
                            map.auto_identity.hide();
                            map.choice_ex.hide();
                            map.choice_zhu.hide();
                            map.choice_zhong.hide();
                            map.choice_nei.hide();
                            map.choice_fan.hide();
                            map.ban_identity.hide();
                            map.ban_identity2.hide();
                            map.ban_identity3.hide();
                            map.zhong_card.hide();
                            map.special_identity.hide();
                            map.double_character.hide();
                            map.double_hp.hide();
                            map.choose_group.hide();
                            map.auto_mark_identity.hide();
                            map.change_choice.hide();
                            map.free_choose.hide();
                            map.change_identity.hide();
                            map.continue_game.hide();
                        }
                        else {
                            map.continue_game.show();
                            map.player_number.show();
                            map.enhance_zhu.show();
                            map.auto_identity.show();
                            if (config.player_number != '2') {
                                map.double_nei.show();
                            }
                            else {
                                map.double_nei.hide();
                            }
                            map.choice_ex.show();
                            map.choice_zhu.show();
                            map.choice_zhong.show();
                            map.choice_nei.show();
                            map.choice_fan.show();
                            map.ban_identity.show();
                            if (config.ban_identity == 'off') {
                                map.ban_identity2.hide();
                            }
                            else {
                                map.ban_identity2.show();
                            }
                            if (config.ban_identity == 'off' || config.ban_identity2 == 'off') {
                                map.ban_identity3.hide();
                            }
                            else {
                                map.ban_identity3.show();
                            }
                            map.zhong_card.hide();
                            map.choose_group.show();
                            map.auto_mark_identity.show();
                            map.change_choice.show();
                            map.free_choose.show();
                            map.change_identity.show();
                            if (config.player_number == '8') {
                                map.special_identity.show();
                            }
                            else {
                                map.special_identity.hide();
                            }
                            map.double_character.show();
                            if (config.double_character) {
                                map.double_hp.show();
                            }
                            else {
                                map.double_hp.hide();
                            }
                        }
                    },
                    identity_mode: {
                        name: '游戏模式',
                        init: 'normal',
                        item: {
                            normal: '标准',
                            zhong: '明忠',
                            purple: '3v3v2',
                        },
                        restart: true,
                        frequent: true,
                        intro: '明忠模式详见帮助'
                    },
                    player_number: {
                        name: '游戏人数',
                        init: '3',
                        item: {
                            '2': '两人',
                            '3': '三人',
                            '4': '四人',
                            '5': '五人',
                            '6': '六人',
                            '7': '七人',
                            '8': '八人'
                        },
                        frequent: true,
                        restart: true,
                    },
                    double_nei: {
                        name: '双内奸',
                        init: false,
                        restart: true,
                        frequent: true,
                        intro: '开启后游戏中将有两个内奸（内奸胜利条件仍为主内1v1时击杀主公）'
                    },
                    choose_group: {
                        name: '神武将选择势力',
                        init: true,
                        restart: true,
                        frequent: true,
                        intro: '若开启此选项，选择神武将的玩家需在亮出自己的武将牌之前为自己选择一个势力。'
                    },
                    nei_fullscreenpop: {
                        name: '主内单挑特效',
                        intro: '在进入主内单挑时，弹出全屏文字特效',
                        init: true,
                        unfrequent: true,
                    },
                    double_character: {
                        name: '双将模式',
                        init: false,
                        frequent: true,
                        restart: true,
                    },
                    special_identity: {
                        name: '特殊身份',
                        init: false,
                        restart: true,
                        frequent: true,
                        intro: '开启后游戏中将增加军师、大将、贼首三个身份'
                    },
                    zhong_card: {
                        name: '明忠卡牌替换',
                        init: true,
                        frequent: true,
                        restart: true
                    },
                    double_hp: {
                        name: '双将体力上限',
                        init: 'pingjun',
                        item: {
                            hejiansan: '和减三',
                            pingjun: '平均值',
                            zuidazhi: '最大值',
                            zuixiaozhi: '最小值',
                            zonghe: '相加',
                        },
                        restart: true,
                    },
                    auto_identity: {
                        name: '自动显示身份',
                        item: {
                            off: '关闭',
                            one: '一轮',
                            two: '两轮',
                            three: '三轮',
                            always: '始终'
                        },
                        init: 'off',
                        onclick: function (bool) {
                            game.saveConfig('auto_identity', bool, this._link.config.mode);
                            if (get.config('identity_mode') == 'zhong')
                                return;
                            var num;
                            switch (bool) {
                                case '一轮':
                                    num = 1;
                                    break;
                                case '两轮':
                                    num = 2;
                                    break;
                                case '三轮':
                                    num = 3;
                                    break;
                                default:
                                    num = 0;
                                    break;
                            }
                            if (num && !_status.identityShown && game.phaseNumber > game.players.length * num && game.showIdentity) {
                                _status.identityShown = true;
                                game.showIdentity(false);
                            }
                        },
                        intro: '游戏进行若干轮将自动显示所有角色的身份',
                    },
                    auto_mark_identity: {
                        name: '自动标记身份',
                        init: true,
                        intro: '根据角色的出牌行为自动标记可能的身份',
                    },
                    enhance_zhu: {
                        name: '加强主公',
                        init: false,
                        restart: true,
                        intro: '为主公增加一个额外技能'
                    },
                    free_choose: {
                        name: '自由选将',
                        init: true,
                        onclick: function (bool) {
                            game.saveConfig('free_choose', bool, this._link.config.mode);
                            if (!_status.event.getParent().showConfig && !_status.event.showConfig)
                                return;
                            if (!ui.cheat2 && get.config('free_choose'))
                                ui.create.cheat2();
                            else if (ui.cheat2 && !get.config('free_choose')) {
                                ui.cheat2.close();
                                delete ui.cheat2;
                            }
                        }
                    },
                    change_identity: {
                        name: '自由选择身份和座位',
                        init: true,
                        onclick: function (bool) {
                            game.saveConfig('change_identity', bool, this._link.config.mode);
                            if (!_status.event.getParent().showConfig && !_status.event.showConfig)
                                return;
                            var dialog;
                            if (ui.cheat2 && ui.cheat2.backup)
                                dialog = ui.cheat2.backup;
                            else
                                dialog = _status.event.dialog;
                            if (!_status.brawl || !_status.brawl.noAddSetting) {
                                if (!dialog.querySelector('table') && get.config('change_identity'))
                                    _status.event.getParent().addSetting(dialog);
                                else
                                    _status.event.getParent().removeSetting(dialog);
                            }
                            ui.update();
                        }
                    },
                    change_choice: {
                        name: '开启换将卡',
                        init: true,
                        onclick: function (bool) {
                            game.saveConfig('change_choice', bool, this._link.config.mode);
                            if (!_status.event.getParent().showConfig && !_status.event.showConfig)
                                return;
                            if (!ui.cheat && get.config('change_choice'))
                                ui.create.cheat();
                            else if (ui.cheat && !get.config('change_choice')) {
                                ui.cheat.close();
                                delete ui.cheat;
                            }
                        }
                    },
                    change_card: {
                        name: '开启手气卡',
                        init: 'disabled',
                        item: {
                            disabled: '禁用',
                            once: '一次',
                            twice: '两次',
                            unlimited: '无限',
                        },
                    },
                    continue_game: {
                        name: '显示再战',
                        init: false,
                        onclick: function (bool) {
                            game.saveConfig('continue_game', bool, this._link.config.mode);
                            if (get.config('continue_game')) {
                                if (!ui.continue_game && _status.over && !_status.brawl && !game.no_continue_game) {
                                    ui.continue_game = ui.create.control('再战', game.reloadCurrent);
                                }
                            }
                            else if (ui.continue_game) {
                                ui.continue_game.close();
                                delete ui.continue_game;
                            }
                        },
                        intro: '游戏结束后可选择用相同的武将再进行一局游戏'
                    },
                    dierestart: {
                        name: '死亡后显示重来',
                        init: true,
                        onclick: function (bool) {
                            game.saveConfig('dierestart', bool, this._link.config.mode);
                            if (get.config('dierestart')) {
                                if (!ui.restart && game.me.isDead() && !_status.connectMode) {
                                    ui.restart = ui.create.control('restart', game.reload);
                                }
                            }
                            else if (ui.restart) {
                                ui.restart.close();
                                delete ui.restart;
                            }
                        }
                    },
                    revive: {
                        name: '死亡后显示复活',
                        init: false,
                        onclick: function (bool) {
                            game.saveConfig('revive', bool, this._link.config.mode);
                            if (get.config('revive')) {
                                if (!ui.revive && game.me.isDead()) {
                                    ui.revive = ui.create.control('revive', ui.click.dierevive);
                                }
                            }
                            else if (ui.revive) {
                                ui.revive.close();
                                delete ui.revive;
                            }
                        }
                    },
                    ban_identity: {
                        name: '屏蔽身份',
                        init: 'off',
                        item: {
                            off: '关闭',
                            zhu: '主公',
                            zhong: '忠臣',
                            nei: '内奸',
                            fan: '反贼',
                        },
                    },
                    ban_identity2: {
                        name: '屏蔽身份2',
                        init: 'off',
                        item: {
                            off: '关闭',
                            zhu: '主公',
                            zhong: '忠臣',
                            nei: '内奸',
                            fan: '反贼',
                        },
                    },
                    ban_identity3: {
                        name: '屏蔽身份3',
                        init: 'off',
                        item: {
                            off: '关闭',
                            zhu: '主公',
                            zhong: '忠臣',
                            nei: '内奸',
                            fan: '反贼',
                        },
                    },
                    ai_strategy: {
                        name: '内奸策略',
                        init: 'ai_strategy_1',
                        item: {
                            ai_strategy_1: '均衡',
                            ai_strategy_2: '偏反',
                            ai_strategy_3: '偏忠',
                            ai_strategy_4: '酱油',
                            ai_strategy_5: '天使',
                            ai_strategy_6: '仇主',
                        },
                        intro: '设置内奸对主忠反的态度'
                    },
                    difficulty: {
                        name: 'AI对人类态度',
                        init: 'normal',
                        item: {
                            easy: '友好',
                            normal: '一般',
                            hard: '仇视',
                        },
                    },
                    choice_ex: {
                        name: '额外选将框',
                        init: '0',
                        restart: true,
                        item: {
                            '0': '关闭',
                            '1': '一',
                            '2': '二',
                            '4': '四',
                            '6': '六',
                            '8': '八',
                        },
                        intro: '为所有玩家分配额外选将框'
                    },
                    choice_zhu: {
                        name: '主公候选武将数',
                        init: '3',
                        restart: true,
                        item: {
                            '3': '三',
                            '4': '四',
                            '5': '五',
                            '6': '六',
                            '8': '八',
                            '10': '十',
                        },
                    },
                    choice_zhong: {
                        name: '忠臣候选武将数',
                        init: '4',
                        restart: true,
                        item: {
                            '3': '三',
                            '4': '四',
                            '5': '五',
                            '6': '六',
                            '8': '八',
                            '10': '十',
                        },
                    },
                    choice_nei: {
                        name: '内奸候选武将数',
                        init: '5',
                        restart: true,
                        item: {
                            '3': '三',
                            '4': '四',
                            '5': '五',
                            '6': '六',
                            '8': '八',
                            '10': '十',
                        },
                    },
                    choice_fan: {
                        name: '反贼候选武将数',
                        init: '3',
                        restart: true,
                        item: {
                            '3': '三',
                            '4': '四',
                            '5': '五',
                            '6': '六',
                            '8': '八',
                            '10': '十',
                        },
                    },
                    card_remark: {
                        name: '装备回调',
                        init: false,
                        frequent: true,
                        restart: true,
                        intro: '将军争和基础包的装备牌回调至《三国杀》原版'
                    }
                }
            },
            guozhan: {
                name: '国战',
                connect: {
                    update: function (config, map) {
                        if (config.connect_onlyguozhan) {
                            map.connect_junzhu.show();
                        }
                        else {
                            map.connect_junzhu.hide();
                        }
                    },
                    connect_guozhan_mode: {
                        name: '游戏模式',
                        init: 'normal',
                        item: {
                            normal: '势备',
                            yingbian: '应变',
                            old: '怀旧',
                        },
                        frequent: true,
                        restart: true,
                        intro: '<li>势备：默认模式，使用线下《君临天下·势备篇》的牌堆进行游戏。<br><li>应变：使用OL的应变国战牌堆进行游戏。<br><li>怀旧：使用传统国战的牌堆进行游戏。',
                    },
                    connect_player_number: {
                        name: '游戏人数',
                        init: '8',
                        item: {
                            '3': '三人',
                            '4': '四人',
                            '5': '五人',
                            '6': '六人',
                            '7': '七人',
                            '8': '八人'
                        },
                        frequent: true,
                        restart: true,
                    },
                    connect_initshow_draw: {
                        name: '首亮奖励',
                        item: {
                            'off': '关闭',
                            'draw': '摸牌',
                            'mark': '标记',
                        },
                        init: 'mark',
                        frequent: true,
                        intro: '第一个明置武将牌的角色可获得首亮奖励'
                    },
                    connect_aozhan: {
                        name: '鏖战模式',
                        init: true,
                        intro: '若开启此选项，则将在游戏中引入“鏖战模式”的规则：<br>当游戏中仅剩四名或更少角色时（七人以下游戏时改为三名或更少），若此时全场没有超过一名势力相同的角色，则从一个新的回合开始，游戏进入鏖战模式直至游戏结束。<br>◇在鏖战模式下，【桃】只能当做【杀】或【闪】使用或打出，不能用来回复体力。<br>注：进入鏖战模式后，即使之后有两名或者更多势力相同的角色出现，仍然不会取消鏖战模式。',
                        frequent: true,
                        restart: true,
                    },
                    connect_viewnext: {
                        name: '观看下家副将',
                        init: false,
                        intro: '若开启此选项，所有的玩家将在挑选武将后，分发起始手牌之前，分别观看自己下家的副将。',
                    },
                    connect_zhulian: {
                        name: '珠联璧合',
                        init: true,
                        intro: '主将和副将都明置后，若为特定组合，可获得【珠联璧合】标记'
                    },
                    connect_junzhu: {
                        name: '替换君主',
                        init: true,
                        restart: true,
                        intro: '若开启此选项，玩家的第一个回合开始时，若其主武将牌有对应的君主武将牌，则其可以将此武将牌替换为对应的君主武将牌，然后重新调整体力上限。若玩家的体力上限因此增大，则玩家回复等量的体力。'
                    },
                    connect_change_card: {
                        name: '启用手气卡',
                        init: false,
                        frequent: true,
                        restart: true,
                    },
                    card_remark: {
                        name: '装备回调',
                        init: false,
                        frequent: true,
                        restart: true,
                        intro: '将军争和基础包的装备牌回调至《三国杀》原版'
                    }
                },
                config: {
                    update: function (config, map) {
                        if (config.onlyguozhan) {
                            map.junzhu.show();
                        }
                        else {
                            map.junzhu.hide();
                        }
                    },
                    guozhan_mode: {
                        name: '游戏模式',
                        init: 'normal',
                        item: {
                            normal: '势备',
                            yingbian: '应变',
                            old: '怀旧',
                            free: '自由',
                        },
                        frequent: true,
                        restart: true,
                        intro: '<li>势备：默认模式，使用线下《君临天下·势备篇》的牌堆进行游戏。<br><li>应变：使用OL的应变国战牌堆进行游戏。<br><li>怀旧：使用传统国战的牌堆进行游戏。<br><li>自由：使用玩家的自定义牌堆进行游戏。',
                    },
                    player_number: {
                        name: '游戏人数',
                        init: '8',
                        item: {
                            '3': '三人',
                            '4': '四人',
                            '5': '五人',
                            '6': '六人',
                            '7': '七人',
                            '8': '八人'
                        },
                        frequent: true,
                        restart: true,
                    },
                    initshow_draw: {
                        name: '首亮奖励',
                        item: {
                            'off': '关闭',
                            'draw': '摸牌',
                            'mark': '标记',
                        },
                        init: 'mark',
                        frequent: true,
                        intro: '第一个明置身份牌的角色可获得摸牌奖励'
                    },
                    aozhan: {
                        name: '鏖战模式',
                        init: true,
                        frequent: true,
                        restart: true,
                        intro: '若开启此选项，则将在游戏中引入“鏖战模式”的规则：<br>当游戏中仅剩四名或更少角色时（七人以下游戏时改为三名或更少），若此时全场没有超过一名势力相同的角色，则从一个新的回合开始，游戏进入鏖战模式直至游戏结束。<br>◇在鏖战模式下，【桃】只能当做【杀】或【闪】使用或打出，不能用来回复体力。<br>注：进入鏖战模式后，即使之后有两名或者更多势力相同的角色出现，仍然不会取消鏖战模式。',
                    },
                    viewnext: {
                        name: '观看下家副将',
                        init: false,
                        intro: '若开启此选项，所有的玩家将在挑选武将后，分发起始手牌之前，分别观看自己下家的副将。',
                    },
                    aozhan_bgm: {
                        name: '鏖战背景音乐',
                        item: {
                            disabled: '不启用',
                            online: 'Online',
                            rewrite: 'Rewrite',
                            chaoming: '潮鸣',
                        },
                        init: 'rewrite',
                        onclick: function (item) {
                            game.saveConfig('aozhan_bgm', item, this._link.config.mode);
                            if (_status._aozhan == true)
                                game.playBackgroundMusic();
                        },
                    },
                    zhulian: {
                        name: '珠联璧合',
                        init: true,
                        intro: '主将和副将都明置后，若为特定组合，可获得【珠联璧合】标记'
                    },
                    changeViceType: {
                        name: '副将变更方式',
                        init: 'default',
                        item: {
                            default: '发现式',
                            online: '随机式',
                        },
                        frequent: true,
                        restart: true,
                    },
                    onlyguozhan: {
                        name: '使用国战武将',
                        init: true,
                        frequent: true,
                        restart: true,
                        intro: '开启武将技能将替换为国战版本并禁用非国战武将'
                    },
                    guozhanSkin: {
                        name: '使用国战皮肤',
                        init: true,
                        frequent: true,
                        restart: true,
                        intro: '开启此选项后，将会把有国战专属皮肤的武将替换为国战皮肤'
                    },
                    junzhu: {
                        name: '替换君主',
                        init: true,
                        restart: true,
                        intro: '若开启此选项，玩家的第一个回合开始时，若其主武将牌有对应的君主武将牌，则其可以将此武将牌替换为对应的君主武将牌，然后重新调整体力上限。若玩家的体力上限因此增大，则玩家回复等量的体力。'
                    },
                    double_hp: {
                        name: '双将体力上限',
                        init: 'pingjun',
                        item: {
                            hejiansan: '和减三',
                            pingjun: '平均值',
                            zuidazhi: '最大值',
                            zuixiaozhi: '最小值',
                            zonghe: '相加',
                        },
                        restart: true,
                    },
                    free_choose: {
                        name: '自由选将',
                        init: true,
                        onclick: function (bool) {
                            game.saveConfig('free_choose', bool, this._link.config.mode);
                            if (!_status.event.getParent().showConfig && !_status.event.showConfig)
                                return;
                            if (!ui.cheat2 && get.config('free_choose'))
                                ui.create.cheat2();
                            else if (ui.cheat2 && !get.config('free_choose')) {
                                ui.cheat2.close();
                                delete ui.cheat2;
                            }
                        }
                    },
                    onlyguozhanexpand: {
                        name: '默认展开自由选将',
                        init: false,
                        restart: true,
                        intro: '开启后自由选将对话框将默认显示全部武将'
                    },
                    change_identity: {
                        name: '自由选择座位',
                        init: true,
                        onclick: function (bool) {
                            game.saveConfig('change_identity', bool, this._link.config.mode);
                            if (!_status.event.getParent().showConfig && !_status.event.showConfig)
                                return;
                            var dialog;
                            if (ui.cheat2 && ui.cheat2.backup)
                                dialog = ui.cheat2.backup;
                            else
                                dialog = _status.event.dialog;
                            if (!_status.brawl || !_status.brawl.noAddSetting) {
                                if (!dialog.querySelector('table') && get.config('change_identity'))
                                    _status.event.getParent().addSetting(dialog);
                                else
                                    _status.event.getParent().removeSetting(dialog);
                            }
                            ui.update();
                        }
                    },
                    change_choice: {
                        name: '开启换将卡',
                        init: true,
                        onclick: function (bool) {
                            game.saveConfig('change_choice', bool, this._link.config.mode);
                            if (!_status.event.getParent().showConfig && !_status.event.showConfig)
                                return;
                            if (!ui.cheat && get.config('change_choice'))
                                ui.create.cheat();
                            else if (ui.cheat && !get.config('change_choice')) {
                                ui.cheat.close();
                                delete ui.cheat;
                            }
                        }
                    },
                    change_card: {
                        name: '开启手气卡',
                        init: 'disabled',
                        item: {
                            disabled: '禁用',
                            once: '一次',
                            twice: '两次',
                            unlimited: '无限',
                        }
                    },
                    continue_game: {
                        name: '显示再战',
                        init: true,
                        intro: '游戏结束后可选择用相同的武将再进行一局游戏',
                        onclick: function (bool) {
                            game.saveConfig('continue_game', bool, this._link.config.mode);
                            if (get.config('continue_game')) {
                                if (!ui.continue_game && _status.over && !_status.brawl && !game.no_continue_game) {
                                    ui.continue_game = ui.create.control('再战', game.reloadCurrent);
                                }
                            }
                            else if (ui.continue_game) {
                                ui.continue_game.close();
                                delete ui.continue_game;
                            }
                        }
                    },
                    dierestart: {
                        name: '死亡后显示重来',
                        init: true,
                        onclick: function (bool) {
                            game.saveConfig('dierestart', bool, this._link.config.mode);
                            if (get.config('dierestart')) {
                                if (!ui.restart && game.me.isDead() && !_status.connectMode) {
                                    ui.restart = ui.create.control('restart', game.reload);
                                }
                            }
                            else if (ui.restart) {
                                ui.restart.close();
                                delete ui.restart;
                            }
                        }
                    },
                    revive: {
                        name: '死亡后显示复活',
                        init: false,
                        onclick: function (bool) {
                            game.saveConfig('revive', bool, this._link.config.mode);
                            if (get.config('revive')) {
                                if (!ui.revive && game.me.isDead()) {
                                    ui.revive = ui.create.control('revive', ui.click.dierevive);
                                }
                            }
                            else if (ui.revive) {
                                ui.revive.close();
                                delete ui.revive;
                            }
                        }
                    },
                    difficulty: {
                        name: 'AI对人类态度',
                        init: 'normal',
                        item: {
                            easy: '友好',
                            normal: '一般',
                            hard: '仇视',
                        }
                    },
                    choice_num: {
                        name: '候选武将数',
                        init: '7',
                        restart: true,
                        item: {
                            '5': '五',
                            '6': '六',
                            '7': '七',
                            '8': '八',
                            '9': '九',
                            '10': '十',
                        }
                    },
                    card_remark: {
                        name: '装备回调',
                        init: false,
                        frequent: true,
                        restart: true,
                        intro: '将军争和基础包的装备牌回调至《三国杀》原版'
                    }
                }
            },
            versus: {
                name: '对决',
                connect: {
                    update: function (config, map) {
                        if (config.connect_versus_mode == '1v1') {
                            map.connect_choice_num.show();
                            map.connect_replace_number.show();
                        }
                        else {
                            map.connect_choice_num.hide();
                            map.connect_replace_number.hide();
                        }
                        if (config.connect_versus_mode == '2v2' || config.connect_versus_mode == '3v3') {
                            map.connect_replace_handcard.show();
                        }
                        else {
                            map.connect_replace_handcard.hide();
                        }
                    },
                    connect_versus_mode: {
                        name: '游戏模式',
                        init: '1v1',
                        item: {
                            '1v1': '1v1',
                            '2v2': '2v2',
                            '3v3': '3v3',
                            '4v4': '4v4',
                        },
                        frequent: true
                    },
                    connect_replace_handcard: {
                        name: '四号位保护',
                        init: true,
                        frequent: true,
                        intro: '最后行动的角色起始手牌数+1'
                    },
                    connect_choice_num: {
                        name: '侯选武将数',
                        init: '20',
                        frequent: true,
                        item: {
                            '12': '12人',
                            '16': '16人',
                            '20': '20人',
                            '24': '24人',
                            '40': '40人',
                        }
                    },
                    connect_replace_number: {
                        name: '替补人数',
                        init: '2',
                        frequent: true,
                        item: {
                            '0': '无',
                            '1': '1人',
                            '2': '2人',
                            '3': '3人',
                            '4': '4人',
                            '5': '5人',
                        }
                    },
                },
                config: {
                    update: function (config, map) {
                        if (config.versus_mode == 'four') {
                            map.change_choice.hide();
                            map.ladder.show();
                            if (config.ladder) {
                                map.ladder_monthly.show();
                                map.ladder_reset.show();
                            }
                            else {
                                map.ladder_monthly.hide();
                                map.ladder_reset.hide();
                            }
                            map.enable_all.show();
                            map.enable_all_cards_four.show();
                            map.four_assign.show();
                            map.four_phaseswap.show();
                            map.expand_dialog.show();
                            map.fouralign.show();
                        }
                        else {
                            map.change_choice.show();
                            map.ladder.hide();
                            map.ladder_monthly.hide();
                            map.ladder_reset.hide();
                            map.enable_all.hide();
                            map.enable_all_cards_four.hide();
                            map.four_assign.hide();
                            map.four_phaseswap.hide();
                            map.expand_dialog.hide();
                            map.fouralign.hide();
                        }
                        if (config.versus_mode == 'three') {
                            map.edit_character_three.show();
                        }
                        else {
                            map.edit_character_three.hide();
                        }
                        if (config.versus_mode == 'three' || config.versus_mode == 'one') {
                            map.enable_all_three.show();
                            map.enable_all_cards.show();
                        }
                        else {
                            map.enable_all_three.hide();
                            map.enable_all_cards.hide();
                        }
                        if (config.versus_mode == 'jiange' || config.versus_mode == 'two' || config.versus_mode == 'endless' ||
                            config.versus_mode == 'three' || config.versus_mode == 'one' || config.versus_mode == 'siguo') {
                            map.free_choose.show();
                        }
                        else {
                            map.free_choose.hide();
                        }
                        if (config.versus_mode == 'jiange') {
                            map.double_character_jiange.show();
                        }
                        else {
                            map.double_character_jiange.hide();
                        }
                        if (config.versus_mode == 'two') {
                            map.replace_handcard_two.show();
                            map.replace_character_two.show();
                            map.two_assign.show();
                            map.two_phaseswap.show();
                        }
                        else {
                            map.replace_handcard_two.hide();
                            map.replace_character_two.hide();
                            map.two_assign.hide();
                            map.two_phaseswap.hide();
                        }
                        if (config.versus_mode == 'two' || config.versus_mode == 'siguo' || config.versus_mode == 'four') {
                            if (config.versus_mode == 'four' && (config.four_assign || config.four_phaseswap)) {
                                map.change_identity.hide();
                            }
                            else {
                                map.change_identity.show();
                            }
                        }
                        else {
                            map.change_identity.hide();
                        }
                        if (config.versus_mode == 'siguo') {
                            map.siguo_character.show();
                        }
                        else {
                            map.siguo_character.hide();
                        }
                    },
                    versus_mode: {
                        name: '游戏模式',
                        init: 'four',
                        item: {
                            four: '对抗',
                            three: '统率',
                            two: '欢乐',
                            jiange: '战场',
                            siguo: '四国',
                            standard: '自由'
                        },
                        restart: true,
                        frequent: true,
                    },
                    ladder: {
                        name: '天梯模式',
                        init: true,
                        frequent: true,
                        restart: true
                    },
                    ladder_monthly: {
                        name: '每月重置天梯',
                        init: true,
                        frequent: true,
                    },
                    enable_all: {
                        name: '启用全部武将',
                        init: false,
                        frequent: true,
                        restart: true,
                    },
                    enable_all_cards_four: {
                        name: '启用全部卡牌',
                        init: false,
                        frequent: true,
                        restart: true,
                    },
                    enable_all_three: {
                        name: '启用全部武将',
                        init: false,
                        frequent: true,
                        restart: true,
                    },
                    enable_all_cards: {
                        name: '启用全部卡牌',
                        init: false,
                        frequent: true,
                        restart: true,
                    },
                    four_assign: {
                        name: '代替队友选将',
                        init: false,
                        restart: true,
                    },
                    four_phaseswap: {
                        name: '代替队友行动',
                        init: false,
                        restart: true,
                    },
                    two_assign: {
                        name: '代替队友选将',
                        init: false,
                        restart: true,
                    },
                    two_phaseswap: {
                        name: '代替队友行动',
                        init: false,
                        restart: true,
                    },
                    free_choose: {
                        name: '自由选将',
                        init: true,
                        frequent: true,
                        onclick: function (bool) {
                            game.saveConfig('free_choose', bool, this._link.config.mode);
                            if (!ui.create.cheat2)
                                return;
                            if (!_status.event.getParent().showConfig && !_status.event.showConfig)
                                return;
                            if (!ui.cheat2 && get.config('free_choose'))
                                ui.create.cheat2();
                            else if (ui.cheat2 && !get.config('free_choose')) {
                                ui.cheat2.close();
                                delete ui.cheat2;
                            }
                        }
                    },
                    fouralign: {
                        name: '自由选择阵型',
                        init: false
                    },
                    change_identity: {
                        name: '自由选择座位',
                        init: true,
                        onclick: function (bool) {
                            game.saveConfig('change_identity', bool, this._link.config.mode);
                            if (!_status.event.getParent().showConfig && !_status.event.showConfig)
                                return;
                            if (_status.mode == 'four') {
                                if (get.config('four_assign') || get.config('four_phaseswap'))
                                    return;
                                if (bool) {
                                    if (_status.event.parent.addSetting) {
                                        _status.event.parent.addSetting();
                                    }
                                }
                                else {
                                    var seats = _status.event.parent.seatsbutton;
                                    if (seats) {
                                        while (seats.length) {
                                            seats.shift().remove();
                                        }
                                        delete _status.event.parent.seatsbutton;
                                    }
                                }
                            }
                            else {
                                var dialog;
                                if (ui.cheat2 && ui.cheat2.backup)
                                    dialog = ui.cheat2.backup;
                                else
                                    dialog = _status.event.dialog;
                                if (!_status.brawl || !_status.brawl.noAddSetting) {
                                    if (!dialog.querySelector('table') && get.config('change_identity'))
                                        _status.event.getParent().addSetting(dialog);
                                    else
                                        _status.event.getParent().removeSetting(dialog);
                                }
                                ui.update();
                            }
                        }
                    },
                    change_choice: {
                        name: '开启换将卡',
                        init: true,
                        onclick: function (bool) {
                            game.saveConfig('change_choice', bool, this._link.config.mode);
                            if (!_status.event.getParent().showConfig && !_status.event.showConfig)
                                return;
                            if (!ui.cheat && get.config('change_choice'))
                                ui.create.cheat();
                            else if (ui.cheat && !get.config('change_choice')) {
                                ui.cheat.close();
                                delete ui.cheat;
                            }
                        },
                        frequent: true,
                    },
                    double_character_jiange: {
                        name: '双将模式',
                        init: false,
                        frequent: true,
                    },
                    replace_handcard_two: {
                        name: '四号位保护',
                        init: true,
                        frequent: true,
                        intro: '最后行动的角色起始手牌+1'
                    },
                    replace_character_two: {
                        name: '替补模式',
                        init: false,
                        frequent: true,
                        intro: '每个额外选择一名武将，死亡后用该武将代替重新上场，替补武将用完时失败'
                    },
                    expand_dialog: {
                        name: '默认展开选将框',
                        intro: '选将框打开时直接显示全部武将（可能使游戏在开始时卡顿）',
                        init: false,
                    },
                    siguo_character: {
                        name: '专属武将出场率',
                        init: 'increase',
                        item: {
                            increase: '大概率',
                            normal: '默认概率',
                            off: '不出现',
                        },
                        frequent: true
                    },
                    ladder_reset: {
                        name: '重置天梯数据',
                        onclick: function () {
                            var node = this;
                            if (node._clearing) {
                                game.save('ladder', {
                                    current: 900,
                                    top: 900,
                                    month: (new Date()).getMonth()
                                });
                                ui.ladder.innerHTML = '卫士五';
                                clearTimeout(node._clearing);
                                node.firstChild.innerHTML = '重置天梯数据';
                                delete node._clearing;
                                return;
                            }
                            node.firstChild.innerHTML = '单击以确认 (3)';
                            node._clearing = setTimeout(function () {
                                node.firstChild.innerHTML = '单击以确认 (2)';
                                node._clearing = setTimeout(function () {
                                    node.firstChild.innerHTML = '单击以确认 (1)';
                                    node._clearing = setTimeout(function () {
                                        node.firstChild.innerHTML = '重置天梯数据';
                                        delete node._clearing;
                                    }, 1000);
                                }, 1000);
                            }, 1000);
                        },
                        clear: true,
                    },
                }
            },
            connect: {
                name: '联机',
                config: {
                    connect_nickname: {
                        name: '联机昵称',
                        input: true,
                        frequent: true,
                    },
                    connect_avatar: {
                        name: '联机头像',
                        init: 'KizunaAI',
                        item: {},
                        frequent: true,
                        onclick: function (item) {
                            game.saveConfig('connect_avatar', item);
                            game.saveConfig('connect_avatar', item, 'connect');
                        }
                    },
                    hall_ip: {
                        name: '联机大厅',
                        input: true,
                        frequent: true,
                    },
                    hall_button: {
                        name: '联机大厅按钮',
                        init: true,
                        frequent: true,
                        onclick: function (bool) {
                            game.saveConfig('hall_button', bool, 'connect');
                            if (ui.hall_button) {
                                if (bool) {
                                    ui.hall_button.style.display = '';
                                }
                                else {
                                    ui.hall_button.style.display = 'none';
                                }
                            }
                        }
                    },
                }
            },
            boss: {
                name: '挑战',
                config: {
                    free_choose: {
                        name: '自由选将',
                        init: true,
                        frequent: true,
                        onclick: function (bool) {
                            game.saveConfig('free_choose', bool, this._link.config.mode);
                            if (!_status.event.getParent().showConfig && !_status.event.showConfig)
                                return;
                            if (!ui.cheat2 && get.config('free_choose'))
                                ui.create.cheat2();
                            else if (ui.cheat2 && !get.config('free_choose')) {
                                ui.cheat2.close();
                                delete ui.cheat2;
                            }
                        }
                    },
                    change_choice: {
                        name: '开启换将卡',
                        init: true,
                        onclick: function (bool) {
                            game.saveConfig('change_choice', bool, this._link.config.mode);
                            if (!_status.event.getParent().showConfig && !_status.event.showConfig)
                                return;
                            if (!ui.cheat && get.config('change_choice'))
                                ui.create.cheat();
                            else if (ui.cheat && !get.config('change_choice')) {
                                ui.cheat.close();
                                delete ui.cheat;
                            }
                        },
                        frequent: true,
                    },
                    single_control: {
                        name: '单人控制',
                        init: true,
                        frequent: true,
                        onclick: function (bool) {
                            game.saveConfig('single_control', bool, this._link.config.mode);
                            if (ui.single_swap && game.me != game.boss) {
                                if (bool) {
                                    ui.single_swap.style.display = 'none';
                                }
                                else {
                                    ui.single_swap.style.display = '';
                                }
                            }
                        },
                        intro: '只控制一名角色，其他角色由AI控制'
                    },
                }
            },
            doudizhu: {
                name: '斗地主',
                connect: {
                    update: function (config, map) {
                        if (config.connect_doudizhu_mode == 'online') {
                            map.connect_change_card.hide();
                        }
                        else {
                            map.connect_change_card.show();
                        }
                        if (config.connect_doudizhu_mode != 'normal') {
                            map.connect_double_character.hide();
                        }
                        else {
                            map.connect_double_character.show();
                        }
                    },
                    connect_doudizhu_mode: {
                        name: '游戏模式',
                        init: 'normal',
                        item: {
                            normal: '休闲',
                            kaihei: '开黑',
                            huanle: '欢乐',
                            binglin: '兵临',
                            online: '智斗',
                        },
                        restart: true,
                        frequent: true,
                    },
                    connect_double_character: {
                        name: '双将模式',
                        init: false,
                        frequent: true,
                        restart: true,
                    },
                    connect_change_card: {
                        name: '启用手气卡',
                        init: false,
                        frequent: true,
                        restart: true,
                    },
                },
                config: {
                    update: function (config, map) {
                        if (config.doudizhu_mode == 'online') {
                            map.change_card.hide();
                            map.edit_character.show();
                            map.reset_character.show();
                        }
                        else {
                            map.change_card.show();
                            map.edit_character.hide();
                            map.reset_character.hide();
                        }
                        if (config.doudizhu_mode != 'normal') {
                            map.double_character.hide();
                            map.free_choose.hide();
                            map.change_identity.hide();
                            map.change_choice.hide();
                            map.continue_game.hide();
                            map.dierestart.hide();
                            map.choice_zhu.hide();
                            map.choice_fan.hide();
                            map.revive.hide();
                        }
                        else {
                            map.double_character.show();
                            map.free_choose.show();
                            map.change_identity.show();
                            map.change_choice.show();
                            map.continue_game.show();
                            map.dierestart.show();
                            map.choice_zhu.show();
                            map.choice_fan.show();
                            map.revive.show();
                        }
                        if (config.double_character && config.doudizhu_mode == 'normal') {
                            map.double_hp.show();
                        }
                        else {
                            map.double_hp.hide();
                        }
                    },
                    doudizhu_mode: {
                        name: '游戏模式',
                        init: 'normal',
                        item: {
                            normal: '休闲',
                            kaihei: '开黑',
                            huanle: '欢乐',
                            binglin: '兵临',
                            online: '智斗',
                        },
                        restart: true,
                        frequent: true,
                    },
                    double_character: {
                        name: '双将模式',
                        init: false,
                        frequent: true,
                        restart: true,
                    },
                    double_hp: {
                        name: '双将体力上限',
                        init: 'pingjun',
                        item: {
                            hejiansan: '和减三',
                            pingjun: '平均值',
                            zuidazhi: '最大值',
                            zuixiaozhi: '最小值',
                            zonghe: '相加',
                        },
                        restart: true,
                    },
                    free_choose: {
                        name: '自由选将',
                        init: true,
                        onclick: function (bool) {
                            game.saveConfig('free_choose', bool, this._link.config.mode);
                            if (!_status.event.getParent().showConfig && !_status.event.showConfig)
                                return;
                            if (!ui.cheat2 && get.config('free_choose'))
                                ui.create.cheat2();
                            else if (ui.cheat2 && !get.config('free_choose')) {
                                ui.cheat2.close();
                                delete ui.cheat2;
                            }
                        }
                    },
                    change_identity: {
                        name: '自由选择身份和座位',
                        init: true,
                        onclick: function (bool) {
                            game.saveConfig('change_identity', bool, this._link.config.mode);
                            if (!_status.event.getParent().showConfig && !_status.event.showConfig)
                                return;
                            var dialog;
                            if (ui.cheat2 && ui.cheat2.backup)
                                dialog = ui.cheat2.backup;
                            else
                                dialog = _status.event.dialog;
                            if (!_status.brawl || !_status.brawl.noAddSetting) {
                                if (!dialog.querySelector('table') && get.config('change_identity'))
                                    _status.event.getParent().addSetting(dialog);
                                else
                                    _status.event.getParent().removeSetting(dialog);
                            }
                            ui.update();
                        }
                    },
                    change_choice: {
                        name: '开启换将卡',
                        init: true,
                        onclick: function (bool) {
                            game.saveConfig('change_choice', bool, this._link.config.mode);
                            if (!_status.event.getParent().showConfig && !_status.event.showConfig)
                                return;
                            if (!ui.cheat && get.config('change_choice'))
                                ui.create.cheat();
                            else if (ui.cheat && !get.config('change_choice')) {
                                ui.cheat.close();
                                delete ui.cheat;
                            }
                        }
                    },
                    change_card: {
                        name: '开启手气卡',
                        init: 'disabled',
                        item: {
                            disabled: '禁用',
                            once: '一次',
                            twice: '两次',
                            unlimited: '无限',
                        },
                    },
                    continue_game: {
                        name: '显示再战',
                        init: false,
                        onclick: function (bool) {
                            game.saveConfig('continue_game', bool, this._link.config.mode);
                            if (get.config('continue_game')) {
                                if (!ui.continue_game && _status.over && !_status.brawl && !game.no_continue_game) {
                                    ui.continue_game = ui.create.control('再战', game.reloadCurrent);
                                }
                            }
                            else if (ui.continue_game) {
                                ui.continue_game.close();
                                delete ui.continue_game;
                            }
                        },
                        intro: '游戏结束后可选择用相同的武将再进行一局游戏'
                    },
                    dierestart: {
                        name: '死亡后显示重来',
                        init: true,
                        onclick: function (bool) {
                            game.saveConfig('dierestart', bool, this._link.config.mode);
                            if (get.config('dierestart')) {
                                if (!ui.restart && game.me.isDead() && !_status.connectMode) {
                                    ui.restart = ui.create.control('restart', game.reload);
                                }
                            }
                            else if (ui.restart) {
                                ui.restart.close();
                                delete ui.restart;
                            }
                        }
                    },
                    revive: {
                        name: '死亡后显示复活',
                        init: false,
                        onclick: function (bool) {
                            game.saveConfig('revive', bool, this._link.config.mode);
                            if (get.config('revive')) {
                                if (!ui.revive && game.me.isDead()) {
                                    ui.revive = ui.create.control('revive', ui.click.dierevive);
                                }
                            }
                            else if (ui.revive) {
                                ui.revive.close();
                                delete ui.revive;
                            }
                        }
                    },
                    choice_zhu: {
                        name: '地主候选武将数',
                        init: '3',
                        restart: true,
                        item: {
                            '3': '三',
                            '4': '四',
                            '5': '五',
                            '6': '六',
                            '8': '八',
                            '10': '十',
                        },
                    },
                    choice_fan: {
                        name: '农民候选武将数',
                        init: '3',
                        restart: true,
                        item: {
                            '3': '三',
                            '4': '四',
                            '5': '五',
                            '6': '六',
                            '8': '八',
                            '10': '十',
                        },
                    },
                }
            },
            longlaoguan: {
                name: '龙牢关',
                connect: {
                    update: function (config, map) { },
                    connect_change_card: {
                        name: '启用手气卡',
                        init: false,
                        frequent: true,
                        restart: true,
                    },
                },
                config: {
                    update: function (config, map) {
                        if (config.double_character) {
                            map.double_hp.show();
                        }
                        else {
                            map.double_hp.hide();
                        }
                    },
                    double_character: {
                        name: '双将模式',
                        init: false,
                        frequent: true,
                        restart: true,
                    },
                    double_hp: {
                        name: '双将体力上限',
                        init: 'pingjun',
                        item: {
                            hejiansan: '和减三',
                            pingjun: '平均值',
                            zuidazhi: '最大值',
                            zuixiaozhi: '最小值',
                            zonghe: '相加',
                        },
                        restart: true,
                    },
                    free_choose: {
                        name: '自由选将',
                        init: true,
                        onclick: function (bool) {
                            game.saveConfig('free_choose', bool, this._link.config.mode);
                            if (!_status.event.getParent().showConfig && !_status.event.showConfig)
                                return;
                            if (!ui.cheat2 && get.config('free_choose'))
                                ui.create.cheat2();
                            else if (ui.cheat2 && !get.config('free_choose')) {
                                ui.cheat2.close();
                                delete ui.cheat2;
                            }
                        }
                    },
                    change_identity: {
                        name: '自由选择身份和座位',
                        init: true,
                        onclick: function (bool) {
                            game.saveConfig('change_identity', bool, this._link.config.mode);
                            if (!_status.event.getParent().showConfig && !_status.event.showConfig)
                                return;
                            var dialog;
                            if (ui.cheat2 && ui.cheat2.backup)
                                dialog = ui.cheat2.backup;
                            else
                                dialog = _status.event.dialog;
                            if (!_status.brawl || !_status.brawl.noAddSetting) {
                                if (!dialog.querySelector('table') && get.config('change_identity'))
                                    _status.event.getParent().addSetting(dialog);
                                else
                                    _status.event.getParent().removeSetting(dialog);
                            }
                            ui.update();
                        }
                    },
                    change_choice: {
                        name: '开启换将卡',
                        init: true,
                        onclick: function (bool) {
                            game.saveConfig('change_choice', bool, this._link.config.mode);
                            if (!_status.event.getParent().showConfig && !_status.event.showConfig)
                                return;
                            if (!ui.cheat && get.config('change_choice'))
                                ui.create.cheat();
                            else if (ui.cheat && !get.config('change_choice')) {
                                ui.cheat.close();
                                delete ui.cheat;
                            }
                        }
                    },
                    change_card: {
                        name: '开启手气卡',
                        init: 'disabled',
                        item: {
                            disabled: '禁用',
                            once: '一次',
                            twice: '两次',
                            unlimited: '无限',
                        },
                    },
                    continue_game: {
                        name: '显示再战',
                        init: false,
                        onclick: function (bool) {
                            game.saveConfig('continue_game', bool, this._link.config.mode);
                            if (get.config('continue_game')) {
                                if (!ui.continue_game && _status.over && !_status.brawl) {
                                    ui.continue_game = ui.create.control('再战', game.reloadCurrent);
                                }
                            }
                            else if (ui.continue_game) {
                                ui.continue_game.close();
                                delete ui.continue_game;
                            }
                        },
                        intro: '游戏结束后可选择用相同的武将再进行一局游戏'
                    },
                    dierestart: {
                        name: '死亡后显示重来',
                        init: true,
                        onclick: function (bool) {
                            game.saveConfig('dierestart', bool, this._link.config.mode);
                            if (get.config('dierestart')) {
                                if (!ui.restart && game.me.isDead() && !_status.connectMode) {
                                    ui.restart = ui.create.control('restart', game.reload);
                                }
                            }
                            else if (ui.restart) {
                                ui.restart.close();
                                delete ui.restart;
                            }
                        }
                    },
                    revive: {
                        name: '死亡后显示复活',
                        init: false,
                        onclick: function (bool) {
                            game.saveConfig('revive', bool, this._link.config.mode);
                            if (get.config('revive')) {
                                if (!ui.revive && game.me.isDead()) {
                                    ui.revive = ui.create.control('revive', ui.click.dierevive);
                                }
                            }
                            else if (ui.revive) {
                                ui.revive.close();
                                delete ui.revive;
                            }
                        }
                    },
                    choice_zhu: {
                        name: '龙皇候选武将数',
                        init: '1',
                        restart: true,
                        item: {
                            '1': '一',
                        },
                    },
                    choice_fan: {
                        name: '反抗军候选武将数',
                        init: '5',
                        restart: true,
                        item: {
                            '3': '三',
                            '4': '四',
                            '5': '五',
                            '6': '六',
                            '8': '八',
                            '10': '十',
                        },
                    },
                }
            },
            single: {
                name: '单挑',
                connect: {
                    connect_single_mode: {
                        name: '游戏模式',
                        init: 'dianjiang',
                        item: {
                            dianjiang: '点将单挑',
                        },
                        restart: true,
                        frequent: true,
                    },
                    connect_enable_jin: {
                        name: '启用晋势力武将',
                        init: false,
                        restart: true,
                        frequent: true,
                    },
                    update: function (config, map) {
                        if (config.connect_single_mode != 'normal') {
                            map.connect_enable_jin.hide();
                        }
                        else {
                            map.connect_enable_jin.show();
                        }
                    },
                },
                config: {
                    single_mode: {
                        name: '游戏模式',
                        init: 'dianjiang',
                        item: {
                            dianjiang: '点将单挑',
                        },
                        restart: true,
                        frequent: true,
                    },
                    enable_jin: {
                        name: '启用晋势力武将',
                        init: false,
                        restart: true,
                        frequent: true,
                    },
                    update: function (config, map) {
                        if (config.single_mode != 'normal') {
                            map.enable_jin.hide();
                        }
                        else {
                            map.enable_jin.show();
                        }
                    },
                }
            },
            brawl: {
                name: '乱斗',
                config: {
                    huanhuazhizhan: {
                        name: '幻化之战',
                        init: true,
                        frequent: true
                    },
                    qunxionggeju: {
                        name: '群雄割据',
                        init: true,
                        frequent: true
                    },
                    duzhansanguo: {
                        name: '毒战三国',
                        init: true,
                        frequent: true
                    },
                    daoshiyueying: {
                        name: '导师爱璃',
                        init: true,
                        frequent: true
                    },
                    weiwoduzun: {
                        name: '唯我独尊',
                        init: true,
                        frequent: true
                    },
                    tongxingzhizheng: {
                        name: '同姓之争',
                        init: true,
                        frequent: true
                    },
                    jiazuzhizheng: {
                        name: '家族之争',
                        init: true,
                        frequent: true
                    },
                    tongjiangmoshi: {
                        name: '同将模式',
                        init: true,
                        frequent: true
                    },
                    qianlidanji: {
                        name: '千里单骑',
                        init: true,
                        frequent: true
                    },
                    scene: {
                        name: '创建场景',
                        init: true,
                        frequent: true
                    }
                }
            },
        },
        status: {
            running: false,
            canvas: false,
            time: 0,
            reload: 0,
            delayed: 0,
            frameId: 0,
            videoId: 0,
            globalId: 0,
        },
        help: {
            'FAQ': '<ul><li>Q：关于家长麦技能中的“除外”，有详细的说明吗？<li>A：你不执行奖惩，不能发动技能或使用牌，不能指定目标或被选择为目标（令角色解除除外状态除外）；计算有关全场角色的数据时，不计算你的存在：当你于回合内被除外时，结束你的回合（若当前有卡牌正在结算，则结算后再结束你的回合）。<br>' +
                '<li>Q：若角色有出牌阶段限制次数的技能，则其会因额外的出牌阶段多次发动此技能吗？<li>A：是的，但是一般情况仅限于主动释放的技能（比如下地的『引流』和MEA的『掠财』）。若不做特殊说明，额外出牌阶段结束时，角色回合内的技能使用次数均会清空，而卡牌使用次数不变。<br>' +
                '<li>Q：夜雾和lulu的技能改变出牌效果时，影响牌的使用次数吗？<li>A：不影响，牌的使用次数始终在牌使用或打出时计入。特别的，lulu的技能可以改变牌名，有可能影响牌的后续结算；而夜雾的技能不改变牌名，（虽然效果已经变化）与原牌名关联的效果不会受影响（如【初始服】之于【杀】【万箭】【南蛮】）<br>',
            '游戏操作': '<ul><li>长按/鼠标悬停/右键单击显示信息<li>触屏模式中，双指点击切换暂停；下划显示菜单，上划切换托管<li>键盘快捷键<br>' +
                '<table><tr><td>A<td>切换托管<tr><td>W<td>切换不询问无懈<tr><td>空格<td>暂停</table><li>编辑牌堆<br>在卡牌包中修改牌堆后，将自动创建一个临时牌堆，在所有模式中共用，当保存当前牌堆后，临时牌堆被清除。每个模式可设置不同的已保存牌堆，设置的牌堆优先级大于临时牌堆</ul>',
            '游戏名词': '<ul><li>智囊：无名杀默认为过河拆桥/无懈可击/无中生有/洞烛先机。牌堆中没有的智囊牌会被过滤。可在卡牌设置中自行增减。若没有可用的智囊，则改为随机选取的三种锦囊牌的牌名。' +
                '<li>仁库：部分武将使用的游戏外共通区域。至多包含六张牌。当有新牌注入后，若牌数超过上限，则将最早进入仁库的溢出牌置入弃牌堆。' +
                '<li>护甲：和体力类似，每点护甲可抵挡一点伤害，但不影响手牌上限。' +
                '<li>随从：通过技能获得，拥有独立的技能、手牌区和装备区（共享判定区），出场时替代主武将的位置；随从死亡时自动切换回主武将。' +
                '<li>发现：从三张随机亮出的牌中选择一张，若无特殊说明，则获得此牌。' +
                '<li>蓄力技：发动时可以增大黄色的数字。若如此做，红色数字于技能的结算过程中改为原来的两倍。'
        },
        setIntro: function (node, func, left) {
            if (node instanceof PlayerModel_1.default) {
                node = node.element;
            }
            if (lib.config.touchscreen) {
                if (left) {
                    node.listen(ui.click.touchintro);
                }
                else {
                    lib.setLongPress(node, ui.click.intro);
                }
            }
            else {
                if (left) {
                    node.listen(ui.click.intro);
                }
                if (lib.config.hover_all) {
                    lib.setHover(node, ui.click.hoverplayer);
                }
                if (lib.config.right_info) {
                    node.oncontextmenu = ui.click.rightplayer;
                }
            }
            if (func) {
                node._customintro = func;
            }
        },
        setPopped: function (node, func, width, height, forceclick, paused2) {
            node._poppedfunc = func;
            node._poppedwidth = width;
            node._poppedheight = height;
            if (forceclick) {
                node.forceclick = true;
            }
            if (lib.config.touchscreen || forceclick) {
                node.listen(ui.click.hoverpopped);
            }
            else {
                node.addEventListener('mouseenter', ui.click.hoverpopped);
            }
            if (paused2) {
                node._paused2 = true;
            }
        },
        placePoppedDialog: function (dialog, e) {
            if (dialog._place_text) {
                if (dialog._place_text.firstChild.offsetWidth >= 190 ||
                    dialog._place_text.firstChild.offsetHeight >= 30) {
                    dialog._place_text.style.textAlign = 'left';
                    dialog._place_text.style.marginLeft = '14px';
                }
            }
            if (e.touches && e.touches[0]) {
                e = e.touches[0];
            }
            var height = Math.min(ui.window.offsetHeight - 20, dialog.content.scrollHeight);
            if (dialog._mod_height) {
                height += dialog._mod_height;
            }
            dialog.style.height = height + 'px';
            if (e.clientX / game.documentZoom < ui.window.offsetWidth / 2) {
                dialog.style.left = (e.clientX / game.documentZoom + 10) + 'px';
            }
            else {
                dialog.style.left = (e.clientX / game.documentZoom - dialog.offsetWidth - 10) + 'px';
            }
            var idealtop = (e.clientY || 0) / game.documentZoom - dialog.offsetHeight / 2;
            if (typeof idealtop != 'number' || isNaN(idealtop) || idealtop <= 5) {
                idealtop = 5;
            }
            else if (idealtop + dialog.offsetHeight + 10 > ui.window.offsetHeight) {
                idealtop = ui.window.offsetHeight - 10 - dialog.offsetHeight;
            }
            dialog.style.top = idealtop + 'px';
        },
        setHover: function (node, func, hoveration, width) {
            node._hoverfunc = func;
            if (typeof hoveration == 'number') {
                node._hoveration = hoveration;
            }
            if (typeof width == 'number') {
                node._hoverwidth = width;
            }
            node.addEventListener('mouseenter', ui.click.mouseenter);
            node.addEventListener('mouseleave', ui.click.mouseleave);
            node.addEventListener('mousedown', ui.click.mousedown);
            node.addEventListener('mousemove', ui.click.mousemove);
            return node;
        },
        setScroll: function (node) {
            node.ontouchstart = ui.click.touchStart;
            node.ontouchmove = ui.click.touchScroll;
            node.style.WebkitOverflowScrolling = 'touch';
            return node;
        },
        setMousewheel: function (node) {
            if (lib.config.mousewheel)
                node.onmousewheel = ui.click.mousewheel;
        },
        setLongPress: function (node, func) {
            node.addEventListener('touchstart', ui.click.longpressdown);
            node.addEventListener('touchend', ui.click.longpresscancel);
            node._longpresscallback = func;
            return node;
        },
        updateCanvas: function (time) {
            if (lib.canvasUpdates.length === 0) {
                lib.status.canvas = false;
                return false;
            }
            ui.canvas.width = ui.arena.offsetWidth;
            ui.canvas.height = ui.arena.offsetHeight;
            var ctx = ui.ctx;
            ctx.shadowBlur = 5;
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.save();
            for (var i = 0; i < lib.canvasUpdates.length; i++) {
                ctx.restore();
                ctx.save();
                var update = lib.canvasUpdates[i];
                if (!update.starttime) {
                    update.starttime = time;
                }
                if (update(time - update.starttime, ctx) === false) {
                    lib.canvasUpdates.splice(i--, 1);
                }
            }
        },
        run: function (time) {
            lib.status.time = time;
            for (var i = 0; i < lib.updates.length; i++) {
                if (!lib.updates[i].hasOwnProperty('_time')) {
                    lib.updates[i]._time = time;
                }
                if (lib.updates[i](time - lib.updates[i]._time - lib.status.delayed) === false) {
                    lib.updates.splice(i--, 1);
                }
            }
            if (lib.updates.length) {
                lib.status.frameId = requestAnimationFrame(lib.run);
            }
            else {
                lib.status.time = 0;
                lib.status.delayed = 0;
            }
        },
        getUTC: function (date) {
            return date.getTime();
        },
        saveVideo: function () {
            if (_status.videoToSave) {
                game.export(lib.init.encode(JSON.stringify(_status.videoToSave)), '无名杀 - 录像 - ' + _status.videoToSave.name[0] + ' - ' + _status.videoToSave.name[1]);
            }
        },
        init: {
            init: function () {
                if (typeof __dirname === 'string' && __dirname.length) {
                    var dirsplit = __dirname.split('/');
                    for (var i = 0; i < dirsplit.length; i++) {
                        if (dirsplit[i]) {
                            var c = dirsplit[i][0];
                            lib.configprefix += /[A-Z]|[a-z]/.test(c) ? c : '_';
                        }
                    }
                    lib.configprefix += '_';
                }
                if (window.cordovaLoadTimeout) {
                    clearTimeout(window.cordovaLoadTimeout);
                    delete window.cordovaLoadTimeout;
                }
                var links = document.head.querySelectorAll('link');
                for (var i = 0; i < links.length; i++) {
                    if (links[i].href.indexOf('app/color.css') != -1) {
                        links[i].remove();
                        break;
                    }
                }
                var index = window.location.href.indexOf('index.html?server=');
                if (index != -1) {
                    window.isNonameServer = window.location.href.slice(index + 18);
                    window.nodb = true;
                }
                else {
                    index = localStorage.getItem(lib.configprefix + 'asserver');
                    if (index) {
                        window.isNonameServer = index;
                        window.isNonameServerIp = lib.hallURL;
                    }
                }
                var htmlbg = localStorage.getItem(lib.configprefix + 'background');
                if (htmlbg) {
                    if (htmlbg[0] == '[') {
                        try {
                            htmlbg = JSON.parse(htmlbg);
                            htmlbg = htmlbg[get.rand(htmlbg.length)];
                            if (htmlbg.indexOf('custom_') == 0) {
                                throw ('err');
                            }
                            _status.htmlbg = htmlbg;
                        }
                        catch (e) {
                            htmlbg = null;
                        }
                    }
                    if (htmlbg) {
                        if (htmlbg.indexOf('svg_') == 0) {
                            document.documentElement.style.backgroundImage = 'url("' + lib.assetURL + 'image/background/' + htmlbg.slice(4) + '.svg")';
                        }
                        else {
                            document.documentElement.style.backgroundImage = 'url("' + lib.assetURL + 'image/background/' + htmlbg + '.jpg")';
                            document.documentElement.style.backgroundSize = 'cover';
                            document.documentElement.style.backgroundPosition = '50% 50%';
                        }
                    }
                }
                lib.get = get;
                lib.ui = ui;
                lib.ai = ai;
                lib.game = game;
                HTMLDivElement.prototype.animate = function (name, time) {
                    var that;
                    if (get.is.mobileMe(this) && name == 'target') {
                        that = ui.mebg;
                    }
                    else {
                        that = this;
                    }
                    that.classList.add(name);
                    setTimeout(function () {
                        that.classList.remove(name);
                    }, time || 1000);
                    return this;
                };
                HTMLDivElement.prototype.hide = function () {
                    this.classList.add('hidden');
                    return this;
                };
                HTMLDivElement.prototype.unfocus = function () {
                    if (lib.config.transparent_dialog)
                        this.classList.add('transparent');
                    return this;
                };
                HTMLDivElement.prototype.refocus = function () {
                    this.classList.remove('transparent');
                    return this;
                };
                HTMLDivElement.prototype.show = function () {
                    this.classList.remove('hidden');
                    return this;
                };
                HTMLDivElement.prototype.delete = function (time = 500, callback) {
                    if (this.timeout) {
                        clearTimeout(this.timeout);
                        delete this.timeout;
                    }
                    if (!this._listeningEnd || this._transitionEnded) {
                        this.classList.add('removing');
                        var that = this;
                        this.timeout = setTimeout(function () {
                            that.remove();
                            that.classList.remove('removing');
                            if (callback)
                                callback();
                        }, time);
                    }
                    else {
                        this._onEndDelete = true;
                    }
                    return this;
                };
                HTMLDivElement.prototype.goto = function (position, time) {
                    if (this.timeout) {
                        clearTimeout(this.timeout);
                        delete this.timeout;
                    }
                    if (typeof time != 'number')
                        time = 500;
                    this.classList.add('removing');
                    this.timeout = setTimeout(() => {
                        if (!this.destroyed) {
                            position.appendChild(this);
                        }
                        this.classList.remove('removing');
                        delete this.destiny;
                    }, time);
                    this.destiny = position;
                    return this;
                };
                HTMLDivElement.prototype.fix = function () {
                    clearTimeout(this.timeout);
                    delete this.timeout;
                    delete this.destiny;
                    this.classList.remove('removing');
                    return this;
                };
                HTMLDivElement.prototype.setBackground = function (name, type, ext, subfolder) {
                    if (!name)
                        return;
                    var src;
                    if (ext == 'noskin') {
                        ext = '.jpg';
                    }
                    ext = ext || '.jpg';
                    subfolder = subfolder || 'default';
                    if (type) {
                        var dbimage = null, extimage = null, modeimage = null;
                        var nameinfo;
                        var gzbool = false;
                        var mode = get.mode();
                        if (type == 'character') {
                            if (lib.characterPack['mode_' + mode] && lib.characterPack['mode_' + mode][name]) {
                                if (mode == 'guozhan') {
                                    nameinfo = lib.character[name];
                                    if (name.indexOf('gz_shibing') == 0) {
                                        name = name.slice(3, 11);
                                    }
                                    else {
                                        if (lib.config.mode_config.guozhan.guozhanSkin && lib.character[name] && lib.character[name][4].contains('gzskin'))
                                            gzbool = true;
                                        name = name.slice(3);
                                    }
                                }
                                else {
                                    modeimage = mode;
                                }
                            }
                            else if (lib.character[name]) {
                                nameinfo = lib.character[name];
                            }
                            else if (name.indexOf('::') != -1) {
                                name = name.split('::');
                                modeimage = name[0];
                                name = name[1];
                            }
                        }
                        if (!modeimage && nameinfo && nameinfo[4]) {
                            for (var i = 0; i < nameinfo[4].length; i++) {
                                if (nameinfo[4][i].indexOf('ext:') == 0) {
                                    extimage = nameinfo[4][i];
                                    break;
                                }
                                else if (nameinfo[4][i].indexOf('db:') == 0) {
                                    dbimage = nameinfo[4][i];
                                    break;
                                }
                                else if (nameinfo[4][i].indexOf('mode:') == 0) {
                                    modeimage = nameinfo[4][i].slice(5);
                                    break;
                                }
                                else if (nameinfo[4][i].indexOf('character:') == 0) {
                                    name = nameinfo[4][i].slice(10);
                                    break;
                                }
                            }
                        }
                        if (extimage) {
                            src = extimage.replace(/ext:/, 'extension/');
                        }
                        else if (dbimage) {
                            this.setBackgroundDB(dbimage.slice(3));
                            return this;
                        }
                        else if (modeimage) {
                            src = 'image/mode/' + modeimage + '/character/' + name + ext;
                        }
                        else if (type == 'character' && lib.config.skin[name] && arguments[2] != 'noskin') {
                            src = 'image/skin/' + name + '/' + lib.config.skin[name] + ext;
                        }
                        else {
                            if (type == 'character') {
                                src = 'image/character/' + (gzbool ? 'gz_' : '') + name + ext;
                            }
                            else {
                                src = 'image/' + type + '/' + subfolder + '/' + name + ext;
                            }
                        }
                    }
                    else {
                        src = 'image/' + name + ext;
                    }
                    this.setBackgroundImage(src);
                    this.style.backgroundSize = "cover";
                    return this;
                };
                HTMLDivElement.prototype.setBackgroundDB = function (img) {
                    var node = this;
                    game.getDB('image', img, function (src) {
                        node.style.backgroundImage = "url('" + src + "')";
                        node.style.backgroundSize = "cover";
                    });
                };
                HTMLDivElement.prototype.setBackgroundImage = function (img) {
                    this.style.backgroundImage = 'url("' + lib.assetURL + img + '")';
                };
                HTMLDivElement.prototype.listen = function (func) {
                    if (lib.config.touchscreen) {
                        this.addEventListener('touchend', function (e) {
                            if (!_status.dragged) {
                                func.call(this, e);
                            }
                        });
                        var fallback = function (e) {
                            if (!_status.touchconfirmed) {
                                func.call(this, e);
                            }
                            else {
                                this.removeEventListener('click', fallback);
                            }
                        };
                        this.addEventListener('click', fallback);
                    }
                    else {
                        this.addEventListener('click', func);
                    }
                    return this;
                };
                HTMLDivElement.prototype.listenTransition = function (func, time) {
                    var that = this;
                    var done = false;
                    var callback = function () {
                        if (!done) {
                            func.call(that);
                            done = true;
                        }
                    };
                    this.addEventListener('webkitTransitionEnd', callback);
                    return setTimeout(callback, time || 1000);
                };
                HTMLDivElement.prototype.setPosition = function () {
                    var position;
                    if (arguments.length == 4) {
                        position = [];
                        for (var i = 0; i < arguments.length; i++)
                            position.push(arguments[i]);
                    }
                    else if (arguments.length == 1 && Array.isArray(arguments[0]) && arguments[0].length == 4) {
                        position = arguments[0];
                    }
                    else {
                        return this;
                    }
                    var top = 'calc(' + position[0] + '% ';
                    if (position[1] > 0)
                        top += '+ ' + position[1] + 'px)';
                    else
                        top += '- ' + Math.abs(position[1]) + 'px)';
                    var left = 'calc(' + position[2] + '% ';
                    if (position[3] > 0)
                        left += '+ ' + position[3] + 'px)';
                    else
                        left += '- ' + Math.abs(position[3]) + 'px)';
                    this.style.top = top;
                    this.style.left = left;
                    return this;
                };
                HTMLDivElement.prototype.css = function (style) {
                    for (var i in style) {
                        if (i == 'innerHTML') {
                            this.innerHTML = style[i];
                        }
                        else {
                            this.style[i] = style[i];
                        }
                    }
                    return this;
                };
                HTMLTableElement.prototype.get = function (row, col) {
                    if (row < this.childNodes.length) {
                        return this.childNodes[row].childNodes[col];
                    }
                };
                Array.prototype.numOf = function (item) {
                    var num = 0;
                    for (var i = 0; i < this.length; i++) {
                        if (this[i] == item)
                            num++;
                    }
                    return num;
                };
                Array.prototype.filterInD = function (pos) {
                    if (!pos)
                        pos = 'o';
                    var list = [];
                    for (var i = 0; i < this.length; i++) {
                        if (pos.indexOf(get.position(this[i], true)) != -1)
                            list.push(this[i]);
                    }
                    return list;
                };
                Array.prototype.vkflat = function (depth = 1) {
                    const result = [];
                    (function flat(arr, depth) {
                        arr.forEach((item) => {
                            if (Array.isArray(item) && depth > 0) {
                                flat(item, depth - 1);
                            }
                            else {
                                result.push(item);
                            }
                        });
                    })(this, depth);
                    return result;
                };
                Array.prototype.find = function (item) {
                    return this.indexOf(item);
                };
                Array.prototype.contains = function (item) {
                    return this.indexOf(item) != -1;
                };
                Array.prototype.add = function () {
                    for (var i = 0; i < arguments.length; i++) {
                        if (this.contains(arguments[i])) {
                            return false;
                        }
                        this.push(arguments[i]);
                    }
                    return this;
                };
                Array.prototype.addArray = function (arr) {
                    for (var i = 0; i < arr.length; i++) {
                        this.add(arr[i]);
                    }
                    return this;
                };
                Array.prototype.remove = function (item) {
                    if (Array.isArray(item)) {
                        for (var i = 0; i < item.length; i++)
                            this.remove(item[i]);
                        return;
                    }
                    var pos = this.indexOf(item);
                    if (pos == -1) {
                        return false;
                    }
                    this.splice(pos, 1);
                    return this;
                };
                Array.prototype.removeArray = function (arr) {
                    for (var i = 0; i < arr.length; i++) {
                        this.remove(arr[i]);
                    }
                    return this;
                };
                Array.prototype.randomGet = function () {
                    var arr = this.slice(0);
                    for (var i = 0; i < arguments.length; i++)
                        arr.remove(arguments[i]);
                    return arr[Math.floor(Math.random() * arr.length)];
                };
                Array.prototype.randomRemove = function (num) {
                    if (typeof num == 'number') {
                        var list = [];
                        for (var i = 0; i < num; i++) {
                            if (this.length) {
                                list.push(this.randomRemove());
                            }
                            else {
                                break;
                            }
                        }
                        return list;
                    }
                    else {
                        return this.splice(Math.floor(Math.random() * this.length), 1)[0];
                    }
                };
                Array.prototype.randomSort = function () {
                    var list = [];
                    while (this.length) {
                        list.push(this.randomRemove());
                    }
                    for (var i = 0; i < list.length; i++) {
                        this.push(list[i]);
                    }
                    return this;
                };
                Array.prototype.randomGets = function (num) {
                    if (num > this.length) {
                        num = this.length;
                    }
                    var arr = this.slice(0);
                    var list = [];
                    for (var i = 0; i < num; i++) {
                        list.push(arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
                    }
                    return list;
                };
                Array.prototype.sortBySeat = function (target) {
                    lib.tempSortSeat = target;
                    this.sort(lib.sort.seat);
                    delete lib.tempSortSeat;
                    return this;
                };
                if (!Array.from) {
                    Array.from = function (args) {
                        var list = [];
                        if (args && args.length) {
                            for (var i = 0; i < args.length; i++) {
                                list.push(args[i]);
                            }
                        }
                        return list;
                    };
                }
                window.onkeydown = function (e) {
                    if (!ui.menuContainer || !ui.menuContainer.classList.contains('hidden')) {
                        if (e.keyCode == 116 || ((e.ctrlKey || e.metaKey) && e.keyCode == 82)) {
                            if (e.shiftKey) {
                                if (confirm('是否重置游戏？')) {
                                    var noname_inited = localStorage.getItem('noname_inited');
                                    var onlineKey = localStorage.getItem(lib.configprefix + 'key');
                                    localStorage.clear();
                                    if (noname_inited) {
                                        localStorage.setItem('noname_inited', noname_inited);
                                    }
                                    if (onlineKey) {
                                        localStorage.setItem(lib.configprefix + 'key', onlineKey);
                                    }
                                    if (indexedDB)
                                        indexedDB.deleteDatabase(lib.configprefix + 'data');
                                    game.reload();
                                    return;
                                }
                            }
                            else {
                                game.reload();
                            }
                        }
                        else if (e.keyCode == 83 && (e.ctrlKey || e.metaKey)) {
                            if (window.saveNonameInput) {
                                window.saveNonameInput();
                            }
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }
                        else if (e.keyCode == 74 && (e.ctrlKey || e.metaKey) && lib.node) {
                            lib.node.debug();
                        }
                    }
                    else {
                        game.closePopped();
                        var dialogs = document.querySelectorAll('#window>.dialog.popped:not(.static)');
                        for (var i = 0; i < dialogs.length; i++) {
                            dialogs[i].delete();
                        }
                        if (e.keyCode == 32) {
                            var node = ui.window.querySelector('pausedbg');
                            if (node) {
                                node.click();
                            }
                            else {
                                ui.click.pause();
                            }
                        }
                        else if (e.keyCode == 65) {
                            if (ui.auto)
                                ui.auto.click();
                        }
                        else if (e.keyCode == 87) {
                            if (ui.wuxie && ui.wuxie.style.display != 'none') {
                                ui.wuxie.classList.toggle('glow');
                            }
                            else if (ui.tempnowuxie) {
                                ui.tempnowuxie.classList.toggle('glow');
                            }
                        }
                        else if (e.keyCode == 116 || ((e.ctrlKey || e.metaKey) && e.keyCode == 82)) {
                            if (e.shiftKey) {
                                if (confirm('是否重置游戏？')) {
                                    var noname_inited = localStorage.getItem('noname_inited');
                                    var onlineKey = localStorage.getItem(lib.configprefix + 'key');
                                    localStorage.clear();
                                    if (noname_inited) {
                                        localStorage.setItem('noname_inited', noname_inited);
                                    }
                                    if (onlineKey) {
                                        localStorage.setItem(lib.configprefix + 'key', onlineKey);
                                    }
                                    if (indexedDB)
                                        indexedDB.deleteDatabase(lib.configprefix + 'data');
                                    game.reload();
                                    return;
                                }
                            }
                            else {
                                game.reload();
                            }
                        }
                        else if (e.keyCode == 83 && (e.ctrlKey || e.metaKey)) {
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }
                        else if (e.keyCode == 74 && (e.ctrlKey || e.metaKey) && lib.node) {
                            lib.node.debug();
                        }
                    }
                };
                window.onload = function () {
                    if (lib.device) {
                        var script = document.createElement('script');
                        script.src = 'cordova.js';
                        document.body.appendChild(script);
                        document.addEventListener('deviceready', function () {
                            if (lib.init.cordovaReady) {
                                lib.init.cordovaReady();
                                delete lib.init.cordovaReady;
                            }
                        });
                    }
                    if (_status.packLoaded) {
                        delete _status.packLoaded;
                        lib.init.onload();
                    }
                    else {
                        _status.windowLoaded = true;
                    }
                };
                if (document.readyState === 'complete') {
                    window.onload();
                }
                window.onerror = function (msg, src, line, column, err) {
                    var str = msg;
                    if (window._status && _status.event) {
                        var evt = _status.event;
                        str += ('\n' + evt.name + ': ' + evt.step);
                        if (evt.parent)
                            str += '\n' + evt.parent.name + ': ' + evt.parent.step;
                        if (evt.parent && evt.parent.parent)
                            str += '\n' + evt.parent.parent.name + ': ' + evt.parent.parent.step;
                        if (evt.player || evt.target || evt.source || evt.skill || evt.card) {
                            str += '\n-------------';
                        }
                        if (evt.player) {
                            str += '\nplayer: ' + evt.player.name;
                        }
                        if (evt.target) {
                            str += '\ntarget: ' + evt.target.name;
                        }
                        if (evt.source) {
                            str += '\nsource: ' + evt.source.name;
                        }
                        if (evt.skill) {
                            str += '\nskill: ' + evt.skill.name;
                        }
                        if (evt.card) {
                            str += '\ncard: ' + evt.card.name;
                        }
                    }
                    str += '\n-------------';
                    str += '\n' + line;
                    str += '\n' + column;
                    if (err && err.stack)
                        str += '\n' + err.stack;
                    alert(str);
                    window.ea = Array.from(arguments);
                    window.em = msg;
                    window.el = line;
                    window.ec = column;
                    window.eo = err;
                    game.print(msg);
                    game.print(line);
                    game.print(column);
                    game.print(err.stack);
                    if (!lib.config.errstop) {
                        _status.withError = true;
                        game.loop();
                    }
                };
                lib.init.js(lib.assetURL + 'game/data', ['translation', 'grouplist', 'card', 'emotionList', 'menu'], function () {
                    let list = ['translate', 'group', 'groupnature', 'card'];
                    for (let i of list) {
                        let v = 'data_' + i;
                        if (window[v]) {
                            if (lib[i] instanceof Array)
                                lib[i] = [...lib[i], ...window[v]];
                            else if (lib[i] instanceof Object)
                                lib[i] = { ...lib[i], ...window[v] };
                            else
                                lib[i] = window[v];
                            delete window[v];
                        }
                    }
                });
                lib.init.js(lib.assetURL + 'game/methods', ['filter', 'sort'], function () {
                    let list = ['filter', 'sort'];
                    for (let i of list) {
                        let v = 'methods_' + i;
                        if (window[v]) {
                            if (lib[i] instanceof Array)
                                lib[i] = [...lib[i], ...window[v]];
                            else if (lib[i] instanceof Object)
                                lib[i] = { ...lib[i], ...window[v] };
                            else
                                lib[i] = window[v];
                            delete window[v];
                        }
                    }
                });
                if (window.noname_update) {
                    lib.version = window.noname_update.version;
                    lib.changeLog = window.noname_update.changeLog;
                    if (window.noname_update.players) {
                        lib.changeLog.push('players://' + JSON.stringify(window.noname_update.players));
                    }
                    if (window.noname_update.cards) {
                        lib.changeLog.push('cards://' + JSON.stringify(window.noname_update.cards));
                    }
                    delete window.noname_update;
                }
                var noname_inited = localStorage.getItem('noname_inited');
                if (noname_inited && noname_inited !== 'nodejs') {
                    var ua = navigator.userAgent.toLowerCase();
                    if (ua.indexOf('android') != -1) {
                        lib.device = 'android';
                    }
                    else if (ua.indexOf('iphone') != -1 || ua.indexOf('ipad') != -1) {
                        lib.device = 'ios';
                    }
                    lib.assetURL = noname_inited;
                }
                var config3 = null;
                var proceed = function (config2) {
                    if (config3 === null) {
                        config3 = config2;
                        return;
                    }
                    if (config2.mode)
                        lib.config.mode = config2.mode;
                    if (lib.config.mode_config[lib.config.mode] == undefined)
                        lib.config.mode_config[lib.config.mode] = {};
                    for (let i in lib.config.mode_config.global) {
                        if (lib.config.mode_config[lib.config.mode][i] == undefined) {
                            lib.config.mode_config[lib.config.mode][i] = lib.config.mode_config.global[i];
                        }
                    }
                    if (lib.config.characters) {
                        lib.config.defaultcharacters = lib.config.characters.slice(0);
                    }
                    if (lib.config.cards) {
                        lib.config.defaultcards = lib.config.cards.slice(0);
                    }
                    for (let i in config2) {
                        if (i.indexOf('_mode_config') != -1) {
                            let thismode = i.substr(i.indexOf('_mode_config') + 13);
                            if (!lib.config.mode_config[thismode]) {
                                lib.config.mode_config[thismode] = {};
                            }
                            lib.config.mode_config[thismode][i.substr(0, i.indexOf('_mode_config'))] = config2[i];
                        }
                        else {
                            lib.config[i] = config2[i];
                        }
                    }
                    for (let i in lib.config.translate) {
                        lib.translate[i] = lib.config.translate[i];
                    }
                    lib.config.all.characters = [];
                    lib.config.all.cards = [];
                    lib.config.all.plays = [];
                    lib.config.all.mode = [];
                    if (lib.config.debug) {
                        lib.init.js(lib.assetURL + 'game', 'asset', function () {
                            lib.skin = window.vk_skin_list;
                            delete window.vk_skin_list;
                            delete window.vk_asset_list;
                        });
                    }
                    if (window.isNonameServer) {
                        lib.config.mode = 'connect';
                    }
                    var pack = window.noname_package;
                    delete window.noname_package;
                    for (let i in pack.character) {
                        if (lib.config.hiddenCharacterPack.indexOf(i) == -1) {
                            lib.config.all.characters.push(i);
                            lib.translate[i + '_character_config'] = pack.character[i];
                        }
                    }
                    for (let i in pack.card) {
                        if (lib.config.hiddenCardPack.indexOf(i) == -1) {
                            lib.config.all.cards.push(i);
                            lib.translate[i + '_card_config'] = pack.card[i];
                        }
                    }
                    for (let i in pack.play) {
                        lib.config.all.plays.push(i);
                        lib.translate[i + '_play_config'] = pack.play[i];
                    }
                    for (let i in pack.submode) {
                        for (var j in pack.submode[i]) {
                            lib.translate[i + '|' + j] = pack.submode[i][j];
                        }
                    }
                    if (!lib.config.gameRecord) {
                        lib.config.gameRecord = {};
                    }
                    for (let i in pack.mode) {
                        if (lib.config.hiddenModePack.indexOf(i) == -1) {
                            lib.config.all.mode.push(i);
                            lib.translate[i] = pack.mode[i];
                            if (!lib.config.gameRecord[i]) {
                                lib.config.gameRecord[i] = { data: {} };
                            }
                        }
                    }
                    if (lib.config.all.mode.length == 0) {
                        lib.config.all.mode.push('identity');
                        lib.translate.identity = '身份';
                        if (!lib.config.gameRecord.identity) {
                            lib.config.gameRecord.identity = { data: {} };
                        }
                    }
                    if (pack.background) {
                        for (let i in pack.background) {
                            if (lib.config.hiddenBackgroundPack.contains(i))
                                continue;
                            lib.configMenu.appearence.config.image_background.item[i] = pack.background[i];
                        }
                        for (let i = 0; i < lib.config.customBackgroundPack.length; i++) {
                            let link = lib.config.customBackgroundPack[i];
                            lib.configMenu.appearence.config.image_background.item[link] = link.slice(link.indexOf('_') + 1);
                        }
                        lib.configMenu.appearence.config.image_background.item.default = '默认';
                    }
                    if (pack.music) {
                        if (lib.device || typeof window.require == 'function') {
                            lib.configMenu.audio.config.background_music.item.music_custom = '自定义音乐';
                        }
                        lib.config.all.background_music = ['music_diaochan'];
                        for (let i in pack.music) {
                            lib.config.all.background_music.push(i);
                            lib.configMenu.audio.config.background_music.item[i] = pack.music[i];
                        }
                        if (lib.config.customBackgroundMusic) {
                            for (let i in lib.config.customBackgroundMusic) {
                                lib.config.all.background_music.push(i);
                                lib.configMenu.audio.config.background_music.item[i] = lib.config.customBackgroundMusic[i];
                            }
                        }
                        lib.configMenu.audio.config.background_music.item.music_random = '随机播放';
                        lib.configMenu.audio.config.background_music.item.music_off = '关闭';
                    }
                    if (pack.theme) {
                        for (let i in pack.theme) {
                            lib.configMenu.appearence.config.theme.item[i] = pack.theme[i];
                        }
                    }
                    if (lib.config.extension_sources) {
                        for (let i in lib.config.extension_sources) {
                            lib.configMenu.general.config.extension_source.item[i] = i;
                        }
                    }
                    if (pack.font) {
                        ui.css.fontsheet = lib.init.sheet();
                        for (let i in pack.font) {
                            lib.configMenu.appearence.config.name_font.item[i] = pack.font[i];
                            lib.configMenu.appearence.config.identity_font.item[i] = pack.font[i];
                            lib.configMenu.appearence.config.cardtext_font.item[i] = pack.font[i];
                            lib.configMenu.appearence.config.global_font.item[i] = pack.font[i];
                            ui.css.fontsheet.sheet.insertRule("@font-face {font-family: '" + i + "';src: url('" + lib.assetURL + "font/" + i + ".ttf');}", 0);
                        }
                        lib.configMenu.appearence.config.cardtext_font.item.default = '默认';
                        lib.configMenu.appearence.config.global_font.item.default = '默认';
                    }
                    var ua = navigator.userAgent.toLowerCase();
                    if ('ontouchstart' in document) {
                        if (!lib.config.totouched) {
                            game.saveConfig('totouched', true);
                            if (lib.device) {
                                game.saveConfig('low_performance', true);
                                game.saveConfig('confirm_exit', true);
                                game.saveConfig('touchscreen', true);
                                game.saveConfig('fold_mode', false);
                                if (ua.indexOf('ipad') == -1) {
                                    game.saveConfig('phonelayout', true);
                                }
                                else if (lib.device == 'ios') {
                                    game.saveConfig('show_statusbar_ios', 'overlay');
                                }
                            }
                            else if (confirm('是否切换到触屏模式？（触屏模式可提高触屏设备的响应速度，但无法使用鼠标）')) {
                                game.saveConfig('touchscreen', true);
                                if (ua.indexOf('iphone') != -1 || ua.indexOf('android') != -1) {
                                    game.saveConfig('phonelayout', true);
                                }
                                game.reload();
                            }
                        }
                    }
                    else if (lib.config.touchscreen) {
                        game.saveConfig('touchscreen', false);
                    }
                    if (!lib.config.toscrolled && ua.indexOf('macintosh') != -1) {
                        game.saveConfig('toscrolled', true);
                        game.saveConfig('mousewheel', false);
                    }
                    var show_splash = lib.config.show_splash;
                    if (show_splash == 'off') {
                        show_splash = false;
                    }
                    else if (show_splash == 'init') {
                        if (localStorage.getItem('show_splash_off')) {
                            show_splash = false;
                        }
                    }
                    localStorage.removeItem('show_splash_off');
                    var extensionlist = [];
                    if (!localStorage.getItem(lib.configprefix + 'disable_extension')) {
                        if (lib.config.extensions && lib.config.extensions.length) {
                            window.resetExtension = function () {
                                for (var i = 0; i < lib.config.extensions.length; i++) {
                                    game.saveConfig('extension_' + lib.config.extensions[i] + '_enable', false);
                                }
                                localStorage.setItem(lib.configprefix + 'disable_extension', true);
                            };
                        }
                        for (let i = 0; i < lib.config.plays.length; i++) {
                            if (lib.config.all.plays.indexOf(lib.config.plays[i]) != -1) {
                                extensionlist.push(lib.config.plays[i]);
                            }
                        }
                        for (let i = 0; i < lib.config.extensions.length; i++) {
                            let extcontent = localStorage.getItem(lib.configprefix + 'extension_' + lib.config.extensions[i]);
                            if (extcontent) {
                                _status.evaluatingExtension = true;
                                try {
                                    eval(extcontent);
                                }
                                catch (e) {
                                    console.log(e);
                                }
                                _status.evaluatingExtension = false;
                            }
                            else if (lib.config.mode != 'connect' || (!localStorage.getItem(lib.configprefix + 'directstart') && show_splash)) {
                                extensionlist.push(lib.config.extensions[i]);
                            }
                        }
                    }
                    else {
                        if (lib.config.mode != 'connect' || (!localStorage.getItem(lib.configprefix + 'directstart') && show_splash)) {
                            for (let i = 0; i < lib.config.extensions.length; i++) {
                                game.import('extension', { name: lib.config.extensions[i] });
                            }
                        }
                    }
                    var loadPack = function () {
                        var toLoad = lib.config.all.cards.length + lib.config.all.characters.length + 1;
                        var packLoaded = function () {
                            toLoad--;
                            if (toLoad == 0) {
                                if (_status.windowLoaded) {
                                    delete _status.windowLoaded;
                                    lib.init.onload();
                                }
                                else {
                                    _status.packLoaded = true;
                                }
                            }
                        };
                        if (localStorage.getItem(lib.configprefix + 'playback')) {
                            toLoad++;
                            lib.init.js(lib.assetURL + 'mode', lib.config.mode, packLoaded, packLoaded);
                        }
                        else if ((localStorage.getItem(lib.configprefix + 'directstart') || !show_splash) &&
                            lib.config.all.mode.indexOf(lib.config.mode) != -1) {
                            toLoad++;
                            lib.init.js(lib.assetURL + 'mode', lib.config.mode, packLoaded, packLoaded);
                        }
                        lib.init.js(lib.assetURL + 'card', lib.config.all.cards, packLoaded, packLoaded);
                        lib.init.js(lib.assetURL + 'character', lib.config.all.characters, packLoaded, packLoaded);
                        lib.init.js(lib.assetURL + 'character', 'rank', packLoaded, packLoaded);
                    };
                    var layout = lib.config.layout;
                    if (lib.layoutfixed.indexOf(lib.config.mode) !== -1) {
                        layout = 'mobile';
                    }
                    if (layout == 'phone') {
                        layout = 'mobile';
                        game.saveConfig('layout', 'mobile');
                        game.saveConfig('phonelayout', true);
                    }
                    game.layout = layout;
                    if (lib.config.image_background_random) {
                        if (_status.htmlbg) {
                            game.saveConfig('image_background', _status.htmlbg);
                        }
                        else {
                            var list = [];
                            for (var i in lib.configMenu.appearence.config.image_background.item) {
                                if (i == 'default')
                                    continue;
                                list.push(i);
                            }
                            game.saveConfig('image_background', list.randomGet(lib.config.image_background));
                        }
                        lib.init.background();
                    }
                    delete _status.htmlbg;
                    var styleToLoad = 6;
                    var styleLoaded = function () {
                        styleToLoad--;
                        if (styleToLoad == 0) {
                            if (extensionlist.length && (lib.config.mode != 'connect' || show_splash)) {
                                var extToLoad = extensionlist.length;
                                var extLoaded = function () {
                                    extToLoad--;
                                    if (extToLoad == 0) {
                                        loadPack();
                                    }
                                };
                                for (var i = 0; i < extensionlist.length; i++) {
                                    lib.init.js(lib.assetURL + 'extension/' + extensionlist[i], 'extension', extLoaded, (function (i) {
                                        return function () {
                                            game.removeExtension(i);
                                            extToLoad--;
                                            if (extToLoad == 0) {
                                                loadPack();
                                            }
                                        };
                                    }(extensionlist[i])));
                                }
                            }
                            else {
                                loadPack();
                            }
                        }
                    };
                    if (lib.config.layout != 'default') {
                        ui.css.layout = lib.init.css(lib.assetURL + 'layout/' + layout, 'layout', styleLoaded);
                    }
                    else {
                        ui.css.layout = lib.init.css();
                        styleToLoad--;
                    }
                    if (get.is.phoneLayout()) {
                        ui.css.phone = lib.init.css(lib.assetURL + 'layout/default', 'phone', styleLoaded);
                    }
                    else {
                        ui.css.phone = lib.init.css();
                        styleToLoad--;
                    }
                    ui.css.theme = lib.init.css(lib.assetURL + 'theme/' + lib.config.theme, 'style', styleLoaded);
                    ui.css.card_style = lib.init.css(lib.assetURL + 'theme/style/card', lib.config.card_style, styleLoaded);
                    ui.css.cardback_style = lib.init.css(lib.assetURL + 'theme/style/cardback', lib.config.cardback_style, styleLoaded);
                    ui.css.hp_style = lib.init.css(lib.assetURL + 'theme/style/hp', lib.config.hp_style, styleLoaded);
                    if (lib.config.player_style && lib.config.player_style != 'default' && lib.config.player_style != 'custom') {
                        var str = '';
                        switch (lib.config.player_style) {
                            case 'wood':
                                str = 'url("' + lib.assetURL + 'theme/woodden/wood.jpg")';
                                break;
                            case 'music':
                                str = 'linear-gradient(#4b4b4b, #464646)';
                                break;
                            case 'simple':
                                str = 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4))';
                                break;
                        }
                        ui.css.player_stylesheet = lib.init.sheet('#window .player{background-image:' + str + '}');
                    }
                    if (lib.config.border_style && lib.config.border_style != 'default' && lib.config.border_style != 'custom' && lib.config.border_style != 'auto') {
                        ui.css.border_stylesheet = lib.init.sheet();
                        var bstyle = lib.config.border_style;
                        if (bstyle.indexOf('dragon_') == 0) {
                            bstyle = bstyle.slice(7);
                        }
                        ui.css.border_stylesheet.sheet.insertRule('#window .player>.framebg,#window #arena.long.mobile:not(.fewplayer) .player[data-position="0"]>.framebg{display:block;background-image:url("' + lib.assetURL + 'theme/style/player/' + bstyle + '1.png")}', 0);
                        ui.css.border_stylesheet.sheet.insertRule('#window #arena.long:not(.fewplayer) .player>.framebg, #arena.oldlayout .player>.framebg{background-image:url("' + lib.assetURL + 'theme/style/player/' + bstyle + '3.png")}', 0);
                        ui.css.border_stylesheet.sheet.insertRule('.player>.count{z-index: 3 !important;border-radius: 2px !important;text-align: center !important;}', 0);
                    }
                    if (lib.config.control_style && lib.config.control_style != 'default' && lib.config.control_style != 'custom') {
                        var str = '';
                        switch (lib.config.control_style) {
                            case 'wood':
                                str = 'url("' + lib.assetURL + 'theme/woodden/wood.jpg")';
                                break;
                            case 'music':
                                str = 'linear-gradient(#4b4b4b, #464646);color:white;text-shadow:black 0 0 2px';
                                break;
                            case 'simple':
                                str = 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4));color:white;text-shadow:black 0 0 2px';
                                break;
                        }
                        if (lib.config.control_style == 'wood') {
                            ui.css.control_stylesheet = lib.init.sheet('#window .control,#window .menubutton,#window #system>div>div,#window #system>div>.pressdown2{background-image:' + str + '}');
                        }
                        else {
                            ui.css.control_stylesheet = lib.init.sheet('#window .control,.menubutton:not(.active):not(.highlight):not(.red):not(.blue),#window #system>div>div{background-image:' + str + '}');
                        }
                    }
                    if (lib.config.menu_style && lib.config.menu_style != 'default' && lib.config.menu_style != 'custom') {
                        var str = '';
                        switch (lib.config.menu_style) {
                            case 'wood':
                                str = 'url("' + lib.assetURL + 'theme/woodden/wood2.png")';
                                break;
                            case 'music':
                                str = 'linear-gradient(#4b4b4b, #464646);color:white;text-shadow:black 0 0 2px';
                                break;
                            case 'simple':
                                str = 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4));color:white;text-shadow:black 0 0 2px';
                                break;
                        }
                        ui.css.menu_stylesheet = lib.init.sheet('html #window>.dialog.popped,html .menu,html .menubg{background-image:' + str + '}');
                    }
                    lib.config.duration = 500;
                    if (!lib.config.touchscreen) {
                        document.addEventListener('mousewheel', ui.click.windowmousewheel, { passive: true });
                        document.addEventListener('mousemove', ui.click.windowmousemove);
                        document.addEventListener('mousedown', ui.click.windowmousedown);
                        document.addEventListener('mouseup', ui.click.windowmouseup);
                        document.addEventListener('contextmenu', ui.click.right);
                    }
                    else {
                        document.addEventListener('touchstart', ui.click.touchconfirm);
                        document.addEventListener('touchstart', ui.click.windowtouchstart);
                        document.addEventListener('touchend', ui.click.windowtouchend);
                        document.addEventListener('touchmove', ui.click.windowtouchmove);
                    }
                };
                var proceed2 = function () {
                    if (config3) {
                        proceed(config3);
                    }
                    else {
                        config3 = true;
                    }
                };
                ui.css = {
                    menu: lib.init.css(lib.assetURL + 'layout/default', 'menu', function () {
                        ui.css.default = lib.init.css(lib.assetURL + 'layout/default', 'layout');
                        proceed2();
                    })
                };
                if (lib.device) {
                    lib.init.cordovaReady = function () {
                        if (lib.device == 'android') {
                            document.addEventListener("pause", function () {
                                if (!_status.paused2 && (typeof _status.event.isMine == 'function' && !_status.event.isMine())) {
                                    ui.click.pause();
                                }
                                if (ui.backgroundMusic) {
                                    ui.backgroundMusic.pause();
                                }
                            });
                            document.addEventListener("resume", function () {
                                if (ui.backgroundMusic) {
                                    ui.backgroundMusic.play();
                                }
                            });
                            document.addEventListener("backbutton", function () {
                                if (ui.arena && ui.arena.classList.contains('menupaused')) {
                                    if (window.saveNonameInput) {
                                        window.saveNonameInput();
                                    }
                                    else {
                                        ui.click.configMenu();
                                    }
                                }
                                else if (lib.config.confirm_exit) {
                                    navigator.notification.confirm('是否退出游戏？', function (index) {
                                        switch (index) {
                                            case 2:
                                                game.saveConfig('null');
                                                game.reload();
                                                break;
                                            case 3:
                                                navigator.app.exitApp();
                                                break;
                                        }
                                    }, '确认退出', ['取消', '重新开始', '退出']);
                                }
                                else {
                                    navigator.app.exitApp();
                                }
                            });
                        }
                        game.download = function (url, folder, onsuccess, onerror, dev, onprogress) {
                            if (url.indexOf('http') != 0) {
                                url = get.url(dev) + url;
                            }
                            var fileTransfer = new FileTransfer();
                            folder = lib.assetURL + folder;
                            if (onprogress) {
                                fileTransfer.onprogress = function (progressEvent) {
                                    onprogress(progressEvent.loaded, progressEvent.total);
                                };
                            }
                            lib.config.brokenFile.add(folder);
                            game.saveConfigValue('brokenFile');
                            fileTransfer.download(encodeURI(url), encodeURI(folder), function () {
                                lib.config.brokenFile.remove(folder);
                                game.saveConfigValue('brokenFile');
                                if (onsuccess) {
                                    onsuccess();
                                }
                            }, onerror);
                        };
                        game.readFile = function (filename, callback, onerror) {
                            window.resolveLocalFileSystemURL(lib.assetURL, function (entry) {
                                entry.getFile(filename, {}, function (fileEntry) {
                                    fileEntry.file(function (fileToLoad) {
                                        var fileReader = new FileReader();
                                        fileReader.onload = function (e) {
                                            callback(e.target.result);
                                        };
                                        fileReader.readAsArrayBuffer(fileToLoad, "UTF-8");
                                    }, onerror);
                                }, onerror);
                            }, onerror);
                        };
                        game.writeFile = function (data, path, name, callback) {
                            game.ensureDirectory(path, function () { });
                            if (Object.prototype.toString.call(data) == '[object File]') {
                                var fileReader = new FileReader();
                                fileReader.onload = function (e) {
                                    game.writeFile(e.target.result, path, name, callback);
                                };
                                fileReader.readAsArrayBuffer(data, "UTF-8");
                            }
                            else {
                                window.resolveLocalFileSystemURL(lib.assetURL + path, function (entry) {
                                    entry.getFile(name, { create: true }, function (fileEntry) {
                                        fileEntry.createWriter(function (fileWriter) {
                                            fileWriter.onwriteend = callback;
                                            fileWriter.write(data);
                                        });
                                    });
                                });
                            }
                        };
                        game.removeFile = function (dir, callback) {
                            window.resolveLocalFileSystemURL(lib.assetURL, function (entry) {
                                entry.getFile(dir, {}, function (fileEntry) {
                                    fileEntry.remove();
                                    if (callback) {
                                        callback();
                                    }
                                });
                            });
                        };
                        game.getFileList = function (dir, callback) {
                            var files = [], folders = [];
                            window.resolveLocalFileSystemURL(lib.assetURL + dir, function (entry) {
                                var dirReader = entry.createReader();
                                var entries = [];
                                var readEntries = function () {
                                    dirReader.readEntries(function (results) {
                                        if (!results.length) {
                                            entries.sort();
                                            for (var i = 0; i < entries.length; i++) {
                                                if (entries[i].isDirectory) {
                                                    folders.push(entries[i].name);
                                                }
                                                else {
                                                    files.push(entries[i].name);
                                                }
                                            }
                                            callback(folders, files);
                                        }
                                        else {
                                            entries = entries.concat(Array.from(results));
                                            readEntries();
                                        }
                                    });
                                };
                                readEntries();
                            });
                        };
                        game.ensureDirectory = function (list, callback, file) {
                            var directorylist;
                            var num = 0;
                            if (file) {
                                num = 1;
                            }
                            if (typeof list == 'string') {
                                directorylist = [list];
                            }
                            else {
                                var directorylist = list.slice(0);
                            }
                            window.resolveLocalFileSystemURL(lib.assetURL, function (rootEntry) {
                                var access = function (entry, dir, callback) {
                                    if (dir.length <= num) {
                                        callback();
                                    }
                                    else {
                                        var str = dir.shift();
                                        entry.getDirectory(str, { create: false }, function (entry) {
                                            access(entry, dir, callback);
                                        }, function () {
                                            entry.getDirectory(str, { create: true }, function (entry) {
                                                access(entry, dir, callback);
                                            });
                                        });
                                    }
                                };
                                var createDirectory = function () {
                                    if (directorylist.length) {
                                        access(rootEntry, directorylist.shift().split('/'), createDirectory);
                                    }
                                    else {
                                        callback();
                                    }
                                };
                                createDirectory();
                            });
                        };
                        if (ui.updateUpdate) {
                            ui.updateUpdate();
                        }
                        var showbar = function () {
                            if (window.StatusBar) {
                                if (lib.device == 'android') {
                                    if (lib.config.show_statusbar_android) {
                                        window.StatusBar.overlaysWebView(false);
                                        window.StatusBar.backgroundColorByName('black');
                                        window.StatusBar.show();
                                    }
                                }
                                else if (lib.device == 'ios') {
                                    if (lib.config.show_statusbar_ios != 'off' && lib.config.show_statusbar_ios != 'auto') {
                                        if (lib.config.show_statusbar_ios == 'default') {
                                            window.StatusBar.overlaysWebView(false);
                                        }
                                        else {
                                            window.StatusBar.overlaysWebView(true);
                                        }
                                        window.StatusBar.backgroundColorByName('black');
                                        window.StatusBar.show();
                                    }
                                }
                            }
                        };
                        if (lib.arenaReady) {
                            lib.arenaReady.push(showbar);
                        }
                        else {
                            showbar();
                        }
                    };
                }
                else if (localStorage.getItem('noname_inited') === 'nodejs') {
                    lib.node = {
                        fs: require('fs'),
                        debug: function () {
                            require('electron').remote.getCurrentWindow().toggleDevTools();
                        }
                    };
                    game.download = function (url, folder, onsuccess, onerror, dev, onprogress) {
                        if (url.indexOf('http') != 0) {
                            url = get.url(dev) + url;
                        }
                        game.ensureDirectory(folder, function () {
                            try {
                                var file = lib.node.fs.createWriteStream(__dirname + '/' + folder);
                            }
                            catch (e) {
                                onerror();
                            }
                            lib.config.brokenFile.add(folder);
                            game.saveConfigValue('brokenFile');
                            if (!lib.node.http)
                                lib.node.http = require('http');
                            if (!lib.node.https)
                                lib.node.https = require('https');
                            var opts = require('url').parse(encodeURI(url));
                            opts.headers = { 'User-Agent': 'AppleWebkit' };
                            var request = (url.indexOf('https') == 0 ? lib.node.https : lib.node.http).get(opts, function (response) {
                                var stream = response.pipe(file);
                                stream.on('finish', function () {
                                    lib.config.brokenFile.remove(folder);
                                    game.saveConfigValue('brokenFile');
                                    if (onsuccess) {
                                        onsuccess();
                                    }
                                });
                                stream.on('error', onerror);
                                if (onprogress) {
                                    var streamInterval = setInterval(function () {
                                        if (stream.closed) {
                                            clearInterval(streamInterval);
                                        }
                                        else {
                                            onprogress(stream.bytesWritten);
                                        }
                                    }, 200);
                                }
                            });
                        }, true);
                    };
                    game.readFile = function (filename, callback, onerror) {
                        lib.node.fs.readFile(__dirname + '/' + filename, function (err, data) {
                            if (err) {
                                onerror(err);
                            }
                            else {
                                callback(data);
                            }
                        });
                    };
                    game.writeFile = function (data, path, name, callback) {
                        game.ensureDirectory(path, function () { });
                        if (Object.prototype.toString.call(data) == '[object File]') {
                            var fileReader = new FileReader();
                            fileReader.onload = function (e) {
                                game.writeFile(e.target.result, path, name, callback);
                            };
                            fileReader.readAsArrayBuffer(data, "UTF-8");
                        }
                        else {
                            get.zip(function (zip) {
                                zip.file('i', data);
                                lib.node.fs.writeFile(__dirname + '/' + path + '/' + name, zip.files.i.asNodeBuffer(), null, callback);
                            });
                        }
                    };
                    game.removeFile = function (filename, callback) {
                        lib.node.fs.unlink(__dirname + '/' + filename, callback || function () { });
                    };
                    game.getFileList = function (dir, callback) {
                        var files = [], folders = [];
                        dir = __dirname + '/' + dir;
                        lib.node.fs.readdir(dir, function (err, filelist) {
                            for (var i = 0; i < filelist.length; i++) {
                                if (filelist[i][0] != '.' && filelist[i][0] != '_') {
                                    if (lib.node.fs.statSync(dir + '/' + filelist[i]).isDirectory()) {
                                        folders.push(filelist[i]);
                                    }
                                    else {
                                        files.push(filelist[i]);
                                    }
                                }
                            }
                            callback(folders, files);
                        });
                    };
                    game.ensureDirectory = function (list, callback, file) {
                        var directorylist;
                        var num = 0;
                        if (file) {
                            num = 1;
                        }
                        if (typeof list == 'string') {
                            directorylist = [list];
                        }
                        else {
                            var directorylist = list.slice(0);
                        }
                        var access = function (str, dir, callback) {
                            if (dir.length <= num) {
                                callback();
                            }
                            else {
                                str += '/' + dir.shift();
                                lib.node.fs.access(__dirname + str, function (e) {
                                    if (e) {
                                        try {
                                            lib.node.fs.mkdir(__dirname + str, function () {
                                                access(str, dir, callback);
                                            });
                                        }
                                        catch (e) {
                                            console.log(e);
                                        }
                                    }
                                    else {
                                        access(str, dir, callback);
                                    }
                                });
                            }
                        };
                        var createDirectory = function () {
                            if (directorylist.length) {
                                access('', directorylist.shift().split('/'), createDirectory);
                            }
                            else {
                                callback();
                            }
                        };
                        createDirectory();
                    };
                    if (ui.updateUpdate) {
                        ui.updateUpdate();
                    }
                }
                else {
                    window.onbeforeunload = function () {
                        if (lib.config.confirm_exit && !_status.reloading) {
                            return '是否离开游戏？';
                        }
                        else {
                            return null;
                        }
                    };
                }
                lib.config = window.config;
                lib.configOL = {};
                delete window.config;
                var config2;
                if (localStorage.getItem(lib.configprefix + 'nodb')) {
                    window.nodb = true;
                }
                if (window.indexedDB && !window.nodb) {
                    var request = window.indexedDB.open(lib.configprefix + 'data', 4);
                    request.onupgradeneeded = function (e) {
                        var db = e.target.result;
                        if (!db.objectStoreNames.contains('video')) {
                            db.createObjectStore('video', { keyPath: 'time' });
                        }
                        if (!db.objectStoreNames.contains('image')) {
                            db.createObjectStore('image');
                        }
                        if (!db.objectStoreNames.contains('audio')) {
                            db.createObjectStore('audio');
                        }
                        if (!db.objectStoreNames.contains('config')) {
                            db.createObjectStore('config');
                        }
                        if (!db.objectStoreNames.contains('data')) {
                            db.createObjectStore('data');
                        }
                    };
                    request.onsuccess = function (e) {
                        lib.db = e.target.result;
                        game.getDB('config', null, function (obj) {
                            if (!obj.storageImported) {
                                try {
                                    config2 = JSON.parse(localStorage.getItem(lib.configprefix + 'config'));
                                    if (!config2 || typeof config2 != 'object')
                                        throw 'err';
                                }
                                catch (err) {
                                    config2 = {};
                                }
                                for (var i in config2) {
                                    game.saveConfig(i, config2[i]);
                                }
                                for (var i in lib.mode) {
                                    try {
                                        config2 = JSON.parse(localStorage.getItem(lib.configprefix + i));
                                        if (!config2 || typeof config2 != 'object' || get.is.empty(config2))
                                            throw 'err';
                                    }
                                    catch (err) {
                                        config2 = false;
                                    }
                                    localStorage.removeItem(lib.configprefix + i);
                                    if (config2) {
                                        game.putDB('data', i, config2);
                                    }
                                }
                                game.saveConfig('storageImported', true);
                                lib.init.background();
                                localStorage.removeItem(lib.configprefix + 'config');
                            }
                            else {
                                config2 = obj;
                            }
                            proceed(config2);
                        });
                    };
                }
                else {
                    try {
                        config2 = JSON.parse(localStorage.getItem(lib.configprefix + 'config'));
                        if (!config2 || typeof config2 != 'object')
                            throw 'err';
                    }
                    catch (err) {
                        config2 = {};
                        localStorage.setItem(lib.configprefix + 'config', JSON.stringify({}));
                    }
                    proceed(config2);
                }
            },
            reset: function () {
                if (window.inSplash)
                    return;
                if (window.resetExtension) {
                    if (confirm('游戏似乎未正常载入，是否禁用扩展并重新打开？')) {
                        window.resetExtension();
                        window.location.reload();
                    }
                }
                else {
                    if (lib.device) {
                        if (navigator.notification) {
                            navigator.notification.confirm('游戏似乎未正常载入，是否重置游戏？', function (index) {
                                if (index == 2) {
                                    localStorage.removeItem('noname_inited');
                                    window.location.reload();
                                }
                                else if (index == 3) {
                                    var noname_inited = localStorage.getItem('noname_inited');
                                    var onlineKey = localStorage.getItem(lib.configprefix + 'key');
                                    localStorage.clear();
                                    if (noname_inited) {
                                        localStorage.setItem('noname_inited', noname_inited);
                                    }
                                    if (onlineKey) {
                                        localStorage.setItem(lib.configprefix + 'key', onlineKey);
                                    }
                                    if (indexedDB)
                                        indexedDB.deleteDatabase(lib.configprefix + 'data');
                                    setTimeout(function () {
                                        window.location.reload();
                                    }, 200);
                                }
                            }, '确认退出', ['取消', '重新下载', '重置设置']);
                        }
                        else {
                            if (confirm('游戏似乎未正常载入，是否重置游戏？')) {
                                localStorage.removeItem('noname_inited');
                                window.location.reload();
                            }
                        }
                    }
                    else {
                        if (confirm('游戏似乎未正常载入，是否重置游戏？')) {
                            var onlineKey = localStorage.getItem(lib.configprefix + 'key');
                            localStorage.clear();
                            if (onlineKey) {
                                localStorage.setItem(lib.configprefix + 'key', onlineKey);
                            }
                            if (indexedDB)
                                indexedDB.deleteDatabase(lib.configprefix + 'data');
                            setTimeout(function () {
                                window.location.reload();
                            }, 200);
                        }
                    }
                }
            },
            onload: function () {
                ui.updated();
                game.documentZoom = game.deviceZoom;
                if (game.documentZoom != 1) {
                    ui.updatez();
                }
                ui.background = ui.create.div('.background');
                ui.background.style.backgroundSize = "cover";
                ui.background.style.backgroundPosition = '50% 50%';
                if (lib.config.image_background && lib.config.image_background != 'default' && lib.config.image_background.indexOf('custom_') != 0) {
                    if (lib.config.image_background.indexOf('svg_') == 0) {
                        ui.background.setBackgroundImage('image/background/' + lib.config.image_background.slice(4) + '.svg');
                    }
                    else {
                        ui.background.setBackgroundImage('image/background/' + lib.config.image_background + '.jpg');
                        ui.backgroundSVG = ui.create.div('.background', ui.background);
                        ui.backgroundSVG.setBackgroundImage('image/background/' + 'simple1_bg' + '.svg');
                        ui.backgroundSVG.style.opacity = '.3';
                    }
                    if (lib.config.image_background_blur) {
                        ui.background.style.filter = 'blur(8px)';
                        ui.background.style.webkitFilter = 'blur(8px)';
                        ui.background.style.transform = 'scale(1.05)';
                    }
                }
                document.documentElement.style.backgroundImage = '';
                document.documentElement.style.backgroundSize = '';
                document.documentElement.style.backgroundPosition = '';
                document.body.insertBefore(ui.background, document.body.firstChild);
                document.body.onresize = ui.updatexr;
                if (lib.config.touchscreen) {
                    document.body.addEventListener('touchstart', function (e) {
                        this.startX = e.touches[0].clientX / game.documentZoom;
                        this.startY = e.touches[0].clientY / game.documentZoom;
                        _status.dragged = false;
                    });
                    document.body.addEventListener('touchmove', function (e) {
                        if (_status.dragged)
                            return;
                        if (Math.abs(e.touches[0].clientX / game.documentZoom - this.startX) > 10 ||
                            Math.abs(e.touches[0].clientY / game.documentZoom - this.startY) > 10) {
                            _status.dragged = true;
                        }
                    });
                }
                if (lib.config.image_background.indexOf('custom_') == 0) {
                    ui.background.style.backgroundImage = "none";
                    game.getDB('image', lib.config.image_background, function (fileToLoad) {
                        if (!fileToLoad)
                            return;
                        var fileReader = new FileReader();
                        fileReader.onload = function (fileLoadedEvent) {
                            var data = fileLoadedEvent.target.result;
                            ui.background.style.backgroundImage = 'url(' + data + ')';
                            if (lib.config.image_background_blur) {
                                ui.background.style.filter = 'blur(8px)';
                                ui.background.style.webkitFilter = 'blur(8px)';
                                ui.background.style.transform = 'scale(1.05)';
                            }
                        };
                        fileReader.readAsDataURL(fileToLoad, "UTF-8");
                    });
                }
                if (lib.config.card_style == 'custom') {
                    game.getDB('image', 'card_style', function (fileToLoad) {
                        if (!fileToLoad)
                            return;
                        var fileReader = new FileReader();
                        fileReader.onload = function (fileLoadedEvent) {
                            if (ui.css.card_stylesheet) {
                                ui.css.card_stylesheet.remove();
                            }
                            ui.css.card_stylesheet = lib.init.sheet('.card:not(*:empty){background-image:url(' + fileLoadedEvent.target.result + ')}');
                        };
                        fileReader.readAsDataURL(fileToLoad, "UTF-8");
                    });
                }
                if (lib.config.cardback_style == 'custom') {
                    game.getDB('image', 'cardback_style', function (fileToLoad) {
                        if (!fileToLoad)
                            return;
                        var fileReader = new FileReader();
                        fileReader.onload = function (fileLoadedEvent) {
                            if (ui.css.cardback_stylesheet) {
                                ui.css.cardback_stylesheet.remove();
                            }
                            ui.css.cardback_stylesheet = lib.init.sheet('.card:empty,.card.infohidden{background-image:url(' + fileLoadedEvent.target.result + ')}');
                        };
                        fileReader.readAsDataURL(fileToLoad, "UTF-8");
                    });
                    game.getDB('image', 'cardback_style2', function (fileToLoad) {
                        if (!fileToLoad)
                            return;
                        var fileReader = new FileReader();
                        fileReader.onload = function (fileLoadedEvent) {
                            if (ui.css.cardback_stylesheet2) {
                                ui.css.cardback_stylesheet2.remove();
                            }
                            ui.css.cardback_stylesheet2 = lib.init.sheet('.card.infohidden:not(.infoflip){background-image:url(' + fileLoadedEvent.target.result + ')}');
                        };
                        fileReader.readAsDataURL(fileToLoad, "UTF-8");
                    });
                }
                if (lib.config.hp_style == 'custom') {
                    game.getDB('image', 'hp_style1', function (fileToLoad) {
                        if (!fileToLoad)
                            return;
                        var fileReader = new FileReader();
                        fileReader.onload = function (fileLoadedEvent) {
                            if (ui.css.hp_stylesheet1) {
                                ui.css.hp_stylesheet1.remove();
                            }
                            ui.css.hp_stylesheet1 = lib.init.sheet('.hp:not(.text):not(.actcount)[data-condition="high"]>div:not(.lost){background-image:url(' + fileLoadedEvent.target.result + ')}');
                        };
                        fileReader.readAsDataURL(fileToLoad, "UTF-8");
                    });
                    game.getDB('image', 'hp_style2', function (fileToLoad) {
                        if (!fileToLoad)
                            return;
                        var fileReader = new FileReader();
                        fileReader.onload = function (fileLoadedEvent) {
                            if (ui.css.hp_stylesheet2) {
                                ui.css.hp_stylesheet2.remove();
                            }
                            ui.css.hp_stylesheet2 = lib.init.sheet('.hp:not(.text):not(.actcount)[data-condition="mid"]>div:not(.lost){background-image:url(' + fileLoadedEvent.target.result + ')}');
                        };
                        fileReader.readAsDataURL(fileToLoad, "UTF-8");
                    });
                    game.getDB('image', 'hp_style3', function (fileToLoad) {
                        if (!fileToLoad)
                            return;
                        var fileReader = new FileReader();
                        fileReader.onload = function (fileLoadedEvent) {
                            if (ui.css.hp_stylesheet3) {
                                ui.css.hp_stylesheet3.remove();
                            }
                            ui.css.hp_stylesheet3 = lib.init.sheet('.hp:not(.text):not(.actcount)[data-condition="low"]>div:not(.lost){background-image:url(' + fileLoadedEvent.target.result + ')}');
                        };
                        fileReader.readAsDataURL(fileToLoad, "UTF-8");
                    });
                    game.getDB('image', 'hp_style4', function (fileToLoad) {
                        if (!fileToLoad)
                            return;
                        var fileReader = new FileReader();
                        fileReader.onload = function (fileLoadedEvent) {
                            if (ui.css.hp_stylesheet4) {
                                ui.css.hp_stylesheet4.remove();
                            }
                            ui.css.hp_stylesheet4 = lib.init.sheet('.hp:not(.text):not(.actcount)>.lost{background-image:url(' + fileLoadedEvent.target.result + ')}');
                        };
                        fileReader.readAsDataURL(fileToLoad, "UTF-8");
                    });
                }
                if (lib.config.player_style == 'custom') {
                    ui.css.player_stylesheet = lib.init.sheet('#window .player{background-image:none;background-size:100% 100%;}');
                    game.getDB('image', 'player_style', function (fileToLoad) {
                        if (!fileToLoad)
                            return;
                        var fileReader = new FileReader();
                        fileReader.onload = function (fileLoadedEvent) {
                            if (ui.css.player_stylesheet) {
                                ui.css.player_stylesheet.remove();
                            }
                            ui.css.player_stylesheet = lib.init.sheet('#window .player{background-image:url("' + fileLoadedEvent.target.result + '");background-size:100% 100%;}');
                        };
                        fileReader.readAsDataURL(fileToLoad, "UTF-8");
                    });
                }
                if (lib.config.border_style == 'custom') {
                    game.getDB('image', 'border_style', function (fileToLoad) {
                        if (!fileToLoad)
                            return;
                        var fileReader = new FileReader();
                        fileReader.onload = function (fileLoadedEvent) {
                            if (ui.css.border_stylesheet) {
                                ui.css.border_stylesheet.remove();
                            }
                            ui.css.border_stylesheet = lib.init.sheet();
                            ui.css.border_stylesheet.sheet.insertRule('#window .player>.framebg{display:block;background-image:url("' + fileLoadedEvent.target.result + '")}', 0);
                            ui.css.border_stylesheet.sheet.insertRule('.player>.count{z-index: 3 !important;border-radius: 2px !important;text-align: center !important;}', 0);
                        };
                        fileReader.readAsDataURL(fileToLoad, "UTF-8");
                    });
                }
                if (lib.config.control_style == 'custom') {
                    game.getDB('image', 'control_style', function (fileToLoad) {
                        if (!fileToLoad)
                            return;
                        var fileReader = new FileReader();
                        fileReader.onload = function (fileLoadedEvent) {
                            if (ui.css.control_stylesheet) {
                                ui.css.control_stylesheet.remove();
                            }
                            ui.css.control_stylesheet = lib.init.sheet('#window .control,.menubutton:not(.active):not(.highlight):not(.red):not(.blue),#window #system>div>div{background-image:url("' + fileLoadedEvent.target.result + '")}');
                        };
                        fileReader.readAsDataURL(fileToLoad, "UTF-8");
                    });
                }
                if (lib.config.menu_style == 'custom') {
                    game.getDB('image', 'menu_style', function (fileToLoad) {
                        if (!fileToLoad)
                            return;
                        var fileReader = new FileReader();
                        fileReader.onload = function (fileLoadedEvent) {
                            if (ui.css.menu_stylesheet) {
                                ui.css.menu_stylesheet.remove();
                            }
                            ui.css.menu_stylesheet = lib.init.sheet('html #window>.dialog.popped,html .menu,html .menubg{background-image:url("' + fileLoadedEvent.target.result + '");background-size:cover}');
                        };
                        fileReader.readAsDataURL(fileToLoad, "UTF-8");
                    });
                }
                var proceed2 = function () {
                    var mode = lib.imported.mode;
                    var card = lib.imported.card;
                    var character = lib.imported.character;
                    var play = lib.imported.play;
                    for (let i in mode[lib.config.mode].element) {
                        if (!lib.element[i])
                            lib.element[i] = [];
                        mixin(PlayerModel_1.default.prototype, mode[lib.config.mode].element.player);
                        for (let j in mode[lib.config.mode].element[i]) {
                            if (j == 'init') {
                                if (!lib.element[i].inits)
                                    lib.element[i].inits = [];
                                lib.element[i].inits.push(mode[lib.config.mode].element[i][j]);
                            }
                            else {
                                lib.element[i][j] = mode[lib.config.mode].element[i][j];
                            }
                        }
                    }
                    for (let i in mode[lib.config.mode].ai) {
                        if (typeof mode[lib.config.mode].ai[i] == 'object') {
                            if (ai[i] == undefined)
                                ai[i] = {};
                            for (let j in mode[lib.config.mode].ai[i]) {
                                ai[i][j] = mode[lib.config.mode].ai[i][j];
                            }
                        }
                        else {
                            ai[i] = mode[lib.config.mode].ai[i];
                        }
                    }
                    for (let i in mode[lib.config.mode].ui) {
                        if (typeof mode[lib.config.mode].ui[i] == 'object') {
                            if (ui[i] == undefined)
                                ui[i] = {};
                            for (let j in mode[lib.config.mode].ui[i]) {
                                ui[i][j] = mode[lib.config.mode].ui[i][j];
                            }
                        }
                        else {
                            ui[i] = mode[lib.config.mode].ui[i];
                        }
                    }
                    for (let i in mode[lib.config.mode].game) {
                        game[i] = mode[lib.config.mode].game[i];
                    }
                    for (let i in mode[lib.config.mode].get) {
                        get[i] = mode[lib.config.mode].get[i];
                    }
                    lib.init.start = mode[lib.config.mode].start;
                    lib.init.startBefore = mode[lib.config.mode].startBefore;
                    if (game.onwash) {
                        lib.onwash.push(game.onwash);
                        delete game.onwash;
                    }
                    if (game.onover) {
                        lib.onover.push(game.onover);
                        delete game.onover;
                    }
                    lib.config.banned = lib.config[lib.config.mode + '_banned'] || [];
                    lib.config.bannedcards = lib.config[lib.config.mode + '_bannedcards'] || [];
                    lib.rank = window.vtuberkill_character_rank;
                    delete window.vtuberkill_character_rank;
                    for (let i in mode[lib.config.mode]) {
                        if (i == 'element')
                            continue;
                        if (i == 'game')
                            continue;
                        if (i == 'ai')
                            continue;
                        if (i == 'ui')
                            continue;
                        if (i == 'get')
                            continue;
                        if (i == 'config')
                            continue;
                        if (i == 'onreinit')
                            continue;
                        if (i == 'start')
                            continue;
                        if (i == 'startBefore')
                            continue;
                        if (lib[i] == undefined)
                            lib[i] = (Array.isArray(mode[lib.config.mode][i])) ? [] : {};
                        for (j in mode[lib.config.mode][i]) {
                            lib[i][j] = mode[lib.config.mode][i][j];
                        }
                    }
                    if (typeof mode[lib.config.mode].init == 'function') {
                        mode[lib.config.mode].init();
                    }
                    var connectCharacterPack = [];
                    var connectCardPack = [];
                    for (let i in character) {
                        if (character[i].character) {
                            lib.characterPack[i] = character[i].character;
                        }
                        for (let j in character[i]) {
                            if (j == 'mode' || j == 'forbid')
                                continue;
                            if (j == 'connect') {
                                connectCharacterPack.push(i);
                                continue;
                            }
                            if (j == 'character' && !lib.config.characters.contains(i) && lib.config.mode != 'connect') {
                                if (lib.config.mode == 'chess' && get.config('chess_mode') == 'leader' && get.config('chess_leader_allcharacter')) {
                                    for (let k in character[i][j]) {
                                        lib.hiddenCharacters.push(k);
                                    }
                                }
                                else if (lib.config.mode != 'boss' || i != 'boss') {
                                    continue;
                                }
                            }
                            if (Array.isArray(lib[j]) && Array.isArray(character[i][j])) {
                                lib[j].addArray(character[i][j]);
                                continue;
                            }
                            for (let k in character[i][j]) {
                                if (j == 'character') {
                                    if (!character[i][j][k][4]) {
                                        character[i][j][k][4] = [];
                                    }
                                    if (character[i][j][k][4].contains('boss') ||
                                        character[i][j][k][4].contains('hiddenboss')) {
                                        lib.config.forbidai.add(k);
                                    }
                                    if (lib.config.forbidai_user && lib.config.forbidai_user.contains(k)) {
                                        lib.config.forbidai.add(k);
                                    }
                                    for (var l = 0; l < character[i][j][k][3].length; l++) {
                                        lib.skilllist.add(character[i][j][k][3][l]);
                                    }
                                }
                                if (j == 'skill' && k[0] == '_' && (lib.config.mode != 'connect' ? (!lib.config.characters.contains(i)) : (!character[i].connect))) {
                                    continue;
                                }
                                if (j == 'translate' && k == i) {
                                    lib[j][k + '_character_config'] = character[i][j][k];
                                }
                                else {
                                    if (lib[j][k] == undefined) {
                                        if (j == 'skill' && !character[i][j][k].forceLoad && lib.config.mode == 'connect' && !character[i].connect) {
                                            lib[j][k] = {
                                                nopop: character[i][j][k].nopop,
                                                derivation: character[i][j][k].derivation
                                            };
                                        }
                                        else {
                                            lib[j][k] = character[i][j][k];
                                        }
                                        if (j == 'card' && lib[j][k].derivation) {
                                            if (!lib.cardPack.mode_derivation) {
                                                lib.cardPack.mode_derivation = [k];
                                            }
                                            else {
                                                lib.cardPack.mode_derivation.push(k);
                                            }
                                        }
                                    }
                                    else if (Array.isArray(lib[j][k]) && Array.isArray(character[i][j][k])) {
                                        lib[j][k].addArray(character[i][j][k]);
                                    }
                                    else {
                                        console.log('dublicate ' + j + ' in character ' + i + ':\n' + k + '\n' + ': ' + lib[j][k] + '\n' + character[i][j][k]);
                                    }
                                }
                            }
                        }
                    }
                    var connect_avatar_list = [];
                    for (let i in lib.character) {
                        connect_avatar_list.push(i);
                    }
                    connect_avatar_list.sort(lib.sort.capt);
                    for (let i = 0; i < connect_avatar_list.length; i++) {
                        let ia = connect_avatar_list[i];
                        lib.mode.connect.config.connect_avatar.item[ia] = lib.translate[ia];
                    }
                    if (lib.config.mode != 'connect') {
                        let pilecfg = lib.config.customcardpile[get.config('cardpilename') || '当前牌堆'];
                        if (pilecfg) {
                            lib.config.bannedpile = get.copy(pilecfg[0] || {});
                            lib.config.addedpile = get.copy(pilecfg[1] || {});
                        }
                        else {
                            lib.config.bannedpile = {};
                            lib.config.addedpile = {};
                        }
                    }
                    else {
                        lib.cardPackList = {};
                    }
                    for (let i in card) {
                        lib.cardPack[i] = [];
                        if (card[i].card) {
                            for (var j in card[i].card) {
                                if (!card[i].card[j].hidden && card[i].translate[j + '_info']) {
                                    lib.cardPack[i].push(j);
                                }
                            }
                        }
                        for (let j in card[i]) {
                            if (j == 'mode' || j == 'forbid')
                                continue;
                            if (j == 'connect') {
                                connectCardPack.push(i);
                                continue;
                            }
                            if (j == 'list') {
                                if (lib.config.mode == 'connect') {
                                    lib.cardPackList[i] = card[i][j];
                                }
                                else {
                                    if (lib.config.cards.contains(i)) {
                                        var pile;
                                        if (typeof card[i][j] == 'function') {
                                            pile = card[i][j]();
                                        }
                                        else {
                                            pile = card[i][j];
                                        }
                                        lib.cardPile[i] = pile.slice(0);
                                        if (lib.config.bannedpile[i]) {
                                            for (var k = 0; k < lib.config.bannedpile[i].length; k++) {
                                                pile[lib.config.bannedpile[i][k]] = null;
                                            }
                                        }
                                        for (var k = 0; k < pile.length; k++) {
                                            if (!pile[k]) {
                                                pile.splice(k--, 1);
                                            }
                                        }
                                        if (lib.config.addedpile[i]) {
                                            for (var k = 0; k < lib.config.addedpile[i].length; k++) {
                                                pile.push(lib.config.addedpile[i][k]);
                                            }
                                        }
                                        lib.card.list = lib.card.list.concat(pile);
                                    }
                                }
                            }
                            else {
                                for (let k in card[i][j]) {
                                    if (j == 'skill' && k[0] == '_' && !card[i][j][k].forceLoad && (lib.config.mode != 'connect' ? (!lib.config.cards.contains(i)) : (!card[i].connect))) {
                                        continue;
                                    }
                                    if (j == 'translate' && k == i) {
                                        lib[j][k + '_card_config'] = card[i][j][k];
                                    }
                                    else {
                                        if (lib[j][k] == undefined) {
                                            if (j == 'skill' && !card[i][j][k].forceLoad && lib.config.mode == 'connect' && !card[i].connect) {
                                                lib[j][k] = {
                                                    nopop: card[i][j][k].nopop,
                                                    derivation: card[i][j][k].derivation
                                                };
                                            }
                                            else {
                                                lib[j][k] = card[i][j][k];
                                            }
                                        }
                                        else
                                            console.log('dublicate ' + j + ' in card ' + i + ':\n' + k + '\n' + lib[j][k] + '\n' + card[i][j][k]);
                                        if (j == 'card' && lib[j][k].derivation) {
                                            if (!lib.cardPack.mode_derivation) {
                                                lib.cardPack.mode_derivation = [k];
                                            }
                                            else {
                                                lib.cardPack.mode_derivation.push(k);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (lib.cardPack.mode_derivation) {
                        for (let i = 0; i < lib.cardPack.mode_derivation.length; i++) {
                            if (typeof lib.card[lib.cardPack.mode_derivation[i]].derivation == 'string' && !lib.character[lib.card[lib.cardPack.mode_derivation[i]].derivation]) {
                                lib.cardPack.mode_derivation.splice(i--, 1);
                            }
                            else if (typeof lib.card[lib.cardPack.mode_derivation[i]].derivationpack == 'string' && !lib.config.cards.contains(lib.card[lib.cardPack.mode_derivation[i]].derivationpack)) {
                                lib.cardPack.mode_derivation.splice(i--, 1);
                            }
                        }
                        if (lib.cardPack.mode_derivation.length == 0) {
                            delete lib.cardPack.mode_derivation;
                        }
                    }
                    if (lib.config.mode != 'connect') {
                        for (let i in play) {
                            if (lib.config.hiddenPlayPack.contains(i))
                                continue;
                            if (play[i].forbid && play[i].forbid.contains(lib.config.mode))
                                continue;
                            if (play[i].mode && play[i].mode.contains(lib.config.mode) == false)
                                continue;
                            for (j in play[i].element) {
                                if (!lib.element[j])
                                    lib.element[j] = [];
                                if (j === 'player') {
                                    mixin(PlayerModel_1.default.prototype, play[i].element[j]);
                                }
                                else {
                                    for (let k in play[i].element[j]) {
                                        if (k == 'init') {
                                            if (!lib.element[j].inits)
                                                lib.element[j].inits = [];
                                            lib.element[j].inits.push(play[i].element[j][k]);
                                        }
                                        else {
                                            lib.element[j][k] = play[i].element[j][k];
                                        }
                                    }
                                }
                            }
                            for (let j in play[i].ui) {
                                if (typeof play[i].ui[j] == 'object') {
                                    if (ui[j] == undefined)
                                        ui[j] = {};
                                    for (let k in play[i].ui[j]) {
                                        ui[j][k] = play[i].ui[j][k];
                                    }
                                }
                                else {
                                    ui[j] = play[i].ui[j];
                                }
                            }
                            for (let j in play[i].game) {
                                game[j] = play[i].game[j];
                            }
                            for (let j in play[i].get) {
                                get[j] = play[i].get[j];
                            }
                            for (let j in play[i]) {
                                if (j == 'mode' || j == 'forbid' || j == 'init' || j == 'element' ||
                                    j == 'game' || j == 'get' || j == 'ui' || j == 'arenaReady')
                                    continue;
                                for (let k in play[i][j]) {
                                    if (j == 'translate' && k == i) {
                                    }
                                    else {
                                        if (lib[j][k] != undefined) {
                                            console.log('dublicate ' + j + ' in play ' + i + ':\n' + k + '\n' + ': ' + lib[j][k] + '\n' + play[i][j][k]);
                                        }
                                        lib[j][k] = play[i][j][k];
                                    }
                                }
                            }
                            if (typeof play[i].init == 'function')
                                play[i].init();
                            if (typeof play[i].arenaReady == 'function')
                                lib.arenaReady.push(play[i].arenaReady);
                        }
                    }
                    lib.connectCharacterPack = [];
                    lib.connectCardPack = [];
                    for (var i = 0; i < lib.config.all.characters.length; i++) {
                        var packname = lib.config.all.characters[i];
                        if (connectCharacterPack.contains(packname)) {
                            lib.connectCharacterPack.push(packname);
                        }
                    }
                    for (var i = 0; i < lib.config.all.cards.length; i++) {
                        var packname = lib.config.all.cards[i];
                        if (connectCardPack.contains(packname)) {
                            lib.connectCardPack.push(packname);
                        }
                    }
                    if (lib.config.mode != 'connect') {
                        for (i = 0; i < lib.card.list.length; i++) {
                            if (lib.card.list[i][2] == 'huosha') {
                                lib.card.list[i] = lib.card.list[i].slice(0);
                                lib.card.list[i][2] = 'sha';
                                lib.card.list[i][3] = 'fire';
                            }
                            else if (lib.card.list[i][2] == 'leisha') {
                                lib.card.list[i] = lib.card.list[i].slice(0);
                                lib.card.list[i][2] = 'sha';
                                lib.card.list[i][3] = 'thunder';
                            }
                            else if (lib.card.list[i][2] == 'haisha') {
                                lib.card.list[i] = lib.card.list[i].slice(0);
                                lib.card.list[i][2] = 'sha';
                                lib.card.list[i][3] = 'ocean';
                            }
                            else if (lib.card.list[i][2] == 'yamisha') {
                                lib.card.list[i] = lib.card.list[i].slice(0);
                                lib.card.list[i][2] = 'sha';
                                lib.card.list[i][3] = 'yami';
                            }
                            if (lib.card.list[i][2] == 'haitao') {
                                lib.card.list[i] = lib.card.list[i].slice(0);
                                lib.card.list[i][2] = 'tao';
                                lib.card.list[i][3] = 'ocean';
                            }
                            if (lib.card.list[i][2] == 'haijiu') {
                                lib.card.list[i] = lib.card.list[i].slice(0);
                                lib.card.list[i][2] = 'jiu';
                                lib.card.list[i][3] = 'ocean';
                            }
                            if (!lib.card[lib.card.list[i][2]]) {
                                lib.card.list.splice(i, 1);
                                i--;
                            }
                            else if (lib.card[lib.card.list[i][2]].mode &&
                                lib.card[lib.card.list[i][2]].mode.contains(lib.config.mode) == false) {
                                lib.card.list.splice(i, 1);
                                i--;
                            }
                        }
                    }
                    if (lib.config.mode == 'connect') {
                        _status.connectMode = true;
                    }
                    if (window.isNonameServer) {
                        lib.cheat.i();
                    }
                    else if (lib.config.dev && (!_status.connectMode || lib.config.debug)) {
                        lib.cheat.i();
                    }
                    lib.config.sort_card = get.sortCard(lib.config.sort);
                    delete lib.imported.character;
                    delete lib.imported.card;
                    delete lib.imported.mode;
                    delete lib.imported.play;
                    for (let i in lib.init) {
                        if (i.indexOf('setMode_') == 0) {
                            delete lib.init[i];
                        }
                    }
                    if (!_status.connectMode) {
                        for (let i = 0; i < lib.extensions.length; i++) {
                            try {
                                _status.extension = lib.extensions[i][0];
                                _status.evaluatingExtension = lib.extensions[i][3];
                                lib.extensions[i][1](lib.extensions[i][2], lib.extensions[i][4]);
                                if (lib.extensions[i][4]) {
                                    if (lib.extensions[i][4].character) {
                                        for (let j in lib.extensions[i][4].character.character) {
                                            game.addCharacterPack(get.copy(lib.extensions[i][4].character));
                                            break;
                                        }
                                    }
                                    if (lib.extensions[i][4].card) {
                                        for (let j in lib.extensions[i][4].card.card) {
                                            game.addCardPack(get.copy(lib.extensions[i][4].card));
                                            break;
                                        }
                                    }
                                    if (lib.extensions[i][4].skill) {
                                        for (let j in lib.extensions[i][4].skill.skill) {
                                            game.addSkill(j, lib.extensions[i][4].skill.skill[j], lib.extensions[i][4].skill.translate[j], lib.extensions[i][4].skill.translate[j + '_info']);
                                        }
                                    }
                                }
                                delete _status.extension;
                                delete _status.evaluatingExtension;
                            }
                            catch (e) {
                                console.log(e);
                            }
                        }
                    }
                    delete lib.extensions;
                    if (lib.init.startBefore) {
                        lib.init.startBefore();
                        delete lib.init.startBefore;
                    }
                    ui.create.arena();
                    game.createEvent('game', false).setContent(lib.init.start);
                    if (lib.mode[lib.config.mode] && lib.mode[lib.config.mode].fromextension) {
                        var startstr = mode[lib.config.mode].start.toString();
                        if (startstr.indexOf('onfree') == -1) {
                            setTimeout(lib.init.onfree, 500);
                        }
                    }
                    delete lib.init.start;
                    game.loop();
                };
                var proceed = function () {
                    if (!lib.db) {
                        try {
                            lib.storage = JSON.parse(localStorage.getItem(lib.configprefix + lib.config.mode));
                            if (typeof lib.storage != 'object')
                                throw ('err');
                            if (lib.storage == null)
                                throw ('err');
                        }
                        catch (err) {
                            lib.storage = {};
                            localStorage.setItem(lib.configprefix + lib.config.mode, "{}");
                        }
                        proceed2();
                    }
                    else {
                        game.getDB('data', lib.config.mode, function (obj) {
                            lib.storage = obj || {};
                            proceed2();
                        });
                    }
                };
                if (!lib.imported.mode || !lib.imported.mode[lib.config.mode]) {
                    window.inSplash = true;
                    clearTimeout(window.resetGameTimeout);
                    delete window.resetGameTimeout;
                    var clickedNode = false;
                    var clickNode = function () {
                        if (clickedNode)
                            return;
                        this.classList.add('clicked');
                        clickedNode = true;
                        lib.config.mode = this.link;
                        game.saveConfig('mode', this.link);
                        if (this.link == 'connect') {
                            localStorage.setItem(lib.configprefix + 'directstart', true);
                            game.reload();
                        }
                        else {
                            if (game.layout != 'mobile' && lib.layoutfixed.indexOf(lib.config.mode) !== -1) {
                                game.layout = 'mobile';
                                ui.css.layout.href = lib.assetURL + 'layout/' + game.layout + '/layout.css';
                            }
                            else if (game.layout == 'mobile' && lib.config.layout != 'mobile' && lib.layoutfixed.indexOf(lib.config.mode) === -1) {
                                game.layout = lib.config.layout;
                                if (game.layout == 'default') {
                                    ui.css.layout.href = '';
                                }
                                else {
                                    ui.css.layout.href = lib.assetURL + 'layout/' + game.layout + '/layout.css';
                                }
                            }
                            splash.delete(1000);
                            delete window.inSplash;
                            window.resetGameTimeout = setTimeout(lib.init.reset, 5000);
                            this.listenTransition(function () {
                                lib.init.js(lib.assetURL + 'mode', lib.config.mode, proceed);
                            }, 500);
                        }
                    };
                    var downNode = function () {
                        this.classList.add('glow');
                    };
                    var upNode = function () {
                        this.classList.remove('glow');
                    };
                    var splash = ui.create.div('#splash', document.body);
                    if (lib.config.touchscreen) {
                        splash.classList.add('touch');
                        lib.setScroll(splash);
                    }
                    if (lib.config.player_border != 'wide') {
                        splash.classList.add('slim');
                    }
                    splash.dataset.radius_size = lib.config.radius_size;
                    for (var i = 0; i < lib.config.all.mode.length; i++) {
                        var node = ui.create.div('.hidden', splash, clickNode);
                        node.link = lib.config.all.mode[i];
                        ui.create.div(node, '.splashtext', get.verticalStr(get.translation(lib.config.all.mode[i])));
                        if (lib.config.all.stockmode.indexOf(lib.config.all.mode[i]) != -1) {
                            ui.create.div(node, '.avatar').setBackgroundImage('image/splash/' + lib.config.all.mode[i] + '.jpg');
                        }
                        else {
                            var avatarnode = ui.create.div(node, '.avatar');
                            var avatarbg = lib.mode[lib.config.all.mode[i]].splash;
                            if (avatarbg.indexOf('ext:') == 0) {
                                avatarnode.setBackgroundImage(avatarbg.replace(/ext:/, 'extension/'));
                            }
                            else {
                                avatarnode.setBackgroundDB(avatarbg);
                            }
                        }
                        if (!lib.config.touchscreen) {
                            node.addEventListener('mousedown', downNode);
                            node.addEventListener('mouseup', upNode);
                            node.addEventListener('mouseleave', upNode);
                        }
                        setTimeout((function (node) {
                            return function () {
                                node.show();
                            };
                        }(node)), i * 100);
                    }
                    if (lib.config.mousewheel) {
                        splash.onmousewheel = ui.click.mousewheel;
                    }
                }
                else {
                    proceed();
                }
                localStorage.removeItem(lib.configprefix + 'directstart');
                delete lib.init.init;
            },
            startOnline: ((game) => {
                return function () {
                    'step 0';
                    event._resultid = null;
                    event._result = null;
                    game.pause();
                    'step 1';
                    if (result) {
                        if (event._resultid) {
                            result.id = event._resultid;
                        }
                        game.send('result', result);
                    }
                    event.goto(0);
                };
            })(game),
            onfree: function () {
                if (lib.onfree) {
                    clearTimeout(window.resetGameTimeout);
                    delete window.resetGameTimeout;
                    if (!game.syncMenu) {
                        delete window.resetExtension;
                        localStorage.removeItem(lib.configprefix + 'disable_extension');
                    }
                    if (game.removeFile && lib.config.brokenFile.length) {
                        while (lib.config.brokenFile.length) {
                            game.removeFile(lib.config.brokenFile.shift());
                        }
                        game.saveConfigValue('brokenFile');
                    }
                    var onfree = lib.onfree;
                    delete lib.onfree;
                    var loop = function () {
                        if (onfree.length) {
                            (onfree.shift())();
                            setTimeout(loop, 100);
                        }
                    };
                    setTimeout(loop, 500);
                }
            },
            connection: function (ws) {
                var client = {
                    ws: ws,
                    id: ws.wsid || get.id(),
                    closed: false
                };
                lib.node.clients.push(client);
                for (var i in lib.element.client) {
                    client[i] = lib.element.client[i];
                }
                if (window.isNonameServer) {
                    document.querySelector('#server_count').innerHTML = lib.node.clients.length;
                }
                ws.on('message', function (messagestr) {
                    var message;
                    try {
                        message = JSON.parse(messagestr);
                        if (!Array.isArray(message) ||
                            typeof lib.message.server[message[0]] !== 'function') {
                            throw ('err');
                        }
                        for (var i = 1; i < message.length; i++) {
                            message[i] = get.parsedResult(message[i]);
                        }
                    }
                    catch (e) {
                        console.log(e);
                        console.log('invalid message: ' + messagestr);
                        return;
                    }
                    lib.message.server[message.shift()].apply(client, message);
                });
                ws.on('close', function () {
                    client.close();
                });
                client.send('opened');
            },
            sheet: function () {
                var style = document.createElement('style');
                document.head.appendChild(style);
                for (var i = 0; i < arguments.length; i++) {
                    if (typeof arguments[i] == 'string') {
                        style.sheet.insertRule(arguments[i], 0);
                    }
                }
                return style;
            },
            css: function (path, file, before) {
                var style = document.createElement("link");
                style.rel = "stylesheet";
                if (path) {
                    style.href = path + '/' + file + ".css";
                }
                if (typeof before == 'function') {
                    style.addEventListener('load', before);
                    document.head.appendChild(style);
                }
                else if (before) {
                    document.head.insertBefore(style, before);
                }
                else {
                    document.head.appendChild(style);
                }
                return style;
            },
            js: function (path, file, onload, onerror) {
                if (path[path.length - 1] == '/') {
                    path = path.slice(0, path.length - 1);
                }
                if (path == lib.assetURL + 'mode' && lib.config.all.stockmode.indexOf(file) == -1) {
                    lib.init['setMode_' + file]();
                    onload();
                    return;
                }
                if (Array.isArray(file)) {
                    for (var i = 0; i < file.length; i++) {
                        lib.init.js(path, file[i], onload, onerror);
                    }
                }
                else {
                    var script = document.createElement('script');
                    if (!file) {
                        script.src = path;
                    }
                    else {
                        script.src = path + '/' + file + ".js";
                    }
                    if (path.indexOf('http') == 0) {
                        script.src += '?rand=' + get.id();
                        script.addEventListener('load', function () {
                            script.remove();
                        });
                    }
                    document.head.appendChild(script);
                    if (typeof onload == 'function') {
                        script.addEventListener('load', onload);
                        script.addEventListener('error', onerror);
                    }
                    return script;
                }
            },
            req: function (str, onload, onerror, master) {
                var sScriptURL;
                if (str.indexOf('http') == 0) {
                    sScriptURL = str;
                }
                else {
                    var url = get.url(master);
                    if (url[url.length - 1] != '/') {
                        url += '/';
                    }
                    sScriptURL = url + str;
                }
                var oReq = new XMLHttpRequest();
                if (onload)
                    oReq.addEventListener("load", onload);
                if (onerror)
                    oReq.addEventListener("error", onerror);
                oReq.open("GET", sScriptURL);
                oReq.send();
            },
            json: function (url, onload, onerror) {
                var oReq = new XMLHttpRequest();
                if (onload)
                    oReq.addEventListener("load", function () {
                        var result;
                        try {
                            result = JSON.parse(this.responseText);
                            if (!result) {
                                throw ('err');
                            }
                        }
                        catch (e) {
                            onerror();
                            return;
                        }
                        onload(result);
                    });
                if (onerror)
                    oReq.addEventListener("error", onerror);
                oReq.open("GET", url);
                oReq.send();
            },
            cssstyles: function () {
                if (ui.css.styles) {
                    ui.css.styles.remove();
                }
                ui.css.styles = lib.init.sheet();
                ui.css.styles.sheet.insertRule('#arena .player>.name,#arena .button.character>.name {font-family: ' + (lib.config.name_font || 'xinwei') + ',xinwei}', 0);
                ui.css.styles.sheet.insertRule('#arena .player .identity>div {font-family: ' + (lib.config.identity_font || 'huangcao') + ',xinwei}', 0);
                ui.css.styles.sheet.insertRule('.button.character.newstyle>.identity {font-family: ' + (lib.config.identity_font || 'huangcao') + ',xinwei}', 0);
                if (lib.config.cardtext_font && lib.config.cardtext_font != 'default') {
                    ui.css.styles.sheet.insertRule('.card div:not(.info):not(.background) {font-family: ' + lib.config.cardtext_font + ';}', 0);
                }
                if (lib.config.global_font && lib.config.global_font != 'default') {
                    ui.css.styles.sheet.insertRule('#window {font-family: ' + lib.config.global_font + ',xinwei}', 0);
                    ui.css.styles.sheet.insertRule('#window #control{font-family: STHeiti,SimHei,Microsoft JhengHei,Microsoft YaHei,WenQuanYi Micro Hei,Helvetica,Arial,sans-serif}', 0);
                }
                switch (lib.config.glow_phase) {
                    case 'yellow':
                        ui.css.styles.sheet.insertRule('#arena .player:not(.selectable):not(.selected).glow_phase {box-shadow: rgba(0, 0, 0, 0.3) 0 0 0 1px, rgb(217, 152, 62) 0 0 15px, rgb(217, 152, 62) 0 0 15px !important;}', 0);
                        break;
                    case 'green':
                        ui.css.styles.sheet.insertRule('#arena .player:not(.selectable):not(.selected).glow_phase {box-shadow: rgba(0, 0, 0, 0.3) 0 0 0 1px, rgba(10, 155, 67, 1) 0 0 15px, rgba(10, 155, 67, 1) 0 0 15px !important;}', 0);
                        break;
                    case 'purple':
                        ui.css.styles.sheet.insertRule('#arena .player:not(.selectable):not(.selected).glow_phase {box-shadow: rgba(0, 0, 0, 0.3) 0 0 0 1px, rgb(189, 62, 170) 0 0 15px, rgb(189, 62, 170) 0 0 15px !important;}', 0);
                        break;
                }
            },
            layout: function (layout, nosave) {
                if (!nosave)
                    game.saveConfig('layout', layout);
                game.layout = layout;
                ui.arena.hide();
                setTimeout(function () {
                    if (game.layout == 'default') {
                        ui.css.layout.href = '';
                    }
                    else {
                        ui.css.layout.href = lib.assetURL + 'layout/' + game.layout + '/layout.css';
                    }
                    if (game.layout == 'mobile' || game.layout == 'long') {
                        ui.arena.classList.add('mobile');
                    }
                    else {
                        ui.arena.classList.remove('mobile');
                    }
                    if (game.layout == 'mobile' || game.layout == 'long' || game.layout == 'long2' || game.layout == 'nova') {
                        if (game.me && game.me.node.handcards2.childNodes.length) {
                            while (game.me.node.handcards2.childNodes.length) {
                                game.me.node.handcards1.appendChild(game.me.node.handcards2.firstChild);
                            }
                        }
                    }
                    if (game.layout == 'default') {
                        ui.arena.classList.add('oldlayout');
                    }
                    else {
                        ui.arena.classList.remove('oldlayout');
                    }
                    if (lib.config.cardshape == 'oblong' && (game.layout == 'long' || game.layout == 'mobile' || game.layout == 'long2' || game.layout == 'nova')) {
                        ui.arena.classList.add('oblongcard');
                        ui.window.classList.add('oblongcard');
                    }
                    else {
                        ui.arena.classList.remove('oblongcard');
                        ui.window.classList.remove('oblongcard');
                    }
                    if (lib.config.textequip == 'text' && (game.layout == 'long' || game.layout == 'mobile')) {
                        ui.arena.classList.add('textequip');
                    }
                    else {
                        ui.arena.classList.remove('textequip');
                    }
                    if (get.is.phoneLayout()) {
                        ui.css.phone.href = lib.assetURL + 'layout/default/phone.css';
                        ui.arena.classList.add('phone');
                    }
                    else {
                        ui.css.phone.href = '';
                        ui.arena.classList.remove('phone');
                    }
                    for (var i = 0; i < game.players.length; i++) {
                        if (get.is.linked2(game.players[i])) {
                            if (game.players[i].classList.contains('linked')) {
                                game.players[i].classList.remove('linked');
                                game.players[i].classList.add('linked2');
                            }
                        }
                        else {
                            if (game.players[i].classList.contains('linked2')) {
                                game.players[i].classList.remove('linked2');
                                game.players[i].classList.add('linked');
                            }
                        }
                    }
                    if (game.layout == 'long' || game.layout == 'long2') {
                        ui.arena.classList.add('long');
                    }
                    else {
                        ui.arena.classList.remove('long');
                    }
                    if (lib.config.player_border != 'wide' || game.layout == 'long' || game.layout == 'long2') {
                        ui.arena.classList.add('slim_player');
                    }
                    else {
                        ui.arena.classList.remove('slim_player');
                    }
                    if (lib.config.player_border == 'normal' && lib.config.mode != 'brawl' && (game.layout == 'long' || game.layout == 'long2')) {
                        ui.arena.classList.add('lslim_player');
                    }
                    else {
                        ui.arena.classList.remove('lslim_player');
                    }
                    if (lib.config.player_border == 'slim') {
                        ui.arena.classList.add('uslim_player');
                    }
                    else {
                        ui.arena.classList.remove('uslim_player');
                    }
                    if (lib.config.player_border == 'narrow') {
                        ui.arena.classList.add('mslim_player');
                    }
                    else {
                        ui.arena.classList.remove('mslim_player');
                    }
                    ui.updatej();
                    ui.updatem();
                    setTimeout(function () {
                        ui.arena.show();
                        if (game.me)
                            game.me.update();
                        setTimeout(function () {
                            ui.updatex();
                        }, 500);
                        setTimeout(function () {
                            ui.updatec();
                        }, 1000);
                    }, 100);
                }, 500);
            },
            background: function () {
                if (lib.config.image_background_random) {
                    var list = [];
                    for (var i in lib.configMenu.appearence.config.image_background.item) {
                        if (i == 'default')
                            continue;
                        list.push(i);
                    }
                    list.remove(lib.config.image_background);
                    localStorage.setItem(lib.configprefix + 'background', JSON.stringify(list));
                }
                else if (lib.config.image_background && lib.config.image_background != 'default' && lib.config.image_background.indexOf('custom_') != 0) {
                    localStorage.setItem(lib.configprefix + 'background', lib.config.image_background);
                }
                else if (lib.config.image_background == 'default' && lib.config.theme == 'simple') {
                    localStorage.setItem(lib.configprefix + 'background', 'ol_bg');
                }
                else {
                    localStorage.removeItem(lib.configprefix + 'background');
                }
            },
            parsex: function (func) {
                var k;
                var str = '(';
                str += func.toString();
                if (str.indexOf('step 0') == -1) {
                    str = str.replace(/\{/, '{{if(event.step==1) {event.finish();return;}');
                }
                else {
                    for (k = 1; k < 99; k++) {
                        if (str.indexOf('step ' + k) == -1)
                            break;
                        str = str.replace(new RegExp("'step " + k + "'", 'g'), "break;case " + k + ":");
                        str = str.replace(new RegExp('"step ' + k + '"', 'g'), "break;case " + k + ":");
                    }
                    str = str.replace(/'step 0'|"step 0"/, 'if(event.step==' + k + ') {event.finish();return;}switch(step){case 0:');
                }
                str += '})';
                return str;
            },
            parse: function (func) {
                var str = func.toString();
                str = str.replace(/(?!\.)galgame/g, 'game.galgame');
                str = str.slice(str.indexOf('{') + 1);
                if (str.indexOf('step 0') == -1) {
                    str = '{if(event.step==1) {event.finish();return;}' + str;
                }
                else {
                    for (var k = 1; k < 99; k++) {
                        if (str.indexOf('step ' + k) == -1)
                            break;
                        str = str.replace(new RegExp("'step " + k + "'", 'g'), "break;case " + k + ":");
                        str = str.replace(new RegExp('"step ' + k + '"', 'g'), "break;case " + k + ":");
                    }
                    str = str.replace(/'step 0'|"step 0"/, 'if(event.step==' + k + ') {event.finish();return;}switch(step){case 0:');
                }
                return (new Function('event', 'step', 'source', 'player', 'target', 'targets', 'card', 'cards', 'skill', 'num', 'trigger', 'result', '_status', 'lib', 'game', 'ui', 'get', 'ai', str));
            },
            eval: function (func) {
                if (typeof func == 'function') {
                    return eval('(' + func.toString() + ')');
                }
                else if (typeof func == 'object') {
                    for (var i in func) {
                        if (func.hasOwnProperty(i)) {
                            func[i] = lib.init.eval(func[i]);
                        }
                    }
                }
                return func;
            },
            encode: function (strUni) {
                var strUtf = strUni.replace(/[\u0080-\u07ff]/g, function (c) {
                    var cc = c.charCodeAt(0);
                    return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
                });
                strUtf = strUtf.replace(/[\u0800-\uffff]/g, function (c) {
                    var cc = c.charCodeAt(0);
                    return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
                });
                return btoa(strUtf);
            },
            decode: function (str) {
                var strUtf = atob(str);
                var strUni = strUtf.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, function (c) {
                    var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
                    return String.fromCharCode(cc);
                });
                strUni = strUni.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, function (c) {
                    var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
                    return String.fromCharCode(cc);
                });
                return strUni;
            },
            stringify: function (obj) {
                var str = '{';
                for (var i in obj) {
                    str += '"' + i + '":';
                    if (Object.prototype.toString.call(obj[i]) == '[object Object]') {
                        str += lib.init.stringify(obj[i]);
                    }
                    else if (typeof obj[i] == 'function') {
                        str += obj[i].toString();
                    }
                    else {
                        str += JSON.stringify(obj[i]);
                    }
                    str += ',';
                }
                str += '}';
                return str;
            },
            stringifySkill: function (obj) {
                var str = '';
                for (var i in obj) {
                    str += i + ':';
                    if (Object.prototype.toString.call(obj[i]) == '[object Object]') {
                        str += '{\n' + lib.init.stringifySkill(obj[i]) + '}';
                    }
                    else if (typeof obj[i] == 'function') {
                        str += obj[i].toString().replace(/\t/g, '');
                    }
                    else {
                        str += JSON.stringify(obj[i]);
                    }
                    str += ',\n';
                }
                return str;
            }
        },
        cheat: {
            i: function () {
                window.cheat = lib.cheat;
                window.ui = ui;
                window.get = get;
                window.ai = ai;
                window.lib = lib;
                window._status = _status;
            },
            dy: function () {
                var next = game.me.next;
                for (var i = 0; i < 10; i++) {
                    if (next.identity != 'zhu') {
                        break;
                    }
                    next = next.next;
                }
                next.die();
            },
            x: function () {
                var gl = function (dir, callback) {
                    var files = [], folders = [];
                    dir = '/Users/widget/Documents/extension/' + dir;
                    lib.node.fs.readdir(dir, function (err, filelist) {
                        for (var i = 0; i < filelist.length; i++) {
                            if (filelist[i][0] != '.' && filelist[i][0] != '_') {
                                if (lib.node.fs.statSync(dir + '/' + filelist[i]).isDirectory()) {
                                    folders.push(filelist[i]);
                                }
                                else {
                                    files.push(filelist[i]);
                                }
                            }
                        }
                        callback(folders, files);
                    });
                };
                var args = Array.from(arguments);
                for (var i = 0; i < args.length; i++) {
                    args[i] = args[i][0];
                }
                gl('', function (list) {
                    if (args.length) {
                        for (var i = 0; i < list.length; i++) {
                            if (!args.contains(list[i][0])) {
                                list.splice(i--, 1);
                            }
                        }
                    }
                    if (list.length) {
                        for (var i = 0; i < list.length; i++) {
                            (function (str) {
                                gl(str, function (folders, files) {
                                    if (files.length > 1) {
                                        for (var i = 0; i < files.length; i++) {
                                            if (files[i].indexOf('extension.js') != -1) {
                                                files.splice(i--, 1);
                                            }
                                            else {
                                                if (i % 5 == 0) {
                                                    str += '\n\t\t\t';
                                                }
                                                str += '"' + files[i] + '",';
                                            }
                                        }
                                        console.log(str.slice(0, str.length - 1));
                                    }
                                });
                            }(list[i]));
                        }
                    }
                });
            },
            cfg: function () {
                var mode = lib.config.all.mode.slice(0);
                mode.remove('connect');
                mode.remove('brawl');
                var banned = ['shen_guanyu', 'shen_caocao', 'caopi', 're_daqiao', 'caorui',
                    'daqiao', 'lingcao', 'liuzan', 'lusu', 'luxun', 'yanwen', 'zhouyu', 'ns_wangyue', 'gw_yenaifa',
                    'old_caozhen', 'swd_jiangziya', 'xuhuang', 'maliang', 'guojia', 'simayi', 'swd_kangnalishi', 'hs_siwangzhiyi', 'hs_nozdormu', 'old_zhuzhi'];
                var bannedcards = ['zengbin'];
                var favs = ["hs_tuoqi", "hs_siwangxianzhi", "hs_xukongzhiying", "hs_hsjiasha", "gjqt_xieyi", "gjqt_yunwuyue", "gjqt_beiluo",
                    "gjqt_cenying", "shen_lvmeng", "shen_zhaoyun", "shen_zhugeliang", "ow_ana", "chenlin", "ns_guanlu", "hs_guldan", "swd_guyue",
                    "pal_jiangyunfan", "mtg_jiesi", "swd_lanyin", "pal_liumengli", "swd_muyun", "pal_nangonghuang", "swd_muyue", "pal_murongziying",
                    "swd_qiner", "pal_shenqishuang", "hs_taisi", "wangji", "pal_xingxuan", "xunyou", "hs_yelise", "pal_yuejinzhao", "pal_yueqi",
                    "gjqt_yuewuyi", "swd_yuxiaoxue", "ow_zhaliya", "zhangchunhua", "hs_zhihuanhua", "swd_zhiyin", "old_zhonghui", "gjqt_bailitusu",
                    "hs_barnes", "ow_dva", "swd_hengai", "pal_jushifang", "hs_kazhakusi", "hs_lafamu", "ow_liekong", "hs_lreno", "pal_mingxiu",
                    "swd_murongshi", "gw_oudimu", "gjqt_ouyangshaogong", "hs_pyros", "qinmi", "gw_sanhanya", "hs_selajin", "swd_shuwaner",
                    "swd_situqiang", "hs_xialikeer", "pal_xuejian", "swd_yuchiyanhong", "swd_yuwentuo", "swd_zhaoyun", "zhugeliang", "gw_aigeleisi",
                    "gw_aimin", "gjqt_aruan", "hs_aya", "swd_cheyun", "swd_chenjingchou", "gw_diandian", "swd_huzhongxian", "hs_jinglinglong",
                    "hs_kaituozhe", "hs_kalimosi", "gw_linjing", "ow_luxiao", "re_luxun", "hs_morgl", "swd_sikongyu", "hs_sthrall", "sunquan",
                    "sunshangxiang", "gw_yioufeisisp", "gw_yisilinni", "hs_yogg", "hs_ysera", "pal_yuntianhe", "zhugejin", "zhugeke", "gw_zhuoertan",
                    "hs_anduin", "swd_anka", "ow_banzang", "ow_chanyata", "diaochan", "swd_duguningke", "sp_diaochan", "hetaihou", "ns_huamulan",
                    "swd_huanglei", "swd_huanyuanzhi", "re_huatuo", "gw_huoge", "pal_jiangcheng", "yj_jushou", "swd_kendi", "yxs_libai",
                    "mtg_lilianna", "xin_liru", "liuxie", "pal_lixiaoyao", "pal_longkui", "ns_nanhua", "swd_qi", "swd_septem", "gw_shasixiwusi",
                    "ow_tianshi", "swd_weida", "gjqt_xiayize", "swd_xiyan", "hs_xsylvanas", "hs_yelinlonghou", "ow_yuanshi", "zuoci"];
                var vintage = ['tianjian', 'shuiyun', 'zhuyue', 'zhimeng', 'poyun', 'qianfang', 'xfenxin', 'danqing', 'ywuhun', 'tianwu', 'xuelu',
                    'shahun', 'yuling', 'duhun', 'liaoyuan', 'touxi', 'wangchen', 'poyue', 'kunlunjing', 'huanhun', 'yunchou', 'tuzhen', 'cyqiaoxie',
                    'mufeng', 'duanyi', 'guozao', 'yaotong', 'pozhen', 'tanlin', 'susheng', 'jikong', 'shouyin', 'jilve', 'hxunzhi', 'huodan', 'shanxian',
                    'ziyu', 'kuoyin', 'feiren', 'zihui', 'jidong', 'baoxue', 'aqianghua', 'maoding', 'bfengshi', 'zhongdun', 'pingzhang', 'maichong',
                    'guozai', 'jingxiang', 'yuelu', 'liechao', 'fengnu', 'hanshuang', 'enze', 'malymowang', 'xshixin', 'qingzun'];
                var favmodes = ["versus|three", "versus|four", "versus|two", "chess|combat"];
                for (var i = 0; i < mode.length; i++) {
                    game.saveConfig(mode[i] + '_banned', banned);
                    game.saveConfig(mode[i] + '_bannedcards', bannedcards);
                }
                var characters = lib.config.all.characters.slice(0);
                characters.remove('standard');
                characters.remove('old');
                game.saveConfig('vintageSkills', vintage);
                game.saveConfig('favouriteCharacter', favs);
                game.saveConfig('favouriteMode', favmodes);
                game.saveConfig('theme', 'simple');
                game.saveConfig('player_border', 'slim');
                game.saveConfig('cards', lib.config.all.cards);
                game.saveConfig('characters', characters);
                game.saveConfig('change_skin', false);
                game.saveConfig('show_splash', 'off');
                game.saveConfig('show_favourite', false);
                game.saveConfig('animation', false);
                game.saveConfig('hover_all', false);
                game.saveConfig('asset_version', 'v1.9');
                game.saveConfig('plays', ['cardpile']);
                game.saveConfig('skip_shan', false);
                game.saveConfig('tao_enemy', true);
                game.saveConfig('layout', 'long2');
                game.saveConfig('hp_style', 'ol');
                game.saveConfig('background_music', 'music_off');
                game.saveConfig('background_audio', false);
                game.saveConfig('background_speak', false);
                game.saveConfig('show_volumn', false);
                game.saveConfig('show_replay', true);
                game.saveConfig('autostyle', true);
                game.saveConfig('debug', true);
                game.saveConfig('dev', true);
                if (!lib.device) {
                    game.saveConfig('sync_speed', false);
                }
                game.reload();
            },
            o: function () {
                ui.arena.classList.remove('observe');
            },
            pt: function () {
                var list = Array.from(arguments);
                while (list.length) {
                    var card = cheat.gn(list.pop());
                    if (card)
                        ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
                }
            },
            q: function () {
                if (arguments.length == 0) {
                    var style = ui.css.card_style;
                    if (lib.config.card_style != 'simple') {
                        lib.config.card_style = 'simple';
                        ui.css.card_style = lib.init.css(lib.assetURL + 'theme/style/card', 'simple');
                    }
                    else {
                        lib.config.card_style = 'default';
                        ui.css.card_style = lib.init.css(lib.assetURL + 'theme/style/card', 'default');
                    }
                    style.remove();
                }
                else {
                    for (var i = 0; i < arguments.length; i++) {
                        cheat.g(arguments[i]);
                    }
                }
                ui.arena.classList.remove('selecting');
                ui.arena.classList.remove('tempnoe');
            },
            p: function (name, i, skin) {
                var list = ['swd', 'hs', 'pal', 'gjqt', 'ow', 'gw'];
                if (!lib.character[name]) {
                    for (var j = 0; j < list.length; j++) {
                        if (lib.character[list[j] + '_' + name]) {
                            name = list[j] + '_' + name;
                            break;
                        }
                    }
                }
                if (skin) {
                    lib.config.skin[name] = skin;
                }
                var target;
                if (typeof i == 'number') {
                    target = game.players[i];
                }
                else {
                    target = game.me.next;
                }
                if (!lib.character[name]) {
                    target.node.avatar.setBackground(name, 'character');
                    target.node.avatar.show();
                }
                else {
                    target.init(name);
                }
                if (i === true) {
                    if (lib.config.layout == 'long2') {
                        lib.init.layout('mobile');
                    }
                    else {
                        lib.init.layout('long2');
                    }
                }
            },
            e: function () {
                var cards = [], target;
                for (var i = 0; i < arguments.length; i++) {
                    if (get.itemtype(arguments[i]) == 'player') {
                        target = arguments[i];
                    }
                    else {
                        cards.push(game.createCard(arguments[i]));
                    }
                }
                if (!cards.length) {
                    cards.push(game.createCard('qilin'));
                    cards.push(game.createCard('bagua'));
                    cards.push(game.createCard('dilu'));
                    cards.push(game.createCard('chitu'));
                    cards.push(game.createCard('muniu'));
                }
                target = target || game.me;
                for (var i = 0; i < cards.length; i++) {
                    var card = target.getEquip(cards[i]);
                    if (card) {
                        card.discard();
                        target.removeEquipTrigger(card);
                    }
                    target.$equip(cards[i]);
                }
            },
            c: function () {
                (function () {
                    var a = 0, b = 0, c = 0, d = 0;
                    var aa = 0, bb = 0, cc = 0, dd = 0;
                    var sa = 0, sb = 0, sc = 0, sd = 0;
                    var sha = 0, shan = 0, tao = 0, jiu = 0, wuxie = 0, heisha = 0, hongsha = 0;
                    var num = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0 };
                    for (let i in lib.card) {
                        if (get.objtype(lib.card[i]) == 'object' && lib.translate[i + '_info']) {
                            switch (lib.card[i].type) {
                                case 'basic':
                                    a++;
                                    break;
                                case 'trick':
                                    b++;
                                    break;
                                case 'equip':
                                    c++;
                                    break;
                                default:
                                    d++;
                                    break;
                            }
                        }
                    }
                    for (let i = 0; i < lib.card.list.length; i++) {
                        if (typeof lib.card[lib.card.list[i][2]] == 'object') {
                            switch (lib.card[lib.card.list[i][2]].type) {
                                case 'basic':
                                    aa++;
                                    break;
                                case 'trick':
                                case 'delay':
                                    bb++;
                                    break;
                                case 'equip':
                                    cc++;
                                    break;
                                default:
                                    dd++;
                                    break;
                            }
                            switch (lib.card.list[i][0]) {
                                case 'heart':
                                    sa++;
                                    break;
                                case 'diamond':
                                    sb++;
                                    break;
                                case 'club':
                                    sc++;
                                    break;
                                case 'spade':
                                    sd++;
                                    break;
                            }
                            if (lib.card.list[i][2] == 'sha') {
                                sha++;
                                if (lib.card.list[i][0] == 'club' || lib.card.list[i][0] == 'spade') {
                                    heisha++;
                                }
                                else {
                                    hongsha++;
                                }
                            }
                            if (lib.card.list[i][2] == 'shan') {
                                shan++;
                            }
                            if (lib.card.list[i][2] == 'tao') {
                                tao++;
                            }
                            if (lib.card.list[i][2] == 'jiu') {
                                jiu++;
                            }
                            if (lib.card.list[i][2] == 'wuxie') {
                                wuxie++;
                            }
                            num[lib.card.list[i][1]]++;
                        }
                    }
                    var str = '基本牌' + aa + '； ' + '锦囊牌' + bb + '； ' + '装备牌' + cc + '； ' + '其它牌' + dd;
                    console.log(str);
                    str = '红桃牌' + sa + '； ' + '方片牌' + sb + '； ' + '梅花牌' + sc + '； ' + '黑桃牌' + sd;
                    console.log(str);
                    str = '杀' + sha + '； ' + '黑杀' + heisha + '； ' + '红杀' + hongsha + '； ' + '闪' + shan + '； ' + '桃' + tao + '； ' + '酒' + jiu + '； ' + '无懈' + wuxie;
                    console.log(str);
                    if (arguments[1]) {
                        for (var i = 1; i <= 13; i++) {
                            if (i < 10) {
                                console.log(i + ' ', num[i]);
                            }
                            else {
                                console.log(i, num[i]);
                            }
                        }
                    }
                    var arr = [];
                    for (var i = 1; i <= 13; i++) {
                        arr.push(num[i]);
                    }
                    console.log((a + b + c + d) + '/' + (aa + bb + cc + dd), ...arr);
                }());
            },
            id: function () {
                game.showIdentity();
            },
            b: function () {
                if (!ui.dialog || !ui.dialog.buttons)
                    return;
                for (var i = 0; i < Math.min(arguments.length, ui.dialog.buttons.length); i++) {
                    ui.dialog.buttons[i].link = arguments[i];
                }
            },
            uy: function (me) {
                if (me) {
                    game.me.useCard({ name: 'spell_yexinglanghun' }, game.me);
                }
                else {
                    var enemy = game.me.getEnemy();
                    enemy.useCard({ name: 'spell_yexinglanghun' }, enemy);
                }
            },
            gs: function (name, act) {
                var card = game.createCard('spell_' + (name || 'yexinglanghun'));
                game.me.node.handcards1.appendChild(card);
                if (!act) {
                    game.me.actused = -99;
                }
                ui.updatehl();
                delete _status.event._cardChoice;
                delete _status.event._targetChoice;
                delete _status.event._skillChoice;
                setTimeout(game.check, 300);
            },
            gc: function (name, act) {
                var card = game.createCard('stone_' + (name || 'falifulong') + '_stonecharacter');
                game.me.node.handcards1.appendChild(card);
                if (!act) {
                    game.me.actused = -99;
                }
                ui.updatehl();
                delete _status.event._cardChoice;
                delete _status.event._targetChoice;
                delete _status.event._skillChoice;
                setTimeout(game.check, 300);
            },
            a: function (bool) {
                if (lib.config.test_game) {
                    game.saveConfig('test_game');
                }
                else {
                    if (bool) {
                        if (typeof bool === 'string') {
                            game.saveConfig('test_game', bool);
                        }
                        else {
                            game.saveConfig('test_game', '_');
                        }
                    }
                    else {
                        game.saveConfig('test_game', true);
                    }
                }
                game.reload();
            },
            as: function () {
                ui.window.classList.remove('testing');
                var bg = ui.window.querySelector('.pausedbg');
                if (bg) {
                    bg.remove();
                }
            },
            uj: function () {
                cheat.e('qilin');
                game.me.next.useCard({ name: 'jiedao' }, [game.me, game.me.previous]);
            },
            u: function () {
                var card = { name: 'sha' }, source = game.me.next, targets = [];
                for (var i = 0; i < arguments.length; i++) {
                    if (get.itemtype(arguments[i]) == 'player') {
                        source = arguments[i];
                    }
                    else if (Array.isArray(arguments[i])) {
                        targets = arguments[i];
                    }
                    else if (typeof arguments[i] == 'object' && arguments[i]) {
                        card = arguments[i];
                    }
                    else if (typeof arguments[i] == 'string') {
                        card = { name: arguments[i] };
                    }
                }
                if (!targets.length)
                    targets.push(game.me);
                source.useCard(game.createCard(card.name, card.suit, card.number, card.nature), targets);
            },
            r: function (bool) {
                var list = ['s', 'ap', 'a', 'am', 'bp', 'b', 'bm', 'c', 'd'];
                var str = '';
                for (let i = 0; i < list.length; i++) {
                    if (str)
                        str += ' 、 ';
                    str += list[i] + '-' + lib.rank[list[i]].length;
                }
                console.log(str);
                for (let i in lib.characterPack) {
                    if (!bool && lib.config.all.sgscharacters.contains(i))
                        continue;
                    let map = {};
                    let str = '';
                    for (let j in lib.characterPack[i]) {
                        let rank = get.rank(j);
                        if (!map[rank]) {
                            map[rank] = 1;
                        }
                        else {
                            map[rank]++;
                        }
                    }
                    for (let j = 0; j < list.length; j++) {
                        if (map[list[j]]) {
                            if (str)
                                str += ' 、 ';
                            str += list[j] + '-' + map[list[j]];
                        }
                    }
                    if (str) {
                        console.log(lib.translate[i + '_character_config'] + '：' + str);
                    }
                }
                {
                    let list = lib.rank.s.concat(lib.rank.ap).concat(lib.rank.a).concat(lib.rank.am).
                        concat(lib.rank.bp).concat(lib.rank.b).concat(lib.rank.bm).concat(lib.rank.c).concat(lib.rank.d);
                    for (let i in lib.character) {
                        if (lib.config.forbidai.contains(i))
                            continue;
                        if (i.indexOf('boss_') != 0 && i.indexOf('tafang_') != 0 && !list.contains(i))
                            console.log(get.translation(i), i);
                    }
                }
            },
            h: function (player) {
                console.log(get.translation(player.getCards('h')));
            },
            g: function () {
                for (var i = 0; i < arguments.length; i++) {
                    if (i > 0 && typeof arguments[i] == 'number') {
                        for (var j = 0; j < arguments[i] - 1; j++) {
                            cheat.gx(arguments[i - 1]);
                        }
                    }
                    else {
                        cheat.gx(arguments[i]);
                    }
                }
            },
            ga: function (type) {
                for (var i in lib.card) {
                    if (lib.card[i].type == type || lib.card[i].subtype == type) {
                        cheat.g(i);
                    }
                }
            },
            gg: function () {
                for (var i = 0; i < game.players.length; i++) {
                    for (var j = 0; j < arguments.length; j++) {
                        cheat.gx(arguments[j], game.players[i]);
                    }
                }
            },
            gx: function (name, target) {
                target = target || game.me;
                var card = cheat.gn(name);
                if (!card)
                    return;
                target.node.handcards1.appendChild(card);
                delete _status.event._cardChoice;
                delete _status.event._targetChoice;
                delete _status.event._skillChoice;
                game.check();
                target.update();
                ui.updatehl();
            },
            gn: function (name) {
                var nature = null;
                var suit = null;
                var suits = ['club', 'spade', 'diamond', 'heart'];
                for (var i = 0; i < suits.length; i++) {
                    if (name.indexOf(suits[i]) == 0) {
                        suit = suits[i];
                        name = name.slice(suits[i].length);
                        break;
                    }
                }
                if (name.indexOf('red') == 0) {
                    name = name.slice(3);
                    suit = ['diamond', 'heart'].randomGet();
                }
                if (name.indexOf('black') == 0) {
                    name = name.slice(5);
                    suit = ['spade', 'club'].randomGet();
                }
                if (name == 'huosha') {
                    name = 'sha';
                    nature = 'fire';
                }
                else if (name == 'leisha') {
                    name = 'sha';
                    nature = 'thunder';
                }
                else if (name == 'haisha') {
                    name = 'sha';
                    nature = 'ocean';
                }
                else if (name == 'yamisha') {
                    name = 'sha';
                    nature = 'yami';
                }
                else if (name == 'haitao') {
                    name = 'tao';
                    nature = 'ocean';
                }
                if (!lib.card[name]) {
                    return null;
                }
                return game.createCard(name, suit, null, nature);
            },
            ge: function (target) {
                if (target) {
                    cheat.gx('zhuge', target);
                    cheat.gx('qinglong', target);
                    cheat.gx('bagua', target);
                    cheat.gx('dilu', target);
                    cheat.gx('chitu', target);
                    cheat.gx('muniu', target);
                }
                else {
                    cheat.g('zhuge');
                    cheat.g('qinglong');
                    cheat.g('bagua');
                    cheat.g('dilu');
                    cheat.g('chitu');
                    cheat.g('muniu');
                }
            },
            gj: function () {
                cheat.g('shandian');
                cheat.g('huoshan');
                cheat.g('hongshui');
                cheat.g('lebu');
                cheat.g('bingliang');
                cheat.g('guiyoujie');
            },
            gf: function () {
                for (var i in lib.card) {
                    if (lib.card[i].type == 'food') {
                        cheat.g(i);
                    }
                }
            },
            d: function (num, target) {
                if (num == undefined)
                    num = 1;
                var cards = get.cards(num);
                for (var i = 0; i < num; i++) {
                    var card = cards[i];
                    game.me.node.handcards1.appendChild(card);
                    delete _status.event._cardChoice;
                    delete _status.event._targetChoice;
                    delete _status.event._skillChoice;
                    game.check();
                    game.me.update();
                    ui.updatehl();
                }
            },
            s: function () {
                for (var i = 0; i < arguments.length; i++) {
                    game.me.addSkill(arguments[i], true);
                }
                delete _status.event._cardChoice;
                delete _status.event._targetChoice;
                delete _status.event._skillChoice;
                game.check();
            },
            t: function (num) {
                if (game.players.contains(num)) {
                    num = game.players.indexOf(num);
                }
                if (num == undefined) {
                    for (var i = 0; i < game.players.length; i++)
                        cheat.t(i);
                    return;
                }
                var player = game.players[num];
                var cards = player.getCards('hej');
                for (var i = 0; i < cards.length; i++) {
                    cards[i].discard();
                }
                player.removeEquipTrigger();
                player.update();
            },
            to: function () {
                for (var i = 0; i < game.players.length; i++) {
                    if (game.players[i] != game.me) {
                        cheat.t(i);
                    }
                }
            },
            tm: function () {
                for (var i = 0; i < game.players.length; i++) {
                    if (game.players[i] == game.me) {
                        cheat.t(i);
                    }
                }
            },
            k: function (i) {
                if (i == undefined)
                    i = 1;
                game.players[i].hp = 1;
                cheat.t(i);
                cheat.g('juedou');
            },
            z: function (name) {
                switch (name) {
                    case 'cc':
                        name = 're_caocao';
                        break;
                    case 'lb':
                        name = 're_liubei';
                        break;
                    case 'sq':
                        name = 'sunquan';
                        break;
                    case 'dz':
                        name = 'dongzhuo';
                        break;
                    case 'ys':
                        name = 're_yuanshao';
                        break;
                    case 'zj':
                        name = 'sp_zhangjiao';
                        break;
                    case 'ls':
                        name = 'liushan';
                        break;
                    case 'sc':
                        name = 'sunce';
                        break;
                    case 'cp':
                        name = 'caopi';
                        break;
                    case 'cr':
                        name = 'caorui';
                        break;
                    case 'sx':
                        name = 'sunxiu';
                        break;
                    case 'lc':
                        name = 'liuchen';
                        break;
                    case 'sh':
                        name = 'sunhao';
                        break;
                }
                game.zhu.init(name);
                game.zhu.maxHp++;
                game.zhu.hp++;
                game.zhu.update();
            },
        },
        translate: {},
        element: {
            content: content_1.default,
            card: {
                addGaintag: function (gaintag) {
                    if (Array.isArray(gaintag))
                        this.gaintag = gaintag.slice(0);
                    else
                        this.gaintag.add(gaintag);
                    var str = '';
                    for (var gi = 0; gi < this.gaintag.length; gi++) {
                        str += get.translation(this.gaintag[gi]);
                        if (gi < this.gaintag.length - 1)
                            str += ' ';
                    }
                    this.node.gaintag.innerHTML = str;
                },
                removeGaintag: function (tag) {
                    if (tag === true) {
                        if (this.gaintag && this.gaintag.length || this.node.gaintag.innerHTML.length)
                            this.addGaintag([]);
                    }
                    else if (this.hasGaintag(tag)) {
                        this.gaintag.remove(tag);
                        this.addGaintag(this.gaintag);
                    }
                },
                hasGaintag: function (tag) {
                    if (['ming_', 'an_'].contains(tag)) {
                        return this.gaintag && this.gaintag.filter(function (gain) {
                            return gain.indexOf(tag) == 0;
                        }).length;
                    }
                    else
                        return this.gaintag && this.gaintag.contains(tag);
                },
                init: function (card) {
                    if (Array.isArray(card)) {
                        if (card[2] == 'huosha') {
                            card[2] = 'sha';
                            card[3] = 'fire';
                        }
                        if (card[2] == 'leisha') {
                            card[2] = 'sha';
                            card[3] = 'thunder';
                        }
                        if (card[2] == 'kamisha') {
                            card[2] = 'sha';
                            card[3] = 'kami';
                        }
                        if (card[2] == 'icesha') {
                            card[2] = 'sha';
                            card[3] = 'ice';
                        }
                        if (card[2] == 'haisha') {
                            card[2] = 'sha';
                            card[3] = 'ocean';
                        }
                        if (card[2] == 'yamisha') {
                            card[2] = 'sha';
                            card[3] = 'yami';
                        }
                        if (card[2] == 'haitao') {
                            card[2] = 'tao';
                            card[3] = 'ocean';
                        }
                        if (card[2] == 'haijiu') {
                            card[2] = 'jiu';
                            card[3] = 'ocean';
                        }
                    }
                    else if (typeof card == 'object') {
                        card = [card.suit, card.number, card.name, card.nature];
                        card[5] = card.specialEffects;
                    }
                    var cardnum = card[1] || '';
                    if (parseInt(cardnum) == cardnum)
                        cardnum = parseInt(cardnum);
                    if ([1, 11, 12, 13, 14].contains(cardnum)) {
                        cardnum = { '1': 'A', '11': 'J', '12': 'Q', '13': 'K', '14': '★' }[cardnum];
                    }
                    if (!lib.card[card[2]]) {
                        lib.card[card[2]] = {};
                    }
                    var info = lib.card[card[2]];
                    if (info.global && !this.classList.contains('button')) {
                        if (Array.isArray(info.global)) {
                            while (info.global.length) {
                                game.addGlobalSkill(info.global.shift());
                            }
                        }
                        else if (typeof info.global == 'string') {
                            game.addGlobalSkill(info.global);
                        }
                        delete info.global;
                    }
                    if (this.name) {
                        this.classList.remove('epic');
                        this.classList.remove('legend');
                        this.classList.remove('gold');
                        this.classList.remove('unique');
                        this.style.background = '';
                        var subtype = get.subtype(this);
                        if (subtype) {
                            this.classList.remove(subtype);
                        }
                    }
                    if (info.epic) {
                        this.classList.add('epic');
                    }
                    else if (info.legend) {
                        this.classList.add('legend');
                    }
                    else if (info.gold) {
                        this.classList.add('gold');
                    }
                    else if (info.unique) {
                        this.classList.add('unique');
                    }
                    var bg = card[2];
                    if (info.cardimage) {
                        bg = info.cardimage;
                    }
                    var img = lib.card[bg].image;
                    if (img) {
                        if (img.indexOf('db:') == 0) {
                            img = img.slice(3);
                        }
                        else if (img.indexOf('ext:') != 0) {
                            img = null;
                        }
                    }
                    this.classList.remove('fullskin');
                    this.classList.remove('fullimage');
                    this.classList.remove('fullborder');
                    this.dataset.cardName = card[2];
                    this.dataset.cardType = info.type || '';
                    this.dataset.cardSubype = info.subtype || '';
                    this.dataset.cardMultitarget = info.multitarget ? '1' : '0';
                    this.node.name.dataset.nature = '';
                    this.node.info.classList.remove('red');
                    if (!lib.config.hide_card_image && lib.card[bg].fullskin) {
                        this.classList.add('fullskin');
                        if (img) {
                            if (img.indexOf('ext:') == 0) {
                                this.node.image.setBackgroundImage(img.replace(/ext:/, 'extension/'));
                            }
                            else {
                                this.node.image.setBackgroundDB(img);
                            }
                        }
                        else {
                            if (lib.card[bg].modeimage) {
                                this.node.image.setBackgroundImage('image/mode/' + lib.card[bg].modeimage + '/card/' + bg + '.png');
                            }
                            else {
                                if (bg.indexOf('rm_') == 0) {
                                    var bg = bg.slice(3);
                                    this.node.image.setBackgroundImage('image/replace/' + bg + '.png');
                                }
                                else if (lib.config.replace_image) {
                                    this.node.image.setBackgroundImage('image/replace/' + bg + '.png');
                                }
                                else {
                                    this.node.image.setBackgroundImage('image/card/' + bg + '.png');
                                }
                            }
                        }
                    }
                    else if (lib.card[bg].image == 'background') {
                        if (card[3])
                            this.node.background.setBackground(bg + '_' + card[3], 'card');
                        else
                            this.node.background.setBackground(bg, 'card');
                    }
                    else if (lib.card[bg].fullimage) {
                        this.classList.add('fullimage');
                        if (img) {
                            if (img.indexOf('ext:') == 0) {
                                this.setBackgroundImage(img.replace(/ext:/, 'extension/'));
                                this.style.backgroundSize = 'cover';
                            }
                            else {
                                this.setBackgroundDB(img);
                            }
                        }
                        else if (lib.card[bg].image) {
                            if (lib.card[bg].image.indexOf('character:') == 0) {
                                this.setBackground(lib.card[bg].image.slice(10), 'character');
                            }
                            else {
                                this.setBackground(lib.card[bg].image);
                            }
                        }
                        else {
                            var cardPack = lib.cardPack['mode_' + get.mode()];
                            if (Array.isArray(cardPack) && cardPack.contains(bg)) {
                                this.setBackground('mode/' + get.mode() + '/card/' + bg);
                            }
                            else {
                                this.setBackground('card/' + bg);
                            }
                        }
                    }
                    else if (lib.card[bg].fullborder) {
                        this.classList.add('fullborder');
                        if (lib.card[bg].fullborder == 'gold') {
                            this.node.name.dataset.nature = 'metalmm';
                        }
                        else if (lib.card[bg].fullborder == 'silver') {
                            this.node.name.dataset.nature = 'watermm';
                        }
                        if (!this.node.avatar) {
                            this.node.avatar = ui.create.div('.cardavatar');
                            this.insertBefore(this.node.avatar, this.firstChild);
                        }
                        if (!this.node.framebg) {
                            this.node.framebg = ui.create.div('.cardframebg');
                            this.node.framebg.dataset.auto = lib.card[bg].fullborder;
                            this.insertBefore(this.node.framebg, this.firstChild);
                        }
                        if (img) {
                            if (img.indexOf('ext:') == 0) {
                                this.node.avatar.setBackgroundImage(img.replace(/ext:/, 'extension/'));
                                this.node.avatar.style.backgroundSize = 'cover';
                            }
                            else {
                                this.node.avatar.setBackgroundDB(img);
                            }
                        }
                        else if (lib.card[bg].image) {
                            if (lib.card[bg].image.indexOf('character:') == 0) {
                                this.node.avatar.setBackground(lib.card[bg].image.slice(10), 'character');
                            }
                            else {
                                this.node.avatar.setBackground(lib.card[bg].image);
                            }
                        }
                        else {
                            var cardPack = lib.cardPack['mode_' + get.mode()];
                            if (Array.isArray(cardPack) && cardPack.contains(bg)) {
                                this.node.avatar.setBackground('mode/' + get.mode() + '/card/' + bg);
                            }
                            else {
                                this.node.avatar.setBackground('card/' + bg);
                            }
                        }
                    }
                    else if (lib.card[bg].image == 'card') {
                        if (card[3])
                            this.setBackground(bg + '_' + card[3], 'card');
                        else
                            this.setBackground(bg, 'card');
                    }
                    else if (typeof lib.card[bg].image == 'string' && !lib.card[bg].fullskin) {
                        if (img) {
                            if (img.indexOf('ext:') == 0) {
                                this.setBackgroundImage(img.replace(/ext:/, 'extension/'));
                                this.style.backgroundSize = 'cover';
                            }
                            else {
                                this.setBackgroundDB(img);
                            }
                        }
                        else {
                            this.setBackground(lib.card[bg].image);
                        }
                    }
                    else {
                        this.node.background.innerHTML = lib.translate[bg + '_cbg'] || lib.translate[bg + '_bg'] || get.translation(bg)[0];
                        if (this.node.background.innerHTML.length > 1)
                            this.node.background.classList.add('tight');
                        else
                            this.node.background.classList.remove('tight');
                    }
                    if ((bg == 'wuxingpan' || !lib.card[bg].fullborder) && this.node.avatar && this.node.framebg) {
                        this.node.avatar.remove();
                        this.node.framebg.remove();
                        delete this.node.avatar;
                        delete this.node.framebg;
                    }
                    if (info.noname && !this.classList.contains('button')) {
                        this.node.name.style.display = 'none';
                    }
                    if (info.color) {
                        this.style.color = info.color;
                    }
                    if (info.textShadow) {
                        this.style.textShadow = info.textShadow;
                    }
                    if (info.opacity) {
                        this.node.info.style.opacity = info.opacity;
                        this.node.name.style.opacity = info.opacity;
                    }
                    if (info.modinfo) {
                        this.node.info.innerHTML = info.modinfo;
                    }
                    else {
                        this.node.info.innerHTML = get.translation(card[0]) + '<span> </span>' + cardnum;
                    }
                    if (info.addinfo) {
                        if (!this.node.addinfo) {
                            this.node.addinfo = ui.create.div('.range', this);
                        }
                        this.node.addinfo.innerHTML = info.addinfo;
                    }
                    else if (this.node.addinfo) {
                        this.node.addinfo.remove();
                        delete this.node.addinfo;
                    }
                    if (card[0] == 'heart' || card[0] == 'diamond') {
                        this.node.info.classList.add('red');
                    }
                    this.node.name.innerHTML = '';
                    this.node.image.className = 'image';
                    var name = get.translation(card[2]);
                    if (name.length == 1) {
                        if (card[3] == 'fire') {
                            name = '火' + name;
                            this.node.image.classList.add('fire');
                        }
                        else if (card[3] == 'thunder') {
                            name = '雷' + name;
                            this.node.image.classList.add('thunder');
                        }
                        else if (card[3] == 'kami') {
                            name = '神' + name;
                            this.node.image.classList.add('kami');
                        }
                        else if (card[3] == 'ice') {
                            name = '冰' + name;
                            this.node.image.classList.add('ice');
                        }
                        else if (card[3] == 'ocean') {
                            name = '海' + name;
                            this.node.image.classList.add('ocean');
                        }
                        else if (card[3] == 'yami') {
                            name = '暗' + name;
                            this.node.image.classList.add('yami');
                        }
                    }
                    else {
                        if (card[3] == 'fire') {
                            this.node.image.classList.add('fire');
                        }
                        else if (card[3] == 'thunder') {
                            this.node.image.classList.add('thunder');
                        }
                        else if (card[3] == 'kami') {
                            this.node.image.classList.add('kami');
                        }
                        else if (card[3] == 'ice') {
                            this.node.image.classList.add('ice');
                        }
                        else if (card[3] == 'ocean') {
                            name = name.replace(name.charAt(0), '海');
                            this.node.image.classList.add('ocean');
                        }
                        else if (card[3] == 'yami') {
                            name = name.replace(name.charAt(0), '暗');
                            this.node.image.classList.add('yami');
                        }
                    }
                    for (var i = 0; i < name.length; i++) {
                        this.node.name.innerHTML += name[i] + '<br/>';
                    }
                    if (name.length >= 5) {
                        this.node.name.classList.add('long');
                        if (name.length >= 7) {
                            this.node.name.classList.add('longlong');
                        }
                    }
                    this.node.name2.innerHTML = get.translation(card[0]) + cardnum + ' ' + name;
                    this.suit = card[0];
                    this.number = parseInt(card[1]) || 0;
                    this.name = card[2];
                    this.classList.add('card');
                    if (card[3]) {
                        if (lib.nature.contains(card[3]))
                            this.nature = card[3];
                        this.classList.add(card[3]);
                    }
                    else if (this.nature) {
                        this.classList.remove(this.nature);
                        delete this.nature;
                    }
                    if (info.subtype)
                        this.classList.add(info.subtype);
                    if (this.inits) {
                        for (var i = 0; i < lib.element.card.inits.length; i++) {
                            lib.element.card.inits[i](this);
                        }
                    }
                    if (typeof info.init == 'function')
                        info.init();
                    this.node.range.innerHTML = '';
                    switch (get.subtype(this)) {
                        case 'equip1':
                            let added = false;
                            if (lib.card[this.name] && lib.card[this.name].distance) {
                                let dist = lib.card[this.name].distance;
                                if (dist.attackFrom) {
                                    added = true;
                                    this.node.range.innerHTML = '范围: ' + (-dist.attackFrom + 1);
                                }
                            }
                            if (!added) {
                                this.node.range.innerHTML = '范围: 1';
                            }
                            break;
                        case 'equip3':
                            if (info.distance && info.distance.globalTo) {
                                this.node.range.innerHTML = '防御: ' + info.distance.globalTo;
                                this.node.name2.innerHTML += '+';
                            }
                            break;
                        case 'equip4':
                            if (info.distance && info.distance.globalFrom) {
                                this.node.range.innerHTML = '进攻: ' + (-info.distance.globalFrom);
                                this.node.name2.innerHTML += '-';
                            }
                            break;
                    }
                    let specialEffects = [];
                    if (Array.isArray(card[5])) {
                        specialEffects.addArray(card[5]);
                    }
                    if (this.node.image.parentNode.classList.length > 0)
                        this.node.image.parentNode.classList.forEach(element => {
                            if (element.indexOf("card_") != -1) {
                                this.node.image.parentNode.classList.remove(element);
                            }
                        });
                    if (specialEffects.length) {
                        for (let i = 0; i < specialEffects.length; i++) {
                            this.node.image.parentNode.classList.add(specialEffects[i]);
                        }
                        this.specialEffects = specialEffects;
                    }
                    if (_status.connectMode && !game.online && lib.cardOL && !this.cardid) {
                        this.cardid = get.id();
                        lib.cardOL[this.cardid] = this;
                    }
                    if (!_status.connectMode && !_status.video) {
                        this.cardid = get.id();
                    }
                    let tags = [];
                    if (Array.isArray(card[4])) {
                        tags.addArray(card[4]);
                    }
                    if (this.cardid) {
                        if (!_status.cardtag) {
                            _status.cardtag = {};
                        }
                        for (let i in _status.cardtag) {
                            if (_status.cardtag[i].contains(this.cardid)) {
                                tags.add(i);
                            }
                        }
                        if (tags.length) {
                            let tagstr = ' <span class="cardtag">';
                            for (let i = 0; i < tags.length; i++) {
                                let tag = tags[i];
                                if (!_status.cardtag[tag]) {
                                    _status.cardtag[tag] = [];
                                }
                                _status.cardtag[tag].add(this.cardid);
                                tagstr += lib.translate[tag + '_tag'];
                            }
                            tagstr += '</span>';
                            this.node.range.innerHTML += tagstr;
                        }
                    }
                    return this;
                },
                updateTransform: function (bool, delay) {
                    if (delay) {
                        var that = this;
                        setTimeout(function () {
                            that.updateTransform(that.classList.contains('selected'));
                        }, delay);
                    }
                    else {
                        if (_status.event.player != game.me)
                            return;
                        if (this._transform && this.parentNode && this.parentNode.parentNode &&
                            this.parentNode.parentNode.parentNode == ui.me &&
                            (!_status.mousedown || _status.mouseleft) &&
                            (!this.parentNode.parentNode.classList.contains('scrollh') || (game.layout == 'long2' || game.layout == 'nova'))) {
                            if (bool) {
                                this.style.transform = this._transform + ' translateY(-20px)';
                            }
                            else {
                                this.style.transform = this._transform || '';
                            }
                        }
                    }
                },
                aiexclude: function () {
                    _status.event._aiexclude.add(this);
                },
                getSource: function (name) {
                    if (this.name == name)
                        return true;
                    var info = lib.card[this.name];
                    if (info && Array.isArray(info.source)) {
                        return info.source.contains(name);
                    }
                    return false;
                },
                moveDelete: function (player) {
                    this.fixed = true;
                    if (!this._listeningEnd || this._transitionEnded) {
                        this.moveTo(player);
                        var that = this;
                        setTimeout(function () {
                            that.delete();
                        }, 200);
                    }
                    else {
                        this._onEndMoveDelete = player;
                    }
                },
                moveTo: function (player) {
                    this.fixed = true;
                    var dx, dy;
                    if (this.classList.contains('center')) {
                        var nx = [50, -52];
                        var ny = [50, -52];
                        nx = nx[0] * ui.arena.offsetWidth / 100 + nx[1];
                        ny = ny[0] * ui.arena.offsetHeight / 100 + ny[1];
                        dx = player.getLeft() + player.offsetWidth / 2 - 52 - nx;
                        dy = player.getTop() + player.offsetHeight / 2 - 52 - ny;
                    }
                    else {
                        this.style.left = this.offsetLeft + 'px';
                        this.style.top = this.offsetTop + 'px';
                        dx = player.getLeft() + player.offsetWidth / 2 - 52 - this.offsetLeft;
                        dy = player.getTop() + player.offsetHeight / 2 - 52 - this.offsetTop;
                    }
                    if (get.is.mobileMe(player)) {
                        dx += get.cardOffset();
                        if (ui.arena.classList.contains('oblongcard')) {
                            dy -= 16;
                        }
                    }
                    if (this.style.transform && this.style.transform != 'none' && this.style.transform.indexOf('translate') == -1) {
                        this.style.transform += ' translate(' + dx + 'px,' + dy + 'px)';
                    }
                    else {
                        this.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
                    }
                    return this;
                },
                copy: function () {
                    var node = this.cloneNode(true);
                    node.style.transform = '';
                    node.name = this.name;
                    node.suit = this.suit;
                    node.number = this.number;
                    node.classList.remove('hidden');
                    node.classList.remove('start');
                    node.classList.remove('thrown');
                    node.classList.remove('selectable');
                    node.classList.remove('selected');
                    node.classList.remove('removing');
                    node.classList.remove('drawinghidden');
                    node.classList.remove('glows');
                    node.node = {
                        name: node.querySelector('.name'),
                        info: node.querySelector('.info'),
                        intro: node.querySelector('.intro'),
                        background: node.querySelector('.background'),
                        image: node.querySelector('.image'),
                        gaintag: node.querySelector('.gaintag'),
                    };
                    node.node.gaintag.innerHTML = '';
                    var clone = true;
                    var position;
                    for (var i = 0; i < arguments.length; i++) {
                        if (typeof arguments[i] == 'string')
                            node.classList.add(arguments[i]);
                        else if (get.objtype(arguments[i]) == 'div')
                            position = arguments[i];
                        else if (typeof arguments[i] == 'boolean')
                            clone = arguments[i];
                    }
                    node.moveTo = lib.element.card.moveTo;
                    node.moveDelete = lib.element.card.moveDelete;
                    if (clone)
                        this.clone = node;
                    if (position)
                        position.appendChild(node);
                    return node;
                },
                uncheck: function (skill) {
                    if (skill)
                        this._uncheck.add(skill);
                    this.classList.add('uncheck');
                },
                recheck: function (skill) {
                    if (skill)
                        this._uncheck.remove(skill);
                    else
                        this._uncheck.length = 0;
                    if (this._uncheck.length == 0)
                        this.classList.remove('uncheck');
                },
                discard: function (bool) {
                    if (!this.destroyed) {
                        ui.discardPile.appendChild(this);
                    }
                    this.fix();
                    this.classList.remove('glow');
                    if (bool === false) {
                        ui.cardPile.insertBefore(this, ui.cardPile.childNodes[Math.floor(Math.random() * ui.cardPile.childNodes.length)]);
                    }
                    else {
                        if (_status.discarded) {
                            _status.discarded.add(this);
                        }
                    }
                },
                hasTag: function (tag) {
                    if (this.cardid && _status.cardtag && _status.cardtag[tag] && _status.cardtag[tag].contains(this.cardid)) {
                        return true;
                    }
                    return false;
                },
                hasPosition: function () {
                    return ['h', 'e', 'j'].contains(get.position(this));
                },
                isInPile: function () {
                    return ['c', 'd'].contains(get.position(this));
                }
            },
            player: {
                inits: {}
            },
            button: {
                exclude: function () {
                    if (_status.event.excludeButton == undefined) {
                        _status.event.excludeButton = [];
                    }
                    _status.event.excludeButton.add(this);
                }
            },
            dialog: {
                add: function (item, noclick, zoom) {
                    if (typeof item == 'string') {
                        if (item.indexOf('###') == 0) {
                            var items = item.slice(3).split('###');
                            this.add(items[0], noclick, zoom);
                            this.addText(items[1], items[1].length <= 20, zoom);
                        }
                        else if (noclick) {
                            var strstr = item;
                            item = ui.create.div('', this.content);
                            item.innerHTML = strstr;
                        }
                        else {
                            item = ui.create.caption(item, this.content);
                        }
                    }
                    else if (get.objtype(item) == 'div') {
                        this.content.appendChild(item);
                    }
                    else if (get.itemtype(item) == 'cards') {
                        var buttons = ui.create.div('.buttons', this.content);
                        if (zoom)
                            buttons.classList.add('smallzoom');
                        this.buttons = this.buttons.concat(ui.create.buttons(item, 'card', buttons, noclick));
                    }
                    else if (get.itemtype(item) == 'players') {
                        var buttons = ui.create.div('.buttons', this.content);
                        if (zoom)
                            buttons.classList.add('smallzoom');
                        this.buttons = this.buttons.concat(ui.create.buttons(item, 'player', buttons, noclick));
                    }
                    else {
                        var buttons = ui.create.div('.buttons', this.content);
                        if (zoom)
                            buttons.classList.add('smallzoom');
                        this.buttons = this.buttons.concat(ui.create.buttons(item[0], item[1], buttons, noclick));
                    }
                    if (this.buttons.length) {
                        if (this.forcebutton !== false)
                            this.forcebutton = true;
                        if (this.buttons.length > 3 || (zoom && this.buttons.length > 5)) {
                            this.classList.remove('forcebutton-auto');
                        }
                        else if (!this.noforcebutton) {
                            this.classList.add('forcebutton-auto');
                        }
                    }
                    ui.update();
                    return item;
                },
                addText: function (str, center) {
                    if (center !== false) {
                        this.add('<div class="text center">' + str + '</div>');
                    }
                    else {
                        this.add('<div class="text">' + str + '</div>');
                    }
                    return this;
                },
                addSmall: function (item, noclick) {
                    return this.add(item, noclick, true);
                },
                addAuto: function (content) {
                    if (content && content.length > 4 && !this._hovercustomed) {
                        this.addSmall(content);
                    }
                    else {
                        this.add(content);
                    }
                },
                open: function () {
                    if (this.noopen)
                        return;
                    for (var i = 0; i < ui.dialogs.length; i++) {
                        if (ui.dialogs[i] == this) {
                            this.show();
                            this.refocus();
                            ui.dialogs.remove(this);
                            ui.dialogs.unshift(this);
                            ui.update();
                            return this;
                        }
                        if (ui.dialogs[i].static)
                            ui.dialogs[i].unfocus();
                        else
                            ui.dialogs[i].hide();
                    }
                    ui.dialog = this;
                    var translate;
                    if (lib.config.remember_dialog && lib.config.dialog_transform && !this.classList.contains('fixed')) {
                        translate = lib.config.dialog_transform;
                        this._dragtransform = translate;
                        this.style.transform = 'translate(' + translate[0] + 'px,' + translate[1] + 'px) scale(0.8)';
                    }
                    else {
                        this.style.transform = 'scale(0.8)';
                    }
                    this.style.transitionProperty = 'opacity,transform';
                    this.style.opacity = 0;
                    ui.arena.appendChild(this);
                    ui.dialogs.unshift(this);
                    ui.update();
                    ui.refresh(this);
                    if (lib.config.remember_dialog && lib.config.dialog_transform && !this.classList.contains('fixed')) {
                        this.style.transform = 'translate(' + translate[0] + 'px,' + translate[1] + 'px) scale(1)';
                    }
                    else {
                        this.style.transform = 'scale(1)';
                    }
                    this.style.opacity = 1;
                    var that = this;
                    setTimeout(function () {
                        that.style.transitionProperty = '';
                    }, 500);
                    return this;
                },
                close: function () {
                    ui.dialogs.remove(this);
                    this.delete();
                    if (ui.dialogs.length > 0) {
                        ui.dialog = ui.dialogs[0];
                        ui.dialog.show();
                        ui.dialog.refocus();
                        ui.update();
                    }
                    return this;
                },
                setCaption: function (str) {
                    this.querySelector('.caption').innerHTML = str;
                    return this;
                }
            },
            control: {
                open: function () {
                    ui.control.insertBefore(this, _status.createControl || ui.confirm);
                    ui.controls.unshift(this);
                    if (this.childNodes.length) {
                        this.style.transition = 'opacity 0.5s';
                        ui.refresh(this);
                        this.style.transform = 'translateX(-' + (this.offsetWidth / 2) + 'px)';
                        this.style.opacity = 1;
                        ui.refresh(this);
                        this.style.transition = '';
                    }
                    else {
                        this.animate('controlpressdownx', 500);
                    }
                    ui.updatec();
                    return this;
                },
                add: function (item) {
                    var node = document.createElement('div');
                    this.appendChild(node);
                    node.link = item;
                    node.innerHTML = get.translation(item);
                    node.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', ui.click.control);
                },
                close: function () {
                    this.animate('controlpressdownx', 500);
                    ui.controls.remove(this);
                    this.delete();
                    setTimeout(ui.updatec, 100);
                    if (ui.confirm == this)
                        delete ui.confirm;
                    if (ui.skills == this)
                        delete ui.skills;
                    if (ui.skills2 == this)
                        delete ui.skills2;
                    if (ui.skills3 == this)
                        delete ui.skills3;
                },
                replace: function () {
                    if (this.replaceTransition === false) {
                        this.style.transitionProperty = 'none';
                        ui.refresh(this);
                    }
                    while (this.childNodes.length)
                        this.firstChild.remove();
                    var i, controls;
                    if (Array.isArray(arguments[0]))
                        controls = arguments[0];
                    else
                        controls = arguments;
                    delete this.custom;
                    for (i = 0; i < controls.length; i++) {
                        if (typeof controls[i] == 'function') {
                            this.custom = controls[i];
                        }
                        else {
                            this.add(controls[i]);
                        }
                    }
                    if (this.childNodes.length) {
                        var width = 0;
                        for (i = 0; i < this.childNodes.length; i++)
                            width += this.childNodes[i].offsetWidth;
                        ui.refresh(this);
                        this.style.width = width + 'px';
                    }
                    ui.updatec();
                    if (this.replaceTransition === false) {
                        var that = this;
                        setTimeout(function () {
                            that.style.transitionProperty = '';
                        }, 200);
                    }
                    return this;
                }
            },
            client: {
                send: function () {
                    if (this.closed)
                        return this;
                    var args = Array.from(arguments);
                    if (typeof args[0] == 'function') {
                        args.unshift('exec');
                    }
                    for (var i = 1; i < args.length; i++) {
                        args[i] = get.stringifiedResult(args[i]);
                    }
                    try {
                        this.ws.send(JSON.stringify(args));
                    }
                    catch (e) {
                        this.ws.close();
                    }
                    return this;
                },
                close: function () {
                    lib.node.clients.remove(this);
                    lib.node.observing.remove(this);
                    if (ui.removeObserve && !lib.node.observing.length) {
                        ui.removeObserve.remove();
                        delete ui.removeObserve;
                    }
                    this.closed = true;
                    if (_status.waitingForPlayer) {
                        for (var i = 0; i < game.connectPlayers.length; i++) {
                            if (game.connectPlayers[i].playerid == this.id) {
                                game.connectPlayers[i].uninitOL();
                                delete game.connectPlayers[i].playerid;
                            }
                        }
                        if (game.onlinezhu == this.id) {
                            game.onlinezhu = null;
                        }
                        game.updateWaiting();
                    }
                    else if (lib.playerOL[this.id]) {
                        var player = lib.playerOL[this.id];
                        player.setNickname(player.nickname + ' - 离线');
                        game.broadcast(function (player) {
                            player.setNickname(player.nickname + ' - 离线');
                        }, player);
                        player.unwait('ai');
                    }
                    if (window.isNonameServer) {
                        document.querySelector('#server_count').innerHTML = lib.node.clients.length;
                    }
                    return this;
                }
            },
            nodews: {
                send: function (message) {
                    game.send('server', 'send', this.wsid, message);
                },
                on: function (type, func) {
                    this['on' + type] = func;
                },
                close: function () {
                    game.send('server', 'close', this.wsid);
                }
            },
            ws: {
                onopen: function () {
                    if (_status.connectCallback) {
                        _status.connectCallback(true);
                        delete _status.connectCallback;
                    }
                },
                onmessage: function (messageevent) {
                    if (messageevent.data == 'heartbeat') {
                        this.send('heartbeat');
                        return;
                    }
                    var message;
                    try {
                        message = JSON.parse(messageevent.data);
                        if (!Array.isArray(message) ||
                            typeof lib.message.client[message[0]] !== 'function') {
                            throw ('err');
                        }
                        for (var i = 1; i < message.length; i++) {
                            message[i] = get.parsedResult(message[i]);
                        }
                    }
                    catch (e) {
                        console.log(e);
                        console.log('invalid message: ' + messageevent.data);
                        return;
                    }
                    lib.message.client[message.shift()].apply(null, message);
                },
                onerror: function (e) {
                    if (this._nocallback)
                        return;
                    if (_status.connectCallback) {
                        _status.connectCallback(false);
                        delete _status.connectCallback;
                    }
                    else {
                        alert('连接失败');
                    }
                },
                onclose: function () {
                    if (this._nocallback)
                        return;
                    if (_status.connectCallback) {
                        _status.connectCallback(false);
                        delete _status.connectCallback;
                    }
                    if (game.online || game.onlineroom) {
                        if ((game.servermode || game.onlinehall) && _status.over) {
                        }
                        else {
                            localStorage.setItem(lib.configprefix + 'directstart', true);
                            game.reload();
                        }
                    }
                    else {
                    }
                    game.online = false;
                    game.ws = null;
                }
            }
        },
        card: {},
        filter: {},
        sort: {},
        skill: skill_1.default,
        character: {},
        perfectPair: {},
        cardPile: {},
        message: {
            server: {
                init: function (version, config, banned_info) {
                    if (lib.node.banned.contains(banned_info)) {
                        this.send('denied', 'banned');
                    }
                    else if (config.id && lib.playerOL && lib.playerOL[config.id]) {
                        var player = lib.playerOL[config.id];
                        player.setNickname();
                        player.ws = this;
                        player.isAuto = false;
                        this.id = config.id;
                        game.broadcast(function (player) {
                            player.setNickname();
                        }, player);
                        this.send('reinit', lib.configOL, get.arenaState(), game.getState ? game.getState() : {}, game.ip, null, _status.onreconnect, _status.cardtag);
                    }
                    else if (version != lib.versionOL) {
                        this.send('denied', 'version');
                        lib.node.clients.remove(this);
                        this.closed = true;
                    }
                    else if (!_status.waitingForPlayer) {
                        if (game.phaseNumber && lib.configOL.observe) {
                            lib.node.observing.push(this);
                            this.send('reinit', lib.configOL, get.arenaState(), game.getState ? game.getState() : {}, game.ip, game.players[0].playerid, null, _status.cardtag);
                            if (!ui.removeObserve) {
                                ui.removeObserve = ui.create.system('移除旁观', function () {
                                    lib.configOL.observe = false;
                                    if (game.onlineroom) {
                                        game.send('server', 'config', lib.configOL);
                                    }
                                    while (lib.node.observing.length) {
                                        lib.node.observing.shift().ws.close();
                                    }
                                    this.remove();
                                    delete ui.removeObserve;
                                }, true);
                            }
                        }
                        else {
                            this.send('denied', 'gaming');
                            lib.node.clients.remove(this);
                            this.closed = true;
                        }
                    }
                    else if (lib.node.clients.length - (window.isNonameServer ? 1 : 0) >= parseInt(lib.configOL.number)) {
                        this.send('denied', 'number');
                        lib.node.clients.remove(this);
                        this.closed = true;
                    }
                    else {
                        if (config) {
                            this.avatar = config.avatar;
                            this.nickname = config.nickname;
                        }
                        for (var i = 0; i < game.connectPlayers.length; i++) {
                            if (game.connectPlayers[i].classList.contains('unselectable2'))
                                continue;
                            if (game.connectPlayers[i] != game.me && !game.connectPlayers[i].playerid) {
                                game.connectPlayers[i].playerid = this.id;
                                game.connectPlayers[i].initOL(this.nickname, this.avatar);
                                game.connectPlayers[i].ws = this;
                                break;
                            }
                        }
                        this.send('init', this.id, lib.configOL, game.ip, window.isNonameServer, game.roomId);
                    }
                },
                inited: function () {
                    this.inited = true;
                    if (_status.waitingForPlayer) {
                        game.updateWaiting();
                    }
                },
                reinited: function () {
                    this.inited = true;
                },
                result: function (result) {
                    if (lib.node.observing.contains(this))
                        return;
                    var player = lib.playerOL[this.id];
                    if (player) {
                        player.unwait(result);
                    }
                },
                startGame: function () {
                    if (this.id == game.onlinezhu) {
                        game.resume();
                    }
                },
                changeRoomConfig: function (config) {
                    if (this.id == game.onlinezhu) {
                        game.broadcastAll(function (config) {
                            for (var i in config) {
                                lib.configOL[i] = config[i];
                            }
                            if (ui.connectStartBar) {
                                ui.connectStartBar.firstChild.innerHTML = get.modetrans(lib.configOL, true);
                            }
                        }, config);
                        if (lib.configOL.mode == 'identity' && lib.configOL.identity_mode == 'zhong' && game.connectPlayers) {
                            for (var i = 0; i < game.connectPlayers.length; i++) {
                                game.connectPlayers[i].classList.remove('unselectable2');
                            }
                            lib.configOL.number = 8;
                            game.updateWaiting();
                        }
                        if (game.onlineroom) {
                            game.send('server', 'config', lib.configOL);
                        }
                        for (var i = 0; i < game.connectPlayers.length; i++) {
                            if (game.connectPlayers[i].playerid == this.id) {
                                game.connectPlayers[i].chat('房间设置已更改');
                            }
                        }
                    }
                },
                changeNumConfig: function (num, index, bool) {
                    if (this.id == game.onlinezhu) {
                        lib.configOL.number = num;
                        game.send('server', 'config', lib.configOL);
                        if (game.connectPlayers && game.connectPlayers[index]) {
                            if (bool) {
                                game.connectPlayers[index].classList.add('unselectable2');
                            }
                            else {
                                game.connectPlayers[index].classList.remove('unselectable2');
                            }
                            game.updateWaiting();
                        }
                    }
                },
                throwEmotion: function (target, emotion) {
                    if (lib.node.observing.contains(this))
                        return;
                    var player = lib.playerOL[this.id];
                    if (player) {
                        player.throwEmotion(target, emotion);
                    }
                },
                emotion: function (id, pack, emotion) {
                    if (lib.node.observing.contains(this))
                        return;
                    var that = this;
                    if (!this.id || (!lib.playerOL[this.id] && (!game.connectPlayers || !function () {
                        for (var i = 0; i < game.connectPlayers.length; i++) {
                            if (game.connectPlayers[i].playerid == that.id) {
                                return true;
                            }
                        }
                        return false;
                    }())))
                        return;
                    var player;
                    if (lib.playerOL[id]) {
                        player = lib.playerOL[id];
                    }
                    else if (game.connectPlayers) {
                        for (var i = 0; i < game.connectPlayers.length; i++) {
                            if (game.connectPlayers[i].playerid == id) {
                                player = game.connectPlayers[i];
                                break;
                            }
                        }
                    }
                    if (player)
                        player.emotion(pack, emotion);
                },
                chat: function (id, str) {
                    var that = this;
                    if (!this.id || (!lib.playerOL[this.id] && (!game.connectPlayers || !function () {
                        for (var i = 0; i < game.connectPlayers.length; i++) {
                            if (game.connectPlayers[i].playerid == that.id) {
                                return true;
                            }
                        }
                        return false;
                    }())))
                        return;
                    var player;
                    if (lib.playerOL[id]) {
                        player = lib.playerOL[id];
                    }
                    else if (game.connectPlayers) {
                        for (var i = 0; i < game.connectPlayers.length; i++) {
                            if (game.connectPlayers[i].playerid == id) {
                                player = game.connectPlayers[i];
                                break;
                            }
                        }
                    }
                    if (player)
                        player.chat(str);
                },
                giveup: function (player) {
                    if (lib.node.observing.contains(this) || !player || !player._giveUp)
                        return;
                    _status.event.next.length = 0;
                    game.createEvent('giveup', false).setContent(function () {
                        game.log(player, '投降');
                        player.popup('投降');
                        player.die('nosource');
                    }).player = player;
                },
                auto: function () {
                    if (lib.node.observing.contains(this))
                        return;
                    var player = lib.playerOL[this.id];
                    if (player) {
                        player.isAuto = true;
                        player.setNickname(player.nickname + ' - 托管');
                        game.broadcast(function (player) {
                            player.setNickname(player.nickname + ' - 托管');
                        }, player);
                    }
                },
                unauto: function () {
                    if (lib.node.observing.contains(this))
                        return;
                    var player = lib.playerOL[this.id];
                    if (player) {
                        player.isAuto = false;
                        player.setNickname(player.nickname);
                        game.broadcast(function (player) {
                            player.setNickname(player.nickname);
                        }, player);
                    }
                },
                exec: function (func) {
                },
                log: function () {
                    var items = [];
                    try {
                        for (var i = 0; i < arguments.length; i++) {
                            eval('items.push(' + arguments[i] + ')');
                        }
                    }
                    catch (e) {
                        this.send('log', ['err']);
                        return;
                    }
                    this.send('log', items);
                }
            },
            client: {
                log: function (arr) {
                    if (Array.isArray(arr)) {
                        for (var i = 0; i < arr.length; i++) {
                            console.log(arr[i]);
                        }
                    }
                },
                opened: function () {
                    game.send('init', lib.versionOL, {
                        id: game.onlineID,
                        avatar: lib.config.connect_avatar,
                        nickname: get.connectNickname()
                    }, lib.config.banned_info);
                    if (ui.connecting && !ui.connecting.splashtimeout) {
                        ui.connecting.firstChild.innerHTML = '重连成功';
                    }
                },
                onconnection: function (id) {
                    var ws = { wsid: id };
                    for (var i in lib.element.nodews) {
                        ws[i] = lib.element.nodews[i];
                    }
                    lib.wsOL[id] = ws;
                    lib.init.connection(ws);
                },
                onmessage: function (id, message) {
                    if (lib.wsOL[id]) {
                        lib.wsOL[id].onmessage(message);
                    }
                },
                onclose: function (id) {
                    if (lib.wsOL[id]) {
                        lib.wsOL[id].onclose();
                    }
                },
                selfclose: function () {
                    if (game.online || game.onlineroom) {
                        if ((game.servermode || game.onlinehall) && _status.over) {
                        }
                        else {
                            game.saveConfig('tmp_user_roomId');
                        }
                    }
                    game.ws.close();
                },
                reloadroom: function (forced) {
                    if (window.isNonameServer && (forced || !_status.protectingroom)) {
                        game.reload();
                    }
                },
                createroom: function (index, config, mode) {
                    game.online = false;
                    game.onlineroom = true;
                    game.roomId = index;
                    lib.node = {};
                    if (config && mode && window.isNonameServer) {
                        if (mode == 'auto') {
                            mode = lib.configOL.mode;
                        }
                        game.switchMode(mode, config);
                    }
                    else {
                        game.switchMode(lib.configOL.mode);
                    }
                    ui.create.connecting(true);
                },
                enterroomfailed: function () {
                    alert('请稍后再试');
                    _status.enteringroom = false;
                    ui.create.connecting(true);
                },
                roomlist: function (list, events, clients, wsid) {
                    game.send('server', 'key', [game.onlineKey, lib.version]);
                    game.online = true;
                    game.onlinehall = true;
                    lib.config.recentIP.remove(_status.ip);
                    lib.config.recentIP.unshift(_status.ip);
                    lib.config.recentIP.splice(5);
                    if (!lib.config.reconnect_info || lib.config.reconnect_info[0] != _status.ip) {
                        game.saveConfig('reconnect_info', [_status.ip, null]);
                    }
                    game.saveConfig('recentIP', lib.config.recentIP);
                    _status.connectMode = true;
                    game.clearArena();
                    game.clearConnect();
                    ui.pause.hide();
                    ui.auto.hide();
                    clearTimeout(_status.createNodeTimeout);
                    game.send('server', 'changeAvatar', get.connectNickname(), lib.config.connect_avatar);
                    var proceed = function () {
                        game.ip = get.trimip(_status.ip);
                        ui.create.connectRooms(list);
                        if (events) {
                            ui.connectEvents = ui.create.div('.forceopaque.menubutton.large.connectevents.pointerdiv', '约战', ui.window, ui.click.connectEvents);
                            ui.connectEventsCount = ui.create.div('.forceopaque.menubutton.icon.connectevents.highlight.hidden', '', ui.window);
                            ui.connectClients = ui.create.div('.forceopaque.menubutton.large.connectevents.pointerdiv.left', '在线', ui.window, ui.click.connectClients);
                            ui.connectClientsCount = ui.create.div('.forceopaque.menubutton.icon.connectevents.highlight.left', '1', ui.window);
                            ui.createRoomButton = ui.create.div('.forceopaque.menubutton.large.connectevents.pointerdiv.left2', '创建房间', ui.window, function () {
                                if (!_status.creatingroom) {
                                    _status.creatingroom = true;
                                    ui.click.connectMenu();
                                }
                            });
                            if (events.length) {
                                ui.connectEventsCount.innerHTML = events.filter(function (evt) {
                                    return evt.creator == game.onlineKey || !get.is.banWords(evt.content);
                                }).length;
                                ui.connectEventsCount.show();
                            }
                        }
                        game.wsid = wsid;
                        lib.message.client.updaterooms(list, clients);
                        lib.message.client.updateevents(events);
                        ui.exitroom = ui.create.system('退出房间', function () {
                            game.saveConfig('tmp_owner_roomId');
                            game.saveConfig('tmp_user_roomId');
                            if (ui.rooms) {
                                game.saveConfig('reconnect_info');
                            }
                            else {
                                if (lib.config.reconnect_info) {
                                    lib.config.reconnect_info.length = 1;
                                    game.saveConfig('reconnect_info', lib.config.reconnect_info);
                                }
                            }
                            game.reload();
                        }, true);
                        var findRoom = function (id) {
                            for (var room of ui.rooms) {
                                if (room.key == id)
                                    return room;
                            }
                            return false;
                        };
                        if (typeof lib.config.tmp_owner_roomId == 'string') {
                            if (typeof game.roomId != 'string' && !findRoom(lib.config.tmp_owner_roomId)) {
                                lib.configOL.mode = lib.config.connect_mode;
                                game.roomId = lib.config.tmp_owner_roomId;
                            }
                            game.saveConfig('tmp_owner_roomId');
                        }
                        if (typeof lib.config.tmp_user_roomId == 'string') {
                            if (typeof game.roomId != 'string') {
                                if (findRoom(lib.config.tmp_user_roomId)) {
                                    game.roomId = lib.config.tmp_user_roomId;
                                }
                                else {
                                    ui.create.connecting();
                                    (function () {
                                        var n = 10;
                                        var id = lib.config.tmp_user_roomId;
                                        var interval = setInterval(function () {
                                            if (n > 0) {
                                                n--;
                                                if (findRoom(id)) {
                                                    clearInterval(interval);
                                                    game.send('server', 'enter', id, get.connectNickname(), lib.config.connect_avatar);
                                                }
                                            }
                                            else {
                                                ui.create.connecting(true);
                                                clearInterval(interval);
                                            }
                                        }, 500);
                                    }());
                                }
                            }
                            game.saveConfig('tmp_user_roomId');
                        }
                        if (window.isNonameServer) {
                            var cfg = 'pagecfg' + window.isNonameServer;
                            if (lib.config[cfg]) {
                                lib.configOL = lib.config[cfg][0];
                                game.send('server', 'server', lib.config[cfg].slice(1));
                                game.saveConfig(cfg);
                                _status.protectingroom = true;
                                setTimeout(function () {
                                    _status.protectingroom = false;
                                    if (!lib.node || !lib.node.clients || !lib.node.clients.length) {
                                        game.reload();
                                    }
                                }, 15000);
                            }
                            else {
                                game.send('server', 'server');
                            }
                        }
                        else if (typeof game.roomId == 'string') {
                            var room = findRoom(game.roomId);
                            if (game.roomIdServer && room && (room.serving || !room.version)) {
                                console.log();
                                if (lib.config.reconnect_info) {
                                    lib.config.reconnect_info[2] = null;
                                    game.saveConfig('reconnect_info', lib.config.reconnect_info);
                                }
                            }
                            else {
                                ui.create.connecting();
                                game.send('server', (game.roomId == game.onlineKey) ? 'create' : 'enter', game.roomId, get.connectNickname(), lib.config.connect_avatar);
                            }
                        }
                        lib.init.onfree();
                    };
                    if (_status.event.parent) {
                        game.forceOver('noover', proceed);
                    }
                    else {
                        proceed();
                    }
                },
                updaterooms: function (list, clients) {
                    if (ui.rooms) {
                        let map = {}, map2 = {};
                        for (let i of ui.rooms)
                            map2[i.key] = true;
                        for (let i of list) {
                            if (!i)
                                continue;
                            map[i[4]] = i;
                        }
                        ui.window.classList.add('more_room');
                        for (let i = 0; i < ui.rooms.length; i++) {
                            if (!map[ui.rooms[i].key]) {
                                ui.rooms[i].remove();
                                ui.rooms.splice(i--, 1);
                            }
                            else
                                ui.rooms[i].initRoom(list[i]);
                        }
                        for (let i of list) {
                            if (!i)
                                continue;
                            map[i[4]] = i;
                            if (!map2[i[4]]) {
                                let player = ui.roombase.add('<div class="popup text pointerdiv" style="width:calc(100% - 10px);display:inline-block;white-space:nowrap">空房间</div>');
                                player.roomindex = i;
                                player.initRoom = PlayerModel_1.default.prototype.initRoom;
                                player.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', ui.click.connectroom);
                                player.initRoom(i);
                                ui.rooms.push(player);
                            }
                        }
                    }
                    lib.message.client.updateclients(clients, true);
                },
                updateclients: function (clients, bool) {
                    if (clients && ui.connectClients) {
                        ui.connectClients.info = clients;
                        ui.connectClientsCount.innerHTML = clients.length;
                    }
                    if (_status.connectClientsCallback) {
                        _status.connectClientsCallback();
                    }
                },
                updateevents: function (events) {
                    if (events && ui.connectEvents) {
                        ui.connectEvents.info = events;
                        var num = events.filter(function (evt) {
                            return typeof evt.creator == 'string' && (evt.creator == game.onlineKey || !get.is.banWords(evt.content));
                        }).length;
                        if (num) {
                            ui.connectEventsCount.innerHTML = num;
                            ui.connectEventsCount.show();
                        }
                        else {
                            ui.connectEventsCount.hide();
                        }
                        if (_status.connectEventsCallback) {
                            _status.connectEventsCallback();
                        }
                    }
                },
                eventsdenied: function (reason) {
                    var str = '创建约战失败';
                    if (reason == 'total') {
                        str += '，约战总数不能超过20';
                    }
                    else if (reason == 'time') {
                        str += '，时间已过';
                    }
                    else if (reason == 'ban') {
                        str += '，请注意文明发言';
                    }
                    alert(str);
                },
                init: function (id, config, ip, servermode, roomId) {
                    game.online = true;
                    game.onlineID = id;
                    game.ip = ip;
                    game.servermode = servermode;
                    game.roomId = roomId;
                    if (game.servermode) {
                        game.saveConfig('reconnect_info', [_status.ip, id, game.roomId]);
                    }
                    else {
                        game.saveConfig('reconnect_info', [_status.ip, id]);
                        game.saveConfig('tmp_user_roomId', roomId);
                    }
                    lib.config.recentIP.remove(_status.ip);
                    lib.config.recentIP.unshift(_status.ip);
                    lib.config.recentIP.splice(5);
                    game.saveConfig('recentIP', lib.config.recentIP);
                    _status.connectMode = true;
                    lib.configOL = config;
                    lib.playerOL = {};
                    lib.cardOL = {};
                    game.clearArena();
                    game.finishCards();
                    ui.create.roomInfo();
                    ui.create.chat();
                    if (game.servermode) {
                        ui.create.connectPlayers(get.modetrans(config, true));
                    }
                    else {
                        ui.create.connectPlayers(ip);
                    }
                    ui.pause.hide();
                    ui.auto.hide();
                    game.clearConnect();
                    clearTimeout(_status.createNodeTimeout);
                    var proceed = function () {
                        game.loadModeAsync(config.mode, function (mode) {
                            for (var i in mode.ai) {
                                if (typeof mode.ai[i] == 'object') {
                                    if (ai[i] == undefined)
                                        ai[i] = {};
                                    for (var j in mode.ai[i]) {
                                        ai[i][j] = mode.ai[i][j];
                                    }
                                }
                                else {
                                    ai[i] = mode.ai[i];
                                }
                            }
                            for (var i in mode.get) {
                                if (typeof mode.get[i] == 'object') {
                                    if (get[i] == undefined)
                                        get[i] = {};
                                    for (var j in mode.get[i]) {
                                        get[i][j] = mode.get[i][j];
                                    }
                                }
                                else {
                                    get[i] = mode.get[i];
                                }
                            }
                            for (var i in mode.translate) {
                                lib.translate[i] = mode.translate[i];
                            }
                            if (mode.game) {
                                game.getIdentityList = mode.game.getIdentityList;
                                game.updateState = mode.game.updateState;
                                game.getRoomInfo = mode.game.getRoomInfo;
                            }
                            if (mode.element && mode.element.player) {
                                mixin(PlayerModel_1.default.prototype, mode.element.player);
                            }
                            if (mode.skill) {
                                for (var i in mode.skill) {
                                    lib.skill[i] = mode.skill[i];
                                }
                            }
                            if (mode.card) {
                                for (var i in mode.card) {
                                    lib.card[i] = mode.card[i];
                                }
                            }
                            game.finishCards();
                            if (mode.characterPack) {
                                for (var i in mode.characterPack) {
                                    lib.characterPack[i] = mode.characterPack[i];
                                }
                            }
                            _status.event = new EventModel_1.default();
                            _status.paused = false;
                            game.createEvent('game', false).setContent(lib.init.startOnline);
                            game.loop();
                            game.send('inited');
                            ui.create.connecting(true);
                        });
                    };
                    if (_status.event.parent) {
                        game.forceOver('noover', proceed);
                    }
                    else {
                        proceed();
                    }
                    for (var i in lib.characterPack) {
                        for (var j in lib.characterPack[i]) {
                            lib.character[j] = lib.character[j] || lib.characterPack[i][j];
                        }
                    }
                },
                reinit: function (config, state, state2, ip, observe, onreconnect, cardtag) {
                    ui.auto.show();
                    ui.pause.show();
                    game.clearConnect();
                    clearTimeout(_status.createNodeTimeout);
                    game.online = true;
                    game.ip = ip;
                    game.servermode = state.servermode;
                    game.roomId = state.roomId;
                    if (state.over) {
                        _status.over = true;
                    }
                    if (observe) {
                        game.observe = true;
                        game.onlineID = null;
                        game.roomId = null;
                    }
                    if (game.servermode && !observe) {
                        game.saveConfig('reconnect_info', [_status.ip, game.onlineID, game.roomId]);
                    }
                    else {
                        game.saveConfig('reconnect_info', [_status.ip, game.onlineID]);
                        if (!observe) {
                            game.saveConfig('tmp_user_roomId', game.roomId);
                        }
                    }
                    _status.connectMode = true;
                    lib.configOL = config;
                    lib.playerOL = {};
                    lib.cardOL = {};
                    game.loadModeAsync(config.mode, function (mode) {
                        for (var i in mode.ai) {
                            if (typeof mode.ai[i] == 'object') {
                                if (ai[i] == undefined)
                                    ai[i] = {};
                                for (var j in mode.ai[i]) {
                                    ai[i][j] = mode.ai[i][j];
                                }
                            }
                            else {
                                ai[i] = mode.ai[i];
                            }
                        }
                        for (var i in mode.get) {
                            if (typeof mode.get[i] == 'object') {
                                if (get[i] == undefined)
                                    get[i] = {};
                                for (var j in mode.get[i]) {
                                    get[i][j] = mode.get[i][j];
                                }
                            }
                            else {
                                get[i] = mode.get[i];
                            }
                        }
                        for (var i in mode.translate) {
                            lib.translate[i] = mode.translate[i];
                        }
                        if (mode.game) {
                            game.getIdentityList = mode.game.getIdentityList;
                            game.updateState = mode.game.updateState;
                        }
                        if (mode.element && mode.element.player) {
                            mixin(PlayerModel_1.default.prototype, mode.element.player);
                        }
                        if (mode.skill) {
                            for (var i in mode.skill) {
                                lib.skill[i] = mode.skill[i];
                            }
                        }
                        game.finishCards();
                        if (mode.characterPack) {
                            for (var i in mode.characterPack) {
                                lib.characterPack[i] = mode.characterPack[i];
                            }
                        }
                        if (mode.onreinit) {
                            mode.onreinit();
                        }
                        _status.cardtag = get.parsedResult(cardtag);
                        state = get.parsedResult(state);
                        game.players = [];
                        game.dead = [];
                        for (var i in lib.characterPack) {
                            for (var j in lib.characterPack[i]) {
                                lib.character[j] = lib.character[j] || lib.characterPack[i][j];
                            }
                        }
                        game.clearArena();
                        game.finishCards();
                        if (!observe) {
                            ui.create.chat();
                            if (ui.exitroom) {
                                ui.exitroom.remove();
                                delete ui.exitroom;
                            }
                        }
                        else {
                            if (!ui.exitroom) {
                                ui.create.system('退出旁观', function () {
                                    game.saveConfig('reconnect_info');
                                    game.reload();
                                }, true);
                            }
                            if (!lib.configOL.observe_handcard) {
                                ui.arena.classList.add('observe');
                            }
                        }
                        ui.arena.setNumber(state.number);
                        _status.mode = state.mode;
                        lib.inpile = state.inpile;
                        var pos = state.players[observe || game.onlineID].position;
                        for (var i in state.players) {
                            var info = state.players[i];
                            var player = ui.create.player(ui.arena).animate('start');
                            player.dataset.position = (info.position < pos) ? info.position - pos + parseInt(state.number) : info.position - pos;
                            if (i == observe || i == game.onlineID) {
                                game.me = player;
                            }
                            if (player.setModeState) {
                                player.setModeState(info);
                            }
                            else {
                                player.init(info.name1, info.name2);
                            }
                            if (!info.unseen)
                                player.classList.remove('unseen');
                            if (!info.unseen2)
                                player.classList.remove('unseen2');
                            if (!player.isUnseen(2) && player.storage.nohp) {
                                delete player.storage.nohp;
                                player.node.hp.show();
                            }
                            player.playerid = i;
                            player.nickname = info.nickname;
                            player.changeGroup(info.group, false, false);
                            player.identity = info.identity;
                            player.identityShown = info.identityShown;
                            player.hp = info.hp;
                            player.maxHp = info.maxHp;
                            player.hujia = info.hujia;
                            player.sex = info.sex;
                            player.side = info.side;
                            player.phaseNumber = info.phaseNumber,
                                player.setNickname();
                            if (info.dead) {
                                player.classList.add('dead');
                                if (lib.config.die_move) {
                                    player.$dieflip();
                                }
                                if (player.$dieAfter) {
                                    player.$dieAfter();
                                }
                                game.dead.push(player);
                            }
                            else {
                                game.players.push(player);
                            }
                            if (info.linked) {
                                player.addLink();
                            }
                            if (info.turnedover) {
                                player.classList.add('turnedover');
                            }
                            if (info.disableJudge) {
                                player.$disableJudge();
                            }
                            if (Array.isArray(info.disableEquip)) {
                                for (let ii = 0; ii < info.disableEquip.length; ii++) {
                                    player.$disableEquip(info.disableEquip[ii]);
                                }
                            }
                            player.directgain(info.handcards);
                            lib.playerOL[i] = player;
                            for (let i = 0; i < info.equips.length; i++) {
                                player.$equip(info.equips[i]);
                            }
                            for (let i = 0; i < info.handcards.length; i++) {
                                info.handcards[i].addGaintag(info.gaintag[i]);
                            }
                            for (let i = 0; i < info.specials.length; i++) {
                                info.specials[i].classList.add('glows');
                            }
                            for (let i = 0; i < info.judges.length; i++) {
                                if (info.views[i] && info.views[i] != info.judges[i]) {
                                    info.judges[i].classList.add('fakejudge');
                                    info.judges[i].viewAs = info.views[i];
                                    info.judges[i].node.background.innerHTML = lib.translate[info.views[i] + '_bg'] || get.translation(info.views[i])[0];
                                }
                                player.node.judges.appendChild(info.judges[i]);
                            }
                            ui.updatej(player);
                            if (!player.setModeState) {
                                if (!game.getIdentityList && info.identityNode) {
                                    player.node.identity.innerHTML = info.identityNode[0];
                                    player.node.identity.dataset.color = info.identityNode[1];
                                }
                                else if (player == game.me || player.identityShown || observe) {
                                    player.setIdentity();
                                    player.forceShown = true;
                                }
                                else {
                                    player.setIdentity('cai');
                                }
                                if (!lib.configOL.observe_handcard && (lib.configOL.mode == 'identity' || lib.configOL.mode == 'guozhan')) {
                                    if (observe && !player.identityShown) {
                                        player.setIdentity('cai');
                                        player.forceShown = false;
                                    }
                                }
                            }
                            player.update();
                        }
                        game.arrangePlayers();
                        ui.create.me(true);
                        _status.event = new EventModel_1.default();
                        _status.paused = false;
                        _status.dying = get.parsedResult(state.dying) || [];
                        if (game.updateState) {
                            game.updateState(state2);
                        }
                        var next = game.createEvent('game', false);
                        next.setContent(lib.init.startOnline);
                        if (observe) {
                            next.custom.replace.target = function (player) {
                                if (!lib.configOL.observe_handcard && lib.configOL.mode == 'guozhan') {
                                    return;
                                }
                                if (player.isAlive()) {
                                    if (!game.me.identityShown && lib.configOL.mode == 'guozhan') {
                                        game.me.node.identity.firstChild.innerHTML = '猜';
                                        game.me.node.identity.dataset.color = 'unknown';
                                    }
                                    game.swapPlayer(player);
                                    if (!game.me.identityShown && lib.configOL.mode == 'guozhan') {
                                        game.me.node.identity.firstChild.innerHTML = '';
                                    }
                                }
                            };
                        }
                        else {
                            if (Array.isArray(onreconnect)) {
                                onreconnect.shift().apply(this, onreconnect);
                            }
                        }
                        game.loop();
                        game.send('reinited');
                        game.showHistory();
                        _status.gameStarted = true;
                        if (lib.config.show_cardpile) {
                            ui.cardPileButton.style.display = '';
                        }
                        if (!observe && game.me && (game.me.isDead() || _status.over)) {
                            ui.create.exit();
                        }
                        ui.updatehl();
                        ui.create.connecting(true);
                    });
                },
                exec: function (func) {
                    var key = game.onlineKey;
                    if (typeof func == 'function') {
                        var args = Array.from(arguments);
                        args.shift();
                        func.apply(this, args);
                    }
                    if (key) {
                        game.onlineKey = key;
                        localStorage.setItem(lib.configprefix + 'key', game.onlineKey);
                    }
                },
                denied: function (reason) {
                    switch (reason) {
                        case 'version':
                            alert('加入失败：版本不匹配，请将游戏更新至最新版');
                            game.saveConfig('tmp_owner_roomId');
                            game.saveConfig('tmp_user_roomId');
                            game.saveConfig('reconnect_info');
                            break;
                        case 'gaming':
                            alert('加入失败：游戏已开始');
                            break;
                        case 'number':
                            alert('加入失败：房间已满');
                            break;
                        case 'banned':
                            alert('加入失败：房间拒绝你加入');
                            break;
                        case 'key':
                            alert('您的游戏版本过低，请升级到最新版');
                            game.saveConfig('tmp_owner_roomId');
                            game.saveConfig('tmp_user_roomId');
                            game.saveConfig('reconnect_info');
                            break;
                        case 'offline':
                            if (_status.paused && _status.event.name == 'game') {
                                setTimeout(game.resume, 500);
                            }
                            break;
                    }
                    game.ws.close();
                    if (_status.connectDenied) {
                        _status.connectDenied();
                    }
                },
                cancel: function (id) {
                    if (_status.event.id == id && _status.event.isMine() && _status.paused && _status.imchoosing) {
                        ui.click.cancel();
                        if (ui.confirm) {
                            ui.confirm.close();
                        }
                        if (_status.event.result) {
                            _status.event.result.id = id;
                        }
                    }
                },
                closeDialog: function (id) {
                    var dialog = get.idDialog(id);
                    if (dialog) {
                        dialog.close();
                    }
                },
                createDialog: function (id) {
                    var args = Array.from(arguments);
                    args.shift();
                    ui.create.dialog.apply(this, args).videoId = id;
                },
                gameStart: function () {
                    for (var i = 0; i < game.connectPlayers.length; i++) {
                        game.connectPlayers[i].delete();
                    }
                    delete game.connectPlayers;
                    if (ui.connectStartButton) {
                        ui.connectStartButton.delete();
                        delete ui.connectStartButton;
                    }
                    if (ui.connectStartBar) {
                        ui.connectStartBar.delete();
                        delete ui.connectStartBar;
                    }
                    if (ui.roomInfo) {
                        ui.roomInfo.remove();
                        delete ui.roomInfo;
                    }
                    if (ui.exitroom) {
                        ui.exitroom.remove();
                        delete ui.exitroom;
                    }
                    ui.auto.show();
                    ui.pause.show();
                    if (lib.config.show_cardpile) {
                        ui.cardPileButton.style.display = '';
                    }
                    _status.gameStarted = true;
                    game.showHistory();
                },
                updateWaiting: function (map) {
                    if (!game.connectPlayers)
                        return;
                    if (!lib.translate.zhu) {
                        lib.translate.zhu = '主';
                    }
                    game.onlinezhu = false;
                    _status.waitingForPlayer = true;
                    for (var i = 0; i < map.length; i++) {
                        if (map[i] == 'disabled') {
                            game.connectPlayers[i].classList.add('unselectable2');
                        }
                        else {
                            game.connectPlayers[i].classList.remove('unselectable2');
                            if (map[i]) {
                                game.connectPlayers[i].initOL(map[i][0], map[i][1]);
                                game.connectPlayers[i].playerid = map[i][2];
                                if (map[i][3] == 'zhu') {
                                    game.connectPlayers[i].setIdentity('zhu');
                                    if (map[i][2] == game.onlineID) {
                                        game.onlinezhu = true;
                                        if (ui.roomInfo) {
                                            ui.roomInfo.innerHTML = '房间设置';
                                        }
                                        if (ui.connectStartButton) {
                                            ui.connectStartButton.innerHTML = '开始游戏';
                                        }
                                    }
                                }
                                else {
                                    game.connectPlayers[i].node.identity.firstChild.innerHTML = '';
                                }
                            }
                            else {
                                game.connectPlayers[i].uninitOL();
                                delete game.connectPlayers[i].playerid;
                            }
                        }
                    }
                }
            }
        },
        color: ['red', 'black', 'none'],
        suit: ['club', 'spade', 'diamond', 'heart'],
        number: ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'X', 'J', 'Q', 'K'],
        group: [],
        group2: ['qun', 'holo', 'nijisanji', 'VirtuaReal', 'nori', 'paryi', 'upd8', 'kagura', 'nanashi', 'psp', 'asoul', 'vwp', 'xuyan', 'chaos', 'xuefeng'],
        nature: ['fire', 'thunder', 'poison', 'ocean', 'ice', 'kami', 'yami'],
        linked: ['fire', 'thunder', 'ocean', 'ice', 'kami', 'yami'],
        groupnature: {},
        phaseName: ['phaseZhunbei', 'phaseJudge', 'phaseDraw', 'phaseUse', 'phaseDiscard', 'phaseJieshu'],
        historyRecorder: { useCard: [], respond: [], skipped: [], lose: [], gain: [], sourceDamage: [], damage: [], recover: [], changeHujia: [], custom: [] },
        quickVoice: [
            '我从未见过如此厚颜无耻之人！',
            '这波不亏',
            '请收下我的膝盖',
            '你咋不上天呢',
            '放开我的队友，冲我来',
            '你随便杀，闪不了算我输',
            '见证奇迹的时刻到了',
            '能不能快一点啊，兵贵神速啊',
            '主公，别开枪，自己人',
            '小内再不跳，后面还怎么玩儿啊',
            '你们忍心，就这么让我酱油了？',
            '我，我惹你们了吗',
            '姑娘，你真是条汉子',
            '三十六计，走为上，容我去去便回',
            '人心散了，队伍不好带啊',
            '昏君，昏君啊！',
            '风吹鸡蛋壳，牌去人安乐',
            '小内啊，您老悠着点儿',
            '不好意思，刚才卡了',
            '你可以打得再烂一点吗',
            '哥们，给力点儿行嘛',
            '哥哥，交个朋友吧',
            '妹子，交个朋友吧',
        ],
    });
    exports.default = lib;
});
