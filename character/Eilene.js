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
					cardEnabled:function(card,player,now){
						if(!player.countCards('e')&&get.name(card)=='sha')		return false;
					},
					selectTarget:function(card,player,range){
						if(get.name(card)=='sha')
							return range[1]=Math.floor(player.countCards('e'));
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
					trigger.num = player.countCards('e');
				},
			},
			yaoji:{
				enable:"phaseUse", 
				usable:1,
				filter:function(event,player){
					return player.countCards('e')>0
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
					var max = Math.floor(player.countCards('e'));
					return [min,max];
				},
				discard:true,
				multitarget:false,
				targetprompt:[],
				content:function(){
					'step 0'
					_status.event.target = target;
					console.log(cards);
					var type = [];
					for(var i=0;i<cards.length;i++){
						type.add(get.type(cards[i],'trick',cards[i].original=='h'?player:false));
						console.log(cards[i].original);
					}
					var num = type.length;
					var cards = get.cards(num);
					player.showCards(cards,'致命药剂亮出牌堆');
					var suits = [];
					for(var i=0;i<cards.length;i++){
						suits.add(get.suit(cards[i]));
					}
					console.log(suits);
					_status.event.suits = suits;
					_status.event.time = 0;
					'step 1'
					var time = _status.event.time;
					game.broadcastAll(function(target, suits){
							target.chooseToDiscard('请弃置花色分别为'+get.translation(suits)+'的牌\n（目前为'+get.translation(suits[time])+'）', 1, function(card){
								return get.suit(card) == suits[time];
							})
					}, _status.event.target, _status.event.suits);
					_status.event.suits++;
					'step 2'
					if(result.bool&&_status.event.time<suits.length){
						event.goto(1);
					}
					else if(!result.bool){
						event.target.damage(1);
					}
				},
			},
		 },
		 translate:{
			Yomemi:'嫁实',
			mokuai:'模块搭载',
			mokuai_info:'锁定技。你的装备区每有两张牌，你的【杀】和“致命药剂”便可多指定一个目标。',
			yaoji:'致命药剂',
			yaoji_info:'出牌阶段限一次，你可以选择一名角色，弃置任意张牌，然后亮出牌堆顶等于其类型数的牌。目标角色需依次选择：弃置与这些亮出牌的等量且花色相同的牌；或受到你造成的1点伤害。',
		 },
	};
});
	