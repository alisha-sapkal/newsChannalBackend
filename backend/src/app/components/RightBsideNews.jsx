import "/assets/css/Home.scss";
import NewsBlock, { SkeletonNewsBlock } from "./NewsBlock";
export default function RightAsideNews({ latestNews }) {
  return (
    <aside className="left-aside">
      <div className="new-list-block">
        <div className="heading">Latest News</div>
        <div className="body">
          {latestNews.length === 0 &&
            Array(5)
              .fill(0)
              .map((_, i) => <SkeletonNewsBlock key={`n${i}`} />)}

          {latestNews.map((article, i) => (
            <>
              <NewsBlock news={article} key={`n${i}`} />
              <hr key={`n${i}`} />
            </>
          ))}
        </div>
      </div>
    </aside>
  );
}
