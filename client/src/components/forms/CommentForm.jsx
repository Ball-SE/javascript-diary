import { AlertDialog } from "../alert/AlertDialog";

export function CommentForm() {
    const handleSend = () => {
        console.log("Send");
    }
  return (
    <div>
      <h3 className="text-lg font-semibold text-[#26231E] mb-4">Comments</h3>
      <textarea
        placeholder="What are your thoughts?"
        className="w-full text-base p-4 font-medium border border-[#DAD6D1] bg-[#FFFFFF] rounded-lg resize-none min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#26231E] focus:border-transparent"
        rows="4"
      />
      <div className="flex justify-end">
        <AlertDialog
        trigger ={
        <button className="bg-[#26231E] text-white text-base font-medium px-6 py-2 rounded-full hover:bg-[#1a1a1a] transition-colors"
        onClick={handleSend}
        >
          Send
        </button>
        }
        />
      </div>
    </div>
  );
}
