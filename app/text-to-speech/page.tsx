const TextToSpeechPage = () => {
  return (
    <div className="bg-[#fdfcff]">
      <div className="container mx-auto px-4">
        <section>
          <div className="grid grid-cols-2 space-x-6">
            <div className="col-span-1">
              <h2 className="">Text to Speech</h2>
              <h1 className="text-2xl font-bold mb-4">
                ỨNG DỤNG AI CHUYỂN VĂN BẢN THÀNH GIỌNG NÓI TỰ NHIÊN
              </h1>
              <p>
                Biến từng dòng chữ thành âm thanh sống động với giọng đọc AI đầy
                cảm xúc. LipVoice giúp bạn kể chuyện, chia sẻ kiến thức và
                truyền tải thông điệp một cách chân thực hơn bao giờ hết.
              </p>

              <div className="flex flex-col">
                <div className=""></div>
              </div>
            </div>
            <div className="col-span-1">
              <h1 className="text-2xl font-bold mb-4">Speech to Text</h1>
              <div className="flex flex-col">
                <label htmlFor="speech-input" className="mb-2">
                  Enter Speech:
                </label>
                <input id="speech-input" className="border p-2 rounded mb-4" />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Convert to Text
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TextToSpeechPage;
