import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '新人教程',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: '第一次玩 CCB？从下载安装到活过第一天，一步步带你上手生存。',
  },
  {
    title: '开发者教程',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: '想参与开发或制作模组？了解如何从源码编译，以及向 CCB 提交贡献的流程。',
  },
  {
    title: '贡献指南',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: '代码、贴图、翻译、内容 —— 不管会不会写代码，都有适合你的参与方式。',
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
