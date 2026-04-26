export default function RootLoading() {
  return (
    <div className="flex items-center justify-center h-full min-h-[300px]">
      <div
        className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: "#ebebeb", borderTopColor: "#111" }}
      />
    </div>
  );
}
