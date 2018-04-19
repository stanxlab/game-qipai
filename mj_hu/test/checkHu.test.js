const should = require('should');

describe('测试 通用胡法', function () {
    const checkHu = require('../checkHu').common;
    it('#checkHu::isHuCommon() 九宝连灯胡牌 ', function () {
        let hand = [11, 11, 11, 12, 13, 14, 15, 16, 17, 18, 19, 19, 19];
        // 测试胡1W ~ 9W
        for (let lastCard = 11; lastCard <= 19; lastCard++) {
            let shouPai = hand.slice(0);
            shouPai.push(lastCard);
            let rs = checkHu.isHuCommon(shouPai);
            // console.log(shouPai.length, '', rs);
            rs.should.be.true();
        }

        {
            let lastCard = 21; // 不能胡21
            let shouPai = hand.slice(0);
            shouPai.push(lastCard);
            let rs = checkHu.isHuCommon(shouPai);
            rs.should.be.false();
        }
    });

    it('#checkHu::isHuCommon() 可以胡 #1 ', function () {
        let shouPai = [11, 11, 11, 12, 12, 12, 24, 24, 24, 45, 45];
        let rs = checkHu.isHuCommon(shouPai);
        rs.should.be.true();
    });

    it('#checkHu::isHuCommon() 不能胡 #1 ', function () {
        let shouPai = [11, 11, 11, 12, 12, 12, 24, 24, 24, 41, 45];
        let rs = checkHu.isHuCommon(shouPai);
        rs.should.be.false();
    });

});

describe('测试 带癞子的胡牌算法', function () {
    const checkHu = require('../checkHu').laiziHu;
    describe('没有癞子时的验证', function () {
        it('#checkHu::isHuLaizi() 九宝连灯胡牌 ', function () {
            let hand = [11, 11, 11, 12, 13, 14, 15, 16, 17, 18, 19, 19, 19];
            // 测试胡1W ~ 9W
            for (let lastCard = 11; lastCard <= 19; lastCard++) {
                let shouPai = hand.slice(0);
                shouPai.push(lastCard);
                let rs = checkHu.isHuLaizi(shouPai);
                // console.log(shouPai.length, '', rs);
                rs.should.be.true();
            }

            {
                let lastCard = 21; // 不能胡21
                let shouPai = hand.slice(0);
                shouPai.push(lastCard);
                let rs = checkHu.isHuLaizi(shouPai);
                rs.should.be.false();
            }
        });

        it('#checkHu::isHuLaizi() 可以胡 #1 ', function () {
            let shouPai = [11, 11, 11, 12, 12, 12, 24, 24, 24, 45, 45];
            let rs = checkHu.isHuLaizi(shouPai);
            rs.should.be.true();
        });

        it('#checkHu::isHuLaizi() 不能胡 #1 ', function () {
            let shouPai = [11, 11, 11, 12, 12, 12, 24, 24, 24, 41, 45];
            let rs = checkHu.isHuLaizi(shouPai);
            rs.should.be.false();
        });
    });

    describe('不需要将牌,有癞子时的验证', function () {
        it('#checkHu::isLaiziHuNoPair() 2个癞子可以胡胡 #1 ', function () {
            let shouPai = [11, 11, 14, 15, 24, 24, 24];
            let laiziCount = 2;
            let rs = checkHu.isLaiziHuNoPair(shouPai, laiziCount);
            rs.should.be.true();
        });
    });

    describe('有癞子时的验证', function () {
        it('#checkHu::isHuLaizi() 1个癞子可以胡 #1 ', function () {
            let shouPai = [11, 11, 11, 12, 12, 12, 24, 24, 24, 45];
            let laiziCount = 1;
            let rs = checkHu.isHuLaizi(shouPai, laiziCount);
            rs.should.be.true();
        });

        it('#checkHu::isHuLaizi() 2个癞子可以胡 #1 ', function () {
            let shouPai = [11, 11, 13, 14, 15, 24, 24, 24, 45];
            let laiziCount = 2;
            let rs = checkHu.isHuLaizi(shouPai, laiziCount);
            rs.should.be.true();
        });

        it('#checkHu::isHuLaizi() 3个癞子可以胡 #1 ', function () {
            let shouPai = [11, 11, 13, 15, 24, 24, 24, 45];
            let laiziCount = 3;
            let rs = checkHu.isHuLaizi(shouPai, laiziCount);
            rs.should.be.true();
        });

        it('#checkHu::isHuLaizi() 4个癞子可以胡 #1 ', function () {
            let shouPai = [11, 11, 15, 24, 24, 24, 45];
            let laiziCount = 4;
            let rs = checkHu.isHuLaizi(shouPai, laiziCount);
            rs.should.be.true();
        });

        it('#checkHu::isHuLaizi() 2个癞子不能胡 #1 ', function () {
            let shouPai = [11, 11, 13, 14, 19, 24, 24, 28, 45];
            let laiziCount = 2;
            let rs = checkHu.isHuLaizi(shouPai, laiziCount);
            rs.should.be.false();
        });

        it('#checkHu::isHuLaizi() 2个癞子做将才能胡 #1 ', function () {
            let shouPai = [11, 11, 11, 14, 15, 16, 24, 24, 24];
            let laiziCount = 2;
            let rs = checkHu.isHuLaizi(shouPai, laiziCount);
            rs.should.be.true();
        });
    });

    describe('有癞子时的,不需要将牌时验证, TODO: ', function () {
        it('#checkHu::isHuLaizi() 1个癞子不能胡 #1 ', function () {
            let shouPai = [14, 15, 16, 17, 17, 33, 34, 45, 45];
            let laiziCount = 1;
            let isNeedJiang = false;
            let rs = checkHu.isHuLaizi(shouPai, laiziCount, isNeedJiang);
            rs.should.be.false();
        });

        it('#checkHu::isHuLaizi() 1个癞子不能胡(字牌不能当顺子) #22 ', function () {
            let shouPai = [14, 15, 16, 17, 17, 17, 45, 46];
            let laiziCount = 1;
            let isNeedJiang = false;
            let rs = checkHu.isHuLaizi(shouPai, laiziCount, isNeedJiang);
            console.log('--------', rs);
            rs.should.be.false();
        });
    });

});