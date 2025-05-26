import NewsBlock, { SkeletonNewsBlock } from "./NewsBlock";
import "../../../assets/css/Home.scss";

export default function LeftAsideNews({ trendingNews }) {
  return (
    <aside className="left-aside">
      <div className="new-list-block">
        <div className="heading">Trending News</div>
        <div className="body">
          {trendingNews.length === 0 &&
            Array(5)
              .fill(0)
              .map((_, i) => <SkeletonNewsBlock key={`n${i}`} />)}
          {trendingNews.map((article, i) => (
            <>
              <NewsBlock news={article} key={`n${i}`} showImage={false} />
              <hr key={`h${i}`} />
            </>
          ))}
        </div>
      </div>
    </aside>
  );
}
