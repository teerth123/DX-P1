import LLMLoading from "@/components/Loading";

export default function Learnings() {
  return (
    <>
      <div className="bg-black h-screen w-screen text-white flex justify-center pt-[50vh] gap-10">
        <div>
          <h1 className="text-2xl font-semibold">What I did?</h1>
          <h1 className="text-lg font-medium">
            1. Entire outline of the first screen (/app/page.tsx)
          </h1>
          <h1 className="text-lg font-medium">
            2. Entire outline of the second screen (/app/vercel/page.tsx)
          </h1>
          <h1 className="text-lg font-medium">
            3. Magnetic Buttons (/components/card.tsx)
          </h1>
        </div>
        <div>
          <h1 className="text-2xl font-semibold">What GPT did?</h1>
          <h1 className="text-lg font-medium">
            1. Squarish pattern and diagonal lines
          </h1>
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Me + GPT ? </h1>
          <h1 className="text-lg font-medium">1. Token-wise text generation</h1>
          <h1 className="text-lg font-medium">2. horizontal Scrolling</h1>
          <h1 className="text-lg font-medium">3. Loader Comp (v1 was entirely done by me, animations were added using v0)</h1>
        </div>
      </div>
      <div className="inset-0 flex items-center justify-center pointer-events-none">
        {/* <LLMLoading text="DexT" /> */}
      </div>
    </>
  );
}

// https://www.abilshr.com/ like layout
// comet like animation on the borders for loading screen (response from LLM)
