import React, { useState, useEffect } from "react";
import { useScore } from "../../contexts/ScoreContext";
import { Choice } from "../../types/form";

interface GameSettingsProps {
  onStart: (teamAName: string, teamBName: string) => void;
}

// 동적 스토리 데이터 정의
export const storyData = {

  start: {
    text: '🏘️ {teamAName} 파티와 {teamBName} 파티는 아를리아 세계의 시작점 \'시간의 마을\'에 도착했습니다!\n\n👴 마을 장로: "어서 오시오, 모험가들이여! 이곳은 시간의 마을이오. 보시다시피 모든 시계가 각각 다른 시간을 가리키고 있지요."\n\n👥 마을 사람들이 각자 다른 시간 속에서 살고 있는 것을 발견했습니다. 어떤 사람은 아침을, 어떤 사람은 저녁을, 또 어떤 사람은 과거나 미래를 살고 있습니다.\n\n👴 마을 장로: "시간의 계단에 대한 전설을 들려드리겠소. 계단의 정상에는 \'시간의 조각\'이 숨겨져 있어서, 그것을 얻으면 시간을 자유롭게 조종할 수 있다고 하오. 하지만 조심하시오! 시간을 바꾸면 세계에 균열이 생기고, 그림자 같은 실체 없는 존재들이 나타날 수 있소."\n\n👴 마을 장로: "7대 종족의 마을들을 순서대로 방문하여 각 종족의 도움을 받으시오. 각 종족은 고유한 능력과 지혜를 가지고 있어서, 그들의 도움 없이는 시간의 계단에 도달할 수 없소."\n\n👴 마을 장로: "하지만 첫 번째로 방문할 마을이 어디인지는 알려드릴 수 없소. 각 마을의 특징을 찾아서 올바른 순서로 방문해야 한다오. 어떤 방법으로 첫 번째 마을을 찾겠는가?"',
    choices: [
      {
        text: "🗺️ 고대 지도를 확인한다",
        next: "ancient_map_event",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "👥 마을 사람들과 대화한다",
        next: "village_talk_event",
        scoreA: 7,
        scoreB: 7,
      },
      {
        text: "🏔️ 산길을 따라간다",
        next: "mountain_path_event",
        scoreA: 4,
        scoreB: 4,
      },
      {
        text: "🌲 숲속을 탐험한다",
        next: "forest_exploration_event",
        scoreA: 6,
        scoreB: 6,
      },
    ],
  },
  
  // 초기 이벤트들 - 벨로아족 마을로 가는 길
  ancient_map_event: {
    text: "🗺️ 고대 지도를 펼쳐 첫 번째 마을을 찾습니다. 지도에는 7개 종족의 마을들이 표시되어 있습니다.\n\n🗺️ 지도 관리인: \"이 지도는 수백 년 전에 그려진 것이다. 각 마을마다 고유한 특징이 있다네.\"\n\n🗺️ 지도 관리인: \"지도를 자세히 보니 첫 번째 마을의 특징이 보인다. 어떤 특징을 발견했는가?\"",
    choices: [
      {
        text: "🗡️ 동쪽의 검 모양 산맥에서 무언가 소리가 들린다",
        next: "map_clue_1",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌑 그림자가 드리운 계곡이 있다",
        next: "map_clue_2",
        scoreA: 3,
        scoreB: 3,
      },
      {
        text: "🌪️ 바람이 부는 언덕이 있다",
        next: "map_clue_3",
        scoreA: 3,
        scoreB: 3,
      },
    ],
  },
  
  village_talk_event: {
    text: "👥 마을 사람들과 대화하여 벨로아족의 마을에 대한 정보를 얻습니다. 사람들은 각자 다른 시간 속에서 살고 있어서 흥미로운 이야기들을 들을 수 있습니다.\n\n👴 과거를 살고 있는 노인: \"벨로아족은 용감한 전사들이야. 그들은 전투의 정신을 중시하고, 강한 의지를 가진 자들을 존경한다네.\"\n\n👶 미래를 살고 있는 아이: \"미래에는 벨로아족의 전사들이 시간의 계단을 지키고 있을 거야! 하지만 지금은 그들의 도움이 필요해.\"\n\n👥 마을 사람들: \"하지만 사람마다 다른 이야기를 하고 있어서 혼란스럽다. 어떤 정보를 믿을까?\"",
    choices: [
      {
        text: "🐺 동쪽 산맥으로 향한다 (벨로아족 마을)",
        next: "veloir",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🔥 용의 협곡으로 향한다 (드라카르족 마을)",
        next: "drakar",
        scoreA: 9,
        scoreB: 9,
      },
      {
        text: "🌊 물의 계곡으로 향한다 (룬마레족 마을)",
        next: "runmare",
        scoreA: 8,
        scoreB: 8,
      },
    ],
  },
  
  mountain_path_event: {
    text: "🏔️ 산길을 따라가며 벨로아족의 마을을 찾습니다. 산길에는 전사들의 발자국이 남아있고, 멀리서는 검을 휘두르는 소리가 들립니다.\n\n🏔️ 산길 안내자: \"이 산길은 벨로아족의 전사들이 자주 다니는 길이다. 그들의 훈련 소리가 들리는가? 벨로아족의 마을이 가까워졌다.\"\n\n🏔️ 산길 안내자: \"하지만 산길이 갈라져서 여러 방향으로 향할 수 있다. 어떤 길을 선택하겠는가?\"",
    choices: [
      {
        text: "🐺 동쪽 산맥으로 향한다 (벨로아족 마을)",
        next: "veloir",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "📚 지혜의 산으로 향한다 (모라스족 마을)",
        next: "moras",
        scoreA: 7,
        scoreB: 7,
      },
      {
        text: "🌟 에테르의 봉우리로 향한다 (에테르족 마을)",
        next: "ether",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  
  forest_exploration_event: {
    text: "🌲 숲속을 탐험하며 벨로아족의 마을로 가는 길을 찾습니다. 숲에는 고대의 비밀들이 숨어있고, 벨로아족의 흔적들을 발견할 수 있습니다.\n\n🌲 숲의 수호자: \"이 숲은 벨로아족의 전사들이 수련하는 곳이다. 그들의 영혼이 숲에 깃들어 있다.\"\n\n🌲 숲의 수호자: \"하지만 숲의 여러 길이 서로 다른 마을로 향하고 있다. 어떤 길을 선택하겠는가?\"",
    choices: [
      {
        text: "🐺 동쪽 산맥으로 향한다 (벨로아족 마을)",
        next: "veloir",
        scoreA: 9,
        scoreB: 9,
      },
      {
        text: "🌑 그림자 숲으로 향한다 (누아르족 마을)",
        next: "noir",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🌪️ 바람의 숲으로 향한다 (실프레드족 마을)",
        next: "sylphred",
        scoreA: 7,
        scoreB: 7,
      },
    ],
  },
  

  
  // 벨로아족 마을 (정적 노드)
  veloir: {
    text: "🐺 거대한 검 모양의 문을 통과하며 전사의 땅에 발을 들였습니다! 이곳은 전투의 정신이 깃든 마을로, 용감한 전사들이 검을 들어 경례하며 환영합니다.\n\n🐺 벨로아족 족장: \"시간의 계단에 도달하려면 강한 의지와 용기가 필요하다. 우리의 12가지 시험을 통과하면 시간의 조각을 찾는 힘을 얻을 수 있을 것이다.\"\n\n🐺 벨로아족 족장: \"우리 마을에서 전사의 정신을 배우고, 용기를 시험받으며, 고대의 지혜를 얻을 수 있다. 첫 번째 시험을 선택하겠는가?\"",
    choices: [
      {
        text: "⚔️ 전사들과의 대화",
        next: "veloir_round_1",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🏛️ 전투 훈련장",
        next: "veloir_round_2",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🗡️ 고대 무기고",
        next: "veloir_round_3",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "🏃 전사의 길",
        next: "veloir_round_4",
        scoreA: 9,
        scoreB: 9,
      },
    ],
  },
  
  // 지도 힌트에 따른 마을 선택
  map_clue_1: {
    text: "🗺️ 지도 관리인: \"동쪽의 검 모양 산맥에서 소리가 들린다고? 흥미롭군. 그 소리가 무엇인지 더 자세히 들려보라.\"\n\n🗺️ 지도 관리인: \"이제 이 힌트를 바탕으로 첫 번째 마을을 선택해보라. 어떤 마을로 향하겠는가?\"",
    choices: [
      {
        text: "🐺 검 모양 산맥의 마을로 향한다 (벨로아족)",
        next: "veloir",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🌑 그림자 계곡의 마을로 향한다 (누아르족)",
        next: "noir",
        scoreA: -3,
        scoreB: -3,
      },
      {
        text: "🌪️ 바람의 언덕 마을로 향한다 (실프레드족)",
        next: "sylphred",
        scoreA: -3,
        scoreB: -3,
      },
    ],
  },
  
  map_clue_2: {
    text: "🗺️ 지도 관리인: \"그림자가 드리운 계곡이라... 그곳은 어둠의 땅일 것이다.\"\n\n🗺️ 지도 관리인: \"이제 이 힌트를 바탕으로 첫 번째 마을을 선택해보라. 어떤 마을로 향하겠는가?\"",
    choices: [
      {
        text: "🌑 그림자 계곡의 마을로 향한다 (누아르족)",
        next: "noir",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🐺 검 모양 산맥의 마을로 향한다 (벨로아족)",
        next: "veloir",
        scoreA: -3,
        scoreB: -3,
      },
      {
        text: "🌪️ 바람의 언덕 마을로 향한다 (실프레드족)",
        next: "sylphred",
        scoreA: -3,
        scoreB: -3,
      },
    ],
  },
  
  map_clue_3: {
    text: "🗺️ 지도 관리인: \"바람이 부는 언덕이라... 그곳은 자유의 땅일 것이다.\"\n\n🗺️ 지도 관리인: \"이제 이 힌트를 바탕으로 첫 번째 마을을 선택해보라. 어떤 마을로 향하겠는가?\"",
    choices: [
      {
        text: "🌪️ 바람의 언덕 마을로 향한다 (실프레드족)",
        next: "sylphred",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🐺 검 모양 산맥의 마을로 향한다 (벨로아족)",
        next: "veloir",
        scoreA: -3,
        scoreB: -3,
      },
      {
        text: "🌑 그림자 계곡의 마을로 향한다 (누아르족)",
        next: "noir",
        scoreA: -3,
        scoreB: -3,
      },
    ],
  },
  
  // 누아르족 마을 (정적 노드) - 순서 체크
  noir: {
    text: "🌑 그림자로 가득한 계곡을 통과하며 어둠의 땅에 발을 들였습니다!\n\n🌑 누아르족 족장: \"어서 오시오, 모험가들이여! 하지만 잠깐... 아직 벨로아족의 마을을 방문하지 않으셨군요.\"\n\n🌑 누아르족 족장: \"시간의 계단에 도달하려면 7개 종족의 마을을 순서대로 방문해야 합니다. 먼저 벨로아족의 마을에서 전사의 정신을 배우고 오시기 바랍니다.\"\n\n🌑 누아르족 족장: \"벨로아족의 마을로 돌아가시겠습니까?\"",
    choices: [
      {
        text: "🐺 벨로아족 마을로 돌아간다",
        next: "veloir",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  
  // 실프레드족 마을 (정적 노드) - 순서 체크
  sylphred: {
    text: "🌪️ 바람이 춤추는 언덕을 통과하며 자유의 땅에 발을 들였습니다!\n\n🌪️ 실프레드족 족장: \"어서 오시오, 모험가들이여! 하지만 잠깐... 아직 벨로아족과 누아르족의 마을을 방문하지 않으셨군요.\"\n\n🌪️ 실프레드족 족장: \"시간의 계단에 도달하려면 7개 종족의 마을을 순서대로 방문해야 합니다. 먼저 벨로아족과 누아르족의 마을에서 각각의 지혜를 배우고 오시기 바랍니다.\"\n\n🌪️ 실프레드족 족장: \"벨로아족 마을로 돌아가시겠습니까?\"",
    choices: [
      {
        text: "🐺 벨로아족 마을로 돌아간다",
        next: "veloir",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  
  // 드라카르족 마을 (정적 노드) - 순서 체크
  drakar: {
    text: "🔥 용의 불꽃이 타오르는 협곡을 통과하며 용의 땅에 발을 들였습니다!\n\n🔥 드라카르족 족장: \"어서 오시오, 모험가들이여! 하지만 잠깐... 아직 앞선 종족들의 마을을 방문하지 않으셨군요.\"\n\n🔥 드라카르족 족장: \"시간의 계단에 도달하려면 7개 종족의 마을을 순서대로 방문해야 합니다. 먼저 벨로아족, 누아르족, 실프레드족의 마을에서 각각의 지혜를 배우고 오시기 바랍니다.\"\n\n🔥 드라카르족 족장: \"벨로아족 마을로 돌아가시겠습니까?\"",
    choices: [
      {
        text: "🐺 벨로아족 마을로 돌아간다",
        next: "veloir",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  
  // 룬마레족 마을 (정적 노드)
  runmare: {
    text: "🌊 물의 흐름이 끊이지 않는 계곡을 통과하며 물의 땅에 발을 들였습니다! 이곳은 물의 지혜와 흐름의 마을로, 지혜로운 물의 현자들이 환영합니다.\n\n🌊 룬마레족 족장: \"시간의 계단에 도달하려면 물의 지혜를 알아야 한다. 우리의 12가지 시험을 통과하면 물처럼 유연한 지혜를 얻을 수 있을 것이다.\"\n\n🌊 룬마레족 족장: \"우리 마을에서 물의 지혜를 배우고, 흐름의 비밀을 이해하며, 시간의 흐름을 느낄 수 있다. 첫 번째 시험을 선택하겠는가?\"",
    choices: [
      {
        text: "🌊 물의 현자들과의 대화",
        next: "runmare_round_1",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🏛️ 물의 훈련장",
        next: "runmare_round_2",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🌊 물의 지혜",
        next: "runmare_round_3",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "🌊 물의 길",
        next: "runmare_round_4",
        scoreA: 9,
        scoreB: 9,
      },
    ],
  },
  
  // 모라스족 마을 (정적 노드)
  moras: {
    text: "📚 고대의 지식이 가득한 산을 통과하며 지식의 땅에 발을 들였습니다! 이곳은 고대 지식과 마법의 마을로, 현명한 마법사들이 환영합니다.\n\n📚 모라스족 족장: \"시간의 계단에 도달하려면 고대의 지식을 알아야 한다. 우리의 12가지 시험을 통과하면 마법의 비밀을 얻을 수 있을 것이다.\"\n\n📚 모라스족 족장: \"우리 마을에서 고대의 지식을 배우고, 마법의 비밀을 탐구하며, 시간의 마법을 이해할 수 있다. 첫 번째 시험을 선택하겠는가?\"",
    choices: [
      {
        text: "📚 마법사들과의 대화",
        next: "moras_round_1",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🏛️ 마법 훈련장",
        next: "moras_round_2",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "📚 고대의 지식",
        next: "moras_round_3",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "📚 마법의 길",
        next: "moras_round_4",
        scoreA: 9,
        scoreB: 9,
      },
    ],
  },
  
  // 에테르족 마을 (정적 노드)
  ether: {
    text: "🌟 순수한 에테르가 흐르는 봉우리를 통과하며 영혼의 땅에 발을 들였습니다! 이곳은 영혼의 순수함과 에테르의 마을로, 신성한 영혼의 수호자들이 환영합니다.\n\n🌟 에테르족 족장: \"시간의 계단에 도달하려면 영혼의 순수함을 알아야 한다. 우리의 12가지 시험을 통과하면 에테르의 힘을 얻을 수 있을 것이다.\"\n\n🌟 에테르족 족장: \"우리 마을에서 영혼의 순수함을 배우고, 에테르의 비밀을 이해하며, 신성한 힘을 익힐 수 있다. 첫 번째 시험을 선택하겠는가?\"",
    choices: [
      {
        text: "🌟 영혼의 수호자들과의 대화",
        next: "ether_round_1",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🏛️ 에테르 훈련장",
        next: "ether_round_2",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🌟 영혼의 순수함",
        next: "ether_round_3",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "🌟 에테르의 길",
        next: "ether_round_4",
        scoreA: 9,
        scoreB: 9,
      },
    ],
  },
  
  // 마을 탐험
  explore_village: {
    text: "🏘️ 마을을 탐험하기로 결정했습니다! 마을의 중앙에는 거대한 시계탑이 있고, 그 주변에는 시간의 꽃들이 피어있습니다.\n\n👴 마을 장로가 나타나서 말합니다: \"7대 종족의 마을들을 순서대로 방문해야 합니다. 각 종족의 마을을 방문하여 그들의 도움을 받아야만 마지막에 계단의 수호자를 만날 수 있소.\"\n\n👴 마을 장로: \"벨로아족은 전투의 정신을, 누아르족은 그림자의 비밀을, 실프레드족은 바람의 자유를, 드라카르족은 용의 힘을, 룬마레족은 물의 지혜를, 모라스족은 고대의 지식을, 에테르족은 영혼의 순수함을 가지고 있소.\"\n\n👴 마을 장로: \"첫 번째로 방문할 마을을 선택하시오.\"",
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "veloir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "noir_village",
        scoreA: 7,
        scoreB: 7,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "sylphred_village",
        scoreA: 4,
        scoreB: 4,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "drakar_village",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "runmare_village",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "📚 모라스족의 마을로 향한다",
        next: "moras_village",
        scoreA: 9,
        scoreB: 9,
      },
    ],
  },
  
  // 마을 사람들과 대화
  talk_to_villagers: {
    text: "👥 마을 사람들과 대화하기로 결정했습니다! 마을 사람들은 각자 다른 시간 속에서 살고 있어서, 대화할 때마다 흥미로운 이야기들을 들을 수 있습니다.\n\n👴 과거를 살고 있는 노인: \"옛날에는 시간이 더 안정적이었지. 하지만 어느 날부터 시간이 불안정해지기 시작했어.\"\n\n👶 미래를 살고 있는 아이: \"미래에는 시간을 자유롭게 여행할 수 있게 될 거야! 하지만 그때는 이미 늦을 수도 있어.\"\n\n👴 마을 장로: \"7대 종족의 마을들을 순서대로 방문해야 합니다. 각 종족은 고유한 능력과 지혜를 가지고 있어서, 그들의 도움 없이는 시간의 계단에 도달할 수 없소.\"\n\n👴 마을 장로: \"첫 번째로 방문할 마을을 선택하시오.\"",
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "veloir_village",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "noir_village",
        scoreA: 9,
        scoreB: 9,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "sylphred_village",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "drakar_village",
        scoreA: 7,
        scoreB: 7,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "runmare_village",
        scoreA: 11,
        scoreB: 11,
      },
      {
        text: "📚 모라스족의 마을로 향한다",
        next: "moras_village",
        scoreA: 12,
        scoreB: 12,
      },
    ],
  },
  
  // 벨로아족 마을 - 전투의 정신과 용기의 땅 (12라운드)
  veloir_village: {
    text: "🐺 거대한 검 모양의 문을 통과하며 전사의 땅에 발을 들였습니다! 이곳은 전투의 정신이 깃든 마을로, 용감한 전사들이 검을 들어 경례하며 환영합니다.\n\n🐺 벨로아족 족장: \"시간의 계단에 도달하려면 강한 의지와 용기가 필요하다. 우리의 12가지 시험을 통과하면 시간의 조각을 찾는 힘을 얻을 수 있을 것이다.\"\n\n🐺 벨로아족 족장: \"우리 마을에서 전사의 정신을 배우고, 용기를 시험받으며, 고대의 지혜를 얻을 수 있다. 첫 번째 시험을 선택하겠는가?\"",
    choices: [
      {
        text: "⚔️ 전사들과의 대화",
        next: "veloir_round_1",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🏛️ 전투 훈련장",
        next: "veloir_round_2",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🗡️ 고대 무기고",
        next: "veloir_round_3",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "🏃 전사의 길",
        next: "veloir_round_4",
        scoreA: 9,
        scoreB: 9,
      },
    ],
  },
  
  veloir_battle_test: {
    text: "⚔️ 벨로아족의 전투 시험을 받기로 결정했습니다! 벨로아족의 전사들과 함께 훈련하며 전투 기술을 익히고, 시간의 계단에 도달할 수 있는 강한 의지를 기릅니다.\n\n🐺 벨로아족 족장: \"훌륭하다! 그대들의 용기와 의지를 인정한다. 이제 다른 종족의 도움을 받아야 할 때다.\"",
    choices: [
      {
        text: "🤝 동맹을 맺고 다음 마을로 향한다",
        next: "alliance_choice_veloir",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🚶 동맹 없이 다음 마을로 향한다",
        next: "no_alliance_choice_veloir",
        scoreA: 13,
        scoreB: 13,
      },
    ],
  },
  
  veloir_negotiation: {
    text: "🤝 벨로아족과 협상하기로 결정했습니다! 전투 대신 대화를 통해 벨로아족의 도움을 얻으려 합니다. 서로의 목표를 이해하고 협력 관계를 맺습니다.\n\n🐺 벨로아족 족장: \"대화의 힘을 아는 자라니... 그대들의 지혜를 인정한다. 이제 다른 종족의 도움을 받아야 할 때다.\"",
    choices: [
      {
        text: "🤝 동맹을 맺고 다음 마을로 향한다",
        next: "alliance_choice_veloir",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "🚶 동맹 없이 다음 마을로 향한다",
        next: "no_alliance_choice_veloir",
        scoreA: 10,
        scoreB: 10,
      },
    ],
  },
  

  

  
  // 벨로아족 12라운드 이벤트들
  veloir_round_1: {
    text: "⚔️ 용감한 전사들과 함께 앉아 전투의 정신에 대해 이야기를 나눕니다. 전사들은 각자의 전투 경험과 용기에 대한 이야기를 들려주며, 진정한 전사가 되는 길을 가르쳐줍니다.\n\n🐺 벨로아족 전사: \"전투는 단순한 힘의 싸움이 아니다. 의지와 용기, 그리고 동료를 지키는 마음이 진정한 전사의 길이다.\"\n\n🐺 벨로아족 전사: \"첫 번째 시험을 통과했다. 이제 두 번째 시험을 선택하라.\"",
    choices: [
      {
        text: "🏛️ 전투 훈련장",
        next: "veloir_round_2",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🗡️ 고대 무기고",
        next: "veloir_round_3",
        scoreA: 13,
        scoreB: 13,
      },
      {
        text: "🏃 전사의 길",
        next: "veloir_round_4",
        scoreA: 14,
        scoreB: 14,
      },
      {
        text: "⚔️ 실전 훈련",
        next: "veloir_round_5",
        scoreA: 12,
        scoreB: 12,
      },
    ],
  },
  
  veloir_round_2: {
    text: "🏛️ 실제 검과 방패를 들고 전사들과 함께 훈련합니다. 전투 기술뿐만 아니라 전술과 전략도 배우며, 진정한 전사의 기량을 기릅니다.\n\n🐺 벨로아족 전사: \"검을 휘두르는 것만이 전투가 아니다. 상황을 파악하고 적절한 전술을 선택하는 것이 중요하다.\"\n\n🐺 벨로아족 전사: \"두 번째 시험을 통과했다. 이제 세 번째 시험을 선택하라.\"",
    choices: [
      {
        text: "🗡️ 고대 무기고",
        next: "veloir_round_3",
        scoreA: 16,
        scoreB: 16,
      },
      {
        text: "🏃 전사의 길",
        next: "veloir_round_4",
        scoreA: 14,
        scoreB: 14,
      },
      {
        text: "⚔️ 실전 훈련",
        next: "veloir_round_5",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🗡️ 신비로운 무기 발견",
        next: "veloir_round_6",
        scoreA: 13,
        scoreB: 13,
      },
    ],
  },
  
  veloir_round_3: {
    text: "🗡️ 조상들의 영혼이 깃든 신비로운 무기들이 보관된 고대 무기고에 들어섭니다. 각 무기마다 고유한 힘과 역사가 있으며, 그 힘을 이해하는 것이 중요합니다.\n\n🐺 벨로아족 무기고 관리인: \"이 무기들은 단순한 도구가 아니다. 각각의 무기에는 우리 조상들의 영혼과 지혜가 깃들어 있다.\"\n\n🐺 벨로아족 무기고 관리인: \"세 번째 시험을 통과했다. 이제 네 번째 시험을 선택하라.\"",
    choices: [
      {
        text: "🏃 전사의 길",
        next: "veloir_round_4",
        scoreA: 17,
        scoreB: 17,
      },
      {
        text: "⚔️ 실전 훈련",
        next: "veloir_round_5",
        scoreA: 16,
        scoreB: 16,
      },
      {
        text: "🗡️ 신비로운 무기 발견",
        next: "veloir_round_6",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "⚔️ 시간을 자르는 검",
        next: "veloir_round_7",
        scoreA: 15,
        scoreB: 15,
      },
    ],
  },
  
  veloir_round_4: {
    text: "🏃 신성한 길을 걸으며 과거의 영웅들과 대화합니다. 이 길은 전사들이 수련하는 신성한 곳으로, 걸어가면서 전사의 정신과 용기를 배울 수 있습니다.\n\n🐺 벨로아족 전사: \"전사의 길은 단순한 길이 아니다. 이 길을 걸으면서 자신의 한계를 극복하고, 진정한 용기를 찾을 수 있다.\"\n\n🐺 벨로아족 전사: \"네 번째 시험을 통과했다. 이제 다섯 번째 시험을 선택하라.\"",
    choices: [
      {
        text: "⚔️ 실전 훈련",
        next: "veloir_round_5",
        scoreA: 16,
        scoreB: 16,
      },
      {
        text: "🗡️ 신비로운 무기 발견",
        next: "veloir_round_6",
        scoreA: 17,
        scoreB: 17,
      },
      {
        text: "⚔️ 시간을 자르는 검",
        next: "veloir_round_7",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🏔️ 신성한 정상",
        next: "veloir_round_8",
        scoreA: 18,
        scoreB: 18,
      },
    ],
  },
  
  veloir_round_5: {
    text: "⚔️ 실제 전투 상황을 시뮬레이션한 훈련장에서 전사들과 함께 실전 훈련을 받습니다. 진짜 전투처럼 위험한 상황에서도 침착함을 유지하는 법을 배웁니다.\n\n🐺 벨로아족 전사: \"진정한 전사는 위기 상황에서도 두려움을 극복한다. 이 훈련을 통해 그대들의 한계를 넘어서라.\"\n\n🐺 벨로아족 전사: \"다섯 번째 시험을 통과했다. 이제 여섯 번째 시험을 선택하라.\"",
    choices: [
      {
        text: "🗡️ 신비로운 무기 발견",
        next: "veloir_round_6",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "⚔️ 시간을 자르는 검",
        next: "veloir_round_7",
        scoreA: 17,
        scoreB: 17,
      },
      {
        text: "🏔️ 신성한 정상",
        next: "veloir_round_8",
        scoreA: 19,
        scoreB: 19,
      },
      {
        text: "🤝 족장과의 협상",
        next: "veloir_round_9",
        scoreA: 16,
        scoreB: 16,
      },
    ],
  },
  
  veloir_training_ground: {
    text: "🏛️ 실제 검과 방패를 들고 전사들과 함께 훈련합니다. 전투 기술뿐만 아니라 전술과 전략도 배우며, 진정한 전사의 기량을 기릅니다.\n\n🐺 벨로아족 전사: \"검을 휘두르는 것만이 전투가 아니다. 상황을 파악하고 적절한 전술을 선택하는 것이 중요하다.\"\n\n🐺 벨로아족 전사: \"훈련이 끝났다. 이제 다음 시험을 선택하라.\"",
    choices: [
      {
        text: "🗡️ 고대 무기고 탐험",
        next: "veloir_ancient_armory",
        scoreA: 16,
        scoreB: 16,
      },
      {
        text: "🤝 족장과의 협상",
        next: "veloir_chief_negotiation",
        scoreA: 14,
        scoreB: 14,
      },
      {
        text: "⚔️ 용기 시험",
        next: "veloir_courage_test",
        scoreA: 17,
        scoreB: 17,
      },
      {
        text: "📚 전술 회의",
        next: "veloir_tactics_meeting",
        scoreA: 13,
        scoreB: 13,
      },
    ],
  },
  
  veloir_ancient_armory: {
    text: "🗡️ 조상들의 영혼이 깃든 신비로운 무기들이 보관된 고대 무기고에 들어섭니다. 각 무기마다 고유한 힘과 역사가 있으며, 그 힘을 이해하는 것이 중요합니다.\n\n🐺 벨로아족 무기고 관리인: \"이 무기들은 단순한 도구가 아니다. 각각의 무기에는 우리 조상들의 영혼과 지혜가 깃들어 있다.\"\n\n🐺 벨로아족 무기고 관리인: \"어떤 무기의 비밀을 탐구하겠는가?\"",
    choices: [
      {
        text: "⚔️ 시간을 자르는 검",
        next: "veloir_time_sword",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "🛡️ 영혼의 방패",
        next: "veloir_soul_shield",
        scoreA: 16,
        scoreB: 16,
      },
      {
        text: "🏹 운명의 화살",
        next: "veloir_fate_arrow",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "⚔️ 전설의 창",
        next: "veloir_legendary_spear",
        scoreA: 17,
        scoreB: 17,
      },
    ],
  },
  
  veloir_warrior_path: {
    text: "🏃 신성한 길을 걸으며 과거의 영웅들과 대화합니다. 이 길은 전사들이 수련하는 신성한 곳으로, 걸어가면서 전사의 정신과 용기를 배울 수 있습니다.\n\n🐺 벨로아족 전사: \"전사의 길은 단순한 길이 아니다. 이 길을 걸으면서 자신의 한계를 극복하고, 진정한 용기를 찾을 수 있다.\"\n\n🐺 벨로아족 전사: \"길의 끝에서 무엇을 발견하겠는가?\"",
    choices: [
      {
        text: "🏔️ 신성한 정상",
        next: "veloir_sacred_peak",
        scoreA: 19,
        scoreB: 19,
      },
      {
        text: "🌅 영웅들의 기념관",
        next: "veloir_heroes_memorial",
        scoreA: 17,
        scoreB: 17,
      },
      {
        text: "⚔️ 용기의 시련",
        next: "veloir_courage_trial",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "🌟 전사의 영혼",
        next: "veloir_warrior_spirit",
        scoreA: 16,
        scoreB: 16,
      },
    ],
  },
  
  // 벨로아족 추가 이벤트들
  veloir_combat_training: {
    text: "⚔️ 실제 전투 상황을 시뮬레이션한 훈련장에서 전사들과 함께 실전 훈련을 받습니다. 진짜 전투처럼 위험한 상황에서도 침착함을 유지하는 법을 배웁니다.\n\n🐺 벨로아족 전사: \"진정한 전사는 위기 상황에서도 두려움을 극복한다. 이 훈련을 통해 그대들의 한계를 넘어서라.\"\n\n🐺 벨로아족 전사: \"훈련이 완료되었다. 이제 다음 시험을 선택하라.\"",
    choices: [
      {
        text: "🗡️ 고대 무기고 탐험",
        next: "veloir_ancient_armory",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "🏃 신성한 길 탐험",
        next: "veloir_warrior_path",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "🤝 족장과의 협상",
        next: "veloir_chief_negotiation",
        scoreA: 16,
        scoreB: 16,
      },
      {
        text: "🛡️ 주민들 도와주기",
        next: "veloir_help_villagers",
        scoreA: 15,
        scoreB: 15,
      },
    ],
  },
  
  veloir_mystical_weapon: {
    text: "🗡️ 전사들이 사용하는 신비로운 무기들의 비밀을 탐구합니다. 각 무기에는 고유한 마법이 깃들어 있으며, 그 힘을 이해하는 것이 중요합니다.\n\n🐺 벨로아족 무기사: \"이 무기들은 단순한 도구가 아니다. 사용자의 의지와 용기에 따라 그 힘이 발현된다.\"\n\n🐺 벨로아족 무기사: \"어떤 무기의 비밀을 더 깊이 탐구하겠는가?\"",
    choices: [
      {
        text: "⚔️ 시간을 자르는 검",
        next: "veloir_time_sword",
        scoreA: 19,
        scoreB: 19,
      },
      {
        text: "🛡️ 영혼의 방패",
        next: "veloir_soul_shield",
        scoreA: 17,
        scoreB: 17,
      },
      {
        text: "🏹 운명의 화살",
        next: "veloir_fate_arrow",
        scoreA: 16,
        scoreB: 16,
      },
      {
        text: "⚔️ 전설의 창",
        next: "veloir_legendary_spear",
        scoreA: 18,
        scoreB: 18,
      },
    ],
  },
  
  veloir_sacred_path: {
    text: "🏃 신성한 길의 더 깊은 곳으로 들어가 과거의 영웅들과 대화합니다. 이 길은 전사들이 영적 수련을 하는 곳으로, 걸어가면서 전사의 정신과 용기를 배울 수 있습니다.\n\n🐺 벨로아족 전사: \"신성한 길의 끝에는 과거의 영웅들이 기다리고 있다. 그들의 지혜를 얻어라.\"\n\n🐺 벨로아족 전사: \"어떤 영웅의 가르침을 받겠는가?\"",
    choices: [
      {
        text: "🏔️ 신성한 정상",
        next: "veloir_sacred_peak",
        scoreA: 21,
        scoreB: 21,
      },
      {
        text: "🌅 영웅들의 기념관",
        next: "veloir_heroes_memorial",
        scoreA: 19,
        scoreB: 19,
      },
      {
        text: "⚔️ 용기의 시련",
        next: "veloir_courage_trial",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "🌟 전사의 영혼",
        next: "veloir_warrior_spirit",
        scoreA: 18,
        scoreB: 18,
      },
    ],
  },
  
  veloir_help_villagers: {
    text: "🛡️ 마을 주민들을 도와주며 전사의 진정한 의미를 배웁니다. 강한 힘만이 전사가 아니라, 약한 자를 보호하는 마음이 진정한 전사의 정신입니다.\n\n🐺 벨로아족 주민: \"진정한 전사는 우리를 보호해주는 분들이다. 그대들의 따뜻한 마음에 감사한다.\"\n\n🐺 벨로아족 주민: \"이제 다른 시험을 받아보시겠습니까?\"",
    choices: [
      {
        text: "⚔️ 실전 훈련",
        next: "veloir_combat_training",
        scoreA: 16,
        scoreB: 16,
      },
      {
        text: "🗡️ 고대 무기고 탐험",
        next: "veloir_ancient_armory",
        scoreA: 17,
        scoreB: 17,
      },
      {
        text: "🏃 신성한 길 탐험",
        next: "veloir_warrior_path",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🤝 족장과의 협상",
        next: "veloir_chief_negotiation",
        scoreA: 14,
        scoreB: 14,
      },
    ],
  },
  
  // 벨로아족 고급 이벤트들
  veloir_chief_negotiation: {
    text: "🤝 벨로아족의 족장과 함께 앉아 전략적인 협상을 진행합니다. 족장은 전투의 지혜뿐만 아니라 외교의 중요성도 가르쳐줍니다.\n\n🐺 벨로아족 족장: \"전투만이 해결책이 아니다. 때로는 대화와 이해가 더 강력한 무기가 될 수 있다.\"\n\n🐺 벨로아족 족장: \"이제 다른 시험을 받아보라.\"",
    choices: [
      {
        text: "⚔️ 실전 훈련",
        next: "veloir_combat_training",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "🗡️ 고대 무기고 탐험",
        next: "veloir_ancient_armory",
        scoreA: 19,
        scoreB: 19,
      },
      {
        text: "🏃 신성한 길 탐험",
        next: "veloir_warrior_path",
        scoreA: 17,
        scoreB: 17,
      },
      {
        text: "🛡️ 주민들 도와주기",
        next: "veloir_help_villagers",
        scoreA: 16,
        scoreB: 16,
      },
    ],
  },
  
  veloir_courage_test: {
    text: "⚔️ 용기를 시험하는 특별한 시련에 도전합니다. 위험한 상황에서도 두려움을 극복하고 올바른 선택을 하는 것이 진정한 용기입니다.\n\n🐺 벨로아족 전사: \"용기는 두려움이 없는 것이 아니라, 두려움을 극복하는 것이다. 그대들의 선택을 보여라.\"\n\n🐺 벨로아족 전사: \"시련이 완료되었다. 이제 다음 단계로 나아가라.\"",
    choices: [
      {
        text: "🗡️ 고대 무기고 탐험",
        next: "veloir_ancient_armory",
        scoreA: 22,
        scoreB: 22,
      },
      {
        text: "🏃 신성한 길 탐험",
        next: "veloir_warrior_path",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "🤝 족장과의 협상",
        next: "veloir_chief_negotiation",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "🛡️ 주민들 도와주기",
        next: "veloir_help_villagers",
        scoreA: 17,
        scoreB: 17,
      },
    ],
  },
  
  veloir_tactics_meeting: {
    text: "📚 전사들과 함께 전술 회의에 참석합니다. 과거의 전투 사례를 분석하고, 새로운 전략을 개발하며, 팀워크의 중요성을 배웁니다.\n\n🐺 벨로아족 전사: \"혼자서는 강할 수 없다. 동료와의 협력이 승리의 열쇠이다.\"\n\n🐺 벨로아족 전사: \"회의가 끝났다. 이제 실전에 적용해보라.\"",
    choices: [
      {
        text: "⚔️ 실전 훈련",
        next: "veloir_combat_training",
        scoreA: 19,
        scoreB: 19,
      },
      {
        text: "🗡️ 고대 무기고 탐험",
        next: "veloir_ancient_armory",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "🏃 신성한 길 탐험",
        next: "veloir_warrior_path",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "🛡️ 주민들 도와주기",
        next: "veloir_help_villagers",
        scoreA: 17,
        scoreB: 17,
      },
    ],
  },
  
  // 벨로아족 무기 이벤트들
  veloir_time_sword: {
    text: "⚔️ 시간을 자르는 검의 비밀을 탐구합니다. 이 검은 과거와 미래를 연결하는 신비로운 힘을 가지고 있으며, 그 힘을 이해하는 것이 중요합니다.\n\n🐺 벨로아족 무기사: \"이 검은 시간의 흐름을 자를 수 있는 힘을 가지고 있다. 하지만 그 힘을 사용하려면 강한 의지가 필요하다.\"\n\n🐺 벨로아족 무기사: \"검의 비밀을 더 깊이 탐구하겠는가?\"",
    choices: [
      {
        text: "🛡️ 영혼의 방패",
        next: "veloir_soul_shield",
        scoreA: 23,
        scoreB: 23,
      },
      {
        text: "🏹 운명의 화살",
        next: "veloir_fate_arrow",
        scoreA: 21,
        scoreB: 21,
      },
      {
        text: "⚔️ 전설의 창",
        next: "veloir_legendary_spear",
        scoreA: 22,
        scoreB: 22,
      },
      {
        text: "🏃 신성한 길 탐험",
        next: "veloir_warrior_path",
        scoreA: 20,
        scoreB: 20,
      },
    ],
  },
  
  veloir_soul_shield: {
    text: "🛡️ 영혼의 방패의 비밀을 탐구합니다. 이 방패는 사용자의 영혼을 보호하는 힘을 가지고 있으며, 진정한 보호의 의미를 가르쳐줍니다.\n\n🐺 벨로아족 무기사: \"이 방패는 물리적인 공격뿐만 아니라 영혼의 공격도 막아낼 수 있다. 진정한 보호는 무엇인지 생각해보라.\"\n\n🐺 벨로아족 무기사: \"다른 무기의 비밀도 탐구하겠는가?\"",
    choices: [
      {
        text: "⚔️ 시간을 자르는 검",
        next: "veloir_time_sword",
        scoreA: 22,
        scoreB: 22,
      },
      {
        text: "🏹 운명의 화살",
        next: "veloir_fate_arrow",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "⚔️ 전설의 창",
        next: "veloir_legendary_spear",
        scoreA: 21,
        scoreB: 21,
      },
      {
        text: "🏃 신성한 길 탐험",
        next: "veloir_warrior_path",
        scoreA: 19,
        scoreB: 19,
      },
    ],
  },
  
  veloir_fate_arrow: {
    text: "🏹 운명의 화살의 비밀을 탐구합니다. 이 화살은 운명을 바꿀 수 있는 힘을 가지고 있으며, 선택의 중요성을 가르쳐줍니다.\n\n🐺 벨로아족 무기사: \"이 화살은 한 번 발사되면 운명을 바꿀 수 있다. 하지만 그 선택은 되돌릴 수 없다. 신중하게 선택하라.\"\n\n🐺 벨로아족 무기사: \"다른 무기의 비밀도 탐구하겠는가?\"",
    choices: [
      {
        text: "⚔️ 시간을 자르는 검",
        next: "veloir_time_sword",
        scoreA: 21,
        scoreB: 21,
      },
      {
        text: "🛡️ 영혼의 방패",
        next: "veloir_soul_shield",
        scoreA: 19,
        scoreB: 19,
      },
      {
        text: "⚔️ 전설의 창",
        next: "veloir_legendary_spear",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "🏃 신성한 길 탐험",
        next: "veloir_warrior_path",
        scoreA: 18,
        scoreB: 18,
      },
    ],
  },
  
  veloir_legendary_spear: {
    text: "⚔️ 전설의 창의 비밀을 탐구합니다. 이 창은 과거의 영웅들이 사용했던 전설적인 무기로, 영웅의 정신을 가르쳐줍니다.\n\n🐺 벨로아족 무기사: \"이 창은 과거의 영웅들이 사용했던 무기이다. 그들의 정신과 용기를 이어받아라.\"\n\n🐺 벨로아족 무기사: \"다른 무기의 비밀도 탐구하겠는가?\"",
    choices: [
      {
        text: "⚔️ 시간을 자르는 검",
        next: "veloir_time_sword",
        scoreA: 22,
        scoreB: 22,
      },
      {
        text: "🛡️ 영혼의 방패",
        next: "veloir_soul_shield",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "🏹 운명의 화살",
        next: "veloir_fate_arrow",
        scoreA: 19,
        scoreB: 19,
      },
      {
        text: "🏃 신성한 길 탐험",
        next: "veloir_warrior_path",
        scoreA: 18,
        scoreB: 18,
      },
    ],
  },
  
  // 벨로아족 신성한 길 이벤트들
  veloir_sacred_peak: {
    text: "🏔️ 신성한 정상에 도달하여 과거의 영웅들과 대화합니다. 이곳에서는 시간의 비밀과 전사의 진정한 의미를 배울 수 있습니다.\n\n🐺 벨로아족 영웅: \"이곳에서 시간의 흐름을 느낄 수 있다. 과거와 미래가 하나로 연결되어 있다는 것을 이해하라.\"\n\n🐺 벨로아족 영웅: \"이제 다른 시험을 받아보라.\"",
    choices: [
      {
        text: "🌅 영웅들의 기념관",
        next: "veloir_heroes_memorial",
        scoreA: 25,
        scoreB: 25,
      },
      {
        text: "⚔️ 용기의 시련",
        next: "veloir_courage_trial",
        scoreA: 24,
        scoreB: 24,
      },
      {
        text: "🌟 전사의 영혼",
        next: "veloir_warrior_spirit",
        scoreA: 23,
        scoreB: 23,
      },
      {
        text: "🤝 동맹을 맺고 다음 마을로 향한다",
        next: "alliance_choice_veloir",
        scoreA: 20,
        scoreB: 20,
      },
    ],
  },
  
  veloir_heroes_memorial: {
    text: "🌅 영웅들의 기념관에서 과거의 전사들의 업적을 기리며 그들의 정신을 배웁니다. 각 영웅마다 고유한 이야기와 교훈이 있습니다.\n\n🐺 벨로아족 영웅: \"우리 조상들의 업적을 기억하라. 그들의 정신이 우리를 이끌어준다.\"\n\n🐺 벨로아족 영웅: \"이제 다른 시험을 받아보라.\"",
    choices: [
      {
        text: "🏔️ 신성한 정상",
        next: "veloir_sacred_peak",
        scoreA: 24,
        scoreB: 24,
      },
      {
        text: "⚔️ 용기의 시련",
        next: "veloir_courage_trial",
        scoreA: 23,
        scoreB: 23,
      },
      {
        text: "🌟 전사의 영혼",
        next: "veloir_warrior_spirit",
        scoreA: 22,
        scoreB: 22,
      },
      {
        text: "🤝 동맹을 맺고 다음 마을로 향한다",
        next: "alliance_choice_veloir",
        scoreA: 19,
        scoreB: 19,
      },
    ],
  },
  
  veloir_courage_trial: {
    text: "⚔️ 용기의 시련에 도전하여 자신의 한계를 극복합니다. 이 시련은 단순한 전투가 아니라 영혼의 시련입니다.\n\n🐺 벨로아족 영웅: \"진정한 용기는 자신의 약점을 인정하고 극복하는 것이다. 그대들의 선택을 보여라.\"\n\n🐺 벨로아족 영웅: \"시련이 완료되었다. 이제 다른 시험을 받아보라.\"",
    choices: [
      {
        text: "🏔️ 신성한 정상",
        next: "veloir_sacred_peak",
        scoreA: 25,
        scoreB: 25,
      },
      {
        text: "🌅 영웅들의 기념관",
        next: "veloir_heroes_memorial",
        scoreA: 23,
        scoreB: 23,
      },
      {
        text: "🌟 전사의 영혼",
        next: "veloir_warrior_spirit",
        scoreA: 22,
        scoreB: 22,
      },
      {
        text: "🤝 동맹을 맺고 다음 마을로 향한다",
        next: "alliance_choice_veloir",
        scoreA: 20,
        scoreB: 20,
      },
    ],
  },
  
  veloir_warrior_spirit: {
    text: "🌟 전사의 영혼과 대화하여 진정한 전사의 의미를 깨닫습니다. 이곳에서는 물리적인 힘이 아닌 정신적인 힘의 중요성을 배웁니다.\n\n🐺 벨로아족 영웅: \"진정한 전사는 강한 힘을 가진 자가 아니라, 강한 정신을 가진 자이다. 그대들의 영혼을 보여라.\"\n\n🐺 벨로아족 영웅: \"이제 다른 시험을 받아보라.\"",
    choices: [
      {
        text: "🏔️ 신성한 정상",
        next: "veloir_sacred_peak",
        scoreA: 23,
        scoreB: 23,
      },
      {
        text: "🌅 영웅들의 기념관",
        next: "veloir_heroes_memorial",
        scoreA: 22,
        scoreB: 22,
      },
      {
        text: "⚔️ 용기의 시련",
        next: "veloir_courage_trial",
        scoreA: 21,
        scoreB: 21,
      },
      {
        text: "🤝 동맹을 맺고 다음 마을로 향한다",
        next: "alliance_choice_veloir",
        scoreA: 18,
        scoreB: 18,
      },
    ],
  },
  
  // 동맹 선택 (벨로아족에서)
  alliance_choice_veloir: {
    text: "🤝 벨로아족과 동맹을 맺기로 결정했습니다! 벨로아족의 전사들이 당신들과 함께 여행하며, 전투에서 도움을 줄 것입니다.\n\n🐺 벨로아족 전사: \"우리의 힘을 합쳐서 시간의 계단에 도달하자!\"\n\n👴 마을 장로: \"이미 벨로아족을 방문했으니, 다음 마을을 선택하시오. 모든 종족의 도움을 받아야만 시간의 계단에 도달할 수 있습니다.\"",
    choices: [
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "noir_village",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "sylphred_village",
        scoreA: 17,
        scoreB: 17,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "drakar_village",
        scoreA: 19,
        scoreB: 19,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "runmare_village",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "📚 모라스족의 마을로 향한다",
        next: "moras_village",
        scoreA: 21,
        scoreB: 21,
      },
    ],
  },
  
  no_alliance_choice_veloir: {
    text: "🚶 동맹 없이 다음 마을로 향하기로 결정했습니다. 혼자서 여행하며 더 많은 경험을 쌓을 수 있습니다.\n\n👴 마을 장로: \"이미 벨로아족을 방문했으니, 다음 마을을 선택하시오. 모든 종족의 도움을 받아야만 시간의 계단에 도달할 수 있습니다.\"",
    choices: [
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "noir_village",
        scoreA: 16,
        scoreB: 16,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "sylphred_village",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "drakar_village",
        scoreA: 17,
        scoreB: 17,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "runmare_village",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "📚 모라스족의 마을로 향한다",
        next: "moras_village",
        scoreA: 19,
        scoreB: 19,
      },
    ],
  },
  
  // 벨로아족에서 각 마을로 가는 경로들 (동맹)
  alliance_choice_veloir_noir: {
    text: "🌑 누아르족의 마을로 향합니다! 벨로아족의 전사들이 함께하며, 전투의 힘으로 보호해줍니다.\n\n🐺 벨로아족 전사: \"우리의 전투 정신으로 누아르족의 그림자 비밀을 함께 배우자!\"",
    choices: [
      {
        text: "🌑 누아르족 마을에 도착",
        next: "noir_village",
        scoreA: 18,
        scoreB: 18,
      },
    ],
  },
  
  alliance_choice_veloir_sylphred: {
    text: "🌪️ 실프레드족의 마을로 향합니다! 벨로아족의 전사들이 함께하며, 전투의 힘으로 보호해줍니다.\n\n🐺 벨로아족 전사: \"우리의 전투 정신으로 실프레드족의 바람 자유를 함께 배우자!\"",
    choices: [
      {
        text: "🌪️ 실프레드족 마을에 도착",
        next: "sylphred_village",
        scoreA: 17,
        scoreB: 17,
      },
    ],
  },
  
  alliance_choice_veloir_drakar: {
    text: "🔥 드라카르족의 마을로 향합니다! 벨로아족의 전사들이 함께하며, 전투의 힘으로 보호해줍니다.\n\n🐺 벨로아족 전사: \"우리의 전투 정신으로 드라카르족의 용의 힘을 함께 배우자!\"",
    choices: [
      {
        text: "🔥 드라카르족 마을에 도착",
        next: "drakar_village",
        scoreA: 19,
        scoreB: 19,
      },
    ],
  },
  
  alliance_choice_veloir_runmare: {
    text: "🌊 룬마레족의 마을로 향합니다! 벨로아족의 전사들이 함께하며, 전투의 힘으로 보호해줍니다.\n\n🐺 벨로아족 전사: \"우리의 전투 정신으로 룬마레족의 물의 지혜를 함께 배우자!\"",
    choices: [
      {
        text: "🌊 룬마레족 마을에 도착",
        next: "runmare_village",
        scoreA: 20,
        scoreB: 20,
      },
    ],
  },
  
  alliance_choice_veloir_moras: {
    text: "📚 모라스족의 마을로 향합니다! 벨로아족의 전사들이 함께하며, 전투의 힘으로 보호해줍니다.\n\n🐺 벨로아족 전사: \"우리의 전투 정신으로 모라스족의 고대 지식을 함께 배우자!\"",
    choices: [
      {
        text: "📚 모라스족 마을에 도착",
        next: "moras_village",
        scoreA: 21,
        scoreB: 21,
      },
    ],
  },
  
  // 누아르족 마을 - 그림자와 비밀의 땅
  noir_village: {
    text: "🌑 어둠이 깃든 신비로운 마을에 도착했습니다! 이곳은 그림자와 비밀의 땅으로, 누아르족들이 어둠의 힘을 다루며 살고 있습니다. 그림자 속에서 은밀하게 움직이는 주민들이 호기심 어린 눈으로 당신들을 바라봅니다.\n\n🌑 누아르족 족장: \"시간의 계단에 도달하려면 그림자의 비밀을 알아야 한다. 우리의 시험을 통과하면 시간의 조각을 찾는 힘을 얻을 수 있을 것이다.\"\n\n🌑 누아르족 족장: \"우리 마을에서 그림자의 지혜를 배우고, 비밀을 탐구하며, 어둠의 힘을 이해할 수 있다. 어떤 길을 선택하겠는가?\"",
    choices: [
      {
        text: "🌑 그림자 마법사들과의 대화",
        next: "noir_shadow_mages_talk",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "🏛️ 그림자 훈련장",
        next: "noir_shadow_training",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "📚 어둠의 도서관",
        next: "noir_dark_library",
        scoreA: 14,
        scoreB: 14,
      },
      {
        text: "🌑 그림자의 동굴",
        next: "noir_shadow_cave",
        scoreA: 11,
        scoreB: 11,
      },
    ],
  },
  
  // 누아르족 마을 이벤트들
  noir_shadow_mages_talk: {
    text: "🌑 그림자 마법사들과 함께 앉아 어둠의 비밀에 대해 이야기를 나눕니다. 마법사들은 그림자의 힘과 시간의 균열에 대한 깊은 지식을 가지고 있습니다.\n\n🌑 누아르족 마법사: \"그림자는 단순한 어둠이 아니다. 그림자 속에는 시간의 비밀과 미래의 조각들이 숨어있다.\"\n\n🌑 누아르족 마법사: \"이제 다음 단계로 나아가야 한다. 어떤 시험을 받고 싶은가?\"",
    choices: [
      {
        text: "🔍 시간 균열 감지",
        next: "noir_rift_detection",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🌑 그림자 이동술",
        next: "noir_shadow_teleportation",
        scoreA: 13,
        scoreB: 13,
      },
      {
        text: "📚 고대 그림자 지식",
        next: "noir_ancient_shadow_knowledge",
        scoreA: 14,
        scoreB: 14,
      },
      {
        text: "🕯️ 그림자 의식",
        next: "noir_shadow_ritual",
        scoreA: 12,
        scoreB: 12,
      },
    ],
  },
  
  noir_shadow_training: {
    text: "🏛️ 그림자 훈련장에서 어둠의 힘을 다루는 법을 배웁니다. 그림자 속에서 자유롭게 움직이고, 어둠을 활용한 전투 기술을 익힙니다.\n\n🌑 누아르족 훈련사: \"그림자와 하나가 되어라. 어둠을 두려워하지 말고, 어둠을 활용하라.\"\n\n🌑 누아르족 훈련사: \"훈련이 완료되었다. 이제 다음 시험을 선택하라.\"",
    choices: [
      {
        text: "🥋 그림자 무술",
        next: "noir_shadow_martial_arts",
        scoreA: 16,
        scoreB: 16,
      },
      {
        text: "🌑 그림자의 동굴",
        next: "noir_shadow_cave",
        scoreA: 14,
        scoreB: 14,
      },
      {
        text: "🔍 시간 균열 감지",
        next: "noir_rift_detection",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "📚 어둠의 도서관",
        next: "noir_dark_library",
        scoreA: 13,
        scoreB: 13,
      },
    ],
  },
  
  noir_shadow_test: {
    text: "🌑 누아르족의 그림자 시험을 받기로 결정했습니다! 어둠과 그림자 속에서 자유롭게 이동하는 법을 배우고, 시간의 균열을 감지할 수 있는 특별한 능력을 얻습니다.\n\n🌑 누아르족 족장: \"훌륭하다! 그림자의 비밀을 이해한 자라니... 이제 다른 종족의 도움을 받아야 할 때다.\"",
    choices: [
      {
        text: "🤝 동맹을 맺고 다음 마을로 향한다",
        next: "alliance_choice_noir",
        scoreA: 17,
        scoreB: 17,
      },
      {
        text: "🚶 동맹 없이 다음 마을로 향한다",
        next: "no_alliance_choice_noir",
        scoreA: 15,
        scoreB: 15,
      },
    ],
  },
  
  // 누아르족 추가 이벤트들
  noir_shadow_teleportation: {
    text: "🌑 그림자 이동술의 비밀을 배웁니다. 그림자 속을 통해 순간적으로 다른 곳으로 이동하는 법을 익히며, 공간의 비밀을 이해합니다.\n\n🌑 누아르족 마법사: \"그림자 이동술은 단순한 이동이 아니다. 시간과 공간의 경계를 넘어서는 것이다.\"\n\n🌑 누아르족 마법사: \"이제 다른 시험을 받아보라.\"",
    choices: [
      {
        text: "🔍 시간 균열 감지",
        next: "noir_rift_detection",
        scoreA: 17,
        scoreB: 17,
      },
      {
        text: "📚 고대 그림자 지식",
        next: "noir_ancient_shadow_knowledge",
        scoreA: 16,
        scoreB: 16,
      },
      {
        text: "🕯️ 그림자 의식",
        next: "noir_shadow_ritual",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🥋 그림자 무술",
        next: "noir_shadow_martial_arts",
        scoreA: 14,
        scoreB: 14,
      },
    ],
  },
  
  noir_ancient_shadow_knowledge: {
    text: "📚 고대의 그림자 지식을 탐구합니다. 과거의 마법사들이 남긴 그림자의 비밀과 시간의 균열에 대한 깊은 지식을 배웁니다.\n\n🌑 누아르족 도서관 사서: \"이 지식들은 수천 년간 축적된 그림자의 비밀이다. 하지만 이 지식을 이해하려면 어둠을 두려워하지 않는 마음이 필요하다.\"\n\n🌑 누아르족 도서관 사서: \"다른 시험도 받아보겠는가?\"",
    choices: [
      {
        text: "🔍 시간 균열 감지",
        next: "noir_rift_detection",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "🌑 그림자 이동술",
        next: "noir_shadow_teleportation",
        scoreA: 16,
        scoreB: 16,
      },
      {
        text: "🕯️ 그림자 의식",
        next: "noir_shadow_ritual",
        scoreA: 17,
        scoreB: 17,
      },
      {
        text: "🥋 그림자 무술",
        next: "noir_shadow_martial_arts",
        scoreA: 15,
        scoreB: 15,
      },
    ],
  },
  
  noir_shadow_ritual: {
    text: "🕯️ 신비로운 그림자 의식에 참여합니다. 이 의식은 과거와 미래를 연결하는 특별한 의식으로, 시간의 비밀을 엿볼 수 있습니다.\n\n🌑 누아르족 제사장: \"이 의식은 시간의 흐름을 느끼는 것이다. 과거와 미래가 하나로 연결되어 있다는 것을 이해하라.\"\n\n🌑 누아르족 제사장: \"의식이 완료되었다. 이제 다른 시험을 받아보라.\"",
    choices: [
      {
        text: "🔍 시간 균열 감지",
        next: "noir_rift_detection",
        scoreA: 19,
        scoreB: 19,
      },
      {
        text: "🌑 그림자 이동술",
        next: "noir_shadow_teleportation",
        scoreA: 17,
        scoreB: 17,
      },
      {
        text: "📚 고대 그림자 지식",
        next: "noir_ancient_shadow_knowledge",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "🥋 그림자 무술",
        next: "noir_shadow_martial_arts",
        scoreA: 16,
        scoreB: 16,
      },
    ],
  },
  
  noir_rift_detection: {
    text: "🔍 시간 균열 감지법을 배우기로 결정했습니다! 그림자 속에서 시간의 균열이 생기는 징조를 감지할 수 있게 되었고, 이를 통해 미래의 위험을 예측할 수 있습니다.\n\n🌑 누아르족 족장: \"시간의 균열을 감지하는 법을 배운 자라니... 그대들의 지혜를 인정한다. 이제 다른 종족의 도움을 받아야 할 때다.\"",
    choices: [
      {
        text: "🤝 동맹을 맺고 다음 마을로 향한다",
        next: "alliance_choice_noir",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🚶 동맹 없이 다음 마을로 향한다",
        next: "no_alliance_choice_noir",
        scoreA: 13,
        scoreB: 13,
      },
    ],
  },
  
  // 누아르족 고급 이벤트들
  noir_shadow_cave: {
    text: "🌑 그림자의 동굴에 들어가 어둠의 비밀을 탐구합니다. 이 동굴은 그림자 마법의 근원지로, 가장 깊은 어둠의 힘을 느낄 수 있습니다.\n\n🌑 누아르족 동굴 수호자: \"이 동굴은 그림자 마법의 근원지이다. 가장 깊은 어둠의 힘을 느낄 수 있다.\"\n\n🌑 누아르족 동굴 수호자: \"어떤 비밀을 탐구하겠는가?\"",
    choices: [
      {
        text: "🔍 시간 균열 감지",
        next: "noir_rift_detection",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "🌑 그림자 이동술",
        next: "noir_shadow_teleportation",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "📚 고대 그림자 지식",
        next: "noir_ancient_shadow_knowledge",
        scoreA: 19,
        scoreB: 19,
      },
      {
        text: "🕯️ 그림자 의식",
        next: "noir_shadow_ritual",
        scoreA: 17,
        scoreB: 17,
      },
    ],
  },
  

  
  noir_dark_library: {
    text: "📚 어둠의 도서관에 들어가 그림자와 어둠에 대한 고대의 지식들을 탐구합니다. 이곳에는 수천 년간 축적된 그림자의 비밀과 시간의 균열에 대한 모든 지식이 보관되어 있습니다.\n\n🌑 누아르족 도서관 사서: \"이 도서관에는 그림자의 비밀과 시간의 균열에 대한 모든 지식이 있다. 하지만 이 지식을 이해하려면 어둠을 두려워하지 않는 마음이 필요하다.\"\n\n🌑 누아르족 도서관 사서: \"어떤 지식을 탐구하겠는가?\"",
    choices: [
      {
        text: "🔍 시간 균열 감지",
        next: "noir_rift_detection",
        scoreA: 19,
        scoreB: 19,
      },
      {
        text: "🌑 그림자 이동술",
        next: "noir_shadow_teleportation",
        scoreA: 17,
        scoreB: 17,
      },
      {
        text: "📚 고대 그림자 지식",
        next: "noir_ancient_shadow_knowledge",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "🕯️ 그림자 의식",
        next: "noir_shadow_ritual",
        scoreA: 16,
        scoreB: 16,
      },
    ],
  },
  
  noir_shadow_martial_arts: {
    text: "🥋 그림자 무술을 배우기로 결정했습니다! 그림자 속에서 자유롭게 움직이는 법을 배우고, 어둠을 활용한 전투 기술을 익힙니다.\n\n🌑 누아르족 무술사: \"그림자 무술은 단순한 전투 기술이 아니다. 그림자와 하나가 되어 움직이는 법을 배우는 것이다.\"\n\n🌑 누아르족 족장: \"그림자 무술을 이해한 자라니... 그대들의 기술을 인정한다. 이제 다른 종족의 도움을 받아야 할 때다.\"",
    choices: [
      {
        text: "🤝 동맹을 맺고 다음 마을로 향한다",
        next: "alliance_choice_noir",
        scoreA: 16,
        scoreB: 16,
      },
      {
        text: "🚶 동맹 없이 다음 마을로 향한다",
        next: "no_alliance_choice_noir",
        scoreA: 14,
        scoreB: 14,
      },
    ],
  },
  
  // 동맹 선택 (누아르족에서)
  alliance_choice_noir: {
    text: "🤝 누아르족과 동맹을 맺기로 결정했습니다! 누아르족의 그림자 마법사들이 당신들과 함께 여행하며, 그림자의 힘으로 도움을 줄 것입니다.\n\n🌑 누아르족 마법사: \"그림자의 힘으로 시간의 균열을 감지하여 안전한 길을 찾아주겠다!\"\n\n👴 마을 장로: \"이미 벨로아족, 누아르족을 방문했으니, 다음 마을을 선택하시오. 모든 종족의 도움을 받아야만 시간의 계단에 도달할 수 있습니다.\"",
    choices: [
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "sylphred_village",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "drakar_village",
        scoreA: 21,
        scoreB: 21,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "runmare_village",
        scoreA: 22,
        scoreB: 22,
      },
      {
        text: "📚 모라스족의 마을로 향한다",
        next: "moras_village",
        scoreA: 23,
        scoreB: 23,
      },
    ],
  },
  
  no_alliance_choice_noir: {
    text: "🚶 동맹 없이 다음 마을로 향하기로 결정했습니다. 혼자서 여행하며 더 많은 경험을 쌓을 수 있습니다.\n\n👴 마을 장로: \"이미 벨로아족, 누아르족을 방문했으니, 다음 마을을 선택하시오. 모든 종족의 도움을 받아야만 시간의 계단에 도달할 수 있습니다.\"",
    choices: [
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "sylphred_village",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "drakar_village",
        scoreA: 19,
        scoreB: 19,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "runmare_village",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "📚 모라스족의 마을로 향한다",
        next: "moras_village",
        scoreA: 21,
        scoreB: 21,
      },
    ],
  },
  
  // 누아르족에서 각 마을로 가는 경로들 (동맹)
  alliance_choice_noir_sylphred: {
    text: "🌪️ 실프레드족의 마을로 향합니다! 누아르족의 그림자 마법사들이 함께하며, 그림자의 힘으로 안전한 길을 찾아줍니다.\n\n🌑 누아르족 마법사: \"그림자의 힘으로 실프레드족의 바람 자유를 함께 배우자!\"",
    choices: [
      {
        text: "🌪️ 실프레드족 마을에 도착",
        next: "sylphred_village",
        scoreA: 20,
        scoreB: 20,
      },
    ],
  },
  
  alliance_choice_noir_drakar: {
    text: "🔥 드라카르족의 마을로 향합니다! 누아르족의 그림자 마법사들이 함께하며, 그림자의 힘으로 안전한 길을 찾아줍니다.\n\n🌑 누아르족 마법사: \"그림자의 힘으로 드라카르족의 용의 힘을 함께 배우자!\"",
    choices: [
      {
        text: "🔥 드라카르족 마을에 도착",
        next: "drakar_village",
        scoreA: 21,
        scoreB: 21,
      },
    ],
  },
  
  alliance_choice_noir_runmare: {
    text: "🌊 룬마레족의 마을로 향합니다! 누아르족의 그림자 마법사들이 함께하며, 그림자의 힘으로 안전한 길을 찾아줍니다.\n\n🌑 누아르족 마법사: \"그림자의 힘으로 룬마레족의 물의 지혜를 함께 배우자!\"",
    choices: [
      {
        text: "🌊 룬마레족 마을에 도착",
        next: "runmare_village",
        scoreA: 22,
        scoreB: 22,
      },
    ],
  },
  
  alliance_choice_noir_moras: {
    text: "📚 모라스족의 마을로 향합니다! 누아르족의 그림자 마법사들이 함께하며, 그림자의 힘으로 안전한 길을 찾아줍니다.\n\n🌑 누아르족 마법사: \"그림자의 힘으로 모라스족의 고대 지식을 함께 배우자!\"",
    choices: [
      {
        text: "📚 모라스족 마을에 도착",
        next: "moras_village",
        scoreA: 23,
        scoreB: 23,
      },
    ],
  },
  
  // 실프레드족 마을
  sylphred_village: {
    text: "🌪️ 실프레드족의 마을에 도착했습니다! 이곳은 바람과 자유의 마을입니다. 실프레드족들은 바람을 타고 자유롭게 날아다닐 수 있으며, 시간의 흐름을 느낄 수 있는 특별한 능력을 가지고 있습니다.\n\n🌪️ 실프레드족 족장: \"시간의 계단에 도달하려면 바람의 자유를 알아야 한다. 우리의 시험을 통과하면 시간의 조각을 찾는 힘을 얻을 수 있을 것이다.\"\n\n🌪️ 실프레드족 족장: \"우리 마을에는 바람의 정상, 자유의 광장, 하늘의 길, 그리고 바람의 악기들이 있다. 어디서 시험을 받고 싶은가?\"",
    choices: [
      {
        text: "🌪️ 바람의 시험을 받는다",
        next: "sylphred_wind_test",
        scoreA: 9,
        scoreB: 9,
      },
      {
        text: "🕊️ 자유의 비밀을 배운다",
        next: "sylphred_freedom_secret",
        scoreA: 7,
        scoreB: 7,
      },
      {
        text: "🏔️ 바람의 정상에 오른다",
        next: "sylphred_wind_peak",
        scoreA: 13,
        scoreB: 13,
      },
      {
        text: "🎵 바람의 악기를 연주한다",
        next: "sylphred_wind_music",
        scoreA: 10,
        scoreB: 10,
      },
    ],
  },
  
  sylphred_wind_test: {
    text: "🌪️ 실프레드족의 바람 시험을 받기로 결정했습니다! 바람을 타고 자유롭게 날아다니는 법을 배우고, 시간의 흐름을 느낄 수 있는 특별한 능력을 얻습니다.\n\n🌪️ 실프레드족 족장: \"훌륭하다! 바람의 자유를 이해한 자라니... 이제 에테르족의 도움을 받아야 할 때다.\"",
    choices: [
      {
        text: "🤝 동맹을 맺고 에테르족 마을로 향한다",
        next: "alliance_choice_sylphred",
        scoreA: 14,
        scoreB: 14,
      },
      {
        text: "🚶 동맹 없이 에테르족 마을로 향한다",
        next: "no_alliance_choice_sylphred",
        scoreA: 12,
        scoreB: 12,
      },
    ],
  },
  
  sylphred_freedom_secret: {
    text: "🕊️ 자유의 비밀을 배우기로 결정했습니다! 바람과 함께 자유롭게 움직이는 법을 배우고, 시간의 흐름 속에서 자유를 찾는 방법을 익힙니다.\n\n🌪️ 실프레드족 족장: \"자유의 비밀을 이해한 자라니... 그대들의 지혜를 인정한다. 이제 다른 종족의 도움을 받아야 할 때다.\"",
    choices: [
      {
        text: "🤝 동맹을 맺고 다음 마을로 향한다",
        next: "alliance_choice_sylphred",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "🚶 동맹 없이 다음 마을로 향한다",
        next: "no_alliance_choice_sylphred",
        scoreA: 10,
        scoreB: 10,
      },
    ],
  },
  
  sylphred_wind_peak: {
    text: "🏔️ 바람의 정상에 오르기로 결정했습니다! 이 정상은 바람이 가장 강하게 부는 곳으로, 바람의 힘을 직접 체험할 수 있습니다.\n\n🌪️ 실프레드족 산악인: \"바람의 정상에서는 바람의 모든 힘을 느낄 수 있다. 하지만 이 힘을 다루려면 바람과 하나가 되어야 한다.\"\n\n🌪️ 실프레드족 족장: \"바람의 정상을 오른 자라니... 그대들의 용기를 인정한다. 시간의 계단으로 향하는 길을 안내해주겠다.\"",
    choices: [
      {
        text: "⏰ 시간의 계단으로 향한다",
        next: "time_stairs",
        scoreA: 16,
        scoreB: 16,
      },
    ],
  },
  
  sylphred_wind_music: {
    text: "🎵 바람의 악기를 연주하기로 결정했습니다! 바람과 함께 울리는 특별한 악기들을 연주하면서 바람의 언어를 배웁니다.\n\n🌪️ 실프레드족 음악가: \"바람의 악기는 바람과 대화하는 도구다. 이 악기로 연주하는 음악은 시간의 흐름을 조화롭게 만들 수 있다.\"\n\n🌪️ 실프레드족 족장: \"바람의 음악을 이해한 자라니... 그대들의 예술성을 인정한다. 시간의 계단으로 향하는 길을 안내해주겠다.\"",
    choices: [
      {
        text: "⏰ 시간의 계단으로 향한다",
        next: "time_stairs",
        scoreA: 14,
        scoreB: 14,
      },
    ],
  },
  
  // 동맹 선택 (실프레드족에서)
  alliance_choice_sylphred: {
    text: "🤝 실프레드족과 동맹을 맺기로 결정했습니다! 실프레드족의 바람 정령들이 당신들과 함께 여행하며, 바람의 힘으로 빠른 이동을 도와줄 것입니다.\n\n🌪️ 실프레드족 정령: \"바람의 힘으로 다음 마을까지 빠르게 이동하겠다!\"\n\n👴 마을 장로: \"이미 3개 마을을 방문했으니, 다음 마을을 선택하시오. 모든 종족의 도움을 받아야만 시간의 계단에 도달할 수 있습니다.\"",
    choices: [
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "drakar_village",
        scoreA: 16,
        scoreB: 16,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "runmare_village",
        scoreA: 17,
        scoreB: 17,
      },
      {
        text: "📚 모라스족의 마을로 향한다",
        next: "moras_village",
        scoreA: 18,
        scoreB: 18,
      },
    ],
  },
  
  no_alliance_choice_sylphred: {
    text: "🚶 동맹 없이 다음 마을로 향하기로 결정했습니다. 혼자서 여행하며 더 많은 경험을 쌓을 수 있습니다.\n\n👴 마을 장로: \"이미 3개 마을을 방문했으니, 다음 마을을 선택하시오. 모든 종족의 도움을 받아야만 시간의 계단에 도달할 수 있습니다.\"",
    choices: [
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "drakar_village",
        scoreA: 14,
        scoreB: 14,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "runmare_village",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "📚 모라스족의 마을로 향한다",
        next: "moras_village",
        scoreA: 16,
        scoreB: 16,
      },
    ],
  },
  
  // 드라카르족 마을
  drakar_village: {
    text: "🔥 드라카르족의 마을에 도착했습니다! 이곳은 용의 불꽃과 힘의 마을입니다. 드라카르족들은 용의 힘을 다루며, 시간을 조작할 수 있는 강력한 능력을 가지고 있습니다.\n\n🔥 드라카르족 족장: \"시간의 계단에 도달하려면 용의 힘을 알아야 한다. 우리의 시험을 통과하면 시간의 조각을 찾는 힘을 얻을 수 있을 것이다.\"\n\n🔥 드라카르족 족장: \"우리 마을에는 용의 둥지, 불의 대장간, 용의 보물고, 그리고 용의 제단이 있다. 어디서 시험을 받고 싶은가?\"",
    choices: [
      {
        text: "🔥 용의 시험을 받는다",
        next: "drakar_dragon_test",
        scoreA: 11,
        scoreB: 11,
      },
      {
        text: "⚡ 용의 힘을 배운다",
        next: "drakar_dragon_power",
        scoreA: 9,
        scoreB: 9,
      },
      {
        text: "🏰 용의 둥지를 탐험한다",
        next: "drakar_dragon_nest",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "⚒️ 불의 대장간에서 무기를 만든다",
        next: "drakar_fire_forge",
        scoreA: 12,
        scoreB: 12,
      },
    ],
  },
  
  drakar_dragon_test: {
    text: "🔥 드라카르족의 용 시험을 받기로 결정했습니다! 용의 불꽃을 다루는 법을 배우고, 시간을 조작할 수 있는 강력한 능력을 얻습니다.\n\n🔥 드라카르족 족장: \"훌륭하다! 용의 힘을 이해한 자라니... 이제 에테르족의 도움을 받아야 할 때다.\"",
    choices: [
      {
        text: "🤝 동맹을 맺고 에테르족 마을로 향한다",
        next: "alliance_choice_drakar",
        scoreA: 16,
        scoreB: 16,
      },
      {
        text: "🚶 동맹 없이 에테르족 마을로 향한다",
        next: "no_alliance_choice_drakar",
        scoreA: 14,
        scoreB: 14,
      },
    ],
  },
  
  drakar_dragon_power: {
    text: "⚡ 용의 힘을 배우기로 결정했습니다! 용의 불꽃을 조절하는 법을 배우고, 시간을 조작할 수 있는 강력한 능력을 익힙니다.\n\n🔥 드라카르족 족장: \"용의 힘을 이해한 자라니... 그대들의 지혜를 인정한다. 시간의 계단으로 향하는 길을 안내해주겠다.\"",
    choices: [
      {
        text: "⏰ 시간의 계단으로 향한다",
        next: "time_stairs",
        scoreA: 14,
        scoreB: 14,
      },
    ],
  },
  
  drakar_dragon_nest: {
    text: "🏰 용의 둥지를 탐험하기로 결정했습니다! 이곳에는 고대의 용들이 살았던 거대한 둥지가 있으며, 용의 힘의 원천을 직접 체험할 수 있습니다.\n\n🔥 드라카르족 용 사냥꾼: \"용의 둥지는 용의 모든 힘이 집중된 곳이다. 이곳에서 용의 영혼과 대화할 수 있다.\"\n\n🔥 드라카르족 족장: \"용의 둥지를 탐험한 자라니... 그대들의 용기를 인정한다. 시간의 계단으로 향하는 길을 안내해주겠다.\"",
    choices: [
      {
        text: "⏰ 시간의 계단으로 향한다",
        next: "time_stairs",
        scoreA: 18,
        scoreB: 18,
      },
    ],
  },
  
  drakar_fire_forge: {
    text: "⚒️ 불의 대장간에서 무기를 만들기로 결정했습니다! 용의 불꽃으로 강화된 특별한 무기를 만들고, 시간을 조작할 수 있는 도구를 제작합니다.\n\n🔥 드라카르족 대장장이: \"용의 불꽃으로 만든 무기는 시간을 자르는 힘을 가진다. 하지만 이 무기를 다루려면 용의 정신이 필요하다.\"\n\n🔥 드라카르족 족장: \"용의 무기를 만든 자라니... 그대들의 기술을 인정한다. 시간의 계단으로 향하는 길을 안내해주겠다.\"",
    choices: [
      {
        text: "⏰ 시간의 계단으로 향한다",
        next: "time_stairs",
        scoreA: 16,
        scoreB: 16,
      },
    ],
  },
  
  // 동맹 선택 (드라카르족에서)
  alliance_choice_drakar: {
    text: "🤝 드라카르족과 동맹을 맺기로 결정했습니다! 드라카르족의 용 기사들이 당신들과 함께 여행하며, 용의 힘으로 강력한 보호를 제공할 것입니다.\n\n🔥 드라카르족 용 기사: \"용의 힘으로 다음 마을까지 안전하게 호위하겠다!\"\n\n👴 마을 장로: \"이미 4개 마을을 방문했으니, 다음 마을을 선택하시오. 모든 종족의 도움을 받아야만 시간의 계단에 도달할 수 있습니다.\"",
    choices: [
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "runmare_village",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "📚 모라스족의 마을로 향한다",
        next: "moras_village",
        scoreA: 19,
        scoreB: 19,
      },
    ],
  },
  
  no_alliance_choice_drakar: {
    text: "🚶 동맹 없이 다음 마을로 향하기로 결정했습니다. 혼자서 여행하며 더 많은 경험을 쌓을 수 있습니다.\n\n👴 마을 장로: \"이미 4개 마을을 방문했으니, 다음 마을을 선택하시오. 모든 종족의 도움을 받아야만 시간의 계단에 도달할 수 있습니다.\"",
    choices: [
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "runmare_village",
        scoreA: 16,
        scoreB: 16,
      },
      {
        text: "📚 모라스족의 마을로 향한다",
        next: "moras_village",
        scoreA: 17,
        scoreB: 17,
      },
    ],
  },
  
  // 룬마레족 마을
  runmare_village: {
    text: "🌊 룬마레족의 마을에 도착했습니다! 이곳은 물의 지혜와 흐름의 마을입니다. 룬마레족들은 물을 자유롭게 다루며, 시간의 흐름을 예측할 수 있는 특별한 능력을 가지고 있습니다.\n\n🌊 룬마레족 족장: \"시간의 계단에 도달하려면 물의 지혜를 알아야 한다. 우리의 시험을 통과하면 시간의 조각을 찾는 힘을 얻을 수 있을 것이다.\"\n\n🌊 룬마레족 족장: \"우리 마을에는 물의 신전, 흐름의 강, 물의 도서관, 그리고 물의 거울이 있다. 어디서 시험을 받고 싶은가?\"",
    choices: [
      {
        text: "🌊 물의 시험을 받는다",
        next: "runmare_water_test",
        scoreA: 13,
        scoreB: 13,
      },
      {
        text: "🌊 흐름의 비밀을 배운다",
        next: "runmare_flow_secret",
        scoreA: 11,
        scoreB: 11,
      },
      {
        text: "🏛️ 물의 신전을 방문한다",
        next: "runmare_water_temple",
        scoreA: 16,
        scoreB: 16,
      },
      {
        text: "🌊 물의 거울을 들여다본다",
        next: "runmare_water_mirror",
        scoreA: 14,
        scoreB: 14,
      },
    ],
  },
  
  runmare_water_test: {
    text: "🌊 룬마레족의 물 시험을 받기로 결정했습니다! 물의 힘을 다루는 법을 배우고, 시간의 흐름을 예측할 수 있는 능력을 얻습니다.\n\n🌊 룬마레족 족장: \"물의 힘을 이해한 자라니... 그대들의 지혜를 인정한다. 이제 다른 종족의 도움을 받아야 할 때다.\"",
    choices: [
      {
        text: "🤝 동맹을 맺고 다음 마을로 향한다",
        next: "alliance_choice_runmare",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "🚶 동맹 없이 다음 마을로 향한다",
        next: "no_alliance_choice_runmare",
        scoreA: 16,
        scoreB: 16,
      },
    ],
  },
  
  runmare_flow_secret: {
    text: "🌊 흐름의 비밀을 배우기로 결정했습니다! 물의 흐름을 통해 시간의 흐름을 이해하고, 미래를 예측하는 법을 익힙니다.\n\n🌊 룬마레족 족장: \"흐름의 비밀을 이해한 자라니... 그대들의 지혜를 인정한다. 이제 다른 종족의 도움을 받아야 할 때다.\"",
    choices: [
      {
        text: "🤝 동맹을 맺고 다음 마을로 향한다",
        next: "alliance_choice_runmare",
        scoreA: 16,
        scoreB: 16,
      },
      {
        text: "🚶 동맹 없이 다음 마을로 향한다",
        next: "no_alliance_choice_runmare",
        scoreA: 14,
        scoreB: 14,
      },
    ],
  },
  
  runmare_water_temple: {
    text: "🏛️ 물의 신전을 방문하기로 결정했습니다! 이곳에는 고대의 물의 신들이 살았던 신성한 장소로, 물의 모든 비밀을 배울 수 있습니다.\n\n🌊 룬마레족 사제: \"물의 신전은 물의 모든 지혜가 집중된 곳이다. 이곳에서 물의 신들과 대화할 수 있다.\"\n\n🌊 룬마레족 족장: \"물의 신전을 방문한 자라니... 그대들의 신성함을 인정한다. 시간의 계단으로 향하는 길을 안내해주겠다.\"",
    choices: [
      {
        text: "⏰ 시간의 계단으로 향한다",
        next: "time_stairs",
        scoreA: 20,
        scoreB: 20,
      },
    ],
  },
  
  runmare_water_mirror: {
    text: "🌊 물의 거울을 들여다보기로 결정했습니다! 이 거울은 과거와 미래를 보여주는 신비로운 거울로, 시간의 비밀을 엿볼 수 있습니다.\n\n🌊 룬마레족 예언자: \"물의 거울은 시간의 모든 비밀을 보여준다. 하지만 이 거울을 이해하려면 순수한 마음이 필요하다.\"\n\n🌊 룬마레족 족장: \"물의 거울을 이해한 자라니... 그대들의 통찰력을 인정한다. 시간의 계단으로 향하는 길을 안내해주겠다.\"",
    choices: [
      {
        text: "⏰ 시간의 계단으로 향한다",
        next: "time_stairs",
        scoreA: 19,
        scoreB: 19,
      },
    ],
  },
  
  // 동맹 선택 (룬마레족에서)
  alliance_choice_runmare: {
    text: "🤝 룬마레족과 동맹을 맺기로 결정했습니다! 룬마레족의 물의 사제들이 당신들과 함께 여행하며, 물의 힘으로 시간의 흐름을 예측해줄 것입니다.\n\n🌊 룬마레족 사제: \"물의 힘으로 시간의 흐름을 예측하여 안전한 길을 찾아주겠다!\"\n\n👴 마을 장로: \"이미 5개 마을을 방문했으니, 마지막으로 에테르족의 도움을 받아야 합니다.\"",
    choices: [
      {
        text: "📚 모라스족의 마을로 향한다",
        next: "moras_village",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "✨ 에테르족의 마을로 향한다",
        next: "ether_village",
        scoreA: 21,
        scoreB: 21,
      },
    ],
  },
  
  no_alliance_choice_runmare: {
    text: "🚶 동맹 없이 다음 마을로 향하기로 결정했습니다. 혼자서 여행하며 더 많은 경험을 쌓을 수 있습니다.\n\n👴 마을 장로: \"이제 다음 마을을 방문해야 합니다. 모든 종족의 도움을 받아야만 시간의 계단에 도달할 수 있습니다.\"",
    choices: [
      {
        text: "📚 모라스족의 마을로 향한다",
        next: "moras_village",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "✨ 에테르족의 마을로 향한다",
        next: "ether_village",
        scoreA: 19,
        scoreB: 19,
      },
    ],
  },
  
  // 모라스족 마을
  moras_village: {
    text: "📚 모라스족의 마을에 도착했습니다! 이곳은 고대의 지식과 마법의 마을입니다. 모라스족들은 고대의 마법을 다루며, 시간을 조작할 수 있는 강력한 주문을 알고 있습니다.\n\n📚 모라스족 족장: \"시간의 계단에 도달하려면 고대의 지식을 알아야 한다. 우리의 시험을 통과하면 시간의 조각을 찾는 힘을 얻을 수 있을 것이다.\"\n\n📚 모라스족 족장: \"우리 마을에는 고대 도서관, 마법의 탑, 고대 유적, 그리고 지식의 방이 있다. 어디서 시험을 받고 싶은가?\"",
    choices: [
      {
        text: "📚 고대의 시험을 받는다",
        next: "moras_ancient_test",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "📚 마법의 비밀을 배운다",
        next: "moras_magic_secret",
        scoreA: 13,
        scoreB: 13,
      },
      {
        text: "🏛️ 고대 도서관을 탐험한다",
        next: "moras_ancient_library",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "🗼 마법의 탑에 오른다",
        next: "moras_magic_tower",
        scoreA: 16,
        scoreB: 16,
      },
    ],
  },
  
  moras_ancient_test: {
    text: "📚 모라스족의 고대 시험을 받기로 결정했습니다! 고대의 지식을 배우고, 시간을 조작할 수 있는 강력한 마법을 익힙니다.\n\n📚 모라스족 족장: \"고대의 지식을 이해한 자라니... 그대들의 지혜를 인정한다. 이제 마지막으로 에테르족의 도움을 받아야 할 때다.\"",
    choices: [
      {
        text: "🤝 동맹을 맺고 에테르족 마을로 향한다",
        next: "alliance_choice_moras",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "🚶 동맹 없이 에테르족 마을로 향한다",
        next: "no_alliance_choice_moras",
        scoreA: 18,
        scoreB: 18,
      },
    ],
  },
  
  moras_magic_secret: {
    text: "📚 마법의 비밀을 배우기로 결정했습니다! 고대의 마법 주문을 배우고, 시간을 조작할 수 있는 강력한 힘을 익힙니다.\n\n📚 모라스족 족장: \"마법의 비밀을 이해한 자라니... 그대들의 지혜를 인정한다. 이제 마지막으로 에테르족의 도움을 받아야 할 때다.\"",
    choices: [
      {
        text: "🤝 동맹을 맺고 에테르족 마을로 향한다",
        next: "alliance_choice_moras",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "🚶 동맹 없이 에테르족 마을로 향한다",
        next: "no_alliance_choice_moras",
        scoreA: 16,
        scoreB: 16,
      },
    ],
  },
  
  moras_ancient_library: {
    text: "🏛️ 고대 도서관을 탐험하기로 결정했습니다! 이곳에는 고대의 모든 지식이 보관되어 있으며, 시간의 비밀을 담은 고서들이 있습니다.\n\n📚 모라스족 도서관 사서: \"고대 도서관에는 시간의 모든 비밀이 기록되어 있다. 하지만 이 지식을 이해하려면 깊은 지혜가 필요하다.\"\n\n📚 모라스족 족장: \"고대 도서관을 탐험한 자라니... 그대들의 지혜를 인정한다. 시간의 계단으로 향하는 길을 안내해주겠다.\"",
    choices: [
      {
        text: "⏰ 시간의 계단으로 향한다",
        next: "time_stairs",
        scoreA: 22,
        scoreB: 22,
      },
    ],
  },
  
  moras_magic_tower: {
    text: "🗼 마법의 탑에 오르기로 결정했습니다! 이 탑은 고대의 마법사들이 수련하던 곳으로, 강력한 마법의 힘을 직접 체험할 수 있습니다.\n\n📚 모라스족 마법사: \"마법의 탑은 마법의 모든 힘이 집중된 곳이다. 이곳에서 고대의 마법을 배울 수 있다.\"\n\n📚 모라스족 족장: \"마법의 탑을 오른 자라니... 그대들의 용기를 인정한다. 시간의 계단으로 향하는 길을 안내해주겠다.\"",
    choices: [
      {
        text: "⏰ 시간의 계단으로 향한다",
        next: "time_stairs",
        scoreA: 21,
        scoreB: 21,
      },
    ],
  },
  
  // 동맹 선택 (모라스족에서)
  alliance_choice_moras: {
    text: "🤝 모라스족과 동맹을 맺기로 결정했습니다! 모라스족의 고대 마법사들이 당신들과 함께 여행하며, 고대의 지식으로 강력한 마법을 제공할 것입니다.\n\n📚 모라스족 마법사: \"고대의 지식으로 에테르족 마을까지 안전하게 호위하겠다!\"\n\n✨ 에테르족 마을로 향합니다...",
    choices: [
      {
        text: "✨ 에테르족의 마을로 향한다",
        next: "ether_village",
        scoreA: 22,
        scoreB: 22,
      },
    ],
  },
  
  no_alliance_choice_moras: {
    text: "🚶 동맹 없이 에테르족 마을로 향하기로 결정했습니다. 혼자서 여행하며 더 많은 경험을 쌓을 수 있습니다.\n\n✨ 에테르족 마을로 향합니다...",
    choices: [
      {
        text: "✨ 에테르족의 마을로 향한다",
        next: "ether_village",
        scoreA: 20,
        scoreB: 20,
      },
    ],
  },
  
  // 에테르족 마을
  ether_village: {
    text: "✨ 에테르족의 마을에 도착했습니다! 이곳은 영혼의 순수함과 에테르의 마을입니다. 에테르족들은 영혼을 자유롭게 다루며, 시간의 본질을 이해할 수 있는 특별한 능력을 가지고 있습니다.\n\n✨ 에테르족 족장: \"시간의 계단에 도달하려면 영혼의 순수함을 알아야 한다. 우리의 시험을 통과하면 시간의 조각을 찾는 힘을 얻을 수 있을 것이다.\"\n\n✨ 에테르족 족장: \"우리 마을에는 영혼의 정원, 에테르의 성소, 영혼의 거울, 그리고 순수함의 방이 있다. 어디서 시험을 받고 싶은가?\"",
    choices: [
      {
        text: "✨ 영혼의 시험을 받는다",
        next: "ether_soul_test",
        scoreA: 17,
        scoreB: 17,
      },
      {
        text: "✨ 순수함의 비밀을 배운다",
        next: "ether_purity_secret",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🌸 영혼의 정원을 거닌다",
        next: "ether_soul_garden",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "✨ 에테르의 성소를 방문한다",
        next: "ether_ether_sanctuary",
        scoreA: 18,
        scoreB: 18,
      },
    ],
  },
  
  ether_soul_test: {
    text: "✨ 에테르족의 영혼 시험을 받기로 결정했습니다! 영혼의 순수함을 배우고, 시간의 본질을 이해할 수 있는 능력을 얻습니다.\n\n✨ 에테르족 족장: \"영혼의 순수함을 이해한 자라니... 그대들의 순수함을 인정한다. 이제 시간의 계단으로 향할 준비가 완료되었다.\"",
    choices: [
      {
        text: "⏰ 시간의 계단으로 향한다",
        next: "time_stairs",
        scoreA: 22,
        scoreB: 22,
      },
    ],
  },
  
  ether_purity_secret: {
    text: "✨ 순수함의 비밀을 배우기로 결정했습니다! 영혼의 순수함을 통해 시간의 본질을 이해하고, 에테르의 힘을 익힙니다.\n\n✨ 에테르족 족장: \"순수함의 비밀을 이해한 자라니... 그대들의 순수함을 인정한다. 시간의 계단으로 향하는 길을 안내해주겠다.\"",
    choices: [
      {
        text: "⏰ 시간의 계단으로 향한다",
        next: "time_stairs",
        scoreA: 20,
        scoreB: 20,
      },
    ],
  },
  
  ether_soul_garden: {
    text: "🌸 영혼의 정원을 거닌다기로 결정했습니다! 이곳에는 순수한 영혼들이 피어나는 꽃들이 있으며, 영혼의 모든 비밀을 배울 수 있습니다.\n\n✨ 에테르족 정원사: \"영혼의 정원은 순수한 영혼들이 피어나는 곳이다. 이곳에서 영혼의 모든 비밀을 배울 수 있다.\"\n\n✨ 에테르족 족장: \"영혼의 정원을 거닌 자라니... 그대들의 순수함을 인정한다. 시간의 계단으로 향하는 길을 안내해주겠다.\"",
    choices: [
      {
        text: "⏰ 시간의 계단으로 향한다",
        next: "time_stairs",
        scoreA: 24,
        scoreB: 24,
      },
    ],
  },
  
  ether_ether_sanctuary: {
    text: "✨ 에테르의 성소를 방문하기로 결정했습니다! 이곳은 에테르의 모든 힘이 집중된 신성한 장소로, 영혼의 순수함을 체험할 수 있습니다.\n\n✨ 에테르족 사제: \"에테르의 성소는 영혼의 순수함이 가장 강하게 느껴지는 곳이다. 이곳에서 에테르의 모든 힘을 체험할 수 있다.\"\n\n✨ 에테르족 족장: \"에테르의 성소를 방문한 자라니... 그대들의 신성함을 인정한다. 시간의 계단으로 향하는 길을 안내해주겠다.\"",
    choices: [
      {
        text: "⏰ 시간의 계단으로 향한다",
        next: "time_stairs",
        scoreA: 23,
        scoreB: 23,
      },
    ],
  },
  
  // 시간의 계단 (최종 엔딩)
  time_stairs: {
    text: "⏰ 드디어 시간의 계단에 도달했습니다! 거대한 계단이 하늘로 뻗어있고, 그 정상에는 시간의 조각이 빛나고 있습니다.\n\n👴 시간의 수호자: \"훌륭한 모험가들이여! 그대들은 여러 종족의 도움을 받아 이곳까지 왔다. 이제 시간의 조각을 획득하여 시간을 자유롭게 조종할 수 있게 되었다.\"\n\n💎 시간의 조각을 획득하여 세계의 시간 균형을 회복하고, 모든 종족들과 함께 평화로운 아를리아 세계를 만들었습니다!",
    choices: [], // 엔딩 - 선택지 없음
  },
};

