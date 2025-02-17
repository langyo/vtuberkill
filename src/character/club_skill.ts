import { toSkill } from './skilltype'
let { game, ui, get, ai, lib, _status } = window.vkCore
export default {
    //Yomemi
    mokuai: {
        mod: {
            selectTarget(card, player, range) {
                if (get.name(card) == 'sha')
                    range[1] = Math.floor(player.countCards('e')) || 1;
            },
        },
        forced: true,
        priority: 220,
        trigger: { player: 'recoverBegin' },
        filter(Evt, player) {
            return true;
        },
        content() {
            trigger.num = player.countCards('e') || 1;
        },
    },
    yaoji: {
        audio: 3,
        audioname: ['jike'],
        enable: "phaseUse",
        usable: 1,
        filter(Evt, player) {
            return player.countCards('he') > 0
        },
        filterCard(card) {
            for (var i = 0; i < ui.selected.cards.length; i++) {
                if (get.type2(card) == get.type2(ui.selected.cards[i])) return false;
            }
            return true;
        },
        check(card) {
            if (ui.selected.cards.length) return 4 - get.value(card);
            return 6 - get.value(card);
        },
        complexCard: true,
        selectCard: [1, Infinity],
        position: 'he',
        filterTarget(card, player, target) {
            return target != player;
        },
        selectTarget() {
            var player = _status.event.player;
            if (!player.hasSkill('mokuai')) return 1;
            var min = 1;
            var max = Math.floor(player.countCards('e')) || 1;
            return [min, max];
        },
        discard: true,
        multitarget: true,
        //targetprompt:[],
        content: [function () {
            Evt.targs = targets.slice(0);
            var type = [];
            for (var i = 0; i < cards.length; i++) {
                type.add(get.type2(cards[i], cards[i].original == 'h' ? player : false));
            }
            var num = type.length;
            var cards = get.cards(num);
            player.showCards(cards, '致命药剂亮出牌堆');
            var suits = [];
            for (var i = 0; i < cards.length; i++) {
                suits.push(get.suit(cards[i]));
            }
            Evt.suits = suits;
            game.cardsGotoOrdering(cards);
        }, function () {
            Evt.targ = Evt.targs.shift();
            var suits = Evt.suits;
            let next = Evt.targ.chooseToDiscard("弃置与亮出牌花色和数量（" + get.translation(suits) + "）相同的牌", 'he')
                .set('selectCard', suits.length)
                .set('complexCard', true)
                .set('suits', suits)
                .set('filterCard', function (card) {
                    var suits = _status.event.suits;
                    if (ui.selected.cards.length) {
                        return get.suit(card) == suits[ui.selected.cards.length];
                    }
                    else {
                        return get.suit(card) == suits[0];
                    }
                })
                .set('ai', card => {
                    return 8 - get.useful(card);
                });
            next.autochoose = function () {
                return this.player.countCards('he') == 0;
            };
        }, function () {
            if (!result.cards || result.cards.length < _status.event.suits.length) {
                Evt.targ.damage('player', 'nocard');
            }
            if (Evt.targs.length) Evt.goto(1);
        }],
        ai: {
            order: 2, result: {
                target(player, target) {
                    if (target.hasSkill('shenyou')) return 0;
                    return get.damageEffect(target, player, target);
                }
            }
        },
    },
    //艾琳
    daimeng: {
        audio: 3,
        enable: 'phaseUse',
        init(player, skill) {
            if (!player.storage[skill]) player.storage[skill] = [1, 2, 3, 4];
        },
        filter(Evt, player) {
            console.log(player.$.daimeng)
            if (!player.$.daimeng) return false;
            for (var i of player.$.daimeng) {
                if (!game.hasPlayer(function (cur) {
                    return cur.countCards('h') >= (player.countCards('h') + i);
                })) return true;
            }
        },
        content() {
            'step 0'
            Evt.videoId = lib.status.videoId++;
            var numberlist = [];
            for (var i of player.$.daimeng) {
                var c = get.cnNumber(i);
                numberlist.push(['', i, c, i, 'div3']);
            }
            game.broadcastAll(function (id, numberlist) {
                var dialog = ui.create.dialog('『贷梦』 选择摸牌：');
                dialog.addText('张数');
                dialog.add([numberlist, 'vcard']);
                dialog.videoId = id;
            }, Evt.videoId, numberlist);
            'step 1'
            let next = player.chooseButton(true)
                .set('dialog', Evt.videoId)
                .set('filterButton', function (button) {
                    var now = button.link;
                    var player = _status.event.player;
                    return !game.hasPlayer(function (cur) {
                        return cur.countCards('h') >= (player.countCards('h') + now[1]);
                    });
                });
            'step 2'
            game.broadcastAll('closeDialog', Evt.videoId);
            if (result.bool) {
                Evt.num = result.links[0][1];
                player.$.daimeng.remove(Evt.num);
                player.draw(Evt.num);
            }
            else Evt.finish();
            'step 3'
            switch (Evt.num) {
                case 1: player.recover(); break;
                case 2: player.link(true); break;
                case 3: player.turnOver(); break;
                case 4: {
                    var evt = _status.event.getParent('phaseUse');
                    if (evt?.name == 'phaseUse') {
                        evt.skipped = true;
                    }
                } break;
            }
        },
        intro: {
            content: '已摸$张牌'
        },
        ai: {
            order: 7,
            result: {
                player(player, target) {
                    if (player.needsToDiscard() && player.$.daimeng[0] == 4) return -1;
                    return 1;
                }
            }
        },
    },
    changsheng: {
        unique: true,
        skillAnimation: true,
        animationColor: 'fire',
        trigger: { player: 'dying' },
        priority: 10,
        filter(Evt, player) {
            return player.hp < 3 && player.$.changsheng != 'over';
        },
        forced: true,
        content() {
            'step 0'
            player.discard(player.getCards('hej'));
            player.recover(3 - player.hp);
            'step 1'
            if (player.$.daimeng.length != 4) {
                let next = game.createEvent('resetSkill');
                [next.player, next.resetSkill] = [player, 'daimeng']
                next.setContent(function () {
                    player.popup('重置');
                    player.$.daimeng = [1, 2, 3, 4];
                });
            }
            'step 2'
            player.$.changsheng = 'over';
            player.awakenSkill('changsheng');
            trigger.player.addTempSkill('changsheng_diao', 'none');
            game.broadcastAll(function (splayer) {
                splayer.out('changsheng_diao');
            }, trigger.player
            )
        },
        involve: 'daimeng',
        subSkill: {
            diao: {
                trigger: { global: ['phaseAfter', 'turnOverAfter'] },
                mark: true,
                direct: true,
                filter(Evt, player) {
                    if (Evt.player.next !== player) {
                        return false;
                    }
                    else if (Evt.name == 'turnOver' && Evt.player.isTurnedOver()) {
                        return false;
                    }
                    else if (Evt.name == 'turnOver' && Evt.player != _status.currentPhase) {
                        return false;
                    }
                    else {
                        game.broadcastAll(function (splayer) {
                            splayer.in('changsheng_diao');
                        }, player
                        )
                    }
                    return true;

                },
                intro: {
                    content: '移除游戏外'
                },
                content() {
                    game.broadcastAll(function (splayer) {
                        _status.dying.remove(splayer);
                    }, player)
                    player.removeSkill('changsheng_diao');
                }
            },
        }
    },
    //猫宫
    yuchong: {
        audio: 2,
        group: ['yuchong_unbeDis', 'yuchong_unRes'],
        //无法弃置
        subSkill: {
            unbeDis: {
                mod: {
                    canBeDiscarded(card, player, target, name, now) {
                        if (get.subtype(card) == 'equip1') {
                            return false;
                        }
                    },
                }
            },
            unRes: {
                audio: 'yuchong',
                mod: {
                    cardname(card, player, name) {
                        if (player.getEquip(1) && !_status.yuchonging) {
                            if (get.subtype(name) == 'equip1') {
                                return 'sha';
                            }
                        }
                    },
                },
                trigger: { player: 'useCard1' },
                firstDo: true,
                forced: true,
                filter(Evt, player) {
                    if (!player.getEquip(1)) return false;
                    return get.subtype(Evt.cards[0]) == 'equip1';
                },
                content() {
                    if (trigger.addCount !== false) {
                        trigger.addCount = false;
                        var stat = player.getStat();
                        if (stat && stat.card && stat.card[trigger.card.name]) stat.card[trigger.card.name]--;
                    }
                },
            }
        }
        //		},
        //无视防具
        /*uneq:{
            
            trigger:{player:'useCardToPlayered'},
            forced:true,
            priority:9,
            filter(Evt,player){
                if(!player.getEquip(1))		return false;
                return Evt.card.name=='sha'||get.type(Evt.card)=='trick';
            },
            logTarget:'target',
            content(){
                    player.addTempSkill('unequip');
            },
        }*/
        //	}
    },
    songzang: {
        audio: 2,
        trigger: { player: 'useCardToPlayered' },
        priority: 8,
        filter(Evt, player) {
            return Evt.card.name == 'sha' && !(Evt.target.maxHp / 2 < Evt.target.hp);
        },
        logTarget: 'target',
        content() {
            //无法被响应	
            //trigger.getParent().directHit.add(trigger.target);
            //伤害+1
            trigger.getParent().songzang_buffed = true;
            trigger.getParent().baseDamage++;
            trigger.target.addTempSkill('songzang2');
            trigger.target.addTempSkill('songzang4');
            trigger.target.$.songzang2.add(trigger.card);
        },
        ai: {
            damageBonus: true,
            skillTagFilter(player, tag, arg) {
                if (!arg || !arg.card || !get.tag(arg.card, 'damage')
                ) {
                    return arg.card.name == 'sha' && !(arg.target.maxHp / 2 < arg.target.hp);
                }
            },
            effect: {
                player(card, player, target, current) {
                    if (card.name == 'sha' && current < 0) return 0.5;
                }
            }
        }
    },
    songzang2: {
        firstDo: true,
        //ai:{unequip2:true},
        init(player, skill) {
            if (!player.storage[skill]) player.storage[skill] = [];
        },
        onremove: true,
        trigger: {
            player: ['damage', 'damageCancelled', 'damageZero'],
            target: ['shaMiss', 'useCardToExcluded'],
        },
        filter(Evt, player) {
            return player.$.songzang2 && Evt.card && player.$.songzang2.contains(Evt.card);
        },
        silent: true,
        forced: true,
        popup: false,
        priority: 12,
        content() {
            player.$.songzang2.remove(trigger.card);
            if (!player.$.songzang2.length) player.removeSkill('songzang2');
        },
    },
    songzang3: {
        mod: {
            cardSavable(card) {
                if (card.name == 'tao') return false;
            },
        },
    },
    songzang4: {
        trigger: { player: 'dyingBegin' },
        forced: true,
        silent: true,
        firstDo: true,
        filter(Evt, player) {
            return Evt.getParent(2).songzang_buffed == true;
        },
        content() {
            player.addTempSkill('songzang3', { global: ['dyingEnd', 'phaseEnd'] });
        },
    },
    zhimao: {
        trigger: { target: 'useCardToBegin' },
        //	forced:true,
        priority: 15,
        filter(Evt, player) {
            if (!Evt.player || Evt.player == player) return false;
            //使用牌者在攻击范围外	if(player.inRange(Evt.player)) return false;
            if (get.distance(Evt.player, player, 'pure') == 1) return false;
            return (get.type(Evt.card) == 'trick');		//牌为锦囊牌
        },
        content() {
            'step 0'
            var target = trigger.player;
            if (target.getEquip(1)) {
                player.chooseControlList(
                    ['取消之并抽一张牌',
                        '获得' + get.translation(target) + '的武器牌，视为对其使用【杀】'],
                    true, function (Evt, player) {
                        return _status.event.index;
                    });
            }
            else {
                //			player.chooseControlList(
                //				['抽一张牌',
                //				'视为对其使用【杀】'],
                //				true,function(Evt,player){
                //				return _status.event.index;
                //			});
                player.draw();
                trigger.cancel();
            }
            'step 1'
            var target = trigger.player;
            //			if(target.getEquip(1)){
            if (result.index == 1) {
                player.line(target);
                player.gain(target.getEquip(1), target, 'give', 'bySelf');
                player.useCard({ name: 'sha', isCard: false }, target).animate = false;
            }
            else if (result.index == 0) {
                player.draw();
                trigger.cancel();
            }
            //		}
        },
        ai: {
            effect: {
                target(card, player, target, current) {
                    if (get.type(card, 'trick') == 'trick' && get.distance(player, target, 'pure') > 1) return 'zeroplayertarget';
                },
            }
        }
    },
    //lulu
    duixian: {
        trigger: { player: 'useCardToPlayer', target: 'useCardToPlayer' },
        usable: 1,
        filter(Evt, player) {
            return get.name(Evt.card) == 'sha';
        },
        check(Evt, player) {
            return Evt.target == player || !Evt.target.hasSkillTag('notrick');
        },
        prompt2(Evt, player) {
            return '你可将' + (Evt.player == player ? '你' : get.translation(Evt.player)) + '使用的' + get.translation(Evt.card) + '改为【决斗】';
        },
        content() {
            'step 0'
            if (!trigger.getParent().addedSkill) trigger.getParent().addedSkill = [];
            trigger.getParent().addedSkill.add('duixian');
            'step 1'
            trigger.card.name = 'juedou';
            if (get.itemtype(trigger.card) == 'card') {
                let next = game.createEvent('duixian_clear');
                next.card = trigger.card;
                Evt.next.remove(next);
                trigger.after.push(next);
                next.setContent(function () {
                    card.name = 'sha';
                });
            }
        },
        group: ['duixian_drawBy', 'duixian_disCard'],
        subSkill: {
            drawBy: {
                trigger: { global: 'damageEnd' },
                forced: true,
                filter(Evt, player) {
                    return Evt.card && get.name(Evt.card) == 'juedou' && Evt.getParent(2).name == 'useCard' && Evt.getParent(2).addedSkill && Evt.getParent(2).addedSkill.contains('duixian') && Evt.player == player;
                },
                content() {
                    player.draw(2);
                },
            },
            disCard: {
                trigger: { global: 'damage' },
                prompt2: '你可弃置对方一张牌',
                frequent: true,
                filter(Evt, player) {
                    return Evt.card && get.name(Evt.card) == 'juedou' && Evt.getParent(2).name == 'useCard' && Evt.getParent(2).addedSkill && Evt.getParent(2).addedSkill.contains('duixian') && Evt.player != player && Evt.player.countCards('he');
                },
                content() {
                    player.discardPlayerCard('###『守峡』###弃置对方一张牌', trigger.player, 'he');
                },
            }
        },
        ai: {
            effect: {
                target(card, player, target, current) {
                    if (get.name(card) == 'sha') {
                        if (target.hasSha()) return [1, 0, 0, -2];
                        if (target.hp == 1) return [1, 0, 1, 0];
                        return [1, 1, 0, -1];
                    }
                }
            }
        }
    },
    gutai: {
        trigger: { global: 'damageEnd' },
        filter(Evt, player) {
            if (Evt.player != player && Evt.getParent().player != player) return false;
            return Evt.card && Evt.getParent().name == Evt.card.name && Evt.getParent().targets.contains(Evt.player) && Evt.getParent().targets[Evt.getParent().targets.length - 1] != Evt.player;
        },
        check(Evt, player) {
            var shouxia = Evt.getParent().targets.splice(Evt.getParent().targets.indexOf(Evt.player));
            var effect = 0;
            for (var i = 0; i < shouxia.length; i++) {
                effect += get.effect(shouxia[i], Evt.card, Evt.getParent().player, player);
            }
            return effect < 0;
        },
        logTarget(Evt) {
            var targets = Evt.getParent().targets.slice(0);
            return targets.splice(targets.indexOf(Evt.player) + 1);
        },
        content() {
            trigger.getParent().targets.splice(trigger.getParent().targets.indexOf(trigger.player) + 1);
        },
    },

    caibu: new toSkill('mark', {
        marktext: '财',
        intro: {
            content: 'expansion',
            markcount: 'expansion',
        },
        onremove: function (player, skill) {
            var cards = player.getExpansions(skill);
            if (cards.length) player.loseToDiscardpile(cards);
        },
    }, 'locked'),
    luecai: {
        audio: 2,
        group: ['caibu', 'luecai_draw'],
        enable: 'phaseUse',
        usable: 1,
        filterTarget(card, player, target) {
            if (target.countCards('he') == 0 || target.countCards('h') == player.countCards('h')) return false;
            return true;
        },
        content() {
            'step 0'
            if (target.countCards('h') > player.countCards('h')) {
                player.choosePlayerCard(target, 'he', true);
            }
            else if (target.countCards('h') < player.countCards('h')) {
                target.chooseCard('he', true)
            }
            'step 1'
            if (result.bool) {
                if (target.countCards('h') > player.countCards('h')) {
                    Evt.card = result.links[0];
                }
                else if (target.countCards('h') < player.countCards('h')) {
                    Evt.card = result.cards[0];
                }
                player.addToExpansion(Evt.card, target, 'give').gaintag.add('caibu');
            }
            else Evt.finish()
            'step 2'
            game.delayx()
        },
        ai: {
            order: 10,
            result: {
                target(player, target) {
                    if (target.countCards('h') > player.countCards('h')) {
                        return lib.card.shunshou_copy2.ai.result.target.apply(this, arguments);
                    }
                    else {
                        return -1;
                    }
                },
                player(player, target) {
                    if (target.countCards('h') > player.countCards('h')) {
                        return lib.card.shunshou_copy2.ai.result.player.apply(this, arguments);
                    }
                    else {
                        return 1;
                    }
                },
            },
            expose: 0.2,
            threaten: 1.1
        },
        subSkill: {
            draw: new toSkill('trigger', {
                trigger: {
                    player: 'phaseBegin'
                },
                filter(Evt, player) {
                    return player.getExpansions('caibu').length > 0
                },
                content() {
                    'step 0'
                    player.chooseCardButton(`${get.prompt('luecai')}弃置任意张财布`, [1, Infinity], player.getExpansions('caibu'));
                    'step 1'
                    if (result.bool) {
                        player.logSkill('luecai_draw');
                        let cards = result.links;
                        player.loseToDiscardpile(cards);
                        player.draw(cards.length);
                        game.delayx()
                    }
                }
            }, 'direct')
        },
    },
    xiaoyan: {
        forced: true,
        trigger: {
            source: 'damageBegin1',
            player: 'damageBegin3'
        },
        firstDo: true,
        filter(Evt, player) {
            if (!Evt.card || !get.suit(Evt.card)) return false;
            var chk = false;
            player.getExpansions('caibu').forEach(function (c) {
                if (get.suit(c) == get.suit(Evt.card)) chk = true;
            });
            return chk;
        },
        content() {
            trigger.num++;
        },
        ai: {
            damageBonus: true,
            skillTagFilter(player, tag, arg) {
                if (!arg || !arg.card || !get.tag(arg.card, 'damage')
                ) {
                    var chk = false;
                    player.getExpansions('caibu').forEach(function (c) {
                        if (get.suit(c) == get.suit(arg.card)) chk = true;
                    });
                    return chk;
                }
            },
            effect: {
                target(card, player, target, current) {
                    if (get.tag(card, 'damage') && target.getExpansions('caibu').length) {
                        var chk = false;
                        target.getExpansions('caibu').forEach(function (c) {
                            if (get.suit(c) == get.suit(card)) chk = true;
                        });
                        if (chk) return [1, 0, 2, -1];
                    }
                },
                player(card, player, target, current) {
                    if (get.tag(card, 'damage') && player.getExpansions('caibu').length) {
                        var chk = false;
                        player.getExpansions('caibu').forEach(function (c) {
                            if (get.suit(c) == get.suit(card)) chk = true;
                        });
                        if (chk) return [1, 0, 2, -1];
                    }
                }
            }
        },
        group: ['caibu', 'xiaoyan_res', 'xiaoyan_highlight', 'xiaoyan_clear'],
        subSkill: {
            res: new toSkill('trigger', {
                content() {
                    trigger.directHit.addArray(game.filterPlayer(function (cur) {
                        return cur.countCards('h') < player.countCards('h')
                    }));
                },
            }, 'locked', 'direct').setT('useCard'),
            highlight: {
                direct: true,
                trigger: {
                    player: 'useCardToPlayered',
                    target: 'useCardToPlayered',
                },
                filter(Evt, player) {
                    if (!Evt.card || !get.suit(Evt.card)) return false;
                    if (!get.tag(Evt.card, 'damage')) return false;
                    var chk = false;
                    player.getExpansions('caibu').forEach(function (c) {
                        if (get.suit(c) == get.suit(Evt.card)) chk = true;
                    });
                    return chk;
                },
                content() {
                    game.putBuff(player, 'xiaoyan', trigger.player == player ? '.player_buff' : '.player_nerf')
                }
            },
            clear: {
                direct: true,
                silent: true,
                trigger: {
                    global: ['useCardAfter', 'respondAfter'],
                },
                content() {
                    game.clearBuff(player, 'xiaoyan')
                }
            }
        }
    },

    shiyilijia: {
        audio: 2,
        group: ['shiyilijia_draw'],
        enable: 'phaseUse',
        usable: 1,
        init(player) {
            if (player.$.shiyilijia == undefined) {
                player.$.shiyilijia = 0;
            }
        },
        filter(Evt, player) {
            return player.countCards('h');
        },
        filterCard: lib.filter.cardDiscardable,
        selectCard: -1,
        check(card) {
            var player = _status.event.player;
            if (get.position(card) == 'h' && !player.countCards('h', card => get.value(card) >= 8)) {
                return 8 - get.value(card);
            }
            return 7 - get.value(card)
        },
        content() {
            player.$.shiyilijia = cards.length;
            player.discard(cards);
        },
        mod: {
            aiOrder(player, card, num) {
                if (typeof card == 'object' && player == _status.currentPhase && get.name(card) == 'tao') {
                    var damage = (player.maxHp - player.hp) * 2;
                    return num + damage;
                }
            },
        },
        ai: { order: 4, result: { player: 1 } },
        subSkill: {
            draw: {
                forced: true,
                trigger: {
                    player: 'phaseEnd'
                },
                filter(Evt, player) {
                    return player.$.shiyilijia;
                },
                content() {
                    'step 0'
                    player.draw(player.$.shiyilijia);
                    'step 1'
                    player.$.shiyilijia = 0;
                }
            }
        }
    },
    seqinghuashen: {
        audio: 2,
        trigger: { global: 'useCardAfter' },
        logTarget: 'player',
        filter(Evt, player) {
            return Evt.card.name == 'tao'
                && Evt.player != player
                && get.itemtype(Evt.cards) == 'cards'
                && get.position(Evt.cards[0], true) == 'o';
        },
        content() {
            'step 0'
            trigger.player.draw(player);
            'step 1'
            var target = trigger.player;
            if (target.countGainableCards(player, 'he')) {
                player.gainPlayerCard('he', target, true);
            }
        }
    },

    DDzhanshou: new toSkill('trigger', {
        audio: 3,
        filter(Evt, player) {
            return Evt.targets && Evt.targets.length;
        },
        content() {
            'step 0'
            player.chooseTarget(get.prompt2('DDzhanshou'), function (card, player, target) {
                return _status.event.targets.contains(target);
            }).set('ai', function (target) {
                if (get.attitude(_status.event.player, target) < 0 && target.countCards('h') == 0) return 0;
                if (get.attitude(_status.event.player, target) > 0 && target.countCards('h') <= 3) return 4 + get.attitude(_status.event.player, target);
                return 2 - get.attitude(_status.event.player, target);
            }).set('targets', trigger.targets);
            'step 1'
            if (result.bool) {
                Evt.target = result.targets[0];
                if (player.hasZhuSkill('xinluezhili') && player != Evt.target) {
                    Evt.target.addSkill('xinluezhili_draw');
                }
                var count = 0
                if (Evt.target.countCards('h') >= player.countCards('h')) count++
                if (Evt.target.hp >= player.hp) count++
                if (Evt.target.countCards('e') >= player.countCards('e')) count++
                player.choosePlayerCard(Evt.target, 'he', [1, count], "移除至多" + count + "张牌").set('ai', function (button) {
                    var player = _status.event.player;
                    var target = _status.event.target;
                    var count = _status.event.count;
                    var info = get.info(button.link)
                    if (get.attitude(player, target) >= 0) {
                        if (target.countCards('h') <= count) {
                            if (ui.selected.buttons.length < target.countCards('h') && get.position(button.link) == 'h') {
                                return 12;
                            }
                        }
                        if (info.onLose && get.position(button.link) == 'e') return 8;
                        if (get.value(button.link, target) < 0) return 6;
                        return 0;
                    }
                    else {
                        if (info.onLose && get.position(button.link) == 'e') return 0;
                        return get.value(button.link);
                    }
                }).set('count', count);
            }
            else Evt.finish()
            'step 2'
            if (result.bool) {
                let target = Evt.target
                player.logSkill('DDzhanshou', target);
                target.addToExpansion(result.cards, 'giveAuto', target).gaintag.add('DDzhanshou_card');
                target.addSkill('DDzhanshou_card');
            }
            'step 3'
            if (Evt.target.countCards('h') == 0) {
                Evt.target.draw();
            }
        },
        subSkill: {
            card: new toSkill('trigger', {
                audio: false,
                trigger: {
                    global: 'phaseEnd'
                },
                intro: {
                    markcount: 'expansion',
                    mark(dialog, storage, player) {
                        var cards = player.getExpansions('DDzhanshou_card');
                        if (player.isUnderControl(true)) dialog.addAuto(cards);
                        else return '共有' + get.cnNumber(cards.length) + '张牌';
                    },
                },
                content() {
                    'step 0'
                    var cards = player.getExpansions('DDzhanshou_card');
                    player.gain(cards, 'draw');
                    game.log(player, '收回了' + get.cnNumber(cards.length) + '张『DD斩首』牌');
                    'step 1'
                    player.removeSkill('DDzhanshou_card');
                },
            }, 'mark', 'direct')
        }
    }, 'direct').setT('useCard2'),
    xinluezhili: {
        unique: true,
        zhuSkill: true,
        global: 'xinluezhili_draw'
    },
    xinluezhili_draw: new toSkill('trigger', {
        filter(Evt, player) {
            if (player.countCards('h') || !Evt.hs || !Evt.hs.length) return false;
            let dogmom = _status.currentPhase
            if (!dogmom || dogmom === player || !dogmom.hasZhuSkill('xinluezhili')) return false;
            return true;
        },
        check(Evt, player) {
            let dogmom = _status.currentPhase
            return get.attitude(player, dogmom) > 0;
        },
        content() {
            let dogmom = _status.currentPhase
            game.asyncDraw([dogmom])
        }
    }).setT('loseAfter'),


    maoliang: new toSkill('mark', {
        marktext: '粮',
        intro: {
            mark(dialog, storage, player) {
                if (player.countCards('s', card => card.hasGaintag('maoliang')))
                    dialog.addAuto(player.getCards('s', card => card.hasGaintag('maoliang')));
            },
            markcount(storage, player) {
                return player.countCards('s', card => card.hasGaintag('maoliang'));
            },
            onunmark(storage, player) {
                let cards = player.getCards('s', card => card.hasGaintag('maoliang'));
                if (cards.length) {
                    player.lose(cards, ui.discardPile);
                    player.$throw(cards, 1000);
                    game.log(cards, '进入了弃牌堆');
                }
            },
        },
        cardAround(player) {
            return player.getCards('s', card => card.hasGaintag('maoliang'));
        },
    }),
    jiumao: {
        audio: 2,
        global: 'jiumao_put',
        group: ['maoliang', 'jiumao_cardDisable', 'jiumao_lose'],
        subSkill: {
            put: new toSkill('active', {
                audio: 'jiumao',
                usable: 1,
                filter(Evt, player) {
                    return player.countCards('h');
                },
                filterTarget(card, player, target) {
                    return target.hasSkill('jiumao');
                },
                complexCard: true,
                check(card, player) {
                    player = _status.event.player
                    if (player.countCards() > ui.selected.cards.length + player.getHandcardLimit()) return 7 - get.value(card);
                    return 1 - get.value(card);
                },
                prompt() {
                    let list = game.filterPlayer(cur => cur.hasSkill('jiumao'));
                    let str = '将至少一张牌置于' + get.$t(list);
                    if (list.length > 1) str += '中一人';
                    str += '的武将牌上'
                    return str;
                },
                position: 'h',
                filterCard: true,
                selectCard: [1, Infinity],
                discard: false,
                toStorage: true,
                content() {
                    player.$give(cards, target, false);
                    player.loseToSpecial(cards, 'maoliang', target);
                    target.showCards(target.getCards('s', card => card.hasGaintag('maoliang')), `${get.translation(target)}的猫粮`);
                    game.delayx();
                },
                ai: {
                    order: 0.2,
                    result: {
                        target: 1
                    }
                }
            }),
            cardDisable: new toSkill('rule', {
                mod: {
                    cardEnabled2(card, player) {
                        if (get.position(card) == 's' && card.hasGaintag('maoliang')) {
                            if (player.$.jiumao_used >= 3) return false;
                        }
                    }
                },
                popup: false,
                filter(Evt, player) {
                    return player.hasHistory('lose', evt => {
                        if (evt.getParent() != Evt) return false;
                        for (var i in evt.gaintag_map) {
                            if (evt.gaintag_map[i].contains('maoliang')) return true;
                        }
                        return false;
                    });
                },
                content() {
                    if (player.hasSkill('jiumao_used')) {
                        player.$.jiumao_used++
                    }
                    else {
                        player.addTempSkill('jiumao_used');
                    }
                },
            }, 'forced', 'silent').setT(['useCard', 'respond']),
            lose: new toSkill('rule', {
                trigger: { player: 'loseEnd' },
                firstDo: true,
                silent: true,
                filter(Evt, player) {
                    if (!Evt.ss || !Evt.ss.length) return false;
                    for (let i in Evt.gaintag_map) {
                        if (Evt.gaintag_map[i].includes('maoliang')) return true;
                    }
                },
                content() {
                    player.updateMarks();
                },
            }),
            used: new toSkill('mark', {
                intro: {
                    content: '本回合已发动#次『啾猫』'
                },
            }, 'mark', 'onremove').setI(1)
        },
    },
    enfan: {
        subSkill: {
            count: {
                trigger: {
                    global: "recoverBegin",
                },
                forced: true,
                silent: true,
                popup: false,
                filter(Evt, player) {
                    if (!Evt.card) return false;
                    if (!Evt.source || Evt.source != player) return false;
                    if (!Evt.player.isDying()) return false;
                    if (Evt.player.$.yizhan_mark != undefined) return false;
                    return true;
                },
                content() {
                    trigger.enfan = true;
                },
            },
        },
        audio: true,
        group: ['enfan_count'],
        trigger: {
            global: "recoverAfter",
        },
        filter(Evt, player) {
            if (Evt.player.isDying()) return false;
            return Evt.enfan == true;
        },
        direct: true,
        content() {
            'step 0'
            Evt.target = trigger.player;
            player.chooseCard('s', [1, Infinity], function (card) {
                return card.hasGaintag('maoliang');
            })
                .set('logSkill', ['enfan', Evt.target])
                .set('ai', card => {
                    var target = _status.event.target;
                    return get.value(card, target) / 1.5 - target.countCards('h');
                })
                .set('target', Evt.target)
                .set('prompt', get.prompt2('enfan', player));
            'step 1'
            if (result.bool && result.cards) {
                player.give(result.cards, Evt.target, false);
            }
            else Evt.finish();
            'step 2'
            if (player.countCards('h') == Evt.target.countCards('h') && player.countCards('s', card => card.hasGaintag('maoliang'))) {
                Evt.target.chooseCardButton(player.getCards('s', card => card.hasGaintag('maoliang')).slice(0)).set('filterButton', function (button) {
                    var player = _status.event.player;
                    return ['basic', 'trick'].contains(get.type(button.link)) && player.hasUseTarget(button.link);
                }).set('ai', function (button) {
                    var player = _status.event.player;
                    return player.getUseValue(button.link);
                }).set('prompt', `可以视为使用一张${get.translation(player)}的「猫粮」`);
            }
            else Evt.finish();
            'step 3'
            if (result.bool && result.links) {
                var card = result.links[0];
                Evt.target.chooseUseTarget(game.createCard(card));
            }
        },
    },
    shiqi: {
        audio: 1,
        trigger: { global: 'phaseDrawBegin' },
        forced: true,
        zhuSkill: true,
        filter(Evt, player) {
            if (!player.hasZhuSkill('shiqi') || Evt.player.group != player.group) return false;
            return true;
        },
        logTarget: 'player',
        content() {
            trigger.num++;
        },
    },

    yinliu: {
        enable: 'phaseUse',
        usable: 1,
        filter(Evt, player) {
            return player.countDiscardableCards(player, 'he') > 0;
        },
        check(card) {
            return 7 - get.value(card);
        },
        filterCard: true,
        position: 'he',
        selectCard: [1, 3],
        content() {
            'step 0'
            game.delayx();
            if (player.countCards('h') == 0) {
                player.addTempSkill('yinliu_end');
            }
            'step 1'
            player.draw();
            'step 2'
            if (get.itemtype(result) == 'cards') {
                player.showCards(result);
                cards.forEach(function (cur) {
                    if (get.suit3(result).contains(get.suit(cur))) Evt.goto(1);
                })
            }
        },
        ai: {
            order: 5,
            result: {
                player: 1,
            },
        },
        subSkill: {
            end: {
                trigger: {
                    player: 'phaseEnd',
                },
                direct: true,
                filter(Evt, player) {
                    return player.countCards('he') > 0;
                },
                content() {
                    'step 0'
                    player.chooseCard({
                        position: 'he',
                        selectCard: [1, 3],
                        prompt: get.prompt2('yinliu'),
                    })
                    'step 1'
                    if (result.bool) {
                        player.useSkill('yinliu', result.cards);
                    }
                },
            }
        }
    },
    dunzou: {
        trigger: {
            global: 'useCardAfter',
        },
        filter(Evt, player) {
            //console.log(_status.currentPhase);
            return player != _status.currentPhase &&
                // Evt.player != player &&
                Evt.card &&
                get.suit(Evt.card) == 'club' &&
                Evt.targets.contains(player);
        },
        content() {
            player.addTempSkill('dunzou_enable', 'none');//移除游戏
            game.broadcastAll(function (splayer) {
                splayer.out('dunzou_enable');
            }, player)
        },
    },
    dunzou_enable: {
        trigger: { global: 'phaseEnd' },
        mark: true,
        direct: true,
        filter(Evt, player) {
            game.broadcastAll(function (splayer) {
                splayer.in('dunzou_enable');
            }, player)
            //
            return true;
        },
        intro: {
            content: '移除游戏外'
        },
        content() {
            game.broadcastAll(function (splayer) {
                _status.dying.remove(splayer);
            }, player)
            player.removeSkill('dunzou_enable');
        }
    },

    milijianying: new toSkill('trigger', {
        direct: true,
        mark: true,
        marktext: '性',
        locked: true,
        intro: {
            content(storage, player, skill) {
                return "当前为" + get.translation(player.sex);
            },
        },
        trigger: {
            player: 'useCardAfter',
        },
        filter(Evt, player) {
            return get.name(Evt.card) == 'sha';
        },
        content() {
            if (player.sex == 'female') {
                player.sex = 'male';
            }
            else {
                player.sex = 'female'
            }
            player.markSkill('milijianying');
        },
        group: 'milijianying_cixiong',
        subSkill: {
            cixiong: {
                equipSkill: true,
                noHidden: true,
                inherit: 'cixiong_skill',
            },
        }
    }),
    dianyinchuancheng: {
        trigger: {
            player: 'damageEnd',
        },
        direct: true,
        content() {
            "step 0"
            Evt.count = trigger.num;
            "step 1"
            if (Evt.count)
                Evt.count--;
            var X = game.countPlayer(function (cur) {
                return cur.hp >= player.hp;
            })
            player.$.Xvalue = X;
            player.chooseTarget("你可以与一名与你手牌数差不大于" + player.$.Xvalue + "的角色交换手牌", function (card, player, target) {
                return Math.abs(player.countCards('h') - target.countCards('h')) <= player.$.Xvalue
                // && target != player;
            }).set('ai', function (target) {
                var att = get.attitude(_status.event.player, target);
                if (att > 2) {
                    return Math.abs(player.countCards('h') - target.countCards('h'));
                }
                return att / 3;
            });
            "step 2"
            delete player.$.Xvalue;
            if (result.bool) {
                Evt.target = result.targets[0];
                player.logSkill('dianyinchuancheng', Evt.target);
                player.swapHandcards(Evt.target);
            }
            else {
                Evt.finish();
            }
            'step 3'
            if (Evt.target) {
                var max = Math.max(player.countCards('h'), Evt.target.countCards('h'));
                if (max > player.countCards('h')) player.gain(get.cards(max - player.countCards('h')), 'draw', 'log');
                if (max > Evt.target.countCards('h')) Evt.target.gain(get.cards(max - Evt.target.countCards('h')), 'draw', 'log');
                if (Evt.count) Evt.goto(1);
            }
        },
    },

    shushi: {
        init(player, skill) {
            if (!player.storage[skill]) player.storage[skill] = 0;
        },
        trigger: { player: ['phaseJudgeBegin', 'phaseDrawBegin', 'phaseUseBegin', 'phaseDiscardBegin'] },
        priority: 41,
        filter(Evt, player) {
            return (player.$.shushi < Math.max(game.countPlayer(), 5));
        },
        prompt(Evt, player) {
            return get.translation(Evt.name) + '开始,' + get.prompt('shushi');
        },
        content() {
            'step 0'
            let list = ['不观看牌'];
            var att = Math.max(game.countPlayer(), 5) - player.$.shushi;
            var prompt2 = player.$.shushi ? '你本回合已看' + get.cnNumber(player.$.shushi) + '张牌' : '你本回合未看牌';
            for (var i = 1; i <= att; i++) {
                list.push('观看' + get.cnNumber(i) + '张牌');
            }
            if (player.countCards('h', { type: 'trick' }) < 2 || ['phaseZhunbei', 'phaseDraw', 'phaseUse'].contains(trigger.name)) att = 0;
            player.chooseControlList(prompt2
                , list, true, function () {
                    return _status.event.att;
                }).set('att', att);
            'step 1'
            if (result.index == 0) {
                Evt.finish();
            } else if (result.index) {
                player.$.shushi += result.index;
                player.chooseCardButton(result.index, get.cards(result.index), true, '『书史』：按顺序将卡牌置于牌堆顶（先选择的在上）').set('ai', function (button) {
                    var player = _status.event.player;
                    let next = _status.event.phase == 'phaseJudge' ? player : player.getNext();
                    var att = get.attitude(player, next);
                    var card = button.link;
                    var judge = next.getCards('j')[ui.selected.buttons.length];
                    if (judge) {
                        return get.judge(judge)(card) * att;
                    }
                    return next.getUseValue(card) * att;
                }).set('phase', trigger.name)
            }
            'step 2'
            if (result.bool) {
                let list = result.links.slice(0);
                while (list.length) {
                    ui.cardPile.insertBefore(list.pop(), ui.cardPile.firstChild);
                }
            }
        },
        mod: {
            maxHandcard(player, num) {
                return num += Math.max(game.countPlayer(), 5) - player.$.shushi;
            },
        },
        group: 'shushi_clear',
        subSkill: {
            clear: {
                trigger: { player: 'phaseAfter' },
                forced: true,
                silent: true,
                firstDo: true,
                filter(Evt, player) {
                    return player.$.shushi;
                },
                content() {
                    player.$.shushi = 0;
                }
            },
        },
        ai: {
            guanxing: true,
        }
    },
    zengzhi: {
        trigger: { player: 'useCardAfter' },
        priority: 41,
        filter(Evt, player) {
            if (!player.isPhaseUsing() || !Evt.card.isCard) return false;
            var card = Evt.card;
            var info = get.info(card);
            if (info.type != 'trick' || info.allowMultiple == false) return false;
            if (Evt.targets && !info.multitarget) {
                if (game.hasPlayer(function (cur) {
                    return Evt.targets.contains(cur) && lib.filter.targetEnabled2(card, player, cur);
                })) {
                    return true;
                }
            }
            return false;
        },
        content() {
            'step 0'
            Evt.card = trigger.card;
            player.judge(card => {
                return get.suit(card) == get.suit(_status.event.getParent('zengzhi').card) ? 2 : -2;
            });
            'step 1'
            if (result.bool) {
                var card = game.createCard(Evt.card.name, Evt.card.suit, Evt.card.number, Evt.card.nature);
                player.useCard(card, (trigger._targets || trigger.targets).slice(0), trigger.cards).skill = trigger.skill || 'zengzhi';
            }
        },
    },

    shuangshoujiaoying: {
        trigger: { player: 'shaBegin' },
        content() {
            'step 0'
            player.chooseBool('【确定】展示对方手牌，【取消】展示自己手牌');
            'step 1'
            Evt.replayers = [];
            if (result.bool) {
                Evt.chooseBool = true;
                Evt.replayers = trigger.targets;
            }
            else {
                Evt.chooseBool = false;
                Evt.replayers.add(player);
            }
            'step 2'
            if (Evt.replayers.length > 0) {
                Evt.replayer = Evt.replayers[0];
                Evt.cards = Evt.replayer.getCards('h');
                Evt.replayer.showHandcards();
                game.delayx();
            }
            else {
                Evt.finish();
            }
            'step 3'
            Evt.recards = [];
            if (Evt.cards && Evt.cards.length > 0) {
                if (player.$.anyingxuemai) {
                    for (let i of Evt.cards) {
                        if (get.suit(i) == 'heart' || get.suit(i) == 'diamond') {
                            Evt.recards.add(i);
                        }
                    }
                }
                else {
                    for (let i of Evt.cards) {
                        if (i.name == 'shan') {
                            Evt.recards.add(i);
                        }
                    }
                }
            }
            if (Evt.recards.length > 0) {
                Evt.replayer.lose(Evt.recards, ui.discardPile);
                Evt.replayer.$throw(Evt.recards);
                game.log(Evt.replayer, '将', Evt.recards, '置入了弃牌堆');
                Evt.replayer.draw(Evt.recards.length);
            }
            'step 4'
            if (Evt.recards.length > 0) {
                if (Evt.replayers.contains(Evt.replayer) && Evt.chooseBool) {
                    player.draw(1);
                }
                if (player == Evt.replayer) {
                    if (trigger.getParent().addCount !== false) {
                        trigger.getParent().addCount = false;
                        var stat = player.getStat();
                        if (stat && stat.card && stat.card[trigger.card.name]) stat.card.sha--;
                    }
                }
            }
            Evt.replayers.shift();
            if (Evt.replayers.length > 0) {
                Evt.goto(1)
            }
        }
    },
    shuangshoujiaoying_gai: {
        trigger: { player: 'shaBegin' },
        content() {
            'step 0'
            player.chooseBool('【确定】展示对方手牌，【取消】展示自己手牌');
            'step 1'
            Evt.replayers = [];
            if (result.bool) {
                Evt.chooseBool = true;
                Evt.replayers = trigger.targets;
            }
            else {
                Evt.chooseBool = false;
                Evt.replayers.add(player);
            }
            'step 2'
            if (Evt.replayers.length > 0) {
                Evt.replayer = Evt.replayers[0];
                Evt.cards = Evt.replayer.getCards('h');
                Evt.replayer.showHandcards();
                game.delayx();
            }
            else {
                Evt.finish();
            }
            'step 3'
            Evt.recards = [];
            if (Evt.cards && Evt.cards.length > 0) {
                for (let i of Evt.cards) {
                    if (get.suit(i) == 'heart' || get.suit(i) == 'diamond') {
                        Evt.recards.add(i);
                    }
                }
            }
            if (Evt.recards.length > 0) {
                Evt.replayer.lose(Evt.recards, ui.discardPile);
                Evt.replayer.$throw(Evt.recards);
                game.log(Evt.replayer, '将', Evt.recards, '置入了弃牌堆');
                Evt.replayer.draw(Evt.recards.length);
            }
            'step 4'
            if (Evt.recards.length > 0) {
                if (Evt.replayers.contains(Evt.replayer) && Evt.chooseBool) {
                    player.draw(1);
                }
                if (player == Evt.replayer) {
                    player.getStat().card.sha--;
                }
            }
            Evt.replayers.shift();
            if (Evt.replayers.length > 0) {
                Evt.goto(1)
            }
        }
    },
    anyingxuemai: {
        trigger: {
            player: "dying",
        },
        skillAnimation: true,
        animationColor: 'metal',
        audio: 2,
        unique: true,
        limited: true,
        // enable:'chooseToUse',
        //viewAs:{name:'tao'},
        init(player) {
            player.$.anyingxuemai = false;
        },
        mark: true,
        filter(Evt, player) {
            //console.log(Evt,player);
            if (Evt.name != 'dying') return false;
            //if(player!=Evt.dying) return false;
            if (player.$.anyingxuemai) return false;
            if (player.countCards('h') == 0) return false;
            return true;
        },
        content() {
            "step 0"
            player.awakenSkill('anyingxuemai');
            player.showHandcards();
            var handcards = player.getCards('h');
            var suitlist = [0, 0, 0, 0];
            for (let i of handcards) {
                if (get.suit(i) == 'spade') {
                    suitlist[0]++;
                }
                if (get.suit(i) == 'heart') {
                    suitlist[1]++;
                }
                if (get.suit(i) == 'diamond') {
                    suitlist[2]++;
                }
                if (get.suit(i) == 'club') {
                    suitlist[3]++;
                }
            }
            suitlist.sort();
            var recoverHp = 0;
            for (let i of suitlist) {
                if (i != 0) {
                    recoverHp = i;
                    break;
                }
            }
            player.recover(recoverHp);
            "step 1"
            player.$.anyingxuemai = true;
            player.removeSkill('shuangshoujiaoying');
            player.addSkill('shuangshoujiaoying_gai');
        },
    },
    //heichuan
    zhengtibuming: {
        audio: 5,
        unique: true,
        popup: false,
        trigger: {
            player: ['phaseBegin', 'phaseEnd', 'zhengtibuming']
        },
        filter(Evt, player) {
            return player.$.zhengtibuming && player.$.zhengtibuming.character.length > 0;
        },
        group: ['zhengtibuming_init', 'zhengtibuming_onDamaged'],
        init(player, skill) {
            if (!player.storage[skill]) player.storage[skill] = {
                character: [],
                characterskillMap: {}
            };
        },
        content() {
            var opts = ['更改亮出的「替身」', '随机更换一张「替身」', '返回'];
            'step 0'
            //create Dialog
            console.log('zt 0')
            _status.noclearcountdown = true;//mark
            Evt.videoId = lib.status.videoId++;
            var cards = player.$.zhengtibuming.character;
            if (player.isOnline2()) {//mark
                player.send(function (cards, id) {
                    var dialog = ui.create.dialog('是否发动【替身】？', [cards, 'character']);
                    dialog.videoId = id;
                }, cards, Evt.videoId);
            }
            Evt.dialog = ui.create.dialog(get.prompt('zhengtibuming'), [cards, 'character']);
            if (!Evt.isMine()) {
                Evt.dialog.style.display = 'none';
            }
            Evt.dialog.videoId = Evt.videoId;
            Evt.closeDialog = (player, videoId) => {
                if (player.isOnline2()) {
                    player.send('closeDialog', videoId);
                }
                Evt.dialog.close();
                delete _status.noclearcountdown;
                if (!_status.noclearcountdown) {
                    game.stopCountChoose();
                }
            };
            Evt.setDialogPrompt = function (id, prompt) {
                var dialog = get.idDialog(id);//通过id获取dialog
                if (dialog) {
                    dialog.content.childNodes[0].innerHTML = prompt;
                }
            }
            Evt.configPrompt = (id, prompt) => {
                if (!Evt.dialog || Evt.dialog.content.childNodes[0].innerHTML == prompt) return;
                if (player.isOnline2()) {
                    player.send(this.setDialogPrompt, id, prompt);
                }
                else if (Evt.isMine()) {
                    this.setDialogPrompt(id, prompt);
                }
            }
            //choose one control
            if (Evt.triggername == 'zhengtibuming') {
                Evt._result = { control: opts[0] };
            } else {
                //ai
                var cond = Evt.triggername == 'phaseBegin' ? 'in' : 'out';
                var aiChoiceSkill = -Infinity;
                for (var i in player.$.zhengtibuming.characterskillMap) {
                    var sks = player.$.zhengtibuming.characterskillMap[i];
                    if (!sks) continue;
                    for (var j in sks) {
                        if (get.skillRank(sks[j], cond) > get.skillRank(aiChoiceSkill, cond)) {
                            aiChoiceSkill = sks[j];
                        }
                    }
                }

                if (aiChoiceSkill == player.$.zhengtibuming.currentSkill || get.skillRank(aiChoiceSkill, cond) < 1) {
                    Evt.aiOpt = opts[1];
                } else {
                    Evt.aiOpt = opts[0];
                }
                Evt.aiChoiceSkill = aiChoiceSkill;
                player.chooseControl(opts[0], opts[1], 'cancel2').set('ai', function () {
                    return _status.event.aiOpt;
                }).set('aiOpt', Evt.aiOpt);
            }
            'step 1'
            if (result.control == opts[0]) {
                Evt.goto(3);
            } else if (result.control != opts[1]) {
                Evt.closeDialog(player, Evt.videoId);
                Evt.finish();
                return;
            }
            if (!Evt.logged) {
                player.logSkill('zhengtibuming');
                Evt.logged = true;
            }
            'step 2'
            Evt.configPrompt(Evt.videoId, opts[1]);
            Evt.closeDialog(player, Evt.videoId);
            let list = [];
            for (let i = 0; i < player.$.zhengtibuming.character.length; ++i) {
                let ch = player.$.zhengtibuming.character[i];
                if (player.$.zhengtibuming.current && ch == player.$.zhengtibuming.current) continue;
                list.push(ch);
            }
            if (list.length) {
                let selectedTishenId = Math.floor(Math.random() * list.length);
                let selectedTishenName = list[selectedTishenId];
                lib.skill.zhengtibuming.exchangeTishen(player, selectedTishenName);
            }
            Evt.finish();
            'step 3'
            Evt.configPrompt(Evt.videoId, opts[0]);
            //choose one character
            player.chooseButton(true).set('dialog', Evt.videoId).set('dialog', Evt.videoId).set('ai', (button) => {
                return player.$.zhengtibuming.characterskillMap[button.link].contains(_status.event.aiChoiceSkill) ? 2.5 : 0;
            }).set('aiChoiceSkill', Evt.aiChoiceSkill);
            'step 4'
            if (result.bool) {
                Evt.prepareCard = result.links[0];
                let func = function (card, id) {
                    var dialog = get.idDialog(id);
                    if (dialog) {
                        for (var i = 0; i < dialog.buttons.length; i++) {
                            if (dialog.buttons[i].link == card) {
                                dialog.buttons[i].classList.add('selectedx');
                            }
                            else {
                                dialog.buttons[i].classList.add('unselectable');
                            }
                        }
                    }
                }
                if (player.isOnline2()) {
                    player.send(func, Evt.prepareCard, Evt.videoId);
                }
                else if (Evt.isMine()) {
                    func(Evt.prepareCard, Evt.videoId);
                }
                //choose one skill or go back
                let list = player.$.zhengtibuming.characterskillMap[Evt.prepareCard].slice(0);
                list.push(opts[2]);
                //ai
                if (!list.contains(Evt.aiChoiceSkill)) Evt.aiOpt = list[0];
                else Evt.aiOpt = Evt.aiChoiceSkill;
                player.chooseControl(list).set('ai', () => {
                    return _status.event.aiOpt;
                }).set('aiOpt', Evt.aiOpt);
            } else {
                Evt.goto(3);
            }
            'step 5'
            if (result.control == opts[2]) {
                let func = function (id) {
                    var dialog = get.idDialog(id);
                    if (dialog) {
                        for (var i = 0; i < dialog.buttons.length; i++) {
                            dialog.buttons[i].classList.remove('selectedx');
                            dialog.buttons[i].classList.remove('unselectable');
                        }
                    }
                }
                if (player.isOnline2()) {
                    player.send(func, Evt.videoId);
                }
                else if (Evt.isMine()) {
                    func(Evt.videoId);
                }
                Evt.goto(3);
            } else {
                Evt.closeDialog(player, Evt.videoId);
                Evt.finish();
                if (player.$.zhengtibuming.current != Evt.prepareCard) {
                    player.$.zhengtibuming.current = Evt.prepareCard;
                    game.broadcastAll(function (character, player) {
                        player.sex = lib.character[character][0];
                        player.group = lib.character[character][1];
                        player.node.name.dataset.nature = get.groupnature(player.group);
                    }, Evt.prepareCard, player);
                }
                var selectedSkill = result.control;
                player.$.zhengtibuming.currentSkill = selectedSkill;
                if (!player.additionalSkills.zhengtibuming || !player.additionalSkills.zhengtibuming.contains(selectedSkill)) {
                    player.addAdditionalSkill('zhengtibuming', selectedSkill);
                    player.flashAvatar('zhengtibuming', Evt.prepareCard);
                    game.log(player, '获得技能', '#g【' + get.translation(selectedSkill) + '】');
                    player.popup(selectedSkill);//mark
                    player.syncStorage('zhengtibuming');
                    player.updateMarks('zhengtibuming');
                }
            }
        },
        banned: ['Kaf'],
        characterFilter(character, player) {//true is right.
            var info = lib.character[character];
            if (info[1] == 'shen') return false;
            if (Number(info[2]) < 4 && info[3].length && info[3].length <= 2 && (character.indexOf('re_') != 0 && character.indexOf('sea_') != 0) && player.hp > 1) return false;//&&Math.random()<0.4
            return character.indexOf('heichuan') == -1 && !player.$.zhengtibuming.character.contains(character) && !lib.skill.zhengtibuming.banned.contains(character);
        },
        addTishen(player) {
            if (!player.$.zhengtibuming) return;
            if (!_status.characterlist) {//mark
                let list
                if (_status.connectMode) list = get.charactersOL();
                else {
                    list = get.gainableCharacters(true);
                }
                game.countPlayer2(function (cur) {
                    list.remove(cur.name);
                    list.remove(cur.name1);
                    list.remove(cur.name2);
                    if (cur.$.zhengtibuming && cur.$.zhengtibuming.character) list.remove(cur.$.zhengtibuming.character);
                });
                _status.characterlist = list;
            }
            if (!_status.characterlist.length) return;
            var selectedId;
            var rollCnt = 0;
            do {
                ++rollCnt;
                if (rollCnt > 256) {
                    let list = [];
                    for (let i = 0; i < _status.characterlist.length; ++i) {
                        var name = _status.characterlist[i];
                        if (!lib.skill.zhengtibuming.characterFilter(name, player)) continue;
                        list.push(i);
                    }
                    if (!list.length) return;
                    selectedId = list[Math.floor(Math.random() * list.length)];
                    break;
                }
                selectedId = Math.floor(Math.random() * _status.characterlist.length);
            } while (!lib.skill.zhengtibuming.characterFilter(_status.characterlist[selectedId], player));
            var name = _status.characterlist[selectedId];
            var allSkills = lib.character[name][3];
            var skills = [];
            for (var i = 0; i < allSkills.length; ++i) {
                var info = lib.skill[allSkills[i]];
                if (info.charlotte || (info.unique && !info.gainable) || info.juexingji || info.limited || info.zhuSkill || info.hiddenSkill) continue;
                skills.push(allSkills[i]);
            }

            if (skills.length) {
                player.$.zhengtibuming.character.push(name);
                player.$.zhengtibuming.characterskillMap[name] = skills;
                _status.characterlist.remove(name);
                return name;
            }
            return undefined;
        },
        removeTishens(player, links) {
            if (!player.$.zhengtibuming || !links) return;
            if (!(links instanceof Array)) return;
            player.$.zhengtibuming.character.removeArray(links);
            _status.characterlist.addArray(links);
            game.log(player, '移去了', get.cnNumber(links.length) + '张', '#g【替身】')//log
        },
        exchangeTishen(player, oriTishen) {
            var name = lib.skill.zhengtibuming.addTishen(player);
            if (name) {
                lib.skill.zhengtibuming.removeTishens(player, [oriTishen]);
                game.log(player, '获得了', get.cnNumber(1) + '张', '#g【替身】')//log
                lib.skill.zhengtibuming.drawCharacters(player, [name]);
            }
        },
        addTishens(player, cnt) {
            if (!cnt) return;
            var list = [];
            for (var i = 0; i < cnt; ++i) {
                var name = lib.skill.zhengtibuming.addTishen(player);
                if (name) list.push(name);
            }
            if (list.length) {
                game.log(player, '获得了', get.cnNumber(list.length) + '张', '#g【替身】')//log
                lib.skill.zhengtibuming.drawCharacters(player, list);
            }
        },
        drawCharacters(player, list) {//copy//mark
            game.broadcastAll(function (player, list) {
                if (player.isUnderControl(true)) {
                    var cards = [];
                    for (var i = 0; i < list.length; i++) {
                        var cardname = 'tishen_card' + list[i];
                        lib.card[cardname] = {
                            fullimage: true,
                            image: 'character:' + list[i]
                        }
                        lib.translate[cardname] = get.rawName2(list[i]);
                        cards.push(game.createCard(cardname, '', ''));
                    }
                    player.$draw(cards, 'nobroadcast');
                }
            }, player, list);
        },
        intro: {
            onunmark(storage, player) {
                _status.characterlist.addArray(storage.character);
                storage.character = [];
            },
            mark(dialog, storage, player) {
                if (storage && storage.current) dialog.addSmall([[storage.current], 'character']);
                if (storage && storage.currentSkill)
                    dialog.add('<div><div class="skill">'
                        + get.translation(storage.currentSkill).slice(0, 2)
                        + '</div><div>' + get.skillInfoTranslation(storage.currentSkill, player)
                        + '</div></div>');
                if (storage && storage.character.length) {
                    if (player.isUnderControl(true)) {
                        dialog.addSmall([storage.character, 'character']);
                    }
                    else {
                        dialog.addText('共有' + get.cnNumber(storage.character.length) + '张「替身」');
                    }
                }
                else {
                    return '没有替身';
                }
            },
            content(storage, player) {
                return '共有' + get.cnNumber(storage.character.length) + '张「替身」'
            },
            markcount(storage, player) {
                if (storage && storage.character) return storage.character.length;
                return 0;
            },
        },
        cardAround: true,
        subSkill: {
            init: {
                trigger: {
                    global: 'gameDrawAfter',
                    player: 'enterGame'
                },
                forced: true,
                popup: false,
                content() {
                    lib.skill.zhengtibuming.addTishens(player, 3);
                    player.syncStorage('zhengtibuming');
                    player.markSkill('zhengtibuming');
                    let next = game.createEvent('zhengtibuming');
                    next.player = player;
                    next._trigger = trigger;
                    next.triggername = 'zhengtibuming';
                    next.setContent(lib.skill.zhengtibuming.content);
                }
            },
            onDamaged: {
                trigger: { player: 'damageEnd' },
                forced: true,
                popup: false,
                content() {
                    if (trigger.num && trigger.num > 0) {
                        lib.skill.zhengtibuming.addTishens(player, trigger.num);
                        player.syncStorage('zhengtibuming');
                        player.updateMarks('zhengtibuming');
                    }
                },
            }
        }
    },
    lunhuizuzhou: {
        locked: true,
        direct: true,
        trigger: {
            player: 'recoverBegin'
        },
        group: 'lunhuizuzhou_onDie',
        content() {
            if (trigger.source != trigger.player) {
                trigger.cancel();
            }
        },
        subSkill: {
            onDie: {
                trigger: { player: 'die' },
                direct: true,
                skillAnimation: true,
                animationColor: 'wood',
                forceDie: true,
                content() {
                    "step 0"
                    player.chooseTarget(get.prompt2('lunhuizuzhou'), function (card, player, target) {
                        return player != target;//&&_status.event.sourcex!=target;
                    }).set('forceDie', true).set('ai', function (target) {
                        var num = 10 - get.attitude(_status.event.player, target);
                        if (num > 0) {
                            if (target.hp == 1) {
                                num += 2;
                            }
                            if (target.hp < target.maxHp) {
                                num += 2;
                            }
                        }
                        return num;
                    }).set('sourcex', trigger.source);
                    "step 1"
                    if (result.bool) {
                        var target = result.targets[0];
                        player.logSkill('lunhuizuzhou', target);
                        target.addSkill('lunhuizuzhou');
                    }
                },
            }
        },
        ai: {
            effect: {
                target(card, player, target, current) {
                    if (get.tag(card, 'recover') && player != target) return 'zeroplayertarget';
                }
            }
        }
    },
    mingyunniezao: {
        trigger: { global: 'judge' },
        zhuSkill: true,
        popup: false,
        filter(Evt, player) {
            return player.hasZhuSkill('mingyunniezao') && Evt.player.group == player.group && Evt.player != player;//同势力
        },
        content() {//TODO
            "step 0"
            let next = player.chooseBool(
                get.translation(trigger.player) + '的' + (trigger.judgestr || '') + '判定为'
                + get.translation(trigger.player.judging[0]) + '，' + get.prompt('mingyunniezao')).set('ai', () => {
                    return Math.random() > 0.7;
                });//ai
            "step 1"
            if (result.bool) {
                var cards = get.cards(5);
                Evt.cards = cards;
                player.chooseCardButton('选择牌堆顶的一张牌替代' + get.translation(trigger.player.judging[0]), cards, true)
                    .set('ai', (button) => {
                        if (!button || !button.link) return 0;
                        var trigger = _status.event.getTrigger();
                        var player = _status.event.player;
                        var oriJudgeCard = _status.event.oriJudgeCard;
                        var result = trigger.judge(button.link) - trigger.judge(oriJudgeCard);
                        var attitude = get.attitude(player, trigger.player);
                        if (attitude == 0 || result == 0) return 0;
                        if (attitude > 0) {
                            return result - trigger.judge(button.link) / 2;
                        } else {
                            return -result - trigger.judge(button.link) / 2;
                        }
                    })
                    .set('oriJudgeCard', trigger.player.judging[0]);//ai
            }
            else {
                Evt.finish();
            }
            'step 2'
            if (result.bool) {
                Evt.replaceCard = result.links[0];
                var lastCards = [];
                for (var i = 0; i < Evt.cards.length; ++i) {
                    if (Evt.cards[i] == Evt.replaceCard) continue;
                    lastCards.push(Evt.cards[i]);
                }
                if (lastCards.length) {
                    player.chooseCardButton(lastCards, lastCards.length, '按顺序选择（先选择的在上），将其余牌置于牌堆顶', true).set(
                        'ai',
                        () => {
                            return 1 + Math.random();
                        }
                    );//ai
                }
            } else {
                Evt.finish();
            }
            'step 3'
            if (result.bool) {
                var orderdCards = result.links.slice(0);
                while (orderdCards.length) {
                    ui.cardPile.insertBefore(orderdCards.pop(), ui.cardPile.firstChild);
                }
                player.respond(Evt.replaceCard, 'mingyunniezao', 'highlight');//mark
                if (trigger.player.judging[0].clone) {//mark
                    trigger.player.judging[0].clone.classList.remove('thrownhighlight');
                    game.broadcast(card => {
                        if (card.clone) {
                            card.clone.classList.remove('thrownhighlight');
                        }
                    }, trigger.player.judging[0]);
                    game.addVideo('deletenode', player, get.cardsInfo([trigger.player.judging[0].clone]));
                }
                game.cardsDiscard(trigger.player.judging[0]);//mark.
                trigger.player.judging[0] = Evt.replaceCard;
                trigger.orderingCards.addArray([Evt.replaceCard]);//处理区
                player.logSkill('mingyunniezao');
                game.log(trigger.player, '的判定牌改为', Evt.replaceCard);
                game.delay(2);//mark

            } else {
                Evt.finish();
            }
        }
    },
    //真白花音
    chenzhu: {
        intro: {
            name: '辰铸',
            content: 'cards'
        },
        init(player) {
            if (!player.$.chenzhu) player.$.chenzhu = [];
        },
        group: ['chenzhu_useWeapon', 'chenzhu_phaseBegin'],
        subSkill: {
            useWeapon: {
                trigger: { global: 'useCardEnd' },
                direct: true,
                filter(Evt, player) {
                    //使用武器牌
                    return get.subtype(Evt.cards[0]) == 'equip1';
                },
                content() {
                    //牌堆顶一张牌
                    var cards = get.cards();
                    //置于武将牌上
                    player.markAuto('chenzhu', cards);

                    player.$draw(cards);
                    game.log(player, '将', cards, '置于武将牌上');
                }
            },
            phaseBegin: {
                trigger: { global: 'phaseBegin' },
                filter(Evt, player) {
                    //回合开始的角色有装备武器牌
                    return player.$.chenzhu && player.$.chenzhu.length
                        && Evt.player && Evt.player.getCards('e', { subtype: 'equip1' }).length > 0;
                },
                content() {
                    'step 0'
                    if (player.$.chenzhu && player.$.chenzhu.length > 0) {
                        player.chooseButton(['从武将牌上选择一张牌', player.$.chenzhu], 1, true);
                    } else {
                        Evt._result = { bool: false };
                    }
                    'step 1'
                    if (result.bool) {
                        //从武将牌上选择一张牌
                        var cards = result.links;
                        player.gain(cards, 'gain2');
                        player.unmarkAuto('chenzhu', cards);
                    }
                    'step 2'
                    //获取武器牌名
                    var weapon = trigger.player.getCards('e', { subtype: 'equip1' })[0];
                    var oriName = weapon.name;
                    var weaponCards = [];

                    for (var i = 0; i < lib.inpile.length; ++i) {
                        if (get.subtype(lib.inpile[i]) == 'equip1') {
                            weapon.name = lib.inpile[i];
                            weaponCards.push(game.createCard(weapon));
                        }
                    }
                    weapon.name = oriName;

                    if (!weaponCards.length) {
                        Evt.finish();
                        return;
                    }
                    if (!trigger.player.$.chenzhu_weaponNameTemp) trigger.player.$.chenzhu_weaponNameTemp = {};
                    trigger.player.$.chenzhu_weaponNameTemp.card = weapon;
                    trigger.player.$.chenzhu_weaponNameTemp.oriName = oriName;
                    Evt.weapon = weapon;
                    //选择一个武器牌名
                    player.chooseButton(['将' + get.translation(weapon) + '改变为：', weaponCards], true, 1);
                    'step 3'
                    if (result.bool) {
                        //更新武器牌
                        game.broadcastAll(function (card, name) {
                            if (card && name) {
                                card.name = name;
                                card.init(card);
                            }
                        }, Evt.weapon, result.links[0].name);
                        //直到下一回合
                        trigger.player.addTempSkill('chenzhu_weaponNameTemp', { player: 'phaseAfter' });
                    } else {
                        delete player.$.chenzhu_weaponNameTemp;
                    }
                }
            },
            weaponNameTemp: {
                onremove(player) {
                    if (!player.$.chenzhu_weaponNameTemp) {
                        return;
                    }
                    //恢复原武器牌
                    game.broadcastAll(function (card, name) {
                        if (card && name) {
                            card.name = name;
                            card.init(card);
                        }
                    }, player.$.chenzhu_weaponNameTemp.card, player.$.chenzhu_weaponNameTemp.oriName);
                    delete player.$.chenzhu_weaponNameTemp;
                }
            }
        }
    },
    yutuo: {
        audio: 2,
        mark: true,
        trigger: { player: 'damageBegin' },
        filter(Evt, player) {
            return !player.hasSkill('yutuo_disableTag');
        },
        content() {
            'step 0'
            player.addSkill('yutuo_disableTag');
            //令你受到的伤害-1
            --trigger.num;
            //如果有其他未废除的装备栏，则废除当前栏；
            //否则结束事件
            var cntDisabled = player.countDisabled();
            if (!player.isDisabled(player.$.yutuo)) ++cntDisabled;

            if (cntDisabled < 5 && !player.getCards('e', { subtype: 'equip' + player.$.yutuo }).length) {
            } else {
                Evt.finish();
                return;
            }
            //equip list
            var list = [];
            for (var i = 1; i < 6; i++) {
                if (i == player.$.yutuo) continue;
                if (player.isDisabled(i)) continue;
                list.push('equip' + i);
            }
            list.push('cancel2');
            //选择一个其他未废除的装备栏
            player.chooseControl(list)
                .set('prompt', '请选择一个其他未废除的装备栏<br>（若不选择，此技能进入冷却）')
                .set('ai', function (Evt, player, list) {
                    var list = _status.event.list;
                    if (list) return list.randomGet();
                    return 'cancel2';
                }).set('list', list);
            'step 1'
            if (!result.control || result.control == 'cancel2') {
                Evt.finish();
                return;
            }
            player.disableEquip(player.$.yutuo);
            player.$.yutuo = parseInt(result.control[5]);
            player.markSkill('yutuo');
            player.removeSkill('yutuo_disableTag');
        },
        init(player) {
            if (!player.$.yutuo) player.$.yutuo = 2;
            player.markSkill('yutuo');
        },
        intro: {
            content(storage, player) {

                var pos = { equip1: '武器栏', equip2: '防具栏', equip3: '+1马栏', equip4: '-1马栏', equip5: '宝物栏' }['equip' + storage];
                if (pos) return '若你的<' + pos + '>没有牌，你可废除<' + pos + '>并以一个未废除的装备栏修改<' + pos + '>，重置此技能。';
            }
        },
        group: 'yutuo_reset',
        subSkill: {
            disableTag: {},
            reset: {
                direct: true,
                trigger: { global: 'roundStart' },
                content() {
                    player.removeSkill('yutuo_disableTag');
                }
            }
        }
    },
    //进击的冰糖 bintang
    xiou: {
        audio: 5,
        init(player) {
            player.$.xiou = {};
        },
        trigger: { player: 'phaseUseBegin' },
        filter(Evt, player) {
            return game.hasPlayer(function (cur) {
                return cur != player && cur.countGainableCards(player, 'h');
            });
        },
        content() {
            'step 0'
            var filterTarget = function (card, player, target) {
                return player != target && target.countGainableCards(player, 'h');
            };
            player.chooseTarget(
                '选择一名其他角色，获取其所有手牌',
                filterTarget, true
            ).set('ai', function (target) {
                var evt = _status.event;
                var att = get.attitude(evt.player, target);
                if (target.hasSkill('yiqu')) return 2 + 3 * att + target.countGainableCards(player, 'h');
                return att + target.countGainableCards(player, 'h');
            });
            'step 1'
            var p1 = result.targets[0];
            //添加临时技能xiou_phaseJieshuTrigger
            player.addTempSkill('xiou_phaseJieshuTrigger', 'phaseJieshuAfter');
            player.$.xiou.p1 = p1;
            var hardCards = p1.getGainableCards(player, 'h');
            if (!hardCards || !hardCards.length) {
                Evt.finish();
                return;
            }
            Evt.p1HandCardCount = hardCards.length;
            Evt.p1 = p1;
            //调用gain获取P1手牌
            player.gain(hardCards, p1, 'giveAuto', 'bySelf');
            'step 2'
            var cnt = player.countCards('he');
            cnt = Math.min(Evt.p1HandCardCount, cnt);
            if (cnt > 0) {
                //选择等量(如果不足则全部)的牌
                player.chooseCard('he', cnt, '交给' + get.translation(Evt.p1) + get.cnNumber(cnt) + '张牌', true).set('ai', card => {
                    return 8 - get.value(card) + Math.random() * 2;
                });
            } else {
                Evt.finish();
            }
            'step 3'
            //选择的牌交给P1
            Evt.p1.gain(result.cards, player, 'giveAuto');
        },
        subSkill: {
            phaseJieshuTrigger: {
                audio: 'xiou',
                trigger: { player: 'phaseJieshuBegin' },
                prompt2(Evt, player) {
                    if (player.$.xiou && player.$.xiou.p1)
                        return '你与' + get.translation(player.$.xiou.p1) + '各摸一张牌';
                    return '你与其各摸一张牌';
                },
                filter(Evt, player) {
                    //伤害’次数
                    var dCnt = 0;
                    player.getHistory('sourceDamage', evt => {
                        if (evt.player == player.$.xiou.p1) ++dCnt;
                    });
                    //本回合没有造成伤害
                    return dCnt <= 0;
                },
                content() {
                    //各摸一张牌
                    game.asyncDraw([player, player.$.xiou.p1]);
                    delete player.$.xiou.p1;
                },
                ai: {
                    expose: 0.1,
                },
            }
        }
    },
    //张京华 zhangjinghua
    xiemen: {
        trigger: {
            player: ['useCardBegin', 'respondBegin'], //你使用或打出牌时
        },
        frequent: true,
        content() {
            var players = game.players.slice(0);//遍历角色
            for (var i = 0; i < players.length; ++i) {
                var p = players[i];
                //跳过自己
                if (p == player) continue;
                //随机获得角色p的一张手牌
                var card = p.getCards('h').randomGet();
                if (!card) continue;//没有手牌则跳过
                if (!p.$.xiemen_reset) p.$.xiemen_reset = [];
                p.$.xiemen_reset.push(card);
                p.lose(card, ui.special, 'toStorage');

                //角色p添加临时技能xiemen_reset，用于在回合结束时重新获得被移除的手牌
                if (!p.hasSkill('xiemen_reset')) p.addSkill('xiemen_reset');
                // p.markAuto('xiemen_reset', card);
            }
        },
        subSkill: {
            reset: {
                trigger: {
                    global: 'phaseEnd'
                },
                direct: true,
                content() {
                    if (player.$.xiemen_reset && player.$.xiemen_reset.length) {
                        player.gain(player.$.xiemen_reset, 'fromStorage');
                        delete player.$.xiemen_reset;
                    }

                    player.removeSkill('xiemen_reset');
                }
            }
        }

    },
    jiai: {
        audio: 5,
        enable: ['chooseToUse', 'chooseToRespond'],
        hiddenCard(player, name) {
            var Evt = _status.event;
            var filterCard = Evt.filterCard || function (card, player, Evt) {
                return true;
            };
            var jiaiCards = lib.skill.jiai.jiaiCards.slice(0);
            for (var i = 0; i < jiaiCards.length; ++i) {
                if (!filterCard(jiaiCards[i], player, Evt)) {
                    jiaiCards.splice(i--, 1);
                }
            }
            for (var i = 0; i < lib.inpile.length; ++i) {
                if (get.type(lib.inpile[i]) != 'basic') continue;
                var card = { name: lib.inpile[i] };
                if (filterCard(card, player, Evt)) {
                    jiaiCards.push(lib.inpile[i]);
                }

            }
            if (!jiaiCards.contains(name) || player.getCards('h').length < 2) return false;
            return true;
        },
        filter(Evt, player) {
            if (player.getCards('h').length < 2) return false;
            var filterCard = Evt.filterCard || function (card, player, Evt) {
                return true;
            };
            var jiaiCards = lib.skill.jiai.jiaiCards.slice(0);
            for (var i = 0; i < jiaiCards.length; ++i) {
                if (!filterCard(jiaiCards[i], player, Evt)) {
                    jiaiCards.splice(i--, 1);
                }
            }
            for (var i = 0; i < lib.inpile.length; ++i) {
                if (get.type(lib.inpile[i]) != 'basic') continue;
                var card = { name: lib.inpile[i] };
                if (filterCard(card, player, Evt)) {
                    jiaiCards.push(card);
                }

            }
            return jiaiCards.length > 0;
        },
        //如果需要非普通牌，可以在这里添加
        jiaiCards: [
            // {name:'sha', nature:'yami'},
        ],
        usable: 1,
        chooseButton: {
            dialog(Evt, player) {
                //选择可使用的基本牌，使用或打出
                var jiaiCards = lib.skill.jiai.jiaiCards.slice(0);
                for (var i = 0; i < jiaiCards.length; ++i) {
                    if (!Evt.filterCard(jiaiCards[i], player, Evt)) {
                        jiaiCards.splice(i--, 1);
                    }
                }
                for (var i = 0; i < lib.inpile.length; ++i) {
                    if (get.type(lib.inpile[i]) != 'basic') continue;
                    var card = { name: lib.inpile[i] };
                    if (Evt.filterCard(card, player, Evt)) {
                        jiaiCards.push(card);
                    }

                }
                return ui.create.dialog('###『集爱』###选择一张基本牌', [jiaiCards, 'vcard'], 'hidden');
            },
            check(button) {
                var player = _status.event.player;
                var card = { name: button.link.name, nature: button.link.nature };
                if (_status.event.getParent().type != 'phase' || game.hasPlayer(function (cur) {
                    return player.canUse(card, cur) && get.effect(cur, card, player, player) > 0;
                })) {
                    return Math.random() * 5;
                }
                return 0;
            },
            backup(links, player) {
                //将两张手牌当作选择的基本牌
                return {
                    audio: 'jiai',
                    audioname: ['jike', 'Miki'],
                    selectCard: 2,
                    position: 'h',
                    filterCard(card, player, target) {
                        return true;
                    },
                    check(card, player) {
                        if (!ui.selected.cards.length && get.type(card) == 'basic') return 6;
                        else return 6 - get.value(card);
                    },
                    viewAs: { name: links[0].name, nature: links[0].nature },
                    // onrespond(result, player){
                    // 	//当你以此法响应其他角色使用的牌时，摸一张牌
                    // 	if(_status.event.respondTo&&_status.event.respondTo[0]!=player) player.draw();
                    // },
                    onrespond() { return this.onuse.apply(this, arguments) },
                    onuse(result, player) {
                        if (_status.event.respondTo && _status.event.respondTo[0] != player) player.draw();
                    }
                }
            },
            prompt(links, player) {
                var str = '使用或打出';
                if (_status.event.name == 'chooseToUse') str = '使用';
                else if (_status.event.name == 'chooseToRespond') str = '打出';
                return '选择两张手牌当作' + get.translation(links[0]) + str;
            }
        },
        ai: {
            order: 0.5,
            respondSha: true,
            respondShan: true,
            save: true,
            skillTagFilter(player, tag) {
                switch (tag) {
                    case 'respondSha': {
                        if (player.countCards('h') < 2) return false;
                        break;
                    }
                    case 'respondShan': {
                        if (player.countCards('h') < 2) return false;
                        break;
                    }
                    case 'save': {
                        if (player.countCards('h') < 2) return false;
                        break;
                    }
                }
            },
            result: {
                player: 0.5,
            }
        },
    },
    //NoiR
    bigOrSmall: {
        init(player, skill) {
            player.storage[skill] = '小';
        },
        list: ['小', '大', '等'],
    },
    mozouqiyin: {
        group: 'bigOrSmall',
        trigger: {
            global: 'phaseBegin'
        },
        direct: true,
        filter(Evt, player) {
            //有牌可以使用，且角色不是自己时可以使用
            if (Evt.player === player) return false;
            if (player.countCards('h', card => lib.filter.cardEnabled(card, player, 'forceEnable'))) {
                return true;
            };
            return false;
        },
        content() {
            'step 0'
            player.chooseToUse(`###${get.prompt('mozouqiyin')}###你可使用一张牌，若未造成伤害，然后本回合${get.translation(trigger.player)}跳过弃牌阶段且不能使用点数（${player.$.bigOrSmall}）于此牌的牌`).set('ai1', card => {
                let player = _status.event.player;
                let p = _status.event.target;
                let size = player.$.bigOrSmall;
                let att = get.attitude(player, p);
                if (att > 0) {
                    if (size == '小') {
                        return 100 - p.countCards('h', function (cur) {
                            return cur.number < card.number;
                        });
                    } else if (size == '大') {
                        return 100 - p.countCards('h', function (cur) {
                            return cur.number > card.number;
                        });
                    } else {
                        return p.countCards('h', function (cur) {
                            return cur.number == card.number;
                        }) ? 10 : 100;
                    }
                } else if (att < 0) {
                    if (size == '小') {
                        return p.countCards('h', function (cur) {
                            return cur.number < card.number;
                        });
                    } else if (size == '大') {
                        return p.countCards('h', function (cur) {
                            return cur.number > card.number;
                        });
                    } else {
                        return -100;
                    }
                } else {
                    return 0;
                }
            }).set('target', trigger.player);
            Evt.sourceDamageHistory = player.getHistory('sourceDamage').slice(0);
            'step 1'
            if (!result.bool) {
                Evt.finish();
                return;
            }
            let p = trigger.player;
            let card = result.cards[0] || result.used || result.card;
            if (!card) {
                Evt.finish();
                return;
            }
            //如果造成伤害则结束
            let history = player.getHistory('sourceDamage');
            let causeDamage = false
            for (let i = 0; i < history.length; ++i) {
                if (Evt.sourceDamageHistory.contains(history[i])) continue;
                causeDamage = true;
                break;
            }
            if (causeDamage) {
                Evt.finish();
                return;
            }
            //本回合其跳过弃牌阶段，且不能使用点数（storage.cond）于(storage.nmber)的牌
            p.$.mozouqiyin_disableCard = {
                source: player,
                number: card.number,
                cond: player.$.bigOrSmall
            };
            p.addTempSkill('mozouqiyin_disableCard', { player: 'phaseEnd' });
            player.logSkill('mozouqiyin', p);
        },
        subSkill: {
            disableCard: {
                trigger: {
                    player: 'phaseDiscardBefore'
                },
                direct: true,
                content() {
                    //跳过弃牌阶段
                    trigger.cancel();
                },
                mark: true,
                //禁止使用xxx
                mod: {
                    cardUsable(card, player, num) {
                        if (typeof card != 'object') return;
                        let number = get.number(card, player);
                        if (typeof number != 'number') {
                            number = parseInt(number);
                            if (isNaN(number)) return;
                        }
                        let storage = player.$.mozouqiyin_disableCard;
                        return lib.skill.budingpaidui.checkNumber(storage.number, number, storage.cond) ? 0 : num;
                    },
                    cardEnabled2(card, player, ori) {
                        let number = get.number(card, player);
                        if (typeof number != 'number') {
                            number = parseInt(number);
                            if (isNaN(number)) return;
                        }
                        let storage = player.$.mozouqiyin_disableCard;
                        return lib.skill.budingpaidui.checkNumber(storage.number, number, storage.cond) ? false : ori;
                    }
                },
                marktext: '默',
                intro: {
                    name: '默奏起音的效果',
                    mark(dialog, storage, player) {
                        let cardnum = get.strNumber(storage.number);
                        dialog.addText('禁止使用点数（' + storage.cond + '）于' + cardnum + '的牌');
                        dialog.addText('本回合跳过弃牌阶段');
                    }
                },
                onremove(player) {
                    delete player.$.mozouqiyin_disableCard;
                }
            }
        }
    },
    budingpaidui: {
        trigger: {
            player: 'useCardAfter'
        },
        init(player) {
            player.$.budingpaidui ??= ['小', '大', '等'];
        },
        filter(Evt, player) {
            //没有剩余选项时重置
            if (!player.$.budingpaidui || player.$.budingpaidui.length <= 0) {
                player.$.budingpaidui = ['小', '大', '等'];
                player.markSkill('budingpaidui');
            }
            let curCard = Evt.card;
            let lstCard = player.getStorage('budingpaidui_uCR')[0]
            // //跳过第一次使用牌
            // if(lstCard == null||curCard == null) return;
            return lstCard && lib.skill.budingpaidui.checkNumber(get.number(lstCard), get.number(curCard), player);
        },
        check(Evt, player) {
            if (player.getStorage('budingpaidui').length > 1) {
                return true;
            }
            return false;
        },
        //检查点数是否满足条件
        //lstNum:   上一张牌点数
        //curNum:   当前使用的牌点数
        //item:     条件
        //      string:         传入比较条件直接比较，['小','大','等'] 任意一个，返回结果
        //      player:         传入角色，通过角色的storage比较，如果对应storage不存在就返回false
        //return:
        //      true:   满足条件
        //      false:  不满足条件或者条件获取失败
        checkNumber(lstNum, curNum, item) {
            let str
            if (typeof item == 'string') str = item;
            else {
                let player = item || _status.event.player;
                str = player.$.bigOrSmall;
            }

            if (str == '小') {
                return curNum < lstNum;
            }
            if (str == '大') {
                return curNum > lstNum;
            }
            if (str == '等') {
                return curNum == lstNum;
            }
            return false;
        },
        content() {
            'step 0'
            player.draw();
            'step 1'
            var curCard = trigger.card;
            var left = player.$.budingpaidui;
            var aiChoice = left[0];
            for (let i = 0; i < left.length; ++i) {
                if (player.countCards('h', card => {
                    return player.hasUseTarget(card) && lib.skill.budingpaidui.checkNumber(curCard.number, card.number, left[i]);
                }) > 0) {
                    aiChoice = left[i];
                    break;
                }
            }
            player.chooseControl(player.$.budingpaidui)
                .set('prompt', '选择一项替代之前（）内的内容')
                .set('ai', function () {
                    return _status.event.aiChoice;
                }).set('aiChoice', aiChoice);
            'step 2'
            player.$.bigOrSmall = result.control;
            player.$.budingpaidui.splice(result.index, 1);
            player.markSkill('budingpaidui');

            game.countPlayer(function (cur) {
                if (cur.getStorage('mozouqiyin_disableCard').source === player) {
                    cur.$.mozouqiyin_disableCard.cond = result.control;
                    cur.markSkill('mozouqiyin_disableCard');
                }
            });
        },
        intro: {
            mark(dialog, storage, player) {
                let lstCard = player.getStorage('budingpaidui_uCR')[0]
                if (!lstCard) {
                    dialog.addText(`你使用的下一张牌可能无法发动『${get.translation('budingpaidui')}』`);
                    return;
                }
                let cardnum = get.strNumber(get.number(lstCard))
                dialog.addText(`你使用的下一张牌点数（${player.$.bigOrSmall}）于${cardnum}可以发动『${get.translation('budingpaidui')}』`);
            },
            markcount(storage, player) {
                let lstCard = player.getStorage('budingpaidui_uCR')[0]
                return lstCard && get.number(lstCard);
            },
        },
        group: ['bigOrSmall', 'budingpaidui_reset', 'budingpaidui_usedCardRecord'],
        subSkill: {
            reset: {
                trigger: {
                    global: 'roundStart'
                },
                firstDo: true,
                priority: 253,
                direct: true,
                content() {
                    player.$.budingpaidui = ['小', '大', '等'];
                    player.markSkill('budingpaidui');
                }
            },
            usedCardRecord: {
                trigger: {
                    player: 'useCardAfter'
                },
                direct: true,
                lastDo: true,
                content() {
                    player.$.budingpaidui_uCR = [trigger.card];
                    player.markSkill('budingpaidui');
                }
            }
        }
    },
}