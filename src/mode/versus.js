'use strict';
game.import('mode',function(lib,game,ui,get,ai,_status){
	return {
		name:'versus',
		init:function(){
			if(get.config('versus_mode')=='jiange'){
				lib.characterPack.mode_versus=lib.jiangeboss;
			}
			else if(get.config('versus_mode')=='siguo'){
				for(var i in lib.characterPack.mode_versus){
					lib.character[i]=lib.characterPack.mode_versus[i];
				}
				lib.cardPack.mode_versus=['zong','xionghuangjiu','tongzhougongji','lizhengshangyou'];
				lib.translate.mode_versus_character_config='四国武将';
			}
			if(!lib.cardPack.mode_versus){
				delete lib.card.zong;
				delete lib.card.xionghuangjiu;
				delete lib.card.tongzhougongji;
				delete lib.card.lizhengshangyou;
			}
		},
		start:function(){
			"step 0"
			if(!_status.connectMode || lib.configOL.versus_mode === '4v4'){
				for(let i in lib.characterPack){
					if(i=='clubs'){
						for(var j in lib.characterPack[i]){
							lib.characterPack[i][j][1] = 'clubs';
						}
					}
					else if(i=='vtuber'){
						for(var j in lib.characterPack[i]){
							lib.characterPack[i][j][1] = 'vtuber';
						}
					}
					else{
						for(var j in lib.characterPack[i]){
							if(['psp','xuefeng','VirtuaReal','HappyEl','asoul','dotlive','Tencent'].includes(lib.characterPack[i][j][1]))	lib.characterPack[i][j][1] = 'vtuber';
							else if(!['holo','nijisanji'].includes(lib.characterPack[i][j][1]))	lib.characterPack[i][j][1] = 'clubs';
						}
					}
				}
			}
			_status.mode=get.config('versus_mode');
			if(_status.connectMode) _status.mode=lib.configOL.versus_mode;
			if(_status.brawl&&_status.brawl.submode){
				_status.mode=_status.brawl.submode;
			}
			if(lib.config.test_game){
				_status.mode='standard';
			}
			"step 1"
			var playback=localStorage.getItem(lib.configprefix+'playback');
			if(playback){
				ui.create.me();
				ui.arena.style.display='none';
				ui.system.style.display='none';
				_status.playback=playback;
				localStorage.removeItem(lib.configprefix+'playback');
				var store=lib.db.transaction(['video'],'readwrite').objectStore('video');
				store.get(parseInt(playback)).onsuccess=function(e){
					if(e.target.result){
						game.playVideoContent(e.target.result.video);
					}
					else{
						alert('播放失败：找不到录像');
						game.reload();
					}
				}
				event.finish();
				return;
			}
			if(_status.connectMode){
				game.waitForPlayer(function(){
					switch(lib.configOL.versus_mode){
						case '1v1':lib.configOL.number=2;break;
						case '2v2':lib.configOL.number=4;break;
						case '3v3':lib.configOL.number=6;break;
						case '4v4':case 'guandu':lib.configOL.number=8;break;
					}
				});
			}
			else if(_status.mode=='jiange'||_status.mode=='siguo'||_status.mode=='four'||_status.mode=='guandu'){
				if(_status.mode=='four'&&!get.config('enable_all_cards_four')){
					lib.card.list=lib.cardsFour;
					game.fixedPile=true;
				}
				else if(_status.mode=='siguo'){
					for(var i=0;i<lib.card.list.length;i++){
						switch(lib.card.list[i][2]){
							case 'tao':lib.card.list[i][2]='zong';break;
							case 'jiu':lib.card.list[i][2]='xionghuangjiu';break;
							case 'wuzhong':lib.card.list[i][2]='tongzhougongji';break;
							case 'wugu':case 'taoyuan':lib.card.list[i][2]='lizhengshangyou';break;
						}
					}
				}
				else if(_status.mode=='guandu'){
					for(var i=0;i<lib.card.list.length;i++){
						switch(lib.card.list[i][2]){
							case 'wugu':lib.card.list[i][2]='tunliang';break;
							case 'nanman':lib.card.list[i][2]='lulitongxin';break;
							case 'taoyuan':case 'shandian':lib.card.list[i][2]='yuanjun';break;
							case 'muniu':lib.card.list.splice(i--,1);break;
						}
					}
				}
				game.prepareArena(8);
			}
			else if(_status.mode=='two'){
				game.prepareArena(4);
			}
			else if(_status.mode=='endless'){
				game.prepareArena(2);
			}
			else if(_status.mode=='three'){
				if(lib.character.wenpin) lib.character.wenpin[3]=['zhenwei_three'];
				if(lib.character.zhugejin) lib.character.zhugejin[3]=['hongyuan','huanshi_three','mingzhe'];
				if(lib.character.key_yuzuru){
					lib.character.key_yuzuru[2]=4;
					lib.character.key_yuzuru[3]=['yuzuru_bujin'];
				}
				if(lib.character.guanyu) lib.character.guanyu[3]=['wusheng','zhongyi'];
				if(lib.character.lvbu) lib.character.lvbu[3]=['wushuang','zhanshen'];
				if(lib.character.xiahoudun) lib.character.xiahoudun[3]=['ganglie_three'];
				if(!get.config('enable_all_cards')){
					lib.translate.wuzhong_info+='若对方存活角色多于己方，则额外摸一张牌';
					lib.translate.zhuge_info='锁定技 出牌阶段，你使用杀的次数上限+3';
					lib.card.list=lib.cardsThree;
					game.fixedPile=true;
				}
				else if(Array.isArray(lib.config.forbidthreecard)){
					for(var i=0;i<lib.card.list.length;i++){
						if(lib.config.forbidthreecard.contains(lib.card.list[i][2])){
							lib.card.list.splice(i--,1);
						}
					}
				}
				ui.create.cardsAsync();
				game.finishCards();
			}
			else{
				if(lib.storage.choice==undefined) game.save('choice',20);
				if(lib.storage.zhu==undefined) game.save('zhu',true);
				if(lib.storage.noreplace_end==undefined) game.save('noreplace_end',true);
				if(get.config('first_less')==undefined) game.saveConfig('first_less',true,true);
				if(lib.storage.autoreplaceinnerhtml==undefined) game.save('autoreplaceinnerhtml',true);
				if(lib.storage.single_control==undefined) game.save('single_control',true);
				if(lib.storage.number==undefined) game.save('number',3);
				if(lib.storage.versus_reward==undefined) game.save('versus_reward',3);
				if(lib.storage.versus_punish==undefined) game.save('versus_punish','弃牌');
				if(lib.storage.replace_number==undefined) game.save('replace_number',3);

				switch(lib.storage.seat_order){
					case '交叉':lib.storage.cross_seat=true;lib.storage.random_seat=false;break;
					case '随机':lib.storage.cross_seat=false;lib.storage.random_seat=true;break;
					default:lib.storage.cross_seat=false;lib.storage.random_seat=false;
				}
				game.save('only_zhu',true);
				ui.wuxie.hide();
				ui.create.cardsAsync();
				game.finishCards();
			}
			// game.delay();
			"step 2"
			if(!_status.connectMode&&_status.brawl&&_status.brawl.chooseCharacterBefore){
				_status.brawl.chooseCharacterBefore();
			}
			if(_status.connectMode){
				if(_status.mode=='guandu'){
					for(var i=0;i<lib.card.list.length;i++){
						switch(lib.card.list[i][2]){
							case 'wugu':lib.card.list[i][2]='tunliang';break;
							case 'nanman':lib.card.list[i][2]='lulitongxin';break;
							case 'taoyuan':case 'shandian':lib.card.list[i][2]='yuanjun';break;
							case 'muniu':lib.card.list.splice(i--,1);break;
						}
					}
				}
				if(lib.configOL.versus_mode=='1v1'){
					game.randomMapOL('hidden');
				}
				else{
					game.randomMapOL();
				}
			}
			else if(_status.mode=='guandu'){
				var list=[
					['zhu','ezhu','ezhong','zhong','ezhong','zhong','zhong','ezhong'],
					['zhu','ezhong','zhong','ezhu','ezhong','zhong','ezhong','zhong'],
					['zhu','ezhong','zhong','ezhong','zhong','ezhong','zhong','ezhu'],
					['zhu','ezhu','zhong','ezhong','zhong','ezhong','zhong','ezhong'],
					['zhu','ezhong','zhong','ezhong','zhong','ezhu','zhong','ezhong'],
				].randomGet();
				
				var side=true;
				var num=Math.floor(Math.random()*8);
				list=list.splice(8-num).concat(list);
				_status.firstAct=game.players[num];
				for(var i=0;i<8;i++){
					if(list[i][0]=='e'){
						game.players[i].side=side;
						game.players[i].identity=list[i].slice(1);
					}
					else{
						game.players[i].side=!side;
						game.players[i].identity=list[i];
					}
					if(game.players[i].identity=='zhu'){
						game[game.players[i].side+'Zhu']=game.players[i];
						game.players[i].isZhu=true;
					}
					game.players[i].setIdentity(game.players[i].identity);
					game.players[i].node.identity.dataset.color=get.translation(game.players[i].side+'Color');
					game.players[i].getId();
				}
				game.chooseCharacterGuandu();
			}
			else if(_status.mode=='four'){
				console.log('ok2');
				_status.fouralign=[0,1,2,3,4];
				var list=[
					['zhong','ezhong','ezhong','zhong','zhong','ezhong','ezhong','zhong'],
					['zhong','ezhong','zhong','ezhong','ezhong','zhong','ezhong','zhong'],
					['zhong','ezhong','ezhong','zhong','ezhong','zhong','zhong','ezhong'],
					['zhong','ezhong','zhong','ezhong','zhong','ezhong','zhong','ezhong'],
					['zhong','ezhong','ezhong','zhong','ezhong','zhong','ezhong','zhong'],
				][_status.fouralign.randomRemove()];
				var rand1=Math.floor(Math.random()*4);
				var rand2=Math.floor(Math.random()*4);
				for(var i=0;i<list.length;i++){
					if(list[i]=='zhong'){
						if(rand1==0){
							list[i]='zhu';
						}
						rand1--;
					}
					else{
						if(rand2==0){
							list[i]='ezhu';
						}
						rand2--;
					}
				}

				for(var i in lib.skill){
					if(lib.skill[i].changeSeat){
						lib.skill[i]={};
						if(lib.translate[i+'_info']){
							lib.translate[i+'_info']='此模式下不可用';
						}
					}
				}

				var side=Math.random()<0.5;
				var num=Math.floor(Math.random()*8);
				list=list.splice(8-num).concat(list);
				_status.firstAct=game.players[num];
				for(var i=0;i<8;i++){
					if(list[i][0]=='e'){
						game.players[i].side=side;
						game.players[i].identity=list[i].slice(1);
					}
					else{
						game.players[i].side=!side;
						game.players[i].identity=list[i];
					}
					if(game.players[i].identity=='zhu'){
						game[game.players[i].side+'Zhu']=game.players[i];
						game.players[i].isZhu=true;
					}
					game.players[i].setIdentity(game.players[i].identity);
					game.players[i].node.identity.dataset.color=get.translation(game.players[i].side+'Color');
					game.players[i].getId();
				}
				game.chooseCharacterFour();
			}
			else if(_status.mode=='two'){
				for(var i=0;i<game.players.length;i++){
					game.players[i].getId();
				}
				game.chooseCharacterTwo();
			}
			else if(_status.mode=='endless'){
				game.chooseCharacterEndless();
			}
			else if(_status.mode=='siguo'){
				var list=['holo','holo','nijisanji','nijisanji','vtuber','vtuber','clubs','clubs'].randomSort();
				for(var i=0;i<game.players.length;i++){
					game.players[i].side=list[i];
					game.players[i].identity=list[i];
					game.players[i].setIdentity(list[i]);
					game.players[i].node.identity.style.display='none';
					game.players[i].getId();
					game.players[i].node.action.innerHTML='获即<br>胜将';
					game.players[i].node.action.style.letterSpacing='0px';
					game.players[i].node.action.style.lineHeight='22px';
					game.players[i].node.action.style.top='3px';
					game.players[i].node.action.style.right='3px';
				}
				game.chooseCharacterSiguo();
			}
			else if(_status.mode=='jiange'){
				var list=['nijisanjimech','nijisanji','nijisanjiboss','nijisanji','holo','holoboss','holo','holomech'];
				var pos=Math.floor(Math.random()*8);
				for(var i=0;i<8;i++){
					var j=pos+i;
					if(j>=8){
						j-=8;
					}
					if(list[i][0]=='h'){
						game.players[j].side=true;
						game.players[j].setIdentity('holo');
						game.players[j].identity='holo';
					}
					else{
						game.players[j].side=false;
						game.players[j].setIdentity('nijisanji');
						game.players[j].identity='nijisanji';
					}
					if(list[i].indexOf('mech')!=-1){
						game.players[j].type='mech';
					}
					else if(list[i].indexOf('boss')!=-1){
						game.players[j].type='boss';
					}
					else{
						game.players[j].type='human';
					}
					game.players[i].getId();
				}
				game.chooseCharacterJiange();
			}
			else if(_status.mode=='three'){
				game.chooseCharacterThree();
			}
			else{
				game.chooseCharacter();
			}
			"step 3"
			var players=get.players(lib.sort.position);
			var info=[];
			for(var i=0;i<players.length;i++){
				info.push({
					name:players[i].name1,
					name2:players[i].name2,
					identity:players[i].node.identity.firstChild.innerHTML,
					color:players[i].node.identity.dataset.color
				});
			}
			_status.videoInited=true;
			if(_status.mode=='four'||_status.mode=='jiange'||_status.connectMode||
				_status.mode=='two'||_status.mode=='siguo'||_status.mode=='endless'){
				info.push(false);
			}
			else if(_status.mode=='three'){
				info.push(true);
			}
			else{
				info.push(lib.storage.single_control&&game.players.length>=4);
			}
			game.addVideo('init',null,info);
			event.trigger('gameStart');
			if(_status.connectMode){
				if(_status.mode=='1v1'){
					_status.first_less=true;
					game.gameDraw(_status.firstChoose.next);
					game.phaseLoop(_status.firstChoose.next);
				}
				else if(_status.mode=='2v2'||_status.mode=='3v3'){
					_status.first_less=true;
					var firstChoose=(_status.firstAct||game.players.randomGet());
					if(firstChoose.next.side==firstChoose.side){
						firstChoose=firstChoose.next;
					}
					game.gameDraw(firstChoose,function(player){
						if(lib.configOL.replace_handcard&&player==firstChoose.previousSeat){
							return 5;
						}
						return 4;
					});
					game.phaseLoop(firstChoose);
				}
				else if(_status.mode=='guandu'){
					game.gameDraw(_status.firstAct);
					game.phaseLoop(_status.firstAct);
				}
				else if(_status.mode=='4v4'){
					game.gameDraw(_status.firstAct,function(player){
						if(player==_status.firstAct.previousSeat){
							return 5;
						}
						return 4;
					});
					game.replaceHandcards(_status.firstAct.previous,_status.firstAct.previous.previous);
					game.phaseLoop(_status.firstAct);
				}
				event.finish();
			}
			else{
				if(_status.mode=='guandu'){
					game.gameDraw(_status.firstAct,4);
					game.phaseLoop(_status.firstAct);
				}
				else if(_status.mode=='two'){
					_status.first_less=true;
					_status.first_less_forced=true;
					var firstChoose=_status.firstAct;
					game.gameDraw(firstChoose,function(player){
						if(player==_status.firstAct.previousSeat&&get.config('replace_handcard_two')){
							return 5;
						}
						return 4;
					});
					game.phaseLoop(firstChoose);
				}
				else if(_status.mode=='endless'){
					_status.first_less=true;
					_status.first_less_forced=true;
					var firstChoose=_status.firstAct;
					game.gameDraw(firstChoose);
					game.phaseLoop(firstChoose);
				}
				else if(_status.mode=='four'){
					game.gameDraw(_status.firstAct,function(player){
						if(player==_status.firstAct.previousSeat){
							return 5;
						}
						return 4;
					});
					if(game.me==_status.firstAct.previous||game.me==_status.firstAct.previous.previous){
						game.me.chooseBool('是否置换手牌？');
						event.replaceCard=true;
					}
				}
				else if(_status.mode=='siguo'){
					_status.siguoai=[
						[-7.5,-2,0,-4.5,-6,-7.5],
						[-7.5,-2,0,-4.5,-6,-7.5],
						[-6,-6,-1,-4.5,-6,-7.5],
						[-6,-3,0,-3,-3,-6],
						[-6,-3,0,-3,-3,-6],
						[-6,-6,-6,-6,-6,-6],
					].randomGet();
					var firstChoose=_status.firstAct;
					game.gameDraw(firstChoose);
					game.phaseLoop(firstChoose);
				}
				else if(_status.mode=='jiange'){
					var firstAct;
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].type=='mech'&&game.players[i].group=='holo'){
							firstAct=game.players[i];break;
						}
					}
					_status.actlist=[
						firstAct,
						firstAct.next,
						firstAct.previous,
						firstAct.next.next,
						firstAct.previous.previous,
						firstAct.next.next.next,
						firstAct.previous.previous.previous,
						firstAct.next.next.next.next
					];
					game.gameDraw(firstAct);
					game.phaseLoopJiange();
				}
				else if(_status.mode=='three'){
					var firstAct;
					if(_status.color){
						firstAct=game.enemyZhu;
					}
					else{
						firstAct=game.friendZhu;
					}
					game.gameDraw(firstAct,4);
					game.addGlobalSkill('autoswap');
					if(lib.config.show_handcardbutton){
						ui.versushs=ui.create.system('手牌',null,true);
						lib.setPopped(ui.versushs,game.versusHoverHandcards,220);
					}
					game.phaseLoopThree(firstAct);
				}
				else{
					var firstAct;
					if(lib.storage.zhu){
						_status.currentSide=true;
						firstAct=(_status.currentSide==game.me.side)?game.friendZhu:game.enemyZhu;
					}
					else{
						if(!lib.storage.cross_seat&&!lib.storage.random_seat&&lib.storage.number>1){
							for(var i=0;i<game.players.length-1;i++){
								if(game.players[i].side!=game.players[i+1].side){
									var actcount;
									if(Math.random()<0.5){
										actcount=i;
									}
									else{
										if(i>=lib.storage.number){
											actcount=i-lib.storage.number;
										}
										else{
											actcount=i+lib.storage.number;
										}
									}
									if(actcount>0){
										actcount--;
									}
									else{
										actcount=game.players.length-1;
									}
									firstAct=game.players[actcount];
									break;
								}
							}
						}
						else{
							firstAct=game.players[Math.floor(Math.random()*game.players.length)];
						}
					}
					game.gameDraw(firstAct,4);
					_status.first_less=true;
					_status.round=0;
					if(lib.storage.single_control){
						game.addGlobalSkill('autoswap');
						if(game.players.length>2&&lib.config.show_handcardbutton){
							ui.versushs=ui.create.system('手牌',null,true);
							lib.setPopped(ui.versushs,game.versusHoverHandcards,220);
						}
					}
					_status.enemyCount=ui.create.system('杀敌: '+get.cnNumber(0,true),null,true);
					_status.friendCount=ui.create.system('阵亡: '+get.cnNumber(0,true),null,true);

					lib.setPopped(_status.friendCount,game.versusHoverFriend);
					lib.setPopped(_status.enemyCount,game.versusHoverEnemy);

					if(lib.storage.zhu){
						game.versusPhaseLoop(firstAct);
					}
					else{
						game.versusPhaseLoop(firstAct);
					}
				}
				if(_status.mode!='four'){
					event.finish();
				}
			}
			"step 4"
			if(event.replaceCard&&result.bool){
				var hs=game.me.getCards('h');
				for(var i=0;i<hs.length;i++){
					hs[i].discard(false);
				}
				game.me.directgain(get.cards(hs.length));
			}
			if(_status.ladder){
				lib.storage.ladder.current-=40;
				_status.ladder_tmp=true;
				game.save('ladder',lib.storage.ladder);
				game.addGlobalSkill('versus_ladder');
			}
			game.phaseLoop(_status.firstAct);
		},
		game:{
			getLadderName:function(score){
				if(score<900) return '平民';
				if(score<1000) return '卫士五';
				if(score<1100) return '卫士四';
				if(score<1200) return '卫士三';
				if(score<1300) return '卫士二';
				if(score<1400) return '卫士一';
				if(score<1500) return '校尉三';
				if(score<1600) return '校尉二';
				if(score<1700) return '校尉一';
				if(score<1800) return '中郎将三';
				if(score<1900) return '中郎将二';
				if(score<2000) return '中郎将一';
				if(score<2100) return '大将五';
				if(score<2200) return '大将四';
				if(score<2300) return '大将三';
				if(score<2400) return '大将二';
				if(score<2500) return '大将一';
				return '枭雄';
			},
			checkOnlineResult:function(player){
				if(_status.mode=='4v4'||_status.mode=='guandu'){
					var zhu=game.findPlayer(function(current){
						return current.identity=='zhu';
					});
					return player.side==zhu.side;
				}
				return game.players[0].side==player.side;
			},
			getRoomInfo:function(uiintro){
				if(lib.configOL.versus_mode=='1v1'){
					uiintro.add('<div class="text chat">侯选人数：'+lib.configOL.choice_num+'人');
					uiintro.add('<div class="text chat">替补人数：'+lib.configOL.replace_number+'人');
				}
				else if(lib.configOL.versus_mode=='2v2'||lib.configOL.versus_mode=='3v3'){
					uiintro.add('<div class="text chat">四号位换牌：'+(lib.configOL.replace_handcard?'开启':'关闭'));
				}
				var last=uiintro.add('<div class="text chat">出牌时限：'+lib.configOL.choose_timeout+'秒');
				// uiintro.add('<div class="text chat">屏蔽弱将：'+(lib.configOL.ban_weak?'开启':'关闭'));
				// var last=uiintro.add('<div class="text chat">屏蔽强将：'+(lib.configOL.ban_strong?'开启':'关闭'));
				if(lib.configOL.banned.length){
					last=uiintro.add('<div class="text chat">禁用武将：'+get.translation(lib.configOL.banned));
				}
				if(lib.configOL.bannedcards.length){
					last=uiintro.add('<div class="text chat">禁用卡牌：'+get.translation(lib.configOL.bannedcards));
				}
				last.style.paddingBottom='8px';
			},
			getVideoName:function(){
				if(_status.mode=='three'){
					var zhu=game.findPlayer2(function(current){
						return current.side==game.me.side&&current.identity=='zhu';
					});
					var str=(game.me.side?'暖/':'冷/')+get.translation(zhu.previousSeat.name1)+'/'+get.translation(zhu.name1)+'/'+get.translation(zhu.nextSeat.name1);
					return ['统率三军',str]
				}
				var str=get.translation(game.me.name1);
				if(game.me.name2){
					str+='/'+get.translation(game.me.name2);
				}
				var str2;
				if(game.versusVideoName) str2=game.versusVideoName;
				else{
 				switch(_status.mode){
 					case 'two':str2='欢乐成双';break;
 					case 'endless':str2='无尽模式';break;
 					case 'three':str2='统率三军';break;
 					case 'siguo':str2='同舟共济';break;
 					case 'jiange':str2='虹杏战场';break;
 					case 'four':str2='对决 - 4v4';break;
 					case 'guandu':str2='官渡之战';break;
 					default:str2='对决 - '+lib.storage.number+'v'+lib.storage.number
 				}
				}
				return [str,str2];
			},
			addRecord:function(bool){
				if(typeof bool=='boolean'){
					var data=lib.config.gameRecord.versus.data;
					var identity=get.cnNumber(lib.storage.number)+'人';
					if(!data[identity]){
						data[identity]=[0,0];
					}
					if(bool){
						data[identity][0]++;
					}
					else{
						data[identity][1]++;
					}
					var list=['一人','两人','三人'];
					var str='';
					for(var i=0;i<list.length;i++){
						if(data[list[i]]){
							str+=list[i]+'：'+data[list[i]][0]+'胜'+' '+data[list[i]][1]+'负<br>';
						}
					}
					lib.config.gameRecord.versus.str=str;
					game.saveConfig('gameRecord',lib.config.gameRecord);
				}
			},
			chooseCharacterJiange:function(){
				var next=game.createEvent('chooseCharacter',false);
				next.showConfig=true;
				next.setContent(function(){
					'step 0'
					ui.arena.classList.add('choose-character');
					for(var i in lib.characterPack.mode_versus){
						lib.character[i]=lib.characterPack.mode_versus[i];
						if(!lib.character[i][4]){
							lib.character[i][4]=[];
						}
					}
					lib.characterIntro.boss_liedixuande=lib.characterIntro.liubei;
					lib.characterIntro.boss_gongshenyueying=lib.characterIntro.huangyueying;
					lib.characterIntro.boss_tianhoukongming=lib.characterIntro.shen_zhugeliang;
					lib.characterIntro.boss_yuhuoshiyuan=lib.characterIntro.pangtong;
					lib.characterIntro.boss_qiaokuijunyi=lib.characterIntro.zhenghe;
					lib.characterIntro.boss_jiarenzidan=lib.characterIntro.caozhen;
					lib.characterIntro.boss_duanyuzhongda=lib.characterIntro.simayi;
					lib.characterIntro.boss_juechenmiaocai=lib.characterIntro.xiahouyuan;
					lib.characterIntro.boss_kumuyuanrang=lib.characterIntro.xiahoudun;
					lib.characterIntro.boss_baijiwenyuan=lib.characterIntro.zhangliao;
					lib.characterIntro.boss_yihanyunchang=lib.characterIntro.guanyu;
					lib.characterIntro.boss_fuweizilong=lib.characterIntro.zhaoyun;
					'step 1'
					for(var i in lib.skill){
						if(lib.skill[i].changeSeat){
							lib.skill[i]={};
							if(lib.translate[i+'_info']){
								lib.translate[i+'_info']='此模式下不可用';
							}
						}
					}
					var list={
						hololist:[],nijisanjilist:[],
						holomech:[],nijisanjimech:[],
						holoboss:[],nijisanjiboss:[],
					}
					event.list=list;
					if(lib.characterPack.boss){
						for(var i in lib.characterPack.boss){
							if(!lib.character[i]&&lib.characterPack.boss[i][4]){
								if(lib.characterPack.boss[i][4].contains('jiangeboss')||
								lib.characterPack.boss[i][4].contains('jiangemech')){
									lib.character[i]=lib.characterPack.boss[i];
								}
							}
						}
					}
					for(var i in lib.character){
						if(lib.character[i][4]){
							if(lib.character[i][4].contains('jiangeboss')){
								list[lib.character[i][1]+'boss'].push(i);continue;
							}
							else if(lib.character[i][4].contains('jiangemech')){
								list[lib.character[i][1]+'mech'].push(i);continue;
							}
						}
						if(lib.filter.characterDisabled(i)) continue;
						if(lib.character[i][1]=='holo'){
							list.hololist.push(i);
						}
						else if(lib.character[i][1]=='nijisanji'){
							list.nijisanjilist.push(i);
						}
					}
					var dialog;
					switch(game.me.type){
						case 'human':
							for(var i=0;i<game.players.length;i++){
								if(game.players[i].type!='human'){
									game.players[i].init(list[game.players[i].identity+game.players[i].type].randomRemove());
								}
							}
							dialog=ui.create.dialog('选择角色',[list[game.me.identity+'list'].randomGets(8),'character']);
							ui.create.cheat=function(){
								_status.createControl=ui.cheat2;
								ui.cheat=ui.create.control('更换',function(){
									if(ui.cheat2&&ui.cheat2.dialog==_status.event.dialog){
										return;
									}
									if(game.changeCoin){
										game.changeCoin(-3);
									}
									var buttons=ui.create.div('.buttons');
									var node=_status.event.dialog.buttons[0].parentNode;
									_status.event.dialog.buttons=ui.create.buttons(list[game.me.identity+'list'].randomGets(8),'character',buttons);
									_status.event.dialog.content.insertBefore(buttons,node);
									buttons.animate('start');
									node.remove();
									game.uncheck();
									game.check();
								});
								delete _status.createControl;
							}
							var createCharacterDialog=function(){
								event.dialogxx=ui.create.characterDialog('heightset',function(name){
									if(lib.character[name][4]){
										if(lib.character[name][4].contains('jiangeboss')) return true;
										if(lib.character[name][4].contains('jiangemech')) return true;
									}
									if(lib.character[name][1]!=game.me.identity) return true;
								});
								if(ui.cheat2){
									ui.cheat2.animate('controlpressdownx',500);
									ui.cheat2.classList.remove('disabled');
								}
							};
							if(lib.onfree){
								lib.onfree.push(createCharacterDialog);
							}
							else{
								createCharacterDialog();
							}
							ui.create.cheat2=function(){
								ui.cheat2=ui.create.control('自由选将',function(){
									if(this.dialog==_status.event.dialog){
										if(game.changeCoin){
											game.changeCoin(50);
										}
										this.dialog.close();
										_status.event.dialog=this.backup;
										this.backup.open();
										delete this.backup;
										game.uncheck();
										game.check();
										if(ui.cheat){
											ui.cheat.animate('controlpressdownx',500);
											ui.cheat.classList.remove('disabled');
										}
									}
									else{
										if(game.changeCoin){
											game.changeCoin(-10);
										}
										this.backup=_status.event.dialog;
										_status.event.dialog.close();
										_status.event.dialog=_status.event.parent.dialogxx;
										this.dialog=_status.event.dialog;
										this.dialog.open();
										game.uncheck();
										game.check();
										if(ui.cheat){
											ui.cheat.classList.add('disabled');
										}
									}
								});
								if(lib.onfree){
									ui.cheat2.classList.add('disabled');
								}
							}
							if(!_status.brawl||!_status.brawl.chooseCharacterFixed){
								if(!ui.cheat&&get.config('change_choice')) ui.create.cheat();
								if(!ui.cheat2&&get.config('free_choose')) ui.create.cheat2();
							}
							break;
						case 'mech':
							dialog=ui.create.dialog('选择角色',[list[game.me.identity+'mech'],'character']);
							break;
						case 'boss':
							for(var i=0;i<game.players.length;i++){
								if(game.players[i].type=='mech'){
									game.players[i].init(list[game.players[i].identity+game.players[i].type].randomRemove());
								}
							}
							dialog=ui.create.dialog('选择角色',[list[game.me.identity+'boss'],'character']);
							break;
					}
					game.me.chooseButton(dialog,true).set('onfree',true).selectButton=function(){
						if(get.config('double_character_jiange')) return [2,2];
						return [1,1];
					};
					'step 2'
					if(ui.cheat){
						ui.cheat.close();
						delete ui.cheat;
					}
					if(ui.cheat2){
						ui.cheat2.close();
						delete ui.cheat2;
					}
					var double=(result.links.length==2);
					game.me.init(result.links[0],result.links[1]);
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].name1) continue;
						if(game.players[i].type!='human'){
							game.players[i].init(event.list[game.players[i].identity+game.players[i].type].randomRemove());
						}
						else{
							if(double){
								game.players[i].init(event.list[game.players[i].identity+'list'].randomRemove(),event.list[game.players[i].identity+'list'].randomRemove());
							}
							else{
								game.players[i].init(event.list[game.players[i].identity+'list'].randomRemove());
							}
						}
					}
					game.addRecentCharacter(game.me.name,game.me.name2);
					setTimeout(function(){
						ui.arena.classList.remove('choose-character');
					},500);
				});
			},
			chooseCharacterSiguo:function(){
				var next=game.createEvent('chooseCharacter',false);
				next.showConfig=true;
				next.setContent(function(){
					'step 0'
					_status.firstAct=game.players.randomGet();
					for(var i=0;i<game.players.length;i++){
						game.players[i].node.name.innerHTML=get.verticalStr(get.cnNumber(get.distance(_status.firstAct,game.players[i],'absolute')+1,true)+'号位');
					}
					ui.arena.classList.add('choose-character');
					'step 1'
					var list={
						holo:[],nijisanji:[],vtuber:[],clubs:[]
					}
					event.list=list;
					for(var i in lib.character){
						if(lib.filter.characterDisabled(i)) continue;
						if(get.config('siguo_character')=='off'&&lib.characterPack.mode_versus[i]) continue;
						if(list[lib.character[i][1]]){
							list[lib.character[i][1]].push(i);
						}
					}
					var duallist=[];
					if(get.config('siguo_character')=='increase'){
						for(var i in lib.characterPack.mode_versus){
							if(lib.characterPack.mode_versus[i][1]==game.me.identity){
								duallist.push(i);
							}
						}
					}
					if(duallist.length&&Math.random()<0.5){
						event.friendChoice=duallist.randomGet();
						list[game.me.identity].remove(event.friendChoice);
						duallist.length=0;
					}
					else{
						event.friendChoice=list[game.me.identity].randomRemove();
					}
					var myChoice=list[game.me.identity].randomGets(7);
					if(duallist.length){
						var myChoiceName=duallist.randomGet();
						if(list[game.me.identity].contains(myChoiceName)&&!myChoice.contains(myChoiceName)){
							myChoice.randomRemove();
							myChoice.push(myChoiceName);
						}
					}
					var dialog=ui.create.dialog('选择角色',[myChoice.concat([event.friendChoice]),'character']);
					dialog.buttons[7].node.name.innerHTML=get.verticalStr('队友选择');

					var addSetting=function(dialog){
						dialog.add('选择座位').classList.add('add-setting');
						var seats=document.createElement('table');
						seats.classList.add('add-setting');
						seats.style.margin='0';
						seats.style.width='100%';
						seats.style.position='relative';
						for(var i=1;i<=game.players.length;i++){
							var td=ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
							td.innerHTML=get.cnNumber(i,true);
							td.link=i-1;
							seats.appendChild(td);
							if(get.distance(_status.firstAct,game.me,'absolute')===i-1){
								td.classList.add('bluebg');
							}
							td.addEventListener(lib.config.touchscreen?'touchend':'click',function(){
								if(_status.dragged) return;
								if(_status.justdragged) return;
								if(get.distance(_status.firstAct,game.me,'absolute')==this.link) return;
								var current=this.parentNode.querySelector('.bluebg');
								if(current){
									current.classList.remove('bluebg');
								}
								this.classList.add('bluebg');
								_status.firstAct=game.me;
								for(var i=0;i<this.link;i++){
									_status.firstAct=_status.firstAct.previous;
								}
								for(var i=0;i<game.players.length;i++){
									game.players[i].node.name.innerHTML=get.verticalStr(get.cnNumber(get.distance(_status.firstAct,game.players[i],'absolute')+1,true)+'号位');
								}
							});
						}
						dialog.content.appendChild(seats);
						if(game.me==game.zhu){
							seats.previousSibling.style.display='none';
							seats.style.display='none';
						}

						dialog.add(ui.create.div('.placeholder.add-setting'));
						dialog.add(ui.create.div('.placeholder.add-setting'));
						if(get.is.phoneLayout()) dialog.add(ui.create.div('.placeholder.add-setting'));
					};
					var removeSetting=function(){
						var dialog=_status.event.dialog;
						if(dialog){
							dialog.style.height='';
							delete dialog._scrollset;
							var list=Array.from(dialog.querySelectorAll('.add-setting'));
							while(list.length){
								list.shift().remove();
							}
							ui.update();
						}
					};
					event.addSetting=addSetting;
					event.removeSetting=removeSetting;

					if(get.config('change_identity')){
						addSetting(dialog);
					}

					ui.create.cheat=function(){
						_status.createControl=ui.cheat2;
						ui.cheat=ui.create.control('更换',function(){
							if(ui.cheat2&&ui.cheat2.dialog==_status.event.dialog){
								return;
							}
							if(game.changeCoin){
								game.changeCoin(-3);
							}
							var buttons=ui.create.div('.buttons');
							var node=_status.event.dialog.buttons[0].parentNode;
							list[game.me.identity].add(event.friendChoice);
							event.friendChoice=list[game.me.identity].randomRemove();
							_status.event.dialog.buttons=ui.create.buttons(list[game.me.identity].randomGets(7).concat([event.friendChoice]),'character',buttons);
							_status.event.dialog.buttons[7].node.name.innerHTML=get.verticalStr('队友选择');
							_status.event.dialog.content.insertBefore(buttons,node);
							buttons.animate('start');
							node.remove();
							game.uncheck();
							game.check();
						});
						delete _status.createControl;
					}
					var createCharacterDialog=function(){
						event.dialogxx=ui.create.characterDialog('heightset',function(name){
							// if(name==event.friendChoice) return true;
							if(lib.character[name][1]!=game.me.identity) return true;
						});
						if(ui.cheat2){
							ui.cheat2.animate('controlpressdownx',500);
							ui.cheat2.classList.remove('disabled');
						}
					};
					if(lib.onfree){
						lib.onfree.push(createCharacterDialog);
					}
					else{
						createCharacterDialog();
					}
					ui.create.cheat2=function(){
						ui.cheat2=ui.create.control('自由选将',function(){
							if(this.dialog==_status.event.dialog){
								if(game.changeCoin){
									game.changeCoin(50);
								}
								this.dialog.close();
								_status.event.dialog=this.backup;
								this.backup.open();
								delete this.backup;
								game.uncheck();
								game.check();
								if(ui.cheat){
									ui.cheat.animate('controlpressdownx',500);
									ui.cheat.classList.remove('disabled');
								}
							}
							else{
								if(game.changeCoin){
									game.changeCoin(-10);
								}
								this.backup=_status.event.dialog;
								_status.event.dialog.close();
								_status.event.dialog=_status.event.parent.dialogxx;
								this.dialog=_status.event.dialog;
								this.dialog.open();
								game.uncheck();
								game.check();
								if(ui.cheat){
									ui.cheat.classList.add('disabled');
								}
							}
						});
						if(lib.onfree){
							ui.cheat2.classList.add('disabled');
						}
					}
					game.me.chooseButton(dialog,true).set('onfree',true).set('filterButton',function(button){
						if(button.link==_status.event.friendChoice) return false;
						return true;
					}).set('friendChoice',event.friendChoice);
					if(!ui.cheat&&get.config('change_choice')){
						ui.create.cheat();
					}
					if(!ui.cheat2&&get.config('free_choose')){
						ui.create.cheat2();
					}
					'step 2'
					if(ui.cheat){
						ui.cheat.close();
						delete ui.cheat;
					}
					if(ui.cheat2){
						ui.cheat2.close();
						delete ui.cheat2;
					}
					game.me.init(result.links[0]);
					event.list[game.me.side].remove(result.links[0]);
					var added={holo:0,nijisanji:0,vtuber:0,clubs:0};
					var dualside={holo:[],nijisanji:[],vtuber:[],clubs:[]};
					if(get.config('siguo_character')=='increase'){
						for(var i in lib.characterPack.mode_versus){
							if(Math.random()<0.5){
								dualside[lib.characterPack.mode_versus[i][1]].push(i);
							}
						}
					}
					for(var i=0;i<game.players.length;i++){
						game.players[i].node.identity.style.display='';
						if(game.players[i]!=game.me){
							if(game.players[i].identity==game.me.identity){
								game.players[i].init(event.friendChoice);
							}
							else{
								if(dualside[game.players[i].side]&&dualside[game.players[i].side].length){
									var enemyChoice=dualside[game.players[i].side];
									if(enemyChoice._skipped||Math.random()<0.5){
										var enemyChoiceName=enemyChoice.randomRemove();
										if(event.list[game.players[i].side].contains(enemyChoiceName)){
											game.players[i].init(enemyChoiceName);
											event.list[game.players[i].side].remove(enemyChoiceName);
										}
									}
									else{
										enemyChoice._skipped=true;
									}
								}
								if(!game.players[i].name1) game.players[i].init(event.list[game.players[i].side].randomRemove());
							}
						}
						game.players[i].addSkill('longchuanzhibao');
						if(added[game.players[i].side]==0){
							if(Math.random()<0.5){
								game.players[i].gainZhibao();
								added[game.players[i].side]=1;
							}
							else{
								added[game.players[i].side]=-1;
							}
						}
						else if(added[game.players[i].side]<0){
							game.players[i].gainZhibao();
						}
					}
					_status.firstAct.gainZhibao();
					game.addRecentCharacter(game.me.name1);
					setTimeout(function(){
						ui.arena.classList.remove('choose-character');
					},500);

					ui.longchuanzhibao=ui.create.system('龙船至宝',null,true);
					// ui.longchuanzhibao.style.display='none';
					lib.setPopped(ui.longchuanzhibao,function(){
						var map={holo:0,nijisanji:0,vtuber:0,clubs:0};
						for(var i=0;i<game.players.length;i++){
							var current=game.players[i];
							map[current.side]+=current.$.longchuanzhibao;
						}
						var uiintro=ui.create.dialog('hidden');
						for(var i in map){
							uiintro.addText(get.translation(i)+'势力：'+get.cnNumber(map[i])+'个');
						}
						uiintro.content.lastChild.style.paddingBottom='8px';
						return uiintro;
					},150);
				});
			},
			chooseCharacterTwo:function(){
				var next=game.createEvent('chooseCharacter',false);
				next.showConfig=true;
				next.setContent(function(){
					'step 0'
					ui.arena.classList.add('choose-character');
					for(var i in lib.skill){
						if(lib.skill[i].changeSeat){
							lib.skill[i]={};
							if(lib.translate[i+'_info']){
								lib.translate[i+'_info']='此模式下不可用';
							}
						}
					}
					var bool=Math.random()<0.5;
					var bool2=Math.random()<0.5;
					var ref=game.players[0];

					ref.side=bool;
					ref.next.side=bool2;
					ref.next.next.side=!bool;
					ref.previous.side=!bool2;

					var firstChoose=game.players.randomGet();
					if(firstChoose.next.side==firstChoose.side){
						firstChoose=firstChoose.next;
					}
					_status.firstAct=firstChoose;
					for(var i=0;i<4;i++){
						firstChoose.node.name.innerHTML=get.verticalStr(get.cnNumber(i+1,true)+'号位');
						firstChoose=firstChoose.next;
					}

					for(var i=0;i<game.players.length;i++){
						if(game.players[i].side==game.me.side){
							game.players[i].node.identity.firstChild.innerHTML='友';
						}
						else{
							game.players[i].node.identity.firstChild.innerHTML='敌';
						}
						game.players[i].node.identity.dataset.color=game.players[i].side+'zhu';
					}
					//22选将框分配
					var list=[];
					var list4=[];
					for(i in lib.characterReplace){
						var ix=lib.characterReplace[i];
						for(var j=0;j<ix.length;j++){
							if(lib.filter.characterDisabled(ix[j])) ix.splice(j--,1);
						}
						if(ix.length){
							list.push(i);
							list4.addArray(ix);
						}
					}
					for(i in lib.character){
						if(!list4.contains(i)&&!lib.filter.characterDisabled(i)){
							list.push(i);
							list4.push(i);
						}
					}
					var choose=[];
					event.list=list;
					_status.characterlist=list4;

					var addSetting=function(dialog){
						dialog.add('选择座位').classList.add('add-setting');
						var seats=document.createElement('table');
						seats.classList.add('add-setting');
						seats.style.margin='0';
						seats.style.width='100%';
						seats.style.position='relative';
						for(var i=1;i<=game.players.length;i++){
							var td=ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
							td.innerHTML=get.cnNumber(i,true);
							td.link=i-1;
							seats.appendChild(td);
							if(get.distance(_status.firstAct,game.me,'absolute')===i-1){
								td.classList.add('bluebg');
							}
							td.addEventListener(lib.config.touchscreen?'touchend':'click',function(){
								if(_status.dragged) return;
								if(_status.justdragged) return;
								if(get.distance(_status.firstAct,game.me,'absolute')==this.link) return;
								var current=this.parentNode.querySelector('.bluebg');
								if(current){
									current.classList.remove('bluebg');
								}
								this.classList.add('bluebg');
								_status.firstAct=game.me;
								for(var i=0;i<this.link;i++){
									_status.firstAct=_status.firstAct.previous;
								}
								var firstChoose=_status.firstAct;
								firstChoose.next.side=!firstChoose.side;
								firstChoose.next.next.side=!firstChoose.side;
								firstChoose.previous.side=firstChoose.side;
								for(var i=0;i<game.players.length;i++){
									if(game.players[i].side==game.me.side){
										game.players[i].node.identity.firstChild.innerHTML='友';
									}
									else{
										game.players[i].node.identity.firstChild.innerHTML='敌';
									}
									game.players[i].node.identity.dataset.color=game.players[i].side+'zhu';
								}
								for(var i=0;i<4;i++){
									firstChoose.node.name.innerHTML=get.verticalStr(get.cnNumber(i+1,true)+'号位');
									firstChoose=firstChoose.next;
								}
							});
						}
						dialog.content.appendChild(seats);
						if(game.me==game.zhu){
							seats.previousSibling.style.display='none';
							seats.style.display='none';
						}

						dialog.add(ui.create.div('.placeholder.add-setting'));
						dialog.add(ui.create.div('.placeholder.add-setting'));
						if(get.is.phoneLayout()) dialog.add(ui.create.div('.placeholder.add-setting'));
					};
					var removeSetting=function(){
						var dialog=_status.event.dialog;
						if(dialog){
							dialog.style.height='';
							delete dialog._scrollset;
							var list=Array.from(dialog.querySelectorAll('.add-setting'));
							while(list.length){
								list.shift().remove();
							}
							ui.update();
						}
					};
					event.addSetting=addSetting;
					event.removeSetting=removeSetting;

					var characterChoice;
					if(_status.brawl&&_status.brawl.chooseCharacter){
						characterChoice=_status.brawl.chooseCharacter(list,game.me);
					}
					else{
						characterChoice=list.randomGets(7);
					}
					var basenum=1;
					var basestr='选择角色';
					if(get.config('two_assign')){
						basenum=2;
						basestr='选择你和队友的角色';
						event.two_assign=true;
					}
					if(get.config('replace_character_two')){
						basestr+='（含一名替补角色）';
						_status.replacetwo=true;
						game.additionaldead=[];
						basenum*=2;
					}
					var dialog=ui.create.dialog(basestr,[characterChoice,'characterx']);
					game.me.chooseButton(true,dialog,basenum).set('onfree',true);
					if(!_status.brawl||!_status.brawl.noAddSetting){
						if(get.config('change_identity')){
							addSetting(dialog);
						}
					}

					ui.create.cheat=function(){
						_status.createControl=ui.cheat2;
						ui.cheat=ui.create.control('更换',function(){
							if(ui.cheat2&&ui.cheat2.dialog==_status.event.dialog){
								return;
							}
							if(game.changeCoin){
								game.changeCoin(-3);
							}
							var buttons=ui.create.div('.buttons');
							var node=_status.event.dialog.buttons[0].parentNode;
							_status.event.dialog.buttons=ui.create.buttons(list.randomGets(7),'characterx',buttons);
							_status.event.dialog.content.insertBefore(buttons,node);
							buttons.animate('start');
							node.remove();
							game.uncheck();
							game.check();
						});
						delete _status.createControl;
					};
					if(lib.onfree){
						lib.onfree.push(function(){
							event.dialogxx=ui.create.characterDialog('heightset');
							if(ui.cheat2){
								ui.cheat2.animate('controlpressdownx',500);
								ui.cheat2.classList.remove('disabled');
							}
						});
					}
					else{
						event.dialogxx=ui.create.characterDialog('heightset');
					}
					ui.create.cheat2=function(){
						ui.cheat2=ui.create.control('自由选将',function(){
							if(this.dialog==_status.event.dialog){
								if(game.changeCoin){
									game.changeCoin(50);
								}
								this.dialog.close();
								_status.event.dialog=this.backup;
								this.backup.open();
								delete this.backup;
								game.uncheck();
								game.check();
								if(ui.cheat){
									ui.cheat.animate('controlpressdownx',500);
									ui.cheat.classList.remove('disabled');
								}
							}
							else{
								if(game.changeCoin){
									game.changeCoin(-10);
								}
								this.backup=_status.event.dialog;
								_status.event.dialog.close();
								_status.event.dialog=_status.event.parent.dialogxx;
								this.dialog=_status.event.dialog;
								this.dialog.open();
								game.uncheck();
								game.check();
								if(ui.cheat){
									ui.cheat.classList.add('disabled');
								}
							}
						});
						ui.cheat2.classList.add('disabled');
					}
					if(!_status.brawl||!_status.brawl.chooseCharacterFixed){
						if(!ui.cheat&&get.config('change_choice')){
							ui.create.cheat();
						}
						if(!ui.cheat2&&get.config('free_choose')){
							ui.create.cheat2();
						}
					}
					'step 1'
					if(ui.cheat){
						ui.cheat.close();
						delete ui.cheat;
					}
					if(ui.cheat2){
						ui.cheat2.close();
						delete ui.cheat2;
					}
					for(var i=0;i<result.links.length;i++){
						game.addRecentCharacter(result.links[i]);
					}
					game.me.init(result.links[0]);
					if(_status.replacetwo){
						game.me.replacetwo=result.links[1];
					}
					event.list.remove(game.me.name1);
					for(var i=0;i<game.players.length;i++){
						if(game.players[i]!=game.me){
							if(_status.brawl&&_status.brawl.chooseCharacter){
								var list=_status.brawl.chooseCharacter(event.list,game.players[i]);
								game.players[i].init(list.randomGet());
								event.list.remove(game.players[i].name1);
								if(_status.replacetwo){
									game.players[i].replacetwo=list.randomGet(game.players[i].name1);
									event.list.remove(game.players[i].replacetwo);
								}
							}
							else{
								if(event.two_assign&&game.players[i].side==game.me.side){
									if(_status.replacetwo){
										game.players[i].init(result.links[2]);
										game.players[i].replacetwo=result.links[3];
									}
									else{
										game.players[i].init(result.links[1]);
									}
								}
								else{
									var name=event.list.randomRemove();
									if(lib.characterReplace[name]&&lib.characterReplace[name].length) name=lib.characterReplace[name].randomGet();
									game.players[i].init(name);
									if(_status.replacetwo){
										var name2=event.list.randomRemove();
										if(lib.characterReplace[name2]&&lib.characterReplace[name2].length) name2=lib.characterReplace[name2].randomGet();
										game.players[i].replacetwo=name2;
									}
								}
							}
						}
					}
					for(var i=0;i<game.players.length;i++){
						_status.characterlist.remove(game.players[i].name1);
						_status.characterlist.remove(game.players[i].replacetwo);
					}
					setTimeout(function(){
						ui.arena.classList.remove('choose-character');
					},500);

					if(get.config('two_phaseswap')){
						game.addGlobalSkill('autoswap');
						if(lib.config.show_handcardbutton){
							ui.versushs=ui.create.system('手牌',null,true);
							lib.setPopped(ui.versushs,game.versusHoverHandcards,220);
						}
					}
				});
			},
			chooseCharacterEndless:function(){
				var next=game.createEvent('chooseCharacter',false);
				next.showConfig=true;
				next.setContent(function(){
					'step 0'
					ui.arena.classList.add('choose-character');
					for(var i in lib.skill){
						if(lib.skill[i].changeSeat){
							lib.skill[i]={};
							if(lib.translate[i+'_info']){
								lib.translate[i+'_info']='此模式下不可用';
							}
						}
					}

					var firstChoose=game.players.randomGet();
					_status.firstAct=firstChoose;

					firstChoose.side=false;
					firstChoose.next.side=true;

					for(var i=0;i<game.players.length;i++){
						if(game.players[i].side==game.me.side){
							game.players[i].node.identity.firstChild.innerHTML='友';
						}
						else{
							game.players[i].node.identity.firstChild.innerHTML='敌';
						}
						game.players[i].node.identity.dataset.color=game.players[i].side+'zhu';
					}
					var list=[];
					for(i in lib.character){
						if(!lib.filter.characterDisabled(i)){
							list.push(i);
						}
					}
					var choose=[];
					event.list=list;
					_status.endlessListAll=list.slice(0);

					var characterChoice=list.randomGets(6);
					var dialog=ui.create.dialog('选择角色',[characterChoice,'character']);
					game.me.chooseButton(true,dialog).set('onfree',true);

					ui.create.cheat=function(){
						_status.createControl=ui.cheat2;
						ui.cheat=ui.create.control('更换',function(){
							if(ui.cheat2&&ui.cheat2.dialog==_status.event.dialog){
								return;
							}
							if(game.changeCoin){
								game.changeCoin(-3);
							}
							var buttons=ui.create.div('.buttons');
							var node=_status.event.dialog.buttons[0].parentNode;
							_status.event.dialog.buttons=ui.create.buttons(list.randomGets(7),'character',buttons);
							_status.event.dialog.content.insertBefore(buttons,node);
							buttons.animate('start');
							node.remove();
							game.uncheck();
							game.check();
						});
						delete _status.createControl;
					};
					if(lib.onfree){
						lib.onfree.push(function(){
							event.dialogxx=ui.create.characterDialog('heightset');
							if(ui.cheat2){
								ui.cheat2.animate('controlpressdownx',500);
								ui.cheat2.classList.remove('disabled');
							}
						});
					}
					else{
						event.dialogxx=ui.create.characterDialog('heightset');
					}
					ui.create.cheat2=function(){
						ui.cheat2=ui.create.control('自由选将',function(){
							if(this.dialog==_status.event.dialog){
								if(game.changeCoin){
									game.changeCoin(50);
								}
								this.dialog.close();
								_status.event.dialog=this.backup;
								this.backup.open();
								delete this.backup;
								game.uncheck();
								game.check();
								if(ui.cheat){
									ui.cheat.animate('controlpressdownx',500);
									ui.cheat.classList.remove('disabled');
								}
							}
							else{
								if(game.changeCoin){
									game.changeCoin(-10);
								}
								this.backup=_status.event.dialog;
								_status.event.dialog.close();
								_status.event.dialog=_status.event.parent.dialogxx;
								this.dialog=_status.event.dialog;
								this.dialog.open();
								game.uncheck();
								game.check();
								if(ui.cheat){
									ui.cheat.classList.add('disabled');
								}
							}
						});
						ui.cheat2.classList.add('disabled');
					}
					if(!_status.brawl||!_status.brawl.chooseCharacterFixed){
						if(!ui.cheat&&get.config('change_choice')){
							ui.create.cheat();
						}
						if(!ui.cheat2&&get.config('free_choose')){
							ui.create.cheat2();
						}
					}
					'step 1'
					if(ui.cheat){
						ui.cheat.close();
						delete ui.cheat;
					}
					if(ui.cheat2){
						ui.cheat2.close();
						delete ui.cheat2;
					}
					for(var i=0;i<result.links.length;i++){
						game.addRecentCharacter(result.links[i]);
					}
					game.me.init(result.links[0]);
					event.list.remove(game.me.name1);
					for(var i=0;i<game.players.length;i++){
						if(game.players[i]!=game.me){
							game.players[i].init(event.list.randomRemove());
							if(_status.replacetwo){
								game.players[i].replacetwo=event.list.randomRemove();
							}
						}
					}
					_status.endlessList=event.list;
					setTimeout(function(){
						ui.arena.classList.remove('choose-character');
					},500);
				});
			},
			chooseCharacterFour:function(){
				var next=game.createEvent('chooseCharacter',false);
				next.showConfig=true;
				next.ai=function(player,list,list2){
					if(player.identity=='zhu'){
						list2.randomSort();
						var choice;
						if(Math.random()-0.8<0&&list2.length){
							choice=list2[0];
						}
						else{
							choice=list[0];
						}
						player.init(choice);
						player.hp++;
						player.maxHp++;
						player.update();
					}
					else if(Math.random()<0.5){
						var choice=0;
						for(var i=0;i<list.length;i++){
							if(lib.character[list[i]][1]==game[player.side+'Zhu'].group){
								choice=i;break;
							}
						}
						player.init(list[choice]);
					}
					else{
						player.init(list[0]);
					}
					this.list.remove(player.name1);
					this.list2.remove(player.name1);
				}
				next.setContent(function(){
					"step 0"
					ui.arena.classList.add('choose-character');
					var i;
					var list;
					var list2=[];

					event.list=[];
					event.filterChoice=function(name){
						return false;
					}
					for(i in lib.character){
						if(event.filterChoice(i)) continue;
						if(lib.filter.characterDisabled(i)) continue;
						event.list.push(i);
						if(lib.character[i][4]&&lib.character[i][4].contains('zhu')){
							list2.push(i);
						}
					}
					if(_status.brawl&&_status.brawl.chooseCharacterFilter){
						event.list=_status.brawl.chooseCharacterFilter(event.list);
					}
					event.list.randomSort();
					event.list2=list2;
					event.four_assign=get.config('four_assign');
					if(!event.four_assign){
						event.current=_status.firstAct;
					}
					else{
						event.current=_status.firstAct.next;
					}
					event.flipassign=true;
					if(_status.firstAct.side){
						for(var i=0;i<game.players.length;i++){
							game.players[i].side=!game.players[i].side;
							game.players[i].node.identity.dataset.color=get.translation(game.players[i].side+'Color');
						}
					}
					for(var i=0;i<game.players.length;i++){
						if(!game.players[i].node.name_seat){
							game.players[i].node.name_seat=ui.create.div('.name.name_seat',get.verticalStr(lib.translate['unknown'+get.distance(_status.firstAct,game.players[i],'absolute')]),game.players[i]);
							game.players[i].node.name_seat.style.opacity=1;
						}
					}
					if(get.config('ladder')){
						var date=new Date();
						if(!lib.storage.ladder){
							lib.storage.ladder={
								current:900,
								top:900,
								month:date.getMonth()
							};
							game.save('ladder',lib.storage.ladder);
						}
						else if(date.getMonth()!=lib.storage.ladder.month&&get.config('ladder_monthly')){
							lib.storage.ladder.month=date.getMonth();
							lib.storage.ladder.current=900;
							game.save('ladder',lib.storage.ladder);
						}
						ui.ladder=ui.create.system(game.getLadderName(lib.storage.ladder.current),null,true);
						lib.setPopped(ui.ladder,function(uiintro){
							var uiintro=ui.create.dialog('hidden');
							uiintro.add('<div class="text center">当前分数：<div style="width:40px;text-align:left;font-family:xinwei">'+(lib.storage.ladder.current+(_status.ladder_tmp?40:0))+'</div></div>');
							uiintro.add('<div class="text center">历史最高：<div style="width:40px;text-align:left;font-family:xinwei">'+lib.storage.ladder.top+'</div></div>');
							uiintro.content.lastChild.style.paddingBottom='8px';
							return uiintro;
						},180);
						_status.ladder=true;
						_status.ladder_mmr=0;
					}
					event.addSetting=function(){
						var cs=function(link,node){
							game.swapPlayer(node._link);
							_status.rechoose=true;
							for(var i=0;i<game.players.length;i++){
								game.players[i].uninit();
								if(game.players[i].node.name_seat) game.players[i].node.name_seat.style.display='';
								game.players[i].classList.remove('selectedx');
							}
							game.resume();
						};
						if(!event.seatsbutton){
							event.seatsbutton=[
								ui.create.control('一号位',cs),
								ui.create.control('一号位',cs),
								ui.create.control('一号位',cs),
								ui.create.control('换边',function(){
									if(_status.firstAct.side==game.me.side){
										cs(null,{_link:_status.firstAct.nextSeat});
									}
									else{
										cs(null,{_link:_status.firstAct});
									}
								})
							];
						}
						var seats=[];
						for(var i=0;i<game.players.length;i++){
							if(game.players[i]!=game.me&&game.players[i].side==game.me.side){
								seats.add([1+get.distance(_status.firstAct,game.players[i],'absolute'),game.players[i]]);
							}
							seats.sort(function(a,b){
								return a[0]-b[0];
							});
						}
						for(var i=0;i<event.seatsbutton.length;i++){
							if(i<seats.length){
								event.seatsbutton[i].firstChild.innerHTML=get.cnNumber(seats[i][0],true)+'号位';
								event.seatsbutton[i].firstChild._link=seats[i][1];
							}
						}
					};
					if(!get.config('four_assign')&&!get.config('four_phaseswap')){
						if(get.config('change_identity')){
							event.addSetting();
						}
						if(get.config('fouralign')&&!event.fouralignbutton){
							event.fouralignbutton=ui.create.control('变阵',function(){
								if(!_status.fouralign.length||(_status.fouralign.length==1&&_status.fouralign[0]==0)){
									_status.fouralign=[0,1,2,3,4];
								}
								var list=[
									['zhong','ezhong','ezhong','zhong','zhong','ezhong','ezhong','zhong'],
									['zhong','ezhong','zhong','ezhong','ezhong','zhong','ezhong','zhong'],
									['zhong','ezhong','ezhong','zhong','ezhong','zhong','zhong','ezhong'],
									['zhong','ezhong','zhong','ezhong','zhong','ezhong','zhong','ezhong'],
									['zhong','ezhong','ezhong','zhong','ezhong','zhong','ezhong','zhong'],
								][_status.fouralign.shift()];
								var rand1=Math.floor(Math.random()*4);
								var rand2=Math.floor(Math.random()*4);
								for(var i=0;i<list.length;i++){
									if(list[i]=='zhong'){
										if(rand1==0){
											list[i]='zhu';
										}
										rand1--;
									}
									else{
										if(rand2==0){
											list[i]='ezhu';
										}
										rand2--;
									}
								}

								var side=Math.random()<0.5;
								var num=game.players.indexOf(_status.firstAct);
								list=list.splice(8-num).concat(list);

								for(var i=0;i<8;i++){
									if(list[i][0]=='e'){
										game.players[i].side=side;
										game.players[i].identity=list[i].slice(1);
									}
									else{
										game.players[i].side=!side;
										game.players[i].identity=list[i];
									}
									if(game.players[i].identity=='zhu'){
										game[game.players[i].side+'Zhu']=game.players[i];
										game.players[i].isZhu=true;
									}
									game.players[i].setIdentity(game.players[i].identity);
									game.players[i].node.identity.dataset.color=get.translation(game.players[i].side+'Color');
									if(game.players[i].node.name_seat){
										game.players[i].node.name_seat.remove();
										delete game.players[i].node.name_seat;
									}
								}

								_status.rechoose=true;
								for(var i=0;i<game.players.length;i++){
									game.players[i].uninit();
									if(game.players[i].node.name_seat) game.players[i].node.name_seat.style.display='';
									game.players[i].classList.remove('selectedx');
								}
								game.resume();
							});
						}
					}
					"step 1"
					if(event.current==game.me||(event.four_assign&&event.current.side==game.me.side)){
						var dialog=event.xdialog;
						if(!dialog){
							if(get.config('expand_dialog')){
								dialog=event.xdialog||ui.create.characterDialog('heightset',event.filterChoice,'expandall');
							}
							else{
								dialog=event.xdialog||ui.create.characterDialog('heightset',event.filterChoice,'precharacter');
							}
						}
						var names=[];
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].name1){
								names.push(game.players[i].name1);
							}
						}
						for(var i=0;i<dialog.buttons.length;i++){
							if(names.contains(dialog.buttons[i].link)){
								dialog.buttons[i].classList.add('unselectable');
								dialog.buttons[i].classList.add('noclick');
							}
						}
						game.me.chooseButton(dialog,true).set('onfree',true).closeDialog=false;
						event.xdialog=dialog;
						dialog.static=true;
						event.current.classList.add('selectedx');
						game.delay(0.5);
					}
					else{
						event.ai(event.current,event.list.randomGets(3),event.list2);
						event.current.node.name_seat.style.display='none';
						if(!event.four_assign){
							event.current=event.current.next;
							event.redo();
						}
					}
					"step 2"
					if(_status.rechoose){
						delete _status.rechoose;
						event.goto(0);
						var dialog=event.xdialog;
						if(dialog){
							for(var i=0;i<dialog.buttons.length;i++){
								dialog.buttons[i].classList.remove('unselectable');
								dialog.buttons[i].classList.remove('noclick');
							}
						}
						return;
					}
					if(event.seatsbutton){
						for(var i=0;i<event.seatsbutton.length;i++){
							event.seatsbutton[i].close();
						}
						delete event.seatsbutton;
					}
					event.current.classList.remove('selectedx');
					if(event.current.side==game.me.side){
						event.current.init(result.buttons[0].link);
						if(event.current==game.me){
							game.addRecentCharacter(result.buttons[0].link);
						}
						event.list.remove(event.current.name1);
						event.list2.remove(event.current.name1);
						if(event.current.identity=='zhu'){
							event.current.hp++;
							event.current.maxHp++;
							event.current.update();
						}
						event.current.node.name_seat.remove();
					}
					if(event.four_assign){
						for(var i=0;i<game.players.length;i++){
							if(!game.players[i].name1) break;
						}
						if(i<game.players.length){
							var side=event.current.side;
							event.current=_status.firstAct.next;
							if(event.flipassign){
								for(var iwhile=0;iwhile<8;iwhile++){
									event.current=event.current.next;
									if(event.current.side!=side&&!event.current.name1){
										break;
									}
								}
							}
							else{
								for(var iwhile=0;iwhile<8;iwhile++){
									event.current=event.current.previous;
									if(event.current.side==side&&!event.current.name1){
										break;
									}
								}
							}
							event.flipassign=!event.flipassign;
							event.goto(1);
						}
					}
					else{
						for(var i=0;i<game.players.length;i++){
							if(!game.players[i].name1){
								event.ai(game.players[i],event.list.splice(0,3),event.list2);
								game.players[i].node.name_seat.remove();
							}
						}
					}
					"step 3"
					if(get.config('four_phaseswap')){
						game.addGlobalSkill('autoswap');
						if(lib.config.show_handcardbutton){
							ui.versushs=ui.create.system('手牌',null,true);
							lib.setPopped(ui.versushs,game.versusHoverHandcards,220);
						}
					}
					if(event.xdialog){
						event.xdialog.close();
					}
					// game.addRecentCharacter(game.me.name,game.me.name2);
					ui.control.style.transitionDuration='0s';
					ui.refresh(ui.control);
					ui.arena.classList.remove('choose-character');
					setTimeout(function(){
						ui.control.style.transitionDuration='';
					},500);
					lib.init.onfree();
					delete _status.fouralign;
					if(event.fouralignbutton){
						event.fouralignbutton.close();
						delete event.fouralignbutton;
					}
				});
			},
			chooseCharacterThree:function(){
				var next=game.createEvent('chooseCharacter',false);
				next.setContent(function(){
					'step 0'
					if(lib.config.continue_name_versus_three){
						event.friendlist=lib.config.continue_name_versus_three.friend;
						event.enemylist=lib.config.continue_name_versus_three.enemy;
						_status.color=lib.config.continue_name_versus_three.color;
						game.additionaldead=[];
						game.saveConfig('continue_name_versus_three');
						event.goto(2);
						lib.init.onfree();
					}
					else{
						game.chooseCharacterDouble(function(i){
							if(lib.filter.characterDisabled(i)) return false;
							return !lib.filter.characterDisabled(i);
							// if(get.config('enable_all_three')){
							// }
							// else{
							// 	for(var j in lib.characterPack){
							// 		if(lib.choiceVtuberkill.contains(j)&&lib.characterPack[j][i])	return false;
							// 	}
							// 	return lib.choiceThree.contains(i);
							// }
						},function(i){
							return i==1?'主帅':'前锋';
						});
					}
					"step 1"
					game.addRecentCharacter.apply(this,result.friend);
					event.friendlist=result.friend;
					event.enemylist=result.enemy;
					"step 2"
					_status.friendBackup=event.friendlist.slice(0);
					_status.enemyBackup=event.enemylist.slice(0);
					_status.coinCoeff=get.coinCoeff(event.friendlist);

					ui.create.players(6);
					for(var i=0;i<game.players.length;i++){
						game.players[i].getId();
						game.players[i].node.action.innerHTML='行动';
					}
					ui.arena.setNumber(7);
					for(var i=0;i<game.players.length;i++){
						game.players[i].dataset.position=parseInt(game.players[i].dataset.position)+1;
					}
					game.singleHandcard=true;
					ui.arena.classList.add('single-handcard');
					ui.window.classList.add('single-handcard');
					ui.fakeme=ui.create.div('.fakeme.avatar');
					_status.prepareArena=true;
					ui.create.me();
					ui.me.appendChild(ui.fakeme);

					game.friend=[];
					game.enemy=[];

					for(var i in lib.skill){
						if(lib.skill[i].changeSeat){
							lib.skill[i]={};
							if(lib.translate[i+'_info']){
								lib.translate[i+'_info']='固定位置时不可用';
							}
						}
					}
					for(i=0;i<game.players.length;i++){
						if(i<3){
							game.friend.push(game.players[i]);
						}
						else{
							game.enemy.push(game.players[i]);
						}
					}
					game.friendZhu=game.players[1];
					game.enemyZhu=game.players[4];
					for(var i=0;i<3;i++){
						game.friend[i].side=_status.color;
						game.enemy[i].side=!_status.color;
						if(game.friendZhu==game.friend[i]){
							game.friend[i].identity='zhu';
							game.friend[i].setIdentity(_status.color+'Zhu');
						}
						else{
							game.friend[i].identity='zhong';
							game.friend[i].setIdentity(_status.color+'Zhong');
						}
						if(game.enemyZhu==game.enemy[i]){
							game.enemy[i].identity='zhu';
							game.enemy[i].setIdentity(!_status.color+'Zhu');
						}
						else{
							game.enemy[i].identity='zhong';
							game.enemy[i].setIdentity(!_status.color+'Zhong');
						}
						game.friend[i].init(event.friendlist[i]);
						game.enemy[i].init(event.enemylist[i]);
						game.friend[i].node.identity.dataset.color=get.translation(_status.color+'Color');
						game.enemy[i].node.identity.dataset.color=get.translation(!_status.color+'Color');
					}
					game.friendZhu.maxHp++;
					game.friendZhu.hp++;
					game.friendZhu.update();

					game.enemyZhu.maxHp++;
					game.enemyZhu.hp++;
					game.enemyZhu.update();

					game.onSwapControl();
				});
			},
			chooseCharacter:function(){
				var next=game.createEvent('chooseCharacter',false);
				next.showConfig=true;
				next.setContent(function(){
					"step 0"
					if(lib.config.continue_name_versus){
						_status.friend=lib.config.continue_name_versus.friend;
						_status.enemy=lib.config.continue_name_versus.enemy;
						_status.color=lib.config.continue_name_versus.color;
						game.additionaldead=[];
						event.goto(1);
						game.saveConfig('continue_name_versus');
						lib.init.onfree();
						return;
					}
					event.check=function(){
						this.dialog.classList.add('fullwidth');
						this.dialog.classList.add('fullheight');
						this.dialog.classList.add('noslide');
						for(var i=0;i<this.dialog.buttons.length;i++) this.dialog.buttons[i].style.opacity=1;
						this.dialog.add('选项');
						this.dialog.versus_zhu=this.dialog.add(ui.create.switcher('versus_zhu',lib.storage.zhu)).querySelector('.toggle');
						// this.dialog.versus_only_zhu=this.dialog.add(ui.create.switcher('versus_only_zhu',lib.storage.only_zhu)).querySelector('.toggle');
						this.dialog.versus_main_zhu=this.dialog.add(ui.create.switcher('versus_main_zhu',lib.storage.main_zhu)).querySelector('.toggle');
						if(lib.storage.zhu){
							// this.dialog.versus_only_zhu.parentNode.classList.remove('disabled');
							this.dialog.versus_main_zhu.parentNode.classList.remove('disabled');
						}
						else{
							// this.dialog.versus_only_zhu.parentNode.classList.add('disabled');
							this.dialog.versus_main_zhu.parentNode.classList.add('disabled');
						}
						// this.dialog.versus_cross_seat=this.dialog.add(ui.create.switcher('versus_cross_seat',lib.storage.cross_seat)).querySelector('.toggle');
						// this.dialog.versus_random_seat=this.dialog.add(ui.create.switcher('versus_random_seat',lib.storage.random_seat)).querySelector('.toggle');
						this.dialog.versus_noreplace_end=this.dialog.add(ui.create.switcher('versus_noreplace_end',lib.storage.noreplace_end)).querySelector('.toggle');
						this.dialog.versus_assign_enemy=this.dialog.add(ui.create.switcher('versus_assign_enemy',lib.storage.assign_enemy)).querySelector('.toggle');
						this.dialog.versus_single_control=this.dialog.add(ui.create.switcher('versus_single_control',lib.storage.single_control)).querySelector('.toggle');
						this.dialog.versus_first_less=this.dialog.add(ui.create.switcher('versus_first_less',get.config('first_less'))).querySelector('.toggle');
						this.dialog.versus_reward=this.dialog.add(ui.create.switcher('versus_reward',[0,1,2,3,4],lib.storage.versus_reward)).querySelector('.toggle');
						this.dialog.versus_punish=this.dialog.add(ui.create.switcher('versus_punish',['弃牌','无','摸牌'],lib.storage.versus_punish)).querySelector('.toggle');
						this.dialog.versus_seat_order=this.dialog.add(ui.create.switcher('seat_order',['对阵','交叉','随机'],lib.storage.seat_order)).querySelector('.toggle');
						this.dialog.versus_number=this.dialog.add(ui.create.switcher('versus_number',[1,2,3],lib.storage.number)).querySelector('.toggle');
						this.dialog.replace_number=this.dialog.add(ui.create.switcher('replace_number',[0,1,2,3,5,7,9,17],lib.storage.replace_number)).querySelector('.toggle');
						this.dialog.choice=this.dialog.add(ui.create.switcher('choice',[12,16,20,24,40,'∞'],lib.storage.choice)).querySelector('.toggle');

						// if(lib.storage.cross_seat){
						// 	this.dialog.versus_random_seat.parentNode.classList.add('disabled');
						// }
						// else{
						// 	this.dialog.versus_random_seat.parentNode.classList.remove('disabled');
						// 	if(lib.storage.random_seat){
						// 		this.dialog.versus_cross_seat.parentNode.classList.add('disabled');
						// 	}
						// 	else{
						// 		this.dialog.versus_cross_seat.parentNode.classList.remove('disabled');
						// 	}
						// }
					};
					event.confirm=function(){
						var dialog=event.dialog;
						var num=lib.storage.number+lib.storage.replace_number;
						_status.friend.splice(num);
						_status.enemy.splice(num);
						dialog.close();
						if(ui.confirm) ui.confirm.close();
						game.resume();
					};
					ui.control.style.transition='all 0s';
					if(get.is.phoneLayout()){
						ui.control.style.top='calc(100% - 80px)';
					}
					else if(game.layout=='newlayout'){
						ui.control.style.top='calc(100% - 30px)';
					}
					else{
						ui.control.style.top='calc(100% - 70px)';
					}
					_status.friend=[];
					_status.enemy=[];
					game.additionaldead=[];
					_status.color=Math.random()<0.5;
					var i,list=[];
					for(i in lib.character){
						// if(lib.config.forbidversus.contains(i)) continue;
						if(lib.filter.characterDisabled(i)) continue;
						list.push(i);
					}
					var groupSort=function(name){
						if(['holo'].contains(lib.character[name][1])) return 0;
						if(['nijisanji'].contains(lib.character[name][1])) return 1;
						if(['vtuber'].contains(lib.character[name][1])) return 2;
						if(['clubs'].contains(lib.character[name][1])) return 3;
					}
					var sortByGroup=function(a,b){
						var del=groupSort(a)-groupSort(b);
						if(del!=0) return del;
						if(a.indexOf('_')!=-1){
							a=a.slice(a.indexOf('_')+1);
						}
						if(b.indexOf('_')!=-1){
							b=b.slice(b.indexOf('_')+1);
						}
						return a>b?1:-1;
					}
					if(lib.storage.choice=='∞'){
						list.sort(sortByGroup);
					}
					else{
						list.randomSort();
					}
					_status.list=list;
					var choice=(lib.storage.choice=='∞')?list.length:lib.storage.choice;
					event.dialog=ui.create.dialog('选择角色',[list.slice(0,choice),'character']);
					event.dialog.classList.add('fixed');
					// for(var i=0;i<event.dialog.buttons.length;i++){
					// 	event.dialog.buttons[i].style.transform='scale(0.95)';
					// }
					event.check();
					ui.create.cheat=function(){
						_status.createControl=event.fill;
						ui.cheat=ui.create.control('更换',function(){
							if(_status.choosefinished){
								return;
							}
							if(lib.storage.choice=='∞'){
								list.sort(sortByGroup);
							}
							else{
								list.randomSort();
							}
							_status.friend.length=0;
							_status.enemy.length=0;
							var choice=(lib.storage.choice=='∞')?list.length:lib.storage.choice;

							ui.dialog.content.firstChild.innerHTML='选择角色';
							var buttons=ui.create.div('.buttons');
							var node=_status.event.dialog.buttons[0].parentNode;
							_status.event.dialog.buttons=ui.create.buttons(list.slice(0,choice),'character',buttons);
							_status.event.dialog.content.insertBefore(buttons,node);
							buttons.animate('start');
							node.remove();

							// event.check();
						});
						delete _status.createControl;
					}
					if(!ui.cheat&&get.config('change_choice'))
					ui.create.cheat();
					if(lib.config.test_game){
						setTimeout(function(){
							event.switchToAuto();
						},500);
					}
					event.switchToAuto=function(){
						delete _status.choosefinished;
						event.fill.close();
						var buttons=_status.event.dialog.buttons.slice(0);
						buttons.randomSort();
						for(var i=0;i<buttons.length;i++){
							if(buttons[i].classList.contains('glow')||buttons[i].classList.contains('selectedx')){
								buttons.splice(i,1);i--;
							}
						}
						var dialog=_status.event.dialog;
						var max=dialog.versus_number.link+dialog.replace_number.link;
						for(var i=0;i<buttons.length;i++){
							if(_status.friend.length<max){
								_status.friend.push(buttons[i].link);
							}
							else if(_status.enemy.length<max){
								_status.enemy.push(buttons[i].link);
							}
							else{
								break;
							}
						}
						_status.friend.splice(max);
						_status.enemy.splice(max);
						dialog.close();
						if(ui.confirm) ui.confirm.close();
						game.resume();
					};
					event.fill=ui.create.control('补全',event.switchToAuto);
					event.custom.replace.button=function(button){
						if(_status.choose_enemy){
							if(button.classList.contains('glow')||button.classList.contains('selectedx')||_status.choosefinished) return;
							_status.choose_enemy=false;
							if(!_status.color){
								button.classList.add('selectedx');
								// button.style.transform='rotate(-3deg)';
							}
							else{
								button.classList.add('glow');
								// button.style.transform='rotate(-3deg)';
							}
							_status.enemy.push(button.link);
							var buttons=_status.event.dialog.buttons.slice(0);
							for(var i=0;i<buttons.length;i++){
								if(buttons[i].classList.contains('glow')||buttons[i].classList.contains('selectedx')){
									buttons.splice(i,1);i--;
								}
							}
						}
						else{
							if(button.classList.contains('glow')||button.classList.contains('selectedx')||_status.choosefinished) return;
							if(_status.color){
								button.classList.add('selectedx');
								// button.style.transform='rotate(-3deg)';
							}
							else{
								button.classList.add('glow');
								// button.style.transform='rotate(-3deg)';
							}
							_status.friend.push(button.link);
							var buttons=_status.event.dialog.buttons.slice(0);
							for(var i=0;i<buttons.length;i++){
								if(buttons[i].classList.contains('glow')||buttons[i].classList.contains('selectedx')){
									buttons.splice(i,1);i--;
								}
							}
							if(lib.storage.assign_enemy){
								_status.choose_enemy=true;
							}
							else{
								var button2=buttons[Math.floor(Math.random()*buttons.length)];
								if(_status.color){
									button2.classList.add('glow');
									// button2.style.transform='rotate(-3deg)';
								}
								else{
									button2.classList.add('selectedx');
									// button2.style.transform='rotate(-3deg)';
								}
								_status.enemy.push(button2.link);
								_status.event.dialog.content.firstChild.innerHTML='对方选择了'+get.translation(button2.link);
							}
						}
					};
					event.custom.add.window=function(){
						var dialog=_status.event.dialog;
						if(_status.friend.length==_status.enemy.length&&_status.friend.length>=dialog.versus_number.link+dialog.replace_number.link){
							event.fill.firstChild.innerHTML='开始';
							_status.choosefinished=true;
							if(ui.cheat){
								ui.cheat.close();
								delete ui.cheat;
							}
						}
						game.save('zhu',dialog.versus_zhu.link);
						if(lib.storage.zhu){
							// dialog.versus_only_zhu.parentNode.classList.remove('disabled');
							dialog.versus_main_zhu.parentNode.classList.remove('disabled');
						}
						else{
							// dialog.versus_only_zhu.parentNode.classList.add('disabled');
							dialog.versus_main_zhu.parentNode.classList.add('disabled');
						}
						// game.save('only_zhu',dialog.versus_only_zhu.link);
						game.save('main_zhu',dialog.versus_main_zhu.link);
						game.save('assign_enemy',dialog.versus_assign_enemy.link);
						game.save('seat_order',dialog.versus_seat_order.link);
						// game.save('cross_seat',dialog.versus_cross_seat.link);
						game.save('noreplace_end',dialog.versus_noreplace_end.link);
						game.save('single_control',dialog.versus_single_control.link);
						switch(lib.storage.seat_order){
							case '交叉':lib.storage.cross_seat=true;lib.storage.random_seat=false;break;
							case '随机':lib.storage.cross_seat=false;lib.storage.random_seat=true;break;
							default:lib.storage.cross_seat=false;lib.storage.random_seat=false;
						}
						game.saveConfig('first_less',dialog.versus_first_less.link,true);
						game.save('number',dialog.versus_number.link);
						game.save('versus_reward',dialog.versus_reward.link);
						game.save('versus_punish',dialog.versus_punish.link);
						game.save('replace_number',dialog.replace_number.link);
						game.save('choice',dialog.choice.link);
						var count,i;
						if(dialog.buttons.length>lib.storage.choice){
							count=dialog.buttons.length-lib.storage.choice;
							var removed=[];
							for(i=dialog.buttons.length-1;i>=0&&count>0;i--){
								if(dialog.buttons[i].classList.contains('target')==false&&
									dialog.buttons[i].classList.contains('glow')==false){
									dialog.buttons[i].remove();
									_status.list.remove(dialog.buttons[i].link);
									removed.push(dialog.buttons[i].link)
									dialog.buttons.splice(i,1);
									count--;
								}
							}
							for(i=0;i<removed.length;i++) _status.list.splice(lib.storage.choice,0,removed[i]);
						}
						else if(dialog.buttons.length<lib.storage.choice||lib.storage.choice=='∞'){
							var list=_status.list;
							var choice=(lib.storage.choice=='∞')?list.length:lib.storage.choice;
							var buttons=dialog.querySelector('.buttons');
							var button;
							for(i=dialog.buttons.length;i<choice;i++){
								button=ui.create.button(list[i],'character',buttons).animate('zoom')
								dialog.buttons.push(button);
								button.style.opacity=1;
							}
						}
					};
					game.pause();
					lib.init.onfree();
					"step 1"
					_status.friendBackup=_status.friend.slice(0);
					_status.enemyBackup=_status.enemy.slice(0);

					_status.friendDied=[];
					_status.enemyDied=[];
					_status.totalCount=_status.friend.length;
					_status.coinCoeff=get.coinCoeff(_status.friend);

					// ui.auto.show();
					ui.wuxie.show();
					ui.control.style.display='none';
					setTimeout(function(){
						ui.control.style.top='';
						ui.control.style.display='';
						ui.control.style.transition='';
					},500);
					if(ui.cheat){
						ui.cheat.close();
						delete ui.cheat;
					}
					delete _status.list;
					var num=lib.storage.number;
					ui.create.players(num*2);
					for(var i=0;i<game.players.length;i++){
						game.players[i].getId();
						game.players[i].node.action.innerHTML='行动';
					}
					if(lib.storage.single_control&&game.players.length>=4){
						ui.arena.setNumber(parseInt(ui.arena.dataset.number)+1);
						for(var i=0;i<game.players.length;i++){
							game.players[i].dataset.position=parseInt(game.players[i].dataset.position)+1;
						}
						game.singleHandcard=true;
						ui.arena.classList.add('single-handcard');
						ui.window.classList.add('single-handcard');
						ui.fakeme=ui.create.div('.fakeme.avatar');
						// ui.fakeme.line=lib.element.player.line;
						// ui.fakemebg=ui.create.div('.avatar',ui.fakeme).hide();
					}
					_status.prepareArena=true;
					ui.create.me();
					if(ui.fakeme){
						ui.me.appendChild(ui.fakeme);
					}
					var position,i;
					if(lib.storage.zhu&&lib.storage.only_zhu) position=Math.ceil(num/2)-1;
					else position=Math.floor(Math.random()*num)
					game.friend=[];
					game.enemy=[];
					if(lib.storage.random_seat){
						var players=game.players.slice(0);
						game.friend.push(game.me);
						players.remove(game.me);
						for(i=0;i<num-1;i++){
							game.friend.push(players.randomRemove());
						}
						for(i=0;i<num;i++){
							game.enemy.push(players.randomRemove());
						}
					}
					else{
						for(var i in lib.skill){
							if(lib.skill[i].changeSeat){
								lib.skill[i]={};
								if(lib.translate[i+'_info']){
									lib.translate[i+'_info']='固定位置时不可用';
								}
							}
						}
						if(lib.storage.cross_seat){
							for(i=0;i<game.players.length;i++){
								if(i%2==0){
									game.friend.push(game.players[i]);
								}
								else{
									game.enemy.push(game.players[i]);
								}
							}
						}
						else{
							for(i=0;i<position;i++){
								game.friend.push(game.players[i-position+num*2]);
							}
							for(i=position;i<num;i++){
								game.friend.push(game.players[i-position]);
							}
							for(i=0;i<num;i++){
								game.enemy.push(game.players[num-position+i]);
							}
						}
					}
					if(((position==Math.ceil(num/2)-1&&lib.storage.zhu)||(lib.storage.zhu&&lib.storage.single_control))){
						var dialog=ui.create.dialog('按顺序选择出场角色',[_status.friend,'character']);
						game.me.chooseButton(dialog,num,true);
					}
					if(lib.storage.random_seat&&lib.storage.zhu){
						if(lib.storage.only_zhu){
							game.friendZhu=game.me;
						}
						else{
							game.friendZhu=game.friend.randomGet();
						}
						game.enemyZhu=game.enemy.randomGet();
					}
					for(i=0;i<num;i++){
						game.friend[i].side=_status.color;
						game.enemy[i].side=!_status.color;
						if(lib.storage.random_seat&&lib.storage.zhu){
							if(game.friendZhu==game.friend[i]){
								game.friend[i].identity='zhu';
								game.friend[i].setIdentity(_status.color+'Zhu');
							}
							else{
								game.friend[i].identity='zhong';
								game.friend[i].setIdentity(_status.color+'Zhong');
							}
							if(game.enemyZhu==game.enemy[i]){
								game.enemy[i].identity='zhu';
								game.enemy[i].setIdentity(!_status.color+'Zhu');
							}
							else{
								game.enemy[i].identity='zhong';
								game.enemy[i].setIdentity(!_status.color+'Zhong');
							}
						}
						else{
							if(game.me==game.friend[i]&&lib.storage.zhu){
								game.friend[i].identity='zhu';
								game.friend[i].setIdentity(_status.color+'Zhu');
								game.friendZhu=game.friend[i];
							}
							else{
								game.friend[i].identity='zhong';
								game.friend[i].setIdentity(_status.color+'Zhong');

							}
							if(lib.storage.zhu&&get.distance(game.enemy[i],game.me,'pure')==num){
								game.enemy[i].identity='zhu';
								game.enemy[i].setIdentity(!_status.color+'Zhu');
								game.enemyZhu=game.enemy[i];
							}
							else{
								game.enemy[i].identity='zhong';
								game.enemy[i].setIdentity(!_status.color+'Zhong');
							}
						}
						game.friend[i].node.identity.dataset.color=get.translation(_status.color+'Color');
						game.enemy[i].node.identity.dataset.color=get.translation(!_status.color+'Color');
						// game.friend[i].node.identity.style.backgroundColor=get.translation(_status.color+'Color');
						// game.enemy[i].node.identity.style.backgroundColor=get.translation(!_status.color+'Color');
					}
					if(lib.storage.zhu&&!game.enemyZhu){
						game.enemy[0].identity='zhu';
						game.enemy[0].setIdentity(!_status.color+'Zhu');
						game.enemyZhu=game.enemy[0];
					}
					"step 2"
					var num=lib.storage.number;
					if(result&&result.buttons){
						var list=[];
						for(i=0;i<result.buttons.length;i++){
							list.push(result.buttons[i].link);
							_status.friend.remove(result.buttons[i].link);
						}
						_status.friend=list.concat(_status.friend);
					}
					for(i=0;i<num;i++){
						game.friend[i].init(_status.friend[i]);
						game.enemy[i].init(_status.enemy[i]);

						game.friend[i].node.identity.dataset.color=get.translation(_status.color+'Color');
						game.enemy[i].node.identity.dataset.color=get.translation(!_status.color+'Color');
					}
					if(lib.storage.zhu&&lib.storage.main_zhu){
						game.friendZhu.maxHp++;
						game.friendZhu.hp++;
						game.friendZhu.update();

						game.enemyZhu.maxHp++;
						game.enemyZhu.hp++;
						game.enemyZhu.update();
					}
					_status.friend.splice(0,num);
					_status.enemy.splice(0,num);
					if(lib.storage.single_control&&game.players.length>=4){
						// ui.fakemebg.show();
						game.onSwapControl();
					}
				});
			},
			chooseCharacterOL:function(){
				switch(lib.configOL.versus_mode){
					case '1v1':game.chooseCharacterOL1();break;
					case '2v2':game.chooseCharacterOL2();break;
					case '3v3':game.chooseCharacterOL3();break;
					case '4v4':game.chooseCharacterOL4();break;
					case 'guandu':game.chooseCharacterOLGuandu();break;
				}
			},
			chooseCharacterOLGuandu:function(){
				var next=game.createEvent('chooseCharacter',false);
				next.setContent(function(){
					"step 0"
					var list=[
 					['zhu','ezhu','ezhong','zhong','ezhong','zhong','zhong','ezhong'],
 					['zhu','ezhong','zhong','ezhu','ezhong','zhong','ezhong','zhong'],
 					['zhu','ezhong','zhong','ezhong','zhong','ezhong','zhong','ezhu'],
 					['zhu','ezhu','zhong','ezhong','zhong','ezhong','zhong','ezhong'],
 					['zhu','ezhong','zhong','ezhong','zhong','ezhu','zhong','ezhong'],
 				].randomGet();
				
 				var side=true;
 				var num=Math.floor(Math.random()*8);
 				list=list.splice(8-num).concat(list);
 				for(var i=0;i<8;i++){
 					if(list[i][0]=='e'){
 						game.players[i].side=side;
 						game.players[i].identity=list[i].slice(1);
 					}
 					else{
 						game.players[i].side=!side;
 						game.players[i].identity=list[i];
 					}
 					if(game.players[i].identity=='zhu'){
 						game[game.players[i].side+'Zhu']=game.players[i];
 						game.players[i].isZhu=true;
 					}
 					game.players[i].setIdentity(game.players[i].identity);
 					game.players[i].node.identity.dataset.color=get.translation(game.players[i].side+'Color');
 					game.players[i].getId();
 				}

					var side=true;
					var map={};
					var num=Math.floor(Math.random()*8);
					list=list.splice(8-num).concat(list);
					for(var i=0;i<8;i++){
						if(list[i][0]=='e'){
							game.players[i].side=side;
							game.players[i].identity=list[i].slice(1);
						}
						else{
							game.players[i].side=!side;
							game.players[i].identity=list[i];
						}
						map[game.players[i].playerid]=[game.players[i].side,game.players[i].identity];
					}
					var evt=['huoshaowuchao','liangcaokuifa','zhanyanliangzhuwenchou','shishengshibai'].randomGet();
					game.addGlobalSkill(evt);
					
					var func=function(map,evt){
						for(var i in map){
							var player=lib.playerOL[i];
							if(player){
								player.side=map[i][0];
								player.identity=map[i][1];
								player.setIdentity();
								player.node.identity.dataset.color=get.translation(player.side+'Color');
								if(player.identity=='zhu'){
									game[player.side+'Zhu']=player;
									player.isZhu=true;
								}
							}
						}
 					game.falseZhu.init('re_caocao');
 					game.trueZhu.init('ol_yuanshao');
 					game.trueZhu.hp++;
 					game.trueZhu.maxHp++;
 					game.falseZhu.hp++;
 					game.falseZhu.maxHp++;
 					game.trueZhu.update();
 					game.falseZhu.update();
						ui.arena.classList.add('choose-character');
						if(get.is.phoneLayout()){
  					ui.guanduInfo=ui.create.div('.touchinfo.left',ui.window);
  				}
  				else{
  					ui.guanduInfo=ui.create.div(ui.gameinfo);
  				}
  				ui.guanduInfo.innerHTML='当前事件：'+get.translation(evt);
  				var dialog=ui.create.dialog('本局特殊事件：'+get.translation(evt));
  				dialog.addText(get.translation(evt+'_info'),false);
  				setTimeout(function(){
  					dialog.close();
  				},5000)
					};
					game.broadcastAll(func,map,evt);
					_status.firstAct=game.falseZhu;
					game.delay(0,5000);
					"step 1"
					event.falseList=['xunyu','xunyou','re_guojia','re_zhangliao','re_xuhuang','yujin_yujin','caohong','jsp_guanyu','liuye','litong','zangba','re_manchong','re_hanhaoshihuan','chengyu','caoren'].filter(function(name){
						if(!Array.isArray(lib.character[name])) return false;
						lib.character[name][1]='wei';
						return true;
					});
					event.trueList=['xunchen','gaolan','sp_zhanghe','sp_xuyou','chenlin','re_liubei','yj_jushou','sp_shenpei','tianfeng','yuantanyuanshang','lvkuanglvxiang','xinpi','guotufengji','chunyuqiong'].filter(function(name){
						if(!Array.isArray(lib.character[name])) return false;
						lib.character[name][1]='qun';
						return true;
					});
					game.broadcast(function(list1,list2){
						while(list1.length){
							lib.character[list1.shift()][1]='wei';
						}
						while(list2.length){
							lib.character[list2.shift()][1]='qun';
						}
					},event.falseList,event.trueList);
					event.map={};
					var list=[];
					game.countPlayer(function(current){
						if(current.identity=='zhong'){
							var choice=event[current.side+'List'].randomRemove(3);
							event.map[current.playerid]=choice;
							list.push([current,['请选择武将',[choice,'character']],true]);
						}
					});
					game.me.chooseButtonOL(list,function(player,result){
						if(game.online||player==game.me){
							player.init(result.links[0]);
						}
					});
					"step 2"
					for(var i in result){
						if(result[i]=='ai'){
							result[i]=event.map[i].randomGet();
						}
						else result[i]=result[i].links[0];
					}
					game.broadcastAll(function(result){
						for(var i in result){
							lib.playerOL[i].init(result[i]);
						}
						setTimeout(function(){
							ui.arena.classList.remove('choose-character');
						},500);
					},result);
				});
			},
			chooseCharacterGuandu:function(){
				var next=game.createEvent('chooseCharacter',false);
				next.setContent(function(){
					'step 0'
					lib.init.onfree();
					ui.arena.classList.add('choose-character');
					game.falseZhu.init('re_caocao');
					game.trueZhu.init('ol_yuanshao');
					game.trueZhu.hp++;
					game.trueZhu.maxHp++;
					game.falseZhu.hp++;
					game.falseZhu.maxHp++;
					game.trueZhu.update();
					game.falseZhu.update();
					var evt=['huoshaowuchao','liangcaokuifa','zhanyanliangzhuwenchou','shishengshibai'].randomGet();
					game.addGlobalSkill(evt);
					game.broadcastAll(function(evt){
						if(get.is.phoneLayout()){
  					ui.guanduInfo=ui.create.div('.touchinfo.left',ui.window);
  				}
  				else{
  					ui.guanduInfo=ui.create.div(ui.gameinfo);
  				}
  				ui.guanduInfo.innerHTML='当前事件：'+get.translation(evt);
					},evt);
					game.me.chooseControl('ok').set('prompt','###本局特殊事件：'+get.translation(evt)+'###'+get.translation(evt+'_info'));
					'step 1'
					event.falseList=['xunyu','xunyou','re_guojia','re_zhangliao','re_xuhuang','yujin_yujin','caohong','jsp_guanyu','liuye','litong','zangba','re_manchong','re_hanhaoshihuan','chengyu','caoren'].filter(function(name){
						if(!Array.isArray(lib.character[name])) return false;
						lib.character[name][1]='wei';
						return true;
					});
					event.trueList=['xunchen','gaolan','sp_zhanghe','sp_xuyou','chenlin','re_liubei','yj_jushou','sp_shenpei','tianfeng','yuantanyuanshang','lvkuanglvxiang','xinpi','guotufengji','chunyuqiong'].filter(function(name){
						if(!Array.isArray(lib.character[name])) return false;
						lib.character[name][1]='qun';
						return true;
					});
					'step 2'
					if(game.me.identity!='zhu'){
						event.choose_me=true;
						game.me.chooseButton(['请选择你的武将牌',[event[game.me.side+'List'].randomRemove(3),'character']],true);
					}
					'step 3'
					if(event.choose_me) game.me.init(result.links[0]);
					game.countPlayer(function(current){
						if(current!=game.me&&current.identity=='zhong') current.init(event[current.side+'List'].randomRemove(2)[0]);
					});
					setTimeout(function(){
						ui.arena.classList.remove('choose-character');
					},500);
				});
			},
			chooseCharacterOL4:function(){
				var next=game.createEvent('chooseCharacter',false);
				next.setContent(function(){
					"step 0"
					var list=[
						['zhong','ezhong','ezhong','zhong','zhong','ezhong','ezhong','zhong'],
						['zhong','ezhong','zhong','ezhong','ezhong','zhong','ezhong','zhong'],
						['zhong','ezhong','ezhong','zhong','ezhong','zhong','zhong','ezhong'],
						['zhong','ezhong','zhong','ezhong','zhong','ezhong','zhong','ezhong'],
						['zhong','ezhong','ezhong','zhong','ezhong','zhong','ezhong','zhong'],
					].randomGet();
					var rand1=Math.floor(Math.random()*4);
					var rand2=Math.floor(Math.random()*4);
					for(var i=0;i<list.length;i++){
						if(list[i]=='zhong'){
							if(rand1==0){
								list[i]='zhu';
							}
							rand1--;
						}
						else{
							if(rand2==0){
								list[i]='ezhu';
							}
							rand2--;
						}
					}

					var side=Math.random()<0.5;
					var map={};
					var num=Math.floor(Math.random()*8);
					list=list.splice(8-num).concat(list);
					_status.firstAct=game.players[num];
					event.current=_status.firstAct.next;
					for(var i=0;i<8;i++){
						if(list[i][0]=='e'){
							game.players[i].side=side;
							game.players[i].identity=list[i].slice(1);
						}
						else{
							game.players[i].side=!side;
							game.players[i].identity=list[i];
						}
						map[game.players[i].playerid]=[game.players[i].side,game.players[i].identity];
					}
					if(_status.firstAct.side){
						for(var i=0;i<game.players.length;i++){
							game.players[i].side=!game.players[i].side;
							map[game.players[i].playerid]=[game.players[i].side,game.players[i].identity];
						}
					}
					game.broadcastAll(function(current){
						for(var i=0;i<game.players.length;i++){
							game.players[i].node.name_seat=ui.create.div('.name.name_seat',get.verticalStr(lib.translate['unknown'+get.distance(current,game.players[i],'absolute')]),game.players[i]);
							game.players[i].node.name_seat.style.opacity=1;
						}
					},_status.firstAct);

					var filterChoice=function(name){
						if(name=='zuoci'||name=='miheng') return true;
						if(get.is.double(name))	return true;
						for(let i of lib.choiceVtuberkill){
							if(lib.characterPack[i]&&lib.characterPack[i][name]){
								if(!lib.configOL.characterPack.contains(i)) return true;
								return false;
							}
						}
						return true;
					}
					event.flipassign=true;
					event.videoId=lib.status.videoId++;
					var func=function(filter,id,selected,map,choiceVtuberkill){
						lib.choiceVtuberkill=choiceVtuberkill;
						var dialog=ui.create.characterDialog('heightset',filter,'expandall').open();
						dialog.videoId=id;
						for(var i in map){
							var player=lib.playerOL[i];
							if(player){
								player.side=map[i][0];
								player.identity=map[i][1];
								player.setIdentity();
								player.node.identity.dataset.color=get.translation(player.side+'Color');
								if(player.identity=='zhu'){
									game[player.side+'Zhu']=player;
									player.isZhu=true;
								}
							}
						}
						ui.arena.classList.add('choose-character');
					};
					event.map=map;
					event.selected=[];
					game.broadcastAll(func,filterChoice,event.videoId,event.selected,map,lib.choiceVtuberkill);
					_status.onreconnect=[func,filterChoice,event.videoId,event.selected,map,lib.choiceVtuberkill];
					"step 1"
					game.broadcastAll(function(player){
						player.classList.add('selectedx');
					},event.current);
					event.current.chooseButton(true).set('filterButton',function(button){
						return !_status.event.selected.contains(button.link);
					}).set('ai',function(button){
						if(_status.event.player.identity=='zhu'){
							if(Math.random()<0.8){
								var info=lib.character[button.link];
								if(!info[4]||!info[4].contains('zhu')){
									return 0;
								}
							}
						}
						var seed=_status.event.seed;
						var rank=get.rank(button.link,true);
						if(seed>0.4){
							return (rank>=6)?Math.random():-Math.random();
						}
						else if(seed>0.1){
							return (rank>=4&&rank<6)?Math.random():-Math.random();
						}
						else{
							return (rank<4)?Math.random():-Math.random();
						}
					}).set('selected',_status.event.selected).set('dialog',event.videoId).set('seed',Math.random());
					"step 2"
					event.selected.push(result.links[0]);
					game.broadcastAll(function(player,name,zhu){
						player.classList.remove('selectedx');
						player.init(name);
						if(player.node.name_seat){
							player.node.name_seat.remove();
						}
					},event.current,result.links[0]);
					if(event.current.identity=='zhu'){
						event.current.hp++;
						event.current.maxHp++;
						event.current.update();
					}
					event.current.classList.remove('selectedx');
					for(var i=0;i<game.players.length;i++){
						if(!game.players[i].name1) break;
					}
					if(i<game.players.length){
						var side=event.current.side;
						event.current=_status.firstAct.next;
						if(event.flipassign){
							for(var iwhile=0;iwhile<8;iwhile++){
								event.current=event.current.next;
								if(event.current.side!=side&&!event.current.name1){
									break;
								}
							}
						}
						else{
							for(var iwhile=0;iwhile<8;iwhile++){
								event.current=event.current.previous;
								if(event.current.side==side&&!event.current.name1){
									break;
								}
							}
						}
						event.flipassign=!event.flipassign;
						event.goto(1);
					}
					"step 3"
					_status.onreconnect=[function(){
						for(var i=0;i<game.players.length;i++){
							var player=game.players[i];
							if(player.identity=='zhu'){
								game[player.side+'Zhu']=player;
								player.isZhu=true;
							}
						}
					}]
					game.broadcastAll(function(id){
						var dialog=get.idDialog(id);
						if(dialog){
							dialog.close();
						}
						setTimeout(function(){
							ui.arena.classList.remove('choose-character');
						},500);
					},event.videoId);
				});
			},
			chooseCharacterOL3:function(){
				var next=game.createEvent('chooseCharacterOL',false);
				next.setContent(function(){
					'step 0'
					game.additionaldead=[];
					game.broadcastAll(function(ref,bool){
						ui.arena.classList.add('choose-character');
						for(var i=0;i<6;i++){
							ref.side=bool;
							ref=ref.next;
							bool=!bool;
						}
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].side==game.me.side){
								game.players[i].node.identity.firstChild.innerHTML='友';
							}
							else{
								game.players[i].node.identity.firstChild.innerHTML='敌';
							}
							game.players[i].node.identity.dataset.color=game.players[i].side+'zhu';
						}
					},game.players[0],Math.random()<0.5);
					if(game.me.side==undefined){
						game.me.side=game.players[0].side;
					}
					_status.onreconnect=[function(){
						var players=game.players.concat(game.dead);
						for(var i=0;i<players.length;i++){
							if(players[i].side==game.me.side){
								players[i].node.identity.firstChild.innerHTML='友';
							}
							else{
								players[i].node.identity.firstChild.innerHTML='敌';
							}
						}
					}];
					var list=get.charactersOL();
					var choose=[];
					event.list=list;
					for(var i=0;i<game.players.length;i++){
						choose.push([game.players[i],['选择出场和备用武将',[list.randomRemove(5),'character']],2,true]);
					}
					game.me.chooseButtonOL(choose,function(player,result){
						if(game.online||player==game.me) player.init(result.links[0]);
					});
					'step 1'
					for(var i in result){
						if(result[i]=='ai'){
							result[i]=event.list.randomRemove(2);
						}
						else{
							result[i]=result[i].links;
						}
					}
					game.broadcastAll(function(result,func1,func2){
						setTimeout(function(){
							ui.arena.classList.remove('choose-character');
						},500)
						_status.friendDied=[];
						_status.enemyDied=[];

						_status.friend=[];
						_status.enemy=[];

						_status.enemyCount=ui.create.system('杀敌: '+get.cnNumber(0,true),null,true);
						_status.friendCount=ui.create.system('阵亡: '+get.cnNumber(0,true),null,true);

						lib.setPopped(_status.friendCount,func1);
						lib.setPopped(_status.enemyCount,func2);

						for(var i in result){
							if(!lib.playerOL[i].name1){
								lib.playerOL[i].init(result[i][0]);
							}
							if(lib.playerOL[i].side==game.me.side){
								_status.friend.push(result[i][1]);
							}
							else{
								_status.enemy.push(result[i][1]);
							}
						}
					},result,game.versusHoverFriend,game.versusHoverEnemy);
					_status.onreconnect=[function(list1,list2,list3,list4,side,func1,func2){
						if(side!=game.me.side){
							var tmp;
							tmp=list1;
							list1=list2;
							list2=tmp;
							tmp=list3;
							list3=list4;
							list4=tmp;
						}
						_status.friendDied=list1;
						_status.enemyDied=list2;

						_status.friend=list3;
						_status.enemy=list4;

						_status.enemyCount=ui.create.system('杀敌: '+get.cnNumber(_status.enemyDied.length,true),null,true);
						_status.friendCount=ui.create.system('阵亡: '+get.cnNumber(_status.friendDied.length,true),null,true);

						lib.setPopped(_status.friendCount,func1);
						lib.setPopped(_status.enemyCount,func2);

						for(var i=0;i<game.players.length;i++){
							if(game.players[i].side==game.me.side){
								game.players[i].node.identity.firstChild.innerHTML='友';
							}
							else{
								game.players[i].node.identity.firstChild.innerHTML='敌';
							}
						}
					},_status.friendDied,_status.enemyDied,
						_status.friend,_status.enemy,game.me.side,
						game.versusHoverFriend,game.versusHoverEnemy];
				});
			},
			chooseCharacterOL2:function(){
				if (get.config('connect_change_choice')) {
					game.chooseCharacterChangeOL2();
					return;
				}
				var next=game.createEvent('chooseCharacterOL',false);
				next.setContent(function(){
					'step 0'
					var ref=game.players[0];
					var bool=Math.random()<0.5;
					if(lib.configOL.observe_race){
						ref.side=bool;
						ref.next.side=bool;
						ref.next.next.side=!bool;
						ref.previous.side=!bool;
					}
					else{
						var bool2=Math.random()<0.5;
						ref.side=bool;
						ref.next.side=bool2;
						ref.next.next.side=!bool;
						ref.previous.side=!bool2;
					}
					var firstChoose = lib.configOL.observe_race?game.players[0]:game.players.randomGet();
					if(firstChoose.next.side==firstChoose.side){
						firstChoose=firstChoose.next;
					}
					_status.firstAct=firstChoose;
					for(var i=0;i<4;i++){
						firstChoose.node.name.innerHTML=get.verticalStr(get.cnNumber(i+1,true)+'号位');
						firstChoose=firstChoose.next;
					}
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].side==game.me.side){
							game.players[i].node.identity.firstChild.innerHTML='友';
						}
						else{
							game.players[i].node.identity.firstChild.innerHTML='敌';
						}
						game.players[i].node.identity.dataset.color=game.players[i].side+'zhu';
					}
					ui.arena.classList.add('choose-character');
					game.broadcast(function(ref,bool,bool2,firstChoose){
						ref.side=bool;
						ref.next.side=bool2;
						ref.next.next.side=!bool;
						ref.previous.side=!bool2;
						for(var i=0;i<4;i++){
							firstChoose.node.name.innerHTML=get.verticalStr(get.cnNumber(i+1,true)+'号位');
							firstChoose=firstChoose.next;
						}
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].side==game.me.side){
								game.players[i].node.identity.firstChild.innerHTML='友';
							}
							else{
								game.players[i].node.identity.firstChild.innerHTML='敌';
							}
							game.players[i].node.identity.dataset.color=game.players[i].side+'zhu';
						}
						ui.arena.classList.add('choose-character');
					},ref,bool,bool2,_status.firstAct);
					_status.onreconnect=[function(){
						var players=game.players.concat(game.dead);
						for(var i=0;i<players.length;i++){
							if(players[i].side==game.me.side){
								players[i].node.identity.firstChild.innerHTML='友';
							}
							else{
								players[i].node.identity.firstChild.innerHTML='敌';
							}
						}
					}];
					
					//22联机分配武将
					var list=[];
					var libCharacter={};
					var list4=[];
					for(var i=0;i<lib.configOL.characterPack.length;i++){
						var pack=lib.characterPack[lib.configOL.characterPack[i]];
						for(var j in pack){
							if(typeof func=='function'&&func(j)) continue;
							if(lib.connectBanned.contains(j)) continue;
							if(lib.character[j]) libCharacter[j]=pack[j];
						}
					}
					for(i in lib.characterReplace){
						var ix=lib.characterReplace[i];
						for(var j=0;j<ix.length;j++){
							if(!libCharacter[ix[j]]||lib.filter.characterDisabled(ix[j],libCharacter)) ix.splice(j--,1);
						}
						if(ix.length){
							list.push(i);
							list4.addArray(ix);
						}
					}
					game.broadcast(function(list){
						for(var i in lib.characterReplace){
							var ix=lib.characterReplace[i];
							for(var j=0;j<ix.length;j++){
								if(!list.contains(ix[j])) ix.splice(j--,1);
							}
						}
					},list4);
					for(i in libCharacter){
						if(list4.contains(i)||lib.filter.characterDisabled(i,libCharacter)) continue;
						list.push(i);
						list4.push(i);
					}
					var choose=[];
					event.list=list;
					_status.characterlist=list4;
					for(var i=0;i<game.players.length;i++){
						choose.push([game.players[i],['选择角色',[list.randomRemove(7),'characterx']],true]);
					}
					game.me.chooseButtonOL(choose,function(player,result){
						if(game.online||player==game.me) player.init(result.links[0]);
					});
					'step 1'
					for(var i in result){
						if(result[i]=='ai'){
							var name=event.list.randomRemove();
							if(lib.characterReplace[name]&&lib.characterReplace[name].length) name=lib.characterReplace[name].randomGet();
							result[i]=name;
						}
						else{
							result[i]=result[i].links[0];
						}
						_status.characterlist.remove(result[i]);
						if(!lib.playerOL[i].name1){
							lib.playerOL[i].init(result[i]);
						}
					}
					game.broadcast(function(result){
						for(var i in result){
							if(!lib.playerOL[i].name1){
								lib.playerOL[i].init(result[i]);
							}
						}
						setTimeout(function(){
							ui.arena.classList.remove('choose-character');
						},500)
					},result);
					setTimeout(function(){
						ui.arena.classList.remove('choose-character');
					},500)
				});
			},
			chooseCharacterChangeOL2: function () {
				var next = game.createEvent('chooseCharacter', false);
				next.showConfig = true;
				next.setContent(function () {
					'step 0'
					var ref=game.players[0];
					var bool=Math.random()<0.5;
					if(lib.configOL.observe_race){
						ref.side=bool;
						ref.next.side=bool;
						ref.next.next.side=!bool;
						ref.previous.side=!bool;
					}
					else{
						var bool2=Math.random()<0.5;
						ref.side=bool;
						ref.next.side=bool2;
						ref.next.next.side=!bool;
						ref.previous.side=!bool2;
					}
					var firstChoose = lib.configOL.observe_race?game.players[0]:game.players.randomGet();
					if(firstChoose.next.side==firstChoose.side){
						firstChoose=firstChoose.next;
					}
					_status.firstAct=firstChoose;
					for(var i=0;i<4;i++){
						firstChoose.node.name.innerHTML=get.verticalStr(get.cnNumber(i+1,true)+'号位');
						firstChoose=firstChoose.next;
					}
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].side==game.me.side){
							game.players[i].node.identity.firstChild.innerHTML='友';
						}
						else{
							game.players[i].node.identity.firstChild.innerHTML='敌';
						}
						game.players[i].node.identity.dataset.color=game.players[i].side+'zhu';
					}
					ui.arena.classList.add('choose-character');
					game.broadcast(function(ref,bool,bool2,firstChoose){
						ref.side=bool;
						ref.next.side=bool2;
						ref.next.next.side=!bool;
						ref.previous.side=!bool2;
						for(var i=0;i<4;i++){
							firstChoose.node.name.innerHTML=get.verticalStr(get.cnNumber(i+1,true)+'号位');
							firstChoose=firstChoose.next;
						}
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].side==game.me.side){
								game.players[i].node.identity.firstChild.innerHTML='友';
							}
							else{
								game.players[i].node.identity.firstChild.innerHTML='敌';
							}
							game.players[i].node.identity.dataset.color=game.players[i].side+'zhu';
						}
						ui.arena.classList.add('choose-character');
					},ref,bool,bool2,_status.firstAct);
					_status.onreconnect=[function(){
						var players=game.players.concat(game.dead);
						for(var i=0;i<players.length;i++){
							if(players[i].side==game.me.side){
								players[i].node.identity.firstChild.innerHTML='友';
							}
							else{
								players[i].node.identity.firstChild.innerHTML='敌';
							}
						}
					}];

					"step 1"
					event.videoId = lib.status.videoId++;
					var list = [];
					var libCharacter = {};
					for (var i = 0; i < lib.configOL.characterPack.length; i++) {
						var pack = lib.characterPack[lib.configOL.characterPack[i]];
						for (var j in pack) {
							if (lib.character[j]) libCharacter[j] = pack[j];
						}
					}
					for (i in libCharacter) {
						if (lib.filter.characterDisabled(i, libCharacter)) continue;
						list.push(i);
					}
					game.broadcastAll(function (list, id) {
						_status.characterlist = list;
						var filter = function (name) {
							return !_status.characterlist.contains(name);
						};
						var dialog = ui.create.characterDialog('heightset', filter).open();
						dialog.videoId = id;
						ui.arena.classList.add('choose-character');
					}, list, event.videoId);
					event.player = _status.firstAct;
					"step 2"
					event.player.chooseButton(true).set('ai', function (button) {
						return Math.random();
					}).set('dialog', event.videoId);
					"step 3"
					game.broadcastAll(function (player, character, id) {
						player.init(character);
						if (player == game.me) game.addRecentCharacter(character);
					}, event.player, result.links[0]);
					event.player = event.player.next
					"step 4"
					if (event.player.name1) {
						game.broadcastAll('closeDialog', event.videoId);
						game.broadcastAll(function (player, character, id) {
							var dialog = get.idDialog(id);
							if (dialog) {
								dialog.close();
							}
							setTimeout(function () {
								ui.arena.classList.remove('choose-character');
							}, 500);
						}, event.player, result.links[0], event.videoId);
					} else {
						event.goto(2);
					}
				});
			},
			chooseCharacterOL1:function(){
				var next=game.createEvent('chooseCharacterOL',false);
				next.setContent(function(){
					'step 0'
					game.removeCard('shengdong');
					game.additionaldead=[];
					var list=get.charactersOL();
					list=list.randomGets(parseInt(lib.configOL.choice_num));
					list.remove('huatuo');
					list.remove('sunquan');
					event.videoId=lib.status.videoId++;
					if(Math.random()<0.5){
						event.choosing=game.players[0];
					}
					else{
						event.choosing=game.players[1];
					}
					var createDialog=function(list,id,list1,list2){
						var dialog=ui.create.dialog('选择角色',[list,'character']);
						dialog.classList.add('fullwidth');
						dialog.classList.add('fullheight');
						dialog.classList.add('noslide');
						dialog.classList.add('fixed');
						dialog.videoId=id;
						if(list2&&list2){
							ui.arena.classList.add('playerhidden');
							for(var i=0;i<dialog.buttons.length;i++){
								var button=dialog.buttons[i];
								if(list1.contains(button.link)){
									button.classList.add('selectedx');
								}
								else if(list2.contains(button.link)){
									button.classList.add('glow');
								}
							}
						}
						else{
							if(list1!=game.me){
								dialog.content.firstChild.innerHTML='等待对手选择';
							}
						}
					};
					game.broadcastAll(createDialog,list,event.videoId,event.choosing);
					game.players[0].storage.versuslist=[];
					game.players[1].storage.versuslist=[];
					event.selected=[];
					_status.firstChoose=event.choosing;
					event.num=(parseInt(lib.configOL.replace_number)+1)*2;
					_status.onreconnect=[createDialog,list,event.videoId,
						_status.firstChoose.$.versuslist,
						_status.firstChoose.next.$.versuslist];
					game.broadcastAll(function(player){
						player.setIdentity('truezhu');
						player.next.setIdentity('falsezhu');
					},_status.firstChoose);
					'step 1'
					var next=event.choosing.chooseButton(event.videoId,1,true);
					next.set('filterButton',function(button){
						if(_status.event.selected.contains(button.link)) return false;
						return true;
					});
					next.set('selected',event.selected);
					next.set('ai',function(){
						return Math.random();
					});
					'step 2'
					event.choosing.$.versuslist.push(result.links[0]);
					game.broadcastAll(function(link,choosing,first,id){
						var dialog=get.idDialog(id);
						if(dialog){
							if(choosing==game.me){
								choosing='你';
							}
							else{
								choosing='对手';
							}
							dialog.content.firstChild.innerHTML=choosing+'选择了'+get.translation(link);
							for(var i=0;i<dialog.buttons.length;i++){
								if(dialog.buttons[i].link==link){
									if(first){
										dialog.buttons[i].classList.add('selectedx');
									}
									else{
										dialog.buttons[i].classList.add('glow');
									}
								}
							}
						}
					},result.links[0],event.choosing,event.choosing==_status.firstChoose,event.videoId);
					event.selected.push(result.links[0]);
					event.choosing=event.choosing.next;
					event.num--;
					if(event.num){
						event.goto(1);
					}
					'step 3'
					game.delay(2)
					'step 4'
					game.broadcastAll(function(id){
						ui.arena.classList.remove('playerhidden');
						var dialog=get.idDialog(id);
						if(dialog){
							dialog.close();
						}
					},event.videoId);

					_status.friendDied=[];
					_status.enemyDied=[];

					_status.friend=game.players[0].storage.versuslist;
					_status.enemy=game.players[1].storage.versuslist;

					delete game.players[0].storage.versuslist;
					delete game.players[1].versuslist;

					_status.enemyCount=ui.create.system('杀敌: '+get.cnNumber(0,true),null,true);
					_status.friendCount=ui.create.system('阵亡: '+get.cnNumber(0,true),null,true);

					lib.setPopped(_status.friendCount,game.versusHoverFriend);
					lib.setPopped(_status.enemyCount,game.versusHoverEnemy);

					game.me.side=true;
					game.players[0].side=true;
					game.players[1].side=false;

					var func=function(list1,list2,list3,list4,func1,func2,playerid){
						if(game.me.playerid==playerid){
							game.me.side=true;
							game.me.next.side=false;
						}
						else{
							game.me.side=false;
							game.me.next.side=true;
						}

						if(game.me.side){
							_status.enemyDied=list1;
							_status.friendDied=list2;

							_status.enemy=list3;
							_status.friend=list4;
						}
						else{
							_status.friendDied=list1;
							_status.enemyDied=list2;

							_status.friend=list3;
							_status.enemy=list4;
						}

						_status.enemyCount=ui.create.system('杀敌: '+get.cnNumber(_status.enemyDied.length,true),null,true);
						_status.friendCount=ui.create.system('阵亡: '+get.cnNumber(_status.friendDied.length,true),null,true);

						lib.setPopped(_status.friendCount,func1);
						lib.setPopped(_status.enemyCount,func2);
					};
					_status.onreconnect=[func,_status.enemyDied,_status.friendDied,
						_status.enemy,_status.friend,game.versusHoverFriend,game.versusHoverEnemy,game.players[0].playerid];
					game.broadcast(func,_status.enemyDied,_status.friendDied,
						_status.enemy,_status.friend,game.versusHoverFriend,game.versusHoverEnemy,game.players[0].playerid);

					var list=[[game.players[0],['选择出场角色',[_status.friend,'character']]],[game.players[1],['选择出场角色',[_status.enemy,'character']]]];
					game.me.chooseButtonOL(list,function(player,result){
						if(game.online||player==game.me) player.init(result.links[0]);
					});
					'step 5'
					var result1;
					var friend=result[game.players[0].playerid];
					if(friend&&friend.links&&friend.links.length){
						result1=friend.links[0];
					}
					else{
						result1=_status.friend.randomGet();
					}
					var result2;
					var enemy=result[game.players[1].playerid];
					if(enemy&&enemy.links&&enemy.links.length){
						result2=enemy.links[0];
					}
					else{
						result2=_status.enemy.randomGet();
					}
					if(!game.players[0].name1) game.players[0].init(result1);
					if(!game.players[1].name1) game.players[1].init(result2);
					_status.friend.remove(result1);
					_status.enemy.remove(result2);
					game.broadcast(function(result1,result2){
						if(game.me.side){
							if(!game.me.name1) game.me.init(result1);
							if(!game.me.next.name1) game.me.next.init(result2);
							_status.friend.remove(result1);
							_status.enemy.remove(result2);
						}
						else{
							if(!game.me.name1) game.me.init(result2);
							if(!game.me.next.name1) game.me.next.init(result1);
							_status.friend.remove(result2);
							_status.enemy.remove(result1);
						}
					},result1,result2);
				});
			},
			phaseLoopThree:function(player){
				var next=game.createEvent('phaseLoop');
				next.player=player;
				next.swap=function(player){
					if(player.side==game.me.side){
						return game.enemyZhu;
					}
					else{
						return game.me;
					}
				};
				next.setContent(function(){
					'step 0'
					player.classList.add('acted');
					player.phase();
					'step 1'
					if(player.identity!='zhu'){
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].side==player.side&&game.players[i].identity!='zhu'&&
								game.players[i]!=player&&!game.players[i].classList.contains('acted')){
								game.players[i].classList.add('acted');
								game.players[i].phase();
								break;
							}
						}
					}
					'step 2'
					var target=event.swap(player);
					var swap=[],swap2=[];
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].isOut()) continue;
						if(!game.players[i].classList.contains('acted')){
							if(game.players[i].side==target.side){
								swap.push(game.players[i]);
							}
							else{
								swap2.push(game.players[i]);
							}
						}
					}
					if(swap.length==0){
						if(swap2.length){
							target=event.swap(target);
							swap=swap2;
						}
						else{
							for(var i=0;i<game.players.length;i++){
								if(game.players[i].isOut()) continue;
								game.players[i].classList.remove('acted');
							}
							delete _status.roundStart;
							event.redo();
							game.delay();
							return;
						}
					}
					if(swap.length==1){
						event.directresult=swap[0];
					}
					else{
						var rand=Math.random();
						var next=target.chooseTarget('选择行动的角色',true,function(card,player,target2){
							return target2.side==target.side&&!target2.classList.contains('acted');
						});
						next._triggered=null;
						next.includeOut=true;
						next.ai=function(target2){
							var num=0;
							if(target2.countCards('j')){
								num-=5;
							}
							if(target2.identity!='zhu'){
								for(var i=0;i<game.players.length;i++){
									if(game.players[i].identity!='zhu'&&game.players[i]!=target2&&
									game.players[i].side==target2.side&&game.players[i].countCards('j')){
										num-=2;
									}
								}
							}
							if(rand<1/3){
								num+=1/(target2.hp+1);
							}
							else if(rand<2/3){
								num+=target2.countCards('h')/5;
							}
							return num;
						}
					}
					'step 3'
					if(event.directresult){
						event.player=event.directresult;
						delete event.directresult;
					}
					else if(result.bool){
						event.player=result.targets[0];
					}
					event.goto(0);
				});
			},
			versusPhaseLoop:function(player){
				var next=game.createEvent('phaseLoop');
				next.player=player;
				next.setContent(function(){
					"step 0"
					if(lib.storage.zhu){
						player.classList.add('acted');
					}
					player.phase();
					"step 1"
					if(lib.storage.zhu){
						_status.currentSide=!_status.currentSide;
						_status.round++;
						if(_status.round>=2*Math.max(game.friend.length,game.enemy.length)){
							_status.round=0;
							for(var i=0;i<game.players.length;i++){
								game.players[i].classList.remove('acted');
							}
							delete _status.roundStart;
						}
						var list=(_status.currentSide==game.me.side)?game.friend.slice(0):game.enemy.slice(0);
						for(var i=0;i<list.length;i++){
							if(list[i].classList.contains('acted')||list[i].isOut()){
								list.splice(i,1);i--;
							}
						}
						if(list.length==0) event.redo();
						else if(list.length==1||(game.me!=game.friendZhu&&!lib.storage.single_control)||_status.currentSide!=game.me.side){
							list.sort(function(a,b){
								if(a.countCards('j')>b.countCards('j')) return 1;
								return a.hp-b.hp;
							})
							event.player=list[0];
							event.goto(0);
						}
						else{
							game.me.chooseTarget('选择要行动的角色',true,function(card,player,target){
								return (target.classList.contains('acted')==false&&target.side==game.me.side);
							}).includeOut=true;
						}
					}
					else{
						event.player=event.player.next;
						event.goto(0);
					}
					"step 2"
					event.player=result.targets[0];
					event.goto(0);
				});
			},
			phaseLoopJiange:function(){
				var next=game.createEvent('phaseLoop');
				next.num=0;
				next.setContent(function(){
					if(event.num>=8){
						event.num-=8;
					}
					var player=_status.actlist[event.num];
					if(player.isAlive()){
						player.phase();
					}
					event.num++;
					event.redo();
				});
			},
			replacePlayerOL:function(player){
				var next=game.createEvent('replacePlayer',false,_status.event.getParent());
				next.source=player;
				next.setContent('replacePlayerOL');
			},
			replacePlayer:function(player){
				var next=game.createEvent('replacePlayer',false,_status.event.getParent());
				next.source=player;
				next.setContent('replacePlayer');
			},
			replacePlayerTwo:function(player,character){
				var next=game.createEvent('replacePlayerTwo',false,_status.event.getParent());
				next.source=player;
				next.character=character;
				next.setContent('replacePlayerTwo');
			},
			versusClickToSwap:function(e){
				if(_status.dragged) return;
				if(this.link==game.me){
					if(!this.classList.contains('buttonclick')){
						this.animate('buttonclick');
					}
				}
				else if(_status.event.player==game.me&&!_status.auto){
					game.me.popup('请稍后再换人');
					e.stopPropagation();
				}
				else{
					game.modeSwapPlayer(this.link);
				}
			},
			versusHoverEnemy:function(){
				var uiintro=ui.create.dialog('hidden');

				if(_status.enemyDied.length){
					uiintro.add('已阵亡');
					uiintro.add([_status.enemyDied,'character']);
				}

				uiintro.add('未上场');
				if(_status.enemy.length){
					uiintro.add([_status.enemy,'character']);
				}
				else{
					uiintro.add('（无）')
				}

				return uiintro;
			},
			versusHoverFriend:function(){
				var uiintro=ui.create.dialog('hidden');

				if(_status.friendDied.length){
					uiintro.add('已阵亡');
					uiintro.add([_status.friendDied,'character']);
				}

				uiintro.add('未上场');
				if(_status.friend.length){
					uiintro.add([_status.friend,'character']);
				}
				else{
					uiintro.add('（无）')
				}

				return uiintro;
			},
			versusHoverHandcards:function(){
				var uiintro=ui.create.dialog('hidden');
				var added=false;
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].name&&game.players[i].side==game.me.side&&game.players[i]!=game.me){
						added=true;
						uiintro.add(get.translation(game.players[i]));
						var cards=game.players[i].getCards('h');
						if(cards.length){
							uiintro.addSmall(cards,true);
						}
						else{
							uiintro.add('（无）');
						}
					}
				}
				if(added) return uiintro;
			},
			versusCheckEnemy:function(){
				_status.clicked=true;
				if(ui.intro){
					ui.intro.close();
					if(ui.intro.source=='versusCheckEnemy'){
						delete ui.intro;
						ui.control.show();
						game.resume2();
						return;
					}
				}
				game.pause2();
				ui.control.hide();
				ui.intro=ui.create.dialog();
				ui.intro.source='versusCheckEnemy';

				if(_status.enemyDied.length){
					ui.intro.add('已阵亡');
					ui.intro.add([_status.enemyDied,'character']);
				}

				ui.intro.add('未上场');
				if(_status.enemy.length){
					ui.intro.add([_status.enemy,'character']);
				}
				else{
					ui.intro.add('（无）')
				}
			},
			versusCheckFriend:function(){
				_status.clicked=true;
				if(ui.intro){
					ui.intro.close();
					if(ui.intro.source=='versusCheckFriend'){
						delete ui.intro;
						ui.control.show();
						game.resume2();
						return;
					}
				}
				game.pause2();
				ui.control.hide();
				ui.intro=ui.create.dialog();
				ui.intro.source='versusCheckFriend';




				if(_status.friendDied.length){
					ui.intro.add('已阵亡');
					ui.intro.add([_status.friendDied,'character']);
				}

				ui.intro.add('未上场');
				if(_status.friend.length){
					ui.intro.add([_status.friend,'character']);
				}
				else{
					ui.intro.add('（无）')
				}
			},
			versusSwapPlayer:function(){
				if(ui.intro){
					ui.intro.close();
					if(ui.intro.source=='versusSwapPlayer'){
						delete ui.intro;
						ui.control.show();
						game.resume2();
						return;
					}
				}
				if((_status.event.player==game.me&&_status.paused)||_status.paused2){
					game.me.popup('请稍后再换人');
				}
				else{
					_status.clicked=true;
					if(ui.intro){
						ui.intro.close();
						if(ui.intro.source==this.parentNode){
							delete ui.intro;
							ui.control.show();
							game.resume2();
							return;
						}
					}
					game.pause2();
					ui.control.hide();
					ui.intro=ui.create.dialog();
					ui.intro.source='versusSwapPlayer';
					var players=[];
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].side==game.me.side&&game.players[i]!=game.me){
							players.push(game.players[i]);
						}
					}
					ui.intro.add(players,true);
					var buttons=ui.intro.querySelectorAll('.button');
					for(var i=0;i<buttons.length;i++){
						buttons[i].addEventListener(lib.config.touchscreen?'touchend':'click',game.versusClickToSwap);
					}
				}
			},
			switchAutoreplace:function(e){
				e.stopPropagation();
				this.classList.toggle('on');
				game.save('autoreplaceinnerhtml',this.classList.contains('on'));
			},
			onSwapControl:function(){
				game.addVideo('onSwapControl');
				var name=game.me.name;
				if(ui.fakeme&&ui.fakeme.current!=name){
					ui.fakeme.current=name;
					if(ui.versushighlight&&ui.versushighlight!=game.me){
						ui.versushighlight.classList.remove('current_action');
					}
					ui.versushighlight=game.me;
					game.me.classList.add('current_action');

					ui.fakeme.style.backgroundImage=game.me.node.avatar.style.backgroundImage;
				}
			},
			modeSwapPlayer:function(player){
				if(_status.mode=='three'||(_status.mode=='standard'&&lib.storage.single_control)){
					game.swapControl(player);
					game.onSwapControl();
				}
				else{
					game.swapPlayer(player);
				}
			},
			updateLineMe:function(opacity,player){
				if(!player){
					player=game.me;
				}
				ui.lineme.width=ui.window.offsetWidth;
				ui.lineme.height=ui.window.offsetHeight;

				var ctx=ui.linemectx;
				ctx.shadowBlur=5;
				ctx.shadowColor='rgba(0,0,0,0.3)';
				ctx.fillStyle='white';
				if(typeof opacity!='number'){
					opacity=0.5;
				}
				ctx.strokeStyle='rgba(255,255,255,'+opacity+')';
				ctx.lineWidth=3;
				ctx.setLineDash([8,2]);

				ctx.beginPath();

				var startx,endx,pos;
                
				var endy=game.me.offsetHeight/2+game.me.offsetTop+ui.arena.offsetTop;
				var starty=ui.me.offsetTop+ui.arena.offsetTop+ui.me.offsetHeight/2;
				if(game.me.offsetLeft+game.me.offsetWidth/2<=ui.arena.offsetWidth/2){
					startx=ui.me.offsetLeft+ui.arena.offsetLeft;
					endx=game.me.offsetLeft+ui.arena.offsetLeft;
					pos=-1;
				}
				else{
					startx=ui.me.offsetLeft+ui.arena.offsetLeft+ui.me.offsetWidth;
					endx=game.me.offsetWidth+game.me.offsetLeft+ui.arena.offsetLeft;
					pos=1;
				}
				ctx.moveTo(startx,starty);
				startx+=pos*ui.arena.offsetLeft/2;
				ctx.quadraticCurveTo(startx,starty,startx,starty-(starty-endy)/2);
				ctx.quadraticCurveTo(startx,endy,endx,endy);
				ctx.stroke();
			},
		},
		jiangeboss:{
			boss_MinatoAqua: ['female','holo',2,['boss_shenghuang','boss_renzhan', 'boss_kuase'],['jiangeboss','hiddenboss','bossallowed'],'holo'],
			boss_KiryuuCoco:['female','holo',5,['boss_zaoankeke', 'boss_jierizhanbei','boss_esuyingye','boss_zuoyututan'],['jiangeboss','hiddenboss','bossallowed'],'holo'],

			boss_HonmaHimawari: ['female','nijisanji',5,['tianqing', 'boss_kuiquan'],['jiangeboss','hiddenboss','bossallowed'],'nijisanji'],
			boss_MitoTsukino:['female','nijisanji',4,['boss_bingdielei','boss_zhenyin'],['jiangeboss','hiddenboss','bossallowed'],'nijisanji'],

			boss_liedixuande:['male','nijisanji',5,['boss_lingfeng','boss_jizhen'],['jiangeboss','hiddenboss','bossallowed'],'nijisanji'],
			boss_gongshenyueying:['female','nijisanji',4,['boss_gongshenjg','boss_jingmiao','boss_zhinang'],['jiangeboss','hiddenboss','bossallowed'],'nijisanji'],
			boss_tianhoukongming:['male','nijisanji',4,['boss_biantian','bazhen'],['jiangeboss','hiddenboss','bossallowed'],'nijisanji'],
			//boss_yuhuoshiyuan:['male','nijisanji',4,['boss_yuhuojg','boss_qiwu','boss_tianyujg'],['jiangeboss','hiddenboss','bossallowed'],'nijisanji'],
			boss_qiaokuijunyi:['male','holo',4,['boss_huodi','boss_jueji'],['jiangeboss','hiddenboss','bossallowed'],'holo'],
			//boss_jiarenzidan:['male','holo',5,['boss_chiying','boss_jingfan'],['jiangeboss','hiddenboss','bossallowed'],'holo'],
			boss_duanyuzhongda:['male','holo',5,['boss_fanshi','boss_xuanlei','boss_skonghun'],['jiangeboss','hiddenboss','bossallowed'],'holo'],
			boss_juechenmiaocai:['male','holo',5,['boss_chuanyun','boss_leili','boss_fengxing'],['jiangeboss','hiddenboss','bossallowed'],'holo'],

			boss_jileibaihu:['male','nijisanji',5,['boss_jiguan','boss_zhenwei','boss_benlei'],['jiangemech','hiddenboss','bossallowed'],'nijisanji'],
			boss_yunpingqinglong:['male','nijisanji',5,['boss_jiguan','boss_mojianjg'],['jiangemech','hiddenboss','bossallowed'],'nijisanji'],
			boss_lingjiaxuanwu:['male','nijisanji',5,['boss_jiguan','yizhong','boss_lingyu'],['jiangemech','hiddenboss','bossallowed'],'nijisanji'],
			boss_chiyuzhuque:['male','nijisanji',5,['boss_jiguan','boss_yuhuojg','boss_tianyun'],['jiangemech','hiddenboss','bossallowed'],'nijisanji'],
			boss_fudibian:['male','holo',5,['boss_jiguan','boss_didongjg'],['jiangemech','hiddenboss','bossallowed'],'holo'],
			boss_tuntianchiwen:['male','holo',5,['boss_jiguan','boss_tanshi','boss_tunshi'],['jiangemech','hiddenboss','bossallowed'],'holo'],
			boss_shihuosuanni:['male','holo',5,['boss_jiguan','boss_lianyujg'],['jiangemech','hiddenboss','bossallowed'],'holo'],
			boss_lieshiyazi:['male','holo',5,['boss_jiguan','boss_nailuo'],['jiangemech','hiddenboss','bossallowed'],'holo'],
			
			boss_kumuyuanrang:['male','holo',5,['boss_bashi','boss_danjing'],['jiangeboss','hiddenboss','bossallowed'],'holo'],
			//boss_baijiwenyuan:['male','holo',5,['boss_jiaoxie'],['jiangeboss','hiddenboss','bossallowed'],'wei'],
			boss_yihanyunchang:['male','nijisanji',5,['boss_xiaorui','boss_huchen'],['jiangeboss','hiddenboss','bossallowed'],'nijisanji'],
			//boss_fuweizilong:['male','nijisanji',5,['boss_fengjian','boss_keding'],['jiangeboss','hiddenboss','bossallowed'],'nijisanji'],
		},
		cardsFour:[
			["spade",7,"sha"],
			["spade",8,"sha"],
			["spade",8,"sha"],
			["spade",9,"sha"],
			["spade",9,"sha"],
			["spade",10,"sha"],
			["spade",10,"sha"],
			["club",2,"sha"],
			["club",3,"sha"],
			["club",4,"sha"],
			["club",5,"sha"],
			["club",6,"sha"],
			["club",7,"sha"],
			["club",8,"sha"],
			["club",8,"sha"],
			["club",9,"sha"],
			["club",9,"sha"],
			["club",10,"sha"],
			["club",10,"sha"],
			["club",11,"sha"],
			["club",11,"sha"],
			["heart",10,"sha"],
			["heart",10,"sha"],
			["heart",11,"sha"],
			["diamond",6,"sha"],
			["diamond",7,"sha"],
			["diamond",8,"sha"],
			["diamond",9,"sha"],
			["diamond",10,"sha"],
			["diamond",13,"sha"],
			["heart",2,"shan"],
			["heart",2,"shan"],
			["heart",13,"shan"],
			["diamond",2,"shan"],
			["diamond",2,"shan"],
			["diamond",3,"shan"],
			["diamond",4,"shan"],
			["diamond",5,"shan"],
			["diamond",6,"shan"],
			["diamond",7,"shan"],
			["diamond",8,"shan"],
			["diamond",9,"shan"],
			["diamond",10,"shan"],
			["diamond",11,"shan"],
			["diamond",11,"shan"],
			["heart",3,"tao"],
			["heart",4,"tao"],
			["heart",6,"tao"],
			["heart",7,"tao"],
			["heart",8,"tao"],
			["heart",9,"tao"],
			["heart",12,"tao"],
			["diamond",12,"tao"],

			["spade",2,"bagua"],
			["club",2,"bagua"],
			["spade",5,"jueying"],
			["club",5,"dilu"],
			["heart",13,"zhuahuang"],
			["heart",5,"chitu"],
			["spade",13,"dawan"],
			["diamond",13,"zixin"],
			["club",1,"zhuge"],
			["diamond",1,"zhuge"],
			["spade",2,"cixiong"],
			["spade",6,"qinggang"],
			["spade",5,"qinglong"],
			["spade",12,"zhangba"],
			["diamond",5,"guanshi"],
			["diamond",12,"fangtian"],
			["heart",5,"qilin"],

			["heart",3,"wugu"],
			["heart",4,"wugu"],
			["heart",1,"taoyuan"],
			["spade",7,"nanman"],
			["spade",13,"nanman"],
			["club",7,"nanman"],
			["heart",1,"wanjian"],
			["spade",1,"juedou"],
			["club",1,"juedou"],
			["diamond",1,"juedou"],
			["heart",7,"wuzhong"],
			["heart",8,"wuzhong"],
			["heart",9,"wuzhong"],
			["heart",11,"wuzhong"],
			["spade",3,'shunshou'],
			["spade",4,'shunshou'],
			["spade",11,'shunshou'],
			["diamond",3,'shunshou'],
			["diamond",4,'shunshou'],
			["spade",3,'guohe'],
			["spade",4,'guohe'],
			["spade",12,'guohe'],
			["club",3,'guohe'],
			["club",4,'guohe'],
			["heart",12,'guohe'],
			["club",12,'jiedao'],
			["club",13,'jiedao'],
			["spade",11,'wuxie'],
			["club",12,'wuxie'],
			["club",13,'wuxie'],
			["spade",6,'lebu'],
			["club",6,'lebu'],
			["heart",6,'lebu'],
			["spade",1,'shandian','thunder'],
			["spade",2,'hanbing'],
			["club",2,'renwang'],
			["heart",12,'shandian','thunder'],
			["diamond",12,'wuxie'],
			["heart",4,"sha","fire"],
			["heart",7,"sha","fire"],
			["heart",10,"sha","fire"],
			["diamond",4,"sha","fire"],
			["diamond",5,"sha","fire"],
			["spade",4,"sha","thunder"],
			["spade",5,"sha","thunder"],
			["spade",6,"sha","thunder"],
			["spade",7,"sha","thunder"],
			["spade",8,"sha","thunder"],
			["club",5,"sha","thunder"],
			["club",6,"sha","thunder"],
			["club",7,"sha","thunder"],
			["club",8,"sha","thunder"],
			["heart",8,"shan"],
			["heart",9,"shan"],
			["heart",11,"shan"],
			["heart",12,"shan"],
			["diamond",6,"shan"],
			["diamond",7,"shan"],
			["diamond",8,"shan"],
			["diamond",10,"shan"],
			["diamond",11,"shan"],
			["heart",5,"tao"],
			["heart",6,"tao"],
			["diamond",2,"tao"],
			["diamond",3,"tao"],
			["diamond",9,"jiu"],
			["spade",3,"jiu"],
			["spade",9,"jiu"],
			["club",3,"jiu"],
			["club",9,"jiu"],

			["diamond",13,"hualiu"],
			["club",1,"baiyin"],
			["spade",2,"tengjia"],
			["club",2,"tengjia"],
			["spade",1,"guding"],
			["diamond",1,"zhuque"],

			["heart",2,"huogong"],
			["heart",3,"huogong"],
			["diamond",12,"huogong"],
			["spade",11,"tiesuo"],
			["spade",12,"tiesuo"],
			["club",10,"tiesuo"],
			["club",11,"tiesuo"],
			["club",12,"tiesuo"],
			["club",13,"tiesuo"],
			["heart",13,"wuxie"],
			["heart",13,"wuxie"],
			["spade",13,"wuxie"],
			["spade",10,"bingliang"],
			["club",4,"bingliang"],
		],
		cardsThree:[
			["spade",7,"sha"],
			["spade",8,"sha"],
			["spade",8,"sha"],
			["spade",9,"sha"],
			["spade",9,"sha"],
			["spade",10,"sha"],
			["spade",10,"sha"],
			["club",2,"sha"],
			["club",3,"sha"],
			["club",4,"sha"],
			["club",5,"sha"],
			["club",6,"sha"],
			["club",7,"sha"],
			["club",8,"sha"],
			["club",8,"sha"],
			["club",9,"sha"],
			["club",9,"sha"],
			["club",10,"sha"],
			["club",10,"sha"],
			["club",11,"sha"],
			["club",11,"sha"],
			["heart",10,"sha"],
			["heart",10,"sha"],
			["heart",11,"sha"],
			["diamond",6,"sha"],
			["diamond",7,"sha"],
			["diamond",8,"sha"],
			["diamond",9,"sha"],
			["diamond",10,"sha"],
			["diamond",13,"sha"],
			["heart",2,"shan"],
			["heart",2,"shan"],
			["heart",13,"shan"],
			["diamond",2,"shan"],
			["diamond",2,"shan"],
			["diamond",3,"shan"],
			["diamond",4,"shan"],
			["diamond",5,"shan"],
			["diamond",6,"shan"],
			["diamond",7,"shan"],
			["diamond",8,"shan"],
			["diamond",9,"shan"],
			["diamond",10,"shan"],
			["diamond",11,"shan"],
			["diamond",11,"shan"],
			["heart",3,"tao"],
			["heart",4,"tao"],
			["heart",6,"tao"],
			["heart",7,"tao"],
			["heart",8,"tao"],
			["heart",9,"tao"],
			["heart",12,"tao"],
			["diamond",12,"tao"],

			["spade",2,"bagua"],
			["club",2,"bagua"],
			["spade",5,"jueying"],
			["club",5,"dilu"],
			["heart",13,"zhuahuang"],
			["heart",5,"chitu"],
			["spade",13,"dawan"],
			["diamond",13,"zixin"],
			["club",1,"zhuge"],
			["diamond",1,"zhuge"],
			["spade",2,"cixiong"],
			["spade",6,"qinggang"],
			["spade",5,"qinglong"],
			["spade",12,"zhangba"],
			["diamond",5,"guanshi"],
			["diamond",12,"fangtian"],
			["heart",5,"qilin"],

			["heart",3,"wugu"],
			["heart",4,"wugu"],
			["heart",1,"taoyuan"],
			["spade",7,"nanman"],
			["spade",13,"nanman"],
			["club",7,"nanman"],
			["heart",1,"wanjian"],
			["spade",1,"juedou"],
			["club",1,"juedou"],
			["diamond",1,"juedou"],
			["heart",7,"wuzhong"],
			["heart",8,"wuzhong"],
			["heart",9,"wuzhong"],
			["heart",11,"wuzhong"],
			["spade",3,'shunshou'],
			["spade",4,'shunshou'],
			["spade",11,'shunshou'],
			["diamond",3,'shunshou'],
			["diamond",4,'shunshou'],
			["spade",3,'guohe'],
			["spade",4,'guohe'],
			["spade",12,'guohe'],
			["club",3,'guohe'],
			["club",4,'guohe'],
			["heart",12,'guohe'],
			["club",12,'jiedao'],
			["club",13,'jiedao'],
			["spade",11,'wuxie'],
			["club",12,'wuxie'],
			["club",13,'wuxie'],
			["spade",6,'lebu'],
			["club",6,'lebu'],
			["heart",6,'lebu'],
			["spade",1,'hanbing'],
			["club",2,'renwang'],

			["heart",4,"sha","fire"],
			["heart",7,"sha","fire"],
			["heart",10,"sha","fire"],
			["diamond",4,"sha","fire"],
			["diamond",5,"sha","fire"],
			["spade",4,"sha","thunder"],
			["spade",5,"sha","thunder"],
			["spade",6,"sha","thunder"],
			["spade",7,"sha","thunder"],
			["spade",8,"sha","thunder"],
			["club",5,"sha","thunder"],
			["club",6,"sha","thunder"],
			["club",7,"sha","thunder"],
			["club",8,"sha","thunder"],
			["heart",8,"shan"],
			["heart",9,"shan"],
			["heart",11,"shan"],
			["heart",12,"shan"],
			["diamond",6,"shan"],
			["diamond",7,"shan"],
			["diamond",8,"shan"],
			["diamond",10,"shan"],
			["diamond",11,"shan"],
			["heart",5,"tao"],
			["heart",6,"tao"],
			["diamond",2,"tao"],
			["diamond",3,"tao"],
			["diamond",9,"jiu"],
			["spade",3,"jiu"],
			["spade",9,"jiu"],
			["club",3,"jiu"],
			["club",9,"jiu"],

			["diamond",13,"hualiu"],
			["club",1,"baiyin"],
			["spade",2,"tengjia",],
			["spade",1,"guding"],
			["diamond",1,"zhuque"],

			["heart",2,"huogong"],
			["heart",3,"huogong"],
			["diamond",12,"huogong"],
			["spade",11,"tiesuo"],
			["spade",12,"tiesuo"],
			["club",10,"tiesuo"],
			["club",11,"tiesuo"],
			["club",12,"tiesuo"],
			["club",13,"tiesuo"],
			["heart",13,"wuxie"],
			["heart",13,"wuxie"],
			["spade",13,"wuxie"],
			["spade",10,"bingliang"],
			["club",4,"bingliang"],
		],
		choiceVtuberkill:[
			'hololive','nijisanji','vtuber','clubs'
		],
		choiceThree:[
			're_caocao','re_simayi','xiahoudun','re_zhangliao','re_guojia','zhenji','re_xiahouyuan','xuhuang',
			'wenpin','re_xuzhu','wangyi','dianwei','re_lidian','xunyou','dengai','wangji',
			'zhongyao','yuejin','simalang','zhangchunhua','sp_caoren','luzhi','litong','re_liubei',
			'guanyu','re_zhangfei','re_zhugeliang','re_zhaoyun','re_machao','huangyueying','jiangwei','xin_masu',
			'liuchen','re_huangzhong','mizhu','old_madai','wangping','xin_fazheng','re_xushu','liyan',
			'sp_sunshangxiang','zhoucang','yanyan','mazhong','mayunlu','sunquan','re_ganning','re_huanggai',
			're_zhouyu','re_daqiao','sunshangxiang','sunjian','re_xiaoqiao','sunce','re_luxun','zhugejin',
			'dingfeng','lingtong','xusheng','yufan','handang','panzhangmazhong','zhugeke',
			'zumao','xuezong','re_huatuo','lvbu','diaochan','re_pangde','jiaxu','chengong',
			're_gongsunzan','caifuren','gongsunyuan','yj_jushou','sp_liuqi','quyi','caiyong','key_yuzuru'
		],
		translate:{
			zhu:'主',
			zhong:'忠',
			truezhu:"帅",
			falsezhu:"将",
			trueZhu:"帅",
			falseZhu:"将",
			trueZhong:"兵",
			falseZhong:"卒",
			trueColor:"zhu",
			falseColor:"wei",
			versus_zhu_config:'启用主将',
			versus_only_zhu_config:'只当主将',
			versus_main_zhu_config:'主将死亡后结束',
			versus_assign_enemy_config:'指定对手',
			versus_cross_seat_config:'交叉座位',
			versus_random_seat_config:'随机座位',
			versus_noreplace_end_config:'无替补时结束',
			versus_single_control_config:'单人控制',
			seat_order_config:'座位排列',
			versus_first_less_config:'先手少摸牌',
			versus_reward_config:'杀敌摸牌',
			versus_punish_config:'杀死队友',
			versus_number_config:'对阵人数',
			replace_number_config:'替补人数',
			choice_config:'候选人数',
			mode_versus_character_config:'战场武将',
			mode_versus_card_config:'同舟共济',

			boss_liedixuande:'烈帝玄德',
			boss_gongshenyueying:'工神月英',
			boss_tianhoukongming:'天侯孔明',
			boss_yuhuoshiyuan:'浴火士元',
			boss_qiaokuijunyi:'巧魁儁乂',
			boss_jiarenzidan:'佳人子丹',
			boss_duanyuzhongda:'断狱仲达',
			boss_juechenmiaocai:'绝尘妙才',

			boss_jileibaihu:'机雷白虎',
			boss_yunpingqinglong:'云屏青龙',
			boss_lingjiaxuanwu:'灵甲玄武',
			boss_chiyuzhuque:'炽羽朱雀',
			boss_fudibian:'缚地狴犴',
			boss_tuntianchiwen:'吞天螭吻',
			boss_shihuosuanni:'食火狻猊',
			boss_lieshiyazi:'裂石睚眦',
			
			boss_kumuyuanrang:'枯目元让',
			boss_baijiwenyuan:'百计文远',
			boss_yihanyunchang:'翊汉云长',
			boss_fuweizilong:'扶危子龙',

			
			boss_KiryuuCoco:'邪龙可可',
			boss_zaoankeke: '早安一刀',
			boss_zaoankeke_info: '锁定技 当你使用【杀】指定目标后，目标需弃置一张牌；若此【杀】为属性杀，则改为交给你一张牌。',
			boss_jierizhanbei: '扳手战备',
			boss_jierizhanbei_info: '锁定技 你使用过装备牌的回合内手牌上限视为5.回合结束时，若本回合你没有使用过装备牌，你随机从牌堆内获得一张装备牌。',
			boss_esuyingye: '滥觞之至',
			boss_esuyingye_info: '回合开始时，你可以将你装备区或判定区的一张牌弃置，若为装备区的牌，本回合你下一张牌造成的伤害+1。',
			boss_zuoyututan:'坐於涂炭',
			boss_zuoyututanLimit: '手牌减少',
			boss_zuoyututan_info:'锁定技 转换技 一轮开始时，令所有敌方角色①随机废除一个装备栏②手牌上限-1③获得一张进入弃牌堆后即移出游戏的【毒】。',

			boss_MinatoAqua:'天使阿夸',
			boss_shenghuang: '圣皇圣愈',
			boss_shenghuang_info: '锁定技 当你进入濒死状态时，更换新的体力牌。你失去过黑色牌的回合结束时，友方角色将体力回复至回合开始时的状态。',
			boss_renzhan: '影逝刃斩',
			boss_renzhan_info: '每回合限一次。其他角色受到伤害后，若其未濒死，你可以失去1点体力，亮出牌堆顶牌直到出现【杀】，然后获得这些牌，并可以对一名角色使用任意张【杀】，直到其进入濒死状态。',
			boss_kuase: '夸色梦想',
			boss_kuase_info: '<font color=#f5c>限定技</font> 一个回合结束时，若有角色在回合内回复体力，你可以摸X张牌然后执行一个额外的出牌阶段。（X为所有角色本回合回复的体力值之和）',
			
			boss_HonmaHimawari:'自在武葵',
			boss_kuiquan: '阳光烈焰',
			boss_kuiquan_info: '你的【火攻】没有目标数量限制。出牌阶段，你可以将一张牌当的【火攻】使用。当你在【火攻】中弃置了【杀】后，获得目标的展示牌。',

			boss_MitoTsukino:'衔月脱兔',
			boss_bingdielei: '狱囚恶蕾',
			boss_bingdielei_info:'乙方角色受到伤害或令一名角色进入濒死状态的额定回合结束时，你可以获得一个额外回合。',
			boss_zhenyin: '协和音震',
			boss_zhenyin_info: '当你使用黑色牌指定目标后，可以将一名目标区域内的一张牌移至其下家，若引起冲突，进行替代并对下家造成 1 点伤害。',
			
						
			boss_xiaorui:'骁锐',
			boss_xiaorui2:'骁锐',
			boss_xiaorui_info:'友方角色于其回合内使用【杀】造成伤害后，其使用【杀】的次数+1。',
			boss_huchen:'虎臣',
			boss_huchen_info:'锁定技 你摸牌阶段摸牌数+X（X为你击杀的敌方角色数）。',
			boss_fengjian:'封缄',
			boss_fengjian2:'封缄',
			boss_fengjian_info:'受到你伤害的角色于其下个回合结束前，无法使用牌指定你为目标。',
			boss_keding:'克定',
			boss_keding_info:'当你使用【杀】或普通锦囊牌仅指定唯一目标时，你可以弃置任意张手牌，为其指定等量的额外目标。',
			boss_bashi:'拔矢',
			boss_bashi_info:'每当你成为其他角色使用的杀或普通锦囊牌的目标时，你可以从正面翻至背面，若如此做，此牌对你无效。',
			boss_danjing:'啖睛',
			boss_danjing_info:'友方角色进入濒死状态时，若你的体力值大于1，你可以失去1点体力，视为对其使用一张【桃】。',
			boss_jiaoxie:'缴械',
			boss_jiaoxie_info:'出牌阶段限一次，你可令敌方守城器械交给你一张牌。',
			boss_lianyujg:'炼狱',
			boss_lianyujg_info:'结束阶段，你可以对所有敌方角色造成1点火焰伤害',
			boss_didongjg:'地动',
			boss_didongjg_info:'结束阶段，你可以选择一名敌方角色将其武将牌翻面',
			boss_mojianjg:'魔箭',
			boss_mojianjg_info:'出牌阶段开始时，你可以对所有敌方角色使用一张万箭齐发',
			boss_jiguan:'机关',
			boss_jiguan_info:'锁定技 你不能成为【乐不思蜀】的目标',
			boss_lingyu:'灵愈',
			boss_lingyu_info:'结束阶段，你可以将自己的武将牌翻面，然后令所有已受伤的己方其他角色回复1点体力',
			boss_tianyun:'天陨',
			boss_tianyun_info:'结束阶段，你可以失去1点体力，然后令一名敌方角色随机受到2~3点火焰伤害并弃置其装备区里的所有牌。',
			boss_zhenwei:'镇卫',
			boss_zhenwei_info:'锁定技 其他己方角色的防御距离+1',
			boss_benlei:'奔雷',
			boss_benlei_info:'锁定技 准备阶段，你对敌方攻城器械随机造成2~3点雷电伤害。',
			boss_nailuo:'奈落',
			boss_nailuo_info:'结束阶段，你可以将你的武将牌翻面，令所有敌方角色弃置装备区内的所有牌',
			boss_tanshi:'贪食',
			boss_tanshi_info:'锁定技 结束阶段开始时，你须弃置一张手牌',
			boss_tunshi:'吞噬',
			boss_tunshi_info:'锁定技 准备阶段，你对所有手牌数量大于你的敌方角色造成1点伤害',
			boss_yuhuojg:'浴火',
			boss_yuhuojg_info:'锁定技 每当你受到火焰伤害时，防止此伤害',
			boss_qiwu:'栖梧',
			boss_qiwu_info:'每当你使用一张梅花牌，你可以令一名友方角色回复一点体力',
			boss_tianyujg:'天狱',
			boss_tianyujg_info:'锁定技 结束阶段，你令所有未横置的敌方角色横置',
			boss_gongshenjg:'工神',
			boss_gongshenjg_info:'结束阶段，若已方器械已受伤，你可以为其回复一点体力；否则你可以对敌方器械造成一点火焰伤害',
			boss_zhinang:'智囊',
			boss_zhinang_info:'准备阶段，你可以亮出牌堆顶的五张牌，你可以将其中锦囊或装备牌交给一名己方角色',
			boss_jingmiao:'精妙',
			boss_jingmiao_info:'锁定技 每当敌方角色使用的无懈可击生效后，你令其失去1点体力',
			boss_biantian:'变天',
			boss_biantian_info:'锁定技 准备阶段，你进行一次判定，若为红色，直到下个回合开始前，令敌方所有角色处于“狂风”状态，若为黑色，直到下个回合开始前，令己方所有角色处于“大雾”状态',
			boss_biantian2:'大雾',
			dawu:'大雾',
			boss_biantian3:'狂风',
			kuangfeng:'狂风',
			boss_lingfeng:'灵锋',
			boss_lingfeng_info:'摸牌阶段，你可以改为亮出牌堆顶的两张牌，然后获得之，若这些牌的颜色不同，你令一名敌方角色失去1点体力',
			boss_jizhen:'激阵',
			boss_jizhen_info:'锁定技 结束阶段，你令所有已受伤的己方角色摸一张牌',
			boss_huodi:'惑敌',
			boss_huodi_info:'结束阶段，若有武将牌背面朝上的己方角色，你可以令一名敌方角色将其武将牌翻面',
			boss_jueji:'绝汲',
			boss_jueji_info:'敌方角色摸牌阶段，若其已受伤，你可以令其少摸一张牌',
			boss_chuanyun:'穿云',
			boss_chuanyun_info:'结束阶段，你可以对体力比你多的一名其他角色造成1点伤害',
			boss_leili:'雷厉',
			boss_leili_info:'每当你的[杀]造成伤害后，你可以对另一名敌方角色造成1点雷电伤害',
			boss_fengxing:'风行',
			boss_fengxing_info:'准备阶段，你可以选择一名敌方角色，若如此做，视为对其使用了一张[杀]',
			boss_skonghun:'控魂',
			boss_skonghun_info:'出牌阶段开始时，若你已损失体力值不小于敌方角色数，你可以对所有敌方角色各造成1点雷电伤害，然后你恢复X点体力（X为受到伤害的角色数）',
			boss_fanshi:'反噬',
			boss_fanshi_info:'锁定技 结束阶段，你失去1点体力',
			boss_xuanlei:'玄雷',
			boss_xuanlei_info:'锁定技 准备阶段，令所有判定区内有牌的敌方角色受到1点雷电伤害',
			boss_chiying:'持盈',
			boss_chiying_info:'锁定技 每当己方角色受到多于1伤害时，你防止其余伤害',
			boss_jingfan:'惊帆',
			boss_jingfan_info:'锁定技 己方其他角色的进攻距离+1',
			longchuanzhibao:'龙船至宝',
			longchuanzhibao_bg:'船',
			zong:'粽',
			zong_info:'1. 出牌阶段对自己使用，回复1点体力；2. 自己或队友濒死时对其使用，目标角色回复1点体力',
			xionghuangjiu:'雄黄酒',
			xionghuangjiu_info:'1. 出牌阶段对自己使用，本回合使用的下一张【杀】伤害+1；若队友已死亡，改为使本回合使用的下一张牌伤害+1；2. 自己濒死时使用，回复1点体力',
			tongzhougongji:'同舟共济',
			tongzhougongji_info:'出牌阶段使用，选择一项：1.摸X张牌（X为你所在势力拥有的龙船至宝数）；2.你和队友各摸一张牌',
			lizhengshangyou:'力争上游',
			lizhengshangyou_info:'出牌阶段对所有角色使用，若目标角色的势力拥有龙船至宝，其回复1点体力，若目标角色的势力没有龙船至宝，其弃置一张牌',
			tunliang:'屯粮',
			tunliang_info:'出牌阶段，对至多三名角色使用。目标角色各摸一张牌。',
			yuanjun:'援军',
			yuanjun_info:'出牌阶段，对至多两名已受伤的角色使用。目标角色回复1点体力。',
			huoshaowuchao:'火烧乌巢',
			huoshaowuchao_info:'锁定技 本局游戏内造成的无属性伤害均视为火属性。',
			liangcaokuifa:'粮草匮乏',
			liangcaokuifa_info:'锁定技 所有角色摸牌阶段的额定摸牌数-1。当一名角色使用的牌结算完成后，若其因此牌造成了伤害，则其摸一张牌。',
			zhanyanliangzhuwenchou:'斩颜良诛文丑',
			zhanyanliangzhuwenchou_info:'锁定技 一名角色的回合开始时，其选择一项：视为使用一张不可被【无懈可击】响应的【决斗】，或失去1点体力。',
			shishengshibai:'十胜十败',
			shishengshibai_info:'锁定技 一名角色使用牌时，若此牌是整局游戏使用的第整十张牌且此牌不为延时锦囊牌或装备牌，则此牌所有目标角色再次成为此牌的目标角色。',
		},
		skill:{
			//boss夸
			boss_shenghuang:{
				locked:true,
				init:function(player){
					player.$.boss_shenghuang=0;
				},
				global:['boss_shenghuang_put'],
				group:['boss_shenghuang_draw', 'boss_shenghuang_lose', 'boss_shenghuang_ret', 'boss_shenghuang_rec'],
				subSkill:{
					put:{
						trigger:{global:'phaseBegin'},
						forced:true,
						silent:true,
						popup:false,
						priority:777,
						filter:function (event,player){
							return player.hp;
						},
						content:function(){
							player.$.boss_shenghuang_put = player.hp;
						}
					},
					draw:{
						init:function(player){
							player.$.boss_shenghuang_draw=4;
							if(player.hasSkill('boss_shenghuang_draw'))  player.markSkill('boss_shenghuang_draw');
						},
						marktext: '圣',
						mark: true,
						intro: {
							content:'剩余&张数值为2的体力卡',
							name:'剩余体力卡',
						},
						forced:true,
						priority:777,
						skillAnimation:true,
						animationColor:'gray',
						trigger:{
							player:"dying",
						},
						filter:function (event,player){
							return player.$.boss_shenghuang_draw>0
						},
						content:function(){
							player.maxHp=2;
							player.recover(player.maxHp-player.hp);
							player.$.boss_shenghuang_draw--;
							player.syncStorage('boss_shenghuang_draw');
							if(!player.$.boss_shenghuang_draw){
								player.unmarkSkill('boss_shenghuang_draw');
								player.removeSkill('boss_shenghuang_draw');
							}
						},
					},
					lose:{
						marktext: '愈',
						intro: {
							content:'当前回合已失去了黑色牌，在本回合结束时，其他角色将体力回复至回合开始时的状态。',
							name:'圣皇之愈',
						},
						trigger:{player:'loseAfter'},
						forced:true,
						priority:777,
						filter:function(event,player){
							if(!(event.getParent().cards||event.card))									return false;
							var cards = event.getParent().cards;
							var bc=0;
							for(var i=0;i<cards.length;i++){
								if(get.color(cards[i]) == 'black')	bc++;
							}
							return bc;
						},
						content:function(){
							player.$.boss_shenghuang++;
							player.markSkill('boss_shenghuang_lose');
						},
					},
					ret:{
						forced:true,
						silent:true,
						popup:false,
						priority:888,
						trigger:{global:'phaseAfter'},
						filter:function(event,player){
							return player.$.boss_shenghuang;
						},
						content:function(){
							player.$.boss_shenghuang=0;
							player.unmarkSkill('boss_shenghuang_lose');
						}
					},
					rec:{
						forced:true,
						priority:777,
						trigger:{global:'phaseEnd'},
						filter:function(event,player){
							if(!player.hasSkill('boss_shenghuang')||!player.$.boss_shenghuang>0)	return false;
							if(!game.hasPlayer(function(cur){
								return cur.isAlive()&&cur.isFriendOf(player)&&cur.$.boss_shenghuang_put;
							}))	return false;
							return true;
						},
						content:function(){
							'step 0'
							event.targets = game.filterPlayer(function(cur){
								return cur.isAlive()&&cur.isFriendOf(player)&&cur!=player&&cur.$.boss_shenghuang_put;
							})
							'step 1'
							if(event.targets.length){
								var target=event.targets.shift();
								var vq=target.$.boss_shenghuang_put-target.hp;
								if(vq>0){
									target.recover(vq);
								}
								player.line(target,'water');
								event.redo();
							}
						},
					}
				},
			},
			boss_renzhan:{
				priority:777,
				trigger:{global:'damageEnd'},
				forced:false,
				usable:1,
				check:function(event,player){
					if(player.$.boss_shenghuang_draw==0&&player.hp==1)		return false;
					return player.getUseValue({name:'sha'})>0;
				},
				filter:function(event,player){
					return event.player!=player&&event.player.hp>0;
				},
				logTarget:'player',
				content:function(){
					'step 0'
					player.loseHp();
					var card=get.cards()[0];
					var cards=[card];
					while(get.name(card)!='sha'){
						card=get.cards()[0];
						cards.push(card);
					}
					event.cards = cards;
					'step 1'
					game.cardsGotoOrdering(event.cards);
					game.delayx();
					'step 2'
					player.showCards(event.cards,'『瞬息刃斩』亮出牌堆');
					'step 3'
					cards = event.cards;
					game.log(player,'获得了', cards);
					player.gain(cards,'gain2');
					'step 4'
					var next=player.chooseTarget('###『刃斩』###指定一名角色，对其使用任意张【杀】',function(card,player,target){
						return player!=target;
					});
					next.set('targetprompt',['RUA']);
					next.set('forced',false);
					next.set('ai',function(target){
						var player = _status.event.player;
						var att=get.attitude(player,target);
						return 10-att;
					});
					'step 5'
					if(result.bool){
						var target = result.targets[0];
						event.target = target;
						game.log(player,'刃斩的目标为',target);
						target.addTempSkill('boss_renzhan2','phaseEnd');
						target.$.boss_renzhan2 = true;
						player.logSkill('renzhan',target);
						player.chooseToUse('对'+get.translation(target)+'使用杀',{name:'sha'},target ,-1);
					}
					else{
						event.finish();
					}
					'step 6'
					if(result.bool){
						var target = event.target;
						if(target.$.boss_renzhan2&&player.canUse({name:'sha'},target,false)){
							player.chooseToUse('对'+get.translation(target)+'继续使用杀',{name:'sha'},target ,-1);
						}}
					else{
						event.finish();
					}
					'step 7'
					var target = event.target;
					if(result.bool){
						if(target.$.boss_renzhan2&&player.canUse({name:'sha'},target,false)){
							event.goto(6);
						}
					}
					if(target){
						target.unmarkSkill('boss_renzhan2');
						target.removeSkill('boss_renzhan2');
					}
				},
				ai:{
					maixie:true,
				},
			},
			boss_renzhan2:{
				marktext:"危",
				locked:true,
				intro:{
					name:'危',
					content:'成为瞬息刃斩的目标',
				},
				mark:true,
				firstDo:true,
				silent:true,
				forced:true,
				popup:false,
				trigger:{player:'dying'},
				filter:function(event,player){
					return player.isAlive();
				},
				onremove:true,
				content:function(){
					player.$.boss_renzhan2 = false;
				},
			},
			boss_kuase:{
				unique:true,
				limited:true,
				skillAnimation:true,
				priority:888,
				animationStr:'夸色☆超级梦想',
				trigger:{global:'phaseAfter'},
				prompt:function(){
					var player=_status.event.player;
					return '是否发动『阿库娅色☆超级梦想』<br>（本回合所有角色回复体力之和为'+player.$.boss_kuase_date+'点）';
				},
				filter:function(event,player){
					return player.$.boss_kuase_date;
				},
				check:function(event,player){
					return !player.$.boss_shenghuang_draw||player.$.boss_kuase_date>=player.$.boss_shenghuang_draw;
				},
				content:function(){
					var dream = player.$.boss_kuase_date;
					player.draw(dream);
					player.getStat().card.sha=0;
					player.phaseUse();
					player.$.boss_kuase = true;
					player.awakenSkill('boss_kuase');
				},
				group:['boss_kuase_date','boss_kuase_ret'],
				subSkill:{
					date:{
						init:function(player){
							player.$.boss_kuase_date = 0;
						},
						forced:true,
						silent:true,
						popup:false,
						priority:777,
						trigger:{global:'recoverAfter'},
						filter:function(event,player){
							return true;
						},
						content:function(){
							player.$.boss_kuase_date += trigger.num;
						},
					},
					ret:{
						forced:true,
						silent:true,
						popup:false,
						priority:666,
						trigger:{global:'phaseAfter'},
						filter:function(event,player){
							return player.$.boss_kuase_date;
						},
						content:function(){
							player.$.boss_kuase_date=0;
						}
					}
				}
			},
			//boss可可
			boss_zaoankeke:{
				trigger:{player:'useCardToPlayered'},
				forced:true,
				priority:29,
				logTarget:'target',
				filter:function(event,player){
					if(event.target==player)				return false;
					if(event.target.countCards('he')==0)	return false;
					return event.card.name =='sha';
				},
				content:function(){	
					'step 0'
					var target=trigger.target;

					if(trigger.getParent().card.nature)		//如果此杀为属性杀
					{				
						player.line(target,'green');
						target.chooseCard('参加“早安可可”录制，需要交给'+get.translation(player)+'一张牌','he',true).set('ai',function(card){
							var name = card.name;
							if(name=='shan') return 30;
							return 100-get.value(card);											
						});											
					}
					else							
					{
						target.chooseToDiscard('参加“早安可可”录制，需要弃置一张牌','he',true).set('ai',function(card){
							var name = card.name;
							if(name=='shan') return 30;
							return 100-get.value(card);													
						});				
					}
					'step 1'
					if(trigger.getParent().card.nature){
						player.gain(result.cards,target,'give');
					}
				}
			},
			boss_jierizhanbei:{
				group:['boss_jierizhanbei_useE' , 'boss_jierizhanbei_getE'],
				subSkill:{
					useE:{
						init:function(player){
							player.$.boss_jierizhanbei=0;
						},
						trigger:{player:'useCard'},
						forced:true,
						priority:17,
						usable:1,
						filter:function(event,player){
							return get.type(event.card)=='equip';
						},
						content:function(){
							player.$.boss_jierizhanbei++;
						},
						mod:{
							maxHandcard:function(player,num){
								if(player.$.boss_jierizhanbei>0)	return 5;
							},
						},
					},
					getE:{
						init:function (player){
							player.$.boss_jierizhanbei=0;
						},
						trigger:{player:'phaseEnd'},
						forced:true,
						priority:13,
						filter:function(event,player){
							var num = player.$.boss_jierizhanbei
							if(num!=0){									
								player.$.boss_jierizhanbei=0;
								return false;
							}
							return true;
						},
						content:function(){
							console.log(player.$.boss_jierizhanbei);
								var getC = get.cardPile2(function(card){
									return get.type(card)=='equip';
								})
								if(getC){
									player.gain(getC,'gain2');
								}
								else{
									game.log(player,'牌堆中没有装备牌了');
								}
							
						}
					}
				}
			},
			boss_esuyingye:{
				trigger:{player:'phaseBegin'},
				forced:false,
				priority:31,
				filter:function(event,player){
					return event.player==player&&player.countDiscardableCards(player,'ej')>0;
				},
				content:function(){
					'step 0'
					var nh=trigger.player.countCards('h');
					var eff=get.effect(trigger.player,{name:'sha',isCard:true},player,player);
					player.discardPlayerCard('请开始自己的表演',player,'ej').set('ai',function(button){
						var name=button.link.viewAs||button.link.name;
						var nh=_status.event.nh;
						if(name=='lebu'&&nh>trigger.player.hp) return 150;
						if(name=='bingliang'&&nh<trigger.player.hp) return 150;
						return 100-get.value(button.link);													
					}).set('nh',nh);
					'step 1'
					if(result.cards){
						var getC = result.cards[0];
						if(get.type(getC) =='equip'){
							player.logSkill('boss_esuyingye');
							player.addTempSkill('boss_esuyingye_addDam');
							game.putBuff(player, 'boss_esuyingye', '.player_buff')
						}
					}
				},
				subSkill: {
					addDam: {
						direct: true, 
						silent: true,
						trigger: {
							source: 'damageBegin',
						},
						content: function() {
							trigger.num++;
							player.removeSkill('boss_esuyingye_addDam');						
						},
						onremove: function(player, skill) {
							game.clearBuff(player, 'boss_esuyingye')
						}
					}
				}
			},
			boss_zuoyututan:{
				init:function (player){
					player.$.boss_zuoyututan=1;
					player.$.boss_zuoyututanUse=true;
				},
				mark:true,
				locked:false,
				zhuanhuanji:true,
				marktext:'碳',
				intro:{
					content:function(storage,player,skill){
						if(player.$.boss_zuoyututan==1) return '随机废除一个装备栏';
						else if(player.$.boss_zuoyututan==1) return '手牌上限-1';
						else return '获得一张进入弃牌堆后即移出游戏的【毒】'
					},
				},
				group:["boss_zuoyututan_1","boss_zuoyututan_2","boss_zuoyututan_3","boss_zuoyututan_clear"],
				subSkill:{
					'1':{
						trigger:{global:'roundStart'},
						filter:function(event,player){
							if(player.$.boss_zuoyututan!=1){
								return false;
							}
							return !player.hasSkill('boss_zuoyututan_stop');
						},
						forced: true,
						content:function(){
							'step 0'
							var list=[];
							for(var i=1;i<6;i++){
								list.push(i);
							}
							event.disableEquip=list.randomGet();
							player.markSkill('boss_zuoyututan');
							game.log('所有敌方角色废除'+get.translation('equip'+event.disableEquip));
							'step 1'
							game.filterPlayer(function(current){
								if(!current.isEnemyOf(player)){
									return false;
								}
								if(!current.isDisabled(event.disableEquip)){
									current.disableEquip(event.disableEquip);
								}
							})
							game.delayx();
							'step 2'
							player.$.boss_zuoyututan=2;
							player.$.boss_zuoyututanUse=false;
							player.addTempSkill('boss_zuoyututan_stop');
							player.syncStorage('boss_zuoyututan');
						},
					},
					'2':{
						trigger:{global:'roundStart'},
						filter:function(event,player){
							if(player.$.boss_zuoyututan!=2){
								return false;
							}
							return !player.hasSkill('boss_zuoyututan_stop');
						},
						forced: true,
						content:function(){
							'step 0'
							var list=[];
							for(var i=1;i<6;i++){
								list.push(i);
							}
							event.disableEquip=list.randomGet();
							player.markSkill('boss_zuoyututan');
							game.log('所有敌方角色手牌上限-1');
							'step 1'
							game.filterPlayer(function(current){
								if(!current.isEnemyOf(player)){
									return false;
								}
								if(current.hasSkill('boss_zuoyututanLimit')){
									current.$.boss_zuoyututanLimit++;
								}
								else{
									current.addSkill('boss_zuoyututanLimit');
								}
							})
							game.delayx();
							'step 2'
							player.$.boss_zuoyututan=3;
							player.$.boss_zuoyututanUse=false;
							player.addTempSkill('boss_zuoyututan_stop');
							player.syncStorage('boss_zuoyututan');
						},
					},
					'3':{
						trigger:{global:'roundStart'},
						filter:function(event,player){
							if(player.$.boss_zuoyututan!=3){
								return false;
							}
							return !player.hasSkill('boss_zuoyututan_stop');
						},
						forced: true,
						content:function(){
							'step 0'
							var list=[];
							for(var i=1;i<6;i++){
								list.push(i);
							}
							event.disableEquip=list.randomGet();
							player.markSkill('boss_zuoyututan');
							game.log('所有敌方角色获得一张【毒】');
							'step 1'
							game.filterPlayer(function(current){
								if(current.isEnemyOf(player)){
									return false;
								}
								var newcard=game.createCard2('du','spade',1);
								game.zhu.$giveAuto(newcard,current);
								current.gain(newcard);
							})
							game.delayx();
							'step 2'
							player.$.boss_zuoyututan=1;
							player.$.boss_zuoyututanUse=false;
							player.addTempSkill('boss_zuoyututan_stop');
							player.syncStorage('boss_zuoyututan');
						},
					},
					clear:{
						trigger:{global:'loseAfter'},
						filter:function(event,player){
							if(_status.event.getParent('gain')!=={}&&_status.event.getParent('gain')!=null) return false;
							if(!event.visible) return false;
							if(event.player==player) return false;
							for(var i=0;i<event.cards2.length;i++){
								if(get.name(event.cards2[i])=='du'&&get.suit(event.cards2[i],event.player)=='club'&&get.number(event.cards2[i])==1){
									return true;
								}
							}
							return false;
						},
						direct:true,
						content:function(){
							"step 0"
							if(trigger.delay==false) game.delay();
							"step 1"
							var cards=[];
							for(var i=0;i<trigger.cards2.length;i++){
								if(get.name(event.cards2[i])=='du'&&get.suit(event.cards2[i],event.player)=='club'&&get.number(event.cards2[i])==1){
									cards.push(trigger.cards2[i]);
								}
							}
							if(cards.length){
								game.cardsGotoSpecial(cards);
							}
						}
					},
					stop:{}
				},
			},
			boss_zuoyututanLimit:{
				init:function(player){
					player.$.boss_zuoyututanLimit=1;
				},
				mark:true,
				intro:{
					content:function(storage,player,skill){
						return '手牌上限减少'+player.$.boss_zuoyututanLimit;
					}
				},
				marktext:'碳',
				mod:{
					maxHandcard:function(player,num){
						return num-player.$.boss_zuoyututanLimit;
					},
				}
			},
			//boss阿葵
			boss_kuiquan:{
				audio:2,
				enable:'chooseToUse',
				filterCard:true,
				viewAs:{name:'huogong',nature:'fire'},
				viewAsFilter:function(player){
					if(!player.isPhaseUsing()) return false;
				},
				check:function(card){
					var player=_status.currentPhase;
					if(player.countCards('h')>player.hp||player.countCards('h',{name:'sha'})>0){
						if(card.name=='sha')	return 4-get.value(card);
						return 6-get.value(card);
					}
					return 3-get.value(card)
				},
				ai:{
					kuiquan:true,
					fireAttack:true,
				},
				mod:{
					selectTarget:function(card,player,range){
						if(range[1]==-1) return;
						if(card.name=='huogong') range[1]+=Infinity;
					},
				},
			},
			//boss美兔
			boss_bingdielei:{
				group:'boss_bingdielei_damageBy',
				subSkill:{
					damageBy:{
						trigger:{global:['damageBegin4','dying']},
						priority:99,
						filter:function(event,player){
							if(_status.event.getParent('phase').skill)	return false;
							if(event.name=='damage')	return event.player.isFriendOf(player);
							else	return event.getParent()&&event.getParent().source&&event.getParent().source.isFriendOf(player);
						},
						direct:true,
						content:function(){
							"step 0"
							if(trigger.delay==false) game.delay();
							"step 1"
							player.logSkill(event.name);
							player.addTempSkill('boss_bingdielei_anotherPhase');
						},
					},
					anotherPhase:{
						audio:'bingdielei',
						trigger:{global:'phaseEnd'},
						marktext: '并',
						mark:true,
						intro: {
							content:'当前回合结束后获得一个额外回合',
							name:'并蒂恶蕾',
						},
						content:function(){
							player.markSkill(event.name);
							game.delayx();
							player.insertPhase();
						},
					},
				},
			},
			boss_zhenyin: {
				audio:'zhenyin',
				trigger: {
					player: 'useCardToPlayered',
				},
				filter: function(event, player) {
					var num=0;
					event.targets.forEach(function(tar){
						num+=tar.countCards('ej');
					})
					return event.targets.length
						&& num>0
						&& get.color(event.card)=='black';
					
				},
				content: function() {
					'step 0'
					player.chooseTarget('选择『协和音震』的目标',function(card,player,target){
						return _status.event.targets.contains(target);
					}).set('targets',trigger.targets);
					'step 1'
					event.A = result.targets[0];
					event.B = event.A.next;
					if (!event.A.countCards('hej')) event.finish();
					player.choosePlayerCard('hej', event.A).set('ai',function(button){
						var player = _status.event.player;
						var source = _status.event.target;
						var target = source.next;
						var link = button.link;
						if(get.position(link)=='j'){
							if(target.canAddJudge(link))	return get.effect(target,link,player,player);
							else	return get.damageEffect(target,player,player);
						}else if(get.position(link)=='e'){
							var subtype = get.subtype(link);
							if(!target.getEquip(subtype))	return get.effect(target,link,player,player);
							else	return get.damageEffect(target,player,player);
						}
					});
					'step 2'
					if (result.bool) {
						var card = result.links[0];
						var dam = false;
						if(get.position(card)=='e'){
							var c = event.B.getEquip(get.subtype(card));
							if (c) {
								dam = true;
								game.log(c, '掉落了');
							}
							re = event.B.equip(card);
						}
						else {
							var cname = card.viewAs ? card.viewAs : get.name(card);
							event.B.getCards('j').forEach(function(c) {
								if (get.name(c) == cname) {
									game.log(c, '掉落了');
									game.cardsDiscard(c);
									dam = true;
								}
							})
							event.B.addJudge({name: cname}, [card]);
						}
						event.A.$give(card, event.B)
						if (dam) event.B.damage('nocard');
						game.delay();
					}
				}
			},

			
			huoshaowuchao:{
				trigger:{global:'damageBefore'},
				silent:true,
				firstDo:true,
				filter:function(event,player){
					return !lib.linked.contains(event.nature);
				},
				content:function(){
					trigger.nature='fire';
				},
			},
			liangcaokuifa:{
				trigger:{player:['useCardAfter','phaseDrawBegin']},
				silent:true,
				filter:function(event,player){
					if(event.name=='phaseDraw') return true;
					return player.getHistory('sourceDamage',function(evt){
						return evt.card==event.card;
					}).length>0;
				},
				content:function(){
					if(trigger.name=='phaseDraw') trigger.num--;
					else player.draw();
				},
			},
			zhanyanliangzhuwenchou:{
				trigger:{player:'phaseBegin'},
				silent:true,
				content:function(){
					'step 0'
					player.chooseUseTarget({
						name:'juedou',
						isCard:true,
						storage:{nowuxie:true}
					},
					'选择一名角色，视为对其使用【决斗】','或点【取消】失去1点体力');
					'step 1'
					if(!result.bool) player.loseHp();
				},
			},
			shishengshibai:{
				mod:{
					aiOrder:function(player,card,num){
						if(_status.shishengshibai&&_status.shishengshibai%10==9){
							if(['sha','tao','guohe','shunshou','tunliang','wuzhong','juedou','yuanjun'].contains(card.name)) return num+15;
						}
					},
				},
				trigger:{
					player:['useCard1','useCardToTargeted'],
				},
				silent:true,
				filter:function(event,player,name){
					if(name=='useCard1') return true;
					if(!event.parent.shishengshibai||event.targets.length!=event.parent.triggeredTargets4.length) return false;
					if(!event.targets||!event.targets.length||['delay','equip'].contains(get.type(event.card))) return false;
					return true;
				},
				content:function(){
					if(event.triggername=='useCard1'){
						if(!_status.shishengshibai) _status.shishengshibai=0;
						_status.shishengshibai++;
						game.broadcastAll(function(num){
							if(ui.guanduInfo) ui.guanduInfo.innerHTML='当前事件：十胜十败（'+num+'）';
						},_status.shishengshibai);
						if(_status.shishengshibai%10==0) trigger.shishengshibai=true;
					}
					else{
						trigger.getParent().targets=trigger.getParent().targets.concat(trigger.targets);
						trigger.getParent().triggeredTargets4=trigger.getParent().triggeredTargets4.concat(trigger.targets);
					}
				},
				ai:{
					result:{
						player:function(card,player,target){
							if(_status.shishengshibai&&_status.shishengshibai%10==9&&card.name=='tiesuo') return 'zerotarget';
						},
					},
				},
			},
			xionghuangjiu:{
				trigger:{source:'damageBegin1'},
				filter:function(event,player){
					return event.card&&event.card==player.$.xionghuangjiu&&event.notLink();
				},
				forced:true,
				content:function(){
					trigger.num++;
				},
				temp:true,
				vanish:true,
				onremove:function(player){
					game.addVideo('jiuNode',player,false);
					if(player.node.jiu){
						player.node.jiu.delete();
						player.node.jiu2.delete();
						delete player.node.jiu;
						delete player.node.jiu2;
					}
					delete player.$.xionghuangjiu;
				},
				group:['xionghuangjiu2','xionghuangjiu3']
			},
			xionghuangjiu2:{
				trigger:{player:'useCardAfter',global:'phaseAfter'},
				priority:2,
				filter:function(event,player){
					if(event.name=='useCard') return (event.card&&event.card==player.$.xionghuangjiu);
					return true;
				},
				forced:true,
				popup:false,
				audio:false,
				content:function(){
					game.broadcastAll(function(player){
						player.removeSkill('xionghuangjiu');
					},player);
				},
			},
			xionghuangjiu3:{
				trigger:{player:'useCard'},
				silent:true,
				filter:function(event,player){
					return !player.$.xionghuangjiu;
				},
				content:function(){
					player.$.xionghuangjiu=trigger.card;
				}
			},
			longchuanzhibao:{
				mark:'auto',
				nopop:true,
				init:function(player){
					player.$.longchuanzhibao=0;
				},
				intro:{
					content:function(storage,player){
						var str='已有'+storage+'个龙船至宝，'+get.translation(player.side)+'势力共有';
						var num=storage;
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].side==player.side&&game.players[i]!=player){
								num+=game.players[i].storage.longchuanzhibao;break;
							}
						}
						str+=num+'个龙船至宝。新一轮开始时，拥有至少4个龙船至宝的势力获胜';
						return str;
					}
				},
				trigger:{source:'damageEnd'},
				silent:true,
				filter:function(event,player){
					return event.player.$.longchuanzhibao>0;
				},
				content:function(){
					player.gainZhibao(1,trigger.player);
					game.delay();
				},
				group:'longchuanzhibao_over',
				subSkill:{
					over:{
						trigger:{player:'roundStart'},
						silent:true,
						filter:function(){
							var map={holo:0,nijisanji:0,vtuber:0,clubs:0};
							for(var i=0;i<game.players.length;i++){
								var current=game.players[i];
								map[current.side]+=current.$.longchuanzhibao;
								if(map[current.side]>=4){
									_status.winside=current.side;
									return true;
								}
							}
						},
						content:function(){
							for(var i=0;i<game.players.length;i++){
								game.players[i].classList.remove('current_action');
							}
							var me=game.me._trueMe||game.me;
							game.over(_status.winside==me.side);
						}
					}
				}
			},
			//剑阁技能
			boss_xiaorui:{
				trigger:{global:'damageSource'},
				forced:true,
				logTarget:'source',
				filter:function(event,player){
					var target=event.source;
					return target&&target==_status.currentPhase&&target.isAlive()&&target.isFriendOf(player)&&event.card&&event.card.name=='sha'&&event.getParent().type=='card';
				},
				content:function(){
					var source=trigger.source;
					source.addTempSkill('boss_xiaorui2');
					source.addMark('boss_xiaorui2',1,false);
				}
			},
			boss_xiaorui2:{
				onremove:true,
				charlotte:true,
				mod:{
					cardUsable:function(card,player,num){
						if(card.name=='sha') return num+player.countMark('boss_xiaorui2');
					},
				},
			},
			boss_huchen:{
				trigger:{
					player:'phaseDrawBegin2',
					source:'dieAfter',
				},
				forced:true,
				filter:function(event,player){
					if(event.name=='die') return event.player.isEnemyOf(player);
					return !event.numFixed&&player.countMark('boss_huchen')>0;
				},
				content:function(){
					if(trigger.name=='die') player.addMark('boss_huchen',1);
					else trigger.num+=player.countMark('boss_huchen');
				},
				intro:{
					content:'已斩杀过$名敌将',
				},
			},
			boss_fengjian:{
				trigger:{source:'damageSource'},
				forced:true,
				filter:function(event,player){
					return event.player.isAlive();
				},
				logTarget:'player',
				content:function(){
					trigger.player.addTempSkill('boss_fengjian2',{player:'phaseAfter'});
					trigger.player.markAuto('boss_fengjian2',[player]);
				},
			},
			boss_fengjian2:{
				onremove:true,
				intro:{
					content:'不能对$使用牌',
				},
				mod:{
					playerEnabled:function(card,player,target){
						if(player.getStorage('boss_fengjian2').contains(target)) return false;
					},
				},
			},
			boss_keding:{
				trigger:{player:'useCard2'},
				direct:true,
				filter:function(event,player){
					if(!event.targets||event.targets.length!=1) return false;
					var card=event.card;
					if(card.name!='sha'&&get.type(card)!='trick')return false;
					var info=get.info(card);
					if(info.allowMultiple==false) return false;
					if(!player.countCards('h')) return false;
					if(!info.multitarget){
						if(game.hasPlayer(function(current){
							return !event.targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&lib.filter.targetInRange(card,player,current);
						})){
							return true;
						}
					}
					return false;
				},
				content:function(){
					'step 0'
					var card=trigger.card;
					var prompt2='弃置任意张手牌，并为'+get.translation(card)+'增加等量的目标';
					var targets=game.filterPlayer(function(current){
						return !trigger.targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&lib.filter.targetInRange(card,player,current);
					});
					var max=0;
					if(!trigger.targets[0].hasSkill('heiguangkai_skill')) max=targets.filter(function(target){
						return get.effect(target,card,player,player)>0;
					}).length;
					player.chooseCardTarget({
						prompt:get.prompt('boss_keding'),
						prompt2:prompt2,
						selectCard:function(){
							var player=_status.event.player;
							var targets=_status.event.targets;
							return [Math.max(1,ui.selected.targets.length),Math.min(targets.length,player.countCards('h'))];
						},
						selectTarget:function(){
							return ui.selected.cards.length;
						},
						position:'h',
						filterCard:lib.filter.cardDiscardable,
						filterTarget:function(card,player,target){
							return _status.event.targets.contains(target);
						},
						targets:targets,
						ai1:function(card){
							if(ui.selected.cards.length>=_status.event.max) return 0;
							return 5-get.value(card);
						},
						ai2:function(target){
							if(target.hasSkill('heiguangkai_skill')) return 0;
							var trigger=_status.event.getTrigger();
							var player=_status.event.player;
							return get.effect(target,trigger.card,player,player);
						},
						max:max,
					});
					'step 1'
					if(result.bool){
						player.logSkill('boss_keding',result.targets);
						player.discard(result.cards);
						trigger.targets.addArray(result.targets);
					}
				},
			},
			boss_bashi:{
				filter:function(event,player){
					return event.player!=player&&event.card&&(event.card.name=='sha'||get.type(event.card)=='trick')&&!player.isTurnedOver();
				},
				logTarget:'player',
				check:function(event,player){
					if(event.getParent().excluded.contains(player)) return false;
					if(get.attitude(player,event.player)>0){
						return false;
					}
					if(get.tag(event.card,'respondSha')){
						if(player.countCards('h',{name:'sha'})==0){
							return true;
						}
					}
					else if(get.tag(event.card,'respondShan')){
						if(player.countCards('h',{name:'shan'})==0){
							return true;
						}
					}
					else if(get.tag(event.card,'damage')){
						if(event.card.name=='shuiyanqijunx') return player.countCards('e')<2;
						return true;
						//if(player.countCards('h')<2) return true;
					}
					return false;
				},
				trigger:{target:'useCardToTargeted'},
				content:function(){
					player.turnOver();
					trigger.getParent().excluded.add(player);
				},
			},
			boss_danjing:{
				trigger:{global:'dying'},
				filter:function(event,player){
					return player.hp>1&&event.player.hp<1&&event.player.isFriendOf(player);
				},
				check:function(event,player){
					var target=event.player;
					return get.attitude(player,target)>0&&lib.filter.cardSavable({name:'tao',isCard:true},player,target);
				},
				logTarget:'player',
				content:function(){
					'step 0'
					player.loseHp();
					'step 1'
					var card={name:'tao',isCard:true};
					if(lib.filter.cardSavable(card,player,trigger.player)) player.useCard(card,trigger.player);
				},
			},
			boss_jiaoxie:{
				enable:'phaseUse',
				usable:1,
				filter:function(event,player){
					return game.hasPlayer(function(current){
						return lib.skill.boss_jiaoxie.filterTarget(null,player,current);
					});
				},
				filterTarget:function(card,player,target){
					return target.isEnemyOf(player)&&target.type=='mech'&&target.countCards('he')>0;
				},
				content:function(){
					'step 0'
					if(!target.countCards('he')) event.finish();
					else target.chooseCard('he',true,'将一张牌交给'+get.translation(player));
					'step 1'
					if(result.bool){
						player.gain(result.cards,target,'give');
					}
				},
				ai:{
					order:9,
					result:{
						target:function(player,target){
							if(target.countCards('e',function(card){
								return get.value(card,target)<=0;
							})>0) return 1;
							return -1;
						},
					},
				},
			},
			boss_didongjg:{
				trigger:{player:'phaseEnd'},
				direct:true,
				content:function(){
					"step 0"
					player.chooseTarget(get.prompt('boss_didongjg'),function(card,player,target){
						return target.isEnemyOf(player);
					}).ai=function(target){
						var att=get.attitude(player,target);
						if(target.isTurnedOver()){
							if(att>0){
								return att+5;
							}
							return -1;
						}
						if(player.isTurnedOver()){
							return 5-att;
						}
						return -att;
					};
					"step 1"
					if(result.bool){
						player.logSkill('boss_didongjg',result.targets);
						result.targets[0].turnOver();
					}
				},
				ai:{
					threaten:1.7
				}
			},
			boss_lianyujg:{
				trigger:{player:'phaseEnd'},
				unique:true,
				content:function(){
					"step 0"
					event.players=game.filterPlayer(function(current){
					    return current.isEnemyOf(player);
					});
					"step 1"
					if(event.players.length){
						var current=event.players.shift();
						player.line(current,'fire');
						current.damage('fire');
						event.redo();
					}
				},
				ai:{
					threaten:2
				}
			},
			boss_mojianjg:{
				trigger:{player:'phaseUseBegin'},
				content:function(){
					var list=game.filterPlayer(function(current){
						return player.canUse('wanjian',current)&&current.isEnemyOf(player);
					});
					list.sort(lib.sort.seat);
					player.useCard({name:'wanjian'},list);
				},
				ai:{
					threaten:1.8
				}
			},
			boss_qiwu:{
				audio:true,
				trigger:{player:'useCard'},
				direct:true,
				filter:function(event,player){
					if(get.suit(event.card)=='club'){
						return game.hasPlayer(function(current){
							return current.isFriendOf(player)&&current.isDamaged();
						});
					}
					return false;
				},
				content:function(){
					"step 0"
					var noneed=(trigger.card.name=='tao'&&trigger.targets[0]==player&&player.hp==player.maxHp-1);
					player.chooseTarget(get.prompt('boss_qiwu'),function(card,player,target){
						return target.hp<target.maxHp&&target.isFriendOf(player);
					}).ai=function(target){
						var num=get.attitude(player,target);
						if(num>0){
							if(noneed&&player==target){
								num=0.5;
							}
							else if(target.hp==1){
								num+=3;
							}
							else if(target.hp==2){
								num+=1;
							}
						}
						return num;
					}
					"step 1"
					if(result.bool){
						player.logSkill('qiwu',result.targets);
						result.targets[0].recover();
					}
				},
				ai:{
					expose:0.3,
					threaten:1.5
				}
			},
			boss_tianyujg:{
				audio:true,
				trigger:{player:'phaseEnd'},
				forced:true,
				filter:function(event,player){
					return game.hasPlayer(function(current){
						return current.isEnemyOf(player)&&!current.isLinked();
					});
				},
				content:function(){
					"step 0"
					event.targets=game.filterPlayer();
					event.targets.sort(lib.sort.seat);
					"step 1"
					if(event.targets.length){
						var target=event.targets.shift();
						if(!target.isLinked()&&target.isEnemyOf(player)){
							player.line(target,'green');
							target.link();
						}
						event.redo();
					}
				}
			},
			boss_jueji:{
				audio:2,
				trigger:{global:'phaseDrawBegin'},
				filter:function(event,player){
					if(event.player.isFriendOf(player)){
						return false;
					}
					return event.num>0&&event.player!=player&&event.player.hp<event.player.maxHp;
				},
				logTarget:'player',
				content:function(){
					player.line(trigger.player,'green');
					trigger.num--;
				},
				ai:{
					expose:0.2,
					threaten:1.4
				}
			},
			boss_huodi:{
				audio:2,
				trigger:{player:'phaseEnd'},
				direct:true,
				filter:function(event,player){
					return game.hasPlayer(function(current){
						return current.isFriendOf(player)&&current.isTurnedOver();
					});
				},
				content:function(){
					"step 0"
					player.chooseTarget(get.prompt('boss_huodi'),function(card,player,target){
						return !target.isFriendOf(player);
					}).ai=function(target){
						if(target.isTurnedOver()) return 0;
						return -get.attitude(player,target);
					};
					"step 1"
					if(result.bool){
						player.logSkill('boss_huodi',result.targets);
						result.targets[0].turnOver();
					}
				},
				ai:{
					expose:0.2
				}
			},
			boss_chuanyun:{
				audio:true,
				trigger:{player:'phaseEnd'},
				direct:true,
				content:function(){
					"step 0"
					player.chooseTarget(get.prompt('boss_chuanyun'),function(card,player,target){
						return player.hp<target.hp;
					}).ai=function(target){
						return get.damageEffect(target,player,player);
					}
					"step 1"
					if(result.bool){
						player.logSkill('boss_chuanyun',result.targets);
						result.targets[0].damage();
					}
				},
			},
			boss_leili:{
				audio:2,
				trigger:{source:'damageEnd'},
				direct:true,
				filter:function(event){
					return event.card&&event.card.name=='sha';
				},
				content:function(){
					"step 0"
					player.chooseTarget(get.prompt('boss_leili'),function(card,player,target){
						if(target==trigger.player) return false;
						return target.isEnemyOf(player);
					}).ai=function(target){
						return get.damageEffect(target,player,player,'thunder');
					}
					"step 1"
					if(result.bool){
						player.logSkill('boss_leili',result.targets);
						result.targets[0].damage('thunder');
					}
				},
				ai:{
					expose:0.2,
					threaten:1.3
				}
			},
			boss_fengxing:{
				audio:true,
				trigger:{player:'phaseBegin'},
				direct:true,
				content:function(){
					"step 0"
					player.chooseTarget(get.prompt('boss_fengxing'),function(card,player,target){
						if(target.isFriendOf(player)) return false;
						return lib.filter.targetEnabled({name:'sha'},player,target);
					}).ai=function(target){
						return get.effect(target,{name:'sha'},player);
					}
					"step 1"
					if(result.bool){
						player.logSkill('boss_fengxing');
						player.useCard({name:'sha'},result.targets,false);
					}
				},
				ai:{
					expose:0.2,
					threaten:1.3
				}
			},
			boss_xuanlei:{
				audio:true,
				trigger:{player:'phaseBegin'},
				forced:true,
				filter:function(event,player){
					return game.hasPlayer(function(current){
						return current.isEnemyOf(player)&&current.countCards('j');
					});
				},
				content:function(){
					"step 0"
					event.targets=game.filterPlayer(function(current){
						return current.isEnemyOf(player)&&current.countCards('j');
					});
					event.targets.sort(lib.sort.seat);
					player.line(event.targets,'thunder');
					"step 1"
					if(event.targets.length){
						event.targets.shift().damage('thunder');
						event.redo();
					}
				}
			},
			boss_fanshi:{
				audio:true,
				trigger:{player:'phaseEnd'},
				forced:true,
				check:function(){
					return false;
				},
				content:function(){
					player.loseHp();
				}
			},
			boss_skonghun:{
				audio:true,
				trigger:{player:'phaseUseBegin'},
				filter:function(event,player){
					var num=player.maxHp-player.hp;
					if(num==0) return false;
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].side!=player.side){
							num--;
						}
					}
					return num>=0;
				},
				forced:true,
				content:function(){
					'step 0'
					var targets=game.filterPlayer(function(current){
						return current.isEnemyOf(player);
					});
					targets.sort(lib.sort.seat);
					event.targets=targets;
					player.line(targets,'thunder');
					event.num=targets.length;
					'step 1'
					if(event.targets.length){
						event.targets.shift().damage('thunder');
						event.redo();
					}
					'step 2'
					player.recover(event.num);
				},
				ai:{
					threaten:function(player,target){
						if(target.hp==1) return 2;
						if(target.hp==2&&game.players.length<8) return 1.5;
						return 0.5;
					},
				}
			},
			boss_chiying:{
				audio:2,
				trigger:{global:'damageBegin4'},
				forced:true,
				filter:function(event,player){
					if(event.num<=1) return false;
					return event.player.isFriendOf(player);
				},
				content:function(){
					trigger.num=1;
				}
			},
			boss_jingfan:{
				global:'boss_jingfan2',
			},
			boss_jingfan2:{
				mod:{
					globalFrom:function(from,to,distance){
						if(to.isEnemyOf(from)) return;
						var players=game.filterPlayer();
						for(var i=0;i<players.length;i++){
							if(players[i].hasSkill('boss_jingfan')&&
								players[i].isFriendOf(from)&&players[i]!=from){
								return distance-1;
							}
						}
					}
				}
			},
			boss_lingyu:{
				trigger:{player:'phaseEnd'},
				check:function(event,player){
					if(player.isTurnedOver()) return true;
					var num=0,players=game.filterPlayer();
					for(var i=0;i<players.length;i++){
						if(players[i].hp<players[i].maxHp&&
							players[i].isFriendOf(player)&&get.recoverEffect(players[i])>0){
							if(players[i].hp==1){
								return true;
							}
							num++;
							if(num>=2) return true;
						}
					}
					return false;
				},
				content:function(){
					'step 0'
					player.turnOver();
					'step 1'
					var list=game.filterPlayer(function(current){
						return current.isDamaged()&&current.isFriendOf(player);
					});
					player.line(list,'green');
					event.targets=list;
					'step 2'
					if(event.targets.length){
						event.targets.shift().recover();
						event.redo();
					}
				},
				ai:{
					threaten:1.5,
					effect:{
						target:function(card,player,target){
							if(card.name=='guiyoujie') return [0,1];
						}
					}
				},
			},
			boss_zhenwei:{
				global:'boss_zhenwei2',
				ai:{
					threaten:1.5
				}
			},
			boss_zhenwei2:{
				mod:{
					globalTo:function(from,to,distance){
						if(to.isFriendOf(from)) return;
						var players=game.filterPlayer();
						for(var i=0;i<players.length;i++){
							if(players[i].hasSkill('boss_zhenwei')&&
								players[i].isFriendOf(to)&&players[i]!=to){
								return distance+1;
							}
						}
					}
				}
			},
			boss_benlei:{
				mode:['versus'],
				trigger:{player:'phaseBegin'},
				forced:true,
				filter:function(event,player){
					if(_status.mode!='jiange') return false;
					var players=game.filterPlayer();
					for(var i=0;i<players.length;i++){
						if(players[i].type=='mech'&&players[i].isEnemyOf(player)){
							return true;
						}
					}
				},
				content:function(){
					var target=game.findPlayer(function(current){
						return current.type=='mech'&&current.isEnemyOf(player);
					});
					if(target){
						player.line(target,'thunder');
						target.damage(Math.random()>0.4?2:3,'thunder');
					}
				},
				ai:{
					threaten:function(player,target){
						if(_status.mode=='jiange'){
							for(var i=0;i<game.players.length;i++){
								if(game.players[i].type=='mech'&&game.players[i].isEnemyOf(target)){
									return 2;
								}
							}
						}
						return 1;
					}
				}
			},
			boss_nailuo:{
				trigger:{player:'phaseEnd'},
				check:function(event,player){
					if(player.isTurnedOver()) return true;
					var num=0,players=game.filterPlayer();
					for(var i=0;i<players.length;i++){
						if(players[i].isEnemyOf(player)){
							var es=players[i].getCards('e');
							for(var j=0;j<es.length;j++){
								switch(get.subtype(es[j])){
									case 'equip1':num+=1;break;
									case 'equip2':num+=2;break;
									case 'equip3':num+=2;break;
									case 'equip4':num+=1;break;
									case 'equip5':num+=1.5;break;
								}
							}
						}
					}
					if(_status.mode=='jiange'){
						for(var i=0;i<players.length;i++){
							if(players[i].isFriendOf(player)&&players[i].hasSkill('huodi')){
								return num>0;
							}
						}
					}
					return num>=4;
				},
				filter:function(event,player){
					var players=game.filterPlayer();
					for(var i=0;i<players.length;i++){
						if(players[i].isEnemyOf(player)&&players[i].countCards('e')){
							return true;
						}
					}
					return false;
				},
				content:function(){
					'step 0'
					player.turnOver();
					'step 1'
					event.targets=get.players();
					'step 2'
					if(event.targets.length){
						var current=event.targets.shift();
						if(current.isEnemyOf(player)){
							var es=current.getCards('e');
							if(es.length){
								current.discard(es);
								player.line(current,'green');
							}
						}
						event.redo();
					}
				},
				ai:{
					effect:{
						target:function(card,player,target){
							if(card.name=='guiyoujie') return [0,1];
						}
					}
				},
			},
			boss_tanshi:{
				trigger:{player:'phaseEnd'},
				forced:true,
				check:function(){
					return false;
				},
				filter:function(event,player){
					return player.countCards('h')>0;
				},
				content:function(){
					player.chooseToDiscard('h',true);
				}
			},
			boss_tunshi:{
				trigger:{player:'phaseBegin'},
				forced:true,
				filter:function(event,player){
					var nh=player.countCards('h');
					return game.hasPlayer(function(current){
						return current.isEnemyOf(player)&&current.countCards('h')>nh;
					});
				},
				content:function(){
					'step 0'
					var nh=player.countCards('h');
					var targets=game.filterPlayer(function(current){
						return current.isEnemyOf(player)&&current.countCards('h')>nh;
					});
					targets.sort(lib.sort.seat);
					event.targets=targets;
					'step 1'
					if(event.targets.length){
						var current=event.targets.shift();
						current.damage();
						player.line(current,'thunder');
						event.redo();
					}
				}
			},
			boss_jiguan:{
				mod:{
					targetEnabled:function(card,player,target){
						if(card.name=='lebu'){
							return false;
						}
					}
				}
			},
			boss_gongshenjg:{
				audio:2,
				trigger:{player:'phaseEnd'},
				mode:['versus'],
				filter:function(event,player){
					if(_status.mode!='jiange') return false;
					var players=game.filterPlayer();
					for(var i=0;i<players.length;i++){
						if(players[i].type=='mech'){
							if(players[i].isEnemyOf(player)) return true;
							if(players[i].hp<players[i].maxHp) return true;
						}
					}
					return false;
				},
				content:function(){
					var enemy,players=game.filterPlayer();
					for(var i=0;i<players.length;i++){
						if(players[i].type=='mech'){
							if(players[i].isFriendOf(player)){
								if(players[i].hp<players[i].maxHp){
									player.line(players[i],'green');
									players[i].recover();
									return;
								}
							}
							else{
								enemy=players[i];
							}
						}
					}
					if(enemy){
						player.line(enemy,'fire');
						enemy.damage('fire');
					}
				},
			},
			boss_jingmiao:{
				trigger:{global:'useCardAfter'},
				filter:function(event,player){
					return event.player.isEnemyOf(player)&&event.card.name=='wuxie';
				},
				logTarget:'player',
				check:function(event,player){
					return get.attitude(player,event.player)<0;
				},
				content:function(){
					player.line(trigger.player,'green');
					trigger.player.loseHp();
				},
				ai:{
					expose:0.2,
					threaten:1.3
				}
			},
			boss_zhinang:{
				trigger:{player:'phaseBegin'},
				frequent:true,
				content:function(){
					"step 0"
					event.cards=get.cards(5);
					event.cards2=[];
					for(var i=0;i<event.cards.length;i++){
						var type=get.type(event.cards[i],'trick');
						if(type=='trick'||type=='equip'){
							event.cards2.push(event.cards[i]);
						}
					}
					if(!event.isMine()||event.cards2.length==0){
						player.showCards(event.cards);
					}
					"step 1"
					if(event.cards2.length==0){
						event.finish();
					}
					else{
						var dialog=ui.create.dialog('将三张牌中的锦囊牌或装备牌交给一己方名角色','hidden');
						dialog.add(event.cards);
						for(var i=0;i<dialog.buttons.length;i++){
							if(event.cards2.contains(dialog.buttons[i].link)){
								dialog.buttons[i].style.opacity=1;
							}
							else{
								dialog.buttons[i].style.opacity=0.5;
							}
						}
						var next=player.chooseTarget(true,dialog,function(card,player,target){
							return target.isFriendOf(player);
						});
						next.ai=function(target){
							var att=get.attitude(player,target);
							if(att>0&&target.hasJudge('lebu')){
								return 0.1;
							}
							if(player.countCards('h')>player.hp){
								if(target==player) return Math.max(1,att-2);
							}
							if(target==player) return att+5;
							return att;
						}
					}
					"step 2"
					if(result&&result.targets&&result.targets.length){
						event.target=result.targets[0];
					}
					if(event.cards2.length){
						player.line(event.target,'green');
						event.target.gain(event.cards2,'gain2','log');
					}
				},
				ai:{
					threaten:1.3
				}
			},
			boss_biantian4:{
				trigger:{player:'dieBegin'},
				forced:true,
				popup:false,
				content:function(){
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].hasSkill('boss_biantian3')){
							game.players[i].removeSkill('boss_biantian3');
							game.players[i].popup('boss_biantian3');
						}
						if(game.players[i].hasSkill('boss_biantian2')){
							game.players[i].removeSkill('boss_biantian2');
							game.players[i].popup('boss_biantian2');
						}
					}
				}
			},
			boss_biantian:{
				trigger:{player:'phaseBegin'},
				forced:true,
				unique:true,
				audio:false,
				group:'boss_biantian4',
				content:function(){
					"step 0"
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].hasSkill('boss_biantian3')){
							game.players[i].removeSkill('boss_biantian3');
							game.players[i].popup('boss_biantian3');
						}
						if(game.players[i].hasSkill('boss_biantian2')){
							game.players[i].removeSkill('boss_biantian2');
							game.players[i].popup('boss_biantian2');
						}
					}
					player.judge(function(card){
						var color=get.color(card);
						if(color=='black') return 1;
						if(color=='red') return 0;
						return -1;
					});
					"step 1"
					var targets=[],players=game.filterPlayer();
					if(result.color=='red'){
						game.trySkillAudio('boss_biantianx2');
						for(var i=0;i<players.length;i++){
							if(!players[i].isFriendOf(player)){
								players[i].addSkill('boss_biantian3');
								players[i].popup('kuangfeng');
								targets.push(players[i]);
							}
						}
						player.logSkill('kuangfeng',targets,'fire');
					}
					else if(result.color=='black'){
						game.trySkillAudio('boss_biantianx1');
						for(var i=0;i<players.length;i++){
							if(players[i].isFriendOf(player)){
								players[i].addSkill('boss_biantian2');
								players[i].popup('dawu');
								targets.push(players[i]);
							}
						}
						player.logSkill('dawu',targets,'thunder');
					}
				},
				ai:{
					threaten:1.6
				}
			},
			boss_biantian2:{
				audio:false,
				trigger:{player:'damageBefore'},
				filter:function(event){
					if(event.nature!='thunder') return true;
					return false;
				},
				forced:true,
				mark:true,
				marktext:'雾',
				intro:{
					content:'已获得大雾标记'
				},
				content:function(){
					trigger.cancel();
				},
				ai:{
					nofire:true,
					nodamage:true,
					effect:{
						target:function(card,player,target,current){
							if(get.tag(card,'damage')&&!get.tag(card,'thunderDamage')) return [0,0];
						}
					}
				}
			},
			boss_biantian3:{
				trigger:{player:'damageBegin3'},
				filter:function(event){
					if(event.nature=='fire') return true;
					return false;
				},
				mark:true,
				marktext:'风',
				intro:{
					content:'已获得狂风标记'
				},
				forced:true,
				content:function(){
					trigger.num++;
				},
				ai:{
					effect:{
						target:function(card,player,target,current){
							if(get.tag(card,'fireDamage')) return 1.5;
						}
					}
				}
			},
			boss_jizhen:{
				audio:2,
				trigger:{player:'phaseEnd'},
				forced:true,
				filter:function(event,player){
					return game.hasPlayer(function(current){
						return current.isFriendOf(player)&&current.isDamaged();
					});
				},
				content:function(){
					var list=game.filterPlayer(function(current){
						return current.isFriendOf(player)&&current.isDamaged();
					});
					if(list.length){
						player.line(list,'green');
						game.asyncDraw(list);
					}
				},
				ai:{
					threaten:1.4
				}
			},
			boss_lingfeng:{
				audio:2,
				trigger:{player:'phaseDrawBefore'},
				content:function(){
					"step 0"
					trigger.cancel();
					event.cards=get.cards(2);
					player.showCards(event.cards);
					"step 1"
					if(get.color(event.cards[0])!=get.color(event.cards[1])){
						player.chooseTarget('是否令一名敌方角色失去1点体力？',function(card,player,target){
							return !target.isFriendOf(player);
						}).ai=function(target){
							return -get.attitude(player,target);
						}
					}
					"step 2"
					if(result.bool&&result.targets&&result.targets.length){
						player.line(result.targets,'green');
						result.targets[0].loseHp();
					}
					"step 3"
					player.gain(event.cards);
					player.$draw(event.cards);
					game.delay();
				},
				ai:{
					threaten:1.4
				}
			},
			boss_yuhuojg:{
				audio:true,
				trigger:{player:'damageBegin2'},
				filter:function(event){
					return event.nature=='fire';
				},
				forced:true,
				content:function(){
					trigger.cancel();
				},
				ai:{
					nofire:true,
					effect:{
						target:function(card,player,target,current){
							if(get.tag(card,'fireDamage')) return 0;
						}
					}
				}
			},
			boss_tianyun:{
				trigger:{player:'phaseEnd'},
				direct:true,
				content:function(){
					"step 0"
					event.forceDie=true;
					player.chooseTarget(get.prompt('boss_tianyun'),function(card,player,target){
						return target.isEnemyOf(player);
					}).ai=function(target){
						if(player.hp<=1) return 0;
						if(get.attitude(player,target)>-3) return 0;
						var eff=get.damageEffect(target,player,player,'fire');
						if(eff>0){
							return eff+target.countCards('e')/2;
						}
						return 0;
					}
					"step 1"
					if(result.bool){
						player.logSkill('boss_tianyun',result.targets,'fire');
						player.loseHp();
						event.target=result.targets[0];
					}
					else{
						event.finish();
					}
					"step 2"
					if(event.target){
						event.target.damage(Math.random()>0.4?2:3,'fire');
					}
					"step 3"
					if(event.target){
						var es=event.target.getCards('e');
						if(es.length){
							event.target.discard(es);
						}
					}
				},
				ai:{
					threaten:2
				}
			},
			versus_ladder:{
				trigger:{global:['damageEnd','recoverEnd','dieEnd','gainEnd','phaseDiscardEnd']},
				silent:true,
				filter:function(event,player){
					if(!_status.ladder) return false;
					if(event._ladder_mmr_counted) return false;
					if(!event.source) return false;
					return event.source==game.me||event.player==game.me;
				},
				content:function(){
					switch(event.triggername){
						case 'damageEnd':{
							if(trigger.source.side!=trigger.player.side){
								if(trigger.source==game.me){
									_status.ladder_mmr+=0.5*Math.max(1,trigger.num);
								}
								else{
									_status.ladder_mmr+=0.2*Math.max(1,trigger.num);
								}
							}
							break;
						}
						case 'recoverEnd':{
							if(trigger.source!=trigger.player){
								if(trigger.source==game.me){
									if(trigger.player.side==game.me.side){
										_status.ladder_mmr+=0.5*trigger.num;
									}
									else{
										_status.ladder_mmr-=0.3*trigger.num;
									}
								}
							}
							else{
								_status.ladder_mmr+=0.3*trigger.num;
							}
							break;
						}
						case 'dieEnd':{
							if(trigger.source==game.me&&trigger.player.side!=game.me.side){
								_status.ladder_mmr+=2;
							}
							break;
						}
						case 'gainEnd':{
							if(trigger.cards&&trigger.cards.length){
								if(trigger.source==game.me&&trigger.player!=game.me){
									if(trigger.player.side==game.me.side){
										_status.ladder_mmr+=0.3*trigger.cards.length;
									}
									else{
										_status.ladder_mmr-=0.1*trigger.cards.length;
									}
								}
								else{
									if(trigger.source){
										if(trigger.source.side!=game.me.side){
											_status.ladder_mmr+=0.3*trigger.cards.length;
										}
									}
									else{
										_status.ladder_mmr+=0.1*trigger.cards.length;
									}
								}
							}
							break;
						}
						case 'phaseDiscardEnd':{
							if(trigger.player==player){
								if(trigger.cards&&trigger.cards.length){
									_status.ladder_mmr-=0.2*trigger.cards.length;
								}
							}
							break;
						}
					}
					trigger._ladder_mmr_counted=true;
				}
			}
		},
		card:{
			tunliang:{
				audio:true,
				fullskin:true,
				type:'trick',
				enable:true,
				selectTarget:[1,3],
				filterTarget:true,
				content:function(){
					target.draw();
				},
				ai:{
					basic:{
						order:7.2,
						useful:4.5,
						value:9.2
					},
					result:{
						target:1,
					},
					tag:{
						draw:1
					}
				}
			},
			yuanjun:{
				fullskin:true,
				type:'trick',
				selectTarget:[1,2],
				enable:true,
				filterTarget:function(card,player,target){
					return target!=player&&target.hp<target.maxHp;
				},
				content:function(){
					target.recover();
				},
				ai:{
					basic:{
						order:function(card,player){
							if(player.hasSkillTag('pretao')) return 5;
							return 2;
						},
						useful:[6,4],
						value:[6,4],
					},
					result:{
						target:function(player,target){
							return 2;
						},
					},
					tag:{
						recover:1,
					}
				}
			},
			zong:{
				fullskin:true,
				type:'basic',
				cardcolor:'red',
				enable:function(card,player){
					return player.hp<player.maxHp;
				},
				savable:function(card,player,dying){
					return dying.side==player.side;
				},
				selectTarget:-1,
				filterTarget:function(card,player,target){
					return target==player&&target.hp<target.maxHp;
				},
				modTarget:function(card,player,target){
					return target.hp<target.maxHp;
				},
				content:function(){
					target.recover();
				},
				ai:{
					basic:{
						order:function(card,player){
							if(player.hasSkillTag('pretao')) return 5;
							return 2;
						},
						useful:[8,6.5,5,4],
						value:[8,6.5,5,4],
					},
					result:{
						target:function(player,target){
							if(target.hp<=0) return 2;
							var nd=player.needsToDiscard();
							var keep=false;
							if(nd<=0){
								keep=true;
							}
							else if(nd==1&&target.hp>=2&&target.countCards('h','tao')<=1){
								keep=true;
							}
							var mode=get.mode();
							if(target.hp>=2&&keep&&target.hasFriend()){
								if(target.hp>2||nd==0) return 0;
								if(target.hp==2){
									if(game.hasPlayer(function(current){
										if(target!=current&&get.attitude(target,current)>=3){
											if(current.hp<=1) return true;
										}
									})){
										return 0;
									}
								}
							}
							return 2;
						},
					},
					tag:{
						recover:1,
						save:1,
					}
				}
			},
			xionghuangjiu:{
				fullskin:true,
				type:"basic",
				enable:function(event,player){
					return !player.hasSkill('jiu')&&!player.hasSkill('xionghuangjiu');
				},
				lianheng:true,
				logv:false,
				savable:function(card,player,dying){
					return dying==player;
				},
				usable:1,
				selectTarget:-1,
				modTarget:true,
				filterTarget:function(card,player,target){
					return target==player;
				},
				content:function(){
					if(target.isDying()){
						target.recover();
						if(_status.currentPhase==target){
							target.getStat().card.jiu--;
						}
					}
					else{
						if(cards&&cards.length){
							card=cards[0];
						}
						game.broadcastAll(function(target,card,gain2){
							if(get.population(target.side)==1){
								target.addSkill('xionghuangjiu');
							}
							else{
								if(!target.$.jiu) target.$.jiu=0;
								target.$.jiu++;
								target.addSkill('jiu');
							}
							game.addVideo('jiuNode',target,true);
							if(!target.node.jiu&&lib.config.jiu_effect){
								target.node.jiu=ui.create.div('.playerjiu',target.node.avatar);
								target.node.jiu2=ui.create.div('.playerjiu',target.node.avatar2);
							}
							if(gain2&&card.clone&&(card.clone.parentNode==target.parentNode||card.clone.parentNode==ui.arena)){
								card.clone.moveDelete(target);
							}
						},target,card,target==targets[0]);
						if(target==targets[0]){
							if(card.clone&&(card.clone.parentNode==target.parentNode||card.clone.parentNode==ui.arena)){
								game.addVideo('gain2',target,get.cardsInfo([card]));
							}
						}
					}
				},
				ai:{
					basic:{
						useful:function(card,i){
							if(_status.event.player.hp>1){
								if(i==0) return 5;
								return 1;
							}
							if(i==0) return 7.3;
							return 3;
						},
						value:function(card,player,i){
							if(player.hp>1){
								if(i==0) return 5;
								return 1;
							}
							if(i==0) return 7.3;
							return 3;
						},
					},
					order:function(){
						return get.order({name:'sha'})+0.2;
					},
					result:{
						target:function(player,target){
							if(target&&target.isDying()) return 2;
							if(lib.config.mode=='stone'&&!player.isMin()){
								if(player.getActCount()+1>=player.actcount) return 0;
							}
							var shas=player.getCards('h','sha');
							if(shas.length>1&&player.getCardUsable('sha')>1){
								return 0;
							}
							var card;
							if(shas.length){
								for(var i=0;i<shas.length;i++){
									if(lib.filter.filterCard(shas[i],target)){
										card=shas[i];break;
									}
								}
							}
							else if(player.hasSha()&&player.needsToDiscard()){
								if(player.countCards('h','hufu')!=1){
									card={name:'sha'};
								}
							}
							if(card){
								if(game.hasPlayer(function(current){
									return (get.attitude(target,current)<0&&
										target.canUse(card,current,true,true)&&
										!current.getEquip('baiyin')&&
										get.effect(current,card,target)>0);
								})){
									return 1;
								}
							}
							return 0;
						},
					},
					tag:{
						save:1
					}
				}
			},
			tongzhougongji:{
				fullskin:true,
				cardimage:'lulitongxin',
				notarget:true,
				enable:true,
				type:'trick',
				content:function(){
					'step 0'
					var num=0;
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].side==player.side){
							if(game.players[i]!=player){
								event.friend=game.players[i];
							}
							num+=game.players[i].storage.longchuanzhibao;
						}
					}
					player.chooseControl(function(){
						if(num>2){
							return 0;
						}
						if(num==2&&get.population(player.side)==1){
							return 0;
						}
						return 1;
					}).set('choiceList',[
						'摸'+get.cnNumber(num)+'张牌',
						'你和队友各摸一张牌'
					]);
					event.num=num;
					'step 1'
					if(result.index==0){
						if(event.num){
							player.draw(event.num);
						}
					}
					else{
						if(event.friend){
							player.line(event.friend);
							game.asyncDraw([player,event.friend]);
						}
						else{
							player.draw();
						}
					}
				},
				ai:{
					basic:{
						order:7.2,
						useful:4,
						value:9.2
					},
					result:{
						target:2,
					},
					tag:{
						draw:1
					}
				}
			},
			lizhengshangyou:{
				fullskin:true,
				cardimage:'lianjunshengyan',
				type:'trick',
				enable:true,
				selectTarget:-1,
				reverseOrder:true,
				filterTarget:function(card,player,target){
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].side==target.side&&game.players[i].storage.longchuanzhibao){
							return target.isDamaged();
						}
					}
					return target.countCards('he');
				},
				content:function(){
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].side==target.side&&game.players[i].storage.longchuanzhibao){
							target.recover();return;
						}
					}
					target.chooseToDiscard('he',true);
				},
				ai:{
					basic:{
						order:9,
						useful:[3,1],
						value:0
					},
					result:{
						target:function(player,target){
							for(var i=0;i<game.players.length;i++){
								if(game.players[i].side==target.side&&game.players[i].storage.longchuanzhibao){
									return 1.5;
								}
							}
							return -1;
						}
					},
					tag:{
						recover:0.5,
						multitarget:1
					}
				}
			}
		},
		element:{
			content:{
				replacePlayer:function(){
					"step 0"
					var cards=source.getCards('hej');
					if(cards.length){
						source.$throw(cards,1000);
						game.cardsDiscard(cards);
					}
					"step 1"
					var list=(source.side==game.me.side)?_status.friend:_status.enemy;
					if(list.length==0){
						// if(game.friend.contains(source)){
						// 	game.over(false);
						// }
						// else{
						// 	game.over(true);
						// }
						game.friend.remove(source);
						game.enemy.remove(source);
						if(game.friend.length==0) game.over(false);
						else if(game.enemy.length==0) game.over(true);
						if(game.friendZhu&&game.friendZhu.classList.contains('dead')&&game.friend.length){
							game.friendZhu=game.friend[0];
							game.friendZhu.setIdentity(_status.color+'Zhu');
						}
						if(game.enemyZhu&&game.enemyZhu.classList.contains('dead')&&game.enemy.length){
							game.enemyZhu=game.enemy[0];
							game.enemyZhu.setIdentity(!_status.color+'Zhu');
						}
						event.finish();
						return;
					}
					if(source.side==game.me.side&&list.length>1&&(game.me==game.friendZhu||(lib.storage.zhu&&lib.storage.single_control))&&
						!_status.auto){
						event.dialog=ui.create.dialog('选择替补角色',[list,'character']);
						event.filterButton=function(){return true;};
						event.player=game.me;
						event.forced=true;
						event.custom.replace.confirm=function(){
							event.character=ui.selected.buttons[0].link;
							event.dialog.close();
							if(ui.confirm) ui.confirm.close();
							delete event.player;
							game.resume();
						}
						game.check();
						game.pause();
					}
					else{
						event.character=list[Math.floor(Math.random()*list.length)];
					}
					"step 2"
					game.uncheck();
					_status.friend.remove(event.character);
					_status.enemy.remove(event.character);
					source.revive(null,false);
					game.additionaldead.push({
						name:source.name,
						stat:source.stat
					});
					game.addVideo('reinit',source,[event.character,get.translation(source.side+'Color')]);
					source.uninit();
					source.init(event.character);
					game.log(source,'出场');
					source.node.identity.dataset.color=get.translation(source.side+'Color');
					source.draw(4);
					var evt=event.getParent('dying');
					if(evt&&evt.parent){
						evt=evt.parent;
						evt.untrigger(false,source);
						for(var i=0;i<100;i++){
							evt=evt.parent;
							if(evt.player==source){
								evt.finish();
							}
							if(evt.name=='phase'){
								break;
							}
						}
					}
					if(lib.storage.single_control){
						game.onSwapControl();
					}
					game.triggerEnter(source);
					"step 3"
					// if(_status.currentPhase==source){
					// 	source.skip('phase');
					// }
				},
				replacePlayerTwo:function(){
					'step 0'
					var cards=source.getCards('hej');
					if(cards.length){
						source.$throw(cards,1000);
						game.cardsDiscard(cards);
					}
					game.delay();
					'step 1'
					source.revive(null,false);
					game.additionaldead.push({
						name:source.name,
						stat:source.stat
					});
					game.addVideo('reinit',source,[event.character,get.translation(source.side+'Color')]);
					source.uninit();
					source.init(event.character);
					game.log(source,'出场');
					// source.node.identity.dataset.color=source.side+'zhu';
					source.draw(4);
					var evt=event.getParent('dying');
					if(evt&&evt.parent){
						evt=evt.parent;
						evt.untrigger(false,source);
						for(var i=0;i<100;i++){
							evt=evt.parent;
							if(evt.player==source){
								evt.finish();
							}
							if(evt.name=='phase'){
								break;
							}
						}
					}
					game.triggerEnter(source);
				},
				replacePlayerOL:function(){
					'step 0'
					var cards=source.getCards('hej');
					if(cards.length){
						source.$throw(cards,1000);
						game.cardsDiscard(cards);
					}
					game.delay();
					'step 1'
					if(event.source.side==game.me.side){
						if(_status.friend.length==1){
							event.directresult=_status.friend[0];
						}
						else if(event.source==game.me){
							if(_status.auto){
								event.directresult=_status.friend.randomGet();
							}
						}
						else{
							if(!event.source.isOnline()){
								event.directresult=_status.friend.randomGet();
							}
						}
					}
					else{
						if(_status.enemy.length==1){
							event.directresult=_status.enemy[0];
						}
						else{
							if(!event.source.isOnline()){
								event.directresult=_status.enemy.randomGet();
							}
						}
					}
					if(!event.directresult){
						if(event.source==game.me){
							event.dialog=ui.create.dialog('选择替补角色',[_status.friend,'character']);
							event.filterButton=function(){return true};
							event.player=game.me;
							event.forced=true;
							event.custom.replace.confirm=function(){
								event.directresult=ui.selected.buttons[0].link;
								event.dialog.close();
								if(ui.confirm) ui.confirm.close();
								delete event.player;
								game.resume();
							}
							event.switchToAuto=function(){
								event.directresult=_status.friend.randomGet();
								event.dialog.close();
								if(ui.confirm) ui.confirm.close();
								delete event.player;
							};
							game.check();
							game.pause();
						}
						else{
							event.source.send(function(player){
								if(_status.auto){
									_status.event._result=_status.friend.randomGet();
								}
								else{
									var next=game.createEvent('replacePlayer');
									next.source=player;
									next.setContent(function(){
										event.dialog=ui.create.dialog('选择替补角色',[_status.friend,'character']);
										event.filterButton=function(){return true};
										event.player=event.source;
										event.forced=true;
										event.custom.replace.confirm=function(){
											event.result=ui.selected.buttons[0].link;
											event.dialog.close();
											if(ui.confirm) ui.confirm.close();
											delete event.player;
											game.resume();
											game.uncheck();
										}
										event.switchToAuto=function(){
											event.result=_status.friend.randomGet();
											event.dialog.close();
											if(ui.confirm) ui.confirm.close();
											delete event.player;
											game.uncheck();
										};
										game.check();
										game.pause();
									});
								}
								game.resume();
							},event.source);
							event.source.wait();
							game.pause();
						}
					}
					'step 2'
					game.uncheck();
					if(!event.directresult){
						if(event.resultOL){
							event.directresult=event.resultOL[source.playerid];
						}
						if(!event.directresult||event.directresult=='ai'){
							if(source.side==game.me.side){
								event.directresult=_status.friend.randomGet();
							}
							else{
								event.directresult=_status.enemy.randomGet();
							}
						}
					}
					var name=event.directresult;
					var color=source.node.identity.dataset.color;
					game.additionaldead.push({
						name:source.name,
						stat:source.stat
					});

					game.broadcastAll(function(source,name,color){
						_status.friend.remove(name);
						_status.enemy.remove(name);
						source.revive(null,false);
						source.uninit();
						source.init(name);
						source.node.identity.dataset.color=color;
						if(source==game.me){
							ui.arena.classList.remove('selecting');
						}
					},source,name,color);
					game.log(source,'出场');

					source.draw(4);
					var evt=event.getParent('dying');
					if(evt&&evt.parent){
						evt=evt.parent;
						evt.untrigger(false,source);
						for(var i=0;i<100;i++){
							evt=evt.parent;
							if(evt.player==source){
								evt.finish();
							}
							if(evt.name=='phase'){
								break;
							}
						}
					}
					_status.event.parent.parent.parent.untrigger(false,source);
					game.addVideo('reinit',source,[name,color]);
					game.triggerEnter(source);
				},
			},
			player:{
				gainZhibao:function(num,source){
					if(source){
						if(num===true||num>source.$.longchuanzhibao){
							num=source.$.longchuanzhibao;
						}
					}
					else{
						if(typeof num!='number'){
							num=1;
						}
					}
					if(!num||typeof num!='number') return this;

					this.$.longchuanzhibao+=num;
					this.updateMark('longchuanzhibao');

					if(source){
						source.$.longchuanzhibao-=num;
						source.updateMark('longchuanzhibao');
						game.log(this,'从',source,'处获得了'+get.cnNumber(num)+'个','#y龙船至宝');
					}
					else{
						game.log(this,'获得了'+get.cnNumber(num)+'个','#y龙船至宝');
					}

					if(source&&source.side!=this.side){
						this.draw(num,'nodelay');
						var that=this;
						var friend=game.findPlayer(function(current){
							return current.side==that.side&&current!=that;
						});
						if(friend){
							friend.draw(num,'nodelay');
						}
					}

					var map={holo:0,nijisanji:0,vtuber:0,clubs:0};
					for(var i=0;i<game.players.length;i++){
						var current=game.players[i];
						map[current.side]+=current.$.longchuanzhibao;
					}
					for(var i=0;i<game.players.length;i++){
						var current=game.players[i];
						if(map[current.side]>=4){
							current.classList.add('current_action');
						}
						else{
							current.classList.remove('current_action');
						}
					}
					return this;
				},
				dieAfter2:function(source){
					if(_status.connectMode&&_status.mode!='guandu'){
						if(_status.mode=='1v1'||_status.mode=='3v3') return;
						else if(_status.mode=='2v2'){
							var friend;
							for(var i=0;i<game.players.length;i++){
								if(game.players[i].side==this.side){
									friend=game.players[i];break;
								}
							}
							if(friend){
								var next=game.createEvent('versusDraw');
								next.setContent(function(){
									'step 0'
									player.chooseBool('是否摸一张牌？');
									'step 1'
									if(result.bool){
										player.draw();
									}
								});
								next.player=friend;
							}
						}
						else if(_status.mode=='4v4'){
							if(this.identity=='zhu') return;
							else{
								if(source){
									if(source.side==this.side){
										if(source.identity=='zhu'){
											source.discard(source.getCards('he'));
										}
									}
									else{
										var num1=0,num2=1;
										for(var i=0;i<game.players.length;i++){
											if(game.players[i].side==source.side){
												num1++;
											}
											else{
												num2++;
											}
										}
										source.draw(2+Math.max(0,num2-num1));
									}
								}
							}
							return;
						}
					}
					else{
						if(_status.mode=='four'||_status.mode=='guandu'){
							if(this.identity=='zhu') return;
							else{
								if(source){
									if(source.side==this.side){
										if(_status.mode=='guandu'||source.identity=='zhu'){
											source.discard(source.getCards('he'));
										}
									}
									else{
										if(_status.mode=='guandu') return;
										var num1=0,num2=1;
										for(var i=0;i<game.players.length;i++){
											if(game.players[i].side==source.side){
												num1++;
											}
											else{
												num2++;
											}
										}
										source.draw(2+Math.max(0,num2-num1));
									}
								}
							}
							return;
						}
						else if(_status.mode=='two'){
							var friend;
							for(var i=0;i<game.players.length;i++){
								if(game.players[i].side==this.side){
									friend=game.players[i];break;
								}
							}
							if(_status.replacetwo){
								if(this.replacetwo){
									if(source){
										if(source.side==this.side){
											var he=source.getCards('he');
											if(he.length){
												source.discard(he);
											}
										}
										else{
											source.draw(3);
										}
									}
								}
								else if(friend&&friend.replacetwo){
									if(source){
										if(source.side==this.side){
											var he=source.getCards('he');
											if(he.length){
												source.discard(he);
											}
										}
										else{
											source.draw(3);
										}
									}
								}
							}
							else{
								if(friend){
									var next=game.createEvent('versusDraw');
									next.setContent(function(){
										'step 0'
										player.chooseBool('是否摸一张牌？');
										'step 1'
										if(result.bool){
											player.draw();
										}
									});
									next.player=friend;
								}
							}
							return;
						}
						else if(_status.mode=='siguo') return;
						else if(_status.mode=='jiange') return;
						else if(_status.mode=='three'){
							if(this.identity=='zhu') return;
							else{
								game.friend.remove(this);
								game.enemy.remove(this);
								if(source){
									source.draw(2);
								}
							}
							return;
						}

						var list=(this.side==game.me.side)?_status.friend:_status.enemy;
						if((list.length==0&&lib.storage.noreplace_end)||
						(lib.storage.zhu&&lib.storage.main_zhu&&this.identity=='zhu'&&game.players.length>2)){
							return;
						}
						else if(game.friend.length==1&&this==game.friend[0]&&_status.friend.length==0){
							return;
						}
						else if(game.enemy.length==1&&this==game.enemy[0]&&_status.enemy.length==0){
							return;
						}
						else{
							if(source){
								if(source.side!=this.side){
									if(lib.storage.versus_reward){
										source.draw(lib.storage.versus_reward);
									}
								}
								else{
									if(lib.storage.versus_punish=='弃牌'){
										source.discard(source.getCards('he'));
									}
									else if(lib.storage.versus_punish=='摸牌'&&lib.storage.versus_reward){
										source.draw(lib.storage.versus_reward);
									}
								}
							}
							else{
								game.delay();
							}
						}
					}
				},
				dieAfter:function(source){
					if(_status.connectMode){
						if(_status.mode=='1v1'||_status.mode=='3v3'){
							game.broadcastAll(function(dead){
								if(dead.side==game.me.side){
									_status.friendDied.push(dead.name1);
									_status.friendCount.innerHTML='阵亡: '+get.cnNumber(_status.friendDied.length,true);
								}
								else{
									_status.enemyDied.push(dead.name1);
									_status.enemyCount.innerHTML='杀敌: '+get.cnNumber(_status.enemyDied.length,true);
								}
							},this);
							if(this.side==game.me.side){
								if(_status.friend.length==0){
									game.over(false);
									return;
								}
							}
							else{
								if(_status.enemy.length==0){
									game.over(true);
									return;
								}
							}
							game.replacePlayerOL(this);
						}
						else if(_status.mode=='2v2'){
							if(_status.replacetwo){
								// later ?
							}
							var friend;
							for(var i=0;i<game.players.length;i++){
								if(game.players[i].side==this.side){
									friend=game.players[i];break;
								}
							}
							if(!friend){
								game.over(this.side!=game.me.side);
							}
						}
						else if(_status.mode=='4v4'||_status.mode=='guandu'){
							if(this.identity=='zhu'){
								game.over(this.side!=game.me.side);
							}
							else{
								if(_status.mode=='guandu'&&source&&source.side!=this.side){
									var hs=this.getCards('h');
									if(hs.length) source.gain(hs,this,'giveAuto');
								}
								var side1=[],side2=[];
								for(var i=0;i<game.players.length;i++){
									if(game.players[i].side){
										side1.push(game.players[i]);
									}
									else{
										side2.push(game.players[i]);
									}
								}
								if(side1.length==1){
									side1[0].showGiveup();
								}
								if(side2.length==1){
									side2[0].showGiveup();
								}
							}
							return;
						}
					}
					else{
						var me=game.me._trueMe||game.me;
						if(_status.mode=='four'||_status.mode=='guandu'){
							if(this.identity=='zhu'){
								game.over(this.side!=me.side);
							}
							else{
								if(_status.mode=='guandu'&&source&&source.side!=this.side){
									var hs=this.getCards('h');
									if(hs.length) source.gain(hs,this,'giveAuto');
								}
								var side1=[],side2=[];
								for(var i=0;i<game.players.length;i++){
									if(game.players[i].side){
										side1.push(game.players[i]);
									}
									else{
										side2.push(game.players[i]);
									}
								}
								if(me.side){
									if(side1.length<=side2.length-2){
										me.showGiveup();
									}
								}
								else{
									if(side1.length>=side2.length+2){
										me.showGiveup();
									}
								}
							}
							return;
						}
						else if(_status.mode=='two'){
							var friend;
							for(var i=0;i<game.players.length;i++){
								if(game.players[i].side==this.side){
									friend=game.players[i];break;
								}
							}
							if(_status.replacetwo){
								if(this.replacetwo){
									game.replacePlayerTwo(this,this.replacetwo);
									delete this.replacetwo;
								}
								else if(friend&&friend.replacetwo){
									game.replacePlayerTwo(this,friend.replacetwo);
									delete friend.replacetwo;
								}
								else{
									game.over(this.side!=me.side);
								}
							}
							else{
								if(!friend){
									game.over(this.side!=me.side);
								}
							}
							return;
						}
						else if(_status.mode=='siguo'){
							if(game.players.length==1||(game.players.length==2&&game.players[0].side==game.players[1].side)){
								game.over(me.side==game.players[0].side);
							}
							var assignzhibao=function(){
								var list=game.players.slice(0);
								var max=0;
								var list2=[];
								for(var i=0;i<arguments.length;i++){
									list.remove(arguments[i]);
								}
								for(var i=0;i<list.length;i++){
									if(list[i].storage.longchuanzhibao>max){
										max=list[i].storage.longchuanzhibao;
									}
								}
								for(var i=0;i<list.length;i++){
									if(list[i].storage.longchuanzhibao==max){
										if(list2.length){
											list2=list;break;
										}
										else{
											list2.push(list[i]);
										}
									}
								}
								for(var i=0;i<arguments.length;i++){
									for(var j=0;j<arguments[i].storage.longchuanzhibao;j++){
										var current=list2.randomGet();
										if(!current.$._longchuanzhibao){
											current.$._longchuanzhibao=1;
										}
										else{
											current.$._longchuanzhibao++;
										}
									}
									for(var j=0;j<list2.length;j++){
										if(list2[j].storage._longchuanzhibao){
											arguments[i].line(list2[j],'green');
											list2[j].gainZhibao(list2[j].storage._longchuanzhibao,arguments[i]);
											delete list2[j].storage._longchuanzhibao;
										}
									}
								}
							};
							if(source){
								if(source.side==this.side){
									assignzhibao(this,source);
								}
								else{
									if(this.$.longchuanzhibao){
										source.gainZhibao(true,this);
									}
								}
							}
							else{
								assignzhibao(this);
							}
							return;
						}
						else if(_status.mode=='jiange'){
							if(get.population('holo')==0){
								game.over(me.identity=='nijisanji');
							}
							else if(get.population('nijisanji')==0){
								game.over(me.identity=='holo');
							}
							return;
						}
						else if(_status.mode=='three'){
							if(this.identity=='zhu'){
								if(game.friend.contains(this)){
									game.over(false);
								}
								else{
									game.over(true);
								}
							}
							else{
								if(this==me){
									game.modeSwapPlayer(game.friendZhu);
								}
								game.friend.remove(this);
								game.enemy.remove(this);
							}
							return;
						}
						if(this.side==me.side){
							_status.friendDied.push(this.name1);
							_status.friendCount.innerHTML='阵亡: '+get.cnNumber(_status.friendDied.length,true);
						}
						else{
							_status.enemyDied.push(this.name1);
							_status.enemyCount.innerHTML='杀敌: '+get.cnNumber(_status.enemyDied.length,true);
						}

						var list=(this.side==me.side)?_status.friend:_status.enemy;
						if((list.length==0&&lib.storage.noreplace_end)||
						(lib.storage.zhu&&lib.storage.main_zhu&&this.identity=='zhu'&&game.players.length>2)){
							if(game.friend.contains(this)){
								game.over(false);
							}
							else{
								game.over(true);
							}
						}
						else if(game.friend.length==1&&this==game.friend[0]&&_status.friend.length==0){
							game.over(false);
						}
						else if(game.enemy.length==1&&this==game.enemy[0]&&_status.enemy.length==0){
							game.over(true);
						}
						else{
							game.replacePlayer(this);
						}
					}
				}
			}
		},
		get:{
			rawAttitude:function(from,to){
				if(from.side==to.side){
					if(to.identity=='zhu'){
						if(_status.connectMode){
							if(_status.mode=='4v4'||_status.mode=='guandu') return 7;
						}
						else{
							if(lib.storage.main_zhu||_status.mode=='four'||_status.mode=='guandu') return 7;
						}
					}
					return 6;
				}
				else{
					if(_status.mode=='siguo'){
						var list=['holo','nijisanji','vtuber','clubs'];
						var map={holo:0,nijisanji:0,vtuber:0,clubs:0};
						var map2={holo:0,nijisanji:0,vtuber:0,clubs:0};
						for(var i=0;i<game.players.length;i++){
							var current=game.players[i];
							map[current.side]+=get.condition(current)*get.threaten(current,false,false);
							map2[current.side]+=current.$.longchuanzhibao;
						}
						var allin=false;
						for(var i in map){
							if(get.population(i)==1){
								map[i]/=1.5;
							}
							if(map2[i]>=4){
								allin=i;
								break;
							}
							else if(map2[i]==3){
								map[i]+=10;
							}
							else if(map2[i]==2){
								map[i]++;
							}
						}
						if(allin) return to.side==allin?-20:0;
						list.sort(function(a,b){
							return map[b]-map[a];
						});
						var id1=list.indexOf(from.side);
						var id2=list.indexOf(to.side);
						var att=-1;
						switch(id1){
							case 0:att=_status.siguoai[id2+2];break;
							case 1:
								switch(id2){
									case 0:att=_status.siguoai[0];break;
									case 2:att=_status.siguoai[1];break;
									case 3:att=_status.siguoai[2];break;
								}
								break;
							case 2:
								switch(id2){
									case 0:att=_status.siguoai[0];break;
									case 1:att=_status.siguoai[1];break;
									case 3:att=_status.siguoai[2];break;
								}
								break;
							case 3:{
								if(id2==0){
									att=_status.siguoai[1];break;
								}
								else{
									att=_status.siguoai[2];break;
								}
							}
						}
						if(map2[to.side]>=4){
							att-=10;
						}
						else if(map2[to.side]==3){
							att-=3;
						}
						else if(map2[to.side]==2){
							att-=0.5;
						}
						if(to.$.longchuanzhibao){
							return att*1.2;
						}
						return att;
					}
					else{
						if(to.identity=='zhu'){
							if(_status.connectMode){
								if(_status.mode=='4v4'||_status.mode=='guandu') return -10;
							}
							else{
								if(lib.storage.main_zhu||_status.mode=='four'||_status.mode=='guandu') return -10;
							}
						}
						return -6;
					}
				}
			},
		},
		help:{
			'对决模式':
			'<div style="margin:10px">同舟共济（四国）</div><ul style="margin-top:0"><li>游戏开始时，每个势力的随机一名角色得到一个龙船至宝，1号位角色所在的势力额外获得一个龙船至宝，场上共5枚龙船至宝。龙船至宝是一个特殊标记。'+
			'<li>争夺龙船至宝的方式：当敌人受到了你造成的伤害后，若其有龙船至宝，则你获得其一个龙船至宝。若你杀死了该敌人，则你获得其所有的龙船至宝。'+
			'<li>获得龙船至宝时的摸牌：除游戏开始时外，若你从非队友处获得了龙船至宝，则你和队友各摸X张牌。（X为该次获得的龙船至宝数；获得队友的龙船至宝不摸牌）'+
			'<li>无来源死亡时：当一名角色死亡时，若没有伤害来源，则其持有的所有龙船至宝交给场上龙船至宝数唯一最多的角色，若没有则随机分配，获得龙船至宝的角色和其队友各摸X张牌。'+
			'<li>杀死队友时：当你杀死队友时，则将你和队友持有的所有龙船至宝交给场上龙船至宝数唯一最多的敌人，若没有则随机分配，获得龙船至宝的角色和其队友各摸X张牌。'+
			'<li>胜利条件：满足一下任意条件游戏结束：（1）在新的一轮开始时，若你的势力获得的龙船至宝至少为4个，则你和队友获胜；（2）消灭所有敌人。'+
			'</ul>'+
			'<div style="margin:10px">2v2 替补模式</div><ul style="margin-top:0"><li>选将时额外选择一名替补武将，阵亡时使用自己的替补武将上场，无替补时改为用队友的替补武将，两人均无替补时游戏结束'+
			'<li>杀死敌方武将摸3张牌，杀死友方武将弃置所有牌</ul>'+
			'<div style="margin:10px">4v4</div><ul style="margin-top:0"><li>双方各有一名主公和三名忠臣，杀死对方主公获胜<li>'+
			'8号位游戏开始时额外摸一张牌，7、8号位可在游戏开始时置换一次手牌<li>'+
			'杀死对方忠臣摸2+x张牌，x为对方（含刚被杀的忠臣）与己方的存活人数之差；主公杀死己方忠臣须弃置所有牌',
		}
	};
});
