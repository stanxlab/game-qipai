const base = require('./base');

// 癞子胡牌算法
module.exports = {
    isHuLaizi,
    isLaiziHuNoPair,
    isLaiziHuByFormatedData,
};

/**
 * 判断带癞子的胡牌
 * @param {*} hand 手牌
 * @param {*} laiziCount 癞子数量 
 */
function isHuLaizi(hand = [], laiziCount = 0, isNeedJiang = true) {
    // if ((hand.length + laiziCount) % 3 !== 2) {
    //     console.log('牌数量不对', hand.length, laiziCount);
    //     // 若牌张数不是2、5、8、11、14则不能胡
    //     return false;
    // }
    let formatData = base.getFormatCardsData(hand);
    // console.log('formatData: ', formatData);

    return isLaiziHuByFormatedData(formatData, laiziCount, isNeedJiang);
}


function isLaiziHuByFormatedData(formatData, laiziCount = 0, isNeedJiang = true) {
    // if (!laiziCount) { // 这里需要处理将牌
    //     return base.isCommonHuByFormatedData(formatData);
    // }
    if (!isNeedJiang) { // 不需要将牌是否可以胡
        return _isLaiziHuNoPairFormatData(formatData, laiziCount);
    }

    for (let i = 0; i < 4; i++) {
        let cardsObj = formatData[i];
        for (let j = 0; j < 9; j++) { // 对列进行操作,用j表示
            let cards = cardsObj.list;
            let jiangCount = 0;
            if (cards[j] >= 2) {
                jiangCount = 2;
            } else if (cards[j] >= 1) {
                jiangCount = 1;
            }
            if (!jiangCount) { // 没有将牌的情况最后统一处理
                continue;
            }

            if (jiangCount === 2 || (jiangCount + laiziCount) >= 2) {
                let newLaiziCount = laiziCount;
                //除去这2张将牌
                cards[j] -= jiangCount;
                cardsObj.total -= jiangCount;
                newLaiziCount -= (2 - jiangCount);

                let result = _isLaiziHuNoPairFormatData(formatData, newLaiziCount);

                //还原这2张将牌
                cards[j] += jiangCount;
                cardsObj.total += jiangCount;
                if (result) {
                    return true;
                }
            }
        }
    }

    // 所有将牌的组合都不能胡, 再判断2个癞子当将牌是否可以胡;
    if (laiziCount >= 2) {
        let result = _isLaiziHuNoPairFormatData(formatData, laiziCount - 2);
        if (result) {
            return true;
        }
    }

    return false;
}

function isLaiziHuNoPair(hand = [], laiziCount = 0) {
    let formatData = base.getFormatCardsData(hand);
    return _isLaiziHuNoPairFormatData(formatData, laiziCount);
}

/**
 * 不带将牌时是否都能成扑
 * - 此时需要将4组牌合并到一起判断,否则会重复多次使用到癞子数量
 * @param {*} formatData 
 * @param {*} laiziCount 
 */
function _isLaiziHuNoPairFormatData(formatData, laiziCount) {
    // for (let i = 0; i < 4; i++) {
    //     let newLaiziCount = laiziCount;
    //     // 所有花色都需要组合成牌, 有一种不能组合,则不能胡
    //     let result = isPuLaizi(formatData[i], newLaiziCount);
    //     // console.log(result, formatData[i]);

    //     if (!result) {
    //         return false;
    //     }
    // }
    // return true;

    let tmpCardObj = {
        canLine: true, // 默认可以为数组
        total: 0,
        list: [],
    };

    for (let item of formatData) {
        tmpCardObj.total += item.total;
        // 中间插入3个空置,避免出现 19,20,21 这种不存在的顺子
        tmpCardObj.list = tmpCardObj.list
            .concat([0, 0, 0])
            .concat(item.list);
    }
    tmpCardObj.canLineMinIdx = tmpCardObj.list.length - 10; // 最后9个字牌不能当顺子

    let isHu = isPuLaizi(tmpCardObj, laiziCount);
    // console.log('=========', isHu, JSON.stringify(tmpCardObj));
    return isHu;
}

// 分析三张和顺子, 是否成扑, 含癞子
function isPuLaizi(cardsObj, laiziCount = 0) {
    if (cardsObj.total == 0) { // 本花色没有牌了
        return true;
    }

    let cards = cardsObj.list;
    let cardIdx = base.getFirstCardIndex(cards);
    let shunziDecrIdxs = [cardIdx];
    let shunziCount = 1;
    if (cards[cardIdx + 1] > 0) {
        shunziCount++;
        shunziDecrIdxs.push(cardIdx + 1);
    }
    if (cards[cardIdx + 2] > 0) {
        shunziCount++;
        shunziDecrIdxs.push(cardIdx + 2);
    }

    //作为顺牌, 字牌不能做顺子
    if (cardsObj.canLine &&
        (shunziCount === 3 || (shunziCount + laiziCount) >= 3) &&
        (!cardsObj.canLineMinIdx || cardIdx < cardsObj.canLineMinIdx) // 此时表示字牌
    ) {
        let newLaiziCount = laiziCount;
        //除去这3张顺牌
        for (let idx of shunziDecrIdxs) {
            cards[idx]--;
        }
        cardsObj.total -= shunziCount;
        newLaiziCount -= (3 - shunziCount); // 去除需要的癞子数
        let result = isPuLaizi(cardsObj, newLaiziCount);
        //还原这3张顺牌
        for (let idx of shunziDecrIdxs) {
            cards[idx]++;
        }
        cardsObj.total += shunziCount;
        if (result) {
            return true;
        }
    }

    let keziCount = 0;
    if (cards[cardIdx] >= 3) {
        keziCount = 3;
    } else if (cards[cardIdx] >= 1) {
        keziCount = cards[cardIdx];
    }

    if (keziCount === 3 || (keziCount + laiziCount >= 3)) { //作为刻牌
        let newLaiziCount = laiziCount;
        //除去这3张刻牌
        cards[cardIdx] -= keziCount;
        cardsObj.total -= keziCount;
        newLaiziCount -= (3 - keziCount); // 去除需要的癞子数
        let result = isPuLaizi(cardsObj, newLaiziCount);
        //还原这3张刻牌
        cards[cardIdx] += keziCount;
        cardsObj.total += keziCount;
        if (result) {
            return true;
        }
    }

    return false;
}