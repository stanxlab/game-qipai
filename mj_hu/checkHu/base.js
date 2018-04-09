module.exports = {
    getFormatCardsData,
    isCommonHuByFormatedData,
    isHuCommon,
    isPuCommon,
    getFirstCardIndex,
};

/**
 * 判断是否胡牌
 * - 通用胡牌算法
 * @param hand Array 手牌
 */
function isHuCommon(hand = []) {

    if (hand.length % 3 !== 2) {
        console.error('{isHuCommon},算法出错了,数据为:' + JSON.stringify(hand));
        return false;
    }

    let formatData = getFormatCardsData(hand);

    return isCommonHuByFormatedData(formatData);
}

/**
 * 按照指定格式计算每种牌的数据
 * @param {Array} hand  手牌
 */
function getFormatCardsData(hand) {
    let rs = [{
        total: 0, // 当前花色总张数,
        canLine: true, // 是否可以胡顺子
        list: [0, 0, 0, 0, 0, 0, 0, 0, 0], // 1-9W 每个的张数
    }, {
        total: 0,
        canLine: true,
        list: [0, 0, 0, 0, 0, 0, 0, 0, 0], // 1-9T 每个的张数
    }, {
        total: 0,
        canLine: true,
        list: [0, 0, 0, 0, 0, 0, 0, 0, 0], // 1-9S 每个的张数
    }, {
        total: 0,
        canLine: false, // 字牌不能胡顺子
        list: [0, 0, 0, 0, 0, 0, 0, 0, 0], // 字牌 每个的张数
    }];

    for (let i = 0; i < hand.length; i++) {
        let paiTypeIndex = parseInt(hand[i] / 10) - 1;
        let paiPointIndex = hand[i] % 10 - 1;
        rs[paiTypeIndex]['list'][paiPointIndex]++;
        rs[paiTypeIndex]['total']++;
    }

    return rs;
}

// 分析三张和顺子,是否成扑
function isPuCommon(cardsObj) {
    if (cardsObj.total == 0) { // 本花色没有牌了
        return true;
    }

    let cards = cardsObj.list;
    let cardIdx = getFirstCardIndex(cards);

    let result = false;
    if (cards[cardIdx] >= 3) { //作为刻牌
        //除去这3张刻牌
        cards[cardIdx] -= 3;
        cardsObj.total -= 3;
        result = isPuCommon(cardsObj);
        //还原这3张刻牌
        cards[cardIdx] += 3;
        cardsObj.total += 3;
        return result;
    }
    //作为顺牌
    if (cardsObj.canLine && (cardIdx < 7) &&
        (cards[cardIdx + 1] > 0) && (cards[cardIdx + 2] > 0)
    ) {
        //除去这3张顺牌
        cards[cardIdx]--;
        cards[cardIdx + 1]--;
        cards[cardIdx + 2]--;
        cardsObj.total -= 3;
        result = isPuCommon(cardsObj);
        //还原这3张顺牌
        cards[cardIdx]++;
        cards[cardIdx + 1]++;
        cards[cardIdx + 2]++;
        cardsObj.total += 3;
        return result;
    }
    return result;
}

// 是否胡牌[通用胡法] 
function isCommonHuByFormatedData(formatData) {
    let jiangTypeIdx; // 将牌花色index
    let jiangExisted = false;
    for (let i = 0; i < 4; i++) {
        let remain = formatData[i].total % 3;
        if (remain === 1) { // 某个花色剩余单张,肯定不能胡
            return false;
        } else if (remain === 2) { // 剩余2张,只能用于将牌
            if (jiangExisted) { // 将牌已经存在时,某个花色还剩余2张,肯定不能胡
                return false;
            }
            jiangTypeIdx = i;
            jiangExisted = true;
        }
    }

    // 遍历每种花色的牌,含将牌的暂时不处理
    for (let i = 0; i < 4; i++) {
        if (i === jiangTypeIdx) {
            continue;
        }
        if (!isPuCommon(formatData[i])) { // 当前牌型不符合
            return false;
        }
    }

    // 该类牌中要包含将,因为要对将进行轮询,效率较低,放在最后
    let success = false; // 表示除掉 2张将牌 后能否通过
    for (let j = 0; j < 9; j++) { // 对列进行操作,用j表示
        let cardsObj = formatData[jiangTypeIdx];
        let cards = cardsObj.list;
        if (cards[j] >= 2) {
            //除去这2张将牌
            cards[j] -= 2;
            cardsObj.total -= 2;
            if (isPuCommon(cardsObj)) {
                success = true;
            }
            //还原这2张将牌
            cards[j] += 2;
            cardsObj.total += 2;
            if (success) {
                break;
            }
        }
    }

    return success;
}

// 寻找第一张牌,跳过为0的数字
function getFirstCardIndex(cards) {
    for (let j = 0; j < 10; j++) {
        if (cards[j] > 0) {
            return j;
        }
    }
    return 0;
}