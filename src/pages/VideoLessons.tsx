import { useState } from "react";

const subjects = ["მათემატიკა", "ქართული", "ისტორია"] as const;
// ჯიპიტის ნაყლევები
type Subject = (typeof subjects)[number];
// ?????/
const videoLessons = [
  {
    id: 1,
    subject: "მათემატიკა",
    title: "მათემატიკა - გაკვეთილი 1",
    description: "საბაზისო მათემატიკის შესავალი თემები.",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 2,
    subject: "ქართული",
    title: "ქართული - გრამატიკა N1",
    description: "ქართული გრამატიკის საფუძვლები.",
    thumbnail: "https://img.youtube.com/vi/3tmd-ClpJxA/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=3tmd-ClpJxA",
  },
  {
    id: 3,
    subject: "ისტორია",
    title: "ისტორია - უძველესი ცივილიზაციები",
    description: "ძველი მსოფლიოს ისტორია და მისი გავლენა.",
    thumbnail: "https://img.youtube.com/vi/2Z4m4lnjxkY/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=2Z4m4lnjxkY",
  },
  {
    id: 4,
    subject: "მათემატიკა",
    title: "მათემატიკა - ფუნქციები და გრაფიკები",
    description: "ფუნქციების და გრაფიკების ანალიზი.",
    thumbnail: "https://img.youtube.com/vi/vx2u5uUu3DE/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=vx2u5uUu3DE",
  },
];

const VideoLessons = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject>("მათემატიკა");

  const filteredLessons = videoLessons.filter(
    (lesson) => lesson.subject === selectedSubject
  );
      {/* აიქონები ტექსტში როა ჩასმული თუ არ გეზარება ჩასვი წესიერად */}
      {/* აიქონები ტექსტში როა ჩასმული თუ არ გეზარება ჩასვი წესიერად */}
      {/* აიქონები ტექსტში როა ჩასმული თუ არ გეზარება ჩასვი წესიერად */}
      {/* აიქონები ტექსტში როა ჩასმული თუ არ გეზარება ჩასვი წესიერად */}
      {/* აიქონები ტექსტში როა ჩასმული თუ არ გეზარება ჩასვი წესიერად */}

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <h1 className="text-3xl font-bold text-dark-color mb-8">
        🎥 ვიდეო გაკვეთილები
      </h1>

      <div className="flex gap-4 mb-8">
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => setSelectedSubject(subject)}
            className={`px-4 py-2 rounded-xl font-medium transition shadow-sm ${
              selectedSubject === subject
                ? "bg-main-color text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            {subject}
          </button>
        ))}
      </div>

      {/* აიქონები ტექსტში როა ჩასმული თუ არ გეზარება ჩასვი წესიერად */}
      {/* აიქონები ტექსტში როა ჩასმული თუ არ გეზარება ჩასვი წესიერად */}
      {/* აიქონები ტექსტში როა ჩასმული თუ არ გეზარება ჩასვი წესიერად */}
      {/* აიქონები ტექსტში როა ჩასმული თუ არ გეზარება ჩასვი წესიერად */}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <a
            key={lesson.id}
            href={lesson.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={lesson.thumbnail}
                alt={lesson.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-white text-lg font-bold">
                  ▶️ ნახე ვიდეო
                </span>
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-dark-color mb-1">
                {lesson.title}
              </h2>
              <p className="text-sm text-gray-600">{lesson.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default VideoLessons;
