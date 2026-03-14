import { FaPhoneAlt } from "react-icons/fa";

export default function Contacts() {
  const people = [
    
    {
      name: "Mizanur Rahman",
      role: "Operator 2",
      phone: "01742734391",
      image: "/images/mizanur.png",
    }
  ];

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
        <FaPhoneAlt className="text-purple-600 text-xl mr-2" />
        Contact Numbers
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {people.map((person, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center text-center hover:shadow-lg transition"
          >
            <img
              src={person.image}
              alt={person.name}
              className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-purple-500"
            />
            <h3 className="text-lg font-semibold text-gray-800">
              {person.name}
            </h3>
            <p className="text-sm text-gray-500">{person.role}</p>
            <a
              href={`tel://${person.phone}`}
              target="_blank"
              className="mt-2 text-blue-600 font-medium hover:underline"
            >
              📞 {person.phone}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
