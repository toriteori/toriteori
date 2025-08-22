import React, { useState, useEffect } from "react";
import { useScore } from "../../contexts/ScoreContext";

interface GameSettingsProps {
  onStart: (teamAName: string, teamBName: string) => void;
}

// 스토리 데이터 정의
export const storyData = {
  start: {
    text: '🏘️ {teamAName} 파티와 {teamBName} 파티는 아를리아 세계의 시작점 \'시간의 마을\'에 도착했습니다!\n\n👴 마을 장로: "어서 오시오, 모험가들이여! 이곳은 시간의 마을이오. 보시다시피 모든 시계가 각각 다른 시간을 가리키고 있지요."\n\n👥 마을 사람들이 각자 다른 시간 속에서 살고 있는 것을 발견했습니다. 어떤 사람은 아침을, 어떤 사람은 저녁을, 또 어떤 사람은 과거나 미래를 살고 있습니다.\n\n👴 마을 장로: "시간의 계단에 대한 전설을 들려드리겠소. 계단의 정상에는 \'시간의 조각\'이 숨겨져 있어서, 그것을 얻으면 시간을 자유롭게 조종할 수 있다고 하오. 하지만 조심하시오! 시간을 바꾸면 세계에 균열이 생기고, 그림자 같은 실체 없는 존재들이 나타날 수 있소."\n\n👴 마을 장로: "7대 종족의 마을들을 방문하여 각 종족의 도움을 받으시오. 각 종족은 고유한 능력과 지혜를 가지고 있어서, 그들의 도움 없이는 시간의 계단에 도달할 수 없소."',
    choices: [
      {
        text: "🏘️ 마을을 탐험한다",
        next: "explore_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "👥 마을 사람들과 대화한다",
        next: "talk_to_villagers",
        scoreA: 3,
        scoreB: 3,
      },
      {
        text: "📚 마을 도서관을 방문한다",
        next: "visit_library",
        scoreA: 4,
        scoreB: 4,
      },
      {
        text: "🏪 마을 상점을 둘러본다",
        next: "visit_shop",
        scoreA: 2,
        scoreB: 2,
      },
    ],
  },
  // 마을 관련 새로운 노드들
  explore_village: {
    text: '🏘️ 마을을 탐험하기로 결정했습니다!\n\n⏰ 마을의 중앙에는 거대한 시계탑이 있고, 그 주변에는 시간의 꽃들이 피어있습니다.\n\n👴 마을 장로가 나타나서 말합니다: "6대 종족의 마을들로 가는 길을 알려드리겠소. 각 종족의 마을을 방문하여 그들의 도움을 받아야만 마지막에 계단의 수호자를 만날 수 있소."\n\n👴 마을 장로: "벨로아족은 전투의 정신을, 누아르족은 그림자의 비밀을, 실프레드족은 바람의 자유를, 드라카르족은 용의 힘을, 룬마레족은 물의 지혜를, 모라스족은 고대의 지식을 가지고 있소."',
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "visit_veloir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "visit_noir_village",
        scoreA: 7,
        scoreB: 7,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 4,
        scoreB: 4,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 6,
        scoreB: 6,
      },
    ],
  },
  talk_to_villagers: {
    text: "👥 마을 사람들과 대화하기로 결정했습니다! 마을 사람들은 각자 다른 시간 속에서 살고 있어서, 대화할 때마다 흥미로운 이야기들을 들을 수 있습니다. 과거를 살고 있는 노인은 옛날 이야기를, 미래를 살고 있는 젊은이는 미래의 예언을, 현재를 살고 있는 아이는 순수한 현재의 기쁨을 나누어줍니다. 그들의 이야기를 통해 시간의 본질과 시간의 계단에 대한 더 많은 정보를 얻을 수 있을 것 같습니다. 마을 사람들은 6대 종족의 마을들에 대한 정보를 제공해주고, 각 종족의 특성과 능력에 대해 이야기해줍니다. 마지막에는 계단의 수호자를 만날 수 있다고 합니다...",
    choices: [
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 9,
        scoreB: 9,
      },
      {
        text: "🌳 모라스족의 마을로 향한다",
        next: "visit_moras_village",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "visit_veloir_village",
        scoreA: 7,
        scoreB: 7,
      },
    ],
  },
  visit_library: {
    text: '📚 마을 도서관을 방문하기로 결정했습니다!\n\n📚 도서관은 고대의 지식으로 가득 차 있으며, 시간의 비밀에 대한 수많은 책들이 있습니다. 책장에는 과거, 현재, 미래의 지식이 담긴 책들이 정렬되어 있고, 각 책은 서로 다른 시간을 나타냅니다.\n\n👨‍💼 도서관 사서: "어서 오시오! 저는 시간의 기록자들의 후손이오. 시간의 계단과 시간의 조각에 대한 중요한 정보를 가지고 있소."\n\n👨‍💼 도서관 사서: "시간의 계단에 도달하려면 6대 종족의 마을들을 방문해야 하오. 각 종족은 고유한 능력과 지혜를 가지고 있어서, 그들의 도움 없이는 계단에 도달할 수 없소."',
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "visit_veloir_village",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "visit_noir_village",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 7,
        scoreB: 7,
      },
    ],
  },
  visit_shop: {
    text: '🏪 마을 상점을 둘러보기로 결정했습니다!\n\n🏪 상점에는 시간과 관련된 다양한 물건들이 판매되고 있습니다. 시간의 모래, 시간의 향초, 시간의 지도 등 신비로운 물건들이 진열되어 있습니다.\n\n👨‍💼 상점 주인: "어서 오시오! 저는 시간의 상인이오. 각 물건에 대한 이야기를 들려드리겠소."\n\n👨‍💼 상점 주인: "시간의 계단에 도달하려면 6대 종족의 마을들을 방문해야 하오. 각 종족은 고유한 능력과 지혜를 가지고 있어서, 그들의 도움 없이는 계단에 도달할 수 없소."',
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "visit_veloir_village",
        scoreA: 4,
        scoreB: 4,
      },
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "visit_noir_village",
        scoreA: 3,
        scoreB: 3,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  time_stairs: {
    text: '⏰ 시간의 계단을 오르기 시작했습니다!\n\n⏰ 계단을 한 걸음 올릴 때마다 시간이 흘러가는 것을 느낄 수 있습니다. 첫 번째 계단에서는 하루가 지나고, 두 번째 계단에서는 한 달이, 세 번째 계단에서는 수백 년이 흘러갑니다.\n\n👧 미래의 아리아가 나타나서 경고합니다: "시간을 바꾸면 세계에 균열이 생겨요. 조심하세요!"\n\n💎 계단의 중간쯤에서 유리 조각을 발견했습니다. 이 조각을 만지면 시간을 조작할 수 있을 것 같습니다...',
    choices: [
      {
        text: "🔮 유리 조각을 만진다",
        next: "touch_glass_fragment",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🚶 계단을 계속 오른다",
        next: "continue_climbing",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  explore_surroundings: {
    text: "🔍 주변을 탐험하기로 했습니다! 아를리아 세계는 정말 신비로운 곳입니다. 거울처럼 투명한 하늘에서는 시간의 파편들이 떨어지고, 땅에서는 시간의 꽃들이 피어나고 있습니다. 각 꽃은 서로 다른 시간을 나타내며, 빨간 꽃은 과거, 파란 꽃은 현재, 보라 꽃은 미래를 상징합니다. 탐험 중에 시간을 잃은 사람들을 만났습니다. 그들은 계단에서 시간을 바꾸다가 자신의 시간 지분을 잃어버린 사람들입니다. 그들은 당신들에게 도움을 요청하며, 시간의 조각을 찾으면 그들을 구할 수 있다고 말합니다. 또한 '시간의 기록자'라는 전설적인 존재에 대한 이야기도 들을 수 있습니다...",
    choices: [
      {
        text: "🤝 시간을 잃은 사람들을 도와준다",
        next: "help_lost_people",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "⏰ 시간의 계단으로 향한다",
        next: "time_stairs",
        scoreA: 4,
        scoreB: 4,
      },
    ],
  },
  forest_entrance: {
    text: "🌲 마법의 숲 안으로 들어서자 신비로운 분위기가 감돕니다. 나무들이 살아있는 것처럼 움직이고, 공중에는 반짝이는 마법의 입자들이 떠다닙니다. 숲의 공기는 마법으로 가득 차 있어서 숨을 쉴 때마다 새로운 힘이 들어오는 것 같습니다. 나무들은 마치 당신을 인사하는 것처럼 가지를 흔들고, 꽃들은 당신의 발걸음에 따라 피어납니다. 앞에는 두 갈래 길이 보입니다. 왼쪽 길에서는 따뜻한 빛이 나오며 마치 안전한 곳으로 안내하는 것 같고, 오른쪽 길에서는 차가운 바람이 불어와서 위험하지만 보물이 있을 것 같은 느낌이 듭니다. 어느 길을 선택할지 신중하게 결정해야 합니다...",
    choices: [
      {
        text: "🔥 따뜻한 빛이 나는 왼쪽 길로 간다",
        next: "left_path",
        scoreA: 2,
        scoreB: 2,
      },
      {
        text: "❄️ 차가운 바람이 부는 오른쪽 길로 간다",
        next: "right_path",
        scoreA: 2,
        scoreB: 2,
      },
    ],
  },
  village_info: {
    text: "🏘️ 마을에 도착하자 친절한 주민들이 반겨줍니다. 마을의 장로는 전설의 '시간의 보석'에 대한 이야기를 들려줍니다. '그 보석은 고대 신전의 깊은 곳에 숨겨져 있고, 오직 진정한 용사들만이 그 힘을 다룰 수 있다'고 합니다. 하지만 신전에는 강력한 수호자들이 있다고 경고합니다...",
    choices: [
      {
        text: "⚔️ 신전으로 바로 향한다",
        next: "temple_approach",
        scoreA: 4,
        scoreB: 4,
      },
      {
        text: "📚 마을의 현자에게 더 많은 정보를 구한다",
        next: "more_info",
        scoreA: 1,
        scoreB: 1,
      },
    ],
  },
  touch_glass_fragment: {
    text: "🔮 유리 조각을 만지는 순간, 시간이 멈추고 주변의 모든 것이 유리처럼 투명해집니다! 당신은 시간을 조작할 수 있는 힘을 얻었습니다. 작은 변화가 큰 파급 효과를 가져올 수 있다는 것을 깨닫게 됩니다. 유리 조각을 통해 미래의 아리아가 다시 나타나서 더 강력한 경고를 합니다. '시간을 바꾸면 세계에 균열이 생겨요. 그림자 같은 존재들이 나타날 거예요!'라고 말하며 사라집니다. 그리고 갑자기 하늘에 균열이 생기기 시작하고, 그림자 같은 실체 없는 존재들이 나타나기 시작합니다. 세계 균열의 징조가 보이기 시작했습니다...",
    choices: [
      {
        text: "⚡ 시간을 되돌린다",
        next: "reverse_time",
        scoreA: -10,
        scoreB: -10,
      },
      {
        text: "🔍 시간의 조각을 더 찾아본다",
        next: "find_time_fragment_first",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "💀 시간 조작을 계속한다",
        next: "continue_time_manipulation_dark",
        scoreA: -50,
        scoreB: -50,
      },
      {
        text: "🛡️ 안전한 방법을 찾는다",
        next: "find_safe_method",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "💎 보물을 즉시 획득한다",
        next: "immediately_acquire_fragment",
        scoreA: -15,
        scoreB: -15,
      },
    ],
  },
  continue_climbing: {
    text: "🚶 유리 조각을 건드리지 않고 계단을 계속 오릅니다. 계단을 올라갈수록 시간의 흐름이 더욱 강해지고, 두 파티의 시간 지분 차이가 더욱 명확해집니다. 계단의 중간쯤에서 시간을 잃은 사람들을 만났습니다. 그들은 과거에 시간을 바꾸다가 자신의 시간 지분을 잃어버린 사람들입니다. 그들은 당신들에게 도움을 요청하며, 시간의 조각을 찾으면 그들을 구할 수 있다고 말합니다. 또한 '시간의 기록자'라는 전설적인 존재에 대한 이야기도 들을 수 있습니다. 그는 모든 시간의 비밀을 알고 있다고 합니다...",
    choices: [
      {
        text: "🤝 시간을 잃은 사람들을 도와준다",
        next: "help_lost_people",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "🔍 시간의 기록자를 찾는다",
        next: "find_sonseongmo",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "⚡ 빠른 길로 단축한다",
        next: "shortcut_path",
        scoreA: -12,
        scoreB: -12,
      },
      {
        text: "⚡ 시간을 조작해본다",
        next: "time_manipulation_experiment",
        scoreA: -5,
        scoreB: -5,
      },
      {
        text: "🗺️ 다른 길을 찾는다",
        next: "find_alternative_path",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🎯 목표에 집중한다",
        next: "focus_on_goal",
        scoreA: -8,
        scoreB: -8,
      },
      {
        text: "💎 보물을 즉시 찾는다",
        next: "find_treasure_immediately",
        scoreA: -10,
        scoreB: -10,
      },
    ],
  },
  immediately_acquire_fragment: {
    text: "💎 보물을 즉시 획득하기로 결정했습니다! 하지만 서두른 선택으로 인해 함정에 걸리게 됩니다. 보물을 만지는 순간, 주변에 마법의 함정이 발동되어 시간이 뒤틀리기 시작합니다. 예상보다 큰 위험이 다가오고, 시간의 균형이 깨지기 시작합니다. 서두른 선택이 오히려 더 큰 문제를 야기했습니다...",
    choices: [
      {
        text: "🛑 함정에서 벗어난다",
        next: "escape_trap",
        scoreA: -5,
        scoreB: -5,
      },
      {
        text: "💪 함정을 무시하고 진행한다",
        next: "ignore_trap_continue",
        scoreA: -25,
        scoreB: -25,
      },
    ],
  },
  shortcut_path: {
    text: "⚡ 빠른 길로 단축하기로 결정했습니다! 하지만 이 단축 경로는 위험한 함정들이 가득한 길입니다. 빠르게 진행하려다가 오히려 더 많은 시간을 잃게 되고, 여러 함정에 걸리게 됩니다. 단축하려던 길이 오히려 더 복잡하고 위험한 길이 되었습니다...",
    choices: [
      {
        text: "🛑 원래 길로 돌아간다",
        next: "return_to_original_path",
        scoreA: -8,
        scoreB: -8,
      },
      {
        text: "💪 함정을 피해 계속 진행한다",
        next: "continue_through_traps",
        scoreA: -20,
        scoreB: -20,
      },
    ],
  },
  focus_on_goal: {
    text: "🎯 목표에 집중하기로 결정했습니다! 하지만 너무 목표에만 집중한 나머지 주변의 중요한 것들을 놓치게 됩니다. 시간을 잃은 사람들의 도움 요청을 무시하고, 중요한 단서들을 놓치게 됩니다. 집중이 오히려 중요한 기회를 놓치게 만들었습니다...",
    choices: [
      {
        text: "🤝 도움 요청에 응한다",
        next: "respond_to_help_request",
        scoreA: -3,
        scoreB: -3,
      },
      {
        text: "🎯 목표를 계속 추구한다",
        next: "continue_pursuing_goal",
        scoreA: -15,
        scoreB: -15,
      },
    ],
  },
  time_manipulation_experiment: {
    text: "⚡ 시간을 조작해보기로 결정했습니다! 작은 시간 조작 실험을 시작하지만, 예상보다 큰 파급 효과가 일어납니다. 주변의 시간이 불안정해지고, 작은 균열들이 생기기 시작합니다. 그림자 같은 존재들이 나타나기 시작하고, 시간의 흐름이 뒤틀리기 시작합니다. 이 실험으로 인해 시간의 균형이 깨지고, 더 큰 위험이 다가오고 있습니다. 하지만 이 경험을 통해 시간 조작의 위험성을 깨닫게 되었고, 더 신중한 선택을 할 수 있게 되었습니다...",
    choices: [
      {
        text: "🛑 실험을 중단하고 안전한 길로 돌아간다",
        next: "safe_return",
        scoreA: -3,
        scoreB: -3,
      },
      {
        text: "🔮 더 강력한 시간 조작을 시도한다",
        next: "powerful_time_manipulation",
        scoreA: -20,
        scoreB: -20,
      },
      {
        text: "💎 강력한 힘을 즉시 얻는다",
        next: "gain_power_immediately",
        scoreA: -18,
        scoreB: -18,
      },
    ],
  },
  safe_return: {
    text: "🛑 실험을 중단하고 안전한 길로 돌아갑니다. 시간 조작의 위험성을 깨닫고 더 신중한 접근을 선택했습니다. 이 경험을 통해 시간의 균형이 얼마나 중요한지 알게 되었고, 앞으로의 선택에서 더 현명한 판단을 할 수 있게 되었습니다. 안전한 길로 돌아가면서 시간을 잃은 사람들을 다시 만나게 되고, 그들은 당신들의 현명한 선택을 칭찬합니다...",
    choices: [
      {
        text: "🤝 시간을 잃은 사람들과 함께한다",
        next: "help_lost_people",
        scoreA: 4,
        scoreB: 4,
      },
      {
        text: "🔍 다른 안전한 길을 찾는다",
        next: "find_safe_path",
        scoreA: 3,
        scoreB: 3,
      },
    ],
  },
  powerful_time_manipulation: {
    text: "🔮 더 강력한 시간 조작을 시도합니다! 이 선택으로 인해 시간의 균형이 크게 깨지고, 세계에 큰 균열이 생기기 시작합니다. 그림자 같은 존재들이 대량으로 나타나고, 시간의 흐름이 완전히 뒤틀리기 시작합니다. 이 위험한 실험으로 인해 아를리아 세계가 위험에 처하게 되었지만, 동시에 시간 조작의 진정한 힘을 경험하게 되었습니다. 이제 더 강력한 힘을 얻었지만, 그 대가로 큰 위험을 감수해야 합니다...",
    choices: [
      {
        text: "💀 시간 조작을 계속한다",
        next: "continue_time_manipulation_dark",
        scoreA: -30,
        scoreB: -30,
      },
      {
        text: "🛑 위험을 깨닫고 중단한다",
        next: "emergency_stop",
        scoreA: -10,
        scoreB: -10,
      },
    ],
  },
  emergency_stop: {
    text: "🛑 위험을 깨닫고 시간 조작을 중단합니다! 하지만 이미 큰 피해가 발생했고, 시간의 균열이 생겼습니다. 이제 이 균열을 수리하고 세계를 구해야 합니다. 시간 조작의 위험성을 깨닫고, 더 신중한 접근이 필요하다는 것을 알게 되었습니다. 이 경험을 통해 시간의 균형이 얼마나 중요한지 깊이 이해하게 되었고, 앞으로의 모험에서 더 현명한 선택을 할 수 있게 되었습니다...",
    choices: [
      {
        text: "🔧 시간 균열을 수리한다",
        next: "repair_time_rift",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔍 시간의 기록자의 도움을 구한다",
        next: "find_sonseongmo",
        scoreA: 8,
        scoreB: 8,
      },
    ],
  },
  repair_time_rift: {
    text: "🔧 시간 균열을 수리하기로 결정했습니다! 이는 매우 어려운 작업이지만, 시간의 균형을 되찾기 위해 반드시 필요한 일입니다. 시간의 파편들을 모아서 균열을 메우고, 시간의 흐름을 정상으로 되돌리는 작업을 시작합니다. 이 과정에서 시간의 본질에 대해 더 깊이 이해하게 되고, 시간의 균형이 얼마나 중요한지 알게 됩니다. 수리 작업이 완료되면 시간의 흐름이 정상으로 돌아가고, 세계가 안정을 되찾게 됩니다...",
    choices: [
      {
        text: "🎯 시간의 조각을 찾아 완전히 수리한다",
        next: "find_time_fragment_first",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "🤝 다른 모험가들과 협력한다",
        next: "team_cooperation",
        scoreA: 10,
        scoreB: 10,
      },
    ],
  },
  find_safe_path: {
    text: "🔍 다른 안전한 길을 찾아보기로 결정했습니다! 시간 조작의 위험을 피하면서도 모험을 계속할 수 있는 방법을 찾아야 합니다. 주변을 탐험하면서 시간의 흐름이 안정적인 지역들을 찾아보고, 위험을 피하면서도 목표를 달성할 수 있는 길을 찾습니다. 이 과정에서 시간의 균형이 잘 맞춰진 지역들을 발견하게 되고, 안전하면서도 의미 있는 모험을 할 수 있게 됩니다...",
    choices: [
      {
        text: "🌿 자연의 시간 흐름을 따라간다",
        next: "natural_time_flow",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "🔍 고대의 안전한 길을 찾는다",
        next: "ancient_safe_path",
        scoreA: 8,
        scoreB: 8,
      },
    ],
  },
  natural_time_flow: {
    text: "🌿 자연의 시간 흐름을 따라가기로 결정했습니다! 이는 가장 안전하고 자연스러운 방법입니다. 자연의 시간 흐름을 따라가면서 시간의 본질을 이해하고, 시간의 균형이 얼마나 중요한지 깨닫게 됩니다. 자연의 시간 흐름은 매우 안정적이고 조화롭게 흘러가며, 이 과정에서 시간의 아름다움을 경험할 수 있습니다. 자연의 시간 흐름을 따라가면서 시간의 조각에 대한 단서도 발견할 수 있습니다...",
    choices: [
      {
        text: "🌸 시간의 꽃을 따라간다",
        next: "follow_time_flowers",
        scoreA: 7,
        scoreB: 7,
      },
      {
        text: "🌊 시간의 강을 따라간다",
        next: "follow_time_river",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  ancient_safe_path: {
    text: "🔍 고대의 안전한 길을 찾아보기로 결정했습니다! 고대의 현자들이 남긴 안전한 길을 찾아서 위험을 피하면서도 목표를 달성할 수 있는 방법을 찾습니다. 고대의 길은 시간의 균형을 고려해서 만들어졌으며, 안전하면서도 의미 있는 모험을 할 수 있게 해줍니다. 이 길을 따라가면서 고대의 지혜를 배우고, 시간의 비밀에 대해 더 깊이 이해할 수 있습니다...",
    choices: [
      {
        text: "📜 고대의 기록을 연구한다",
        next: "study_ancient_records",
        scoreA: 9,
        scoreB: 9,
      },
      {
        text: "🏛️ 고대의 신전으로 향한다",
        next: "ancient_temple",
        scoreA: 7,
        scoreB: 7,
      },
    ],
  },
  follow_time_flowers: {
    text: "🌸 시간의 꽃을 따라가기로 결정했습니다! 시간의 꽃들은 각각 다른 시간을 나타내며, 그 꽃들을 따라가면서 시간의 흐름을 이해할 수 있습니다. 빨간 꽃은 과거, 파란 꽃은 현재, 보라 꽃은 미래를 상징하며, 이 꽃들을 따라가면서 시간의 아름다움을 경험할 수 있습니다. 시간의 꽃들은 매우 아름답고 신비롭며, 그 향기는 시간의 본질을 담고 있습니다. 이 꽃들을 따라가면서 시간의 조각에 대한 단서도 발견할 수 있습니다...",
    choices: [
      {
        text: "🌺 과거의 꽃을 따라간다",
        next: "follow_past_flowers",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "🌻 미래의 꽃을 따라간다",
        next: "follow_future_flowers",
        scoreA: 8,
        scoreB: 8,
      },
    ],
  },
  follow_time_river: {
    text: "🌊 시간의 강을 따라가기로 결정했습니다! 시간의 강은 시간의 흐름을 상징하며, 그 강을 따라가면서 시간의 본질을 이해할 수 있습니다. 강물은 투명하면서도 황금빛으로 빛나며, 그 물을 마시면 시간의 지혜를 얻을 수 있습니다. 시간의 강은 매우 안정적이고 조화롭게 흘러가며, 이 과정에서 시간의 아름다움을 경험할 수 있습니다. 강을 따라가면서 시간의 조각에 대한 단서도 발견할 수 있습니다...",
    choices: [
      {
        text: "🏊 강을 건너 시간의 섬으로 간다",
        next: "cross_time_river",
        scoreA: 7,
        scoreB: 7,
      },
      {
        text: "🚣 강을 따라 시간의 바다로 간다",
        next: "follow_to_time_ocean",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  study_ancient_records: {
    text: "📜 고대의 기록을 연구하기로 결정했습니다! 고대의 현자들이 남긴 기록에는 시간의 비밀과 시간의 조각에 대한 중요한 정보가 담겨 있습니다. 이 기록들을 연구하면서 시간의 본질과 시간 조작의 위험성에 대해 더 깊이 이해할 수 있습니다. 고대의 기록은 매우 복잡하고 신비로우며, 그 내용을 이해하기 위해서는 많은 시간과 노력이 필요합니다. 하지만 이 기록들을 통해 시간의 조각을 찾는 방법을 알 수 있습니다...",
    choices: [
      {
        text: "🔍 시간의 조각의 위치를 찾는다",
        next: "find_time_fragment_location",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "📚 더 많은 고대 기록을 찾는다",
        next: "find_more_ancient_records",
        scoreA: 8,
        scoreB: 8,
      },
    ],
  },
  ancient_temple: {
    text: "🏛️ 고대의 신전으로 향하기로 결정했습니다! 고대의 신전은 시간의 비밀을 담고 있는 신성한 장소입니다. 신전의 벽에는 시간의 역사가 새겨져 있고, 그 안에는 시간의 조각에 대한 중요한 단서들이 숨겨져 있습니다. 신전은 매우 웅장하고 신비로우며, 그 안의 분위기는 시간의 무게를 느낄 수 있게 해줍니다. 신전을 탐험하면서 시간의 비밀을 발견할 수 있습니다...",
    choices: [
      {
        text: "🔍 신전의 비밀을 탐험한다",
        next: "explore_temple_secrets",
        scoreA: 9,
        scoreB: 9,
      },
      {
        text: "🙏 신전의 수호자와 대화한다",
        next: "talk_to_temple_guardian",
        scoreA: 7,
        scoreB: 7,
      },
    ],
  },
  explore_temple_secrets: {
    text: "🔍 신전의 비밀을 탐험하기로 결정했습니다! 신전의 깊은 곳으로 들어가면서 시간의 비밀들이 하나씩 드러나기 시작합니다. 벽에는 고대의 문자들이 새겨져 있고, 그 내용을 해석하면 시간의 조각의 위치를 알 수 있을 것 같습니다. 신전의 중앙에는 거대한 시간의 시계가 있고, 그 주변에는 시간의 파편들이 떠다니고 있습니다. 이곳에서 시간의 본질에 대해 더 깊이 이해할 수 있을 것 같습니다...",
    choices: [
      {
        text: "📜 고대 문자를 해석한다",
        next: "decipher_ancient_text",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "⏰ 시간의 시계를 조사한다",
        next: "investigate_time_clock",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🔮 신전의 보물을 찾는다",
        next: "find_temple_treasure",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🚪 비밀 통로를 찾는다",
        next: "find_secret_passage",
        scoreA: 8,
        scoreB: 8,
      },
    ],
  },
  decipher_ancient_text: {
    text: "📜 고대 문자를 해석하기로 결정했습니다! 벽에 새겨진 고대 문자들은 시간의 비밀을 담고 있는 중요한 정보들입니다. 문자를 하나씩 해석해나가면서 시간의 조각이 어디에 숨겨져 있는지, 그리고 어떻게 그것을 얻을 수 있는지에 대한 단서들을 발견합니다. 고대의 현자들이 남긴 이 문자들은 시간의 균형을 지키는 방법과 시간 조작의 위험성에 대한 경고도 담고 있습니다...",
    choices: [
      {
        text: "🗺️ 시간의 조각의 지도를 찾는다",
        next: "find_time_fragment_map",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "📚 더 많은 고대 기록을 찾는다",
        next: "find_more_ancient_records",
        scoreA: 13,
        scoreB: 13,
      },
    ],
  },
  investigate_time_clock: {
    text: "⏰ 시간의 시계를 조사하기로 결정했습니다! 거대한 시간의 시계는 아를리아 세계의 시간 흐름을 조절하는 핵심 장치입니다. 시계의 바늘들이 움직일 때마다 시간의 흐름이 변화하고, 그 주변의 시간 파편들이 새로운 패턴을 만들어냅니다. 이 시계를 통해 시간의 본질을 이해하고, 시간의 조각을 찾는 방법을 알 수 있을 것 같습니다...",
    choices: [
      {
        text: "🔧 시계의 메커니즘을 연구한다",
        next: "study_clock_mechanism",
        scoreA: 14,
        scoreB: 14,
      },
      {
        text: "⏱️ 시간의 흐름을 관찰한다",
        next: "observe_time_flow",
        scoreA: 11,
        scoreB: 11,
      },
    ],
  },
  find_time_fragment_map: {
    text: "🗺️ 시간의 조각의 지도를 찾았습니다! 고대 문자를 해석한 결과, 시간의 조각이 아를리아 세계의 여러 곳에 분산되어 있다는 것을 알게 되었습니다. 이 지도에는 각 조각의 정확한 위치와 그것을 얻기 위해 필요한 조건들이 상세히 기록되어 있습니다. 지도에 따르면, 모든 조각을 모으면 시간을 완전히 조작할 수 있는 힘을 얻을 수 있다고 합니다...",
    choices: [
      {
        text: "🎯 첫 번째 조각을 찾으러 간다",
        next: "search_first_fragment",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "🔍 지도의 다른 비밀을 찾는다",
        next: "find_map_secrets",
        scoreA: 16,
        scoreB: 16,
      },
    ],
  },
  study_clock_mechanism: {
    text: "🔧 시계의 메커니즘을 연구하기로 결정했습니다! 시간의 시계는 매우 복잡하고 정교한 구조로 되어 있습니다. 각 기어와 바퀴는 시간의 다른 측면을 나타내며, 그들이 함께 움직일 때 완벽한 시간의 흐름을 만들어냅니다. 이 메커니즘을 이해하면 시간의 본질과 시간 조작의 원리를 깊이 알 수 있을 것 같습니다...",
    choices: [
      {
        text: "⚙️ 시계의 핵심 부품을 조사한다",
        next: "examine_core_components",
        scoreA: 17,
        scoreB: 17,
      },
      {
        text: "🔬 시간의 물리학을 연구한다",
        next: "research_time_physics",
        scoreA: 15,
        scoreB: 15,
      },
    ],
  },
  search_first_fragment: {
    text: "🎯 첫 번째 시간의 조각을 찾으러 떠납니다! 지도에 따르면 첫 번째 조각은 '시간의 숲' 깊은 곳에 숨겨져 있다고 합니다. 이 숲은 시간의 흐름이 특별한 곳으로, 과거와 미래가 공존하는 신비로운 장소입니다. 숲에 들어가면서 시간의 분위기가 완전히 달라지는 것을 느낄 수 있습니다. 나무들은 각각 다른 시간을 나타내며, 그 사이를 걸어가면서 시간을 여행하는 것 같은 느낌을 받습니다...",
    choices: [
      {
        text: "🌲 시간의 숲을 탐험한다",
        next: "explore_time_forest",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "🗺️ 지도의 다른 경로를 따른다",
        next: "follow_alternative_path",
        scoreA: 18,
        scoreB: 18,
      },
    ],
  },
  explore_time_forest: {
    text: "🌲 시간의 숲을 탐험하기로 결정했습니다! 이 숲은 정말 신비로운 곳입니다. 각 나무는 서로 다른 시간을 나타내며, 빨간 나무는 과거, 파란 나무는 현재, 보라 나무는 미래를 상징합니다. 숲의 공기는 시간의 에너지로 가득 차 있어서 숨을 쉴 때마다 새로운 시간을 경험하는 것 같습니다. 숲의 깊은 곳에서는 시간의 조각이 빛나고 있는 것을 볼 수 있습니다...",
    choices: [
      {
        text: "🌳 시간의 나무들과 소통한다",
        next: "communicate_with_time_trees",
        scoreA: 22,
        scoreB: 22,
      },
      {
        text: "💎 시간의 조각을 직접 찾는다",
        next: "directly_search_fragment",
        scoreA: 25,
        scoreB: 25,
      },
      {
        text: "🌺 시간의 꽃을 수집한다",
        next: "collect_time_flowers",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "🦋 시간의 나비를 따라간다",
        next: "follow_time_butterfly",
        scoreA: 20,
        scoreB: 20,
      },
    ],
  },
  communicate_with_time_trees: {
    text: "🌳 시간의 나무들과 소통하기로 결정했습니다! 나무들은 살아있는 것처럼 움직이고, 그들의 가지를 통해 시간의 지혜를 전달해줍니다. 과거의 나무는 옛날 이야기들을 들려주고, 현재의 나무는 지금 일어나고 있는 일들을 알려주며, 미래의 나무는 앞으로 일어날 수 있는 가능성들을 보여줍니다. 이 소통을 통해 시간의 조각에 대한 중요한 정보를 얻을 수 있습니다...",
    choices: [
      {
        text: "📖 시간의 지혜를 배운다",
        next: "learn_time_wisdom",
        scoreA: 24,
        scoreB: 24,
      },
      {
        text: "🔮 미래의 비밀을 엿본다",
        next: "glimpse_future_secrets",
        scoreA: 26,
        scoreB: 26,
      },
    ],
  },
  directly_search_fragment: {
    text: "💎 시간의 조각을 직접 찾기로 결정했습니다! 숲의 깊은 곳으로 들어가면서 시간의 조각이 빛나는 것을 더욱 명확하게 볼 수 있습니다. 조각은 매우 아름답고 신비롭게 빛나며, 그 주변에는 시간의 에너지가 집중되어 있습니다. 하지만 조각에 가까이 갈수록 시간의 흐름이 불안정해지고, 주변의 공간이 뒤틀리기 시작합니다. 이는 시간의 조각이 얼마나 강력한 힘을 가지고 있는지를 보여줍니다...",
    choices: [
      {
        text: "⚡ 조각을 즉시 획득한다",
        next: "immediately_acquire_fragment",
        scoreA: 30,
        scoreB: 30,
      },
      {
        text: "🛡️ 안전한 방법을 찾는다",
        next: "find_safe_method",
        scoreA: 28,
        scoreB: 28,
      },
    ],
  },
  learn_time_wisdom: {
    text: "📖 시간의 지혜를 배우기로 결정했습니다! 시간의 나무들과의 소통을 통해 시간의 본질에 대해 깊이 이해하게 됩니다. 시간은 단순히 흘러가는 것이 아니라, 모든 존재와 연결되어 있는 생명력 있는 에너지라는 것을 알게 됩니다. 이 지혜를 통해 시간의 조각을 안전하게 다룰 수 있는 방법을 배우고, 시간 조작의 위험성에 대해서도 깊이 이해하게 됩니다...",
    choices: [
      {
        text: "🧘 시간의 균형을 체험한다",
        next: "experience_time_balance",
        scoreA: 27,
        scoreB: 27,
      },
      {
        text: "🎯 지혜를 바탕으로 조각을 찾는다",
        next: "search_with_wisdom",
        scoreA: 29,
        scoreB: 29,
      },
    ],
  },
  glimpse_future_secrets: {
    text: "🔮 미래의 비밀을 엿보기로 결정했습니다! 미래의 나무들과 소통하면서 앞으로 일어날 수 있는 다양한 가능성들을 보게 됩니다. 어떤 미래에서는 시간의 조각을 성공적으로 모아서 세계를 구하는 모습이 보이고, 어떤 미래에서는 시간 조작의 실패로 세계가 파괴되는 모습이 보입니다. 이 미래의 비전들을 통해 현재의 선택이 얼마나 중요한지 깨닫게 됩니다...",
    choices: [
      {
        text: "🎭 미래의 가능성들을 탐험한다",
        next: "explore_future_possibilities",
        scoreA: 31,
        scoreB: 31,
      },
      {
        text: "⚖️ 현재의 선택을 신중히 한다",
        next: "make_careful_choice",
        scoreA: 33,
        scoreB: 33,
      },
    ],
  },
  experience_time_balance: {
    text: "🧘 시간의 균형을 체험하기로 결정했습니다! 시간의 지혜를 바탕으로 시간의 균형이 무엇인지 직접 체험하게 됩니다. 시간의 흐름이 완벽하게 조화를 이루는 순간을 경험하면서, 모든 것이 적절한 시간에 적절한 장소에서 일어나는 것을 느낄 수 있습니다. 이 체험을 통해 시간의 조각을 다룰 때 필요한 균형감각을 기를 수 있습니다...",
    choices: [
      {
        text: "🎯 균형을 유지하며 조각을 찾는다",
        next: "search_with_balance",
        scoreA: 32,
        scoreB: 32,
      },
      {
        text: "🌊 시간의 흐름에 몸을 맡긴다",
        next: "surrender_to_time_flow",
        scoreA: 30,
        scoreB: 30,
      },
    ],
  },
  explore_future_possibilities: {
    text: "🎭 미래의 가능성들을 탐험하기로 결정했습니다! 미래의 나무들과 더 깊이 소통하면서 다양한 미래 시나리오들을 자세히 살펴봅니다. 각 미래는 현재의 선택에 따라 달라지는 것을 확인할 수 있고, 어떤 선택이 가장 좋은 결과를 가져올 수 있는지 분석할 수 있습니다. 이 탐험을 통해 시간의 조각을 찾는 최적의 방법을 발견할 수 있습니다...",
    choices: [
      {
        text: "🎯 최적의 경로를 선택한다",
        next: "choose_optimal_path",
        scoreA: 35,
        scoreB: 35,
      },
      {
        text: "🔮 모든 가능성을 고려한다",
        next: "consider_all_possibilities",
        scoreA: 37,
        scoreB: 37,
      },
    ],
  },
  search_with_balance: {
    text: "🎯 균형을 유지하며 시간의 조각을 찾기로 결정했습니다! 시간의 균형을 체험한 경험을 바탕으로, 안전하고 조화로운 방법으로 시간의 조각에 접근합니다. 조각의 강력한 에너지에 압도되지 않고, 시간의 흐름과 조화를 이루면서 조각을 획득할 수 있습니다. 이 방법은 위험을 최소화하면서도 조각의 힘을 효과적으로 활용할 수 있게 해줍니다...",
    choices: [
      {
        text: "💎 조각을 안전하게 획득한다",
        next: "safely_acquire_fragment",
        scoreA: 40,
        scoreB: 40,
      },
      {
        text: "🔗 조각과 연결을 형성한다",
        next: "form_connection_with_fragment",
        scoreA: 38,
        scoreB: 38,
      },
    ],
  },
  choose_optimal_path: {
    text: "🎯 최적의 경로를 선택하기로 결정했습니다! 미래의 가능성들을 탐험한 결과를 바탕으로, 가장 성공적인 결과를 가져올 수 있는 경로를 선택합니다. 이 경로는 위험을 최소화하면서도 시간의 조각을 효과적으로 획득할 수 있는 방법을 제시합니다. 미래의 지혜를 활용한 이 선택은 현재의 모험을 성공으로 이끌 수 있는 열쇠가 될 것입니다...",
    choices: [
      {
        text: "🚀 최적 경로를 따라간다",
        next: "follow_optimal_path",
        scoreA: 42,
        scoreB: 42,
      },
      {
        text: "🎭 미래의 지혜를 활용한다",
        next: "utilize_future_wisdom",
        scoreA: 45,
        scoreB: 45,
      },
    ],
  },
  safely_acquire_fragment: {
    text: "💎 시간의 조각을 안전하게 획득했습니다! 균형을 유지하면서 접근한 결과, 조각의 강력한 힘에 압도되지 않고 성공적으로 조각을 얻을 수 있었습니다. 조각은 매우 아름답고 신비롭게 빛나며, 그 안에는 시간의 무한한 가능성이 담겨 있습니다. 이제 이 조각을 통해 시간을 조작할 수 있는 힘을 얻었지만, 그 힘을 현명하게 사용해야 한다는 것을 깨닫게 됩니다...",
    choices: [
      {
        text: "🔮 조각의 힘을 연구한다",
        next: "research_fragment_power",
        scoreA: 50,
        scoreB: 50,
      },
      {
        text: "🗺️ 다음 조각을 찾는다",
        next: "search_next_fragment",
        scoreA: 48,
        scoreB: 48,
      },
    ],
  },
  follow_optimal_path: {
    text: "🚀 최적 경로를 따라가기로 결정했습니다! 미래의 지혜를 바탕으로 선택한 이 경로는 시간의 조각을 가장 효율적으로 획득할 수 있는 방법입니다. 경로를 따라가면서 예상했던 대로 모든 것이 순조롭게 진행되는 것을 확인할 수 있습니다. 이 경로는 위험을 최소화하면서도 최대한의 성과를 얻을 수 있도록 설계되어 있습니다...",
    choices: [
      {
        text: "🎯 목표 지점에 도달한다",
        next: "reach_destination",
        scoreA: 55,
        scoreB: 55,
      },
      {
        text: "🔍 경로의 비밀을 발견한다",
        next: "discover_path_secrets",
        scoreA: 52,
        scoreB: 52,
      },
    ],
  },
  research_fragment_power: {
    text: "🔮 시간의 조각의 힘을 연구하기로 결정했습니다! 획득한 조각을 자세히 관찰하면서 그 안에 담긴 시간의 비밀들을 하나씩 발견합니다. 조각은 단순한 보석이 아니라, 시간의 본질을 담고 있는 신비로운 물체입니다. 연구를 통해 조각을 통해 할 수 있는 일들과 그 한계, 그리고 사용할 때 주의해야 할 점들을 자세히 알 수 있습니다...",
    choices: [
      {
        text: "⚡ 조각의 힘을 실험한다",
        next: "experiment_with_fragment",
        scoreA: 58,
        scoreB: 58,
      },
      {
        text: "📚 조각의 역사를 연구한다",
        next: "study_fragment_history",
        scoreA: 56,
        scoreB: 56,
      },
    ],
  },
  reach_destination: {
    text: "🎯 목표 지점에 도달했습니다! 최적 경로를 따라가면서 예상했던 대로 시간의 조각이 있는 장소에 성공적으로 도착했습니다. 이곳은 시간의 에너지가 가장 집중된 곳으로, 조각이 매우 강력하게 빛나고 있습니다. 도중에 예상했던 모든 장애물들을 성공적으로 극복했고, 이제 조각을 획득할 준비가 완료되었습니다...",
    choices: [
      {
        text: "💎 조각을 획득한다",
        next: "acquire_fragment",
        scoreA: 60,
        scoreB: 60,
      },
      {
        text: "🔍 주변을 더 탐험한다",
        next: "explore_surroundings_more",
        scoreA: 57,
        scoreB: 57,
      },
    ],
  },
  experiment_with_fragment: {
    text: "⚡ 시간의 조각의 힘을 실험하기로 결정했습니다! 조각을 통해 할 수 있는 다양한 시간 조작들을 하나씩 시도해봅니다. 작은 시간 되돌리기부터 시작해서 점차 더 복잡한 시간 조작들을 실험해보면서 조각의 한계와 가능성을 탐구합니다. 이 실험을 통해 시간의 본질에 대해 더 깊이 이해할 수 있습니다...",
    choices: [
      {
        text: "🔄 시간 되돌리기를 시도한다",
        next: "attempt_time_reversal",
        scoreA: 65,
        scoreB: 65,
      },
      {
        text: "⏭️ 시간 가속을 시도한다",
        next: "attempt_time_acceleration",
        scoreA: 63,
        scoreB: 63,
      },
    ],
  },
  acquire_fragment: {
    text: "💎 시간의 조각을 성공적으로 획득했습니다! 최적 경로를 통해 도달한 목표 지점에서 조각을 안전하게 얻을 수 있었습니다. 조각은 매우 아름답고 강력하게 빛나며, 그 안에는 시간의 무한한 가능성이 담겨 있습니다. 이제 이 조각을 통해 시간을 조작할 수 있는 힘을 얻었고, 다음 단계로 나아갈 준비가 되었습니다...",
    choices: [
      {
        text: "🔮 조각의 힘을 연구한다",
        next: "research_fragment_power",
        scoreA: 70,
        scoreB: 70,
      },
      {
        text: "🗺️ 다음 조각을 찾는다",
        next: "search_next_fragment",
        scoreA: 68,
        scoreB: 68,
      },
    ],
  },
  attempt_time_reversal: {
    text: "🔄 시간 되돌리기를 시도하기로 결정했습니다! 시간의 조각의 힘을 사용해서 작은 범위의 시간을 되돌려봅니다. 처음에는 매우 조심스럽게 작은 변화부터 시작하지만, 점차 더 큰 변화를 시도해보면서 시간 되돌리기의 한계와 가능성을 탐구합니다. 이 실험을 통해 시간 조작의 위험성과 그 힘에 대해 더 깊이 이해할 수 있습니다...",
    choices: [
      {
        text: "🛑 실험을 중단한다",
        next: "stop_experiment",
        scoreA: 72,
        scoreB: 72,
      },
      {
        text: "⚡ 더 강력한 되돌리기를 시도한다",
        next: "attempt_powerful_reversal",
        scoreA: 75,
        scoreB: 75,
      },
    ],
  },
  search_next_fragment: {
    text: "🗺️ 다음 시간의 조각을 찾기로 결정했습니다! 첫 번째 조각을 성공적으로 획득했으니, 이제 지도에 표시된 다른 조각들을 찾아야 합니다. 지도에 따르면 다음 조각은 '시간의 바다' 깊은 곳에 숨겨져 있다고 합니다. 이 바다는 시간의 흐름이 물처럼 흘러가는 신비로운 장소로, 그 안에는 시간의 비밀들이 숨겨져 있습니다...",
    choices: [
      {
        text: "🌊 시간의 바다로 향한다",
        next: "journey_to_time_ocean",
        scoreA: 80,
        scoreB: 80,
      },
      {
        text: "🗺️ 지도의 다른 경로를 확인한다",
        next: "check_alternative_paths",
        scoreA: 78,
        scoreB: 78,
      },
    ],
  },
  journey_to_time_ocean: {
    text: "🌊 시간의 바다로 향하기로 결정했습니다! 시간의 바다는 아를리아 세계에서 가장 신비로운 장소 중 하나입니다. 바다의 물은 시간의 흐름을 상징하며, 그 파도는 과거, 현재, 미래의 시간들이 섞여서 만들어내는 것입니다. 바다의 깊은 곳에는 시간의 조각이 빛나고 있으며, 그 주변에는 시간의 생물들이 살고 있다고 합니다...",
    choices: [
      {
        text: "🏊 바다를 건너 조각을 찾는다",
        next: "swim_to_fragment",
        scoreA: 85,
        scoreB: 85,
      },
      {
        text: "🚣 시간의 배를 타고 간다",
        next: "sail_time_ship",
        scoreA: 82,
        scoreB: 82,
      },
    ],
  },
  swim_to_fragment: {
    text: "🏊 바다를 건너 조각을 찾기로 결정했습니다! 시간의 바다에 뛰어들면서 시간의 흐름을 직접 체험하게 됩니다. 바다의 물은 시간의 에너지로 가득 차 있어서, 그 안에서 수영할 때마다 다른 시간을 경험하는 것 같습니다. 바다의 깊은 곳으로 내려갈수록 시간의 조각이 더욱 밝게 빛나는 것을 볼 수 있습니다...",
    choices: [
      {
        text: "🐠 시간의 생물들과 소통한다",
        next: "communicate_with_time_creatures",
        scoreA: 88,
        scoreB: 88,
      },
      {
        text: "💎 조각을 직접 획득한다",
        next: "directly_acquire_ocean_fragment",
        scoreA: 90,
        scoreB: 90,
      },
    ],
  },
  communicate_with_time_creatures: {
    text: "🐠 시간의 생물들과 소통하기로 결정했습니다! 바다의 깊은 곳에서 시간의 생물들을 만납니다. 이 생물들은 시간의 흐름 속에서 살아가는 특별한 존재들로, 시간의 비밀들을 알고 있습니다. 그들과 소통하면서 시간의 조각에 대한 중요한 정보를 얻을 수 있고, 바다의 시간에 대한 깊은 이해를 할 수 있습니다...",
    choices: [
      {
        text: "📚 시간의 지식을 배운다",
        next: "learn_time_knowledge",
        scoreA: 92,
        scoreB: 92,
      },
      {
        text: "🔮 시간의 비밀을 엿본다",
        next: "glimpse_time_secrets",
        scoreA: 95,
        scoreB: 95,
      },
    ],
  },
  learn_time_knowledge: {
    text: "📚 시간의 지식을 배우기로 결정했습니다! 시간의 생물들과의 소통을 통해 시간에 대한 깊은 지식을 얻습니다. 시간이 어떻게 흘러가는지, 시간의 본질이 무엇인지, 그리고 시간을 조작할 때 어떤 결과가 일어나는지에 대한 모든 것을 배울 수 있습니다. 이 지식은 시간의 조각을 다룰 때 매우 중요한 도움이 될 것입니다...",
    choices: [
      {
        text: "🎯 지식을 바탕으로 조각을 찾는다",
        next: "search_with_knowledge",
        scoreA: 98,
        scoreB: 98,
      },
      {
        text: "🧘 시간의 지혜를 체득한다",
        next: "master_time_wisdom",
        scoreA: 100,
        scoreB: 100,
      },
    ],
  },
  search_with_knowledge: {
    text: "🎯 지식을 바탕으로 시간의 조각을 찾기로 결정했습니다! 시간의 생물들과 소통하며 얻은 깊은 지식을 활용해서 조각을 찾습니다. 이 지식을 바탕으로 조각이 있는 정확한 위치를 파악할 수 있고, 조각을 안전하게 획득할 수 있는 방법을 알 수 있습니다. 지식의 힘을 활용한 이 접근은 성공의 확률을 크게 높여줍니다...",
    choices: [
      {
        text: "💎 조각을 지혜롭게 획득한다",
        next: "wisely_acquire_fragment",
        scoreA: 105,
        scoreB: 105,
      },
      {
        text: "🔗 조각과 깊은 연결을 형성한다",
        next: "form_deep_connection",
        scoreA: 110,
        scoreB: 110,
      },
    ],
  },
  wisely_acquire_fragment: {
    text: "💎 시간의 조각을 지혜롭게 획득했습니다! 시간의 생물들과 소통하며 얻은 지식을 바탕으로, 조각을 안전하고 효과적으로 얻을 수 있었습니다. 조각은 매우 아름답고 강력하게 빛나며, 그 안에는 시간의 무한한 가능성이 담겨 있습니다. 이제 두 개의 시간의 조각을 가지고 있어서, 더욱 강력한 시간 조작이 가능해졌습니다...",
    choices: [
      {
        text: "🔮 조각들의 힘을 결합한다",
        next: "combine_fragment_powers",
        scoreA: 120,
        scoreB: 120,
      },
      {
        text: "🗺️ 마지막 조각을 찾는다",
        next: "search_final_fragment",
        scoreA: 115,
        scoreB: 115,
      },
    ],
  },
  combine_fragment_powers: {
    text: "🔮 시간의 조각들의 힘을 결합하기로 결정했습니다! 두 개의 조각을 함께 사용하면서 그들의 힘이 어떻게 상호작용하는지 실험해봅니다. 조각들을 결합하면 개별 조각보다 훨씬 강력한 시간 조작이 가능해지고, 더 복잡하고 정교한 시간 변화를 만들어낼 수 있습니다. 이 실험을 통해 시간의 본질에 대해 더 깊이 이해할 수 있습니다...",
    choices: [
      {
        text: "⚡ 강력한 시간 조작을 시도한다",
        next: "attempt_powerful_manipulation",
        scoreA: 130,
        scoreB: 130,
      },
      {
        text: "🛡️ 안전한 실험을 한다",
        next: "conduct_safe_experiment",
        scoreA: 125,
        scoreB: 125,
      },
    ],
  },
  search_final_fragment: {
    text: "🗺️ 마지막 시간의 조각을 찾기로 결정했습니다! 지도에 따르면 마지막 조각은 '시간의 산' 정상에 숨겨져 있다고 합니다. 이 산은 시간의 흐름이 가장 높은 곳으로, 그 정상에서는 모든 시간을 한눈에 볼 수 있다고 합니다. 마지막 조각을 찾으면 모든 시간의 조각을 모을 수 있고, 완전한 시간 조작의 힘을 얻을 수 있습니다...",
    choices: [
      {
        text: "⛰️ 시간의 산을 오른다",
        next: "climb_time_mountain",
        scoreA: 140,
        scoreB: 140,
      },
      {
        text: "🦅 시간의 새를 타고 간다",
        next: "ride_time_bird",
        scoreA: 135,
        scoreB: 135,
      },
    ],
  },
  climb_time_mountain: {
    text: "⛰️ 시간의 산을 오르기로 결정했습니다! 시간의 산은 아를리아 세계에서 가장 높고 신비로운 곳입니다. 산을 오를수록 시간의 흐름이 더욱 강해지고, 그 높이에서 아를리아 세계의 모든 시간을 한눈에 볼 수 있습니다. 산의 정상에는 마지막 시간의 조각이 빛나고 있으며, 그 주변에는 시간의 신비들이 가득합니다...",
    choices: [
      {
        text: "🏔️ 정상에 도달한다",
        next: "reach_mountain_peak",
        scoreA: 150,
        scoreB: 150,
      },
      {
        text: "🔍 산의 비밀을 탐험한다",
        next: "explore_mountain_secrets",
        scoreA: 145,
        scoreB: 145,
      },
    ],
  },
  reach_mountain_peak: {
    text: "🏔️ 시간의 산의 정상에 도달했습니다! 이곳에서 아를리아 세계의 모든 시간을 한눈에 볼 수 있습니다. 과거, 현재, 미래가 모두 이곳에서 만나고, 시간의 흐름이 가장 강력하게 느껴집니다. 정상에는 마지막 시간의 조각이 매우 밝게 빛나고 있으며, 그 주변에는 시간의 신비들이 가득합니다. 이제 모든 시간의 조각을 모을 수 있는 위치에 도달했습니다...",
    choices: [
      {
        text: "💎 마지막 조각을 획득한다",
        next: "acquire_final_fragment",
        scoreA: 200,
        scoreB: 200,
      },
      {
        text: "🔮 시간의 신비를 체험한다",
        next: "experience_time_mystery",
        scoreA: 180,
        scoreB: 180,
      },
    ],
  },
  acquire_final_fragment: {
    text: "💎 마지막 시간의 조각을 성공적으로 획득했습니다! 이제 모든 시간의 조각을 모았고, 완전한 시간 조작의 힘을 얻었습니다. 조각들이 하나로 합쳐지면서 놀라운 변화가 일어나기 시작합니다. 시간의 흐름이 완전히 새로운 방식으로 변화하고, 아를리아 세계에 새로운 가능성들이 열리기 시작합니다. 이제 시간의 주인이 되어 세계의 운명을 결정할 수 있는 위치에 도달했습니다...",
    choices: [
      {
        text: "🔮 완전한 시간 조작을 시도한다",
        next: "attempt_complete_manipulation",
        scoreA: 500,
        scoreB: 500,
      },
      {
        text: "🛡️ 신중하게 힘을 사용한다",
        next: "use_power_carefully",
        scoreA: 400,
        scoreB: 400,
      },
    ],
  },
  attempt_complete_manipulation: {
    text: "🔮 완전한 시간 조작을 시도하기로 결정했습니다! 모든 시간의 조각을 모아서 얻은 완전한 힘을 사용해서 시간을 자유롭게 조작해봅니다. 이 힘은 상상을 초월하는 강력함을 가지고 있어서, 시간의 흐름을 완전히 바꿀 수 있습니다. 하지만 이렇게 강력한 힘을 사용하는 것은 위험할 수도 있고, 예상치 못한 결과를 가져올 수도 있습니다...",
    choices: [
      {
        text: "💀 위험한 실험을 계속한다",
        next: "continue_dangerous_experiment",
        scoreA: -200,
        scoreB: -200,
      },
      {
        text: "🛑 실험을 중단한다",
        next: "stop_dangerous_experiment",
        scoreA: 300,
        scoreB: 300,
      },
    ],
  },
  use_power_carefully: {
    text: "🛡️ 신중하게 힘을 사용하기로 결정했습니다! 완전한 시간 조작의 힘을 얻었지만, 그 힘을 신중하고 책임감 있게 사용하기로 결정했습니다. 이 힘은 세계의 운명을 바꿀 수 있는 강력한 것이므로, 함부로 사용하면 안 된다는 것을 깨닫습니다. 신중한 접근을 통해 시간의 균형을 유지하면서 필요한 변화만을 만들어냅니다...",
    choices: [
      {
        text: "🌍 세계를 구한다",
        next: "save_world",
        scoreA: 800,
        scoreB: 800,
      },
      {
        text: "🔮 시간의 균형을 회복한다",
        next: "restore_time_balance",
        scoreA: 600,
        scoreB: 600,
      },
    ],
  },
  continue_dangerous_experiment: {
    text: "💀 위험한 실험을 계속하기로 결정했습니다! 완전한 시간 조작의 힘을 무모하게 사용하면서 예상치 못한 결과가 일어나기 시작합니다. 시간의 흐름이 완전히 뒤틀리기 시작하고, 세계에 큰 혼란이 일어납니다. 이 실험은 매우 위험하고, 그 결과는 예측할 수 없습니다. 하지만 실험을 중단하지 않고 계속 진행합니다...",
    choices: [
      {
        text: "💥 실험을 극한까지 밀어붙인다",
        next: "push_experiment_to_limit",
        scoreA: -500,
        scoreB: -500,
      },
      {
        text: "🛑 마지막 순간에 중단한다",
        next: "stop_at_last_moment",
        scoreA: -100,
        scoreB: -100,
      },
    ],
  },
  push_experiment_to_limit: {
    text: "💥 실험을 극한까지 밀어붙이기로 결정했습니다! 완전한 시간 조작의 힘을 최대한으로 사용하면서 시간의 균형이 완전히 깨지기 시작합니다. 세계에 큰 혼란이 일어나고, 시간의 흐름이 완전히 무너집니다. 이 실험은 세계를 파괴할 수도 있는 매우 위험한 행동이지만, 실험을 계속 진행합니다...",
    choices: [
      {
        text: "💀 세계를 파괴한다",
        next: "continue_time_manipulation_dark",
        scoreA: -1000,
        scoreB: -1000,
      },
      {
        text: "🛑 절망적으로 중단한다",
        next: "desperately_stop",
        scoreA: -300,
        scoreB: -300,
      },
    ],
  },

  restore_time_balance: {
    text: "🔮 시간의 균형을 회복하기로 결정했습니다! 완전한 시간 조작의 힘을 사용해서 시간의 흐름을 정상으로 되돌리고, 시간의 균형을 완벽하게 회복합니다. 이 과정에서 시간의 본질에 대해 더 깊이 이해하게 되고, 시간의 중요성을 깨닫게 됩니다. 시간의 균형이 회복되면서 아를리아 세계는 새로운 평화를 찾게 됩니다...",
    choices: [
      {
        text: "🌍 세계를 더 탐험한다",
        next: "explore_world_more",
        scoreA: 40,
        scoreB: 40,
      },
      {
        text: "📚 시간의 지식을 전수한다",
        next: "teach_time_knowledge",
        scoreA: 60,
        scoreB: 60,
      },
    ],
  },
  desperately_stop: {
    text: "🛑 절망적으로 실험을 중단합니다! 위험한 실험의 결과로 인해 이미 큰 피해가 발생했지만, 마지막 순간에 실험을 중단해서 더 큰 재앙을 막을 수 있었습니다. 하지만 이미 발생한 피해는 되돌릴 수 없고, 세계는 큰 상처를 입었습니다. 이 경험을 통해 시간 조작의 위험성을 깊이 깨닫게 됩니다...",
    choices: [],
  },
  // 추가 확장 노드들
  find_more_ancient_records: {
    text: "📚 더 많은 고대 기록을 찾기로 결정했습니다! 신전의 깊은 곳에서 고대의 도서관을 발견합니다. 이곳에는 시간의 비밀에 대한 수많은 기록들이 보관되어 있고, 각각의 기록은 시간의 조각에 대한 중요한 단서들을 담고 있습니다. 도서관의 분위기는 매우 신성하고 신비로우며, 그 안의 지식들은 시간의 본질을 이해하는 데 매우 중요한 역할을 할 것입니다...",
    choices: [
      {
        text: "📖 시간의 역사를 연구한다",
        next: "study_time_history",
        scoreA: 16,
        scoreB: 16,
      },
      {
        text: "🔍 특별한 기록을 찾는다",
        next: "find_special_records",
        scoreA: 18,
        scoreB: 18,
      },
    ],
  },
  observe_time_flow: {
    text: "⏱️ 시간의 흐름을 관찰하기로 결정했습니다! 시간의 시계 주변에서 시간이 어떻게 흘러가는지 자세히 관찰합니다. 시간의 흐름은 마치 강물처럼 끊임없이 흘러가지만, 그 속도와 방향은 시계의 바늘에 따라 변화합니다. 이 관찰을 통해 시간의 본질과 시간 조작의 원리를 깊이 이해할 수 있습니다. 시간의 흐름을 이해하는 것은 시간의 조각을 다루는 데 매우 중요한 기초가 됩니다...",
    choices: [
      {
        text: "🌊 시간의 흐름을 따라간다",
        next: "follow_time_current",
        scoreA: 19,
        scoreB: 19,
      },
      {
        text: "🔬 시간의 패턴을 분석한다",
        next: "analyze_time_patterns",
        scoreA: 21,
        scoreB: 21,
      },
    ],
  },
  find_map_secrets: {
    text: "🔍 지도의 다른 비밀을 찾기로 결정했습니다! 시간의 조각 지도를 더 자세히 살펴보면서 숨겨진 비밀들을 발견합니다. 지도에는 단순한 위치 정보뿐만 아니라, 각 조각의 특성과 그것을 획득하기 위한 특별한 조건들도 기록되어 있습니다. 또한 지도에는 시간의 조각들이 서로 연결되어 있다는 중요한 정보도 담겨 있습니다...",
    choices: [
      {
        text: "🔗 조각들의 연결을 연구한다",
        next: "study_fragment_connections",
        scoreA: 22,
        scoreB: 22,
      },
      {
        text: "🎯 특별한 조건을 확인한다",
        next: "check_special_conditions",
        scoreA: 24,
        scoreB: 24,
      },
    ],
  },
  examine_core_components: {
    text: "⚙️ 시계의 핵심 부품을 조사하기로 결정했습니다! 시간의 시계의 가장 중요한 부분들을 자세히 살펴봅니다. 각 기어와 바퀴는 시간의 다른 측면을 나타내며, 그들이 어떻게 상호작용하는지 이해하면 시간의 본질을 깊이 알 수 있습니다. 핵심 부품들은 매우 정교하게 만들어져 있어서, 그 구조를 이해하는 것은 시간 조작의 원리를 파악하는 데 매우 중요합니다...",
    choices: [
      {
        text: "🔧 부품의 구조를 분석한다",
        next: "analyze_component_structure",
        scoreA: 25,
        scoreB: 25,
      },
      {
        text: "⚡ 부품의 에너지를 연구한다",
        next: "research_component_energy",
        scoreA: 27,
        scoreB: 27,
      },
    ],
  },
  research_time_physics: {
    text: "🔬 시간의 물리학을 연구하기로 결정했습니다! 시간이 어떻게 작동하는지에 대한 과학적 원리를 탐구합니다. 시간은 단순히 흘러가는 것이 아니라, 특정한 물리 법칙을 따르는 복잡한 현상입니다. 이 연구를 통해 시간 조작의 과학적 기반을 이해하고, 시간의 조각을 더 효과적으로 다룰 수 있는 방법을 발견할 수 있습니다...",
    choices: [
      {
        text: "📊 시간의 수학적 모델을 만든다",
        next: "create_time_mathematical_model",
        scoreA: 30,
        scoreB: 30,
      },
      {
        text: "🧪 시간의 실험을 설계한다",
        next: "design_time_experiment",
        scoreA: 28,
        scoreB: 28,
      },
    ],
  },
  follow_alternative_path: {
    text: "🗺️ 지도의 다른 경로를 따르기로 결정했습니다! 시간의 조각 지도에는 여러 가지 경로가 표시되어 있고, 각 경로는 서로 다른 모험과 도전을 제공합니다. 첫 번째 조각을 찾는 대신 다른 경로를 선택하면, 더 흥미로운 발견을 할 수 있을 것 같습니다. 이 경로는 예상치 못한 모험과 새로운 가능성들을 열어줄 것입니다...",
    choices: [
      {
        text: "🌙 밤의 경로를 선택한다",
        next: "choose_night_path",
        scoreA: 32,
        scoreB: 32,
      },
      {
        text: "☀️ 낮의 경로를 선택한다",
        next: "choose_day_path",
        scoreA: 34,
        scoreB: 34,
      },
    ],
  },
  immediately_acquire_fragment: {
    text: "💎 보물을 즉시 획득하기로 결정했습니다! 하지만 서두른 선택으로 인해 함정에 걸리게 됩니다. 보물을 만지는 순간, 주변에 마법의 함정이 발동되어 시간이 뒤틀리기 시작합니다. 예상보다 큰 위험이 다가오고, 시간의 균형이 깨지기 시작합니다. 서두른 선택이 오히려 더 큰 문제를 야기했습니다...",
    choices: [
      {
        text: "🛑 함정에서 벗어난다",
        next: "escape_trap",
        scoreA: -5,
        scoreB: -5,
      },
      {
        text: "💪 함정을 무시하고 진행한다",
        next: "ignore_trap_continue",
        scoreA: -25,
        scoreB: -25,
      },
    ],
  },
  find_safe_method: {
    text: "🛡️ 안전한 방법을 찾기로 결정했습니다! 시간의 조각에 접근하기 전에 안전하고 효과적인 방법을 찾아봅니다. 조각의 강력한 에너지를 제어할 수 있는 방법을 발견하면, 위험을 최소화하면서도 조각의 힘을 효과적으로 활용할 수 있습니다. 이 접근은 신중하고 현명한 선택입니다...",
    choices: [
      {
        text: "🔒 안전 장치를 만든다",
        next: "create_safety_device",
        scoreA: 36,
        scoreB: 36,
      },
      {
        text: "📚 안전 매뉴얼을 찾는다",
        next: "find_safety_manual",
        scoreA: 38,
        scoreB: 38,
      },
    ],
  },
  search_with_wisdom: {
    text: "🎯 지혜를 바탕으로 시간의 조각을 찾기로 결정했습니다! 시간의 나무들과 소통하며 얻은 깊은 지혜를 활용해서 조각을 찾습니다. 이 지혜를 바탕으로 조각이 있는 정확한 위치를 파악할 수 있고, 조각을 안전하게 획득할 수 있는 방법을 알 수 있습니다. 지혜의 힘을 활용한 이 접근은 성공의 확률을 크게 높여줍니다...",
    choices: [
      {
        text: "🧘 지혜로운 마음으로 접근한다",
        next: "approach_with_wisdom",
        scoreA: 40,
        scoreB: 40,
      },
      {
        text: "🔮 지혜의 힘을 활용한다",
        next: "utilize_wisdom_power",
        scoreA: 42,
        scoreB: 42,
      },
    ],
  },
  make_careful_choice: {
    text: "⚖️ 현재의 선택을 신중히 하기로 결정했습니다! 미래의 가능성들을 살펴본 결과를 바탕으로, 가장 좋은 결과를 가져올 수 있는 선택을 신중하게 합니다. 이 선택은 단순한 직감이 아니라 미래의 지혜를 바탕으로 한 현명한 판단입니다. 신중한 선택을 통해 시간의 조각을 찾는 최적의 방법을 발견할 수 있습니다...",
    choices: [
      {
        text: "🎯 최적의 선택을 한다",
        next: "make_optimal_choice",
        scoreA: 45,
        scoreB: 45,
      },
      {
        text: "🔍 더 많은 정보를 수집한다",
        next: "gather_more_information",
        scoreA: 43,
        scoreB: 43,
      },
    ],
  },
  surrender_to_time_flow: {
    text: "🌊 시간의 흐름에 몸을 맡기기로 결정했습니다! 시간의 균형을 체험한 경험을 바탕으로, 시간의 자연스러운 흐름을 따르면서 조각을 찾습니다. 이 방법은 시간의 흐름과 완전히 조화를 이루면서 접근하는 것으로, 시간의 에너지와 완벽하게 동기화됩니다. 시간의 흐름에 맡기는 이 접근은 가장 자연스럽고 안전한 방법입니다...",
    choices: [
      {
        text: "🌊 흐름을 따라 조각을 찾는다",
        next: "find_fragment_with_flow",
        scoreA: 47,
        scoreB: 47,
      },
      {
        text: "🧘 시간과 하나가 된다",
        next: "become_one_with_time",
        scoreA: 50,
        scoreB: 50,
      },
    ],
  },
  consider_all_possibilities: {
    text: "🔮 모든 가능성을 고려하기로 결정했습니다! 미래의 가능성들을 탐험한 결과를 바탕으로, 모든 가능한 시나리오를 신중하게 분석합니다. 각 가능성의 장단점을 비교하고, 가장 좋은 결과를 가져올 수 있는 방법을 찾습니다. 이 접근은 가장 포괄적이고 신중한 방법으로, 성공의 확률을 최대화할 수 있습니다...",
    choices: [
      {
        text: "📊 모든 시나리오를 분석한다",
        next: "analyze_all_scenarios",
        scoreA: 52,
        scoreB: 52,
      },
      {
        text: "🎯 최고의 시나리오를 선택한다",
        next: "select_best_scenario",
        scoreA: 55,
        scoreB: 55,
      },
    ],
  },
  form_connection_with_fragment: {
    text: "🔗 시간의 조각과 연결을 형성하기로 결정했습니다! 조각의 강력한 에너지와 직접적인 연결을 만들어서, 조각의 힘을 더 효과적으로 이해하고 활용할 수 있게 됩니다. 이 연결을 통해 조각의 본질을 깊이 이해하고, 시간의 비밀들을 직접적으로 경험할 수 있습니다. 연결을 형성하는 이 방법은 조각과의 깊은 교감을 가능하게 합니다...",
    choices: [
      {
        text: "🧠 정신적 연결을 형성한다",
        next: "form_mental_connection",
        scoreA: 58,
        scoreB: 58,
      },
      {
        text: "💫 에너지적 연결을 형성한다",
        next: "form_energy_connection",
        scoreA: 60,
        scoreB: 60,
      },
    ],
  },
  discover_path_secrets: {
    text: "🔍 경로의 비밀을 발견하기로 결정했습니다! 최적 경로를 따라가면서 그 경로에 숨겨진 비밀들을 하나씩 발견합니다. 이 비밀들은 시간의 조각에 대한 중요한 정보들을 담고 있고, 경로의 각 단계마다 새로운 발견을 할 수 있습니다. 경로의 비밀을 발견하는 것은 시간의 조각을 더 깊이 이해하는 데 매우 중요한 역할을 합니다...",
    choices: [
      {
        text: "🗝️ 비밀의 열쇠를 찾는다",
        next: "find_secret_key",
        scoreA: 62,
        scoreB: 62,
      },
      {
        text: "📜 비밀의 문서를 발견한다",
        next: "discover_secret_document",
        scoreA: 65,
        scoreB: 65,
      },
    ],
  },
  explore_surroundings_more: {
    text: "🔍 주변을 더 탐험하기로 결정했습니다! 목표 지점에 도달했지만, 주변에 더 많은 비밀들이 숨겨져 있을 것 같습니다. 이곳은 시간의 에너지가 가장 집중된 곳이므로, 주변에서 시간의 비밀에 대한 중요한 단서들을 발견할 수 있을 것입니다. 더 많은 탐험을 통해 시간의 조각에 대한 깊은 이해를 얻을 수 있습니다...",
    choices: [
      {
        text: "🏔️ 주변의 산들을 탐험한다",
        next: "explore_surrounding_mountains",
        scoreA: 67,
        scoreB: 67,
      },
      {
        text: "🌊 주변의 바다를 탐험한다",
        next: "explore_surrounding_ocean",
        scoreA: 70,
        scoreB: 70,
      },
    ],
  },
  attempt_time_acceleration: {
    text: "⏭️ 시간 가속을 시도하기로 결정했습니다! 시간의 조각의 힘을 사용해서 시간을 가속시켜봅니다. 처음에는 매우 조심스럽게 작은 가속부터 시작하지만, 점차 더 큰 가속을 시도해보면서 시간 가속의 한계와 가능성을 탐구합니다. 이 실험을 통해 시간의 본질과 시간 조작의 다양한 측면에 대해 더 깊이 이해할 수 있습니다...",
    choices: [
      {
        text: "⚡ 강력한 가속을 시도한다",
        next: "attempt_powerful_acceleration",
        scoreA: 72,
        scoreB: 72,
      },
      {
        text: "🛑 가속 실험을 중단한다",
        next: "stop_acceleration_experiment",
        scoreA: 75,
        scoreB: 75,
      },
    ],
  },
  stop_experiment: {
    text: "🛑 실험을 중단하기로 결정했습니다! 시간 되돌리기 실험을 안전하게 중단하고, 조각의 힘을 신중하게 다루기로 결정했습니다. 이 선택은 위험을 피하면서도 조각의 힘을 이해할 수 있는 현명한 방법입니다. 실험을 중단함으로써 예상치 못한 결과를 방지하고, 더 안전한 방법으로 조각의 힘을 연구할 수 있습니다...",
    choices: [
      {
        text: "📚 조각의 이론을 연구한다",
        next: "study_fragment_theory",
        scoreA: 78,
        scoreB: 78,
      },
      {
        text: "🔍 조각의 특성을 분석한다",
        next: "analyze_fragment_properties",
        scoreA: 80,
        scoreB: 80,
      },
    ],
  },
  attempt_powerful_reversal: {
    text: "⚡ 더 강력한 되돌리기를 시도하기로 결정했습니다! 시간의 조각의 힘을 최대한으로 사용해서 더 큰 범위의 시간을 되돌려봅니다. 이 실험은 매우 위험할 수 있지만, 시간 조작의 진정한 힘을 경험할 수 있는 기회입니다. 강력한 되돌리기를 통해 시간의 본질에 대해 더 깊이 이해할 수 있습니다...",
    choices: [
      {
        text: "💥 극한의 되돌리기를 시도한다",
        next: "attempt_extreme_reversal",
        scoreA: 85,
        scoreB: 85,
      },
      {
        text: "🛡️ 안전 장치를 사용한다",
        next: "use_safety_measures",
        scoreA: 82,
        scoreB: 82,
      },
    ],
  },
  check_alternative_paths: {
    text: "🗺️ 지도의 다른 경로를 확인하기로 결정했습니다! 시간의 조각 지도에는 여러 가지 경로가 표시되어 있고, 각 경로는 서로 다른 모험과 도전을 제공합니다. 다른 경로들을 확인하면서 가장 적합한 경로를 선택할 수 있습니다. 이 확인을 통해 더 효율적이고 흥미로운 모험을 계획할 수 있습니다...",
    choices: [
      {
        text: "🌙 밤의 경로를 확인한다",
        next: "check_night_path",
        scoreA: 87,
        scoreB: 87,
      },
      {
        text: "☀️ 낮의 경로를 확인한다",
        next: "check_day_path",
        scoreA: 90,
        scoreB: 90,
      },
    ],
  },
  sail_time_ship: {
    text: "🚣 시간의 배를 타고 가기로 결정했습니다! 시간의 바다를 건너기 위해 특별한 배를 사용합니다. 이 배는 시간의 흐름을 타고 움직이는 신비로운 배로, 바다의 시간을 안전하게 건널 수 있습니다. 배를 타고 가면서 시간의 바다의 아름다움을 감상할 수 있고, 바다의 시간에 대한 깊은 이해를 얻을 수 있습니다...",
    choices: [
      {
        text: "🌊 배를 타고 바다를 건넌다",
        next: "sail_across_ocean",
        scoreA: 92,
        scoreB: 92,
      },
      {
        text: "🔍 배의 비밀을 탐구한다",
        next: "explore_ship_secrets",
        scoreA: 95,
        scoreB: 95,
      },
    ],
  },
  directly_acquire_ocean_fragment: {
    text: "💎 바다의 조각을 직접 획득하기로 결정했습니다! 시간의 바다의 깊은 곳으로 직접 내려가서 조각을 찾습니다. 바다의 깊은 곳은 매우 위험하지만, 조각이 가장 밝게 빛나는 곳입니다. 직접 접근하는 이 방법은 위험할 수 있지만, 조각을 가장 빠르게 획득할 수 있는 방법입니다...",
    choices: [
      {
        text: "🏊 깊은 곳으로 잠수한다",
        next: "dive_deep_for_fragment",
        scoreA: 98,
        scoreB: 98,
      },
      {
        text: "🔧 잠수 장비를 사용한다",
        next: "use_diving_equipment",
        scoreA: 100,
        scoreB: 100,
      },
    ],
  },
  glimpse_time_secrets: {
    text: "🔮 시간의 비밀을 엿보기로 결정했습니다! 시간의 생물들과 소통하면서 시간의 가장 깊은 비밀들을 엿볼 수 있습니다. 이 비밀들은 시간의 본질과 시간 조작의 진정한 의미에 대한 중요한 정보들을 담고 있습니다. 시간의 비밀을 엿보는 것은 시간의 조각을 다루는 데 매우 중요한 통찰을 제공합니다...",
    choices: [
      {
        text: "🔍 더 깊은 비밀을 탐구한다",
        next: "explore_deeper_secrets",
        scoreA: 105,
        scoreB: 105,
      },
      {
        text: "📚 비밀의 지식을 기록한다",
        next: "record_secret_knowledge",
        scoreA: 108,
        scoreB: 108,
      },
    ],
  },
  master_time_wisdom: {
    text: "🧘 시간의 지혜를 체득하기로 결정했습니다! 시간의 생물들과 소통하며 얻은 지식을 바탕으로, 시간에 대한 깊은 지혜를 완전히 이해합니다. 이 지혜는 단순한 지식이 아니라, 시간의 본질을 완전히 이해하는 깊은 통찰입니다. 시간의 지혜를 체득하는 것은 시간의 조각을 다루는 데 가장 중요한 기반이 됩니다...",
    choices: [
      {
        text: "🎯 지혜를 바탕으로 행동한다",
        next: "act_with_wisdom",
        scoreA: 115,
        scoreB: 115,
      },
      {
        text: "🔮 지혜의 힘을 활용한다",
        next: "utilize_wisdom_strength",
        scoreA: 120,
        scoreB: 120,
      },
    ],
  },
  form_deep_connection: {
    text: "🔗 조각과 깊은 연결을 형성하기로 결정했습니다! 시간의 조각과 가장 깊은 수준의 연결을 만들어서, 조각의 모든 비밀을 이해할 수 있게 됩니다. 이 연결은 단순한 교감을 넘어서, 조각과 완전히 하나가 되는 경험입니다. 깊은 연결을 형성하는 것은 조각의 힘을 최대한으로 활용할 수 있는 방법입니다...",
    choices: [
      {
        text: "🧠 완전한 정신적 융합을 시도한다",
        next: "attempt_complete_mental_fusion",
        scoreA: 125,
        scoreB: 125,
      },
      {
        text: "💫 에너지적 동기화를 완성한다",
        next: "complete_energy_synchronization",
        scoreA: 130,
        scoreB: 130,
      },
    ],
  },
  conduct_safe_experiment: {
    text: "🛡️ 안전한 실험을 하기로 결정했습니다! 시간의 조각들의 힘을 결합할 때 안전을 최우선으로 고려한 실험을 합니다. 이 실험은 위험을 최소화하면서도 조각들의 상호작용을 이해할 수 있는 방법입니다. 안전한 실험을 통해 조각들의 힘을 효과적으로 활용할 수 있는 방법을 발견할 수 있습니다...",
    choices: [
      {
        text: "🔬 제어된 실험을 설계한다",
        next: "design_controlled_experiment",
        scoreA: 135,
        scoreB: 135,
      },
      {
        text: "📊 실험 결과를 분석한다",
        next: "analyze_experiment_results",
        scoreA: 140,
        scoreB: 140,
      },
    ],
  },
  ride_time_bird: {
    text: "🦅 시간의 새를 타고 가기로 결정했습니다! 시간의 산에 도달하기 위해 특별한 새를 사용합니다. 이 새는 시간의 흐름을 타고 날아가는 신비로운 생물로, 산까지 안전하고 빠르게 도달할 수 있습니다. 새를 타고 가면서 시간의 산의 아름다움을 감상할 수 있고, 산의 시간에 대한 깊은 이해를 얻을 수 있습니다...",
    choices: [
      {
        text: "🦅 새를 타고 산으로 향한다",
        next: "fly_to_mountain",
        scoreA: 145,
        scoreB: 145,
      },
      {
        text: "🔍 새의 비밀을 탐구한다",
        next: "explore_bird_secrets",
        scoreA: 150,
        scoreB: 150,
      },
    ],
  },
  explore_mountain_secrets: {
    text: "🔍 산의 비밀을 탐험하기로 결정했습니다! 시간의 산의 깊은 곳에서 숨겨진 비밀들을 발견합니다. 이 비밀들은 시간의 조각에 대한 중요한 정보들을 담고 있고, 산의 각 부분마다 새로운 발견을 할 수 있습니다. 산의 비밀을 탐험하는 것은 시간의 조각을 더 깊이 이해하는 데 매우 중요한 역할을 합니다...",
    choices: [
      {
        text: "🏔️ 산의 동굴을 탐험한다",
        next: "explore_mountain_caves",
        scoreA: 155,
        scoreB: 155,
      },
      {
        text: "🌲 산의 숲을 탐험한다",
        next: "explore_mountain_forest",
        scoreA: 160,
        scoreB: 160,
      },
    ],
  },
  experience_time_mystery: {
    text: "🔮 시간의 신비를 체험하기로 결정했습니다! 시간의 산의 정상에서 시간의 가장 깊은 신비들을 직접 체험합니다. 이 체험은 시간의 본질과 시간 조작의 진정한 의미에 대한 깊은 이해를 제공합니다. 시간의 신비를 체험하는 것은 시간의 조각을 다루는 데 가장 중요한 통찰을 제공합니다...",
    choices: [
      {
        text: "🧘 신비의 깊이를 탐구한다",
        next: "explore_mystery_depth",
        scoreA: 170,
        scoreB: 170,
      },
      {
        text: "📚 신비의 지식을 기록한다",
        next: "record_mystery_knowledge",
        scoreA: 175,
        scoreB: 175,
      },
    ],
  },
  stop_dangerous_experiment: {
    text: "🛑 위험한 실험을 중단하기로 결정했습니다! 완전한 시간 조작의 힘을 사용한 실험을 안전하게 중단하고, 그 힘을 신중하게 다루기로 결정했습니다. 이 선택은 위험을 피하면서도 조각의 힘을 이해할 수 있는 현명한 방법입니다. 실험을 중단함으로써 예상치 못한 결과를 방지하고, 더 안전한 방법으로 조각의 힘을 연구할 수 있습니다...",
    choices: [
      {
        text: "📚 조각의 이론을 연구한다",
        next: "study_complete_fragment_theory",
        scoreA: 350,
        scoreB: 350,
      },
      {
        text: "🔍 조각의 특성을 분석한다",
        next: "analyze_complete_fragment_properties",
        scoreA: 380,
        scoreB: 380,
      },
    ],
  },
  stop_at_last_moment: {
    text: "🛑 마지막 순간에 실험을 중단합니다! 위험한 실험의 결과로 인해 이미 큰 피해가 발생했지만, 마지막 순간에 실험을 중단해서 더 큰 재앙을 막을 수 있었습니다. 하지만 이미 발생한 피해는 되돌릴 수 없고, 세계는 큰 상처를 입었습니다. 이 경험을 통해 시간 조작의 위험성을 깊이 깨닫게 됩니다...",
    choices: [
      {
        text: "🔧 피해를 복구한다",
        next: "repair_damage",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "📚 교훈을 배운다",
        next: "learn_lesson",
        scoreA: 25,
        scoreB: 25,
      },
    ],
  },
  // 새로운 중간 노드들 추가
  start_new_adventure: {
    text: "🔮 새로운 모험을 시작하기로 결정했습니다! 세계를 구한 경험을 바탕으로, 더 큰 모험을 떠나기로 합니다. 이번에는 시간의 조각을 찾는 것이 아니라, 아를리아 세계의 다른 비밀들을 탐험하게 됩니다. 새로운 모험은 더욱 흥미롭고 위험할 수 있지만, 이전 경험을 바탕으로 더 현명하게 대처할 수 있을 것입니다...",
    choices: [
      {
        text: "🗺️ 새로운 대륙을 탐험한다",
        next: "explore_new_continent",
        scoreA: 70,
        scoreB: 70,
      },
      {
        text: "🔍 고대 유적을 찾는다",
        next: "find_ancient_ruins",
        scoreA: 65,
        scoreB: 65,
      },
    ],
  },
  return_to_hometown: {
    text: "🏠 고향으로 돌아가기로 결정했습니다! 긴 모험을 마치고 고향으로 돌아갑니다. 고향에서는 당신의 모험 이야기를 듣고 싶어하는 사람들이 기다리고 있습니다. 이 경험을 바탕으로 고향에서 새로운 삶을 시작할 수 있습니다. 하지만 모험의 기억은 영원히 남아있을 것입니다...",
    choices: [
      {
        text: "📖 모험 이야기를 기록한다",
        next: "record_adventure_story",
        scoreA: 45,
        scoreB: 45,
      },
      {
        text: "🏘️ 고향을 발전시킨다",
        next: "develop_hometown",
        scoreA: 55,
        scoreB: 55,
      },
    ],
  },
  explore_world_more: {
    text: "🌍 세계를 더 탐험하기로 결정했습니다! 시간의 균형을 회복한 후에도 아를리아 세계에는 아직 탐험하지 못한 곳들이 많이 남아있습니다. 새로운 장소들을 탐험하면서 더 많은 비밀들을 발견할 수 있을 것입니다. 이번 탐험은 이전보다 더 안전하고 체계적으로 진행할 수 있습니다...",
    choices: [
      {
        text: "🏔️ 미지의 산맥을 탐험한다",
        next: "explore_unknown_mountains",
        scoreA: 80,
        scoreB: 80,
      },
      {
        text: "🌊 깊은 바다를 탐험한다",
        next: "explore_deep_ocean",
        scoreA: 75,
        scoreB: 75,
      },
    ],
  },
  teach_time_knowledge: {
    text: "📚 시간의 지식을 전수하기로 결정했습니다! 시간의 균형을 회복하면서 얻은 깊은 지식을 다른 사람들에게 가르치기로 합니다. 이 지식은 아를리아 세계의 미래를 위해 매우 중요합니다. 학생들을 가르치면서 자신의 이해도도 더욱 깊어질 것입니다...",
    choices: [
      {
        text: "🏫 학교를 세운다",
        next: "build_school",
        scoreA: 90,
        scoreB: 90,
      },
      {
        text: "📖 책을 쓴다",
        next: "write_book",
        scoreA: 85,
        scoreB: 85,
      },
    ],
  },
  repair_damage: {
    text: "🔧 피해를 복구하기로 결정했습니다! 실험으로 인한 피해를 복구하기 위해 노력합니다. 이 과정에서 시간의 본질에 대해 더 깊이 이해하게 되고, 피해 복구를 통해 새로운 기술들을 개발할 수 있습니다. 복구 작업은 시간이 걸리지만, 그 과정에서 얻는 지식은 매우 가치 있습니다...",
    choices: [
      {
        text: "🛠️ 새로운 기술을 개발한다",
        next: "develop_new_technology",
        scoreA: 35,
        scoreB: 35,
      },
      {
        text: "🤝 다른 사람들과 협력한다",
        next: "cooperate_with_others",
        scoreA: 40,
        scoreB: 40,
      },
    ],
  },
  learn_lesson: {
    text: "📚 교훈을 배우기로 결정했습니다! 위험한 실험의 경험을 통해 얻은 교훈을 깊이 새깁니다. 이 교훈은 앞으로의 모든 선택에 영향을 미치게 됩니다. 실패를 통해 배운 지식은 성공보다 더욱 가치 있을 수 있습니다. 이제 더욱 신중하고 현명한 선택을 할 수 있을 것입니다...",
    choices: [
      {
        text: "🧘 깊은 성찰을 한다",
        next: "deep_reflection",
        scoreA: 30,
        scoreB: 30,
      },
      {
        text: "📖 경험을 기록한다",
        next: "record_experience",
        scoreA: 35,
        scoreB: 35,
      },
    ],
  },
  // 최종 엔딩 노드들 (실제 게임 종료)
  deep_reflection: {
    text: "🧘 깊은 성찰을 통해 시간의 본질을 완전히 이해하게 되었습니다. 이제 모든 것이 명확해졌고, 진정한 평화를 찾았습니다. 당신의 모험이 완전히 끝났습니다.",
    choices: [],
  },
  record_experience: {
    text: "📖 경험을 기록하여 후세에 귀중한 지식을 남겼습니다. 당신의 이야기는 영원히 전설이 될 것입니다. 모험이 완전히 끝났습니다.",
    choices: [],
  },
  develop_new_technology: {
    text: "🛠️ 새로운 기술을 개발하여 세계를 더 나은 곳으로 만들었습니다. 당신의 발명품은 모든 사람들에게 도움이 되었습니다. 모험이 완전히 끝났습니다.",
    choices: [],
  },
  cooperate_with_others: {
    text: "🤝 다른 사람들과 협력하여 세계를 복구했습니다. 협력의 힘을 통해 더 큰 성과를 이루었습니다. 모험이 완전히 끝났습니다.",
    choices: [],
  },
  explore_new_continent: {
    text: "🗺️ 새로운 대륙을 발견하여 아를리아 세계의 지도를 완성했습니다. 당신의 발견은 역사에 남을 것입니다. 모험이 완전히 끝났습니다.",
    choices: [],
  },
  find_ancient_ruins: {
    text: "🔍 고대 유적을 발견하여 잃어버린 문명의 비밀을 밝혔습니다. 고고학적 발견으로 유명해졌습니다. 모험이 완전히 끝났습니다.",
    choices: [],
  },
  record_adventure_story: {
    text: "📖 모험 이야기를 기록하여 베스트셀러가 되었습니다. 당신의 이야기는 수많은 사람들에게 영감을 주었습니다. 모험이 완전히 끝났습니다.",
    choices: [],
  },
  develop_hometown: {
    text: "🏘️ 고향을 발전시켜 번영하는 도시로 만들었습니다. 모든 주민들이 당신을 영웅으로 여깁니다. 모험이 완전히 끝났습니다.",
    choices: [],
  },
  explore_unknown_mountains: {
    text: "🏔️ 미지의 산맥을 탐험하여 새로운 종족을 발견했습니다. 평화로운 교류를 통해 세계가 더욱 풍요로워졌습니다. 모험이 완전히 끝났습니다.",
    choices: [],
  },
  explore_deep_ocean: {
    text: "🌊 깊은 바다를 탐험하여 해양 생물들과 친구가 되었습니다. 바다의 비밀을 풀어 새로운 가능성을 열었습니다. 모험이 완전히 끝났습니다.",
    choices: [],
  },
  build_school: {
    text: "🏫 학교를 세워 수많은 학생들을 가르쳤습니다. 당신의 지식이 세대를 거쳐 전해져 세계가 더욱 지혜로워졌습니다. 모험이 완전히 끝났습니다.",
    choices: [],
  },
  write_book: {
    text: "📖 책을 써서 시간의 비밀을 세상에 알렸습니다. 당신의 저서는 모든 도서관에 보관되어 후세에 귀중한 지식이 되었습니다. 모험이 완전히 끝났습니다.",
    choices: [],
  },
  // 새로운 4개 선택지 노드들
  find_temple_treasure: {
    text: "🔮 신전의 보물을 찾기로 결정했습니다! 신전의 깊은 곳에서 숨겨진 보물들을 발견합니다. 이 보물들은 고대의 마법사들이 남긴 귀중한 물건들로, 시간의 비밀에 대한 중요한 단서들을 담고 있습니다. 보물들을 통해 시간의 조각에 대한 더 많은 정보를 얻을 수 있을 것입니다...",
    choices: [
      {
        text: "💎 보물을 분석한다",
        next: "analyze_treasure",
        scoreA: 25,
        scoreB: 25,
      },
      {
        text: "🔮 보물의 힘을 사용한다",
        next: "use_treasure_power",
        scoreA: 30,
        scoreB: 30,
      },
      {
        text: "📚 보물의 역사를 연구한다",
        next: "study_treasure_history",
        scoreA: 22,
        scoreB: 22,
      },
      {
        text: "🛡️ 보물을 안전하게 보관한다",
        next: "safely_store_treasure",
        scoreA: 28,
        scoreB: 28,
      },
    ],
  },
  find_secret_passage: {
    text: "🚪 비밀 통로를 찾기로 결정했습니다! 신전의 벽을 자세히 살펴보면서 숨겨진 비밀 통로를 발견합니다. 이 통로는 고대의 마법사들이 사용했던 특별한 경로로, 신전의 가장 깊은 곳으로 연결되어 있습니다. 비밀 통로를 통해 신전의 핵심에 도달할 수 있을 것입니다...",
    choices: [
      {
        text: "🚶 통로를 따라간다",
        next: "follow_secret_passage",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "🔍 통로의 비밀을 탐구한다",
        next: "explore_passage_secrets",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "🗺️ 통로의 지도를 만든다",
        next: "create_passage_map",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "⚡ 통로를 빠르게 통과한다",
        next: "quickly_pass_through",
        scoreA: 12,
        scoreB: 12,
      },
    ],
  },
  collect_time_flowers: {
    text: "🌺 시간의 꽃을 수집하기로 결정했습니다! 숲의 각 곳에서 아름다운 시간의 꽃들을 발견합니다. 이 꽃들은 각각 다른 시간을 상징하며, 그 향기는 시간의 기억을 담고 있습니다. 꽃들을 수집하면서 시간의 본질에 대해 더 깊이 이해할 수 있을 것입니다...",
    choices: [
      {
        text: "🌸 꽃의 향기를 맡는다",
        next: "smell_flower_fragrance",
        scoreA: 22,
        scoreB: 22,
      },
      {
        text: "🌼 꽃을 정원에 심는다",
        next: "plant_flower_garden",
        scoreA: 25,
        scoreB: 25,
      },
      {
        text: "🌻 꽃의 비밀을 연구한다",
        next: "research_flower_secrets",
        scoreA: 28,
        scoreB: 28,
      },
      {
        text: "🌹 꽃을 선물로 준다",
        next: "give_flowers_as_gift",
        scoreA: 20,
        scoreB: 20,
      },
    ],
  },
  follow_time_butterfly: {
    text: "🦋 시간의 나비를 따라가기로 결정했습니다! 아름다운 시간의 나비가 나타나서 당신을 특별한 곳으로 안내합니다. 이 나비는 시간의 흐름을 타고 날아가는 신비로운 생물로, 시간의 비밀을 알고 있는 것 같습니다. 나비를 따라가면서 새로운 발견을 할 수 있을 것입니다...",
    choices: [
      {
        text: "🦋 나비와 함께 날아간다",
        next: "fly_with_butterfly",
        scoreA: 30,
        scoreB: 30,
      },
      {
        text: "🌺 나비가 안내하는 곳으로 간다",
        next: "go_to_butterfly_guide",
        scoreA: 25,
        scoreB: 25,
      },
      {
        text: "🔮 나비의 비밀을 엿본다",
        next: "glimpse_butterfly_secrets",
        scoreA: 35,
        scoreB: 35,
      },
      {
        text: "📸 나비의 아름다움을 기록한다",
        next: "record_butterfly_beauty",
        scoreA: 18,
        scoreB: 18,
      },
    ],
  },
  // 추가적인 4개 선택지 노드들
  fly_with_butterfly: {
    text: "🦋 나비와 함께 날아가기로 결정했습니다! 시간의 나비와 함께 하늘을 날아가면서 시간의 흐름을 직접 체험합니다. 이 경험은 매우 신비롭고 아름다우며, 시간의 본질에 대해 깊이 이해할 수 있게 해줍니다. 나비와 함께하는 이 비행은 평생 잊을 수 없는 경험이 될 것입니다...",
    choices: [
      {
        text: "☁️ 구름 위로 날아간다",
        next: "fly_above_clouds",
        scoreA: 40,
        scoreB: 40,
      },
      {
        text: "🌈 무지개를 건넌다",
        next: "cross_rainbow",
        scoreA: 45,
        scoreB: 45,
      },
      {
        text: "⭐ 별들을 만진다",
        next: "touch_stars",
        scoreA: 50,
        scoreB: 50,
      },
      {
        text: "🌅 일출을 감상한다",
        next: "watch_sunrise",
        scoreA: 35,
        scoreB: 35,
      },
    ],
  },
  go_to_butterfly_guide: {
    text: "🌺 나비가 안내하는 곳으로 가기로 결정했습니다! 시간의 나비가 특별한 장소로 안내해줍니다. 이곳은 시간의 비밀들이 숨겨진 신비로운 장소로, 나비만이 알고 있는 특별한 곳입니다. 나비의 안내를 따라가면서 새로운 발견을 할 수 있을 것입니다...",
    choices: [
      {
        text: "🏰 시간의 성으로 간다",
        next: "go_to_time_castle",
        scoreA: 38,
        scoreB: 38,
      },
      {
        text: "🌊 시간의 호수로 간다",
        next: "go_to_time_lake",
        scoreA: 42,
        scoreB: 42,
      },
      {
        text: "🌳 시간의 나무로 간다",
        next: "go_to_time_tree",
        scoreA: 36,
        scoreB: 36,
      },
      {
        text: "🏔️ 시간의 봉우리로 간다",
        next: "go_to_time_peak",
        scoreA: 44,
        scoreB: 44,
      },
    ],
  },
  glimpse_butterfly_secrets: {
    text: "🔮 나비의 비밀을 엿보기로 결정했습니다! 시간의 나비와 깊은 교감을 하면서 그가 알고 있는 시간의 비밀들을 엿볼 수 있습니다. 이 비밀들은 시간의 본질과 시간 조작의 진정한 의미에 대한 중요한 통찰을 제공합니다. 나비의 비밀을 통해 시간의 조각을 더 효과적으로 다룰 수 있을 것입니다...",
    choices: [
      {
        text: "🧠 정신적 교감을 한다",
        next: "mental_communication",
        scoreA: 48,
        scoreB: 48,
      },
      {
        text: "💫 에너지적 연결을 형성한다",
        next: "form_energy_connection",
        scoreA: 52,
        scoreB: 52,
      },
      {
        text: "🔮 미래의 비전을 본다",
        next: "see_future_vision",
        scoreA: 55,
        scoreB: 55,
      },
      {
        text: "📚 지식을 공유한다",
        next: "share_knowledge",
        scoreA: 46,
        scoreB: 46,
      },
    ],
  },
  record_butterfly_beauty: {
    text: "📸 나비의 아름다움을 기록하기로 결정했습니다! 시간의 나비의 아름다운 모습을 다양한 방법으로 기록합니다. 이 기록들은 시간의 아름다움을 보여주는 귀중한 자료가 될 것입니다. 나비의 아름다움을 기록하면서 시간의 본질에 대한 새로운 관점을 얻을 수 있습니다...",
    choices: [
      {
        text: "🎨 그림을 그린다",
        next: "paint_butterfly",
        scoreA: 32,
        scoreB: 32,
      },
      {
        text: "📷 사진을 찍는다",
        next: "photograph_butterfly",
        scoreA: 28,
        scoreB: 28,
      },
      {
        text: "📝 시를 쓴다",
        next: "write_poem",
        scoreA: 34,
        scoreB: 34,
      },
      {
        text: "🎵 노래를 부른다",
        next: "sing_song",
        scoreA: 30,
        scoreB: 30,
      },
    ],
  },
  help_lost_people: {
    text: "🤝 시간을 잃은 사람들을 도와주기로 결정했습니다! 그들은 매우 감사해하며, 손성모에 대한 중요한 정보를 알려줍니다. 손성모는 '시간의 기록자'로, 아를리아의 모든 시간의 비밀을 알고 있는 전설적인 존재입니다. 그는 시간의 조각을 찾는 방법과 세계 균열을 막는 방법을 알고 있다고 합니다. 하지만 손성모를 찾으려면 시간의 퍼즐을 풀어야 하고, 그 과정에서 위험한 선택을 해야 할 수도 있습니다. 시간을 잃은 사람들은 당신들의 선행에 감동받아 함께 모험을 떠나겠다고 제안합니다...",
    choices: [
      {
        text: "🤝 시간을 잃은 사람들과 함께 모험한다",
        next: "adventure_with_lost_people",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🔍 손성모를 찾는다",
        next: "find_sonseongmo",
        scoreA: 10,
        scoreB: 10,
      },
    ],
  },
  find_sonseongmo: {
    text: "🔍 손성모를 찾기 위해 시간의 계단을 더욱 깊이 탐험합니다! 손성모는 '시간의 기록자'로, 아를리아의 모든 시간의 비밀을 알고 있는 전설적인 존재입니다. 계단의 깊은 곳에서 손성모를 발견했습니다! 그는 마치 시간 그 자체처럼 보이며, 주변에 시간의 파편들이 떠다니고 있습니다. 손성모는 당신들을 보자마자 미소 짓습니다. '드디어 왔군요. 시간의 균형을 지킬 수 있는 자들이...'라고 말하며, 당신들에게 히든 퍼즐을 제시합니다. 이 퍼즐을 풀면 모든 시간과 세계가 공존할 수 있는 방법을 알 수 있다고 합니다...",
    choices: [
      {
        text: "🧩 손성모의 퍼즐을 받아들인다",
        next: "accept_sonseongmo_puzzle",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "⚡ 시간의 조각을 먼저 찾는다",
        next: "find_time_fragment_first",
        scoreA: 12,
        scoreB: 12,
      },
    ],
  },
  left_path: {
    text: "🔥 따뜻한 빛의 길을 따라가자 아름다운 마법의 샘이 나타납니다! 샘물은 황금빛으로 빛나고, 주변에는 반짝이는 크리스탈들이 빙글빙글 돌고 있습니다. 샘물에서 나오는 향기는 마치 천국의 향기 같습니다. 이 샘물을 마시면 엄청난 힘을 얻을 수 있을 것 같습니다. 샘물 주변에는 고대의 마법진이 그려져 있어서, 이곳이 신성한 장소임을 알 수 있습니다. 샘물의 물은 투명하면서도 황금빛으로 빛나며, 마치 살아있는 것처럼 움직입니다. 이 샘물을 마시면 마법의 힘을 얻을 수 있을 것 같지만, 신중하게 결정해야 합니다...",
    choices: [
      {
        text: "💧 황금빛 샘물을 마신다",
        next: "magic_spring",
        scoreA: 8,
        scoreB: 8,
        effect: { teamBNode: "strength_boost" },
      },
      {
        text: "🚶 샘물을 지나쳐서 계속 간다",
        next: "bypass_spring",
        scoreA: 3,
        scoreB: 3,
      },
    ],
  },
  right_path: {
    text: "❄️ 차가운 바람이 부는 길을 따라가자 고대의 함정들이 곳곳에 설치되어 있습니다! 바닥에는 복잡한 마법진이 그려져 있고, 벽에는 날카로운 화살들이 준비되어 있습니다. 이 함정들을 피해서 지나가거나, 아니면 용감하게 함정을 해제할 수 있습니다...",
    choices: [
      {
        text: "🦘 함정을 피해서 재빨리 지나간다",
        next: "avoid_trap",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "🔧 용감하게 함정을 해제한다",
        next: "disarm_trap",
        scoreA: 10,
        scoreB: 10,
        effect: { teamBNode: "trap_disabled" },
      },
    ],
  },
  temple_approach: {
    text: "🏛️ 드디어 고대 신전이 모습을 드러냅니다! 신전은 거대한 크리스탈로 만들어져 있어서 햇빛에 반짝반짝 빛납니다. 하지만 입구에는 거대한 돌 수호자가 서 있습니다. 수호자는 마치 살아있는 것처럼 움직이며, 누구든지 신전에 들어가려는 자를 막으려 합니다...",
    choices: [
      {
        text: "⚔️ 용감하게 정면으로 싸운다",
        next: "fight_guardian",
        scoreA: 7,
        scoreB: 7,
      },
      {
        text: "🦹 몰래 숨어서 들어간다",
        next: "stealth_enter",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  more_info: {
    text: "마을의 현자가 더 자세한 정보를 알려준다. 유물은 신전의 깊은 곳에 있다.",
    choices: [
      {
        text: "신전으로 이동한다",
        next: "temple_approach",
        scoreA: 2,
        scoreB: 2,
      },
      {
        text: "현자에게 도움을 요청한다",
        next: "sage_help",
        scoreA: 4,
        scoreB: 4,
      },
    ],
  },
  magic_spring: {
    text: "💧 황금빛 샘물을 마시자 순간 몸 안에 엄청난 힘이 폭발합니다! 마치 천개의 태양이 몸 안에서 빛나는 것 같습니다. 근육이 강해지고, 마법의 힘이 손끝에서 반짝입니다. 이제 어떤 적도 두렵지 않습니다!",
    choices: [
      {
        text: "⚡ 신전으로 향한다",
        next: "temple_approach_strong",
        scoreA: 3,
        scoreB: 3,
      },
      {
        text: "🔍 숲을 더 탐험한다",
        next: "forest_explore_strong",
        scoreA: 6,
        scoreB: 6,
      },
    ],
  },
  temple_approach_strong: {
    text: "⚡ 마법의 힘을 받은 상태로 신전에 도착했습니다! 수호자가 당신의 강한 기운을 느끼고 두려워하며 물러납니다. 돌 수호자의 눈이 당신을 바라보며 경외의 눈빛을 보냅니다. 이제 신전의 문이 당신 앞에서 저절로 열립니다!",
    choices: [
      {
        text: "⚔️ 당당하게 정면으로 들어간다",
        next: "fight_guardian_strong",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🦹 힘을 숨기고 몰래 들어간다",
        next: "stealth_enter_strong",
        scoreA: 8,
        scoreB: 8,
      },
    ],
  },
  forest_explore_strong: {
    text: "🔍 마법의 힘을 받은 상태로 숲을 탐험합니다! 동물들이 당신의 강한 기운을 느끼고 경외의 눈빛으로 바라봅니다. 작은 토끼부터 거대한 곰까지, 모든 동물들이 당신을 도와주려고 합니다. 마치 자연의 왕이 된 것 같은 느낌입니다!",
    choices: [
      {
        text: "🏛️ 신전으로 이동한다",
        next: "temple_approach_strong",
        scoreA: 4,
        scoreB: 4,
      },
      {
        text: "🐾 동물들과 함께 더 탐험한다",
        next: "animal_help",
        scoreA: 12,
        scoreB: 12,
      },
    ],
  },
  bypass_spring: {
    text: "🚶 샘물을 지나쳐서 계속 가자 새로운 길이 나타났습니다. 이 길은 마법의 숲의 깊은 곳으로 이어지는 것 같습니다. 나무들이 더욱 울창해지고, 공중에는 더 많은 마법의 입자들이 떠다닙니다. 갑자기 숲 속에서 이상한 소리가 들려옵니다. 누군가가 도움을 요청하는 것 같습니다. 소리가 나는 방향으로 가보니, 한 젊은이가 나무에 걸려서 도움을 요청하고 있습니다. 그는 자신의 이름을 밝히지 않고, 이 숲에서 길을 잃었다고 합니다. 그는 마법의 지식을 가지고 있다고 하는데, 도움을 주거나 무시할 수 있습니다...",
    choices: [
      {
        text: "🤝 이름 없는 사내를 도와준다",
        next: "help_sonseongmo",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "🚶 이름 없는 사내를 무시하고 지나간다",
        next: "ignore_sonseongmo",
        scoreA: 3,
        scoreB: 3,
      },
    ],
  },
  accept_sonseongmo_puzzle: {
    text: "🧩 손성모의 히든 퍼즐을 받아들였습니다! 손성모는 매우 기뻐하며, 당신들에게 시간의 퍼즐을 제시합니다. 이 퍼즐은 시간의 조각들을 모아서 완성하는 것으로, 모든 시간과 세계가 공존할 수 있는 방법을 알려줍니다. 손성모는 '이 퍼즐을 완성하면 루민과 아리아가 평행 세계에서 살아남을 수 있어요. 모든 시간이 하나로 합쳐져서 공존할 수 있게 됩니다.'라고 말합니다. 하지만 이 퍼즐을 푸는 과정에서 위험한 선택을 해야 할 수도 있고, 손성모의 진정한 의도를 의심해야 할 수도 있습니다. 손성모는 당신들의 결정에 따라 흑화할 가능성도 있다고 합니다...",
    choices: [
      {
        text: "🧩 퍼즐을 완성한다",
        next: "complete_sonseongmo_puzzle",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "⚡ 시간의 조각을 먼저 찾는다",
        next: "find_time_fragment_first",
        scoreA: 15,
        scoreB: 15,
      },
    ],
  },
  find_time_fragment_first: {
    text: "⚡ 손성모의 퍼즐보다 시간의 조각을 먼저 찾기로 결정했습니다! 시간의 조각은 시간의 계단 정상에 숨겨져 있다고 합니다. 계단을 계속 오르면서 시간의 흐름이 더욱 강해지고, 두 파티의 시간 지분 차이가 극에 달합니다. 계단의 정상에 도착하자, 거대한 시간의 조각이 빛나고 있습니다! 이 조각을 만지면 시간을 자유롭게 조종할 수 있게 됩니다. 하지만 동시에 세계에 균열이 생기고, 그림자 같은 존재들이 나타나기 시작합니다. 이제 결정해야 합니다: 시간의 조각을 사용해서 자신의 소망을 이루거나, 세계를 구하기 위해 조각을 포기하거나, 손성모의 퍼즐을 완성해서 모든 것을 해결할 수 있습니다...",
    choices: [
      {
        text: "💎 시간의 조각을 사용한다",
        next: "use_time_fragment",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "🌍 세계를 구한다",
        next: "save_world",
        scoreA: 16,
        scoreB: 16,
      },
    ],
  },
  complete_sonseongmo_puzzle: {
    text: "🧩 이름 없는 사내의 히든 퍼즐을 완성했습니다! 모든 시간의 조각들이 하나로 합쳐지면서, 아를리아 세계에 놀라운 변화가 일어납니다. 시간의 계단이 사라지고, 대신 모든 시간이 공존하는 평행 세계가 만들어집니다. 루민과 아리아는 이제 평행 세계에서 함께 살 수 있게 되었고, 모든 시간이 하나로 합쳐져서 공존할 수 있게 되었습니다. 갑자기 이름 없는 사내의 모습이 변하기 시작합니다. 그의 주변에 시간의 파편들이 빛나며, 마치 시간 그 자체처럼 보이기 시작합니다. '내 이름은 손성모입니다. 시간의 기록자이자 아를리아의 수호자입니다.'라고 말하며 미소 짓습니다. '너희 선택이 시간을 바꾼 것이 아니라, 시간을 이어낸 것이다. 이제 모든 것이 가능해졌어요.' 이제 두 파티는 시간을 자유롭게 여행할 수 있는 힘을 얻었고, 아를리아 세계는 새로운 평형을 찾았습니다. 이것이 진정한 히든 엔딩입니다!",
    choices: [],
  },
  use_time_fragment: {
    text: "💎 시간의 조각을 사용하기로 결정했습니다! 조각을 만지는 순간, 당신은 시간을 자유롭게 조종할 수 있는 힘을 얻었습니다. 하지만 이 선택으로 인해 세계에 균열이 생기고, 그림자 같은 존재들이 대량으로 나타나기 시작합니다. 하늘에는 거대한 균열이 생기고, 시간이 불안정해집니다. 아리아가 나타나서 당신을 비난합니다. '당신의 선택으로 세계가 위험해졌어요!'라고 말하며 사라집니다. 이제 당신은 강력한 힘을 얻었지만, 그 대가로 세계와 아리아를 잃게 되었습니다. 하지만 손성모가 나타나서 마지막 기회를 제공합니다. 그의 퍼즐을 완성하면 모든 것을 되돌릴 수 있다고 합니다...",
    choices: [
      {
        text: "🧩 손성모의 퍼즐을 완성한다",
        next: "complete_sonseongmo_puzzle",
        scoreA: 22,
        scoreB: 22,
      },
      {
        text: "💀 손성모를 무시한다",
        next: "ignore_sonseongmo_dark",
        scoreA: 25,
        scoreB: 25,
      },
    ],
  },
  save_world: {
    text: "🌍 세계를 구하기 위해 시간의 조각을 포기하기로 결정했습니다! 조각을 놓는 순간, 세계의 균열이 치유되기 시작하고, 그림자 같은 존재들이 사라집니다. 아리아가 나타나서 당신을 칭찬합니다. '당신의 선택으로 세계가 구해졌어요. 하지만 이제 우리는 영원히 헤어져야 해요.'라고 말하며 눈물을 흘립니다. 당신은 세계를 구했지만, 그 대가로 아리아와 영원히 이별하게 되었습니다. 시간의 조각은 사라지고, 시간의 계단도 원래대로 돌아갑니다. 하지만 손성모가 나타나서 희망의 메시지를 전합니다. '모든 것이 끝난 것은 아니에요. 언젠가 다시 만날 수 있을 거예요.'라고 말하며 사라집니다...",
    choices: [
      {
        text: "🔮 새로운 모험을 시작한다",
        next: "start_new_adventure",
        scoreA: 50,
        scoreB: 50,
      },
      {
        text: "🏠 고향으로 돌아간다",
        next: "return_to_hometown",
        scoreA: 30,
        scoreB: 30,
      },
      {
        text: "🌍 세계를 더 탐험한다",
        next: "explore_world_more",
        scoreA: 40,
        scoreB: 40,
      },
      {
        text: "📚 지식을 전수한다",
        next: "teach_time_knowledge",
        scoreA: 60,
        scoreB: 60,
      },
    ],
  },
  ignore_sonseongmo_dark: {
    text: "💀 이름 없는 사내를 무시하고 시간의 조각의 힘을 계속 사용하기로 결정했습니다! 이 선택으로 인해 이름 없는 사내가 흑화하기 시작합니다. 갑자기 그의 모습이 변하기 시작하고, 주변에 어둠의 기운이 감돕니다. '내 이름은 손성모입니다. 시간의 기록자이자 아를리아의 수호자였지만, 너희들이 시간을 망가뜨렸다!'라고 외치며, 세계를 자신의 뜻대로 재편하기 시작합니다. 균열이 폭발적으로 확대되고, 시간이 완전히 불안정해집니다. 루민과 아리아는 시간 속에 갇히게 되고, 손성모가 세계를 장악합니다. 이것이 손성모 흑화 엔딩입니다. 손성모는 마지막 메시지를 남깁니다. '너희 선택이 시간을 바꾼 것이 아니라, 시간을 파괴한 것이다. 이제 모든 것이 내 뜻대로다.'라고 말하며 사라집니다. 세계는 손성모의 통치 하에 들어가게 되었습니다...",
    choices: [],
  },
  // 손성모 히든 캐릭터 노드들
  help_sonseongmo: {
    text: "🤝 이름 없는 사내를 도와주기로 결정했습니다! 나무에서 그를 구출하자, 그는 매우 감사해하며 자신의 마법 지식을 공유해주겠다고 합니다. 그는 고대 마법사들의 후손으로, 이 숲의 비밀을 많이 알고 있다고 합니다. 그는 신전의 비밀 통로와 함정들의 위치, 그리고 '시간의 보석'에 대한 중요한 정보를 가지고 있습니다. 이름 없는 사내는 당신의 친절함에 감동받아 함께 모험을 떠나겠다고 제안합니다. 그의 도움을 받으면 훨씬 안전하고 효율적으로 보석을 찾을 수 있을 것 같습니다...",
    choices: [
      {
        text: "🤝 이름 없는 사내와 함께 모험한다",
        next: "adventure_with_sonseongmo",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "📚 이름 없는 사내로부터 정보만 받고 따로 간다",
        next: "get_info_from_sonseongmo",
        scoreA: 7,
        scoreB: 7,
      },
    ],
  },
  ignore_sonseongmo: {
    text: "🚶 이름 없는 사내를 무시하고 지나가기로 결정했습니다. 그는 당신을 향해 도움을 요청했지만, 당신은 자신의 목표에 집중하기로 했습니다. 이름 없는 사내는 실망한 표정으로 당신을 바라보며, '당신은 진정한 영웅이 아니군요'라고 말합니다. 하지만 당신은 신전으로 향하는 길을 계속 나아갑니다. 혼자서라도 충분히 보석을 찾을 수 있을 것 같습니다...",
    choices: [
      {
        text: "🏛️ 신전으로 직접 향한다",
        next: "temple_approach_weak",
        scoreA: 2,
        scoreB: 2,
      },
      {
        text: "🌲 다른 길을 찾는다",
        next: "find_alternative_weak",
        scoreA: 4,
        scoreB: 4,
      },
    ],
  },
  adventure_with_sonseongmo: {
    text: "🤝 이름 없는 사내와 함께 모험을 떠나기로 결정했습니다! 그는 매우 기뻐하며, 자신의 마법 지식을 총동원해서 당신을 도와주겠다고 합니다. 그는 고대 마법사들의 비밀 지식을 가지고 있어서, 숲의 모든 함정과 비밀을 알고 있습니다. 이름 없는 사내는 마법의 지팡이를 꺼내어 길을 밝혀주고, 위험한 생물들을 마법으로 물리쳐줍니다. 그의 도움으로 신전까지 안전하게 도착할 수 있을 것 같습니다. 그는 '우리는 좋은 팀이 될 것 같아요'라고 말하며 미소 짓습니다...",
    choices: [
      {
        text: "🏛️ 이름 없는 사내와 함께 신전으로 향한다",
        next: "temple_approach_with_sonseongmo",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "🕵️ 손성모와 함께 비밀 통로를 찾는다",
        next: "secret_path_with_sonseongmo",
        scoreA: 15,
        scoreB: 15,
      },
    ],
  },
  get_info_from_sonseongmo: {
    text: "📚 손성모로부터 정보만 받기로 결정했습니다. 손성모는 약간 실망한 표정이지만, 당신의 결정을 존중해주며 중요한 정보들을 알려줍니다. 그는 신전의 비밀 통로 위치, 함정들의 패턴, 그리고 '시간의 보석'이 숨겨진 정확한 위치를 알려줍니다. 또한 신전의 수호자들의 약점과 대처 방법도 가르쳐줍니다. 손성모는 '조심하세요. 신전은 생각보다 위험합니다'라고 말하며 당신을 걱정해줍니다. 이제 이 정보를 바탕으로 더 안전하게 모험을 계속할 수 있을 것 같습니다...",
    choices: [
      {
        text: "🏛️ 정보를 바탕으로 신전으로 향한다",
        next: "temple_approach_with_info",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🕵️ 비밀 통로를 찾아 신전으로 향한다",
        next: "secret_path_with_info",
        scoreA: 11,
        scoreB: 11,
      },
    ],
  },
  temple_approach_weak: {
    text: "💪 체력이 부족한 상태로 신전에 도착했습니다. 신전은 거대한 크리스탈로 만들어져 있어서 햇빛에 반짝반짝 빛납니다. 하지만 입구에는 거대한 돌 수호자가 서 있습니다. 수호자는 마치 살아있는 것처럼 움직이며, 당신의 약한 기운을 느끼고 자신만만해합니다. 수호자는 '약한 자는 이곳에 들어올 수 없다!'라고 외치며 당신을 막으려 합니다. 하지만 당신은 의지의 힘으로 이 도전을 극복해야 합니다...",
    choices: [
      {
        text: "⚔️ 정면으로 싸운다",
        next: "fight_guardian_weak",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🕵️ 몰래 들어간다",
        next: "stealth_enter_weak",
        scoreA: 3,
        scoreB: 3,
      },
    ],
  },
  temple_approach_with_sonseongmo: {
    text: "🏛️ 손성모와 함께 신전에 도착했습니다! 손성모의 마법 지식 덕분에 신전까지 안전하게 도착할 수 있었습니다. 신전은 거대한 크리스탈로 만들어져 있어서 햇빛에 반짝반짝 빛납니다. 입구에는 거대한 돌 수호자가 서 있지만, 손성모가 마법의 주문을 외우자 수호자가 당신들을 인정하고 길을 열어줍니다. 손성모는 '고대 마법사들의 후손이라서 수호자가 인정해주는 것 같아요'라고 말합니다. 이제 손성모와 함께 신전 안으로 들어갈 수 있습니다...",
    choices: [
      {
        text: "🤝 손성모와 함께 신전 안으로 들어간다",
        next: "temple_inside_with_sonseongmo",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🕵️ 손성모의 도움으로 비밀 통로를 찾는다",
        next: "secret_path_with_sonseongmo",
        scoreA: 18,
        scoreB: 18,
      },
    ],
  },
  secret_path_with_sonseongmo: {
    text: "🕵️ 손성모의 도움으로 신전의 비밀 통로를 발견했습니다! 손성모는 고대 마법사들의 지식을 사용하여 숨겨진 문을 열어줍니다. 비밀 통로는 아무도 모르는 길로, 신전의 가장 깊은 곳까지 직접 갈 수 있습니다. 통로 안에는 고대의 마법이 깃들어 있어서, 손성모의 마법 지식이 빛을 발합니다. 그는 통로의 모든 함정과 비밀을 알고 있어서, 완벽하게 안전하게 지나갈 수 있습니다. 손성모는 '이 길로 가면 '시간의 보석'에 바로 도달할 수 있어요'라고 말합니다...",
    choices: [
      {
        text: "💎 손성모와 함께 보석을 찾는다",
        next: "find_gem_with_sonseongmo",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "🛡️ 손성모와 함께 신전을 탐험한다",
        next: "explore_temple_with_sonseongmo",
        scoreA: 17,
        scoreB: 17,
      },
    ],
  },
  temple_approach_with_info: {
    text: "🏛️ 손성모로부터 받은 정보를 바탕으로 신전에 도착했습니다! 손성모가 알려준 정보 덕분에 신전의 구조와 함정들을 미리 파악할 수 있었습니다. 신전은 거대한 크리스탈로 만들어져 있어서 햇빛에 반짝반짝 빛납니다. 입구에는 거대한 돌 수호자가 서 있지만, 손성모가 알려준 약점을 이용하여 수호자를 물리칠 수 있습니다. 수호자는 '당신은 이곳의 비밀을 알고 있군요!'라고 말하며 당신을 인정합니다. 이제 정보를 바탕으로 신전 안으로 들어갈 수 있습니다...",
    choices: [
      {
        text: "🏛️ 정보를 바탕으로 신전 안으로 들어간다",
        next: "temple_inside_with_info",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🕵️ 정보를 바탕으로 비밀 통로를 찾는다",
        next: "secret_path_with_info",
        scoreA: 13,
        scoreB: 13,
      },
    ],
  },
  secret_path_with_info: {
    text: "🕵️ 손성모로부터 받은 정보를 바탕으로 신전의 비밀 통로를 발견했습니다! 손성모가 알려준 정확한 위치와 방법을 사용하여 숨겨진 문을 열 수 있었습니다. 비밀 통로는 아무도 모르는 길로, 신전의 가장 깊은 곳까지 직접 갈 수 있습니다. 통로 안에는 고대의 함정들이 설치되어 있지만, 손성모가 알려준 정보 덕분에 모든 함정을 피해 안전하게 지나갈 수 있습니다. 이 길로 가면 '시간의 보석'에 바로 도달할 수 있을 것 같습니다...",
    choices: [
      {
        text: "💎 정보를 바탕으로 보석을 찾는다",
        next: "find_gem_with_info",
        scoreA: 16,
        scoreB: 16,
      },
      {
        text: "🛡️ 정보를 바탕으로 신전을 탐험한다",
        next: "explore_temple_with_info",
        scoreA: 14,
        scoreB: 14,
      },
    ],
  },
  find_gem_with_sonseongmo: {
    text: "💎 손성모와 함께 전설의 '시간의 보석'을 발견했습니다! 손성모의 마법 지식 덕분에 보석이 숨겨진 정확한 위치를 찾을 수 있었습니다. 보석은 당신의 손에서 무지개빛으로 빛나며, 시간의 흐름을 느낄 수 있습니다. 보석을 만지는 순간, 과거와 미래의 환영이 주변에 나타나고, 신전 전체가 당신들의 성공을 축하하는 것처럼 빛나기 시작합니다. 손성모는 '우리가 함께 찾은 보석이에요. 이제 시간을 자유롭게 여행할 수 있어요!'라고 말하며 기뻐합니다. 하지만 보석을 얻은 순간, 신전이 무너지기 시작하여 긴급한 상황이 발생했습니다!",
    choices: [
      {
        text: "🏃 손성모와 함께 빠르게 탈출한다",
        next: "escape_with_sonseongmo",
        scoreA: 22,
        scoreB: 22,
      },
      {
        text: "💎 손성모와 함께 다른 보물도 찾는다",
        next: "find_more_treasure_with_sonseongmo",
        scoreA: 25,
        scoreB: 25,
      },
    ],
  },
  explore_temple_with_sonseongmo: {
    text: "🛡️ 손성모와 함께 신전을 탐험한 결과, 고대의 모든 비밀을 발견했습니다! 손성모의 마법 지식 덕분에 신전의 모든 비밀을 알아낼 수 있었습니다. 전설의 '시간의 보석'뿐만 아니라, 고대의 마법서, 황금빛 갑옷, 마법의 검, 그리고 신전에 숨겨진 모든 비밀 보물들을 함께 발견했습니다. 손성모는 '이 모든 것이 우리의 협력 덕분이에요. 진정한 모험가가 되었네요!'라고 말합니다. 신전의 모든 보물이 두 사람의 협력을 인정하여 빛나고 있습니다. 이제 두 사람은 부와 힘을 모두 가진 전설적인 모험가가 되었습니다!",
    choices: [],
  },
  find_gem_with_info: {
    text: "💎 손성모로부터 받은 정보를 바탕으로 전설의 '시간의 보석'을 발견했습니다! 손성모가 알려준 정확한 정보 덕분에 보석을 쉽게 찾을 수 있었습니다. 보석은 당신의 손에서 무지개빛으로 빛나며, 시간의 흐름을 느낄 수 있습니다. 보석을 만지는 순간, 과거와 미래의 환영이 주변에 나타나고, 신전 전체가 당신의 성공을 축하하는 것처럼 빛나기 시작합니다. 손성모의 정보가 없었다면 이렇게 쉽게 보석을 찾을 수 없었을 것입니다. 하지만 보석을 얻은 순간, 신전이 무너지기 시작하여 긴급한 상황이 발생했습니다!",
    choices: [
      {
        text: "🏃 정보를 바탕으로 빠르게 탈출한다",
        next: "escape_with_info",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "💎 정보를 바탕으로 다른 보물도 찾는다",
        next: "find_more_treasure_with_info",
        scoreA: 21,
        scoreB: 21,
      },
    ],
  },
  explore_temple_with_info: {
    text: "🛡️ 손성모로부터 받은 정보를 바탕으로 신전을 탐험한 결과, 고대의 모든 비밀을 발견했습니다! 손성모가 알려준 정보 덕분에 신전의 모든 함정과 비밀을 미리 파악할 수 있었습니다. 전설의 '시간의 보석'뿐만 아니라, 고대의 마법서, 황금빛 갑옷, 마법의 검, 그리고 신전에 숨겨진 모든 비밀 보물들을 발견했습니다. 손성모의 정보가 없었다면 이렇게 완벽하게 탐험할 수 없었을 것입니다. 신전의 모든 보물이 당신의 지혜를 인정하여 빛나고 있습니다. 이제 당신은 부와 힘을 모두 가진 전설적인 모험가가 되었습니다!",
    choices: [],
  },
  escape_with_sonseongmo: {
    text: "🏃 손성모와 함께 신전이 무너지기 전에 완벽하게 탈출했습니다! 손성모의 마법 덕분에 무너지는 돌들을 피해 빠르게 신전을 빠져나올 수 있었습니다. 탈출하는 순간, 신전이 완전히 무너지면서 거대한 먼지 구름이 하늘로 치솟았습니다. 하지만 당신들은 안전하게 탈출하여 전설의 '시간의 보석'과 함께 영웅이 되었습니다! 손성모는 '우리가 함께한 모험이 정말 멋졌어요. 이제 시간을 자유롭게 여행할 수 있어요!'라고 말합니다. 이제 두 사람은 시간을 자유롭게 여행할 수 있는 힘을 함께 가질 수 있습니다!",
    choices: [],
  },
  find_more_treasure_with_sonseongmo: {
    text: "💎 손성모와 함께 신전에서 엄청난 보물들을 발견했습니다! 전설의 '시간의 보석'뿐만 아니라, 고대의 마법서, 황금빛 갑옷, 마법의 검, 그리고 수많은 보석들을 함께 발견했습니다. 손성모의 마법 지식 덕분에 신전의 모든 비밀 보물을 찾을 수 있었습니다. 신전의 모든 보물이 두 사람의 협력을 인정하여 빛나고 있습니다. 손성모는 '우리가 함께 찾은 모든 보물이에요. 진정한 모험가가 되었네요!'라고 말합니다. 이제 두 사람은 부와 힘을 모두 가진 전설적인 영웅이 되었습니다! 시간을 자유롭게 여행할 수 있는 힘과 함께, 고대의 모든 보물을 손에 넣었습니다!",
    choices: [],
  },
  escape_with_info: {
    text: "🏃 손성모로부터 받은 정보를 바탕으로 신전이 무너지기 전에 완벽하게 탈출했습니다! 손성모가 알려준 탈출 경로 덕분에 무너지는 돌들을 피해 빠르게 신전을 빠져나올 수 있었습니다. 탈출하는 순간, 신전이 완전히 무너지면서 거대한 먼지 구름이 하늘로 치솟았습니다. 하지만 당신은 안전하게 탈출하여 전설의 '시간의 보석'과 함께 영웅이 되었습니다! 손성모의 정보가 없었다면 이렇게 안전하게 탈출할 수 없었을 것입니다. 이제 당신은 시간을 자유롭게 여행할 수 있는 힘을 손에 넣었습니다!",
    choices: [],
  },
  find_more_treasure_with_info: {
    text: "💎 손성모로부터 받은 정보를 바탕으로 신전에서 엄청난 보물들을 발견했습니다! 전설의 '시간의 보석'뿐만 아니라, 고대의 마법서, 황금빛 갑옷, 마법의 검, 그리고 수많은 보석들을 발견했습니다. 손성모가 알려준 정보 덕분에 신전의 모든 비밀 보물을 찾을 수 있었습니다. 신전의 모든 보물이 당신의 지혜를 인정하여 빛나고 있습니다. 손성모의 정보가 없었다면 이렇게 완벽하게 보물을 찾을 수 없었을 것입니다. 이제 당신은 부와 힘을 모두 가진 전설적인 영웅이 되었습니다! 시간을 자유롭게 여행할 수 있는 힘과 함께, 고대의 모든 보물을 손에 넣었습니다!",
    choices: [],
  },
  find_alternative_weak: {
    text: "체력이 부족한 상태로 새로운 길을 찾는다. 더 안전한 길을 발견했다.",
    choices: [
      {
        text: "새로운 길을 따라간다",
        next: "new_path_weak",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "신전으로 돌아간다",
        next: "temple_approach_weak",
        scoreA: 2,
        scoreB: 2,
      },
    ],
  },
  avoid_trap: {
    text: "함정을 피해 안전하게 지나갔다.",
    choices: [
      {
        text: "신전으로 이동한다",
        next: "temple_approach",
        scoreA: 3,
        scoreB: 3,
      },
      {
        text: "숲을 더 탐험한다",
        next: "forest_explore",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  disarm_trap: {
    text: "함정을 성공적으로 해제했다! 다른 모험가들도 안전하게 지나갈 수 있다.",
    choices: [
      {
        text: "신전으로 이동한다",
        next: "temple_approach",
        scoreA: 4,
        scoreB: 4,
      },
      {
        text: "숲을 더 탐험한다",
        next: "forest_explore",
        scoreA: 7,
        scoreB: 7,
      },
    ],
  },
  fight_guardian: {
    text: "수호자와의 치열한 전투! 승리했지만 체력이 많이 소모되었다.",
    choices: [
      {
        text: "신전 안으로 들어간다",
        next: "temple_inside",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "휴식을 취한다",
        next: "rest_temple",
        scoreA: 2,
        scoreB: 2,
      },
    ],
  },
  stealth_enter: {
    text: "조용히 신전에 들어왔다. 수호자를 피해 성공했다!",
    choices: [
      {
        text: "신전 안을 탐험한다",
        next: "temple_inside",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "더 조용히 움직인다",
        next: "temple_inside",
        scoreA: 4,
        scoreB: 4,
      },
    ],
  },
  sage_help: {
    text: "현자가 특별한 마법 아이템을 주었다. 이것이 도움이 될 것이다.",
    choices: [
      {
        text: "신전으로 이동한다",
        next: "temple_approach",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "아이템을 사용해본다",
        next: "use_item",
        scoreA: 3,
        scoreB: 3,
      },
    ],
  },
  forest_explore: {
    text: "숲 깊은 곳에서 고대의 비밀을 발견했다!",
    choices: [
      {
        text: "신전으로 이동한다",
        next: "temple_approach",
        scoreA: 4,
        scoreB: 4,
      },
      {
        text: "더 탐험한다",
        next: "deep_forest",
        scoreA: 8,
        scoreB: 8,
      },
    ],
  },
  find_alternative: {
    text: "새로운 길을 발견했다. 이 길이 더 안전할 것 같다.",
    choices: [
      {
        text: "새로운 길을 따라간다",
        next: "new_path",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "신전으로 돌아간다",
        next: "temple_approach",
        scoreA: 2,
        scoreB: 2,
      },
    ],
  },
  temple_inside: {
    text: "신전 안은 고대의 마법으로 가득하다. 전설의 유물이 보인다!",
    choices: [
      {
        text: "유물을 가져간다",
        next: "get_relic",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "신중하게 접근한다",
        next: "careful_approach",
        scoreA: 10,
        scoreB: 10,
      },
    ],
  },
  rest_temple: {
    text: "휴식을 취한 후 체력을 회복했다.",
    choices: [
      {
        text: "신전 안으로 들어간다",
        next: "temple_inside",
        scoreA: 3,
        scoreB: 3,
      },
      {
        text: "더 휴식을 취한다",
        next: "temple_inside",
        scoreA: 1,
        scoreB: 1,
      },
    ],
  },
  use_item: {
    text: "마법 아이템이 신전의 비밀을 밝혀냈다!",
    choices: [
      {
        text: "신전으로 이동한다",
        next: "temple_approach",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "더 많은 비밀을 찾는다",
        next: "find_secrets",
        scoreA: 8,
        scoreB: 8,
      },
    ],
  },
  deep_forest: {
    text: "숲의 가장 깊은 곳에서 고대의 지혜를 얻었다!",
    choices: [
      {
        text: "신전으로 이동한다",
        next: "temple_approach",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "지혜를 활용한다",
        next: "use_wisdom",
        scoreA: 10,
        scoreB: 10,
      },
    ],
  },
  new_path: {
    text: "새로운 길이 신전으로 직접 연결되어 있다!",
    choices: [
      {
        text: "신전으로 들어간다",
        next: "temple_inside",
        scoreA: 7,
        scoreB: 7,
      },
      {
        text: "길을 더 탐험한다",
        next: "explore_path",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  get_relic: {
    text: "전설의 유물을 획득했다! 하지만 신전이 무너지기 시작한다.",
    choices: [
      {
        text: "빠르게 탈출한다",
        next: "escape_temple",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "다른 보물도 찾는다",
        next: "find_more_treasure",
        scoreA: 18,
        scoreB: 18,
      },
    ],
  },
  careful_approach: {
    text: "신중하게 접근한 결과, 유물을 안전하게 획득했다!",
    choices: [
      {
        text: "신전을 떠난다",
        next: "leave_temple",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "더 탐험한다",
        next: "explore_more",
        scoreA: 12,
        scoreB: 12,
      },
    ],
  },
  find_secrets: {
    text: "신전의 숨겨진 비밀을 발견했다!",
    choices: [
      {
        text: "신전으로 이동한다",
        next: "temple_approach",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "비밀을 활용한다",
        next: "use_secrets",
        scoreA: 15,
        scoreB: 15,
      },
    ],
  },
  use_wisdom: {
    text: "고대의 지혜를 활용해 신전의 모든 비밀을 알게 되었다!",
    choices: [
      {
        text: "신전으로 이동한다",
        next: "temple_approach",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "지혜를 전파한다",
        next: "spread_wisdom",
        scoreA: 20,
        scoreB: 20,
      },
    ],
  },
  explore_path: {
    text: "길을 더 탐험한 결과, 숨겨진 보물을 발견했다!",
    choices: [
      {
        text: "신전으로 이동한다",
        next: "temple_inside",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "보물을 더 찾는다",
        next: "find_more_treasure",
        scoreA: 15,
        scoreB: 15,
      },
    ],
  },
  escape_temple: {
    text: "신전이 무너지기 전에 성공적으로 탈출했다!",
    choices: [],
  },
  leave_temple: {
    text: "유물을 안전하게 가지고 신전을 떠났다.",
    choices: [],
  },
  explore_more: {
    text: "신전을 더 탐험한 결과, 엄청난 보물을 발견했다!",
    choices: [],
  },
  use_secrets: {
    text: "신전의 비밀을 활용해 전설의 유물을 완벽하게 획득했다!",
    choices: [],
  },
  spread_wisdom: {
    text: "고대의 지혜를 세상에 전파했다! 이것이 가장 큰 성취다.",
    choices: [],
  },
  find_more_treasure: {
    text: "신전에서 엄청난 보물들을 발견했다! 전설적인 모험이 완성되었다.",
    choices: [],
  },
  // 새로운 스토리 노드들
  fight_guardian_strong: {
    text: "마법의 힘을 받은 상태로 수호자와 싸운다. 강력한 마법으로 수호자를 물리쳤다!",
    choices: [
      {
        text: "신전 안으로 들어간다",
        next: "temple_inside_strong",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "수호자의 무기를 획득한다",
        next: "get_guardian_weapon",
        scoreA: 15,
        scoreB: 15,
      },
    ],
  },
  stealth_enter_strong: {
    text: "마법의 힘으로 완벽하게 숨겨진 상태로 신전에 들어왔다. 아무도 당신을 발견하지 못했다!",
    choices: [
      {
        text: "신전 안을 탐험한다",
        next: "temple_inside_strong",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "더 조용히 움직인다",
        next: "temple_inside_strong",
        scoreA: 6,
        scoreB: 6,
      },
    ],
  },
  animal_help: {
    text: "🐾 동물들과 함께 탐험한 결과, 숨겨진 비밀 통로를 발견했습니다! 작은 두더지가 땅속에서 신전으로 이어지는 비밀 터널을 보여줍니다. 이 터널은 아무도 모르는 길로, 신전의 가장 깊은 곳까지 직접 갈 수 있습니다. 동물들이 당신을 신뢰하고 도와주고 있습니다!",
    choices: [
      {
        text: "🕳️ 비밀 통로를 통해 신전으로 이동한다",
        next: "temple_inside_secret",
        scoreA: 14,
        scoreB: 14,
      },
      {
        text: "🌲 동물들과 더 탐험한다",
        next: "deep_forest_animals",
        scoreA: 16,
        scoreB: 16,
      },
    ],
  },
  fight_guardian_weak: {
    text: "체력이 부족한 상태로 수호자와 싸운다. 힘들게 싸웠지만 결국 승리했다.",
    choices: [
      {
        text: "신전 안으로 들어간다",
        next: "temple_inside_weak",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "휴식을 취한다",
        next: "rest_after_fight",
        scoreA: 3,
        scoreB: 3,
      },
    ],
  },
  stealth_enter_weak: {
    text: "체력이 부족한 상태로 조용히 신전에 들어왔다. 수호자를 피해 성공했다.",
    choices: [
      {
        text: "신전 안을 탐험한다",
        next: "temple_inside_weak",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "더 조용히 움직인다",
        next: "temple_inside_weak",
        scoreA: 4,
        scoreB: 4,
      },
    ],
  },
  new_path_weak: {
    text: "체력이 부족한 상태로 새로운 길을 따라간다. 이 길이 더 안전할 것 같다.",
    choices: [
      {
        text: "신전으로 들어간다",
        next: "temple_inside_weak",
        scoreA: 7,
        scoreB: 7,
      },
      {
        text: "길을 더 탐험한다",
        next: "explore_path_weak",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  temple_inside_strong: {
    text: "✨ 마법의 힘을 받은 상태로 신전 안에 들어왔습니다! 고대의 마법이 당신을 인정하여 몸에서 황금빛 오라가 퍼져나가고 있습니다. 신전 내부는 마치 살아있는 것처럼 반응하여, 벽의 마법석들이 당신을 향해 빛나고, 공중에는 축복의 빛이 내려옵니다. 전설의 '시간의 보석'이 당신을 기다리고 있는 것 같습니다. 신전의 모든 마법이 당신의 강력한 힘을 인정하고 있습니다...",
    choices: [
      {
        text: "💎 유물을 획득한다",
        next: "get_relic_strong",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "🔍 신중하게 탐험한다",
        next: "careful_approach_strong",
        scoreA: 15,
        scoreB: 15,
      },
    ],
  },
  temple_inside_weak: {
    text: "💪 체력이 부족한 상태로 신전 안에 들어왔지만, 의지의 힘으로 계속 나아갑니다! 신전 내부는 고대의 마법으로 가득 차 있어서 공중에 떠다니는 마법의 구체들이 반짝이고 있습니다. 벽에는 고대의 문자가 빛나고, 바닥에는 복잡한 마법진이 그려져 있습니다. 전설의 '시간의 보석'이 어딘가에 숨겨져 있을 것 같습니다...",
    choices: [
      {
        text: "💎 유물을 찾아 나선다",
        next: "get_relic_weak",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "🔍 신중하게 탐험한다",
        next: "careful_approach_weak",
        scoreA: 10,
        scoreB: 10,
      },
    ],
  },
  temple_inside_secret: {
    text: "🕵️ 비밀 통로를 통해 신전 안에 완벽하게 침입했습니다! 아무도 모르는 길로 들어와서 완전히 유리한 위치에 있습니다. 신전 내부는 마치 꿈속의 궁전 같아서, 황금빛 기둥들이 하늘을 향해 뻗어 있고, 천장에는 반짝이는 별들이 떠다닙니다. 바닥은 투명한 크리스탈로 만들어져 있어서 아래쪽의 무한한 심연이 보입니다. 전설의 '시간의 보석'이 바로 앞에 있을 것 같습니다...",
    choices: [
      {
        text: "💎 유물을 획득한다",
        next: "get_relic_secret",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "🔍 신중하게 접근한다",
        next: "careful_approach_secret",
        scoreA: 16,
        scoreB: 16,
      },
    ],
  },
  get_relic_strong: {
    text: "🌟 마법의 힘으로 전설의 '시간의 보석'을 완벽하게 획득했습니다! 보석은 당신의 손에서 무지개빛으로 빛나며, 시간의 흐름을 느낄 수 있습니다. 보석을 만지는 순간, 과거와 미래의 환영이 주변에 나타나고, 신전 전체가 당신의 성공을 축하하는 것처럼 빛나기 시작합니다. 하지만 보석을 얻은 순간, 신전이 무너지기 시작하여 긴급한 상황이 발생했습니다!",
    choices: [
      {
        text: "🏃 빠르게 탈출한다",
        next: "escape_temple_strong",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "💎 다른 보물도 찾는다",
        next: "find_more_treasure_strong",
        scoreA: 22,
        scoreB: 22,
      },
    ],
  },
  get_relic_weak: {
    text: "💪 체력이 부족한 상태였지만, 의지의 힘으로 전설의 '시간의 보석'을 획득했습니다! 보석을 만지는 순간, 피로했던 몸에 새로운 힘이 들어오고, 시간의 흐름을 느낄 수 있습니다. 보석은 당신의 용기를 인정하여 따뜻한 빛을 내며, 신전 전체가 당신의 성공을 축하하는 것처럼 반짝입니다. 하지만 보석을 얻은 순간, 신전이 무너지기 시작하여 위험한 상황이 발생했습니다!",
    choices: [
      {
        text: "🏃 빠르게 탈출한다",
        next: "escape_temple_weak",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "💎 다른 보물도 찾는다",
        next: "find_more_treasure_weak",
        scoreA: 18,
        scoreB: 18,
      },
    ],
  },
  get_relic_secret: {
    text: "🕵️ 비밀 통로를 통해 완벽하게 전설의 '시간의 보석'을 획득했습니다! 아무도 모르는 길로 들어와서 완벽한 성공을 거두었습니다. 보석은 당신의 지혜를 인정하여 특별한 빛을 내며, 시간의 흐름을 자유롭게 조작할 수 있는 힘을 느낄 수 있습니다. 신전의 모든 비밀을 알아낸 당신은 진정한 모험가입니다. 전설적인 모험이 완성되었습니다!",
    choices: [
      {
        text: "🕳️ 비밀 통로로 탈출한다",
        next: "escape_temple_secret",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "💎 다른 보물도 찾는다",
        next: "find_more_treasure_secret",
        scoreA: 25,
        scoreB: 25,
      },
    ],
  },
  escape_temple_strong: {
    text: "🌟 마법의 힘으로 신전이 무너지기 전에 완벽하게 탈출했습니다! 강력한 마법을 사용하여 무너지는 돌들을 피해 빠르게 신전을 빠져나왔습니다. 탈출하는 순간, 신전이 완전히 무너지면서 거대한 먼지 구름이 하늘로 치솟았습니다. 하지만 당신은 안전하게 탈출하여 전설의 '시간의 보석'과 함께 영웅이 되었습니다! 이제 시간을 자유롭게 여행할 수 있는 힘을 손에 넣었습니다!",
    choices: [],
  },
  escape_temple_weak: {
    text: "💪 체력이 부족했지만 의지의 힘으로 신전이 무너지기 전에 탈출했습니다! 피로한 몸을 이끌고 무너지는 신전을 빠져나오는 것은 쉽지 않았지만, 전설의 '시간의 보석'을 얻었다는 성취감이 모든 고통을 잊게 했습니다. 탈출하는 순간, 신전이 완전히 무너지면서 거대한 소리가 울렸습니다. 당신의 용기와 의지가 전설적인 모험을 완성시켰습니다!",
    choices: [],
  },
  escape_temple_secret: {
    text: "🕵️ 비밀 통로를 통해 완벽하게 탈출했습니다! 아무도 모르는 길로 들어와서 아무도 모르는 길로 나왔습니다. 신전이 무너지는 소리가 멀리서 들려오지만, 당신은 안전한 비밀 통로를 통해 완벽하게 탈출했습니다. 전설의 '시간의 보석'을 손에 넣고, 신전의 모든 비밀을 알아낸 진정한 모험가가 되었습니다! 이제 시간을 자유롭게 여행할 수 있는 힘을 손에 넣었습니다!",
    choices: [],
  },
  find_more_treasure_strong: {
    text: "🌟 마법의 힘으로 신전에서 엄청난 보물들을 발견했습니다! 전설의 '시간의 보석'뿐만 아니라, 고대의 마법서, 황금빛 갑옷, 마법의 검, 그리고 수많은 보석들을 발견했습니다. 신전의 모든 보물이 당신의 강력한 힘을 인정하여 빛나고 있습니다. 이제 당신은 부와 힘을 모두 가진 전설적인 영웅이 되었습니다! 시간을 자유롭게 여행할 수 있는 힘과 함께, 고대의 모든 보물을 손에 넣었습니다!",
    choices: [],
  },
  find_more_treasure_weak: {
    text: "💪 체력이 부족했지만 의지의 힘으로 신전에서 많은 보물을 발견했습니다! 전설의 '시간의 보석'과 함께, 고대의 마법서, 황금빛 장신구, 그리고 수많은 보석들을 발견했습니다. 피로했던 몸을 이끌고 찾은 보물들이 당신의 용기를 인정하여 빛나고 있습니다. 이제 당신은 부와 힘을 모두 가진 진정한 모험가가 되었습니다! 시간을 자유롭게 여행할 수 있는 힘과 함께, 고대의 보물들을 손에 넣었습니다!",
    choices: [],
  },
  find_more_treasure_secret: {
    text: "🕵️ 비밀 통로를 통해 신전의 모든 보물을 발견했습니다! 전설의 '시간의 보석'과 함께, 고대의 마법서, 황금빛 갑옷, 마법의 검, 그리고 신전에 숨겨진 모든 비밀 보물들을 발견했습니다. 아무도 모르는 길로 들어와서 아무도 찾지 못한 모든 보물을 손에 넣었습니다. 이제 당신은 부와 힘을 모두 가진 진정한 모험가가 되었습니다! 시간을 자유롭게 여행할 수 있는 힘과 함께, 고대의 모든 비밀 보물을 손에 넣었습니다!",
    choices: [],
  },
  // 추가 노드들
  deep_forest_animals: {
    text: "동물들과 함께 숲의 가장 깊은 곳까지 탐험했다! 고대의 비밀을 발견했다!",
    choices: [
      {
        text: "신전으로 이동한다",
        next: "temple_inside_secret",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "동물들과 함께 세상을 구한다",
        next: "save_world_animals",
        scoreA: 35,
        scoreB: 35,
      },
    ],
  },
  save_world_animals: {
    text: "동물들과 함께 세상을 구했다! 당신은 자연의 친구가 되었다!",
    choices: [],
  },
  rest_after_fight: {
    text: "전투 후 휴식을 취했다. 체력이 조금 회복되었다.",
    choices: [
      {
        text: "신전 안으로 들어간다",
        next: "temple_inside_weak",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "더 휴식을 취한다",
        next: "temple_inside_weak",
        scoreA: 2,
        scoreB: 2,
      },
    ],
  },
  explore_path_weak: {
    text: "체력이 부족한 상태로 길을 더 탐험한다. 조심스럽게 움직인다.",
    choices: [
      {
        text: "신전으로 이동한다",
        next: "temple_inside_weak",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "안전한 곳을 찾는다",
        next: "find_safe_place",
        scoreA: 8,
        scoreB: 8,
      },
    ],
  },
  find_safe_place: {
    text: "안전한 곳을 찾았다. 여기서 휴식을 취할 수 있다.",
    choices: [
      {
        text: "신전으로 이동한다",
        next: "temple_inside_weak",
        scoreA: 4,
        scoreB: 4,
      },
      {
        text: "더 탐험한다",
        next: "explore_more_weak",
        scoreA: 10,
        scoreB: 10,
      },
    ],
  },
  explore_more_weak: {
    text: "체력이 부족했지만 더 탐험한 결과, 숨겨진 보물을 발견했다!",
    choices: [
      {
        text: "신전으로 이동한다",
        next: "temple_inside_weak",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "보물을 더 찾는다",
        next: "find_more_treasure_weak",
        scoreA: 12,
        scoreB: 12,
      },
    ],
  },
  careful_approach_strong: {
    text: "마법의 힘을 받은 상태로 신중하게 접근한 결과, 유물을 완벽하게 획득했다!",
    choices: [
      {
        text: "신전을 떠난다",
        next: "leave_temple_strong",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "더 탐험한다",
        next: "explore_more_strong",
        scoreA: 18,
        scoreB: 18,
      },
    ],
  },
  careful_approach_weak: {
    text: "체력이 부족한 상태로 신중하게 접근한 결과, 유물을 안전하게 획득했다.",
    choices: [
      {
        text: "신전을 떠난다",
        next: "leave_temple_weak",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "더 탐험한다",
        next: "explore_more_weak",
        scoreA: 12,
        scoreB: 12,
      },
    ],
  },
  careful_approach_secret: {
    text: "비밀 통로를 통해 신중하게 접근한 결과, 유물을 완벽하게 획득했다!",
    choices: [
      {
        text: "비밀 통로로 탈출한다",
        next: "leave_temple_secret",
        scoreA: 14,
        scoreB: 14,
      },
      {
        text: "더 탐험한다",
        next: "explore_more_secret",
        scoreA: 20,
        scoreB: 20,
      },
    ],
  },
  leave_temple_strong: {
    text: "마법의 힘으로 신전을 안전하게 떠났다!",
    choices: [],
  },
  leave_temple_weak: {
    text: "체력이 부족했지만 신전을 안전하게 떠났다!",
    choices: [],
  },
  leave_temple_secret: {
    text: "비밀 통로를 통해 신전을 완벽하게 떠났다!",
    choices: [],
  },
  explore_more_strong: {
    text: "마법의 힘으로 신전을 더 탐험한 결과, 엄청난 보물을 발견했다!",
    choices: [],
  },
  explore_more_secret: {
    text: "비밀 통로를 통해 신전을 더 탐험한 결과, 전설적인 보물을 발견했다!",
    choices: [],
  },
  // 팀 합류 노드들
  team_reunion: {
    text: "🎭 신전의 중앙 홀에서 두 팀이 다시 만났습니다! 각자 다른 길을 통해 온 팀들은 서로의 모험 이야기를 나눕니다. 중앙 홀은 마치 꿈속의 궁전 같아서, 황금빛 기둥들이 하늘을 향해 뻗어 있고, 천장에는 반짝이는 별들이 떠다닙니다. 바닥은 투명한 크리스탈로 만들어져 있어서 아래쪽의 무한한 심연이 보입니다. 전설의 '시간의 보석'이 바로 앞에 있을 것 같습니다. 이제 함께 마지막 도전을 해야 합니다!",
    choices: [
      {
        text: "🤝 함께 협력한다",
        next: "team_cooperation",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "⚔️ 경쟁을 유지한다",
        next: "team_competition",
        scoreA: 10,
        scoreB: 10,
      },
    ],
  },
  team_cooperation: {
    text: "🤝 두 팀이 협력하기로 결정했습니다! 각자의 강점을 합쳐서 더 강력한 팀이 되었습니다. 팀 A의 전략적 사고와 팀 B의 용감한 행동이 합쳐져서 완벽한 조합을 이루었습니다. 신전의 모든 마법이 두 팀의 협력을 인정하여 빛나고 있고, 전설의 '시간의 보석'이 두 팀을 기다리고 있습니다. 이제 어떤 어려움도 함께 극복할 수 있습니다!",
    choices: [
      {
        text: "💎 보석을 함께 찾는다",
        next: "find_gem_together",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "🛡️ 신전을 함께 탐험한다",
        next: "explore_temple_together",
        scoreA: 18,
        scoreB: 18,
      },
    ],
  },
  team_competition: {
    text: "⚔️ 두 팀이 경쟁을 유지하기로 했습니다! 하지만 이번에는 서로의 실력을 인정하며 정정당당하게 경쟁합니다. 신전의 모든 마법이 두 팀의 경쟁을 지켜보고 있고, 전설의 '시간의 보석'이 진정한 승자를 기다리고 있습니다. 각자의 강점을 발휘하여 최고의 모험가가 되기 위한 진정한 승부의 순간입니다!",
    choices: [
      {
        text: "🏆 먼저 보석을 찾는다",
        next: "race_for_gem",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🎯 각자의 방법으로 접근한다",
        next: "separate_approaches",
        scoreA: 12,
        scoreB: 12,
      },
    ],
  },
  find_gem_together: {
    text: "💎 두 팀의 협력으로 드디어 전설의 '시간의 보석'을 발견했습니다! 보석은 두 팀의 우정과 협력을 인정하며 무지개빛으로 빛나고 있습니다. 보석을 만지는 순간, 과거와 미래의 환영이 주변에 나타나고, 신전 전체가 두 팀의 성공을 축하하는 것처럼 빛나기 시작합니다. 이제 두 팀은 시간을 자유롭게 여행할 수 있는 힘을 함께 가질 수 있습니다! 협력의 힘이 전설적인 모험을 완성시켰습니다!",
    choices: [],
  },
  explore_temple_together: {
    text: "🛡️ 두 팀이 함께 신전을 탐험한 결과, 고대의 모든 비밀을 발견했습니다! 전설의 '시간의 보석'뿐만 아니라, 고대의 마법서, 황금빛 갑옷, 마법의 검, 그리고 신전에 숨겨진 모든 비밀 보물들을 함께 발견했습니다. 신전의 수호자들도 두 팀의 협력을 인정하며 축복을 내리고, 신전 전체가 두 팀의 성공을 축하하는 것처럼 빛나기 시작합니다. 이제 두 팀은 부와 힘을 모두 가진 전설적인 모험가가 되었습니다!",
    choices: [],
  },
  race_for_gem: {
    text: "🏆 정정당당한 경쟁 끝에 두 팀 모두 전설의 '시간의 보석'에 도달했습니다! 승패는 없지만, 서로를 인정하는 진정한 경쟁이었습니다. 보석을 만지는 순간, 과거와 미래의 환영이 주변에 나타나고, 신전 전체가 두 팀의 경쟁을 축하하는 것처럼 빛나기 시작합니다. 이제 두 팀은 함께 시간을 여행할 수 있는 힘을 가질 수 있습니다! 경쟁의 힘이 전설적인 모험을 완성시켰습니다!",
    choices: [],
  },
  separate_approaches: {
    text: "🎯 각자의 방법으로 접근한 결과, 두 팀 모두 성공했습니다! 서로 다른 관점이 합쳐져서 더 완벽한 해결책을 찾았습니다. 전설의 '시간의 보석'과 함께, 고대의 마법서, 황금빛 갑옷, 마법의 검, 그리고 신전에 숨겨진 모든 비밀 보물들을 각자의 방법으로 발견했습니다. 신전 전체가 두 팀의 다양성을 축하하는 것처럼 빛나기 시작합니다. 이제 두 팀은 부와 힘을 모두 가진 전설적인 모험가가 되었습니다! 다양성의 힘이 전설적인 모험을 완성시켰습니다!",
    choices: [],
  },
  // 시간 조작 관련 노드들
  reverse_time: {
    text: "⚡ 시간을 되돌리기로 결정했습니다! 유리 조각의 힘을 사용해서 시간을 원래대로 되돌립니다. 시간이 거꾸로 흘러가면서 세계의 균열이 치유되고, 그림자 같은 존재들이 사라집니다. 하지만 시간을 되돌린 대가로, 당신은 시간 조작의 기억을 잃게 됩니다. 아리아가 나타나서 당신을 칭찬합니다. '시간을 되돌린 것은 현명한 선택이에요. 이제 세계가 안전해졌어요.'라고 말하며 사라집니다. 시간의 계단은 원래대로 돌아가고, 두 파티는 각자의 시간 지분을 가지고 평범한 삶으로 돌아갑니다. 하지만 손성모가 나타나서 미래의 가능성을 암시합니다. '시간은 언제든 다시 흐를 수 있어요.'라고 말하며 사라집니다...",
    choices: [],
  },
  continue_time_manipulation: {
    text: "🔮 시간 조작을 계속하기로 결정했습니다! 유리 조각의 힘을 더욱 강화해서 시간을 자유롭게 조종합니다. 하지만 이 선택으로 인해 세계의 균열이 더욱 심해지고, 그림자 같은 존재들이 대량으로 나타나기 시작합니다. 하늘에는 거대한 균열이 생기고, 시간이 완전히 불안정해집니다. 아리아가 나타나서 당신을 비난합니다. '시간 조작을 계속하면 세계가 파괴될 거예요!'라고 말하며 사라집니다. 이제 당신은 강력한 시간 조작 능력을 얻었지만, 그 대가로 세계가 위험에 처하게 되었습니다. 손성모가 나타나서 마지막 기회를 제공합니다. 그의 히든 퍼즐을 완성하면 모든 것을 해결할 수 있다고 합니다...",
    choices: [
      {
        text: "🧩 손성모의 퍼즐을 완성한다",
        next: "complete_sonseongmo_puzzle",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "💀 시간 조작을 계속한다",
        next: "continue_time_manipulation_dark",
        scoreA: 25,
        scoreB: 25,
      },
    ],
  },
  continue_time_manipulation_dark: {
    text: "💀 시간 조작을 계속하기로 결정했습니다! 이 선택으로 인해 세계가 완전히 파괴되기 시작합니다. 균열이 폭발적으로 확대되고, 시간이 완전히 무너집니다. 그림자 같은 존재들이 세계를 장악하고, 모든 것이 혼돈 속으로 빠져듭니다. 아리아는 완전히 사라지고, 손성모도 흑화하여 세계를 자신의 뜻대로 재편하기 시작합니다. 이것이 최악의 엔딩입니다. 손성모는 마지막 메시지를 남깁니다. '너희들이 시간을 파괴했다. 이제 모든 것이 끝났다.'라고 말하며 사라집니다. 세계는 완전히 파괴되고, 두 파티는 시간의 파편 속에서 영원히 갇히게 됩니다...",
    choices: [],
  },
  adventure_with_lost_people: {
    text: "🤝 시간을 잃은 사람들과 함께 모험을 떠나기로 결정했습니다! 그들은 매우 기뻐하며, 당신들에게 시간의 비밀을 알려줍니다. 함께 시간의 계단을 오르면서, 그들은 과거에 시간을 바꾸다가 자신의 시간 지분을 잃어버린 이야기를 들려줍니다. 그들의 도움으로 시간의 조각을 찾는 방법을 알 수 있게 되었고, 손성모에 대한 더 많은 정보도 얻을 수 있었습니다. 함께 계단을 오르면서, 그들은 당신들의 선행에 감동받아 자신들의 시간 지분 일부를 나누어주겠다고 합니다. 이제 당신들은 더 강력한 시간 조작 능력을 얻을 수 있게 되었습니다...",
    choices: [
      {
        text: "🔍 손성모를 찾는다",
        next: "find_sonseongmo",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "⚡ 시간의 조각을 찾는다",
        next: "find_time_fragment_first",
        scoreA: 15,
        scoreB: 15,
      },
    ],
  },
  // 새로운 함정 노드들
  find_treasure_immediately: {
    text: "💎 보물을 즉시 찾기로 결정했습니다! 하지만 서두른 탐색으로 인해 위험한 함정에 걸리게 됩니다. 보물을 찾으려다가 오히려 더 큰 위험에 처하게 되고, 시간을 더 많이 잃게 됩니다. 성급한 선택이 오히려 역효과를 가져왔습니다...",
    choices: [
      {
        text: "🛑 위험을 깨닫고 돌아간다",
        next: "realize_danger_return",
        scoreA: -5,
        scoreB: -5,
      },
      {
        text: "💪 위험을 무시하고 계속한다",
        next: "ignore_danger_continue",
        scoreA: -20,
        scoreB: -20,
      },
    ],
  },
  realize_danger_return: {
    text: "🛑 위험을 깨닫고 돌아가기로 결정했습니다! 하지만 이미 함정에 걸린 상태라서 돌아가는 것도 쉽지 않습니다. 함정에서 벗어나려다가 오히려 더 많은 시간을 잃게 되고, 새로운 위험에 처하게 됩니다. 신중한 선택이었지만 이미 늦었습니다...",
    choices: [
      {
        text: "🔍 다른 안전한 길을 찾는다",
        next: "find_safe_path",
        scoreA: -3,
        scoreB: -3,
      },
      {
        text: "🤝 도움을 요청한다",
        next: "ask_for_help",
        scoreA: -8,
        scoreB: -8,
      },
    ],
  },
  ignore_danger_continue: {
    text: "💪 위험을 무시하고 계속 진행하기로 결정했습니다! 하지만 이는 매우 위험한 선택입니다. 함정들이 연쇄적으로 발동되어 더 큰 위험에 처하게 되고, 시간의 균형이 크게 깨지기 시작합니다. 무모한 선택이 큰 대가를 가져왔습니다...",
    choices: [
      {
        text: "💀 계속 진행한다",
        next: "continue_dangerous_path",
        scoreA: -30,
        scoreB: -30,
      },
      {
        text: "🛑 마지막 기회에 중단한다",
        next: "last_chance_stop",
        scoreA: -15,
        scoreB: -15,
      },
    ],
  },
  escape_trap: {
    text: "🛑 함정에서 벗어나기로 결정했습니다! 하지만 함정에서 벗어나는 과정에서 새로운 함정에 걸리게 됩니다. 함정을 피하려다가 오히려 더 복잡한 상황에 처하게 되고, 시간을 더 많이 잃게 됩니다. 함정에서 벗어나려는 노력이 오히려 더 큰 문제를 야기했습니다...",
    choices: [
      {
        text: "🔍 함정의 패턴을 분석한다",
        next: "analyze_trap_pattern",
        scoreA: -5,
        scoreB: -5,
      },
      {
        text: "💪 함정을 강제로 돌파한다",
        next: "force_break_trap",
        scoreA: -25,
        scoreB: -25,
      },
    ],
  },
  ignore_trap_continue: {
    text: "💪 함정을 무시하고 계속 진행하기로 결정했습니다! 하지만 이는 매우 위험한 선택입니다. 함정들이 연쇄적으로 발동되어 더 큰 위험에 처하게 되고, 시간의 균형이 크게 깨지기 시작합니다. 무모한 선택이 큰 대가를 가져왔습니다...",
    choices: [
      {
        text: "💀 계속 진행한다",
        next: "continue_dangerous_path",
        scoreA: -30,
        scoreB: -30,
      },
      {
        text: "🛑 마지막 기회에 중단한다",
        next: "last_chance_stop",
        scoreA: -15,
        scoreB: -15,
      },
    ],
  },
  return_to_original_path: {
    text: "🛑 원래 길로 돌아가기로 결정했습니다! 하지만 이미 단축 경로에 들어선 상태라서 원래 길로 돌아가는 것이 쉽지 않습니다. 돌아가는 과정에서 새로운 함정에 걸리게 되고, 오히려 더 많은 시간을 잃게 됩니다. 돌아가려는 선택이 오히려 더 복잡한 상황을 만들었습니다...",
    choices: [
      {
        text: "🔍 새로운 길을 찾는다",
        next: "find_new_path",
        scoreA: -8,
        scoreB: -8,
      },
      {
        text: "💪 강제로 돌파한다",
        next: "force_break_through",
        scoreA: -20,
        scoreB: -20,
      },
    ],
  },
  continue_through_traps: {
    text: "💪 함정을 피해 계속 진행하기로 결정했습니다! 하지만 이는 매우 위험한 선택입니다. 함정들이 연쇄적으로 발동되어 더 큰 위험에 처하게 되고, 시간의 균형이 크게 깨지기 시작합니다. 무모한 선택이 큰 대가를 가져왔습니다...",
    choices: [
      {
        text: "💀 계속 진행한다",
        next: "continue_dangerous_path",
        scoreA: -30,
        scoreB: -30,
      },
      {
        text: "🛑 마지막 기회에 중단한다",
        next: "last_chance_stop",
        scoreA: -15,
        scoreB: -15,
      },
    ],
  },
  respond_to_help_request: {
    text: "🤝 도움 요청에 응하기로 결정했습니다! 하지만 이는 함정일 수도 있습니다. 도움을 요청하는 것이 실제로는 위험한 함정이고, 도움을 주려다가 오히려 더 큰 위험에 처하게 됩니다. 선한 의도가 오히려 역효과를 가져왔습니다...",
    choices: [
      {
        text: "🛑 함정임을 깨닫고 도망간다",
        next: "escape_from_trap",
        scoreA: -5,
        scoreB: -5,
      },
      {
        text: "💪 함정을 무시하고 도움을 준다",
        next: "help_despite_trap",
        scoreA: -18,
        scoreB: -18,
      },
    ],
  },
  continue_pursuing_goal: {
    text: "🎯 목표를 계속 추구하기로 결정했습니다! 하지만 너무 목표에만 집중한 나머지 주변의 중요한 것들을 놓치게 됩니다. 시간을 잃은 사람들의 도움 요청을 무시하고, 중요한 단서들을 놓치게 됩니다. 집중이 오히려 중요한 기회를 놓치게 만들었습니다...",
    choices: [
      {
        text: "🔍 놓친 단서를 찾는다",
        next: "find_missed_clues",
        scoreA: -8,
        scoreB: -8,
      },
      {
        text: "💪 목표를 계속 추구한다",
        next: "continue_goal_pursuit",
        scoreA: -20,
        scoreB: -20,
      },
    ],
  },
  gain_power_immediately: {
    text: "💎 강력한 힘을 즉시 얻기로 결정했습니다! 하지만 서두른 힘의 획득으로 인해 위험한 함정에 걸리게 됩니다. 힘을 얻으려다가 오히려 더 큰 위험에 처하게 되고, 시간의 균형이 깨지기 시작합니다. 성급한 선택이 오히려 역효과를 가져왔습니다...",
    choices: [
      {
        text: "🛑 위험을 깨닫고 중단한다",
        next: "realize_power_danger",
        scoreA: -5,
        scoreB: -5,
      },
      {
        text: "💪 위험을 무시하고 힘을 얻는다",
        next: "gain_power_despite_danger",
        scoreA: -25,
        scoreB: -25,
      },
    ],
  },
  // 7대 종족 마을 방문 노드들
  visit_ethereal_village: {
    text: "🔮 {teamAName} 파티와 {teamBName} 파티는 마지막으로 에테르족의 마을에 도착했습니다! 하늘에서 내려온 투명한 날개를 가진 에테르족들이 빛과 소리를 조율하며 공간을 이동하는 모습을 볼 수 있습니다. 에테르족은 '계단의 수호자' 역할을 맡아 인간을 시험하는 종족으로, 마을의 중심에는 거대한 빛의 샘이 있어서 시간의 흐름을 조절할 수 있습니다. 에테르족의 장로가 나타나서 '모든 종족의 마을을 방문한 당신들에게 시간의 계단으로 가는 길을 열어주겠습니다'라고 말합니다...",
    choices: [
      {
        text: "⏰ 시간의 계단으로 향한다",
        next: "time_stairs",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🔮 빛의 샘에서 시간의 정보를 얻는다",
        next: "time_stairs",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🎵 소리를 조율해 숨겨진 통로를 찾는다",
        next: "time_stairs",
        scoreA: 9,
        scoreB: 9,
      },
      {
        text: "🤝 에테르족과 협력 관계를 맺는다",
        next: "time_stairs",
        scoreA: 7,
        scoreB: 7,
      },
    ],
  },
  visit_veloir_village: {
    text: '🐺 벨로아족의 마을에 도착했습니다!\n\n🐺 짐승의 귀와 꼬리를 가진 수인들이 무리를 이루어 살고 있는 모습을 볼 수 있습니다. 마을 곳곳에서 감정적인 대화와 전투 훈련이 벌어지고 있습니다.\n\n👑 벨로아족 족장: "어서 오시오, 모험가들이여! 우리 벨로아족은 전투력이 강하지만 감정에 쉽게 휘둘리는 특성이 있소. 무리를 이루는 습성으로 인해 동맹을 맺으면 강력한 조력자가 되지만, 외로움에 약해서 혼자가 되면 힘이 반감되지."\n\n👑 벨로아족 족장: "강력한 전투 기술을 가르쳐주겠소. 하지만 그전에 우리의 감정적 시련을 견뎌야만 하오."\n\n👑 벨로아족 족장: "그리고 한 가지 더... 하늘에서 내려온 투명한 날개를 가진 종족이 있다고 들었소. 에테르족이라고 하는데, 그들은 시간의 비밀을 알고 있다고 하오."',
    choices: [
      {
        text: "🎉 축제에 참여한다",
        next: "veloir_village_festival",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "⚔️ 마을을 지키기 위해 싸운다",
        next: "veloir_village_attack",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🐺 무리와 함께 훈련한다",
        next: "veloir_pack_training",
        scoreA: 11,
        scoreB: 11,
      },
      {
        text: "💕 감정적 시련을 견뎌낸다",
        next: "veloir_emotional_trial",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🏠 마을의 비밀을 탐험한다",
        next: "veloir_village_secrets",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🌙 밤의 의식을 참관한다",
        next: "veloir_night_ceremony",
        scoreA: 7,
        scoreB: 7,
      },
    ],
  },
  visit_noir_village: {
    text: '🌑 누아르족의 마을에 도착했습니다!\n\n🌑 어둠과 그림자 속에서 태어난 반실체 종족들이 밤의 어둠 속에서만 활발하게 활동하는 모습을 볼 수 있습니다. 마을의 중심에는 시간의 균열을 감지하는 거대한 그림자 거울이 있습니다.\n\n🔮 누아르족 어둠의 현자: "어둠 속에서 온 모험가들이여... 우리 누아르족은 \'시간 균열\'이 생길 때 출현하는 특성이 있소. 우리는 적일 수도 길잡이일 수도 있어서 신중한 접근이 필요하지."\n\n🔮 누아르족 어둠의 현자: "빛에 약해서 낮에는 힘이 제한되지만, 어둠 속에서는 강력한 힘을 발휘하오. 시간의 비밀을 알려주겠소. 하지만 그전에 그림자의 시험을 통과해야만 하오."',
    choices: [
      {
        text: "🌑 그림자의 시험을 받는다",
        next: "noir_shadow_trial",
        scoreA: 9,
        scoreB: 9,
      },
      {
        text: "🔍 시간 균열을 감지하는 방법을 배운다",
        next: "noir_rift_detection",
        scoreA: 11,
        scoreB: 11,
      },
      {
        text: "🌙 어둠의 힘을 활용하는 법을 배운다",
        next: "noir_dark_power",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🤝 누아르족과 신뢰 관계를 맺는다",
        next: "noir_trust_relationship",
        scoreA: 8,
        scoreB: 8,
      },
    ],
  },
  visit_sylphred_village: {
    text: '🌪️ 실프레드족의 마을에 도착했습니다!\n\n🌪️ 바람을 다루는 작은 정령들이 쾌활하고 장난스럽게 바람을 타고 날아다니는 모습을 볼 수 있습니다. 마을의 중심에는 미래를 예측하는 바람의 오라클이 있습니다.\n\n🌪️ 실프레드족 바람의 현자: "바람을 타고 온 모험가들이여! 우리 실프레드족은 때로는 예언자 역할을 수행하기도 하오. 작은 체구로 인해 물리 공격에 취약하지만, 바람을 자유롭게 조종할 수 있는 능력이 있지!"\n\n🌪️ 실프레드족 바람의 현자: "미래의 예언을 들려주겠소. 하지만 그전에 우리의 바람의 장난을 견뎌야만 하오! 하하하!"',
    choices: [
      {
        text: "🌪️ 바람의 장난을 견뎌낸다",
        next: "sylphred_wind_prank",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🔮 바람의 오라클에서 미래를 본다",
        next: "sylphred_wind_oracle",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "💨 바람을 조종하는 법을 배운다",
        next: "sylphred_wind_control",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🤝 실프레드족과 친구가 된다",
        next: "sylphred_friendship",
        scoreA: 9,
        scoreB: 9,
      },
    ],
  },
  visit_drakar_village: {
    text: "🔥 드라카르족의 마을에 도착했습니다! 반인반룡의 전사들이 불과 용의 피를 계승하여 강대한 전투력을 보유하고 있는 모습을 볼 수 있습니다. 드라카르족은 짧은 수명 탓에 명예와 전투를 갈망하며, 마을의 중심에는 용의 불꽃을 다루는 거대한 용의 제단이 있습니다. '약속'을 중시하고 배신자를 절대 용서하지 않는 특성이 있어서, 신뢰 관계가 매우 중요합니다. {teamAName} 파티의 한지우(에테르족)가 투명한 날개를 펼치며 빛과 소리를 조율하고, {teamBName} 파티의 신진섭(드라카르족)이 용의 피로 인한 강대한 힘을 느끼며 전투 준비를 합니다. 드라카르족의 용의 전사가 나타나서 강력한 전투 기술을 가르쳐주겠다고 하지만, 명예의 시련을 통과해야만 한다고 합니다...",
    choices: [
      {
        text: "⚔️ 명예의 시련을 받는다",
        next: "drakar_honor_trial",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🔥 용의 불꽃을 다루는 법을 배운다",
        next: "drakar_dragon_fire",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "💪 강력한 전투 기술을 배운다",
        next: "drakar_combat_skills",
        scoreA: 11,
        scoreB: 11,
      },
      {
        text: "🤝 드라카르족과 명예로운 동맹을 맺는다",
        next: "drakar_honorable_alliance",
        scoreA: 13,
        scoreB: 13,
      },
    ],
  },
  visit_runmare_village: {
    text: "🌊 룬마레족의 마을에 도착했습니다! 바다와 별빛에서 태어난 종족들이 물과 별의 힘을 동시에 다루며 '꿈'을 통해 미래를 예지하는 모습을 볼 수 있습니다. 룬마레족은 마을의 중심에 바다와 별이 만나는 거대한 꿈의 샘이 있어서, 그곳에서 미래의 비전을 볼 수 있습니다. 물에서 멀리 떨어지면 힘이 급격히 약해지는 약점이 있지만, 꿈을 통해 미래를 예지할 수 있는 강력한 능력을 가지고 있습니다. {teamAName} 파티의 한지우(에테르족)가 투명한 날개를 펼치며 빛과 소리를 조율하고, {teamBName} 파티의 이송은(룬마레족)이 꿈을 통해 미래의 위험을 예지합니다. 룬마레족의 꿈의 예언자가 나타나서 미래의 비전을 보여주겠다고 하지만, 꿈의 시련을 견뎌야만 한다고 합니다...",
    choices: [
      {
        text: "🌙 꿈의 시련을 견뎌낸다",
        next: "runmare_dream_trial",
        scoreA: 11,
        scoreB: 11,
      },
      {
        text: "🔮 꿈의 샘에서 미래를 본다",
        next: "runmare_dream_vision",
        scoreA: 14,
        scoreB: 14,
      },
      {
        text: "🌊 물과 별의 힘을 배운다",
        next: "runmare_water_star_power",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "🤝 룬마레족과 예지의 동맹을 맺는다",
        next: "runmare_prophecy_alliance",
        scoreA: 13,
        scoreB: 13,
      },
    ],
  },
  visit_moras_village: {
    text: "🌳 모라스족의 마을에 도착했습니다! 거대한 나무와 일체화된 종족들이 수백 년을 살며 세계의 비밀과 역사를 기억하는 현자들의 모습을 볼 수 있습니다. 모라스족은 마을의 중심에 수백 년의 지혜가 축적된 거대한 지혜의 나무가 있어서, 그곳에서 모든 시간의 비밀을 알 수 있습니다. 움직임이 느리고 급변하는 전투에는 부적합하지만, 세계의 모든 비밀을 알고 있는 강력한 지혜를 가지고 있습니다. {teamAName} 파티의 이동준(실프레드족)이 바람을 타고 마을 곳곳을 빠르게 탐험하며 쾌활한 농담을 던지고, {teamBName} 파티의 신진섭(드라카르족)이 용의 피로 인한 강대한 힘을 느끼며 전투 준비를 합니다. 모라스족의 고대 현자가 나타나서 시간의 계단의 모든 비밀을 알려주겠다고 하지만, 지혜의 시련을 통과해야만 한다고 합니다...",
    choices: [
      {
        text: "📚 지혜의 시련을 받는다",
        next: "moras_wisdom_trial",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "🌳 지혜의 나무에서 모든 비밀을 배운다",
        next: "moras_wisdom_tree",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "📖 고대의 기록을 해독한다",
        next: "moras_ancient_records",
        scoreA: 13,
        scoreB: 13,
      },
      {
        text: "🤝 모라스족과 지혜의 동맹을 맺는다",
        next: "moras_wisdom_alliance",
        scoreA: 14,
        scoreB: 14,
      },
    ],
  },
  // 마을 간 연결 노드들
  veloir_combat_training: {
    text: "⚔️ 벨로아족의 전투 기술을 배웠습니다! 강력한 발톱과 이빨을 활용한 전투법을 익혔고, 짐승의 본능을 활용한 전투 감각을 기를 수 있었습니다. 벨로아족의 족장이 만족스러워하며 '이제 다른 종족의 마을들을 방문해야 한다. 각 종족은 고유한 능력과 지혜를 가지고 있어서, 그들의 도움을 받아야만 시간의 계단에 도달할 수 있다'고 알려줍니다...",
    choices: [
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "visit_noir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "📚 도서관에서 시간의 비밀을 연구한다",
        next: "research_time_secrets",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🏪 상점에서 시간의 물건을 구매한다",
        next: "buy_time_items",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "🌲 숲에서 시간의 꽃을 수집한다",
        next: "collect_time_flowers",
        scoreA: 7,
        scoreB: 7,
      },
      {
        text: "⏰ 시간의 계단으로 직접 향한다",
        next: "time_stairs",
        scoreA: 3,
        scoreB: 3,
      },
    ],
  },
  veloir_pack_training: {
    text: "🐺 무리와 함께 훈련했습니다! 벨로아족의 무리 형성 기술을 배워서 동료들과의 협력 능력이 크게 향상되었습니다. 무리의 힘을 체험하면서 '함께 있을 때 가장 강력하다'는 것을 깨달았습니다. 벨로아족의 족장이 '이제 다른 종족들의 마을을 방문해야 한다. 각 종족은 고유한 능력과 지혜를 가지고 있어서, 그들의 도움을 받아야만 시간의 계단에 도달할 수 있다'고 조언합니다...",
    choices: [
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "visit_noir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "📚 도서관에서 고대 지식을 찾는다",
        next: "find_ancient_knowledge",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🏪 상점에서 마법 물건을 구매한다",
        next: "buy_magic_items",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "🌲 숲에서 신비로운 약초를 찾는다",
        next: "find_mystical_herbs",
        scoreA: 7,
        scoreB: 7,
      },
      {
        text: "⏰ 시간의 계단으로 직접 향한다",
        next: "time_stairs",
        scoreA: 3,
        scoreB: 3,
      },
    ],
  },
  veloir_emotional_trial: {
    text: "💕 감정적 시련을 견뎌냈습니다! 벨로아족의 감정에 휘둘리지 않고 이성을 유지하는 법을 배웠습니다. 이제 감정을 조절하면서도 강력한 힘을 발휘할 수 있게 되었습니다. 벨로아족의 족장이 '감정을 조절하는 법을 배웠으니, 이제 다른 종족들의 마을을 방문해야 한다. 각 종족은 고유한 능력과 지혜를 가지고 있어서, 그들의 도움을 받아야만 시간의 계단에 도달할 수 있다'고 말합니다...",
    choices: [
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "visit_noir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "📚 도서관에서 마음의 평화를 찾는다",
        next: "find_inner_peace",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🏪 상점에서 감정 조절 물건을 구매한다",
        next: "buy_emotion_items",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "🌲 숲에서 평화로운 시간을 보낸다",
        next: "peaceful_forest_time",
        scoreA: 7,
        scoreB: 7,
      },
      {
        text: "⏰ 시간의 계단으로 직접 향한다",
        next: "time_stairs",
        scoreA: 3,
        scoreB: 3,
      },
    ],
  },
  veloir_alliance: {
    text: "🤝 벨로아족과 동맹을 맺었습니다! 강력한 전투력과 무리의 힘을 가진 벨로아족의 동맹을 얻어서 큰 힘이 되었습니다. 벨로아족의 족장이 '동맹을 맺은 자에게는 모든 정보를 제공하겠다. 이제 다른 종족들의 마을을 방문해야 한다. 각 종족은 고유한 능력과 지혜를 가지고 있어서, 그들의 도움을 받아야만 시간의 계단에 도달할 수 있다'고 알려줍니다...",
    choices: [
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "visit_noir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "📚 동맹의 도움으로 도서관에 접근한다",
        next: "alliance_library_access",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🏪 동맹의 할인으로 상점에서 물건을 구매한다",
        next: "alliance_shop_discount",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "🌲 동맹과 함께 숲을 탐험한다",
        next: "alliance_forest_exploration",
        scoreA: 7,
        scoreB: 7,
      },
      {
        text: "⏰ 시간의 계단으로 직접 향한다",
        next: "time_stairs",
        scoreA: 3,
        scoreB: 3,
      },
    ],
  },
  // 새로운 탐험 노드들
  research_time_secrets: {
    text: "📚 도서관에서 시간의 비밀을 연구했습니다! 고대의 시간 관련 서적들을 읽으며 시간의 본질에 대해 깊이 있게 이해할 수 있었습니다. 사서가 '시간의 비밀을 아는 자는 시간을 조종할 수 있다'고 말하며, 시간의 계단에 대한 중요한 정보를 제공합니다...",
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "visit_veloir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "visit_noir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌳 모라스족의 마을로 향한다",
        next: "visit_moras_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "⏰ 시간의 계단으로 향한다",
        next: "time_stairs",
        scoreA: 8,
        scoreB: 8,
      },
    ],
  },
  buy_time_items: {
    text: "🏪 상점에서 시간의 물건들을 구매했습니다! 시간의 모래, 시간의 향초, 시간의 지도 등 신비로운 물건들을 얻었습니다. 상점 주인이 '이 물건들은 시간의 계단으로 가는 길을 안내할 것이다'라고 말하며, 각 물건의 사용법을 알려줍니다...",
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "visit_veloir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "visit_noir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌳 모라스족의 마을로 향한다",
        next: "visit_moras_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "⏰ 시간의 계단으로 향한다",
        next: "time_stairs",
        scoreA: 6,
        scoreB: 6,
      },
    ],
  },
  collect_time_flowers: {
    text: "🌲 숲에서 시간의 꽃들을 수집했습니다! 빨간 꽃은 과거, 파란 꽃은 현재, 보라 꽃은 미래를 상징하며, 이 꽃들을 통해 시간의 흐름을 느낄 수 있습니다. 숲의 정령들이 '시간의 꽃을 가진 자는 시간의 비밀을 알 수 있다'고 말합니다...",
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "visit_veloir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "visit_noir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌳 모라스족의 마을로 향한다",
        next: "visit_moras_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "⏰ 시간의 계단으로 향한다",
        next: "time_stairs",
        scoreA: 7,
        scoreB: 7,
      },
    ],
  },
  // 누아르족 마을 연결 노드들
  noir_shadow_trial: {
    text: "🌑 그림자의 시험을 통과했습니다! 어둠과 그림자 속에서 자유롭게 이동하는 법을 배웠고, 시간의 균열을 감지할 수 있는 특별한 능력을 얻었습니다. 누아르족의 어둠의 현자가 '이제 다른 종족들의 마을을 방문해야 한다. 각 종족은 고유한 능력과 지혜를 가지고 있어서, 그들의 도움을 받아야만 시간의 계단에 도달할 수 있다'고 알려줍니다...",
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "visit_veloir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  noir_rift_detection: {
    text: "🔍 시간 균열을 감지하는 방법을 배웠습니다! 그림자 속에서 시간의 균열이 생기는 징조를 감지할 수 있게 되었고, 이를 통해 미래의 위험을 예측할 수 있습니다. 누아르족의 어둠의 현자가 '이제 다른 종족들의 마을을 방문해야 한다. 각 종족은 고유한 능력과 지혜를 가지고 있어서, 그들의 도움을 받아야만 시간의 계단에 도달할 수 있다'고 조언합니다...",
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "visit_veloir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  noir_dark_power: {
    text: "🌙 어둠의 힘을 활용하는 법을 배웠습니다! 밤의 힘을 기다려 최대한의 능력을 발휘할 수 있게 되었고, 그림자 속에서 숨겨진 정보를 수집할 수 있습니다. 누아르족의 어둠의 현자가 '이제 다른 종족들의 마을을 방문해야 한다. 각 종족은 고유한 능력과 지혜를 가지고 있어서, 그들의 도움을 받아야만 시간의 계단에 도달할 수 있다'고 말합니다...",
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "visit_veloir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  noir_trust_relationship: {
    text: "🤝 누아르족과 신뢰 관계를 맺었습니다! 어둠과 그림자 속의 종족과의 신뢰 관계를 통해 중요한 정보를 얻을 수 있게 되었습니다. 누아르족의 어둠의 현자가 '신뢰할 수 있는 자에게는 모든 비밀을 알려주겠다. 이제 다른 종족들의 마을을 방문해야 한다. 각 종족은 고유한 능력과 지혜를 가지고 있어서, 그들의 도움을 받아야만 시간의 계단에 도달할 수 있다'고 알려줍니다...",
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "visit_veloir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  // 실프레드족 마을 연결 노드들
  sylphred_wind_prank: {
    text: "🌪️ 바람의 장난을 견뎌냈습니다! 실프레드족의 쾌활하고 장난스러운 성격을 이해하고 그들과 친해질 수 있었습니다. 작은 바람 정령들이 만족스러워하며 '이제 다른 종족들의 마을을 방문해야 한다. 각 종족은 고유한 능력과 지혜를 가지고 있어서, 그들의 도움을 받아야만 시간의 계단에 도달할 수 있다'고 알려줍니다...",
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "visit_veloir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "visit_noir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  sylphred_wind_oracle: {
    text: "🔮 바람의 오라클에서 미래를 보았습니다! 실프레드족의 예언자 능력을 통해 미래의 중요한 정보를 얻을 수 있었습니다. 바람의 현자가 '미래를 본 자에게는 다음 길을 알려주겠다. 이제 용의 피를 가진 드라카르족을 찾아가라. 그들은 용의 불꽃으로 고대 유물을 깨울 수 있다'고 조언합니다...",
    choices: [
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  sylphred_wind_control: {
    text: "💨 바람을 조종하는 법을 배웠습니다! 실프레드족의 바람 조종 기술을 익혀서 빠르게 이동할 수 있게 되었습니다. 바람의 현자가 '바람을 다루는 법을 배웠으니, 이제 용의 힘을 가진 드라카르족을 찾아가라. 그들은 강력한 전투 기술을 가르쳐줄 것이다'고 말합니다...",
    choices: [
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  sylphred_friendship: {
    text: "🤝 실프레드족과 친구가 되었습니다! 쾌활하고 장난스러운 바람 정령들과의 우정을 통해 즐거운 여정을 계속할 수 있게 되었습니다. 실프레드족들이 '친구에게는 모든 것을 알려주겠다. 다음에는 용의 피를 가진 드라카르족을 찾아가라. 그들은 명예로운 전사들이다'고 알려줍니다...",
    choices: [
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  // 드라카르족 마을 연결 노드들
  drakar_honor_trial: {
    text: "⚔️ 명예의 시련을 통과했습니다! 드라카르족의 명예를 중시하는 가치관을 이해하고 전사의 정신을 배울 수 있었습니다. 용의 전사가 만족스러워하며 '이제 바다와 별빛에서 태어난 룬마레족을 찾아가라. 그들은 꿈을 통해 미래를 예지할 수 있는 특별한 능력을 가지고 있다'고 알려줍니다...",
    choices: [
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  drakar_dragon_fire: {
    text: "🔥 용의 불꽃을 다루는 법을 배웠습니다! 용의 피를 계승한 강대한 힘을 활용할 수 있게 되었고, 고대 유물을 깨우는 능력을 얻었습니다. 용의 전사가 '이제 바다와 별빛의 종족인 룬마레족을 찾아가라. 그들은 꿈의 샘에서 미래의 비전을 볼 수 있다'고 조언합니다...",
    choices: [
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  drakar_combat_skills: {
    text: "💪 강력한 전투 기술을 배웠습니다! 반인반룡의 전사로서의 강대한 전투력을 익혔고, 명예로운 전투의 정신을 배울 수 있었습니다. 용의 전사가 '이제 예지의 능력을 가진 룬마레족을 찾아가라. 그들은 물과 별의 힘을 동시에 다룰 수 있다'고 말합니다...",
    choices: [
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  drakar_honorable_alliance: {
    text: "🤝 드라카르족과 명예로운 동맹을 맺었습니다! 강대한 전투력과 명예를 중시하는 드라카르족의 동맹을 얻어서 큰 힘이 되었습니다. 용의 전사가 '명예로운 동맹에게는 모든 것을 제공하겠다. 다음에는 예지의 능력을 가진 룬마레족을 찾아가라. 그들은 꿈을 통해 미래를 예지한다'고 알려줍니다...",
    choices: [
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  // 룬마레족 마을 연결 노드들
  runmare_dream_trial: {
    text: "🌙 꿈의 시련을 견뎌냈습니다! 룬마레족의 꿈을 통해 미래를 예지하는 능력을 배웠고, 바다와 별빛의 힘을 이해할 수 있었습니다. 꿈의 예언자가 '이제 수백 년의 지혜를 가진 모라스족을 찾아가라. 그들은 거대한 나무와 일체화되어 세계의 모든 비밀을 알고 있다'고 알려줍니다...",
    choices: [
      {
        text: "🌳 모라스족의 마을로 향한다",
        next: "visit_moras_village",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  runmare_dream_vision: {
    text: "🔮 꿈의 샘에서 미래를 보았습니다! 바다와 별빛이 만나는 곳에서 미래의 중요한 비전을 얻을 수 있었습니다. 꿈의 예언자가 '미래를 본 자에게는 마지막 길을 알려주겠다. 이제 고대의 지혜를 가진 모라스족을 찾아가라. 그들은 지혜의 나무에서 모든 비밀을 해독할 수 있다'고 조언합니다...",
    choices: [
      {
        text: "🌳 모라스족의 마을로 향한다",
        next: "visit_moras_village",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  runmare_water_star_power: {
    text: "🌊 물과 별의 힘을 배웠습니다! 룬마레족의 물과 별빛을 동시에 다루는 능력을 익혀서 시간의 흐름을 조절할 수 있게 되었습니다. 꿈의 예언자가 '이제 수백 년의 지혜를 가진 모라스족을 찾아가라. 그들은 고대의 기록을 해독할 수 있다'고 말합니다...",
    choices: [
      {
        text: "🌳 모라스족의 마을로 향한다",
        next: "visit_moras_village",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  runmare_prophecy_alliance: {
    text: "🤝 룬마레족과 예지의 동맹을 맺었습니다! 꿈을 통해 미래를 예지할 수 있는 룬마레족의 동맹을 얻어서 큰 힘이 되었습니다. 꿈의 예언자가 '예지의 동맹에게는 모든 비밀을 알려주겠다. 마지막으로 고대의 지혜를 가진 모라스족을 찾아가라. 그들은 시간의 계단의 모든 비밀을 알고 있다'고 알려줍니다...",
    choices: [
      {
        text: "🌳 모라스족의 마을로 향한다",
        next: "visit_moras_village",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  // 모라스족 마을 연결 노드들 (마지막으로 에테르족 마을로)
  moras_wisdom_trial: {
    text: "📚 지혜의 시련을 통과했습니다! 모라스족의 수백 년 지혜를 이해하고 세계의 비밀에 대한 깊은 통찰을 얻을 수 있었습니다. 고대 현자가 만족스러워하며 '이제 다른 종족들의 마을을 방문해야 한다. 각 종족은 고유한 능력과 지혜를 가지고 있어서, 그들의 도움을 받아야만 시간의 계단에 도달할 수 있다'고 알려줍니다...",
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "visit_veloir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "visit_noir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "📚 도서관에서 고대 지식을 연구한다",
        next: "research_ancient_knowledge",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🏪 상점에서 지혜의 물건을 구매한다",
        next: "buy_wisdom_items",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "🌲 숲에서 지혜의 열매를 찾는다",
        next: "find_wisdom_fruits",
        scoreA: 7,
        scoreB: 7,
      },
    ],
  },
  moras_wisdom_tree: {
    text: "🌳 지혜의 나무에서 모든 비밀을 배웠습니다! 수백 년의 지혜가 축적된 거대한 나무에서 시간의 계단의 모든 비밀을 알 수 있었습니다. 고대 현자가 '이제 다른 종족들의 마을을 방문해야 한다. 각 종족은 고유한 능력과 지혜를 가지고 있어서, 그들의 도움을 받아야만 시간의 계단에 도달할 수 있다'고 조언합니다...",
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "visit_veloir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "visit_noir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "📚 도서관에서 지혜의 서적을 찾는다",
        next: "find_wisdom_books",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🏪 상점에서 지혜의 보석을 구매한다",
        next: "buy_wisdom_gems",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "🌲 숲에서 지혜의 나무를 찾는다",
        next: "find_wisdom_trees",
        scoreA: 7,
        scoreB: 7,
      },
    ],
  },
  moras_ancient_records: {
    text: "📖 고대의 기록을 해독했습니다! 모라스족이 수백 년간 기록해온 고대 문서들을 해독하여 시간의 계단에 대한 모든 정보를 얻을 수 있었습니다. 고대 현자가 '이제 다른 종족들의 마을을 방문해야 한다. 각 종족은 고유한 능력과 지혜를 가지고 있어서, 그들의 도움을 받아야만 시간의 계단에 도달할 수 있다'고 말합니다...",
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "visit_veloir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "visit_noir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "📚 도서관에서 고대 지식을 연구한다",
        next: "research_ancient_knowledge",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🏪 상점에서 지혜의 물건을 구매한다",
        next: "buy_wisdom_items",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "🌲 숲에서 지혜의 열매를 찾는다",
        next: "find_wisdom_fruits",
        scoreA: 7,
        scoreB: 7,
      },
    ],
  },
  moras_wisdom_alliance: {
    text: "🤝 모라스족과 지혜의 동맹을 맺었습니다! 수백 년의 지혜를 가진 모라스족의 동맹을 얻어서 세계의 모든 비밀을 알 수 있게 되었습니다. 고대 현자가 '지혜의 동맹에게는 모든 것을 알려주겠다. 이제 다른 종족들의 마을을 방문해야 한다. 각 종족은 고유한 능력과 지혜를 가지고 있어서, 그들의 도움을 받아야만 시간의 계단에 도달할 수 있다'고 알려줍니다...",
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "visit_veloir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "visit_noir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "📚 동맹의 도움으로 도서관에 접근한다",
        next: "alliance_library_access",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🏪 동맹의 할인으로 상점에서 물건을 구매한다",
        next: "alliance_shop_discount",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "🌲 동맹과 함께 숲을 탐험한다",
        next: "alliance_forest_exploration",
        scoreA: 7,
        scoreB: 7,
      },
    ],
  },
  // 마을과 마을 사이의 여행 이벤트들
  travel_through_forest: {
    text: "🌲 숲을 통과하는 여행 중입니다! 마을과 마을 사이의 울창한 숲을 지나고 있습니다. 이 숲은 시간의 영향을 받아서 계절이 순간순간 바뀌고 있고, 다양한 신비로운 생물들이 살고 있습니다. 숲의 깊은 곳에서는 시간의 비밀들이 숨겨져 있을 수도 있습니다...",
    choices: [
      {
        text: "🦌 신비로운 사슴을 따라간다",
        next: "follow_mystical_deer",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "🍄 시간의 버섯을 수집한다",
        next: "collect_time_mushrooms",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🌿 고대의 약초를 찾는다",
        next: "find_ancient_herbs",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🏕️ 숲 속 캠프를 만든다",
        next: "make_forest_camp",
        scoreA: 10,
        scoreB: 10,
      },
    ],
  },
  travel_through_mountains: {
    text: "⛰️ 산맥을 넘는 여행 중입니다! 높은 산맥을 넘어가면서 시간의 변화를 직접 체험합니다. 산 정상에서는 시간이 더 빨리 흐르고, 계곡에서는 시간이 느리게 흐르는 것을 느낄 수 있습니다. 산맥의 비밀을 탐험할 수 있는 기회입니다...",
    choices: [
      {
        text: "🏔️ 산 정상에 오른다",
        next: "climb_mountain_peak",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "💎 보석 광산을 탐험한다",
        next: "explore_gem_mine",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "🦅 독수리와 함께 날아간다",
        next: "fly_with_eagle",
        scoreA: 25,
        scoreB: 25,
      },
      {
        text: "🏞️ 계곡의 비밀을 찾는다",
        next: "find_valley_secrets",
        scoreA: 16,
        scoreB: 16,
      },
    ],
  },
  travel_through_desert: {
    text: "🏜️ 사막을 건너는 여행 중입니다! 끝없이 펼쳐진 사막에서 시간의 의미를 새롭게 생각하게 됩니다. 사막에서는 시간이 마치 멈춘 것처럼 느껴지지만, 실제로는 시간의 흐름이 더욱 강렬하게 느껴집니다. 사막의 신비를 탐험할 수 있는 기회입니다...",
    choices: [
      {
        text: "🐪 낙타와 함께 여행한다",
        next: "travel_with_camel",
        scoreA: 14,
        scoreB: 14,
      },
      {
        text: "🏺 고대 유물을 발굴한다",
        next: "excavate_ancient_artifacts",
        scoreA: 22,
        scoreB: 22,
      },
      {
        text: "🌅 사막의 일출을 감상한다",
        next: "watch_desert_sunrise",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "🏕️ 오아시스에서 휴식을 취한다",
        next: "rest_at_oasis",
        scoreA: 8,
        scoreB: 8,
      },
    ],
  },
  travel_through_ocean: {
    text: "🌊 바다를 건너는 여행 중입니다! 끝없이 펼쳐진 바다에서 시간의 깊이를 느낄 수 있습니다. 바다의 파도는 시간의 흐름을 상징하고, 깊은 바다 속에는 시간의 비밀들이 숨겨져 있을 수도 있습니다. 바다의 신비를 탐험할 수 있는 기회입니다...",
    choices: [
      {
        text: "🐋 고래와 함께 수영한다",
        next: "swim_with_whale",
        scoreA: 30,
        scoreB: 30,
      },
      {
        text: "🏝️ 신비로운 섬을 발견한다",
        next: "discover_mysterious_island",
        scoreA: 25,
        scoreB: 25,
      },
      {
        text: "🌊 바다의 심연을 탐험한다",
        next: "explore_ocean_depth",
        scoreA: 35,
        scoreB: 35,
      },
      {
        text: "⚓ 고대의 난파선을 조사한다",
        next: "investigate_shipwreck",
        scoreA: 20,
        scoreB: 20,
      },
    ],
  },
  encounter_time_storm: {
    text: "⛈️ 시간의 폭풍을 만났습니다! 시간이 뒤틀리고 공간이 왜곡되는 신비로운 폭풍이 발생했습니다. 이 폭풍은 시간의 불균형으로 인해 발생한 것으로, 시간의 조각을 사용해서 해결할 수 있을 수도 있습니다. 폭풍 속에서 새로운 발견을 할 수 있을 것입니다...",
    choices: [
      {
        text: "🛡️ 폭풍을 뚫고 나간다",
        next: "brave_through_storm",
        scoreA: 28,
        scoreB: 28,
      },
      {
        text: "🔮 시간의 조각으로 폭풍을 잠재운다",
        next: "calm_storm_with_fragment",
        scoreA: 40,
        scoreB: 40,
      },
      {
        text: "🏠 폭풍을 피해 숨어든다",
        next: "hide_from_storm",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🌪️ 폭풍의 중심으로 들어간다",
        next: "enter_storm_center",
        scoreA: 50,
        scoreB: 50,
      },
    ],
  },
  meet_traveling_merchant: {
    text: "🛒 여행하는 상인을 만났습니다! 시간의 영향을 받아서 다양한 시대의 물건들을 팔고 있는 신비로운 상인입니다. 이 상인은 시간의 비밀들을 많이 알고 있는 것 같고, 특별한 물건들을 구매할 수 있는 기회를 제공합니다...",
    choices: [
      {
        text: "💎 보석을 구매한다",
        next: "buy_gems_from_merchant",
        scoreA: 18,
        scoreB: 18,
      },
      {
        text: "📜 고대의 지도를 구매한다",
        next: "buy_ancient_map",
        scoreA: 25,
        scoreB: 25,
      },
      {
        text: "🔮 신비로운 물건을 구매한다",
        next: "buy_mysterious_item",
        scoreA: 30,
        scoreB: 30,
      },
      {
        text: "💬 상인과 대화한다",
        next: "talk_to_merchant",
        scoreA: 12,
        scoreB: 12,
      },
    ],
  },
  discover_ancient_ruins: {
    text: "🏛️ 고대의 유적을 발견했습니다! 시간의 흐름 속에서 잊혀진 고대 문명의 유적입니다. 이 유적에는 시간의 비밀들이 기록되어 있을 수도 있고, 귀중한 보물들이 숨겨져 있을 수도 있습니다. 유적을 탐험할 수 있는 기회입니다...",
    choices: [
      {
        text: "📚 고대의 문서를 해독한다",
        next: "decipher_ancient_documents",
        scoreA: 35,
        scoreB: 35,
      },
      {
        text: "💎 보물을 찾는다",
        next: "find_treasure_in_ruins",
        scoreA: 40,
        scoreB: 40,
      },
      {
        text: "🏺 고대의 유물을 조사한다",
        next: "examine_ancient_artifacts",
        scoreA: 30,
        scoreB: 30,
      },
      {
        text: "🔍 유적의 비밀을 탐색한다",
        next: "explore_ruin_secrets",
        scoreA: 45,
        scoreB: 45,
      },
    ],
  },
  encounter_mysterious_creature: {
    text: "🐉 신비로운 생물을 만났습니다! 시간의 영향을 받아서 변이된 신비로운 생물입니다. 이 생물은 시간의 비밀을 알고 있는 것 같고, 도움을 요청하거나 위험을 경고하고 있을 수도 있습니다. 어떻게 대응할지 결정해야 합니다...",
    choices: [
      {
        text: "🤝 생물과 친구가 된다",
        next: "befriend_mysterious_creature",
        scoreA: 35,
        scoreB: 35,
      },
      {
        text: "🗣️ 생물과 대화한다",
        next: "talk_to_mysterious_creature",
        scoreA: 25,
        scoreB: 25,
      },
      {
        text: "🏃 생물을 피해 도망간다",
        next: "run_from_mysterious_creature",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "⚔️ 생물과 싸운다",
        next: "fight_mysterious_creature",
        scoreA: 20,
        scoreB: 20,
      },
    ],
  },
  find_hidden_village: {
    text: "🏘️ 숨겨진 마을을 발견했습니다! 시간의 영향으로 인해 일반적인 시공간에서 격리된 신비로운 마을입니다. 이 마을의 주민들은 시간의 비밀을 알고 있는 것 같고, 특별한 지식이나 도움을 제공할 수 있을 것입니다...",
    choices: [
      {
        text: "🏠 마을에 들어간다",
        next: "enter_hidden_village",
        scoreA: 30,
        scoreB: 30,
      },
      {
        text: "👥 마을 주민들과 대화한다",
        next: "talk_to_village_residents",
        scoreA: 25,
        scoreB: 25,
      },
      {
        text: "🏛️ 마을의 신전을 방문한다",
        next: "visit_village_temple",
        scoreA: 35,
        scoreB: 35,
      },
      {
        text: "🎁 마을의 선물을 받는다",
        next: "receive_village_gift",
        scoreA: 20,
        scoreB: 20,
      },
    ],
  },
  // 마을별 확장 이벤트들
  // 벨로아족 마을 확장 이벤트
  veloir_village_festival: {
    text: "🎉 벨로아족 마을에서 축제가 열리고 있습니다! 전투의 신을 기리는 축제에서 다양한 시련과 보상이 기다리고 있습니다. 축제에 참여하면 강력한 전투 기술을 배울 수 있지만, 실패하면 위험할 수도 있습니다...",
    choices: [
      {
        text: "⚔️ 전투 축제에 참여한다 (위험하지만 강해질 수 있다)",
        next: "veloir_festival_combat",
        scoreA: 35,
        scoreB: 35,
      },
      {
        text: "🎭 축제 구경만 한다 (안전하지만 별로 얻는 게 없다)",
        next: "veloir_festival_spectate",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🏆 축제 우승을 노린다 (매우 위험하지만 최고의 보상)",
        next: "veloir_festival_champion",
        scoreA: 60,
        scoreB: 60,
      },
      {
        text: "🏃 축제를 피해 지나간다 (시간을 절약할 수 있다)",
        next: "veloir_festival_skip",
        scoreA: 15,
        scoreB: 15,
      },
    ],
  },
  veloir_village_attack: {
    text: "⚔️ 벨로아족 마을이 야생 짐승들의 습격을 받고 있습니다! 마을 주민들이 위험에 처해 있고, 도움을 요청하고 있습니다. 도움을 주면 감사와 보상을 받을 수 있지만, 위험할 수도 있습니다...",
    choices: [
      {
        text: "🛡️ 마을을 지키기 위해 싸운다 (위험하지만 영웅이 될 수 있다)",
        next: "veloir_defend_village",
        scoreA: 45,
        scoreB: 45,
      },
      {
        text: "🏃 위험을 피해 도망간다 (안전하지만 비겁하다고 욕먹는다)",
        next: "veloir_coward_escape",
        scoreA: -5,
        scoreB: -5,
      },
      {
        text: "🤝 짐승들과 협상한다 (평화롭지만 시간이 오래 걸린다)",
        next: "veloir_negotiate_beasts",
        scoreA: 25,
        scoreB: 25,
      },
      {
        text: "📢 다른 마을에 도움을 요청한다 (현명하지만 보상이 적다)",
        next: "veloir_request_help",
        scoreA: 15,
        scoreB: 15,
      },
    ],
  },
  // 누아르족 마을 이벤트
  noir_village_shadow_invasion: {
    text: "🌑 누아르족 마을에 그림자 생물들이 침입했습니다! 마을이 어둠으로 뒤덮이고 주민들이 공포에 떨고 있습니다. 그림자 생물들을 물리치면 마을의 비밀을 알 수 있지만, 위험할 수도 있습니다...",
    choices: [
      {
        text: "✨ 빛의 힘으로 그림자를 물리친다 (강력하지만 빛에 노출된다)",
        next: "defeat_shadows_with_light",
        scoreA: 55,
        scoreB: 55,
      },
      {
        text: "🌑 그림자와 동화된다 (어둠의 힘을 얻지만 정체성을 잃는다)",
        next: "merge_with_shadows",
        scoreA: 40,
        scoreB: 40,
      },
      {
        text: "🏃 어둠을 피해 도망간다 (안전하지만 그림자에게 쫓긴다)",
        next: "escape_from_darkness",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🔮 그림자의 비밀을 탐구한다 (지식을 얻지만 시간이 오래 걸린다)",
        next: "explore_shadow_secrets",
        scoreA: 30,
        scoreB: 30,
      },
    ],
  },
  noir_village_peaceful_night: {
    text: "🌙 누아르족 마을에서 평화로운 밤 축제가 열리고 있습니다! 그림자와 빛이 조화를 이루는 아름다운 축제에서 마을의 비밀을 배울 수 있습니다. 축제에 참여하면 특별한 선물을 받을 수 있습니다...",
    choices: [
      {
        text: "🎭 밤 축제에 참여한다",
        next: "join_night_festival",
        scoreA: 30,
        scoreB: 30,
      },
      {
        text: "🌑 그림자 춤을 춘다",
        next: "dance_with_shadows",
        scoreA: 35,
        scoreB: 35,
      },
      {
        text: "✨ 빛의 노래를 부른다",
        next: "sing_light_song",
        scoreA: 25,
        scoreB: 25,
      },
      {
        text: "🏃 축제를 지나간다",
        next: "pass_by_festival",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  // 실프레드족 마을 이벤트
  sylphred_village_wind_storm: {
    text: "🌪️ 실프레드족 마을에 거대한 바람 폭풍이 발생했습니다! 마을이 바람에 휘말려 위험에 처해 있고, 주민들이 도움을 요청하고 있습니다. 바람을 조절하면 마을의 비밀을 알 수 있습니다...",
    choices: [
      {
        text: "🌪️ 바람을 조절해서 폭풍을 잠재운다",
        next: "calm_wind_storm",
        scoreA: 40,
        scoreB: 40,
      },
      {
        text: "🏃 바람을 타고 도망간다",
        next: "ride_wind_to_escape",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🌪️ 바람과 함께 춤춘다",
        next: "dance_with_wind",
        scoreA: 30,
        scoreB: 30,
      },
      {
        text: "🏠 바람을 피해 숨어든다",
        next: "hide_from_wind",
        scoreA: -5,
        scoreB: -5,
      },
    ],
  },
  sylphred_village_sky_race: {
    text: "🏃‍♂️ 실프레드족 마을에서 하늘을 나는 경주가 열리고 있습니다! 바람을 타고 하늘을 자유롭게 날아다니는 경주에 참여하면 특별한 상품을 받을 수 있습니다. 하지만 실패하면 위험할 수도 있습니다...",
    choices: [
      {
        text: "🏃‍♂️ 하늘 경주에 참여한다",
        next: "join_sky_race",
        scoreA: 35,
        scoreB: 35,
      },
      {
        text: "🏆 경주 우승을 노린다",
        next: "aim_for_race_victory",
        scoreA: 50,
        scoreB: 50,
      },
      {
        text: "👀 경주를 구경만 한다",
        next: "watch_race_only",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🏃 경주를 피해 지나간다",
        next: "avoid_race",
        scoreA: 0,
        scoreB: 0,
      },
    ],
  },
  // 드라카르족 마을 이벤트
  drakar_village_dragon_attack: {
    text: "🐉 드라카르족 마을에 거대한 용이 공격해오고 있습니다! 마을이 불길에 휩싸이고 주민들이 공포에 떨고 있습니다. 용과 싸우거나 협상해서 마을을 구해야 합니다...",
    choices: [
      {
        text: "⚔️ 용과 용감하게 싸운다 (영웅이 되지만 죽을 수도 있다)",
        next: "bravely_fight_dragon",
        scoreA: 80,
        scoreB: 80,
      },
      {
        text: "🤝 용과 협상한다 (평화롭지만 용의 노예가 될 수도 있다)",
        next: "negotiate_with_dragon",
        scoreA: 50,
        scoreB: 50,
      },
      {
        text: "🏃 용을 피해 도망간다 (살지만 비겁하다고 욕먹는다)",
        next: "run_from_dragon",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 용의 분노를 진정시킨다 (현명하지만 시간이 오래 걸린다)",
        next: "calm_dragon_anger",
        scoreA: 60,
        scoreB: 60,
      },
    ],
  },
  drakar_village_honor_ceremony: {
    text: "🏛️ 드라카르족 마을에서 영광의 의식이 열리고 있습니다! 용감함과 명예를 기리는 의식에서 특별한 시련을 받을 수 있습니다. 의식에 참여하면 드라카르족의 비밀을 알 수 있습니다...",
    choices: [
      {
        text: "⚔️ 영광의 시련을 받는다",
        next: "accept_honor_trial",
        scoreA: 45,
        scoreB: 45,
      },
      {
        text: "🏆 최고의 영광을 노린다",
        next: "seek_greatest_honor",
        scoreA: 55,
        scoreB: 55,
      },
      {
        text: "👀 의식을 구경만 한다",
        next: "watch_ceremony_only",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🏃 의식을 피해 지나간다",
        next: "avoid_ceremony",
        scoreA: -10,
        scoreB: -10,
      },
    ],
  },
  // 룬마레족 마을 이벤트
  runmare_village_dream_nightmare: {
    text: "😴 룬마레족 마을에서 악몽이 현실이 되어 마을을 덮고 있습니다! 주민들이 악몽에 갇혀 괴로워하고 있고, 꿈의 세계를 구해야 합니다. 악몽을 물리치면 특별한 보상을 받을 수 있습니다...",
    choices: [
      {
        text: "💫 꿈의 힘으로 악몽을 물리친다",
        next: "defeat_nightmare_with_dreams",
        scoreA: 50,
        scoreB: 50,
      },
      {
        text: "😴 악몽 속으로 들어간다",
        next: "enter_nightmare_realm",
        scoreA: 35,
        scoreB: 35,
      },
      {
        text: "🏃 악몽을 피해 도망간다",
        next: "escape_from_nightmare",
        scoreA: -15,
        scoreB: -15,
      },
      {
        text: "🌙 달빛으로 악몽을 쫓아낸다",
        next: "chase_nightmare_with_moonlight",
        scoreA: 40,
        scoreB: 40,
      },
    ],
  },
  runmare_village_dream_festival: {
    text: "🌙 룬마레족 마을에서 꿈의 축제가 열리고 있습니다! 아름다운 꿈들이 현실이 되어 마을을 아름답게 장식하고 있습니다. 축제에 참여하면 특별한 꿈을 꿀 수 있습니다...",
    choices: [
      {
        text: "🌙 꿈의 축제에 참여한다",
        next: "join_dream_festival",
        scoreA: 35,
        scoreB: 35,
      },
      {
        text: "💫 가장 아름다운 꿈을 꾼다",
        next: "dream_most_beautiful_dream",
        scoreA: 45,
        scoreB: 45,
      },
      {
        text: "👀 축제를 구경만 한다",
        next: "watch_dream_festival_only",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "🏃 축제를 지나간다",
        next: "pass_by_dream_festival",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  // 모라스족 마을 이벤트
  moras_village_wisdom_crisis: {
    text: "📚 모라스족 마을에서 지혜의 위기가 발생했습니다! 고대의 지식이 사라지고 있고, 마을의 현자들이 혼란에 빠져 있습니다. 지혜를 되찾으면 특별한 보상을 받을 수 있습니다...",
    choices: [
      {
        text: "📖 잃어버린 지혜를 찾는다",
        next: "find_lost_wisdom",
        scoreA: 50,
        scoreB: 50,
      },
      {
        text: "🔍 고대 도서관을 탐험한다",
        next: "explore_ancient_library",
        scoreA: 40,
        scoreB: 40,
      },
      {
        text: "🏃 위기를 피해 도망간다",
        next: "escape_from_crisis",
        scoreA: -20,
        scoreB: -20,
      },
      {
        text: "🤝 다른 마을의 지혜를 빌린다",
        next: "borrow_wisdom_from_others",
        scoreA: 25,
        scoreB: 25,
      },
    ],
  },
  moras_village_wisdom_celebration: {
    text: "🎓 모라스족 마을에서 지혜의 축하 행사가 열리고 있습니다! 새로운 지식을 발견한 것을 기념하는 축제에서 특별한 지혜를 배울 수 있습니다. 축제에 참여하면 고대의 비밀을 알 수 있습니다...",
    choices: [
      {
        text: "🎓 지혜의 축제에 참여한다",
        next: "join_wisdom_celebration",
        scoreA: 40,
        scoreB: 40,
      },
      {
        text: "📚 가장 깊은 지혜를 배운다",
        next: "learn_deepest_wisdom",
        scoreA: 55,
        scoreB: 55,
      },
      {
        text: "👀 축제를 구경만 한다",
        next: "watch_wisdom_celebration_only",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🏃 축제를 지나간다",
        next: "pass_by_wisdom_celebration",
        scoreA: 8,
        scoreB: 8,
      },
    ],
  },
  // 에테르족 마을 이벤트
  ethereal_village_final_test: {
    text: "🔮 에테르족 마을에서 최종 시험이 시작됩니다! 모든 종족의 도움을 받은 자만이 받을 수 있는 특별한 시험입니다. 이 시험을 통과하면 시간의 계단의 모든 비밀을 알 수 있습니다...",
    choices: [
      {
        text: "⚡ 최종 시험을 받는다 (어렵지만 정당한 방법)",
        next: "take_final_test",
        scoreA: 80,
        scoreB: 80,
      },
      {
        text: "🌟 모든 힘을 다해 시험에 임한다 (최고의 결과지만 힘이 고갈된다)",
        next: "give_all_power_to_test",
        scoreA: 120,
        scoreB: 120,
      },
      {
        text: "🏃 시험을 피해 지나간다 (빠르지만 비겁하다고 욕먹는다)",
        next: "avoid_final_test",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🤝 시험관과 협상한다 (쉽지만 부정직하다고 여겨진다)",
        next: "negotiate_with_test_proctor",
        scoreA: 50,
        scoreB: 50,
      },
    ],
  },
  ethereal_village_guardian_challenge: {
    text: "🛡️ 에테르족 마을의 수호자가 도전을 제안합니다! 시간의 계단을 지키는 수호자와의 대결에서 승리하면 특별한 권한을 받을 수 있습니다. 하지만 패배하면 위험할 수도 있습니다...",
    choices: [
      {
        text: "⚔️ 수호자의 도전을 받아들인다",
        next: "accept_guardian_challenge",
        scoreA: 70,
        scoreB: 70,
      },
      {
        text: "🌟 모든 힘을 다해 싸운다",
        next: "fight_with_all_power",
        scoreA: 90,
        scoreB: 90,
      },
      {
        text: "🏃 도전을 피해 도망간다",
        next: "run_from_challenge",
        scoreA: -25,
        scoreB: -25,
      },
      {
        text: "🤝 수호자와 협상한다",
        next: "negotiate_with_guardian",
        scoreA: 50,
        scoreB: 50,
      },
    ],
  },
  // 마을 방문 완료 후 분기 노드들
  veloir_village_completed: {
    text: "✅ 벨로아족 마을 방문을 완료했습니다! 벨로아족의 전투 기술과 무리의 정신을 배웠습니다. 마을을 떠나기 전에 벨로아족과 동맹을 맺을지 결정해야 합니다. 동맹을 맺으면 강력한 조력자가 되지만, 동맹을 맺지 않으면 혼자서 진행해야 합니다...",
    choices: [
      {
        text: "🤝 벨로아족과 동맹을 맺는다 (강력한 조력자 획득)",
        next: "veloir_alliance_formed",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "👋 동맹 없이 떠난다 (자유롭지만 혼자서 진행)",
        next: "veloir_no_alliance",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  noir_village_completed: {
    text: "✅ 누아르족 마을 방문을 완료했습니다! 그림자의 힘과 시간 균열을 감지하는 방법을 배웠습니다. 마을을 떠나기 전에 누아르족과 동맹을 맺을지 결정해야 합니다. 동맹을 맺으면 그림자의 힘을 얻을 수 있지만, 동맹을 맺지 않으면 어둠 속에서 혼자 진행해야 합니다...",
    choices: [
      {
        text: "🤝 누아르족과 동맹을 맺는다 (그림자의 힘 획득)",
        next: "noir_alliance_formed",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "👋 동맹 없이 떠난다 (자유롭지만 어둠 속에서 진행)",
        next: "noir_no_alliance",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  sylphred_village_completed: {
    text: "✅ 실프레드족 마을 방문을 완료했습니다! 바람을 조종하는 법과 미래 예언의 힘을 배웠습니다. 마을을 떠나기 전에 실프레드족과 동맹을 맺을지 결정해야 합니다. 동맹을 맺으면 바람의 힘을 얻을 수 있지만, 동맹을 맺지 않으면 바람 속에서 혼자 진행해야 합니다...",
    choices: [
      {
        text: "🤝 실프레드족과 동맹을 맺는다 (바람의 힘 획득)",
        next: "sylphred_alliance_formed",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "👋 동맹 없이 떠난다 (자유롭지만 바람 속에서 진행)",
        next: "sylphred_no_alliance",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  drakar_village_completed: {
    text: "✅ 드라카르족 마을 방문을 완료했습니다! 용의 불꽃을 다루는 법과 명예의 정신을 배웠습니다. 마을을 떠나기 전에 드라카르족과 동맹을 맺을지 결정해야 합니다. 동맹을 맺으면 용의 힘을 얻을 수 있지만, 동맹을 맺지 않으면 혼자서 진행해야 합니다...",
    choices: [
      {
        text: "🤝 드라카르족과 동맹을 맺는다 (용의 힘 획득)",
        next: "drakar_alliance_formed",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "👋 동맹 없이 떠난다 (자유롭지만 혼자서 진행)",
        next: "drakar_no_alliance",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  runmare_village_completed: {
    text: "✅ 룬마레족 마을 방문을 완료했습니다! 꿈을 다루는 법과 현실과 꿈의 경계를 배웠습니다. 마을을 떠나기 전에 룬마레족과 동맹을 맺을지 결정해야 합니다. 동맹을 맺으면 꿈의 힘을 얻을 수 있지만, 동맹을 맺지 않으면 혼자서 진행해야 합니다...",
    choices: [
      {
        text: "🤝 룬마레족과 동맹을 맺는다 (꿈의 힘 획득)",
        next: "runmare_alliance_formed",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "👋 동맹 없이 떠난다 (자유롭지만 혼자서 진행)",
        next: "runmare_no_alliance",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  moras_village_completed: {
    text: "✅ 모라스족 마을 방문을 완료했습니다! 고대의 지혜와 시간의 비밀을 배웠습니다. 마을을 떠나기 전에 모라스족과 동맹을 맺을지 결정해야 합니다. 동맹을 맺으면 고대의 지혜를 얻을 수 있지만, 동맹을 맺지 않으면 혼자서 진행해야 합니다...",
    choices: [
      {
        text: "🤝 모라스족과 동맹을 맺는다 (고대의 지혜 획득)",
        next: "moras_alliance_formed",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "👋 동맹 없이 떠난다 (자유롭지만 혼자서 진행)",
        next: "moras_no_alliance",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  // 동맹 선택 후 분기 노드들
  veloir_alliance_formed: {
    text: "🤝 벨로아족과 동맹을 맺었습니다! 벨로아족의 강력한 전투력과 무리의 정신이 당신의 여정에 큰 도움이 될 것입니다. 하지만 동맹을 맺은 만큼 벨로아족의 의견을 존중해야 하고, 그들의 전투적 성향 때문에 평화로운 접근이 어려워질 수 있습니다. 또한 벨로아족과 동맹을 맺으면 드라카르족이 적대적이 될 수 있다는 소문이 있습니다...",
    choices: [
      {
        text: "🌑 누아르족의 마을로 향한다 (벨로아족이 그림자를 싫어한다고 경고)",
        next: "visit_noir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다 (벨로아족이 바람을 타는 것을 좋아한다)",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다 (벨로아족이 용을 싫어한다고 경고)",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다 (벨로아족이 꿈을 이해하지 못한다)",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "📚 모라스족의 마을로 향한다 (벨로아족이 지혜보다 전투를 선호한다)",
        next: "visit_moras_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "📚 도서관에서 시간의 비밀을 연구한다 (벨로아족이 책 읽기를 싫어한다)",
        next: "research_time_secrets",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🏪 상점에서 시간의 물건을 구매한다 (벨로아족이 물건 사기를 좋아한다)",
        next: "buy_time_items",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "🌲 숲에서 시간의 꽃을 수집한다 (벨로아족이 자연을 좋아한다)",
        next: "collect_time_flowers",
        scoreA: 7,
        scoreB: 7,
      },
    ],
  },
  veloir_no_alliance: {
    text: "👋 벨로아족과 동맹을 맺지 않고 떠났습니다. 자유롭게 여행할 수 있고 어떤 선택이든 할 수 있지만, 혼자서는 시간의 계단에 도달하기 어려울 수 있습니다. 하지만 중립적인 입장이기 때문에 모든 종족과 평화롭게 접근할 수 있습니다...",
    choices: [
      {
        text: "🌑 누아르족의 마을로 향한다 (중립적 접근 가능)",
        next: "visit_noir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다 (중립적 접근 가능)",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다 (중립적 접근 가능)",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다 (중립적 접근 가능)",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "📚 모라스족의 마을로 향한다 (중립적 접근 가능)",
        next: "visit_moras_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "📚 도서관에서 시간의 비밀을 연구한다 (자유로운 연구)",
        next: "research_time_secrets",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🏪 상점에서 시간의 물건을 구매한다 (자유로운 구매)",
        next: "buy_time_items",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "🌲 숲에서 시간의 꽃을 수집한다 (자유로운 탐험)",
        next: "collect_time_flowers",
        scoreA: 7,
        scoreB: 7,
      },
    ],
  },
  // 동맹 간 충돌 노드들
  veloir_drakar_conflict: {
    text: "⚔️ 벨로아족과 드라카르족 간의 갈등이 발생했습니다! 벨로아족과 동맹을 맺었기 때문에 드라카르족이 당신을 적으로 여기고 있습니다. 드라카르족의 마을에 도착하자마자 적대적인 분위기를 느낄 수 있고, 동맹 관계 때문에 평화로운 접근이 어려워졌습니다. 벨로아족의 동맹을 유지할지, 아니면 드라카르족과의 관계를 위해 동맹을 포기할지 결정해야 합니다...",
    choices: [
      {
        text: "🛡️ 벨로아족 동맹을 유지한다 (강력한 조력자 유지, 드라카르족 적대)",
        next: "visit_drakar_village",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🤝 벨로아족 동맹을 포기한다 (드라카르족과 평화, 벨로아족 배신)",
        next: "visit_drakar_village",
        scoreA: -10,
        scoreB: -10,
      },
      {
        text: "🏃 다른 마을로 도망간다 (갈등을 피해 도망)",
        next: "visit_sylphred_village",
        scoreA: 0,
        scoreB: 0,
      },
    ],
  },
  noir_sylphred_conflict: {
    text: "🌑 누아르족과 실프레드족 간의 갈등이 발생했습니다! 누아르족과 동맹을 맺었기 때문에 실프레드족이 당신을 의심하고 있습니다. 그림자와 바람은 서로 상극이라서, 누아르족의 동맹 때문에 실프레드족과의 관계가 어려워졌습니다. 누아르족의 동맹을 유지할지, 아니면 실프레드족과의 관계를 위해 동맹을 포기할지 결정해야 합니다...",
    choices: [
      {
        text: "🛡️ 누아르족 동맹을 유지한다 (그림자의 힘 유지, 실프레드족 적대)",
        next: "visit_sylphred_village",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🤝 누아르족 동맹을 포기한다 (실프레드족과 평화, 누아르족 배신)",
        next: "visit_sylphred_village",
        scoreA: -10,
        scoreB: -10,
      },
      {
        text: "🏃 다른 마을로 도망간다 (갈등을 피해 도망)",
        next: "visit_runmare_village",
        scoreA: 0,
        scoreB: 0,
      },
    ],
  },
  // 새로운 동맹 노드들
  drakar_alliance_formed: {
    text: "🤝 드라카르족과 동맹을 맺었습니다! 드라카르족의 강력한 용의 힘과 명예의 정신이 당신의 여정에 큰 도움이 될 것입니다. 하지만 동맹을 맺은 만큼 드라카르족의 의견을 존중해야 하고, 그들의 명예 중시 성향 때문에 유연한 접근이 어려워질 수 있습니다. 또한 드라카르족과 동맹을 맺으면 벨로아족이 적대적이 될 수 있다는 소문이 있습니다...",
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다 (드라카르족이 전투를 좋아한다고 경고)",
        next: "visit_veloir_village_with_drakar_alliance",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌑 누아르족의 마을로 향한다 (드라카르족이 그림자를 경계한다)",
        next: "visit_noir_village_with_drakar_alliance",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다 (드라카르족이 바람을 타는 것을 좋아한다)",
        next: "visit_sylphred_village_with_drakar_alliance",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다 (드라카르족이 꿈의 힘을 인정한다)",
        next: "visit_runmare_village_with_drakar_alliance",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "📚 모라스족의 마을로 향한다 (드라카르족이 고대 지혜를 존중한다)",
        next: "visit_moras_village_with_drakar_alliance",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  drakar_no_alliance: {
    text: "👋 드라카르족과 동맹을 맺지 않고 떠났습니다. 자유롭게 여행할 수 있고 어떤 선택이든 할 수 있지만, 혼자서는 시간의 계단에 도달하기 어려울 수 있습니다. 하지만 중립적인 입장이기 때문에 모든 종족과 평화롭게 접근할 수 있습니다...",
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "visit_veloir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "visit_noir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "📚 모라스족의 마을로 향한다",
        next: "visit_moras_village",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  runmare_alliance_formed: {
    text: "🤝 룬마레족과 동맹을 맺었습니다! 룬마레족의 꿈을 다루는 능력과 예지의 힘이 당신의 여정에 큰 도움이 될 것입니다. 하지만 동맹을 맺은 만큼 룬마레족의 의견을 존중해야 하고, 그들의 꿈에 의존하는 성향 때문에 현실적인 접근이 어려워질 수 있습니다. 또한 룬마레족과 동맹을 맺으면 누아르족이 적대적이 될 수 있다는 소문이 있습니다...",
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다 (룬마레족이 전투의 꿈을 예지했다)",
        next: "visit_veloir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌑 누아르족의 마을로 향한다 (룬마레족이 그림자와 꿈이 상극이라고 경고)",
        next: "visit_noir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다 (룬마레족이 바람과 꿈이 조화를 이룬다고 예지)",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다 (룬마레족이 용의 꿈을 예지했다)",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "📚 모라스족의 마을로 향한다 (룬마레족이 고대 지혜의 꿈을 예지했다)",
        next: "visit_moras_village",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  runmare_no_alliance: {
    text: "👋 룬마레족과 동맹을 맺지 않고 떠났습니다. 자유롭게 여행할 수 있고 어떤 선택이든 할 수 있지만, 혼자서는 시간의 계단에 도달하기 어려울 수 있습니다. 하지만 중립적인 입장이기 때문에 모든 종족과 평화롭게 접근할 수 있습니다...",
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "visit_veloir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "visit_noir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "📚 모라스족의 마을로 향한다",
        next: "visit_moras_village",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  moras_alliance_formed: {
    text: "🤝 모라스족과 동맹을 맺었습니다! 모라스족의 고대의 지혜와 시간의 비밀에 대한 깊은 이해가 당신의 여정에 큰 도움이 될 것입니다. 하지만 동맹을 맺은 만큼 모라스족의 의견을 존중해야 하고, 그들의 보수적인 성향 때문에 혁신적인 접근이 어려워질 수 있습니다. 또한 모라스족과 동맹을 맺으면 다른 종족들이 당신을 지나치게 신중한 존재로 여길 수 있습니다...",
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다 (모라스족이 전투의 지혜를 가르쳐줬다)",
        next: "visit_veloir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌑 누아르족의 마을로 향한다 (모라스족이 그림자의 고대 비밀을 알려줬다)",
        next: "visit_noir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다 (모라스족이 바람의 고대 지혜를 전수했다)",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다 (모라스족이 용의 고대 비밀을 알려줬다)",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다 (모라스족이 꿈의 고대 지혜를 전수했다)",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  moras_no_alliance: {
    text: "👋 모라스족과 동맹을 맺지 않고 떠났습니다. 자유롭게 여행할 수 있고 어떤 선택이든 할 수 있지만, 혼자서는 시간의 계단에 도달하기 어려울 수 있습니다. 하지만 중립적인 입장이기 때문에 모든 종족과 평화롭게 접근할 수 있습니다...",
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "visit_veloir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "visit_noir_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🌊 룬마레족의 마을로 향한다",
        next: "visit_runmare_village",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  // 동맹 간 갈등 이벤트들
  visit_veloir_village_with_drakar_alliance: {
    text: "🐺 벨로아족 마을에 도착했습니다! 하지만 드라카르족과의 동맹 때문에 벨로아족들이 당신을 적대적으로 대하고 있습니다. 벨로아족의 족장이 나타나서 '드라카르족과 동맹을 맺은 자는 우리의 적이다! 용의 불꽃은 우리의 전투 정신을 모욕한다!'라고 외칩니다. 이 상황을 어떻게 해결할까요?",
    choices: [
      {
        text: "🛡️ 드라카르족 동맹을 유지한다 (벨로아족과 전투)",
        next: "veloir_drakar_conflict",
        scoreA: -10,
        scoreB: -10,
      },
      {
        text: "🤝 벨로아족과 협상한다 (드라카르족 동맹 유지하면서 평화 추구)",
        next: "veloir_drakar_negotiation",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "💔 드라카르족 동맹을 포기한다 (벨로아족과 새로운 동맹)",
        next: "veloir_alliance_formed",
        scoreA: 10,
        scoreB: 10,
      },
    ],
  },
  veloir_drakar_conflict: {
    text: "⚔️ 벨로아족과 드라카르족 간의 전투가 시작되었습니다! 드라카르족의 용의 불꽃과 벨로아족의 전투 정신이 충돌하고 있습니다. 이 전투에서 승리하면 두 종족 모두의 힘을 얻을 수 있지만, 패배하면 모든 동맹이 무너질 수 있습니다...",
    choices: [
      {
        text: "🔥 드라카르족의 용의 불꽃으로 공격한다",
        next: "drakar_fire_attack",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🛡️ 방어 태세를 취하며 협상 기회를 노린다",
        next: "defensive_negotiation",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🏃 전투를 피해 도망친다",
        next: "escape_from_conflict",
        scoreA: -5,
        scoreB: -5,
      },
    ],
  },
  veloir_drakar_negotiation: {
    text: "🤝 벨로아족과 드라카르족 간의 협상이 시작되었습니다! 당신의 중재로 두 종족이 서로의 차이점을 이해하고 공통점을 찾기 시작했습니다. 벨로아족의 전투 정신과 드라카르족의 명예가 결합되면 어떤 결과가 나올까요?",
    choices: [
      {
        text: "🤝 두 종족 모두와 동맹을 맺는다 (강력한 이중 동맹)",
        next: "veloir_drakar_double_alliance",
        scoreA: 25,
        scoreB: 25,
      },
      {
        text: "⚖️ 중립을 유지하며 양쪽 모두의 도움을 받는다",
        next: "neutral_mediator",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🔄 새로운 동맹 체계를 제안한다",
        next: "new_alliance_system",
        scoreA: 20,
        scoreB: 20,
      },
    ],
  },
  visit_noir_village_with_runmare_alliance: {
    text: "🌑 누아르족 마을에 도착했습니다! 하지만 룬마레족과의 동맹 때문에 누아르족들이 당신을 의심하고 있습니다. 누아르족의 족장이 나타나서 '꿈과 그림자는 상극이다! 룬마레족의 예지는 우리의 그림자 비밀을 위협한다!'라고 말합니다. 이 상황을 어떻게 해결할까요?",
    choices: [
      {
        text: "🛡️ 룬마레족 동맹을 유지한다 (누아르족과 대립)",
        next: "noir_runmare_conflict",
        scoreA: -10,
        scoreB: -10,
      },
      {
        text: "🤝 누아르족과 협상한다 (룬마레족 동맹 유지하면서 평화 추구)",
        next: "noir_runmare_negotiation",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "💔 룬마레족 동맹을 포기한다 (누아르족과 새로운 동맹)",
        next: "noir_alliance_formed",
        scoreA: 10,
        scoreB: 10,
      },
    ],
  },
  noir_runmare_conflict: {
    text: "🌑 룬마레족과 누아르족 간의 갈등이 심화되었습니다! 꿈의 예지와 그림자의 비밀 사이에서 균열이 생기고 있습니다. 이 갈등을 해결하지 못하면 두 종족 모두의 힘을 잃을 수 있습니다...",
    choices: [
      {
        text: "🌙 룬마레족의 꿈 예지로 누아르족을 설득한다",
        next: "dream_persuasion",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🌑 누아르족의 그림자 비밀을 활용한다",
        next: "shadow_secret_usage",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "⚖️ 두 힘의 조화를 시도한다",
        next: "dream_shadow_harmony",
        scoreA: 20,
        scoreB: 20,
      },
    ],
  },
  // 중간 이벤트들 - 마을 간 이동 시
  between_villages_event: {
    text: "🌲 마을 간 이동 중에 신비로운 숲을 발견했습니다! 이 숲에는 시간의 꽃들이 피어있고, 각 꽃마다 다른 종족의 비밀을 담고 있다고 합니다. 어떤 꽃을 선택할까요?",
    choices: [
      {
        text: "🔥 불꽃 꽃 (드라카르족의 비밀)",
        next: "fire_flower_secret_new",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🌙 그림자 꽃 (누아르족의 비밀)",
        next: "shadow_flower_secret",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🌪️ 바람 꽃 (실프레드족의 비밀)",
        next: "wind_flower_secret",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🌊 물 꽃 (룬마레족의 비밀)",
        next: "water_flower_secret",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "📚 지혜 꽃 (모라스족의 비밀)",
        next: "wisdom_flower_secret",
        scoreA: 8,
        scoreB: 8,
      },
    ],
  },
  fire_flower_secret_new: {
    text: "🔥 불꽃 꽃을 선택했습니다! 꽃에서 드라카르족의 고대 비밀을 알 수 있습니다. '용의 불꽃은 시간을 녹일 수 있다'는 비밀을 발견했습니다. 이 지식을 어떻게 활용할까요?",
    choices: [
      {
        text: "🔥 드라카르족에게 이 비밀을 알려준다 (동맹 강화)",
        next: "share_fire_secret_with_drakar",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "🤝 다른 종족들과 이 비밀을 공유한다 (평화 조성)",
        next: "share_fire_secret_with_all",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🔒 이 비밀을 혼자 간직한다 (개인 힘)",
        next: "keep_fire_secret",
        scoreA: 15,
        scoreB: 15,
      },
    ],
  },
  // 벨로아족 마을 확장 이벤트들 (새로운 버전)
  veloir_festival_combat: {
    text: "⚔️ 전투 축제에 참여했습니다! 무시무시한 전투가 벌어지고 있고, 당신은 벨로아족의 전투 기술을 직접 체험할 수 있습니다. 전투의 열기 속에서 무리의 정신을 깨닫게 됩니다...",
    choices: [
      {
        text: "👑 전투에서 승리하여 무리의 리더가 된다",
        next: "veloir_combat_victory",
        scoreA: 50,
        scoreB: 50,
      },
      {
        text: "🤝 전투를 통해 무리와의 우정을 쌓는다",
        next: "veloir_combat_friendship",
        scoreA: 35,
        scoreB: 35,
      },
      {
        text: "💪 전투 기술을 배워 개인 실력을 향상시킨다",
        next: "veloir_combat_skill",
        scoreA: 40,
        scoreB: 40,
      },
      {
        text: "🏆 전투 대회에서 우승하여 명예를 얻는다",
        next: "veloir_combat_champion",
        scoreA: 60,
        scoreB: 60,
      },
    ],
  },
  veloir_combat_victory: {
    text: "👑 전투에서 승리하여 무리의 리더가 되었습니다! 벨로아족들이 당신을 존경하며 따르고 있습니다. 무리의 정신과 리더십의 중요성을 깨닫게 되었습니다...",
    choices: [
      {
        text: "🎯 다음 도전을 준비한다",
        next: "veloir_village_completed",
        scoreA: 10,
        scoreB: 10,
      },
    ],
  },
  veloir_combat_friendship: {
    text: "🤝 전투를 통해 무리와의 우정을 쌓았습니다! 벨로아족들과 깊은 유대감을 형성했고, 그들의 문화와 정신을 이해하게 되었습니다...",
    choices: [
      {
        text: "🤝 우정을 더욱 깊게 한다",
        next: "veloir_village_completed",
        scoreA: 8,
        scoreB: 8,
      },
    ],
  },
  veloir_combat_skill: {
    text: "💪 전투 기술을 배워 개인 실력을 향상시켰습니다! 벨로아족의 고유한 전투 기술을 습득했고, 무리의 협력 정신도 함께 배웠습니다...",
    choices: [
      {
        text: "⚔️ 기술을 더욱 연마한다",
        next: "veloir_village_completed",
        scoreA: 12,
        scoreB: 12,
      },
    ],
  },
  veloir_combat_champion: {
    text: "🏆 전투 대회에서 우승하여 명예를 얻었습니다! 벨로아족 마을의 영웅이 되었고, 모든 무리들이 당신을 인정하고 있습니다...",
    choices: [
      {
        text: "🏆 영웅의 자리를 받아들인다",
        next: "veloir_village_completed",
        scoreA: 15,
        scoreB: 15,
      },
    ],
  },
  veloir_festival_spectate: {
    text: "🎭 축제를 구경하기로 했습니다! 벨로아족들의 다양한 전통과 문화를 관찰할 수 있습니다. 축제의 분위기를 즐기면서 마을의 분위기를 파악할 수 있습니다...",
    choices: [
      {
        text: "📚 축제를 통해 벨로아족의 역사를 배운다",
        next: "veloir_spectate_history",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🎵 축제의 음악과 춤을 관찰한다",
        next: "veloir_spectate_music",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🍺 축제의 음식을 맛보며 문화를 체험한다",
        next: "veloir_spectate_food",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🤝 축제를 통해 마을 사람들과 친해진다",
        next: "veloir_spectate_social",
        scoreA: 12,
        scoreB: 12,
      },
    ],
  },
  veloir_spectate_history: {
    text: "📚 축제를 통해 벨로아족의 역사를 배웠습니다! 그들의 전통과 문화에 대한 깊은 이해를 얻었고, 무리의 정신이 어떻게 형성되었는지 알게 되었습니다...",
    choices: [
      {
        text: "📖 더 많은 역사를 배운다",
        next: "veloir_village_completed",
        scoreA: 8,
        scoreB: 8,
      },
    ],
  },
  veloir_spectate_music: {
    text: "🎵 축제의 음악과 춤을 관찰했습니다! 벨로아족의 예술적 재능과 문화적 표현을 체험했고, 그들의 감정적 특성을 이해하게 되었습니다...",
    choices: [
      {
        text: "🎶 음악에 더욱 몰입한다",
        next: "veloir_village_completed",
        scoreA: 6,
        scoreB: 6,
      },
    ],
  },
  veloir_spectate_food: {
    text: "🍺 축제의 음식을 맛보며 문화를 체험했습니다! 벨로아족의 전통 음식과 문화를 직접 체험했고, 그들과의 유대감이 깊어졌습니다...",
    choices: [
      {
        text: "🍽️ 더 많은 음식을 맛본다",
        next: "veloir_village_completed",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  veloir_spectate_social: {
    text: "🤝 축제를 통해 마을 사람들과 친해졌습니다! 벨로아족들과 자연스럽게 어울리면서 그들의 문화와 정신을 이해하게 되었습니다...",
    choices: [
      {
        text: "🤝 더 깊은 우정을 쌓는다",
        next: "veloir_village_completed",
        scoreA: 7,
        scoreB: 7,
      },
    ],
  },
  veloir_festival_champion: {
    text: "🏆 축제 우승을 노리기로 했습니다! 가장 위험하고 어려운 도전이지만, 성공하면 최고의 보상을 받을 수 있습니다. 모든 무리들이 당신을 주목하고 있습니다...",
    choices: [
      {
        text: "⚔️ 최고의 전투 기술로 우승한다",
        next: "veloir_champion_combat",
        scoreA: 80,
        scoreB: 80,
      },
      {
        text: "🎭 예술적 재능으로 우승한다",
        next: "veloir_champion_art",
        scoreA: 70,
        scoreB: 70,
      },
      {
        text: "🧠 지혜와 전략으로 우승한다",
        next: "veloir_champion_wisdom",
        scoreA: 75,
        scoreB: 75,
      },
      {
        text: "💪 체력과 인내로 우승한다",
        next: "veloir_champion_endurance",
        scoreA: 65,
        scoreB: 65,
      },
    ],
  },
  veloir_champion_combat: {
    text: "⚔️ 최고의 전투 기술로 우승했습니다! 벨로아족 마을의 전설적인 전사가 되었고, 모든 무리들이 당신을 최고의 영웅으로 인정하고 있습니다...",
    choices: [
      {
        text: "🏆 전설의 자리를 받아들인다",
        next: "veloir_village_completed",
        scoreA: 20,
        scoreB: 20,
      },
    ],
  },
  veloir_champion_art: {
    text: "🎭 예술적 재능으로 우승했습니다! 벨로아족의 예술과 문화를 완벽하게 이해하고 표현했고, 그들의 감정적 특성을 예술로 승화시켰습니다...",
    choices: [
      {
        text: "🎨 예술가의 길을 걷는다",
        next: "veloir_village_completed",
        scoreA: 18,
        scoreB: 18,
      },
    ],
  },
  veloir_champion_wisdom: {
    text: "🧠 지혜와 전략으로 우승했습니다! 벨로아족의 무리 정신과 전략적 사고를 완벽하게 이해했고, 그들의 문화를 지혜롭게 활용했습니다...",
    choices: [
      {
        text: "🧠 현자의 길을 걷는다",
        next: "veloir_village_completed",
        scoreA: 19,
        scoreB: 19,
      },
    ],
  },
  veloir_champion_endurance: {
    text: "💪 체력과 인내로 우승했습니다! 벨로아족의 강인한 정신과 끈기를 완벽하게 보여주었고, 그들의 무리 정신을 체력으로 승화시켰습니다...",
    choices: [
      {
        text: "💪 강자의 길을 걷는다",
        next: "veloir_village_completed",
        scoreA: 17,
        scoreB: 17,
      },
    ],
  },
  veloir_skip_explore: {
    text: "🏠 마을의 다른 곳을 탐험했습니다! 축제를 피했지만 마을의 다른 매력적인 곳들을 발견했고, 벨로아족의 일상생활을 관찰할 수 있었습니다...",
    choices: [
      {
        text: "🔍 더 많은 곳을 탐험한다",
        next: "veloir_village_completed",
        scoreA: 10,
        scoreB: 10,
      },
    ],
  },
  veloir_skip_library: {
    text: "📚 마을 도서관에서 지식을 얻었습니다! 벨로아족의 역사와 문화에 대한 깊은 지식을 습득했고, 그들의 전통과 정신을 이해하게 되었습니다...",
    choices: [
      {
        text: "📖 더 많은 지식을 얻는다",
        next: "veloir_village_completed",
        scoreA: 12,
        scoreB: 12,
      },
    ],
  },
  veloir_skip_nature: {
    text: "🌿 마을 주변의 자연을 탐험했습니다! 벨로아족이 살고 있는 자연 환경을 체험했고, 그들이 자연과 어떻게 조화를 이루며 살아가는지 알게 되었습니다...",
    choices: [
      {
        text: "🌲 자연을 더욱 탐험한다",
        next: "veloir_village_completed",
        scoreA: 9,
        scoreB: 9,
      },
    ],
  },
  veloir_skip_conversation: {
    text: "🤝 마을 사람들과 개별적으로 대화했습니다! 축제를 피했지만 개인적인 대화를 통해 벨로아족들의 진심을 들을 수 있었고, 그들과의 유대감을 형성했습니다...",
    choices: [
      {
        text: "💬 더 깊은 대화를 나눈다",
        next: "veloir_village_completed",
        scoreA: 8,
        scoreB: 8,
      },
    ],
  },
  veloir_defense_line: {
    text: "🛡️ 방어선을 구축하여 마을을 지켰습니다! 벨로아족들과 함께 완벽한 방어 체계를 구축했고, 무리의 협력 정신을 체험했습니다...",
    choices: [
      {
        text: "🛡️ 방어를 더욱 강화한다",
        next: "veloir_village_completed",
        scoreA: 12,
        scoreB: 12,
      },
    ],
  },
  veloir_aggressive_attack: {
    text: "⚔️ 적극적으로 공격하여 적을 물리쳤습니다! 벨로아족의 전투 정신을 직접 체험했고, 무리의 힘을 완벽하게 활용했습니다...",
    choices: [
      {
        text: "⚔️ 승리를 더욱 확실히 한다",
        next: "veloir_village_completed",
        scoreA: 15,
        scoreB: 15,
      },
    ],
  },
  veloir_cooperative_battle: {
    text: "🤝 다른 무리들과 협력하여 전투했습니다! 벨로아족의 협력 정신을 직접 체험했고, 무리 간의 유대감을 깊게 느꼈습니다...",
    choices: [
      {
        text: "🤝 협력을 더욱 강화한다",
        next: "veloir_village_completed",
        scoreA: 10,
        scoreB: 10,
      },
    ],
  },
  veloir_strategic_retreat: {
    text: "🏃 전략적 후퇴를 통해 상황을 파악했습니다! 벨로아족의 전략적 사고를 배웠고, 무리의 지혜를 체험했습니다...",
    choices: [
      {
        text: "🧠 전략을 더욱 세밀하게 계획한다",
        next: "veloir_village_completed",
        scoreA: 8,
        scoreB: 8,
      },
    ],
  },
  veloir_pack_leader: {
    text: "👑 무리의 리더가 되어 훈련을 이끌었습니다! 벨로아족의 리더십과 무리 정신을 직접 체험했고, 그들의 문화를 깊이 이해하게 되었습니다...",
    choices: [
      {
        text: "👑 리더십을 더욱 발전시킨다",
        next: "veloir_village_completed",
        scoreA: 16,
        scoreB: 16,
      },
    ],
  },
  veloir_pack_cooperation: {
    text: "🤝 무리와 함께 협력하여 훈련했습니다! 벨로아족의 협력 정신과 무리의 힘을 직접 체험했고, 그들과의 유대감을 깊게 형성했습니다...",
    choices: [
      {
        text: "🤝 협력을 더욱 강화한다",
        next: "veloir_village_completed",
        scoreA: 12,
        scoreB: 12,
      },
    ],
  },
  veloir_individual_combat: {
    text: "⚔️ 개인 전투 기술을 집중적으로 훈련했습니다! 벨로아족의 고유한 전투 기술을 습득했고, 개인의 강함과 무리의 힘의 조화를 배웠습니다...",
    choices: [
      {
        text: "⚔️ 기술을 더욱 연마한다",
        next: "veloir_village_completed",
        scoreA: 10,
        scoreB: 10,
      },
    ],
  },
  veloir_pack_strategy: {
    text: "🎯 무리의 전략과 전술을 배웠습니다! 벨로아족의 전략적 사고와 무리의 협력 전술을 이해했고, 그들의 문화적 특성을 깊이 파악했습니다...",
    choices: [
      {
        text: "🎯 전략을 더욱 발전시킨다",
        next: "veloir_village_completed",
        scoreA: 11,
        scoreB: 11,
      },
    ],
  },
  veloir_anger_control: {
    text: "😤 분노의 감정을 통제하는 법을 배웠습니다! 벨로아족의 감정적 특성을 이해했고, 분노를 힘으로 변환하는 방법을 습득했습니다...",
    choices: [
      {
        text: "😤 통제력을 더욱 향상시킨다",
        next: "veloir_village_completed",
        scoreA: 9,
        scoreB: 9,
      },
    ],
  },
  veloir_sadness_overcome: {
    text: "😢 슬픔과 외로움을 극복하는 법을 배웠습니다! 벨로아족의 감정적 특성을 이해했고, 어려운 감정을 극복하는 방법을 습득했습니다...",
    choices: [
      {
        text: "😢 극복력을 더욱 강화한다",
        next: "veloir_village_completed",
        scoreA: 8,
        scoreB: 8,
      },
    ],
  },
  veloir_joy_sharing: {
    text: "😊 기쁨과 희망의 감정을 나누는 법을 배웠습니다! 벨로아족의 감정적 특성을 이해했고, 긍정적인 감정을 나누는 방법을 습득했습니다...",
    choices: [
      {
        text: "😊 기쁨을 더욱 나눈다",
        next: "veloir_village_completed",
        scoreA: 6,
        scoreB: 6,
      },
    ],
  },
  veloir_emotion_to_power: {
    text: "💪 감정을 전투력으로 변환하는 법을 배웠습니다! 벨로아족의 감정적 특성을 완벽하게 이해했고, 감정을 힘으로 변환하는 고급 기술을 습득했습니다...",
    choices: [
      {
        text: "💪 변환력을 더욱 발전시킨다",
        next: "veloir_village_completed",
        scoreA: 12,
        scoreB: 12,
      },
    ],
  },
  veloir_ancient_temple: {
    text: "🏛️ 고대 사원에서 벨로아족의 기원을 발견했습니다! 그들의 고대 전통과 문화의 뿌리를 이해하게 되었고, 무리의 정신이 어떻게 형성되었는지 알게 되었습니다...",
    choices: [
      {
        text: "🏛️ 더 많은 비밀을 탐구한다",
        next: "veloir_village_completed",
        scoreA: 15,
        scoreB: 15,
      },
    ],
  },
  veloir_secret_library: {
    text: "📚 비밀 도서관에서 고대 전투 기술을 배웠습니다! 벨로아족의 전설적인 전투 기술을 습득했고, 그들의 문화적 유산을 이해하게 되었습니다...",
    choices: [
      {
        text: "📚 더 많은 지식을 얻는다",
        next: "veloir_village_completed",
        scoreA: 13,
        scoreB: 13,
      },
    ],
  },
  veloir_sacred_forest: {
    text: "🌿 신성한 숲에서 자연의 힘을 체험했습니다! 벨로아족과 자연의 조화를 이해했고, 그들의 영적 세계를 경험했습니다...",
    choices: [
      {
        text: "🌿 자연의 힘을 더욱 깊게 체험한다",
        next: "veloir_village_completed",
        scoreA: 11,
        scoreB: 11,
      },
    ],
  },
  veloir_treasure_room: {
    text: "💎 보물창고에서 전설의 무기를 발견했습니다! 벨로아족의 전설적인 무기를 획득했고, 그들의 전투 문화를 완벽하게 이해하게 되었습니다...",
    choices: [
      {
        text: "💎 무기의 힘을 더욱 깊게 이해한다",
        next: "veloir_village_completed",
        scoreA: 17,
        scoreB: 17,
      },
    ],
  },
  veloir_moonlight_ceremony: {
    text: "🌕 달빛 의식에 적극적으로 참여했습니다! 벨로아족의 영적 세계를 직접 체험했고, 그들의 신성한 전통을 이해하게 되었습니다...",
    choices: [
      {
        text: "🌕 영적 체험을 더욱 깊게 한다",
        next: "veloir_village_completed",
        scoreA: 10,
        scoreB: 10,
      },
    ],
  },
  veloir_ceremony_prophecy: {
    text: "🔮 의식의 예언을 들었습니다! 벨로아족의 미래에 대한 통찰을 얻었고, 그들의 영적 지혜를 이해하게 되었습니다...",
    choices: [
      {
        text: "🔮 예언의 의미를 더욱 깊게 이해한다",
        next: "veloir_village_completed",
        scoreA: 12,
        scoreB: 12,
      },
    ],
  },
  veloir_ceremony_dance: {
    text: "🎭 의식의 춤과 음악에 참여했습니다! 벨로아족의 문화적 표현을 직접 체험했고, 그들과의 유대감을 깊게 형성했습니다...",
    choices: [
      {
        text: "🎭 문화적 체험을 더욱 깊게 한다",
        next: "veloir_village_completed",
        scoreA: 8,
        scoreB: 8,
      },
    ],
  },
  veloir_ceremony_firekeeper: {
    text: "🕯️ 의식의 불꽃을 지키는 역할을 맡았습니다! 벨로아족의 신성한 의식에서 중요한 역할을 수행했고, 그들의 영적 세계를 깊이 이해했습니다...",
    choices: [
      {
        text: "🕯️ 신성한 역할을 더욱 깊게 수행한다",
        next: "veloir_village_completed",
        scoreA: 6,
        scoreB: 6,
      },
    ],
  },
  // 새로운 동맹 시스템 노드들
  share_fire_secret_with_drakar: {
    text: "🔥 드라카르족에게 불꽃의 비밀을 알려주었습니다! 드라카르족의 족장이 매우 기뻐하며 '이 비밀을 알려준 자는 우리의 영원한 동맹이다!'라고 선언합니다. 드라카르족의 신뢰도가 크게 상승했습니다.",
    choices: [
      {
        text: "🔥 드라카르족과 더 깊은 동맹을 맺는다",
        next: "deep_drakar_alliance",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "🤝 다른 종족들에게도 이 비밀을 공유한다",
        next: "share_with_other_tribes",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "📚 이 비밀을 연구하여 더 큰 힘을 얻는다",
        next: "research_fire_power",
        scoreA: 18,
        scoreB: 18,
      },
    ],
  },
  share_fire_secret_with_all: {
    text: "🤝 모든 종족들에게 불꽃의 비밀을 공유했습니다! 각 종족들이 이 비밀을 자신들의 방식으로 해석하고 활용하기 시작했습니다. 평화로운 협력 관계가 형성되고 있습니다.",
    choices: [
      {
        text: "🤝 모든 종족과 평화 동맹을 맺는다",
        next: "peace_alliance_with_all",
        scoreA: 25,
        scoreB: 25,
      },
      {
        text: "⚖️ 중재자 역할을 맡아 종족들을 조율한다",
        next: "mediator_role",
        scoreA: 20,
        scoreB: 20,
      },
      {
        text: "📚 종족들의 지식을 종합하여 새로운 힘을 만든다",
        next: "create_new_power",
        scoreA: 30,
        scoreB: 30,
      },
    ],
  },
  keep_fire_secret: {
    text: "🔒 불꽃의 비밀을 혼자 간직하기로 했습니다! 이 비밀을 활용하여 개인적인 힘을 키우고 있습니다. 하지만 다른 종족들이 당신을 의심하기 시작할 수 있습니다.",
    choices: [
      {
        text: "🔥 비밀의 힘을 더욱 강화한다",
        next: "enhance_secret_power",
        scoreA: 25,
        scoreB: 25,
      },
      {
        text: "🤝 나중에 필요할 때 비밀을 활용한다",
        next: "save_secret_for_later",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "⚔️ 비밀의 힘으로 다른 종족들을 압도한다",
        next: "dominate_with_secret",
        scoreA: 30,
        scoreB: 30,
      },
    ],
  },
  // 동맹 배신 엔딩들
  alliance_betrayal_ending: {
    text: "💔 동맹을 배신했습니다! 신뢰를 저버린 행동으로 인해 모든 종족들이 당신을 믿지 않게 되었습니다. 동맹을 맺고도 배신하는 것은 가장 큰 죄악으로 여겨져서, 더 이상 어떤 종족도 당신을 받아주지 않습니다. 결국 혼자서 시간의 계단에 도달하려 했지만 실패하고 말았습니다. 신뢰의 중요성을 깨달았지만 이미 늦었습니다...",
    choices: [
      {
        text: "게임 종료",
        next: "game_over_alliance_betrayal",
        scoreA: -100,
        scoreB: -100,
      },
    ],
  },
  too_many_alliances_ending: {
    text: "⚖️ 너무 많은 동맹을 맺었습니다! 모든 종족과 동맹을 맺으려다 보니 동맹 간의 갈등이 폭발했습니다. 각 종족들이 서로를 적대하고, 당신은 모든 동맹의 요구사항을 만족시킬 수 없게 되었습니다. 결국 모든 동맹이 무너지고 혼자 남게 되었습니다. 적절한 균형의 중요성을 깨달았지만 이미 늦었습니다...",
    choices: [
      {
        text: "게임 종료",
        next: "game_over_too_many_alliances",
        scoreA: -50,
        scoreB: -50,
      },
    ],
  },
  // 동맹 실패 엔딩들
  alliance_failed_ending: {
    text: "❌ 동맹을 맺지 못했습니다! 종족들과의 신뢰 관계를 구축하지 못해 시간의 계단에 도달할 수 없었습니다. 혼자서는 시간의 비밀을 이해할 수 없어 결국 시간의 흐름 속에서 길을 잃고 말았습니다. 하지만 이 경험을 통해 협력의 중요성을 깨달았고, 다음 기회에는 더 신중하게 접근할 것입니다...",
    choices: [
      {
        text: "게임 종료",
        next: "game_over_alliance_failed",
        scoreA: -50,
        scoreB: -50,
      },
    ],
  },
  insufficient_villages_ending: {
    text: "⚠️ 충분한 종족들의 도움을 받지 못했습니다! 시간의 계단에 도달하기 위해서는 모든 종족의 지혜와 능력이 필요합니다. 너무 적은 종족만 방문해서 시간의 비밀을 완전히 이해할 수 없었고, 결국 시간의 계단에서 실패하고 말았습니다. 더 많은 종족들을 방문하여 그들의 도움을 받아야 합니다...",
    choices: [
      {
        text: "게임 종료",
        next: "game_over_insufficient_villages",
        scoreA: -30,
        scoreB: -30,
      },
    ],
  },
  // 에테르족 마을로 가는 특별한 조건 노드
  all_villages_visited: {
    text: "🌟 모든 6개 종족의 마을을 방문했습니다! 벨로아족, 누아르족, 실프레드족, 드라카르족, 룬마레족, 모라스족의 도움을 모두 받았습니다. 이제 마지막으로 하늘에서 내려온 에테르족의 마을로 향할 수 있습니다. 에테르족은 계단의 수호자로서 인간을 시험하는 역할을 맡고 있으며, 모든 종족의 도움을 받은 자만이 그들의 시험을 통과할 수 있습니다...",
    choices: [
      {
        text: "🔮 에테르족의 마을로 향한다",
        next: "visit_ethereal_village",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "⏰ 시간의 계단으로 직접 향한다",
        next: "time_stairs",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  // 마을에서 시간의 계단으로 가는 연결 노드들
  investigate_clock_tower: {
    text: "⏰ 시계탑을 조사하기로 결정했습니다! 시계탑은 마을의 중심에 위치한 거대한 건물로, 각 층마다 다른 시간을 나타내는 시계들이 있습니다. 탑의 정상에서는 시간의 흐름을 조절하는 메커니즘이 작동하고 있고, 그 주변에는 시간의 파편들이 떠다니고 있습니다. 시계탑의 관리자가 나타나서 시간의 계단으로 가는 길에 대한 중요한 정보를 알려줍니다. '시간의 계단은 마을에서 동쪽으로 가면 나오는 숲을 지나야 합니다'라고 말합니다...",
    choices: [
      {
        text: "🌲 동쪽 숲으로 향한다",
        next: "go_to_east_forest",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "📚 시계탑의 기록을 더 조사한다",
        next: "investigate_tower_records",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "🔧 시계탑의 메커니즘을 연구한다",
        next: "study_tower_mechanism",
        scoreA: 7,
        scoreB: 7,
      },
      {
        text: "🗣️ 관리자와 더 대화한다",
        next: "talk_to_tower_keeper",
        scoreA: 5,
        scoreB: 5,
      },
    ],
  },
  talk_to_sage: {
    text: "👩‍🦳 현자와 대화하기로 결정했습니다! 현자는 마을에서 가장 지혜로운 사람으로, 시간의 본질에 대해 깊이 이해하고 있습니다. 현자는 당신들에게 시간의 계단에 대한 중요한 정보를 알려줍니다. '시간의 계단은 마을에서 동쪽 숲을 지나면 나오는 신비로운 장소입니다. 하지만 그곳에 가기 전에 시간의 준비가 필요합니다'라고 말하며, 시간의 조각을 찾는 방법에 대한 힌트를 제공합니다...",
    choices: [
      {
        text: "🌲 동쪽 숲으로 향한다",
        next: "go_to_east_forest",
        scoreA: 9,
        scoreB: 9,
      },
      {
        text: "📖 현자의 지혜를 더 배운다",
        next: "learn_from_sage",
        scoreA: 7,
        scoreB: 7,
      },
      {
        text: "🔮 시간의 예언을 듣는다",
        next: "hear_time_prophecy",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🎁 현자로부터 선물을 받는다",
        next: "receive_sage_gift",
        scoreA: 6,
        scoreB: 6,
      },
    ],
  },
  find_fragment_book: {
    text: "🔍 시간의 조각에 대한 책을 찾았습니다! 이 책에는 시간의 조각이 아를리아 세계의 여러 곳에 분산되어 있다는 중요한 정보가 기록되어 있습니다. 책에 따르면, 시간의 계단은 마을에서 동쪽 숲을 지나면 나오는 신비로운 장소이고, 그곳에서 첫 번째 시간의 조각을 찾을 수 있다고 합니다. 또한 시간의 조각을 찾기 위해서는 특별한 준비가 필요하다고 기록되어 있습니다. 사서가 나타나서 '이제 6대 종족의 마을들을 방문하여 그들의 도움을 받아야 합니다'라고 조언합니다...",
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "visit_veloir_village",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "visit_noir_village",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 7,
        scoreB: 7,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 9,
        scoreB: 9,
      },
    ],
  },
  buy_time_map: {
    text: "🗺️ 시간의 지도를 구매했습니다! 이 지도는 시간의 계단으로 가는 정확한 경로를 보여줍니다. 지도에 따르면, 마을에서 동쪽 숲을 지나면 시간의 계단이 나타나고, 그곳에서 첫 번째 시간의 조각을 찾을 수 있다고 합니다. 상점 주인은 '이 지도는 시간의 상인들만이 가질 수 있는 귀중한 물건입니다. 하지만 먼저 6대 종족의 마을들을 방문하여 그들의 도움을 받아야 합니다'라고 조언합니다...",
    choices: [
      {
        text: "🐺 벨로아족의 마을로 향한다",
        next: "visit_veloir_village",
        scoreA: 9,
        scoreB: 9,
      },
      {
        text: "🌑 누아르족의 마을로 향한다",
        next: "visit_noir_village",
        scoreA: 6,
        scoreB: 6,
      },
      {
        text: "🌪️ 실프레드족의 마을로 향한다",
        next: "visit_sylphred_village",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔥 드라카르족의 마을로 향한다",
        next: "visit_drakar_village",
        scoreA: 7,
        scoreB: 7,
      },
    ],
  },
  go_to_east_forest: {
    text: "🌲 동쪽 숲으로 향하기로 결정했습니다! 마을을 나서 동쪽으로 가니 신비로운 숲이 나타납니다. 이 숲은 시간의 숲이라고 불리며, 나무들이 각각 다른 시간을 나타내고 있습니다. 숲의 공기는 시간의 에너지로 가득 차 있어서 숨을 쉴 때마다 새로운 시간을 경험하는 것 같습니다. 숲의 깊은 곳에서는 시간의 계단이 빛나고 있는 것을 볼 수 있습니다. 이제 시간의 계단을 향한 본격적인 모험이 시작됩니다...",
    choices: [
      {
        text: "⏰ 시간의 계단으로 향한다",
        next: "time_stairs",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🌳 시간의 나무들과 소통한다",
        next: "communicate_with_time_trees",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🦋 시간의 나비를 따라간다",
        next: "follow_time_butterfly",
        scoreA: 7,
        scoreB: 7,
      },
      {
        text: "🌸 시간의 꽃을 수집한다",
        next: "collect_time_flowers",
        scoreA: 6,
        scoreB: 6,
      },
    ],
  },
  // 종족별 특성을 반영한 새로운 노드들
  explore_village_with_races: {
    text: "🏘️ 마을을 탐험하면서 각 파티의 종족 특성이 드러나기 시작합니다! {teamAName} 파티의 한지우(에테르족)는 투명한 날개를 펼치며 빛과 소리를 조율해 마을의 숨겨진 비밀을 감지합니다. 이동준(실프레드족)은 바람을 타고 마을 곳곳을 빠르게 탐험하며 쾌활한 농담을 던집니다. 정현희(벨로아족)는 짐승의 감각으로 위험을 감지하고, 김석현(누아르족)은 그림자 속에서 정보를 수집합니다.\n\n{teamBName} 파티의 이송은(룬마레족)은 꿈을 통해 미래의 위험을 예지하고, 정지윤(실프레드족)은 작은 바람으로 마을의 소문을 전해듣습니다. 신진섭(드라카르족)은 용의 피로 인한 강대한 힘을 느끼며 전투 준비를 합니다. 각자의 종족 특성이 마을 탐험에 새로운 차원을 더합니다...",
    choices: [
      {
        text: "🌟 종족 능력을 활용해 탐험한다",
        next: "use_race_abilities",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🤝 종족 간 협력을 시도한다",
        next: "race_cooperation",
        scoreA: 7,
        scoreB: 7,
      },
      {
        text: "⚔️ 종족 간 경쟁을 시작한다",
        next: "race_competition",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔍 종족 특성을 숨기고 조용히 탐험한다",
        next: "stealth_exploration",
        scoreA: 6,
        scoreB: 6,
      },
    ],
  },
  use_race_abilities: {
    text: "🌟 각 파티가 종족 능력을 적극 활용하기 시작합니다! {teamAName} 파티의 한지우(에테르족)는 빛과 소리를 조율해 시계탑의 숨겨진 메커니즘을 발견하고, 이동준(실프레드족)은 바람을 타고 마을의 모든 소문을 수집합니다. 정현희(벨로아족)의 짐승 감각으로 위험한 함정을 감지하고, 김석현(누아르족)은 그림자 속에서 중요한 문서를 발견합니다.\n\n{teamBName} 파티의 이송은(룬마레족)은 꿈의 예지로 시간의 계단에서 일어날 일을 미리 보았고, 정지윤(실프레드족)은 작은 바람으로 숨겨진 통로를 찾았습니다. 신진섭(드라카르족)의 용의 힘으로 마을의 고대 유물을 깨우고, 모라스족 현자는 수백 년의 지혜로 모든 것을 연결합니다...",
    choices: [
      {
        text: "🔮 에테르족의 빛 능력으로 시계탑을 조사한다",
        next: "ethereal_clock_tower",
        scoreA: 10,
        scoreB: 8,
      },
      {
        text: "🌪️ 실프레드족의 바람 능력으로 숨겨진 통로를 찾는다",
        next: "sylphred_hidden_path",
        scoreA: 9,
        scoreB: 9,
      },
      {
        text: "🐺 벨로아족의 감각으로 위험을 감지한다",
        next: "veloir_danger_sense",
        scoreA: 8,
        scoreB: 7,
      },
      {
        text: "🌊 룬마레족의 예지 능력으로 미래를 본다",
        next: "runmare_prophecy",
        scoreA: 7,
        scoreB: 10,
      },
    ],
  },
  ethereal_clock_tower: {
    text: "🔮 한지우(에테르족)의 빛과 소리 조율 능력으로 시계탑의 숨겨진 비밀을 발견했습니다! 투명한 날개를 펼치며 빛을 조율하자 시계탑의 벽에 고대의 문자가 빛나기 시작합니다. 이 문자들은 시간의 계단으로 가는 정확한 경로와 각 종족의 역할을 설명하고 있습니다. 에테르족은 '계단의 수호자'로서 다른 종족들을 시험하는 역할을 맡고 있다는 것을 알게 됩니다. 하지만 물리적인 힘에 약한 에테르족은 다른 종족의 도움이 필요합니다...",
    choices: [
      {
        text: "🤝 다른 종족들과 협력한다",
        next: "ethereal_cooperation",
        scoreA: 12,
        scoreB: 10,
      },
      {
        text: "⚡ 에테르족의 능력만으로 시도한다",
        next: "ethereal_solo_attempt",
        scoreA: 5,
        scoreB: 5,
      },
      {
        text: "🔍 더 많은 고대 문자를 해독한다",
        next: "decode_ancient_text",
        scoreA: 9,
        scoreB: 8,
      },
      {
        text: "💎 시계탑의 보물을 찾는다",
        next: "find_clock_tower_treasure",
        scoreA: 7,
        scoreB: 6,
      },
    ],
  },
  sylphred_hidden_path: {
    text: "🌪️ 이동준과 정지윤(실프레드족)의 바람 능력으로 숨겨진 통로를 발견했습니다! 작은 바람 정령들이 마을의 벽 사이를 빠르게 날아다니며 숨겨진 통로를 찾아냅니다. 이 통로는 시간의 숲으로 직접 연결되어 있어서, 시간의 계단에 더 빨리 도달할 수 있습니다. 실프레드족의 쾌활한 성격으로 인해 탐험 중에도 즐거운 분위기가 유지되지만, 작은 체구 탓에 위험한 상황에서는 주의가 필요합니다...",
    choices: [
      {
        text: "🌲 숨겨진 통로로 시간의 숲으로 향한다",
        next: "sylphred_forest_path",
        scoreA: 11,
        scoreB: 11,
      },
      {
        text: "🎭 실프레드족의 장난으로 함정을 피한다",
        next: "sylphred_trick_escape",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🔮 실프레드족의 예언자 능력을 사용한다",
        next: "sylphred_prophecy",
        scoreA: 9,
        scoreB: 9,
      },
      {
        text: "💨 바람의 힘으로 더 빠르게 이동한다",
        next: "sylphred_wind_travel",
        scoreA: 7,
        scoreB: 7,
      },
    ],
  },
  veloir_danger_sense: {
    text: "🐺 정현희(벨로아족)의 짐승 감각으로 마을에 숨어있는 위험을 감지했습니다! 날카로운 귀와 민감한 코로 마을의 어둠 속에서 움직이는 누아르족의 그림자와 시간 균열에서 나오는 위험한 존재들을 발견합니다. 벨로아족의 강력한 전투력으로 이들을 물리칠 수 있지만, 감정에 쉽게 휘둘리는 특성 때문에 분노나 두려움에 빠질 위험이 있습니다. 무리를 이루는 습성으로 인해 동료들과 함께 있을 때 가장 강력한 힘을 발휘합니다...",
    choices: [
      {
        text: "⚔️ 벨로아족의 전투력으로 위험을 물리친다",
        next: "veloir_combat",
        scoreA: 10,
        scoreB: 8,
      },
      {
        text: "🤝 동료들과 함께 무리를 형성한다",
        next: "veloir_pack_formation",
        scoreA: 12,
        scoreB: 10,
      },
      {
        text: "🐾 짐승의 본능으로 안전한 길을 찾는다",
        next: "veloir_instinct_path",
        scoreA: 8,
        scoreB: 7,
      },
      {
        text: "😤 감정에 휘둘려 돌진한다",
        next: "veloir_emotional_charge",
        scoreA: 3,
        scoreB: 3,
      },
    ],
  },
  runmare_prophecy: {
    text: "🌊 이송은(룬마레족)의 꿈 예지 능력으로 시간의 계단에서 일어날 미래를 보았습니다! 바다와 별빛의 힘을 통해 미래의 시간 균열과 각 종족의 운명을 예지합니다. 룬마레족은 물과 별의 힘을 동시에 다루며, 꿈을 통해 중요한 정보를 얻을 수 있습니다. 하지만 물에서 멀리 떨어지면 힘이 급격히 약해지는 약점이 있어서, 시간의 계단으로 올라갈 때 주의가 필요합니다...",
    choices: [
      {
        text: "🔮 꿈의 예지를 통해 최적의 경로를 찾는다",
        next: "runmare_optimal_path",
        scoreA: 8,
        scoreB: 12,
      },
      {
        text: "🌊 바다의 힘으로 시간의 흐름을 조절한다",
        next: "runmare_water_control",
        scoreA: 7,
        scoreB: 11,
      },
      {
        text: "⭐ 별빛의 힘으로 미래를 더 자세히 본다",
        next: "runmare_star_vision",
        scoreA: 9,
        scoreB: 13,
      },
      {
        text: "💧 물의 힘을 보존하며 신중하게 진행한다",
        next: "runmare_conservative_approach",
        scoreA: 6,
        scoreB: 10,
      },
    ],
  },
  noir_shadow_investigation: {
    text: "🌑 김석현(누아르족)의 어둠과 그림자 능력으로 마을의 숨겨진 비밀을 발견했습니다! 반실체의 특성으로 그림자 속을 자유롭게 이동하며 중요한 문서와 정보를 수집합니다. 누아르족은 시간 균열이 생길 때 출현하는 특성이 있어서, 시간의 계단으로 가는 길에서 중요한 역할을 할 수 있습니다. 하지만 빛에 약해서 낮에는 힘이 제한되며, 어둠 속에서만 본래의 힘을 발휘할 수 있습니다...",
    choices: [
      {
        text: "🌑 그림자 속에서 중요한 정보를 수집한다",
        next: "noir_shadow_intel",
        scoreA: 11,
        scoreB: 8,
      },
      {
        text: "⚔️ 어둠의 힘으로 숨겨진 적을 공격한다",
        next: "noir_shadow_attack",
        scoreA: 9,
        scoreB: 7,
      },
      {
        text: "🔍 시간 균열의 징조를 감지한다",
        next: "noir_rift_detection",
        scoreA: 10,
        scoreB: 9,
      },
      {
        text: "🌙 밤의 힘을 기다린다",
        next: "noir_night_power",
        scoreA: 8,
        scoreB: 6,
      },
    ],
  },
  drakar_ancient_awakening: {
    text: "🔥 신진섭(드라카르족)의 용의 피가 마을의 고대 유물을 깨웠습니다! 반인반룡의 전사로서 불과 용의 힘을 계승한 강대한 전투력을 보유하고 있습니다. 짧은 수명 탓에 명예와 전투를 갈망하는 특성이 있어서, 시간의 계단에서의 모험을 영광스러운 전투로 여깁니다. 하지만 '약속'을 중시하고 배신자를 절대 용서하지 않는 특성 때문에, 동료들과의 신뢰 관계가 매우 중요합니다...",
    choices: [
      {
        text: "🔥 용의 불꽃으로 고대 유물을 깨운다",
        next: "drakar_fire_awakening",
        scoreA: 8,
        scoreB: 12,
      },
      {
        text: "⚔️ 전사의 명예를 위해 정면으로 맞선다",
        next: "drakar_honorable_combat",
        scoreA: 9,
        scoreB: 11,
      },
      {
        text: "🤝 동료들과의 약속을 지킨다",
        next: "drakar_promise_keeping",
        scoreA: 10,
        scoreB: 13,
      },
      {
        text: "💪 강력한 힘으로 모든 장애물을 부순다",
        next: "drakar_power_breakthrough",
        scoreA: 7,
        scoreB: 10,
      },
    ],
  },
  moras_wisdom_guidance: {
    text: "🌳 모라스족 현자의 수백 년 지혜가 모든 것을 연결합니다! 거대한 나무와 일체화된 종족으로서 세계의 비밀과 역사를 기억하는 기록자입니다. 수백 년을 살며 축적한 지혜로 각 종족의 특성과 시간의 계단의 비밀을 완벽하게 이해하고 있습니다. 하지만 움직임이 느리고 급변하는 전투에는 부적합한 약점이 있어서, 전략적 조언자 역할을 맡습니다...",
    choices: [
      {
        text: "📚 수백 년의 지혜로 전략을 세운다",
        next: "moras_strategic_planning",
        scoreA: 9,
        scoreB: 11,
      },
      {
        text: "🌳 나무의 힘으로 자연과 소통한다",
        next: "moras_nature_communication",
        scoreA: 8,
        scoreB: 10,
      },
      {
        text: "📖 고대의 기록을 해독한다",
        next: "moras_ancient_records",
        scoreA: 10,
        scoreB: 12,
      },
      {
        text: "🤝 모든 종족을 조율한다",
        next: "moras_race_coordination",
        scoreA: 11,
        scoreB: 13,
      },
    ],
  },
  // 종족 간 상호작용 노드들
  race_cooperation: {
    text: "🤝 두 파티가 종족 간 협력을 시도하기로 결정했습니다! {teamAName} 파티의 한지우(에테르족)와 {teamBName} 파티의 이송은(룬마레족)이 빛과 물의 힘을 결합해 새로운 능력을 발견합니다. 이동준과 정지윤(실프레드족)은 바람의 힘을 합쳐 더 강력한 바람을 만들어내고, 정현희(벨로아족)와 신진섭(드라카르족)은 전투력과 용의 힘을 결합합니다. 김석현(누아르족)의 그림자 능력과 모라스족의 지혜가 모든 것을 연결합니다. 종족 간 협력으로 인해 각자의 약점을 보완하고 강점을 극대화할 수 있게 되었습니다...",
    choices: [
      {
        text: "🌟 종족 능력을 결합해 새로운 힘을 만든다",
        next: "combined_race_power",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "🤝 약점을 보완하고 강점을 극대화한다",
        next: "complementary_strengths",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "🔮 종족 간 시너지로 미래를 예측한다",
        next: "race_synergy_prophecy",
        scoreA: 14,
        scoreB: 14,
      },
      {
        text: "⚔️ 협력한 힘으로 위험에 맞선다",
        next: "cooperative_combat",
        scoreA: 13,
        scoreB: 13,
      },
    ],
  },
  race_competition: {
    text: "⚔️ 두 파티가 종족 간 경쟁을 시작했습니다! {teamAName} 파티의 한지우(에테르족)가 계단의 수호자로서 {teamBName} 파티를 시험하기 시작하고, 신진섭(드라카르족)은 명예를 위해 정면 대결을 요구합니다. 이동준과 정지윤(실프레드족)은 바람의 속도로 경쟁하고, 정현희(벨로아족)는 감정에 휘둘려 전투를 시작합니다. 김석현(누아르족)과 이송은(룬마레족)은 각자의 방식으로 경쟁에 참여합니다. 경쟁으로 인해 각자의 종족 특성이 더욱 강화되지만, 협력의 기회를 놓칠 수도 있습니다...",
    choices: [
      {
        text: "⚔️ 정면 대결로 승부를 가린다",
        next: "direct_race_confrontation",
        scoreA: 8,
        scoreB: 8,
      },
      {
        text: "🏃‍♂️ 종족 특성을 활용한 경쟁을 한다",
        next: "race_ability_competition",
        scoreA: 10,
        scoreB: 10,
      },
      {
        text: "🎯 특정 목표를 놓고 경쟁한다",
        next: "race_target_competition",
        scoreA: 9,
        scoreB: 9,
      },
      {
        text: "🤺 우아한 대결로 명예를 다툰다",
        next: "honorable_race_duel",
        scoreA: 11,
        scoreB: 11,
      },
    ],
  },
  combined_race_power: {
    text: "🌟 종족 능력을 결합해 새로운 힘을 만들어냈습니다! 에테르족의 빛과 룬마레족의 물이 결합해 '시간의 거울'을 만들어내고, 실프레드족들의 바람이 합쳐져 '시간의 폭풍'을 일으킵니다. 벨로아족의 전투력과 드라카르족의 용의 힘이 결합해 '전설의 전사'를 만들어내고, 누아르족의 그림자와 모라스족의 지혜가 '어둠의 현자'를 탄생시킵니다. 이 새로운 힘들은 시간의 계단을 오르는 데 큰 도움이 되지만, 각자의 종족 특성을 잃을 위험도 있습니다...",
    choices: [
      {
        text: "🔮 시간의 거울로 미래를 본다",
        next: "time_mirror_prophecy",
        scoreA: 16,
        scoreB: 16,
      },
      {
        text: "🌪️ 시간의 폭풍으로 빠르게 이동한다",
        next: "time_storm_travel",
        scoreA: 15,
        scoreB: 15,
      },
      {
        text: "⚔️ 전설의 전사로 모든 장애물을 물리친다",
        next: "legendary_warrior_combat",
        scoreA: 17,
        scoreB: 17,
      },
      {
        text: "🌑 어둠의 현자로 모든 비밀을 알아낸다",
        next: "shadow_sage_revelation",
        scoreA: 18,
        scoreB: 18,
      },
    ],
  },
  // 종족별 특별 능력 노드들
  ethereal_cooperation: {
    text: "🔮 한지우(에테르족)가 다른 종족들과 협력하기로 결정했습니다! 투명한 날개를 펼치며 빛과 소리를 조율해 모든 종족의 능력을 증폭시킵니다. 에테르족의 '계단의 수호자'로서의 역할을 인정하고, 다른 종족들을 시험하는 대신 함께 협력하는 길을 선택합니다. 물리적인 힘에 약한 에테르족은 벨로아족의 전투력, 드라카르족의 용의 힘, 실프레드족의 바람, 누아르족의 그림자, 룬마레족의 예지, 모라스족의 지혜를 모두 활용해 완벽한 팀워크를 만들어냅니다...",
    choices: [
      {
        text: "🌟 모든 종족의 능력을 증폭시킨다",
        next: "amplify_all_races",
        scoreA: 20,
        scoreB: 18,
      },
      {
        text: "🔮 계단의 수호자로서 진정한 시험을 한다",
        next: "true_guardian_test",
        scoreA: 18,
        scoreB: 16,
      },
      {
        text: "🤝 완벽한 팀워크로 시간의 계단을 오른다",
        next: "perfect_teamwork_climb",
        scoreA: 19,
        scoreB: 17,
      },
      {
        text: "💎 모든 종족의 보물을 찾는다",
        next: "find_all_race_treasures",
        scoreA: 17,
        scoreB: 15,
      },
    ],
  },
  sylphred_forest_path: {
    text: "🌲 실프레드족들이 숨겨진 통로로 시간의 숲으로 향합니다! 이동준과 정지윤이 바람을 타고 빠르게 숲을 통과하며, 작은 바람 정령들이 길을 안내합니다. 숲의 나무들이 각각 다른 시간을 나타내고 있어서, 바람을 타고 이동할 때마다 다양한 시간을 경험할 수 있습니다. 실프레드족의 쾌활한 성격으로 인해 탐험 중에도 즐거운 분위기가 유지되지만, 작은 체구 탓에 위험한 상황에서는 주의가 필요합니다. 숲의 깊은 곳에서는 시간의 계단이 빛나고 있는 것을 볼 수 있습니다...",
    choices: [
      {
        text: "🌪️ 바람을 타고 시간의 계단으로 빠르게 향한다",
        next: "sylphred_fast_approach",
        scoreA: 14,
        scoreB: 14,
      },
      {
        text: "🌸 시간의 꽃들을 수집하며 천천히 진행한다",
        next: "sylphred_flower_collection",
        scoreA: 12,
        scoreB: 12,
      },
      {
        text: "🎭 장난으로 함정들을 피해나간다",
        next: "sylphred_trick_escape",
        scoreA: 13,
        scoreB: 13,
      },
      {
        text: "🔮 실프레드족의 예언자 능력을 사용한다",
        next: "sylphred_prophecy_use",
        scoreA: 15,
        scoreB: 15,
      },
    ],
  },
  veloir_pack_formation: {
    text: "🐺 정현희(벨로아족)가 동료들과 함께 무리를 형성했습니다! 짐승의 감각과 강력한 전투력으로 무리를 이끌며, 모든 동료들을 보호합니다. 벨로아족의 무리를 이루는 습성으로 인해 함께 있을 때 가장 강력한 힘을 발휘하고, 감정에 쉽게 휘둘리는 특성도 동료들에 대한 강한 애착으로 변합니다. 날카로운 귀와 민감한 코로 위험을 감지하고, 강력한 발톱과 이빨로 적들을 물리칩니다. 무리의 지도자로서 모든 동료들의 안전을 최우선으로 생각합니다...",
    choices: [
      {
        text: "🐺 무리의 지도자로서 모든 동료를 보호한다",
        next: "veloir_pack_protection",
        scoreA: 16,
        scoreB: 14,
      },
      {
        text: "⚔️ 무리의 힘으로 모든 위험을 물리친다",
        next: "veloir_pack_combat",
        scoreA: 15,
        scoreB: 13,
      },
      {
        text: "🐾 짐승의 본능으로 최적의 경로를 찾는다",
        next: "veloir_instinct_guidance",
        scoreA: 14,
        scoreB: 12,
      },
      {
        text: "💕 동료들에 대한 애착으로 더 강해진다",
        next: "veloir_emotional_strength",
        scoreA: 17,
        scoreB: 15,
      },
    ],
  },
  runmare_optimal_path: {
    text: "🌊 이송은(룬마레족)의 꿈 예지 능력으로 최적의 경로를 찾았습니다! 바다와 별빛의 힘을 통해 미래의 모든 위험과 기회를 예지하고, 가장 안전하고 효율적인 경로를 제시합니다. 룬마레족의 꿈을 통해 미래를 보는 능력으로 인해 시간의 계단에서 일어날 모든 일을 미리 알 수 있고, 물과 별의 힘을 동시에 다루며 시간의 흐름을 조절할 수 있습니다. 하지만 물에서 멀리 떨어지면 힘이 급격히 약해지는 약점이 있어서, 시간의 계단으로 올라갈 때 주의가 필요합니다...",
    choices: [
      {
        text: "🔮 꿈의 예지로 모든 위험을 피한다",
        next: "runmare_dream_avoidance",
        scoreA: 16,
        scoreB: 18,
      },
      {
        text: "🌊 바다의 힘으로 시간의 흐름을 조절한다",
        next: "runmare_water_time_control",
        scoreA: 15,
        scoreB: 17,
      },
      {
        text: "⭐ 별빛의 힘으로 미래를 더 자세히 본다",
        next: "runmare_star_detailed_vision",
        scoreA: 17,
        scoreB: 19,
      },
      {
        text: "💧 물의 힘을 보존하며 신중하게 진행한다",
        next: "runmare_conservative_progress",
        scoreA: 14,
        scoreB: 16,
      },
    ],
  },
  noir_shadow_intel: {
    text: "🌑 김석현(누아르족)이 그림자 속에서 중요한 정보를 수집했습니다! 반실체의 특성으로 그림자 속을 자유롭게 이동하며 마을의 모든 비밀을 알아냅니다. 누아르족은 시간 균열이 생길 때 출현하는 특성이 있어서, 시간의 계단으로 가는 길에서 중요한 역할을 할 수 있습니다. 그림자 속에서 발견한 정보에는 시간의 조각의 위치, 각 종족의 숨겨진 능력, 시간의 계단의 비밀 등이 포함되어 있습니다. 하지만 빛에 약해서 낮에는 힘이 제한되며, 어둠 속에서만 본래의 힘을 발휘할 수 있습니다...",
    choices: [
      {
        text: "🌑 그림자 속의 모든 비밀을 알아낸다",
        next: "noir_shadow_secrets",
        scoreA: 18,
        scoreB: 15,
      },
      {
        text: "⚔️ 어둠의 힘으로 숨겨진 적을 공격한다",
        next: "noir_shadow_combat",
        scoreA: 16,
        scoreB: 13,
      },
      {
        text: "🔍 시간 균열의 모든 징조를 감지한다",
        next: "noir_rift_complete_detection",
        scoreA: 17,
        scoreB: 14,
      },
      {
        text: "🌙 밤의 힘을 기다려 최대한의 능력을 발휘한다",
        next: "noir_night_maximum_power",
        scoreA: 15,
        scoreB: 12,
      },
    ],
  },
  drakar_promise_keeping: {
    text: "🔥 신진섭(드라카르족)이 동료들과의 약속을 지키기로 결정했습니다! 반인반룡의 전사로서 불과 용의 힘을 계승한 강대한 전투력을 보유하고 있으며, 짧은 수명 탓에 명예와 전투를 갈망하는 특성이 있습니다. 하지만 '약속'을 중시하고 배신자를 절대 용서하지 않는 특성 때문에, 동료들과의 신뢰 관계가 매우 중요합니다. 용의 피로 인한 강대한 힘을 동료들을 보호하는 데 사용하고, 전사의 명예를 위해 모든 약속을 지킵니다. 이는 드라카르족에게 가장 중요한 가치입니다...",
    choices: [
      {
        text: "🤝 동료들과의 모든 약속을 지킨다",
        next: "drakar_keep_all_promises",
        scoreA: 16,
        scoreB: 18,
      },
      {
        text: "⚔️ 전사의 명예를 위해 동료들을 보호한다",
        next: "drakar_honorable_protection",
        scoreA: 17,
        scoreB: 19,
      },
      {
        text: "🔥 용의 불꽃으로 모든 위험을 물리친다",
        next: "drakar_dragon_fire_combat",
        scoreA: 15,
        scoreB: 17,
      },
      {
        text: "💪 강력한 힘으로 동료들을 이끈다",
        next: "drakar_strong_leadership",
        scoreA: 18,
        scoreB: 20,
      },
    ],
  },
  moras_race_coordination: {
    text: "🌳 모라스족 현자가 모든 종족을 조율하기로 결정했습니다! 거대한 나무와 일체화된 종족으로서 세계의 비밀과 역사를 기억하는 기록자이며, 수백 년을 살며 축적한 지혜로 각 종족의 특성과 시간의 계단의 비밀을 완벽하게 이해하고 있습니다. 모든 종족의 장점을 살리고 약점을 보완하는 완벽한 전략을 세우며, 움직임이 느리고 급변하는 전투에는 부적합한 약점이 있어서 전략적 조언자 역할을 맡습니다. 각 종족의 특성을 최대한 활용한 완벽한 팀워크를 만들어냅니다...",
    choices: [
      {
        text: "📚 수백 년의 지혜로 완벽한 전략을 세운다",
        next: "moras_perfect_strategy",
        scoreA: 17,
        scoreB: 19,
      },
      {
        text: "🤝 모든 종족을 조율해 완벽한 팀워크를 만든다",
        next: "moras_perfect_teamwork",
        scoreA: 18,
        scoreB: 20,
      },
      {
        text: "🌳 나무의 힘으로 자연과 소통한다",
        next: "moras_nature_communication",
        scoreA: 16,
        scoreB: 18,
      },
      {
        text: "📖 고대의 기록으로 모든 비밀을 해독한다",
        next: "moras_ancient_secrets",
        scoreA: 19,
        scoreB: 21,
      },
    ],
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
            <strong>아를리아</strong>: 거울처럼 투명한 하늘과 시간의 계단으로 이루어진 신비로운 세계
          </p>
          <p>
            <strong>시간의 계단</strong>: 오르내릴 때마다 하루, 한 달, 수백 년의 시간이 흘러가는
            신비로운 계단
          </p>
          <p>
            <strong>시간 지분</strong>: 각자 다른 시간 지분을 가진 두 파티가 같은 공간에서도 서로
            다른 시간 속에서 존재
          </p>
          <p>
            <strong>7대 종족</strong>: 에테르족, 벨로아족, 누아르족, 실프레드족, 드라카르족,
            룬마레족, 모라스족이 공존하는 세계
          </p>
          <p>
            <strong>종족 특성</strong>: 각 종족마다 고유한 능력과 약점을 가지고 있어 전략적 선택이
            중요
          </p>
          <p>
            <strong>세계 균열</strong>: 시간이 불안정해지면 그림자 같은 실체 없는 존재들이 나타남
          </p>
        </div>
      </div>

      <div className="party-info">
        <h3>👥 참여 파티</h3>
        <div className="party-list">
          <div className="party-item">
            <span className="party-label">A 파티:</span>
            <span className="party-name">{teams.length >= 1 ? teams[0].name : "로딩 중..."}</span>
          </div>
          <div className="party-item">
            <span className="party-label">B 파티:</span>
            <span className="party-name">{teams.length >= 2 ? teams[1].name : "로딩 중..."}</span>
          </div>
        </div>
      </div>

      <div className="settings-content">
        <button className="start-button" onClick={handleStart} disabled={teams.length < 2}>
          모험 시작하기
        </button>
      </div>

      <div className="game-description">
        <h3>🎮 게임 설명</h3>
        <p>두 파티가 아를리아 세계의 시간의 계단을 오르며 모험을 진행합니다.</p>
        <p>각자의 선택에 따라 다른 스토리가 전개되며, 시간의 조각을 찾아 힘을 얻을 수 있습니다.</p>
        <p>파티별로 선택을 완료해야 다음 단계로 진행되며, 점수를 모아 승리를 다툽니다.</p>
        <p>
          <strong>히든 요소</strong>: 손성모라는 전설적인 존재를 만나면 특별한 퍼즐을 풀 수
          있습니다!
        </p>
      </div>
    </div>
  );
};

export default GameSettings;
