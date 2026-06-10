import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './community.module.css';

// 在线社区（Discord / Reddit）
const OnlineLinks = [
  {
    name: 'Discord',
    desc: '实时语音文字交流，开发与玩家都在',
    href: 'https://discord.gg/tUG9MFwCqf',
    emoji: '💬',
  },
  {
    name: 'Reddit',
    desc: 'r/CataclysmCB —— 发帖讨论、分享存档与反馈',
    href: 'https://www.reddit.com/r/CataclysmCB/',
    emoji: '🟠',
  },
];

// QQ 群（二维码 + 群号）
const QQGroups = [
  {
    name: '交流群',
    number: '552610319',
    img: 'img/qq/jiaoliu.jpg',
    desc: '玩家日常交流、提问、反馈',
  },
  {
    name: '开发贡献群',
    number: '252513599',
    img: 'img/qq/dev.jpg',
    desc: '代码、翻译、内容开发协作',
  },
  {
    name: 'CCB 不死人贡献群',
    number: '694984594',
    img: 'img/qq/tileset.jpg',
    desc: '贴图美术贡献与归置',
  },
];

function QQCard({name, number, img, desc}) {
  const src = useBaseUrl(img);
  return (
    <div className={clsx('col col--4', styles.qqCol)}>
      <div className={styles.qqCard}>
        <img className={styles.qrImage} src={src} alt={`${name} 二维码`} />
        <Heading as="h3" className={styles.qqName}>{name}</Heading>
        <p className={styles.qqNumber}>群号：{number}</p>
        <p className={styles.qqDesc}>{desc}</p>
      </div>
    </div>
  );
}

function OnlineCard({name, desc, href, emoji}) {
  return (
    <Link className={clsx('col col--6', styles.onlineCol)} to={href}>
      <div className={styles.onlineCard}>
        <span className={styles.onlineEmoji}>{emoji}</span>
        <div>
          <Heading as="h3" className={styles.onlineName}>{name}</Heading>
          <p className={styles.onlineDesc}>{desc}</p>
        </div>
      </div>
    </Link>
  );
}

export default function Community() {
  return (
    <Layout title="社区" description="加入 CCB 社区：Discord、Reddit、QQ 群">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <Heading as="h1" className="hero__title">加入社区</Heading>
          <p className="hero__subtitle">
            遇到问题、想贡献、或只是想聊聊 —— 这里都有人
          </p>
        </div>
      </header>

      <main className="container margin-vert--lg">
        <section className="margin-bottom--lg">
          <Heading as="h2">在线社区</Heading>
          <div className="row">
            {OnlineLinks.map((props, idx) => (
              <OnlineCard key={idx} {...props} />
            ))}
          </div>
        </section>

        <section>
          <Heading as="h2">QQ 群</Heading>
          <p>扫码加入，或搜索群号。不同方向有专门的群：</p>
          <div className="row">
            {QQGroups.map((props, idx) => (
              <QQCard key={idx} {...props} />
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
