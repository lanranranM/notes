export type ArtworkCaption = {
  zh: string;
  ru: string;
  year: string;
  note?: string;
  source?: string;
};

// Dates supplied by the author's note are preserved. Unidentified works and
// dates remain explicitly provisional instead of inferring them from a photo.
export const captions: ArtworkCaption[] = [
  { zh: '自画像', ru: 'Автопортрет', year: '1910', note: '年份沿用原文' },
  { zh: '瓦利娅·阿朵拉茨卡娅肖像', ru: 'Портрет Вари Адоратской', year: '1914' },
  { zh: '玛丽亚·维塔利耶夫娜肖像', ru: 'Портрет Марии Витальевны', year: '1914', note: '人名沿用原文，俄文暂译' },
  { zh: '父亲肖像', ru: 'Портрет отца', year: '1901', note: '年份沿用原文，待核对' },
  { zh: '菜娥（卷心菜收获季节）', ru: 'Капустница', year: '1909', source: 'https://ar.culture.ru/ru/person/feshin-ni' },
  { zh: '瓦利娅·阿朵拉茨卡娅肖像', ru: 'Портрет Вари Адоратской', year: '1914' },
  { zh: '身穿农民衬衫的伊娅', ru: 'Ия в крестьянской рубахе', year: '1933' },
  { zh: '娜塔莉娅·尼古拉耶夫娜·克罗托娃肖像', ru: 'Портрет Натальи Николаевны Кротовой', year: '1923' },
  { zh: '茶饮旁：奥尔加·米哈伊洛夫娜肖像', ru: 'За чаем. Портрет Ольги Михайловны', year: '1913', note: '画名沿用原文，俄文暂译' },
  { zh: '钢琴旁的娜杰日达·米哈伊洛夫娜·萨波日尼科娃', ru: 'Портрет Н. М. Сапожниковой (у рояля)', year: '1916', source: 'https://rah.ru/the_academy_today/the_members_of_the_academie/member.php?ID=53368' },
  { zh: '坐着的女子（画名待考）', ru: 'Сидящая женщина (название уточняется)', year: '年份待考', note: '描述性题名，俄文为译名' },
  { zh: '瓦利娅·阿朵拉茨卡娅肖像', ru: 'Портрет Вари Адоратской', year: '1914' },
  { zh: '版画师威廉·沃特肖像', ru: 'Портрет гравера Уильяма Уотта', year: '1924', source: 'https://www.tg-m.ru/catalog/feshin-nikolai-ivanovich?page=1' },
  { zh: '陶斯贵妇', ru: 'Дама из Таоса', year: '1927', note: '年份沿用原文，俄文暂译' },
  { zh: '寺庙舞女', ru: 'Храмовая танцовщица', year: '1938', note: '年份沿用原文，俄文暂译' },
  { zh: '男士肖像（局部，画名待考）', ru: 'Мужской портрет (фрагмент; название уточняется)', year: '年份待考', note: '描述性题名，俄文为译名' },
  { zh: '女士肖像（画名待考）', ru: 'Женский портрет (название уточняется)', year: '年份待考', note: '描述性题名，俄文为译名' },
  { zh: '女士肖像（局部，画名待考）', ru: 'Женский портрет (фрагмент; название уточняется)', year: '年份待考', note: '描述性题名，俄文为译名' },
  { zh: '男士肖像（画名待考）', ru: 'Мужской портрет (название уточняется)', year: '年份待考', note: '描述性题名，俄文为译名' },
  { zh: '自画像（素描）', ru: 'Автопортрет (рисунок)', year: '年份待考' },
];
