import { useMemo } from 'react';

export const usePortfoliosData = () => {
  const PortfolioList = useMemo(() => {
    return [
      {
        name: 'ポートフォリオサイト',
        description:
          '面談の際にポートフォリオを見る時にリポジトリのソースを見て判断することが多いと伺い、\n' +
          'Wantedlyの場合、1つしかポートフォリオのリンクを張れず、\n' +
          'サイトかリポジトリのリンクのどちらかしか選べなかったため、急遽作成しました！\n' +
          '使用技術はNext.jsとTailwind.cssです！',
        img: 'https://huntr-assets.s3.amazonaws.com/users/153284127/2f50a1b8-0bda-412c-980d-eaed6c21c8d1',
        github: 'https://github.com/cti1650/MySite.git',
        link: 'https://cti1650-portfolio-site.vercel.app/',
      },
      {
        name: 'Simple Memo Extension',
        description:
          'サイトを調べた際に手軽にメモが取れるようにChrome拡張機能を作成しました！',
        img: 'https://d2v9k5u4v94ulw.cloudfront.net/assets/images/7705344/original/c59895da-b17d-41c2-90a6-bb402d66cbad?1633449628',
        github: 'https://github.com/cti1650/simple-memo-extension.git',
        link: 'https://chrome.google.com/webstore/detail/simple-memo-extension/cbjnjeodomlbimegfmenffenlfpndpoc?hl=ja&authuser=0',
      },
      {
        name: 'Map Switching Extension',
        description:
          'Googleストリートビューから直接他のマップ（GoogleMap,YahooMap,地理院地図）を開ける拡張機能を作成しました！\n' +
          'Popupを開く拡張機能は前にも作成していましたが、今回はPopupを呼び出したタブの情報（URL,タイトル）をNext.jsを使って呼びだせるようにするところを検証するために作成しました！',
        img: 'https://d2v9k5u4v94ulw.cloudfront.net/assets/images/7618430/original/3bb559da-2704-42f0-9b02-6957ffb6ebb1?1632575336',
        github: 'https://github.com/cti1650/map-switching-extension.git',
        link: 'https://chrome.google.com/webstore/detail/map-switching-extension/dkpkkcfenknkfjjpbaafahfakkdlnjcl/related?hl=ja&authuser=0',
      },
      {
        name: 'Tailwindcss Extension',
        description:
          'Tailwind.cssのサイトでクラスをすぐに検索できるように拡張機能化しました！\n' +
          '新規タブで開く方式ではなくポップアップで表示するようにしたため、\n' +
          '手軽に検索が出来るような仕様になっています。',
        img: 'https://d2v9k5u4v94ulw.cloudfront.net/assets/images/7573446/original/3cea6315-3035-4fea-be1a-30b9342442a3?1632157075',
        github: 'https://github.com/cti1650/tailwindcss-extension.git',
        link: 'https://chrome.google.com/webstore/detail/tailwindcss-extension/pajplfpbbmajkeebcenokomnkloapamf?hl=ja&authuser=0',
      },
      {
        name: 'GitHub Search Extension',
        description:
          'GitHubでコードを検索する作業を効率化するために拡張機能化しました！\n' +
          'ポップアップで検索を実行する画面を表示する機能と選択しているテキストで直接コードを検索できる機能を実装しています！',
        img: 'https://d2v9k5u4v94ulw.cloudfront.net/assets/images/7572885/original/f1db2766-e3e8-488b-91e0-3c148d0a975a?1632148584',
        github: 'https://github.com/cti1650/github-search-extension.git',
        link: 'https://chrome.google.com/webstore/detail/github-search-extension/djnkfnlokjljmdcebmofcghfgnjhfpnm?hl=ja&authuser=0',
      },
      {
        name: 'DeepL翻訳',
        description:
          'Chrome拡張機能の学習のために、選択した文字をDeepLで翻訳できる拡張機能を作成しました！\n' +
          'ユーザー数2000突破しました！',
        img: 'https://d2v9k5u4v94ulw.cloudfront.net/assets/images/7427660/original/09204e8c-8bb1-4ed7-b978-ddafda68a7cd?1632148217',
        github: 'https://github.com/cti-tl/deepl-chrome-extension.git',
        link: 'https://chrome.google.com/webstore/detail/deepl%E7%BF%BB%E8%A8%B3/alghoachpmoojgnopkdopgbhmdjomcaa?hl=ja&authuser=0',
      },
      {
        name: 'Tailwind.css チートシート作成',
        description:
          'Next.jsとTailwind.cssの学習のためにボックスをクリックするとクリップボードにコピーできるチートシートを作成しました！',
        img: 'https://d2v9k5u4v94ulw.cloudfront.net/assets/images/7427616/original/3da25485-8d89-4c3a-803a-e310816ce409?1630253280',
        github: 'https://github.com/cti1650/tailwind_cc.git',
        link: 'https://tailwind-cc.vercel.app/',
      },
      {
        name: 'bookmarklet Maker',
        description:
          '業務改善の一環で個人的にブックマークレットをメモ帳で作成していましたが、\n' +
          'フロントエンドを学習したことをきっかけに作成を簡単に出来るツールをまずは作りたいと思い作成したポートフォリオです！\n' +
          '作成したのは半年近く前ですが、現在も個人的に活用しています！',
        img: 'https://d2v9k5u4v94ulw.cloudfront.net/assets/images/7427668/original/6b1b9466-8c1a-4b8b-b365-10ee888bf925?1630255893',
        github: 'https://github.com/cti-tl/mklet.git',
        link: 'https://cti-tl.github.io/mklet/',
      },
      {
        name: '最初のポートフォリオ',
        description:
          '参加していたコミュニティの会議の中で『ポモドーロ・テクニック』の話題が上がり、\n' +
          'タイムキープや話題が脱線した時などにベルを鳴らすとか面白いねと話していた時に、\n' +
          '元々作り始めていたポートフォリオを流用しその会議中に作って完成させたポートフォリオです！',
        img: 'https://d2v9k5u4v94ulw.cloudfront.net/assets/images/7427665/original/dc0d4953-9e07-4c6d-803b-e801db1f12de?1630255586',
        github: 'https://github.com/cti-tl/oto.git',
        link: 'https://cti-tl.github.io/oto/bell/',
      },
    ];
  }, []);
  return [PortfolioList];
};
