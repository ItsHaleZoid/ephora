import FeedElements from "@/components/FeedHome";
import Sidebar from "@/components/Sidebar";

export default function FeedPage() {
  return (
    <div className="flex w-full">
      <div className="sticky top-0 h-screen -mr-70">
        <Sidebar />
      </div>
      <div className="flex-1">
        <FeedElements />
      </div>
    </div>
  );
}