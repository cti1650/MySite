import React, { useState } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { PageLink } from '@comp/links/link';
import { LinkData } from '@comp/links/linkData';
import { PageLinkButton } from '@comp/button/Buttons';

const Portfolios = [
  {
    'name': 'simple-memo-extension',
    'description': 'サイトを調べた際に手軽にメモが取れるようにChrome拡張機能を作成しました！',
    'img': 'https://d2v9k5u4v94ulw.cloudfront.net/assets/images/7705344/original/c59895da-b17d-41c2-90a6-bb402d66cbad?1633449628',
    'github': '',
    'link': 'https://chrome.google.com/webstore/detail/simple-memo-extension/cbjnjeodomlbimegfmenffenlfpndpoc?hl=ja&authuser=0'
  },
  {
    'name': 'Map Switching Extension',
    'description': `Googleストリートビューから直接他のマップ（GoogleMap,YahooMap,地理院地図）を開ける拡張機能を作成しました！
    Popupを開く拡張機能は前にも作成していましたが、今回はPopupを呼び出したタブの情報（URL,タイトル）をNext.jsを使って呼びだせるようにするところを検証するために作成しました！`,
    'img': 'https://d2v9k5u4v94ulw.cloudfront.net/assets/images/7618430/original/3bb559da-2704-42f0-9b02-6957ffb6ebb1?1632575336',
    'github': '',
    'link': 'https://chrome.google.com/webstore/detail/map-switching-extension/dkpkkcfenknkfjjpbaafahfakkdlnjcl/related?hl=ja&authuser=0'
  },
  {
    'name': 'Tailwindcss Extension',
    'description': `Tailwind.cssのサイトでクラスをすぐに検索できるように拡張機能化しました！
    新規タブで開く方式ではなくポップアップで表示するようにしたため、
    手軽に検索が出来るような仕様になっています。`,
    'img': 'https://d2v9k5u4v94ulw.cloudfront.net/assets/images/7573446/original/3cea6315-3035-4fea-be1a-30b9342442a3?1632157075',
    'github': '',
    'link': 'https://chrome.google.com/webstore/detail/tailwindcss-extension/pajplfpbbmajkeebcenokomnkloapamf?hl=ja&authuser=0'
  },
  {
    'name': 'GitHub Search Extension',
    'description': `GitHubでコードを検索する作業を効率化するために拡張機能化しました！
    ポップアップで検索を実行する画面を表示する機能と選択しているテキストで直接コードを検索できる機能を実装しています！`,
    'img': 'https://d2v9k5u4v94ulw.cloudfront.net/assets/images/7572885/original/f1db2766-e3e8-488b-91e0-3c148d0a975a?1632148584',
    'github': '',
    'link': 'https://chrome.google.com/webstore/detail/github-search-extension/djnkfnlokjljmdcebmofcghfgnjhfpnm?hl=ja&authuser=0'
  },
  {
    'name': 'DeepL翻訳',
    'description': `Chrome拡張機能の学習のために、選択した文字をDeepLで翻訳できる拡張機能を作成しました！
    ユーザー数1000突破しました！`,
    'img': 'https://d2v9k5u4v94ulw.cloudfront.net/assets/images/7427660/original/09204e8c-8bb1-4ed7-b978-ddafda68a7cd?1632148217',
    'github': '',
    'link': 'https://chrome.google.com/webstore/detail/deepl%E7%BF%BB%E8%A8%B3/alghoachpmoojgnopkdopgbhmdjomcaa?hl=ja&authuser=0'
  },
  {
    'name': 'Tailwind.css チートシート作成',
    'description': `Next.jsとTailwind.cssの学習のためにボックスをクリックするとクリップボードにコピーできるチートシートを作成しました！`,
    'img': 'https://d2v9k5u4v94ulw.cloudfront.net/assets/images/7427616/original/3da25485-8d89-4c3a-803a-e310816ce409?1630253280',
    'github': '',
    'link': 'https://tailwind-cc.vercel.app/'
  },
  {
    'name': 'bookmarklet Maker',
    'description': `業務改善の一環で個人的にブックマークレットをメモ帳で作成していましたが、
    フロントエンドを学習したことをきっかけに作成を簡単に出来るツールをまずは作りたいと思い作成したポートフォリオです！
    作成したのは半年近く前ですが、現在も個人的に活用しています！`,
    'img': 'https://d2v9k5u4v94ulw.cloudfront.net/assets/images/7427668/original/6b1b9466-8c1a-4b8b-b365-10ee888bf925?1630255893',
    'github': '',
    'link': 'https://cti-tl.github.io/mklet/'
  },
  {
    'name': '最初のポートフォリオ',
    'description': `参加していたコミュニティの会議の中で『ポモドーロ・テクニック』の話題が上がり、タイムキープや話題が脱線した時などにベルを鳴らすとか面白いねと話していた時に、元々作り始めていたポートフォリオを流用しその会議中に作って完成させたポートフォリオです！`,
    'img': 'https://d2v9k5u4v94ulw.cloudfront.net/assets/images/7427665/original/dc0d4953-9e07-4c6d-803b-e801db1f12de?1630255586',
    'github': '',
    'link': 'https://cti-tl.github.io/oto/bell/'
  },
];

const Home = () => {
  return (
    <div className='w-full px-10 font-n2i md:max-w-5xl mx-auto'>
      <Head>
        <title>cti1650 Portfolio</title>
        <meta property='og:title' content='MySite' />
      </Head>

      <div className='w-full text-gray-900 py-8'>
        <div className="w-full space-y-24 divide-y divide-light-gray-300 text-center content-center justify-center">
          {Portfolios.map(item => {
            return (<>
              <div className="pt-4 w-full flex flex-col space-y-6">
                <div className="w-full content-center "><img src={item.img} alt="image" className="mx-auto max-h-80" /></div>
                <h2 className="w-full text-4xl tracking-wider text-center text-blue-500 whitespace-pre-wrap">{item.name}</h2>
                <div className="w-full tracking-wider text-center whitespace-pre-wrap">{item.description}</div>
                <PageLinkButton href={item.link}>サイトを開く</PageLinkButton>
              </div>
            </>)
          })
          }
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async context => {
  return {
    props: {},
  };
}

export default Home;
