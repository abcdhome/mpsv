const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT

app.use(cors());
app.use(express.json());

const BOSS_PRICES = {
    // 주간 보스 (초급 ~ 카루타) 
    "카오스 자쿰": 4040000,
    "하드 매그너스": 4280000,
    "카오스 반반": 4070000,
    "카오스 피에르": 4080000,
    "카오스 블러디퀸": 4070000,
    "카오스 벨룸": 4640000,
    "카오스 파풀라투스": 6550000,

    // 주간 보스 (스우 ~ 검밑솔)
    "노말 스우": 8350000,
    "노말 데미안": 8750000,
    "이지 루시드": 14900000,
    "이지 윌": 16100000,
    "노말 가디언 엔젤 슬라임": 12700000,
    "노말 루시드": 17800000,
    "노말 윌": 20500000,
    "노말 더스크": 22000000,
    "노말 듄켈": 23700000,
    "하드 데미안": 46400000,
    "하드 스우": 48900000,

    // 주간 보스 (상위 그란디스)
    "하드 루시드": 59700000,
    "하드 윌": 73200000,
    "노말 진 힐라": 67600000,
    "카오스 더스크": 66300000,
    "하드 듄켈": 89600000,
    "하드 진 힐라": 100000000,
    "카오스 가디언 엔젤 슬라임": 71300000,
    "노말 선택받은 세렌": 167000000,
    "이지 감시자 칼로스": 238000000,
    "이지 최초의 대적자": 261000000,
    "하드 선택받은 세렌": 302000000,
    "이지 카링": 320000000,
    "이지 벨로나": 396000000,
    "노말 감시자 칼로스": 479000000,
    "노말 최초의 대적자": 532000000,
    "익스트림 스우": 545000000,
    "노말 찬란한 흉성": 576000000,
    "노말 카링": 593000000,
    "노말 벨로나": 824000000,
    "노말 림보": 995000000,

    // 월간 보스 & 엔드 콘텐츠 영역
    "카오스 감시자 칼로스": 1230000000,
    "노말 발드릭스": 1320000000,
    "하드 최초의 대적자": 1390000000,
    "노말 유피테르": 1560000000,
    "하드 카링": 1560000000,
    "익스트림 선택받은 세렌": 1840000000,
    "하드 림보": 2385000000,
    "하드 찬란한 흉성": 2678000000,
    "하드 벨로나": 2950000000,
    "하드 발드릭스": 3078000000,
    "익스트림 감시자 칼로스": 4104000000,
    "하드 유피테르": 4845000000,
    "익스트림 최초의 대적자": 4712000000,
    "하드 검은 마법사": 465000000, 
    "익스트림 카링": 5387000000,
    "익스트림 검은 마법사": 5680000000
};

// [수정] 계산용 라우터 (보스별 개별 파티원 분할 정산 로직 반영)
app.post('/api/calculate', (req, res) => {
    // 프론트엔드에서 구조화해서 보내주는 개별 매칭 데이터 배열을 받음
    const { selectedBossesWithParty } = req.body; 
    
    // 안전장치 데이터 예외 처리
    if (!selectedBossesWithParty || !Array.isArray(selectedBossesWithParty)) {
        return res.json({ totalRevenue: 0, bossCount: 0 });
    }

    let totalRevenue = 0;

    // 개별 보스 객체 순회하면서 각각 지정된 partySize로 1/n 연산 진행
    selectedBossesWithParty.forEach(bossObj => {
        const bossName = bossObj.name;
        const individualPartySize = bossObj.partySize || 1; // 혹시 누락되면 1명으로 방어 코드

        if (BOSS_PRICES[bossName]) {
            // 인게임 정산 메커니즘과 완전히 일치하도록 보스를 잡고 1/n로 나눈 몫에서 소수점 내림 후 누적합 계산
            const sharedPrice = Math.floor(BOSS_PRICES[bossName] / individualPartySize);
            totalRevenue += sharedPrice;
        }
    });

    res.json({
        totalRevenue: totalRevenue,
        bossCount: selectedBossesWithParty.length
    });
});

app.listen(PORT, () => {
    console.log(`보스 계산기 서버가 ${PORT}번 포트에서 구동 중입니다.`);
});