const GameSettings: React.FC<GameSettingsProps> = ({ onStart }) => {
  const { teams } = useScore();
  const [teamAName, setTeamAName] = useState("");
  const [teamBName, setTeamBName] = useState("");

  // 메인 화면의 팀 데이터로 초기화
  useEffect(() => {
    if (teams.length >= 2) {
      setTeamAName(teams[0].name);
      setTeamBName(teams[1].name);
    }
  }, [teams]);

  const handleStart = () => {
    if (teams.length >= 2) {
      onStart(teams[0].name, teams[1].name);
    }
  };

  return (
    <div className="game-settings">
      <h1>🔮 유리의 세계와 시간의 계단</h1>

      <div className="world-description">
        <h3>🌍 아를리아 세계관</h3>
        <div className="world-info">
          <p>
            <strong>아를리아</strong>: 거울처럼 투명한 하늘과 시간의 계단으로 이루어진 신비로운 세계입니다. 
            이곳에서는 시간이 물리적 실체로 존재하며, 모든 것이 시간의 흐름에 따라 변화합니다.
          </p>
          <p>
            <strong>시간의 계단</strong>: 오르내릴 때마다 하루, 한 달, 수백 년의 시간이 흘러가는
            신비로운 계단입니다. 계단의 정상에는 '시간의 조각'이 숨겨져 있어, 이를 얻으면 시간을 자유롭게 조종할 수 있습니다.
          </p>
          <p>
            <strong>시간 지분</strong>: 각자 다른 시간 지분을 가진 두 파티가 같은 공간에서도 서로
            다른 시간 속에서 존재합니다. 이는 각자의 선택이 서로 다른 시간대에서 일어남을 의미합니다.
          </p>
          <p>
            <strong>7대 종족</strong>: 에테르족, 벨로아족, 누아르족, 실프레드족, 드라카르족,
            룬마레족, 모라스족이 공존하는 세계입니다. 각 종족은 고유한 문화와 능력을 가지고 있습니다.
          </p>
          <p>
            <strong>종족 특성</strong>: 각 종족마다 고유한 능력과 약점을 가지고 있어 전략적 선택이
            중요합니다. 어떤 종족과 협력할지는 모험의 성패를 좌우할 수 있습니다.
          </p>
          <p>
            <strong>세계 균열</strong>: 시간이 불안정해지면 그림자 같은 실체 없는 존재들이 나타나며,
            이는 시간 조작의 위험성을 보여줍니다. 신중한 선택이 필요합니다.
          </p>
          <p>
            <strong>시간의 조각</strong>: 세계 곳곳에 흩어져 있는 신비로운 조각들로, 이를 모으면 
            시간을 완전히 조종할 수 있는 힘을 얻을 수 있습니다. 하지만 그 힘은 위험할 수도 있습니다.
          </p>
          <p>
            <strong>손성모</strong>: '시간의 기록자'로 알려진 전설적인 존재로, 시간의 모든 비밀을 
            알고 있습니다. 그를 만나면 특별한 히든 퍼즐을 풀 수 있습니다.
          </p>
          </div>
        </div>
        
      <div className="settings-content">
        <button className="start-button" onClick={handleStart} disabled={teams.length < 2}>
          모험 시작하기
        </button>
      </div>

      <div className="game-description">
        <h3>🎮 게임 설명</h3>
        <p>두 파티가 아를리아 세계의 시간의 계단을 오르며 모험을 진행합니다. 각자의 선택에 따라 다른 스토리가 전개되며, 시간의 조각을 찾아 힘을 얻을 수 있습니다.</p>
        <p>파티별로 선택을 완료해야 다음 단계로 진행되며, 점수를 모아 승리를 다툽니다. 선택의 결과는 즉시 점수로 반영되며, 높은 점수를 얻는 것이 목표입니다.</p>
        <p><strong>스토리 진행</strong>: 타이핑 효과로 스토리가 진행되며, 중앙 하단의 스킵 버튼으로 빠르게 진행할 수 있습니다.</p>
        <p><strong>선택지 시스템</strong>: 좌우에 나타나는 선택지에서 각 팀이 독립적으로 선택을 하며, 두 팀 모두 선택을 완료해야 다음 단계로 진행됩니다.</p>
        <p><strong>히든 요소</strong>: 손성모라는 전설적인 존재를 만나면 특별한 퍼즐을 풀 수 있으며, 이는 게임의 숨겨진 엔딩을 열어줍니다!</p>
        <p><strong>엔딩</strong>: 모든 모험이 완료되면 "결과 보기" 버튼을 눌러 최종 점수와 승패를 확인할 수 있습니다.</p>
      </div>
    </div>
  );
};

export default GameSettings;
