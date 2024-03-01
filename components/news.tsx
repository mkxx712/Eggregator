import { ScrollArea } from "@/components/ui/scroll-area"
import { Interface } from "readline";

const news_api = process.env.NEWS_API;

interface NewsType {
  title: string
  domain: string
  published_at: string
  url: string
  news: object
  index: number
  time: string
}

export async function News() {
      const response = await fetch('https://cryptopanic.com/api/v1/posts/?auth_token=' + news_api);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const idata = data["results"].slice(0,10);
        const tc: NewsType[] = idata.map((item: NewsType) => ({
          title: item.title,
          domain: item.domain,
          time: item.published_at,
          url: item.url,
        }));
        // console.log(tc);
    return (
        <ScrollArea className="h-[350px] rounded-md border p-2">
        {tc.map((news:NewsType, index:number) => (
        <div key={index}>
          <p className="text-xs font-semibold mb-1"><a href = {news.url}>{news.title}</a></p>
          <p className="text-xs text-gray-600 mb-2">{news.domain} {news.time}</p>
          <hr></hr>
        </div>
      ))}
        </ScrollArea> 
    );
  }
