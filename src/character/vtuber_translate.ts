let { lib } = window.vkCore
export default {
    vtuber_upd8: `UPD8`,
    KizunaAI: `绊爱`,
    KizunaAI_info: `绊爱`,
    ailian: `爱链`,
    ailian_info: `出牌阶段限一次，你可以将任意手牌展示并交给其他角色，若给出的牌类型均不同，你可以令等量角色横置；若获得牌的角色互相相邻，你可以视为使用了一张指定目标数等于获得牌角色数的基本牌。`,
    ailian_append: lib.figurer(`特性：传递关键牌`),
    qixu: `启虚`,
    qixu1: `启虚`,
    qixu2: `启虚`,
    qixu3: `杀启虚`,
    qixu4: `启虚`,
    qixu5: `闪启虚`,
    qixu_info: `主公技 当你需要使用或打出【杀】或【闪】时，你可以声明之，若没有角色弃置一张声明牌，则视为你使用或打出了此牌。每轮每项限一次。`,
    qixu_append: lib.figurer(`特性：白嫖[基本牌]`),

    MiraiAkari: `未来明`,
    shiyilijia: `失忆离家`,
    shiyilijia_info: `出牌阶段限一次，你可弃置所有手牌，若如此做，你于回合结束时摸等量的牌。`,
    shiyilijia_append: lib.figurer(`特性：制衡 克己`),
    seqinghuashen: `色情化身`,
    seqinghuashen_info: `其他角色的【桃】因使用进入弃牌堆时，你可以令其摸一张牌，然后你获得其一张牌。`,

    InuyamaTamaki: `犬山玉姬`,
    InuyamaTamaki_info: `犬山玉姬`,
    rongyuchengyuan: `荣誉成员`,
    rongyuchengyuan_putMark: `荣誉成员`,
    rongyuchengyuan_info: `其他角色对你造成伤害时，若其没有「homolive」标记，你可令其获得一个，然后防止此伤害。<br>
    结束阶段，你可以摸X张牌（X为场上手牌数为0或拥有「homolive」标记的角色数），`,
    hundunliandong: `混沌联动`,
    hundunliandong_info: `出牌阶段限一次，你可以指定包括你在内势力各不同的任意名角色，从你开始依次弃一张牌直到：<br>
    弃置牌含有四种花色；一名角色因此失去最后一张手牌。<br><br>
    此技能计算势力时，拥有「homolive」标记的角色视为同一势力`,
    hundunliandong_append: lib.figurer(`特性：强制弃牌`),

    ShirayukiMishiro: `白雪深白`,
    yi: '衣',
    tianyi: `梦幻天衣`,
    tianyi_info: `出牌阶段限一次，若你没有装备防具，你可以将一张牌置于武将牌上，称为「衣」。<br>
    当你使用锦囊牌或成为锦囊牌的目标时，若该牌花色与「衣」不同，你摸一张牌；若花色相同，你可以取消之并获得此牌。<br>
    若你于一个回合内发动了以上两项，你弃置所有的「衣」。<br><br>
    准备阶段，你弃置所有的「衣」并可以移动场上一张牌。`,
    nveyu: `甜言虐语`,
    nveyu_info: `锁定技 当你于一回合内首次造成伤害时，你令目标回复一点体力，与其各摸一张牌，令你于本回合内对其使用牌无距离与次数限制。`,
    nveyu_append: lib.figurer(`特性：难上手 辅助`),

    Siro: `电脑少女小白`,
    Siro_ab: `小白`,
    zhongxinghezou: `众星合奏`,
    zhongxinghezou_info: `每回合限一次，你使用实体牌指定目标后，可不为此牌目标的一名角色展示一张手牌。若两牌点数之和：<br>
    ＜12~令你使用的牌无效，你获得亮出牌；<br>
    ≥12~你使用的牌结算后，对方对相同目标使用亮出牌；<br>
    为12~你摸一张牌，对方回复1点体力。`,
    zhongxinghezou_append: lib.figurer(`通过指定队友或自己，实现一回合出多次【杀】和摸牌`),
    xiugong: `天道宿宫`,
    xiugong_info: `出牌阶段开始时，你可以猜测一名其他角色手牌中锦囊牌的数量并令其展示手牌，若猜测正确，你摸一张牌并令你本回合的『众星合奏』增加等量次数上限。`,
    xiugong_append: lib.figurer(`特性：观看手牌 额外摸牌 难上手`),

    Bacharu: `巴恰鲁`,
    zuodun: `我身作盾`,
    zuodun_info: `每回合限一次，其他角色受到伤害时，你可将此伤害转移给你，然后你与伤害来源各摸一张牌并获得『众星合奏』直到你的回合结束。`,
    zuodun_append: lib.figurer(`特性：辅助`),
    baidao: `白道游星`,
    baidao_info: `出牌阶段限一次，你可以展示所有手牌，每有一张点数大于J便回复1点体力；每有一张点数小于3便令你本回合的『众星合奏』增加1次数上限。`,

    XiaoxiXiaotao: `小希小桃`,
    XiaoxiXiaotao_info: `小希小桃`,
    yipengyidou: `一捧一逗`,
    yipengyidou_info: `出牌阶段限一次，你可与一名其他角色拼点，赢的角色可以视为使用一张本回合进入弃牌堆的一张基本牌或通常锦囊牌。没赢的角色选择一项：也如此做；令对方回复1点体力。`,
    yipengyidou_append: lib.figurer(`通过与队友拼点，多次使用关键牌`),
    renleiguancha: `人类观察`,
    renleiguancha_info: `结束阶段，你可以选择一名其他角色。你的下回合开始时，若该角色在期间：<br>
    造成过伤害~你摸一张牌；死亡或杀死过角色~你对指定角色造成1点伤害；以上皆无~你摸两张牌并失去1点体力。`,
    renleiguancha_append: lib.figurer(`特性：额外摸牌`),

    Reine: `兰音`,
    yueyao: `月谣`,
    yueyao_info: `锁定技 游戏或回合开始时，你记录当前的手牌数为X。<br>
    一名角色的手牌数为X时，其不能对你使用牌。<br>
    你手牌数等于X时，造成的伤害+1。`,
    yueyao_append: lib.figurer(`特性：爆发`),
    kongling: `空灵`,
    kongling_info: `你受到伤害后，可以令一名角色将手牌调整至X。`,
    kongling_append: lib.figurer(`特性：卖血 辅助`),

    KaguyaLuna: `辉夜月`,
    KaguyaLuna_info: `辉夜月`,
    jiajiupaidui: `假酒派对`,
    jiajiupaidui_info: `轮次技 当你需要使用【酒】时，你可以令两名角色各弃置一张牌，若其中包含♠或点数9，视为你使用之（不计入次数）。若均为♠或点数9，你摸一张牌并重置此技能。`,
    jiajiupaidui_append: lib.figurer(`特性：白嫖【酒】 强制弃牌`),
    kuangzuiluanwu: `狂醉乱舞`,
    kuangzuiluanwu_info: `<font color=#daa>限定技</font> 出牌阶段，你可以扣减一点体力上限，视为使用了一张无距离限制且目标数为X的【杀】。（X为你当前的【酒】状态层数）`,

    InabaHaneru: `因幡はねる`,
    jiance: `监策`,
    jiance_info: `你体力减少后，可以令一名角色展示所有手牌，若不包含所有类型的牌，你可以令另一名角色摸X张牌（X为其中不包含的类型数）。`,
    jiance_append: lib.figurer(`特性：卖血`),
    chanbing: `缠病`,
    chanbing_info: `锁定技 一轮开始时，你进行判定，若点数与你武将牌上的牌均不相同，将之置于你武将牌上并回复1点体力；否则，你失去1点体力。`,
    buyu: `不渝`,
    buyu_info: `一名角色死亡时，你可以将其所有牌置于武将牌上并获得其的一个技能直到你下次以此法获得技能。`,
    buyu_append: lib.figurer(`特性：难上手`),

    UmoriHinako: `宇森ひなこ`,
    hongyi: `红移`,
    hongyi_info: `每回合限一次，当出现红色判定结果后，你可以令当前回合角色交给你一张牌。`,
    jueshou: `绝收`,
    jueshou_info: `出牌阶段限一次，你可以将一张黑色基本牌或装备牌当作【兵粮寸断】使用，若为♣，则此【兵粮寸断】无距离限制；若为装备牌，其他角色计算与你的距离+1直到你下个回合开始。`,
    jueshou_append: lib.figurer(`特性：易上手`),

    Kaf: `花谱Kaf`,
    Kaf_ab: `花谱`,
    yu:`羽`,
    liuhua: `化羽`,
    liuhua_info: `一个回合结束时，若有角色受到了伤害，你可以将所有手牌置于武将牌上，称为「羽」，并获得一个额外回合。<br>
    你的「羽」数量增加后，若之包含四种花色，你获得一种颜色的「羽」并翻面*。`,
    yishi: `遗世`,
    yishi_info: `锁定技 你的额外回合不会因翻面而被跳过。<br>
    在你的额外回合内，你使用牌只能指定你或上一回合角色为目标，且其他角色不能使用或打出牌。`,
    yishi_append: lib.figurer(`特性：难上手`),
    shiji: `市迹`,
    shiji2: `市迹`,
    shiji_info: `主公技 同势力角色的出牌阶段限一次，其可以将「羽」牌不包含花色的任意张牌置为「羽」。`,
    shiji_append: lib.figurer(`只能在已有「羽」时发动`),

    Rim: `理芽`,
    shenghua: `生花`,
    shenghua_info: `出牌阶段，你可以弃置所有手牌，然后摸X张牌。（X为弃牌数减去本阶段此技能发动的次数）`,
    zhanchong: `绽虫`,
    zhanchong_info: `当一张装备牌不因使用正面朝上离开你的手牌区时，你可以翻面*并弃置其他角色的一张牌，若不为装备牌，其受到一点伤害。`,
    zhanchong_append: lib.figurer(`特性：爆发 易上手`),

    Kafu: `可不Kafu`,
    Kafu_ab: `可不`,
    nisheng: `拟声`,
    nisheng_info: `一个额定回合结束后，你可以展示两张点数相同的手牌并获得一个额外的回合。每个点数限一次。`,
    jingyan: `精赝`,
    jingyan_info: `你受到伤害后，可以翻面*并获得来源一半的牌（向上取整），以此获得的牌不计入手牌上限。`,
    jingyan_append: lib.figurer(`特性：卖血`),

    IsekaiJoucho: `ヰ世界情绪`,
    baiqing: `白情`,
    baiqing_info: `一回合内第X张【杀】被使用时，你可以亮出牌堆顶X张牌，获得其中与此【杀】颜色不同的牌。<br>
    （X为你已损失的体力值+1）`,
    shuangxing: `星徊`,
    shuangxing_info: `你使用仅指定其他角色为目标的锦囊牌后，可以选择一项：<br>
    令你本回合使用牌无次数限制；令其中一名目标对你使用一张【杀】，否则你获得其一张牌。`,
    shuangxing_append: lib.figurer(`特性：挑衅`),

    DoumyoujiHaruto: `道明寺晴翔`,
    YuNi: `YuNi`,
    Fairys: `Fairys`,
}