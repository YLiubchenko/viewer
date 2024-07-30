import styles from "./page.module.css";
import {MainContent} from "@/conponents/MainContent/MainContent";


export default function Home() {
  return (
    <main className={styles.main}>
      <MainContent />
    </main>
  );
}
