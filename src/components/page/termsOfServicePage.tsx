import React, { FC } from 'react';
import Head from 'next/head';
import { useViewLayerPath } from '@comp/context';

export const TermsOfServicePage: FC = () => {
  const path = useViewLayerPath();
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Head>
        <title>cti1650 利用規約</title>
        <meta property="og:title" content="cti1650 利用規約" />
        <meta property="og:site_name" content="cti1650 利用規約" />
        <meta
          name="description"
          content="cti1650が個人開発したポートフォリオに関する利用規約を掲載しています。"
        />
        <meta
          property="og:description"
          content="cti1650が個人開発したポートフォリオに関する利用規約を掲載しています。"
        />
        <meta property="og:url" content={path} />
      </Head>

      <h1 className="text-2xl sm:text-3xl font-bold mb-6">利用規約</h1>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          第1条（利用者の定義）
        </h2>
        <p>
          本規約において、利用者とは、本サービスを利用する全ての個人または法人を指します。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          第2条（利用契約の成立）
        </h2>
        <p>
          本サービスを利用するにあたっては、本規約に同意していただく必要があり、本サービスを利用したことをもって本規約に同意したものとみなします。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          第3条（禁止事項）
        </h2>
        <p>
          本提供者が、利用者が本条に定める禁止事項に該当する行為を行ったものと判断した場合には、本サービス提供者は利用者の本サービスの利用を禁止し、かかる禁止行為に関し本提供者に生じた一切の損害について、利用者に対して賠償を請求することができる。
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>法令または公序良俗に違反する行為</li>
          <li>本提供者または第三者の知的財産権を侵害する行為</li>
          <li>本サービスの運営を妨げる行為</li>
          <li>その他、本提供者が不適切と判断する行為</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          第4条（免責事項）
        </h2>
        <p>
          本提供者は、本サービスの提供にあたり、利用者に生じた損害について一切の責任を負いません。
          また、本提供者は、本サービスの利用により生じる成果物の正確性等について一切保証しないものとします。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          第5条（利用規約の変更）
        </h2>
        <p>
          本提供者は、本規約を任意のタイミングで変更することができるものとし、利用者は変更後も本サービスを利用したことをもって当該変更後の規約に同意したものとします。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          第6条（準拠法・裁判管轄）
        </h2>
        <p>
          本規約の解釈にあたっては、日本法を準拠法とします。また、本サービスに関して紛争が生じた場合には、本提供者の所在地を管轄する裁判所を専属的な合意管轄とします。
        </p>
      </section>

      <p className="mt-8">以上</p>
    </div>
  );
};
