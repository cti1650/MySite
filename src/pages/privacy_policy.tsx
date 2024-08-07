import React from 'react';
import Link from 'next/link';
import { NextPage } from 'next';

const PrivacyPolicy: NextPage = () => {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">プライバシーポリシーおよび免責事項</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. 個人情報の収集について</h2>
        <p>当サイトおよび関連するツール・サービスでは、各種お問い合わせ、サービスの利用登録、採用に関する連絡、業務依頼などの際に、名前やメールアドレス等の個人情報をご提供いただく場合があります。これらの情報は、適切なサービス提供、お問い合わせ対応、採用プロセス、業務連絡などの目的で利用させていただきます。</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. 個人情報の利用目的</h2>
        <p>収集した個人情報は、以下の目的で利用いたします：</p>
        <ul className="list-disc list-inside ml-4">
          <li>各種お問い合わせへの対応</li>
          <li>サービスの提供・改善</li>
          <li>新しいサービスや更新情報のお知らせ</li>
          <li>採用に関する連絡や情報提供</li>
          <li>業務依頼や契約に関する連絡</li>
          <li>ツールやサービスのサポート提供</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. 個人情報の第三者提供</h2>
        <p>当サイトは、法令に基づく場合や人の生命、身体または財産の保護のために必要がある場合を除き、収集した個人情報を当該本人の同意なく第三者に提供することはありません。</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. セキュリティ対策</h2>
        <p>当サイトでは、個人情報の漏洩、滅失、毀損の防止に努めます。適切なセキュリティ対策を実施し、個人情報の保護に万全を期しています。ただし、インターネット上での完全なセキュリティを保証するものではありません。</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. 免責事項</h2>
        <p>当サイトおよび提供するツール・サービス（以下「本サービス」）のご利用に際しては、以下の点にご留意ください：</p>
        <ul className="list-disc list-inside ml-4">
          <li>本サービスの内容は、予告なく変更または中止される場合があります。</li>
          <li>本サービスの利用は利用者自身の責任において行われるものとし、その利用により生じた損害について当方は責任を負いかねます。</li>
          <li>本サービスの正確性、完全性、有用性等について、いかなる保証も行いません。</li>
          <li>本サービスを通じて提供される情報によって生じた損害について、当方は責任を負いかねます。</li>
          <li>本サービスから他のウェブサイトへのリンクを利用して移動された場合、移動先のウェブサイトで提供される情報やサービスについて当方は責任を負いません。</li>
        </ul>
        <p className="mt-2">本サービスのご利用にあたっては、上記の事項をご理解いただいた上でご利用ください。</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. プライバシーポリシーおよび免責事項の変更</h2>
        <p>当サイトは、必要に応じて、このプライバシーポリシーおよび免責事項の内容を変更することがあります。変更後の内容は、当サイトに掲載した時点から効力を生じるものとします。定期的に本ページをご確認いただくことをお勧めします。</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">7. お問い合わせ</h2>
        <p>当サイトの個人情報の取扱い、免責事項に関するお問い合わせ、ツールの使用に関する質問、採用に関するご連絡、業務依頼など、あらゆるお問い合わせについては、以下のContactページからご連絡ください。迅速かつ適切に対応させていただきます。</p>
        <div className="w-full mt-8 flex justify-end">
          <Link href="/contact" className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            お問い合わせページへ
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;