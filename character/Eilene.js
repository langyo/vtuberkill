'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'Eilene',
		connect:true,
		character:{
			Yomemi:['female','Eilene',3,['mokuai','yaoji']],
		},
		 characterIntro:{
			Yomemi:' ',
		 },
		 skill:{
			mokuai:{
				mod:{
	//				cardEnabled:function(card,player,now){
	//					if(!player.countCards('e')&&get.name(card)=='sha')		return false;
	//				},
					selectTarget:function(card,player,range){
						if(get.name(card)=='sha')
							return range[1]=Math.floor(player.countCards('e'))||1;
					},
				},
				forced:true,
				priority:220,
				trigger:{player:'recoverBegin'},
				filter:function(event,player){
						return true;
				},
				content:function(){
					console.log('OK')
					trigger.num = player.countCards('e')||1;
				},
			},
			yaoji:{
				enable:"phaseUse", 
				usable:1,
				filter:function(event,player){
					return player.countCards('he')>0
				},
				filterCard:function(card){
					return true;
				},
				selectCard:[1,Infinity],
				position:'he',
				filterTarget:function(card,player,target){
					return target!=player;
				},
				selectTarget:function(){
					var player = _status.event.player;
					var min = 1;
					var max = Math.floor(player.countCards('e'))||1;
					return [min,max];
				},
				discard:true,
				multitarget:false,
				targetprompt:[],
				content:function(){
					'step 0'
					_status.event.target = target;
					var type = [];
					for(var i=0;i<cards.length;i++){
						type.add(get.type(cards[i],'trick',cards[i].original=='h'?player:false));
					}
					var num = type.length;
					var cards = get.cards(num);
					player.showCards(cards,'致命药剂亮出牌堆');
					var suits = [];
					for(var i=0;i<cards.length;i++){
						suits.push(get.suit(cards[i]));
					}
					_status.event.suits = suits;
					_status.event.time = 0;
					'step 1'
			//		var time = _status.event.time;
					game.broadcastAll(function(target, suits){
						console.log(suits);
						var next=target.discardPlayerCard("弃置与亮出牌花色和数量（"+get.translation(suits)+"）相同的牌", target, 'he');
						next.set('selectButton',suits.length);
						next.set('filterButton',function(card){
							if(ui.selected.buttons.length){
								console.log(ui.selected.buttons);
								return get.suit(card) == suits[ui.selected.buttons.length];
							}
							else{
								return get.suit(card) == suits[0];
							}
						});
						next.set('forced',false);
					}, _status.event.target, _status.event.suits);
			//		_status.event.time++;
					'step 2'
					if(!result.cards||result.cards.length<_status.event.suits.length){
						event.target.damage('player',1);
					}
				},
			},
		 },
		 translate:{
			Yomemi:'ヨメミ',
			mokuai:'模块搭载',
			mokuai_info:'<font color=#f00>锁定技</font> 你的【杀】和“致命药剂”可指定的目标数为X；你每次回复体力固定回复X点。（X为你装备区内牌数且至少为1）。',
			yaoji:'致命药剂',
			yaoji_info:'出牌阶段限一次，你可以选择一名角色，弃置任意张牌，然后亮出牌堆顶等于其类型数的牌。目标角色需依次选择：弃置与这些亮出牌等量且花色相同的牌；或受到你造成的1点伤害。',
		 },
	};
});
	