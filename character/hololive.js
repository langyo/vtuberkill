'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'hololive',
		connect:true,
		character:{
            /**时乃空 */
            TokinoSora:['female','holo',4,['taiyangzhiyin','renjiazhizhu'],['zhu']],
            /**夜空梅露 */
            YozoraMel:['female','holo',3,['juhun','meilu']],
            /**赤井心 */
            AkaiHaato:['female','holo',3,['liaolishiyan','momizhiyan']],
            /**夏色祭 */
            NatsuiroMatsuri:['female','holo',3,['huxi1','lianmeng']],
            /**萝卜子 */
            RobokoSan:['female','holo',3,['gaonengzhanxie','ranyouxielou']],
            /**白上吹雪 */
            ShirakamiFubuki:['female','holo',3,['yuanlv','jinyuan','zhongjian'],['zhu']],
			/**aki */
            AkiRosenthal: ['female', 'holo', 3, ['meiwu', 'huichu']],
            /**星街慧星 */
            HoshimatiSuisei:['female','holo',4,['yemuxingyong', 'xinghejianduei']],
            /**樱巫女 */
            SakuraMiko: ['female', 'holo', 4, ['haodu']],
            /**湊阿库娅 */
            MinatoAqua:['female','holo',3,['kuali','youyi']],
            /**兔田佩克拉 */
			UsadaPekora:['female','holo',3,['pekoyu','hongshaoturou']],
        },
		characterSort:{
			hololive:{
                hololive_1:['YozoraMel','AkiRosenthal','AkaiHaato','ShirakamiFubuki','NatsuiroMatsuri'],
                hololive_wuyin:['TokinoSora','HoshimatiSuisei','RobokoSan','SakuraMiko'],
                hololive_2and3:['MinatoAqua','UsadaPekora']
			}
		},
        characterIntro:{
			SakuraMiko: '樱巫女（V始三年）者，神社之巫女也，性坚毅，素有樱火龙之称，子云，食色性也，圣人如此，miko亦然，miko喜黄油，常于配信误启之，虽贵为巫女，护东南诸郡安宁，然不识诗书，有《FAQ》、《倪哥》为众人笑，V始十九年，朝廷窜东南，miko力拒之，自封自由领，不受诸侯管制',
			HoshimatiSuisei:'星街彗星（V始三年），北海人也，少时贫寒，彗酱一心求学，从当世之先达元昭执经叩问，元昭深器之，彗酱豆蔻之年即通晓诸经，人莫不言之曰天道酬勤，六边形战士之名世人皆知。V始十三年绊爱首义，彗酱自投笔从戎，有tst之神兵，杏国拜之曰上将军',
            TokinoSora:'混沌的尽头，少女的回旋曲，杏社起始同时也是终末的清楚担当，全杏社圆桌骑士之首，空友之母，反抗军的破坏者、狮心之人、大杏社的卡丽熙、hololive真主、永不恐惧者、阿芙乐尔公主，时乃空是也',
            YozoraMel:'夜空梅露',
            AkaiHaato:'赤井心，京师名医之后也，嗜食成性，有《药膳经》流于世，其药多先夺人命后生之，用者莫不谈之色变，食尤喜沙琪玛，每日贡食入府，左右皆呼“哈恰玛恰玛”，后元昭起势，心随夏色祭往拜之，从军十年活人兆计，后拜土澳公主，总领土澳事宜。',
            NatsuiroMatsuri:'夏色祭（V始二年）者，元昭之同族也，自党锢之祸后，元昭暗谋国事，遣祭访天下名士，得名士四人，是为杏国一期，祭不拘小节，最喜呼吸，同社皆避之，既为混沌传说，一般露○可轻言之，建功累累，元昭尊为第一将军',
            RobokoSan:'萝卜子（V始三年）者，奇巧士之造物也，自号高性能机器人，实则不善文书，萝卜起于草莽，生性豪爽，后为时乃空所动，随杏社征战，V始二十年，杏国攻灭诸侯，远交近攻，俨然有大一统之势，萝卜子拜平南王福禄将军，安于南方',
            ShirakamiFubuki:'白上吹雪者，青丘之狐也，夏色祭以玉米赚之，V始十五年，朝廷击绊爱于桐江，大破之，又击之于宛城，斩爱之左将军，一时人皆自危，起义初显败势，吹雪自领百骑迂回西南袭朝廷于后，解绊爱众叛亲离之危，重兴V国大业，吹雪虽为狐灵，然生猫态，憨态可掬',
        },
		skill:{
			taiyangzhiyin:{
                trigger:{ player:['useCard2'] },
				filter:function(event,player){
                    //console.log(event.card,1)
                    //console.log(player.storage.onlink,event.card.cardid)
                    return get.number(event.card)>10&&(player.storage.onlink==null||player.storage.onlink.indexOf(event.card.cardid)==-1);
				},
                priority: 1,
                frequent:true,
                forced:false,
                content:function (){
					var info=get.info(trigger.card);
                    var players=game.filterPlayer();
                    if(player.storage.onlink==null){
                        player.storage.onlink=[];
                    }//处理正处于连锁中的卡牌
                    'step 0'
                    event.Dvalue=get.number(trigger.card)-10;
                    var list=[['无法响应'],['额外目标'],['摸一张牌']];
                    if(!game.hasPlayer(function(current) {
                        return lib.filter.targetEnabled2(trigger.card, player, current)
                            && player.inRange(current)
                            && !trigger.targets.contains(current)
                            //&& (player.canUse(trigger.card, current)||current.canUse(trigger.card, current))
                            && (get.type(trigger.card)!='equip'&&get.type(trigger.card)!='delay')
                    })) {
                        list.splice(1,1);
                        if(event.Dvalue==3){
                            event.Dvalue=2;
                        }
                    }
					event.videoId = lib.status.videoId++;
					game.broadcastAll(function(id, choicelist,Dvalue){
                        var dialog=ui.create.dialog('选择'+Dvalue+'项');
                        choicelist.forEach(element=>{
                            dialog.add([element,'vcard']);
                        })
						dialog.videoId = id;
					}, event.videoId, list,event.Dvalue);
                    player.storage.onlink.push(trigger.card.cardid);
                    'step 1'
                    player.chooseButton(event.Dvalue).set('dialog',event.videoId).set('prompt',get.prompt('taiyangzhiyin'));
                    'step 2'
					game.broadcastAll('closeDialog', event.videoId);
                    if(result.bool){
                        result.links.forEach(element => {
                            if(element[2]=="摸一张牌"){
                                player.draw();
                            }
                            if(element[2]=="无法响应"){
                                game.log(player,'令',trigger.card,'无法被响应');
                                trigger.directHit.addArray(players);
                                trigger.nowuxie=true;
                            }
                        });
                        result.links.forEach(element => {
                            if(element[2]=="额外目标"){
                                //console.log(trigger);
                                player.chooseTarget(true,'额外指定一名'+get.translation(trigger.card)+'的目标？',function(card,player,target){
                                    var trigger=_status.event;
                                    if(trigger.targets.contains(target)) return false;
                                    return lib.filter.targetEnabled2(trigger.card,_status.event.player,target);
                                }).set('ai',function(target){
                                    var trigger=_status.event.getTrigger();
                                    var player=_status.event.player;
                                    return get.effect(target,trigger.card,player,player);
                                }).set('targets',trigger.targets).set('card',trigger.card);
                            }
                        });
                    }
                    'step 3'
                    if(result&&result.bool){
                        if(!event.isMine()) game.delayx();
                        event.target=result.targets[0];
                        if(event.target){
                            trigger.targets.add(event.target);
                        }
                    }
                },
                group:'taiyangzhiyin_clear',
                subSkill:{
					clear:{
						trigger:{player:['useCardAfter']},
                        direct:true,
						content:function(){
                            if(player.storage.onlink!=null){
                                var deleteIndex=player.storage.onlink.indexOf(trigger.card.cardid);
                                if(deleteIndex!=-1){
                                    player.storage.onlink.splice(deleteIndex,1,null)
                                }
                            }
						}
					}
                }
            },
            renjiazhizhu:{
				audio:2,
				unique:true,
				trigger:{player:'phaseUseBefore'},
				zhuSkill:true,
				forced:true,
				filter:function(event,player){
					if(!player.hasZhuSkill('renjiazhizhu')) return false;
					return true;
				},
				content:function(){
                    if(player.storage.skillCardID==null){
                        player.storage.skillCardID=[];
                    }
                    event.players=game.filterPlayer(function(current){
						return current.group=='holo'&&(current!=player);
                    });
					event.players.sortBySeat(player);
                    'step 0'
                    if(event.playersIndex==null){
                        event.playersIndex=0;
                    }
                    if(event.playersIndex<event.players.length){
                        //console.log(event.playersIndex);
                        event.players[event.playersIndex].chooseCard('是否交给'+get.translation(player)+'一张手牌').set('ai',function(card){
                            return 7-get.value(card);
                        })
                    }
                    else{
                        event.playersIndex=0;
                        //console.log(player.storage.skillCardID)
                        event.finish();
                    }
                    'step 1'
                    if(result.bool==true){
                        if(player.storage.changecardList==null){
                            player.storage.changecardList=[];
                        }
                        player.storage.changecardList.push({
                            result:result,
                            card:result.cards[0],
                            oldNumber:result.cards[0].number,
                            oldData:result.cards[0].childNodes[1].childNodes[2].data
                        });
                        player.gain(result.cards,event.players[event.playersIndex],'giveAuto');
                        result.cards[0].number=11;
                        result.cards[0].specialEffects=['card_hightlight'];
                        var newcard=get.cardInfoOL(result.cards[0]);//取得card对象
                        let newcard2=get.cardInfo(result.cards);
                        var info=JSON.parse(newcard.slice(13));//
                        var id=info.shift();
                        game.broadcastAll(function(card,info){
                            card.init(info)
                        },result.cards[0],info);
                        //result.cards[0].init(info)
                        //lib.cardOL[id].init(info);
                        //console.log(player.storage.changecardList);
                        player.storage.skillCardID.push(result.cards[0].cardid);
                    }
					if(event.playersIndex<event.players.length){
						event.playersIndex++;
						event.goto(0);
                    }
                    //console.log(player.storage.skillCardID)
				},
				group:['renjiazhizhu_changecard','renjiazhizhu_clear'],
				subSkill:{
					changecard:{
						trigger:{player:'useCardToBefore'},
                        direct:true,
                        filter:function(event,player){
                            if(player.storage.skillCardID==null){
                                return false
                            }
                            else{
                                return player.storage.skillCardID.indexOf(event.card.cardid)!=-1;
                            }
                        },
						content:function(){
                            //trigger.card.number=11;
						}
					},
					clear:{
						trigger:{global:'phaseBefore'},
						silent:true,
						content:function(){
                            delete player.storage.skillCardID;
                            if(player.storage.changecardList!=null){
                                player.storage.changecardList.forEach((element,index)=>{
                                    var newcard=get.cardInfoOL(element.card);
                                    var info=JSON.parse(newcard.slice(13));
                                    var id=info.shift();
                                    info[1]=element.oldNumber;
                                    if(info[5]==null){
                                        info[5]=[]
                                    }
                                    info[5].remove('card_hightlight');
                                    game.broadcastAll(function(card,info){
                                        card.init(info)
                                    },element.card,info);
                                })
                            }
                            delete player.storage.changecardList;
						}
					}
                }
            },
            renjiazhizhu2:{
                trigger:{global:'gainBefore'},
                forced:true,
                content:function(){
                    //trigger.card.number=1;
                    //trigger.card.cards[0].childNodes[1].childNodes[2].data=1;
                    console.log(card);
                    console.log(trigger);
                }
            },
            juhun:{
                trigger:{
                    global:'damageEnd'
                },
                forced:true,
                usable:1,
                filter:function(event,player){return true},
                content:function(){
					"step 0"
					event.card=get.cards()[0];
					if(player.storage.juhun==undefined) player.storage.juhun=[];
					player.storage.juhun.push(event.card);
					player.syncStorage('juhun');
					//event.trigger("addCardToStorage");
					game.cardsGotoSpecial(event.card);
					player.showCards(player.storage.juhun,'聚魂')
					player.markSkill('juhun');
                },
				intro:{
					content:'cards',
					onunmark:function(storage,player){
						if(storage&&storage.length){
							player.$throw(storage,1000);
							game.cardsDiscard(storage);
							delete player.storage.juhun;
						}
					}
                },
                group:['juhun_get','juhun_draw'],
                subSkill:{
                    get:{
                        trigger:{
                            global:'roundStart'
                        },
                        direct:true,
                        filter:function(event,player){
                            return player.storage.juhun!=undefined&&player.storage.juhun.length!=0;
                        },
                        content:function(){
                            player.storage.juhun.forEach(function(c) {
                                player.gain(c);
                            });
                            delete player.storage.juhun
                            player.syncStorage('juhun');
                            player.markSkill('juhun');
                        }
                    },
                    draw:{
                        trigger:{
                            player:'phaseDrawBegin'
                        },
                        direct:true,
                        filter:function(event,player){
                            return !event.numFixed&&player.isMaxHandcard(false);
                        },
                        content:function(){
                            trigger.num--;
                        },
                    }
                }
            },
            meilu:{
                trigger:{
                    player:'phaseBegin'
                },
                forced:true,
                filter:function(event,player){
                    return player.countCards('h')-3>=player.hp
                },
                content:function(){
                    player.turnOver();
                },
                group:['meilu_kill','meilu_draw'],
                subSkill:{
                    kill:{
                        firstDo:true,
                        trigger:{player:'phaseUseBefore'},
                        forced:true,
                        filter:function(event,player){
                            return player.classList.contains('turnedover');
                        },
                        content:function(){
                            trigger.audioed=true;
                            player.markSkill('meilu');
                            player.addTempSkill('meilu_infinityKill','phaseUseEnd');
                        },
                    },
                    draw:{
                        trigger:{player:'turnOverAfter'},
                        forced:true,
                        filter:function(event,player){
                            return !player.classList.contains('turnedover');
                        },
                        content:function(){
                            if(player.hp<player.maxHp){
                                player.markSkill('meilu');
                                player.recover();
                            }
                        },
                    },
                    infinityKill:{
                        mod:{
                            cardUsable:function(card,player,num){
                                if(card.name=='sha') return Infinity;
                            }
                        }
                    }
                }
            },
            liaolishiyan:{
				trigger:{
					player:"phaseDrawBegin1",
				},
				forced:true,
				locked:false,
				filter:function(event,player){
					return !event.numFixed;
				},
				content:function (){
					"step 0"
					player.chooseBool("是否放弃摸牌,改为从牌堆顶展示两张牌并发动技能？").ai=function(){
                        var num=2;
                        return num;
						// return cardsx.length>=trigger.num;
                    };
                    "step 1"
                    if(result.bool){
                        trigger.changeToZero();
                        var cards=get.cards(2);
                        game.cardsGotoOrdering(cards);
                        event.videoId=lib.status.videoId++;
                        game.broadcastAll(function(player,id,cards){
                            var str;
                            if(player==game.me&&!_status.auto){
                                str='料理实验<br>♦~重铸一张牌<br>♣~弃置一张牌<br>♥~令赤井心回复 1 点体力<br>♠~失去 1 点体力';
                            }
                            else{
                                str='料理实验<br>♦~重铸一张牌<br>♣~弃置一张牌<br>♥~令赤井心回复 1 点体力<br>♠~失去 1 点体力';
                            }
                            var dialog=ui.create.dialog(str,cards);
                            dialog.videoId=id;
                        },player,event.videoId,cards);
                        player.showCards(cards,'料理实验');
                        player.storage.resultCards=cards;
                        event.cards=cards;
                        player.gain(cards,'log','gain2');
                    }
                    else{
                        event.finish();
                    }
                    "step 2"
                    //player.storage.resultCards=event.resultCards;
                    for(var i=0;i<event.cards.length;i++){
                        switch (get.suit(player.storage.resultCards[i])) {
                            case 'spade':
                                player.storage['card'+i]='黑桃：失去 1 点体力';
                                break
                            case 'heart':
                                player.storage['card'+i]='红桃：令赤井心回复 1 点体力';
                                break
                            case 'diamond':
                                player.storage['card'+i]='方块：重铸一张牌';
                                break
                            case 'club':
                                player.storage['card'+i]='梅花：弃置一张牌';
                                break
                        }
                    }
                    "step 3"
                    switch (get.suit(player.storage.resultCards[0])) {
                        case 'spade':
                            player.loseHp(1);
                            break
                        case 'heart':
                            player.recover();
                            break
                        case 'diamond':
                            player.chooseCard('he','重铸一张牌',1,true);
                            // player.chooseToDiscard('he','重铸一张牌',1,true)
                            // player.draw();
                            break
                        case 'club':
                            player.discardPlayerCard(player,1,'he',true);
                            break
                    }
                    "step 4"
                    if(get.suit(player.storage.resultCards[0])=='diamond'&&result.cards){
                        player.lose(result.cards, ui.discardPile);
                        player.$throw(result.cards,1000);
                        game.log(player,'将',result.cards,'置入了弃牌堆');
                        player.draw();
                    }
                    switch (get.suit(player.storage.resultCards[1])) {
                        case 'spade':
                            player.loseHp(1);
                            break
                        case 'heart':
                            player.recover();
                            break
                        case 'diamond':
                            player.chooseCard('he','重铸一张牌',1,true);
                            // player.chooseToDiscard('he','重铸一张牌',1,true)
                            // player.draw();
                            break
                        case 'club':
                            player.discardPlayerCard(player,1,'he',true);
                            break
                    }
                    "step 5"
                    if(get.suit(player.storage.resultCards[1])=='diamond'&&result.cards){
                        player.lose(result.cards, ui.discardPile);
                        player.$throw(result.cards,1000);
                        game.log(player,'将',result.cards,'置入了弃牌堆');
                        player.draw();
                    }
                    game.broadcastAll('closeDialog',event.videoId);
                    player.addTempSkill('liaolishiyan2');
                },
                group:'liaolishiyan_clear',
                subSkill:{
                    clear:{
                        trigger:{global:['phaseUseAfter','phaseAfter']},
                        silent:true,
                        filter:function(event){
                        },
                        content:function(){
                            delete player.storage.resultCards;
                            delete player.storage.card0;
                            delete player.storage.card1;
                        }
                    }
                }
            },
            liaolishiyan2:{
                enable:'phaseUse',
                position:'he',
                filter:function(event,player){
                    return !player.hasSkill('liaolishiyan3');
                },
                content: function() {
                    'step 0'
					player.chooseCardTarget({
                        position:'he',
                        prompt: '重置两张相同花色牌令一名角色按顺序执行'+'<br>'+player.storage.card0+'<br>'+player.storage.card1, 
                        selectCard:2,
                        filterCard:function(card,player){
                            return (get.suit(card)==get.suit(player.storage.resultCards[0]))||(get.suit(card)==get.suit(player.storage.resultCards[1]))
                        },
                        filterTarget:function(card,player,target){
                            if(card.cards){
                                if(get.suit(player.storage.resultCards[0])==get.suit(player.storage.resultCards[1])) return true;
                                else
                                    return get.suit(card.cards[0])!=get.suit(card.cards[1]);
                            }
                        }
                    });
                    'step 1'
                    event.result=result;
                    if(event.result.bool){
                        // player.discard(result.cards,'重铸二张牌',2);
                        // player.draw(2);
                        player.lose(result.cards, ui.discardPile);
                        player.$throw(result.cards,1000);
                        game.log(player,'将',result.cards,'置入了弃牌堆');
                        player.draw(2);
                        switch (get.suit(player.storage.resultCards[0])) {
                            case 'spade':
                                event.result.targets[0].loseHp(1);
                                break
                            case 'heart':
                                player.recover();
                                //event.result.targets[0].recover();
                                break
                            case 'diamond':
                                event.result.targets[0].chooseCard('he','重铸一张牌',1,true);
                                break
                            case 'club':
                                event.result.targets[0].discardPlayerCard(event.result.targets[0],1,'he',true);
                                break
                        }
                    }
                    else{
                        event.goto(4);
                    }
                    'step 2'
                    if(get.suit(player.storage.resultCards[0])=='diamond'&&result.cards){
                        event.result.targets[0].lose(result.cards, ui.discardPile);
                        event.result.targets[0].$throw(result.cards,1000);
                        game.log(event.result.targets[0],'将',result.cards,'置入了弃牌堆');
                        event.result.targets[0].draw();
                    }
                    switch (get.suit(player.storage.resultCards[1])) {
                        case 'spade':
                            event.result.targets[0].loseHp(1);
                            break
                        case 'heart':
                            player.recover();
                            //event.result.targets[0].recover();
                            break
                        case 'diamond':
                            event.result.targets[0].chooseCard('he','重铸一张牌',1,true);
                            break
                        case 'club':
                            event.result.targets[0].discardPlayerCard(event.result.targets[0],1,'he',true);
                            break
                    }
                    'step 3'
                    if(get.suit(player.storage.resultCards[1])=='diamond'&&result.cards){
                        event.result.targets[0].lose(result.cards, ui.discardPile);
                        event.result.targets[0].$throw(result.cards,1000);
                        game.log(event.result.targets[0],'将',result.cards,'置入了弃牌堆');
                        event.result.targets[0].draw();
                    }
                    player.addTempSkill('liaolishiyan3');
                    event.finish();
                    'step 4'
                    event.finish();

                }

            },
            liaolishiyan3:{
				trigger:{global:['phaseUseAfter','phaseAfter']},
				silent:true,
				filter:function(event){
					return event.skill!='liaolishiyan'&&event.skill!='liaolishiyan2';
				},
				content:function(){
					player.removeSkill('liaolishiyan3');
				}
            },
            momizhiyan:{
                usable:1,
                trigger: {
                    player: 'useCardToBegin',
                },
                filter: function(event, player) {
                    return (player.countCards('he')>0)&&event.targets&&event.targets.length>0;
                },
                content: function() {
                    'step 0'
                    player.chooseToDiscard('he','弃置一张牌',1,true);
                    game.delayx();
                    'step 1'
                    event.multiTrue=false;
                    if(result.bool){
                        event.suit=get.suit(result.cards[0]);
                        player.storage.momizhiyanGroup=trigger.targets;
                        if(trigger.targets.length>1){
                            event.multiTrue=true;
                            player.chooseTarget(function(card,player,target){
                                    return player.storage.momizhiyanGroup.contains(target);
                            },1,true);
                            game.delayx();
                        }
                    }
                    else{
                        event.finish();
                    }
                    'step 2'
                    if(result.targets&&result.targets[0]){
                        trigger.targets[0]=result.targets[0];
                    }
                    else if(result.multiTrue){
                        trigger.targets[0]=player;
                    }
                    if(event.suit){
                        switch (event.suit) {
                            case 'spade':
                                trigger.targets[0].loseHp(1);
                                break
                            case 'heart':
                                player.recover();
                                //trigger.targets[0].recover();
                                break
                            case 'diamond':
                                trigger.targets[0].chooseCard('he','重铸一张牌',1,true);
                                break
                            case 'club':
                                trigger.targets[0].discardPlayerCard(trigger.targets[0],1,'he',true);
                                break
                        }
                    }
                    delete player.storage.momizhiyanGroup;
                    'step 3'
                    if(event.suit=='diamond'&&result.cards){
                        trigger.targets[0].lose(result.cards, ui.discardPile);
                        trigger.targets[0].$throw(result.cards,1000);
                        game.log(trigger.targets[0],'将',result.cards,'置入了弃牌堆');
                        trigger.targets[0].draw();
                    }
                    event.finish()
                }
            },
            huxi1:{
                enable:'phaseUse',
                position:'he',
                usable:1,
                filter:function(event,player){
                    return player.countCards('h');
                },
				filterTarget:function(card,player,target){
                    // if(player.storage.huxiGroup&&player.storage.huxiGroup.contains(target)){
                    //     return false;
                    // }
                    return player.inRange(target)&&player.countCards('h')&&target.countCards('h');
                },
                content:function(){
					"step 0"
					if(player.countCards('h')==0||target.countCards('h')==0){
						event.result={cancelled:true,bool:false}
						event.finish();
						return;
					}
					game.log(player,'想要呼吸',target);
                    "step 1"
                    player.chooseCard('请选择交换的牌',true).set('type','compare');
                    "step 2"
                    event.card1=result.cards[0];
					target.chooseCard('请选择交换的牌',true).set('type','compare');
					"step 3"
                    event.card2=result.cards[0];
					if(!event.resultOL&&event.ol){
						game.pause();
					}
					"step 4"
					player.lose(event.card1,ui.ordering);
					target.lose(event.card2,ui.ordering);
					"step 5"
					game.broadcast(function(){
						ui.arena.classList.add('thrownhighlight');
					});
					ui.arena.classList.add('thrownhighlight');
					game.addVideo('thrownhighlight1');
					player.$compare(event.card1,target,event.card2);
					game.log(player,'的交换牌为',event.card1);
					game.log(target,'的交换牌为',event.card2);
					event.num1=event.card1.number;
					event.num2=event.card2.number;
					event.trigger('compare');
					game.delay(0,1500);
					"step 6"
					event.result={
						player:event.card1,
						target:event.card2,
						suit1:get.suit(event.card1),
						suit2:get.suit(event.card2)
					}
					var str;
					str=get.translation(player.name)+'想要呼吸'+get.translation(target.name);
					game.broadcastAll(function(str){
						var dialog=ui.create.dialog(str);
						dialog.classList.add('center');
						setTimeout(function(){
							dialog.close();
						},1000);
					},str);
					game.delay(2);
					"step 7"
					if(typeof event.target.ai.shown=='number'&&event.target.ai.shown<=0.85&&event.addToAI){
						event.target.ai.shown+=0.1;
					}
                    player.gain(event.card2,'visible');
                    player.$gain2(event.card2);
					game.delay(2);
                    target.gain(event.card1,'visible');
                    target.$gain2(event.card1);
					game.broadcastAll(function(){
						ui.arena.classList.remove('thrownhighlight');
					});
					game.addVideo('thrownhighlight2');
					if(event.clear!==false){
						game.broadcastAll(ui.clear);
					}
					if(typeof event.preserve=='function'){
						event.preserve=event.preserve(event.result);
                    }
                    "step 8"
                    if(event.result.suit2=='heart'||event.result.suit2=='diamond'||event.result.suit1=='heart'||event.result.suit1=='diamond'){
                        if(event.result.suit2=='heart'||event.result.suit2=='diamond'){
                            player.draw(1);
                            if(!player.hasSkill('huxi2')){
                                player.addTempSkill('huxi2');
                            }
                        }
                    }
                    else{
                        player.loseHp(1);
                    }
                    if(player.storage.huxiGroup==null) player.storage.huxiGroup=[];
                    player.storage.huxiGroup.add(target);

                },
                group:'huxi1_clear',
                subSkill:{
                    clear:{
                        firstDo:true,
                        silent:true,
                        direct:true,
                        trigger:{
                            player:['phaseAfter','phaseUseAfter']
                        },
                        content:function(){
                            delete player.storage.huxiGroup;
                        }
                    }
                }
            },
            huxi2:{
                trigger:{
                    player:['useCardBefore','phaseUseAfter']
                },
                firstDo:true,
                direct:true,
                content:function(){
                    if(player.hasSkill('huxi2')){
                        player.removeSkill('huxi2');
                    }
                },
                mod:{
                    cardUsable:function(card,player,num){
                        return Infinity;
                    },
                    globalFrom:function(from,to,distance){
                        return -1; //例子，进攻距离+1
                    },
                }
            },
            lianmeng:{
                trigger:{
                    player:'useCardAfter',
                    source:'damageSource',
                },
                forced:true,
                filter:function(event,player){
                    if(player.storage.huxiGroup==null){
                        player.storage.huxiGroup=[];
                    }
                    if(event.target){
                        if(player.storage.huxiGroup&&player.storage.huxiGroup.contains(event.target)){
                            return false;
                        }
                    }
                    if(event.name=='useCard'){
                        if(event.cards!=null&&get.subtype(event.cards[0])!='equip1'){
                            return false;    
                        }
                    }
                    if(player.countCards('h')<1){
                        return false;
                    }
                    if(game.hasPlayer(function(current){
                        return player.inRange(current)&&!player.storage.huxiGroup.contains(current)&&current.countCards('h')>0;
                    })){
                        return true;
                    }
                    else
                        return false
                },
                content:function(){
                    'step 0'
                    player.chooseTarget('对一名角色使用'+get.translation('huxi1'),{},true,function(card,player,target){
                        if(player==target) return false;
                        if(!player.inRange(target)) return false;
                        if(target.countCards('h')<1){
                            return false;
                        }
                        if(player.storage.huxiGroup&&player.storage.huxiGroup.contains(target)){
                            return false;
                        }
                        if(player.storage.huxiGroup.contains(target)) return false;
						if(game.hasPlayer(function(current){
                            if(player.storage.huxiGroup&&player.storage.huxiGroup.contains(current)){
                                return false;
                            }
                            if(current.countCards('h')==0){
                                return false;
                            }
                            if(current!=player&&get.distance(player,current)<get.distance(player,target)){
                                return true;
                            }
                            else{
                                return false;
                            }
						})){
							return false;
                        }
                        return true;
                    });
                    'step 1'
                    event.target=result.targets[0];
                    if(player.countCards('h')==0||!event.target||event.target.countCards('h')==0){
						event.result={cancelled:true,bool:false}
						event.finish();
						return;
					}
					game.log(player,'想要呼吸',event.target);
                    "step 2"
                    player.chooseCard('请选择交换的牌',true).set('type','compare');
                    "step 3"
                    event.card1=result.cards[0];
					event.target.chooseCard('请选择交换的牌',true).set('type','compare');
					"step 4"
                    event.card2=result.cards[0];
					if(!event.resultOL&&event.ol){
						game.pause();
					}
					"step 5"
					player.lose(event.card1,ui.ordering);
					event.target.lose(event.card2,ui.ordering);
					"step 6"
					game.broadcast(function(){
						ui.arena.classList.add('thrownhighlight');
					});
					ui.arena.classList.add('thrownhighlight');
					game.addVideo('thrownhighlight1');
					player.$compare(event.card1,event.target,event.card2);
					game.log(player,'的交换牌为',event.card1);
					game.log(event.target,'的交换牌为',event.card2);
					event.num1=event.card1.number;
					event.num2=event.card2.number;
					event.trigger('compare');
					game.delay(0,1500);
					"step 7"
					event.result={
						player:event.card1,
						target:event.card2,
						suit1:get.suit(event.card1),
						suit2:get.suit(event.card2)
					}
					var str;
					str=get.translation(player.name)+'想要呼吸'+get.translation(event.target.name);
					game.broadcastAll(function(str){
						var dialog=ui.create.dialog(str);
						dialog.classList.add('center');
						setTimeout(function(){
							dialog.close();
						},1000);
					},str);
					game.delay(2);
					"step 8"
					if(typeof event.target.ai.shown=='number'&&event.target.ai.shown<=0.85&&event.addToAI){
						event.target.ai.shown+=0.1;
					}
                    player.gain(event.card2,'visible');
                    player.$gain2(event.card2);
					game.delay(2);
                    event.target.gain(event.card1,'visible');
                    event.target.$gain2(event.card1);
					game.broadcastAll(function(){
						ui.arena.classList.remove('thrownhighlight');
					});
					game.addVideo('thrownhighlight2');
					if(event.clear!==false){
						game.broadcastAll(ui.clear);
					}
					if(typeof event.preserve=='function'){
						event.preserve=event.preserve(event.result);
                    }
                    "step 9"
                    if(event.result.suit2=='heart'||event.result.suit2=='diamond'||event.result.suit1=='heart'||event.result.suit1=='diamond'){
                        if(event.result.suit2=='heart'||event.result.suit2=='diamond'){
                            player.draw(1);
                            if(!player.hasSkill('huxi2')){
                                player.addTempSkill('huxi2');
                            }
                        }
                    }
                    else{
                        player.loseHp(1);
                    }
                    if(player.storage.huxiGroup==null) player.storage.huxiGroup=[];
                        player.storage.huxiGroup.add(event.target);
                },
                group:'lianmeng_difang',
                subSkill:{
                    difang:{
                        trigger:{
                            player:['gainAfter']
                        },
                        firstDo:true,
                        direct:true,
                        filter:function(event,player){
                            if(player==_status.currentPhase) return false;
                            return event.source&&player!=event.source;
                        },
                        content:function(){
                            player.discard(player.getEquip(2));
                        }
                    }
                }
            },
            gaonengzhanxie:{
                priority:15,
                firstDo:true,
				mod:{
					cardUsable:function(card,player,num){
						if(card.name=='sha'){
                            return num+player.countCards('e');
                        } 
					},
                    cardEnabled:function(card,player){
                        if(card.name=='sha'&&(player.getStat().card.sha>player.countCards('e'))) 
                            return false
                    }
                },
                group:['gaonengzhanxie_draw'],
                subSkill:{
                    draw:{
                        trigger:{
                            player:'useCardAfter'
                        },
                        firstDo:true,
                        direct:true,
                        filter:function(event,player){
                            if(event.card.name=='sha') return true;
                            else return false;
                        },
                        content:function(){
                            'step 0'
                            player.draw(player.getStat().card.sha);
                            'step 1'
                            if(player.getCardUsable({name:'sha'})!==0&&lib.filter.cardEnabled({name:'sha'},player)){
                                player.chooseToDiscard('he','弃置'+player.getStat().card.sha.toString()+'张牌',player.getStat().card.sha,true)
                            }
                        }
                    }
                }
            },
            ranyouxielou:{
                forced:true,
				//charlotte:true,
				trigger:{player:'damageBegin4'},
				filter:function(event){
					if(event.nature!=null) return true;
					return false;
				},
				content:function(){
                    'step 0'
                    trigger.source.chooseControl(true).set('choiceList',[
                        '令'+get.translation(player)+'回复'+trigger.num+'点生命',
                        '将'+get.translation(trigger.cards)+'交给'+get.translation(player),
                    ])
                    'step 1'
                    if(result.index==0){
                        player.recover(trigger.num);
                        trigger.cancel();
                    }
                    else{
                        if(trigger.cards){
                            player.gain(trigger.cards,'gain2')
                        }
                    }
                },
                group:'ranyouxielou_fire',
                subSkill:{
                    fire:{
                        trigger:{global:'damageBegin3'},
                        forced:true,
                        filter:function(event,player){
                            if(event.player==player) return false;
                            if(event.player&&player.inRange(event.player)&&event.nature=='fire') {
                                if(player.countCards('h')>=player.getHandcardLimit())
                                return true;
                            }//
                            return false;
                        },
                        content:function(){
                            player.chooseToDiscard('he','弃置一张牌，使该伤害+1',true,1);
                            trigger.num++;
                            //player.recover();
                        }
                    }
                }
            },
            baihuqingguo:{
                trigger:{global:'phaseBegin'},
				//frequent:true,
                filter:function(event,player){
                    return event.player!=player&&player.countCards('he')>0;
                },
                content:function(){
                    'step 0'
                    player.chooseToDiscard(1,'弃置一张牌');
                    'step 1'
                    if(result.bool){
                        player.addTempSkill('baihuqingguo_chaofeng');
                        trigger.player.addTempSkill('baihuqingguo_meihuo');
                    }
                    else{
                        event.finish();
                    }
                },
                subSkill:{
                    chaofeng:{
                        mark:true,
                        markText:'狐',
                        intro:{
                            name:'狐',
                            content:'你只能摸这只🦊'
                        },
                    },
                    meihuo:{
                        mark:true,
                        markText:'魅',
                        intro:{
                            name:'魅',
                            content:'你只能摸那只🦊'
                        },
                        mod:{
                            playerEnabled:function(card,player,target){
                                if(target==player||target.hasSkill('baihuqingguo_chaofeng')){
                                    return true;
                                }
                                else{
                                    return false;
                                }
                            }
                        }
                    }
                }
            },
            huyanluanyu:{
                trigger:{
                    player:'damage'
                },
                content:function(){
                    'step 0'
                    event.index=0;
                    event.damageNum=trigger.num;
                    event.nowHand=player.countCards('h');
                    event.getPlayers=game.filterPlayer(function(current){
                        if(current.countCards('h')>event.nowHand){
                            return true;
                        }
                    });
                    event.givePlayers=game.filterPlayer(function(current){
                        if(current.countCards('h')<event.nowHand){
                            return true;
                        }
                    });
                    'step 1'
                    if(event.index<event.getPlayers.length){
                        if(event.getPlayers[event.index].countCards('he')>0){
                            event.getPlayers[event.index].chooseCard(1,'he','交给'+get.translation(player)+'一张牌',true);
                        }
                    }
                    else{
                        event.index=0;
                        event.goto(3);
                    }
                    'step 2'
                    player.gain(result.cards);
                    game.delayx();
                    event.index+=1;
                    event.goto(1);
                    'step 3'
                    if(event.index<event.givePlayers.length){
                        if(player.countCards('he')>0){
                            player.chooseCard(1,'he','交给'+get.translation(event.givePlayers[event.index])+'一张牌',true);
                        }
                    }
                    else{
                        event.goto(5);
                    }
                    'step 4'
                    event.givePlayers[event.index].gain(result.cards);
                    game.delayx();
                    event.index+=1;
                    event.goto(3);
                    'step 5'
                    event.finish();
                }
            },
            yuanlv:{
				trigger:{global:'phaseEnd'},
				priority:2,
				filter:function(event,player){
					if(player.hasSkill('yuanlv_tag')){
						return true;
					}
					else
						return false;
                },
                content:function(){
                    'step 0'
                    player.draw(player.maxHp);
                    'step 1'
                    player.chooseCard(player.hp,'he','选择放置到牌堆顶部的牌',true);
                    'step 2'
					if(result.bool==true&&result.cards!=null){
						event.cards=result.cards
					}
                    if(event.cards.length>0){
                        //player.$throw(cards,1000);
                        //player.lose(event.cards,ui.special,'visible');
                        player.chooseButton(true,event.cards.length,['按顺序将卡牌置于牌堆顶（先选择的在上）',event.cards]).set('ai',function(button){
                            var value=get.value(button.link);
                            if(_status.event.reverse) return value;
                            return -value;
                        }).set('reverse',((_status.currentPhase&&_status.currentPhase.next)?get.attitude(player,_status.currentPhase.next)>0:false))
                    }
					"step 3"
					if(result.bool&&result.links&&result.links.length) event.linkcards=result.links.slice(0);
					game.delay();
					'step 4'
					var cards=event.linkcards;
					//player.$throw(cards,1000);,'visible'
					//game.log(player,'将',cards,'置于牌堆顶');
					player.lose(cards,ui.special);
					'step 5'
                    game.delay();
                    'step 6'
					var cards=event.linkcards;
                    while(cards.length>0){
                        var card=cards.pop();
                        card.fix();
                        ui.cardPile.insertBefore(card,ui.cardPile.firstChild);
                        game.updateRoundNumber();
                            //game.log(player,'将',card,'置于牌堆顶');
                    }
                },
				group:['yuanlv_ready'],
				subSkill:{
					ready:{
						trigger:{player:['damageAfter','loseHpAfter','useCardAfter']},
						priority:2,
						direct:true,
						filter:function(event,player,name){
							if(name=='useCardAfter'){
								var indexi=0
								while(indexi<event.cards.length){
									if(get.type(event.cards[indexi])=='trick'||get.type(event.cards[indexi])=='delay')
										return true;
									indexi++;
								}
								return false;
							}
							else 
								return true;
						},
						content:function(){
                            if(trigger.name=='useCard'){
                                if(!player.hasSkill('yuanlv_tag')&&!player.hasSkill('yuanlv_trickUsed')){
                                    player.addTempSkill('yuanlv_tag');
                                    player.addTempSkill('yuanlv_trickUsed','roundStart');
                                }
                            }
                            else{
                                if(!player.hasSkill('yuanlv_tag')&&!player.hasSkill('yuanlv_damaged')){
                                    player.addTempSkill('yuanlv_tag');
                                    player.addTempSkill('yuanlv_damaged','roundStart');
                                }
                            }
						}
					},
					tag:{
						mark:true,
                        markText:'虑',
						intro:{
							content:function(){
								return '结束时触发技能'+get.translation('yuanlv')
							}
						}
                    },
                    damaged:{
						mark:true,
                        markText:'伤',
						intro:{
							content:function(){
								return '本轮已经通过失去体力触发'+get.translation('yuanlv')
							}
						}
                    },
                    trickUsed:{
						mark:true,
                        markText:'锦',
						intro:{
							content:function(){
								return '本轮已经通过使用锦囊触发'+get.translation('yuanlv')
							}
						}
                    }
				}
            },
            jinyuan:{
                enable:'phaseUse',
                usable:1,
                filter:function(event,player){
                    return player.countCards('he')>0;
                },
				filterTarget:function(card,player,target){
					return player!=target;
				},
                content:function(){
                    'step 0'
                    player.viewHandcards(target);
                    game.delayx();
                    'step 1'
                    event.nowHandCards=target.getCards('h');
                    player.chooseCard('he',true,'选择给予的牌').set('ai',function(card){
                        return 5-get.value(card);
                    });
                    'step 2'
                    event.cardUsable=true;
                    console.log(event.card,result.card)
                    event.card=result.cards[0];
                    if(event.nowHandCards.length>0)
                    event.nowHandCards.forEach(element => {
                        if(get.suit(element)==get.suit(result.cards[0])){
                            event.cardUsable=false;
                        }
                    });
                    if(event.cardUsable){
                        var bool=game.hasPlayer(function(current){
                            return target.canUse(result.cards[0],current);
                        });
                        if(!bool){
                            event.cardUsable=false;
                        }
                    }
                    'step 3'
					target.gain(event.card,player,'give');
                    if(event.cardUsable){
                        target.chooseUseTarget(event.card,'可选择一个目标直接使用该牌');
                    }
                }
            },
			zhongjian:{
				unique:true,
				group:['zhongjian1'],
				zhuSkill:true,
			},
            zhongjian1:{
                zhuSkill:true,
                trigger:{global:'useCard2'},
				//enable:'chooseToUse',
				//popup:false,
                //forced:false,
				//selectCard:0,
                // viewAs:function(cards,player){
				// 	var name=false;
				// 	var nature=null;
				// 	name='wuxie';
				// 	if(name) return {name:name,nature:nature,isCard:true};
				// 	return null;
				// },
				// ignoreMod:true,
				// filterCard:function(card,player,event){
				// 	if(!player.hasZhuSkill('zhongjian')) return false;
                //     if(player.hasSkill('zhongjian1_tag')) return false;
				// 	event=event||_status.event;
				// 	var filter=event._backup.filterCard;
				// 	if(filter({name:'wuxie'},player,event)) return true;
				// 	return false;
				// },
				filter:function(event,player){
					if(!player.hasZhuSkill('zhongjian')) return false;
                    //var filter=event.filterCard;
                    if(player.hasSkill('zhongjian1_tag')) return false;
                    if(get.type(event.card)!=='trick') return false;
                    //if(!filter({name:'wuxie'},player,event)) return false;
                    // var time=player.chooseTarget('命令一名杏势力角色将一张牌视为无懈可击',{},true,function(card,player,target){
                    //     return target.group=='holo'
                    // });
                    // console.log(time);
					return true;
                },
                content:function(){
                    "step 0"
                    if(player.hasSkill('zhongjian1_tag')){
                        event.finish()
                    }
                    else
                    player.chooseTarget('命令一名其他杏势力角色本回合一张手牌视为无懈可击',{},function(card,player,target){
                        return player!=target&&target.group=='holo'&&target.countCards('h')>0
                    });
                    "step 1"
                    if(result.bool){
						event.dropTarget=result.targets[0];
						player.choosePlayerCard(result.targets[0],1,'h',true)
						//var dropcards=event.dropTarget.getCards('h')
                    }
                    else{
                        event.finish()
                    }
					"step 2"
					if(result.bool){
						player.addTempSkill('zhongjian1_tag','roundStart');
						event.dropTarget.storage.changeWuxie=result.links[0];
						
                        //event.dropTarget.chooseCard('he',1,true);
                        event.dropTarget.addTempSkill('zhongjian1_zhuanhua');
					}
					else{
                        event.finish()
					}
                    // event.dropTarget.$throw(result.cards);
                    // event.dropTarget.lose(result.cards,ui.discardPile);
                    //console.log(event.getParent().getParent().getParent());
                    // event.cards=result.cards
                    // "step 3"
                    //event.getParent().getParent().state=!event.getParent().getParent().state;
                    // console.log(event.getParent().getParent());
                    // event.getParent().getParent().goto(0);
                    // event.dropTarget.useCard(event.cards,{name:'wuxie',isCard:false});
                    //player.removeSkill('zhongjian','roundStart');
                },
				// hiddenCard:function(player,name){
				// 	return name=='wuxie'&&!player.hasSkill('zhongjian1_tag')&&player.hasZhuSkill('zhongjian');
                // },
                subSkill:{
                    tag:{
                        mark:true,
						intro:{
							content:function(){
								return '一轮后可以再次使用'+get.translation('zhongjian')
							}
                        },
                    },
                    zhuanhua:{
                        mark:true,
						intro:{
							content:function(){
								return '一张手牌视为【无懈可击】'
							}
						},
						onremove:function(player){
							player.storage.changeWuxie=null;
						},
                        mod:{
                            cardname:function(card,player){
								if(card==player.storage.changeWuxie)
                                return 'wuxie';
                            },
                        },
                    }
                }
            },
			meiwu: {
				// popup: false,
				direct: true,
				trigger: {
					target: 'useCardToTarget',
				},
				usable: 1,
				filter: function(event, player) {
					return get.color(event.card) == 'black' && event.targets.length == 1
				},
				content: function() {
					'step 0'
					if (!game.hasPlayer(function(cur) {
						return cur != player && cur != trigger.player;
					})) event.finish();
					else
					game.broadcastAll(
						function(player,tplayer){
							player.chooseTarget('转移给一名其它角色', function(card, player, target) {
								return player != target && target != tplayer;
							})
						},player,trigger.player
					)
					'step 1'
					if (result.bool) {
						var target=result.targets[0];
						player.logSkill(event.name, target);
						var evt = trigger.getParent();
						evt.triggeredTargets2.remove(player);
						evt.targets.remove(player);
						evt.targets.push(target);
						player.storage.meiwu_trace = {
							cardid: trigger.card.cardid,
							target: target,
						};
					}
				},
				group: ['meiwu_trace'],
				subSkill: {
					trace: {
						direct: true,
						trigger: {
							global: 'useCardAfter',
						},
						filter: function(event, player) {
							if (!player.storage.meiwu_trace) return false;
							return player.storage.meiwu_trace.cardid == event.card.cardid &&
								(event.result.bool == false || event.result.wuxied);
						},
						content: function() {
							'step 0'
							player.chooseCard(true, 'he', "交给其一张牌");
							'step 1'
							if (result.bool && result.cards.length) {
								var target = player.storage.meiwu_trace.target;
								player.$giveAuto(result.cards, target);
								target.gain(result.cards, player);
							}
						}
					},
				}
			},
			huichu: {
				trigger: {
					global: 'phaseBegin',
				},
				filter: function(event, player) {
					return player.countCards('h')
						&& !game.hasPlayer(function(cur) {
							return cur.hp < event.player.hp;
						});
				},
				content: function() {
					'step 0'
					player.showHandcards();
					event.chk = player.countCards('h') == player.countCards('h', {suit: 'heart'});
					'step 1'
					if (event.chk) {
						trigger.player.recover();
					}
					'step 2'
					if (!event.chk) {
						player.chooseCard("重铸任意张手牌", 'h', [1, Infinity]);
					}
					'step 3'
					if (!event.chk && result.bool && result.cards.length) {
						player.lose(result.cards, ui.discardPile);
						player.$throw(result.cards);
						game.log(player, '将', result.cards, '置入了弃牌堆');
						player.draw(result.cards.length);
					}
				}
			},

			haodu: {
				enable: 'phaseUse',
				filterCard: true,
				selectCard: [1, Infinity],
				position: 'h',
				selectTarget: 1,
				discard:false,
				lose:false,
				filter: function(event, player) {
					return player.countCards('h') && !player.hasSkill('haodu_lose')
						&& (!player.getStat('skill').haodu)||((player.getStat('skill').haodu||0) < player.maxHp - player.hp);
				},
				filterTarget: function(card, player, target) {
					return player != target;
				},
				content: function() {
					'step 0'
					target.gain(cards,player,'giveAuto');
					'step 1'
					event.videoId = lib.status.videoId++;
					var typelist = [
							['基本','','sha', 'basic', 'div1'], 
							['锦囊', '', 'wuzhong', 'trick', 'delay', 'div1'], 
							['装备', '', 'renwang', 'equip', 'div1']
						];
					var suitlist = [
							['heart', '', 'heart', 'heart', 'div2'],
							['diamond', '', 'diamond', 'diamond', 'div2'],
							['club', '', 'club', 'club', 'div2'],
							['spade', '', 'spade', 'spade', 'div2']
						];
					var numberlist = [];
					for (var i = 1; i <= 13; ++i) {
						var c = i;
						if (i == 1) c = 'A';
						else if (i == 10) c = 'X'
						else if (i == 11) c = 'J';
						else if (i == 12) c = 'Q';
						else if (i == 13) c = 'K';
						else c = i;
						numberlist.push(['', i, c, i, 'div3']);
					}
					game.broadcastAll(function(id, typelist, suitlist, numberlist){
						var dialog=ui.create.dialog('豪赌 选择');
						dialog.addText('类型');
						dialog.add([typelist, 'vcard']);
						dialog.addText('花色');
						dialog.add([suitlist, 'vcard']);
						dialog.addText('点数');
						dialog.add([numberlist, 'vcard']);
						dialog.videoId = id;
					}, event.videoId, typelist, suitlist, numberlist);
					'step 2'
					var next = player.chooseButton(3 ,true);
					next.set('dialog',event.videoId);
					next.set('filterButton',function(button) {
						for(var i = 0;i < ui.selected.buttons.length; i++){
							var now = button.link, pre = ui.selected.buttons[i].link;
							if (now[now.length - 1] == pre[pre.length - 1]) return false;
						}
						return true;
					});
					'step 3'
					game.broadcastAll('closeDialog', event.videoId);
					if (result.bool) {
						event.chi = [];
						result.links.forEach(function(card) {
							for (var i = 3; i < card.length - 1; ++i) event.chi.push(card[i]);
						})
					}
					else event.finish();
					'step 4'
					player.choosePlayerCard(target, 'h', true);
					'step 5'
					if (result.bool) {
						event.card = result.links[0];
						var str = "豪赌展示<br>";
						game.log(player,'选择了',event.chi);
						if (event.chi.contains(get.number(event.card))) str += "你与其交换手牌<br>";
						if (event.chi.contains(get.type(event.card))) str += "你弃置其两张牌<br>";
						if (event.chi.contains(get.suit(event.card))) str += "你获得其一张牌<br>";
						player.showCards(event.card, str);
						game.delay(2);
					}
					else event.finish();
					'step 6'
					if (event.chi.contains(get.number(event.card))) {
						player.line(target, 'grean');
						player.swapHandcards(target);
					}
					'step 7'
					if (event.chi.contains(get.type(event.card))) {
						game.delayx();
						if (target.countDiscardableCards(player, 'he')) {
							player.line(target, 'grean');
							target.discardPlayerCard("弃置两张牌", target, 2, 'he', true);
						}
					}
					'step 8'
					if (event.chi.contains(get.suit(event.card))) {
						game.delayx();
						if(target.countGainableCards(player, 'he')){
							player.line(target, 'grean');
							player.gainPlayerCard("获得其一张牌", 'he', target, true);
						}
					}
				},
				subSkill: {
					lose: {},
				}
			},
			yong: {
				init: function(player) {
					if (!player.storage.yong) {
						player.storage.yong = [];
					}
				},
				locked:true,
				notemp:true,
				marktext: '咏',
				intro: {
					content: 'cards',
					onunmark:function(storage,player){
						if(storage&&storage.length){
							player.$throw(storage,1000);
							game.cardsDiscard(storage);
							game.log(storage,'被置入了弃牌堆');
							storage.length=0;
						}
					},
				}
			},
			yemuxingyong: {
				group: ['yong', 'yemuxingyong_gain', 'yemuxingyong_use'],
				subSkill: {
					gain: {
						round: 1,
						trigger: {
							global: 'phaseDiscardAfter',
						},
						filter: function(event, player) {
							if(event.player.isIn()){
								var find = false;
								event.player.getHistory('lose',function(evt){
									return evt.type=='discard'&&evt.getParent('phaseDiscard')==event&&evt.hs.filterInD('d').length>0;
								}).forEach(function(arr) {
									if (arr.cards != undefined) arr.cards.forEach(function(c) {
										find = true;
									})
								});
								return find;
							}
							return false;
						},
						check: function(event, player) {
							return true;
						},
						content: function() {
							"step 0"
							var cards=[];
							game.getGlobalHistory('cardMove',function(evt){
								if(evt.name=='cardsDiscard'&&evt.getParent('phaseDiscard')==trigger) cards.addArray(evt.cards.filterInD('d'));
							});
							game.countPlayer2(function(current){
								current.getHistory('lose',function(evt){
									if(evt.type!='discard'||evt.getParent('phaseDiscard')!=trigger) return;
									cards.addArray(evt.cards.filterInD('d'));
								})
							});
							event.cards = cards;
							if (event.cards.length) {
								game.cardsGotoSpecial(event.cards);
							}
							else {
								event.finish();
							}
							'step 1'
							player.storage.yong = player.storage.yong.concat(event.cards);
							player.showCards(player.storage.yong,'夜幕星咏');
							player.syncStorage('yong');
							player.markSkill('yong');
							"step 2"
							event.players=game.filterPlayer(function(current){
								return current!=player && current.countCards('he') > 0;
							});
							event.players.sortBySeat(player);
							"step 3"
							if(event.players.length){
								event.current=event.players.shift();
								event.current.animate('target');
								player.line(event.current,'green');
								if (event.current.countCards('he') && player.isAlive()) {
									event.current.chooseCard({color:'black'},'he', 
									'可将一张黑色牌置于' + get.translation(player)+ '武将牌上').set('ai',function(card){
										if(get.attitude(_status.event.player,_status.event.target) > 1) return 7-get.value(card);
										return -1;
									}).set('target', player);;
								}
							}
							else{
								player.showCards(player.storage.yong, "咏");
								game.delayx();
								event.finish();
							}
							"step 4"
							if (result.bool) {
								var card = result.cards[0];
								event.current.lose(card, ui.special, 'toStorage');
								player.storage.yong.push(card);
								event.current.$give(card, player, false);
								player.syncStorage('yong');
								player.markSkill('yong');
							}
							event.goto(3);
						},
					},
					use: {
						enable: 'phaseUse',
						filter: function(event, player) {
							if (!player.storage.yong.length) {
								return false;
							}
							return true;
						},
						content: function() {
							'step 0'
							player.chooseButton(['选择一张咏', player.storage.yong], 1);
							'step 1'
							if (result.bool) {
								var card = result.links[0];
								player.gain(result.links, 'fromStorage');
								player.storage.yong.remove(card);
								player.syncStorage('yong');
								player.markSkill('yong');
								player.$give(card, player, false);
								if (!player.storage.yong.length) {
									player.unmarkSkill('yong');
								}
							}
							else event.finish();
							'step 2'
							var chk = player.countCards('h') >= 2;
							if(chk){
								chk &= lib.filter.cardUsable({name:'jiu'},player, 
										event.getParent('chooseToUse'))
										&& player.canUse('jiu', player);
								game.players.forEach(function(p) {
									if (p != player && player.canUse('guohe', p)) chk = true; 
								})
								if (!chk) event.finish();
							}
							else{
								event.finish();
							}
							'step 3'
							player.chooseCardTarget({
								prompt: "选择两张手牌并对自己使用一张酒或对其它角色使用一张过河拆桥",
								position: 'h',
								selectCard: 2, 
								forced: true,
								filterTarget: function(card, player, target) {
									if (player == target) {
										return lib.filter.cardUsable({name:'jiu'},player, _status.event.getParent('chooseToUse'))
											&& player.canUse('jiu', player);
									}
									else {
										return player.canUse('guohe', target);
									}
								}
							})
							'step 4'
							if (result.bool && result.targets.length && result.cards.length) {
								var tar = result.targets[0];
								if (tar == player) player.useCard({name: 'jiu'}, tar, result.cards);
								else player.useCard({name: 'guohe'}, tar, result.cards);
							}
						}
					},
				}
			},
			xinghejianduei: {
				skillAnimation:true,
				animationColor:'thunder',
				juexingji:true,
				unique:true,
				trigger:{
					global: 'roundStart'
				},
				filter:function(event,player){
					return !player.storage.xinghejianduei && player.hp <= game.roundNumber;
				},
				forced:true,
				content: function() {
					player.loseMaxHp();
					player.draw(event.num=game.countPlayer());
					// player.draw(10 - player.countCards('h'));
					player.addSkill('xinghejianduei_juexing');
					player.awakenSkill(event.name);
					player.storage[event.name]=true;
				},
				subSkill: {
					juexing: {
						mod: {
							maxHandcardBase:function(player,num){
								return num + player.storage.yong.length;
							},
							attackFrom:function(from,to,distance){
								return distance-from.storage.yong.length;
							},
						}
					}
				}
			},
            			
			//夸
			kuali:{
				init:function (player){
					player.storage.kuali=0;
				},
				group:['kuali_zhuDong','kuali_jieshu'],
				subSkill:{
					zhuDong:{
						enable:"phaseUse",
						usable:1,
						filter:function(event,player){
							return game.hasPlayer(function(cur){
								return (cur.countCards('h')%player.countCards('h')==0&&cur.countCards('h')>0)||(cur.hp%player.hp==0);
							});
						},
						content:function(){
							'step 0'
							player.storage.kuali++;
							player.chooseControlList(
								['选择任意名手牌数为你整数倍的角色，你弃置等量牌并回复等量体力',
								'摸体力为你整数倍的角色数的牌，然后失去1点体力'],
								true,function(event,player){
									return _status.event.index;
								});
							'step 1'
							if(result.index==0){
								player.chooseTarget('选择任意名手牌数为你整数倍的角色，你弃置等量牌并回复等量体力',[1,Infinity],function(card,player,target){
									if(target==player) 				return false;
									return target.countCards('h')%player.countCards('h')==0;
								});						
							}
							if(result.index==1){
								var num=-1;
								game.hasPlayer(function(cur){
									if(cur.hp%player.hp==0)
									num++;
								});
								player.draw(num);
								player.loseHp();
								_status.event.finish();
							}
							'step 2'
							if(result.bool&&result.targets.length)
							{
								var num=0;
								num=Number(result.targets.length);
								player.chooseToDiscard(num,'弃置'+num+'张牌并回复等量体力','he');
								player.recover(num);
							}
						},
					},
				
			
					jieshu:{
						trigger:{player:'phaseEnd'},
						usable:1,
						priority:40,
						filter:function(event,player){
								if(player.storage.kuali!=0){
									player.storage.kuali=0;
									return false;
								}
								return game.hasPlayer(function(cur){
									return (cur.countCards('h')%player.countCards('h')==0&&cur.countCards('h')>0)
									||(cur.hp%player.hp==0&&cur.hp>0);
								});
							},
							content:function(){
								'step 0'
								player.storage.kuali++;
								player.chooseControlList(
									['选择任意名手牌数为你整数倍的角色，你弃置等量牌并回复等量体力',
									'摸体力为你整数倍的角色数的牌，然后失去1点体力'],
									true,function(event,player){
										return _status.event.index;
									});
								'step 1'
								if(result.index==0){
									player.chooseTarget('选择任意名手牌数为你整数倍的角色，你弃置等量牌并回复等量体力',[1,Infinity],function(card,player,target){
										if(target==player) 				return false;
										return target.countCards('h')%player.countCards('h')==0;
									});						
								}
								if(result.index==1){
									var num=-1;
									game.hasPlayer(function(cur){
										if(cur.hp%player.hp==0)
										num++;
									});
									player.draw(num);
									player.loseHp();
									event.finish();
								}
								'step 2'
									if(result.bool&&result.targets.length)
									{
										var num=0;
										num=Number(result.targets.length);
										player.chooseToDiscard(num,'弃置'+num+'张牌并回复等量体力','he');
										player.recover(num);
									}
								},
						},
					},
			},
			youyi:{
				trigger:{
					global: 'phaseBegin'
				},
				round:1,
				priority:80,
				filter:function(event, player){	
					return event.player!=player&&player.countCards('he');
				},
				content:function(){
					'step 0'
					var next=player.chooseCard(get.prompt2('youyi'),'he');
					next.set('ai',function(card){
						if(get.name(card)=='shan') return 90;
						return 80-get.value(card);
					});
					'step 1'
					if(result.bool){
						player.logSkill('youyi');
						player.showCards(result.cards);
					}
					'step 2'
					if(result.cards){
						var target = trigger.player;
						player.$giveAuto(result.cards,target);
						target.gain(result.cards,player);
						target.markSkill('youyi');
						target.addTempSkill('youyishiyue','phaseAfter');
						target.addTempSkill('youyishiyue_lose','phaseEnd');
						target.addTempSkill('youyishiyue_rec','phaseAfter');
						player.storage.youyi=result.cards[0];
					}
				},
				group:['youyi_dam'],
				subSkill:{				
					dam:{
						trigger:{global:'damageBegin'},
						priority:80,
						check:function(event,player){
							return (get.attitude(player,event.player)>0);
						},	
						filter:function(event,player){
							if(event.source==player||!event.source)	return false;
							return event.source.hasSkill('youyishiyue');
						},
						prompt:'是否收回“誓约”牌',
							content:function(){
							trigger.num=0;
							player.line(trigger.source,'thunder');
							trigger.source.$giveAuto(result.cards,player);
							player.gain(player.storage.youyi,trigger.source);
							trigger.source.removeSkill('youyishiyue');
							trigger.source.updateMarks();
						}
					},
				},
			},
			youyishiyue:{
				marktext:"誓",
				locked:true,
				intro:{
					name:'誓约牌',
					content:function (storage,player,skill){
						var su,na,nu,shi;
						game.hasPlayer(function(cur){
							if(cur.hasSkill('youyi')){
								shi=cur.storage.youyi;
								su=get.suit(shi);
								na=get.name(shi);
								nu=shi.number;
							}
						});
						return '当前的“誓约”牌为'+get.translation(su)+get.translation(nu)+get.translation(na)+'当你造成伤害时，湊阿库娅可令你将“誓约”牌交给她以防止之。该回合结束时，你可以弃置“誓约”牌令你或其回复1点体力。 \n （若此牌离开你的区域，此状态结束）';
					},
					onunmark:function(storage,player){
						if(storage&&storage.length){
							player.$throw(storage,1000);
							game.cardsDiscard(storage);
							game.log(storage,'誓约解除');
							storage.length=0;
						}
					},
				},
				mark:true,
				group:['youyishiyue_lose','youyishiyue_rec'],
				subSkill:{
					lose:{
						trigger:{player:['loseAfter']},
						forced:true,
						silent:true,
						firstDo:true,
						filter:function(event,player){
							var shi;
							game.hasPlayer(function(cur){
								if(cur.hasSkill('youyi')){
									shi=cur.storage.youyi;
									return true;
								}
								else{
									return false;
								}
							});
							if(!(event.getParent().cards||event.cards))											return false;
							if(event.getParent().name=="useCard"&&get.type(event.getParent().card)=='equip')	return false;
							if(event.getParent().card!=null&&(get.name(event.getParent().card) =='shandian'||get.name(event.getParent().card) =='fulei'))		return false;
		//					console.log(event);
							if(event.cards){
								for(var i=0;i<event.cards.length;i++){
									if(event.cards[i]==shi)		return true;
								}
							}
							else if(event.getParent().cards){
								for(var i=0;i<event.getParent().cards.length;i++){
									if(event.getParent().cards[i]==shi)		return true;
								}
							}
						},
						content:function(){
							player.removeSkill('youyishiyue');
							player.updateMarks();
						},
					},
					rec:{
						trigger:{player:'phaseEnd'},
						forced:false,
						priority:80,
						filter:function(event,player){
							var shi,own=0;
							game.hasPlayer(function(cur){
								if(cur.hasSkill('youyi')){
									shi=cur.storage.youyi;
									return true;
								}
								else{
									return false;
								}
							});
							player.getCards('hej').forEach(function(ca){
								if(ca==shi)	own++;
							});
							return own;
						},
						content:function(){
							//弃“誓约”牌回复
							'step 0'
							game.broadcastAll(function(player){
								var shi;
								var aqua;
								game.hasPlayer(function(cur){
									if(cur.hasSkill('youyi')){
										aqua = cur
										shi = cur.storage.youyi;
									}
								});
								_status.event.card = shi;
			//					player.choosePlayerCard('弃置誓约牌','hej',function(card,player){
			//						return card=shi;
			//					});
								player.chooseTarget('让你或她回复一点体力',1,function(card,player,target){
									return target==player||target==aqua;
								});
							}, player);
							'step 1'
							if(result.bool){
								var shi = _status.event.card;
								result.targets[0].recover();
								player.discard(shi);
							}
						},
					},
			
			
				},
			},
			//兔宝
			pekoyu:{
				init:function(player){
					player.storage.pekoyu=[];
				},
				marktext:"peko",
				locked:true,
				intro:{
					name:'嚣张咚鼓',
					content:function (storage,player,skill){
						if(storage.length){
							return '本回合已通过花色为'+ get.translation(storage) +'的牌发动了技能';
						}
						else{
							return '本回合尚未发动技能';
						}
					},
				},
				trigger:{player:'useCardAfter'},
				forced:false,
				priority:111,
				filter:function(event,player){
					if(!player.isPhaseUsing()) return false;
					if(!(get.type(event.card) =='basic'||get.type(event.card)=='trick'))	return false;
					if(event.result.bool == false || event.result.wuxied)					return false;
					if(!player.storage.pekoyu.length)										return true;
			//		console.log(player.getLastUsed(1));
		/*			var evt=player.getLastUsed(1);
					if(!evt||!evt.card) return true;
						var ark=[get.suit(evt.card)];
						for(var i=2;;i++){
							var evt=player.getLastUsed(i);
							if(!evt||!evt.card){
								ark.push(get.suit(evt.card));
							}
							else break;
						}
					for(var i=0;i<ark.length;i++){
						if(get.suit(event.card)==ark[i])							return false
					}
		*/			console.log(player.storage.pekoyu);
					for(var i=0;i<player.storage.pekoyu.length;i++){
						if(get.suit(event.card)==player.storage.pekoyu[i])					return false
					}
					return !(event.result.bool == false || event.result.wuxied);			
				},
				content: function() {
					'step 0'
					player.storage.pekoyu.add(get.suit(trigger.card));
					console.log(player.storage.pekoyu);
					player.draw(),
					player.chooseToDiscard('然后，弃置一张牌','h').set('ai',function(card){
						var name = card.name;
						if(name=='jiu') 			return 120;
						if(get.type(card)=='trick')	return 40;
						return 100-get.value(card);													
					});
					'step 1'
					if(result.cards){
						if(get.name(result.cards[0],'player')=='jiu'||
							(player.hasSkill('hongshaoturou_viewAs')&&(result.cards[0].name=='shan'||result.cards[0].name=='tao')))
						player.chooseTarget('选择一名角色，令其摸两张牌').set('ai',function(target){
							var player=_status.event.player;
							return get.attitude(player,target)*(target.isDamaged()?2:1);
						});
					}
					'step 2'
					if(result.bool&&result.targets.length){
						var target=result.targets[0];
						player.line(target,'thunder');
						target.draw(2);
					}
				},
				group:['pekoyu_update', 'pekoyu_back'],
				subSkill:{
					update:{
						trigger:{player:'phaseBegin'},
						forced:true,
						silent:true,
						firstDo:true,
						content:function(){
							player.markSkill('pekoyu');
						}
					},
					back:{
						trigger:{player:'phaseAfter'},
						forced:true,
						silent:true,
						firstDo:true,
						content:function(){
							player.unmarkSkill('pekoyu');
							player.storage.pekoyu = [];
						}
					},
				},
			},
			hongshaoturou:{
				enable:"phaseUse",
				usable:1,
				content:function(){
					player.link();
					player.addMark('hongshaoturou',1,false);
					player.addTempSkill('hongshaoturou_viewAs','phaseAfter');
					player.addTempSkill('hongshaoturou_shao','phaseAfter');
					var buff = '.player_buff';
							game.broadcastAll(function(player, buff){
								player.node.hongshaoturou= ui.create.div(buff ,player.node.avatar);
							}, player, buff);
				},	
				onremove: function(player, skill) {
					player.removeSkill('hongshaoturou_shao');
				},		
			},
			hongshaoturou_viewAs:{
				mod:{
					cardname:function(card,player){
						if(card.name=='shan'||card.name=='tao')														return 'jiu';
						if(get.subtype(card)=='equip3'||get.subtype(card)=='equip4'||get.subtype(card)=='equip6')	return 'tiesuo';
					},
				},
				trigger:{player:['useCard1','respond','loseBeign']},
				firstDo:true,
				forced:	true,
				filter:function(event,player){
					return event.card.name=='jiu'&&!event.skill&&
					event.cards.length==1&&(event.cards[0].name=='tao'||event.cards[0].name=='shan');
				},
				content:function(){
				},
			},
			hongshaoturou_shao:{
				trigger:{player:['phaseEnd']},
				marktext: '炎',
				mark: true,
				forced: true,
				intro: {
					content:'当前回合结束后受到一点火焰伤害',
					name:'自煲自足',
				},
				onremove: function(player, skill) {
					game.broadcastAll(function(player){
						if(player.node.hongshaoturou){
							player.node.hongshaoturou.delete();
							delete player.node.hongshaoturou;
						}
					}, player);
				},
				filter:function(event,player){
					return true;
				},
				content:function(){
					player.damage('fire');
					player.removeSkill('hongshaoturou_shao');	
				}
			},
		},
		translate:{
            hololive_1:'一期生',
            hololive_wuyin:'无印',
            hololive_2and3:'二&三期生',

			TokinoSora:'时乃空',
			taiyangzhiyin:'太阳之音',
			taiyangzhiyin_info:'你使用牌指定目标时，此牌点数每比10大1点，你便可选择不重复的一项：令之无法响应；为之额外指定一名目标；或摸一张牌。',
            renjiazhizhu:'仁家之主',
            renjiazhizhu_info:'<font color=#ff4>主公技</font> 你的回合开始时，其他同势力角色可以展示并交给你一张牌，本回合这些点数的牌点数均改为J。',
            renjiazhizhu_tag:'仁家之主',

            YozoraMel:'夜空梅露',
            juhun:'聚魂',
            juhun_info:'<font color=#f66>锁定技</font> 一回合一次，当一名角色受到伤害后，将牌堆顶牌置于你武将牌上。每轮开始时，你获得武将牌上所有牌。当你的手牌数为全场最多时，摸牌阶段你少摸一张牌。',
            meilu:'没露',
            meilu_info:'<font color=#f66>锁定技</font> 准备阶段，若你的手牌数比体力值多三或以上，你翻面。当你的武将牌背面朝上时，你使用【杀】没有次数限制；当你的武将牌翻至正面时，你回复 1 点体力。',

            AkaiHaato:'赤井心',
            liaolishiyan:'料理实验',
            liaolishiyan_info:'摸牌阶段，你可改为展示并获得牌堆顶的两张牌，然后根据其中的花色执行对应效果：♦~重铸一张牌，♣~弃置一张牌，♥~令赤井心回复 1 点体力，♠~失去 1 点体力。出牌阶段限一次，你可以重铸与当回合“料理实验”花色相同的两张牌令一名角色执行对应效果。',
            liaolishiyan2:'料理实验',
            liaolishiyan2_info:'出牌阶段限一次，你可以重铸与当回合“料理实验”花色相同的两张牌令一名角色执行对应效果。♦~重铸一张牌，♣~弃置一张牌，♥~令赤井心回复 1 点体力，♠~失去 1 点体力。',
            momizhiyan:'抹蜜之言',
            momizhiyan_info:'当你使用牌指定目标后，你可弃置一张牌令其中一名目标执行弃置牌花色在“料理实验”的对应效果。每回合限一次。',

            NatsuiroMatsuri:'夏色祭',
            huxi1:'呼吸',
            huxi1_info:'出牌阶段限一次，你可以令攻击范围内的一名其他角色与你同时展示一张手牌并交换，若你获得了红色牌，你可以摸一张牌并令你本回合使用的下一张牌不受距离与次数限制；若没有人获得红色牌，你失去 1 点体力。',
            lianmeng:'连梦',
            lianmeng_info:'当你使用武器牌或造成伤害后，你需对本回合未成为过“呼吸”目标中距离你最近的角色立即发动一次“呼吸”。当你于回合外获得其他角色的牌后，弃置你装备区的防具牌。',

            RobokoSan:'萝卜子',
            gaonengzhanxie:'高能战械',
            gaonengzhanxie_info:'<font color=#f66>锁定技</font> 你出牌阶段可使用【杀】的次数等于你装备区内牌数+1。当你于回合内使用【杀】后，你摸X张牌，然后若你还可使用【杀】，你弃置等量的牌。（X为你本阶段已使用过的【杀】的数量)',
            ranyouxielou:'燃油泄漏',
            ranyouxielou_info:'<font color=#f66>锁定技</font> 你受到属性伤害时，来源需选择至少一项：改为令你回复等量体力，或令你获得来源牌。你攻击范围内其他角色受到火焰伤害时，若你的手牌数不小于手牌上限，你弃置一张牌令此伤害+1。',

            ShirakamiFubuki:'白上吹雪',
            baihuqingguo:'白狐倾国',
            baihuqingguo_info:'其他角色的出牌阶段开始时，你可弃一张牌，若如此做，该角色于此阶段使用的牌只能以你或其自己为目标。',
            huyanluanyu:'狐言乱语',
            huyanluanyu_info:'每当你受到1点伤害后，（记你此时手牌数为X）你可令手牌数多于X的角色各交给你一张牌，然后你交给手牌数少于X的角色各一张牌。',
            yuanlv:'远虑',
            yuanlv_info:'你使用过锦囊牌或受到过伤害的回合结束时，可以摸等同你体力上限的牌，然后将等同你体力值的牌以任意顺序置于牌堆顶。每轮每项限一次。',
            jinyuan:'近援',
            jinyuan_info:'出牌阶段限一次，你可以观看一名角色的手牌，然后你可交给其一张牌，若为其原手牌中没有的花色，其可以立即使用之。',
            zhongjian:'中坚',
            zhongjian1:'中坚',
            zhongjian_info:'<font color=#ff4>主公技</font> 每轮限一次,当一张普通锦囊牌指定目标后,你可以选择同势力一名其他角色的一张手牌,此牌本回合视为【无懈可击】。',

			AkiRosenthal: '亚琦罗森塔尔',
			meiwu: '魅舞',
			meiwu_info: '当你于一回合内首次成为黑色牌的唯一目标时，你可以将目标转移给另一名其他角色，然后若此牌被抵消，你交给其一张牌。',
			huichu: '慧厨',
            huichu_info: '体力值最少的角色回合开始时，你可以展示所有手牌，若均为♥，其回复 1 点体力。若有其它花色，你可以重铸任意张手牌。',
            
            
			HoshimatiSuisei:'星街彗星',
			yemuxingyong: '夜幕星咏',
			yemuxingyong_info: '每轮限一次，一个弃牌阶段结束时，你可将本阶段进入弃牌堆的牌置于武将牌上，称为“咏”。然后其他角色也可将一张黑色牌置于你武将牌上。出牌阶段，你可获得一张“咏”，然后立即将两张手牌当【过河拆桥】或【酒】使用。',
			yong: '咏',
			xinghejianduei:'星河舰队',
            xinghejianduei_info:'<font color=#ccf>觉醒技</font> 一轮开始时，若你的体力值不大于游戏轮数，你减 1 点体力上限并摸等同于存活角色数的手牌，然后你的攻击范围和手牌上限始终增加“咏”的数量。',

			SakuraMiko: '樱巫女',
			haodu: '豪赌',
			haodu_info: '出牌阶段限X次（X为你已损失的体力值且至少为1)，你可以将至少一张手牌交给一名其他角色并声明点数、花色、类型，然后你展示其一张手牌。根据与声明相同的项依次执行对应效果：点数，你与其交换手牌；类型，令其弃置两张牌；花色，你获得其一张牌。			',
        
            MinatoAqua: '湊阿库娅',
			kuali: '夸力满满',
			kuali_info: '出牌/结束阶段，你可以选择任意名手牌数为你整数倍的角色，你弃置等量牌并回复等量体力；或摸体力为你整数倍的角色数的牌，然后失去1点体力。每回合限一次。',
			youyi: '友谊誓约',
			youyi_info: '每轮限一次，其他角色的回合开始时，你可以展示并交给其一张“誓约”牌。本回合内，当其造成伤害时，你可令其将“誓约”牌交给你以防止之。该回合结束时，其可以弃置“誓约”牌令你或其回复1点体力。',
			youyishiyue: '友谊誓约',
			youyishiyue_info: '友谊誓约生效中',
            youyishiyue_rec_info: '弃置“誓约”牌，令你或湊阿库娅回复一点体力。',
            
			UsadaPekora: '兔田佩克拉',
			pekoyu: '嚣张咚鼓',
			pekoyu_info: '回合内，当你的非装备牌生效后，若本回合未因此花色的牌发动此技能，你可以摸一张牌然后弃置一张牌。若你因此弃置了【酒】，你可以令一名角色摸两张牌。',
			hongshaoturou: '自煲自足',
			hongshaoturou_info: '出牌阶段限一次，你可以横置武将牌，令你在回合结束时受到1点火焰伤害。然后本回合内你的【闪】和【桃】视为【酒】，你的坐骑牌视为【铁索连环】。',
			
        },
	};
});
