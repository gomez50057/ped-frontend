import styles from './TypeformEmbedPage.module.css';

export default function Page() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.iframeContainer}>
        <iframe
          className={styles.iframe}
          src="https://rbs8k6pucna.typeform.com/to/k8doyust?typeform-source=www.google.com"
          title="Typeform"
          width="100%"
          height="600"
          frameBorder="0"
          allow="fullscreen"
        ></iframe>
      </div>
    </div>
  );
}
