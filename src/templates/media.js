import { esc } from './util.js'

export function renderMedia({
  reverse = false,
  src = 'https://placehold.co/800x600',
  alt = '商品画像',
  label = '特性ラベル / Feature',
  title = 'ここにメインタイトルを入力',
  sub = 'ここにサブタイトルまたはキャッチコピーを入力',
  text = 'ここに詳細説明文を入力してください。複数段落も可能です。製品の特性、素材、デザインコンセプト、使用感などを紹介します。レイアウトをシンプルかつ力強く保つため、150字以内を推奨します。',
  cta = '詳しくはこちら',
  showCta = true
}) {
  return `<section class="pd-section">
  <div class="pd-media__inner" data-reverse="${reverse ? 'true' : 'false'}">
    <div class="pd-media__img">
      <img src="${esc(src)}" alt="${esc(alt)}" />
    </div>
    <div class="pd-media__body">
      <p class="pd-media__label">${esc(label)}</p>
      <h2 class="pd-media__title">${esc(title)}</h2>
      <p class="pd-media__sub">${esc(sub)}</p>
      <p class="pd-media__text">${esc(text)}</p>${showCta ? `
      <a class="pd-media__cta">${esc(cta)}</a>` : ''}
    </div>
  </div>
</section>`
}
